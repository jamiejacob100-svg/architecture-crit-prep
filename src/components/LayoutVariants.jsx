import { LAYOUT_VARIANTS } from '../data/content.js';

// Tiny schematic SVGs illustrating each board-layout variant from the generator.
const R = (x, y, w, h, fill, stroke = 'var(--line-2)') => (
  <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
);

const blue = 'var(--blue-soft)';
const ochre = 'var(--ochre-soft)';
const plain = 'var(--paper-2)';

function Diagram({ id }) {
  const board = <rect x="1" y="1" width="158" height="98" rx="4" fill="var(--card)" stroke="var(--line-2)" />;
  switch (id) {
    case 'linear': // row in scale order, growing slightly
      return (
        <svg viewBox="0 0 160 100" className="board-svg">
          {board}
          {R(12, 35, 24, 24, plain)}
          {R(44, 30, 30, 34, blue)}
          {R(82, 26, 34, 42, blue)}
          {R(124, 22, 26, 50, ochre)}
        </svg>
      );
    case 'grouped': // columns by type
      return (
        <svg viewBox="0 0 160 100" className="board-svg">
          {board}
          {R(14, 16, 30, 30, plain)}{R(14, 54, 30, 30, plain)}
          {R(64, 16, 30, 30, blue)}{R(64, 54, 30, 30, blue)}
          {R(114, 16, 30, 68, ochre)}
        </svg>
      );
    case 'aligned': // plans top, sections below, details last
      return (
        <svg viewBox="0 0 160 100" className="board-svg">
          {board}
          {R(14, 14, 40, 28, plain)}{R(60, 14, 40, 28, plain)}
          {R(14, 50, 40, 24, blue)}{R(60, 50, 40, 24, blue)}
          {R(112, 14, 34, 60, ochre)}
          <line x1="34" y1="42" x2="34" y2="50" stroke="var(--ochre)" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="80" y1="42" x2="80" y2="50" stroke="var(--ochre)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'hero': // one big lead + supporting
      return (
        <svg viewBox="0 0 160 100" className="board-svg">
          {board}
          {R(12, 16, 84, 68, blue)}
          {R(108, 16, 40, 20, plain)}{R(108, 40, 40, 20, plain)}{R(108, 64, 40, 20, ochre)}
        </svg>
      );
    default:
      return null;
  }
}

export default function LayoutVariants() {
  return (
    <div className="variant-grid">
      {LAYOUT_VARIANTS.map((v) => (
        <div className="variant" key={v.id}>
          <Diagram id={v.id} />
          <h4>{v.name}</h4>
          <p>{v.d}</p>
        </div>
      ))}
    </div>
  );
}
