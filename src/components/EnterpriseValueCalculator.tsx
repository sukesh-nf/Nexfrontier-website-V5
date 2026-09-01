'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  safeNumber, positiveNumber, formatValue, formatPercent, formatPP,
  businessNumber, calculatePool, calculateValues,
  emptyBusinessInputs, defaultAssumptions,
  type BusinessInputs, type Assumptions, type ValueResults,
} from '@/lib/calculator';
import { trackEvent } from '@/services/analytics';
import { ArrowRight, ArrowLeft, Check, RotateCcw, Download, FileText, ChevronDown, Compass } from 'lucide-react';

type Stage = 1 | 2 | 3 | 4;

const stageLabels = ['Your Business', 'Quiet Loss™', 'Adaptive Value™', 'Enterprise Value'];

const assumptionRows = [
  { key: 'revenue' as const, label: 'Revenue', base: 'R', formula: 'R × %' },
  { key: 'cost' as const, label: 'Cost', base: 'OC', formula: 'OC × %' },
  { key: 'capacity' as const, label: 'Capacity', base: 'PC', formula: 'PC × %' },
  { key: 'customer' as const, label: 'Customer Value', base: 'Pool', formula: 'Pool × %' },
  { key: 'capability' as const, label: 'Enterprise Capability', base: 'R', formula: 'R × pp' },
];

const vtfLenses = [
  { name: 'Defensive Value', desc: 'Protecting existing revenue and customer relationships from erosion.' },
  { name: 'Offensive Value', desc: 'Capturing new opportunity created by changing market conditions.' },
  { name: 'Revenue Health', desc: 'Whether revenue quality, mix and pipeline are improving or deteriorating.' },
  { name: 'Customer Lifetime Value', desc: 'How changing customer intent and expectations affect long-term value.' },
  { name: 'Enterprise Capability', desc: 'Whether the organisation can adapt fast enough to capture what is possible.' },
];

export function EnterpriseValueCalculator() {
  const [stage, setStage] = useState<Stage>(1);
  const [inputs, setInputs] = useState<BusinessInputs>(emptyBusinessInputs);
  const [qlAssumptions, setQlAssumptions] = useState<Assumptions>(defaultAssumptions);
  const [avAssumptions, setAvAssumptions] = useState<Assumptions>(defaultAssumptions);
  const [overlap, setOverlap] = useState(20);
  const [realisation, setRealisation] = useState(70);
  const [costToRealise, setCostToRealise] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem('nf-enterprise-value-calculator');
    if (saved) {
      const state = JSON.parse(saved) as { stage: Stage; inputs: BusinessInputs; qlAssumptions: Assumptions; avAssumptions: Assumptions; overlap: number; realisation: number; costToRealise: string };
      setStage(state.stage); setInputs(state.inputs); setQlAssumptions(state.qlAssumptions); setAvAssumptions(state.avAssumptions); setOverlap(state.overlap); setRealisation(state.realisation); setCostToRealise(state.costToRealise);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.sessionStorage.setItem('nf-enterprise-value-calculator', JSON.stringify({ stage, inputs, qlAssumptions, avAssumptions, overlap, realisation, costToRealise }));
  }, [hydrated, stage, inputs, qlAssumptions, avAssumptions, overlap, realisation, costToRealise]);

  const goToStage = (s: Stage) => {
    setStage(s);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const resetToDefaults = () => {
    setInputs(emptyBusinessInputs);
    setQlAssumptions(defaultAssumptions);
    setAvAssumptions(defaultAssumptions);
    setOverlap(20);
    setRealisation(70);
    setCostToRealise('');
    setStage(1);
    setShowResetConfirm(false);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const pool = useMemo(() => calculatePool(inputs), [inputs]);
  const ebitdaMargin = useMemo(() => {
    const r = safeNumber(inputs.revenue);
    const e = safeNumber(inputs.ebitda);
    if (r === null || r === 0) return null;
    if (e === null) return null;
    return (e / r) * 100;
  }, [inputs]);

  const qlResults = useMemo(() => calculateValues(inputs, qlAssumptions, pool), [inputs, qlAssumptions, pool]);
  const avResults = useMemo(() => calculateValues(inputs, avAssumptions, pool), [inputs, avAssumptions, pool]);

  const gvo = qlResults.gross + avResults.gross;
  const overlapValue = gvo * (overlap / 100);
  const adjustedOpportunity = gvo * (1 - overlap / 100);
  const expectedRealisable = adjustedOpportunity * (realisation / 100);
  const riskAllowance = adjustedOpportunity * (1 - realisation / 100);
  const costValue = Math.max(0, safeNumber(costToRealise) ?? 0);
  const evDelta = expectedRealisable - costValue;
  const neutralThreshold = businessNumber(inputs, 'revenue') * 0.0025;

  const scenarioStatus: 'above' | 'below' | 'neutral' =
    evDelta > neutralThreshold ? 'above' : evDelta < -neutralThreshold ? 'below' : 'neutral';

  const step1Valid = useMemo(() => {
    const rev = safeNumber(inputs.revenue);
    return positiveNumber(inputs.lifetime) !== null && rev !== null && rev >= 0;
  }, [inputs]);

  return (
    <div ref={topRef}>
      {/* Progress + utility bar */}
      <div className="nf-calc-progress-shell">
        <ProgressIndicator stage={stage} maxReachedStage={Math.max(stage, step1Valid ? 1 : 0)} onStepClick={(s) => { if (s <= stage) goToStage(s); }} />
        <button type="button" className="nf-calc-reset-btn" onClick={() => setShowResetConfirm(true)}>
          <RotateCcw size={16} /> Reset to Defaults
        </button>
      </div>

      {showResetConfirm && (
        <div className="nf-calc-reset-confirm">
          <p>Reset all inputs and assumptions to defaults? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 'var(--nf-space-3)' }}>
            <button type="button" className="nf-cta nf-cta-secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button>
            <button type="button" className="nf-cta nf-cta-primary" onClick={resetToDefaults}>Yes, Reset</button>
          </div>
        </div>
      )}

      {/* Stage 1: Your Business */}
      {stage === 1 && (
        <StageWrapper heading="Your Business" question="What does the business look like today?" supporting="Use annual figures wherever requested. These numbers create the reference point for the scenario.">
          <div className="nf-calc-step1-grid">
            <div className="nf-calc-step1-col">
              <NumberInput label="01 Annual Revenue" variable="R" value={inputs.revenue} onChange={(v) => setInputs({ ...inputs, revenue: v })} />
              <NumberInput label="02 Annual Non-People Operating Cost" variable="OC" hint="Examples may include facilities, systems, suppliers and other non-people operating costs." value={inputs.nonPeopleCost} onChange={(v) => setInputs({ ...inputs, nonPeopleCost: v })} />
              <NumberInput label="03 Annual People / Capacity Cost" variable="PC" hint="Annual people and capacity-related cost." value={inputs.peopleCost} onChange={(v) => setInputs({ ...inputs, peopleCost: v })} />
              <NumberInput label="04 Annual EBITDA" variable="E" hint="May be negative." allowNegative value={inputs.ebitda} onChange={(v) => setInputs({ ...inputs, ebitda: v })} />
            </div>
            <div className="nf-calc-step1-col">
              <NumberInput label="05 Active Customers" variable="A" value={inputs.customers} onChange={(v) => setInputs({ ...inputs, customers: v })} />
              <NumberInput label="06 Average Customer Lifetime Value" variable="LTV" value={inputs.ltv} onChange={(v) => setInputs({ ...inputs, ltv: v })} />
              <NumberInput label="07 Average Customer Lifetime" variable="T" hint="Years. Must be greater than zero." value={inputs.lifetime} onChange={(v) => setInputs({ ...inputs, lifetime: v })} error={inputs.lifetime !== '' && positiveNumber(inputs.lifetime) === null ? 'Lifetime must be greater than zero.' : undefined} />
            </div>
          </div>
          <DerivedValues ebitdaMargin={ebitdaMargin} customerPool={pool} />
          <StageNav
            onNext={() => { if (step1Valid) { goToStage(2); trackEvent('calculator_stage_completion', { stage: 1 }); } }}
            nextLabel="Continue to Quiet Loss™"
            nextDisabled={!step1Valid}
          />
        </StageWrapper>
      )}

      {/* Stage 2: Quiet Loss */}
      {stage === 2 && (
        <QuietLossStage
          qlAssumptions={qlAssumptions}
          qlResults={qlResults}
          inputs={inputs}
          pool={pool}
          onChange={setQlAssumptions}
          onBack={() => goToStage(1)}
          onNext={() => { goToStage(3); trackEvent('calculator_stage_completion', { stage: 2 }); }}
        />
      )}

      {/* Stage 3: Adaptive Value */}
      {stage === 3 && (
        <AdaptiveValueStage
          avAssumptions={avAssumptions}
          avResults={avResults}
          onChange={setAvAssumptions}
          onBack={() => goToStage(2)}
          onNext={() => { goToStage(4); trackEvent('calculator_stage_completion', { stage: 3 }); }}
        />
      )}

      {/* Stage 4: Enterprise Value */}
      {stage === 4 && (
        <EnterpriseValueStage
          qlResults={qlResults}
          avResults={avResults}
          gvo={gvo}
          overlap={overlap}
          overlapValue={overlapValue}
          adjustedOpportunity={adjustedOpportunity}
          realisation={realisation}
          expectedRealisable={expectedRealisable}
          riskAllowance={riskAllowance}
          costToRealise={costToRealise}
          costValue={costValue}
          evDelta={evDelta}
          scenarioStatus={scenarioStatus}
          inputs={inputs}
          qlAssumptions={qlAssumptions}
          avAssumptions={avAssumptions}
          pool={pool}
          ebitdaMargin={ebitdaMargin}
          onOverlapChange={setOverlap}
          onRealisationChange={setRealisation}
          onCostToRealiseChange={setCostToRealise}
          onBack={() => goToStage(3)}
          onReviewInputs={() => goToStage(1)}
        />
      )}
    </div>
  );
}

function ProgressIndicator({ stage, onStepClick }: { stage: Stage; maxReachedStage: number; onStepClick: (s: Stage) => void }) {
  return (
    <div className="nf-calc-progress">
      {stageLabels.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === stage;
        const isComplete = stepNum < stage;
        const isClickable = stepNum < stage;
        return (
          <div key={i} className={`nf-calc-progress-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''} ${!isActive && !isComplete ? 'upcoming' : ''}`}>
            <button
              type="button"
              className="nf-calc-progress-circle"
              onClick={() => isClickable && onStepClick(stepNum as Stage)}
              disabled={!isClickable}
              aria-label={`Step ${stepNum}: ${label}`}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              {isComplete ? <Check size={20} /> : `0${stepNum}`}
            </button>
            <span className="nf-calc-progress-label">{label}</span>
            {i < 3 && <div className="nf-calc-progress-connector" />}
          </div>
        );
      })}
    </div>
  );
}

function StageWrapper({ heading, question, supporting, eyebrow, children }: {
  heading: string; question?: string; supporting?: string; eyebrow?: string; children: React.ReactNode;
}) {
  return (
    <div>
      {eyebrow && <div className="nf-calc-stage-eyebrow">{eyebrow}</div>}
      <h2 className="nf-calc-stage-heading">{heading}</h2>
      {question && <p className="nf-calc-stage-question">{question}</p>}
      {supporting && <p className="nf-calc-stage-supporting">{supporting}</p>}
      {children}
    </div>
  );
}

function NumberInput({ label, variable, value, onChange, hint, allowNegative, error, hideLabel }: {
  label: string; variable: string; value: string; onChange: (v: string) => void;
  hint?: string; allowNegative?: boolean; error?: string; hideLabel?: boolean;
}) {
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '') { onChange(''); return; }
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    if (!allowNegative && n < 0) return;
    onChange(v);
  };
  return (
    <div>
      {!hideLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: 'var(--nf-text-body)', fontWeight: 600, color: 'var(--nf-text-primary)' }}>{label}</span>
          {variable && <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>({variable})</span>}
        </div>
      )}
      <input
        type="number"
        value={value}
        onChange={handle}
        placeholder="0"
        className="nf-calc-input"
        style={{
          width: '100%', padding: '12px 16px', background: 'var(--nf-bg-inset)',
          border: `1px solid ${error ? 'var(--nf-negative)' : 'var(--nf-border)'}`,
          borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)',
          fontSize: '0.9375rem', outline: 'none',
        }}
      />
      {hint && <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', marginTop: '6px' }}>{hint}</p>}
      {error && <p style={{ fontSize: '0.8125rem', color: 'var(--nf-negative)', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}

function DerivedValues({ ebitdaMargin, customerPool }: { ebitdaMargin: number | null; customerPool: number | null }) {
  return (
    <div className="nf-calc-derived">
      <div>
        <div className="nf-calc-derived-label">EBITDA Margin</div>
        <div className="nf-calc-derived-value">
          {ebitdaMargin === null ? 'N/A' : `${ebitdaMargin.toFixed(1)}%`}
        </div>
      </div>
      <div>
        <div className="nf-calc-derived-label">Annualised Customer Value Pool</div>
        <div className="nf-calc-derived-value">
          {formatValue(customerPool)}
        </div>
        <div className="nf-calc-derived-note">
          Used only as an annual Customer Value reference. Not claimed revenue.
        </div>
      </div>
    </div>
  );
}

const qlDimensionExplanations: Record<string, string> = {
  revenue: 'What share of current annual revenue might reasonably represent value that could have been captured from opportunity already available?',
  cost: 'What share of annual non-people operating cost might reasonably be avoidable, reducible or better deployed?',
  capacity: 'What share of annual people and capacity cost might reasonably represent underused or poorly deployed capacity?',
  customer: 'What share of today\u2019s customer value pool might reasonably represent value already available but not fully captured across the customer base?',
  capability: 'What share of current annual revenue might reasonably reflect value that stronger enterprise capability could already have protected or captured?',
};

function QuietLossStage({
  qlAssumptions, qlResults, inputs, pool, onChange, onBack, onNext,
}: {
  qlAssumptions: Assumptions;
  qlResults: ValueResults;
  inputs: BusinessInputs;
  pool: number | null;
  onChange: (a: Assumptions) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="nf-calc-stage-eyebrow">02 QUIET LOSS™</div>
      <h2 className="nf-calc-stage-heading">What value might already be going unrealised?</h2>

      <div className="nf-ql-orientation">
        <p className="nf-ql-orientation-lead">
          You are now exploring how much value may already be available to the business but not fully captured.
        </p>
        <p className="nf-ql-orientation-body">
          You are not being asked to predict the future. You are applying your own scenario assumptions to the five Enterprise Value dimensions, your judgement about how much value may already exist within today's opportunity. These are your assumptions, not NexFrontier benchmarks.
        </p>
      </div>

      <div className="nf-calc-stage-result nf-calc-stage-result-ql nf-ql-summary">
        <div className="nf-calc-stage-result-label">Illustrative Quiet Loss™</div>
        <div className="nf-calc-stage-result-value">{formatValue(qlResults.gross)}</div>
        <div className="nf-calc-stage-result-sub">Gross annual scenario</div>
        <div className="nf-calc-stage-result-note">
          This is the value your assumptions suggest may already exist within today's opportunity but may not be fully captured.
        </div>
        <div className="nf-calc-stage-result-warning">This is not confirmed loss.</div>
      </div>

      <div className="nf-ql-dimensions">
        {assumptionRows.map((row, i) => (
          <QuietLossDimension
            key={row.key}
            index={i + 1}
            row={row}
            value={qlAssumptions[row.key]}
            dollarValue={qlResults[row.key]}
            onChange={(v) => onChange({ ...qlAssumptions, [row.key]: v })}
          />
        ))}
      </div>

      <div className="nf-ql-why-matters">
        <div className="nf-ql-why-matters-label">Why this matters</div>
        <p>
          A business can be performing well and still capture less value than the opportunity available to it. This estimate gives you a reason to investigate, not proof that the loss exists.
        </p>
      </div>

      <StageNav
        onBack={onBack}
        backLabel="Back to Your Business"
        onNext={onNext}
        nextLabel="Continue to Adaptive Value\u2122"
      />
    </div>
  );
}

function QuietLossDimension({
  index, row, value, dollarValue, onChange,
}: {
  index: number;
  row: { key: keyof Assumptions; label: string; base: string; formula: string };
  value: number;
  dollarValue: number;
  onChange: (v: number) => void;
}) {
  const isPP = row.key === 'capability';
  const min = 0;
  const max = isPP ? 2 : 10;
  const step = isPP ? 0.1 : 0.25;
  return (
    <div className="nf-ql-dim-card">
      <div className="nf-ql-dim-header">
        <span className="nf-ql-dim-number">0{index}</span>
        <span className="nf-ql-dim-name">{row.label}</span>
      </div>
      <p className="nf-ql-dim-explain">{qlDimensionExplanations[row.key]}</p>
      <div className="nf-ql-dim-controls">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="nf-ql-dim-slider"
          style={{ accentColor: 'var(--nf-negative)' }}
          aria-label={`${row.label} assumption`}
        />
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n)));
          }}
          className="nf-ql-dim-number-input"
          aria-label={`${row.label} percentage`}
        />
        <span className="nf-ql-dim-unit">{isPP ? 'pp' : '%'}</span>
      </div>
      <div className="nf-ql-dim-results">
        <div className="nf-ql-dim-percent">
          <span className="nf-ql-dim-results-label">Current assumption</span>
          <span className="nf-ql-dim-results-value">{isPP ? formatPP(value) : formatPercent(value)}</span>
        </div>
        <div className="nf-ql-dim-dollar">
          <span className="nf-ql-dim-results-label">Estimated contribution</span>
          <span className="nf-ql-dim-results-value" style={{ color: 'var(--nf-negative)' }}>{formatValue(dollarValue)}</span>
        </div>
      </div>
      <p className="nf-ql-dim-default">Default: {isPP ? formatPP(value) : formatPercent(value)}. Illustrative starting assumption.</p>
    </div>
  );
}

const avDimensionExplanations: Record<string, string> = {
  revenue: 'What additional share of annual revenue might become possible if market change creates new opportunity the business can capture?',
  cost: 'What additional annual cost improvement might become possible if changing conditions allow the business to operate differently or more efficiently?',
  capacity: 'What additional value might become possible if existing people and capacity can be deployed more effectively as conditions change?',
  customer: 'What additional customer value might become possible if changing market conditions create new economically meaningful opportunity across the customer base?',
  capability: 'What additional share of annual revenue might become possible if stronger enterprise capability allows the business to capture new opportunity created by market change?',
};

function AdaptiveValueStage({
  avAssumptions, avResults, onChange, onBack, onNext,
}: {
  avAssumptions: Assumptions;
  avResults: ValueResults;
  onChange: (a: Assumptions) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="nf-calc-stage-eyebrow">03 ADAPTIVE VALUE™</div>
      <h2 className="nf-calc-stage-heading">What more could become possible?</h2>

      <div className="nf-av-orientation">
        <p className="nf-av-orientation-lead">
          You are now exploring additional value that may become possible as market conditions change and the enterprise adapts effectively.
        </p>
        <div className="nf-av-orientation-compare">
          <div className="nf-av-orientation-ql">
            <span className="nf-av-orientation-tag">Quiet Loss™</span>
            <p>Asks what value may already exist but not be fully captured.</p>
          </div>
          <div className="nf-av-orientation-av">
            <span className="nf-av-orientation-tag">Adaptive Value™</span>
            <p>Asks what additional value may become possible if changing market conditions create new economically meaningful opportunity.</p>
          </div>
        </div>
        <p className="nf-av-orientation-body">
          You are not predicting the future. You are applying illustrative scenario assumptions to explore potential additional annual value. These are your assumptions, not NexFrontier benchmarks.
        </p>
      </div>

      <div className="nf-calc-stage-result nf-calc-stage-result-av nf-av-summary">
        <div className="nf-calc-stage-result-label">Illustrative Adaptive Value™</div>
        <div className="nf-calc-stage-result-value">{formatValue(avResults.gross)}</div>
        <div className="nf-calc-stage-result-sub">Gross annual scenario</div>
        <div className="nf-calc-stage-result-note">
          This is the additional annual value your assumptions suggest may become possible if market change creates economically meaningful opportunity and the enterprise adapts effectively.
        </div>
        <div className="nf-calc-stage-result-warning">This is not a forecast.</div>
      </div>

      <div className="nf-av-dimensions">
        {assumptionRows.map((row, i) => (
          <AdaptiveValueDimension
            key={row.key}
            index={i + 1}
            row={row}
            value={avAssumptions[row.key]}
            dollarValue={avResults[row.key]}
            onChange={(v) => onChange({ ...avAssumptions, [row.key]: v })}
          />
        ))}
      </div>

      <div className="nf-av-why-matters">
        <div className="nf-av-why-matters-label">Why this matters</div>
        <p>
          Market change does not automatically create value. Adaptive Value™ becomes relevant only where new opportunity is economically meaningful and the enterprise can capture it.
        </p>
      </div>

      <StageNav
        onBack={onBack}
        backLabel="Back to Quiet Loss\u2122"
        onNext={onNext}
        nextLabel="Continue to Enterprise Value"
      />
    </div>
  );
}

function AdaptiveValueDimension({
  index, row, value, dollarValue, onChange,
}: {
  index: number;
  row: { key: keyof Assumptions; label: string; base: string; formula: string };
  value: number;
  dollarValue: number;
  onChange: (v: number) => void;
}) {
  const isPP = row.key === 'capability';
  const min = 0;
  const max = isPP ? 2 : 10;
  const step = isPP ? 0.1 : 0.25;
  return (
    <div className="nf-av-dim-card">
      <div className="nf-av-dim-header">
        <span className="nf-av-dim-number">0{index}</span>
        <span className="nf-av-dim-name">{row.label}</span>
      </div>
      <p className="nf-av-dim-explain">{avDimensionExplanations[row.key]}</p>
      <div className="nf-av-dim-controls">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="nf-av-dim-slider"
          style={{ accentColor: 'var(--nf-cyan)' }}
          aria-label={`${row.label} assumption`}
        />
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n)));
          }}
          className="nf-av-dim-number-input"
          aria-label={`${row.label} percentage`}
        />
        <span className="nf-av-dim-unit">{isPP ? 'pp' : '%'}</span>
      </div>
      <div className="nf-av-dim-results">
        <div className="nf-av-dim-percent">
          <span className="nf-av-dim-results-label">Current assumption</span>
          <span className="nf-av-dim-results-value">{isPP ? formatPP(value) : formatPercent(value)}</span>
        </div>
        <div className="nf-av-dim-dollar">
          <span className="nf-av-dim-results-label">Estimated contribution</span>
          <span className="nf-av-dim-results-value" style={{ color: 'var(--nf-cyan)' }}>{formatValue(dollarValue)}</span>
        </div>
      </div>
      <p className="nf-av-dim-default">Default: {isPP ? formatPP(value) : formatPercent(value)}. Illustrative starting assumption.</p>
    </div>
  );
}

const investigationQuestions = [
  'Which assumptions have the greatest influence on the result?',
  'Where might evidence confirm or challenge the Quiet Loss\u2122 estimate?',
  'Which market changes could materially affect Adaptive Value\u2122?',
  'What would need to be true for the estimated value to become real?',
  'Which areas deserve leadership attention first?',
];

function EnterpriseValueStage({
  qlResults, avResults, gvo, overlap, overlapValue, adjustedOpportunity,
  realisation, expectedRealisable, riskAllowance, costToRealise, costValue,
  evDelta, scenarioStatus, inputs, qlAssumptions, avAssumptions, pool, ebitdaMargin,
  onOverlapChange, onRealisationChange, onCostToRealiseChange, onBack, onReviewInputs,
}: {
  qlResults: ValueResults;
  avResults: ValueResults;
  gvo: number;
  overlap: number;
  overlapValue: number;
  adjustedOpportunity: number;
  realisation: number;
  expectedRealisable: number;
  riskAllowance: number;
  costToRealise: string;
  costValue: number;
  evDelta: number;
  scenarioStatus: 'above' | 'below' | 'neutral';
  inputs: BusinessInputs;
  qlAssumptions: Assumptions;
  avAssumptions: Assumptions;
  pool: number | null;
  ebitdaMargin: number | null;
  onOverlapChange: (v: number) => void;
  onRealisationChange: (v: number) => void;
  onCostToRealiseChange: (v: string) => void;
  onBack: () => void;
  onReviewInputs: () => void;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showLenses, setShowLenses] = useState(false);
  const [showBridge, setShowBridge] = useState(false);

  const statusColor = scenarioStatus === 'above' ? 'var(--nf-positive)' : scenarioStatus === 'below' ? 'var(--nf-negative)' : 'var(--nf-neutral)';
  const statusText = scenarioStatus === 'above' ? 'Above Status Quo' : scenarioStatus === 'below' ? 'Below Status Quo' : 'Broadly in line with Status Quo';

  return (
    <div>
      <div className="nf-calc-stage-eyebrow">04 ENTERPRISE VALUE</div>
      <h2 className="nf-calc-stage-heading">Illustrative Annual Enterprise Value Delta</h2>
      <p className="nf-calc-stage-supporting">
        You have completed your scenario. This page brings your assumptions together into a single illustrative result and suggests what it may mean.
      </p>

      <div className="nf-ev-grid">
        {/* Left column: equation, headline, adjustments */}
        <div className="nf-ev-left">
          {/* EV equation */}
          <div className="nf-ev-equation">
            <div className="nf-ev-eq-term">
              <span className="nf-ev-eq-label">Quiet Loss™</span>
              <span className="nf-ev-eq-value" style={{ color: 'var(--nf-negative)' }}>{formatValue(qlResults.gross)}</span>
            </div>
            <span className="nf-ev-eq-op">+</span>
            <div className="nf-ev-eq-term">
              <span className="nf-ev-eq-label">Adaptive Value™</span>
              <span className="nf-ev-eq-value" style={{ color: 'var(--nf-cyan)' }}>{formatValue(avResults.gross)}</span>
            </div>
            <span className="nf-ev-eq-op">=</span>
            <div className="nf-ev-eq-term">
              <span className="nf-ev-eq-label">Gross Value Opportunity</span>
              <span className="nf-ev-eq-value" style={{ color: 'var(--nf-text-primary)' }}>{formatValue(gvo)}</span>
            </div>
          </div>

          {/* Headline EV Delta */}
          <div className="nf-ev-hero">
            <div className="nf-ev-hero-label">Illustrative Annual EV Delta</div>
            <div className="nf-ev-hero-value" style={{ color: statusColor }}>
              {formatValue(evDelta, true)}<span className="nf-ev-hero-unit"> / year</span>
            </div>
            <div className="nf-ev-hero-status" style={{ color: statusColor }}>{statusText}</div>
            <p className="nf-ev-hero-note">
              Your current annual business position before applying the illustrative value assumptions above. This is not a forecast or formal valuation benchmark.
            </p>
          </div>

          {/* Adjustments */}
          <div className="nf-ev-adjustments">
            <h3 className="nf-ev-section-title">Applying Economic Reality</h3>
            <p className="nf-ev-section-sub">Three adjustments turn gross opportunity into a more realistic estimate. These are your assumptions.</p>

            <EvAdjustment
              label="Overlap"
              value={overlap}
              unit="%"
              min={0} max={50} step={5}
              onChange={onOverlapChange}
              explain="Some Quiet Loss\u2122 and Adaptive Value\u2122 may describe the same underlying value. Use this to avoid counting the same opportunity twice."
              effectLabel="Reduces gross by"
              effectValue={formatValue(overlapValue)}
              resultLabel="Adjusted opportunity"
              resultValue={formatValue(adjustedOpportunity)}
            />

            <EvAdjustment
              label="Expected Realisation"
              value={realisation}
              unit="%"
              min={0} max={100} step={5}
              onChange={onRealisationChange}
              explain="Not every identified opportunity will be captured. Use this to estimate what share might realistically become realised value."
              effectLabel="Risk / uncertainty allowance"
              effectValue={formatValue(riskAllowance)}
              resultLabel="Expected realisable value"
              resultValue={formatValue(expectedRealisable)}
            />

            {/* Cost to realise */}
            <div className="nf-ev-adj-card">
              <div className="nf-ev-adj-header">
                <span className="nf-ev-adj-name">Cost to Realise</span>
              </div>
              <p className="nf-ev-adj-explain">
                Capturing value may require investment. Enter the estimated annual cost of making the changes needed.
              </p>
              <div className="nf-ev-adj-controls">
                <span className="nf-ev-adj-prefix">$</span>
                <input
                  type="number"
                  min={0}
                  value={costToRealise}
                  onChange={(e) => onCostToRealiseChange(e.target.value)}
                  className="nf-ev-adj-cost-input"
                  placeholder="0"
                  aria-label="Estimated annual cost to realise"
                />
                <span className="nf-ev-adj-unit">/ year</span>
              </div>
              <div className="nf-ev-adj-effect">
                <span className="nf-ev-adj-effect-label">Subtracted from realisable value</span>
                <span className="nf-ev-adj-effect-value">{formatValue(costValue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: interpretation */}
        <div className="nf-ev-right">
          {/* What this may mean */}
          <div className="nf-ev-insight-card nf-ev-insight-mean">
            <div className="nf-ev-insight-label">What this may mean</div>
            <p>
              Your scenario suggests there may be enough economic significance to justify further investigation. The result is not proof of available value, but it can help identify whether the question deserves leadership attention.
            </p>
          </div>

          {/* What it does not prove */}
          <div className="nf-ev-insight-card nf-ev-insight-not">
            <div className="nf-ev-insight-label">What this does not prove</div>
            <p>
              Realised value, future performance, causation, or a formal valuation. It is an illustrative scenario based on your assumptions, not evidence of outcomes.
            </p>
          </div>

          {/* What deserves investigation next */}
          <div className="nf-ev-insight-card nf-ev-insight-invest">
            <div className="nf-ev-insight-label">What deserves investigation next</div>
            <ol className="nf-ev-invest-list">
              {investigationQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Collapsible: Value Bridge */}
      <EvCollapsible
        title="Value Bridge"
        subtitle="How the result is built from gross opportunity to EV delta."
        open={showBridge}
        onToggle={() => setShowBridge(!showBridge)}
      >
        <ValueBridge
          qlGross={qlResults.gross}
          avGross={avResults.gross}
          overlap={overlapValue}
          risk={riskAllowance}
          cost={costValue}
          evDelta={evDelta}
        />
      </EvCollapsible>

      {/* Collapsible: Five-dimension breakdown */}
      <EvCollapsible
        title="Five-Dimension Gross Breakdown"
        subtitle="Quiet Loss\u2122 and Adaptive Value\u2122 by dimension, before adjustments."
        open={showBreakdown}
        onToggle={() => setShowBreakdown(!showBreakdown)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
          {assumptionRows.map((row) => {
            const qlVal = qlResults[row.key];
            const avVal = avResults[row.key];
            return (
              <div key={row.key} className="nf-calc-dim-row">
                <span className="nf-calc-dim-label">{row.label}</span>
                <span className="nf-calc-dim-ql">QL: {formatValue(qlVal)}</span>
                <span className="nf-calc-dim-av">AV: {formatValue(avVal)}</span>
                <span className="nf-calc-dim-total">{formatValue(qlVal + avVal)}</span>
              </div>
            );
          })}
        </div>
        <p className="nf-ev-collapsible-note">
          Values shown here are gross, before overlap, expected realisation and cost to realise.
        </p>
      </EvCollapsible>

      {/* Collapsible: VTF Lenses */}
      <EvCollapsible
        title="Value Translation Framework\u2122 Lenses"
        subtitle="Five interpretive lenses that help frame where value may appear."
        open={showLenses}
        onToggle={() => setShowLenses(!showLenses)}
      >
        <div className="nf-calc-vtf-grid">
          {vtfLenses.map((lens) => (
            <div key={lens.name} className="nf-calc-vtf-card">
              <div className="nf-calc-vtf-name">{lens.name}</div>
              <div className="nf-calc-vtf-desc">{lens.desc}</div>
            </div>
          ))}
        </div>
      </EvCollapsible>

      {/* Engagement section */}
      <div className="nf-ev-engagement">
        <div className="nf-ev-engagement-ctas">
          <button type="button" className="nf-cta nf-cta-primary" onClick={() => downloadReport({ inputs, qlResults, avResults, qlAssumptions, avAssumptions, overlap, overlapValue, adjustedOpportunity, realisation, expectedRealisable, riskAllowance, costValue, evDelta, scenarioStatus, pool, ebitdaMargin })}>
            <Download size={16} /> Open My Enterprise Value Report
          </button>
          <button type="button" className="nf-cta nf-cta-secondary" onClick={onReviewInputs}>
            <FileText size={16} /> Review My Inputs
          </button>
          <a href="/market-enquiry?topic=enterprise-value" className="nf-cta nf-cta-tertiary">
            <Compass size={16} /> Explore This With NexFrontier
          </a>
        </div>
        <p className="nf-ev-engagement-support">
          If this scenario raises a question worth investigating, NexFrontier can help test it against real evidence.
        </p>
        <p className="nf-calc-session-warning">
          Your report opens in a new window. Use your browser's Print dialog to save it as a PDF before leaving this session.
        </p>
      </div>

      <StageNav onBack={onBack} backLabel="Back to Adaptive Value\u2122" />
    </div>
  );
}

function EvAdjustment({
  label, value, unit, min, max, step, onChange, explain, effectLabel, effectValue, resultLabel, resultValue,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  explain: string;
  effectLabel: string;
  effectValue: string;
  resultLabel: string;
  resultValue: string;
}) {
  return (
    <div className="nf-ev-adj-card">
      <div className="nf-ev-adj-header">
        <span className="nf-ev-adj-name">{label}</span>
        <span className="nf-ev-adj-current">{value}{unit}</span>
      </div>
      <p className="nf-ev-adj-explain">{explain}</p>
      <div className="nf-ev-adj-controls">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="nf-ev-adj-slider"
          aria-label={label}
        />
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n))); }}
          className="nf-ev-adj-number-input"
          aria-label={`${label} value`}
        />
      </div>
      <div className="nf-ev-adj-effects">
        <div className="nf-ev-adj-effect">
          <span className="nf-ev-adj-effect-label">{effectLabel}</span>
          <span className="nf-ev-adj-effect-value">{effectValue}</span>
        </div>
        <div className="nf-ev-adj-effect">
          <span className="nf-ev-adj-effect-label">{resultLabel}</span>
          <span className="nf-ev-adj-effect-value" style={{ color: 'var(--nf-cyan)' }}>{resultValue}</span>
        </div>
      </div>
    </div>
  );
}

function EvCollapsible({
  title, subtitle, open, onToggle, children,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="nf-ev-collapsible">
      <button type="button" className="nf-ev-collapsible-header" onClick={onToggle} aria-expanded={open}>
        <div className="nf-ev-collapsible-titles">
          <span className="nf-ev-collapsible-title">{title}</span>
          <span className="nf-ev-collapsible-sub">{subtitle}</span>
        </div>
        <ChevronDown size={20} className="nf-ev-collapsible-chevron" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="nf-ev-collapsible-body">
          {children}
        </div>
      )}
    </div>
  );
}

function AssumptionSection({ assumptions, onChange, accent }: { assumptions: Assumptions; onChange: (a: Assumptions) => void; accent: 'negative' | 'cyan' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
      {assumptionRows.map((row, i) => (
        <AssumptionRow
          key={row.key}
          index={i + 1}
          label={row.label}
          variable={row.key === 'capability' ? 'pp' : '%'}
          formula={row.formula}
          value={assumptions[row.key]}
          onChange={(v) => onChange({ ...assumptions, [row.key]: v })}
          isPP={row.key === 'capability'}
          accent={accent}
        />
      ))}
    </div>
  );
}

function AssumptionRow({ index, label, variable, formula, value, onChange, isPP, accent }: {
  index: number; label: string; variable: string; formula: string;
  value: number; onChange: (v: number) => void; isPP?: boolean; accent: 'negative' | 'cyan';
}) {
  const min = 0;
  const max = isPP ? 2 : 10;
  const step = isPP ? 0.1 : 0.25;
  const accentColor = accent === 'negative' ? 'var(--nf-negative)' : 'var(--nf-cyan)';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: accentColor, letterSpacing: '0.14em' }}>0{index}</span>
        <span style={{ fontSize: 'var(--nf-text-body)', fontWeight: 600, color: 'var(--nf-text-primary)' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{formula}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-4)' }}>
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: accentColor }}
          aria-label={`${label} assumption`}
        />
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n)));
          }}
          style={{
            width: '70px', padding: '8px 10px', background: 'var(--nf-bg-inset)',
            border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
            color: 'var(--nf-text-primary)', fontSize: '0.875rem', textAlign: 'center', outline: 'none',
          }}
          aria-label={`${label} percentage`}
        />
        <span style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', minWidth: '30px' }}>{variable}</span>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)', marginTop: '6px' }}>
        Default: {isPP ? formatPP(value) : formatPercent(value)}. Illustrative starting assumption.
      </p>
    </div>
  );
}

function AdjustmentRow({ label, variable, value, onChange, min, max, step, unit, explain, benchmark, resultLabel, resultValue, resultLabel2, resultValue2 }: {
  label: string; variable: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; unit: string;
  explain: string; benchmark: string;
  resultLabel: string; resultValue: string; resultLabel2: string; resultValue2: string;
}) {
  return (
    <div style={{ marginBottom: 'var(--nf-space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--nf-space-3)' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--nf-cyan)', letterSpacing: '0.14em' }}>{variable}</span>
        <span style={{ fontSize: 'var(--nf-text-body)', fontWeight: 600, color: 'var(--nf-text-primary)' }}>{label}</span>
      </div>
      <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--nf-text-tertiary)', marginBottom: 'var(--nf-space-4)' }}>{explain}</p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', fontStyle: 'italic', marginBottom: 'var(--nf-space-4)' }}>{benchmark}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-4)' }}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--nf-cyan)' }} aria-label={label} />
        <input type="number" min={min} max={max} step={step} value={value} onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n))); }} style={{ width: '70px', padding: '8px 10px', background: 'var(--nf-bg-inset)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', textAlign: 'center', outline: 'none' }} aria-label={`${label} value`} />
        <span style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', minWidth: '30px' }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--nf-space-6)', flexWrap: 'wrap', marginTop: 'var(--nf-space-4)' }}>
        <div><span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{resultLabel}: </span><span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--nf-text-secondary)' }}>{resultValue}</span></div>
        <div><span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{resultLabel2}: </span><span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--nf-text-secondary)' }}>{resultValue2}</span></div>
      </div>
    </div>
  );
}

function StatusQuoVisual({ status }: { status: 'above' | 'below' | 'neutral' }) {
  const position = status === 'above' ? 80 : status === 'below' ? 20 : 50;
  const color = status === 'above' ? 'var(--nf-positive)' : status === 'below' ? 'var(--nf-negative)' : 'var(--nf-neutral)';
  return (
    <div style={{ marginBottom: 'var(--nf-space-8)' }}>
      <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, fontSize: '0.6875rem', color: 'var(--nf-negative)', whiteSpace: 'nowrap' }}>VALUE EROSION</div>
        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, var(--nf-negative), var(--nf-neutral), var(--nf-positive))', margin: '0 100px', borderRadius: '1px' }} />
        <div style={{ position: 'absolute', right: 0, fontSize: '0.6875rem', color: 'var(--nf-positive)', whiteSpace: 'nowrap' }}>VALUE CREATION</div>
        <div style={{
          position: 'absolute', left: `calc(100px + (100% - 200px) * ${position / 100})`,
          transform: 'translateX(-50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          background: color, border: '2px solid var(--nf-bg-primary)',
          boxShadow: `0 0 8px ${color}`,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>STATUS QUO (today's position)</span>
      </div>
    </div>
  );
}

function ValueBridge({ qlGross, avGross, overlap, risk, cost, evDelta }: {
  qlGross: number; avGross: number; overlap: number; risk: number; cost: number; evDelta: number;
}) {
  const steps = [
    { label: 'Status Quo', value: formatValue(0) },
    { label: '+ Quiet Loss™', value: formatValue(qlGross, true) },
    { label: '+ Adaptive Value™', value: formatValue(avGross, true) },
    { label: '\u2212 Overlap', value: formatValue(-overlap, true) },
    { label: '\u2212 Risk / Uncertainty', value: formatValue(-risk, true) },
    { label: '\u2212 Cost to Realise', value: formatValue(-cost, true) },
    { label: 'Enterprise Value Delta', value: formatValue(evDelta, true) },
  ];
  return (
    <div style={{ marginBottom: 'var(--nf-space-8)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', borderRadius: 'var(--nf-radius-control)',
              background: isLast ? 'var(--nf-bg-surface-3)' : 'var(--nf-bg-surface-1)',
              border: '1px solid ' + (isLast ? 'var(--nf-border-accent)' : 'var(--nf-border)'),
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: isLast ? 600 : 400, color: isLast ? 'var(--nf-text-primary)' : 'var(--nf-text-secondary)' }}>{step.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: isLast ? 700 : 500, color: isLast ? 'var(--nf-cyan)' : 'var(--nf-text-secondary)' }}>{step.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageNav({ onBack, backLabel, onNext, nextLabel, nextDisabled }: {
  onBack?: () => void; backLabel?: string;
  onNext?: () => void; nextLabel?: string; nextDisabled?: boolean;
}) {
  return (
    <div className="nf-calc-stage-nav">
      {onBack && backLabel && (
        <button onClick={onBack} className="nf-calc-back-btn">
          <ArrowLeft size={15} /> {backLabel}
        </button>
      )}
      {onNext && nextLabel && (
        <button onClick={onNext} disabled={nextDisabled} className="nf-calc-next-btn" style={{
          opacity: nextDisabled ? 0.4 : 1,
          cursor: nextDisabled ? 'not-allowed' : 'pointer',
        }}>
          {nextLabel} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

// ── PDF Report Generation ──────────────────────────────

type ReportData = {
  inputs: BusinessInputs;
  qlResults: ValueResults;
  avResults: ValueResults;
  qlAssumptions: Assumptions;
  avAssumptions: Assumptions;
  overlap: number;
  overlapValue: number;
  adjustedOpportunity: number;
  realisation: number;
  expectedRealisable: number;
  riskAllowance: number;
  costValue: number;
  evDelta: number;
  scenarioStatus: 'above' | 'below' | 'neutral';
  pool: number | null;
  ebitdaMargin: number | null;
};

const REPORT_CTA_LINKS = {
  enquiry: '/market-enquiry',
  booking: '/market-enquiry?topic=meeting',
};

function downloadReport(data: ReportData) {
  const {
    inputs, qlResults, avResults, qlAssumptions, avAssumptions,
    overlap, overlapValue, adjustedOpportunity, realisation,
    expectedRealisable, riskAllowance, costValue, evDelta, scenarioStatus, pool, ebitdaMargin,
  } = data;

  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const statusText = scenarioStatus === 'above' ? 'Above Status Quo' : scenarioStatus === 'below' ? 'Below Status Quo' : 'Broadly in line with Status Quo';
  const statusColor = scenarioStatus === 'above' ? '#10b981' : scenarioStatus === 'below' ? '#f87171' : '#94a3b8';
  const gvo = qlResults.gross + avResults.gross;

  const dimRows = assumptionRows.map((row) => {
    const qlVal = qlResults[row.key];
    const avVal = avResults[row.key];
    return `<tr>
      <td class="dim-name">${row.label}</td>
      <td class="dim-val">${formatValue(qlVal)}</td>
      <td class="dim-val">${formatValue(avVal)}</td>
      <td class="dim-val dim-total">${formatValue(qlVal + avVal)}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>NexFrontier Enterprise Value Scenario Report</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 22mm 16mm;
  }
  @page :first {
    margin: 0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    font-size: 10.5pt;
    line-height: 1.55;
    background: #fff;
  }

  /* Cover page */
  .cover {
    page-break-after: always;
    width: 210mm;
    height: 297mm;
    background: #041014;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28mm 22mm;
    position: relative;
  }
  .cover-logo {
    font-size: 16pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #fff;
  }
  .cover-logo .accent { color: #0cc0df; }
  .cover-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .cover-eyebrow {
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0cc0df;
    margin-bottom: 16px;
  }
  .cover-title {
    font-size: 30pt;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 18px;
    max-width: 150mm;
  }
  .cover-sub {
    font-size: 11pt;
    line-height: 1.6;
    color: #94a3b8;
    max-width: 140mm;
    margin-bottom: 36px;
  }
  .cover-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 9.5pt;
    color: #cbd5e1;
  }
  .cover-meta-label { color: #64748b; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.12em; }
  .cover-meta-val { color: #e2e8f0; font-weight: 500; }
  .cover-footer {
    border-top: 1px solid rgba(255,255,255,0.12);
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 8pt;
    color: #64748b;
  }
  .cover-disclaimer {
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.25);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 8.5pt;
    color: #fca5a5;
    margin-top: 20px;
    max-width: 130mm;
  }

  /* Content pages */
  .page {
    page-break-after: always;
    padding-top: 4mm;
  }
  .page:last-child { page-break-after: auto; }
  .page-eyebrow {
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #0cc0df;
    margin-bottom: 6px;
  }
  .page-heading {
    font-size: 18pt;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #041014;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .page-sub {
    font-size: 10pt;
    color: #64748b;
    margin-bottom: 20px;
    line-height: 1.55;
    max-width: 165mm;
  }
  h3.section {
    font-size: 11pt;
    font-weight: 600;
    color: #041014;
    margin-top: 18px;
    margin-bottom: 8px;
  }
  p { margin-bottom: 8px; }
  p.body { font-size: 10pt; color: #334155; line-height: 1.6; }

  /* Executive summary cards */
  .exec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
  }
  .exec-card {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 14px;
    background: #f8fafc;
  }
  .exec-card.ql { border-top: 3px solid #f87171; }
  .exec-card.av { border-top: 3px solid #0cc0df; }
  .exec-card.gvo { border-top: 3px solid #041014; }
  .exec-label { font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 4px; }
  .exec-value { font-size: 16pt; font-weight: 700; color: #041014; }
  .exec-card.ql .exec-value { color: #f87171; }
  .exec-card.av .exec-value { color: #0cc0df; }

  /* Equation */
  .equation {
    display: flex;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 18px;
  }
  .eq-term {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 8px;
    text-align: center;
    background: #f8fafc;
  }
  .eq-label { font-size: 7.5pt; color: #64748b; margin-bottom: 4px; }
  .eq-value { font-size: 13pt; font-weight: 700; }
  .eq-op { display: flex; align-items: center; font-size: 14pt; font-weight: 700; color: #94a3b8; }
  .eq-term.ql .eq-value { color: #f87171; }
  .eq-term.av .eq-value { color: #0cc0df; }
  .eq-term.adj .eq-value { color: #64748b; font-size: 10pt; }
  .eq-term.delta { background: #041014; border-color: #041014; }
  .eq-term.delta .eq-label { color: #94a3b8; }
  .eq-term.delta .eq-value { color: #0cc0df; }

  /* Adjustment rows */
  .adj-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .adj-table th { text-align: left; font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  .adj-table td { font-size: 9.5pt; padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
  .adj-table td.val { font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }

  /* Dimension table */
  .dim-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  .dim-table th { text-align: left; font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  .dim-table th.num { text-align: right; }
  .dim-table td { font-size: 9.5pt; padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
  .dim-name { color: #041014; font-weight: 500; }
  .dim-val { text-align: right; font-variant-numeric: tabular-nums; color: #64748b; }
  .dim-total { font-weight: 600; color: #041014; }

  /* Delta banner */
  .delta-banner {
    background: #041014;
    color: #fff;
    border-radius: 8px;
    padding: 18px 24px;
    text-align: center;
    margin-bottom: 18px;
  }
  .delta-label { font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin-bottom: 6px; }
  .delta-value { font-size: 26pt; font-weight: 700; color: ${statusColor}; margin-bottom: 4px; }
  .delta-status { font-size: 10pt; font-weight: 600; color: ${statusColor}; margin-bottom: 6px; }
  .delta-note { font-size: 8.5pt; color: #94a3b8; }

  /* Interpretation list */
  .interp-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .interp-item { display: grid; grid-template-columns: 160px 1fr; gap: 12px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; }
  .interp-label { font-size: 8.5pt; font-weight: 600; color: #475569; }
  .interp-text { font-size: 9pt; color: #64748b; line-height: 1.5; }

  /* VTF lenses */
  .vtf-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .vtf-item { padding: 8px 12px; border-left: 3px solid #0cc0df; background: #f8fafc; border-radius: 0 4px 4px 0; }
  .vtf-name { font-size: 9.5pt; font-weight: 600; color: #041014; margin-bottom: 2px; }
  .vtf-desc { font-size: 8.5pt; color: #64748b; line-height: 1.5; }

  /* Questions */
  .q-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; counter-reset: q; }
  .q-item { display: grid; grid-template-columns: 28px 1fr; gap: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 4px; }
  .q-num { font-size: 10pt; font-weight: 700; color: #0cc0df; }
  .q-text { font-size: 9.5pt; color: #334155; line-height: 1.55; }

  /* Evidence note */
  .evidence-note {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 16px;
  }
  .evidence-title { font-size: 9pt; font-weight: 700; color: #dc2626; margin-bottom: 6px; }
  .evidence-body { font-size: 9pt; color: #991b1b; line-height: 1.55; }

  /* Closing note */
  .closing-note {
    background: #041014;
    color: #fff;
    border-radius: 8px;
    padding: 24px 28px;
    margin-bottom: 20px;
  }
  .closing-note p { font-size: 10pt; color: #cbd5e1; line-height: 1.65; margin-bottom: 10px; }
  .closing-note p:last-child { margin-bottom: 0; }
  .closing-note .highlight { color: #0cc0df; font-weight: 500; }

  /* CTA */
  .cta-panel {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 28px 28px 24px;
    text-align: center;
  }
  .cta-headline { font-size: 18pt; font-weight: 600; color: #041014; letter-spacing: -0.02em; margin-bottom: 10px; }
  .cta-sub { font-size: 10pt; color: #64748b; line-height: 1.6; margin-bottom: 20px; max-width: 130mm; margin-left: auto; margin-right: auto; }
  .cta-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .cta-btn {
    display: inline-block;
    padding: 11px 22px;
    border-radius: 6px;
    font-size: 9.5pt;
    font-weight: 600;
    text-decoration: none;
  }
  .cta-btn-primary { background: #0cc0df; color: #041014; }
  .cta-btn-secondary { background: #041014; color: #fff; }
  .cta-btn-tertiary { background: transparent; color: #041014; border: 1px solid #cbd5e1; }
  .cta-note { font-size: 7.5pt; color: #94a3b8; margin-top: 14px; }

  /* Contact */
  .contact-block {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 9pt;
    color: #64748b;
  }
  .contact-block a { color: #0cc0df; text-decoration: none; }

  /* Running footer */
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 6mm 16mm 4mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.5pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
  }
  .footer-brand { font-weight: 600; color: #64748b; }
  .footer-brand .accent { color: #0cc0df; }
  .footer-page::after { content: counter(page); }
  .page { counter-increment: page; }
  body { counter-reset: page; }

  /* Avoid orphan headings */
  h3.section { break-after: avoid; }
  .page-eyebrow, .page-heading { break-after: avoid; }
  .exec-grid, .equation, .dim-table, .adj-table, .delta-banner { break-inside: avoid; }
  .interp-item, .vtf-item, .q-item { break-inside: avoid; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div class="cover-logo">Nex<span class="accent">Frontier</span></div>
  </div>
  <div class="cover-body">
    <div class="cover-eyebrow">Illustrative Scenario Report</div>
    <div class="cover-title">Enterprise Value Scenario Report</div>
    <div class="cover-sub">An illustrative view of where value may already be going unrealised, where additional value may become possible, and what the scenario may warrant investigating next.</div>
    <div class="cover-meta">
      <div>
        <div class="cover-meta-label">Report Date</div>
        <div class="cover-meta-val">${reportDate}</div>
      </div>
      <div>
        <div class="cover-meta-label">Prepared By</div>
        <div class="cover-meta-val">NexFrontier</div>
      </div>
    </div>
    <div class="cover-disclaimer">Illustrative scenario, not a valuation, forecast or diagnosis.</div>
  </div>
  <div class="cover-footer">
    <span>NexFrontier &middot; Intelligence for AI-mediated markets</span>
    <span>www.nexfrontier.my</span>
  </div>
</div>

<!-- OPENING NOTE -->
<div class="page">
  <div class="page-eyebrow">About this report</div>
  <div class="page-heading">About this report</div>
  <p class="body">This report translates the assumptions you entered into an illustrative view of Enterprise Value.</p>
  <p class="body">It considers two related possibilities:</p>
  <p class="body"><strong>Quiet Loss&trade;</strong>, value that may already be available from existing market opportunity but not fully captured, and <strong>Adaptive Value&trade;</strong>, additional value that may become possible as market conditions change.</p>
  <p class="body">The figures are not claims about your business. They are a structured way to ask whether there may be enough economic significance to justify further investigation.</p>
  <p class="body">NexFrontier's role is to help move that question from assumption to evidence.</p>
  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page">
  <div class="page-eyebrow">Executive Summary</div>
  <div class="page-heading">Executive Summary</div>
  <p class="page-sub">The result of your scenario at a glance. All figures are illustrative annual values.</p>

  <div class="exec-grid">
    <div class="exec-card ql">
      <div class="exec-label">Quiet Loss&trade;</div>
      <div class="exec-value">${formatValue(qlResults.gross)}</div>
    </div>
    <div class="exec-card av">
      <div class="exec-label">Adaptive Value&trade;</div>
      <div class="exec-value">${formatValue(avResults.gross)}</div>
    </div>
    <div class="exec-card gvo">
      <div class="exec-label">Gross Value Opportunity</div>
      <div class="exec-value">${formatValue(gvo)}</div>
    </div>
  </div>

  <div class="equation">
    <div class="eq-term ql">
      <div class="eq-label">Quiet Loss&trade;</div>
      <div class="eq-value">${formatValue(qlResults.gross)}</div>
    </div>
    <div class="eq-op">+</div>
    <div class="eq-term av">
      <div class="eq-label">Adaptive Value&trade;</div>
      <div class="eq-value">${formatValue(avResults.gross)}</div>
    </div>
    <div class="eq-op">&rarr;</div>
    <div class="eq-term adj">
      <div class="eq-label">Adjustments</div>
      <div class="eq-value">Overlap ${overlap}% &middot; Realisation ${realisation}% &middot; Cost ${formatValue(costValue)}</div>
    </div>
    <div class="eq-op">&rarr;</div>
    <div class="eq-term delta">
      <div class="eq-label">EV Delta</div>
      <div class="eq-value">${formatValue(evDelta, true)}</div>
    </div>
  </div>

  <table class="adj-table">
    <tr><th>Adjustment</th><th style="text-align:right">Value</th></tr>
    <tr><td>Gross Value Opportunity (QL + AV)</td><td class="val">${formatValue(gvo)}</td></tr>
    <tr><td>Cross-Dimension Overlap (${overlap}%)</td><td class="val">${formatValue(-overlapValue)}</td></tr>
    <tr><td>Adjusted Opportunity</td><td class="val">${formatValue(adjustedOpportunity)}</td></tr>
    <tr><td>Expected Realisation (${realisation}%)</td><td class="val">${formatValue(expectedRealisable)}</td></tr>
    <tr><td>Risk / Uncertainty Allowance</td><td class="val">${formatValue(-riskAllowance)}</td></tr>
    <tr><td>Estimated Annual Cost to Realise</td><td class="val">${formatValue(-costValue)}</td></tr>
  </table>

  <div class="delta-banner">
    <div class="delta-label">Illustrative Annual Enterprise Value Delta</div>
    <div class="delta-value">${formatValue(evDelta, true)}</div>
    <div class="delta-status">${statusText}</div>
    <div class="delta-note">Illustrative annual movement relative to today's position.</div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- WHAT THE RESULT MEANS -->
<div class="page">
  <div class="page-eyebrow">Interpretation</div>
  <div class="page-heading">What the result means</div>

  <div class="interp-list">
    <div class="interp-item">
      <span class="interp-label">What Quiet Loss&trade; represents</span>
      <span class="interp-text">Value from existing market opportunity that may not be fully captured today.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">What Adaptive Value&trade; represents</span>
      <span class="interp-text">Additional value that may become possible as market conditions change and the enterprise adapts.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">Why overlap is applied</span>
      <span class="interp-text">Reduces the combined QL + AV figure by your overlap assumption to avoid double-counting related economics across dimensions.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">Why expected realisation is applied</span>
      <span class="interp-text">Reduces the adjusted opportunity to what may reasonably survive uncertainty, execution risk and practical constraints.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">Why cost to realise matters</span>
      <span class="interp-text">Subtracted from the expected realisable value to arrive at the illustrative annual EV delta.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">What the EV Delta represents</span>
      <span class="interp-text">An illustrative annual movement relative to today's position, after adjustments.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">What this result does not prove</span>
      <span class="interp-text">Realised value, future performance, causation or a formal valuation.</span>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- FIVE DIMENSIONS -->
<div class="page">
  <div class="page-eyebrow">Value Dimensions</div>
  <div class="page-heading">Five Enterprise Value Dimensions</div>
  <p class="page-sub">These are five different economic lenses on the same enterprise, not five separate products. The scenario contribution for each dimension is shown below.</p>

  <table class="dim-table">
    <tr>
      <th>Dimension</th>
      <th class="num">Quiet Loss&trade;</th>
      <th class="num">Adaptive Value&trade;</th>
      <th class="num">Combined</th>
    </tr>
    ${dimRows}
  </table>
  <p style="font-size:8pt;color:#94a3b8;font-style:italic;margin-bottom:16px">Values shown are gross, before overlap, expected realisation and cost to realise.</p>

  <h3 class="section">How to read these dimensions</h3>
  <p class="body"><strong>Revenue</strong> &mdash; value from revenue opportunity across existing and changing market conditions.</p>
  <p class="body"><strong>Cost</strong> &mdash; value from cost efficiency or cost avoidance across non-people operating costs.</p>
  <p class="body"><strong>Capacity</strong> &mdash; value from people and capacity-related cost effectiveness.</p>
  <p class="body"><strong>Customer Value</strong> &mdash; value from the annualised customer value pool and customer lifetime dynamics.</p>
  <p class="body"><strong>Enterprise Capability</strong> &mdash; value from the organisation's ability to adapt fast enough to capture what is possible.</p>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- VALUE TRANSLATION FRAMEWORK -->
<div class="page">
  <div class="page-eyebrow">Methodology</div>
  <div class="page-heading">Value Translation Framework&trade;</div>
  <p class="body">NexFrontier's Value Translation Framework&trade; is used to translate observed operational and market evidence into economic meaning.</p>
  <p class="body">The framework provides interpretive lenses that help frame where value may appear. These are different perspectives on the same enterprise, not separate required calculations.</p>

  <div class="vtf-list">
    <div class="vtf-item">
      <div class="vtf-name">Defensive Value</div>
      <div class="vtf-desc">Protecting existing revenue and customer relationships from erosion.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Offensive Value</div>
      <div class="vtf-desc">Capturing new opportunity created by changing market conditions.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Revenue Health</div>
      <div class="vtf-desc">Whether revenue quality, mix and pipeline are improving or deteriorating.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Customer Lifetime Value</div>
      <div class="vtf-desc">How changing customer intent and expectations affect long-term value.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Enterprise Capability</div>
      <div class="vtf-desc">Whether the organisation can adapt fast enough to capture what is possible.</div>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- QUESTIONS -->
<div class="page">
  <div class="page-eyebrow">Next Steps</div>
  <div class="page-heading">What deserves investigation next?</div>
  <p class="page-sub">These questions turn the scenario result into executive inquiry rather than recommendations presented as fact.</p>

  <div class="q-list">
    <div class="q-item"><span class="q-num">1</span><span class="q-text">Where might existing opportunity already be going unrealised?</span></div>
    <div class="q-item"><span class="q-num">2</span><span class="q-text">Which value dimensions contribute most to the scenario?</span></div>
    <div class="q-item"><span class="q-num">3</span><span class="q-text">What evidence would confirm or challenge these assumptions?</span></div>
    <div class="q-item"><span class="q-num">4</span><span class="q-text">Where may changing customer behaviour or AI-mediated market conditions alter the opportunity?</span></div>
    <div class="q-item"><span class="q-num">5</span><span class="q-text">Which assumptions are most sensitive to the final result?</span></div>
    <div class="q-item"><span class="q-num">6</span><span class="q-text">What would leadership need to know before deciding whether intervention is justified?</span></div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- EVIDENCE DISCIPLINE -->
<div class="page">
  <div class="page-eyebrow">Evidence Discipline</div>
  <div class="page-heading">Possibility is not proof</div>

  <div class="evidence-note">
    <div class="evidence-title">Possibility is not proof.</div>
    <div class="evidence-body">
      The report is based on user-entered scenario assumptions. It does not establish causation, realised value, future performance, recoverability or a formal valuation.
      <br><br>
      Actual claims require business evidence.
    </div>
  </div>

  <h3 class="section">What this does not prove</h3>
  <p class="body">This does not prove realised value, future performance, causation or a formal valuation.</p>
  <p class="body">This calculator does not diagnose Quiet Loss&trade;, forecast Adaptive Value&trade; or value your business.</p>
  <p class="body">Evidence determines what is real, what is material and what may be worth acting on.</p>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- CLOSING NOTE + CTA -->
<div class="page">
  <div class="page-eyebrow">From Scenario to Evidence</div>
  <div class="page-heading">The useful question</div>

  <div class="closing-note">
    <p>The useful question is not whether this number is right.</p>
    <p>It is whether the possibility is significant enough to investigate.</p>
    <p>NexFrontier is building <span class="highlight">intelligence for AI-mediated markets</span> to help businesses understand what is changing, what may matter economically, and what the evidence says deserves attention.</p>
    <p>If this scenario raises a question worth exploring in your business, the next step is to <span class="highlight">test it against real evidence</span>.</p>
  </div>

  <div class="cta-panel">
    <div class="cta-headline">Turn the scenario into evidence.</div>
    <div class="cta-sub">Explore what may actually be happening in your business, what appears economically material and what may deserve leadership attention.</div>
    <div class="cta-row">
      <a class="cta-btn cta-btn-primary" href="${REPORT_CTA_LINKS.enquiry}">Request a NexFrontier conversation</a>
      <a class="cta-btn cta-btn-secondary" href="${REPORT_CTA_LINKS.enquiry}">Ask us to contact you</a>
      <a class="cta-btn cta-btn-tertiary" href="${REPORT_CTA_LINKS.booking}">Book a meeting</a>
    </div>
    <div class="cta-note">Meeting booking is routed via Market Enquiry until a live scheduling URL is configured.</div>
  </div>

  <div class="contact-block">
    <strong>NexFrontier Group Sdn. Bhd.</strong><br>
    L9, Menara Public Gold @TRX, 50400 Kuala Lumpur, Malaysia<br>
    <a href="mailto:hello@nexfrontier.my">hello@nexfrontier.my</a> &middot; <a href="https://www.nexfrontier.my">www.nexfrontier.my</a>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to open your report.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
