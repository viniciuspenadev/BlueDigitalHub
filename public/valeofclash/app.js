(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 1000;
  const HEIGHT = 1000;
  const DEFAULT_MAP = 'mapa-vale-of-clash.webp';
  const COLORS = ['#7ed7c2', '#f4b86e', '#b99add', '#f07d83', '#6fb3ff', '#b5e06a', '#ff8fd1', '#eef2f0'];
  const FALLBACK_COLOR = '#d6b978';
  const MAX_PARTIES = 8;
  const GROUPS = 4;
  const NAME_LIMIT = 24;
  const FIELDS = ['main', 'secondary'];
  const ITEM_TYPES = ['route', 'pen', 'token', 'text'];
  // Pontinhos que percorrem as rotas: velocidade em unidades do mapa por segundo, tempos em segundos.
  const WALK_SPEED = 55;
  const WALK_PAUSE = 1.6;
  const WALK_LAG = 0.5;
  const WALK_SPACING = 20;
  // Locais fixos do mapa: valem para as 3 fases do campo.
  const LANDMARKS = {
    'pillar-b': { name: 'Pilar de Cristal B', title: 'B-Tier Crystal Pillar', letter: 'B' },
    'pillar-a': { name: 'Pilar de Cristal A', title: 'A-Tier Crystal Pillar', letter: 'A' },
    'pillar-s': { name: 'Pilar de Cristal S', title: 'S-Tier Crystal Pillar', letter: 'S' }
  };
  // Locais possíveis dos pilares, alinhados ao mapa a partir do vídeo do modo (1:01–1:20).
  const DEFAULT_PILLARS = [
    ['S1', 'pillar-s', 502, 443],
    ['A1', 'pillar-a', 349, 273], ['A2', 'pillar-a', 620, 308], ['A3', 'pillar-a', 672, 605],
    ['A4', 'pillar-a', 386, 709], ['A5', 'pillar-a', 324, 522], ['A6', 'pillar-a', 350, 392],
    ['B1', 'pillar-b', 387, 164], ['B2', 'pillar-b', 612, 142], ['B3', 'pillar-b', 790, 328],
    ['B4', 'pillar-b', 810, 471], ['B5', 'pillar-b', 856, 608], ['B6', 'pillar-b', 657, 794],
    ['B7', 'pillar-b', 459, 602], ['B8', 'pillar-b', 180, 592], ['B9', 'pillar-b', 211, 365]
  ];
  // Campo principal soma pontos (meta 3.000); o secundário gera moral para o principal. "rate" é a cada 3 s.
  const PILLAR_POINTS = {
    main: { 'pillar-b': { unseal: 20, occupy: 60, rate: 3 }, 'pillar-a': { unseal: 30, occupy: 100, rate: 5 }, 'pillar-s': { unseal: 50, occupy: 200, rate: 10 } },
    secondary: { 'pillar-b': { unseal: 30, occupy: 80, rate: 4 }, 'pillar-a': { unseal: 50, occupy: 120, rate: 6 }, 'pillar-s': { unseal: 80, occupy: 160, rate: 8 } }
  };
  const MAIN_GOAL = 3000;
  const MORALE_STEPS = [1000, 2000, 3000];
  const TEAMS = { dawn: { name: 'Dawn', color: '#8be04e' }, lush: { name: 'Lush', color: '#ff7a3d' } };
  const PILLAR_STATES = ['dawn', 'lush', 'off'];
  const TOOL_HELP = {
    select: 'Clique em um elemento para selecioná-lo e arraste para mover. Delete apaga o selecionado.',
    arrow: 'Arraste no mapa para traçar a rota das PTs selecionadas. Segure Shift para uma linha reta.',
    pen: 'Arraste no mapa para desenhar livremente.',
    token: 'Clique no mapa para posicionar as PTs selecionadas.',
    text: 'Digite a anotação no painel e clique no mapa para posicioná-la.',
    place: 'Escolha um pilar em “Locais do mapa” e clique no mapa para posicioná-lo.',
    laser: 'Mova o ponteiro sobre o mapa para apontar sem alterar o plano.',
    eraser: 'Clique em uma rota, PT, anotação ou pilar para apagar.',
    pan: 'Arraste o mapa para navegar. Use + e − para controlar o zoom.'
  };

  const board = document.querySelector('#board');
  const boardFrame = document.querySelector('.board-frame');
  const mapPlane = document.querySelector('#map-plane');
  const mapImage = document.querySelector('#map-image');
  const status = document.querySelector('#status');
  const notesInput = document.querySelector('#phase-notes');
  const textInput = document.querySelector('#annotation-text');
  const mapBadge = document.querySelector('#map-badge');
  const mapCredit = document.querySelector('#map-credit');
  const partyList = document.querySelector('#party-list');
  const groupChips = document.querySelector('#group-chips');
  const addPartyButton = document.querySelector('#add-party');
  const placeList = document.querySelector('#place-list');
  const pillarInspector = document.querySelector('#pillar-inspector');
  const pillarTitle = document.querySelector('#pillar-title');
  const pillarStates = document.querySelector('#pillar-states');
  const scoreBoard = document.querySelector('#score');
  const scoreHint = document.querySelector('#score-hint');

  function defaultParties() {
    return Array.from({ length: MAX_PARTIES }, (_, i) => ({ id: `pt${i + 1}`, name: `PT ${i + 1}`, color: COLORS[i], group: i < MAX_PARTIES / 2 ? 1 : 2 }));
  }
  const defaultLandmarks = () => DEFAULT_PILLARS.map(([label, kind, x, y]) => ({ id: label, kind, label, x, y }));
  function freshPlan() {
    const phases = () => Array.from({ length: 3 }, () => ({ notes: '', items: [], pillars: {} }));
    return { version: 3, maps: { main: null, secondary: null }, parties: defaultParties(), landmarks: { main: defaultLandmarks(), secondary: defaultLandmarks() }, fields: { main: phases(), secondary: phases() } };
  }

  let plan = freshPlan();
  let field = 'main';
  let phase = 0;
  let tool = 'select';
  let selectedParties = [plan.parties[0].id];
  let placeKind = 'pillar-b';
  let selectedId = null;
  let interaction = null;
  let view = { x: 0, y: 0, w: WIDTH, h: HEIGHT };
  let undoStack = [];
  let redoStack = [];
  let laserTimer = null;
  let laserCircle = null;
  let idCounter = 0;
  let walkSignature = '';
  let nameSnapshot = null;

  const current = () => plan.fields[field][phase];
  const landmarks = () => plan.landmarks[field];
  const findItem = id => current().items.find(item => item.id === id) || landmarks().find(item => item.id === id) || null;
  const selectedPillar = () => landmarks().find(item => item.id === selectedId) || null;
  function deleteItem(id) {
    current().items = current().items.filter(item => item.id !== id);
    if (!landmarks().some(item => item.id === id)) return;
    plan.landmarks[field] = landmarks().filter(item => item.id !== id);
    for (const phaseData of plan.fields[field]) delete phaseData.pillars?.[id];
  }
  const svg = (name, attributes = {}) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  };
  const nextId = () => `item-${Date.now().toString(36)}-${++idCounter}`;
  const finite = (n, fallback = 0) => Number.isFinite(Number(n)) ? Number(n) : fallback;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const round = n => Math.round(n * 10) / 10;
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const pathLength = points => points.reduce((total, p, i) => i ? total + distance(points[i - 1], p) : 0, 0);

  const partyById = id => plan.parties.find(party => party.id === id);
  const itemParties = item => (item.parties || []).map(partyById).filter(Boolean);
  const itemColor = item => itemParties(item)[0]?.color || FALLBACK_COLOR;
  const partyNames = parties => parties.map(party => party.name).join(', ');
  function activeParties() {
    const list = plan.parties.filter(party => selectedParties.includes(party.id));
    const result = list.length ? list : plan.parties.slice(0, 1);
    selectedParties = result.map(party => party.id);
    return result;
  }
  function describeSelection() {
    const parties = activeParties();
    if (parties.length === 1) return `${parties[0].name} selecionada. Rotas e marcadores usarão sua cor.`;
    return `${parties.length} PTs juntas (${partyNames(parties)}): na mesma rota, os pontinhos andam juntos.`;
  }

  function setStatus(message) { status.textContent = message; }
  function remember() {
    undoStack.push(JSON.stringify(plan));
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
    updateHistoryButtons();
  }
  function updateHistoryButtons() {
    document.querySelector('#undo').disabled = undoStack.length === 0;
    document.querySelector('#redo').disabled = redoStack.length === 0;
  }
  function undo() {
    if (!undoStack.length) return;
    redoStack.push(JSON.stringify(plan));
    plan = JSON.parse(undoStack.pop());
    selectedId = null;
    render();
    setStatus('Última alteração desfeita.');
  }
  function redo() {
    if (!redoStack.length) return;
    undoStack.push(JSON.stringify(plan));
    plan = JSON.parse(redoStack.pop());
    selectedId = null;
    render();
    setStatus('Alteração refeita.');
  }

  function resetView() {
    view = { x: 0, y: 0, w: WIDTH, h: HEIGHT };
    applyView();
  }
  function applyView() {
    board.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    document.querySelector('#zoom-level').textContent = `${Math.round(WIDTH / view.w * 100)}%`;
    const rect = board.getBoundingClientRect();
    const frameRect = boardFrame.getBoundingClientRect();
    const scale = Math.min(rect.width / view.w, rect.height / view.h);
    const x = rect.left - frameRect.left + (rect.width - view.w * scale) / 2 - view.x * scale;
    const y = rect.top - frameRect.top + (rect.height - view.h * scale) / 2 - view.y * scale;
    Object.assign(mapPlane.style, { left: `${x}px`, top: `${y}px`, width: `${WIDTH * scale}px`, height: `${HEIGHT * scale}px` });
  }
  function zoom(factor) {
    const newW = clamp(view.w / factor, 300, 1500);
    const newH = newW * HEIGHT / WIDTH;
    view.x += (view.w - newW) / 2;
    view.y += (view.h - newH) / 2;
    view.w = newW;
    view.h = newH;
    applyView();
  }
  function point(event) {
    const p = board.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const mapped = p.matrixTransform(board.getScreenCTM().inverse());
    return { x: clamp(mapped.x, 0, WIDTH), y: clamp(mapped.y, 0, HEIGHT) };
  }

  // Ramer–Douglas–Peucker: tira o tremido do traço à mão mantendo as curvas.
  function simplify(points, tolerance = 4) {
    if (points.length < 3) return points.slice();
    const keep = new Uint8Array(points.length);
    keep[0] = keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
      const [first, last] = stack.pop();
      const a = points[first];
      const b = points[last];
      const length = distance(a, b);
      let index = -1;
      let max = tolerance;
      for (let i = first + 1; i < last; i++) {
        const p = points[i];
        const d = length ? Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / length : distance(a, p);
        if (d > max) { max = d; index = i; }
      }
      if (index > -1) { keep[index] = 1; stack.push([first, index], [index, last]); }
    }
    return points.filter((_, i) => keep[i]);
  }
  function trimEnd(points, amount) {
    const result = points.slice();
    let left = amount;
    while (result.length > 1) {
      const end = result[result.length - 1];
      const prev = result[result.length - 2];
      const segment = distance(prev, end);
      if (segment > left) {
        const t = left / segment;
        result[result.length - 1] = { x: end.x + (prev.x - end.x) * t, y: end.y + (prev.y - end.y) * t };
        return result;
      }
      left -= segment;
      result.pop();
    }
    return result;
  }
  function smoothPath(points) {
    const p = points.map(({ x, y }) => ({ x: round(x), y: round(y) }));
    let d = `M${p[0].x},${p[0].y}`;
    if (p.length === 2) return `${d} L${p[1].x},${p[1].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] || p2;
      d += ` C${round(p1.x + (p2.x - p0.x) / 6)},${round(p1.y + (p2.y - p0.y) / 6)} ${round(p2.x - (p3.x - p1.x) / 6)},${round(p2.y - (p3.y - p1.y) / 6)} ${p2.x},${p2.y}`;
    }
    return d;
  }
  function routePoints(state) {
    const raw = distance(state.points.at(-1), state.end) > .5 ? [...state.points, state.end] : state.points;
    const points = state.straight ? [state.points[0], state.end] : simplify(raw);
    return points.map(p => ({ x: round(p.x), y: round(p.y) }));
  }

  function base() {
    board.replaceChildren();
    mapImage.src = plan.maps[field] || DEFAULT_MAP;
    mapBadge.textContent = `${field === 'main' ? 'Campo principal' : 'Campo secundário'} · ${plan.maps[field] ? 'mapa importado' : 'mapa real'}`;
    mapCredit.textContent = 'Captura da guild · indicadores da partida podem variar';
    mapCredit.hidden = Boolean(plan.maps[field]);
  }

  function drawRoute(item, parent, draft = false) {
    const parties = itemParties(item);
    const colors = parties.length ? parties.map(party => party.color) : [FALLBACK_COLOR];
    const points = item.points;
    const g = svg('g', { 'data-ann-id': item.id || '', opacity: draft ? .7 : 1 });
    const tip = points.at(-1);
    const trimmed = pathLength(points) > 36;
    const line = trimmed ? trimEnd(points, 20) : points;
    const from = trimmed ? line.at(-1) : points.at(-2);
    const length = distance(from, tip) || 1;
    const ux = (tip.x - from.x) / length;
    const uy = (tip.y - from.y) / length;
    const baseX = tip.x - ux * 23;
    const baseY = tip.y - uy * 23;
    const d = smoothPath(line);
    const dash = 16;
    const period = dash + 9;
    g.append(svg('path', { d, fill: 'none', stroke: '#071411', 'stroke-opacity': .55, 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'data-route-path': '' }));
    // Várias PTs na mesma rota alternam as cores do tracejado.
    colors.forEach((color, i) => g.append(svg('path', { d, fill: 'none', stroke: color, 'stroke-width': 6, 'stroke-dasharray': `${dash} ${colors.length * period - dash}`, 'stroke-dashoffset': -i * period })));
    g.append(svg('circle', { cx: points[0].x, cy: points[0].y, r: 7, fill: colors[0], stroke: '#071411', 'stroke-width': 2.5 }));
    g.append(svg('path', { d: `M${round(tip.x)},${round(tip.y)} L${round(baseX - uy * 12)},${round(baseY + ux * 12)} L${round(baseX + uy * 12)},${round(baseY - ux * 12)} Z`, fill: colors[0], stroke: '#071411', 'stroke-width': 2 }));
    parent.append(g);
    return g;
  }
  function drawPen(item, parent, draft = false) {
    const g = svg('g', { 'data-ann-id': item.id || '', opacity: draft ? .7 : 1 });
    const points = item.points.map(p => `${p.x},${p.y}`).join(' ');
    g.append(svg('polyline', { points, fill: 'none', stroke: '#071411', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    g.append(svg('polyline', { points, fill: 'none', stroke: itemColor(item), 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    parent.append(g);
    return g;
  }
  function tokenLabel(parties) {
    const full = parties.map(party => party.name).join(' + ');
    return full.length <= 30 || parties.length < 2 ? full : `${parties[0].name} +${parties.length - 1}`;
  }
  function drawToken(item, parent) {
    const parties = itemParties(item);
    if (!parties.length) return null;
    const g = svg('g', { 'data-ann-id': item.id, transform: `translate(${item.x} ${item.y})` });
    const step = 26;
    const startX = -(parties.length - 1) * step / 2;
    parties.forEach((_, i) => g.append(svg('circle', { cx: startX + i * step, r: 22, fill: '#071411', opacity: .5 })));
    parties.forEach((party, i) => {
      const cx = startX + i * step;
      g.append(svg('circle', { cx, r: 17, fill: party.color, stroke: '#ecf5ea', 'stroke-width': 2 }));
      const number = svg('text', { x: cx, y: 5.5, 'text-anchor': 'middle', fill: '#10201c', 'font-size': 15, 'font-weight': 800, 'font-family': 'system-ui, sans-serif' });
      number.textContent = plan.parties.indexOf(party) + 1;
      g.append(number);
    });
    const pill = svg('rect', { y: 25, height: 25, rx: 6, fill: '#081816', 'fill-opacity': .9, stroke: parties[0].color, 'stroke-width': 1.5 });
    const label = svg('text', { x: 0, y: 43, 'text-anchor': 'middle', fill: '#f3f7f1', 'font-size': 15, 'font-weight': 700, 'font-family': 'system-ui, sans-serif' });
    label.textContent = tokenLabel(parties);
    g.append(pill, label);
    parent.append(g);
    const width = (label.getComputedTextLength() || label.textContent.length * 8.4) + 18;
    pill.setAttribute('x', -width / 2);
    pill.setAttribute('width', width);
    return g;
  }
  function drawText(item, parent) {
    const g = svg('g', { 'data-ann-id': item.id, transform: `translate(${item.x} ${item.y})` });
    const width = clamp(item.text.length * 12 + 26, 100, 680);
    g.append(svg('rect', { x: 0, y: -27, width, height: 39, rx: 7, fill: '#081816', 'fill-opacity': .9, stroke: itemColor(item), 'stroke-width': 2 }));
    const t = svg('text', { x: 13, y: 0, fill: '#f3f7f1', 'font-size': 20, 'font-family': 'system-ui, sans-serif' });
    t.textContent = item.text;
    g.append(t);
    parent.append(g);
    return g;
  }
  // Pilares de cristal redesenhados a partir da legenda do jogo, nas cores de cada tier.
  const PILLAR_COLORS = {
    'pillar-b': { light: '#f6d7b5', inner: '#fff3e6', mid: '#d79a62', accent: '#8c4f22', line: '#2b1a0e', detail: '#a8693a' },
    'pillar-a': { light: '#eadcff', inner: '#f7f0ff', mid: '#b48cf0', accent: '#6b3fb5', line: '#22163a', detail: '#8a62cf' },
    'pillar-s': { light: '#ffeaa6', inner: '#fff8db', mid: '#f4bb2e', accent: '#9a5f06', line: '#2d1e05', detail: '#c58a14' }
  };
  const PILLAR_SCALE = 1.4;
  const PILLAR_RING = { 'pillar-b': 30, 'pillar-a': 38, 'pillar-s': 44 };
  const PILLAR_LABEL_Y = { 'pillar-b': 38, 'pillar-a': 52, 'pillar-s': 48 };
  function crystalOrb(r, colors, cy = 0) {
    const g = svg('g', { transform: `translate(0 ${cy})` });
    g.append(svg('circle', { r, fill: colors.light, stroke: colors.line, 'stroke-width': 2.5 }));
    g.append(svg('circle', { r: r * .6, fill: colors.inner, stroke: colors.accent, 'stroke-width': 2 }));
    for (const [x, y] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      g.append(svg('line', { x1: x * r * .25, y1: y * r * .25, x2: x * r * .85, y2: y * r * .85, stroke: colors.accent, 'stroke-width': 2, 'stroke-linecap': 'round' }));
    }
    const s = round(r * .26);
    g.append(svg('path', { d: `M0,${-s} L${s},0 L0,${s} L${-s},0 Z`, fill: colors.accent }));
    return g;
  }
  function landmarkIcon(kind) {
    const colors = PILLAR_COLORS[kind];
    const shape = { stroke: colors.line, 'stroke-width': 2.2, 'stroke-linejoin': 'round' };
    const g = svg('g');
    if (kind === 'pillar-b') {
      g.append(svg('circle', { cy: 2, r: 17, fill: '#071411', opacity: .35 }), crystalOrb(15, colors));
    } else if (kind === 'pillar-a') {
      g.setAttribute('transform', 'translate(0 -2)');
      g.append(
        svg('ellipse', { cy: 27, rx: 16, ry: 4, fill: '#071411', opacity: .35 }),
        svg('path', { d: 'M-13,26 L13,26 L8,17 L-8,17 Z', fill: colors.mid, ...shape }),
        svg('rect', { x: -3.5, y: 7, width: 7, height: 11, fill: colors.mid, ...shape }),
        svg('path', { d: 'M-17,-9 Q-17,11 0,11 Q17,11 17,-9 Q11,3 0,3 Q-11,3 -17,-9 Z', fill: colors.mid, ...shape }),
        crystalOrb(13, colors, -9)
      );
    } else {
      const wing = 'M9,-9 C18,-22 34,-23 43,-17 C37,-14 35,-11 39,-7 C32,-6 30,-3 33,1 C26,1 23,4 25,8 C17,6 12,7 8,9 Z';
      g.setAttribute('transform', 'scale(.9)');
      for (const side of [1, -1]) {
        const half = svg('g', { transform: `scale(${side} 1)` });
        half.append(
          svg('path', { d: wing, fill: colors.mid, ...shape }),
          svg('path', { d: 'M14,-7 C22,-13 30,-15 38,-15 M16,-1 C22,-4 27,-5 31,-4', fill: 'none', stroke: colors.detail, 'stroke-width': 1.5, 'stroke-linecap': 'round' })
        );
        g.append(half);
      }
      g.append(
        svg('path', { d: 'M-7,-11 L0,-27 L7,-11 Z', fill: colors.mid, ...shape }),
        svg('path', { d: 'M-7,10 L0,24 L7,10 Z', fill: colors.mid, ...shape }),
        crystalOrb(14, colors)
      );
    }
    return g;
  }
  function drawLandmark(item, parent) {
    const state = current().pillars?.[item.id];
    const team = TEAMS[state];
    const g = svg('g', { 'data-ann-id': item.id, transform: `translate(${item.x} ${item.y})`, opacity: state === 'off' ? .35 : 1 });
    if (team) {
      const r = PILLAR_RING[item.kind];
      g.append(
        svg('circle', { r, fill: team.color, 'fill-opacity': .28, stroke: '#071411', 'stroke-width': 9 }),
        svg('circle', { r, fill: 'none', stroke: team.color, 'stroke-width': 5 })
      );
    }
    const icon = svg('g', { transform: `scale(${PILLAR_SCALE})` });
    icon.append(landmarkIcon(item.kind));
    const label = svg('text', { y: PILLAR_LABEL_Y[item.kind], 'text-anchor': 'middle', fill: team?.color || '#f3f7f1', stroke: '#071411', 'stroke-width': 4, 'paint-order': 'stroke', 'font-size': 15, 'font-weight': 800, 'font-family': 'system-ui, sans-serif' });
    label.textContent = item.label;
    const values = PILLAR_POINTS[field][item.kind];
    const title = svg('title');
    title.textContent = `${item.label} · ${LANDMARKS[item.kind].name}\nDesselar ${values.unseal} · Ocupar ${values.occupy} · ${values.rate} a cada 3 s (${field === 'main' ? 'pontos' : 'moral'})`;
    g.append(icon, label, title);
    if (item.id === selectedId) g.classList.add('selected');
    parent.append(g);
  }
  function nextPillarLabel(kind, list = landmarks()) {
    const used = new Set(list.map(item => item.label));
    let number = 1;
    while (used.has(`${LANDMARKS[kind].letter}${number}`)) number++;
    return `${LANDMARKS[kind].letter}${number}`;
  }

  const formatNumber = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  function renderPillarPanel() {
    const pillar = selectedPillar();
    pillarInspector.hidden = !pillar;
    if (pillar) {
      const state = current().pillars?.[pillar.id] || 'neutral';
      pillarTitle.textContent = `${pillar.label} · ${LANDMARKS[pillar.kind].name} — fase ${phase + 1}`;
      for (const button of pillarStates.children) {
        const active = button.dataset.state === state;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      }
    }
    const main = field === 'main';
    const unit = main ? 'pts' : 'moral';
    const goal = main ? MAIN_GOAL : MORALE_STEPS[0];
    const totals = { dawn: { count: 0, rate: 0, bonus: 0 }, lush: { count: 0, rate: 0, bonus: 0 } };
    for (const item of landmarks()) {
      const total = totals[current().pillars?.[item.id]];
      if (!total) continue;
      const values = PILLAR_POINTS[field][item.kind];
      total.count++;
      total.rate += values.rate * 20;
      total.bonus += values.unseal + values.occupy;
    }
    const rows = Object.entries(TEAMS).map(([key, team]) => {
      const total = totals[key];
      const row = document.createElement('div');
      row.className = 'score-row';
      row.style.setProperty('--team', team.color);
      const head = document.createElement('div');
      head.className = 'score-head';
      const dot = document.createElement('i');
      dot.className = 'dot';
      const name = document.createElement('strong');
      name.textContent = team.name;
      const rate = document.createElement('b');
      rate.textContent = `+${formatNumber(total.rate)} ${unit}/min`;
      head.append(dot, name, rate);
      const detail = document.createElement('small');
      detail.textContent = total.count
        ? `${total.count} pilar(es) · bônus ao tomar +${formatNumber(total.bonus)} · ${formatNumber(goal)} em ~${formatNumber(goal / total.rate)} min`
        : 'Nenhum pilar nesta fase';
      row.append(head, detail);
      return row;
    });
    scoreBoard.replaceChildren(...rows);
    scoreHint.textContent = main
      ? `Campo principal · fase ${phase + 1}: vence quem chegar a 3.000 pontos. Abate vale 1 ponto.`
      : `Campo secundário · fase ${phase + 1}: gera moral para o principal (buffs em 1.000, 2.000 e 3.000). Dar o último golpe no selo do S libera as skills de comandante.`;
  }

  function drawItem(item, parent, draft = false) {
    let node;
    if (item.type === 'route') node = drawRoute(item, parent, draft);
    else if (item.type === 'pen') node = drawPen(item, parent, draft);
    else if (item.type === 'token') node = drawToken(item, parent);
    else if (item.type === 'text') node = drawText(item, parent);
    if (node && item.id === selectedId) node.classList.add('selected');
    return node;
  }

  // Todas as rotas da fase partem juntas; cada PT leva 2 pontinhos e PTs da mesma rota andam lado a lado.
  function drawWalkers(routes) {
    const walks = routes.filter(route => route.parties.length).map(route => ({
      d: route.path.getAttribute('d'),
      parties: route.parties,
      travel: Math.max(1.2, route.path.getTotalLength() / WALK_SPEED)
    }));
    const signature = `${field}|${phase}|${walks.map(walk => `${walk.d}:${walk.parties.map(party => party.id)}`).join('|')}`;
    if (walks.length) {
      const cycle = Math.max(...walks.map(walk => walk.travel)) + WALK_PAUSE;
      const timing = { dur: `${cycle.toFixed(3)}s`, repeatCount: 'indefinite' };
      const fade = `0;${(.35 / cycle).toFixed(4)};${(1 - .45 / cycle).toFixed(4)};1`;
      const layer = svg('g', { class: 'walkers', 'pointer-events': 'none' });
      for (const walk of walks) {
        const arrival = (walk.travel / cycle).toFixed(4);
        walk.parties.forEach((party, i) => {
          const offset = (i - (walk.parties.length - 1) / 2) * WALK_SPACING;
          for (const lag of [0, WALK_LAG]) {
            const walker = svg('g', { opacity: 0 });
            walker.append(
              svg('animateMotion', { ...timing, begin: `${lag}s`, path: walk.d, rotate: 'auto', calcMode: 'linear', keyPoints: '0;1;1', keyTimes: `0;${arrival};1` }),
              svg('animate', { ...timing, begin: `${lag}s`, attributeName: 'opacity', values: '0;1;1;0', keyTimes: fade })
            );
            const dot = svg('g', { class: 'walker-blink' });
            dot.append(
              svg('circle', { cy: offset, r: 14, fill: party.color, 'fill-opacity': .35 }),
              svg('circle', { cy: offset, r: 8.5, fill: party.color, stroke: '#071411', 'stroke-width': 2.5 })
            );
            walker.append(dot);
            layer.append(walker);
          }
        });
      }
      board.append(layer);
    }
    // Recomeça a caminhada só quando as rotas mudam, para não reiniciar a cada redesenho.
    if (signature !== walkSignature) {
      walkSignature = signature;
      board.setCurrentTime?.(0);
    }
  }

  function renderBoard() {
    base();
    const places = svg('g', { id: 'landmarks' });
    for (const item of landmarks()) drawLandmark(item, places);
    const layer = svg('g', { id: 'annotations' });
    board.append(places, layer);
    const routes = [];
    for (const item of current().items) {
      const node = drawItem(item, layer);
      if (item.type === 'route' && node) routes.push({ path: node.querySelector('[data-route-path]'), parties: itemParties(item) });
    }
    if (interaction?.kind === 'draw-route') {
      const points = interaction.straight ? [interaction.points[0], interaction.end] : simplify(interaction.points);
      if (points.length > 1) drawItem({ type: 'route', points, parties: selectedParties }, layer, true);
    } else if (interaction?.kind === 'draw-pen') {
      drawItem({ type: 'pen', points: interaction.points, parties: selectedParties }, layer, true);
    }
    drawWalkers(routes);
    laserCircle = svg('circle', { r: 21, fill: '#f6e9aa', 'fill-opacity': .2, stroke: '#ffe6a0', 'stroke-width': 4, 'pointer-events': 'none', visibility: 'hidden' });
    board.append(laserCircle);
    applyView();
  }

  function buildPartyRow() {
    const row = document.createElement('div');
    row.className = 'party';
    const options = Array.from({ length: GROUPS }, (_, i) => `<option value="${i + 1}">G${i + 1}</option>`).join('');
    row.innerHTML = `<button class="party-pick" type="button"><i class="dot"></i><b></b></button><input class="party-name" type="text" maxlength="${NAME_LIMIT}" spellcheck="false" autocomplete="off"><select class="party-group">${options}</select><button class="party-remove" type="button">×</button>`;
    return row;
  }
  function renderParties() {
    const active = activeParties();
    const signature = plan.parties.map(party => party.id).join();
    if (partyList.dataset.signature !== signature) {
      partyList.replaceChildren(...plan.parties.map(buildPartyRow));
      partyList.dataset.signature = signature;
    }
    plan.parties.forEach((party, index) => {
      const row = partyList.children[index];
      const selected = active.includes(party);
      row.dataset.partyId = party.id;
      row.classList.toggle('active', selected);
      row.style.setProperty('--party', party.color);
      const pick = row.querySelector('.party-pick');
      pick.setAttribute('aria-pressed', String(selected));
      pick.setAttribute('aria-label', `Selecionar ${party.name}`);
      pick.querySelector('.dot').style.background = party.color;
      pick.querySelector('b').textContent = index + 1;
      const name = row.querySelector('.party-name');
      if (document.activeElement !== name && name.value !== party.name) name.value = party.name;
      name.setAttribute('aria-label', `Nome da PT ${index + 1}`);
      const groupSelect = row.querySelector('.party-group');
      groupSelect.value = String(party.group);
      groupSelect.setAttribute('aria-label', `Grupo de ${party.name}`);
      const remove = row.querySelector('.party-remove');
      remove.hidden = plan.parties.length === 1;
      remove.setAttribute('aria-label', `Remover ${party.name}`);
    });
    addPartyButton.disabled = plan.parties.length >= MAX_PARTIES;
    for (const chip of groupChips.children) {
      const members = plan.parties.filter(party => party.group === Number(chip.dataset.groupChip));
      const dots = document.createElement('span');
      dots.className = 'dots';
      for (const party of members) {
        const dot = document.createElement('i');
        dot.style.background = party.color;
        dots.append(dot);
      }
      chip.replaceChildren(`Grupo ${chip.dataset.groupChip}`, dots);
      chip.hidden = !members.length;
      chip.title = partyNames(members);
      chip.classList.toggle('active', members.length === active.length && members.every(party => active.includes(party)));
    }
  }

  function render() {
    document.querySelectorAll('[data-field]').forEach(button => {
      const active = button.dataset.field === field;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('[data-phase]').forEach(button => button.classList.toggle('active', Number(button.dataset.phase) === phase));
    document.querySelectorAll('[data-tool]').forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
    document.querySelectorAll('[data-place]').forEach(button => button.classList.toggle('active', tool === 'place' && button.dataset.place === placeKind));
    renderParties();
    renderPillarPanel();
    board.dataset.tool = tool;
    if (notesInput.value !== current().notes) notesInput.value = current().notes;
    renderBoard();
    updateHistoryButtons();
  }

  function moveItem(item, original, dx, dy) {
    if (original.points) item.points = original.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
    else { item.x = original.x + dx; item.y = original.y + dy; }
  }
  function hitItem(event) {
    const node = event.target.closest('[data-ann-id]');
    if (!node?.dataset.annId) return null;
    return findItem(node.dataset.annId);
  }
  function showLaser(p) {
    if (!laserCircle) return;
    laserCircle.setAttribute('cx', p.x);
    laserCircle.setAttribute('cy', p.y);
    laserCircle.setAttribute('visibility', 'visible');
    if (laserTimer) clearTimeout(laserTimer);
    laserTimer = setTimeout(() => laserCircle?.setAttribute('visibility', 'hidden'), 500);
  }

  board.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const p = point(event);
    const hit = hitItem(event);
    if (tool === 'laser') { showLaser(p); return; }
    if (tool === 'pan') {
      interaction = { kind: 'pan', startX: event.clientX, startY: event.clientY, initial: { ...view }, scale: board.getScreenCTM().a };
    } else if (tool === 'select') {
      selectedId = hit?.id || null;
      if (hit) interaction = { kind: 'move', id: hit.id, start: p, original: structuredClone(hit), recorded: false };
      render();
      if (selectedPillar()) {
        pillarInspector.scrollIntoView({ block: 'nearest' });
        setStatus(`${hit.label} selecionado. Marque quem controla nesta fase no painel “Locais do mapa”.`);
      }
    } else if (tool === 'eraser') {
      if (hit) {
        remember();
        deleteItem(hit.id);
        selectedId = null;
        render();
        setStatus('Elemento apagado.');
      }
    } else if (tool === 'token') {
      const parties = activeParties();
      remember();
      current().items.push({ id: nextId(), type: 'token', x: p.x, y: p.y, parties: parties.map(party => party.id) });
      render();
      setStatus(parties.length > 1 ? `${partyNames(parties)} posicionadas juntas.` : `${parties[0].name} posicionada.`);
    } else if (tool === 'text') {
      const value = textInput.value.trim();
      if (!value) { setStatus('Digite uma anotação no painel antes de colocá-la no mapa.'); return; }
      remember();
      current().items.push({ id: nextId(), type: 'text', x: p.x, y: p.y, text: value, parties: activeParties().map(party => party.id) });
      render();
      setStatus('Anotação colocada no mapa.');
    } else if (tool === 'place') {
      remember();
      const label = nextPillarLabel(placeKind);
      landmarks().push({ id: nextId(), kind: placeKind, label, x: round(p.x), y: round(p.y) });
      render();
      setStatus(`${label} (${LANDMARKS[placeKind].name}) colocado. Ele aparece nas 3 fases deste campo.`);
    } else if (tool === 'arrow') {
      interaction = { kind: 'draw-route', points: [p], end: p, straight: event.shiftKey };
      renderBoard();
    } else if (tool === 'pen') {
      interaction = { kind: 'draw-pen', points: [p] };
      renderBoard();
    }
    if (interaction) board.setPointerCapture(event.pointerId);
  });
  board.addEventListener('pointermove', event => {
    const p = point(event);
    if (tool === 'laser') { showLaser(p); return; }
    if (!interaction) return;
    if (interaction.kind === 'pan') {
      view.x = interaction.initial.x - (event.clientX - interaction.startX) / interaction.scale;
      view.y = interaction.initial.y - (event.clientY - interaction.startY) / interaction.scale;
      applyView();
    } else if (interaction.kind === 'move') {
      const dx = p.x - interaction.start.x;
      const dy = p.y - interaction.start.y;
      if (!interaction.recorded && Math.hypot(dx, dy) > 1) { remember(); interaction.recorded = true; }
      const item = findItem(interaction.id);
      if (item && interaction.recorded) { moveItem(item, interaction.original, dx, dy); renderBoard(); }
    } else if (interaction.kind === 'draw-route') {
      interaction.end = p;
      interaction.straight = event.shiftKey;
      if (distance(interaction.points.at(-1), p) > 2) interaction.points.push(p);
      renderBoard();
    } else if (interaction.kind === 'draw-pen') {
      const last = interaction.points.at(-1);
      if (Math.hypot(p.x - last.x, p.y - last.y) > 2) { interaction.points.push(p); renderBoard(); }
    }
  });
  function finishPointer(event) {
    if (!interaction) return;
    if (interaction.kind === 'draw-route') {
      const points = routePoints(interaction);
      if (points.length > 1 && pathLength(points) > 10) {
        const parties = activeParties();
        remember();
        current().items.push({ id: nextId(), type: 'route', points, parties: parties.map(party => party.id) });
        setStatus(parties.length > 1 ? `Rota adicionada: ${partyNames(parties)} andam juntas.` : `Rota de ${parties[0].name} adicionada.`);
      }
    } else if (interaction.kind === 'draw-pen' && interaction.points.length > 1) {
      remember();
      current().items.push({ id: nextId(), type: 'pen', points: interaction.points, parties: activeParties().map(party => party.id) });
      setStatus('Desenho adicionado.');
    }
    interaction = null;
    if (board.hasPointerCapture(event.pointerId)) board.releasePointerCapture(event.pointerId);
    renderBoard();
  }
  board.addEventListener('pointerup', finishPointer);
  board.addEventListener('pointercancel', finishPointer);
  board.addEventListener('pointerleave', () => laserCircle?.setAttribute('visibility', 'hidden'));

  function chooseTool(name) {
    tool = name;
    selectedId = null;
    render();
    setStatus(TOOL_HELP[tool]);
  }
  document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => chooseTool(button.dataset.tool)));
  document.querySelectorAll('[data-field]').forEach(button => button.addEventListener('click', () => {
    field = button.dataset.field;
    selectedId = null;
    resetView();
    render();
    setStatus(field === 'main' ? 'Campo principal selecionado.' : 'Campo secundário selecionado.');
  }));
  document.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => {
    phase = Number(button.dataset.phase);
    selectedId = null;
    render();
    setStatus(`Fase ${phase + 1} selecionada.`);
  }));
  notesInput.addEventListener('input', () => { current().notes = notesInput.value; });

  for (const [kind, info] of Object.entries(LANDMARKS)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'place';
    button.dataset.place = kind;
    button.title = info.title;
    const icon = document.createElementNS(SVG_NS, 'svg');
    icon.setAttribute('viewBox', '-42 -30 84 60');
    icon.setAttribute('aria-hidden', 'true');
    icon.append(landmarkIcon(kind));
    button.append(icon, info.name);
    placeList.append(button);
  }
  placeList.addEventListener('click', event => {
    const button = event.target.closest('[data-place]');
    if (!button) return;
    placeKind = button.dataset.place;
    tool = 'place';
    selectedId = null;
    render();
    setStatus(`${LANDMARKS[placeKind].name}: clique no mapa para posicioná-lo.`);
  });
  function setPillarState(pillar, state) {
    remember();
    const states = current().pillars ||= {};
    if (PILLAR_STATES.includes(state)) states[pillar.id] = state;
    else delete states[pillar.id];
    render();
    setStatus(state === 'off' ? `${pillar.label} inativo na fase ${phase + 1}.` : TEAMS[state] ? `${pillar.label} com ${TEAMS[state].name} na fase ${phase + 1}.` : `${pillar.label} neutro na fase ${phase + 1}.`);
  }
  pillarStates.addEventListener('click', event => {
    const button = event.target.closest('[data-state]');
    const pillar = selectedPillar();
    if (button && pillar) setPillarState(pillar, button.dataset.state);
  });

  for (let group = 1; group <= GROUPS; group++) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.groupChip = group;
    groupChips.append(chip);
  }
  groupChips.addEventListener('click', event => {
    const chip = event.target.closest('[data-group-chip]');
    if (!chip) return;
    const members = plan.parties.filter(party => party.group === Number(chip.dataset.groupChip)).map(party => party.id);
    selectedParties = event.ctrlKey || event.metaKey || event.shiftKey ? [...new Set([...selectedParties, ...members])] : members;
    render();
    setStatus(describeSelection());
  });
  partyList.addEventListener('click', event => {
    const row = event.target.closest('.party');
    if (!row || event.target.closest('.party-name, .party-group')) return;
    const id = row.dataset.partyId;
    if (event.target.closest('.party-remove')) { removeParty(id); return; }
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      selectedParties = selectedParties.includes(id) ? selectedParties.filter(other => other !== id) : [...selectedParties, id];
      if (!selectedParties.length) selectedParties = [id];
    } else selectedParties = [id];
    render();
    setStatus(describeSelection());
  });
  partyList.addEventListener('focusin', event => {
    if (event.target.matches('.party-name')) nameSnapshot = JSON.stringify(plan);
  });
  partyList.addEventListener('input', event => {
    if (!event.target.matches('.party-name')) return;
    const party = partyById(event.target.closest('.party').dataset.partyId);
    if (!party) return;
    party.name = event.target.value.slice(0, NAME_LIMIT);
    renderBoard();
  });
  partyList.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('.party-name')) event.target.blur();
  });
  partyList.addEventListener('change', event => {
    const row = event.target.closest('.party');
    const party = row && partyById(row.dataset.partyId);
    if (!party) return;
    if (event.target.matches('.party-name')) {
      party.name = event.target.value.trim().slice(0, NAME_LIMIT) || `PT ${plan.parties.indexOf(party) + 1}`;
      event.target.value = party.name;
      if (nameSnapshot && nameSnapshot !== JSON.stringify(plan)) {
        undoStack.push(nameSnapshot);
        if (undoStack.length > 50) undoStack.shift();
        redoStack = [];
      }
      nameSnapshot = JSON.stringify(plan);
      render();
      setStatus(`Nome salvo: ${party.name}.`);
    } else if (event.target.matches('.party-group')) {
      remember();
      party.group = clamp(Number(event.target.value), 1, GROUPS);
      render();
      setStatus(`${party.name} agora está no Grupo ${party.group}.`);
    }
  });
  addPartyButton.addEventListener('click', () => {
    if (plan.parties.length >= MAX_PARTIES) return;
    remember();
    const usedColors = new Set(plan.parties.map(party => party.color));
    const names = new Set(plan.parties.map(party => party.name));
    let number = 1;
    while (names.has(`PT ${number}`)) number++;
    const party = { id: nextId(), name: `PT ${number}`, color: COLORS.find(color => !usedColors.has(color)) || COLORS[0], group: 1 };
    plan.parties.push(party);
    selectedParties = [party.id];
    render();
    const input = partyList.lastElementChild?.querySelector('.party-name');
    input?.focus();
    input?.select();
    setStatus(`${party.name} adicionada. Digite o nome da PT.`);
  });
  function removeParty(id) {
    const party = partyById(id);
    if (!party || plan.parties.length === 1) return;
    let orphaned = 0;
    for (const name of FIELDS) for (const phaseData of plan.fields[name]) orphaned += phaseData.items.filter(item => item.parties.length === 1 && item.parties[0] === id).length;
    if (orphaned && !confirm(`Remover ${party.name}? ${orphaned} marcação(ões) só dessa PT também serão apagadas.`)) return;
    remember();
    plan.parties = plan.parties.filter(other => other.id !== id);
    for (const name of FIELDS) {
      for (const phaseData of plan.fields[name]) {
        phaseData.items = phaseData.items.filter(item => {
          item.parties = item.parties.filter(other => other !== id);
          return item.parties.length > 0;
        });
      }
    }
    selectedParties = selectedParties.filter(other => other !== id);
    selectedId = null;
    render();
    setStatus(`${party.name} removida. Ctrl+Z desfaz.`);
  }

  document.querySelector('#undo').addEventListener('click', undo);
  document.querySelector('#redo').addEventListener('click', redo);
  document.querySelector('#zoom-in').addEventListener('click', () => zoom(1.25));
  document.querySelector('#zoom-out').addEventListener('click', () => zoom(.8));
  document.addEventListener('keydown', event => {
    const editing = event.target.matches('input,textarea,select,[contenteditable="true"]');
    if (event.ctrlKey && event.key.toLowerCase() === 'z' && !editing) { event.preventDefault(); undo(); }
    if (event.ctrlKey && event.key.toLowerCase() === 'y' && !editing) { event.preventDefault(); redo(); }
    if (!editing && (event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
      event.preventDefault(); remember();
      deleteItem(selectedId);
      selectedId = null; render(); setStatus('Elemento apagado.');
    }
    if (!editing && event.key === 'Escape') { selectedId = null; tool = 'select'; render(); setStatus(TOOL_HELP.select); }
  });

  // Menu do botão direito sobre o mapa: ações no elemento clicado, ferramentas e desfazer/refazer.
  const contextMenu = document.querySelector('#context-menu');
  const STATE_LABELS = { neutral: 'Neutro', dawn: 'Dawn', lush: 'Lush', off: 'Inativo' };
  function describeItem(item) {
    if (landmarks().includes(item)) return `${item.label} · ${LANDMARKS[item.kind].name}`;
    const names = partyNames(itemParties(item)) || 'sem PT';
    if (item.type === 'route') return `Rota · ${names}`;
    if (item.type === 'pen') return `Desenho · ${names}`;
    if (item.type === 'token') return `Marcador · ${names}`;
    return `Texto · “${item.text}”`;
  }
  function closeContextMenu() {
    if (contextMenu.hidden) return;
    contextMenu.hidden = true;
    contextMenu.replaceChildren();
  }
  function openContextMenu(event) {
    const hit = hitItem(event);
    if (hit && hit.id !== selectedId) { selectedId = hit.id; render(); }
    const button = (label, action, { icon = '', active = false, disabled = false, className = 'menu-item' } = {}) => {
      const node = document.createElement('button');
      node.type = 'button';
      node.className = className;
      node.setAttribute('role', 'menuitem');
      node.disabled = disabled;
      node.classList.toggle('active', active);
      if (icon) {
        const symbol = document.createElement('span');
        symbol.className = 'menu-icon';
        symbol.textContent = icon;
        node.append(symbol);
      }
      node.append(label);
      node.addEventListener('click', () => { closeContextMenu(); action(); });
      return node;
    };
    const separator = () => Object.assign(document.createElement('div'), { className: 'menu-sep' });
    const parts = [];
    if (hit) {
      parts.push(Object.assign(document.createElement('div'), { className: 'menu-title', textContent: describeItem(hit) }));
      if (landmarks().includes(hit)) {
        const state = current().pillars?.[hit.id] || 'neutral';
        const row = document.createElement('div');
        row.className = 'menu-states';
        for (const [key, label] of Object.entries(STATE_LABELS)) row.append(button(label, () => setPillarState(hit, key), { active: key === state, className: `menu-state ${key}` }));
        parts.push(row);
      }
      parts.push(button('Apagar', () => { remember(); deleteItem(hit.id); selectedId = null; render(); setStatus('Elemento apagado.'); }, { icon: '⌫', className: 'menu-item danger' }), separator());
    }
    const tools = document.createElement('div');
    tools.className = 'menu-tools';
    for (const source of document.querySelectorAll('.toolbar [data-tool]')) {
      tools.append(button(source.querySelector('span').textContent, () => chooseTool(source.dataset.tool), { icon: source.firstChild.textContent.trim(), active: source.dataset.tool === tool, className: 'menu-tool' }));
    }
    parts.push(tools, separator(), button('Desfazer', undo, { icon: '↶', disabled: !undoStack.length }), button('Refazer', redo, { icon: '↷', disabled: !redoStack.length }));
    contextMenu.replaceChildren(...parts);
    contextMenu.hidden = false;
    const { width, height } = contextMenu.getBoundingClientRect();
    contextMenu.style.left = `${Math.max(8, Math.min(event.clientX, innerWidth - width - 8))}px`;
    contextMenu.style.top = `${Math.max(8, Math.min(event.clientY, innerHeight - height - 8))}px`;
    contextMenu.querySelector('button:not(:disabled)')?.focus();
  }
  board.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (!interaction) openContextMenu(event);
  });
  document.addEventListener('pointerdown', event => { if (!contextMenu.contains(event.target)) closeContextMenu(); }, true);
  document.addEventListener('keydown', event => {
    if (contextMenu.hidden || event.key !== 'Escape') return;
    event.stopImmediatePropagation();
    closeContextMenu();
  }, true);
  window.addEventListener('resize', closeContextMenu);
  window.addEventListener('blur', closeContextMenu);
  boardFrame.addEventListener('wheel', closeContextMenu, { passive: true });

  const download = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const filename = suffix => `vale-of-clash-${field}-fase-${phase + 1}.${suffix}`;
  document.querySelector('#save-plan').addEventListener('click', () => {
    download(new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }), 'vale-of-clash-plano.json');
    setStatus('Plano salvo. Guarde o arquivo para reabrir e continuar depois.');
  });

  document.querySelector('#import-map').addEventListener('click', () => document.querySelector('#map-file').click());
  document.querySelector('#map-file').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
      setStatus('Use uma imagem PNG, JPG ou WebP com até 12 MB.'); return;
    }
    const reader = new FileReader();
    reader.onload = () => { remember(); plan.maps[field] = String(reader.result); resetView(); render(); setStatus('Mapa importado para este campo.'); };
    reader.onerror = () => setStatus('Não foi possível ler a imagem.');
    reader.readAsDataURL(file);
  });

  function normalize(raw) {
    if (!raw || ![1, 2, 3].includes(raw.version) || !raw.fields || !raw.maps) throw new Error('Formato inválido');
    const safe = freshPlan();
    const yScale = raw.version === 1 ? HEIGHT / 620 : 1;
    if (raw.version === 3 && Array.isArray(raw.parties) && raw.parties.length) {
      const seen = new Set();
      safe.parties = [];
      for (const source of raw.parties.slice(0, MAX_PARTIES)) {
        let id = typeof source?.id === 'string' && /^[\w-]{1,40}$/.test(source.id) ? source.id : nextId();
        if (seen.has(id)) id = nextId();
        seen.add(id);
        const index = safe.parties.length;
        safe.parties.push({
          id,
          name: String(source?.name || '').trim().slice(0, NAME_LIMIT) || `PT ${index + 1}`,
          color: typeof source?.color === 'string' && /^#[0-9a-f]{6}$/i.test(source.color) ? source.color : COLORS[index],
          group: clamp(Math.floor(finite(source?.group, 1)), 1, GROUPS)
        });
      }
    }
    const validParties = new Set(safe.parties.map(party => party.id));
    // Planos antigos (v1/v2) guardavam o grupo 0–3; ele vira a PT de mesma cor.
    const partiesOf = source => {
      if (Array.isArray(source.parties)) return [...new Set(source.parties.filter(id => validParties.has(id)))];
      const legacy = `pt${clamp(Math.floor(finite(source.group)), 0, 3) + 1}`;
      return validParties.has(legacy) ? [legacy] : [];
    };
    const readPoints = list => Array.isArray(list) ? list.slice(0, 3000).map(p => ({ x: finite(p?.x), y: finite(p?.y) * yScale })) : [];
    for (const name of FIELDS) {
      const map = raw.maps[name];
      if (typeof map === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(map) && map.length < 18_000_000) safe.maps[name] = map;
      // Planos sem locais salvos ficam com os pilares padrão; ids são mantidos para ligar o dono de cada fase.
      const places = raw.landmarks?.[name];
      const pillarIds = new Map(safe.landmarks[name].map(item => [item.id, item.id]));
      if (Array.isArray(places)) {
        safe.landmarks[name] = [];
        pillarIds.clear();
        for (const source of places.slice(0, 200)) {
          if (!source || !Object.hasOwn(LANDMARKS, source.kind)) continue;
          let id = typeof source.id === 'string' && /^[\w-]{1,40}$/.test(source.id) ? source.id : nextId();
          if ([...pillarIds.values()].includes(id)) id = nextId();
          if (typeof source.id === 'string') pillarIds.set(source.id, id);
          safe.landmarks[name].push({ id, kind: source.kind, label: String(source.label || '').trim().slice(0, 4), x: finite(source.x), y: finite(source.y) });
        }
        for (const item of safe.landmarks[name]) if (!item.label) item.label = nextPillarLabel(item.kind, safe.landmarks[name]);
      }
      const phases = raw.fields[name];
      if (!Array.isArray(phases)) continue;
      for (let i = 0; i < 3; i++) {
        const phaseData = phases[i] || {};
        safe.fields[name][i].notes = String(phaseData.notes || '').slice(0, 5000);
        if (phaseData.pillars && typeof phaseData.pillars === 'object') {
          for (const [id, state] of Object.entries(phaseData.pillars)) {
            if (pillarIds.has(id) && PILLAR_STATES.includes(state)) safe.fields[name][i].pillars[pillarIds.get(id)] = state;
          }
        }
        if (!Array.isArray(phaseData.items)) continue;
        for (const source of phaseData.items.slice(0, 500)) {
          const type = source?.type === 'arrow' ? 'route' : source?.type;
          if (!ITEM_TYPES.includes(type)) continue;
          const parties = partiesOf(source);
          if (!parties.length) continue;
          const item = { id: nextId(), type, parties };
          if (source.type === 'arrow') item.points = [{ x: finite(source.x1), y: finite(source.y1) * yScale }, { x: finite(source.x2), y: finite(source.y2) * yScale }];
          else if (type === 'route' || type === 'pen') item.points = readPoints(source.points);
          else Object.assign(item, { x: finite(source.x), y: finite(source.y) * yScale });
          if (item.points && item.points.length < 2) continue;
          if (type === 'text') item.text = String(source.text || '').slice(0, 60);
          safe.fields[name][i].items.push(item);
        }
      }
    }
    return safe;
  }
  document.querySelector('#open-plan').addEventListener('click', () => document.querySelector('#plan-file').click());
  document.querySelector('#plan-file').addEventListener('change', event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > 22 * 1024 * 1024) { setStatus('O plano é grande demais para abrir.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try { plan = normalize(JSON.parse(String(reader.result))); undoStack = []; redoStack = []; selectedId = null; resetView(); render(); setStatus('Plano aberto.'); }
      catch { setStatus('Não foi possível abrir este arquivo de plano.'); }
    };
    reader.onerror = () => setStatus('Não foi possível ler o arquivo.');
    reader.readAsText(file);
  });

  document.querySelector('#export-image').addEventListener('click', async () => {
    try {
      const clone = board.cloneNode(true);
      clone.setAttribute('xmlns', SVG_NS);
      clone.setAttribute('width', '1600');
      clone.setAttribute('height', '1600');
      clone.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
      clone.querySelector('circle[visibility="hidden"]')?.remove();
      clone.querySelector('.walkers')?.remove();
      const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 1600;
      const context = canvas.getContext('2d');
      context.fillStyle = '#0c211c';
      context.fillRect(0, 0, canvas.width, canvas.height);
      const background = new Image();
      background.src = plan.maps[field] || new URL(DEFAULT_MAP, document.baseURI).href;
      await background.decode();
      const scale = Math.min(canvas.width / background.naturalWidth, canvas.height / background.naturalHeight);
      const mapWidth = background.naturalWidth * scale;
      const mapHeight = background.naturalHeight * scale;
      context.drawImage(background, (canvas.width - mapWidth) / 2, (canvas.height - mapHeight) / 2, mapWidth, mapHeight);
      const xml = new XMLSerializer().serializeToString(clone);
      const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
      const image = new Image();
      image.src = url;
      await image.decode();
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!png) throw new Error('PNG indisponível');
      download(png, filename('png'));
      setStatus('Imagem desta fase exportada.');
    } catch { setStatus('Não foi possível exportar a imagem. Tente salvar o plano em JSON.'); }
  });

  function registerWebMCP() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
    const coordinate = (value, max) => {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new Error(`Coordenada deve ficar entre 0 e ${max}.`);
      return value;
    };
    const partyIds = list => {
      if (!Array.isArray(list) || !list.length || list.length > MAX_PARTIES) throw new Error(`Informe de 1 a ${MAX_PARTIES} PTs.`);
      return [...new Set(list.map(number => {
        if (!Number.isInteger(number) || number < 1 || number > plan.parties.length) throw new Error(`PT deve ser um número de 1 a ${plan.parties.length}.`);
        return plan.parties[number - 1].id;
      }))];
    };
    const pointSchema = { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } }, required: ['x', 'y'], additionalProperties: false };
    const partiesSchema = { type: 'array', minItems: 1, maxItems: MAX_PARTIES, items: { type: 'integer', minimum: 1, maximum: MAX_PARTIES }, description: 'Números das PTs na ordem da lista lateral. PTs na mesma rota andam juntas.' };
    const toolDefinition = {
      name: 'add_tactical_marks',
      title: 'Adicionar rotas e PTs ao quadro',
      description: 'Adiciona rotas (com pontos de passagem) e marcadores de PT a uma fase do quadro tático e mostra essa fase na página. Coordenadas vão de 0 a 1000.',
      inputSchema: {
        type: 'object',
        properties: {
          field: { type: 'string', enum: ['main', 'secondary'] },
          phase: { type: 'integer', minimum: 1, maximum: 3 },
          routes: { type: 'array', maxItems: 20, items: { type: 'object', properties: { points: { type: 'array', minItems: 2, maxItems: 50, items: pointSchema }, parties: partiesSchema }, required: ['points', 'parties'], additionalProperties: false } },
          markers: { type: 'array', maxItems: 20, items: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, parties: partiesSchema }, required: ['x', 'y', 'parties'], additionalProperties: false } }
        },
        required: ['field', 'phase'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || !FIELDS.includes(input.field) || !Number.isInteger(input.phase) || input.phase < 1 || input.phase > 3) throw new Error('Campo ou fase inválidos.');
        const routes = input.routes ?? [];
        const markers = input.markers ?? [];
        if (!Array.isArray(routes) || !Array.isArray(markers) || routes.length > 20 || markers.length > 20 || routes.length + markers.length === 0) throw new Error('Informe de 1 a 20 rotas ou marcadores por lista.');
        const newItems = [];
        for (const route of routes) {
          if (!Array.isArray(route?.points) || route.points.length < 2 || route.points.length > 50) throw new Error('Cada rota precisa de 2 a 50 pontos.');
          newItems.push({ id: nextId(), type: 'route', points: route.points.map(p => ({ x: coordinate(p?.x, WIDTH), y: coordinate(p?.y, HEIGHT) })), parties: partyIds(route.parties) });
        }
        for (const marker of markers) {
          newItems.push({ id: nextId(), type: 'token', x: coordinate(marker?.x, WIDTH), y: coordinate(marker?.y, HEIGHT), parties: partyIds(marker?.parties) });
        }
        remember();
        field = input.field;
        phase = input.phase - 1;
        selectedId = null;
        plan.fields[field][phase].items.push(...newItems);
        resetView();
        render();
        setStatus(`${newItems.length} elemento(s) adicionado(s) à fase ${input.phase}.`);
        return { field, phase: input.phase, addedRoutes: routes.length, addedMarkers: markers.length };
      }
    };
    try { Promise.resolve(context.registerTool(toolDefinition, { signal: lifecycle.signal })).catch(() => {}); }
    catch { /* O quadro também funciona em navegadores sem WebMCP. */ }
  }

  render();
  new ResizeObserver(applyView).observe(board);
  registerWebMCP();
})();
