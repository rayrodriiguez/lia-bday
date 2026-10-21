const MUSICAS = {
  universo: "musicas/universo.mp3", estrelas: "musicas/estrelas.mp3", cadentes: "musicas/cadentes.mp3",
  terra: "musicas/terra.mp3", mar: "musicas/mar.mp3", jardim: "musicas/jardim.mp3", grama: "musicas/grama.mp3",
  piquenique: "",
  final: "musicas/final.mp3"
};
const FOTO = "foto.jpg";

const $ = id => document.getElementById(id);
const cv = $("cv"), ctx = cv.getContext("2d");
let W = 0, H = 0, DPR = 1, TIME = 0;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[(Math.random() * arr.length) | 0];
const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const wait = ms => new Promise(r => setTimeout(r, ms));
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const isSmall = () => Math.min(W, H) < 520;

function animate(ms, fn, ease = t => t) {
  return new Promise(res => {
    const t0 = performance.now();
    function step(n) {
      const p = clamp((n - t0) / ms);
      fn(ease(p));
      if (p < 1) requestAnimationFrame(step); else res();
    }
    requestAnimationFrame(step);
  });
}

const S = {};
let cur = null, curName = "";
let fadeA = 0, fadeColor = "#05060f";

function setScene(name) {
  if (cur && cur.exit) cur.exit();
  clearUI();
  curName = name; cur = S[name];
  document.body.dataset.tone = cur.tone || "dark";
  music(cur.music || name);
  if (cur.enter) cur.enter();
}
async function go(name, { color = "#05060f", out = 1000, inn = 1100 } = {}) {
  fadeColor = color;
  await animate(out, p => fadeA = p);
  setScene(name);
  await animate(inn, p => fadeA = 1 - p);
}

const capEl = $("caption"), hintEl = $("hint"), infoEl = $("info"), ctaEl = $("cta");
let infoTimer = null, ctaResolve = null, storyToken = 0;

function clearUI() {
  capEl.classList.add("out"); capEl.classList.remove("center");
  hintEl.textContent = "";
  hideInfo();
  ctaEl.hidden = true; ctaEl.classList.remove("on"); ctaResolve = null;
  $("stage").innerHTML = "";
  bubbles = [];
}

let bubbles = [];
function speak(text, anchor, { ms = 0 } = {}) {
  const el = document.createElement("div");
  el.className = "bubble"; el.textContent = text;
  $("stage").appendChild(el);
  const b = { el, anchor };
  bubbles.push(b);
  placeBubble(b);
  requestAnimationFrame(() => el.classList.add("on"));
  let closed = false;
  const close = () => {
    if (closed) return; closed = true;
    el.classList.remove("on");
    setTimeout(() => { bubbles = bubbles.filter(x => x !== b); el.remove(); }, 350);
  };
  if (ms) setTimeout(close, ms);
  sfx.pop();
  return { close };
}

async function speakLines(lines, anchor, { pace = 1 } = {}) {
  for (const line of lines) {
    const h = speak(line, anchor);
    await wait((1500 + line.length * 50) * pace);
    h.close();
    await wait(320);
  }
}
function placeBubble(b) {
  const p = typeof b.anchor === "function" ? b.anchor() : b.anchor;
  if (!p) return;
  const w = b.el.offsetWidth, h = b.el.offsetHeight;
  const x = clamp(p.x - w / 2, 12, Math.max(12, W - w - 12));
  let y = p.y - h - 14, below = false;
  if (y < 12) { y = p.y + 24; below = true; }
  b.el.classList.toggle("below", below);
  b.el.style.transform = `translate(${x}px, ${y}px)`;
  b.el.style.setProperty("--tail", clamp(p.x - x, 18, w - 18) + "px");
}
async function say(text, { center = false } = {}) {
  capEl.classList.add("out");
  await wait(reduce ? 50 : 500);
  capEl.textContent = text;
  capEl.classList.toggle("center", center);
  capEl.classList.remove("out");
}
function unsay() { capEl.classList.add("out"); }

async function narrate(lines, { center = false, keepLast = false, pace = 1 } = {}) {
  for (let i = 0; i < lines.length; i++) {
    await say(lines[i], { center });
    await wait((1500 + lines[i].length * 48) * pace);
    if (i < lines.length - 1 || !keepLast) { unsay(); await wait(650); }
  }
}
function hint(text) { hintEl.textContent = text || ""; }

function info({ title = "", latin = "", text = "", msg = false, ms = 7000 } = {}) {
  clearTimeout(infoTimer);
  infoEl.className = msg ? "msg" : "";
  infoEl.innerHTML = "";
  if (title || latin) {
    const t = document.createElement("div"); t.className = "t";
    t.textContent = title;
    if (latin) { const l = document.createElement("span"); l.className = "l"; l.textContent = latin; t.appendChild(l); }
    infoEl.appendChild(t);
  }
  if (text) { const x = document.createElement("p"); x.className = "x"; x.textContent = text; infoEl.appendChild(x); }
  infoEl.hidden = false;
  requestAnimationFrame(() => infoEl.classList.add("on"));
  if (ms) infoTimer = setTimeout(hideInfo, ms);
}
function hideInfo() {
  clearTimeout(infoTimer);
  infoEl.classList.remove("on");
  setTimeout(() => { if (!infoEl.classList.contains("on")) infoEl.hidden = true; }, 450);
}
infoEl.addEventListener("click", hideInfo);

function cta(label) {
  return new Promise(res => {
    ctaEl.textContent = label; ctaEl.hidden = false;
    requestAnimationFrame(() => ctaEl.classList.add("on"));
    ctaResolve = res;
  });
}
ctaEl.addEventListener("click", () => {
  const r = ctaResolve; ctaResolve = null;
  ctaEl.classList.remove("on"); setTimeout(() => { if (!ctaResolve) ctaEl.hidden = true; }, 300);
  sfx.pop();
  if (r) r();
});

let parts = [];

function sparkle(x, y, n = 20, o = {}) {
  const colors = o.colors || [o.color || "#fff3cf"];
  for (let i = 0; i < n; i++) {
    const a = o.dir != null ? o.dir + rand(-(o.spread || Math.PI), o.spread || Math.PI) : rand(0, Math.PI * 2);
    const v = rand(.3, 1) * (o.speed || 160);
    parts.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1,
      decay: 1 / ((o.life || 1.2) * rand(.7, 1.3)), r: (o.size || 2.2) * rand(.5, 1.2),
      c: pick(colors), g: o.gravity ?? 60, glow: o.glow ?? 0, shape: o.shape || "dot",
      rot: rand(0, 6.28), vr: rand(-3, 3), drag: o.drag ?? .985
    });
  }
}
function drawStarShape(c, x, y, r, rot = 0, points = 5, inner = .45) {
  c.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 ? r * inner : r, a = rot + i * Math.PI / points - Math.PI / 2;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath();
}
function drawHeartShape(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y + s * .35);
  c.bezierCurveTo(x - s * 1.1, y - s * .35, x - s * .45, y - s * 1.05, x, y - s * .45);
  c.bezierCurveTo(x + s * .45, y - s * 1.05, x + s * 1.1, y - s * .35, x, y + s * .35);
  c.closePath();
}
function updateParts(dt) {
  for (const p of parts) {
    p.vx *= p.drag; p.vy = p.vy * p.drag + p.g * dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    p.life -= p.decay * dt;
  }
  parts = parts.filter(p => p.life > 0);
}
function drawParts(c) {
  for (const p of parts) {
    c.globalAlpha = clamp(p.life);
    c.fillStyle = p.c;
    if (p.glow) { c.shadowColor = p.c; c.shadowBlur = p.glow; }
    if (p.shape === "star") { drawStarShape(c, p.x, p.y, p.r * 2, p.rot); c.fill(); }
    else if (p.shape === "heart") { drawHeartShape(c, p.x, p.y, p.r * 1.6); c.fill(); }
    else { c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill(); }
    c.shadowBlur = 0;
  }
  c.globalAlpha = 1;
}

function makeStarfield(n) {
  return Array.from({ length: n }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + .25,
    p: Math.random() * 6.28, s: .5 + Math.random() * 1.6, z: Math.random(),
    c: pick(["#ffffff", "#fff4dc", "#dfe8ff", "#ffe9f1"])
  }));
}
function drawStarfield(c, stars, t, { ox = 0, oy = 0, alpha = 1, scale = 1 } = {}) {
  for (const s of stars) {
    const tw = reduce ? .8 : .55 + .45 * Math.sin(t * s.s + s.p);
    let x = (s.x * W + ox * (s.z + .2)) % W; if (x < 0) x += W;
    let y = (s.y * H + oy * (s.z + .2)) % H; if (y < 0) y += H;
    if (scale !== 1) { x = W / 2 + (x - W / 2) * scale; y = H / 2 + (y - H / 2) * scale; }
    c.globalAlpha = tw * alpha;
    c.fillStyle = s.c;
    c.beginPath(); c.arc(x, y, s.r * (scale > 1 ? Math.min(scale, 3) : 1), 0, 6.283); c.fill();
  }
  c.globalAlpha = 1;
}

function hoverStars(c, stars, t, ox = 0, oy = 0, radius = 90) {
  if (pX < 0) return;
  for (const s of stars) {
    const x = ((s.x * W + ox * (s.z + .2)) % W + W) % W, y = ((s.y * H + oy * (s.z + .2)) % H + H) % H;
    const d = Math.hypot(x - pX, y - pY);
    if (d > radius) continue;
    const k = 1 - d / radius;
    c.globalAlpha = k * (.7 + .3 * Math.sin(t * 9 + s.p));
    c.fillStyle = "#fff6dc";
    drawStarShape(c, x, y, (s.r + 1.2) * (1 + k * 2.6), t * 1.5 + s.p, 4, .32); c.fill();
  }
  c.globalAlpha = 1;
}

let pDown = false, pX = -1, pY = -1;
cv.addEventListener("pointerdown", e => { pDown = true; pX = e.clientX; pY = e.clientY; audioResume(); if (cur && cur.down) cur.down(pX, pY); });
cv.addEventListener("pointermove", e => { pX = e.clientX; pY = e.clientY; if (cur && cur.move) cur.move(pX, pY, pDown); });
addEventListener("pointerup", e => { if (pDown && cur && cur.up) cur.up(e.clientX, e.clientY); pDown = false; });
addEventListener("pointercancel", () => { pDown = false; });

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);

  W = Math.max(innerWidth || document.documentElement.clientWidth || 0, 200);
  H = Math.max(innerHeight || document.documentElement.clientHeight || 0, 300);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  for (const k in S) if (S[k].init) { try { S[k].init(); } catch (e) { console.warn("init", k, e); } }
}
addEventListener("resize", resize);
let lastT = performance.now() / 1000;
function frame(n) {
  const t = n / 1000, dt = Math.min(.05, Math.max(0, t - lastT)); lastT = t; TIME = t;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  if (cur) {
    if (cur.update) cur.update(dt, t);
    ctx.save(); cur.draw(ctx, t); ctx.restore();
  }
  updateParts(dt);
  drawParts(ctx);
  for (const b of bubbles) placeBubble(b);
  if (fadeA > 0) { ctx.globalAlpha = fadeA; ctx.fillStyle = fadeColor; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  requestAnimationFrame(frame);
}

const AU = { c: null, master: null, music: null, sfx: null, rev: null, track: null, trackName: "", muted: false };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function audioInit() {
  if (AU.c) return;

  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  const c = AU.c = new C();
  AU.master = c.createGain(); AU.master.gain.value = .9;
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
  AU.master.connect(comp).connect(c.destination);
  AU.rev = c.createConvolver();
  const len = c.sampleRate * 3.2, buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  AU.rev.buffer = buf;
  const revOut = c.createGain(); revOut.gain.value = .55;
  AU.rev.connect(revOut).connect(AU.master);
  AU.music = c.createGain(); AU.music.gain.value = .8; AU.music.connect(AU.master);
  const ms = c.createGain(); ms.gain.value = .45; AU.music.connect(ms).connect(AU.rev);
  AU.sfx = c.createGain(); AU.sfx.gain.value = .9; AU.sfx.connect(AU.master);
  const ss = c.createGain(); ss.gain.value = .35; AU.sfx.connect(ss).connect(AU.rev);
  AU.noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const nd = AU.noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
}

function unlockMusicFiles() {
  AU.pool = [new Audio(), new Audio()];
  const first = [MUSICAS.universo, MUSICAS.estrelas];
  AU.pool.forEach((el, i) => {
    el.preload = i ? "metadata" : "auto"; el.muted = true;
    el.src = first[i] || first[0] || "";
    const p = el.play();
    if (p) p.then(() => { if (AU.track && AU.track.el === el) return; el.pause(); }).catch(() => {});
  });
}
function freeDeck() {
  if (!AU.pool) return null;
  return AU.pool.find(el => !(AU.track && AU.track.el === el) && el !== AU.fadingEl) || AU.pool.find(el => !(AU.track && AU.track.el === el));
}
function audioResume() { if (AU.c && AU.c.state !== "running") AU.c.resume().catch(() => {}); }

function renderTrackToUrl(name, seconds) {
  const real = AU.c, sr = real.sampleRate;
  const Off = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!Off || !TRACKS[name]) return Promise.resolve(null);
  if (!LOOPS[name]) return Promise.resolve(null);
  const off = new Off(2, Math.ceil(sr * seconds), sr);
  const out = off.createGain(); out.gain.value = .9; out.connect(off.destination);
  const rev = off.createConvolver(); rev.buffer = AU.rev.buffer;
  const send = off.createGain(); send.gain.value = .3; out.connect(send).connect(rev).connect(off.destination);

  AU.c = off;
  try { LOOPS[name](out, .05); } finally { AU.c = real; }
  return off.startRendering().then(buf => URL.createObjectURL(wavBlob(buf))).catch(() => null);
}
function wavBlob(buf) {
  const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate;
  const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); data.setUint32(4, 36 + len * ch * 2, true); str(8, "WAVE"); str(12, "fmt ");
  data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, ch, true);
  data.setUint32(24, sr, true); data.setUint32(28, sr * ch * 2, true); data.setUint16(32, ch * 2, true); data.setUint16(34, 16, true);
  str(36, "data"); data.setUint32(40, len * ch * 2, true);
  const chans = []; for (let c = 0; c < ch; c++) chans.push(buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, chans[c][i])); data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return new Blob([data], { type: "audio/wav" });
}

function env(g, t, peak, a, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, .0002), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}
function osc(out, type, f, t, peak, a, d, { detune = 0, filter = 0, glide = 0 } = {}) {
  const c = AU.c, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = detune;
  if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + a + d * .6);
  env(g, t, peak, a, d);
  if (filter) { const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = filter; o.connect(lp).connect(g); }
  else o.connect(g);
  g.connect(out); o.start(t); o.stop(t + a + d + .05);
}
const I = {
  pluck: (out, m, t, v = .12, d = .9) => { osc(out, "triangle", mtof(m), t, v, .005, d, { filter: 2600 }); osc(out, "sine", mtof(m + 12), t, v * .25, .005, d * .5); },
  box: (out, m, t, v = .1) => { osc(out, "sine", mtof(m), t, v, .004, 1.4); osc(out, "sine", mtof(m) * 4.02, t, v * .18, .002, .35); },
  bell: (out, m, t, v = .07) => { osc(out, "sine", mtof(m), t, v, .01, 3.2); osc(out, "sine", mtof(m) * 2.76, t, v * .3, .005, 1.4); osc(out, "sine", mtof(m) * 5.4, t, v * .12, .003, .6); },
  pizz: (out, m, t, v = .12) => { osc(out, "triangle", mtof(m), t, v, .003, .22, { filter: 3000 }); },
  bass: (out, m, t, dur, v = .12) => { osc(out, "sine", mtof(m), t, v, .03, dur); },
  pad: (out, notes, t, dur, v = .035, cutoff = 1100) => {
    const c = AU.c;
    for (const m of notes) for (const dt of [-7, 7]) {
      const o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
      o.type = "sawtooth"; o.frequency.value = mtof(m); o.detune.value = dt;
      lp.type = "lowpass"; lp.frequency.value = cutoff; lp.Q.value = .3;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(v / notes.length * 2.2, t + Math.min(2.2, dur * .35));
      g.gain.setValueAtTime(v / notes.length * 2.2, t + dur * .7);
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.5);
      o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + dur + 1.6);
    }
  },
  noise: (out, t, dur, v, { type = "lowpass", f = 1000, f2 = 0, q = .7 } = {}) => {
    const c = AU.c, s = c.createBufferSource(), g = c.createGain(), fl = c.createBiquadFilter();
    s.buffer = AU.noise; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur * .25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl).connect(g).connect(out); s.start(t); s.stop(t + dur + .05);
  },
  chirp: (out, t, v = .035) => {
    const n = 2 + (Math.random() * 4 | 0), base = rand(2600, 4200);
    for (let i = 0; i < n; i++) osc(out, "sine", base * rand(.85, 1.15), t + i * rand(.07, .12), v, .005, .06, { glide: base * rand(1.2, 1.6) });
  },
  bubble: (out, t, v = .05) => { const f = rand(280, 600); osc(out, "sine", f, t, v, .005, .09, { glide: f * 3 }); }
};

const KS = {};
function ksBuffer(m) {
  if (KS[m]) return KS[m];
  const c = AU.c, sr = c.sampleRate, N = Math.max(2, Math.round(sr / mtof(m))), len = Math.floor(sr * 2.8);
  const buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0);
  for (let i = 0; i < N; i++) d[i] = Math.random() * 2 - 1;

  for (let pass = 0; pass < 3; pass++) for (let i = 1; i < N; i++) d[i] = (d[i] + d[i - 1]) * .5;
  const decay = m < 48 ? .9975 : m < 60 ? .9965 : .995;
  for (let i = N; i < len; i++) d[i] = decay * .5 * (d[i - N] + (i - N - 1 >= 0 ? d[i - N - 1] : 0));
  let peak = 0; for (let i = 0; i < N * 4 && i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
  if (peak > 0) for (let i = 0; i < len; i++) d[i] /= peak;
  return KS[m] = buf;
}
I.guitar = (out, m, t, v = .16, dur = 2.4) => {
  const c = AU.c, s = c.createBufferSource(), g = c.createGain(), lp = c.createBiquadFilter();
  s.buffer = ksBuffer(m);
  lp.type = "lowpass"; lp.frequency.value = 2600; lp.Q.value = .4;
  g.gain.setValueAtTime(v, t);
  g.gain.setTargetAtTime(0.0001, t + dur, .25);
  s.connect(lp).connect(g).connect(out); s.start(t); s.stop(t + dur + 1.2);
};

function sequencer(bpm, perBeat, onStep) {
  const c = AU.c, stepDur = 60 / bpm / perBeat;
  let next = c.currentTime + .15, i = 0, alive = true;
  const iv = setInterval(() => {
    if (!alive) return;
    while (next < c.currentTime + .4) { onStep(i, next, stepDur); next += stepDur; i++; }
  }, 90);
  return () => { alive = false; clearInterval(iv); };
}

const TRACKS = {
  universo(out) {
    const chords = [[50, 57, 64, 66, 69], [47, 54, 61, 64, 69], [43, 50, 57, 62, 66], [45, 52, 57, 61, 64]];
    const bells = [74, 76, 78, 81, 83, 86, 88];
    return sequencer(60, 1, (i, t) => {
      if (i % 8 === 0) { const ch = chords[(i / 8) % 4]; I.pad(out, ch, t, 8.5, .05, 900); I.bass(out, ch[0] - 12, t, 7, .07); }
      if (Math.random() < .42) I.bell(out, pick(bells), t + rand(0, .4), .045);
    });
  },
  estrelas(out) {
    const prog = [[59, 63, 66], [56, 59, 63], [52, 56, 59], [54, 58, 61]];
    const pat = [0, 1, 2, 3, 2, 1, 3, 4];
    return sequencer(84, 2, (i, t) => {
      const bar = Math.floor(i / 16) % 4, ch = prog[bar], step = i % 8;
      const tones = [ch[0], ch[1], ch[2], ch[0] + 12, ch[1] + 12];
      I.box(out, tones[pat[step]] + 12, t, .075);
      if (i % 16 === 0) { I.pad(out, ch, t, 11, .03, 800); I.bass(out, ch[0] - 24, t, 5, .08); }
      if (i % 16 === 8) I.bass(out, ch[0] - 24, t, 4, .05);
    });
  },
  terra(out) {
    const prog = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 58]];
    const mel = [72, 69, 67, 69, 65, 67, 64, 65];
    return sequencer(72, 2, (i, t) => {
      const bar = Math.floor(i / 8) % 4, ch = prog[bar];
      if (i % 8 === 0) { I.pad(out, ch, t, 6.6, .03, 1000); I.bass(out, ch[0] - 12, t, 5, .09); }
      if (i % 2 === 0) I.pluck(out, ch[(i / 2) % 4] + 12, t, .07, 1.2);
      if (i % 16 === 4 || i % 16 === 12) I.bell(out, mel[(i / 4 | 0) % mel.length], t, .03);
    });
  },
  mar(out) {
    const c = AU.c, waves = c.createGain(); waves.gain.value = 1; waves.connect(out);
    const prog = [[57, 60, 64, 67, 71], [55, 59, 62, 66, 69], [53, 57, 60, 64, 67], [52, 55, 59, 62, 66]];
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400; lp.connect(out);
    const stop = sequencer(60, 2, (i, t) => {
      if (i % 12 === 0) I.noise(waves, t, 6.5, .06, { f: 380 });
      if (i % 16 === 0) { const ch = prog[(i / 16) % 4]; I.pad(lp, ch, t, 8.5, .04, 700); I.bass(lp, ch[0] - 12, t, 7, .07); }
      if (i % 3 === 0 && Math.random() < .5) I.bell(lp, pick([69, 72, 74, 76, 79, 81]), t, .04);
      if (Math.random() < .12) { const t0 = t + rand(0, .3); for (let k = 0; k < 3 + rand(0, 4); k++) I.bubble(out, t0 + k * rand(.05, .12), .025); }
    });
    return stop;
  },
  jardim(out) {
    const prog = [[55, 59, 62], [50, 54, 57], [52, 55, 59], [48, 52, 55]];
    const pat = [0, 2, 1, 2, 3, 2, 1, 2];
    return sequencer(92, 2, (i, t) => {
      const bar = Math.floor(i / 8) % 4, ch = prog[bar];
      const tones = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24];
      I.pluck(out, tones[pat[i % 8]], t, .07, .7);
      if (i % 8 === 0) { I.bass(out, ch[0] - 12, t, 2.4, .1); I.pad(out, ch, t, 5, .022, 1400); }
      if (i % 32 === 16) for (let k = 0; k < 4; k++) I.bell(out, [79, 83, 86, 91][k], t + k * .33, .025);
      if (Math.random() < .07) I.chirp(out, t + rand(0, .3));
    });
  },
  grama(out) {
    const scale = [60, 62, 64, 67, 69, 72, 74, 76];
    const prog = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]];
    let m = 4;
    const rhythm = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0];
    return sequencer(108, 2, (i, t) => {
      const bar = Math.floor(i / 8) % 4, ch = prog[bar];
      if (rhythm[i % 16]) { m = clamp(m + pick([-2, -1, 1, 1, 2]), 0, scale.length - 1); I.pizz(out, scale[m], t, .1); }
      if (i % 4 === 0) I.pizz(out, ch[0] - 12, t, .12);
      if (i % 4 === 2) { I.pizz(out, ch[1], t, .05); I.pizz(out, ch[2], t, .05); }
      if (Math.random() < .03) I.chirp(out, t, .02);
    });
  },
  piquenique(out) {

    const mel = [[60, .75], [60, .25], [62, 1], [60, 1], [65, 1], [64, 2], [null, 1],
      [60, .75], [60, .25], [62, 1], [60, 1], [67, 1], [65, 2], [null, 1],
      [60, .75], [60, .25], [72, 1], [69, 1], [65, 1], [64, 1], [62, 2], [null, 1],
      [70, .75], [70, .25], [69, 1], [65, 1], [67, 1], [65, 2], [null, 3]];

    const Fmaj9 = [41, [57, 60, 64, 67]], C9 = [36, [52, 58, 62]], Gm7 = [43, [53, 58, 62]], F69 = [41, [57, 62, 67]],
      F7 = [41, [57, 60, 63]], Bbmaj7 = [46, [57, 62, 65]], Bbm6 = [46, [55, 61, 65]], FC = [48, [57, 60, 64]], C13 = [36, [52, 57, 58]];
    const harm = [[0, F69], [1, Fmaj9], [4, C9], [7, Gm7], [8, C9], [11, F69], [14, F7], [16, Bbmaj7], [18, Bbm6],
      [20, FC], [22, Gm7], [23, C13], [25, Fmaj9], [28, F69]];
    const beat = 60 / 72, total = mel.reduce((s, [, d]) => s + d, 0);
    const events = [];
    let tt = 0;
    for (const [n, d] of mel) { if (n) events.push([tt, "m", n]); tt += d; }

    harm.forEach(([b, ch], i) => {
      const end = i + 1 < harm.length ? harm[i + 1][0] : total;
      events.push([b, "b", ch[0]]);
      for (let x = b + 1; x < end; x++) events.push([x - .02, "c", ch[1]]);
      if (end - b === 1) events.push([b + .5, "c", ch[1]]);
    });
    return { events, beat, total };
  }
};

const PICNIC = TRACKS.piquenique();

const LOOPS = {
  piquenique(out, start) {
    const { events, beat, total } = PICNIC;
    for (const e of events) {
      const et = start + Math.max(0, e[0]) * beat + rand(-.012, .012);
      if (e[1] === "m") I.guitar(out, e[2], et, .2, 1.8);
      else if (e[1] === "b") I.guitar(out, e[2], et, .2, 2.2);
      else e[2].forEach((n, k) => I.guitar(out, n, et + k * .022, .065, 1.2));
    }
    return total * beat;
  }
};
TRACKS.piquenique = out => {
  let alive = true, next = AU.c.currentTime + .3, timer;
  const tick = () => {
    if (!alive) return;
    const len = LOOPS.piquenique(out, next);
    next += len;
    timer = setTimeout(tick, Math.max(200, (next - AU.c.currentTime - 1.5) * 1000));
  };
  tick();
  return () => { alive = false; clearTimeout(timer); };
};
TRACKS.final = out => {
  const prog = [[59, 63, 66], [54, 58, 61], [56, 59, 63], [52, 56, 59]];
  return sequencer(76, 2, (i, t) => {
    const bar = Math.floor(i / 8) % 4, ch = prog[bar];
    const tones = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24];
    I.box(out, tones[[0, 1, 2, 3, 2, 1, 2, 3][i % 8]], t, .07);
    if (i % 8 === 0) { I.pad(out, [ch[0] - 12, ...ch], t, 6.6, .045, 1300); I.bass(out, ch[0] - 24, t, 5, .1); }
    if (i % 8 === 4 && Math.random() < .6) I.bell(out, ch[2] + 24, t, .03);
  });
};

TRACKS.cadentes = out => {
  const prog = [[61, 65, 68], [58, 61, 65], [54, 58, 61], [56, 60, 63]];
  return sequencer(92, 2, (i, t) => {
    const ch = prog[Math.floor(i / 8) % 4], tones = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24];
    I.bell(out, tones[[0, 2, 1, 3, 2, 1, 2, 3][i % 8]], t, .035);
    if (i % 8 === 0) { I.pad(out, ch, t, 5.6, .03, 900); I.bass(out, ch[0] - 24, t, 4, .08); }
  });
};

let musicEl = null;
function music(name) {
  if (!AU.c || AU.trackName === name) return;
  AU.trackName = name;

  let delay = 0;
  if (AU.track) {
    const old = AU.track, now = AU.c.currentTime; AU.track = null;
    delay = 1500;
    sfx.vinyl();
    const m = $("mute"); m.classList.remove("swap"); void m.offsetWidth; m.classList.add("swap");
    setTimeout(() => m.classList.remove("swap"), 1700);
    if (old.gain) {
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setValueAtTime(old.gain.gain.value, now);
      old.gain.gain.linearRampToValueAtTime(0, now + 1.5);
      old.lp.frequency.cancelScheduledValues(now);
      old.lp.frequency.setValueAtTime(old.lp.frequency.value, now);
      old.lp.frequency.exponentialRampToValueAtTime(260, now + 1.4);
      setTimeout(() => old.stop(), 1900);
    }
    if (old.el) {
      const el = old.el; AU.fadingEl = el;
      el.preservesPitch = false; el.mozPreservesPitch = false; el.webkitPreservesPitch = false;
      const v0 = el.volume, t0 = performance.now();
      const iv = setInterval(() => {
        const k = clamp((performance.now() - t0) / 1400);
        try { el.playbackRate = Math.max(.35, 1 - k * .65); } catch (e) {}
        el.volume = Math.max(0, v0 * (1 - k));
        if (k >= 1) { el.pause(); el.playbackRate = 1; clearInterval(iv); if (AU.fadingEl === el) AU.fadingEl = null; }
      }, 50);
    }
  }
  if (!TRACKS[name] && !MUSICAS[name]) return;
  const startSynth = () => {
    if (AU.trackName !== name || !TRACKS[name]) return;
    const g = AU.c.createGain(), lp = AU.c.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 16000;
    g.gain.value = 0; g.connect(lp).connect(AU.music);
    g.gain.linearRampToValueAtTime(1, AU.c.currentTime + 2.2);
    AU.track = { gain: g, lp, stop: TRACKS[name](g) };
  };
  const file = MUSICAS[name];
  if (delay) { setTimeout(() => { if (AU.trackName === name) startTrack(); }, delay); return; }
  startTrack();
  function startTrack() {
  if (!file) return startSynth();
  const el = freeDeck() || new Audio();
  const abs = new URL(file, location.href).href;
  if (el.src !== abs) el.src = file;
  el.loop = true; el.volume = 0; el.muted = AU.muted; el.playbackRate = 1;
  try { el.currentTime = 0; } catch (e) {}
  let fell = false;
  const fallback = () => { if (fell) return; fell = true; if (AU.track && AU.track.el === el) AU.track = null; startSynth(); };
  el.addEventListener("error", fallback);
  AU.track = { el, stop: () => el.pause() };
  const p = el.play();
  if (p) p.then(() => { let v = 0; const iv = setInterval(() => { v = Math.min(.9, v + .04); el.volume = v; if (v >= .9 || AU.track?.el !== el) clearInterval(iv); }, 100); }).catch(fallback);
  }
}

const BELL = [71, 73, 75, 78, 80, 83, 85, 87, 90, 92];
const sfx = {
  chime: (i = 0, v = .09) => { if (!AU.c) return; I.bell(AU.sfx, BELL[i % BELL.length], AU.c.currentTime, v); },
  pop: () => { if (!AU.c) return; osc(AU.sfx, "sine", 520, AU.c.currentTime, .08, .004, .1, { glide: 900 }); },
  sparkle: () => { if (!AU.c) return; const t = AU.c.currentTime; [88, 92, 95, 100].forEach((m, k) => I.bell(AU.sfx, m, t + k * .06, .025)); },
  whoosh: (d = 1.2) => { if (!AU.c) return; I.noise(AU.sfx, AU.c.currentTime, d, .12, { type: "bandpass", f: 300, f2: 3000, q: 1.2 }); },
  splash: () => { if (!AU.c) return; const t = AU.c.currentTime; I.noise(AU.sfx, t, 1.4, .2, { f: 2400, f2: 300 }); for (let k = 0; k < 8; k++) I.bubble(AU.sfx, t + .2 + k * .07, .04); },
  bubble: () => { if (!AU.c) return; I.bubble(AU.sfx, AU.c.currentTime, .06); },
  blow: () => { if (!AU.c) return; I.noise(AU.sfx, AU.c.currentTime, .5, .12, { type: "highpass", f: 1500 }); },
  boom: () => { if (!AU.c) return; const t = AU.c.currentTime; I.noise(AU.sfx, t, 1.6, .14, { f: 900, f2: 120 }); osc(AU.sfx, "sine", 90, t, .14, .005, .6, { glide: 40 }); },
  boing: () => { if (!AU.c) return; osc(AU.sfx, "triangle", 300, AU.c.currentTime, .08, .005, .3, { glide: 600 }); },
  step: () => { if (!AU.c) return; osc(AU.sfx, "triangle", rand(700, 900), AU.c.currentTime, .025, .002, .05); },

  vinyl: () => {
    if (!AU.c) return;
    const t = AU.c.currentTime;
    I.noise(AU.sfx, t, .45, .09, { type: "bandpass", f: 2600, f2: 500, q: 2.5 });
    I.noise(AU.sfx, t + 1.1, 1.2, .025, { type: "highpass", f: 3500 });
    for (let k = 0; k < 16; k++) osc(AU.sfx, "square", rand(1500, 4000), t + rand(0, 2.4), .02, .001, .008);
  },
  fanfare: () => { if (!AU.c) return; const t = AU.c.currentTime; [71, 75, 78, 83].forEach((m, k) => { I.bell(AU.sfx, m, t + k * .12, .07); I.pluck(AU.sfx, m - 12, t + k * .12, .06); }); }
};

$("mute").addEventListener("click", () => {
  AU.muted = !AU.muted;
  if (AU.master) AU.master.gain.value = AU.muted ? 0 : .9;
  if (AU.track && AU.track.el) AU.track.el.muted = AU.muted;
  $("mute").classList.toggle("muted", AU.muted);
  $("mute").setAttribute("aria-label", AU.muted ? "Ligar som" : "Silenciar som");
});
