const T_GRAMA = {
  linhas: [
    "opa, acho que a gente ficou pequenininha.",
    "olha o tamanho dessas flores",
    "e tem mais gente querendo falar com você.",
    "toca nos bichinhos e vê o que eles prepararam."
  ],
  contador: n => n + "/5 recadinhos",
  formiguinha: [
    "psiu, Lia!",
    "vem comigo, tem uma surpresa te esperando.",
    "e dessa vez não precisa nem andar muito. olha o tamanho das minhas pernas!"
  ],
  segue: "segue a formiguinha",
  placa: "piquenique →",
  palavra: "LIA",
  bichos: {
    joaninha: { title: "joaninha", text: "trouxe sete pintinhas de sorte. usa uma pra cada desejo e guarda a última pra nunca esquecer o quanto você merece ser feliz." },
    borboleta: { title: "borboleta", text: "não sei pra onde a vida vai te levar, mas espero que você encontre muita coisa bonita pelo caminho." },
    formiga: { title: "formiguinhas", text: "a gente é pequenininha, mas trouxe um montão de carinho. pode ficar com tudo!" },
    abelha: { title: "abelhinha", text: "vim conferir se era verdade que hoje é aniversário da menina mais doce daqui. confirmadíssimo." },
    caracol: { title: "caracol", text: "demorei um pouquinho porque sou lento, mas não ia deixar seu aniversário passar sem aparecer." }
  }
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
  const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const M = 34;

  let bgCv, groundCv, gY = 0, midBlades = [], nearBlades = [], nearSpr = [], bokeh = [];
  let lbBlade = null, daisy = null, clover = null;
  let lady, mon, ants = [], bee, snail, special = null;
  let found = new Set(), tok = 0, elapsed = 0, leaving = false, marchSpeed = 22;
  let camX = 0, camY = 0, touchT = -99, pull = 0, veil = 0;
  let heart = { on: false, hb: 0, glow: 0 }, trail = [], glitter = [], busy = {};

  function buildBg() {
    [bgCv] = mk(W + 2 * M, H + 2 * M);
    const x = bgCv.getContext("2d");
    x.translate(M, M);
    const g = x.createLinearGradient(0, -M, 0, gY);
    g.addColorStop(0, "#fff8da"); g.addColorStop(.35, "#e9f4c0"); g.addColorStop(.75, "#b7dc8e"); g.addColorStop(1, "#8fc56c");
    x.fillStyle = g; x.fillRect(-M, -M, W + 2 * M, H + 2 * M);
    x.globalCompositeOperation = "lighter";
    for (let i = 0; i < 5; i++) {
      const sx = W * rand(-.1, .9), w = W * rand(.06, .14);
      const lg = x.createLinearGradient(0, 0, 0, gY);
      lg.addColorStop(0, "rgba(255,250,220,.2)"); lg.addColorStop(1, "rgba(255,250,220,0)");
      x.fillStyle = lg;
      x.beginPath(); x.moveTo(sx, -M); x.lineTo(sx + w, -M); x.lineTo(sx + w + W * .25, gY); x.lineTo(sx + W * .25, gY); x.closePath(); x.fill();
    }
    for (let i = 0; i < 22; i++) {
      const bx = rand(-M, W + M), by = rand(-M, gY * .9), r = rand(10, 48);
      const bg = x.createRadialGradient(bx, by, r * .6, bx, by, r);
      const col = pick(["255,255,235", "255,240,180", "235,255,210"]);
      bg.addColorStop(0, `rgba(${col},.16)`); bg.addColorStop(.85, `rgba(${col},.2)`); bg.addColorStop(1, `rgba(${col},0)`);
      x.fillStyle = bg; x.beginPath(); x.arc(bx, by, r, 0, 6.283); x.fill();
    }
    x.globalCompositeOperation = "source-over";

    const far = soft(W + 2 * M, H + 2 * M, 7, fx => {
      fx.translate(M, M);
      for (let i = 0; i < 80; i++) {
        const bx = rand(-M, W + M), h = rand(H * .25, H * .62), w = rand(6, 12), lean = rand(-40, 40);
        fx.fillStyle = pick(["rgba(120,175,80,.75)", "rgba(150,195,95,.7)", "rgba(100,160,70,.7)"]);
        fx.beginPath(); fx.moveTo(bx - w / 2, gY + 6);
        fx.quadraticCurveTo(bx + lean * .3, gY - h * .55, bx + lean, gY - h);
        fx.quadraticCurveTo(bx + lean * .3 + w * .3, gY - h * .55, bx + w / 2, gY + 6); fx.fill();
      }
    });
    x.drawImage(far, -M, -M, W + 2 * M, H + 2 * M);
    const hz = x.createLinearGradient(0, 0, 0, gY);
    hz.addColorStop(0, "rgba(255,250,225,.35)"); hz.addColorStop(1, "rgba(235,248,205,.15)");
    x.fillStyle = hz; x.fillRect(-M, -M, W + 2 * M, gY + M);
  }

  function buildGround() {
    [groundCv] = mk(W + 2 * M, H + 2 * M);
    const x = groundCv.getContext("2d");
    x.translate(M, M);
    const sg = x.createLinearGradient(0, gY, 0, H + M);
    sg.addColorStop(0, "#5d7a2e"); sg.addColorStop(.08, "#6b4e2d"); sg.addColorStop(1, "#33230f");
    x.fillStyle = sg; x.beginPath(); x.moveTo(-M, H + M);
    for (let px = -M; px <= W + M + 8; px += 8) x.lineTo(px, gY + Math.sin(px * .03) * 2 + Math.sin(px * .11) * 1.5);
    x.lineTo(W + M, H + M); x.closePath(); x.fill();

    const rim = x.createLinearGradient(0, gY - 6, 0, gY + 8);
    rim.addColorStop(0, "rgba(255,250,200,0)"); rim.addColorStop(.5, "rgba(255,250,200,.35)"); rim.addColorStop(1, "rgba(255,250,200,0)");
    x.fillStyle = rim; x.fillRect(-M, gY - 6, W + 2 * M, 14);
    for (let i = 0; i < (W + 2 * M) / 3; i++) {
      const mx = rand(-M, W + M), my = gY + rand(-3, 6);
      x.fillStyle = pick(["#7da23a", "#6c9132", "#93b748", "#55772a"]);
      x.beginPath(); x.arc(mx, my, rand(1.5, 4), 0, 6.283); x.fill();
    }
    for (let i = 0; i < 14; i++) {
      const px = rand(0, W), py = rand(gY + 14, H - 6), r = rand(3, 9);
      x.fillStyle = "rgba(20,10,4,.3)"; x.beginPath(); x.ellipse(px + 2, py + r * .6, r * 1.3, r * .4, 0, 0, 6.283); x.fill();
      const pg = x.createRadialGradient(px - r * .3, py - r * .4, 0, px, py, r);
      pg.addColorStop(0, "#c2ad92"); pg.addColorStop(1, "#6f5a44");
      x.fillStyle = pg; x.beginPath(); x.ellipse(px, py, r * 1.3, r, 0, 0, 6.283); x.fill();
    }
    for (let i = 0; i < 90; i++) {
      x.fillStyle = "rgba(20,10,4,.25)";
      x.beginPath(); x.arc(rand(0, W), rand(gY + 8, H + M), rand(.6, 1.6), 0, 6.283); x.fill();
    }

    x.fillStyle = "rgba(30,20,5,.25)"; x.beginPath(); x.ellipse(clover.x + 6, gY + 5, clover.r * .9, 5, 0, 0, 6.283); x.fill();
    drawClover(x);
  }
  function drawClover(x) {
    const c = clover;
    x.strokeStyle = "#4f8a2c"; x.lineWidth = 2.4; x.lineCap = "round";
    x.beginPath(); x.moveTo(c.x, gY + 4); x.quadraticCurveTo(c.x - 10, (gY + c.y) / 2, c.x, c.y); x.stroke();
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 3;
      x.save(); x.translate(c.x, c.y); x.rotate(a + Math.PI / 2);
      const lg = x.createLinearGradient(0, 0, 0, -c.r * 1.2);
      lg.addColorStop(0, "#4c8a2a"); lg.addColorStop(1, "#86c650");
      x.fillStyle = lg;
      x.beginPath(); x.moveTo(0, 0);
      x.bezierCurveTo(-c.r * .9, -c.r * .3, -c.r * .9, -c.r * 1.25, -c.r * .02, -c.r * .95);
      x.bezierCurveTo(c.r * .9, -c.r * 1.25, c.r * .9, -c.r * .3, 0, 0);
      x.fill();
      x.strokeStyle = "rgba(255,250,200,.4)"; x.lineWidth = 1.4; x.stroke();
      x.strokeStyle = "rgba(220,245,190,.5)"; x.lineWidth = 1;
      x.beginPath(); x.moveTo(0, -2); x.lineTo(0, -c.r * .85); x.stroke();
      x.restore();
    }
  }

  function makeBlade() {
    return {
      x: rand(-10, W + 10), h: rand(H * .3, H * .7), w: rand(6, 13), lean: rand(-60, 60),
      ph: rand(0, 6.28), sp: rand(.6, 1.1), amp: rand(6, 14),
      c0: pick(["#4c8a2e", "#5a9a34", "#437c27"]), c1: pick(["#8cc85a", "#9ad064", "#7fbd4e"])
    };
  }
  function bladeGeom(b, t) {
    const sway = Math.sin(t * b.sp + b.ph) * b.amp + Math.sin(t * .4) * b.amp * .5;
    return { x0: b.x, y0: gY + 6, cx: b.x + b.lean * .3 + sway * .3, cy: gY - b.h * .55, tx: b.x + b.lean + sway, ty: gY - b.h };
  }
  function bladePoint(g, u) {
    const v = 1 - u;
    return {
      x: v * v * g.x0 + 2 * v * u * g.cx + u * u * g.tx, y: v * v * g.y0 + 2 * v * u * g.cy + u * u * g.ty,
      dx: 2 * v * (g.cx - g.x0) + 2 * u * (g.tx - g.cx), dy: 2 * v * (g.cy - g.y0) + 2 * u * (g.ty - g.cy)
    };
  }
  function drawBlade(c, b, t) {
    const g = bladeGeom(b, t), w = b.w / 2;
    const lg = c.createLinearGradient(0, g.y0, 0, g.ty);
    lg.addColorStop(0, b.c0); lg.addColorStop(1, b.c1);
    c.fillStyle = lg;
    c.beginPath();
    c.moveTo(g.x0 - w, g.y0);
    c.quadraticCurveTo(g.cx - w * .6, g.cy, g.tx, g.ty);
    c.quadraticCurveTo(g.cx + w * .6, g.cy, g.x0 + w, g.y0);
    c.closePath(); c.fill();

    c.strokeStyle = "rgba(255,252,210,.45)"; c.lineWidth = Math.max(.8, w * .22);
    c.beginPath(); c.moveTo(g.x0 - w * .9, g.y0); c.quadraticCurveTo(g.cx - w * .55, g.cy, g.tx, g.ty); c.stroke();
    return g;
  }
  function makeNearSprites() {
    nearSpr = [0, 1, 2].map(k => soft(90, 700, 6, x => {
      const lg = x.createLinearGradient(0, 700, 0, 0);
      lg.addColorStop(0, "#1f4614"); lg.addColorStop(1, k === 1 ? "#4f8a2a" : "#3d7522");
      x.fillStyle = lg;
      const lean = k === 2 ? -20 : 20;
      x.beginPath(); x.moveTo(10, 700); x.quadraticCurveTo(30 + lean * .3, 300, 45 + lean, 0); x.quadraticCurveTo(60 + lean * .3, 300, 80, 700); x.closePath(); x.fill();
      x.fillStyle = "rgba(255,250,200,.25)";
      x.beginPath(); x.moveTo(14, 700); x.quadraticCurveTo(32 + lean * .3, 300, 45 + lean, 0); x.quadraticCurveTo(36, 300, 26, 700); x.closePath(); x.fill();
    }));
    nearBlades = Array.from({ length: isSmall() ? 4 : 6 }, (_, i) => ({
      x: i % 2 ? rand(W * .86, W + 40) : rand(-40, W * .14), w: rand(70, 120), h: rand(H * .7, H * 1.05),
      spr: i % 3, ph: rand(0, 6), sp: rand(.4, .7), amp: rand(.03, .06)
    }));
  }

  function drawLadybug(c, x, y, ang, s, open, t) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.strokeStyle = "#1a1210"; c.lineWidth = Math.max(1.2, s * .09);
    for (let i = -1; i <= 1; i++) for (const side of [-1, 1]) {
      const k = Math.sin(t * 14 + i * 2 + (side > 0 ? 1.5 : 0)) * (open ? 0 : s * .15);
      c.beginPath(); c.moveTo(side * s * .5, i * s * .45); c.lineTo(side * s * 1.05, i * s * .55 + k); c.stroke();
    }
    if (open > 0) {
      c.globalAlpha = .45 * open;
      c.fillStyle = "#e9f2ff";
      const f = Math.abs(Math.sin(t * 40)) * .5 + .5;
      for (const side of [-1, 1]) { c.beginPath(); c.ellipse(side * s * 1.2 * open, s * .2, s * 1.1 * f, s * .5, side * .5, 0, 6.283); c.fill(); }
      c.globalAlpha = 1;
    }
    c.fillStyle = "#1a1210";
    c.beginPath(); c.arc(0, -s * .85, s * .48, Math.PI, 0); c.lineTo(s * .48, -s * .7); c.lineTo(-s * .48, -s * .7); c.fill();
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(-s * .22, -s * .95, s * .1, 0, 6.283); c.arc(s * .22, -s * .95, s * .1, 0, 6.283); c.fill();
    const g = c.createRadialGradient(-s * .3, -s * .4, 0, 0, 0, s);
    g.addColorStop(0, "#ff7a5c"); g.addColorStop(.6, "#e0281c"); g.addColorStop(1, "#9a120c");
    const spots = [[-.45, -.2], [.45, -.2], [-.5, .35], [.5, .35], [-.2, .62], [.2, .62]];
    for (const side of [-1, 1]) {
      c.save(); c.translate(0, -s * .55); c.rotate(side * open * 1.1); c.translate(0, s * .55);
      c.fillStyle = g;
      c.beginPath(); c.moveTo(0, -s * .62);
      c.bezierCurveTo(side * s * 1.1, -s * .7, side * s * 1.05, s * .9, 0, s * .95);
      c.closePath(); c.fill();
      c.fillStyle = "#1a1210";
      for (const [sx, sy] of spots) if (Math.sign(sx) === side) { c.beginPath(); c.arc(sx * s, sy * s, s * .15, 0, 6.283); c.fill(); }
      c.restore();
    }
    if (open < .05) {
      c.fillStyle = "#1a1210"; c.beginPath(); c.arc(0, -s * .45, s * .17, 0, 6.283); c.fill();
      c.strokeStyle = "rgba(40,10,5,.6)"; c.lineWidth = Math.max(1, s * .06);
      c.beginPath(); c.moveTo(0, -s * .62); c.lineTo(0, s * .95); c.stroke();
      c.fillStyle = "rgba(255,255,255,.6)";
      c.beginPath(); c.ellipse(-s * .35, -s * .25, s * .2, s * .09, -.6, 0, 6.283); c.fill();
      c.fillStyle = "rgba(255,250,210,.35)";
      c.beginPath(); c.ellipse(s * .55, s * .3, s * .12, s * .4, .3, 0, 6.283); c.fill();
    }
    c.restore();
  }

  function drawMonarch(c, b, t) {
    const s = b.size * b.z;
    const flap = Math.abs(Math.cos(t * (b.landed ? 2.5 : b.mode === "follow" ? 17 : 11) + b.ph));
    const open = b.landed ? .3 + flap * .55 : .15 + flap * .85;
    c.save(); c.translate(b.x, b.y); c.rotate(b.ang);
    for (const side of [-1, 1]) {
      c.save(); c.scale(side * open, 1);
      const g = c.createLinearGradient(0, 0, s * 1.3, -s);
      g.addColorStop(0, "#c95a0c"); g.addColorStop(.5, "#f0861a"); g.addColorStop(1, "#ffb347");
      c.beginPath(); c.moveTo(0, -1);
      c.bezierCurveTo(s * .4, -s * 1.3, s * 1.5, -s * 1.2, s * 1.25, -s * .15);
      c.bezierCurveTo(s * 1.1, s * .1, s * .4, s * .08, 0, 0); c.closePath();
      c.fillStyle = g; c.fill();
      c.strokeStyle = "#1c1210"; c.lineWidth = s * .09; c.stroke();
      c.lineWidth = s * .045;
      c.beginPath(); c.moveTo(s * .1, -s * .1); c.quadraticCurveTo(s * .6, -s * .8, s * 1.15, -s * .85);
      c.moveTo(s * .1, -s * .05); c.quadraticCurveTo(s * .7, -s * .45, s * 1.2, -s * .35);
      c.moveTo(s * .15, 0); c.lineTo(s * 1.0, -s * .05); c.stroke();
      c.fillStyle = "#fff";
      for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(s * (1.0 + i * .06), -s * (.95 - i * .22), s * .045, 0, 6.283); c.fill(); }
      c.beginPath(); c.moveTo(0, 0);
      c.bezierCurveTo(s * .6, s * .05, s * 1.1, s * .5, s * .75, s * .95);
      c.bezierCurveTo(s * .4, s * 1.1, s * .1, s * .6, 0, s * .2); c.closePath();
      c.fillStyle = g; c.fill();
      c.strokeStyle = "#1c1210"; c.lineWidth = s * .09; c.stroke();
      c.lineWidth = s * .045;
      c.beginPath(); c.moveTo(s * .1, s * .1); c.quadraticCurveTo(s * .5, s * .45, s * .7, s * .85); c.moveTo(s * .1, s * .08); c.lineTo(s * .85, s * .45); c.stroke();
      c.restore();
    }
    c.fillStyle = "#1c1210";
    c.beginPath(); c.ellipse(0, s * .15, s * .11, s * .62, 0, 0, 6.283); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(-s * .04, -s * .3, s * .03, 0, 6.283); c.arc(s * .04, -s * .1, s * .03, 0, 6.283); c.fill();
    c.strokeStyle = "#1c1210"; c.lineWidth = .9;
    c.beginPath(); c.moveTo(0, -s * .4); c.quadraticCurveTo(-s * .2, -s * .85, -s * .38, -s); c.moveTo(0, -s * .4); c.quadraticCurveTo(s * .2, -s * .85, s * .38, -s); c.stroke();
    c.restore();
  }

  function drawAnt(c, a, t, x, y, s, face) {
    const walk = a.wave > 0 ? 0 : t * (a.fast ? 26 : 13) + a.ph;
    c.save(); c.translate(x, y);
    c.fillStyle = "rgba(20,10,0,.22)"; c.beginPath(); c.ellipse(0, s * .25, s * 1.3, s * .22, 0, 0, 6.283); c.fill();
    if (a.sign) {
      c.save(); c.translate(s * .9, -s * 1.1);
      c.strokeStyle = "#7a5230"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -s * 3.9); c.stroke();
      const bw = s * 6.4, bh = s * 2.1, by = -s * 3.9 - bh + Math.sin(t * 5) * 1.2;
      const wg = c.createLinearGradient(0, by, 0, by + bh);
      wg.addColorStop(0, "#ecc48a"); wg.addColorStop(1, "#b98048");
      c.fillStyle = "rgba(60,30,0,.2)"; c.fillRect(-bw / 2 + 2, by + 3, bw, bh);
      c.fillStyle = wg;
      c.beginPath(); if (c.roundRect) c.roundRect(-bw / 2, by, bw, bh, 4); else c.rect(-bw / 2, by, bw, bh); c.fill();
      c.strokeStyle = "#8a5a2c"; c.lineWidth = 1.2; c.stroke();
      c.fillStyle = "#4a2c14"; c.font = `800 ${Math.round(s * .95)}px Nunito, system-ui, sans-serif`;
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(a.sign, 0, by + bh / 2 + 1);
      c.restore();
    }
    c.scale(face || 1, 1);
    if (a.leaf) {
      c.save(); c.translate(s * .95, -s * 1.25); c.rotate(-.5 + Math.sin(walk * .5) * .06);
      const sg = c.createRadialGradient(-s * .15, -s * .15, 0, 0, 0, s * .5);
      sg.addColorStop(0, "#f3d79a"); sg.addColorStop(1, a.leaf);
      c.fillStyle = sg; c.beginPath(); c.ellipse(0, 0, s * .48, s * .3, 0, 0, 6.283); c.fill();
      c.strokeStyle = "rgba(90,50,10,.35)"; c.lineWidth = .8; c.beginPath(); c.moveTo(-s * .35, 0); c.lineTo(s * .35, 0); c.stroke();
      c.restore();
    }
    if (a.crumb) {
      c.save(); c.translate(s * .7, -s * 2.1); c.rotate(-.12 + Math.sin(walk * .5) * .05);
      const cg = c.createLinearGradient(0, -s * 1.2, 0, s * .8);
      cg.addColorStop(0, "#fff3c4"); cg.addColorStop(.35, "#f5d47c"); cg.addColorStop(1, "#d9a24a");
      c.fillStyle = cg;
      c.beginPath();
      c.moveTo(-s * 1.4, s * .7); c.lineTo(-s * 1.6, -s * .2); c.lineTo(-s * 1.0, -s * 1.1); c.lineTo(s * .1, -s * 1.3);
      c.lineTo(s * 1.2, -s * .9); c.lineTo(s * 1.6, s * .1); c.lineTo(s * 1.1, s * .8); c.closePath(); c.fill();
      c.fillStyle = "#ffffff"; c.beginPath(); c.ellipse(-s * .2, -s * 1.15, s * 1.1, s * .25, -.1, 0, 6.283); c.fill();
      c.fillStyle = "rgba(160,100,30,.35)";
      for (const [px, py] of [[-.6, .1], [.3, -.3], [.8, .3], [-.2, .5]]) { c.beginPath(); c.arc(px * s, py * s, s * .12, 0, 6.283); c.fill(); }
      c.restore();
    }
    c.strokeStyle = "#4a1a0c"; c.lineWidth = Math.max(1, s * .1); c.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const bx = -s * .1 + i * s * .3, k = Math.sin(walk + i * 2.1) * s * .35;
      c.beginPath(); c.moveTo(bx, -s * .45); c.lineTo(bx + k - s * .2, -s * .1); c.lineTo(bx + k * 1.2 - s * .1, s * .25); c.stroke();
    }
    const body = c.createLinearGradient(0, -s, 0, 0);
    body.addColorStop(0, "#b4482a"); body.addColorStop(1, "#6e2412");
    c.fillStyle = body;
    c.beginPath(); c.ellipse(-s * .75, -s * .55, s * .5, s * .38, -.2, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(s * .1, -s * .62, s * .38, s * .2, 0, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(s * .72, -s * .78, s * .3, s * .27, .2, 0, 6.283); c.fill();
    c.fillStyle = "rgba(255,220,190,.4)";
    c.beginPath(); c.ellipse(-s * .85, -s * .74, s * .2, s * .09, -.2, 0, 6.283); c.fill();
    const wv = a.wave > 0 ? Math.sin(t * 18) * .5 : Math.sin(t * 4 + a.ph) * .12;
    c.strokeStyle = "#4a1a0c"; c.lineWidth = Math.max(.8, s * .07);
    c.beginPath(); c.moveTo(s * .85, -s * .95); c.quadraticCurveTo(s * 1.15, -s * (1.5 + wv), s * (1.45 + wv * .3), -s * (1.35 + wv));
    c.moveTo(s * .8, -s * .95); c.quadraticCurveTo(s * 1.0, -s * (1.55 - wv), s * (1.25 - wv * .3), -s * (1.6 - wv)); c.stroke();
    c.restore();
  }

  function drawBee(c, b, t) {
    const s = b.s * b.z;
    c.save(); c.translate(b.x, b.y); c.scale(b.dir, 1);
    c.globalAlpha = .55; c.fillStyle = "#f2fbff";
    const f = .6 + Math.abs(Math.sin(t * 60)) * .4;
    c.beginPath(); c.ellipse(-s * .1, -s * .9, s * .55 * f, s * .9, -.4, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(s * .3, -s * .8, s * .45 * f, s * .75, .3, 0, 6.283); c.fill();
    c.globalAlpha = 1;
    const g = c.createLinearGradient(0, -s * .5, 0, s * .5);
    g.addColorStop(0, "#f7cf5a"); g.addColorStop(1, "#c98d1c");
    c.fillStyle = g; c.beginPath(); c.ellipse(-s * .25, 0, s * .75, s * .45, 0, 0, 6.283); c.fill();
    c.strokeStyle = "rgba(90,50,10,.55)"; c.lineWidth = s * .14;
    c.beginPath(); c.moveTo(-s * .45, -s * .38); c.lineTo(-s * .45, s * .38); c.moveTo(-s * .8, -s * .3); c.lineTo(-s * .8, s * .3); c.stroke();
    c.fillStyle = "#3a2a14"; c.beginPath(); c.arc(s * .55, -s * .05, s * .38, 0, 6.283); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(s * .66, -s * .15, s * .09, 0, 6.283); c.fill();
    c.strokeStyle = "#3a2a14"; c.lineWidth = .8;
    c.beginPath(); c.moveTo(s * .7, -s * .3); c.quadraticCurveTo(s * .9, -s * .8, s * 1.1, -s * .75); c.stroke();
    c.restore();
  }

  function drawDaisy(c, t) {
    const sw = Math.sin(t * .9) * 4;
    const hx = daisy.x + sw, hy = daisy.y;
    c.fillStyle = "rgba(30,20,5,.22)"; c.beginPath(); c.ellipse(daisy.x - 4, gY + 5, 16, 4, 0, 0, 6.283); c.fill();
    c.strokeStyle = "#4e8a2a"; c.lineWidth = 2.6; c.lineCap = "round";
    c.beginPath(); c.moveTo(daisy.x - 6, gY + 4); c.quadraticCurveTo(daisy.x - 12, (gY + hy) / 2, hx, hy); c.stroke();
    c.save(); c.translate(hx, hy); c.scale(1, .82);
    const r = daisy.r;
    for (let i = 0; i < 18; i++) {
      c.save(); c.rotate(i / 18 * Math.PI * 2);
      const pg = c.createLinearGradient(0, 0, r, 0);
      pg.addColorStop(0, "#ece6f2"); pg.addColorStop(1, "#ffffff");
      c.fillStyle = pg;
      c.beginPath(); c.ellipse(r * .55, 0, r * .5, r * .12, 0, 0, 6.283); c.fill();
      c.restore();
    }
    const cg = c.createRadialGradient(-r * .1, -r * .1, 0, 0, 0, r * .3);
    cg.addColorStop(0, "#ffe06a"); cg.addColorStop(1, "#e9a21c");
    c.fillStyle = cg; c.beginPath(); c.arc(0, 0, r * .3, 0, 6.283); c.fill();
    c.restore();
    daisy.hx = hx; daisy.hy = hy;
  }

  function drawSnail(c, sn, t) {
    const s = sn.s * sn.z, ext = sn.ext;
    c.save(); c.translate(sn.x, sn.y);
    c.fillStyle = "rgba(20,10,0,.25)"; c.beginPath(); c.ellipse(0, s * .1, s * 1.6, s * .25, 0, 0, 6.283); c.fill();
    c.scale(sn.dir, 1);
    if (ext > .02) {
      const bg = c.createLinearGradient(0, -s * .5, 0, 0);
      bg.addColorStop(0, "#e0cba8"); bg.addColorStop(1, "#9c8466");
      c.fillStyle = bg;
      const len = s * 2.2 * ext;
      c.beginPath();
      c.moveTo(-s * .9, 0); c.lineTo(-s * .2 + len, 0);
      c.quadraticCurveTo(len + s * .25, -s * .05, len + s * .05, -s * .45);
      c.quadraticCurveTo(len - s * .2, -s * .65, len - s * .5, -s * .45);
      c.lineTo(-s * .9, -s * .35); c.closePath(); c.fill();
      const st = s * .8 * ext, wob = Math.sin(t * 2 + sn.ph) * .15;
      c.strokeStyle = "#9c8466"; c.lineWidth = s * .12; c.lineCap = "round";
      for (const k of [0, 1]) {
        const ax = len - s * .1 + k * s * .18, ay = -s * .45;
        const ex = ax + Math.sin(.35 + k * .3 + wob) * st, ey = ay - Math.cos(.35 + k * .3 + wob) * st;
        c.beginPath(); c.moveTo(ax, ay); c.lineTo(ex, ey); c.stroke();
        c.fillStyle = "#3a2a1c"; c.beginPath(); c.arc(ex, ey, s * .1, 0, 6.283); c.fill();
      }
    }
    const shx = -s * .25, shy = -s * .9, R = s * .95;
    const sg = c.createRadialGradient(shx - R * .3, shy - R * .3, 0, shx, shy, R);
    sg.addColorStop(0, "#f6d39a"); sg.addColorStop(.6, "#c4823e"); sg.addColorStop(1, "#7e4a1c");
    c.fillStyle = sg; c.beginPath(); c.arc(shx, shy, R, 0, 6.283); c.fill();
    c.strokeStyle = "rgba(90,50,20,.7)"; c.lineWidth = s * .09;
    c.beginPath();
    for (let a = 0; a < Math.PI * 5.2; a += .12) {
      const rr = R * .92 * Math.exp(-a * .17);
      const px = shx + Math.cos(a + 2.4) * rr, py = shy + Math.sin(a + 2.4) * rr;
      if (a === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.stroke();
    c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(shx - R * .4, shy - R * .45, R * .25, R * .12, -.6, 0, 6.283); c.fill();
    c.restore();
  }

  function drawDew(c, t) {
    const dx = clover.x + clover.r * .45, dy = clover.y - clover.r * .75, r = clover.r * .2;
    const g = c.createRadialGradient(dx - r * .3, dy - r * .35, r * .1, dx, dy, r);
    g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(.35, "rgba(200,240,255,.35)");
    g.addColorStop(.8, "rgba(120,190,120,.35)"); g.addColorStop(1, "rgba(60,120,60,.55)");
    c.fillStyle = g; c.beginPath(); c.arc(dx, dy, r, 0, 6.283); c.fill();
    c.fillStyle = `rgba(255,255,255,${.7 + Math.sin(t * 2) * .3})`;
    c.beginPath(); c.arc(dx - r * .35, dy - r * .4, r * .18, 0, 6.283); c.fill();
  }

  function heartXY(a) {
    return { x: 16 * Math.pow(Math.sin(a), 3), y: -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) };
  }
  function updateHint() {
    hint(special ? T_GRAMA.segue + " · " + T_GRAMA.contador(found.size) : T_GRAMA.contador(found.size));
  }
  function reveal(key) {
    info(T_GRAMA.bichos[key]);
    if (!found.has(key)) { found.add(key); sfx.chime(found.size + 1); }
    updateHint();
  }

  async function ladyClose() {
    if (busy.lady) return; busy.lady = true;
    sfx.whoosh(.9);
    lady.close = { t: 0, x0: lady.x, y0: lady.y, a0: lady.ang, shown: false };
  }
  function updateLadyClose(dt, t) {
    const L = lady.close; L.t += dt;
    const BIG = isSmall() ? 7.5 : 8.5, cx = W / 2, cy = H * .47;
    if (L.t < 1) {
      const p = clamp(L.t / 1);
      const e = easeOutBack(p);
      lady.vx = lerp(L.x0, cx, easeInOut(p)); lady.vy = lerp(L.y0, cy, easeInOut(p)) - Math.sin(Math.PI * p) * H * .12;
      lady.vs = lerp(1, BIG, e); lady.vopen = 1 - Math.pow(p, 4) * .9; lady.vang = lerp(L.a0, 0, p);
      veil = p; lady.valpha = 1;
    } else if (L.t < 2.8) {
      if (!L.shown) {
        L.shown = true; reveal("joaninha"); sfx.boing();
        sparkle(cx, cy, 16, { shape: "heart", colors: ["#ff6a7c", "#ffc2cf", "#ffffff"], speed: 150, gravity: -10, size: 4, life: 1.6 });
      }
      const q = L.t - 1;
      lady.vx = cx; lady.vy = cy; lady.vs = BIG; veil = 1; lady.valpha = 1;
      lady.vopen = clamp((q - .3) * 2.5) * (.42 + Math.sin(q * 9) * .06);
      lady.vang = Math.sin(q * 13) * .32 * Math.exp(-q * 1.8);
    } else if (L.t < 3.8) {
      const p = (L.t - 2.8) / 1;
      lady.vopen = 1; lady.vx = lerp(cx, W * 1.15, easeIn(p)); lady.vy = lerp(cy, -H * .15, easeIn(p));
      lady.vs = BIG * (1 + p * .8); lady.vang = p * .8; lady.valpha = 1 - p; veil = 1 - p;
    } else {
      lady.close = null; veil = 0; busy.lady = false;
      lady.u = .3; lady.dir = 1; lady.fade = 0;
    }
  }

  function monFollow() {
    if (mon.mode === "follow" || mon.mode === "land") return;
    mon.mode = "follow"; mon.timer = 5;
    sfx.sparkle(); reveal("borboleta");
  }

  async function antHeart() {
    if (heart.on || leaving) return;
    heart.on = true; sfx.sparkle();
    const cx = W / 2, cy = gY + (H - gY) * .34, u = Math.min(W * .32, 160) / 16, uy = u * .48;
    const pts = [];
    for (let i = 0; i < ants.length; i++) { const p = heartXY(i / ants.length * Math.PI * 2); pts.push({ x: cx + p.x * u, y: cy + p.y * uy }); }
    const byX = [...ants].sort((a, b) => a.x - b.x), ptsX = [...pts].sort((a, b) => a.x - b.x);
    byX.forEach((a, i) => { a.tx = ptsX[i].x; a.ty = ptsX[i].y; });
    await animate(1600, p => heart.hb = p, easeInOut);
    sfx.chime(6); sfx.chime(8);
    sparkle(cx, cy - 10, 26, { shape: "heart", colors: ["#ff7a9a", "#ffc2d4", "#ffffff"], speed: 120, gravity: -20, size: 3.4, life: 1.8 });
    await animate(500, p => heart.glow = p);
    await wait(1700);
    reveal("formiga");
    await wait(600);
    await animate(1300, p => { heart.hb = 1 - p; heart.glow = 1 - p; }, easeInOut);
    heart.on = false;
  }

  async function beeHeart() {
    if (bee.mode === "heart") return;
    bee.mode = "heart"; bee.hp = 0; sfx.boing();
    await animate(3600, p => bee.hp = p, easeInOut);
    bee.mode = "land";
    reveal("abelha");
    await wait(3000);
    bee.mode = "hover";
  }

  const LIA_STROKES = [
    [[.34, .06], [.12, -.02], [.04, .3], [.18, .55], [.27, .72], [.12, .96], [.03, .92], [-.04, .88], [.07, .79], [.21, .85], [.33, .9], [.44, .95], [.56, .89]],
    [[.66, .16], [.73, .1], [.85, .1], [.93, .15]],
    [[.8, .14], [.79, .4], [.76, .66], [.71, .92]],
    [[1.02, .92], [1.13, .62], [1.24, .26], [1.36, .07], [1.47, .3], [1.57, .62], [1.7, .9], [1.75, .97], [1.85, .9], [1.9, .82]],
    [[1.16, .61], [1.29, .55], [1.45, .55], [1.6, .62]]
  ];
  let word = null;
  function buildWord() {
    const h = Math.min(92, (H - gY) * .56), w = 1.9 * h;
    const ox = W / 2 - w / 2, oy = gY + (H - gY) * .2;
    const strokes = LIA_STROKES.map(cp => {
      const pts = [];
      for (let i = 0; i + 3 < cp.length; i += 3) {
        const [a, b, c2, d] = [cp[i], cp[i + 1], cp[i + 2], cp[i + 3]];
        for (let k = (i ? 1 : 0); k <= 40; k++) {
          const u = k / 40, v = 1 - u;
          const x = v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c2[0] + u * u * u * d[0];
          const y = v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c2[1] + u * u * u * d[1];
          pts.push({ x: ox + x * h, y: oy + y * h });
        }
      }
      let L = 0; pts[0].l = 0;
      for (let i = 1; i < pts.length; i++) { L += dist(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y); pts[i].l = L; }
      return { pts, len: L };
    });
    const total = strokes.reduce((s, k) => s + k.len, 0);
    return { strokes, total, prog: 0, born: 0, tip: strokes[0].pts[0] };
  }
  function drawWord(c, t) {
    if (!word) return;
    const age = TIME - word.born, fade = age > 18 ? clamp(1 - (age - 18) / 3) : 1;
    if (fade <= 0) { word = null; return; }
    let left = word.prog * word.total;
    c.save(); c.lineCap = "round"; c.lineJoin = "round";
    c.globalCompositeOperation = "lighter";
    const paths = [];
    for (const s of word.strokes) {
      if (left <= 0) break;
      const upto = Math.min(left, s.len); left -= s.len;
      const pts = [];
      for (const p of s.pts) { if (p.l > upto) break; pts.push(p); }
      if (pts.length > 1) paths.push(pts);
    }
    const pass = (w, col, a) => {
      c.strokeStyle = col; c.lineWidth = w; c.globalAlpha = a * fade;
      for (const pts of paths) { c.beginPath(); c.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y); c.stroke(); }
    };
    pass(14, "#ffcf5a", .16); pass(7, "#ffe28a", .3); pass(2.8, "#fff8e0", .95);

    let n = 0;
    for (const pts of paths) for (let i = 0; i < pts.length; i += 6) {
      const tw = .5 + .5 * Math.sin(t * 6 + i * 1.7 + n);
      c.globalAlpha = tw * fade; c.fillStyle = (i + n) % 3 ? "#ffffff" : "#ffd1e6";
      c.beginPath(); c.arc(pts[i].x + Math.sin(i) * 3, pts[i].y + Math.cos(i * 1.3) * 3, .8 + tw * 1.4, 0, 6.283); c.fill();
      n++;
    }
    c.restore();
  }
  function wordTip(prog) {
    let left = prog * word.total;
    for (const s of word.strokes) {
      if (left <= s.len) { for (const p of s.pts) if (p.l >= left) return p; return s.pts[s.pts.length - 1]; }
      left -= s.len;
    }
    const last = word.strokes[word.strokes.length - 1].pts; return last[last.length - 1];
  }
  async function snailWrite() {
    if (busy.snail) return; busy.snail = true;
    snail.hiding = true;
    await animate(350, p => snail.ext = 1 - p);
    await wait(500);
    await animate(700, p => snail.ext = p, easeOut);
    word = buildWord(); word.born = TIME + 30;
    const st = word.strokes[0].pts[0];
    const x0 = snail.x, y0 = snail.y;
    sfx.sparkle();
    await animate(1000, p => { snail.x = lerp(x0, st.x, p); snail.y = lerp(y0, st.y, p); snail.dir = st.x >= x0 ? 1 : -1; snail.z = lerp(1, 1.3, p); }, easeInOut);
    word.born = TIME;
    await animate(5200, p => {
      word.prog = p;
      const h = wordTip(p);
      snail.x += (h.x - snail.x) * .3; snail.y += (h.y - snail.y) * .3; snail.dir = 1;
      if (Math.random() < .3) sparkle(h.x, h.y, 2, { colors: ["#fff6c2", "#ffffff", "#ffd1e6"], speed: 28, gravity: -18, size: 1.4, life: .9 });
    }, easeInOut);
    word.prog = 1;
    reveal("caracol");
    sfx.chime(7);
    await wait(1600);
    const x1 = snail.x, y1 = snail.y;
    await animate(2200, p => { snail.x = lerp(x1, W * .8, p); snail.y = lerp(y1, gY + 2, p); snail.z = lerp(1.35, 1, p); snail.dir = 1; }, easeInOut);
    snail.hiding = false; busy.snail = false;
  }

  async function spawnSpecial(my) {
    special = { x: -60, s: 14, ph: 0, leaf: null, crumb: true, sign: T_GRAMA.placa, wave: 0, fast: false, stop: false };
    await animate(3500, p => { if (special) special.x = lerp(-60, W * .36, p); }, easeOut);
    if (!special || my !== tok) return;
    special.stop = true;
    await speakLines(T_GRAMA.formiguinha, () => special ? { x: special.x + special.s * .8, y: gY - special.s * 6.6 } : { x: W * .36, y: gY - 90 });
    if (my !== tok || leaving) return;
    updateHint();
    await wait(8000);
    if (my === tok && !leaving) march();
  }
  async function march() {
    if (leaving || !special) return;
    leaving = true;
    const my = tok;
    hideInfo(); unsay(); hint("");
    sfx.boing();
    sparkle(special.x, gY - 30, 14, { shape: "heart", colors: ["#ff8fb0", "#ffd36b"], speed: 70, gravity: -10, size: 3, life: 1.4 });
    special.stop = false; special.fast = true;
    for (const a of ants) a.fast = true;
    marchSpeed = 120;
    const st = setInterval(() => sfx.step(), 150);
    await wait(700);
    sfx.whoosh(2.4);
    fadeColor = "#fff1d6";
    await animate(2400, p => pull = p, easeInOut);
    clearInterval(st);
    if (my === tok) go("piquenique", { color: "#fff1d6", out: 500 });
  }

  S.grama = {
    music: "grama",
    tone: "light",
    init() {
      gY = H * .78;
      clover = { x: W * .2, y: gY - H * .2, r: isSmall() ? 30 : 38 };
      daisy = { x: W * .74, y: gY - H * .25, r: isSmall() ? 34 : 42, hx: 0, hy: 0 };
      buildBg(); buildGround(); makeNearSprites();
      midBlades = Array.from({ length: Math.ceil(W / 26) }, makeBlade);
      lbBlade = { x: W * .44, h: H * .44, w: 16, lean: W * .1, ph: 1, sp: .7, amp: 7, c0: "#3f7d26", c1: "#8fcc5a" };
      bokeh = Array.from({ length: 14 }, () => ({ x: rand(0, W), y: rand(0, gY), r: rand(6, 22), ph: rand(0, 6.28), vx: rand(-4, 4), vy: rand(-3, 3) }));
      const sm = isSmall() ? 1.8 : 1.3;
      if (!lady) lady = { u: .3, dir: 1, open: 0, close: null, fade: 1 };
      lady.s = 11 * sm;
      if (!mon) mon = { x: W * .6, y: H * .4, ph: rand(0, 6), ang: 0, mode: "wander", timer: 0, z: 1, landed: false };
      mon.size = 24 * (isSmall() ? 1.5 : 1.2);
      if (!bee) bee = { x: daisy.x, y: daisy.y, dir: 1, mode: "hover", hp: 0, z: 1 };
      bee.s = 8 * sm;
      if (!snail) snail = { x: W * .82, y: gY + 2, dir: -1, ext: 1, ph: 0, hiding: false, z: 1 };
      snail.s = 14 * (isSmall() ? 1.5 : 1.2); if (!busy.snail) snail.y = gY + 2;
      if (!ants.length) {
        for (let i = 0; i < 14; i++) ants.push({ x: i * W / 14 + rand(-6, 6), s: 0, ph: rand(0, 6), leaf: pick(["#c8913f", "#b67a2e", "#d9a85a", "#a86f2a"]), wave: 0, fast: false, tx: 0, ty: 0, face: 1, px: 0 });
      }
      for (const a of ants) a.s = isSmall() ? 13 : 13;
    },
    enter() {
      const my = ++tok;
      const alive = () => curName === "grama" && tok === my;
      found = new Set(); elapsed = 0; leaving = false; special = null; marchSpeed = 22; pull = 0; veil = 0;
      heart = { on: false, hb: 0, glow: 0 }; trail = []; glitter = []; busy = {}; word = null;
      lady.close = null; lady.fade = 1; mon.mode = "wander"; bee.mode = "hover"; snail.hiding = false; snail.ext = 1; snail.y = gY + 2; snail.z = 1;
      for (const a of ants) { a.fast = false; a.wave = 0; }
      updateHint();
      (async () => {
        await wait(1200); if (!alive()) return;
        await narrate(T_GRAMA.linhas, { keepLast: true });
      })();
    },
    exit() { tok++; special = null; pull = 0; veil = 0; },
    update(dt, t) {
      elapsed += dt;
      if (!special && !leaving && curName === "grama" && found.size >= 5) spawnSpecial(tok);

      const touching = TIME - touchT < 2.5 && pX >= 0;
      const tx = touching ? (pX - W / 2) / W * 38 : Math.sin(t * .13) * 10;
      const ty = touching ? (pY - H / 2) / H * 16 : Math.sin(t * .17) * 5;
      camX += (tx - camX) * Math.min(1, dt * 2.2); camY += (ty - camY) * Math.min(1, dt * 2.2);

      if (lady.close) updateLadyClose(dt, t);
      else {
        const lg = bladeGeom(lbBlade, t);
        lady.fade = Math.min(1, lady.fade + dt);
        lady.u += lady.dir * dt * .05;
        if (lady.u > .82) lady.dir = -1; if (lady.u < .28) lady.dir = 1;
        const bp = bladePoint(lg, lady.u);
        lady.x = bp.x; lady.y = bp.y;
        lady.ang = Math.atan2(bp.dy, bp.dx) + Math.PI / 2 + (lady.dir < 0 ? Math.PI : 0);
      }

      const wx = W * (.55 + Math.sin(t * .27 + mon.ph) * .3), wy = H * (.42 + Math.sin(t * .43 + 1) * .08) + Math.sin(t * 2.4) * 8;
      let mx = wx, my = wy, rate = 4;
      if (mon.mode === "follow") {
        mon.timer -= dt;
        mx = (pX >= 0 ? pX : mon.x) + Math.sin(t * 3) * 16; my = (pY >= 0 ? pY : mon.y) - 34 + Math.cos(t * 4) * 10; rate = 2.8;
        if (mon.timer <= 0) {
          mon.mode = "land"; mon.timer = 3; sfx.chime(5);
          const fx = clover.x + clover.r * .2, fy = clover.y - clover.r * 1.1, dxx = (daisy.hx || daisy.x), dyy = (daisy.hy || daisy.y) - daisy.r * .5;
          const near = dist(mon.x, mon.y, fx, fy) < dist(mon.x, mon.y, dxx, dyy);
          mon.lx = near ? fx : dxx; mon.ly = near ? fy : dyy;
        }
      } else if (mon.mode === "land") {
        mx = mon.lx; my = mon.ly; rate = 3.2; mon.timer -= dt;
        if (mon.timer <= 0) { mon.mode = "return"; mon.timer = 1.8; }
      } else if (mon.mode === "return") {
        rate = 1.6; mon.timer -= dt; if (mon.timer <= 0) mon.mode = "wander";
      }
      mon.ang += (clamp((mx - mon.x) * .012, -.5, .5) - mon.ang) * Math.min(1, dt * 5);
      mon.x += (mx - mon.x) * Math.min(1, dt * rate); mon.y += (my - mon.y) * Math.min(1, dt * rate);
      mon.landed = mon.mode === "land" && dist(mon.x, mon.y, mx, my) < 6;
      if (mon.landed) mon.ang *= .9;
      const zt = mon.mode === "follow" ? 1.35 : 1 + Math.sin(t * .6 + mon.ph) * .2;
      mon.z += (zt - mon.z) * Math.min(1, dt * 2);

      const dhx = daisy.hx || daisy.x, dhy = daisy.hy || daisy.y;
      let bx, by;
      if (bee.mode === "heart") {
        const u = isSmall() ? 3.6 : 4.4, hp = heartXY(bee.hp * Math.PI * 2);
        const hx = dhx + hp.x * u, hy = dhy - 78 + hp.y * u;
        const blend = clamp(bee.hp * 8);
        bx = lerp(bee.x, hx, blend); by = lerp(bee.y, hy, blend);
        trail.push({ x: bx, y: by, life: 1 });
        bee.z = 1.15;
      } else if (bee.mode === "land") {
        bx = lerp(bee.x, dhx, Math.min(1, dt * 3)); by = lerp(bee.y, dhy - bee.s * .6, Math.min(1, dt * 3));
        bee.z = 1;
      } else {
        bx = dhx + Math.cos(t * 1.7) * 26; by = dhy - 28 + Math.sin(t * 2.3) * 12;
        bx = lerp(bee.x, bx, Math.min(1, dt * 4)); by = lerp(bee.y, by, Math.min(1, dt * 4));
        bee.z = 1 + Math.sin(t * .8) * .15;
      }
      if (Math.abs(bx - bee.x) > .3) bee.dir = bx >= bee.x ? 1 : -1;
      bee.x = bx; bee.y = by;
      for (const p of trail) p.life -= dt / 6;
      trail = trail.filter(p => p.life > 0);

      if (!snail.hiding) {
        snail.ext = Math.min(1, snail.ext + dt * 1.2);
        snail.x += snail.dir * dt * 4;
        if (snail.x < W * .6) snail.dir = 1; if (snail.x > W * .9) snail.dir = -1;
      }

      const idle = TIME - touchT > 4;
      const lw = idle && !lady.close && Math.sin(t * .9) > .55 ? .45 + Math.sin(t * 9) * .08 : 0;
      lady.idleOpen = (lady.idleOpen || 0) + (lw - (lady.idleOpen || 0)) * Math.min(1, dt * 5);
      if (idle && !snail.hiding) snail.ext = .6 + .4 * (.5 + .5 * Math.cos(t * .8));

      for (const a of ants) {
        if (a.wave > 0) a.wave -= dt;
        else if (!heart.on) { a.x += marchSpeed * dt; if (a.x > W + 40 && !leaving) a.x = -40; }
        const ax = lerp(a.x, a.tx, heart.hb), ay = lerp(gY + 1, a.ty, heart.hb);
        if (Math.abs(ax - a.px) > .05) a.face = ax >= a.px ? 1 : -1;
        a.px = a.dx = ax; a.dy = ay;
      }
      if (special && !special.stop && special.fast) special.x += marchSpeed * dt;
      for (const b of bokeh) { b.x += b.vx * dt; b.y += b.vy * dt; if (b.x < -30) b.x = W + 30; if (b.x > W + 30) b.x = -30; }
    },
    draw(c, t) {
      if (pull > 0) {
        const bg = c.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, "#fff6e3"); bg.addColorStop(1, "#ffe7bf");
        c.fillStyle = bg; c.fillRect(0, 0, W, H);
        const s = 1 - .6 * pull;
        c.translate(W / 2 - (special ? (special.x - W / 2) * .4 * pull : 0), H * (1 - .3 * pull));
        c.scale(s, s); c.translate(-W / 2, -H);
      }

      c.drawImage(bgCv, -M - camX * .6, -M - camY * .6, W + 2 * M, H + 2 * M);
      c.save(); c.globalCompositeOperation = "lighter";
      for (let i = 0; i < 2; i++) {
        const sx = W * (.25 + i * .4) - camX * .4, a = .07 + Math.sin(t * .5 + i * 2) * .04;
        const lg = c.createLinearGradient(0, 0, 0, gY);
        lg.addColorStop(0, `rgba(255,250,215,${a})`); lg.addColorStop(1, "rgba(255,250,215,0)");
        c.fillStyle = lg; c.beginPath(); c.moveTo(sx, -10); c.lineTo(sx + W * .12, -10); c.lineTo(sx + W * .38, gY); c.lineTo(sx + W * .2, gY); c.closePath(); c.fill();
      }
      c.restore();

      c.save(); c.translate(-camX * .3, -camY * .3);
      for (const b of midBlades) drawBlade(c, b, t);
      c.restore();

      c.drawImage(groundCv, -M, -M, W + 2 * M, H + 2 * M);
      if (heart.glow > 0) {
        const cx = W / 2, cy = gY + (H - gY) * .34, u = Math.min(W * .32, 160) / 16, uy = u * .48;
        c.save(); c.globalCompositeOperation = "lighter";
        c.beginPath();
        for (let i = 0; i <= 60; i++) { const p = heartXY(i / 60 * Math.PI * 2); c.lineTo(cx + p.x * u, cy + p.y * uy); }
        c.strokeStyle = `rgba(255,140,180,${.28 * heart.glow})`; c.lineWidth = 14; c.stroke();
        c.strokeStyle = `rgba(255,220,235,${.7 * heart.glow})`; c.lineWidth = 2.5; c.stroke();
        c.restore();
      }
      drawWord(c, t);
      drawDaisy(c, t);
      drawBlade(c, lbBlade, t);
      drawDew(c, t);
      if (!lady.close) { c.globalAlpha = lady.fade; drawLadybug(c, lady.x, lady.y, lady.ang, lady.s, lady.idleOpen || 0, t); c.globalAlpha = 1; }
      drawSnail(c, snail, t);
      for (const a of ants) {
        const sc = a.s * (1 + (a.dy - gY) / (H - gY) * .7);
        drawAnt(c, a, t, a.dx, a.dy, sc, a.face);
      }
      if (special) drawAnt(c, special, t, special.x, gY + 1 - (special.stop ? Math.abs(Math.sin(t * 3.2)) * 2.5 : 0), special.s, 1);
      if (trail.length) {
        c.save(); c.globalCompositeOperation = "lighter";
        for (const p of trail) {
          c.globalAlpha = p.life * .3; c.fillStyle = "#ffcf4a"; c.beginPath(); c.arc(p.x, p.y, 6, 0, 6.283); c.fill();
          c.globalAlpha = p.life; c.fillStyle = "#fff3b8"; c.beginPath(); c.arc(p.x, p.y, 1.8, 0, 6.283); c.fill();
        }
        c.restore();
      }
      drawBee(c, bee, t);
      drawMonarch(c, mon, t);

      for (const b of nearBlades) {
        const side = b.x < W / 2 ? -1 : 1;
        c.save();
        c.translate(b.x + camX * .9 + side * pull * W * .9, H + 30 + camY * .5);
        c.rotate(Math.sin(t * b.sp + b.ph) * b.amp + side * pull * .3);
        c.drawImage(nearSpr[b.spr], -b.w / 2, -b.h, b.w, b.h);
        c.restore();
      }
      c.globalCompositeOperation = "lighter";
      for (const b of bokeh) {
        c.globalAlpha = .16 + Math.sin(t * .8 + b.ph) * .07;
        c.fillStyle = "#fffbe0"; c.beginPath(); c.arc(b.x + camX * 1.2, b.y + camY * .6, b.r, 0, 6.283); c.fill();
      }
      c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
      const v = c.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .3, W / 2, H * .45, Math.max(W, H) * .8);
      v.addColorStop(0, "rgba(40,60,20,0)"); v.addColorStop(1, "rgba(40,60,20,.28)");
      c.fillStyle = v; c.fillRect(0, 0, W, H);

      if (lady.close) {
        c.fillStyle = `rgba(250,252,235,${.38 * veil})`; c.fillRect(0, 0, W, H);
        const s = lady.s * lady.vs;
        if (lady.close && lady.close.t > .9 && lady.close.t < 2.8) {
          const sh = c.createRadialGradient(lady.vx + s * .25, lady.vy + s * .45, 0, lady.vx + s * .25, lady.vy + s * .45, s * 1.6);
          sh.addColorStop(0, `rgba(40,30,10,${.3 * veil})`); sh.addColorStop(1, "rgba(40,30,10,0)");
          c.fillStyle = sh; c.beginPath(); c.arc(lady.vx + s * .25, lady.vy + s * .45, s * 1.6, 0, 6.283); c.fill();
        }
        c.globalAlpha = clamp(lady.valpha);
        drawLadybug(c, lady.vx, lady.vy, lady.vang, s, lady.vopen, t);
        c.globalAlpha = 1;
      }
      if (pull > 0) {
        c.setTransform(DPR, 0, 0, DPR, 0, 0);
        c.globalAlpha = Math.pow(pull, 2.5); c.fillStyle = "#fff1d6"; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
      }
    },
    down(x, y) {
      touchT = TIME;
      if (leaving) return;
      const R = 44;
      if (special && dist(x, y, special.x + special.s, gY - special.s * 2) < R * 1.5) { march(); return; }
      if (!lady.close && dist(x, y, lady.x, lady.y) < Math.max(R, lady.s * 2.5)) { ladyClose(); return; }
      if (dist(x, y, mon.x, mon.y) < Math.max(R, mon.size * mon.z * 1.5)) { monFollow(); return; }
      if (dist(x, y, bee.x, bee.y) < Math.max(R, bee.s * 3)) { beeHeart(); return; }
      if (dist(x, y, snail.x, snail.y - snail.s * .8) < Math.max(R, snail.s * 2.2)) { snailWrite(); return; }
      let best = null, bd = R;
      for (const a of ants) { const d = dist(x, y, a.dx, a.dy - a.s); if (d < bd) { bd = d; best = a; } }
      if (best) { best.wave = 1.2; antHeart(); return; }
      sparkle(x, y, 6, { colors: ["#ffffff", "#fff3a8"], speed: 40, gravity: -10, size: 1.6, life: .9 });
    },
    move(x, y, isDown) { if (isDown) touchT = TIME; }
  };
})();
