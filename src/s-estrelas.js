const T_ESTRELAS = {
  intro: [
    "Hoje eu queria te mostrar uma coisa.",
    "A gente nunca se viu pessoalmente, mas isso nunca fez diferença.",
    "Então eu fiz um céu inteiro pra você."
  ],
  instrucao: "Toque nas estrelas, uma de cada vez.",
  constelacao: [
    "Olha quantas estrelas. Hoje todas elas acenderam por sua causa.",
    "A gente nunca se viu pessoalmente, e mesmo assim você virou uma das pessoas mais presentes da minha vida.",
    "Se conhecer pela internet foi acaso. Continuar na vida uma da outra foi escolha.",
    "Eu não sei compor música, então montei um céu inteiro pra você.",
    "Obrigada pelas conversas até tarde, pelas risadas do nada e por estar sempre lá.",
    "Ter você por perto, mesmo de longe, faz diferença pra caralho.",
    "Juntei uma estrela na outra",
    "Só pra fazer isso aqui pra você."
  ],
  proxima: "toca na estrela que tá brilhando",
  fotoCima: "No meio de tanta gente, ainda bem que foi você.",
  fotoBaixo: "desde 2020",
  fotoVazia: "a foto de vocês aparece aqui",
  continuar: "continuar ✦",
  cadentesTitulo: "Agora pega as estrelas cadentes ✦",
  cadentes: [
    "você é uma das minhas partes favoritas da vida.",
    "se eu pudesse escolher de novo, ainda escolheria você pra ser minha melhor amiga.",
    "minhas melhores memórias são com você. Nunca vou esquecer a gente assistindo Barbie e fazendo nossos brownies de caneca.",
    "espero que você saiba que a vida ainda guarda as melhores coisas pra você. Nunca se esqueça do seu valor e de quanta coisa bonita você merece viver.",
    "mesmo de longe, você sempre foi e sempre vai ser minha irmã de coração."
  ],
  pegarProxima: "pegar a próxima ✦",
  contador: (n, total) => n + " / " + total
};

S.estrelas = {
  music: "estrelas", tone: "dark",
  stars: [], points: [], revealed: 0, lineProg: 0, closing: 0, glow: 0, constA: 0,
  phase: "idle", shooters: [], deco: [], earth: 0, fall: null, caught: 0,
  init() {
    this.stars = makeStarfield(Math.round(W * H / 2200));
    this.far = null;
    const n = T_ESTRELAS.constelacao.length, unit = Math.min(W * .021, H * .0155);
    const cx = W / 2, cy = H * .41;
    this.points = [];
    for (let i = 0; i < n; i++) {
      const t = Math.PI + i / n * Math.PI * 2 + 1e-4;
      const x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      this.points.push({ x: cx + x * unit, y: cy - y * unit });
    }
  },
  async enter() {
    Object.assign(this, { revealed: 0, lineProg: 0, closing: 0, glow: 0, constA: 0, shooters: [], earth: 0, fall: null, caught: 0, phase: "intro" });
    await wait(800);
    await narrate(T_ESTRELAS.intro, { center: true });
    await say(T_ESTRELAS.instrucao, { center: true });
    await wait(2600); unsay();
    this.phase = "const";
    await animate(1200, p => this.constA = p);
    hint(T_ESTRELAS.contador(0, this.points.length) + "  ·  " + T_ESTRELAS.proxima);
  },
  async tapStar(i) {
    const p = this.points[i];
    sfx.chime(i);
    sparkle(p.x, p.y, 28, { colors: ["#fff3cf", "#ffd97a", "#ffffff"], speed: 150, gravity: 30, glow: 8 });
    this.revealed++; this.lineProg = 0;
    hint(T_ESTRELAS.contador(this.revealed, this.points.length));
    info({ text: T_ESTRELAS.constelacao[i], msg: true, ms: 0 });
    if (this.revealed < this.points.length) return;
    this.phase = "closing";
    await wait(1500);
    await animate(1300, p => this.closing = p, easeInOut);
    [0, 2, 4, 5, 7].forEach((n, k) => setTimeout(() => sfx.chime(n), k * 170));
    this.glow = 1;
    for (const q of this.points) sparkle(q.x, q.y, 12, { speed: 90, gravity: 0, glow: 6 });
    await wait(3600);
    hideInfo(); hint("");
    this.showPhoto();
  },
  async showPhoto() {
    this.phase = "photo";
    const cx = W / 2, cy = H / 2;
    for (const q of this.points) for (let k = 0; k < 16; k++) {
      parts.push({ x: q.x, y: q.y, vx: (cx - q.x) * rand(.8, 1.2), vy: (cy - q.y) * rand(.8, 1.2), life: 1, decay: 1, r: rand(.8, 2.2), c: "#fff3cf", g: 0, glow: 0, shape: "dot", rot: 0, vr: 0, drag: .97 });
    }
    sfx.sparkle();
    await animate(1200, p => this.constA = 1 - p);
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;pointer-events:none;opacity:0;transform:scale(.85);transition:opacity 2s ease,transform 2.4s cubic-bezier(.2,.8,.2,1)";
    wrap.innerHTML = '<div class="heart-photo"><div class="m"><img alt="Ray e Lia"><div class="ph" hidden></div></div></div>' +
      '<div style="font-family:var(--font-hand);font-weight:700;font-size:32px;color:#ffd97a;text-shadow:0 2px 14px rgba(0,0,0,.6)"></div>';
    const img = wrap.querySelector("img"), ph = wrap.querySelector(".ph");
    ph.textContent = T_ESTRELAS.fotoVazia;
    wrap.lastChild.textContent = T_ESTRELAS.fotoBaixo;
    img.addEventListener("error", () => { img.hidden = true; ph.hidden = false; });
    img.src = FOTO;
    $("stage").appendChild(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => { wrap.style.opacity = "1"; wrap.style.transform = "none"; }));
    await wait(900);
    say(T_ESTRELAS.fotoCima);
    await wait(4500);
    await cta(T_ESTRELAS.continuar);
    unsay();
    wrap.style.opacity = "0";
    await wait(1200);
    wrap.remove();
    this.startShooting();
  },
  async startShooting() {
    this.phase = "shoot"; this.caught = 0;
    music("cadentes");
    await say(T_ESTRELAS.cadentesTitulo);
    hint(T_ESTRELAS.contador(0, T_ESTRELAS.cadentes.length));
    this.spawnAt = TIME + 1;
  },
  spawn() {
    const ang = rand(25, 48) * Math.PI / 180, sp = Math.hypot(W, H) / (reduce ? 8 : 5.5);
    let x = rand(-W * .1, W * .55), y = H * .12;
    if (x < 30) { x = -30; y = rand(H * .2, H * .45); }
    this.shooters.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp });
  },
  async catchStar(s) {
    this.shooters = this.shooters.filter(o => o !== s);
    sparkle(s.x, s.y, 46, { colors: ["#ffffff", "#fff3cf", "#cdb8ff", "#9fdcff"], speed: 220, gravity: 40, glow: 8, shape: "star", size: 2 });
    sfx.chime(this.caught + 3);
    const msg = T_ESTRELAS.cadentes[this.caught];
    this.caught++;
    hint(T_ESTRELAS.contador(this.caught, T_ESTRELAS.cadentes.length));
    this.phase = "reading";
    info({ text: msg, msg: true, ms: 0 });
    const last = this.caught >= T_ESTRELAS.cadentes.length;
    await cta(last ? T_ESTRELAS.continuar : T_ESTRELAS.pegarProxima);
    hideInfo();
    if (!last) { this.phase = "shoot"; this.spawnAt = TIME + .7; return; }
    this.fallToEarth();
  },
  async fallToEarth() {
    this.phase = "fall"; hint(""); unsay();
    await wait(300);
    const R = Math.min(W, H) * .42;
    S.terra.phase = "story";
    S.terra.g = { cx: W / 2, cy: H + R * 1.2, R, lon0: -10, lat0: 0 };
    const g = S.terra.g, cyEnd = H * .66;
    await animate(3200, p => { g.cy = lerp(H + R * 1.2, cyEnd, p); g.lon0 = lerp(-10, -48, p); g.lat0 = lerp(0, -12, p); this.earth = p; }, easeOut);
    const target = () => globePoint(-48, -12, g);
    this.fall = { x: -40, y: H * .08, p: 0 };
    sfx.whoosh(1.6);
    await animate(1700, p => {
      const tg = target();
      this.fall.p = p;
      this.fall.x = lerp(-40, tg.x, p); this.fall.y = lerp(H * .08, tg.y, p) - Math.sin(p * Math.PI) * H * .05;
    }, easeIn);
    const tg = target();
    sparkle(tg.x, tg.y, 80, { colors: ["#fff", "#fff3cf", "#ffd97a"], speed: 320, gravity: 0, glow: 10, shape: "star" });
    sfx.boom(); sfx.sparkle();
    this.fall = null;
    fadeColor = "#ffffff";
    await animate(220, p => fadeA = p * .9);
    setScene("terra");
    await animate(1200, p => fadeA = .9 * (1 - p));
    this.phase = "idle";
  },
  exit() {},
  update(dt, t) {
    const tx = pX >= 0 ? pX / W - .5 : Math.sin(t * .1) * .3, ty = pY >= 0 ? pY / H - .5 : Math.cos(t * .12) * .3;
    this.camX = (this.camX || 0) + (tx - (this.camX || 0)) * dt * .7;
    this.camY = (this.camY || 0) + (ty - (this.camY || 0)) * dt * .7;
    if (this.revealed > 0) this.lineProg = Math.min(1, this.lineProg + dt * 1.4);
    if (this.phase === "shoot" && !this.shooters.length && t > this.spawnAt) this.spawn();
    for (const s of this.shooters) { s.x += s.vx * dt; s.y += s.vy * dt; }
    if (this.phase === "shoot") {
      const before = this.shooters.length;
      this.shooters = this.shooters.filter(s => s.x < W + 90 && s.y < H + 90);
      if (this.shooters.length < before) this.spawnAt = t + .6;
    }
    if (!reduce && this.phase !== "shoot" && this.phase !== "reading" && Math.random() < dt * .2) {
      this.deco.push({ x: rand(0, W * .8), y: rand(0, H * .4), life: 1 });
    }
    for (const d of this.deco) d.life -= dt * 1.1;
    this.deco = this.deco.filter(d => d.life > 0);
  },
  drawTrail(c, x, y, vx, vy, len, width, alpha, rgb = "255,245,215") {
    const ang = Math.atan2(vy, vx), x0 = x - Math.cos(ang) * len, y0 = y - Math.sin(ang) * len;
    const g = c.createLinearGradient(x0, y0, x, y);
    g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},${alpha})`);
    c.strokeStyle = g; c.lineWidth = width; c.lineCap = "round";
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x, y); c.stroke();
  },
  draw(c, t) {
    const bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#060a1c"); bg.addColorStop(.55, "#111637"); bg.addColorStop(1, "#231c4a");
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const cx = this.camX || 0, cy = this.camY || 0;
    if (S.universo.neb) { c.globalAlpha = .35; c.drawImage(S.universo.neb, -cx * 8 - 8, -cy * 8 - 8, W + 16, H + 16); c.globalAlpha = 1; }
    drawStarfield(c, this.stars, t, { ox: -cx * 12, oy: -cy * 12 });
    hoverStars(c, this.stars, t, -cx * 12, -cy * 12);
    if (!this.far) this.far = makeStarfield(Math.round(W * H / 9000)).map(s => ({ ...s, r: s.r * 1.7 }));
    drawStarfield(c, this.far, t * 1.4, { ox: -cx * 30, oy: -cy * 30 });
    for (const d of this.deco) {
      const k = 1 - d.life;
      this.drawTrail(c, d.x + k * 260, d.y + k * 117, 260, 117, 80, 1.5, Math.min(1, d.life * 1.5));
    }

    if (this.constA > 0.01 && ["const", "closing", "photo"].includes(this.phase)) {
      c.globalAlpha = this.constA;
      const r = this.revealed, pts = this.points;
      if (r > 1 || this.closing > 0) {
        c.save();
        c.strokeStyle = "rgba(255,226,150,.9)"; c.lineCap = "round";
        c.lineWidth = 1.6 + this.glow * (1.2 + Math.sin(t * 3) * .6);
        c.shadowColor = "rgba(255,217,122,.95)"; c.shadowBlur = 8 + this.glow * 14;
        c.beginPath();
        for (let i = 0; i < r - 1; i++) {
          const a = pts[i], b = pts[i + 1], p = i === r - 2 ? this.lineProg : 1;
          c.moveTo(a.x, a.y); c.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p);
        }
        if (this.closing > 0) {
          const a = pts[pts.length - 1], b = pts[0];
          c.moveTo(a.x, a.y); c.lineTo(a.x + (b.x - a.x) * this.closing, a.y + (b.y - a.y) * this.closing);
        }
        c.stroke(); c.restore();
      }
      pts.forEach((p, i) => {
        const lit = i < r, next = i === r && this.phase === "const";
        const pulse = next ? (reduce ? .6 : .5 + .5 * Math.sin(t * 4)) : 0;
        const rad = lit ? 4.5 : next ? 3.5 + pulse * 3 : 2.4;
        c.fillStyle = lit || next ? "#fff6dc" : "rgba(255,246,220,.35)";
        c.shadowColor = "#ffd97a"; c.shadowBlur = lit ? 16 : next ? 10 + pulse * 18 : 0;
        drawStarShape(c, p.x, p.y, rad * 1.8, t * .3 + i, 4, .38); c.fill();
        c.shadowBlur = 0;
        if (next) {
          c.strokeStyle = `rgba(255,230,160,${.5 * (1 - pulse)})`; c.lineWidth = 1.5;
          c.beginPath(); c.arc(p.x, p.y, 10 + pulse * 14, 0, 6.283); c.stroke();
        }
      });
      c.globalAlpha = 1;
    }

    for (const s of this.shooters) {
      this.drawTrail(c, s.x, s.y, s.vx, s.vy, 170, 3.2, .95);
      c.fillStyle = "#fff"; c.shadowColor = "#ffe6a0"; c.shadowBlur = 18;
      drawStarShape(c, s.x, s.y, 9, t * 4, 5, .45); c.fill(); c.shadowBlur = 0;
    }

    if (this.earth > 0) drawGlobe(c, S.terra.g, t, {});
    if (this.fall) {
      const f = this.fall;
      this.drawTrail(c, f.x, f.y, 1, 1.1, 300, 7, 1, "255,200,70");
      this.drawTrail(c, f.x, f.y, 1, 1.1, 160, 2.5, 1, "255,250,225");
      c.fillStyle = "#fff"; c.shadowColor = "#ffd97a"; c.shadowBlur = 26;
      drawStarShape(c, f.x, f.y, 13, t * 5, 5, .45); c.fill(); c.shadowBlur = 0;
      if (Math.random() < .9) parts.push({ x: f.x, y: f.y, vx: rand(-30, 30), vy: rand(-10, 40), life: 1, decay: .9, r: rand(1.2, 2.6), c: pick(["#ffd23f", "#ffe9a0", "#ffb800"]), g: 20, glow: 0, shape: "dot", rot: 0, vr: 0, drag: .98 });
    }
  },
  down(x, y) {
    if (this.phase === "const") {
      const i = this.revealed, p = this.points[i];
      if (p && dist(x, y, p.x, p.y) < 36) this.tapStar(i);
      else sparkle(x, y, 6, { speed: 50, gravity: 0, size: 1.4, life: .7 });
    } else if (this.phase === "shoot") {
      for (const s of this.shooters) if (dist(x, y, s.x, s.y) < 48) { this.catchStar(s); return; }
      sparkle(x, y, 6, { speed: 50, gravity: 0, size: 1.4, life: .7 });
    }
  }
};
