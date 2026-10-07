(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 1000;
  const HEIGHT = 1000;
  const DEFAULT_MAP = 'mapa-vale-of-clash.webp?v=2'; // troque o ?v= ao trocar a imagem (cache de 30 dias no servidor)
  const COLORS = ['#7ed7c2', '#f4b86e', '#b99add', '#f07d83', '#6fb3ff', '#b5e06a', '#ff8fd1', '#eef2f0'];
  const FALLBACK_COLOR = '#d6b978';
  const MAX_PARTIES = 8;
  const GROUPS = 4;
  const NAME_LIMIT = 24;
  const LABEL_LIMIT = 30;
  const FIELDS = ['main', 'secondary'];
  const ITEM_TYPES = ['route', 'pen', 'token', 'text'];
  // Pontinhos que percorrem as rotas: velocidade em unidades do mapa por segundo, tempos em segundos.
  const WALK_SPEED = 55;
  const WALK_PAUSE = 1.6;
  const WALK_FADE = .45;
  const WALK_LAG = 0.5;
  const WALK_PAIR = 18;
  // Locais fixos do mapa: valem para as 3 fases do campo.
  const LANDMARKS = {
    'pillar-b': { name: 'Pilar de Cristal B', title: 'B-Tier Crystal Pillar', letter: 'B' },
    'pillar-a': { name: 'Pilar de Cristal A', title: 'A-Tier Crystal Pillar', letter: 'A' },
    'pillar-s': { name: 'Pilar de Cristal S', title: 'S-Tier Crystal Pillar', letter: 'S' }
  };
  // Locais possíveis dos pilares, alinhados ao mapa a partir do vídeo do modo (1:01–1:20).
  const DEFAULT_PILLARS = [
    ['S1', 'pillar-s', 504, 459],
    ['A1', 'pillar-a', 350, 288], ['A2', 'pillar-a', 622, 322], ['A3', 'pillar-a', 674, 623],
    ['A4', 'pillar-a', 387, 729], ['A5', 'pillar-a', 324, 541], ['A6', 'pillar-a', 351, 408],
    ['B1', 'pillar-b', 389, 177], ['B2', 'pillar-b', 615, 153], ['B3', 'pillar-b', 793, 341],
    ['B4', 'pillar-b', 813, 485], ['B5', 'pillar-b', 859, 624], ['B6', 'pillar-b', 659, 814],
    ['B7', 'pillar-b', 460, 621], ['B8', 'pillar-b', 179, 613], ['B9', 'pillar-b', 211, 382]
  ];
  // Cada pilar paga: quebrar o selo + capturar a zona + segurar a zona (pago a cada 5 s durante "hold" segundos).
  // Valores editáveis no painel "Valores dos pilares"; o secundário usa os mesmos números como moral para o principal.
  const DEFAULT_SCORING = {
    'pillar-b': { seal: 20, capture: 20, retain: 40, hold: 20 },
    'pillar-a': { seal: 30, capture: 40, retain: 50, hold: 20 },
    'pillar-s': { seal: 50, capture: 100, retain: 30, hold: 30 }
  };
  const SCORING_FIELDS = [['seal', 'Selo'], ['capture', 'Captura'], ['retain', 'Segurar'], ['hold', 'Tempo (s)']];
  const RETAIN_TICK = 5;
  const scoring = kind => ({ ...DEFAULT_SCORING[kind], ...plan.scoring?.[kind] });
  const pillarTotal = values => values.seal + values.capture + values.retain;
  const MAIN_GOAL = 3000;
  const GROUP_NAME_LIMIT = 20;
  const MORALE_STEPS = [1000, 2000, 3000];
  const TEAMS = { dawn: { name: 'Dawn', color: '#8be04e' }, lush: { name: 'Lush', color: '#ff7a3d' } };
  const PILLAR_STATES = ['dawn', 'lush', 'off'];
  // Atalhos de teclado das ferramentas (Esc também volta para o Mover).
  const TOOL_KEYS = { select: 'V', arrow: 'R', pen: 'C', token: 'P', text: 'T', place: 'L', laser: 'A', eraser: 'E', pan: 'M' };
  const TOOL_HELP = {
    select: 'Clique em um elemento para selecioná-lo e arraste para mover. Delete apaga. Duplo clique numa rota ou marcador edita o nome da plaquinha.',
    arrow: 'Arraste no mapa para traçar a rota das PTs selecionadas (Shift = linha reta). Um clique simples num elemento seleciona.',
    pen: 'Arraste no mapa para desenhar livremente. Um clique simples num elemento seleciona.',
    token: 'Clique no mapa para posicionar as PTs selecionadas. Clique num marcador que já existe para selecionar ou arrastar.',
    text: 'Clique no mapa e digite o texto ali mesmo. Enter confirma, Esc cancela. Clique num texto para editá-lo.',
    place: 'Clique no mapa e escolha qual pilar colocar ali (S, A ou B). Clique num pilar que já existe para selecionar ou arrastar.',
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
  const mapBadge = document.querySelector('#map-badge');
  const mapCredit = document.querySelector('#map-credit');
  const partyList = document.querySelector('#party-list');
  const groupChips = document.querySelector('#group-chips');
  const addPartyButton = document.querySelector('#add-party');
  const groupNameList = document.querySelector('#group-name-list');
  const placeList = document.querySelector('#place-list');
  const pillarInspector = document.querySelector('#pillar-inspector');
  const pillarTitle = document.querySelector('#pillar-title');
  const pillarPoints = document.querySelector('#pillar-points');
  const pillarStates = document.querySelector('#pillar-states');
  const scoreBoard = document.querySelector('#score');
  const scoreHint = document.querySelector('#score-hint');
  const scoreTable = document.querySelector('#score-table');
  const scoreTotals = document.querySelector('#score-totals');

  function defaultParties() {
    return Array.from({ length: MAX_PARTIES }, (_, i) => ({ id: `pt${i + 1}`, name: `PT ${i + 1}`, color: COLORS[i], group: i < MAX_PARTIES / 2 ? 1 : 2 }));
  }
  const defaultLandmarks = () => DEFAULT_PILLARS.map(([label, kind, x, y]) => ({ id: label, kind, label, x, y }));
  function freshPlan() {
    const phases = () => Array.from({ length: 3 }, () => ({ notes: '', items: [], pillars: {} }));
    return { version: 3, maps: { main: null, secondary: null }, parties: defaultParties(), groups: defaultGroups(), scoring: JSON.parse(JSON.stringify(DEFAULT_SCORING)), landmarks: { main: [], secondary: [] }, fields: { main: phases(), secondary: phases() } };
  }
  const defaultGroups = () => Array.from({ length: GROUPS }, (_, i) => `Grupo ${i + 1}`);
  const groupName = number => plan.groups?.[number - 1] || `Grupo ${number}`;

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
    // Na tela a plaquinha anda com os pontinhos; esta cópia parada no início só aparece na imagem exportada.
    const badge = !draft && parties.length ? nameBadge(parties, item.label) : null;
    if (badge) {
      badge.setAttribute('transform', `translate(${round(points[0].x)} ${round(points[0].y - 14 - badgeHeight(badge) / 2)})`);
      badge.setAttribute('visibility', 'hidden');
      badge.classList.add('export-only');
      g.append(badge);
    }
    parent.append(g);
    if (badge) fitBadge(badge);
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
  // Nome de grupo para as PTs do item (a partir de 2 PTs): o grupo, se todas forem do mesmo, ou "Ataque + Defesa"
  // quando o item junta grupos inteiros. A linha de baixo da plaquinha diz quais PTs estão juntas.
  function matchingGroup(parties) {
    if (parties.length < 2) return null;
    const numbers = [...new Set(parties.map(party => party.group))].sort((a, b) => a - b);
    if (numbers.length === 1) return { name: groupName(numbers[0]) };
    const whole = numbers.every(number => plan.parties.filter(party => party.group === number).every(party => parties.includes(party)));
    return whole ? { name: numbers.map(groupName).join(' + ') } : null;
  }
  const shortName = name => name.replace(/^PT\s+/i, '') || name;
  // Título da plaquinha (nome editado, nome do grupo ou nomes das PTs) e, quando há título próprio, as PTs em letra menor.
  function badgeText(parties, label) {
    const group = matchingGroup(parties);
    const title = label || group?.name || tokenLabel(parties);
    let detail = label || group ? parties.map(party => shortName(party.name)).join(' · ') : '';
    if (detail.length > 34) detail = `${detail.slice(0, 33)}…`;
    return { title, detail };
  }
  // Plaquinha centrada em (0,0). Chame fitBadge depois de estar no DOM.
  function nameBadge(parties, label, withDots = true) {
    const { title, detail } = badgeText(parties, label);
    const g = svg('g', { class: 'name-badge' });
    const height = detail ? 34 : 24;
    g.append(svg('rect', { y: -height / 2, height, rx: detail ? 9 : 12, fill: '#081816', 'fill-opacity': .92, stroke: parties[0].color, 'stroke-width': 2 }));
    if (withDots) for (const party of parties.slice(0, 4)) g.append(svg('circle', { cy: detail ? -5 : 0, r: 5, fill: party.color, stroke: '#071411', 'stroke-width': 1.5 }));
    const main = svg('text', { y: detail ? -1 : 5, fill: '#f3f7f1', 'font-size': 13.5, 'font-weight': 800, 'font-family': 'system-ui, sans-serif' });
    main.textContent = title;
    g.append(main);
    if (detail) {
      const sub = svg('text', { y: 12, fill: '#b9d2c8', 'font-size': 10.5, 'font-weight': 600, 'font-family': 'system-ui, sans-serif' });
      sub.textContent = detail;
      g.append(sub);
    }
    return g;
  }
  function fitBadge(g) {
    const pill = g.querySelector('rect');
    const dots = [...g.querySelectorAll('circle')];
    const texts = [...g.querySelectorAll('text')];
    const textWidth = Math.max(...texts.map(text => text.getComputedTextLength() || text.textContent.length * 7.6));
    const lead = dots.length ? 26 + (dots.length - 1) * 9 : 12;
    const width = lead + textWidth + 12;
    const left = -width / 2;
    pill.setAttribute('x', round(left));
    pill.setAttribute('width', round(width));
    dots.forEach((dot, i) => dot.setAttribute('cx', round(left + 15 + i * 9)));
    texts.forEach(text => text.setAttribute('x', round(left + lead)));
  }
  const badgeHeight = g => g.querySelectorAll('text').length > 1 ? 34 : 24;
  function drawToken(item, parent) {
    const parties = itemParties(item);
    if (!parties.length) return null;
    const g = svg('g', { 'data-ann-id': item.id, transform: `translate(${item.x} ${item.y})` });
    // Até 4 PTs numa fileira; com mais, fileiras de 4 para o marcador não ficar comprido.
    const step = 26;
    const rows = Math.ceil(parties.length / 4);
    const spots = parties.map((_, i) => {
      const row = Math.floor(i / 4);
      const inRow = Math.min(4, parties.length - row * 4);
      return { cx: (i % 4 - (inRow - 1) / 2) * step, cy: (row - (rows - 1) / 2) * step };
    });
    spots.forEach(({ cx, cy }) => g.append(svg('circle', { cx, cy, r: 22, fill: '#071411', opacity: .5 })));
    parties.forEach((party, i) => {
      const { cx, cy } = spots[i];
      g.append(svg('circle', { cx, cy, r: 17, fill: party.color, stroke: '#ecf5ea', 'stroke-width': 2 }));
      const number = svg('text', { x: cx, y: cy + 5.5, 'text-anchor': 'middle', fill: '#10201c', 'font-size': 15, 'font-weight': 800, 'font-family': 'system-ui, sans-serif' });
      number.textContent = plan.parties.indexOf(party) + 1;
      g.append(number);
    });
    const badge = nameBadge(parties, item.label, false);
    badge.setAttribute('transform', `translate(0 ${(rows - 1) * step / 2 + 25 + badgeHeight(badge) / 2})`);
    g.append(badge);
    parent.append(g);
    fitBadge(badge);
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
    g.append(icon, label);
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
  // Pontos de um tipo de pilar: resumo na lista de pilares ou detalhado para o pilar selecionado.
  function fillPoints(target, kind, detailed) {
    const values = scoring(kind);
    const total = Object.assign(document.createElement('b'), { textContent: `${formatNumber(pillarTotal(values))} ${field === 'main' ? 'pts' : 'de moral'}` });
    if (detailed) target.replaceChildren('Vale ', total, `: selo ${values.seal} + captura ${values.capture} + segurar a zona ${values.retain} (${values.hold} s, pago a cada ${RETAIN_TICK} s).`);
    else target.replaceChildren(`Selo ${values.seal} · Captura ${values.capture} · Segurar ${values.retain} = `, total);
  }
  function renderPillarPanel() {
    const pillar = selectedPillar();
    pillarInspector.hidden = !pillar;
    if (pillar) {
      const state = current().pillars?.[pillar.id] || 'neutral';
      pillarTitle.textContent = `${pillar.label} · ${LANDMARKS[pillar.kind].name} — fase ${phase + 1}`;
      fillPoints(pillarPoints, pillar.kind, true);
      for (const button of pillarStates.children) {
        const active = button.dataset.state === state;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      }
    }
    // Soma o pacote inteiro (selo + captura + segurar) de cada pilar marcado para o time, nesta fase e acumulado até ela.
    const main = field === 'main';
    const unit = main ? 'pts' : 'moral';
    const sumPhase = (phaseData, team) => landmarks().filter(item => phaseData.pillars?.[item.id] === team);
    const rows = Object.entries(TEAMS).map(([key, team]) => {
      const taken = sumPhase(current(), key);
      const points = taken.reduce((total, item) => total + pillarTotal(scoring(item.kind)), 0);
      const accumulated = plan.fields[field].slice(0, phase + 1).reduce((total, phaseData) => total + sumPhase(phaseData, key).reduce((sum, item) => sum + pillarTotal(scoring(item.kind)), 0), 0);
      const row = document.createElement('div');
      row.className = 'score-row';
      row.style.setProperty('--team', team.color);
      const head = document.createElement('div');
      head.className = 'score-head';
      const dot = document.createElement('i');
      dot.className = 'dot';
      const name = document.createElement('strong');
      name.textContent = team.name;
      const value = document.createElement('b');
      value.textContent = `+${formatNumber(points)} ${unit}`;
      head.append(dot, name, value);
      const detail = document.createElement('small');
      const next = MORALE_STEPS.find(step => step > accumulated);
      const progress = main
        ? `acumulado até a fase ${phase + 1}: ${formatNumber(accumulated)} de 3.000 (${formatNumber(Math.min(100, accumulated / MAIN_GOAL * 100))}%)`
        : `acumulado até a fase ${phase + 1}: ${formatNumber(accumulated)} de moral · ${next ? `próximo buff em ${formatNumber(next)}` : 'todos os buffs liberados'}`;
      detail.textContent = taken.length ? `${taken.map(item => item.label).join(', ')} · ${progress}` : `Nenhum pilar nesta fase · ${progress}`;
      row.append(head, detail);
      return row;
    });
    scoreBoard.replaceChildren(...rows);
    const totalsText = ['pillar-s', 'pillar-a', 'pillar-b'].map(kind => `${LANDMARKS[kind].letter} ${formatNumber(pillarTotal(scoring(kind)))}`).join(', ');
    scoreTable.querySelectorAll('input').forEach(input => {
      const value = String(scoring(input.dataset.kind)[input.dataset.key]);
      if (document.activeElement !== input && input.value !== value) input.value = value;
    });
    scoreTotals.textContent = `Total por pilar: ${totalsText}.`;
    placeList.querySelectorAll('[data-place]').forEach(button => fillPoints(button.querySelector('small'), button.dataset.place, false));
    scoreHint.textContent = main
      ? `Campo principal · fase ${phase + 1}. Cada pilar conta o pacote inteiro para o time marcado (${totalsText}; valores em “Locais do mapa”). Abate vale 1 ponto.`
      : `Campo secundário · fase ${phase + 1}: os pilares geram moral para o principal (buffs em 1.000, 2.000 e 3.000). Quebrar o selo do S libera as skills de comandante.`;
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

  // Espadas que se cruzam duas vezes, com faísca, no fim da rota quando a primeira dupla chega (dura ~1,25 s da pausa final).
  function sword() {
    const g = svg('g', { transform: 'scale(1.05)' });
    g.append(
      svg('path', { d: 'M-3,-8 L-3,-40 L0,-46 L3,-40 L3,-8 Z', fill: '#e8eef5', stroke: '#1c2532', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }),
      svg('line', { x1: 0, y1: -11, x2: 0, y2: -39, stroke: '#9fb0c6', 'stroke-width': 1.2 }),
      svg('rect', { x: -2.2, y: -6, width: 4.4, height: 10, rx: 1.5, fill: '#6b4a2a', stroke: '#1c2532', 'stroke-width': 1.2 }),
      svg('rect', { x: -10, y: -10, width: 20, height: 4, rx: 2, fill: '#d6b978', stroke: '#1c2532', 'stroke-width': 1.2 }),
      svg('circle', { cy: 6, r: 3, fill: '#d6b978', stroke: '#1c2532', 'stroke-width': 1.2 })
    );
    return g;
  }
  function starPath(tips, outer, inner) {
    return `${Array.from({ length: tips * 2 }, (_, i) => {
      const r = i % 2 ? inner : outer;
      const angle = Math.PI * i / tips - Math.PI / 2;
      return `${i ? 'L' : 'M'}${round(Math.cos(angle) * r)},${round(Math.sin(angle) * r)}`;
    }).join(' ')} Z`;
  }
  // Cena da chegada (segundos após a primeira dupla chegar): as espadas entram pelos lados, batem uma vez a cada
  // dupla que chega (de WALK_LAG em WALK_LAG) e continuam batendo enquanto os pontinhos esperam no ponto final.
  // Em cada batida sai um brilho, uma onda de choque e faíscas. Espadas e pontinhos somem juntos no fim da volta.
  const CLASH_FIRST_HIT = .35;
  const CLASH_REPEAT = .6;
  // Tempo mínimo entre a chegada da primeira dupla e o fim da volta: batidas de todas as duplas + tremida + sumir.
  const clashLength = count => CLASH_FIRST_HIT + (count - 1) * WALK_LAG + 1.15;
  function drawClash(layer, end, travel, cycle, count) {
    const at = seconds => [0, ...seconds.map(s => (travel + s) / cycle), 1].map(t => t.toFixed(4)).join(';');
    const timing = { dur: `${cycle.toFixed(3)}s`, begin: '0s', repeatCount: 'indefinite', calcMode: 'linear' };
    const animate = (attributeName, values, seconds) => svg('animate', { ...timing, attributeName, values, keyTimes: at(seconds) });
    const transform = (type, values, seconds) => svg('animateTransform', { ...timing, attributeName: 'transform', type, values, keyTimes: at(seconds) });
    const fadeStart = cycle - travel - WALK_FADE;
    const hits = Array.from({ length: count }, (_, k) => round(CLASH_FIRST_HIT + k * WALK_LAG));
    while (hits.at(-1) + CLASH_REPEAT + .5 <= fadeStart) hits.push(round(hits.at(-1) + CLASH_REPEAT));
    const last = hits.at(-1);
    // Para cada batida: invisível logo antes, aparece na batida, some depois de "fade" segundos.
    const burst = fade => hits.flatMap(hit => [hit - .01, hit, hit + fade]);
    const pulse = (low, high) => [low, ...hits.flatMap(() => [low, high, low]), low].join(';');
    // Golpe em cada batida, recuo entre elas e tremida depois da última, cruzadas até sumir.
    const swingTimes = [0, ...hits.flatMap(hit => hit === last ? [hit] : [hit, hit + .2]), last + .15, last + .3, fadeStart];
    const swingValues = [-70, -70, ...hits.flatMap(hit => hit === last ? [30] : [30, -15]), 26, 32, 32, -70];
    const g = svg('g', { transform: `translate(${round(end.x)} ${round(end.y)})`, opacity: 0 });
    g.append(animate('opacity', '0;0;1;1;0', [0, .12, fadeStart]));
    for (const side of [-1, 1]) {
      const pivot = svg('g', { transform: `translate(${side * 22} 18) scale(${-side} 1)` });
      const approach = svg('g');
      approach.append(transform('translate', '-16 0;-16 0;0 0;0 0;-16 0', [0, .3, fadeStart]));
      const arm = svg('g');
      arm.append(transform('rotate', swingValues.join(';'), swingTimes), sword());
      approach.append(arm);
      pivot.append(approach);
      g.append(pivot);
    }
    const spark = svg('g', { transform: 'translate(0 -22)' });
    const flash = svg('g', { opacity: 0 });
    flash.append(
      animate('opacity', pulse(0, 1), burst(.2)),
      transform('scale', pulse(.3, 1.3), burst(.2)),
      svg('circle', { r: 14, fill: '#ffd36b', 'fill-opacity': .45 }),
      svg('path', { d: starPath(8, 16, 4.5), fill: '#fff6c2', stroke: '#c2410c', 'stroke-width': 1.5, 'stroke-linejoin': 'round' })
    );
    const ring = svg('circle', { r: 2, fill: 'none', stroke: '#ff7a1a', 'stroke-width': 3, opacity: 0 });
    ring.append(animate('opacity', pulse(0, .9), burst(.3)), animate('r', [2, ...hits.flatMap(() => [2, 4, 28]), 2].join(';'), burst(.3)));
    spark.append(ring, flash);
    // Faíscas: riscos que voam do ponto de contato, cada um numa direção e distância.
    for (let i = 0; i < 10; i++) {
      const direction = svg('g', { transform: `rotate(${i * 36 + (i % 3) * 9})` });
      const particle = svg('g', { opacity: 0 });
      const distances = hits.map((_, hit) => round((20 + (i * 7 + hit * 5) % 13) * (hit === hits.length - 1 ? 1.3 : 1)));
      particle.append(
        animate('opacity', pulse(0, 1), burst(.3)),
        transform('translate', ['0 0', ...distances.flatMap(distance => ['0 0', `0 ${-distance}`]), `0 ${-distances.at(-1)}`].join(';'), hits.flatMap(hit => [hit, hit + .3])),
        svg('line', { y1: -2, y2: -9, stroke: '#5a2a00', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-opacity': .75 }),
        svg('line', { y1: -2, y2: -9, stroke: '#ffd23f', 'stroke-width': 2.6, 'stroke-linecap': 'round' }),
        svg('circle', { cy: -10, r: 1.8, fill: '#ffffff' })
      );
      direction.append(particle);
      spark.append(direction);
    }
    g.append(spark);
    layer.append(g);
  }

  // Todas as rotas da fase partem juntas; cada PT leva 2 pontinhos lado a lado e as PTs da mesma rota seguem em coluna, de 2 em 2.
  function drawWalkers(routes) {
    const walks = routes.filter(route => route.parties.length).map(route => ({
      d: route.path.getAttribute('d'),
      parties: route.parties,
      label: route.label,
      end: route.path.getPointAtLength(route.path.getTotalLength()),
      travel: Math.max(1.2, route.path.getTotalLength() / WALK_SPEED)
    }));
    const signature = `${field}|${phase}|${walks.map(walk => `${walk.d}:${walk.parties.map(party => party.id)}`).join('|')}`;
    if (walks.length) {
      // A volta só recomeça depois que todas as duplas chegaram e levaram sua batida de espada.
      const cycle = Math.max(...walks.map(walk => walk.travel + Math.max(WALK_PAUSE, clashLength(walk.parties.length))));
      const timing = { dur: `${cycle.toFixed(3)}s`, repeatCount: 'indefinite' };
      // Cada pontinho aparece ao sair e some no fim da volta, no mesmo instante que os outros e que as espadas.
      const fade = lag => {
        const times = lag ? [0, .35, cycle - WALK_FADE - lag, cycle - lag, cycle] : [0, .35, cycle - WALK_FADE, cycle];
        return { values: lag ? '0;1;1;0;0' : '0;1;1;0', keyTimes: times.map(t => (t / cycle).toFixed(4)).join(';') };
      };
      const layer = svg('g', { class: 'walkers', 'pointer-events': 'none' });
      const badges = [];
      for (const walk of walks) {
        const arrival = (walk.travel / cycle).toFixed(4);
        // A plaquinha segue o pontinho da frente sem girar, logo acima da formação.
        const carrier = svg('g', { opacity: 0 });
        carrier.append(
          svg('animateMotion', { ...timing, begin: '0s', path: walk.d, calcMode: 'linear', keyPoints: '0;1;1', keyTimes: `0;${arrival};1` }),
          svg('animate', { ...timing, begin: '0s', attributeName: 'opacity', ...fade(0) })
        );
        const badge = nameBadge(walk.parties, walk.label);
        badge.setAttribute('transform', `translate(0 ${-(WALK_PAIR / 2 + 34 + badgeHeight(badge) / 2)})`);
        carrier.append(badge);
        badges.push(badge);
        // Coluna de 2 em 2: os 2 pontinhos de cada PT lado a lado, e cada PT uma dupla atrás da anterior.
        walk.parties.forEach((party, i) => {
          const lag = round(i * WALK_LAG);
          for (const offset of [-WALK_PAIR / 2, WALK_PAIR / 2]) {
            const walker = svg('g', { opacity: 0 });
            walker.append(
              svg('animateMotion', { ...timing, begin: `${lag}s`, path: walk.d, rotate: 'auto', calcMode: 'linear', keyPoints: '0;1;1', keyTimes: `0;${arrival};1` }),
              svg('animate', { ...timing, begin: `${lag}s`, attributeName: 'opacity', ...fade(lag) })
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
        layer.append(carrier);
        drawClash(layer, walk.end, walk.travel, cycle, walk.parties.length);
      }
      board.append(layer);
      badges.forEach(fitBadge);
    }
    // Recomeça a caminhada só quando as rotas mudam, para não reiniciar a cada redesenho.
    if (signature !== walkSignature) {
      walkSignature = signature;
      board.setCurrentTime?.(0);
    }
  }

  function renderBoard() {
    hoverId = null; // o cartão do mouse se atualiza no próximo movimento
    base();
    const places = svg('g', { id: 'landmarks' });
    for (const item of landmarks()) drawLandmark(item, places);
    const layer = svg('g', { id: 'annotations' });
    board.append(places, layer);
    const routes = [];
    for (const item of current().items) {
      const node = drawItem(item, layer);
      if (item.type === 'route' && node) routes.push({ path: node.querySelector('[data-route-path]'), parties: itemParties(item), label: item.label });
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
      [...groupSelect.options].forEach((option, i) => { option.textContent = groupName(i + 1); });
      groupSelect.value = String(party.group);
      groupSelect.setAttribute('aria-label', `Grupo de ${party.name}`);
      const remove = row.querySelector('.party-remove');
      remove.hidden = plan.parties.length === 1;
      remove.setAttribute('aria-label', `Remover ${party.name}`);
    });
    addPartyButton.disabled = plan.parties.length >= MAX_PARTIES;
    const allChip = groupChips.querySelector('[data-all-chip]');
    allChip.hidden = plan.parties.length < 2;
    allChip.classList.toggle('active', active.length === plan.parties.length);
    for (const chip of groupChips.querySelectorAll('[data-group-chip]')) {
      const members = plan.parties.filter(party => party.group === Number(chip.dataset.groupChip));
      const dots = document.createElement('span');
      dots.className = 'dots';
      for (const party of members) {
        const dot = document.createElement('i');
        dot.style.background = party.color;
        dots.append(dot);
      }
      chip.replaceChildren(groupName(Number(chip.dataset.groupChip)), dots);
      chip.hidden = !members.length;
      chip.title = `${partyNames(members)} · duplo clique para renomear`;
      chip.classList.toggle('active', members.length === active.length && members.every(party => active.includes(party)));
    }
    groupNameList.querySelectorAll('input').forEach((input, i) => {
      if (document.activeElement !== input && input.value !== groupName(i + 1)) input.value = groupName(i + 1);
      const dots = input.previousElementSibling;
      dots.replaceChildren(...plan.parties.filter(party => party.group === i + 1).map(party => Object.assign(document.createElement('i'), { style: `background:${party.color}` })));
    });
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

  // Seleciona o item (ou limpa a seleção) e prepara o arraste; usado pelo Mover e pelas ferramentas de colocar.
  function selectItem(hit) {
    selectedId = hit?.id || null;
    // Só marca a seleção, sem redesenhar o mapa: redesenhar troca o elemento clicado e o navegador perde o clique/duplo clique.
    board.querySelectorAll('[data-ann-id]').forEach(node => node.classList.toggle('selected', Boolean(selectedId) && node.dataset.annId === selectedId));
    renderPillarPanel();
    if (selectedPillar()) {
      pillarInspector.scrollIntoView({ block: 'nearest' });
      setStatus(`${hit.label} selecionado. Marque quem controla nesta fase no painel “Locais do mapa”.`);
    } else if (hit?.type === 'route' || hit?.type === 'token') {
      setStatus(`${describeItem(hit)} selecionado. Duplo clique ou botão direito para editar o nome da plaquinha.`);
    } else if (hit?.type === 'text') {
      setStatus('Texto selecionado. Duplo clique para editar.');
    }
  }
  function grab(hit, p) {
    selectItem(hit);
    if (hit) interaction = { kind: 'move', id: hit.id, start: p, original: structuredClone(hit), recorded: false };
  }

  board.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const p = point(event);
    const hit = hitItem(event);
    // Com Local ou PT, clicar num pilar/marcador que já existe seleciona e arrasta, sem precisar trocar para o Mover.
    const grabsExisting = hit && ((tool === 'place' && landmarks().includes(hit)) || (tool === 'token' && hit.type === 'token'));
    if (tool === 'laser') { showLaser(p); return; }
    if (tool === 'pan') {
      interaction = { kind: 'pan', startX: event.clientX, startY: event.clientY, initial: { ...view }, scale: board.getScreenCTM().a };
    } else if (tool === 'select' || grabsExisting) {
      grab(hit, p);
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
      // Evita que o clique tire o foco da caixinha que vai abrir; clicar num texto existente edita ele.
      event.preventDefault();
      closeTextEditor(true);
      openTextEditor(hit?.type === 'text' ? hit : null, p);
    } else if (tool === 'place') {
      event.preventDefault();
      openPlacePicker(p, event.clientX, event.clientY);
    } else if (tool === 'arrow') {
      interaction = { kind: 'draw-route', points: [p], end: p, straight: event.shiftKey, hit };
      renderBoard();
    } else if (tool === 'pen') {
      interaction = { kind: 'draw-pen', points: [p], hit };
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
    // Rota/Caneta: um clique simples (sem arrastar) em cima de algo seleciona esse algo em vez de desenhar.
    const drawing = interaction.kind === 'draw-route' || interaction.kind === 'draw-pen';
    if (drawing && interaction.hit && pathLength([...interaction.points, point(event)]) <= 6) {
      const hit = interaction.hit;
      interaction = null;
      if (board.hasPointerCapture(event.pointerId)) board.releasePointerCapture(event.pointerId);
      renderBoard();
      selectItem(hit);
      return;
    }
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
    // Clique sem arrastar (selecionar) ou arrastar o mapa não muda o desenho: sem redesenhar, o navegador mantém o clique e o duplo clique.
    const unchanged = (interaction.kind === 'move' && !interaction.recorded) || interaction.kind === 'pan';
    interaction = null;
    if (board.hasPointerCapture(event.pointerId)) board.releasePointerCapture(event.pointerId);
    if (!unchanged) renderBoard();
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
  document.querySelectorAll('[data-tool]').forEach(button => {
    button.title = `${button.getAttribute('aria-label')} (atalho: ${TOOL_KEYS[button.dataset.tool]})`;
    button.addEventListener('click', () => chooseTool(button.dataset.tool));
  });
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
    const text = Object.assign(document.createElement('span'), { className: 'place-text' });
    text.append(Object.assign(document.createElement('span'), { textContent: info.name }), document.createElement('small'));
    button.append(icon, text);
    placeList.append(button);
  }
  placeList.addEventListener('click', event => {
    const button = event.target.closest('[data-place]');
    if (!button) return;
    placeKind = button.dataset.place;
    tool = 'place';
    selectedId = null;
    render();
    setStatus(`Clique no mapa e escolha o pilar (${LANDMARKS[placeKind].name} vem destacado).`);
  });
  // Apagar ou restaurar todos os locais do campo atual (vale para as 3 fases; Ctrl+Z desfaz).
  const fieldName = () => field === 'main' ? 'campo principal' : 'campo secundário';
  function replaceLandmarks(list) {
    remember();
    plan.landmarks[field] = list;
    const ids = new Set(list.map(item => item.id));
    for (const phaseData of plan.fields[field]) {
      for (const id of Object.keys(phaseData.pillars || {})) if (!ids.has(id)) delete phaseData.pillars[id];
    }
    selectedId = null;
    render();
  }
  document.querySelector('#clear-places').addEventListener('click', event => {
    const count = landmarks().length;
    if (!count) { setStatus(`O ${fieldName()} já está sem locais.`); return; }
    askConfirm(event.currentTarget, `Apagar os ${count} locais do ${fieldName()} (nas 3 fases)? Dá para desfazer com Ctrl+Z.`, 'Apagar', () => {
      replaceLandmarks([]);
      setStatus(`${count} locais apagados do ${fieldName()}. Ctrl+Z desfaz.`);
    });
  });
  // Limpar marcações: rotas, marcadores, textos e desenhos desta fase ou das 3 fases; os locais e seus donos ficam.
  document.querySelector('#clear-marks').addEventListener('click', event => {
    const phases = plan.fields[field];
    const here = current().items.length;
    const all = phases.reduce((total, phaseData) => total + phaseData.items.length, 0);
    if (!all) { setStatus(`Não há marcações no ${fieldName()}.`); return; }
    const clear = (list, scope) => {
      remember();
      for (const phaseData of list) phaseData.items = [];
      selectedId = null;
      render();
      setStatus(`Marcações apagadas (${scope}). Os locais do mapa continuam. Ctrl+Z desfaz.`);
    };
    const actions = Object.assign(document.createElement('div'), { className: 'pop-actions' });
    const option = (label, className, onClick, disabled = false) => {
      const button = Object.assign(document.createElement('button'), { type: 'button', className, textContent: label, disabled });
      button.addEventListener('click', () => { closePopover(); onClick(); });
      return button;
    };
    actions.append(
      option('Cancelar', 'btn mini', () => setStatus('Nada foi alterado.')),
      option(`Só a fase ${phase + 1} (${here})`, 'btn mini danger', () => clear([current()], `fase ${phase + 1}`), !here),
      option(`As 3 fases (${all})`, 'btn mini danger', () => clear(phases, 'as 3 fases'))
    );
    openPopover(event.currentTarget, [popTitle('Limpar marcações do mapa'), popNote(`Apaga rotas, marcadores de PT, textos e desenhos do ${fieldName()}. Os locais e quem controla cada um continuam.`), actions]);
  });
  document.querySelector('#reset-places').addEventListener('click', event => {
    const place = () => {
      replaceLandmarks(defaultLandmarks());
      setStatus(`Os ${DEFAULT_PILLARS.length} locais possíveis dos pilares foram colocados no ${fieldName()}. Ctrl+Z desfaz.`);
    };
    if (!landmarks().length) { place(); return; }
    askConfirm(event.currentTarget, `Colocar os ${DEFAULT_PILLARS.length} locais possíveis no ${fieldName()}? Os ${landmarks().length} locais atuais deste campo serão substituídos.`, 'Colocar', place);
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
    const row = document.createElement('label');
    row.className = 'group-name-row';
    const dots = document.createElement('span');
    dots.className = 'dots';
    const input = Object.assign(document.createElement('input'), { type: 'text', maxLength: GROUP_NAME_LIMIT, spellcheck: false, autocomplete: 'off' });
    input.setAttribute('aria-label', `Nome do grupo ${group}`);
    input.dataset.group = group;
    row.append(dots, input);
    groupNameList.append(row);
  }
  const allChip = Object.assign(document.createElement('button'), { type: 'button', className: 'chip all-chip', textContent: 'Todas', title: 'Selecionar todas as PTs para andarem juntas' });
  allChip.dataset.allChip = '';
  groupChips.append(allChip);
  // Tabela editável de pontos dos pilares (linhas S, A, B).
  scoreTable.append(...['', ...SCORING_FIELDS.map(([, label]) => label)].map(text => Object.assign(document.createElement('span'), { className: 'score-th', textContent: text })));
  for (const kind of ['pillar-s', 'pillar-a', 'pillar-b']) {
    scoreTable.append(Object.assign(document.createElement('b'), { className: `score-tier ${kind}`, textContent: LANDMARKS[kind].letter }));
    for (const [key, label] of SCORING_FIELDS) {
      const input = Object.assign(document.createElement('input'), { type: 'number', min: 0, max: 9999, step: 1, inputMode: 'numeric' });
      input.dataset.kind = kind;
      input.dataset.key = key;
      input.setAttribute('aria-label', `${label} do pilar ${LANDMARKS[kind].letter}`);
      scoreTable.append(input);
    }
  }
  scoreTable.addEventListener('change', event => {
    const { kind, key } = event.target.dataset;
    if (!kind) return;
    const value = clamp(Math.floor(finite(event.target.value, DEFAULT_SCORING[kind][key])), 0, 9999);
    remember();
    plan.scoring ||= {};
    plan.scoring[kind] = { ...scoring(kind), [key]: value };
    render();
    setStatus(`${LANDMARKS[kind].name}: total de ${pillarTotal(scoring(kind))} por pilar.`);
  });
  groupChips.addEventListener('dblclick', event => {
    const chip = event.target.closest('[data-group-chip]');
    if (!chip) return;
    groupNameList.closest('details').open = true;
    const input = groupNameList.querySelector(`input[data-group="${chip.dataset.groupChip}"]`);
    input.focus();
    input.select();
    setStatus('Digite o novo nome do grupo e aperte Enter.');
  });
  // Nomes dos grupos: atualiza ao digitar e entra no desfazer quando o campo é confirmado.
  let groupSnapshot = null;
  groupNameList.addEventListener('focusin', event => { if (event.target.matches('input')) groupSnapshot = JSON.stringify(plan); });
  groupNameList.addEventListener('input', event => {
    const index = Number(event.target.dataset.group) - 1;
    plan.groups ||= defaultGroups();
    plan.groups[index] = event.target.value.slice(0, GROUP_NAME_LIMIT);
    renderParties();
    renderBoard();
  });
  groupNameList.addEventListener('keydown', event => { if (event.key === 'Enter') event.target.blur(); });
  groupNameList.addEventListener('change', event => {
    const number = Number(event.target.dataset.group);
    plan.groups ||= defaultGroups();
    plan.groups[number - 1] = event.target.value.trim().slice(0, GROUP_NAME_LIMIT) || `Grupo ${number}`;
    event.target.value = plan.groups[number - 1];
    if (groupSnapshot && groupSnapshot !== JSON.stringify(plan)) {
      undoStack.push(groupSnapshot);
      if (undoStack.length > 50) undoStack.shift();
      redoStack = [];
    }
    groupSnapshot = JSON.stringify(plan);
    render();
    setStatus(`Grupo ${number} agora se chama “${plan.groups[number - 1]}”.`);
  });
  groupChips.addEventListener('click', event => {
    if (event.target.closest('[data-all-chip]')) {
      selectedParties = plan.parties.map(party => party.id);
      render();
      setStatus(describeSelection());
      return;
    }
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
    if (event.target.closest('.party-remove')) { removeParty(id, event.target.closest('.party-remove')); return; }
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
      setStatus(`${party.name} agora está no grupo “${groupName(party.group)}”.`);
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
  function removeParty(id, anchor) {
    const party = partyById(id);
    if (!party || plan.parties.length === 1) return;
    let orphaned = 0;
    for (const name of FIELDS) for (const phaseData of plan.fields[name]) orphaned += phaseData.items.filter(item => item.parties.length === 1 && item.parties[0] === id).length;
    if (orphaned) askConfirm(anchor, `Remover ${party.name}? ${orphaned} marcação(ões) só dessa PT também serão apagadas.`, 'Remover', () => dropParty(party));
    else dropParty(party);
  }
  function dropParty(party) {
    const id = party.id;
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
    const shortcut = Object.keys(TOOL_KEYS).find(name => TOOL_KEYS[name] === event.key.toUpperCase());
    if (!editing && shortcut && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); chooseTool(shortcut); }
  });

  // Menu do botão direito sobre o mapa: ações no elemento clicado, ferramentas e desfazer/refazer.
  const contextMenu = document.querySelector('#context-menu');
  const STATE_LABELS = { neutral: 'Neutro', dawn: 'Dawn', lush: 'Lush', off: 'Inativo' };
  function describeItem(item) {
    if (landmarks().includes(item)) return `${item.label} · ${LANDMARKS[item.kind].name}`;
    const names = partyNames(itemParties(item)) || 'sem PT';
    const group = matchingGroup(itemParties(item));
    if (group && (item.type === 'route' || item.type === 'token')) return `${item.type === 'route' ? 'Rota' : 'Marcador'} · ${group.name} (${names})`;
    if (item.type === 'route') return `Rota · ${names}`;
    if (item.type === 'pen') return `Desenho · ${names}`;
    if (item.type === 'token') return `Marcador · ${names}`;
    return `Texto · “${item.text}”`;
  }
  // Texto digitado direto no mapa: uma caixinha aparece no lugar do texto; Enter confirma, Esc cancela.
  const TEXT_LIMIT = 60;
  const textEditor = document.querySelector('#text-editor');
  let textEditing = null;
  function openTextEditor(item, point) {
    const at = item || point;
    textEditing = { item, point: { x: round(at.x), y: round(at.y) } };
    const ctm = board.getScreenCTM();
    const frame = boardFrame.getBoundingClientRect();
    const spot = new DOMPoint(at.x, at.y).matrixTransform(ctm);
    const scale = ctm.a;
    Object.assign(textEditor.style, {
      left: `${spot.x - frame.left}px`,
      top: `${spot.y - frame.top - 27 * scale}px`,
      height: `${Math.max(26, 39 * scale)}px`,
      fontSize: `${Math.max(12, 20 * scale)}px`,
      borderColor: item ? itemColor(item) : activeParties()[0].color
    });
    textEditor.value = item ? item.text : '';
    textEditor.hidden = false;
    sizeTextEditor();
    requestAnimationFrame(() => { textEditor.focus(); textEditor.select(); });
    setStatus(item ? 'Edite o texto e aperte Enter. Esc cancela; apagar tudo remove o texto.' : 'Digite o texto e aperte Enter. Esc cancela.');
  }
  function sizeTextEditor() { textEditor.style.width = `${Math.max(10, textEditor.value.length + 3)}ch`; }
  function closeTextEditor(save) {
    if (!textEditing) return;
    const { item, point } = textEditing;
    textEditing = null;
    textEditor.blur();
    textEditor.hidden = true;
    if (!save) { setStatus('Texto cancelado.'); return; }
    if (item) { saveText(item, textEditor.value); return; }
    const text = textEditor.value.trim().slice(0, TEXT_LIMIT);
    if (!text) return;
    remember();
    current().items.push({ id: nextId(), type: 'text', x: point.x, y: point.y, text, parties: activeParties().map(party => party.id) });
    render();
    setStatus('Texto colocado no mapa. Duplo clique nele para editar.');
  }
  function saveText(item, value) {
    const text = value.trim().slice(0, TEXT_LIMIT);
    if (text === item.text) return;
    remember();
    if (text) item.text = text;
    else current().items = current().items.filter(other => other !== item);
    selectedId = null;
    render();
    setStatus(text ? 'Texto atualizado.' : 'Texto apagado.');
  }
  textEditor.addEventListener('input', sizeTextEditor);
  textEditor.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); closeTextEditor(true); }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeTextEditor(false); }
  });
  textEditor.addEventListener('blur', () => closeTextEditor(true));

  // Nome editável da plaquinha de rotas e marcadores; vazio volta a mostrar o nome das PTs.
  function saveItemLabel(item, value) {
    const label = value.trim().slice(0, LABEL_LIMIT);
    if (label === (item.label || '')) return;
    remember();
    if (label) item.label = label;
    else delete item.label;
    render();
    setStatus(label ? `Plaquinha renomeada para “${label}”.` : 'A plaquinha voltou a mostrar o nome das PTs.');
  }
  let menuCommit = null;
  function closeContextMenu(commit = true) {
    if (contextMenu.hidden) return;
    const pending = menuCommit;
    menuCommit = null;
    contextMenu.hidden = true;
    contextMenu.replaceChildren();
    if (commit) pending?.();
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
    let labelInput = null;
    if (hit) {
      parts.push(Object.assign(document.createElement('div'), { className: 'menu-title', textContent: describeItem(hit) }));
      if (hit.type === 'route' || hit.type === 'token' || hit.type === 'text') {
        const isText = hit.type === 'text';
        const box = document.createElement('label');
        box.className = 'menu-field';
        labelInput = Object.assign(document.createElement('input'), isText
          ? { type: 'text', maxLength: TEXT_LIMIT, value: hit.text, spellcheck: false, autocomplete: 'off' }
          : { type: 'text', maxLength: LABEL_LIMIT, value: hit.label || '', placeholder: matchingGroup(itemParties(hit))?.name || tokenLabel(itemParties(hit)), spellcheck: false, autocomplete: 'off' });
        labelInput.addEventListener('keydown', keyEvent => {
          if (keyEvent.key === 'Enter') { keyEvent.preventDefault(); closeContextMenu(); }
        });
        box.append(isText ? 'Texto' : 'Nome na plaquinha', labelInput, Object.assign(document.createElement('small'), { textContent: isText ? 'Enter salva · vazio apaga o texto' : 'Enter salva · vazio usa o nome das PTs' }));
        parts.push(box);
        const input = labelInput;
        menuCommit = () => isText ? saveText(hit, input.value) : saveItemLabel(hit, input.value);
      }
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
    if (labelInput) { labelInput.focus(); labelInput.select(); }
    else contextMenu.querySelector('button:not(:disabled)')?.focus();
  }
  board.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (!interaction) openContextMenu(event);
  });
  board.addEventListener('dblclick', event => {
    // O primeiro clique redesenha o mapa, então o alvo do evento pode ser um elemento antigo: usa o que está sob o ponteiro.
    const node = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-ann-id]');
    const hit = node?.dataset.annId ? findItem(node.dataset.annId) : null;
    if (tool !== 'select') return;
    if (hit?.type === 'text') openTextEditor(hit);
    else if (hit?.type === 'route' || hit?.type === 'token') openContextMenu(event);
  });
  document.addEventListener('pointerdown', event => { if (!contextMenu.contains(event.target)) closeContextMenu(); }, true);
  document.addEventListener('keydown', event => {
    if (contextMenu.hidden || event.key !== 'Escape') return;
    event.stopImmediatePropagation();
    closeContextMenu(false);
  }, true);
  // Cartão ao passar o mouse: pontos e dono do pilar, PTs e tempo da rota, PTs do marcador.
  const hoverCard = document.querySelector('#hover-card');
  const STATE_COLORS = { neutral: '#2b5149', dawn: TEAMS.dawn.color, lush: TEAMS.lush.color, off: '#4b5a58' };
  let hoverId = null;
  const el = (tag, className, text) => Object.assign(document.createElement(tag), { className, ...(text !== undefined && { textContent: text }) });
  function hideHover() {
    hoverId = null;
    hoverCard.hidden = true;
  }
  function partyChips(parties) {
    const list = el('div', 'hc-parties');
    for (const party of parties) {
      const chip = el('span', 'hc-party');
      chip.append(Object.assign(document.createElement('i'), { style: `background:${party.color}` }), party.name);
      list.append(chip);
    }
    return list;
  }
  function hoverHead(title, sub, icon) {
    const head = el('div', 'hc-head');
    if (icon) head.append(icon);
    const text = el('div');
    text.append(el('div', 'hc-title', title));
    if (sub) text.append(sub);
    head.append(text);
    return head;
  }
  function fillHover(item) {
    const parts = [];
    if (landmarks().includes(item)) {
      const values = scoring(item.kind);
      const state = current().pillars?.[item.id] || 'neutral';
      const icon = document.createElementNS(SVG_NS, 'svg');
      icon.setAttribute('viewBox', '-42 -30 84 60');
      icon.append(landmarkIcon(item.kind));
      const sub = el('div', 'hc-sub', `Fase ${phase + 1} · `);
      const chip = el('span', 'hc-chip', state === 'neutral' ? 'Neutro' : state === 'off' ? 'Inativo' : `Com ${TEAMS[state].name}`);
      chip.style.background = STATE_COLORS[state];
      chip.style.color = state === 'dawn' || state === 'lush' ? '#13200c' : '#fff';
      sub.append(chip);
      const rows = el('div', 'hc-rows');
      for (const [label, value] of [['Quebrar o selo', values.seal], ['Capturar a zona', values.capture], [`Segurar ${values.hold} s (a cada ${RETAIN_TICK} s)`, values.retain]]) rows.append(el('span', '', label), el('b', '', formatNumber(value)));
      const total = el('div', 'hc-total');
      total.style.setProperty('--tier', PILLAR_COLORS[item.kind].mid);
      total.append(el('span', '', 'Total'), el('b', '', `${formatNumber(pillarTotal(values))} ${field === 'main' ? 'pts' : 'de moral'}`));
      parts.push(hoverHead(`${item.label} · ${LANDMARKS[item.kind].name}`, sub, icon), rows, total, el('div', 'hc-hint', 'Clique (Mover) para marcar o dono · botão direito: ações'));
    } else {
      const parties = itemParties(item);
      const group = matchingGroup(parties);
      if (item.type === 'route') {
        const seconds = Math.max(1.2, pathLength(item.points) / WALK_SPEED);
        parts.push(hoverHead(`Rota · ${item.label || group?.name || tokenLabel(parties)}`, el('div', 'hc-sub', `${parties.length} PT(s) · ~${formatNumber(Math.round(seconds))} s até chegar`)), partyChips(parties), el('div', 'hc-hint', 'Duplo clique: renomear a plaquinha · botão direito: ações'));
      } else if (item.type === 'token') {
        parts.push(hoverHead(`Marcador · ${item.label || group?.name || tokenLabel(parties)}`, el('div', 'hc-sub', `${parties.length} PT(s) neste ponto`)), partyChips(parties), el('div', 'hc-hint', 'Duplo clique: renomear · arraste com Mover'));
      } else if (item.type === 'text') {
        parts.push(hoverHead('Texto', el('div', 'hc-sub', `“${item.text}”`)), el('div', 'hc-hint', 'Duplo clique para editar · botão direito: ações'));
      } else {
        parts.push(hoverHead('Desenho', el('div', 'hc-sub', partyNames(parties) || 'sem PT')), el('div', 'hc-hint', 'Arraste com Mover · botão direito: ações'));
      }
    }
    hoverCard.replaceChildren(...parts);
  }
  board.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || interaction || tool === 'laser' || textEditing || !contextMenu.hidden) { hideHover(); return; }
    const node = event.target.closest?.('[data-ann-id]');
    const item = node?.dataset.annId ? findItem(node.dataset.annId) : null;
    if (!item) { hideHover(); return; }
    if (item.id !== hoverId) {
      hoverId = item.id;
      fillHover(item);
      hoverCard.hidden = false;
    }
    const { width, height } = hoverCard.getBoundingClientRect();
    const left = event.clientX + 18 + width > innerWidth - 8 ? event.clientX - width - 18 : event.clientX + 18;
    const top = event.clientY + 18 + height > innerHeight - 8 ? event.clientY - height - 18 : event.clientY + 18;
    Object.assign(hoverCard.style, { left: `${Math.max(8, left)}px`, top: `${Math.max(8, top)}px` });
  });
  board.addEventListener('pointerleave', hideHover);
  board.addEventListener('pointerdown', hideHover);
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
  // Salvar guarda o plano neste navegador (reabre sozinho na próxima visita); baixar o arquivo é opcional.
  const STORAGE_KEY = 'vale-of-clash:plano';
  const popover = document.querySelector('#popover');
  const formatDate = iso => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  function readStored() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return stored?.plan && stored.savedAt ? stored : null;
    } catch { return null; }
  }
  function storeLocally() {
    try {
      const savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt, plan }));
      return savedAt;
    } catch { return null; }
  }
  const downloadPlan = () => {
    download(new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }), 'vale-of-clash-plano.json');
    setStatus('Arquivo do plano baixado. Use “Abrir plano” para carregá-lo em outro computador.');
  };
  let popoverCleanup = null;
  function closePopover() {
    popover.hidden = true;
    popover.replaceChildren();
    popoverCleanup?.();
    popoverCleanup = null;
  }
  // Âncora: um elemento (abre alinhado à direita dele) ou um ponto da tela { x, y } (abre ao lado do ponto).
  function openPopover(anchor, parts) {
    popover.replaceChildren(...parts);
    popover.hidden = false;
    const point = anchor.getBoundingClientRect ? null : anchor;
    const box = point ? { left: point.x + 14, right: point.x + 14, top: point.y - 10, bottom: point.y - 10 } : anchor.getBoundingClientRect();
    const { width, height } = popover.getBoundingClientRect();
    const left = point ? (box.left + width > innerWidth - 8 ? point.x - width - 14 : box.left) : box.right - width;
    popover.style.left = `${Math.max(8, Math.min(left, innerWidth - width - 8))}px`;
    popover.style.top = `${box.bottom + height + 14 > innerHeight ? Math.max(8, box.top - height - 6) : box.bottom + 6}px`;
    popover.querySelector('button:not(:disabled)')?.focus();
  }
  // Menuzinho da ferramenta Local: escolher qual pilar colocar no ponto clicado (marcado com um círculo tracejado).
  function openPlacePicker(point, clientX, clientY) {
    const ghost = svg('circle', { cx: round(point.x), cy: round(point.y), r: 26, fill: '#fff7af', 'fill-opacity': .15, stroke: '#fff7af', 'stroke-width': 3, 'stroke-dasharray': '7 5', 'pointer-events': 'none' });
    board.append(ghost);
    const unit = field === 'main' ? 'pts' : 'de moral';
    const choices = ['pillar-s', 'pillar-a', 'pillar-b'].map(kind => {
      const button = Object.assign(document.createElement('button'), { type: 'button', className: 'menu-item place-pick' });
      const icon = document.createElementNS(SVG_NS, 'svg');
      icon.setAttribute('viewBox', '-42 -30 84 60');
      icon.append(landmarkIcon(kind));
      const text = el('span', 'place-text');
      text.append(el('span', '', LANDMARKS[kind].name), el('small', '', `${nextPillarLabel(kind)} · vale ${formatNumber(pillarTotal(scoring(kind)))} ${unit}`));
      button.append(icon, text);
      button.addEventListener('click', () => { closePopover(); placePillar(kind, point); });
      return button;
    });
    openPopover({ x: clientX, y: clientY }, [popTitle('Colocar pilar aqui'), ...choices, popNote('Esc ou clique fora cancela.')]);
    popoverCleanup = () => ghost.remove();
    choices[['pillar-s', 'pillar-a', 'pillar-b'].indexOf(placeKind)]?.focus();
    setStatus('Escolha qual pilar colocar no ponto marcado.');
  }
  function placePillar(kind, point) {
    placeKind = kind;
    remember();
    const label = nextPillarLabel(kind);
    landmarks().push({ id: nextId(), kind, label, x: round(point.x), y: round(point.y) });
    render();
    setStatus(`${label} (${LANDMARKS[kind].name}) colocado. Ele aparece nas 3 fases deste campo.`);
  }
  // Confirmação dentro da página: o navegador embutido do app bloqueia o confirm() nativo.
  function askConfirm(anchor, message, confirmLabel, onConfirm) {
    const actions = Object.assign(document.createElement('div'), { className: 'pop-actions' });
    const cancel = Object.assign(document.createElement('button'), { type: 'button', className: 'btn mini', textContent: 'Cancelar' });
    const accept = Object.assign(document.createElement('button'), { type: 'button', className: 'btn mini danger', textContent: confirmLabel });
    cancel.addEventListener('click', () => { closePopover(); setStatus('Nada foi alterado.'); });
    accept.addEventListener('click', () => { closePopover(); onConfirm(); });
    actions.append(cancel, accept);
    openPopover(anchor, [popNote(message), actions]);
  }
  const popTitle = text => Object.assign(document.createElement('div'), { className: 'menu-title', textContent: text });
  const popNote = text => Object.assign(document.createElement('p'), { className: 'pop-note', textContent: text });
  function popButton(icon, label, action, disabled = false) {
    const button = Object.assign(document.createElement('button'), { type: 'button', className: 'menu-item', disabled });
    button.append(Object.assign(document.createElement('span'), { className: 'menu-icon', textContent: icon }), label);
    button.addEventListener('click', () => { closePopover(); action(); });
    return button;
  }
  function loadPlan(raw, message) {
    plan = normalize(raw);
    undoStack = []; redoStack = []; selectedId = null;
    resetView(); render(); setStatus(message);
  }
  document.querySelector('#save-plan').addEventListener('click', event => {
    const savedAt = storeLocally();
    setStatus(savedAt ? `Plano salvo neste navegador (${formatDate(savedAt)}).` : 'Não foi possível salvar no navegador. Baixe o arquivo para não perder o plano.');
    openPopover(event.currentTarget, savedAt
      ? [popTitle('✓ Plano salvo neste navegador'), popNote(`${formatDate(savedAt)} · ele reabre sozinho quando você voltar ao quadro.`), popButton('⤓', 'Baixar arquivo (.json)', downloadPlan), popNote('Baixe para mandar à guild ou usar em outro computador.')]
      : [popTitle('Não deu para salvar no navegador'), popNote('O plano pode estar grande demais (mapa importado) ou o navegador bloqueou o armazenamento.'), popButton('⤓', 'Baixar arquivo (.json)', downloadPlan)]);
  });
  document.querySelector('#open-plan').addEventListener('click', event => {
    const stored = readStored();
    openPopover(event.currentTarget, [
      popButton('↺', stored ? `Último salvo (${formatDate(stored.savedAt)})` : 'Nenhum plano salvo neste navegador', () => {
        try { loadPlan(stored.plan, `Plano salvo em ${formatDate(stored.savedAt)} aberto.`); }
        catch { setStatus('Não foi possível abrir o plano salvo.'); }
      }, !stored),
      popButton('📂', 'Arquivo do computador…', () => document.querySelector('#plan-file').click()),
      popButton('✚', 'Começar plano em branco', () => {
        askConfirm(document.querySelector('#open-plan'), 'Começar um plano em branco? O plano atual sai da tela; o que foi salvo continua guardado.', 'Começar', () => {
          loadPlan(freshPlan(), 'Plano em branco. Use “Salvar plano” para guardá-lo.');
        });
      })
    ]);
  });
  document.addEventListener('pointerdown', event => {
    if (!popover.hidden && !popover.contains(event.target) && !event.target.closest('#save-plan, #open-plan')) closePopover();
  }, true);
  document.addEventListener('keydown', event => {
    if (popover.hidden || event.key !== 'Escape') return;
    event.stopImmediatePropagation();
    closePopover();
  }, true);

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
    if (Array.isArray(raw.groups)) {
      safe.groups = defaultGroups().map((fallback, i) => String(raw.groups[i] || '').trim().slice(0, GROUP_NAME_LIMIT) || fallback);
    }
    if (raw.scoring && typeof raw.scoring === 'object') {
      for (const kind of Object.keys(DEFAULT_SCORING)) {
        const source = raw.scoring[kind] || {};
        for (const [key] of SCORING_FIELDS) safe.scoring[kind][key] = clamp(Math.floor(finite(source[key], DEFAULT_SCORING[kind][key])), 0, 9999);
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
          const label = (type === 'route' || type === 'token') && typeof source.label === 'string' ? source.label.trim().slice(0, LABEL_LIMIT) : '';
          if (label) item.label = label;
          safe.fields[name][i].items.push(item);
        }
      }
    }
    return safe;
  }
  document.querySelector('#plan-file').addEventListener('change', event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > 22 * 1024 * 1024) { setStatus('O plano é grande demais para abrir.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try { loadPlan(JSON.parse(String(reader.result)), 'Plano aberto do arquivo.'); }
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
      clone.querySelectorAll('.export-only').forEach(node => node.removeAttribute('visibility'));
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
  const stored = readStored();
  if (stored) {
    try { loadPlan(stored.plan, `Plano salvo em ${formatDate(stored.savedAt)} reaberto. “Abrir plano” tem a opção de começar em branco.`); }
    catch { setStatus('Não foi possível reabrir o plano salvo neste navegador.'); }
  }
  new ResizeObserver(applyView).observe(board);
  registerWebMCP();
})();
