const NODES = ['Evidence', 'Understand', 'Decide', 'Adapt', 'Learn', 'New evidence'];
const CX = 200;
const CY = 200;
const R = 140;
const LABEL_R = 176;
const DOT_R = 4.5;

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function arrowhead(angleDeg: number): string {
  const pos = polar(angleDeg, R);
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const tx = -Math.sin(rad);
  const ty = Math.cos(rad);
  const px = -ty;
  const py = tx;
  const tip = { x: pos.x + 5 * tx, y: pos.y + 5 * ty };
  const baseL = { x: pos.x - 2 * tx + 3 * px, y: pos.y - 2 * ty + 3 * py };
  const baseR = { x: pos.x - 2 * tx - 3 * px, y: pos.y - 2 * ty - 3 * py };
  return `${tip.x},${tip.y} ${baseL.x},${baseL.y} ${baseR.x},${baseR.y}`;
}

function textAnchor(angleDeg: number): 'start' | 'middle' | 'end' {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a > 45 && a < 135) return 'start';
  if (a > 225 && a < 315) return 'end';
  return 'middle';
}

function labelDy(angleDeg: number): number {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a < 45 || a > 315) return -8;
  if (a >= 135 && a <= 225) return 16;
  return 5;
}

export function EvidenceFlywheel() {
  return (
    <div className="nf-flywheel-wrap">
      <svg viewBox="0 0 400 400" className="nf-flywheel" role="img" aria-label="Circular evidence loop: Evidence, Understand, Decide, Adapt, Learn, New evidence, returning to Evidence. Centre label: Strategic meaning.">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--nf-cyan)" strokeWidth={1.5} opacity={0.5} />

        {NODES.map((_, i) => {
          const midAngle = i * 60 + 30;
          return <polygon key={`arrow-${i}`} points={arrowhead(midAngle)} fill="var(--nf-cyan)" opacity={0.7} />;
        })}

        {NODES.map((label, i) => {
          const angle = i * 60;
          const pos = polar(angle, R);
          const labelPos = polar(angle, LABEL_R);
          return (
            <g key={`node-${i}`}>
              <circle cx={pos.x} cy={pos.y} r={DOT_R} fill="var(--nf-cyan)" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor={textAnchor(angle)}
                dy={labelDy(angle)}
                fill="#e8edef"
                fontSize="15"
                fontWeight="500"
                fontFamily="var(--font-inter, sans-serif)"
              >
                {label}
              </text>
            </g>
          );
        })}

        <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--nf-cyan)" fontSize="18" fontWeight="600" fontFamily="var(--font-inter, sans-serif)">
          Strategic
        </text>
        <text x={CX} y={CY + 16} textAnchor="middle" fill="var(--nf-cyan)" fontSize="18" fontWeight="600" fontFamily="var(--font-inter, sans-serif)">
          meaning
        </text>
      </svg>
    </div>
  );
}
