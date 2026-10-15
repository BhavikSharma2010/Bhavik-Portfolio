/**
 * Procedural "digital human" — a wireframe mesh portrait generated in code.
 * Original artwork (no image assets, deterministic for SSR). All coordinates
 * are rounded integers so server and client markup match exactly.
 */

const W = 420;
const H = 500;
const CX = 210;
const CY = 225;
const RX = 138;
const RY = 175;
const STEP = 26;

/** deterministic PRNG so SSR and client render identical jitter */
function makeRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** head silhouette: ellipse that tapers into a jaw/chin */
function headRowWidth(y: number): number {
  const t = (y - CY) / RY;
  if (t <= 0.15) return RX;
  // taper from 1 → 0.42 between forehead-bottom and chin
  const taper = 1 - Math.min(1, (t - 0.15) / 0.95) * 0.58;
  return RX * taper;
}

function isInside(x: number, y: number): boolean {
  const halfW = headRowWidth(y);
  const nx = (x - CX) / halfW;
  const ny = (y - CY) / RY;
  return nx * nx + ny * ny <= 1;
}

interface Node {
  x: number;
  y: number;
  col: number;
  row: number;
}

function buildMesh(): { nodes: Node[]; edges: [Node, Node][] } {
  const rand = makeRandom(20261015);
  const nodes: Node[] = [];
  const byCell = new Map<string, Node>();

  for (let row = 0; row * STEP <= RY * 2 + CY; row++) {
    for (let col = 0; col * STEP <= W; col++) {
      const jx = Math.round((rand() - 0.5) * STEP * 0.7);
      const jy = Math.round((rand() - 0.5) * STEP * 0.7);
      const x = col * STEP + jx;
      const y = CY - RY + row * STEP + jy;
      if (x < 8 || x > W - 8 || y < 8 || y > H - 8) continue;
      if (!isInside(x, y)) continue;
      const node: Node = { x, y, col, row };
      nodes.push(node);
      byCell.set(`${col},${row}`, node);
    }
  }

  const edges: [Node, Node][] = [];
  for (const node of nodes) {
    const right = byCell.get(`${node.col + 1},${node.row}`);
    const down = byCell.get(`${node.col},${node.row + 1}`);
    const downRight = byCell.get(`${node.col + 1},${node.row + 1}`);
    if (right) edges.push([node, right]);
    if (down) edges.push([node, down]);
    // alternating diagonals → triangulated look
    if (downRight && (node.col + node.row) % 2 === 0) edges.push([node, downRight]);
    const downLeft = byCell.get(`${node.col - 1},${node.row + 1}`);
    if (downLeft && (node.col + node.row) % 2 === 1) edges.push([node, downLeft]);
  }
  return { nodes, edges };
}

const { nodes, edges } = buildMesh();
const DOTS = nodes.filter((_, i) => i % 3 === 0);

export function HeroFaceArt() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Wireframe digital portrait"
    >
      <defs>
        <radialGradient id="faceGlow" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#1ed760" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#1ed760" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#faceGlow)" />

      {/* mesh edges — brighter toward the front of the face */}
      <g stroke="#1ed760" strokeWidth="1" fill="none">
        {edges.map(([a, b], i) => {
          const depth = 1 - Math.min(1, Math.abs(a.x + b.x) / (2 * W) + Math.abs(a.y - CY) / (2 * RY) * 0.35);
          const opacity = 0.14 + depth * 0.3;
          return (
            <line
              key={`e${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              opacity={Math.round(opacity * 100) / 100}
            />
          );
        })}
      </g>

      {/* vertex dots */}
      <g fill="#3ce477">
        {DOTS.map((n, i) => (
          <circle key={`d${i}`} cx={n.x} cy={n.y} r="1.4" opacity="0.55" />
        ))}
      </g>

      {/* eyes — the focal point */}
      <g stroke="#7df0a8" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d={`M ${CX - 78} ${CY - 28} Q ${CX - 52} ${CY - 48} ${CX - 22} ${CY - 26} Q ${CX - 50} ${CY - 12} ${CX - 78} ${CY - 28} Z`} />
        <path d={`M ${CX + 78} ${CY - 28} Q ${CX + 52} ${CY - 48} ${CX + 22} ${CY - 26} Q ${CX + 50} ${CY - 12} ${CX + 78} ${CY - 28} Z`} />
      </g>
      {/* brow hints */}
      <g stroke="#1ed760" strokeWidth="1.4" opacity="0.5" fill="none" strokeLinecap="round">
        <path d={`M ${CX - 84} ${CY - 56} Q ${CX - 52} ${CY - 72} ${CX - 20} ${CY - 56}`} />
        <path d={`M ${CX + 84} ${CY - 56} Q ${CX + 52} ${CY - 72} ${CX + 20} ${CY - 56}`} />
        {/* nose */}
        <path d={`M ${CX} ${CY - 20} L ${CX - 8} ${CY + 44} Q ${CX} ${CY + 54} ${CX + 8} ${CY + 44}`} opacity="0.45" />
        {/* lips */}
        <path d={`M ${CX - 34} ${CY + 92} Q ${CX} ${CY + 82} ${CX + 34} ${CY + 92}`} />
        <path d={`M ${CX - 26} ${CY + 106} Q ${CX} ${CY + 116} ${CX + 26} ${CY + 106}`} opacity="0.6" />
      </g>

      {/* headphones hint — this is an album, after all */}
      <path
        d={`M ${CX - RX - 14} ${CY - 20} C ${CX - RX - 20} ${CY - 170} ${CX + RX + 20} ${CY - 170} ${CX + RX + 14} ${CY - 20}`}
        stroke="#f5f5f7"
        strokeWidth="5"
        fill="none"
        opacity="0.28"
        strokeLinecap="round"
      />
      <rect x={CX - RX - 26} y={CY - 24} width="22" height="52" rx="9" fill="#f5f5f7" opacity="0.32" />
      <rect x={CX + RX + 4} y={CY - 24} width="22" height="52" rx="9" fill="#f5f5f7" opacity="0.32" />
    </svg>
  );
}
