const T_FINAL = {
  linha1: "Feliz aniversário,",
  linha2: "Lia!",
  titulo: "Feliz aniversário, Lia",
  fimLinha: "da próxima vez que a gente olhar pro mesmo céu, não vai ser só por uma tela.",
  carta: [
    "feliz aniversário, maninha!! queria muito poder estar aí hoje pra te dar um abraço, comemorar contigo e te lembrar pessoalmente o quanto você é importante pra mim. espero que esse novo ciclo seja cheio de coisas boas, que você realize tudo aquilo que deseja e que nunca te faltem motivos pra sorrir. você merece muita coisa boa nessa vida, de verdade.",
    "é muito doido pensar que a gente se conheceu por uma tela e que, mesmo com tantos quilômetros entre nós, você se tornou alguém tão importante pra mim. mas sabe o que me deixa mais feliz? saber que falta pouco pra gente finalmente se encontrar e que tudo aquilo que a gente passou seis anos planejando, imaginando e falando sobre finalmente vai acontecer. depois de tanto tempo sonhando com esse momento, finalmente vamos poder viver tudo isso de verdade, sem uma tela no meio, e eu nem consigo explicar o quanto estou feliz por isso. quero muito poder te abraçar, rir contigo de todas as nossas besteiras e criar memórias que a gente vai guardar pra sempre.",
    "obrigada por esses seis anos, por todas as conversas, pelas risadas, pelas memórias e por continuar aqui mesmo com toda a distância. nossa amizade é uma das coisas mais especiais que a internet me trouxe, e eu sou muito feliz por ter encontrado você. que venham muitos outros aniversários, mais planos malucos e, principalmente, muitos momentos juntas. amo você demais, maninha. feliz vida!!"
  ],
  assinatura: "com carinho, Ray",
  semFoto: "a foto de vocês aparece aqui",
  fotoAlt: "Ray e Lia",
  denovo: "ver tudo de novo ✦"
};

const FW_PALETTES = [
  ["#ff8fb8", "#ffc2d8", "#fff0f5"],
  ["#f4a9c4", "#ffd97a", "#ffffff"],
  ["#ffd54a", "#fff1a8", "#ffffff"],
  ["#ffc93c", "#e8a317", "#fff6d8"],
  ["#d4a017", "#ffd97a", "#fff3cf"],
  ["#ff6fa5", "#ffc93c", "#ffe1ea"]
];

S.final = {
  music: "final", tone: "dark",
  run: 0, phase: "idle", ft: 0, seq: [], seg: -1, tText: 0,
  txt: [], rockets: [], comets: [], fw: [], stars: null, dim: 0, skip: false,
  par: { x: 0, y: 0 }, parT: { x: 0, y: 0 },

  init() {
    this.stars = makeStarfield(Math.round(W * H / 2600));
    const mk = () => { const b = document.createElement("canvas"); b.width = Math.max(1, Math.round(W * DPR)); b.height = Math.max(1, Math.round(H * DPR)); return b; };
    this.bufA = mk(); this.bufB = mk();
    if (!this.sprites) {
      this.sprites = ["#ffffff", "#ffe6a0", "#ffd0e2"].map(col => {
        const s = document.createElement("canvas"); s.width = s.height = 32;
        const g = s.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
        gr.addColorStop(0, "#ffffff"); gr.addColorStop(.18, col); gr.addColorStop(.45, col + "66"); gr.addColorStop(1, col + "00");
        g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
        return s;
      });
    }

    const v = document.createElement("canvas"); v.width = 160; v.height = Math.max(1, Math.round(160 * H / Math.max(1, W)));
    const vg = v.getContext("2d"), r = Math.hypot(v.width, v.height) / 2;
    const g = vg.createRadialGradient(v.width / 2, v.height / 2, r * .45, v.width / 2, v.height / 2, r);
    g.addColorStop(0, "rgba(3,3,12,0)"); g.addColorStop(1, "rgba(3,3,12,.85)");
    vg.fillStyle = g; vg.fillRect(0, 0, v.width, v.height);
    this.vig = v;
    if (this.phase === "text" && this.txt.length) this.retarget();
  },

  enter() {
    const run = ++this.run;
    this.phase = "montage"; this.ft = 0; this.seg = -1; this.skip = false;
    this.txt = []; this.rockets = []; this.comets = []; this.dim = 0;

    this.seq = ["piquenique", "grama", "jardim", "mar", "terra"].filter(n => S[n] && S[n].draw).concat("__ceu");
    this.endStar = null;
    if (S.terra && S.terra.pose) { try { S.terra.pose("pins"); } catch (e) {} }

    this.D = this.seq.length > 1 ? 7.5 / (this.seq.length - 1) : 1.9;
    this.fw = []; this.par = { x: 0, y: 0 }; this.parT = { x: 0, y: 0 }; this.endDim = false; this.drops = [];
    this.fontsOk = false;
    const fl = document.fonts ? Promise.all([
      document.fonts.load('italic 600 60px "Cormorant Garamond"'),
      document.fonts.load('700 120px Caveat')
    ]).catch(() => {}) : Promise.resolve();
    Promise.race([fl, wait(2500)]).then(() => { if (run === this.run) this.fontsOk = true; });
  },

  exit() { this.run++; this.phase = "idle"; this.txt = []; this.rockets = []; this.comets = []; this.fw = []; this.drops = []; },

  renderInto(buf, name, t) {
    const b = buf.getContext("2d");
    b.setTransform(DPR, 0, 0, DPR, 0, 0);
    b.globalAlpha = 1; b.globalCompositeOperation = "source-over"; b.shadowBlur = 0;
    b.fillStyle = "#05060f"; b.fillRect(0, 0, W, H);
    b.save();
    try { if (name === "__ceu") this.drawSky(b, t); else S[name].draw(b, t); } catch (e) {}
    b.restore();
  },
  blit(c, buf, scale, alpha, rot = 0) {
    c.save();
    c.globalAlpha = clamp(alpha);
    c.translate(W / 2, H / 2); c.rotate(rot); c.scale(scale, scale); c.translate(-W / 2, -H / 2);
    c.drawImage(buf, 0, 0, W, H);
    c.restore();
  },
  drawMontage(c, t) {
    const n = this.seq.length;
    if (!n) return this.drawSpace(c, t);
    const k = Math.min(this.ft / this.D, n - 1), i = Math.floor(k), e = easeInOut(k - i);
    if (i !== this.seg) {
      this.seg = i;
      if (i < n - 1) sfx.whoosh(1.1);
      if (this.seq[i + 1] === "terra" && S.terra && S.terra.pose) { try { S.terra.pose("pins"); } catch (er) {} }

      if (i < n - 1) { this.renderInto(this.bufA, this.seq[i], t); this.renderInto(this.bufB, this.seq[i + 1], t); }
    }
    if (i >= n - 1) { this.renderInto(this.bufA, this.seq[n - 1], t); this.blit(c, this.bufA, 1, 1); return; }

    this.blit(c, this.bufB, lerp(1.9, 1, easeOut(k - i)), 1);

    const sc = lerp(1, .2, e), rot = lerp(0, -.1, e), a = 1 - e * e;
    const speed = Math.sin((k - i) * Math.PI);
    if (!reduce && speed > .05) {
      this.blit(c, this.bufA, sc * (1 + .06 * speed), a * .22 * speed, rot + .012 * speed);
      this.blit(c, this.bufA, sc * (1 + .03 * speed), a * .3 * speed, rot + .006 * speed);
    }
    this.blit(c, this.bufA, sc, a, rot);
    c.save();
    c.globalAlpha = (1 - e) * .45 * speed;
    c.strokeStyle = "#fff3cf"; c.lineWidth = 1.5;
    c.translate(W / 2, H / 2); c.rotate(rot);
    c.strokeRect(-W * sc / 2, -H * sc / 2, W * sc, H * sc);
    c.restore();
    this.drawVignette(c, .55 + .25 * speed);
  },
  drawVignette(c, a) {
    if (!this.vig) return;
    c.globalAlpha = clamp(a);
    c.drawImage(this.vig, 0, 0, W, H);
    c.globalAlpha = 1;
  },
  move(x, y) {
    this.parT.x = clamp(x / W - .5, -.5, .5);
    this.parT.y = clamp(y / H - .5, -.5, .5);
  },
  down(x, y) { this.move(x, y); },

  textTargets() {
    const oc = document.createElement("canvas"); oc.width = Math.max(1, Math.round(W)); oc.height = Math.max(1, Math.round(H));
    const o = oc.getContext("2d");
    o.textAlign = "center"; o.textBaseline = "alphabetic"; o.fillStyle = "#fff";

    const font = s => `700 ${s}px Caveat, "Segoe Print", cursive`;
    const narrow = W < 600;
    const top = narrow ? T_FINAL.linha1.trim().split(/\s+/) : [T_FINAL.linha1];
    let fs1 = 100;
    o.font = font(fs1);
    const widest = Math.max(...top.map(s => o.measureText(s).width));
    fs1 = Math.min(fs1 * W * .86 / widest, H * (narrow ? .12 : .14));
    let fs2 = fs1 * (narrow ? 1.6 : 1.9);
    o.font = font(fs2);
    const w2 = o.measureText(T_FINAL.linha2).width;
    if (w2 > W * .8) fs2 *= W * .8 / w2;
    const lh1 = fs1 * .92, total = lh1 * top.length + fs2 * .85;
    let y = H * .44 - total / 2 + fs1 * .78;
    o.font = font(fs1);
    for (const s of top) { o.fillText(s, W / 2, y); y += lh1; }
    const y1 = y - lh1;
    y += fs2 * .85 - lh1 + fs2 * .05;
    o.font = font(fs2); o.fillText(T_FINAL.linha2, W / 2, y);
    const data = o.getImageData(0, 0, oc.width, oc.height).data;
    const split = y1 + fs1 * .3;
    let step = 2, pts = [];
    for (; step < 14; step++) {
      pts = [];
      for (let y = 0; y < oc.height; y += step) for (let x = 0; x < oc.width; x += step) {
        if (data[(y * oc.width + x) * 4 + 3] > 140) pts.push([x + rand(-.3, .3), y + rand(-.3, .3), y > split]);
      }
      if (pts.length <= (isSmall() ? 3200 : 4800)) break;
    }
    this.step = step;

    const halo = document.createElement("canvas"); halo.width = oc.width; halo.height = oc.height;
    const hc = halo.getContext("2d");
    hc.shadowColor = "rgba(255,215,150,.9)"; hc.shadowBlur = Math.max(10, fs1 * .25);
    hc.globalAlpha = .55; hc.drawImage(oc, 0, 0);
    this.halo = halo;
    return pts;
  },
  buildText() {
    const pts = this.textTargets();
    this.txt = pts.map(([x, y, big]) => {
      const fromEdge = Math.random() < .5;
      return {
        sx: fromEdge ? pick([-40, W + 40]) : rand(0, W), sy: fromEdge ? rand(0, H) : pick([-40, H + 40]),
        x: 0, y: 0, tx: x, ty: y, big,
        delay: rand(0, .9) + x / W * .5, dur: rand(1.4, 2.1), curve: rand(-80, 80),
        ph: rand(0, 6.28), sp: rand(1.5, 4), spr: big ? 1 : (Math.random() < .7 ? 0 : 1),
        vx: 0, vy: 0, a: 1,

        z: Math.random() < .12 ? rand(1.25, 1.6) : rand(.6, 1.15)
      };
    });
    this.txt.sort((a, b) => a.z - b.z);
    for (const p of this.txt) { p.x = p.sx; p.y = p.sy; }
  },
  retarget() {
    const pts = this.textTargets();
    for (let i = 0; i < this.txt.length; i++) {
      const p = this.txt[i], q = pts[i % pts.length];
      p.sx = p.x; p.sy = p.y; p.tx = q[0]; p.ty = q[1]; p.delay = 0; p.dur = .8; p.t0 = this.ft;
    }
  },

  launch(soft = false) {
    let x;
    if (isSmall() && this.phase === "text") x = Math.random() < .5 ? rand(.08, .3) * W : rand(.7, .92) * W;
    else x = rand(.1, .9) * W;

    const z = Math.random() < .35 ? rand(.45, .7) : rand(.85, 1.35);
    this.rockets.push({ x, y: H + 10, vx: rand(-20, 20), vy: -rand(H * .7, H * .95) * (.75 + z * .25), ty: lerp(.42, .1, clamp((z - .45) / .9)) * H + rand(-.05, .05) * H, pal: pick(FW_PALETTES), soft, trail: [], z });
  },
  burst(r) {
    const z = r.z || 1, n = Math.round((r.soft ? 55 : 85) * (.6 + z * .5));
    const spd = (r.soft ? 210 : 270) * z;
    for (let i = 0; i < n; i++) {
      const a = i / n * 6.283 + rand(-.05, .05), v = spd * rand(.75, 1);
      this.fw.push({ x: r.x, y: r.y, px: r.x, py: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: rand(.5, .7), col: pick(r.pal), z, w: (1.3 + z) * .9, glit: false });
    }

    const g = Math.round((r.soft ? 18 : 30) * z);
    for (let i = 0; i < g; i++) {
      const a = rand(0, 6.283), v = spd * rand(.1, .55);
      this.fw.push({ x: r.x, y: r.y, px: r.x, py: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: rand(.28, .4), col: "#fff6d8", z, w: 1, glit: true, ph: rand(0, 6.28), delay: rand(.25, .6) });
    }
    if (z > .8) sparkle(r.x, r.y, r.soft ? 5 : 9, { colors: r.pal, speed: 110 * z, gravity: 40, life: 1.4, size: 2.2 * z, shape: Math.random() < .5 ? "star" : "heart", drag: .97 });
    if ((!r.soft || Math.random() < .5) && z > .6) sfx.boom();
  },

  update(dt, t) {
    if (this.phase === "idle") return;
    this.ft += dt;
    const montageEnd = this.D * Math.max(0, this.seq.length - 1) + .7;
    if (this.phase === "montage" && this.ft >= montageEnd && this.fontsOk) {
      this.phase = "text"; this.tText = this.ft; this.nextFw = this.ft + 1.6;
      this.buildText(); sfx.sparkle();
    }
    if (this.phase === "text" || this.phase === "dissolve" || this.phase === "letter") {
      this.dim = Math.min(this.endDim ? .8 : this.phase === "letter" ? .55 : .3, this.dim + dt * .4);
    }

    const tt = this.ft - this.tText;
    for (const p of this.txt) {
      if (this.phase === "dissolve" || this.phase === "letter") {
        p.vy -= 30 * dt; p.vx += Math.sin(t * 2 + p.ph) * 8 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.a -= dt * .45;
        continue;
      }
      const start = p.t0 != null ? p.t0 : this.tText;
      const k = clamp((this.ft - start - p.delay) / p.dur), e = easeInOut(k);
      const dx = p.tx - p.sx, dy = p.ty - p.sy, len = Math.hypot(dx, dy) || 1;
      const off = Math.sin(k * Math.PI) * p.curve;
      p.x = p.sx + dx * e - dy / len * off;
      p.y = p.sy + dy * e + dx / len * off;
    }
    if (this.txt.length && this.phase !== "text") this.txt = this.txt.filter(p => p.a > 0);
    if (this.phase === "text" && tt > 10) {
      this.phase = "dissolve"; this.tDis = this.ft;
      for (const p of this.txt) { p.vx = rand(-15, 15); p.vy = rand(-50, -15); }
      sfx.sparkle();
    }
    if (this.phase === "dissolve" && this.ft - this.tDis > .9) { this.phase = "letter"; this.showLetter(); }

    if ((this.phase === "text" || this.phase === "dissolve" || this.phase === "letter") && this.ft >= this.nextFw) {
      const soft = this.phase === "letter";
      this.launch(soft);
      if (!soft && Math.random() < .4) this.launch(false);
      this.nextFw = this.ft + (soft ? rand(2.4, 3.8) : rand(.7, 1.3)) * (reduce ? 2.5 : 1);
    }
    for (const r of this.rockets) {
      r.trail.push([r.x, r.y]); if (r.trail.length > 10) r.trail.shift();
      r.x += r.vx * dt; r.y += r.vy * dt; r.vy += 260 * dt;
      if (r.y <= r.ty || r.vy >= -40) { r.done = true; this.burst(r); }
    }
    this.rockets = this.rockets.filter(r => !r.done);
    for (const s of this.fw) {
      if (s.delay > 0) { s.delay -= dt; continue; }
      s.px = s.x; s.py = s.y;
      const drag = s.glit ? .96 : .955;
      s.vx *= Math.pow(drag, dt * 60); s.vy = s.vy * Math.pow(drag, dt * 60) + (s.glit ? 45 : 80) * s.z * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= s.decay * dt;
    }
    this.fw = this.fw.filter(s => s.life > 0);
    this.par.x += (this.parT.x - this.par.x) * Math.min(1, dt * 2.5);
    this.par.y += (this.parT.y - this.par.y) * Math.min(1, dt * 2.5);

    if (this.phase !== "montage" && !reduce && Math.random() < dt * .35) {
      const fromLeft = Math.random() < .5;
      this.comets.push({ x: fromLeft ? rand(-50, W * .4) : rand(W * .6, W + 50), y: rand(-20, H * .3), vx: (fromLeft ? 1 : -1) * rand(320, 480), vy: rand(120, 200), life: 1 });
    }
    for (const cm of this.comets) { cm.x += cm.vx * dt; cm.y += cm.vy * dt; cm.life -= dt * .7; }
    this.comets = this.comets.filter(cm => cm.life > 0);

    this.drops = this.drops || [];
    if (this.phase !== "montage" && this.drops.length < 40 && Math.random() < dt * 6) {
      const z = rand(.5, 1.3);
      this.drops.push({ x: rand(0, W), y: -12, z, vy: rand(14, 30) * z, sw: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-1, 1), col: pick(["#ffd54a", "#ffc93c", "#f4a9c4", "#fff1a8", "#ff8fb8"]) });
    }
    for (const d of this.drops) { d.y += d.vy * dt; d.sw += dt; d.rot += d.vr * dt; }
    this.drops = this.drops.filter(d => d.y < H + 20);
  },

  drawSky(c, t) {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#04050f"); g.addColorStop(.6, "#0d0c2a"); g.addColorStop(1, "#1d1440");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (S.universo && S.universo.neb) { c.globalAlpha = .55; c.drawImage(S.universo.neb, 0, 0, W, H); c.globalAlpha = 1; }
    drawStarfield(c, this.stars, t);
    hoverStars(c, this.stars, t);
  },
  drawSpace(c, t) {
    this.drawSky(c, t);
    if (this.dim > 0) { c.fillStyle = `rgba(5,6,15,${this.dim})`; c.fillRect(0, 0, W, H); }
  },

  draw(c, t) {
    if (this.phase === "montage" && this.ft < this.D * Math.max(0, this.seq.length - 1) + .05) this.drawMontage(c, t);
    else this.drawSpace(c, t);

    c.lineCap = "round";
    for (const cm of this.comets) {
      const ang = Math.atan2(cm.vy, cm.vx), x0 = cm.x - Math.cos(ang) * 130, y0 = cm.y - Math.sin(ang) * 130;
      const g = c.createLinearGradient(x0, y0, cm.x, cm.y);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, `rgba(255,246,220,${clamp(cm.life * 1.4)})`);
      c.strokeStyle = g; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(cm.x, cm.y); c.stroke();
    }
    if (this.drops) for (const d of this.drops) {
      c.globalAlpha = .45 + .4 * d.z;
      c.fillStyle = d.col;
      drawStarShape(c, d.x + Math.sin(d.sw * 1.2) * 10 * d.z, d.y, 3.4 * d.z, d.rot); c.fill();
    }
    c.globalAlpha = 1;

    c.save();
    c.globalCompositeOperation = "lighter";
    for (const r of this.rockets) {
      const z = r.z || 1;
      c.strokeStyle = r.pal[0]; c.lineWidth = 1.2 + z;
      c.beginPath(); r.trail.forEach(([x, y], i) => { c.globalAlpha = i / r.trail.length * .7 * z; c.lineTo(x, y); }); c.stroke();
      c.globalAlpha = Math.min(1, z); c.drawImage(this.sprites[1], r.x - 7 * z, r.y - 7 * z, 14 * z, 14 * z);
    }
    for (const s of this.fw) {
      if (s.delay > 0) continue;
      const a = clamp(s.life) * (.45 + .55 * Math.min(1, s.z));
      if (s.glit) {
        const tw = .5 + .5 * Math.sin(t * 22 + s.ph);
        c.globalAlpha = a * tw;
        const sz = (3 + 3 * tw) * s.z;
        c.drawImage(this.sprites[0], s.x - sz / 2, s.y - sz / 2, sz, sz);
        continue;
      }

      c.globalAlpha = a;
      c.strokeStyle = s.col; c.lineWidth = s.w * clamp(s.life * 1.4);
      c.beginPath(); c.moveTo(s.x - s.vx * .045, s.y - s.vy * .045); c.lineTo(s.x, s.y); c.stroke();
      if (s.life > .5) { const sz = 5 * s.z; c.drawImage(this.sprites[0], s.x - sz / 2, s.y - sz / 2, sz, sz); }
    }
    c.restore();

    if (this.txt.length) {
      c.save();

      const formed = this.phase === "text" ? clamp((this.ft - this.tText - 2.2) / 1.2) : 0;
      if (this.halo && formed > 0) { c.globalAlpha = formed * .85; c.drawImage(this.halo, 0, 0, W, H); c.globalAlpha = 1; }
      c.globalCompositeOperation = "lighter";
      const base = Math.max(4, (this.step || 4) * 2.1);
      const cx = W / 2, cy = H * .44, sway = 1 - formed * .85;
      const yaw = reduce ? 0 : (Math.sin(t * .45) * .12 + this.par.x * .12) * sway;
      const pitch = reduce ? 0 : (Math.sin(t * .31 + 1) * .06 + this.par.y * .08) * sway;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), spt = Math.sin(pitch);
      const focal = Math.max(W, H) * 1.3;
      for (const p of this.txt) {
        const tw = reduce ? .85 : .6 + .4 * Math.sin(t * p.sp + p.ph);

        const dx = p.x - cx, dy = p.y - cy, dz = (p.z - 1) * -120;
        const x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
        const y1 = dy * cp - z1 * spt, z2 = dy * spt + z1 * cp;
        const pr = focal / (focal + z2);
        const px = cx + x1 * pr - this.par.x * 26 * (p.z - .5), py = cy + y1 * pr - this.par.y * 18 * (p.z - .5);
        const s = base * (p.big ? 1.15 : 1) * (.8 + tw * .4) * p.z * pr;
        c.globalAlpha = clamp(p.a) * clamp(.75 + tw * .25) * clamp(.6 + p.z * .45);
        c.drawImage(this.sprites[p.big ? 1 : p.spr], px - s / 2, py - s / 2, s, s);
      }
      c.restore();
    }
    if (this.phase !== "montage") this.drawVignette(c, .5);

    if (this.endStar) {
      const st = this.endStar, s = 13 * st.s * (1 + Math.sin(t * 6) * .08);
      c.globalAlpha = st.s;
      c.drawImage(this.sprites[1], st.x - s * 3, st.y - s * 3, s * 6, s * 6);
      c.fillStyle = "#fffbe8"; c.shadowColor = "#ffe08a"; c.shadowBlur = 20;
      drawStarShape(c, st.x, st.y, s, t * 1.4, 5, .45); c.fill();
      c.shadowBlur = 0; c.globalAlpha = 1;
      if (Math.random() < .7) parts.push({ x: st.x, y: st.y, vx: rand(-20, 20), vy: rand(-10, 30), life: 1, decay: 1.2, r: rand(1, 2.2), c: pick(["#fff3cf", "#ffd97a", "#ffd1ea"]), g: 10, glow: 0, shape: "dot", rot: 0, vr: 0, drag: .98 });
    }
  },

  async showLetter() {
    const run = this.run;
    const wrap = document.createElement("div"); wrap.className = "letter-wrap";
    const hp = document.createElement("div"); hp.className = "heart-photo";
    const m = document.createElement("div"); m.className = "m";
    const img = new Image(); img.alt = T_FINAL.fotoAlt;
    img.onerror = () => { const ph = document.createElement("div"); ph.className = "ph"; ph.textContent = T_FINAL.semFoto; img.replaceWith(ph); };
    img.src = FOTO;
    m.appendChild(img); hp.appendChild(m);
    const letter = document.createElement("div"); letter.className = "letter";
    const h2 = document.createElement("h2"); h2.textContent = T_FINAL.titulo; letter.appendChild(h2);
    const btn = document.createElement("button"); btn.className = "btn"; btn.type = "button"; btn.textContent = T_FINAL.denovo; btn.hidden = true;
    btn.addEventListener("click", () => { sfx.pop(); this.phase = "idle"; go("universo"); });
    wrap.append(hp, letter, btn);
    $("stage").appendChild(wrap);
    letter.addEventListener("click", () => { this.skip = true; });
    requestAnimationFrame(() => wrap.classList.add("on"));
    sfx.sparkle();
    await wait(1500); if (run !== this.run) return;

    const near = () => wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight < 160;
    const typeInto = async (el, text) => {
      if (reduce || this.skip) { el.textContent = text; return; }
      let i = 0;
      for (const ch of text) {
        if (run !== this.run) return;
        if (this.skip) { el.textContent = text; return; }
        el.textContent += ch;
        if (++i % 6 === 0 && near()) wrap.scrollTop = wrap.scrollHeight;
        await wait(".!?".includes(ch) ? 220 : ch === "," ? 90 : 20);
      }
    };
    for (const par of T_FINAL.carta) {
      const p = document.createElement("p"); letter.appendChild(p);
      await typeInto(p, par); if (run !== this.run) return;
      if (near()) wrap.scrollTop = wrap.scrollHeight;
      await wait(this.skip ? 0 : 450);
    }
    const s = document.createElement("p"); s.className = "sign"; letter.appendChild(s);
    await typeInto(s, T_FINAL.assinatura); if (run !== this.run) return;
    sfx.fanfare();
    for (let k = 0; k < 3; k++) setTimeout(() => { if (run === this.run) this.launch(false); }, k * 350);
    await wait(2600); if (run !== this.run) return;

    this.endDim = true;
    wrap.style.transition = "opacity 1.8s ease";
    wrap.style.opacity = "0";
    wrap.style.pointerEvents = "none";
    setTimeout(() => wrap.remove(), 2000);
    await wait(1600); if (run !== this.run) return;
    const end = document.createElement("div");
    end.style.cssText = "position:fixed;inset:0;z-index:16;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;text-align:center;" +
      "padding-left:max(22px,env(safe-area-inset-left,0px));padding-right:max(22px,env(safe-area-inset-right,0px));opacity:0;transition:opacity 2.4s ease;";
    const line = document.createElement("p");
    line.textContent = T_FINAL.fimLinha;
    line.style.cssText = "margin:0;max-width:18ch;font-family:var(--font-display);font-style:italic;font-weight:500;" +
      "font-size:clamp(30px,7.4vw,52px);line-height:1.25;color:#fff6e4;text-wrap:balance;text-shadow:0 0 30px rgba(255,214,150,.45),0 2px 18px rgba(5,6,15,.9);";
    const again = document.createElement("button");
    again.className = "btn"; again.type = "button"; again.textContent = T_FINAL.denovo; again.hidden = true;
    again.style.opacity = "0"; again.style.transition = "opacity 1.2s ease";
    again.addEventListener("click", () => { sfx.pop(); this.phase = "idle"; this.endDim = false; go("universo"); });
    end.append(line, again);
    $("stage").appendChild(end);
    await wait(1200); if (run !== this.run) return;
    requestAnimationFrame(() => { end.style.opacity = "1"; });
    sfx.sparkle();
    await wait(5000); if (run !== this.run) return;

    again.hidden = false; again.style.visibility = "hidden";
    await wait(50);
    const r = again.getBoundingClientRect(), tx = r.left + r.width / 2, ty = r.top + r.height / 2;
    const st = this.endStar = { x: W * .18, y: H * .2, s: 0 };
    sfx.sparkle();
    await animate(700, p => st.s = p, easeOut);
    await animate(2600, p => { st.x = W * (.18 + .64 * p) + Math.sin(p * 6.283) * W * .08; st.y = H * .2 + Math.sin(p * Math.PI) * H * .12 - Math.cos(p * 6.283) * H * .04; });
    const x0 = st.x, y0 = st.y;
    sfx.whoosh(1.2);
    await animate(1500, p => { st.x = lerp(x0, tx, p) + Math.sin(p * Math.PI) * W * .15; st.y = lerp(y0, ty, p); st.s = 1 - p * .4; }, easeInOut);
    if (run !== this.run) return;
    sparkle(tx, ty, 40, { colors: ["#fff6dc", "#ffd97a", "#ffb3d6"], speed: 170, gravity: 0, shape: "star", glow: 6 });
    sfx.chime(6);
    this.endStar = null;
    again.style.visibility = "visible";
    requestAnimationFrame(() => { again.style.opacity = "1"; });
  }
};
