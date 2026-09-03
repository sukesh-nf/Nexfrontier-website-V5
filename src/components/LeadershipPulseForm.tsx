'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { Button, TextLink } from '@/components/ui/Button';

const ALLOWED_SOURCES = [
  'email', 'linkedin', 'website_prompt', 'the_shift',
  'intelligence', 'about', 'direct', 'footer', 'market_signals',
  'enterprise_value', 'other',
];

const SCALE_LABELS: Record<number, string> = {
  1: 'Strongly disagree',
  2: 'Disagree',
  3: 'Choose a side',
  4: 'Agree',
  5: 'Strongly agree',
};

const REVENUE_OPTIONS = [
  { value: 'under_10m', label: 'Under US$10m' },
  { value: '10m_50m', label: 'US$10m–50m' },
  { value: '50m_250m', label: 'US$50m–250m' },
  { value: '250m_1b', label: 'US$250m–1bn' },
  { value: 'over_1b', label: 'Over US$1bn' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const ROLE_OPTIONS = [
  { value: 'ceo_md', label: 'CEO / Managing Director' },
  { value: 'founder_owner', label: 'Founder / Business Owner' },
  { value: 'board', label: 'Board Director / Chair' },
  { value: 'finance', label: 'CFO / Finance Leader' },
  { value: 'operations', label: 'COO / Operations Leader' },
  { value: 'strategy', label: 'Chief Strategy Officer / Strategy Leader' },
  { value: 'technology', label: 'CIO / CTO / CDO / Technology Leader' },
  { value: 'marketing_customer_commercial', label: 'CMO / Chief Customer Officer / Commercial Leader' },
  { value: 'gm_business_unit', label: 'General Manager / Business Unit Leader' },
  { value: 'transformation_innovation', label: 'Transformation / Innovation Leader' },
  { value: 'investor_portfolio', label: 'Investor / PE / Portfolio Leader' },
  { value: 'other_senior_leader', label: 'Other Senior Leader' },
  { value: 'advisor_consultant', label: 'Advisor / Consultant' },
  { value: 'other', label: 'Other' },
];

const QUESTIONS = [
  {
    key: 'q1_see',
    eyebrow: 'SEE',
    number: '01',
    text: 'As AI increasingly changes how markets operate, business leaders will need greater visibility into how and where the market around their enterprise is changing.',
  },
  {
    key: 'q2_understand',
    eyebrow: 'UNDERSTAND',
    number: '02',
    text: 'The rate of market change will increasingly exceed the rate at which many businesses can recognise, understand and adapt to it.',
  },
  {
    key: 'q3_navigate',
    eyebrow: 'NAVIGATE',
    number: '03',
    text: 'Business leaders will need better intelligence to distinguish economically meaningful market change from noise and know where to adapt, invest or hold course.',
  },
];

function PulseForm() {
  const searchParams = useSearchParams();
  const rawSource = searchParams.get('source') || 'direct';
  const source = ALLOWED_SOURCES.includes(rawSource) ? rawSource : 'other';

  const [scores, setScores] = useState<Record<string, number | null>>({
    q1_see: null,
    q2_understand: null,
    q3_navigate: null,
  });
  const [revenue, setRevenue] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const allAnswered =
    scores.q1_see !== null &&
    scores.q2_understand !== null &&
    scores.q3_navigate !== null &&
    revenue !== '' &&
    role !== '';

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allAnswered) {
      setError('Please answer all three questions and select your revenue band and role.');
      return;
    }

    setSubmitting(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/leadership-pulse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          q1_see: scores.q1_see,
          q2_understand: scores.q2_understand,
          q3_navigate: scores.q3_navigate,
          revenue_band: revenue,
          role_category: role,
          source,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'We couldn\'t submit your response. Please try again.');
      }
    } catch {
      setError('We couldn\'t submit your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="nf-pulse-success">
        <div className="nf-pulse-success-rule" />
        <div className="nf-pulse-success-eyebrow">THANK YOU</div>
        <h2 className="nf-pulse-success-heading">Your perspective matters.</h2>
        <p className="nf-pulse-success-body">
          We are testing these propositions against what business leaders actually believe, before treating them as fact.
        </p>
        <p className="nf-pulse-success-body">
          Your response contributes to that evidence.
        </p>
        <div className="nf-pulse-success-ctas">
          <Button to="/the-shift">Explore The Shift</Button>
          <TextLink to="/market-enquiry?topic=leadership-conversation">Talk to NexFrontier</TextLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="nf-pulse-form" noValidate>
      <div className="nf-pulse-card-grid">
        {QUESTIONS.map((q) => {
          const isAnswered = scores[q.key] !== null;
          return (
            <fieldset key={q.key} className={`nf-pulse-card nf-pulse-question-card ${isAnswered ? 'nf-pulse-question-card--answered' : ''}`}>
              <legend className="nf-pulse-card-legend">
                <span className="nf-pulse-card-eyebrow">{q.eyebrow}</span>
                <span className="nf-pulse-card-number">{q.number}</span>
                {isAnswered && (
                  <span className="nf-pulse-answered-badge" aria-label="Answered">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </legend>
              <p className="nf-pulse-card-text">{q.text}</p>
              <div className="nf-pulse-scale" role="radiogroup" aria-label={q.text}>
                {[1, 2, 3, 4, 5].map((value) => {
                  const id = `${q.key}-${value}`;
                  const isSelected = scores[q.key] === value;
                  const isDisabled = value === 3;
                  return (
                    <div key={value} className="nf-pulse-scale-item">
                      <input
                        type="radio"
                        id={id}
                        name={q.key}
                        value={value}
                        checked={isSelected}
                        onChange={() => handleScore(q.key, value)}
                        disabled={isDisabled}
                        tabIndex={isDisabled ? -1 : 0}
                        aria-disabled={isDisabled ? 'true' : undefined}
                        className="nf-pulse-radio"
                      />
                      <label
                        htmlFor={isDisabled ? undefined : id}
                        className={`nf-pulse-scale-label ${isSelected ? 'nf-pulse-scale-label--selected' : ''} ${isDisabled ? 'nf-pulse-scale-label--disabled' : ''}`}
                        aria-hidden={isDisabled ? 'true' : undefined}
                      >
                        <span className="nf-pulse-scale-number">{value}</span>
                        <span className="nf-pulse-scale-desc">{SCALE_LABELS[value]}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {/* Card 4 — Before you finish */}
        <fieldset className="nf-pulse-card nf-pulse-context-card">
          <div className="nf-pulse-context-card-accent" />
          <div className="nf-pulse-card-legend">
            <span className="nf-pulse-card-eyebrow">BEFORE YOU FINISH</span>
          </div>
          <p className="nf-pulse-context-helper">Help us understand whose perspective we are hearing.</p>

          <div className="nf-pulse-context-fields">
            <div className="nf-pulse-field">
              <label htmlFor="revenue" className="nf-pulse-field-label">
                Approximate annual company revenue <span className="nf-pulse-required">*</span>
              </label>
              <span className="nf-pulse-field-hint">USD equivalent</span>
              <select
                id="revenue"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="nf-pulse-select"
                required
              >
                <option value="">Select a range</option>
                {REVENUE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="nf-pulse-field">
              <label htmlFor="role" className="nf-pulse-field-label">
                Your role <span className="nf-pulse-required">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="nf-pulse-select"
                required
              >
                <option value="">Select your role</option>
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="nf-pulse-error" role="alert">{error}</p>
          )}

          <div className="nf-pulse-submit-area">
            <button
              type="submit"
              disabled={!allAnswered || submitting}
              className={`nf-pulse-submit ${allAnswered && !submitting ? 'nf-pulse-submit--enabled' : ''}`}
            >
              {submitting ? 'Submitting...' : 'Submit your view'}
              {!submitting && <ArrowRight size={17} />}
            </button>
            <p className="nf-pulse-privacy">
              Your responses will be used in aggregate to help NexFrontier understand how business leaders view the emerging AI-mediated market shift.
            </p>
            <p className="nf-pulse-privacy-secondary">
              No email address or company name is requested.
            </p>
          </div>
        </fieldset>
      </div>
    </form>
  );
}

export function LeadershipPulseForm() {
  return (
    <Suspense fallback={<div className="nf-pulse-loading">Loading survey...</div>}>
      <PulseForm />
    </Suspense>
  );
}
