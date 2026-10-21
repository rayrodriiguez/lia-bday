const T_JARDIM = {
  tchau: "tchau, Lia!",
  tchauFala: "te deixei aqui, viu? agora é com você. tchau, Lia!",
  linhas: [
    "olha esse lugar!",
    "um jardim de girassóis só pra você.",
    "toca no céu e vê pra onde eles se viram."
  ],
  borboleta: [
    "ei, tem uma borboleta ali.",
    "acho que ela quer te mostrar alguma coisa."
  ],
  segue: "segue a borboleta"
};

(() => {
  function mk(w, h) {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const c = document.createElement("canvas");
    c.width = Math.ceil(w * d); c.height = Math.ceil(h * d);
    const x = c.getContext("2d"); x.scale(d, d);
    return [c, x];
  }

  function soft(w, h, k, draw) {
    const a = document.createElement("canvas");
    a.width = Math.max(2, Math.ceil(w / k)); a.height = Math.max(2, Math.ceil(h / k));
    const ax = a.getContext("2d"); ax.scale(a.width / w, a.height / h); draw(ax);
    const b = document.createElement("canvas");
    b.width = Math.max(2, Math.ceil(a.width * .6)); b.height = Math.max(2, Math.ceil(a.height * .6));
    const bx = b.getContext("2d"); bx.imageSmoothingQuality = "high"; bx.drawImage(a, 0, 0, b.width, b.height);
    return b;
  }

  let petalSpr, diskSpr, leafSpr, raysSpr, haloSpr, blurHead, blurStem, skyCv, hillCv;

  function makePetals() {
    const [c, x] = mk(128, 128);
    x.translate(64, 64);
    const front = x.createRadialGradient(0, 0, 18, 0, 0, 64);
    front.addColorStop(0, "#c55a0a"); front.addColorStop(.42, "#f29a12");
    front.addColorStop(.75, "#ffcb2e"); front.addColorStop(1, "#ffe684");
    const back = x.createRadialGradient(0, 0, 18, 0, 0, 64);
    back.addColorStop(0, "#9c3f06"); back.addColorStop(.45, "#d97c0c");
    back.addColorStop(.8, "#f2ae1c"); back.addColorStop(1, "#f7cd5a");
    for (let layer = 0; layer < 2; layer++) {
      const n = 22;
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2 + layer * Math.PI / n + rand(-.04, .04);
        const r0 = 20, tip = r0 + (layer ? 36 : 41) * rand(.9, 1.04), w = layer ? 6.6 : 7.4, bend = rand(-3.5, 3.5);
        x.save(); x.rotate(a);
        x.beginPath();
        x.moveTo(r0, -w * .55);
        x.bezierCurveTo(r0 + 12, -w * 1.55, tip - 11, -w * .9 + bend, tip, bend * .6);
        x.bezierCurveTo(tip - 11, w * .9 + bend, r0 + 12, w * 1.55, r0, w * .55);
        x.closePath();
        x.fillStyle = layer ? front : back;
        x.fill();
        x.strokeStyle = layer ? "rgba(170,80,8,.28)" : "rgba(110,40,4,.3)";
        x.lineWidth = .8;
        x.beginPath(); x.moveTo(r0 + 3, 0); x.quadraticCurveTo((r0 + tip) / 2, bend * .5, tip - 6, bend * .55); x.stroke();
        x.restore();
      }
      if (!layer) {
        const sh = x.createRadialGradient(0, 0, 16, 0, 0, 40);
        sh.addColorStop(0, "rgba(80,30,0,.35)"); sh.addColorStop(1, "rgba(80,30,0,0)");
        x.fillStyle = sh; x.beginPath(); x.arc(0, 0, 40, 0, 6.283); x.fill();
      }
    }

    const rim = x.createLinearGradient(-64, 0, 64, 0);
    rim.addColorStop(0, "rgba(255,250,220,0)"); rim.addColorStop(.75, "rgba(255,250,220,0)"); rim.addColorStop(1, "rgba(255,250,220,.45)");
    x.globalCompositeOperation = "source-atop";
    x.fillStyle = rim; x.fillRect(-64, -64, 128, 128);
    return c;
  }
  function makeDisk() {
    const [c, x] = mk(64, 64);
    x.translate(32, 32);
    const R = 28;
    const g = x.createRadialGradient(-4, -4, 2, 0, 0, R);
    g.addColorStop(0, "#5a2c0c"); g.addColorStop(.55, "#3b1a07"); g.addColorStop(.85, "#5c3410"); g.addColorStop(1, "#8a5a18");
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, R, 0, 6.283); x.fill();
    const N = 230, golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 1; i < N; i++) {
      const r = 1.72 * Math.sqrt(i), a = i * golden;
      if (r > R - 2) break;
      const sx = Math.cos(a) * r, sy = Math.sin(a) * r, k = r / R;
      x.fillStyle = k > .72 ? "rgba(214,140,40,.9)" : (i % 2 ? "rgba(120,70,20,.85)" : "rgba(30,12,2,.8)");
      x.beginPath(); x.arc(sx, sy, .7 + k * .9, 0, 6.283); x.fill();
    }
    const hl = x.createRadialGradient(-9, -10, 0, -9, -10, 18);
    hl.addColorStop(0, "rgba(255,220,150,.28)"); hl.addColorStop(1, "rgba(255,220,150,0)");
    x.fillStyle = hl; x.beginPath(); x.arc(0, 0, R, 0, 6.283); x.fill();
    return c;
  }
  function makeLeaf() {
    const [c, x] = mk(84, 44);
    x.translate(2, 22);
    const g = x.createLinearGradient(0, -18, 0, 18);
    g.addColorStop(0, "#7aa63c"); g.addColorStop(.5, "#4f7a24"); g.addColorStop(1, "#33561a");
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(0, 0);
    x.bezierCurveTo(14, -22, 52, -20, 80, 0);
    x.bezierCurveTo(52, 18, 16, 22, 0, 0);
    x.fill();
    x.strokeStyle = "rgba(255,240,170,.35)"; x.lineWidth = 1.4;
    x.beginPath(); x.moveTo(6, -6); x.bezierCurveTo(18, -18, 50, -17, 78, -1); x.stroke();
    x.strokeStyle = "rgba(205,230,150,.45)"; x.lineWidth = 1.1;
    x.beginPath(); x.moveTo(2, 0); x.quadraticCurveTo(40, -2, 78, 0); x.stroke();
    x.lineWidth = .7;
    for (let i = 1; i < 6; i++) {
      const px = i * 12;
      x.beginPath(); x.moveTo(px, -.3); x.quadraticCurveTo(px + 6, -7, px + 11, -11 + i * 1.2); x.stroke();
      x.beginPath(); x.moveTo(px, .3); x.quadraticCurveTo(px + 6, 7, px + 11, 11 - i * 1.2); x.stroke();
    }
    return c;
  }
  function makeRays() {
    const [c, x] = mk(512, 512);
    x.translate(256, 256);
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2 + rand(-.08, .08), w = rand(.035, .08);
      const g = x.createRadialGradient(0, 0, 10, 0, 0, 256);
      g.addColorStop(0, "rgba(255,240,200,.22)"); g.addColorStop(1, "rgba(255,240,200,0)");
      x.fillStyle = g;
      x.beginPath(); x.moveTo(0, 0);
      x.arc(0, 0, 256, a - w, a + w); x.closePath(); x.fill();
    }
    return c;
  }
  function makeHalo() {
    const [c, x] = mk(64, 64);
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,226,160,.55)"); g.addColorStop(.5, "rgba(255,210,140,.18)"); g.addColorStop(1, "rgba(255,210,140,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return c;
  }
  function makeBlurred() {
    blurHead = soft(128, 128, 5, x => { x.drawImage(petalSpr, 0, 0, 128, 128); x.drawImage(diskSpr, 64 - 28, 64 - 28, 56, 56); });
    blurStem = soft(120, 800, 7, x => {
      const g = x.createLinearGradient(40, 0, 80, 0);
      g.addColorStop(0, "#2f4f17"); g.addColorStop(.5, "#5d8a2c"); g.addColorStop(1, "#2f4f17");
      x.fillStyle = g; x.fillRect(48, 0, 24, 800);
      x.fillStyle = "#4a7524";
      x.beginPath(); x.ellipse(30, 300, 34, 12, -.5, 0, 6.283); x.fill();
      x.beginPath(); x.ellipse(90, 560, 34, 12, .5, 0, 6.283); x.fill();
    });
  }

  let sun = { x: 0, y: 0, r: 0 };
  let rows = [], flowers = [], motes = [], drift = [], butterflies = [], fg = [], rush = [];
  let look = { x: 0, y: 0 }, target = null, targetT = -99, turnK = .7;
  let bf = null, crab = null, tok = 0, followed = false, landFlower = null;
  let dolly = 0, camX = 0, camY = 0, dive = 0, AX = 0, AY = 0;
  const DEPTHS = [.2, .3, .5, .75, 1];

  function buildSky() {
    [skyCv] = mk(W + 80, H + 80);
    const x = skyCv.getContext("2d");
    x.translate(40, 40);
    const g = x.createLinearGradient(0, -40, 0, H * .62);
    g.addColorStop(0, "#b9a6dd"); g.addColorStop(.3, "#e7b2cf"); g.addColorStop(.62, "#ffbfa6");
    g.addColorStop(.85, "#ffd9a0"); g.addColorStop(1, "#ffe7b6");
    x.fillStyle = g; x.fillRect(-40, -40, W + 80, H + 80);
    const glow = x.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, Math.max(W, H) * .6);
    glow.addColorStop(0, "rgba(255,244,214,.95)"); glow.addColorStop(.12, "rgba(255,226,160,.6)");
    glow.addColorStop(.4, "rgba(255,190,140,.18)"); glow.addColorStop(1, "rgba(255,190,140,0)");
    x.fillStyle = glow; x.fillRect(-40, -40, W + 80, H + 80);
    x.globalAlpha = .35;
    for (let i = 0; i < 6; i++) {
      const cy = H * rand(.12, .38), cx = W * rand(0, 1), len = W * rand(.25, .5);
      const cg = x.createLinearGradient(cx - len / 2, 0, cx + len / 2, 0);
      cg.addColorStop(0, "rgba(255,230,235,0)"); cg.addColorStop(.5, "rgba(255,236,230,.9)"); cg.addColorStop(1, "rgba(255,230,235,0)");
      x.fillStyle = cg;
      x.beginPath(); x.ellipse(cx, cy, len / 2, rand(3, 7), 0, 0, 6.283); x.fill();
    }
    x.globalAlpha = 1;
    x.fillStyle = "#fff8e6";
    x.beginPath(); x.arc(sun.x, sun.y, sun.r, 0, 6.283); x.fill();
  }
  function buildHills() {
    [hillCv] = mk(W + 80, H + 80);
    const x = hillCv.getContext("2d");
    x.translate(40, 40);
    const hill = (base, amp, freq, ph, col) => {
      x.fillStyle = col; x.beginPath(); x.moveTo(-40, H + 40);
      for (let px = -40; px <= W + 50; px += 10) x.lineTo(px, base + Math.sin(px * freq + ph) * amp + Math.sin(px * freq * 2.7 + ph * 2) * amp * .35);
      x.lineTo(W + 40, H + 40); x.closePath(); x.fill();
    };
    hill(H * .53, H * .02, .006, 1, "#d6a6c0");
    hill(H * .56, H * .025, .0045, 3, "#c79aa6");
    const fgr = x.createLinearGradient(0, H * .57, 0, H + 40);
    fgr.addColorStop(0, "#c6a456"); fgr.addColorStop(.25, "#9a8a3a"); fgr.addColorStop(.6, "#5f6f27"); fgr.addColorStop(1, "#2e4018");
    x.fillStyle = fgr; x.beginPath(); x.moveTo(-40, H + 40);
    for (let px = -40; px <= W + 50; px += 10) x.lineTo(px, H * .585 + Math.sin(px * .004 + 5) * H * .012);
    x.lineTo(W + 40, H + 40); x.closePath(); x.fill();
    const hz = x.createLinearGradient(0, H * .5, 0, H * .64);
    hz.addColorStop(0, "rgba(255,214,180,0)"); hz.addColorStop(.5, "rgba(255,214,180,.5)"); hz.addColorStop(1, "rgba(255,214,180,0)");
    x.fillStyle = hz; x.fillRect(-40, H * .5, W + 80, H * .14);
  }

  function buildFlowers() {
    const sm = isSmall() ? .85 : 1;
    rows = [
      { base: H * .605, gap: 11, s: [3.2, 4.6], stem: [6, 13], d: 0 },
      { base: H * .645, gap: 17, s: [5.5, 7.8], stem: [12, 24], d: .25 },
      { base: H * .73, gap: 30, s: [10, 14], stem: [28, 52], d: .5 },
      { base: H * .87, gap: 58, s: [19 * sm, 26 * sm], stem: [70, 115], d: .75 },
      { base: H + 30, gap: isSmall() ? 105 : 150, s: [40 * sm, 54 * sm], stem: [H * .3, H * .4], d: 1 }
    ];
    flowers = [];
    rows.forEach((r, ri) => {
      const n = Math.ceil((W + 80) / r.gap) + 1;
      r.list = [];
      for (let i = 0; i < n; i++) {
        const f = {
          x: -40 + (i + rand(.15, .85)) * ((W + 80) / n),
          base: r.base + rand(-4, 6) * (1 + r.d * 2),
          s: rand(r.s[0], r.s[1]), stem: rand(r.stem[0], r.stem[1]), d: r.d, row: ri,
          ph: rand(0, 6.28), sp: rand(.9, 1.4), leafA: rand(.3, .55), leafB: rand(.58, .78),
          hx: 0, hy: 0, wind: 0
        };
        f.amp = (6 + f.stem * .06) * (.5 + r.d * .6);
        f.sw = Math.max(.8, f.s * .12);
        f.stemCol = r.d < .3 ? "#7d7a36" : r.d < .6 ? "#5d7428" : "#3f6420";
        r.list.push(f); flowers.push(f);
      }
      r.list.sort((a, b) => a.base - b.base);
    });

    const big = Math.min(W, H);
    fg = [
      { x: -big * .08, y: H * .98, s: big * .3, ph: 0 },
      { x: W + big * .06, y: H * .9, s: big * .24, ph: 2 },
      { x: W * .55, y: H * 1.12, s: big * .2, ph: 4 }
    ];
  }

  function makeButterfly(special) {
    return {
      x: rand(0, W), y: H * rand(.3, .55), ph: rand(0, 6.28), special, z: 1,
      size: special ? (isSmall() ? 18 : 22) : rand(8, 11),
      c1: special ? "#8fe0ff" : pick(["#fff6e0", "#ffe08a", "#f7c6e0"]),
      c2: special ? "#3c6fe0" : pick(["#f2b04a", "#e88fb6", "#ffffff"]),
      cx: rand(.15, .85), cy: rand(.32, .55), state: "wander", ang: 0
    };
  }

  function drawButterfly(c, b, t, scale = 1) {
    const flapSpeed = b.special ? (b.state === "landed" ? 3 : 12) : 13;
    const flap = Math.abs(Math.cos(t * flapSpeed + b.ph));
    const open = b.state === "landed" ? .35 + flap * .65 : .18 + flap * .82;
    const s = b.size * b.z * scale;
    c.save();
    c.translate(b.x, b.y);
    c.rotate(b.ang);
    if (b.special) {
      const gl = c.createRadialGradient(0, 0, 0, 0, 0, s * 2.6);
      gl.addColorStop(0, "rgba(170,230,255,.55)"); gl.addColorStop(1, "rgba(170,230,255,0)");
      c.fillStyle = gl; c.beginPath(); c.arc(0, 0, s * 2.6, 0, 6.283); c.fill();
    }
    for (const side of [-1, 1]) {
      c.save(); c.scale(side * open, 1);
      const g = c.createLinearGradient(0, 0, s * 1.3, 0);
      g.addColorStop(0, b.c2); g.addColorStop(1, b.c1);
      c.fillStyle = g;
      c.beginPath(); c.moveTo(0, -1);
      c.bezierCurveTo(s * .4, -s * 1.3, s * 1.45, -s * 1.15, s * 1.2, -s * .2);
      c.bezierCurveTo(s * 1.1, s * .1, s * .4, s * .1, 0, 0);
      c.fill();
      c.beginPath(); c.moveTo(0, 0);
      c.bezierCurveTo(s * .6, s * .1, s * 1.05, s * .5, s * .7, s * .95);
      c.bezierCurveTo(s * .4, s * 1.1, s * .1, s * .6, 0, s * .2);
      c.fill();
      if (b.special) {
        c.strokeStyle = "rgba(20,40,110,.55)"; c.lineWidth = .9;
        c.beginPath(); c.moveTo(s * .1, -s * .1); c.lineTo(s * 1.1, -s * .8); c.moveTo(s * .1, 0); c.lineTo(s * 1.15, -s * .25); c.moveTo(s * .1, s * .1); c.lineTo(s * .7, s * .8); c.stroke();
        c.fillStyle = "rgba(255,255,255,.85)";
        c.beginPath(); c.arc(s * 1.05, -s * .55, s * .08, 0, 6.283); c.arc(s * .85, -s * .85, s * .06, 0, 6.283); c.fill();
      }
      c.restore();
    }
    c.fillStyle = "#2b1d1a";
    c.beginPath(); c.ellipse(0, s * .15, s * .1, s * .6, 0, 0, 6.283); c.fill();
    c.strokeStyle = "#2b1d1a"; c.lineWidth = .8;
    c.beginPath(); c.moveTo(0, -s * .4); c.quadraticCurveTo(-s * .2, -s * .8, -s * .35, -s * .95);
    c.moveTo(0, -s * .4); c.quadraticCurveTo(s * .2, -s * .8, s * .35, -s * .95); c.stroke();
    c.restore();
  }

  function stemPoint(f, u) {
    const x0 = f.x, y0 = f.base, cx = f.x + f.wind * .1, cy = f.base - f.stem * .5;
    const v = 1 - u;
    return {
      x: v * v * x0 + 2 * v * u * cx + u * u * f.hx,
      y: v * v * y0 + 2 * v * u * cy + u * u * f.hy,
      tx: 2 * v * (cx - x0) + 2 * u * (f.hx - cx),
      ty: 2 * v * (cy - y0) + 2 * u * (f.hy - cy)
    };
  }

  function drawFlower(c, f) {
    c.strokeStyle = f.stemCol; c.lineWidth = f.sw; c.lineCap = "round";
    c.beginPath(); c.moveTo(f.x, f.base);
    c.quadraticCurveTo(f.x + f.wind * .1, f.base - f.stem * .5, f.hx, f.hy); c.stroke();
    if (f.d >= .5) {
      const ls = f.s / 26;
      [[f.leafA, -1], [f.leafB, 1]].forEach(([u, side]) => {
        const p = stemPoint(f, u);
        const a = Math.atan2(p.ty, p.tx) + side * 1.15 + Math.sin(TIME * 1.5 + f.ph + u * 3) * .08;
        c.save(); c.translate(p.x, p.y); c.rotate(a + (side < 0 ? Math.PI : 0));
        c.scale(ls, side < 0 ? -ls : ls);
        c.drawImage(leafSpr, -2, -22, 84, 44);
        c.restore();
      });
    }
    const dx = look.x - f.hx, dy = look.y - f.hy, len = Math.hypot(dx, dy) || 1;
    const bl = f.bloom || 0;
    const ux = dx / len, uy = dy / len, k = f.d < .3 ? .4 : turnK, s = f.s * (1 + bl * .2);
    if (f.d >= .5) {
      c.save(); c.globalCompositeOperation = "lighter"; c.globalAlpha = .55 + bl * .45;
      const hs = s * (3 + bl * 1.4);
      c.drawImage(haloSpr, f.hx - hs / 2 + 3, f.hy - hs / 2, hs, hs);
      c.restore();
    }
    c.save();
    c.translate(f.hx, f.hy);
    c.rotate(f.wind * .004 + ux * .18 * k);
    if (f.d >= .5) {
      c.fillStyle = "#3f6420";
      c.beginPath(); c.arc(-ux * s * .14 * k, -uy * s * .14 * k, s * .42, 0, 6.283); c.fill();
    }
    c.scale(1 - Math.abs(ux) * .3 * k, 1 - Math.abs(uy) * .3 * k);
    c.rotate(bl * .25);
    c.drawImage(petalSpr, -s, -s, s * 2, s * 2);
    if (bl > .02) {
      c.save(); c.globalCompositeOperation = "lighter"; c.globalAlpha = bl * .35;
      c.drawImage(petalSpr, -s, -s, s * 2, s * 2);
      c.restore();
    }
    const ds = f.s * .86;
    c.drawImage(diskSpr, ux * s * .13 * k - ds / 2, uy * s * .13 * k - ds / 2, ds, ds);
    c.restore();
  }

  function drawMotes(c, t) {
    c.globalCompositeOperation = "lighter";
    for (const m of motes) {
      const a = (.35 + .65 * Math.max(0, Math.sin(t * m.tw + m.ph))) * m.a;
      c.globalAlpha = a; c.fillStyle = "#fff0bf";
      c.beginPath(); c.arc(m.x, m.y, m.r, 0, 6.283); c.fill();
    }
    c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
  }
  function drawDrift(c) {
    for (const p of drift) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.cos(p.flip));
      c.fillStyle = "#ffc93a";
      c.beginPath(); c.moveTo(-p.s, 0); c.quadraticCurveTo(0, -p.s * .45, p.s, 0); c.quadraticCurveTo(0, p.s * .45, -p.s, 0); c.fill();
      c.restore();
    }
  }

  function layerScale(depth) { return 1 + dolly * .16 * depth; }
  function layer(c, depth, fn) {
    const s = layerScale(depth);
    c.save();
    c.translate(AX, AY); c.scale(s, s);
    c.translate(-AX - camX * depth, -AY - camY * depth * .6);
    fn();
    c.restore();
  }
  function toScreen(x, y, depth) {
    const s = layerScale(depth);
    return { x: AX + (x - AX - camX * depth) * s, y: AY + (y - AY - camY * depth * .6) * s };
  }

  async function crabStory(my) {
    if (typeof drawCrab !== "function") return;
    const sz = isSmall() ? 56 : 70;
    crab = { x: -sz * 1.5, y: H * .9, size: sz, walking: true, sign: "" };
    const stepIv = setInterval(() => { if (crab && crab.walking && my === tok) sfx.step(); }, 240);
    await animate(3000, p => { if (crab) crab.x = lerp(-sz * 1.5, W * .3, p); }, easeOut);
    if (my !== tok) return clearInterval(stepIv);
    crab.walking = false; crab.sign = T_JARDIM.tchau; sfx.boing();
    sparkle(crab.x, crab.y - sz * .6, 10, { shape: "heart", colors: ["#ff8fb0", "#ffc0d4"], speed: 60, gravity: -20, size: 3, life: 1.6 });
    const bub = speak(T_JARDIM.tchauFala, () => crab ? toScreen(crab.x, crab.y - crab.size * 1.15, DEPTHS[3]) : { x: -100, y: -100 }, { ms: 4600 });
    await wait(4600);
    if (bub && bub.close) bub.close();
    if (my !== tok) return clearInterval(stepIv);
    crab.sign = ""; crab.walking = true;
    animate(2600, p => { if (crab) crab.x = lerp(W * .3, -sz * 1.8, p); }, easeIn).then(() => {
      clearInterval(stepIv);
      if (my === tok) crab = null;
    });
    await wait(900);
  }

  async function follow() {
    if (followed || !bf || bf.state !== "landed") return;
    followed = true;
    hint(""); unsay(); hideInfo();
    sfx.whoosh(2.4); sfx.sparkle();
    const p0 = toScreen(bf.x, bf.y, 1);
    bf.x = p0.x; bf.y = p0.y; bf.state = "leaving";
    sparkle(bf.x, bf.y, 18, { colors: ["#bfefff", "#ffffff", "#8fd3ff"], speed: 90, gravity: 0, size: 2, life: 1.2, glow: 6 });
    rush = Array.from({ length: 12 }, (_, i) => ({
      t0: .12 + i * .06, side: i % 2 ? 1 : -1, off: rand(10, 70), w: rand(60, 120), lean: rand(-.15, .15), head: i % 3 === 0
    }));
    const x0 = bf.x, y0 = bf.y, x1 = W * .5, y1 = H * .72;
    fadeColor = "#cfe8b0";
    await animate(2600, p => {
      dive = p;
      const e = easeInOut(Math.min(1, p * 1.2));
      bf.x = lerp(x0, x1, e) + Math.sin(p * 14) * 14 * (1 - p);
      bf.y = lerp(y0, y1, e) + Math.cos(p * 11) * 8 * (1 - p);
      bf.ang = Math.sin(p * 10) * .25;
      bf.z = 1 + p * 1.6;
    });
    go("grama", { color: "#cfe8b0", out: 200, inn: 1200 });
  }

  S.jardim = {
    music: "jardim",
    tone: "light",
    init() {
      sun = { x: W * .7, y: H * .5, r: Math.min(W, H) * .065 };
      AX = W / 2; AY = H * .62;
      petalSpr = makePetals(); diskSpr = makeDisk(); leafSpr = makeLeaf(); raysSpr = makeRays(); haloSpr = makeHalo();
      makeBlurred();
      buildSky(); buildHills(); buildFlowers();
      motes = Array.from({ length: isSmall() ? 34 : 60 }, () => ({
        x: rand(0, W), y: rand(H * .25, H), r: rand(.8, 2.2), a: rand(.4, 1), ph: rand(0, 6.28), tw: rand(1, 3),
        vx: rand(-6, 10), vy: rand(-10, -2)
      }));
      drift = Array.from({ length: 6 }, () => ({ x: rand(0, W), y: rand(0, H), s: rand(4, 7), rot: rand(0, 6), flip: rand(0, 6), vx: rand(18, 34), vy: rand(10, 22) }));
      butterflies = [makeButterfly(false), makeButterfly(false), makeButterfly(false)];
      if (!target) { look.x = sun.x; look.y = sun.y; }
      if (bf && bf.state === "landed") landFlower = pickLanding();
    },
    enter() {
      const my = ++tok;
      const alive = () => curName === "jardim" && tok === my;
      dive = 0; dolly = 0; followed = false; bf = null; crab = null; target = null; landFlower = null; rush = [];
      look.x = sun.x; look.y = sun.y;
      (async () => {
        animate(30000, p => { if (alive()) dolly = p; }, easeInOut);
        await wait(600);
        await crabStory(my); if (!alive()) return;
        await narrate(T_JARDIM.linhas, { keepLast: true }); if (!alive()) return;
        await wait(6000); if (!alive()) return;
        unsay();
        landFlower = pickLanding();
        bf = makeButterfly(true); bf.state = "arriving";
        const sx = W + 40, sy = H * .3;
        bf.x = sx; bf.y = sy;
        sfx.sparkle();
        await animate(3200, p => {
          if (!bf || bf.state !== "arriving") return;
          const tx = landFlower.hx, ty = landFlower.hy - landFlower.s * .35;
          const cx = W * .55, cy = H * .18, v = 1 - p;
          bf.x = v * v * sx + 2 * v * p * cx + p * p * tx + Math.sin(p * 18) * 10 * v;
          bf.y = v * v * sy + 2 * v * p * cy + p * p * ty + Math.cos(p * 14) * 8 * v;
        }, easeInOut);
        if (!alive() || !bf) return;
        bf.state = "landed";
        await narrate(T_JARDIM.borboleta, { keepLast: true }); if (!alive() || followed) return;
        hint(T_JARDIM.segue);
        await wait(8000);
        if (alive() && !followed) follow();
      })();
    },
    exit() { tok++; dive = 0; crab = null; rush = []; },
    update(dt, t) {
      const gust = Math.pow(Math.sin(t * .33) * .5 + .5, 2) * 1.3 + Math.sin(t * .9) * .25;
      const hasP = pX >= 0 && !dive;
      for (const f of flowers) {
        f.wind = (Math.sin(t * f.sp + f.ph + f.x * .004) * .6 + gust) * f.amp;
        f.hx = f.x + f.wind;
        f.hy = f.base - f.stem + Math.abs(f.wind) * .12;

        if (f.d >= .5) {
          let want = 0;
          if (hasP) {
            const sp = toScreen(f.hx, f.hy, DEPTHS[f.row]);
            const dd = dist(pX, pY, sp.x, sp.y), R = 90 + f.s * 2.2;
            want = dd < R ? Math.pow(1 - dd / R, 1.4) : 0;
          }
          f.bloom = (f.bloom || 0) + (want - (f.bloom || 0)) * Math.min(1, dt * (want > (f.bloom || 0) ? 4 : 1.6));
        }
      }
      const touching = target && t - targetT < 3.5;
      const tg = touching ? target : sun;
      look.x += (tg.x - look.x) * Math.min(1, dt * 2.4);
      look.y += (tg.y - look.y) * Math.min(1, dt * 2.4);
      turnK += ((tg === sun ? .7 : 1) - turnK) * Math.min(1, dt * 2);
      const cx = touching ? (target.x - W / 2) / W * 34 : Math.sin(t * .12) * 9;
      const cy = touching ? (target.y - H / 2) / H * 14 : Math.sin(t * .16) * 4;
      camX += (cx - camX) * Math.min(1, dt * 1.8); camY += (cy - camY) * Math.min(1, dt * 1.8);
      for (const m of motes) {
        m.x += (m.vx + gust * 14) * dt; m.y += m.vy * dt + Math.sin(t + m.ph) * .2;
        if (m.x > W + 10) m.x = -10; if (m.y < H * .2) { m.y = H + 5; m.x = rand(0, W); }
      }
      for (const p of drift) {
        p.x += (p.vx + gust * 30) * dt; p.y += p.vy * dt; p.rot += dt * 1.2; p.flip += dt * 3;
        if (p.x > W + 20 || p.y > H + 20) { p.x = rand(-40, W * .5); p.y = -20; }
      }
      for (const b of butterflies) {
        const nx = W * (b.cx + Math.sin(t * .23 + b.ph) * .25), ny = H * (b.cy + Math.sin(t * .41 + b.ph * 2) * .08) + Math.sin(t * 3 + b.ph) * 6;
        b.ang = clamp((nx - b.x) * .02, -.4, .4);
        b.x = nx; b.y = ny; b.z = 1 + Math.sin(t * .5 + b.ph) * .25;
      }
      if (bf && bf.state === "landed" && landFlower) {
        bf.x = landFlower.hx; bf.y = landFlower.hy - landFlower.s * .35; bf.ang = landFlower.wind * .004;
      }
    },
    draw(c, t) {
      c.fillStyle = "#ffd7a8"; c.fillRect(0, 0, W, H);
      const zx = W * .5, zy = H * .72;
      if (dive > 0) {
        const z = 1 + Math.pow(dive, 2.2) * 7;
        c.save(); c.translate(zx, zy); c.scale(z, z); c.translate(-zx, -zy);
      }
      layer(c, .05, () => {
        c.drawImage(skyCv, -40, -40, W + 80, H + 80);
        c.save();
        c.globalCompositeOperation = "lighter";
        c.globalAlpha = .55 + Math.sin(t * .4) * .1;
        const rs = Math.max(W, H) * 1.3;
        c.translate(sun.x, sun.y); c.rotate(t * .02);
        c.drawImage(raysSpr, -rs / 2, -rs / 2, rs, rs);
        c.restore();
      });
      layer(c, .15, () => c.drawImage(hillCv, -40, -40, W + 80, H + 80));
      rows.forEach((r, ri) => layer(c, DEPTHS[ri], () => {
        for (const f of r.list) drawFlower(c, f);
        if (ri <= 1) {
          const hz = c.createLinearGradient(0, H * .5, 0, r.base + 10);
          hz.addColorStop(0, "rgba(255,212,178,0)"); hz.addColorStop(1, ri ? "rgba(255,212,178,.2)" : "rgba(255,212,178,.34)");
          c.fillStyle = hz; c.fillRect(-60, H * .5, W + 120, r.base + 10 - H * .5);
        }
        if (ri === 2) for (const b of butterflies) drawButterfly(c, b, t);
        if (ri === 3 && crab) {
          c.fillStyle = "rgba(40,30,10,.25)"; c.beginPath(); c.ellipse(crab.x, crab.y + crab.size * .12, crab.size * .7, crab.size * .12, 0, 0, 6.283); c.fill();
          drawCrab(c, crab.x, crab.y, crab.size, t, crab.walking, crab.sign);
        }
        if (ri === 4) {
          drawDrift(c);
          if (bf && bf.state !== "leaving") drawButterfly(c, bf, t);
        }
      }));
      drawMotes(c, t);

      layer(c, 1.6, () => {
        for (const f of fg) {
          const sw = Math.sin(t * .7 + f.ph) * 6;
          c.drawImage(blurStem, f.x + sw - f.s * .45, f.y, f.s * .9, H * .9);
          c.save(); c.translate(f.x + sw, f.y); c.rotate(sw * .01);
          c.drawImage(blurHead, -f.s, -f.s, f.s * 2, f.s * 2);
          c.restore();
        }
      });
      const warm = c.createLinearGradient(0, 0, W, H);
      warm.addColorStop(0, "rgba(255,200,150,0)"); warm.addColorStop(1, "rgba(120,60,90,.12)");
      c.fillStyle = warm; c.fillRect(0, 0, W, H);
      if (dive > 0) {
        c.restore();

        for (const r of rush) {
          const q = (dive - r.t0) / .4;
          if (q <= 0 || q >= 1) continue;
          const x = W / 2 + r.side * (r.off + Math.pow(q, 2) * W * .95);
          const w = lerp(r.w * .4, r.w * 2.6, q);
          c.save(); c.globalAlpha = Math.sin(Math.PI * q);
          c.translate(x, H * .5); c.rotate(r.lean + r.side * q * .25);
          c.drawImage(blurStem, -w / 2, -H * .9, w, H * 1.8);
          if (r.head) c.drawImage(blurHead, -w * 1.4, -H * .55 - w, w * 2.8, w * 2.8);
          c.restore();
        }
        if (bf) drawButterfly(c, bf, t);
        c.globalAlpha = clamp((dive - .62) / .38); c.fillStyle = "#cfe8b0"; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
      }
    },
    down(x, y) {
      if (bf && bf.state === "landed") {
        const p = toScreen(bf.x, bf.y, 1);
        if (dist(x, y, p.x, p.y) < Math.max(48, bf.size * 2.4)) { follow(); return; }
      }
      target = { x, y }; targetT = TIME;
      sparkle(x, y, 7, { colors: ["#fff1b0", "#ffd36b", "#ffffff"], speed: 45, gravity: -15, size: 1.8, life: 1.1 });
    },
    move(x, y, isDown) {
      if (isDown) { target = { x, y }; targetT = TIME; }
    }
  };

  function pickLanding() {
    const near = rows[4] ? rows[4].list : flowers;
    let best = near[0], bd = 1e9;
    for (const f of near) {
      const d = Math.abs(f.x - W * .5) + Math.abs((f.base - f.stem) - H * .6) * .5;
      if (d < bd && f.base - f.stem > H * .3) { bd = d; best = f; }
    }
    return best;
  }
})();
