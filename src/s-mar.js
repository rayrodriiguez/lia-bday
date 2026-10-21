const T_MAR = {
  intro: [
    "bem-vinda ao mar de Pernambuco!",
    "olha quanta coisa tem por aqui.",
    "e parece que os bichinhos ficaram sabendo que hoje é seu aniversário.",
    "toca neles pra receber seus recadinhos."
  ],
  counter: n => n + "/7 recadinhos",
  all: "pronto, Lia! agora você tem um mar inteiro torcendo por você.",
  cards: {
    agua: { title: "água-viva", text: "vim flutuando só pra deixar um pouquinho de amor por aqui." },
    tartaruga: { title: "tartaruga", text: "meu conselho pra você: nunca tenha pressa de viver a sua vida. as coisas boas também chegam no tempo delas." },
    cavalo: { title: "cavalo-marinho", text: "a gente veio em dupla porque carinho bom é carinho compartilhado." },
    palhaco: { title: "peixe-palhaço", text: "achei você! demorei porque tava escondido, mas não ia perder seu aniversário" },
    polvo: { title: "polvo", text: "meus braços não são grandes o suficiente pra atravessar o oceano, mas esse abraço aqui é todinho seu." },
    estrela: { title: "estrela-do-mar", text: "sou a estrela do mar, mas hoje a estrela é você." },
    cardume: { title: "cardume", text: "a gente precisou de um monte de peixinhos pra fazer um coração. ainda bem que amor não precisa caber em um só." }
  },
  crabSign: "vem comigo? →",
  crabLines: [
    "ih, olha quem apareceu!",
    "ei, Lia, quer conhecer um lugar?",
    "eu conheço um atalho muito bom. confia em mim."
  ],
  crabHint: "toca no caranguejo"
};

function drawCrab(c, x, y, size, t, walking, signText, waveClaw = 0) {
  const s = size / 60;
  const step = walking ? t * 14 : t * 1.5;
  const bob = walking ? Math.abs(Math.sin(step)) * 2.5 * s : Math.sin(t * 2) * 1 * s;
  const by = y - 20 * s - bob;
  c.save();
  c.lineCap = "round"; c.lineJoin = "round";
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const ph = step + i * 2.1 + (side > 0 ? Math.PI : 0);
      const lift = walking ? Math.max(0, Math.sin(ph)) * 6 * s : 0;
      const sx = x + side * (18 + i * 5) * s, sy = by + (2 + i * 3) * s;
      const kx = x + side * (34 + i * 6) * s + (walking ? Math.cos(ph) * 3 * s : 0), ky = by - (6 - i * 2) * s - lift;
      const fx = x + side * (40 + i * 7) * s + (walking ? Math.cos(ph) * 5 * s : 0), fy = y - lift * .6;
      c.strokeStyle = "#b8321f"; c.lineWidth = 5 * s;
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
      c.strokeStyle = "#e0523a"; c.lineWidth = 3 * s;
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
    }
  }
  const pinch = .25 + .2 * Math.sin(t * 3);
  function claw(cx, cy, rot, open) {
    c.save(); c.translate(cx, cy); c.rotate(rot);
    c.fillStyle = "#e5462f";
    c.beginPath(); c.ellipse(0, 0, 12 * s, 9 * s, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#ff7a55";
    c.beginPath(); c.ellipse(-3 * s, -3 * s, 5 * s, 3 * s, -.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#e5462f";
    c.save(); c.translate(8 * s, -3 * s); c.rotate(-open);
    c.beginPath(); c.ellipse(7 * s, 0, 8 * s, 3.6 * s, 0, 0, Math.PI * 2); c.fill(); c.restore();
    c.save(); c.translate(8 * s, 3 * s); c.rotate(open * .6);
    c.beginPath(); c.ellipse(6 * s, 0, 7 * s, 3.2 * s, 0, 0, Math.PI * 2); c.fill(); c.restore();
    c.restore();
  }

  const wv = Math.max(0, Math.min(1, waveClaw));
  const lcx = x - (40 + 4 * wv) * s, lcy = by - (20 + 30 * wv) * s;
  c.strokeStyle = "#d13d28"; c.lineWidth = 6 * s;
  c.beginPath(); c.moveTo(x - 22 * s, by - 6 * s);
  c.quadraticCurveTo(x - 36 * s, by - (12 + 8 * wv) * s, lcx + 6 * s, lcy + 4 * s); c.stroke();
  claw(lcx, lcy, Math.PI + .5 + wv * (.9 + Math.sin(t * 11) * .45), pinch + wv * .3);
  const g = c.createLinearGradient(x, by - 20 * s, x, by + 18 * s);
  g.addColorStop(0, "#ff8a5c"); g.addColorStop(1, "#cf3523");
  c.fillStyle = g;
  c.beginPath(); c.ellipse(x, by, 30 * s, 19 * s, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = "rgba(255,210,180,.55)";
  for (const [dx, dy, r] of [[-12, -9, 2.6], [-4, -12, 2], [8, -10, 2.4], [15, -5, 1.8], [-18, -2, 1.6]]) {
    c.beginPath(); c.arc(x + dx * s, by + dy * s, r * s, 0, Math.PI * 2); c.fill();
  }
  for (const side of [-1, 1]) {
    const ex = x + side * 10 * s, ey = by - 30 * s + Math.sin(t * 2.4 + side) * 1.2 * s;
    c.strokeStyle = "#c63a26"; c.lineWidth = 3.4 * s;
    c.beginPath(); c.moveTo(x + side * 7 * s, by - 14 * s); c.lineTo(ex, ey); c.stroke();
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(ex, ey, 6.5 * s, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#1d1420";
    c.beginPath(); c.arc(ex + 1.5 * s, ey + .5 * s, 3.4 * s, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(ex + 2.6 * s, ey - 1 * s, 1.2 * s, 0, Math.PI * 2); c.fill();
  }
  c.strokeStyle = "#6e1a14"; c.lineWidth = 1.8 * s;
  c.beginPath(); c.arc(x, by - 5 * s, 5 * s, .2 * Math.PI, .8 * Math.PI); c.stroke();
  c.fillStyle = "rgba(255,150,170,.6)";
  c.beginPath(); c.ellipse(x - 13 * s, by - 3 * s, 4 * s, 2.4 * s, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(x + 13 * s, by - 3 * s, 4 * s, 2.4 * s, 0, 0, Math.PI * 2); c.fill();
  if (signText) {
    const hx = x + 30 * s, hy = by - 34 * s;
    c.font = `700 ${Math.round(20 * s)}px Caveat, "Segoe Print", cursive`;
    const tw = c.measureText(signText).width;
    const bw = tw + 22 * s, bh = 32 * s, bx = hx - bw / 2 - 6 * s, btop = hy - 52 * s;
    c.strokeStyle = "#8a5a2b"; c.lineWidth = 4 * s;
    c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx, btop + bh); c.stroke();
    const wg = c.createLinearGradient(0, btop, 0, btop + bh);
    wg.addColorStop(0, "#e2b57a"); wg.addColorStop(1, "#bf8a4e");
    c.fillStyle = wg;
    c.beginPath();
    if (c.roundRect) c.roundRect(bx, btop, bw, bh, 6 * s); else c.rect(bx, btop, bw, bh);
    c.fill();
    c.strokeStyle = "rgba(120,72,30,.35)"; c.lineWidth = 1 * s;
    for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(bx + 4 * s, btop + k * bh / 4); c.quadraticCurveTo(bx + bw / 2, btop + k * bh / 4 + 2 * s, bx + bw - 4 * s, btop + k * bh / 4); c.stroke(); }
    c.fillStyle = "#7a4a22";
    c.beginPath(); c.arc(bx + 5 * s, btop + 5 * s, 1.5 * s, 0, 6.3); c.arc(bx + bw - 5 * s, btop + 5 * s, 1.5 * s, 0, 6.3); c.fill();
    c.fillStyle = "#4e2a12"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(signText, bx + bw / 2, btop + bh / 2 + 1 * s);
    c.strokeStyle = "#d13d28"; c.lineWidth = 6 * s;
    c.beginPath(); c.moveTo(x + 22 * s, by - 6 * s); c.lineTo(hx - 2 * s, hy + 4 * s); c.stroke();
    claw(hx, hy, -Math.PI / 2 - .3, .5);
  } else {
    c.strokeStyle = "#d13d28"; c.lineWidth = 6 * s;
    c.beginPath(); c.moveTo(x + 22 * s, by - 6 * s); c.lineTo(x + 34 * s, by - 16 * s); c.stroke();
    claw(x + 40 * s, by - 20 * s, -.5, pinch);
  }
  c.restore();
}

(function () {
  const TAU = Math.PI * 2;

  const F_FAR = .18, F_MID = .5, F_WATER = .75, F_FRONT = 1.35;
  let k = 1, M = 40, far = null, mid = null, vig = null, softBub = null, shadowSpr = null;
  let weeds = [], snow = [], bubbles = [], fgBubs = [], rush = [], fish = [], rays = [], hearts = [];
  let found = new Set(), introDone = false, introT = 0, allShown = false;
  let crab = null, tok = 0, stepT = 0, schoolAn = null;
  let whale = { x: 0, on: false, next: 8 };
  let ptr = { x: -999, y: -999, t: -9, down: false };
  let camY = 0, aboveMode = "day", ox = 0, oy = 0, parallaxOn = true, splashed = false;
  let lastTouch = 0, idleT = 3, allShownT = 0;
  const idle = { octo: 0, turtle: 0, blink: 0, crabWave: 0 };

  const jelly = { id: "agua", ax: 0, ay: 0, r: 30, lift: 0, vl: 0, x: 0, y: 0, z: 1, an: null };
  const jelly2 = { id: "agua", ax: 0, ay: 0, r: 18, lift: 0, vl: 0, x: 0, y: 0, z: 1, an: null };
  const turtle = { id: "tartaruga", x: -100, y: 0, an: null };
  const horse = { id: "cavalo", ax: 0, ay: 0, x: 0, y: 0, an: null };
  const clown = { id: "palhaco", ax: 0, ay: 0, an: null };
  const octo = { id: "polvo", ax: 0, ay: 0, an: null, col: [205, 92, 62], tgt: [205, 92, 62] };
  const star = { id: "estrela", ax: 0, ay: 0, an: null };
  const OCTO_COLS = [[205, 92, 62], [150, 78, 190], [232, 128, 58], [196, 60, 90]];

  const sandAt = x => H * .8 + Math.sin(x * .006) * 8 + Math.sin(x * .017 + 1) * 4;
  const backOut = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  const springOut = p => 1 - Math.exp(-6 * p) * Math.cos(11 * p);
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const heartXY = u => [16 * Math.pow(Math.sin(u), 3), -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u))];
  function hsl2rgb(h, s, l) {
    s /= 100; l /= 100;
    const kk = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(kk(n) - 3, Math.min(9 - kk(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  }

  function smoothPath(c, pts, closed) {
    const n = pts.length;
    c.beginPath();
    if (closed) {
      const mx = (pts[n - 1][0] + pts[0][0]) / 2, my = (pts[n - 1][1] + pts[0][1]) / 2;
      c.moveTo(mx, my);
      for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
      c.closePath();
    } else {
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < n - 1; i++) { const p = pts[i], q = pts[i + 1]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
      c.lineTo(pts[n - 1][0], pts[n - 1][1]);
    }
  }

  const toL = (x, y, f) => [x - ox * f, y - oy * f - camY];

  function layout() {
    k = clamp(Math.min(W, H * .75) / 420, .72, 1.6);
    M = Math.round(40 * k);
    jelly.ax = W * .74; jelly.ay = H * .34; jelly.r = 32 * k;
    jelly2.ax = W * .24; jelly2.ay = H * .29; jelly2.r = 18 * k;
    horse.ax = W * .13; horse.ay = H * .53;
    turtle.y = H * .47;
    clown.ax = W * .2; clown.ay = sandAt(W * .2) - 22 * k;
    octo.ax = W * .52; octo.ay = sandAt(W * .52) - 28 * k;
    star.ax = W * .82; star.ay = sandAt(W * .82) + 8 * k;
  }

  function mkCanvas(w, h) {
    const d = Math.min(window.devicePixelRatio || 1, 2), cnv = document.createElement("canvas");
    cnv.width = Math.max(1, Math.round(w * d)); cnv.height = Math.max(1, Math.round(h * d));
    const g = cnv.getContext("2d"); g.scale(d, d);
    return [cnv, g];
  }

  function buildLayers() {

    let g;
    [far, g] = mkCanvas(W + M * 2, H + M * 2);
    g.translate(M, M);
    const wg = g.createLinearGradient(0, -M, 0, H + M);
    wg.addColorStop(0, "#4fdada"); wg.addColorStop(.16, "#22a8c6"); wg.addColorStop(.48, "#10669a");
    wg.addColorStop(.82, "#093e72"); wg.addColorStop(1, "#062b52");
    g.fillStyle = wg; g.fillRect(-M, -M, W + M * 2, H + M * 2);
    for (const [base, amp, fr, col] of [[.66, .1, .004, "rgba(30,110,160,.45)"], [.71, .08, .006, "rgba(14,70,120,.55)"], [.76, .06, .009, "rgba(8,48,92,.6)"]]) {
      g.fillStyle = col;
      g.beginPath(); g.moveTo(-M, H + M);
      for (let x = -M; x <= W + M + 20; x += 18) g.lineTo(x, H * base - Math.abs(Math.sin(x * fr + base * 9)) * H * amp - Math.sin(x * .013) * 8);
      g.lineTo(W + M, H + M); g.fill();
    }

    [mid, g] = mkCanvas(W + M * 2, H + M * 2);
    g.translate(M, M);
    function branch(x, y, len, ang, w, depth, col) {
      const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round";
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(ang + .3) * len * .5, y + Math.sin(ang + .3) * len * .5, x2, y2); g.stroke();
      if (depth > 0) {
        branch(x2, y2, len * .75, ang - rand(.25, .55), w * .72, depth - 1, col);
        branch(x2, y2, len * .72, ang + rand(.25, .55), w * .72, depth - 1, col);
      } else { g.fillStyle = col; g.beginPath(); g.arc(x2, y2, w * .9, 0, TAU); g.fill(); }
    }
    for (const [fx, col] of [[.06, "#e77a68"], [.35, "#f0a35c"], [.66, "#a77bd0"], [.93, "#ef8aa6"], [-.04, "#d77fb0"], [1.03, "#f0a35c"]]) {
      const x = W * fx, y = sandAt(x) + 4;
      branch(x, y, 26 * k, -Math.PI / 2 + rand(-.2, .2), 6 * k, 4, col);
      branch(x + 10 * k, y, 18 * k, -Math.PI / 2 + .4, 4.5 * k, 3, col);
    }
    for (const fx of [.42, .75]) {
      const x = W * fx, y = sandAt(x) + 6, r = 20 * k;
      const cg = g.createRadialGradient(x - r * .3, y - r * .6, 2, x, y, r * 1.2);
      cg.addColorStop(0, "#fbe7a6"); cg.addColorStop(1, "#b38a4a");
      g.fillStyle = cg; g.beginPath(); g.ellipse(x, y, r * 1.3, r, 0, Math.PI, TAU); g.fill();
      g.strokeStyle = "rgba(120,80,30,.45)"; g.lineWidth = 1.2;
      for (let i = 1; i < 5; i++) {
        g.beginPath();
        for (let a = Math.PI; a <= TAU + .01; a += .12) { const rr = r * i / 5 + Math.sin(a * 9 + i) * 1.6; g.lineTo(x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr); }
        g.stroke();
      }
    }
    { const x = W * .88, y = sandAt(W * .88);
      g.strokeStyle = "rgba(160,90,190,.75)"; g.lineWidth = 1.3;
      for (let i = 0; i < 12; i++) {
        const a = -Math.PI / 2 + (i - 5.5) * .11;
        g.beginPath(); g.moveTo(x, y);
        g.quadraticCurveTo(x + Math.cos(a) * 30 * k, y + Math.sin(a) * 40 * k, x + Math.cos(a) * 62 * k, y + Math.sin(a) * 70 * k); g.stroke();
      }
      for (let j = 1; j < 6; j++) {
        g.beginPath();
        for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i - 5.5) * .11; g.lineTo(x + Math.cos(a) * 11 * j * k, y + Math.sin(a) * 12.5 * j * k); }
        g.stroke();
      }
    }
    const sg = g.createLinearGradient(0, H * .76, 0, H + M);
    sg.addColorStop(0, "#dcc592"); sg.addColorStop(.4, "#b79c69"); sg.addColorStop(1, "#6e5d40");
    g.fillStyle = sg;
    g.beginPath(); g.moveTo(-M, H + M);
    for (let x = -M; x <= W + M + 10; x += 8) g.lineTo(x, sandAt(x));
    g.lineTo(W + M, H + M); g.fill();
    g.fillStyle = "rgba(14,70,120,.25)"; g.fillRect(-M, H * .76, W + M * 2, H * .24 + M);
    g.strokeStyle = "rgba(255,240,205,.22)"; g.lineWidth = 1.2;
    for (let j = 0; j < 9; j++) {
      const yy = H * .84 + j * H * .018;
      g.beginPath();
      for (let x = -M; x <= W + M; x += 10) g.lineTo(x, yy + Math.sin(x * .03 + j * 1.7) * 2.5);
      g.stroke();
    }
    g.fillStyle = "rgba(255,245,220,.35)";
    for (let i = 0; i < 70; i++) { const x = rand(-M, W + M); g.beginPath(); g.arc(x, rand(sandAt(x) + 6, H + M), rand(.6, 1.8), 0, TAU); g.fill(); }
    function rock(x, ytop, w, h) {
      const rg = g.createLinearGradient(x, ytop, x, ytop + h);
      rg.addColorStop(0, "#6a7f98"); rg.addColorStop(1, "#26354a");
      g.fillStyle = rg;
      g.beginPath(); g.moveTo(x - w, ytop + h);
      g.bezierCurveTo(x - w * 1.05, ytop + h * .2, x - w * .4, ytop - h * .1, x, ytop);
      g.bezierCurveTo(x + w * .5, ytop - h * .05, x + w * 1.05, ytop + h * .3, x + w, ytop + h);
      g.fill();
      g.strokeStyle = "rgba(200,240,255,.28)"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x - w * .7, ytop + h * .25); g.bezierCurveTo(x - w * .4, ytop - h * .05, x + w * .2, ytop - h * .05, x + w * .6, ytop + h * .2); g.stroke();
      g.fillStyle = "rgba(90,160,110,.4)";
      for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(x + rand(-w * .6, w * .6), ytop + rand(h * .15, h * .6), rand(3, 7) * k, rand(2, 4) * k, rand(0, 3), 0, TAU); g.fill(); }
    }
    rock(clown.ax, clown.ay + 4 * k, 34 * k, sandAt(clown.ax) - clown.ay + 6 * k);
    rock(octo.ax, octo.ay + 2 * k, 46 * k, sandAt(octo.ax) - octo.ay + 8 * k);

    [vig, g] = mkCanvas(W, H);
    const vg = g.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .3, W / 2, H * .5, Math.max(W, H) * .8);
    vg.addColorStop(0, "rgba(2,16,40,0)"); vg.addColorStop(1, "rgba(2,16,40,.55)");
    g.fillStyle = vg; g.fillRect(0, 0, W, H);

    softBub = document.createElement("canvas"); softBub.width = softBub.height = 96;
    g = softBub.getContext("2d");
    let rg = g.createRadialGradient(48, 48, 0, 48, 48, 48);
    rg.addColorStop(0, "rgba(255,255,255,.04)"); rg.addColorStop(.62, "rgba(220,250,255,.12)");
    rg.addColorStop(.8, "rgba(240,255,255,.38)"); rg.addColorStop(1, "rgba(240,255,255,0)");
    g.fillStyle = rg; g.fillRect(0, 0, 96, 96);
    rg = g.createRadialGradient(34, 32, 0, 34, 32, 16);
    rg.addColorStop(0, "rgba(255,255,255,.55)"); rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg; g.fillRect(0, 0, 96, 96);
    shadowSpr = document.createElement("canvas"); shadowSpr.width = shadowSpr.height = 64;
    g = shadowSpr.getContext("2d");
    rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, "rgba(10,20,30,.55)"); rg.addColorStop(1, "rgba(10,20,30,0)");
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  }

  function seed() {
    weeds = [];
    [.03, .09, .15, .28, .58, .63, .71, .9, .97].forEach(fx => weeds.push({
      x: W * fx + rand(-8, 8), h: H * rand(.16, .32), seg: 12, ph: rand(0, TAU),
      col: pick(["#2f8f5d", "#3c9a52", "#6d9440", "#2c7d6a"]), w: rand(5, 8) * k, front: false
    }));
    weeds.push({ x: -W * .02, h: H * .5, seg: 14, ph: 1, col: "#1d5a3c", w: 16 * k, front: true });
    weeds.push({ x: W * 1.02, h: H * .42, seg: 14, ph: 2, col: "#215f40", w: 14 * k, front: true });
    snow = Array.from({ length: 70 }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(.5, 1.6), v: rand(4, 12), p: rand(0, TAU) }));
    rays = Array.from({ length: 7 }, (_, i) => ({ x: W * (i / 6) * 1.1 - W * .05 + rand(-30, 30), w: rand(30, 80) * k, p: rand(0, TAU) }));
    if (!fish.length) fish = Array.from({ length: 28 }, () => ({ x: W * .5 + rand(-60, 60), y: H * .36 + rand(-40, 40), vx: rand(-40, 40), vy: rand(-20, 20), p: rand(0, TAU), z: rand(.7, 1.25) }));
  }

  function contact(c, x, y, rx, a = 1) {
    c.globalAlpha = a; c.drawImage(shadowSpr, x - rx, y - rx * .28, rx * 2, rx * .56); c.globalAlpha = 1;
  }

  function drawJelly(c, j, t) {
    const p = j.an ? j.an.t / j.an.dur : 0;
    const m = j.an ? easeInOut(seg(p, 0, .3)) * (1 - easeInOut(seg(p, .78, 1))) : 0;
    const pulse = Math.sin(t * 2.2 + j.r) * .5 + .5;
    const r = j.r * j.z;
    const ip = Math.sin((j.idle || 0) * Math.PI);
    const w = r * (1 + .07 * pulse + .1 * m + .12 * ip), h = r * .78 * (1 - .07 * pulse - .08 * ip);
    const x = j.x, y = j.y;
    c.globalCompositeOperation = "lighter";
    const glow = c.createRadialGradient(x, y - h * .3, 2, x, y + r * .4, r * (2.4 + m * 1.4));
    glow.addColorStop(0, `rgba(255,${190 - m * 60},240,${.2 + .35 * m + .2 * ip})`); glow.addColorStop(1, "rgba(255,150,220,0)");
    c.fillStyle = glow; c.fillRect(x - r * 4, y - r * 3, r * 8, r * 7);
    c.globalCompositeOperation = "source-over";
    c.lineCap = "round";

    const hcx = x, hcy = y + r * 1.25, hs = r * .052;
    c.strokeStyle = `rgba(255,${205 - m * 50},235,${.35 + .35 * m})`; c.lineWidth = 1.1 + m * 1.6;
    for (let i = 0; i < 16; i++) {
      const bx = x - w + (i / 15) * w * 2;
      const nx = bx + Math.sin(t * 2 + i * .7 + 4) * 9, ny = y + r * 1.7;
      const [hx, hy] = heartXY(Math.PI + (i / 15) * TAU * .999);
      const ex = lerp(nx, hcx + hx * hs, m), ey = lerp(ny, hcy + hy * hs, m);
      const sw = Math.sin(t * 2.4 + i) * 7 * (1 - m * .6), sw2 = Math.sin(t * 2.4 + i - .8) * 6 * (1 - m * .6);
      c.beginPath(); c.moveTo(bx, y);
      c.bezierCurveTo(lerp(bx, ex, .33) + sw, lerp(y, ey, .33), lerp(bx, ex, .66) + sw2, lerp(y, ey, .66), ex, ey);
      c.stroke();
    }
    if (m > .35) {

      const a = clamp((m - .35) / .5), wob = 1 + Math.sin(t * 3) * .035;
      const pts = [];
      for (let i = 0; i < 72; i++) {
        const u = i / 72 * TAU, [hx, hy] = heartXY(u);
        const ww = 1 + Math.sin(u * 5 + t * 4) * .012;
        pts.push([hcx + hx * hs * wob * ww, hcy + hy * hs * wob * ww]);
      }
      c.lineCap = "round"; c.lineJoin = "round";
      for (const [lw, al] of [[10, .1], [6, .2], [3.2, .55], [1.6, .95]]) {
        c.strokeStyle = al > .9 ? `rgba(255,235,248,${a * al})` : `rgba(255,150,210,${a * al})`;
        c.lineWidth = lw * (r / 32);
        smoothPath(c, pts, true); c.stroke();
      }
    }
    c.strokeStyle = "rgba(255,170,220,.32)"; c.lineWidth = 3.5;
    for (let i = 0; i < 4; i++) {
      const bx = x + (i - 1.5) * w * .22;
      c.beginPath(); c.moveTo(bx, y - 2);
      for (let s = 1; s <= 8; s++) c.lineTo(bx + Math.sin(t * 1.6 + i * 1.3 + s * .6 - s * .25) * (2 + s * .7), y + s * r * .13);
      c.stroke();
    }
    const bg2 = c.createRadialGradient(x, y - h * .55, 1, x, y - h * .3, w * 1.1);
    bg2.addColorStop(0, `rgba(255,240,250,${.62 + m * .2})`); bg2.addColorStop(.6, `rgba(${215 + m * 40},180,255,.32)`); bg2.addColorStop(1, "rgba(170,150,255,.14)");
    c.fillStyle = bg2;
    c.beginPath(); c.moveTo(x - w, y);
    c.bezierCurveTo(x - w, y - h * 1.35, x + w, y - h * 1.35, x + w, y);
    for (let i = 8; i >= 0; i--) c.lineTo(x - w + (i / 8) * w * 2, y + Math.sin(i * 1.8 + t * 3) * 1.5 + 2);
    c.fill();

    c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(x - w * .85, y - h * .35); c.bezierCurveTo(x - w * .75, y - h * 1.12, x + w * .3, y - h * 1.2, x + w * .55, y - h * .9); c.stroke();
    c.strokeStyle = `rgba(255,160,215,${.7 + .3 * m})`; c.lineWidth = Math.max(1.5, r * .07);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + .78, cx = x + Math.cos(a) * w * .22, cy = y - h * .45 + Math.sin(a) * h * .18;
      c.beginPath(); c.arc(cx, cy, r * .12, a + .6, a + .6 + Math.PI * 1.4); c.stroke();
    }
  }

  function drawTurtle(c, x, y, s, rot, t, wave, head, blink = 0) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    const skin = "#93b07c", skinD = "#5e7a4e";
    function flip(px, py, rx, ry, base, amp, ph, lag) {
      for (const side of [-1, 1]) {
        c.save(); c.translate(px, py * side); c.scale(1, side);
        c.rotate(base + Math.sin(t * 1.6 + ph - lag) * amp + (px > 0 ? wave : 0));
        c.fillStyle = skin; c.strokeStyle = skinD; c.lineWidth = 1.2;
        c.beginPath(); c.ellipse(-rx * .3, -ry, rx, ry, 0, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = "rgba(255,255,230,.35)";
        for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-rx * .3 + (i - 1) * 1.5, -ry * (.6 + i * .4), 1.6, 0, TAU); c.fill(); }
        c.restore();
      }
    }
    flip(-30, 16, 6, 10, .5, .25, 1.5, .4);
    flip(18, 18, 8, 24, -.75, .45, 0, 0);
    c.save(); c.translate(36, 0); c.rotate(head + Math.sin(t * .8) * .06);
    c.fillStyle = skin; c.strokeStyle = skinD; c.lineWidth = 1.2;
    c.beginPath(); c.ellipse(9, 0, 13, 9.5, 0, 0, TAU); c.fill(); c.stroke();
    if (blink > .5) {
      c.strokeStyle = "#1c2416"; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(12, -5); c.lineTo(16, -5); c.moveTo(12, 5); c.lineTo(16, 5); c.stroke();
    } else {
      c.fillStyle = "#1c2416";
      c.beginPath(); c.arc(14, -5, 2.2, 0, TAU); c.arc(14, 5, 2.2, 0, TAU); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(14.7, -5.6, .8, 0, TAU); c.arc(14.7, 4.4, .8, 0, TAU); c.fill();
    }
    c.strokeStyle = "#2c3a22"; c.lineWidth = 1;
    c.beginPath(); c.arc(17, 0, 3, -.9, .9); c.stroke();
    c.restore();
    const sh = c.createRadialGradient(-8, -10, 4, 0, 0, 40);
    sh.addColorStop(0, "#b5a565"); sh.addColorStop(1, "#4b4a2a");
    c.fillStyle = sh; c.beginPath(); c.ellipse(0, 0, 38, 27, 0, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.ellipse(0, 0, 36, 25, 0, 0, TAU); c.clip();
    c.strokeStyle = "rgba(40,34,18,.55)"; c.lineWidth = 1.3;
    const hex = (hx, hy, r, fill) => {
      c.beginPath();
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.lineTo(hx + Math.cos(a) * r * 1.15, hy + Math.sin(a) * r); }
      c.closePath(); c.fillStyle = fill; c.fill(); c.stroke();
    };
    for (const hx of [-17, 0, 17]) hex(hx, 0, 8.5, "rgba(150,126,70,.8)");
    for (const hx of [-24, -8, 8, 24]) { hex(hx, -16, 8, "rgba(128,112,62,.8)"); hex(hx, 16, 8, "rgba(108,96,52,.85)"); }
    c.restore();
    c.strokeStyle = "#3c3a20"; c.lineWidth = 1.6;
    c.beginPath(); c.ellipse(0, 0, 38, 27, 0, 0, TAU); c.stroke();
    c.strokeStyle = "rgba(225,255,235,.5)"; c.lineWidth = 2;
    c.beginPath(); c.ellipse(0, 0, 36, 25, 0, Math.PI * 1.08, Math.PI * 1.85); c.stroke();
    c.restore();
  }

  function drawHorse(c, x, y, s, t, mirror, tailExtra, lean, alpha) {
    c.save(); c.globalAlpha = alpha;
    c.translate(x, y); c.rotate(Math.sin(t * 1.2) * .07 + lean);
    c.scale(s * mirror, s);
    const g = c.createLinearGradient(-10, -32, 14, 32);
    g.addColorStop(0, "#ffe07a"); g.addColorStop(1, "#d9771f");
    c.fillStyle = "rgba(255,232,170,.6)";
    c.beginPath(); c.moveTo(-5, -6);
    for (let i = 0; i <= 6; i++) c.lineTo(-13 - Math.sin(t * 14 - i * .6) * 1.8, -6 + i * 2.4);
    c.lineTo(-5, 9); c.fill();
    const P = u => {
      const a = [2, -22], b = [13, -8], cc = [12, 12], d = [0, 20], mm = 1 - u;
      return [mm * mm * mm * a[0] + 3 * mm * mm * u * b[0] + 3 * mm * u * u * cc[0] + u * u * u * d[0],
        mm * mm * mm * a[1] + 3 * mm * mm * u * b[1] + 3 * mm * u * u * cc[1] + u * u * u * d[1]];
    };
    const beads = [];
    const curl = Math.sin(t * .9) * .25 + tailExtra;
    for (let i = 0; i <= 14; i++) {
      const u = i / 14, ang = -Math.PI / 4 + u * (Math.PI * 3.1 + curl) * (1 - tailExtra * .25), rr = 5.66 * (1 - u * .82) * (1 + tailExtra * .6);
      beads.push([-4 + Math.cos(ang) * rr + tailExtra * 6 * u, 24 + Math.sin(ang) * rr, 3.8 * (1 - u * .78)]);
    }
    for (let i = 14; i >= 0; i--) { const u = i / 14, [px, py] = P(u); beads.push([px, py, 4.5 + Math.sin(Math.PI * Math.min(1, u * 1.25)) * 4.3]); }
    c.fillStyle = g; c.strokeStyle = "rgba(130,60,10,.35)"; c.lineWidth = .6;
    for (const b of beads) { c.beginPath(); c.arc(b[0], b[1], b[2], 0, TAU); c.fill(); c.stroke(); }
    c.beginPath(); c.arc(2, -26, 6.5, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(5, -29.5); c.lineTo(17, -25.5); c.quadraticCurveTo(19, -23, 17, -21); c.lineTo(6, -21.5); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-2, -31); c.lineTo(0, -36); c.lineTo(2, -32); c.lineTo(4, -35.5); c.lineTo(5, -31); c.fill();
    c.strokeStyle = "rgba(255,250,220,.6)"; c.lineWidth = 1.2;
    c.beginPath(); c.arc(2, -26, 6, Math.PI * 1.1, Math.PI * 1.7); c.stroke();
    c.fillStyle = "#2a1608"; c.beginPath(); c.arc(4, -27, 1.9, 0, TAU); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(4.6, -27.6, .7, 0, TAU); c.fill();
    c.restore();
  }

  function drawClown(c, x, y, s, t, ang, flipY) {
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s * (flipY ? -1 : 1));
    const tail = Math.sin(t * 9) * .25;
    c.fillStyle = "#ff7b1c"; c.strokeStyle = "#1a1010"; c.lineWidth = 1;
    c.save(); c.translate(-15, 0); c.rotate(tail);
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-8, -9, -11, -7); c.quadraticCurveTo(-8, 0, -11, 7); c.quadraticCurveTo(-8, 9, 0, 0); c.fill(); c.stroke();
    c.restore();
    c.beginPath(); c.moveTo(-6, -8); c.quadraticCurveTo(2, -15 + Math.sin(t * 6) * 1.2, 8, -8); c.fill(); c.stroke();
    const bg2 = c.createLinearGradient(0, -9, 0, 9);
    bg2.addColorStop(0, "#ffab4a"); bg2.addColorStop(1, "#f26a0c");
    c.fillStyle = bg2;
    c.beginPath(); c.ellipse(0, 0, 16, 9, 0, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.ellipse(0, 0, 16, 9, 0, 0, TAU); c.clip();
    c.fillStyle = "#fff"; c.strokeStyle = "#1a1010"; c.lineWidth = .9;
    for (const [bx, bw] of [[7, 2.6], [-3, 2.9], [-12, 1.9]]) { c.beginPath(); c.ellipse(bx, 0, bw, 11, 0, 0, TAU); c.fill(); c.stroke(); }
    c.restore();
    c.strokeStyle = "#1a1010"; c.lineWidth = 1;
    c.beginPath(); c.ellipse(0, 0, 16, 9, 0, 0, TAU); c.stroke();
    c.strokeStyle = "rgba(255,240,200,.6)"; c.lineWidth = 1.2;
    c.beginPath(); c.ellipse(0, 0, 14.5, 7.8, 0, Math.PI * 1.15, Math.PI * 1.8); c.stroke();
    c.fillStyle = "#ff8a2a"; c.strokeStyle = "#1a1010"; c.lineWidth = 1;
    c.save(); c.translate(3, 3); c.rotate(.5 + Math.sin(t * 7) * .3);
    c.beginPath(); c.ellipse(0, 4, 2.5, 5, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
    c.fillStyle = "#111"; c.beginPath(); c.arc(11, -2, 2.2, 0, TAU); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(11.7, -2.7, .8, 0, TAU); c.fill();
    c.restore();
  }

  function anemone(c, x, y, s, t, back) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (back) {
      const cg = c.createLinearGradient(0, -2, 0, 16);
      cg.addColorStop(0, "#9a4fb0"); cg.addColorStop(1, "#5b2c6e");
      c.fillStyle = cg; c.beginPath(); c.ellipse(0, 8, 17, 10, 0, 0, TAU); c.fill();
    }
    c.lineCap = "round";
    for (let i = 0; i < 28; i++) {
      if ((i % 2 === 0) !== back) continue;
      const bx = -16 + (i / 27) * 32, sway = Math.sin(t * 1.3 + i * .45) * .22, lagSway = Math.sin(t * 1.3 + i * .45 - .6) * .22;
      const a = -Math.PI / 2 + (bx / 16) * .95 + sway, len = 24 + (i * 7 % 9);
      const ex = bx + Math.cos(a) * len, ey = 2 + Math.sin(a) * len;
      c.strokeStyle = back ? "#a466b8" : "#d68ad8"; c.lineWidth = 4.5;
      c.beginPath(); c.moveTo(bx, 2); c.quadraticCurveTo(bx + Math.cos(a - lagSway) * len * .5, 2 + Math.sin(a - lagSway) * len * .55, ex, ey); c.stroke();
      c.fillStyle = back ? "#e4a8e8" : "#ffd6f2"; c.beginPath(); c.arc(ex, ey, 2.7, 0, TAU); c.fill();
    }
    c.restore();
  }

  function drawOcto(c, x, y, s, t, col3, wave, hug, flash, waveArm = 0) {
    const [r, g, b] = col3.map(Math.round);
    const col = `rgb(${r},${g},${b})`, dark = `rgb(${r * .7 | 0},${g * .7 | 0},${b * .7 | 0})`, light = `rgb(${Math.min(255, r + 60)},${Math.min(255, g + 60)},${Math.min(255, b + 60)})`;
    c.save(); c.translate(x, y); c.scale(s, s);
    c.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const dir = i < 4 ? -1 : 1;
      const a = Math.PI * (.04 + .92 * i / 7) - wave * dir * .5 * Math.abs(Math.sin(t * 7 + i));
      let px = Math.cos(a) * 9, py = 2 + Math.sin(a) * 3, d = a + dir * -.27;
      for (let sg = 0; sg < 16; sg++) {
        const curl = (.03 + .06 * Math.sin(t * 1.4 + i * 1.1 - sg * .12)) + sg * .022;
        d += curl * dir * (1 - hug) + (-dir) * (.11 + sg * .012) * hug + Math.sin(t * 9 + i + sg * .5) * .2 * wave;
        if (i === 6 && waveArm > 0) d += (-.16 + Math.sin(t * 9 - sg * .35) * .14) * waveArm * (sg < 4 ? 1.6 : 1);
        const nx = px + Math.cos(d) * 3.2, ny = py + Math.sin(d) * 3.2;
        c.strokeStyle = sg % 2 ? col : dark; c.lineWidth = 7 * (1 - sg / 17) + .8;
        c.beginPath(); c.moveTo(px, py); c.lineTo(nx, ny); c.stroke();
        if (sg % 3 === 1 && sg < 13) { c.fillStyle = "rgba(255,235,220,.55)"; c.beginPath(); c.arc(nx, ny + 1.5, 1, 0, TAU); c.fill(); }
        px = nx; py = ny;
      }
    }
    const breathe = 1 + Math.sin(t * 1.8) * .04 + wave * .05 * Math.sin(t * 12);
    const mg = c.createRadialGradient(-6, -28, 2, 0, -16, 24);
    mg.addColorStop(0, light); mg.addColorStop(1, col);
    c.fillStyle = mg;
    c.beginPath(); c.ellipse(0, -17, 16 * breathe, 20 * breathe, Math.sin(t * .8) * .08, 0, TAU); c.fill();
    c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 1.5;
    c.beginPath(); c.ellipse(0, -17, 14 * breathe, 18 * breathe, 0, Math.PI * 1.15, Math.PI * 1.75); c.stroke();
    if (flash > 0) {
      c.fillStyle = `rgba(255,250,240,${.55 * flash})`;
      for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(Math.sin(i * 2.3) * 10, -18 + Math.cos(i * 1.7) * 13, 1.5 + (i % 3), 0, TAU); c.fill(); }
    }
    const blink = (t % 4.3) < .12 ? .15 : 1, happy = hug > .3;
    for (const ex of [-7, 7]) {
      if (happy) { c.strokeStyle = "#1a1014"; c.lineWidth = 1.6; c.beginPath(); c.arc(ex, -6, 3.4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); continue; }
      c.fillStyle = "#fff6e8"; c.beginPath(); c.ellipse(ex, -7, 4.5, 4 * blink, 0, 0, TAU); c.fill();
      c.fillStyle = "#1a1014"; c.beginPath(); c.ellipse(ex, -7, 3, 1.4 * blink, 0, 0, TAU); c.fill();
    }
    c.fillStyle = "rgba(255,140,160,.5)";
    c.beginPath(); c.ellipse(-11, -2, 3, 1.8, 0, 0, TAU); c.ellipse(11, -2, 3, 1.8, 0, 0, TAU); c.fill();
    c.restore();
  }

  function drawStarfish(c, x, y, r, t, rot, glow) {
    c.save(); c.translate(x, y); c.rotate(rot);
    const pt = (a, rr) => [Math.cos(a) * rr, Math.sin(a) * rr];
    if (glow > 0) {
      c.globalCompositeOperation = "lighter";
      const gg = c.createRadialGradient(0, 0, 0, 0, 0, r * 3.2);
      gg.addColorStop(0, `rgba(255,220,120,${.55 * glow})`); gg.addColorStop(1, "rgba(255,200,90,0)");
      c.fillStyle = gg; c.fillRect(-r * 3.2, -r * 3.2, r * 6.4, r * 6.4);
      c.save(); c.rotate(-rot + t * .8);
      c.fillStyle = `rgba(255,245,200,${.8 * glow})`;
      for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 4); c.beginPath(); c.ellipse(0, 0, r * (i % 2 ? 1.6 : 2.8) * (.8 + .2 * Math.sin(t * 6 + i)), r * .07, 0, 0, TAU); c.fill(); }
      c.restore();
      c.globalCompositeOperation = "source-over";
    }
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * TAU / 5, d36 = Math.PI / 5;
      const v1 = pt(a - d36, r * .58), v2 = pt(a + d36, r * .58);
      if (i === 0) c.moveTo(v1[0], v1[1]);
      const c1 = pt(a - .2, r * 1.02), tip = pt(a, r), c2 = pt(a + .2, r * 1.02);
      c.quadraticCurveTo(c1[0], c1[1], tip[0], tip[1]);
      c.quadraticCurveTo(c2[0], c2[1], v2[0], v2[1]);
    }
    c.closePath();
    const g = c.createRadialGradient(-r * .25, -r * .3, 2, 0, 0, r);
    g.addColorStop(0, glow > .3 ? "#fff1a8" : "#ffb860"); g.addColorStop(1, glow > .3 ? "#f0b030" : "#d2421f");
    c.fillStyle = g; c.fill();
    c.strokeStyle = "rgba(140,30,10,.45)"; c.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5, p = pt(a, r * .82); c.beginPath(); c.moveTo(0, 0); c.lineTo(p[0], p[1]); c.stroke(); }
    c.beginPath();
    for (let i = 0; i <= 5; i++) { const p = pt(-Math.PI / 2 + Math.PI / 5 + i * TAU / 5, r * .4); c.lineTo(p[0], p[1]); }
    c.stroke();
    c.fillStyle = "#ffe0aa";
    for (let i = 0; i < 5; i++) for (const f of [.3, .55, .78]) { const p = pt(-Math.PI / 2 + i * TAU / 5, r * f); c.beginPath(); c.arc(p[0], p[1], r * .08, 0, TAU); c.fill(); }
    c.restore();
  }

  function drawFish(c, f) {
    const a = Math.atan2(f.vy, f.vx), s = .9 * k * f.z;
    c.save(); c.translate(f.x, f.y); c.rotate(a); c.scale(s, s);
    c.globalAlpha = .55 + .45 * clamp((f.z - .7) / .5);
    const tw = Math.sin(f.p) * 1.6;
    c.fillStyle = "rgba(200,225,240,.9)";
    c.beginPath(); c.moveTo(-6, 0); c.lineTo(-11, -3.5 + tw); c.lineTo(-11, 3.5 + tw); c.fill();
    const g = c.createLinearGradient(0, -3, 0, 3);
    g.addColorStop(0, "#5b86a8"); g.addColorStop(.45, "#f2faff"); g.addColorStop(1, "#b9d2e6");
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 8, 2.8, 0, 0, TAU); c.fill();
    c.fillStyle = "#0e1a26"; c.beginPath(); c.arc(5, -.5, .9, 0, TAU); c.fill();
    c.restore();
  }

  function drawWeed(c, wd, t) {
    c.lineCap = "round";
    const pts = [[wd.x, sandAt(wd.x) + 6]];
    const segL = wd.h / wd.seg;
    for (let i = 1; i <= wd.seg; i++) {
      const sway = Math.sin(t * 1.1 + wd.ph - i * .18) * i * .9 * k + Math.sin(t * .4 + wd.ph) * i * .5;
      pts.push([wd.x + sway, pts[i - 1][1] - segL]);
    }

    const passes = wd.front ? [[2.6, .12], [1.7, .2], [1, .45]] : [[1, 1]];
    for (const [wm, al] of passes) {
      c.globalAlpha = al; c.strokeStyle = wd.col; c.fillStyle = wd.col;
      for (let i = 1; i < pts.length; i++) {
        c.lineWidth = wd.w * wm * (1 - i / (wd.seg + 3));
        c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke();
        if (i % 3 === 0) { c.beginPath(); c.ellipse(pts[i][0] + (i % 6 ? 6 : -6) * k * wm, pts[i][1], 7 * k * wm, 2.8 * k * wm, i % 6 ? -.5 : .5, 0, TAU); c.fill(); }
      }
    }
    c.globalAlpha = 1;
  }

  function drawWhale(c, t) {
    if (!whale.on) return;
    const s = 1.6 * k;
    c.save(); c.translate(whale.x, H * .27 + Math.sin(t * .3) * 8); c.scale(s, s);
    c.fillStyle = "rgba(20,80,130,.35)";
    c.beginPath(); c.ellipse(0, 0, 90, 20, 0, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(82, -4); c.quadraticCurveTo(110, -6 + Math.sin(t) * 6, 132, -22 + Math.sin(t) * 6); c.quadraticCurveTo(118, 0, 132, 20 + Math.sin(t) * 6); c.quadraticCurveTo(110, 6, 82, 4); c.fill();
    c.beginPath(); c.ellipse(-8, 18, 42, 6, .45, 0, TAU); c.fill();
    c.restore();
  }

  const beachTop = x => {
    const u = clamp((x - W * .36) / (W * .64));
    return -H * (.01 + .2 * Math.pow(u, .7));
  };
  function drawAbove(c, t) {
    const sunset = aboveMode === "sunset", hz = -H * .42;
    const sky = c.createLinearGradient(0, -H, 0, hz);
    if (sunset) { sky.addColorStop(0, "#2f2a63"); sky.addColorStop(.45, "#b85d8c"); sky.addColorStop(.8, "#ff9e6a"); sky.addColorStop(1, "#ffd99a"); }
    else { sky.addColorStop(0, "#6fc2ec"); sky.addColorStop(1, "#dff4f6"); }
    c.fillStyle = sky; c.fillRect(0, -H - 2, W, H * .58 + 2);
    const sx = sunset ? W * .3 : W * .78, sy = sunset ? hz - 22 * k : -H * .82, sr = (sunset ? 36 : 26) * k;
    const sg = c.createRadialGradient(sx, sy, 0, sx, sy, sr * 5);
    sg.addColorStop(0, sunset ? "rgba(255,200,120,.75)" : "rgba(255,255,230,.7)"); sg.addColorStop(1, "rgba(255,220,160,0)");
    c.fillStyle = sg; c.fillRect(sx - sr * 5, sy - sr * 5, sr * 10, sr * 10);
    c.fillStyle = sunset ? "#ffcf7a" : "#fffbe8";
    c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill();
    c.fillStyle = sunset ? "rgba(255,230,240,.5)" : "rgba(255,255,255,.85)";
    for (const [cx, cy, cw] of [[.18, .78, 1], [.62, .66, .8], [.88, .58, .6]]) {
      const x = ((W * cx + t * 6) % (W + 200)) - 100, y = -H * cy;
      c.beginPath(); c.ellipse(x, y, 46 * k * cw, 10 * k * cw, 0, 0, TAU); c.ellipse(x + 20 * k * cw, y - 7 * k * cw, 24 * k * cw, 10 * k * cw, 0, 0, TAU); c.fill();
    }
    if (!sunset) {

      c.fillStyle = "#7fb59a";
      c.beginPath(); c.moveTo(0, hz + 1);
      for (let x = 0; x <= W * .55; x += 10) c.lineTo(x, hz - (14 + Math.sin(x * .02) * 6 + Math.sin(x * .007) * 10) * k * (1 - x / (W * .6)));
      c.lineTo(W * .55, hz + 1); c.fill();
      c.fillStyle = "#c9d6dc";
      for (let i = 0; i < 9; i++) { const bx = W * (.04 + i * .045), bh = (10 + (i * 7 % 13)) * k; c.fillRect(bx, hz - bh - 4 * k, 6 * k, bh); }
      c.fillStyle = "#f2e2b6"; c.fillRect(0, hz - 2, W * .5, 3 * k);

      const ax = W * .32 - ((t * 14) % (W * .6)) * .2, ay = -H * .62 + Math.sin(t * .8) * 2;
      c.save(); c.translate(ax, ay); c.scale(k, k); c.rotate(.08);
      c.fillStyle = "rgba(255,255,255,.95)";
      c.beginPath(); c.ellipse(0, 0, 11, 2.2, 0, 0, TAU); c.fill();
      c.beginPath(); c.moveTo(-2, 0); c.lineTo(-6, 7); c.lineTo(-3, 7); c.lineTo(3, 0); c.fill();
      c.beginPath(); c.moveTo(-9, 0); c.lineTo(-12, -5); c.lineTo(-10, -5); c.lineTo(-6, 0); c.fill();
      c.restore();
      c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(ax + 12 * k, ay - 1); c.lineTo(ax + 70 * k, ay - 7 * k); c.stroke();
    }
    const sea = c.createLinearGradient(0, hz, 0, 0);
    if (sunset) { sea.addColorStop(0, "#6a5285"); sea.addColorStop(1, "#2f86ad"); }
    else { sea.addColorStop(0, "#2a8fbf"); sea.addColorStop(1, "#40c6d2"); }
    c.fillStyle = sea; c.fillRect(0, hz, W, -hz + 2);
    c.strokeStyle = sunset ? "rgba(255,210,170,.35)" : "rgba(255,255,255,.35)"; c.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      const p = i / 14, y = hz + (-hz) * p * p;
      c.beginPath();
      for (let x = 0; x <= W; x += 14) c.lineTo(x, y + Math.sin(x * (.05 - p * .03) + t * (1 + p) + i) * (1 + p * 4));
      c.stroke();
    }
    c.globalCompositeOperation = "lighter";
    for (let i = 0; i < 26; i++) {
      const p = (i * .37 + t * .05) % 1, y = hz + (-hz) * p * p;
      const a = .5 + .5 * Math.sin(t * 4 + i * 2);
      c.fillStyle = sunset ? `rgba(255,180,110,${.35 * a})` : `rgba(255,255,255,${.35 * a})`;
      c.fillRect(sx - (10 + p * 50) * k + Math.sin(i * 7) * 20 * k * p, y, (8 + p * 40) * k * a, 1.5 + p * 2);
    }
    c.globalCompositeOperation = "source-over";
    if (sunset) {
      c.fillStyle = "#e9b47c";
      c.beginPath(); c.moveTo(W * .36, 2);
      for (let x = W * .36; x <= W + 4; x += 8) c.lineTo(x, beachTop(x));
      c.lineTo(W, 2); c.fill();
      c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 2.5;
      c.beginPath();
      for (let x = W * .36; x <= W + 4; x += 8) c.lineTo(x - 6 * k + Math.sin(t * 2 + x * .05) * 4 * k, beachTop(x) + 4 * k);
      c.stroke();
      const px = W * .9, py = beachTop(W * .9) + 10 * k;
      c.strokeStyle = "#3a2440"; c.lineWidth = 6 * k; c.lineCap = "round";
      c.beginPath(); c.moveTo(px, py); c.quadraticCurveTo(px - 4 * k, py - 60 * k, px - 22 * k, py - 110 * k); c.stroke();
      c.fillStyle = "#3a2440";
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * .55 + Math.sin(t + i) * .05;
        c.save(); c.translate(px - 22 * k, py - 110 * k); c.rotate(a);
        c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(30 * k, -12 * k, 58 * k, 10 * k); c.quadraticCurveTo(30 * k, -2 * k, 0, 0); c.fill();
        c.restore();
      }
    }
    c.fillStyle = "rgba(255,255,255,.8)";
    for (let x = 0; x <= W; x += 6) { c.beginPath(); c.arc(x, Math.sin(x * .08 + t * 3) * 2, 2 + Math.sin(x * .3 + t * 5) * 1.2, 0, TAU); c.fill(); }
  }

  function startAnim(cr, dur) {
    cr.an = { t: 0, dur, fired: {} };
  }
  function once(an, key, at, fn) { if (!an.fired[key] && an.t / an.dur >= at) { an.fired[key] = true; fn(); } }
  function finish(cr) {
    const isNew = !found.has(cr.id);
    if (isNew) found.add(cr.id);
    info(T_MAR.cards[cr.id]);
    if (introDone || found.size) hint(T_MAR.counter(found.size));
    if (found.size === 7 && !allShown) {
      allShown = true;
      sfx.sparkle();
      sparkle(W / 2, H * .45, 50, { colors: ["#ffffff", "#ffe9a8", "#ffd6f0", "#bff6ff"], speed: 240, gravity: 20, shape: "star", life: 1.6 });
      if (introDone && !crab) setTimeout(() => { if (curName === "mar" && !crab) { say(T_MAR.all); allShownT = TIME; } }, 900);
    }
  }
  function screenOf(x, y, f) { return [x + ox * f, y + oy * f + camY]; }

  function spawnCrab() {
    crab = { x: -70 * k, tx: W * .5, state: "in", ex: 0, ey: 0 };
    hideInfo();
  }

  async function crabSpeak() {
    const my = tok;
    crab.state = "speak";
    idle.crabWave = 1;
    const anchor = () => {
      if (!crab) return { x: -999, y: -999 };
      const [sx, sy] = screenOf(crab.x + (crab.sx || 0), sandAt(crab.x) + 10 * k - 128 * k, F_MID);
      return { x: sx, y: sy };
    };
    await speakLines(T_MAR.crabLines, anchor);
    if (my !== tok || !crab || crab.state !== "speak") return;
    crab.state = "wait"; crab.waitT = TIME; hint(T_MAR.crabHint);
  }

  async function crabGo() {
    const my = tok;
    crab.state = "talk";
    hint(""); hideInfo(); sfx.boing();
    const [hx, hy] = screenOf(crab.x, sandAt(crab.x) - 30 * k, F_MID);
    sparkle(hx, hy, 20, { colors: ["#ffd6c0", "#ffffff", "#ff9a7a"], shape: "heart", speed: 120, gravity: -30 });
    await wait(700);
    if (my !== tok) return;
    unsay();

    aboveMode = "sunset"; parallaxOn = false;
    crab.state = "exit";
    const sx = crab.x + (crab.sx || 0) + ox * F_MID, sy = sandAt(crab.x) + 10 * k + oy * F_MID;
    const bx = W * .62, by = beachTop(W * .62) + 26 * k;
    await animate(3400, p => {
      camY = H * .8 * easeInOut(p);
      const q = easeInOut(p);
      crab.ex = lerp(lerp(sx, W * .58, q), lerp(W * .58, bx, q), q);
      crab.ey = lerp(lerp(sy, sy - H * .1, q), lerp(sy - H * .1, by + camY, q), q);
    });
    if (my !== tok) return;
    crab.state = "beach";
  }

  function down(x, y) {
    ptr = { x, y, t: TIME, down: true };
    lastTouch = TIME;
    if (camY > 4) return;
    if (crab) {
      if (crab.state === "wait") {
        const [lx, ly] = toL(x, y, F_MID);
        if (dist(lx, ly, crab.x + (crab.sx || 0), sandAt(crab.x) - 40 * k) < 70 * k) crabGo();
      }
      if (crab.state !== "wait" && crab.state !== "in") return;
    }
    const [mx, my] = toL(x, y, F_MID), [wx, wy] = toL(x, y, F_WATER);
    const targets = [
      [star, mx, my, star.ax, star.ay, 34 * k],
      [octo, mx, my, octo.ax, octo.ay - 14 * k, 42 * k],
      [clown, mx, my, clown.ax, clown.ay - 18 * k, 40 * k],
      [horse, wx, wy, horse.x, horse.y, 44 * k],
      [turtle, wx, wy, turtle.x, turtle.y, 54 * k],
      [jelly, wx, wy, jelly.x, jelly.y - jelly.r * .2, jelly.r * 1.6],
      [jelly2, wx, wy, jelly2.x, jelly2.y - jelly2.r * .2, jelly2.r * 2]
    ];
    for (const [cr, px, py, cx, cy, r] of targets) {
      if (dist(px, py, cx, cy) < Math.max(36, r)) {
        if (cr.an || ((cr === jelly || cr === jelly2) && (jelly.an || jelly2.an))) return;
        const [sx, sy] = screenOf(cx, cy, cr === star || cr === octo || cr === clown ? F_MID : F_WATER);
        sparkle(sx, sy, 16, { colors: ["#ffffff", "#bff6ff", "#ffd6f0"], speed: 110, gravity: -40, life: 1 });
        sfx.chime(found.size + 1);
        if (cr === jelly || cr === jelly2) { startAnim(cr, 3.4); cr.vl = -60 * k; }
        else if (cr === turtle) startAnim(turtle, 4.2);
        else if (cr === horse) startAnim(horse, 4.4);
        else if (cr === clown) { startAnim(clown, 3.6); clown.an.tx = clamp(mx, 60, W - 60); clown.an.ty = clamp(my, H * .3, H * .72); }
        else if (cr === octo) startAnim(octo, 3.8);
        else if (cr === star) startAnim(star, 3.2);
        return;
      }
    }
    let near = false;
    for (const f of fish) if (dist(wx, wy, f.x, f.y) < 60 * k) { near = true; break; }
    if (near && !schoolAn) {
      schoolAn = { t: 0, dur: 5.2, fired: {} };
      sfx.sparkle();
      return;
    }
    for (let i = 0; i < 7; i++) bubbles.push({ x: wx + rand(-10, 10), y: wy + rand(-6, 6), r: rand(2, 6) * k, v: rand(40, 80), p: rand(0, TAU) });
    sfx.bubble();
  }

  function clownPos(an, p) {
    const hx = clown.ax, hy = clown.ay - 12 * k, R = 46 * k, tx = an.tx, ty = an.ty;
    if (p < .22) { const q = easeInOut(p / .22); return [lerp(hx, tx + R, q), lerp(hy, ty, q) - Math.sin(q * Math.PI) * 30 * k]; }
    if (p < .8) { const a = (p - .22) / .58 * TAU; return [tx + Math.cos(a) * R, ty - Math.sin(a) * R]; }
    const q = easeInOut((p - .8) / .2); return [lerp(tx + R, hx, q), lerp(ty, hy, q) - Math.sin(q * Math.PI) * 30 * k];
  }

  S.mar = {
    music: "mar", tone: "dark",
    init() {
      layout(); buildLayers(); seed();
      if (crab) crab.tx = W * .5;
    },
    async enter() {
      const my = ++tok;
      found = new Set(); introDone = false; allShown = false; allShownT = 0; crab = null; schoolAn = null; hearts = [];
      for (const cr of [jelly, jelly2, turtle, horse, clown, octo, star]) cr.an = null;
      whale = { x: W + 260 * k, on: false, next: 10 };
      aboveMode = "day"; parallaxOn = true; splashed = false; camY = H;

      await wait(1500);
      if (my !== tok) return;
      sfx.whoosh(1.4);
      await animate(1700, p => {
        camY = H * (1 - (p < .55 ? Math.pow(p / .55, 2) * .7 : .7 + .3 * springOut((p - .55) / .45)));
        if (!splashed && camY < H * .58) {
          splashed = true; sfx.splash();
          for (let i = 0; i < 9; i++) sparkle(W * (i + .5) / 9, camY, 14, { colors: ["#ffffff", "#e8fbff"], speed: 380, gravity: 700, dir: -Math.PI / 2, spread: .9, size: 3.2, life: 1 });
          for (let i = 0; i < 60; i++) rush.push({ x: rand(0, W), y: rand(H * .3, H * 1.4), r: rand(6, 26) * k, v: rand(700, 1500) });
        }
      });
      camY = 0;
      if (my !== tok) return;
      await wait(400);
      await narrate(T_MAR.intro, { keepLast: true });
      if (my !== tok) return;
      introDone = true; introT = TIME;
      hint(T_MAR.counter(found.size));
      if (allShown && !allShownT) { say(T_MAR.all); allShownT = TIME; }
    },
    exit() { tok++; crab = null; hint(""); camY = 0; },
    move(x, y, isDown) { ptr.x = x; ptr.y = y; ptr.t = TIME; ptr.down = isDown; lastTouch = TIME; },
    down, up() { ptr.down = false; },
    update(dt, t) {

      let tx = Math.sin(t * .13) * 14 * k, ty = Math.sin(t * .17) * 9 * k;
      if (ptr.down) { tx = -(ptr.x - W / 2) * .08; ty = -(ptr.y - H / 2) * .05; }
      if (!parallaxOn) { tx = 0; ty = 0; }
      ox += (tx - ox) * Math.min(1, dt * 2.2); oy += (ty - oy) * Math.min(1, dt * 2.2);
      ox = clamp(ox, -M * .9, M * .9); oy = clamp(oy, -M * .9, M * .9);

      if (TIME - lastTouch > 4 && camY < 4) {
        idleT -= dt;
        if (idleT <= 0) {
          idleT = rand(1.6, 2.8);
          const opts = ["octo", "jelly", "turtle"];
          if (crab && (crab.state === "wait" || crab.state === "speak")) opts.push("crab", "crab");
          const o = pick(opts);
          if (o === "octo" && !octo.an) idle.octo = 1;
          if (o === "jelly") { const j = pick([jelly, jelly2]); if (!j.an) j.idle = 1; }
          if (o === "turtle" && !turtle.an) { idle.turtle = 1; idle.blink = .3; }
          if (o === "crab") { crab.sxT = clamp((crab.sxT || 0) + pick([-1, 1]) * rand(10, 22) * k, -40 * k, 40 * k); idle.crabWave = 1; }
        }
      }
      idle.octo = Math.max(0, idle.octo - dt / 2.2);
      idle.turtle = Math.max(0, idle.turtle - dt / 2.4);
      idle.blink = Math.max(0, idle.blink - dt);
      idle.crabWave = Math.max(0, idle.crabWave - dt / 1.8);
      for (const j of [jelly, jelly2]) j.idle = Math.max(0, (j.idle || 0) - dt / 1.2);
      if (crab) crab.sx = lerp(crab.sx || 0, crab.sxT || 0, Math.min(1, dt * 3));

      for (const j of [jelly, jelly2]) {
        j.lift += j.vl * dt; j.vl *= Math.pow(.25, dt); j.lift *= Math.pow(.55, dt);
        j.z = 1 + Math.sin(t * .3 + j.r) * .12;
        j.x = j.ax + Math.sin(t * .23 + j.r) * 18 * k;
        j.y = j.ay + Math.sin(t * .5 + j.r) * 12 * k + j.lift;
      }
      if (!turtle.an) { turtle.x += 26 * k * dt; if (turtle.x > W + 120 * k) turtle.x = -120 * k; }
      horse.x = horse.ax + Math.sin(t * .6) * 6 * k; horse.y = horse.ay + Math.sin(t * 1.1) * 10 * k;

      for (const cr of [jelly, jelly2, turtle, horse, clown, octo, star]) {
        const an = cr.an; if (!an) continue;
        an.t += dt;
        const p = an.t / an.dur;
        if (cr === jelly || cr === jelly2) once(an, "glow", .3, () => { sfx.sparkle(); const [sx, sy] = screenOf(cr.x, cr.y + cr.r * 1.25, F_WATER); sparkle(sx, sy, 22, { colors: ["#ffb6e0", "#ffffff"], shape: "heart", speed: 90, gravity: -20 }); });
        if (cr === turtle) once(an, "bubble", .42, () => { sfx.bubble(); hearts.push({ x: an.bx || W * .5, y: an.by || H * .45, r: 20 * k, v: 50 * k, t: 0 }); });
        if (cr === horse) once(an, "meet", .45, () => { sfx.chime(5); });
        if (cr === clown && Math.random() < dt * 14) { const [cx, cy] = clownPos(an, p); const [sx, sy] = screenOf(cx, cy, F_MID); sparkle(sx, sy, 1, { colors: ["#ffd29a", "#fff"], speed: 20, gravity: -30, life: .7 }); }
        if (cr === octo) {
          if (p > .5 && Math.random() < dt * 6) { const [sx, sy] = screenOf(octo.ax + rand(-30, 30) * k, octo.ay - 30 * k, F_MID); sparkle(sx, sy, 1, { colors: ["#ff9ac4", "#ffd6e8"], shape: "heart", speed: 40, gravity: -50, size: 3, life: 1.3 }); }
          once(an, "hug", .5, () => sfx.chime(7));
        }
        if (cr === star) {
          once(an, "hop", .02, () => sfx.boing());
          once(an, "twinkle", .3, () => sfx.sparkle());
          once(an, "land", .82, () => { sfx.step(); const [sx, sy] = screenOf(star.ax, star.ay, F_MID); sparkle(sx, sy, 12, { colors: ["#e8d6a8", "#fff"], speed: 80, gravity: 120, life: .8 }); });
        }
        if (p >= 1) {
          cr.an = null;
          if (cr === octo) { octo.tgt = pick(OCTO_COLS); }
          finish(cr);
        }
      }
      if (octo.an && octo.an.t / octo.an.dur < .55) octo.col = hsl2rgb((t * 420) % 360, 75, 62);
      else for (let i = 0; i < 3; i++) octo.col[i] = lerp(octo.col[i], octo.tgt[i], Math.min(1, dt * 3));

      for (const hb of hearts) { hb.t += dt; hb.y -= hb.v * dt; hb.x += Math.sin(hb.t * 2) * 10 * dt; }
      hearts = hearts.filter(hb => hb.y > -60);

      whale.next -= dt;
      if (!whale.on && whale.next <= 0) { whale.on = true; whale.x = W + 260 * k; }
      if (whale.on) { whale.x -= 22 * k * dt; if (whale.x < -300 * k) { whale.on = false; whale.next = 30; } }
      for (const s of snow) { s.y += s.v * dt * .4; s.x += Math.sin(t * .5 + s.p) * 6 * dt; if (s.y > H) { s.y = -4; s.x = rand(0, W); } }
      if (Math.random() < dt * 3) {
        const src = pick([[clown.ax, clown.ay], [octo.ax, octo.ay - 30 * k], [rand(0, W), sandAt(W / 2)], [W * .63, sandAt(W * .63) - 20]]);
        bubbles.push({ x: src[0] + rand(-8, 8), y: src[1], r: rand(1.5, 5) * k, v: rand(30, 70), p: rand(0, TAU) });
      }
      for (const b of bubbles) { b.y -= b.v * dt; b.v = Math.min(b.v + 20 * dt, 220); b.x += Math.sin(t * 3 + b.p) * 12 * dt; }
      bubbles = bubbles.filter(b => b.y > H * .03);
      if (Math.random() < dt * .5) fgBubs.push({ x: rand(0, W), y: H + 40, r: rand(14, 34) * k, v: rand(40, 80), p: rand(0, TAU) });
      for (const b of fgBubs) { b.y -= b.v * dt; b.x += Math.sin(t * 1.5 + b.p) * 14 * dt; }
      fgBubs = fgBubs.filter(b => b.y > -60);
      for (const b of rush) b.y -= b.v * dt;
      rush = rush.filter(b => b.y > -60);

      let sw = 0, circ = 0, sp0 = 0;
      if (schoolAn) {
        schoolAn.t += dt;
        const p = sp0 = schoolAn.t / schoolAn.dur;
        sw = p < .15 ? easeInOut(p / .15) : p > .85 ? 1 - easeInOut((p - .85) / .15) : 1;
        circ = 1 - easeInOut(seg(p, .35, .55));
        once(schoolAn, "heart", .5, () => sfx.chime(6));
        if (p >= 1) {
          for (const f of fish) { const a = Math.atan2(f.y - H * .42, f.x - W * .5); f.vx = Math.cos(a) * 200; f.vy = Math.sin(a) * 200; }
          schoolAn = null; finish({ id: "cardume" });
        }
      }
      const cx = W * .5 + Math.sin(t * .21) * W * .26, cy = H * .37 + Math.sin(t * .33) * H * .07;
      const fleeOn = pX >= 0 && (TIME - ptr.t < .6 || ptr.down || pDown);
      const [pwx, pwy] = toL(pX, pY, F_WATER);
      fish.forEach((f, i) => {
        if (sw > 0) {
          const u = i / fish.length * TAU, hs = 4.4 * k;

          const ca = u + sp0 * 14, cr = 62 * k;
          const [hx0, hy0] = heartXY(u), [nx0, ny0] = heartXY(u + .1);
          const hx = lerp(hx0, Math.cos(ca) * cr / hs, circ), hy = lerp(hy0, Math.sin(ca) * cr / hs, circ);
          const nx = lerp(nx0, Math.cos(ca + .1) * cr / hs, circ), ny = lerp(ny0, Math.sin(ca + .1) * cr / hs, circ);
          const txh = W * .5 + hx * hs, tyh = H * .44 + hy * hs;
          f.x = lerp(f.x, txh, Math.min(1, dt * 5 * sw)); f.y = lerp(f.y, tyh, Math.min(1, dt * 5 * sw));
          f.vx = lerp(f.vx, (nx - hx) * 40, sw); f.vy = lerp(f.vy, (ny - hy) * 40, sw);
          f.p += dt * 14;
          return;
        }
        let ax = (cx - f.x) * .9, ay = (cy - f.y) * .9;
        ax += -(f.y - cy) * .6; ay += (f.x - cx) * .6;
        for (const o of fish) {
          if (o === f) continue;
          const dx = f.x - o.x, dy = f.y - o.y, d2 = dx * dx + dy * dy;
          if (d2 < 260 && d2 > .01) { ax += dx / d2 * 900; ay += dy / d2 * 900; }
        }
        if (fleeOn && camY < 4) {
          const dx = f.x - pwx, dy = f.y - pwy, d = Math.hypot(dx, dy);
          if (d < 140 * k && d > .1) { ax += dx / d * 1400; ay += dy / d * 1400; }
        }
        f.vx += ax * dt; f.vy += ay * dt;
        const sp = Math.hypot(f.vx, f.vy), mx = 170 * k, mn = 45 * k;
        if (sp > mx) { f.vx *= mx / sp; f.vy *= mx / sp; } else if (sp < mn && sp > 0) { f.vx *= mn / sp; f.vy *= mn / sp; }
        f.x += f.vx * dt; f.y += f.vy * dt; f.p += dt * 14;
      });

      if (introDone && !crab && allShown && allShownT && TIME - allShownT > 4) spawnCrab();
      if (crab) {
        const walking = crab.state === "in" || crab.state === "exit" || crab.state === "beach";
        if (crab.state === "in") {
          crab.x += 70 * k * dt;
          if (crab.x >= crab.tx) {
            crab.x = crab.tx;
            const [sx, sy] = screenOf(crab.x, sandAt(crab.x) - 80 * k, F_MID);
            sparkle(sx, sy, 14, { colors: ["#ffe9a8", "#fff"], shape: "star", speed: 80, gravity: 0 });
            crabSpeak();
          }
        } else if (crab.state === "wait" && TIME - crab.waitT > 8) {
          crabGo();
        } else if (crab.state === "beach") {
          crab.ex += 90 * k * dt;
          crab.ey = beachTop(crab.ex) + 26 * k + camY;
          if (crab.ex > W + 90 * k) { crab.state = "gone"; go("jardim", { color: "#ffe6b8" }); }
        }
        if (walking) { stepT -= dt; if (stepT <= 0) { sfx.step(); stepT = .16; } }
      }
    },
    draw(c, t) {
      const L = f => { c.save(); c.translate(ox * f, oy * f + camY); };
      if (camY > .5) { c.save(); c.translate(0, camY); drawAbove(c, t); c.restore(); }
      c.save();
      if (camY > .5) { c.beginPath(); c.rect(0, camY, W, H); c.clip(); }

      if (far) c.drawImage(far, ox * F_FAR - M, oy * F_FAR + camY - M, W + M * 2, H + M * 2);
      L(F_FAR); drawWhale(c, t); c.restore();

      c.save(); c.translate(ox * .3, camY);
      c.globalCompositeOperation = "lighter";
      for (const r of rays) {
        const a = .055 + .05 * Math.sin(t * .35 + r.p), sx = r.x + Math.sin(t * .2 + r.p) * 20;
        const g = c.createLinearGradient(0, 0, 0, H * .9);
        g.addColorStop(0, `rgba(215,255,250,${a})`); g.addColorStop(.6, `rgba(190,245,255,${a * .4})`); g.addColorStop(1, "rgba(190,245,255,0)");
        c.fillStyle = g;
        c.beginPath(); c.moveTo(sx, 0); c.lineTo(sx + r.w, 0); c.lineTo(sx + r.w * 2.6 + H * .22, H * .9); c.lineTo(sx + H * .22 - r.w * .6, H * .9); c.fill();
      }
      c.restore();
      c.save(); c.translate(0, camY);
      const sy = H * .035;
      c.fillStyle = "rgba(200,255,250,.32)";
      c.beginPath(); c.moveTo(0, 0);
      for (let x = 0; x <= W + 10; x += 10) c.lineTo(x, sy + Math.sin(x * .03 + t * 1.6) * 3 + Math.sin(x * .011 - t) * 3);
      c.lineTo(W, 0); c.fill();
      c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = 1.4;
      c.beginPath();
      for (let x = 0; x <= W + 10; x += 10) c.lineTo(x, sy + Math.sin(x * .03 + t * 1.6) * 3 + Math.sin(x * .011 - t) * 3);
      c.stroke();
      c.restore();

      L(.4);
      c.fillStyle = "rgba(230,250,255,.35)";
      for (const s of snow) { c.beginPath(); c.arc(s.x, s.y, s.r, 0, TAU); c.fill(); }
      c.restore();

      if (mid) c.drawImage(mid, ox * F_MID - M, oy * F_MID + camY - M, W + M * 2, H + M * 2);
      L(F_MID);
      c.globalCompositeOperation = "lighter";
      for (let i = 0; i < 10; i++) {
        const x = ((i * 137 + t * 18) % (W + 100)) - 50, y = sandAt(x) + 14 + (i % 4) * 9;
        c.fillStyle = "rgba(255,255,230,.07)";
        c.beginPath(); c.ellipse(x, y, (22 + Math.sin(t + i) * 8) * k, 4 * k, Math.sin(i), 0, TAU); c.fill();
      }
      c.globalCompositeOperation = "source-over";
      for (const wd of weeds) if (!wd.front) drawWeed(c, wd, t);
      const as = 1.15 * k;
      contact(c, clown.ax, clown.ay + 12 * k, 30 * k, .6);
      anemone(c, clown.ax, clown.ay, as, t, true);
      const clownOut = clown.an && clown.an.t / clown.an.dur > .08 && clown.an.t / clown.an.dur < .97;
      if (!clownOut) drawClown(c, clown.ax + Math.sin(t * .9) * 6 * k, clown.ay - 12 * k + Math.sin(t * 1.7) * 2, .95 * k, t, 0, false);
      anemone(c, clown.ax, clown.ay, as, t, false);

      { const an = octo.an, p = an ? an.t / an.dur : 0;
        const wave = an ? Math.sin(seg(p, 0, .5) * Math.PI) : 0;
        const hug = an ? backOut(seg(p, .5, .7)) * (1 - easeInOut(seg(p, .88, 1))) : 0;
        const bounce = an ? Math.sin(seg(p, 0, .5) * Math.PI * 4) * 4 * k : 0;
        contact(c, octo.ax, octo.ay + 4 * k, 40 * k, .5);
        drawOcto(c, octo.ax, octo.ay - Math.abs(bounce), 1.05 * k * (1 + hug * .08), t, octo.col, wave, clamp(hug), an ? 1 - seg(p, .2, .6) : 0, an ? 0 : Math.sin(idle.octo * Math.PI));
      }

      { const an = star.an, p = an ? an.t / an.dur : 0;
        let h = 0, glow = 0, rot = .3;
        if (an) {
          h = p < .3 ? backOut(p / .3) : p < .75 ? 1 + Math.sin((p - .3) * 12) * .05 : 1 - springOut((p - .75) / .25);
          glow = easeInOut(seg(p, .15, .35)) * (1 - easeInOut(seg(p, .7, .9)));
          rot = .3 + p * TAU * 1.2 * (p < .3 ? easeOut(p / .3) : 1) * .4;
        }
        const hop = h * 80 * k;
        contact(c, star.ax, star.ay + 4 * k, 26 * k * (1 - h * .4), .55 * (1 - h * .5));
        drawStarfish(c, star.ax, star.ay - hop, 22 * k * (1 + glow * .15), t, rot, glow);
      }
      if (crab && (crab.state === "in" || crab.state === "speak" || crab.state === "wait" || crab.state === "talk")) {
        const cxp = crab.x + (crab.sx || 0), shuffling = Math.abs((crab.sxT || 0) - (crab.sx || 0)) > 1;
        contact(c, cxp, sandAt(crab.x) + 10 * k, 46 * k, .6);
        drawCrab(c, cxp, sandAt(crab.x) + 10 * k, 58 * k, t, crab.state === "in" || shuffling, T_MAR.crabSign, Math.sin(idle.crabWave * Math.PI));
      }
      if (clownOut) {
        const p = clown.an.t / clown.an.dur;
        const [x1, y1] = clownPos(clown.an, p), [x2, y2] = clownPos(clown.an, Math.min(1, p + .01));
        const ang = Math.atan2(y2 - y1, x2 - x1), left = x2 < x1;
        drawClown(c, x1, y1, 1.15 * k, t * 1.6, ang, left);
      }
      c.restore();

      L(F_WATER);
      let turtleTop = null;
      { const an = turtle.an;
        if (an) {
          const p = an.t / an.dur;
          const a = p < .3 ? easeInOut(p / .3) : p < .7 ? 1 : 1 - easeInOut((p - .7) / .3);
          if (!an.hx) { an.hx = turtle.x; an.hy = turtle.y; }
          const x = lerp(an.hx, W * .5, a), y = lerp(an.hy, H * .5, a);
          const s = 1.05 * k * (1 + 1.7 * a);
          an.bx = x + 52 * s * Math.cos(-.35 * a); an.by = y + 52 * s * Math.sin(-.35 * a) - 10 * k;
          const moving = (p < .3 || p > .7) ? 1 : 0;
          turtleTop = { x, y, s, rot: -.35 * a + Math.sin(t * .7) * .05, wave: Math.sin(p * Math.PI * 8) * .6 * a, head: Math.sin(seg(p, .32, .68) * Math.PI) * .25, moving };
          if (p >= .999) turtle.x = an.hx;
        } else {
          const z = 1 + Math.sin(t * .25) * .14;
          const blink = idle.blink > 0 || (t % 5.3) < .14 ? 1 : 0;
          drawTurtle(c, turtle.x, turtle.y + Math.sin(t * .9) * 6 * k, 1.05 * k * z, Math.sin(t * .7) * .05, t, 0, Math.sin(idle.turtle * Math.PI) * .5, blink);
        }
      }
      for (const f of fish) drawFish(c, f);
      drawJelly(c, jelly2, t);
      drawJelly(c, jelly, t);

      { const an = horse.an, s = 1.25 * k;
        if (an) {
          const p = an.t / an.dur;
          const meet = easeInOut(seg(p, .05, .45)) * (1 - easeInOut(seg(p, .85, 1)));
          const tail = backOut(seg(p, .4, .6)) * (1 - easeInOut(seg(p, .8, .95)));
          const x2 = lerp(horse.x + 150 * k, horse.x + 40 * k, meet);
          drawHorse(c, horse.x + 4 * k * meet, horse.y, s, t, 1, tail * .9, .14 * tail, 1);
          drawHorse(c, x2, horse.y, s * .95, t + 1, -1, tail * .9, -.14 * tail, clamp(meet * 1.5));
          if (tail > .02) {
            const hx = horse.x + 22 * k, hy = horse.y + 46 * k, hs = 1.15 * k;
            c.strokeStyle = `rgba(255,150,200,${.9 * clamp(tail)})`; c.lineWidth = 3 * k;
            c.beginPath();
            const n = Math.floor(clamp(tail) * 40);
            for (let i = 0; i <= n; i++) { const [px, py] = heartXY(Math.PI + i / 40 * TAU); c.lineTo(hx + px * hs, hy + py * hs); }
            c.stroke();
          }
        } else drawHorse(c, horse.x, horse.y, s, t, 1, 0, 0, 1);
      }

      for (const b of bubbles) {
        c.fillStyle = "rgba(255,255,255,.08)"; c.strokeStyle = "rgba(235,255,255,.55)"; c.lineWidth = 1;
        c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .25, 0, TAU); c.fill();
      }
      for (const hb of hearts) {
        const r = hb.r * (1 + Math.sin(hb.t * 3) * .05);
        c.fillStyle = "rgba(255,255,255,.1)"; c.strokeStyle = "rgba(240,255,255,.7)"; c.lineWidth = 1.5;
        c.beginPath(); c.arc(hb.x, hb.y, r, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = "#ff8fbf"; drawHeartShape(c, hb.x, hb.y + r * .15, r * .55); c.fill();
        c.fillStyle = "rgba(255,255,255,.75)"; c.beginPath(); c.arc(hb.x - r * .4, hb.y - r * .4, r * .18, 0, TAU); c.fill();
      }
      if (turtleTop) {
        const tt = turtleTop;
        if (tt.moving) for (const [ds, al] of [[.9, .14], [.95, .22]]) { c.globalAlpha = al; drawTurtle(c, tt.x, tt.y, tt.s * ds, tt.rot, t, tt.wave, tt.head); }
        c.globalAlpha = 1;
        drawTurtle(c, tt.x, tt.y, tt.s, tt.rot, t, tt.wave, tt.head);
      }
      c.restore();

      L(F_FRONT);
      for (const wd of weeds) if (wd.front) drawWeed(c, wd, t);
      for (const b of fgBubs) c.drawImage(softBub, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      c.restore();

      if (vig) c.drawImage(vig, 0, camY, W, H);
      c.restore();

      if (crab && (crab.state === "exit" || crab.state === "beach")) {
        drawCrab(c, crab.ex, crab.state === "beach" ? crab.ey : crab.ey, 58 * k, t, true, "");
      }

      for (const b of rush) c.drawImage(softBub, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
  };
})();
