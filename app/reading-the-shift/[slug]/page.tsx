import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Callout } from '@/components/ui/PageHero';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import {
  getArticleBySlug, getRelatedArticles, getGroupName, getAllSlugs,
} from '@/data/spokes';
import {
  articleJsonLd, breadcrumbJsonLd,
} from '@/services/structured-data';
import { notFound } from 'next/navigation';
import { SHOULD_INDEX, IS_PRODUCTION, PREVIEW_MODE } from '@/config/site';
import { getRouteStatus } from '@/config/navigation';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Question not found', robots: { index: false, follow: false } };

  // Unpublished content is not publicly accessible in production
  const isPreviewable = !IS_PRODUCTION || PREVIEW_MODE;
  if (article.status !== 'published' && !isPreviewable) {
    return { title: 'Question not found', robots: { index: false, follow: false } };
  }

  const path = `/reading-the-shift/${slug}`;
  const status = getRouteStatus(path);
  const isIndexable = SHOULD_INDEX && status === 'published' && article.status === 'published';
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical: article.canonicalPath },
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: article.socialTitle || article.question,
      description: article.metaDescription,
      url: article.canonicalPath,
    },
  };
}

export default async function SpokePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Publication gate: unpublished content returns 404 in production unless preview mode is enabled
  const isPreviewable = !IS_PRODUCTION || PREVIEW_MODE;
  if (article.status !== 'published' && !isPreviewable) {
    notFound();
  }

  const related = getRelatedArticles(article.id);
  const groupName = getGroupName(article.group);

  const jsonLd = [
    articleJsonLd({
      title: article.seoTitle, description: article.metaDescription,
      path: `/reading-the-shift/${article.slug}`, author: article.author,
      datePublished: article.publishedDate, dateModified: article.updatedDate,
    }),
    breadcrumbJsonLd([
      { name: 'Reading The Shift', path: '/reading-the-shift' },
      { name: groupName, path: `/reading-the-shift?group=${article.group}` },
      { name: article.question, path: `/reading-the-shift/${article.slug}` },
    ]),
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path={`/reading-the-shift/${slug}`} />
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
            <Eyebrow>{groupName.toUpperCase()}</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-6)',
            }}>{article.question}</h1>

            {article.title && (
              <p style={{
                fontSize: '1.25rem', color: 'var(--nf-text-tertiary)',
                fontStyle: 'italic', marginBottom: 'var(--nf-space-6)',
              }}>{article.title}</p>
            )}

            {/* Direct answer */}
            <div style={{
              borderLeft: '2px solid var(--nf-cyan)', paddingLeft: 'var(--nf-space-5)',
              margin: '0 0 var(--nf-space-8)',
            }}>
              {article.directAnswer.split('\n\n').map((para, i) => (
                <p key={i} style={{
                  fontSize: i === 0 ? '1.375rem' : 'var(--nf-text-body)',
                  lineHeight: i === 0 ? 1.45 : 'var(--nf-leading-body)',
                  color: 'var(--nf-text-primary)',
                  margin: i === 0 ? 0 : 'var(--nf-space-4) 0 0',
                }}>{para}</p>
              ))}
            </div>

            {/* Body sections */}
            {article.bodySections.map((section, i) => (
              <div key={i} style={{ marginBottom: 'var(--nf-space-7)' }}>
                {section.heading && (
                  <h2 style={{
                    fontSize: 'var(--nf-text-h3)', fontWeight: 600,
                    color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)',
                  }}>{section.heading}</h2>
                )}
                {section.body?.map((para, j) => (
                  <p key={j} style={{
                    fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
                    color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)',
                  }}>{para}</p>
                ))}
                {section.pullQuote && (
                  <p className="nf-pull" style={{ marginBottom: 'var(--nf-space-4)' }}>{section.pullQuote}</p>
                )}
                {section.list && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
                    {section.list.map((item, j) => (
                      <li key={j} style={{
                        padding: '5px 0', fontSize: 'var(--nf-text-body)',
                        color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.body2?.map((para, j) => (
                  <p key={`b2-${j}`} style={{
                    fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
                    color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)',
                  }}>{para}</p>
                ))}
                {section.ctaLabel && section.ctaLink && (
                  <div style={{ marginTop: 'var(--nf-space-4)' }}>
                    <Link href={section.ctaLink} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: 'var(--nf-cyan)', fontSize: '0.875rem', fontWeight: 600,
                      textDecoration: 'none',
                    }}>{section.ctaLabel} <ArrowRight size={15} /></Link>
                  </div>
                )}
              </div>
            ))}

            {/* NF Perspective */}
            {article.nfPerspective && (
              <div style={{ marginBottom: 'var(--nf-space-7)' }}>
                <Callout title="NF PERSPECTIVE">
                  <div>
                    {article.nfPerspective.split('\n\n').map((para, i) => (
                      <p key={i} style={{
                        fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
                        color: 'var(--nf-text-secondary)', margin: i === 0 ? 0 : 'var(--nf-space-3) 0 0',
                      }}>{para}</p>
                    ))}
                  </div>
                </Callout>
              </div>
            )}

            {/* Evidence sources */}
            {article.evidenceSources.length > 0 && (
              <div style={{ marginBottom: 'var(--nf-space-7)' }}>
                <Eyebrow>SOURCES / EVIDENCE</Eyebrow>
                <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--nf-space-4) 0 0' }}>
                  {article.evidenceSources.map((source, i) => (
                    <li key={i} style={{
                      padding: 'var(--nf-space-3) 0', borderBottom: '1px solid var(--nf-border)',
                      fontSize: '0.875rem', color: 'var(--nf-text-tertiary)',
                    }}>
                      <strong style={{ color: 'var(--nf-text-secondary)' }}>{source.sourceTitle}</strong>
                      {source.publisher && ` · ${source.publisher}`}
                      {source.author && ` · ${source.author}`}
                      {source.publicationDate && ` · ${source.publicationDate}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author and date */}
            <div style={{
              marginTop: 'var(--nf-space-8)', paddingTop: 'var(--nf-space-5)',
              borderTop: '1px solid var(--nf-border)',
              fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)',
            }}>
              {article.author}
              {article.publishedDate && ` · Published ${article.publishedDate}`}
              {article.updatedDate && ` · Updated ${article.updatedDate}`}
            </div>
          </div>
        </Container>
      </Section>

      {/* Related questions */}
      {related.length > 0 && (
        <Section spacing="tight">
          <Container>
            <Eyebrow>RELATED QUESTIONS</Eyebrow>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)',
              marginTop: 'var(--nf-space-5)',
            }}>
              {related.map((rel) => (
                <Link key={rel.id} href={`/reading-the-shift/${rel.slug}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 'var(--nf-space-3)', padding: 'var(--nf-space-4)',
                  background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)',
                  borderRadius: 'var(--nf-radius-control)', textDecoration: 'none',
                }}>
                  <span style={{
                    color: 'var(--nf-text-primary)', fontSize: '0.9375rem', fontWeight: 500,
                  }}>{rel.question}</span>
                  <ArrowRight size={16} style={{ color: 'var(--nf-cyan)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <BottomContextNav path={`/reading-the-shift/${slug}`} />
    </article>
  );
}

