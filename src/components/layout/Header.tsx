'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { navGroups, topNavLinks, actionLinks, type NavGroup } from '@/config/navigation';

const logoDark = '/assets/logos/NF_Logo_Black_BG.png';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubPage, setMobileSubPage] = useState<NavGroup | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setMobileSubPage(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string): boolean => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 'var(--nf-z-header)' as unknown as number,
          background: 'var(--nf-bg-primary)',
          borderBottom: '1px solid var(--nf-border)',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: 'var(--nf-container-max)',
          margin: '0 auto',
          paddingInline: 'var(--nf-container-pad-x)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Link href="/" aria-label="NexFrontier home" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src={logoDark} alt="NexFrontier" style={{ width: '210px', height: 'auto', display: 'block' }} />
        </Link>

        <div className="nf-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: '22px' }}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {topNavLinks.map((link) => {
            const group = navGroups.find((g) => g.path === link.path);
            if (group) {
              return (
                <div
                  key={group.path}
                  className={`nf-nav-group${isActive(group.path) ? ' nf-nav-group--active' : ''}`}
                  onMouseEnter={() => setOpenDropdown(group.path)}
                >
                  <Link
                    href={group.path}
                    className="nf-nav-group-link"
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    className="nf-nav-group-toggle"
                    aria-label={`Open ${link.label} menu`}
                    aria-expanded={openDropdown === group.path}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === group.path ? null : group.path);
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                  {openDropdown === group.path && <DesktopDropdown group={group} />}
                </div>
              );
            }
            if (link.path === '/foundation-customers') {
              return (
                <Link key={link.path} href={link.path}
                  className={`nf-nav-cta-secondary${isActive(link.path) ? ' nf-nav-cta-secondary--active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link key={link.path} href={link.path}
                className={`nf-nav-link${isActive(link.path) ? ' nf-nav-link--active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

          <Link href="/investor-proof" style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '8px 15px', background: 'var(--nf-cyan)',
            border: '1px solid var(--nf-cyan)',
            borderRadius: 'var(--nf-radius-button)', color: '#041014',
            fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none',
            transition: 'background var(--nf-transition-fast)',
          }}>
            Investor <ArrowRight size={14} />
          </Link>
        </div>
        </div>

        <button
          className="nf-mobile-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => { setMobileOpen(!mobileOpen); setMobileSubPage(null); }}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--nf-text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {mobileOpen && (
        <MobileMenu mobileSubPage={mobileSubPage} setMobileSubPage={setMobileSubPage} isActive={isActive} />
      )}
    </>
  );
}

function DesktopDropdown({ group }: { group: NavGroup }) {
  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, minWidth: '320px',
      background: 'var(--nf-bg-secondary)', border: '1px solid var(--nf-border)',
      borderRadius: 'var(--nf-radius-control)', padding: '8px', zIndex: 200,
      boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
    }}>
      {group.children.map((child) => (
        <Link key={child.path} href={child.path} style={{
          display: 'flex', flexDirection: 'column', gap: '3px',
          padding: '10px 14px', borderRadius: 'var(--nf-radius-small)', textDecoration: 'none',
          transition: 'background var(--nf-transition-fast)',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--nf-bg-surface-1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={{ color: 'var(--nf-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>{child.label}</span>
          {child.description && <span style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem' }}>{child.description}</span>}
        </Link>
      ))}
    </div>
  );
}

function MobileMenu({ mobileSubPage, setMobileSubPage, isActive }: {
  mobileSubPage: NavGroup | null;
  setMobileSubPage: (g: NavGroup | null) => void;
  isActive: (path: string) => boolean;
}) {
  return (
    <div className="nf-mobile-menu" style={{
      position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
      background: 'var(--nf-bg-primary)', zIndex: 300, overflowY: 'auto',
      padding: '24px var(--nf-container-pad-x) 48px',
    }}>
      {mobileSubPage ? (
        <MobileSubPage group={mobileSubPage} onBack={() => setMobileSubPage(null)} />
      ) : (
        <>
          {topNavLinks.map((link) => {
            const group = navGroups.find((g) => g.path === link.path);
            if (group) {
              return (
                <div key={group.path} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '18px 0', borderBottom: '1px solid var(--nf-border)',
                }}>
                  <Link href={group.path} style={{
                    color: isActive(group.path) ? 'var(--nf-text-primary)' : 'var(--nf-text-secondary)',
                    fontSize: '1.0625rem', fontWeight: 500, textDecoration: 'none',
                  }}>
                    {link.label}
                  </Link>
                  <button onClick={() => setMobileSubPage(group)} aria-label={`Expand ${link.label} menu`} style={{
                    display: 'flex', alignItems: 'center', background: 'none', border: 'none',
                    color: 'var(--nf-text-secondary)', cursor: 'pointer', padding: '4px 0',
                  }}>
                    <ChevronDown size={18} style={{ transform: 'rotate(-90deg)', opacity: 0.5 }} />
                  </button>
                </div>
              );
            }
            if (link.path === '/foundation-customers') {
              return (
                <Link key={link.path} href={link.path}
                  className={`nf-nav-cta-secondary nf-nav-cta-secondary--mobile${isActive(link.path) ? ' nf-nav-cta-secondary--active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link key={link.path} href={link.path} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 0', borderBottom: '1px solid var(--nf-border)',
                color: isActive(link.path) ? 'var(--nf-text-primary)' : 'var(--nf-text-secondary)',
                fontSize: '1.0625rem', fontWeight: 500, textDecoration: 'none',
              }}>
                {link.label}
              </Link>
            );
          })}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            {actionLinks.map((link) => (
              <Link key={link.path} href={link.path} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '14px 18px', border: '1px solid var(--nf-border-strong)',
                borderRadius: 'var(--nf-radius-button)', color: 'var(--nf-text-primary)',
                fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none',
              }}>
                {link.label} <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileSubPage({ group, onBack }: { group: NavGroup; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'none', border: 'none', color: 'var(--nf-text-tertiary)',
        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', marginBottom: '24px', padding: 0,
      }}>
        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
        Main Menu
      </button>
      <div style={{
        fontSize: '0.75rem', fontWeight: 700, letterSpacing: 'var(--nf-eyebrow-spacing)',
        color: 'var(--nf-cyan)', marginBottom: '16px',
      }}>
        {group.label.toUpperCase()}
      </div>
      {group.children.map((child) => (
        <Link key={child.path} href={child.path} style={{
          display: 'flex', flexDirection: 'column', gap: '3px',
          padding: '16px 0', borderBottom: '1px solid var(--nf-border)', textDecoration: 'none',
        }}>
          <span style={{ color: 'var(--nf-text-primary)', fontSize: '1rem', fontWeight: 500 }}>{child.label}</span>
          {child.description && <span style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>{child.description}</span>}
        </Link>
      ))}
    </div>
  );
}
