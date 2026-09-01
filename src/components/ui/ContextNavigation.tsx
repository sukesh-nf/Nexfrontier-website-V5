'use client';

import Link from 'next/link';
import { ChevronRight, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { Container, Section } from '@/components/ui/primitives';
import {
  intelligenceChildren,
  enterpriseValueChildren,
  teamSlugs,
} from '@/config/navigation';
import { teamMembers } from '@/data/content';
import { spokeArticles } from '@/data/spokes';

export interface Crumb {
  label: string;
  path?: string;
}

export interface SiblingLink {
  label: string;
  path: string;
}

export interface ContextNavConfig {
  crumbs: Crumb[];
  parent?: { label: string; path: string };
  prevSibling?: SiblingLink;
  nextSibling?: SiblingLink;
}

// ── Helpers ──

function getTeamMemberName(slug: string): string {
  const member = teamMembers.find((m) => m.slug === slug);
  return member ? member.name : slug;
}

function getSpokeTitle(slug: string): string {
  const article = spokeArticles.find((a) => a.slug === slug);
  return article ? article.question : slug;
}

function getIntelligenceSiblings(currentPath: string): { prev?: SiblingLink; next?: SiblingLink } {
  const children = intelligenceChildren.filter((c) => c.path !== '/intelligence');
  const idx = children.findIndex((c) => c.path === currentPath);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? { label: children[idx - 1].label, path: children[idx - 1].path } : undefined,
    next: idx < children.length - 1 ? { label: children[idx + 1].label, path: children[idx + 1].path } : undefined,
  };
}

function getEnterpriseValueSiblings(currentPath: string): { prev?: SiblingLink; next?: SiblingLink } {
  const children = enterpriseValueChildren.filter((c) => c.path !== '/enterprise-value');
  const idx = children.findIndex((c) => c.path === currentPath);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? { label: children[idx - 1].label, path: children[idx - 1].path } : undefined,
    next: idx < children.length - 1 ? { label: children[idx + 1].label, path: children[idx + 1].path } : undefined,
  };
}

function getAboutSiblings(currentSlug: string): { prev?: SiblingLink; next?: SiblingLink } {
  const idx = teamSlugs.indexOf(currentSlug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? { label: getTeamMemberName(teamSlugs[idx - 1]), path: `/about/${teamSlugs[idx - 1]}` } : undefined,
    next: idx < teamSlugs.length - 1 ? { label: getTeamMemberName(teamSlugs[idx + 1]), path: `/about/${teamSlugs[idx + 1]}` } : undefined,
  };
}

function getSpokeSiblings(currentSlug: string): { prev?: SiblingLink; next?: SiblingLink } {
  const slugs = spokeArticles.map((a) => a.slug);
  const idx = slugs.indexOf(currentSlug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? { label: getSpokeTitle(slugs[idx - 1]), path: `/reading-the-shift/${slugs[idx - 1]}` } : undefined,
    next: idx < slugs.length - 1 ? { label: getSpokeTitle(slugs[idx + 1]), path: `/reading-the-shift/${slugs[idx + 1]}` } : undefined,
  };
}

// ── Public API: derive config from a path ──

export function getContextNav(path: string): ContextNavConfig {
  // Intelligence children
  const intelChild = intelligenceChildren.find((c) => c.path === path && c.path !== '/intelligence');
  if (intelChild) {
    const { prev, next } = getIntelligenceSiblings(path);
    return {
      crumbs: [{ label: 'Home', path: '/' }, { label: 'Intelligence', path: '/intelligence' }, { label: intelChild.label }],
      parent: { label: 'Intelligence', path: '/intelligence' },
      prevSibling: prev,
      nextSibling: next,
    };
  }

  // Enterprise Value children
  const evChild = enterpriseValueChildren.find((c) => c.path === path && c.path !== '/enterprise-value');
  if (evChild) {
    const { prev, next } = getEnterpriseValueSiblings(path);
    return {
      crumbs: [{ label: 'Home', path: '/' }, { label: 'Enterprise Value', path: '/enterprise-value' }, { label: evChild.label }],
      parent: { label: 'Enterprise Value', path: '/enterprise-value' },
      prevSibling: prev,
      nextSibling: next,
    };
  }

  // About profile pages
  if (path.startsWith('/about/')) {
    const slug = path.replace('/about/', '');
    const name = getTeamMemberName(slug);
    const { prev, next } = getAboutSiblings(slug);
    return {
      crumbs: [{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }, { label: name }],
      parent: { label: 'About', path: '/about' },
      prevSibling: prev,
      nextSibling: next,
    };
  }

  // Reading The Shift article pages
  if (path.startsWith('/reading-the-shift/')) {
    const slug = path.replace('/reading-the-shift/', '');
    const title = getSpokeTitle(slug);
    const { prev, next } = getSpokeSiblings(slug);
    return {
      crumbs: [{ label: 'Home', path: '/' }, { label: 'Reading The Shift', path: '/reading-the-shift' }, { label: title }],
      parent: { label: 'Reading The Shift', path: '/reading-the-shift' },
      prevSibling: prev,
      nextSibling: next,
    };
  }

  // Top-level pages
  const topLevel: Record<string, { label: string; parentLabel?: string; parentPath?: string }> = {
    '/the-shift': { label: 'The Shift' },
    '/intelligence': { label: 'Intelligence' },
    '/enterprise-value': { label: 'Enterprise Value' },
    '/reading-the-shift': { label: 'Reading The Shift' },
    '/foundation-customers': { label: 'Foundation Customers' },
    '/about': { label: 'About' },
    '/investor-proof': { label: 'Investor' },
    '/market-enquiry': { label: 'Market Enquiry' },
  };

  const info = topLevel[path];
  if (info) {
    return {
      crumbs: [{ label: 'Home', path: '/' }, { label: info.label }],
    };
  }

  return { crumbs: [{ label: 'Home', path: '/' }] };
}

// ── Components ──

export function TopBreadcrumb({ path }: { path: string }) {
  const { crumbs } = getContextNav(path);
  return (
    <nav aria-label="Breadcrumb" className="nf-top-breadcrumb" style={{ marginBottom: 'var(--nf-space-5)' }}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>
        {crumbs.map((item, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {item.path && !isLast ? (
                <Link href={item.path} style={{ color: 'var(--nf-text-tertiary)', textDecoration: 'none', transition: 'color var(--nf-transition-fast)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--nf-cyan)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--nf-text-tertiary)'; }}
                >{item.label}</Link>
              ) : (
                <span style={{ color: isLast ? 'var(--nf-text-secondary)' : 'var(--nf-text-tertiary)', fontWeight: isLast ? 600 : 400 }} aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && <ChevronRight size={14} style={{ color: 'var(--nf-text-tertiary)', opacity: 0.5 }} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BottomContextNav({ path }: { path: string }) {
  const { parent, prevSibling, nextSibling } = getContextNav(path);

  return (
    <Section spacing="tight" style={{ borderTop: '1px solid var(--nf-border)' }}>
      <Container>
        <div className="nf-bottom-context-nav">
          {parent && (
            <Link href={parent.path} className="nf-ctx-nav-link nf-ctx-nav-parent"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 20px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                textDecoration: 'none', color: 'var(--nf-text-primary)',
                fontSize: '0.875rem', fontWeight: 600,
                transition: 'border-color var(--nf-transition-fast), background var(--nf-transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--nf-cyan)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--nf-border)'; }}
            >
              <ArrowLeft size={16} style={{ color: 'var(--nf-cyan)', flexShrink: 0 }} />
              <span>Back to {parent.label}</span>
            </Link>
          )}
          {prevSibling && (
            <Link href={prevSibling.path} className="nf-ctx-nav-link nf-ctx-nav-prev"
              style={{
                display: 'flex', flexDirection: 'column', gap: '4px',
                padding: '14px 20px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                textDecoration: 'none',
                transition: 'border-color var(--nf-transition-fast), background var(--nf-transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--nf-cyan)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--nf-border)'; }}
            >
              <span style={{ fontSize: '0.6875rem', color: 'var(--nf-text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={12} style={{ color: 'var(--nf-cyan)' }} /> Previous
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--nf-text-primary)', fontWeight: 500 }}>{prevSibling.label}</span>
            </Link>
          )}
          {nextSibling && (
            <Link href={nextSibling.path} className="nf-ctx-nav-link nf-ctx-nav-next"
              style={{
                display: 'flex', flexDirection: 'column', gap: '4px',
                padding: '14px 20px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                textDecoration: 'none', textAlign: 'right',
                transition: 'border-color var(--nf-transition-fast), background var(--nf-transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--nf-cyan)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--nf-border)'; }}
            >
              <span style={{ fontSize: '0.6875rem', color: 'var(--nf-text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                Next <ArrowRight size={12} style={{ color: 'var(--nf-cyan)' }} />
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--nf-text-primary)', fontWeight: 500 }}>{nextSibling.label}</span>
            </Link>
          )}
          <Link href="/" className="nf-ctx-nav-link nf-ctx-nav-home"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '14px 20px', background: 'var(--nf-bg-surface-2)',
              border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
              textDecoration: 'none', color: 'var(--nf-text-primary)',
              fontSize: '0.875rem', fontWeight: 600,
              transition: 'border-color var(--nf-transition-fast), background var(--nf-transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--nf-cyan)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--nf-border)'; }}
          >
            <Home size={16} style={{ color: 'var(--nf-cyan)', flexShrink: 0 }} />
            <span>Home</span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
