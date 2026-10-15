/**
 * Stylized hero mask, drawn entirely in SVG — no image assets.
 * Original design (web pattern + angular lenses); deliberately not any
 * existing character's likeness.
 */

const FACE_PATH =
  "M100 8 C150 8 186 46 186 102 C186 162 148 208 100 232 C52 208 14 162 14 102 C14 46 50 8 100 8 Z";

const RAYS = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);
const RINGS = [20, 40, 60, 80, 100, 120];

/** Integer coords so server and client render identical markup (no hydration mismatch). */
function rayEndpoint(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(100 + 220 * Math.cos(rad)),
    y: Math.round(118 + 220 * Math.sin(rad)),
  };
}

export function HeroMask() {
  return (
    <svg
      viewBox="0 0 200 240"
      width="100%"
      height="100%"
      role="img"
      aria-label="Stylized hero mask"
    >
      <defs>
        <radialGradient id="maskRed" cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#e53045" />
          <stop offset="62%" stopColor="#c01f33" />
          <stop offset="100%" stopColor="#7c0f1e" />
        </radialGradient>
        <clipPath id="faceClip">
          <path d={FACE_PATH} />
        </clipPath>
      </defs>

      {/* head */}
      <path d={FACE_PATH} fill="url(#maskRed)" />

      {/* webbing: rays + rings, clipped to the face */}
      <g clipPath="url(#faceClip)" stroke="#5f0a16" strokeWidth="1.4" opacity="0.6" fill="none">
        <g>
          {RAYS.map((angle) => {
            const end = rayEndpoint(angle);
            return (
              <line
                key={`ray-${angle}`}
                x1="100"
                y1="118"
                x2={end.x}
                y2={end.y}
              />
            );
          })}
        </g>
        <g>
          {RINGS.map((r) => (
            <circle key={`ring-${r}`} cx="100" cy="118" r={r} />
          ))}
        </g>
      </g>

      {/* lenses — big angular teardrops */}
      <path
        d="M34 96 C40 70 72 60 90 78 C100 90 96 112 80 124 C58 136 30 126 34 96 Z"
        fill="#f4f5f7"
        stroke="#0a0a0f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M166 96 C160 70 128 60 110 78 C100 90 104 112 120 124 C142 136 170 126 166 96 Z"
        fill="#f4f5f7"
        stroke="#0a0a0f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* lens glints */}
      <path d="M48 88 C56 76 72 72 82 78" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M152 88 C144 76 128 72 118 78" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}
