const CYAN = '#0CC0DF';
const CYAN_DIM = 'rgba(12,192,223,0.35)';
const CYAN_GLOW = 'rgba(12,192,223,0.12)';
const TEXT_PRIMARY = '#F7F9FA';
const TEXT_TERTIARY = '#959FA6';
const SURFACE = '#0C0E10';
const BORDER = 'rgba(12,192,223,0.10)';

type FlowNode = { id: string; label: string; x: number; y: number; desc: string };

const FLOW_NODES: FlowNode[] = [
  { id: 'market',   label: 'AI-mediated Market',   x: 95,  y: 80,  desc: 'How markets are changing' },
  { id: 'reality',  label: 'Enterprise Reality',    x: 585, y: 80,  desc: 'Where the enterprise is' },
  { id: 'gap',      label: 'Alignment Gap',         x: 620, y: 230, desc: 'The divergence' },
  { id: 'value',    label: 'Enterprise Value',      x: 585, y: 380, desc: 'Economic consequence' },
  { id: 'next',     label: 'What Changes Next',    x: 95,  y: 380, desc: 'Where to steer' },
];

const NODE_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
];

export function BrainVisual({ compact = false }: { compact?: boolean }) {
  const viewBoxW = 700;
  const viewBoxH = 460;
  const brainCx = 340;
  const brainCy = 230;
  const brainR = compact ? 56 : 68;

  return (
    <div className="nf-hero-visual" aria-label="NexFrontier intelligence connects market change to enterprise consequence" style={{
      position: 'relative',
      width: '100%',
      height: compact ? 360 : 460,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      isolation: 'isolate',
    }}>
      <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} role="presentation" style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        maxWidth: compact ? 600 : 780,
      }}>
        <defs>
          <radialGradient id="nf-brain-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CYAN_GLOW} stopOpacity="0.9" />
            <stop offset="55%" stopColor={CYAN_GLOW} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="nf-signal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={CYAN_DIM} stopOpacity="0.25" />
            <stop offset="50%" stopColor={CYAN} stopOpacity="0.85" />
            <stop offset="100%" stopColor={CYAN_DIM} stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="nf-feedback-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={CYAN_DIM} stopOpacity="0.1" />
            <stop offset="50%" stopColor={CYAN} stopOpacity="0.3" />
            <stop offset="100%" stopColor={CYAN_DIM} stopOpacity="0.1" />
          </linearGradient>
          <marker id="nf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* Intelligence field — soft radial glow behind the brain */}
        <circle cx={brainCx} cy={brainCy} r="185" fill="url(#nf-brain-glow)" />

        {/* Single subtle orbital ring */}
        <circle cx={brainCx} cy={brainCy} r="135" fill="none" stroke={BORDER} strokeWidth="1" strokeDasharray="1 10" opacity="0.5" />

        {/* Flow connection arcs between sequential nodes */}
        {NODE_CONNECTIONS.map(([fromIdx, toIdx], i) => {
          const from = FLOW_NODES[fromIdx];
          const to = FLOW_NODES[toIdx];
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const perpX = -dy * 0.12;
          const perpY = dx * 0.12;
          return (
            <path
              key={`flow-${i}`}
              d={`M ${from.x} ${from.y} Q ${midX + perpX} ${midY + perpY} ${to.x} ${to.y}`}
              fill="none"
              stroke="url(#nf-signal-grad)"
              strokeWidth="1.8"
              opacity="0.65"
              markerEnd="url(#nf-arrow)"
            />
          );
        })}

        {/* Subtle feedback arc — unlabeled learning return from Value to Market */}
        <path
          d={`M ${FLOW_NODES[4].x + 10} ${FLOW_NODES[4].y - 5} C 20 ${brainCy + 40}, 20 ${brainCy - 60}, ${FLOW_NODES[0].x + 10} ${FLOW_NODES[0].y + 5}`}
          fill="none"
          stroke="url(#nf-feedback-grad)"
          strokeWidth="1"
          strokeDasharray="3 7"
          opacity="0.3"
        />

        {/* The Brain — central intelligence node */}
        <circle cx={brainCx} cy={brainCy} r={brainR + 8} fill="none" stroke={CYAN} strokeWidth="0.5" opacity="0.25" style={{ filter: 'blur(8px)' }} />
        <circle cx={brainCx} cy={brainCy} r={brainR} fill={SURFACE} stroke={CYAN} strokeWidth="2" opacity="0.95" />
        {/* Neural suggestion — subtle internal lines */}
        <path d={`M ${brainCx - 26} ${brainCy - 14} Q ${brainCx} ${brainCy - 30}, ${brainCx + 26} ${brainCy - 14}`} fill="none" stroke={CYAN_DIM} strokeWidth="1" opacity="0.45" />
        <path d={`M ${brainCx - 20} ${brainCy + 8} Q ${brainCx} ${brainCy + 24}, ${brainCx + 20} ${brainCy + 8}`} fill="none" stroke={CYAN_DIM} strokeWidth="1" opacity="0.35" />
        <line x1={brainCx - 28} y1={brainCy} x2={brainCx + 28} y2={brainCy} stroke={CYAN_DIM} strokeWidth="0.6" opacity="0.25" />
        {/* Pulsing core */}
        <circle cx={brainCx} cy={brainCy} r="9" fill={CYAN} style={{ filter: `drop-shadow(0 0 16px ${CYAN})` }}>
          <animate attributeName="r" values="8;10;8" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.85;1;0.85" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Flow nodes */}
        {FLOW_NODES.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="14" fill={SURFACE} stroke={CYAN} strokeWidth="1" opacity="0.85" />
            <circle cx={node.x} cy={node.y} r="4" fill={CYAN} opacity="0.8" style={{ filter: `drop-shadow(0 0 5px ${CYAN_DIM})` }} />
            <text
              x={node.x}
              y={node.y - 24}
              textAnchor="middle"
              fill={TEXT_PRIMARY}
              fontSize="12"
              fontWeight="600"
              letterSpacing="0.03em"
            >
              {node.label}
            </text>
            <text
              x={node.x}
              y={node.y + 32}
              textAnchor="middle"
              fill={TEXT_TERTIARY}
              fontSize="9.5"
              fontWeight="400"
            >
              {node.desc}
            </text>
          </g>
        ))}
      </svg>

      {/* Brain label overlay */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: compact ? '49%' : '48%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1px',
        pointerEvents: 'none',
      }}>
        <div style={{
          color: CYAN,
          fontSize: '0.6875rem',
          letterSpacing: '0.14em',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          textShadow: '0 0 12px rgba(12,192,223,0.6)',
        }}>
          THE BRAIN
        </div>
        <div style={{
          color: TEXT_TERTIARY,
          fontSize: '0.5625rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          opacity: 0.65,
        }}>
          intelligence layer
        </div>
      </div>
    </div>
  );
}
