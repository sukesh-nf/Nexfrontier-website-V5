import { ArrowRight } from 'lucide-react';

export function IntelligenceRelationshipVisual() {
  return (
    <div className="nf-intel-rel">
      <div className="nf-intel-rel-step">
        <h3>Operational Observability</h3>
        <p>Evidence across the operating enterprise and its changing market</p>
      </div>
      <ArrowRight size={22} className="nf-intel-rel-arrow" />
      <div className="nf-intel-rel-step">
        <h3>Strategic Visibility</h3>
        <p>Makes the material relationship visible to leadership</p>
      </div>
      <ArrowRight size={22} className="nf-intel-rel-arrow" />
      <div className="nf-intel-rel-step">
        <h3>Enterprise Navigational Intelligence</h3>
        <p>Interprets what the evidence means and where to steer</p>
      </div>
      <ArrowRight size={22} className="nf-intel-rel-arrow" />
      <div className="nf-intel-rel-step nf-intel-rel-step--ev">
        <h3>Enterprise Value</h3>
        <p>Where the consequence becomes commercially meaningful</p>
        <div className="nf-intel-rel-ev-cards">
          <div className="nf-intel-rel-ev-card">
            <h4>Quiet Loss&trade;</h4>
          </div>
          <div className="nf-intel-rel-ev-card">
            <h4>Adaptive Value&trade;</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
