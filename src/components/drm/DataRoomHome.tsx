'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, Search, Home, LogOut, Lock, X, AlertCircle, RefreshCw } from 'lucide-react';

interface Investor {
  id: string;
  name: string;
  email: string;
  nda_signed: boolean;
  access_level: number;
}

interface RuntimeTopic {
  slug: string;
  title: string;
  question: string;
  searchable: boolean;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; topics: RuntimeTopic[] }
  | { status: 'auth-required' }
  | { status: 'nda-required' }
  | { status: 'access-suspended' }
  | { status: 'access-revoked' }
  | { status: 'unavailable' };

export function DataRoomHome({
  investor,
  onLogout,
}: {
  investor: Investor;
  onLogout: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });

  const fetchTopics = useCallback(async () => {
    setLoadState({ status: 'loading' });
    const token = sessionStorage.getItem('drm_session_token');
    if (!token || !SUPABASE_URL) {
      setLoadState({ status: 'auth-required' });
      return;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-content?action=list-topics`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        const code = (data as { code?: string }).code;
        if (code === 'AUTH_REQUIRED' || code === 'AUTH_EXPIRED') setLoadState({ status: 'auth-required' });
        else if (code === 'NDA_REQUIRED') setLoadState({ status: 'nda-required' });
        else if (code === 'ACCESS_SUSPENDED') setLoadState({ status: 'access-suspended' });
        else if (code === 'ACCESS_REVOKED') setLoadState({ status: 'access-revoked' });
        else setLoadState({ status: 'unavailable' });
        return;
      }
      const topics = (data as { topics?: RuntimeTopic[] }).topics;
      if (!topics) {
        setLoadState({ status: 'unavailable' });
        return;
      }
      setLoadState({ status: 'ready', topics });
    } catch {
      setLoadState({ status: 'unavailable' });
    }
  }, []);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const topics = loadState.status === 'ready' ? loadState.topics : [];
  const searchableTopics = topics.filter(t => t.searchable);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.question.toLowerCase().includes(q)
    );
  }, [searchQuery, searchableTopics]);

  const searchDisabled = loadState.status !== 'ready';

  // ---- Failure / auth states ----

  if (loadState.status === 'auth-required') {
    return <FailureScreen
      title="Authentication required"
      message="Your session has expired. Please sign in again."
      actionLabel="Sign In"
      onAction={() => { sessionStorage.removeItem('drm_session_token'); window.location.href = '/investor-data-room'; }}
      secondaryLabel="Sign Out"
      onSecondary={onLogout}
    />;
  }

  if (loadState.status === 'nda-required') {
    return <FailureScreen
      title="NDA required"
      message="You must accept the current NDA before accessing the Data Room."
      actionLabel="Accept NDA"
      onAction={() => { window.location.href = '/investor-data-room/nda'; }}
      secondaryLabel="Sign Out"
      onSecondary={onLogout}
    />;
  }

  if (loadState.status === 'access-suspended') {
    return <FailureScreen
      title="Access suspended"
      message="Your Data Room access has been suspended. Please contact NexFrontier for assistance."
      actionLabel="Sign Out"
      onAction={onLogout}
    />;
  }

  if (loadState.status === 'access-revoked') {
    return <FailureScreen
      title="Access revoked"
      message="Your Data Room access has been revoked. Please contact NexFrontier if you believe this is an error."
      actionLabel="Sign Out"
      onAction={onLogout}
    />;
  }

  if (loadState.status === 'unavailable') {
    return <FailureScreen
      title="Data Room temporarily unavailable"
      message="We couldn't securely load the current Data Room contents. Please try again."
      actionLabel="Try Again"
      onAction={fetchTopics}
      secondaryLabel="Sign Out"
      onSecondary={onLogout}
    />;
  }

  // ---- Ready / loading states ----

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Private header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--nf-bg-secondary)',
        borderBottom: '1px solid var(--nf-border)',
        padding: '0 var(--nf-space-5)',
      }}>
        <div style={{
          maxWidth: 'var(--nf-container-wide)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '60px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-3)' }}>
            <Lock size={18} color="var(--nf-cyan)" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontSize: '0.9375rem', fontWeight: 600,
                color: 'var(--nf-text-primary)', letterSpacing: '-0.02em',
              }}>NexFrontier</span>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: '999px',
                background: 'var(--nf-cyan-dim)', color: 'var(--nf-cyan)',
                border: '1px solid var(--nf-cyan-border)',
              }}>Investor Data Room</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-4)' }}>
            <button
              onClick={() => !searchDisabled && setSearchOpen(!searchOpen)}
              disabled={searchDisabled}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.8125rem',
                color: searchDisabled ? 'var(--nf-text-tertiary)' : 'var(--nf-text-tertiary)',
                background: 'none', border: 'none',
                cursor: searchDisabled ? 'not-allowed' : 'pointer',
                opacity: searchDisabled ? 0.4 : 1,
                transition: 'color var(--nf-transition-fast)',
              }}
              onMouseEnter={(e) => { if (!searchDisabled) e.currentTarget.style.color = 'var(--nf-cyan)'; }}
              onMouseLeave={(e) => { if (!searchDisabled) e.currentTarget.style.color = 'var(--nf-text-tertiary)'; }}>
              <Search size={16} /> <span className="nf-drm-search-label">Search</span>
            </button>
            <a href="/investor-data-room" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)',
              textDecoration: 'none',
              transition: 'color var(--nf-transition-fast)',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
              <Home size={14} /> <span className="nf-drm-home-label">Data Room Home</span>
            </a>
            <span style={{
              fontSize: '0.75rem', color: 'var(--nf-text-tertiary)',
            }} className="nf-drm-investor-name">{investor.name}</span>
            <button onClick={onLogout} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color var(--nf-transition-fast)',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-negative)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
              <LogOut size={14} /> <span className="nf-drm-signout-label">Sign Out</span>
            </button>
          </div>
        </div>
        {/* Search bar */}
        {searchOpen && !searchDisabled && (
          <div style={{
            maxWidth: 'var(--nf-container-wide)', margin: '0 auto',
            padding: '0 0 var(--nf-space-4)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px',
              background: 'var(--nf-bg-surface-1)',
              border: '1px solid var(--nf-border)',
              borderRadius: 'var(--nf-radius-control)',
            }}>
              <Search size={16} color="var(--nf-text-tertiary)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Data Room pages..."
                autoFocus
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'var(--nf-text-primary)', fontSize: '0.875rem',
                }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--nf-text-tertiary)',
              }}>
                <X size={16} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div style={{
                marginTop: '8px',
                background: 'var(--nf-bg-surface-1)',
                border: '1px solid var(--nf-border)',
                borderRadius: 'var(--nf-radius-control)',
                overflow: 'hidden',
              }}>
                {searchResults.map((result) => (
                  <a key={result.slug} href={`/investor-data-room/${result.slug}`} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--nf-border)',
                    textDecoration: 'none',
                    transition: 'background var(--nf-transition-fast)',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--nf-bg-surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '0.875rem', fontWeight: 500,
                        color: 'var(--nf-text-primary)', margin: 0,
                      }}>{result.title}</p>
                      <p style={{
                        fontSize: '0.75rem', color: 'var(--nf-text-tertiary)',
                        margin: '2px 0 0',
                      }}>{result.question}</p>
                    </div>
                    <ArrowRight size={14} color="var(--nf-cyan)" />
                  </a>
                ))}
              </div>
            )}
            {searchQuery.trim() && searchResults.length === 0 && (
              <p style={{
                padding: '12px 16px', fontSize: '0.8125rem',
                color: 'var(--nf-text-tertiary)',
              }}>No matching pages found.</p>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main style={{
        flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%',
        padding: 'var(--nf-space-8) var(--nf-space-5)',
      }}>
        {/* Hero */}
        <span style={{
          display: 'block', fontSize: '0.6875rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--nf-cyan)', marginBottom: 'var(--nf-space-4)',
        }}>Investor Data Room</span>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 600,
          color: 'var(--nf-text-primary)', letterSpacing: '-0.02em',
          lineHeight: 1.25, margin: '0 0 var(--nf-space-5)',
        }}>The evidence behind the investment case.</h1>
        <p style={{
          fontSize: '1.0625rem', lineHeight: 1.55,
          color: 'var(--nf-text-secondary)', maxWidth: '720px',
          margin: '0 0 var(--nf-space-5)',
        }}>
          This private area brings together NexFrontier&rsquo;s current evidence, assumptions, economics, proof pathway and investor diligence material.
        </p>

        {/* Stage line */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px',
          background: 'var(--nf-bg-surface-1)',
          border: '1px solid var(--nf-border)',
          borderRadius: '999px',
          marginBottom: 'var(--nf-space-6)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--nf-cyan)',
          }} />
          <span style={{
            fontSize: '0.8125rem', fontWeight: 500, color: 'var(--nf-text-secondary)',
          }}>Current stage: Proof stage &middot; MVP build &middot; Foundation Customer validation next</span>
        </div>

        {/* Evidence-state principle */}
        <p style={{
          fontSize: '0.875rem', lineHeight: 1.5,
          color: 'var(--nf-text-tertiary)', maxWidth: '680px',
          margin: '0 0 var(--nf-space-8)',
          borderLeft: '2px solid var(--nf-cyan)', paddingLeft: '14px',
        }}>
          NexFrontier distinguishes thesis, evidence, customer validation, paid validation and repeatable proof throughout this Data Room.
        </p>

        {/* Topic grid */}
        {loadState.status === 'loading' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
            <RefreshCw size={16} className="nf-drm-spin" />
            Loading Data Room contents...
          </div>
        ) : topics.length === 0 ? (
          <div style={{
            padding: 'var(--nf-space-7)',
            background: 'var(--nf-bg-surface-1)',
            border: '1px solid var(--nf-border)',
            borderRadius: 'var(--nf-radius-panel)',
            textAlign: 'center',
            maxWidth: '480px',
          }}>
            <Lock size={28} color="var(--nf-text-tertiary)" style={{ margin: '0 auto var(--nf-space-4)' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--nf-text-secondary)', margin: '0 0 var(--nf-space-2)' }}>Investor material is being prepared</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', margin: 0 }}>Approved Data Room material will appear here when published.</p>
          </div>
        ) : (
          <div className="nf-drm-topic-grid">
            {topics.map((topic) => (
              <a key={topic.slug} href={`/investor-data-room/${topic.slug}`} className="nf-drm-topic-card">
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'block', fontSize: '0.6875rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--nf-cyan)', marginBottom: '8px',
                  }}>{topic.title}</span>
                  <p style={{
                    fontSize: '0.875rem', lineHeight: 1.5,
                    color: 'var(--nf-text-secondary)', margin: 0,
                  }}>{topic.question}</p>
                </div>
                <ArrowRight size={16} color="var(--nf-text-tertiary)" style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .nf-drm-topic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 12px;
        }
        .nf-drm-topic-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: var(--nf-bg-surface-1);
          border: 1px solid var(--nf-border);
          border-radius: var(--nf-radius-panel);
          text-decoration: none;
          transition: border-color var(--nf-transition-fast), background var(--nf-transition-fast);
        }
        .nf-drm-topic-card:hover {
          border-color: var(--nf-cyan-border);
          background: var(--nf-bg-surface-2);
        }
        .nf-drm-topic-card:hover svg {
          color: var(--nf-cyan);
        }
        @keyframes nf-drm-spin { to { transform: rotate(360deg); } }
        .nf-drm-spin { animation: nf-drm-spin 0.8s linear infinite; }
        @media (max-width: 768px) {
          .nf-drm-topic-grid {
            grid-template-columns: 1fr;
          }
          .nf-drm-search-label, .nf-drm-home-label, .nf-drm-investor-name {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .nf-drm-signout-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Failure Screen
// ============================================================
function FailureScreen({
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-6)' }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248, 113, 113, 0.2)', marginBottom: 'var(--nf-space-5)' }}>
          <AlertCircle size={24} color="var(--nf-negative)" />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--nf-space-3)' }}>{title}</h1>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>{message}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <button onClick={onAction} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', borderRadius: 'var(--nf-radius-button)',
            background: 'var(--nf-cyan)', color: '#041014',
            fontSize: '0.8125rem', fontWeight: 700, border: 'none',
            cursor: 'pointer', transition: 'transform var(--nf-transition-base)',
          }}>
            <RefreshCw size={14} /> {actionLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button onClick={onSecondary} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color var(--nf-transition-fast)',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-negative)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
              <LogOut size={14} /> {secondaryLabel}
            </button>
          )}
        </div>
        <div style={{ marginTop: 'var(--nf-space-6)' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', textDecoration: 'none', transition: 'color var(--nf-transition-fast)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
            <Home size={14} /> Back to NexFrontier
          </a>
        </div>
      </div>
    </div>
  );
}
