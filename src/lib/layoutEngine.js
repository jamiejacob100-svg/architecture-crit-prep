// Pure layout engine — the browser equivalent of the skill's generate_layouts.py.
// Given classified drawings, it assigns them to boards and computes board
// compositions for four variants. All geometry is normalized to a 0..1 board
// so the same math drives both the on-screen preview and the PNG export.

// Broad-to-fine ordering rank by drawing type. Hook/concept images (perspective,
// diagram) lead; orthographics march site -> plan -> section/elevation -> detail.
export const TYPE_RANK = {
  perspective: -1,
  diagram: -0.5,
  site: 0,
  plan: 1,
  axo: 1.5,
  section: 2,
  elevation: 2,
  detail: 3,
};

export const HOOK_TYPES = ['perspective', 'diagram', 'axo'];

export const rankOf = (t) => (t in TYPE_RANK ? TYPE_RANK[t] : 1);

// Guess a drawing type from a filename — saves the student tagging every upload.
export function guessType(filename = '') {
  const f = filename.toLowerCase();
  if (/\bsite|location|context\b/.test(f)) return 'site';
  if (/\bdetail|junction|construction|wall.?section\b/.test(f)) return 'detail';
  if (/\bsection|sect\b/.test(f)) return 'section';
  if (/\belevation|elev\b/.test(f)) return 'elevation';
  if (/\baxo|isometric|exploded\b/.test(f)) return 'axo';
  if (/\bdiagram|parti|concept|sketch\b/.test(f)) return 'diagram';
  if (/\bperspective|persp|render|view|visual|interior|exterior\b/.test(f)) return 'perspective';
  if (/\bplan|floor|ground|roof\b/.test(f)) return 'plan';
  return 'plan';
}

const byRank = (a, b) => rankOf(a.type) - rankOf(b.type);

// Auto-assign drawings to boards: hook material leads on board 1, then
// orthographics by scale band. Boards are compacted so there are no gaps.
export function autoAssign(drawings) {
  const band = (t) => {
    if (HOOK_TYPES.includes(t)) return 1;
    if (t === 'site' || t === 'plan') return 2;
    if (t === 'section' || t === 'elevation') return 2;
    if (t === 'detail') return 3;
    return 2;
  };
  const raw = drawings.map((d) => ({ id: d.id, board: band(d.type) }));
  const used = [...new Set(raw.map((r) => r.board))].sort((a, b) => a - b);
  const remap = new Map(used.map((b, i) => [b, i + 1]));
  const out = {};
  raw.forEach((r) => { out[r.id] = remap.get(r.board); });
  return out; // { drawingId: boardNumber }
}

// Group drawings into boards (sorted), each board's drawings sorted by rank.
export function boardsFrom(drawings) {
  const map = new Map();
  drawings.forEach((d) => {
    const b = Number(d.board) || 1;
    if (!map.has(b)) map.set(b, []);
    map.get(b).push(d);
  });
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([num, items]) => ({ num, items: [...items].sort(byRank) }));
}

// Suggest the variant that best fits a board's contents.
export function suggestVariant(items, boardNum) {
  const hasHook = items.some((d) => HOOK_TYPES.includes(d.type));
  const orthos = items.filter((d) => !HOOK_TYPES.includes(d.type));
  if (boardNum === 1 && hasHook) return 'hero';
  if (orthos.length >= 2) return 'aligned';
  return 'linear';
}

// ---- geometry helpers (all in normalized 0..1 board space) ----

const LA = { x: 0.045, y: 0.045, w: 0.91, h: 0.83 }; // drawing area; below is the title block
const PAD = 0.012; // gutter inside each cell

const aspectOf = (d) => (d.naturalW && d.naturalH ? d.naturalW / d.naturalH : 1.414);

// Fit a drawing inside a cell, preserving aspect ratio, centered.
function contain(cell, d) {
  const cw = cell.w - PAD * 2;
  const ch = cell.h - PAD * 2;
  const a = aspectOf(d);
  const cellA = cw / ch;
  let w, h;
  if (a > cellA) { w = cw; h = cw / a; } else { h = ch; w = ch * a; }
  return {
    x: cell.x + PAD + (cw - w) / 2,
    y: cell.y + PAD + (ch - h) / 2,
    w,
    h,
  };
}

function gridCells(area, cols, rows) {
  const cw = area.w / cols;
  const ch = area.h / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: area.x + c * cw, y: area.y + r * ch, w: cw, h: ch });
    }
  }
  return cells;
}

function layoutLinear(items) {
  const n = items.length;
  if (n === 0) return [];
  const cols = n <= 4 ? n : Math.ceil(Math.sqrt(n * (LA.w / LA.h)));
  const rows = Math.ceil(n / cols);
  const cells = gridCells(LA, cols, rows);
  return items.map((d, i) => ({ d, rect: contain(cells[i], d) }));
}

function layoutGrouped(items) {
  if (items.length === 0) return [];
  const types = [...new Set(items.map((d) => d.type))].sort((a, b) => rankOf(a) - rankOf(b));
  const cols = types.length;
  const colW = LA.w / cols;
  const out = [];
  types.forEach((t, ci) => {
    const group = items.filter((d) => d.type === t);
    const rows = group.length;
    group.forEach((d, ri) => {
      const cell = { x: LA.x + ci * colW, y: LA.y + ri * (LA.h / rows), w: colW, h: LA.h / rows };
      out.push({ d, rect: contain(cell, d) });
    });
  });
  return out;
}

function layoutAligned(items) {
  if (items.length === 0) return [];
  const bandDefs = [
    ['perspective', 'diagram', 'axo'],
    ['site', 'plan'],
    ['section', 'elevation'],
    ['detail'],
  ];
  const bands = bandDefs
    .map((types) => items.filter((d) => types.includes(d.type)))
    .filter((g) => g.length > 0);
  const bandH = LA.h / bands.length;
  const out = [];
  bands.forEach((group, bi) => {
    const area = { x: LA.x, y: LA.y + bi * bandH, w: LA.w, h: bandH };
    const cells = gridCells(area, group.length, 1);
    group.forEach((d, i) => out.push({ d, rect: contain(cells[i], d) }));
  });
  return out;
}

function layoutHero(items) {
  if (items.length === 0) return [];
  if (items.length === 1) return [{ d: items[0], rect: contain(LA, items[0]) }];
  const hero =
    items.find((d) => d.hero) ||
    items.find((d) => d.type === 'perspective') ||
    items[0];
  const rest = items.filter((d) => d !== hero);
  const heroCell = { x: LA.x, y: LA.y, w: LA.w * 0.6, h: LA.h };
  const rightArea = { x: LA.x + LA.w * 0.63, y: LA.y, w: LA.w * 0.37, h: LA.h };
  const cols = rest.length > 4 ? 2 : 1;
  const rows = Math.ceil(rest.length / cols);
  const cells = gridCells(rightArea, cols, rows);
  const out = [{ d: hero, rect: contain(heroCell, hero) }];
  rest.forEach((d, i) => out.push({ d, rect: contain(cells[i], d) }));
  return out;
}

const VARIANTS = {
  linear: layoutLinear,
  grouped: layoutGrouped,
  aligned: layoutAligned,
  hero: layoutHero,
};

// Main entry: placements for a board's drawings under a chosen variant.
export function computeLayout(items, variant = 'linear') {
  const fn = VARIANTS[variant] || layoutLinear;
  return fn(items);
}

export const TITLE_BLOCK_Y = LA.y + LA.h + 0.02; // where the title strip starts

// ---- PNG export via the Canvas API (no dependencies, no tainting for blob URLs) ----

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderBoardToCanvas(items, variant, { projectName, boardNum, W = 1680, H = 1188 }) {
  const placements = computeLayout(items, variant);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // paper background + sheet border
  ctx.fillStyle = '#fbfaf5';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#c5bda8';
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  for (const p of placements) {
    try {
      const img = await loadImage(p.d.src);
      const x = p.rect.x * W, y = p.rect.y * H, w = p.rect.w * W, h = p.rect.h * H;
      ctx.drawImage(img, x, y, w, h);
      ctx.strokeStyle = '#79756a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      // caption under each drawing
      const cap = [p.d.label, p.d.scale].filter(Boolean).join('  ');
      if (cap) {
        ctx.fillStyle = '#1f1d18';
        ctx.font = '500 16px Helvetica, Arial, sans-serif';
        ctx.fillText(cap, x + 2, Math.min(y + h + 18, H - 60));
      }
    } catch {
      /* skip an image that failed to load */
    }
  }

  // title block
  const ty = TITLE_BLOCK_Y * H;
  ctx.strokeStyle = '#1f1d18';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(LA.x * W, ty);
  ctx.lineTo((LA.x + LA.w) * W, ty);
  ctx.stroke();
  ctx.fillStyle = '#1f1d18';
  ctx.font = '600 26px Georgia, serif';
  ctx.fillText(projectName || 'Untitled Project', LA.x * W, ty + 34);
  ctx.fillStyle = '#79756a';
  ctx.font = '500 16px Helvetica, Arial, sans-serif';
  ctx.fillText(`BOARD ${boardNum}  ·  ${variant.toUpperCase()} LAYOUT`, LA.x * W, ty + 58);

  return canvas;
}

export async function exportBoardPNG(items, variant, meta) {
  const canvas = await renderBoardToCanvas(items, variant, meta);
  const safe = (meta.projectName || 'crit').trim().replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'crit';
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safe}-board-${meta.boardNum}-${variant}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
