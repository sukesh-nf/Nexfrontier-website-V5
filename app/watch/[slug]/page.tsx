import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { BackLink, Breadcrumb } from '@/components/ui/Button';
import { getVideoBySlug, getPublishedVideoSlugs } from '@/data/videos';
import { IS_PRODUCTION, PREVIEW_MODE } from '@/config/site';

export function generateStaticParams() {
  const slugs = getPublishedVideoSlugs();
  if (slugs.length > 0) {
    return slugs.map((slug) => ({ slug }));
  }
  return [{ slug: 'none' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return { title: 'Video not found', robots: { index: false, follow: false } };

  const isPreviewable = !IS_PRODUCTION || PREVIEW_MODE;
  if (video.status !== 'published' && !isPreviewable) {
    return { title: 'Video not found', robots: { index: false, follow: false } };
  }

  return pageMetadata({
    path: `/watch/${slug}`,
    title: video.seoTitle,
    description: video.metaDescription,
  });
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    return (
      <Section spacing="tight">
        <Container>
          <BackLink to="/reading-the-shift">Reading The Shift</BackLink>
          <Breadcrumb items={[{ label: 'Watch' }]} />
          <div style={{ maxWidth: 'var(--nf-reading-width)', paddingTop: 'var(--nf-space-6)' }}>
            <Eyebrow>WATCH</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
            }}>No videos published yet</h1>
            <p style={{
              fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)',
              color: 'var(--nf-text-secondary)',
            }}>
              Video content will appear here when published. Explore the written analysis on Reading The Shift.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  const isPreviewable = !IS_PRODUCTION || PREVIEW_MODE;
  if (video.status !== 'published' && !isPreviewable) {
    notFound();
  }

  return (
    <>
      <Section spacing="tight">
        <Container>
          <BackLink to="/reading-the-shift">Reading The Shift</BackLink>
          <Breadcrumb items={[{ label: 'Watch' }, { label: video.videoTitle }]} />
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
            <Eyebrow>WATCH</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
            }}>{video.videoTitle}</h1>
            <p style={{
              fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)',
              color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)',
            }}>{video.summary}</p>

            {/* YouTube embed */}
            {video.youtubeVideoId && (
              <div style={{
                position: 'relative', paddingBottom: '56.25%',
                height: 0, overflow: 'hidden', borderRadius: 'var(--nf-radius-panel)',
                marginBottom: 'var(--nf-space-6)',
              }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}`}
                  title={video.videoTitle}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 0,
                  }}
                />
              </div>
            )}

            {/* Description */}
            <p style={{
              fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
              color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)',
            }}>{video.description}</p>

            {/* Transcript or supporting content */}
            {video.transcriptOrArticle && video.transcriptOrArticle.length > 0 && (
              <div style={{ marginBottom: 'var(--nf-space-6)' }}>
                <Eyebrow>TRANSCRIPT / SUPPORTING CONTENT</Eyebrow>
                {video.transcriptOrArticle.map((para, i) => (
                  <p key={i} style={{
                    fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
                    color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)',
                  }}>{para}</p>
                ))}
              </div>
            )}

            {/* Presenter and date */}
            <div style={{
              paddingTop: 'var(--nf-space-5)', borderTop: '1px solid var(--nf-border)',
              fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)',
            }}>
              {video.presenter}
              {video.publishedDate && ` · ${video.publishedDate}`}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
