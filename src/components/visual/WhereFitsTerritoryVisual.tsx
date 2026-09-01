import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BrainCircuit,
  CircleDot,
  LineChart,
  MessagesSquare,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

type TerritoryItem = { label: string; icon: LucideIcon };

const marketItems: TerritoryItem[] = [
  { label: 'AI-mediated discovery', icon: Search },
  { label: 'Customer / buyer behaviour', icon: ShoppingBag },
  { label: 'Trust / choice signals', icon: ShieldCheck },
  { label: 'Market change', icon: CircleDot },
];

const enterpriseItems: TerritoryItem[] = [
  { label: 'Customer systems', icon: MessagesSquare },
  { label: 'Operational systems', icon: Settings2 },
  { label: 'Analytics / performance', icon: BarChart3 },
  { label: 'Internal AI / automation', icon: BrainCircuit },
];

const outputChain = ['Strategic Visibility', 'Enterprise Navigational Intelligence', 'Enterprise Value'];

function TerritoryPanel({ label, sublabel, items }: { label: string; sublabel: string; items: TerritoryItem[] }) {
  return (
    <div className="nf-territory-panel">
      <h3>{label}</h3>
      <p className="nf-territory-sublabel">{sublabel}</p>
      <div className="nf-territory-list">
        {items.map(({ label: item, icon: Icon }) => (
          <div className="nf-territory-item" key={item}>
            <Icon size={18} strokeWidth={1.35} aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhereFitsTerritoryVisual() {
  return (
    <figure className="nf-territory-visual" aria-labelledby="territory-visual-caption">
      {/* LEFT — Market Reality */}
      <div className="nf-territory-side nf-territory-market">
        <TerritoryPanel
          label="AI-MEDIATED MARKET"
          sublabel="Changing market reality"
          items={marketItems}
        />
        <div className="nf-territory-inward-arrow" aria-hidden="true">→</div>
      </div>

      {/* CENTRE — Alignment Gap / NexFrontier */}
      <div className="nf-territory-centre">
        <div className="nf-territory-gap-label">ALIGNMENT GAP</div>
        <div className="nf-territory-gap-card">
          <div className="nf-wordmark"><span>Nex</span><strong>Frontier</strong></div>
          <p className="nf-territory-gap-title">Strategic Visibility</p>
          <div className="nf-territory-gap-rule" />
          <p className="nf-territory-gap-copy">Makes the material relationship between enterprise reality and changing market reality visible.</p>
        </div>
        <div className="nf-territory-output-chain">
          {outputChain.map((step, i) => (
            <div key={step} className="nf-territory-chain-step">
              <span>{step}</span>
              {i < outputChain.length - 1 && <div className="nf-territory-chain-arrow" aria-hidden="true">↓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Enterprise Reality */}
      <div className="nf-territory-side nf-territory-enterprise">
        <div className="nf-territory-inward-arrow nf-territory-inward-arrow-right" aria-hidden="true">←</div>
        <TerritoryPanel
          label="ENTERPRISE REALITY"
          sublabel="Existing systems and operations"
          items={enterpriseItems}
        />
      </div>

      <figcaption id="territory-visual-caption" className="nf-territory-caption">
        Existing systems describe parts of the enterprise. Market evidence describes change outside it. NexFrontier helps leadership understand the economically material relationship between the two.
      </figcaption>
    </figure>
  );
}
