const T_UNIVERSO = {
  intro: [
    "Oi, Lia.",
    "antes de tudo, vem dar uma volta comigo.",
    "lá fora tem planeta, galáxia, um monte de coisa enorme…",
    "e mesmo assim, hoje o universo inteiro tá olhando pra um lugar só.",
    "pra você."
  ],
  convite: "esses planetas são nossos. toca neles pra ver.",
  contador: n => n + "/3 planetas visitados",
  planetas: {
    barbie: { title: "Planeta Barbie", text: "nosso cineminha improvisado. cada uma de um lado da tela, Barbie passando e a gente tendo mais uma memória pra guardar." },
    discord: { title: "Planeta Discord", text: "um lugar onde a gente entrava pra conversar e, do nada, tava no meio de uma call com uns completos desconhecidos KKKKK. nunca vou entender como essas coisas aconteciam." },
    brownie: { title: "Planeta Brownie de Caneca", text: "a receita era simples, mas a combinação de brownie de caneca, Barbie e você fez tudo ficar muito melhor." }
  }
};

function offCanvas(w, h) {
  const cvs = document.createElement("canvas");
  cvs.width = Math.max(1, Math.ceil(w * DPR)); cvs.height = Math.max(1, Math.ceil(h * DPR));
  const c = cvs.getContext("2d"); c.scale(DPR, DPR);
  return [cvs, c];
}

function buildPlanet(r, { light, mid, dark, bands = [], ring = null, atmo = "rgba(255,255,255,.5)", spots = [], speed = 10, tilt = -.32 }) {
  const circ = Math.ceil(Math.PI * 2 * r), th = Math.ceil(r * 2);

  const [tex, tc] = offCanvas(circ * 2, th);
  const g = tc.createLinearGradient(0, 0, 0, th);
  g.addColorStop(0, light); g.addColorStop(.5, mid); g.addColorStop(1, dark);
  tc.fillStyle = g; tc.fillRect(0, 0, circ * 2, th);
  for (const b of bands) {
    const k = Math.max(1, Math.round(b.w || 4)), y0 = (b.y + 1) * r, h = b.h * r;
    tc.fillStyle = b.color; tc.globalAlpha = b.alpha;
    tc.beginPath();
    tc.moveTo(0, y0);
    for (let x = 0; x <= circ * 2; x += 4) tc.lineTo(x, y0 + Math.sin(x / circ * Math.PI * 2 * k + (b.ph || 0)) * h * .35);
    for (let x = circ * 2; x >= 0; x -= 4) tc.lineTo(x, y0 + h + Math.sin(x / circ * Math.PI * 2 * (k + 1) + (b.ph || 1)) * h * .35);
    tc.closePath(); tc.fill();
  }
  for (const s of spots) for (const off of [0, circ]) {
    tc.globalAlpha = s.alpha; tc.fillStyle = s.color;
    tc.beginPath(); tc.ellipse(s.x * circ + off, (s.y + 1) * r, s.rx * r * 1.6, s.ry * r, 0, 0, Math.PI * 2); tc.fill();
  }

  tc.globalAlpha = .06;
  for (let i = 0; i < circ * th / 40; i++) { tc.fillStyle = Math.random() < .5 ? "#fff" : "#000"; tc.fillRect(Math.random() * circ * 2, Math.random() * th, 1.5, 1.5); }
  tc.globalAlpha = 1;

  const pad = ring ? r * 1.35 : r * .4, size = Math.ceil((r + pad) * 2), cx = size / 2;
  const drawRing = (c, front) => {
    c.save(); c.translate(cx, cx); c.rotate(tilt);
    if (front) { c.beginPath(); c.rect(-r * 3, 0, r * 6, r * 3); c.clip(); }
    else { c.beginPath(); c.rect(-r * 3, -r * 3, r * 6, r * 3); c.clip(); }
    for (let i = 0; i < 30; i++) {
      const k = i / 29, rx = r * (1.35 + k * .95), ry = rx * .26;
      c.strokeStyle = ring.colors[i % ring.colors.length];
      c.globalAlpha = ring.alpha * (.35 + .65 * Math.sin(k * Math.PI)) * (i % 6 === 4 ? .3 : 1) * (front ? 1 : .8);
      c.lineWidth = r * .04;
      c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); c.stroke();
    }
    c.restore(); c.globalAlpha = 1;
  };

  const [back, bc] = offCanvas(size, size);
  const ag = bc.createRadialGradient(cx, cx, r * .92, cx, cx, r * 1.38);
  ag.addColorStop(0, atmo); ag.addColorStop(1, "rgba(0,0,0,0)");
  bc.fillStyle = ag; bc.beginPath(); bc.arc(cx, cx, r * 1.38, 0, Math.PI * 2); bc.fill();
  if (ring) drawRing(bc, false);

  const [shade, sc] = offCanvas(size, size);
  sc.save(); sc.beginPath(); sc.arc(cx, cx, r, 0, Math.PI * 2); sc.clip();
  const hl = sc.createRadialGradient(cx - r * .45, cx - r * .5, r * .05, cx - r * .1, cx - r * .1, r * 1.3);
  hl.addColorStop(0, "rgba(255,255,255,.32)"); hl.addColorStop(.35, "rgba(255,255,255,.04)"); hl.addColorStop(.62, "rgba(0,0,0,.05)"); hl.addColorStop(1, "rgba(4,3,18,.86)");
  sc.fillStyle = hl; sc.fillRect(0, 0, size, size);
  const rim = sc.createRadialGradient(cx, cx, r * .8, cx, cx, r);
  rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, atmo);
  sc.globalCompositeOperation = "lighter"; sc.globalAlpha = .55;
  sc.fillStyle = rim; sc.fillRect(0, 0, size, size);
  sc.restore();

  let front = null;
  if (ring) {
    const [fr, fc] = offCanvas(size, size);
    drawRing(fc, true);
    fc.globalCompositeOperation = "destination-out";
    fc.fillStyle = "rgba(0,0,0,.55)";
    fc.beginPath(); fc.ellipse(cx + r * .55, cx + r * .2, r * .55, r * .25, tilt, 0, Math.PI * 2); fc.fill();
    front = fr;
  }
  return { r, tex, circ, th, back, shade, front, size, speed };
}
function drawPlanet(c, P, x, y, sc, t) {
  const r = P.r * sc, s = P.size * sc;
  c.drawImage(P.back, x - s / 2, y - s / 2, s, s);
  c.save();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip();
  const off = ((t * P.speed) % P.circ + P.circ) % P.circ;
  const N = 28;
  for (let i = 0; i < N; i++) {
    const x0 = -1 + 2 * i / N, x1 = -1 + 2 * (i + 1) / N;
    const u0 = Math.asin(x0), u1 = Math.asin(x1);
    const sx = (u0 + Math.PI / 2) / (Math.PI * 2) * P.circ + off, sw = (u1 - u0) / (Math.PI * 2) * P.circ;
    c.drawImage(P.tex, sx * DPR, 0, Math.max(1, sw * DPR), P.th * DPR, x + x0 * r - .5, y - r, (x1 - x0) * r + 1, r * 2);
  }
  c.restore();
  c.drawImage(P.shade, x - s / 2, y - s / 2, s, s);
  if (P.front) c.drawImage(P.front, x - s / 2, y - s / 2, s, s);
}

function decoBarbie(c, x, y, r, t) {

  c.save(); c.translate(x - r * .35, y - r * .82); c.rotate(-.25 + Math.sin(t * 1.5) * .04);
  const s = r / 50;
  c.scale(s, s);
  const bow = c.createLinearGradient(0, -22, 0, 22);
  bow.addColorStop(0, "#ff9fd0"); bow.addColorStop(1, "#e0418f");
  c.fillStyle = bow; c.strokeStyle = "#b3266f"; c.lineWidth = 2;
  for (const side of [-1, 1]) {
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(side * 18, -26, side * 46, -20, side * 40, 0);
    c.bezierCurveTo(side * 46, 20, side * 18, 26, 0, 0);
    c.fill(); c.stroke();
    c.beginPath(); c.moveTo(side * 4, 4);
    c.quadraticCurveTo(side * 14, 26, side * 10, 40); c.lineTo(side * 18, 34); c.quadraticCurveTo(side * 16, 18, side * 6, 3);
    c.fill(); c.stroke();
  }
  c.fillStyle = "#ffffff"; c.globalAlpha = .55;
  c.beginPath(); c.ellipse(-24, -9, 9, 4, -.5, 0, 6.283); c.fill();
  c.beginPath(); c.ellipse(24, -9, 9, 4, .5, 0, 6.283); c.fill();
  c.globalAlpha = 1;
  c.fillStyle = "#f05aa5";
  c.beginPath(); c.ellipse(0, 0, 9, 11, 0, 0, 6.283); c.fill(); c.stroke();
  c.restore();

  for (let i = 0; i < 5; i++) {
    const a = t * .5 + i * 1.256, rr = r * (1.55 + .12 * Math.sin(t * 2 + i));
    const sx = x + Math.cos(a) * rr, sy = y + Math.sin(a) * rr * .55;
    const tw = .6 + .4 * Math.sin(t * 4 + i * 2);
    c.fillStyle = i % 2 ? "#fff3a8" : "#ffd1ea";
    drawStarShape(c, sx, sy, r * .1 * tw + 2, t + i, 5, .45); c.fill();
  }
}
function decoDiscord(c, x, y, r, t) {
  c.save(); c.lineCap = "round";

  c.strokeStyle = "#cfd2ec"; c.lineWidth = r * .17;
  c.beginPath(); c.arc(x, y, r * 1.1, Math.PI * 1.04, Math.PI * 1.96); c.stroke();
  c.strokeStyle = "#ffffff"; c.lineWidth = r * .05;
  c.beginPath(); c.arc(x, y, r * 1.13, Math.PI * 1.2, Math.PI * 1.5); c.stroke();

  for (const side of [-1, 1]) {
    const cx = x + side * r * 1.04, cy = y - r * .05;
    c.fillStyle = "#cfd2ec";
    c.beginPath(); c.ellipse(cx, cy, r * .22, r * .34, 0, 0, 6.283); c.fill();
    c.fillStyle = "#5865f2";
    c.beginPath(); c.ellipse(cx + side * r * .04, cy, r * .13, r * .24, 0, 0, 6.283); c.fill();
    c.fillStyle = "rgba(255,255,255,.35)";
    c.beginPath(); c.ellipse(cx + side * r * .02, cy - r * .1, r * .04, r * .07, 0, 0, 6.283); c.fill();
  }

  c.strokeStyle = "#cfd2ec"; c.lineWidth = r * .08;
  c.beginPath(); c.moveTo(x - r * 1.04, y + r * .22); c.quadraticCurveTo(x - r * .95, y + r * .8, x - r * .38, y + r * .76); c.stroke();
  c.fillStyle = "#ffffff";
  c.beginPath(); c.ellipse(x - r * .3, y + r * .76, r * .13, r * .1, 0, 0, 6.283); c.fill();
  c.fillStyle = "#5865f2";
  c.beginPath(); c.ellipse(x - r * .27, y + r * .76, r * .07, r * .05, 0, 0, 6.283); c.fill();
  c.restore();

  const fx = x + r * 1.15, fy = y - r * 1.05 + Math.sin(t * 1.8) * r * .08, s = r * .32;
  c.save(); c.translate(fx, fy); c.rotate(.15 + Math.sin(t * 1.3) * .08);
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.moveTo(-s, -s * .45); c.quadraticCurveTo(0, -s * .7, s, -s * .45);
  c.quadraticCurveTo(s * 1.25, s * .5, s * .85, s * .7); c.quadraticCurveTo(s * .55, s * .75, s * .4, s * .35);
  c.lineTo(-s * .4, s * .35); c.quadraticCurveTo(-s * .55, s * .75, -s * .85, s * .7); c.quadraticCurveTo(-s * 1.25, s * .5, -s, -s * .45);
  c.fill();
  c.fillStyle = "#5865f2";
  c.beginPath(); c.ellipse(-s * .38, -s * .02, s * .14, s * .18, 0, 0, 6.283); c.fill();
  c.beginPath(); c.ellipse(s * .38, -s * .02, s * .14, s * .18, 0, 0, 6.283); c.fill();
  c.restore();
  const bx = x - r * 1.25, by = y - r * 1.2 + Math.sin(t * 2.2 + 1) * r * .06;
  c.fillStyle = "#ffffff";
  c.beginPath(); c.ellipse(bx, by, r * .5, r * .28, 0, 0, 6.283); c.fill();
  c.beginPath(); c.moveTo(bx + r * .15, by + r * .22); c.lineTo(bx + r * .38, by + r * .45); c.lineTo(bx + r * .3, by + r * .18); c.fill();
  c.fillStyle = "#5865f2"; c.font = `800 ${Math.max(9, r * .22)}px Nunito, system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
  c.fillText("KKKK", bx, by + 1);
  c.textBaseline = "alphabetic";
}
function decoBrownie(c, x, y, r, t) {

  c.save();
  c.beginPath(); c.arc(x, y, r * 1.015, 0, 6.283); c.clip();
  const ch = c.createLinearGradient(0, y - r, 0, y);
  ch.addColorStop(0, "#5b2c12"); ch.addColorStop(1, "#3a1806");
  c.fillStyle = ch;
  c.beginPath(); c.moveTo(x - r * 1.1, y - r * 1.1); c.lineTo(x + r * 1.1, y - r * 1.1);
  const drips = [[.95, .3], [.72, .55], [.5, .2], [.28, .62], [.05, .35], [-.2, .7], [-.42, .25], [-.65, .5], [-.88, .3]];
  c.lineTo(x + r * 1.1, y - r * .35);
  for (const [dx, len] of drips) {
    const px = x + dx * r, base = y - r * .4;
    c.lineTo(px + r * .1, base);
    c.quadraticCurveTo(px + r * .1, base + r * len, px, base + r * len + r * .06);
    c.quadraticCurveTo(px - r * .1, base + r * len, px - r * .1, base);
  }
  c.lineTo(x - r * 1.1, y - r * .35); c.closePath(); c.fill();
  c.fillStyle = "rgba(255,255,255,.25)";
  c.beginPath(); c.ellipse(x - r * .35, y - r * .68, r * .25, r * .07, -.35, 0, 6.283); c.fill();

  const cols = ["#ff8fbf", "#ffd36b", "#8fd3ff", "#ffffff", "#b6f0a0"];
  for (let i = 0; i < 14; i++) {
    const a = 3.6 + i * .16, rr = r * (.55 + (i % 3) * .13);
    c.fillStyle = cols[i % cols.length];
    c.save(); c.translate(x + Math.cos(a) * rr, y + Math.sin(a) * rr); c.rotate(i);
    c.fillRect(-r * .045, -r * .015, r * .09, r * .03); c.restore();
  }
  c.restore();

  const a = t * .45 + 2, mx = x + Math.cos(a) * r * 1.7, my = y + Math.sin(a) * r * .55;
  const s = r * .3;
  c.save(); c.translate(mx, my);
  c.fillStyle = "#fff4f8";
  c.beginPath(); c.roundRect ? c.roundRect(-s * .6, -s * .55, s * 1.2, s * 1.15, s * .18) : c.rect(-s * .6, -s * .55, s * 1.2, s * 1.15); c.fill();
  c.strokeStyle = "#fff4f8"; c.lineWidth = s * .16;
  c.beginPath(); c.arc(s * .68, 0, s * .26, -1.3, 1.3); c.stroke();
  c.fillStyle = "#ff9cc8"; c.fillRect(-s * .6, s * .05, s * 1.2, s * .14);
  c.fillStyle = "#4a220c";
  c.beginPath(); c.ellipse(0, -s * .55, s * .56, s * .14, 0, 0, 6.283); c.fill();
  c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = s * .08;
  for (let k = 0; k < 2; k++) {
    const sx = -s * .2 + k * s * .4, ph = t * 2 + k;
    c.beginPath(); c.moveTo(sx, -s * .75);
    c.bezierCurveTo(sx + Math.sin(ph) * s * .25, -s * 1.05, sx - Math.sin(ph) * s * .25, -s * 1.25, sx, -s * 1.5); c.stroke();
  }
  c.restore();

  for (let i = 0; i < 3; i++) {
    const b = -t * .35 + i * 2.1, bx = x + Math.cos(b) * r * 1.45, by = y + Math.sin(b) * r * .42, bs = r * .14;
    c.save(); c.translate(bx, by); c.rotate(b * 1.3);
    c.fillStyle = "#4a220c"; c.fillRect(-bs, -bs * .8, bs * 2, bs * 1.6);
    c.fillStyle = "#6b3418"; c.fillRect(-bs, -bs * .8, bs * 2, bs * .5);
    c.restore();
  }
}
const PLANET_DECO = { barbie: decoBarbie, discord: decoDiscord, brownie: decoBrownie };

function renderNebula(w, h) {
  const s = .5, cvs = document.createElement("canvas");
  cvs.width = Math.ceil(w * s); cvs.height = Math.ceil(h * s);
  const c = cvs.getContext("2d"); c.scale(s, s);
  const bg = c.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#070616"); bg.addColorStop(.5, "#0b0a24"); bg.addColorStop(1, "#120a26");
  c.fillStyle = bg; c.fillRect(0, 0, w, h);
  const blobs = [
    [.2, .25, .55, "rgba(120,60,190,.28)"], [.75, .2, .45, "rgba(40,90,190,.25)"],
    [.6, .7, .6, "rgba(200,70,140,.22)"], [.15, .8, .4, "rgba(40,140,170,.18)"],
    [.45, .45, .35, "rgba(255,160,120,.08)"], [.9, .55, .3, "rgba(150,70,200,.2)"]
  ];
  const m = Math.max(w, h);
  for (const [x, y, r, col] of blobs) {
    const g = c.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * m);
    g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  c.save(); c.translate(w / 2, h / 2); c.rotate(-.55);
  const band = c.createLinearGradient(0, -m * .18, 0, m * .18);
  band.addColorStop(0, "rgba(0,0,0,0)"); band.addColorStop(.5, "rgba(210,190,255,.09)"); band.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = band; c.fillRect(-m, -m * .18, m * 2, m * .36);
  for (let i = 0; i < 1400; i++) {
    const x = rand(-m, m), y = (Math.random() + Math.random() + Math.random() - 1.5) * m * .12;
    c.globalAlpha = rand(.15, .6); c.fillStyle = pick(["#fff", "#e8dcff", "#ffe6f0"]);
    c.fillRect(x, y, rand(.6, 1.4), rand(.6, 1.4));
  }
  c.restore();
  const gx = w * .16, gy = h * .2, gr = Math.min(w, h) * .09;
  c.save(); c.translate(gx, gy); c.scale(1, .45); c.rotate(.4);
  const core = c.createRadialGradient(0, 0, 0, 0, 0, gr * .5);
  core.addColorStop(0, "rgba(255,240,220,.7)"); core.addColorStop(1, "rgba(255,240,220,0)");
  c.fillStyle = core; c.beginPath(); c.arc(0, 0, gr * .5, 0, 6.283); c.fill();
  for (let i = 0; i < 500; i++) {
    const arm = i % 2, k = Math.random(), a = k * 5.2 + arm * Math.PI + rand(-.35, .35), rr = k * gr;
    c.globalAlpha = (1 - k) * .7; c.fillStyle = pick(["#fff", "#cfe0ff", "#ffd9ea"]);
    c.fillRect(Math.cos(a) * rr, Math.sin(a) * rr, 1.2, 1.2);
  }
  c.restore(); c.globalAlpha = 1;
  return cvs;
}

function glowSprite(col, size = 64) {
  const cvs = document.createElement("canvas"); cvs.width = cvs.height = size;
  const c = cvs.getContext("2d"), g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, col); g.addColorStop(.35, col.replace(/[\d.]+\)$/, ".35)")); g.addColorStop(1, col.replace(/[\d.]+\)$/, "0)"));
  c.fillStyle = g; c.fillRect(0, 0, size, size);
  return cvs;
}

S.universo = {
  music: "universo", tone: "dark",
  stars: [], stars2: [], neb: null, planets: [], comets: [], dust: [],
  camX: 0, camY: 0, warp: 0, dolly: 0, tapped: new Set(), phase: "idle",
  init() {
    this.stars = makeStarfield(Math.round(W * H / 2600));
    this.stars2 = makeStarfield(Math.round(W * H / 9000)).map(s => ({ ...s, r: s.r * 1.6 }));
    this.neb = renderNebula(W, H);
    this.glow = glowSprite("rgba(255,236,250,.9)");
    this.dust = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random(), r: rand(14, 46), z: rand(1.5, 3), a: rand(.04, .12) }));
    const base = Math.min(W, H), port = H > W * 1.1;
    const P = port
      ? { barbie: [.31, .43, .13], discord: [.72, .3, .1], brownie: [.7, .62, .115], tiny: [.16, .68, .035] }
      : { barbie: [.26, .5, .13], discord: [.55, .32, .08], brownie: [.78, .6, .1], tiny: [.88, .26, .03] };
    const keep = {}; for (const p of this.planets) keep[p.id] = p;
    this.planets = [
      { id: "barbie", ...this.place(P.barbie, base), img: buildPlanet(P.barbie[2] * base, {
          light: "#ffd6ea", mid: "#f27bb5", dark: "#8a2668", atmo: "rgba(255,170,215,.55)", speed: 9,
          bands: [{ y: -.6, h: .2, color: "#ffb3d6", alpha: .55, w: 3 }, { y: -.15, h: .14, color: "#d94f9a", alpha: .5, w: 5 }, { y: .2, h: .1, color: "#fff0f7", alpha: .35, w: 4 }, { y: .45, h: .22, color: "#ffc4e1", alpha: .4, w: 2 }],
          spots: [{ x: .3, y: -.05, rx: .18, ry: .08, color: "#fff", alpha: .25 }],
          ring: { colors: ["#ffe1f0", "#f7a8cf", "#ffffff", "#e889bd"], alpha: .75 } }) },
      { id: "discord", ...this.place(P.discord, base), img: buildPlanet(P.discord[2] * base, {
          light: "#c9cdff", mid: "#5865f2", dark: "#1b1f6b", atmo: "rgba(150,160,255,.55)", speed: 14,
          bands: [{ y: -.45, h: .2, color: "#8b95ff", alpha: .45, w: 5 }, { y: .1, h: .16, color: "#3a44c6", alpha: .5, w: 4 }, { y: .5, h: .12, color: "#a9b0ff", alpha: .35, w: 6 }],
          spots: [{ x: .6, y: -.1, rx: .22, ry: .12, color: "#e0e3ff", alpha: .35 }, { x: .15, y: .3, rx: .12, ry: .07, color: "#2c3399", alpha: .5 }] }) },
      { id: "brownie", ...this.place(P.brownie, base), img: buildPlanet(P.brownie[2] * base, {
          light: "#f3d2a8", mid: "#9a5a32", dark: "#3b1d0e", atmo: "rgba(255,210,160,.45)", speed: 7,
          bands: [{ y: -.75, h: .25, color: "#fff1dc", alpha: .6, w: 6, ph: 2 }, { y: -.3, h: .12, color: "#6b3418", alpha: .5, w: 3 }, { y: .1, h: .18, color: "#c98a55", alpha: .45, w: 5 }, { y: .55, h: .12, color: "#5a2a12", alpha: .5, w: 4 }],
          spots: [{ x: .4, y: .1, rx: .16, ry: .08, color: "#fff1dc", alpha: .35 }, { x: .8, y: -.4, rx: .1, ry: .06, color: "#3b1d0e", alpha: .5 }] }) },
      { id: "tiny", ...this.place(P.tiny, base), img: buildPlanet(P.tiny[2] * base, { light: "#c8fff1", mid: "#3fb8a5", dark: "#0d3d47", atmo: "rgba(140,255,230,.4)", speed: 12, bands: [{ y: -.2, h: .3, color: "#9ff5e1", alpha: .4, w: 3 }] }) }
    ];
    for (const p of this.planets) { p.bounce = keep[p.id]?.bounce || 0; p.ph = rand(0, 6.28); }
  },
  place([fx, fy, fr], base) { return { fx, fy, r: fr * base }; },
  pos(p, t) {
    const par = p.r / Math.min(W, H) * 2.2, z = 1 + this.dolly * .25 * (p.r / Math.min(W, H) * 6);
    const x = p.fx * W + this.camX * par * 40, y = p.fy * H + this.camY * par * 40 + Math.sin(t * .6 + p.ph) * p.r * .06;
    return { x: W / 2 + (x - W / 2) * z, y: H / 2 + (y - H / 2) * z, z };
  },
  async enter() {
    this.tapped = new Set(); this.warp = 0; this.phase = "story";
    this.dolly = 1;
    animate(7000, p => this.dolly = 1 - p, easeInOut);
    await wait(900);
    await narrate(T_UNIVERSO.intro, { pace: 1 });
    this.phase = "explore";
    say(T_UNIVERSO.convite);
    hint(T_UNIVERSO.contador(0));
    const t0 = performance.now();
    while (this.tapped.size < 3 && performance.now() - t0 < 30000) await wait(300);
    await wait(this.tapped.size >= 3 ? 3500 : 0);
    unsay(); hint(""); hideInfo();

    this.phase = "guide";
    this.guide = { x: W * 1.2, y: H * .25, s: 1 };
    sfx.sparkle();
    const x0 = W * 1.2, y0 = H * .22;
    await animate(3400, p => {
      const lx = lerp(x0, W / 2, p), ly = lerp(y0, H * .5, p), k = (1 - p);
      this.guide.x = lx + Math.sin(p * Math.PI * 2.2) * W * .22 * k;
      this.guide.y = ly - (1 - Math.cos(p * Math.PI * 2.2)) * H * .08 * k;
    }, easeInOut);
    sfx.chime(8); sfx.whoosh(2.2);
    this.phase = "warp";
    await animate(2200, p => { this.warp = p; this.guide.s = 1 + easeIn(p) * 5; }, easeIn);
    await go("estrelas", { color: "#ffffff", out: 300, inn: 1300 });
    this.warp = 0; this.guide = null;
  },
  exit() { this.phase = "idle"; },
  update(dt, t) {
    const tx = pX >= 0 ? (pX / W - .5) : Math.sin(t * .1) * .3;
    const ty = pY >= 0 ? (pY / H - .5) : Math.cos(t * .13) * .3;
    this.camX += (tx - this.camX) * dt * .8; this.camY += (ty - this.camY) * dt * .8;
    for (const p of this.planets) p.bounce = Math.max(0, p.bounce - dt * .9);
    if (!reduce && Math.random() < dt * .12) {
      const fromLeft = Math.random() < .5;
      this.comets.push({ x: fromLeft ? -50 : W + 50, y: rand(H * .1, H * .5), vx: (fromLeft ? 1 : -1) * rand(180, 260), vy: rand(40, 90), life: 1 });
    }
    for (const c of this.comets) { c.x += c.vx * dt; c.y += c.vy * dt; c.life -= dt * .18; }
    this.comets = this.comets.filter(c => c.life > 0 && c.x > -80 && c.x < W + 80);
    for (const d of this.dust) { d.y -= dt * .006 * d.z; if (d.y < -.1) d.y = 1.1; }
  },
  draw(c, t) {
    const w = this.warp, dz = 1 + this.dolly * .12;
    c.save();
    c.translate(W / 2, H / 2); c.scale(dz, dz); c.translate(-W / 2, -H / 2);
    c.drawImage(this.neb, -this.camX * 8, -this.camY * 8, W + 16, H + 16);
    c.restore();
    if (w > 0) {
      c.strokeStyle = "#eef0ff"; c.lineCap = "round";
      for (const s of this.stars) {
        const x = s.x * W, y = s.y * H, k = 1 + easeIn(w) * 2.2;
        c.globalAlpha = .6 + .4 * w; c.lineWidth = s.r * (1 + w);
        c.beginPath(); c.moveTo(W / 2 + (x - W / 2) * (1 + w * .3), H / 2 + (y - H / 2) * (1 + w * .3));
        c.lineTo(W / 2 + (x - W / 2) * k, H / 2 + (y - H / 2) * k); c.stroke();
      }
      c.globalAlpha = 1;
    } else {
      drawStarfield(c, this.stars, t, { ox: -this.camX * 14, oy: -this.camY * 14, scale: dz });
      drawStarfield(c, this.stars2, t * 1.3, { ox: -this.camX * 30, oy: -this.camY * 30, scale: dz * 1.05 });
      if (this.dolly < .05) hoverStars(c, this.stars, t, -this.camX * 14, -this.camY * 14);
    }
    for (const k of this.comets) {
      const ang = Math.atan2(k.vy, k.vx), len = 120;
      const g = c.createLinearGradient(k.x - Math.cos(ang) * len, k.y - Math.sin(ang) * len, k.x, k.y);
      g.addColorStop(0, "rgba(160,200,255,0)"); g.addColorStop(1, `rgba(230,240,255,${clamp(k.life)})`);
      c.strokeStyle = g; c.lineWidth = 2.2; c.lineCap = "round";
      c.beginPath(); c.moveTo(k.x - Math.cos(ang) * len, k.y - Math.sin(ang) * len); c.lineTo(k.x, k.y); c.stroke();
      c.globalAlpha = clamp(k.life);
      c.drawImage(this.glow, k.x - 10, k.y - 10, 20, 20);
      c.globalAlpha = 1;
    }

    const order = [...this.planets].sort((a, b) => a.r - b.r);
    for (const p of order) {
      const q = this.pos(p, t);
      const b = p.bounce > 0 ? 1 + Math.sin(p.bounce * 14) * .1 * p.bounce : 1;
      let sc = b * q.z, px = q.x, py = q.y, a = 1;
      if (w > 0) { const k = easeIn(w); sc *= 1 + k * 3; px = W / 2 + (px - W / 2) * (1 + k * 2.5); py = H / 2 + (py - H / 2) * (1 + k * 2.5); a = 1 - k; }
      c.globalAlpha = a;
      if (p.id === "discord") {
        const ang = t * .55, mx = px + Math.cos(ang) * p.r * 1.9 * sc, my = py + Math.sin(ang) * p.r * .55 * sc;
        const mr = p.r * .2 * sc * (1 + Math.sin(ang) * .15);
        const drawMoon = () => {
          const mg = c.createRadialGradient(mx - mr * .4, my - mr * .4, mr * .1, mx, my, mr);
          mg.addColorStop(0, "#f2f3ff"); mg.addColorStop(1, "#6d7099");
          c.fillStyle = mg; c.beginPath(); c.arc(mx, my, mr, 0, 6.283); c.fill();
        };
        if (Math.sin(ang) < 0) { drawMoon(); drawPlanet(c, p.img, px, py, sc, t); }
        else { drawPlanet(c, p.img, px, py, sc, t); drawMoon(); }
      } else drawPlanet(c, p.img, px, py, sc, t);
      if (PLANET_DECO[p.id]) PLANET_DECO[p.id](c, px, py, p.r * sc, t);
      if (this.phase === "explore" && !this.tapped.has(p.id) && p.id !== "tiny") {
        const pulse = .5 + .5 * Math.sin(t * 3 + p.ph);
        c.strokeStyle = `rgba(255,240,220,${.25 + pulse * .35})`; c.lineWidth = 1.5;
        c.setLineDash([3, 6]);
        c.beginPath(); c.arc(px, py, p.r * sc * (1.35 + pulse * .08), 0, 6.283); c.stroke();
        c.setLineDash([]);
      }
      c.globalAlpha = 1;
    }

    if (w === 0) {
      for (const d of this.dust) {
        const x = d.x * W - this.camX * 60 * d.z, y = d.y * H - this.camY * 60 * d.z, r = d.r * dz;
        c.globalAlpha = d.a; c.drawImage(this.glow, x - r, y - r, r * 2, r * 2);
      }
      c.globalAlpha = 1;
    }

    if (this.guide) {
      const g = this.guide, s = (isSmall() ? 14 : 18) * g.s, pulse = 1 + Math.sin(t * 6) * .08;
      c.drawImage(this.glow, g.x - s * 4, g.y - s * 4, s * 8, s * 8);
      c.fillStyle = "#fffbe8"; c.shadowColor = "#ffe08a"; c.shadowBlur = 24;
      drawStarShape(c, g.x, g.y, s * pulse, t * 1.5, 5, .45); c.fill();
      c.shadowBlur = 0;
      if (Math.random() < .8) parts.push({ x: g.x + rand(-4, 4), y: g.y + rand(-4, 4), vx: rand(-20, 20), vy: rand(-10, 30), life: 1, decay: 1.3, r: rand(1, 2.4), c: pick(["#fff3cf", "#ffd97a", "#ffd1ea"]), g: 10, glow: 0, shape: Math.random() < .3 ? "star" : "dot", rot: 0, vr: 2, drag: .98 });
    }
    if (w > 0) { c.fillStyle = `rgba(255,255,255,${easeIn(w) * .5})`; c.fillRect(0, 0, W, H); }
  },
  down(x, y) {
    if (this.phase !== "explore" && this.phase !== "story") return;
    for (const p of this.planets) {
      if (p.id === "tiny") continue;
      const q = this.pos(p, TIME);
      if (dist(x, y, q.x, q.y) < Math.max(p.r * q.z * 1.2, 34)) {
        p.bounce = 1;
        sfx.chime(["barbie", "discord", "brownie"].indexOf(p.id) * 2 + 1);
        sparkle(q.x, q.y, 30, { colors: p.id === "barbie" ? ["#ffd1e8", "#ff9ccc", "#fff"] : p.id === "discord" ? ["#c9cdff", "#8b95ff", "#fff"] : ["#ffe2bd", "#d39a63", "#fff"], speed: 180, gravity: 0, glow: 6, shape: "star", size: 2.4 });
        const d = T_UNIVERSO.planetas[p.id];
        info({ title: d.title, text: d.text, ms: 8000 });
        if (this.phase === "explore") { this.tapped.add(p.id); hint(T_UNIVERSO.contador(this.tapped.size)); }
        return;
      }
    }
    sparkle(x, y, 8, { speed: 60, gravity: 0, size: 1.6, life: .8 });
  }
};
