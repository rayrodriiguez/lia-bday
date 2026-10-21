const T_PIQUENIQUE = {
  narracao: ["chegamos!", "eu sabia que tava faltando alguma coisa.", "um aniversário sem docinho não dá, né?", "pode escolher. hoje tá tudo liberado bb."],
  dicaDoces: "toca nos docinhos pra descobrir o que tem.",
  pedido: "fecha os olhos e faz um pedido. ✨",
  dicaVelas: "passa o dedo nas velinhas pra soprar",
  faltam: "faltam {n} velinhas",
  falta1: "só mais uma!",
  comeu: "pronto, agora sim. não ia deixar você ir embora sem comer nada KKKKK",

  desejo: ["pronto! agora é deixar o universo trabalhar.", "e espero, de coração, que a vida te surpreenda com coisas ainda melhores do que você pediu."],
  itens: {
    brigadeiro: { title: "brigadeiro", text: "um brigadeiro pra adoçar seu dia. como se você já não fosse doce o suficiente." },
    brownie: { title: "brownie de caneca", text: "a receita oficial da nossa amizade. poucos ingredientes, dois minutinhos e uma memória que ficou pra sempre." },
    cupcake: { title: "cupcake de morango", text: "esse aqui é só seu" },
    macarons: { title: "macarons", text: "um docinho pra cada desejo que eu tenho pra sua vida" },
    barbie: { title: "milkshake da Barbie", text: "rosa, óbvio. Barbie é patrimônio da nossa amizade." },
    vaso: { title: "girassóis", text: "peguei uns emprestados do jardim pra sua mesa ficar mais bonita." },
    bolo: { title: "o bolo", text: "esse aqui eu fiz pensando em você. agora falta a parte mais importante." }
  }
};

function pqLayer(res = 1, x0 = 0, y0 = 0, w = W, h = H) {
  const k = Math.min(DPR * res, 3);
  const cvs = document.createElement("canvas");
  cvs.width = Math.max(1, Math.round(w * k)); cvs.height = Math.max(1, Math.round(h * k));
  const c = cvs.getContext("2d"); c.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
  return { cvs, c, x0, y0, w, h };
}
function pqSoftSprite(size, stops) {
  const s = document.createElement("canvas"); s.width = s.height = size;
  const g = s.getContext("2d"), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  return s;
}
function pqAnt(c, x, y, s, t, ph) {
  const step = Math.sin(t * 14 + ph);
  c.strokeStyle = "#2a160c"; c.lineWidth = .9 * s; c.lineCap = "round";
  for (let i = -1; i <= 1; i++) {
    const sw = (i % 2 ? step : -step) * 1.6 * s;
    c.beginPath(); c.moveTo(x + i * 2.6 * s, y - 2 * s); c.lineTo(x + i * 3.6 * s + sw, y + 1.5 * s); c.stroke();
    c.beginPath(); c.moveTo(x + i * 2.6 * s, y - 2 * s); c.lineTo(x + i * 3 * s - sw, y + 1.8 * s); c.stroke();
  }
  c.beginPath(); c.moveTo(x + 6.5 * s, y - 4 * s); c.lineTo(x + 9.5 * s, y - 8 * s + step * .6 * s); c.stroke();
  c.fillStyle = "#3a1f10";
  c.beginPath(); c.ellipse(x - 5.5 * s, y - 2.4 * s, 3.4 * s, 2.5 * s, 0, 0, 6.283); c.fill();
  c.beginPath(); c.ellipse(x, y - 2.6 * s, 2 * s, 1.6 * s, 0, 0, 6.283); c.fill();
  c.beginPath(); c.ellipse(x + 4.5 * s, y - 3.2 * s, 2.4 * s, 2 * s, 0, 0, 6.283); c.fill();
  c.fillStyle = "rgba(255,220,180,.35)"; c.beginPath(); c.arc(x - 6.4 * s, y - 3.4 * s, .9 * s, 0, 6.283); c.fill();
}

function pqSunflower(c, x, y, r, squash = 1) {
  c.save(); c.translate(x, y); c.scale(squash, 1);
  c.fillStyle = "#5f9e4f";
  c.beginPath(); c.ellipse(-r * 1.15, r * .55, r * .55, r * .22, -.5, 0, 6.283); c.fill();
  c.beginPath(); c.ellipse(r * 1.15, r * .55, r * .55, r * .22, .5, 0, 6.283); c.fill();
  for (let layer = 0; layer < 2; layer++) {
    c.fillStyle = layer ? "#ffc21f" : "#f29a0e";
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * 6.283 + layer * .26;
      c.save(); c.rotate(a);
      c.beginPath(); c.ellipse(r * .62, 0, r * .48, r * .19, 0, 0, 6.283); c.fill();
      c.restore();
    }
  }
  const g = c.createRadialGradient(-r * .1, -r * .1, 0, 0, 0, r * .45);
  g.addColorStop(0, "#8a5426"); g.addColorStop(1, "#4b2a12");
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * .42, 0, 6.283); c.fill();
  c.fillStyle = "rgba(255,210,120,.35)";
  for (let i = 0; i < 8; i++) { const a = i * 2.4, rr = r * .08 + i * r * .035; c.beginPath(); c.arc(Math.cos(a) * rr, Math.sin(a) * rr, r * .045, 0, 6.283); c.fill(); }
  c.restore();
}

function pqTier(c, cx, bottom, w, h, u, deco) {
  const rx = w / 2, ry = w * .11, top = bottom - h;
  const g = c.createLinearGradient(cx - rx, 0, cx + rx, 0);
  g.addColorStop(0, "#e3a021"); g.addColorStop(.16, "#ffd24f"); g.addColorStop(.4, "#ffe88f");
  g.addColorStop(.72, "#ffd04a"); g.addColorStop(1, "#d99216");
  c.fillStyle = g;
  c.beginPath(); c.moveTo(cx - rx, top); c.lineTo(cx - rx, bottom);
  c.ellipse(cx, bottom, rx, ry, 0, Math.PI, 0, true);
  c.lineTo(cx + rx, top); c.closePath(); c.fill();

  const hl = c.createLinearGradient(0, top, 0, bottom);
  hl.addColorStop(0, "rgba(255,255,255,.22)"); hl.addColorStop(.5, "rgba(255,255,255,0)"); hl.addColorStop(1, "rgba(160,90,0,.12)");
  c.fillStyle = hl; c.fill();

  c.save(); c.clip();
  const rim = c.createLinearGradient(cx - rx, 0, cx - rx + 9 * u, 0);
  rim.addColorStop(0, "rgba(255,246,214,.75)"); rim.addColorStop(1, "rgba(255,246,214,0)");
  c.fillStyle = rim; c.fillRect(cx - rx, top, 9 * u, h + ry);
  const rimR = c.createLinearGradient(cx + rx, 0, cx + rx - 7 * u, 0);
  rimR.addColorStop(0, "rgba(255,170,60,.35)"); rimR.addColorStop(1, "rgba(255,170,60,0)");
  c.fillStyle = rimR; c.fillRect(cx + rx - 7 * u, top, 7 * u, h + ry);
  c.restore();

  if (deco === "flores") {
    for (const f of [-.66, -.33, 0, .33, .66]) {
      const sx = Math.sqrt(1 - f * f), off = ry * sx;
      pqSunflower(c, cx + f * rx, top + h * .58 + off * .9, 9.5 * u, Math.max(.45, sx));
    }
  } else if (deco === "estrelas") {
    const pts = [[-.78, .55, 4], [-.5, .35, 5.5], [-.22, .62, 4], [.05, .38, 6], [.32, .6, 4.5], [.58, .36, 5], [.8, .6, 3.5], [-.62, .78, 3], [.45, .82, 3]];
    for (const [f, yy, s] of pts) {
      const sx = Math.sqrt(1 - f * f);
      c.fillStyle = "#fffaf0";
      drawStarShape(c, cx + f * rx, top + h * yy + ry * sx * .8, s * u, 0, 5, .48); c.fill();
    }
    c.fillStyle = "rgba(255,255,255,.75)";
    for (let i = 0; i < 16; i++) { const f = -.9 + i / 15 * 1.8; c.beginPath(); c.arc(cx + f * rx, top + h * (.2 + (i % 3) * .3) + ry * Math.sqrt(1 - f * f) * .8, 1.2 * u, 0, 6.283); c.fill(); }
  } else if (deco === "festao") {
    c.strokeStyle = "#fffaf0"; c.lineWidth = 2.6 * u; c.lineCap = "round";
    const n = 5;
    for (let i = 0; i < n; i++) {
      const f1 = -.85 + i / n * 1.7, f2 = -.85 + (i + 1) / n * 1.7;
      const y1 = top + h * .42 + ry * Math.sqrt(1 - f1 * f1), y2 = top + h * .42 + ry * Math.sqrt(1 - f2 * f2);
      c.beginPath(); c.moveTo(cx + f1 * rx, y1);
      c.quadraticCurveTo(cx + (f1 + f2) / 2 * rx, (y1 + y2) / 2 + h * .32, cx + f2 * rx, y2); c.stroke();
      c.fillStyle = "#fffaf0"; c.beginPath(); c.arc(cx + f1 * rx, y1, 2.6 * u, 0, 6.283); c.fill();
    }
  }

  for (let x = -rx + 3 * u; x <= rx - 3 * u; x += 6.6 * u) {
    const y = bottom + ry * Math.sqrt(1 - (x / rx) ** 2) - 1.5 * u;
    const pg = c.createRadialGradient(cx + x - u, y - u, 0, cx + x, y, 3.2 * u);
    pg.addColorStop(0, "#ffffff"); pg.addColorStop(1, "#efe3c8");
    c.fillStyle = pg; c.beginPath(); c.arc(cx + x, y, 3 * u, 0, 6.283); c.fill();
  }

  const tg = c.createLinearGradient(0, top - ry, 0, top + ry);
  tg.addColorStop(0, "#fffdf6"); tg.addColorStop(1, "#f6ecd6");
  c.fillStyle = tg; c.beginPath(); c.ellipse(cx, top, rx, ry, 0, 0, 6.283); c.fill();
  const drips = [];
  for (let x = -rx + 4 * u; x <= rx - 4 * u; x += rand(7, 11) * u) {
    drips.push({ x, len: rand(5, 19) * u * (1 - (x / rx) ** 2 * .55), w: rand(4.6, 6.6) * u });
  }
  for (const pass of [0, 1]) {
    c.strokeStyle = pass ? "#fffaf0" : "rgba(170,110,10,.22)";
    c.fillStyle = c.strokeStyle;
    const dy = pass ? 0 : 1.4 * u;
    c.lineWidth = 6 * u; c.lineCap = "round";
    c.beginPath(); c.ellipse(cx, top + 1.5 * u + dy, rx - 1.5 * u, ry, 0, 0, Math.PI); c.stroke();
    for (const d of drips) {
      const ye = top + ry * Math.sqrt(1 - (d.x / rx) ** 2) + dy;
      c.lineWidth = d.w;
      c.beginPath(); c.moveTo(cx + d.x, ye); c.lineTo(cx + d.x, ye + d.len); c.stroke();
      c.beginPath(); c.arc(cx + d.x, ye + d.len, d.w * .62, 0, 6.283); c.fill();
    }
  }
  return { top, rx, ry };
}

function pqBrigadeiro(c, x, y, s) {
  c.fillStyle = "#d9437b";
  c.beginPath(); c.moveTo(x - 9.5 * s, y - 9 * s); c.lineTo(x + 9.5 * s, y - 9 * s); c.lineTo(x + 7 * s, y); c.lineTo(x - 7 * s, y); c.closePath(); c.fill();
  c.strokeStyle = "rgba(120,10,50,.35)"; c.lineWidth = .8 * s;
  for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(x + i * 2.1 * s, y - 9 * s); c.lineTo(x + i * 1.55 * s, y); c.stroke(); }
  const g = c.createRadialGradient(x - 3 * s, y - 16 * s, 1, x, y - 12 * s, 9.5 * s);
  g.addColorStop(0, "#7a4424"); g.addColorStop(1, "#331a0b");
  c.fillStyle = g; c.beginPath(); c.arc(x, y - 12.5 * s, 9 * s, 0, 6.283); c.fill();
  c.lineCap = "round"; c.lineWidth = 1.1 * s;
  for (let i = 0; i < 18; i++) {
    const a = rand(0, 6.283), r = rand(0, 7.5 * s), px = x + Math.cos(a) * r, py = y - 12.5 * s + Math.sin(a) * r, d = rand(0, 3.14);
    c.strokeStyle = i % 3 ? "#1d0d05" : "#8b5a37";
    c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(d) * 1.8 * s, py + Math.sin(d) * 1.8 * s); c.stroke();
  }
  c.fillStyle = "rgba(255,255,255,.28)"; c.beginPath(); c.ellipse(x - 3 * s, y - 17 * s, 2.6 * s, 1.5 * s, -.5, 0, 6.283); c.fill();
}

function pqCupcake(c, x, y, s) {
  c.fillStyle = "#ffd54a";
  c.beginPath(); c.moveTo(x - 15 * s, y - 18 * s); c.lineTo(x + 15 * s, y - 18 * s); c.lineTo(x + 11 * s, y); c.lineTo(x - 11 * s, y); c.closePath(); c.fill();
  c.fillStyle = "#fff3c4";
  for (let i = -5; i <= 5; i += 2) {
    c.beginPath(); c.moveTo(x + i * 2.7 * s, y - 18 * s); c.lineTo(x + (i + 1) * 2.7 * s, y - 18 * s);
    c.lineTo(x + (i + 1) * 2 * s, y); c.lineTo(x + i * 2 * s, y); c.closePath(); c.fill();
  }
  const layers = [[0, 17, 6], [-6, 13, 5.5], [-11.5, 9, 5], [-16, 5, 4]];
  for (const [dy, rx, ry] of layers) {
    const g = c.createLinearGradient(x - rx * s, 0, x + rx * s, 0);
    g.addColorStop(0, "#f07aa5"); g.addColorStop(.45, "#ffc2d8"); g.addColorStop(1, "#ee6f9c");
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y - 20 * s + dy * s, rx * s, ry * s, 0, 0, 6.283); c.fill();
  }
  const cols = ["#ffffff", "#ffd54a", "#8fd3ff", "#b8e6cf"];
  for (let i = 0; i < 12; i++) { c.fillStyle = cols[i % 4]; c.beginPath(); c.arc(x + rand(-13, 13) * s, y - 20 * s + rand(-14, 3) * s, .9 * s, 0, 6.283); c.fill(); }
  c.fillStyle = "#ffc93c"; c.strokeStyle = "#e09b12"; c.lineWidth = .8 * s;
  drawStarShape(c, x, y - 41 * s, 5.5 * s, 0, 5, .45); c.fill(); c.stroke();
}

function pqMacarons(c, x, y, s) {
  const cols = [["#f7b2c4", "#e88aa6"], ["#c9b6ef", "#a690dc"], ["#b8e6cf", "#8fceb0"]];
  cols.forEach(([a, b], i) => {
    const yy = y - i * 11 * s;
    const g = c.createLinearGradient(0, yy - 10 * s, 0, yy);
    g.addColorStop(0, a); g.addColorStop(1, b);
    c.fillStyle = b; c.beginPath(); c.ellipse(x, yy - 2 * s, 14 * s, 4.2 * s, 0, 0, 6.283); c.fill();
    c.fillStyle = "#fff4e2"; c.fillRect(x - 12.5 * s, yy - 6.5 * s, 25 * s, 3 * s);
    c.fillStyle = g; c.beginPath(); c.ellipse(x, yy - 7 * s, 14 * s, 5 * s, 0, Math.PI, 0); c.lineTo(x + 14 * s, yy - 6.5 * s); c.lineTo(x - 14 * s, yy - 6.5 * s); c.fill();
    c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(x - 5 * s, yy - 10 * s, 4 * s, 1.2 * s, -.2, 0, 6.283); c.fill();
  });
}

function pqMug(c, x, y, s) {
  c.strokeStyle = "#efe6d8"; c.lineWidth = 4 * s;
  c.beginPath(); c.ellipse(x + 17 * s, y - 15 * s, 7 * s, 8 * s, 0, -1.4, 1.4); c.stroke();
  const g = c.createLinearGradient(x - 16 * s, 0, x + 16 * s, 0);
  g.addColorStop(0, "#e8dccb"); g.addColorStop(.35, "#fffaf2"); g.addColorStop(1, "#e2d4bf");
  c.fillStyle = g;
  c.beginPath(); c.moveTo(x - 16 * s, y - 28 * s); c.lineTo(x - 16 * s, y - 3 * s);
  c.quadraticCurveTo(x - 16 * s, y, x - 12 * s, y); c.lineTo(x + 12 * s, y); c.quadraticCurveTo(x + 16 * s, y, x + 16 * s, y - 3 * s);
  c.lineTo(x + 16 * s, y - 28 * s); c.closePath(); c.fill();
  c.fillStyle = "#f07aa5"; drawHeartShape(c, x, y - 11 * s, 5.5 * s); c.fill();

  c.fillStyle = "#3a1f10"; c.beginPath(); c.ellipse(x, y - 28 * s, 16 * s, 3.6 * s, 0, 0, 6.283); c.fill();
  const bg = c.createRadialGradient(x - 4 * s, y - 36 * s, 1, x, y - 30 * s, 17 * s);
  bg.addColorStop(0, "#7a4527"); bg.addColorStop(1, "#3d2111");
  c.fillStyle = bg;
  c.beginPath(); c.moveTo(x - 15 * s, y - 28 * s);
  c.bezierCurveTo(x - 15 * s, y - 40 * s, x - 4 * s, y - 42 * s, x + 2 * s, y - 39 * s);
  c.bezierCurveTo(x + 10 * s, y - 42 * s, x + 16 * s, y - 36 * s, x + 15 * s, y - 28 * s); c.closePath(); c.fill();
  c.strokeStyle = "rgba(30,12,4,.5)"; c.lineWidth = 1 * s;
  c.beginPath(); c.moveTo(x - 6 * s, y - 37 * s); c.lineTo(x - 2 * s, y - 33 * s); c.lineTo(x + 5 * s, y - 36 * s); c.stroke();
  c.fillStyle = "#4a2614"; c.beginPath(); c.moveTo(x + 8 * s, y - 28 * s); c.quadraticCurveTo(x + 10 * s, y - 20 * s, x + 9 * s, y - 19 * s); c.quadraticCurveTo(x + 7 * s, y - 20 * s, x + 6 * s, y - 28 * s); c.fill();
}

function pqShake(c, x, y, s, level = 1, sip = 0) {
  c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.ellipse(x, y - 1.5 * s, 12 * s, 3 * s, 0, 0, 6.283); c.fill();
  c.fillRect(x - 1.8 * s, y - 12 * s, 3.6 * s, 11 * s);

  c.save(); c.translate(x + 4 * s, y - 52 * s); c.rotate(.22);
  c.fillStyle = "#fffaf6"; c.fillRect(-2.2 * s, -24 * s, 4.4 * s, 34 * s);
  c.fillStyle = "#f05d97"; for (let i = 0; i < 6; i++) c.fillRect(-2.2 * s, -24 * s + i * 6 * s, 4.4 * s, 2.6 * s);
  if (sip > 0) {
    c.fillStyle = "rgba(255,150,195,.95)";
    for (let i = 0; i < 4; i++) { const p = (sip * 2.5 + i / 4) % 1; c.beginPath(); c.arc(0, (10 - p * 34) * s, 1.6 * s, 0, 6.283); c.fill(); }
  }
  c.restore();

  c.fillStyle = "rgba(255,255,255,.38)";
  c.beginPath(); c.moveTo(x - 13 * s, y - 52 * s); c.lineTo(x + 13 * s, y - 52 * s); c.lineTo(x + 7 * s, y - 12 * s); c.lineTo(x - 7 * s, y - 12 * s); c.closePath(); c.fill();
  const yl = y - 12 * s - 40 * s * level, hw = 7 + 6 * level;
  const g = c.createLinearGradient(0, y - 52 * s, 0, y - 12 * s);
  g.addColorStop(0, "#ffb6d3"); g.addColorStop(1, "#f0609c");
  c.fillStyle = g;
  c.beginPath(); c.moveTo(x - hw * s, yl); c.lineTo(x + hw * s, yl); c.lineTo(x + 7 * s, y - 12 * s); c.lineTo(x - 7 * s, y - 12 * s); c.closePath(); c.fill();
  if (level < .98) { c.fillStyle = "rgba(255,220,235,.8)"; c.beginPath(); c.ellipse(x, yl, hw * s, 1.6 * s, 0, 0, 6.283); c.fill(); }
  c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.moveTo(x - 10 * s, y - 49 * s); c.lineTo(x - 7 * s, y - 49 * s); c.lineTo(x - 4 * s, y - 16 * s); c.lineTo(x - 5.5 * s, y - 16 * s); c.closePath(); c.fill();
  c.fillStyle = "#fff"; drawHeartShape(c, x + 1 * s, y - 30 * s, 4.5 * s); c.fill();
  c.fillStyle = "#fffdf8";
  for (const [dx, dy, r] of [[-8, -54, 6], [0, -56, 7], [8, -54, 6], [-3, -61, 5.5], [4, -62, 5]]) { c.beginPath(); c.arc(x + dx * s, y + dy * s, r * s, 0, 6.283); c.fill(); }
  const cg = c.createRadialGradient(x - 1 * s, y - 70 * s, 0, x, y - 68 * s, 4.5 * s);
  cg.addColorStop(0, "#ff7a8a"); cg.addColorStop(1, "#c3122f");
  c.fillStyle = cg; c.beginPath(); c.arc(x, y - 68 * s, 4.2 * s, 0, 6.283); c.fill();
  c.strokeStyle = "#5e8a3a"; c.lineWidth = 1 * s; c.beginPath(); c.moveTo(x, y - 72 * s); c.quadraticCurveTo(x + 2 * s, y - 77 * s, x + 5 * s, y - 78 * s); c.stroke();
}

function pqButterfly(c, x, y, s, open, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot);
  for (const side of [-1, 1]) {
    c.save(); c.scale(side * Math.max(.12, open), 1);
    const g = c.createLinearGradient(0, 0, 14 * s, 0);
    g.addColorStop(0, col[1]); g.addColorStop(1, col[0]);
    c.fillStyle = g;
    c.beginPath(); c.moveTo(0, -1 * s); c.bezierCurveTo(6 * s, -14 * s, 16 * s, -12 * s, 13 * s, -2 * s); c.bezierCurveTo(12 * s, 1 * s, 5 * s, 1 * s, 0, 0); c.fill();
    c.beginPath(); c.moveTo(0, 1 * s); c.bezierCurveTo(9 * s, 2 * s, 12 * s, 10 * s, 6 * s, 11 * s); c.bezierCurveTo(3 * s, 11 * s, 1 * s, 6 * s, 0, 2 * s); c.fill();
    c.fillStyle = "rgba(255,255,255,.75)";
    c.beginPath(); c.arc(10 * s, -7 * s, 1.4 * s, 0, 6.283); c.fill();
    c.beginPath(); c.arc(6 * s, 7 * s, 1 * s, 0, 6.283); c.fill();
    c.restore();
  }
  c.fillStyle = "#3a2a2a"; c.beginPath(); c.ellipse(0, 1 * s, 1.3 * s, 6 * s, 0, 0, 6.283); c.fill();
  c.strokeStyle = "#3a2a2a"; c.lineWidth = .7 * s;
  c.beginPath(); c.moveTo(0, -4 * s); c.quadraticCurveTo(-2 * s, -9 * s, -3.5 * s, -10 * s); c.moveTo(0, -4 * s); c.quadraticCurveTo(2 * s, -9 * s, 3.5 * s, -10 * s); c.stroke();
  c.restore();
}

function pqVase(c, x, y, s) {
  const stems = [[-8, -64, -.2], [2, -76, .05], [11, -58, .25]];
  c.strokeStyle = "#5f9e4f"; c.lineWidth = 2 * s;
  for (const [dx, dy] of stems) { c.beginPath(); c.moveTo(x, y - 6 * s); c.quadraticCurveTo(x + dx * .3 * s, y + dy * .5 * s, x + dx * s, y + dy * s); c.stroke(); }
  c.fillStyle = "#6aae58";
  c.beginPath(); c.ellipse(x - 7 * s, y - 40 * s, 7 * s, 2.6 * s, -.6, 0, 6.283); c.fill();
  c.beginPath(); c.ellipse(x + 8 * s, y - 44 * s, 7 * s, 2.6 * s, .6, 0, 6.283); c.fill();
  for (const [dx, dy] of stems) pqSunflower(c, x + dx * s, y + dy * s, 9 * s);
  const g = c.createLinearGradient(x - 11 * s, 0, x + 11 * s, 0);
  g.addColorStop(0, "rgba(170,215,235,.55)"); g.addColorStop(.4, "rgba(235,250,255,.35)"); g.addColorStop(1, "rgba(150,200,225,.55)");
  c.fillStyle = g;
  c.beginPath(); c.moveTo(x - 9 * s, y - 34 * s); c.lineTo(x + 9 * s, y - 34 * s); c.quadraticCurveTo(x + 13 * s, y - 18 * s, x + 11 * s, y);
  c.lineTo(x - 11 * s, y); c.quadraticCurveTo(x - 13 * s, y - 18 * s, x - 9 * s, y - 34 * s); c.fill();
  c.fillStyle = "rgba(255,255,255,.5)"; c.fillRect(x - 6 * s, y - 30 * s, 2 * s, 24 * s);
  c.strokeStyle = "#f4a9c4"; c.lineWidth = 2.4 * s; c.beginPath(); c.moveTo(x - 10 * s, y - 26 * s); c.lineTo(x + 10 * s, y - 26 * s); c.stroke();
}

const PQ_GOLD = ["#ffd54a", "#ffc93c", "#fff1b0", "#f4b400", "#ffe08a", "#ffffff", "#f7b2c4"];

S.piquenique = {
  music: "piquenique", tone: "light",
  run: 0, state: "idle", candles: [], smoke: [], items: [], blown: 0,
  clouds: [], bokeh: [], blades: [], pollen: [], flags: [], ants: [], conf: [],
  cam: { fx: 0, fy: 0, z: 1 }, par: { x: 0, y: 0 }, parT: { x: 0, y: 0 },

  init() {
    const u = this.u = Math.min(W, H * .62) / 400;

    const cx = this.cx = W / 2, ty = this.ty = H * .7;
    this.hY = H * .5;
    if (this.state === "idle" || !this.cam.fx) this.cam = { fx: W / 2, fy: H / 2, z: 1 };
    this.clouds = Array.from({ length: 3 }, (_, i) => ({ x: rand(0, W), y: H * (.08 + i * .07), s: rand(.7, 1.2) * Math.max(u, .8), v: rand(6, 12) }));
    this.bokeh = Array.from({ length: 9 }, () => ({ x: rand(0, W), y: rand(H * .3, H), r: rand(24, 70) * u, a: rand(.1, .22), v: rand(-6, 6), p: rand(0, 6), d: rand(1.3, 1.8) }));
    this.pollen = Array.from({ length: 26 }, () => ({ x: rand(0, W), y: rand(H * .25, H), p: rand(0, 6), s: rand(.6, 1.6) }));
    this.blades = Array.from({ length: Math.round(W / 9) }, () => ({ x: rand(-10, W + 10), h: rand(12, 34) * u, w: rand(1.6, 3) * u, p: rand(0, 6), c: pick(["#4f8f3f", "#5d9e47", "#3f7c35", "#6aae52"]), f: Math.random() < .08 ? pick(["#fff", "#ffd54a", "#f7b2c4"]) : null }));
    this.ants = Array.from({ length: 7 }, (_, i) => ({ x: -i * 26 * u - rand(0, 10) * u, y: H * .955 + Math.sin(i) * 3 * u, ph: rand(0, 6), leaf: i % 3 === 0 }));
    this.flags = [];
    const step = 30 * Math.max(u, .8);
    for (let x = step / 2, i = 0; x < W; x += step, i++) this.flags.push({ x, i, col: ["#ffc93c", "#f4a9c4", "#ffffff", "#b8e6cf", "#c9b6ef"][i % 5] });

    const plateY = ty - 14 * u;
    const top3 = plateY - 2 * u - 66 * u - 54 * u - 44 * u + 2 * u, ry3 = 88 * u * .11;
    this.top3 = top3;
    const prev = this.candles;
    this.candles = [-30, -15, 0, 15, 30].map((dx, i) => {
      const y = top3 + ry3 * [-.25, .35, .62, .35, -.25][i];
      const p = prev[i];
      return { x: cx + dx * u, y, fx: cx + dx * u, fy: y - 34 * u, lit: p ? p.lit : true, out: p ? p.out : 0, bt: p ? p.bt : 0, dir: p ? p.dir : 1,
        smoked: p ? p.smoked : false, col: ["#ffe27a", "#fff6d8", "#ffd04a", "#fff6d8", "#ffe27a"][i], ph: rand(0, 6) };
    });
    const old = {};
    for (const it of this.items) old[it.k] = it;
    const mkItem = (k, x, y, hy, r, box, sw) => {
      const o = old[k];
      return { k, x, y, hy, r, box, sw, s: 0, sv: 0, h: 0, hv: 0, wait: 0,
        level: o ? o.level : 1, sip: 0, crack: o ? o.crack : 0, eaten: o ? o.eaten : [] };
    };
    this.items = [
      mkItem("vaso", cx - 148 * u, ty - 16 * u, -52, 26, [-30, -104, 60, 110], 22),
      mkItem("macarons", cx + 140 * u, ty + 6 * u, -16, 22, [-20, -42, 40, 48], 16),
      mkItem("brownie", cx - 150 * u, ty + 24 * u, -22, 26, [-22, -50, 54, 58], 20),
      mkItem("brigadeiro", cx - 100 * u, ty + 30 * u, -12, 28, [-34, -34, 68, 44], 30),
      mkItem("cupcake", cx + 100 * u, ty + 32 * u, -24, 26, [-20, -52, 40, 58], 16),
      mkItem("barbie", cx + 172 * u, ty + 32 * u, -40, 26, [-18, -92, 40, 98], 14)
    ];
    this.cake = { x: cx, y: ty, s: 0, sv: 0 };

    this.brigs = [[-10, -6], [10, -6], [-16, 2], [0, 2], [16, 2]];

    const fcols = [["#ff9a3c", "#ffd27a"], ["#8fc8ff", "#e6f4ff"], ["#f7a1c4", "#fff0f6"]];
    this.flies = Array.from({ length: 3 }, (_, i) => ({
      x: rand(0, W), y: rand(H * .3, H * .55), tx: rand(0, W), ty: rand(H * .3, H * .6),
      state: "fly", timer: rand(2, 6), ph: rand(0, 6), rot: 0, col: fcols[i], s: (i === 0 ? 1.15 : .9) * Math.max(u, .8)
    }));
    this.sprites();
    this.render();
    if (document.fonts && document.fonts.status !== "loaded" && !this._fontWait) {
      this._fontWait = true;
      document.fonts.ready.then(() => { this._fontWait = false; if (W) this.render(); });
    }
  },

  sprites() {
    if (!this.sSteam) this.sSteam = pqSoftSprite(64, [[0, "rgba(255,255,255,.75)"], [.5, "rgba(255,255,255,.3)"], [1, "rgba(255,255,255,0)"]]);
    if (this.sBokeh) return;
    this.sBokeh = pqSoftSprite(64, [[0, "rgba(255,248,220,.9)"], [.55, "rgba(255,240,200,.55)"], [.8, "rgba(255,240,200,.18)"], [1, "rgba(255,240,200,0)"]]);
    this.sSmoke = pqSoftSprite(64, [[0, "rgba(190,185,195,.55)"], [.5, "rgba(190,185,195,.22)"], [1, "rgba(190,185,195,0)"]]);
    this.sShadow = pqSoftSprite(64, [[0, "rgba(60,40,30,.42)"], [.55, "rgba(60,40,30,.18)"], [1, "rgba(60,40,30,0)"]]);
    this.sGlow = pqSoftSprite(64, [[0, "rgba(255,226,140,.9)"], [.3, "rgba(255,200,110,.35)"], [1, "rgba(255,200,110,0)"]]);
  },

  render() {
    const u = this.u, cx = this.cx, ty = this.ty, hY = this.hY;

    const B = this.bg = pqLayer(.45), b = B.c;
    const sky = b.createLinearGradient(0, 0, 0, hY + 20);
    sky.addColorStop(0, "#9fd3f2"); sky.addColorStop(.55, "#cfe9f3"); sky.addColorStop(1, "#ffe6c4");
    b.fillStyle = sky; b.fillRect(0, 0, W, H);
    const sun = b.createRadialGradient(W * .16, H * .1, 0, W * .16, H * .1, Math.max(W, H) * .6);
    sun.addColorStop(0, "rgba(255,250,225,.95)"); sun.addColorStop(.12, "rgba(255,236,170,.55)"); sun.addColorStop(1, "rgba(255,230,170,0)");
    b.fillStyle = sun; b.fillRect(0, 0, W, H);
    const hill = (base, amp, freq, ph, col) => {
      b.fillStyle = col; b.beginPath(); b.moveTo(0, H);
      for (let x = 0; x <= W + 10; x += 8) b.lineTo(x, base + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph * 2) * amp * .35);
      b.lineTo(W, H); b.closePath(); b.fill();
    };
    hill(hY - 30 * u, 16 * u, .006, 1.2, "#b7d8c0");
    for (let i = 0; i < 5; i++) {
      const x = W * (.08 + i * .22) + rand(-20, 20), y = hY - 22 * u + rand(-6, 6) * u, r = rand(10, 16) * u;
      b.fillStyle = "#86b98e"; b.fillRect(x - 1.5 * u, y, 3 * u, 12 * u);
      b.fillStyle = "#9cc99f"; b.beginPath(); b.arc(x, y - r * .4, r, 0, 6.283); b.arc(x - r * .6, y + r * .1, r * .7, 0, 6.283); b.arc(x + r * .6, y + r * .1, r * .7, 0, 6.283); b.fill();
    }
    hill(hY - 4 * u, 12 * u, .009, 3.1, "#9fcf8c");
    for (let i = 0; i < W / 5; i++) {
      const x = rand(0, W), y = hY + rand(-6, 14) * u;
      b.fillStyle = "#e9b31f"; b.beginPath(); b.arc(x, y, rand(1.4, 2.6) * u, 0, 6.283); b.fill();
    }
    const haze = b.createLinearGradient(0, hY - 60 * u, 0, hY + 30 * u);
    haze.addColorStop(0, "rgba(235,245,250,0)"); haze.addColorStop(.6, "rgba(240,246,248,.38)"); haze.addColorStop(1, "rgba(240,246,248,0)");
    b.fillStyle = haze; b.fillRect(0, hY - 60 * u, W, 90 * u);
    const mead = b.createLinearGradient(0, hY + 10 * u, 0, H);
    mead.addColorStop(0, "#a6d78a"); mead.addColorStop(.5, "#86c26a"); mead.addColorStop(1, "#5f9e4c");
    b.fillStyle = mead; b.beginPath(); b.moveTo(0, H + 40);
    for (let x = 0; x <= W + 10; x += 10) b.lineTo(x, hY + 14 * u + Math.sin(x * .004 + 1) * 8 * u);
    b.lineTo(W, H + 40); b.closePath(); b.fill();
    for (let i = 0; i < W * H / 1400; i++) {
      const y = rand(hY + 20 * u, H), k = (y - hY) / (H - hY), x = rand(0, W);
      b.strokeStyle = Math.random() < .5 ? "rgba(70,130,55,.35)" : "rgba(200,240,160,.3)";
      b.lineWidth = .8 + k * 1.4;
      b.beginPath(); b.moveTo(x, y); b.lineTo(x + rand(-2, 2), y - (3 + k * 9) * u); b.stroke();
    }
    for (let i = 0; i < W * H / 7000; i++) {
      const y = rand(hY + 25 * u, H), x = rand(0, W), k = (y - hY) / (H - hY);
      b.fillStyle = pick(["#ffffff", "#ffe27a", "#f7b2c4", "#ffffff"]);
      b.beginPath(); b.arc(x, y, (1 + k * 2) * u, 0, 6.283); b.fill();
    }

    const L = this.table = pqLayer(1.25), c = L.c;
    const back = ty - 30 * u, front = ty + 42 * u, hem = front + 72 * u;
    const bl = cx - 185 * u, br = cx + 185 * u, fl = cx - 215 * u, fr = cx + 215 * u;
    c.drawImage(this.sShadow, cx - 270 * u, hem - 12 * u, 540 * u, 46 * u);
    c.fillStyle = "#b0794a";
    for (const lx of [fl + 20 * u, fr - 26 * u]) c.fillRect(lx, hem - 6 * u, 7 * u, 22 * u);
    const ging = (pathFn, rows, colsFn) => {
      c.save(); pathFn(); c.clip();
      c.fillStyle = "#fffdf8"; c.fillRect(0, 0, W, H);
      c.fillStyle = "rgba(240,110,160,.34)";
      rows(); colsFn();
      c.restore();
    };
    const topPath = () => { c.beginPath(); c.moveTo(bl, back); c.lineTo(br, back); c.lineTo(fr, front); c.lineTo(fl, front); c.closePath(); };
    ging(topPath, () => {
      const n = 6;
      for (let i = 0; i < n; i += 2) {
        const p1 = Math.pow(i / n, 1.25), p2 = Math.pow((i + 1) / n, 1.25);
        c.fillRect(0, lerp(back, front, p1), W, lerp(back, front, p2) - lerp(back, front, p1));
      }
    }, () => {
      const n = 22;
      for (let i = 0; i < n; i += 2) {
        c.beginPath();
        c.moveTo(lerp(bl, br, i / n), back); c.lineTo(lerp(bl, br, (i + 1) / n), back);
        c.lineTo(lerp(fl, fr, (i + 1) / n), front); c.lineTo(lerp(fl, fr, i / n), front); c.closePath(); c.fill();
      }
    });
    const sc = 15 * u;
    const dropPath = () => {
      c.beginPath(); c.moveTo(fl, front); c.lineTo(fr, front); c.lineTo(fr + 4 * u, hem);
      for (let x = fr + 4 * u; x > fl - 4 * u; x -= sc) c.arc(x - sc / 2, hem, sc / 2, 0, Math.PI, false);
      c.lineTo(fl - 4 * u, hem); c.closePath();
    };
    ging(dropPath, () => {
      for (let y = front + 2 * u, i = 0; y < hem + sc; y += 12 * u, i++) if (i % 2 === 0) c.fillRect(0, y, W, 12 * u);
    }, () => {
      const n = 22;
      for (let i = 0; i < n; i += 2) { const x1 = lerp(fl, fr, i / n), x2 = lerp(fl, fr, (i + 1) / n); c.fillRect(x1, front, x2 - x1, hem - front + sc); }
    });
    c.save(); dropPath(); c.clip();
    const shade = c.createLinearGradient(0, front, 0, hem + sc);
    shade.addColorStop(0, "rgba(120,60,80,.2)"); shade.addColorStop(1, "rgba(120,60,80,.06)");
    c.fillStyle = shade; c.fillRect(0, front, W, hem - front + sc);
    for (let x = fl; x < fr; x += 46 * u) {
      const fg = c.createLinearGradient(x, 0, x + 46 * u, 0);
      fg.addColorStop(0, "rgba(255,255,255,.14)"); fg.addColorStop(.5, "rgba(100,40,60,.1)"); fg.addColorStop(1, "rgba(255,255,255,.14)");
      c.fillStyle = fg; c.fillRect(x, front, 46 * u, hem - front + sc);
    }
    c.restore();
    c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 2 * u; c.beginPath(); c.moveTo(fl, front); c.lineTo(fr, front); c.stroke();
    const tl = c.createRadialGradient(cx - 40 * u, ty - 10 * u, 0, cx, ty, 220 * u);
    tl.addColorStop(0, "rgba(255,228,150,.32)"); tl.addColorStop(1, "rgba(255,228,150,0)");
    c.fillStyle = tl; topPath(); c.fill();

    const draws = {
      vaso: (g, it) => pqVase(g, it.x, it.y, u),
      macarons: (g, it) => pqMacarons(g, it.x, it.y, u),
      brownie: (g, it) => pqMug(g, it.x, it.y, u),
      brigadeiro: (g, it) => {
        g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.ellipse(it.x, it.y + 1 * u, 30 * u, 7 * u, 0, 0, 6.283); g.fill();
        g.strokeStyle = "#f4a9c4"; g.lineWidth = 1.2 * u; g.stroke();
      },
      cupcake: (g, it) => pqCupcake(g, it.x, it.y, u)
    };

    const bg0 = this.items.find(i => i.k === "brigadeiro");
    this.brigSprites = this.brigs.map(([dx, dy]) => {
      const x = bg0.x + dx * u, y = bg0.y + dy * u;
      const sp = pqLayer(1.4, x - 12 * u, y - 24 * u, 24 * u, 27 * u);
      pqBrigadeiro(sp.c, x, y, u * .95);
      return sp;
    });
    for (const it of this.items) {
      if (!draws[it.k]) continue;
      const [bx, by, bw, bh] = it.box;
      const sp = pqLayer(1.4, it.x + bx * u, it.y + by * u, bw * u, bh * u);
      draws[it.k](sp.c, it);
      it.sprite = sp;
    }
    const ck = pqLayer(1.4, cx - 112 * u, ty - 300 * u, 224 * u, 314 * u);
    this.renderCake(ck.c);
    this.cakeSprite = ck;

    const F = this.fgBlur = pqLayer(.16), f = F.c;
    const leaf = (x0, y0, len, ang, wd, col) => {
      f.save(); f.translate(x0, y0); f.rotate(ang);
      f.fillStyle = col; f.beginPath(); f.moveTo(0, 0);
      f.quadraticCurveTo(wd, -len * .5, 0, -len); f.quadraticCurveTo(-wd, -len * .5, 0, 0); f.fill(); f.restore();
    };
    for (let i = 0; i < 9; i++) leaf(rand(-20, W * .2), H + 20, rand(90, 170) * u, rand(-.2, .55), rand(14, 26) * u, pick(["#3d7a33", "#4f8f3f", "#2f6a2a"]));
    for (let i = 0; i < 9; i++) leaf(rand(W * .8, W + 20), H + 20, rand(90, 170) * u, rand(-.55, .2), rand(14, 26) * u, pick(["#3d7a33", "#4f8f3f", "#2f6a2a"]));
    const daisy = (x, y, r, col) => {
      f.fillStyle = col;
      for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; f.beginPath(); f.ellipse(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .6, r * .5, r * .2, a, 0, 6.283); f.fill(); }
      f.fillStyle = "#ffcf3a"; f.beginPath(); f.arc(x, y, r * .3, 0, 6.283); f.fill();
    };
    daisy(W * .08, H - 110 * u, 26 * u, "#ffffff");
    daisy(W * .93, H - 140 * u, 30 * u, "#f7b2c4");
    daisy(W * .2, H - 40 * u, 20 * u, "#ffe27a");
  },

  renderCake(c) {
    const u = this.u, cx = this.cx, ty = this.ty;
    const plateY = ty - 14 * u;
    c.drawImage(this.sShadow, cx - 70 * u, ty - 10 * u, 140 * u, 22 * u);
    const sg = c.createLinearGradient(cx - 40 * u, 0, cx + 40 * u, 0);
    sg.addColorStop(0, "#e8e0d2"); sg.addColorStop(.4, "#fffdf8"); sg.addColorStop(1, "#ddd3c2");
    c.fillStyle = sg; c.beginPath(); c.ellipse(cx, ty, 36 * u, 6 * u, 0, 0, 6.283); c.fill();
    c.fillRect(cx - 7 * u, plateY, 14 * u, ty - plateY);
    c.fillStyle = "#ddd3c2"; c.beginPath(); c.ellipse(cx, plateY + 3 * u, 98 * u, 12 * u, 0, 0, 6.283); c.fill();
    c.fillStyle = sg; c.beginPath(); c.ellipse(cx, plateY, 98 * u, 12 * u, 0, 0, 6.283); c.fill();
    c.strokeStyle = "#d9a93a"; c.lineWidth = 1.6 * u; c.stroke();
    let bottom = plateY - 2 * u;

    const tierShadow = (y, w) => { c.drawImage(this.sShadow, cx - w * .55, y - w * .07, w * 1.1, w * .2); };
    tierShadow(bottom, 170 * u);
    const t1 = pqTier(c, cx, bottom, 170 * u, 66 * u, u, "flores"); bottom = t1.top + 1 * u;
    tierShadow(bottom, 128 * u);
    const t2 = pqTier(c, cx, bottom, 128 * u, 54 * u, u, "estrelas"); bottom = t2.top + 1 * u;
    tierShadow(bottom, 88 * u);
    const t3 = pqTier(c, cx, bottom, 88 * u, 44 * u, u, "festao");
    this.top3 = t3.top;
    const sy = t3.top - 74 * u;
    c.strokeStyle = "#c8961a"; c.lineWidth = 2 * u;
    for (const dx of [-9, 9]) { c.beginPath(); c.moveTo(cx + dx * u, t3.top - 3 * u); c.lineTo(cx + dx * .8 * u, sy + 6 * u); c.stroke(); }
    const fs = 36 * u;
    c.font = `700 ${fs}px Caveat, "Segoe Print", cursive`;
    c.textAlign = "center"; c.textBaseline = "middle";
    const gg = c.createLinearGradient(0, sy - fs / 2, 0, sy + fs / 2);
    gg.addColorStop(0, "#fff0a8"); gg.addColorStop(.45, "#f2bf3a"); gg.addColorStop(1, "#b9820f");
    c.lineWidth = 4 * u; c.strokeStyle = "#9a6b07"; c.lineJoin = "round";
    c.strokeText("Lia", cx, sy); c.fillStyle = gg; c.fillText("Lia", cx, sy);
    c.fillStyle = "#f2bf3a";
    drawStarShape(c, cx - 34 * u, sy - 10 * u, 5 * u); c.fill();
    drawStarShape(c, cx + 34 * u, sy + 4 * u, 4 * u); c.fill();
    const order = this.candles.slice().sort((a, b) => a.y - b.y);
    for (const k of order) {
      c.fillStyle = "#fff6e0"; c.fillRect(k.x - 1.3 * u, k.y - 9 * u, 2.6 * u, 9 * u);
      const scy = k.y - 19 * u;
      const g = c.createRadialGradient(k.x - 3 * u, scy - 4 * u, 0, k.x, scy, 12 * u);
      g.addColorStop(0, "#ffffff"); g.addColorStop(.35, k.col); g.addColorStop(1, "#f0b52a");
      c.fillStyle = g; c.strokeStyle = "#d9971a"; c.lineWidth = 1 * u;
      drawStarShape(c, k.x, scy, 11 * u, 0, 5, .5); c.fill(); c.stroke();
      c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 1.2 * u;
      c.beginPath(); c.moveTo(k.x - 4 * u, scy - 1 * u); c.lineTo(k.x + 4 * u, scy + 2 * u); c.stroke();
      c.strokeStyle = "#3a2a20"; c.lineWidth = 1.2 * u;
      c.beginPath(); c.moveTo(k.x, scy - 11 * u); c.quadraticCurveTo(k.x + 1 * u, scy - 13 * u, k.x, scy - 15 * u); c.stroke();
    }
  },

  camFor(d) {
    const cam = this.cam, t = TIME, drift = reduce ? 0 : 1;
    const z = (1 + (cam.z - 1) * d) * 1.07;
    return {
      z, fx: W / 2 + (cam.fx - W / 2) * d, fy: H / 2 + (cam.fy - H / 2) * d,
      ox: (-this.par.x * 22 + Math.sin(t * .13) * 7 * drift) * d,
      oy: (-this.par.y * 14 + Math.cos(t * .1) * 5 * drift) * d
    };
  },
  apply(c, d) {
    const v = this.camFor(d);
    c.translate(W / 2 + v.ox, H / 2 + v.oy); c.scale(v.z, v.z); c.translate(-v.fx, -v.fy);
  },
  toWorld(x, y) {
    const v = this.camFor(1);
    return [v.fx + (x - W / 2 - v.ox) / v.z, v.fy + (y - H / 2 - v.oy) / v.z];
  },
  toScreen(x, y) {
    const v = this.camFor(1);
    return [W / 2 + v.ox + (x - v.fx) * v.z, H / 2 + v.oy + (y - v.fy) * v.z];
  },
  camTo(fx, fy, z, ms) {
    const a = { ...this.cam };
    return animate(ms, p => { this.cam.fx = lerp(a.fx, fx, p); this.cam.fy = lerp(a.fy, fy, p); this.cam.z = lerp(a.z, z, p); }, easeInOut);
  },

  enter() {
    const run = ++this.run;
    this.state = "crane"; this.blown = 0; this.smoke = []; this.conf = [];
    this.par = { x: 0, y: 0 }; this.parT = { x: 0, y: 0 };
    for (const k of this.candles) { k.lit = true; k.out = 0; k.bt = 0; k.smoked = false; }
    for (const it of this.items) { it.level = 1; it.sip = 0; it.crack = 0; it.eaten = []; }
    this.puffs = []; this.hearts = [];

    this.tried = new Set();
    this.needed = ["brigadeiro", "brownie", "cupcake", "macarons", "barbie"];
    this.allTried = new Promise(res => { this._triedRes = res; });

    const z0 = 1.65;
    this.cam = { fx: W / 2, fy: H - H / (2 * z0 * 1.07), z: z0 };
    (async () => {
      await wait(500); if (run !== this.run) return;
      await this.camTo(W / 2, H / 2, 1, reduce ? 300 : 2700);
      if (run !== this.run) return;
      this.state = "intro";
      hint(T_PIQUENIQUE.dicaDoces);
      await narrate(T_PIQUENIQUE.narracao);
      if (run !== this.run) return;

      await Promise.race([this.allTried, wait(75000)]);
      if (run !== this.run) return;
      await wait(1400); if (run !== this.run) return;
      hint("");
      await say(T_PIQUENIQUE.comeu);
      await wait(3800); if (run !== this.run) return;
      unsay(); await wait(700); if (run !== this.run) return;
      await say(T_PIQUENIQUE.pedido);
      if (run !== this.run) return;
      hint(T_PIQUENIQUE.dicaVelas);
      this.state = "candles";
      sfx.sparkle();
      await wait(3600); if (run !== this.run) return;
      if (this.state === "candles") unsay();
    })();
  },

  async biteIt(it, card) {
    const run = this.run, u = this.u, sp = it.sprite;

    const bc = document.createElement("canvas"); bc.width = sp.cvs.width; bc.height = sp.cvs.height;
    const b = bc.getContext("2d"); b.drawImage(sp.cvs, 0, 0);
    const [sx, sy] = this.toScreen(it.x + (it.box[0] + it.box[2] / 2) * u, it.y + (it.box[1] + it.box[3] / 2) * u);
    const v = this.camFor(1), z0 = v.z;
    const target = Math.min(H * .42 / sp.h, W * .72 / sp.w);
    const Z = this.zoomItem = { it, bc, sx, sy, x: sx, y: sy, z: z0, a: 1, haze: 0, shake: 0 };
    sfx.whoosh(.6);
    await animate(reduce ? 200 : 650, p => { Z.x = lerp(sx, W / 2, p); Z.y = lerp(sy, H * .5, p); Z.z = lerp(z0, target, p); Z.haze = p; }, easeOut);
    if (run !== this.run) return;
    await wait(250);
    const bites = [[.86, .32], [.16, .42], [.56, .74]];
    const crumbs = it.k === "cupcake" ? ["#f07aa5", "#ffd54a", "#fff3c4", "#c98a4a"] : ["#f7b2c4", "#c9b6ef", "#b8e6cf", "#fff4e2"];
    for (const [bx, by] of bites) {
      if (run !== this.run) return;

      const R = Math.min(bc.width, bc.height) * .26, cx0 = bx * bc.width, cy0 = by * bc.height;
      b.save(); b.globalCompositeOperation = "destination-out";
      b.beginPath(); b.arc(cx0, cy0, R * .78, 0, 6.283); b.fill();
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; b.beginPath(); b.arc(cx0 + Math.cos(a) * R * .72, cy0 + Math.sin(a) * R * .72, R * .32, 0, 6.283); b.fill(); }
      b.restore();

      sfx.pop();
      if (AU.c) I.noise(AU.sfx, AU.c.currentTime, .16, .09, { type: "bandpass", f: 1800, f2: 700, q: 1.5 });
      const dw = sp.w * Z.z, dh = sp.h * Z.z;
      sparkle(Z.x - dw / 2 + bx * dw, Z.y - dh / 2 + by * dh, 16, { colors: crumbs, speed: 170, gravity: 520, life: 1.1, size: 2.4, drag: .97 });
      Z.shake = 1;
      await wait(reduce ? 200 : 480);
    }
    if (run !== this.run) return;
    await animate(reduce ? 150 : 380, p => { Z.a = 1 - p; Z.z *= 1.004; Z.haze = 1 - p; });
    if (run !== this.run) return;
    it.gone = true; this.zoomItem = null;
    this.hearts.push({ x: it.x, y: it.y - 10 * u, t: 0, ph: rand(0, 6) });
    const [hx, hy] = this.toScreen(it.x, it.y - 10 * u);
    sparkle(hx, hy, 10, { colors: ["#f4a9c4", "#ff8fb1", "#ffffff"], speed: 90, gravity: -30, life: .9, size: 2.2, shape: "heart" });
    info({ title: card.title, text: card.text, ms: 6000 });
  },

  markTried(k) {
    if (!this.tried || this.tried.has(k)) return;
    this.tried.add(k);
    if (this.needed.every(n => this.tried.has(n)) && this._triedRes) { const r = this._triedRes; this._triedRes = null; r(); }
  },

  exit() { this.run++; this.state = "idle"; },

  async celebrate() {
    const run = this.run;
    this.state = "done";
    hint("");
    await wait(450); if (run !== this.run) return;

    this.camTo(this.cx, this.top3 - 12 * this.u, 1.26, reduce ? 300 : 1700);
    sfx.fanfare();
    this.confetti(180);
    this.cake.sv = 2.2;
    sparkle(W / 2, H * .4, 30, { colors: ["#ffc93c", "#fff1b0", "#ffffff"], speed: 280, gravity: 160, life: 1.8, size: 2.6, shape: "star" });
    await wait(500); if (run !== this.run) return;
    this.confetti(90);

    await say(T_PIQUENIQUE.desejo[0]);
    await wait(2600); if (run !== this.run) return;
    unsay(); await wait(600); if (run !== this.run) return;
    await say(T_PIQUENIQUE.desejo[1]);
    await wait(3600); if (run !== this.run) return;
    unsay(); await wait(400); if (run !== this.run) return;
    this.state = "leaving";
    go("final", { color: "#05060f", out: 1400 });
  },

  confetti(n) {
    for (let i = 0; i < n; i++) {
      const z = rand(.45, 1.9);
      this.conf.push({
        x: rand(-.05, 1.05) * W, y: rand(-H * .25, -10), z,
        vx: rand(-60, 60), vy: rand(60, 260) * (.6 + z * .4),
        rot: rand(0, 6.28), vr: rand(-4, 4), flip: rand(0, 6.28), vf: rand(4, 11),
        w: rand(5, 9) * z * Math.max(this.u, .8), h: rand(9, 15) * z * Math.max(this.u, .8),
        col: pick(PQ_GOLD), sway: rand(0, 6.28), shape: Math.random() < .15 ? "star" : "rect"
      });
    }
    this.conf.sort((a, b) => a.z - b.z);
  },

  move(x, y, isDown) {
    this.parT.x = clamp(x / W - .5, -.5, .5);
    this.parT.y = clamp(y / H - .5, -.5, .5);

    if (isDown && this.state === "candles" && this.lastP) {
      const [lx, ly] = this.lastP, steps = Math.max(1, Math.ceil(dist(lx, ly, x, y) / 8));
      for (let i = 1; i <= steps; i++) this.blowAt(lerp(lx, x, i / steps), lerp(ly, y, i / steps), x - lx);
    }
    this.lastP = isDown ? [x, y] : null;
  },
  up() { this.lastP = null; },

  blowAt(x, y, dirX = 0) {
    if (this.state !== "candles") return false;
    const u = this.u, [wx, wy] = this.toWorld(x, y);
    let hit = false;
    for (const k of this.candles) {
      if (!k.lit) continue;
      const d = Math.min(dist(wx, wy, k.fx, k.fy - 4 * u), dist(wx, wy, k.x, k.y - 19 * u));
      if (d >= Math.max(24, 22 * u)) continue;
      k.lit = false; k.bt = 0;
      k.dir = Math.sign(dirX) || Math.sign(k.fx - wx) || (Math.random() < .5 ? -1 : 1);
      sfx.blow();
      this.blown++; hit = true;
      const left = this.candles.length - this.blown;
      if (left > 1) hint(T_PIQUENIQUE.faltam.replace("{n}", left));
      else if (left === 1) hint(T_PIQUENIQUE.falta1);
      if (left === 0) { this.celebrate(); break; }
    }
    return hit;
  },

  down(x, y) {
    const u = this.u;
    this.move(x, y, true);
    if (this.state === "leaving" || this.state === "crane" || this.state === "idle") return;
    const [wx, wy] = this.toWorld(x, y);
    if (this.state === "candles" && this.blowAt(x, y)) return;
    let hit = null, hd = 1e9;
    for (const it of this.items) {
      const d = dist(wx, wy, it.x, it.y + it.hy * u);
      if (d < Math.max(22, it.r * u) && d < hd) { hd = d; hit = it; }
    }
    if (hit) {
      const d = T_PIQUENIQUE.itens[hit.k];
      let cardDelay = 300;
      const run = this.run;
      if (hit.k === "brigadeiro" && hit.eaten.length < this.brigs.length) {

        const i = [3, 2, 4, 0, 1].find(n => !hit.eaten.some(e => e.i === n));
        hit.eaten.push({ i, t: 0 });
        const bx = hit.x + this.brigs[i][0] * u, by = hit.y + this.brigs[i][1] * u - 12 * u;
        this.hearts.push({ x: bx, y: by, t: 0, ph: rand(0, 6) });
        sfx.pop(); setTimeout(() => { if (run === this.run) sfx.boing(); }, 160);
        const [sx, sy] = this.toScreen(bx, by);
        setTimeout(() => sparkle(sx, sy, 8, { colors: ["#f4a9c4", "#ff8fb1", "#ffffff"], speed: 70, gravity: -30, life: .8, size: 2, shape: "heart" }), 380);
        cardDelay = 600;
      } else if (hit.k === "barbie") {

        hit.sip = .0001; hit.levelFrom = hit.level; hit.levelTo = Math.max(.12, hit.level - .22);
        hit.sv -= 1.5;
        if (AU.c) {
          const t0 = AU.c.currentTime;
          I.noise(AU.sfx, t0, .55, .06, { type: "bandpass", f: 1300, f2: 500, q: 4 });
          for (let k = 0; k < 5; k++) I.bubble(AU.sfx, t0 + .08 + k * .09, .035);
        }
        cardDelay = 900;
      } else if (hit.k === "cupcake" || hit.k === "macarons") {

        if (this.zoomItem) return;
        this.markTried(hit.k);
        this.biteIt(hit, d);
        return;
      } else if (hit.k === "brownie") {

        hit.crackT = 0; hit.sv -= 2.5;
        sfx.pop();
        if (AU.c) I.noise(AU.sfx, AU.c.currentTime + .05, .9, .05, { type: "highpass", f: 2200 });
        for (let k = 0; k < 9; k++) this.puffs.push({ x: hit.x + rand(-8, 8) * u, y: hit.y - 40 * u, age: -k * .07, vx: rand(-8, 8), ph: rand(0, 6) });
        cardDelay = 600;
      } else {

        hit.sv -= 5; hit.wait = .09;
        sfx.boing();
        const hx = x, hy = y;
        setTimeout(() => sparkle(hx, hy - 10, 12, { colors: ["#f4a9c4", "#ff8fb1", "#ffffff"], speed: 140, gravity: -40, life: 1, size: 2.4, shape: "heart" }), 120);
      }
      this.markTried(hit.k);
      setTimeout(() => { if (run === this.run) info({ title: d.title, text: d.text, ms: 6000 }); }, cardDelay);
      return;
    }
    if (Math.abs(wx - this.cx) < 86 * u && wy > this.top3 - 10 * u && wy < this.ty) {
      this.cake.sv -= 2.5;
      const d = T_PIQUENIQUE.itens.bolo;
      info({ title: d.title, text: d.text, ms: 6000 });
      sfx.pop();
      sparkle(x, y, 10, { colors: ["#ffc93c", "#fff1b0", "#ffffff"], speed: 110, gravity: -20, life: .9, size: 2.2, shape: "star" });
    }
  },

  update(dt, t) {
    const u = this.u;

    for (const it of this.items) {
      for (const e of it.eaten) e.t = Math.min(1, e.t + dt * 2.2);
      if (it.sip > 0) {
        it.sip += dt / 1.3;
        it.level = lerp(it.levelFrom, it.levelTo, easeInOut(clamp(it.sip)));
        if (it.sip >= 1) it.sip = 0;
      }
      if (it.crackT != null) { it.crackT += dt; it.crack = easeOut(clamp(it.crackT / .5)); }
    }
    for (const h of this.hearts || []) h.t += dt;
    for (const p of this.puffs || []) { p.age += dt; }
    if (this.puffs) this.puffs = this.puffs.filter(p => p.age < 2.2);

    for (const f of this.flies || []) {
      f.timer -= dt;
      if (f.state === "fly" || f.state === "land") {
        const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy);
        const sp = (f.state === "land" ? 55 : 75) * Math.max(u, .8);
        if (d > 3) {
          f.x += dx / d * Math.min(d, sp * dt) + Math.sin(t * 3 + f.ph) * 18 * dt;
          f.y += dy / d * Math.min(d, sp * dt) + Math.cos(t * 4.3 + f.ph) * 22 * dt;
          f.rot += (Math.atan2(dy, dx) + Math.PI / 2 - f.rot) * Math.min(1, dt * 3) * .3;
        } else if (f.state === "land") { f.state = "rest"; f.timer = rand(3, 6); }
        if (f.state === "fly" && (d <= 3 || f.timer <= 0)) {
          if (Math.random() < .55) {

            const side = Math.random() < .5 ? -1 : 1;
            f.tx = this.cx + side * rand(105, 170) * u; f.ty = this.ty + rand(-24, 36) * u; f.state = "land";
          } else { f.tx = rand(-.05, 1.05) * W; f.ty = rand(H * .28, H * .62); f.timer = rand(3, 7); }
        }
      } else if (f.state === "rest" && f.timer <= 0) {
        f.state = "fly"; f.tx = rand(0, W); f.ty = rand(H * .2, H * .45); f.timer = rand(3, 7);
      }
    }
    this.par.x += (this.parT.x - this.par.x) * Math.min(1, dt * 3);
    this.par.y += (this.parT.y - this.par.y) * Math.min(1, dt * 3);
    for (const k of this.candles) {
      if (!k.lit) { k.bt += dt; k.out = clamp((k.bt - .22) / .25); }
      if (!k.lit && !k.smoked && k.bt > .3) {
        k.smoked = true;
        for (let i = 0; i < 10; i++) this.smoke.push({ x: k.fx, y: k.fy - 4 * this.u, age: -i * .08, ph: rand(0, 6), dx: k.dir * rand(.1, .6) });
      }
    }
    for (const s of this.smoke) s.age += dt;
    this.smoke = this.smoke.filter(s => s.age < 2.6);

    for (const it of [...this.items, this.cake]) {
      if (it.wait > 0) { it.wait -= dt; if (it.wait <= 0) it.hv = 210; }
      const acc = -260 * it.s - 13 * it.sv;
      it.sv += acc * dt; it.s += it.sv * dt;
      if (it.hv !== undefined && (it.h > 0 || it.hv > 0)) {
        it.h += it.hv * dt * this.u; it.hv -= 1500 * dt;
        if (it.h <= 0) { it.h = 0; it.sv -= Math.min(4, Math.abs(it.hv) / 70); it.hv = 0; }
      }
    }
    for (const cl of this.clouds) { cl.x += cl.v * dt; if (cl.x - 120 * cl.s > W) cl.x = -140 * cl.s; }
    for (const bk of this.bokeh) { bk.x += bk.v * dt; bk.y -= 4 * dt; if (bk.y < H * .2) bk.y = H + bk.r; if (bk.x < -bk.r) bk.x = W + bk.r; if (bk.x > W + bk.r) bk.x = -bk.r; }
    for (const p of this.pollen) { p.y -= 8 * p.s * dt; p.x += Math.sin(t * .7 + p.p) * 10 * dt; if (p.y < H * .2) { p.y = H; p.x = rand(0, W); } }
    for (const a of this.ants) { a.x += 24 * this.u * dt; if (a.x > W + 30) a.x -= W + 60 + rand(0, 40); }
    for (const q of this.conf) {
      q.vy += (70 + 60 * q.z - q.vy) * dt * 1.5;
      q.vx *= .99; q.sway += dt * 2.2;
      q.x += (q.vx + Math.sin(q.sway) * 30 * q.z) * dt; q.y += q.vy * dt;
      q.rot += q.vr * dt; q.flip += q.vf * dt;
    }
    this.conf = this.conf.filter(q => q.y < H + 40);
    if (this.state !== "done" && this.state !== "crane" && Math.random() < dt * 1.6) {
      const a = rand(0, 6.283), r = rand(10, 70) * this.u;
      const [sx, sy] = this.toScreen(this.cx + Math.cos(a) * r, this.ty - 100 * this.u + Math.sin(a) * r * .9);
      sparkle(sx, sy, 1, { color: "#ffffff", speed: 6, gravity: -6, life: .9, size: 1.7, shape: "star" });
    }
  },

  drawSprite(c, it, sp) {
    const u = this.u;
    const sy = 1 + clamp(it.s, -.35, .35), sx = 1 - clamp(it.s, -.35, .35) * .6;

    const hk = 1 / (1 + it.h / (40 * u));
    c.globalAlpha = hk;
    c.drawImage(this.sShadow, it.x - it.sw * u * sx * hk, it.y - 4 * u, it.sw * 2 * u * sx * hk, 10 * u);
    c.globalAlpha = 1;
    c.save();
    c.translate(it.x, it.y - it.h); c.scale(sx, sy); c.translate(-it.x, -it.y);
    if (it.k === "barbie") pqShake(c, it.x, it.y, u, it.level, it.sip);
    else if (sp) c.drawImage(sp.cvs, sp.x0, sp.y0, sp.w, sp.h);
    if (it.k === "brigadeiro") {
      this.brigSprites.forEach((bs, i) => {
        const e = it.eaten.find(q => q.i === i);
        if (e && e.t >= 1) return;
        const k = e ? 1 - easeIn(e.t) : 1;
        const bx = it.x + this.brigs[i][0] * u, by = it.y + this.brigs[i][1] * u;
        c.save(); c.translate(bx, by); c.scale(k, k * (e ? 1 + .2 * Math.sin(e.t * 9) : 1)); c.translate(-bx, -by);
        c.drawImage(bs.cvs, bs.x0, bs.y0, bs.w, bs.h);
        c.restore();
      });
    }
    if (it.k === "brownie" && it.crack > 0) {

      const bx = it.x, by = it.y - 37 * u, a = it.crack;
      c.lineCap = "round"; c.lineJoin = "round";
      c.strokeStyle = `rgba(35,14,5,${a})`; c.lineWidth = 2.6 * u;
      c.beginPath(); c.moveTo(bx - 10 * u, by + 1 * u); c.lineTo(bx - 5 * u, by - 2 * u * a); c.lineTo(bx - 1 * u, by + 1.5 * u); c.lineTo(bx + 4 * u, by - 2.5 * u * a); c.lineTo(bx + 10 * u, by + .5 * u); c.stroke();
      c.strokeStyle = `rgba(150,80,35,${a * .9})`; c.lineWidth = 1 * u;
      c.beginPath(); c.moveTo(bx - 8 * u, by + .5 * u); c.lineTo(bx - 5 * u, by - 1.4 * u * a); c.lineTo(bx - 1 * u, by + 1 * u); c.lineTo(bx + 4 * u, by - 1.8 * u * a); c.stroke();
      c.fillStyle = `rgba(255,220,180,${.35 * a})`; c.beginPath(); c.ellipse(bx - 2 * u, by - 1 * u, 3 * u, 1 * u, 0, 0, 6.283); c.fill();
    }
    c.restore();
  },

  draw(c, t) {
    if (!this.bg) return;
    const u = this.u;

    c.save(); this.apply(c, .35);
    c.drawImage(this.bg.cvs, -W * .02, -H * .02, W * 1.04, H * 1.04);
    c.fillStyle = "rgba(255,255,255,.72)";
    for (const cl of this.clouds) {
      const s = cl.s * 30;
      c.beginPath();
      c.ellipse(cl.x, cl.y, s * 1.8, s * .7, 0, 0, 6.283);
      c.ellipse(cl.x - s * 1.1, cl.y + s * .15, s * 1.1, s * .55, 0, 0, 6.283);
      c.ellipse(cl.x + s * 1.2, cl.y + s * .1, s * 1.2, s * .6, 0, 0, 6.283);
      c.ellipse(cl.x + s * .2, cl.y - s * .45, s * 1, s * .7, 0, 0, 6.283);
      c.fill();
    }
    c.restore();

    c.save(); this.apply(c, 1);
    const y0 = -4, sag = H * .045, fw = 22 * Math.max(u, .8), fh = 25 * Math.max(u, .8);
    const yAt = x => y0 + sag * (1 - Math.pow((x - W / 2) / (W / 2 + 10), 2)) + 6;
    c.strokeStyle = "rgba(120,90,70,.6)"; c.lineWidth = 1.2;
    c.beginPath(); for (let x = -30; x <= W + 30; x += 10) c.lineTo(x, yAt(x)); c.stroke();
    for (const f of this.flags) {
      const y = yAt(f.x);
      c.save(); c.translate(f.x, y); c.rotate(Math.sin(t * 1.6 + f.i * .9) * .07);
      c.fillStyle = f.col; c.beginPath(); c.moveTo(-fw / 2, 0); c.lineTo(fw / 2, 0); c.lineTo(0, fh); c.closePath(); c.fill();
      c.fillStyle = "rgba(0,0,0,.06)"; c.beginPath(); c.moveTo(0, 0); c.lineTo(fw / 2, 0); c.lineTo(0, fh); c.closePath(); c.fill();
      c.restore();
    }
    c.drawImage(this.table.cvs, 0, 0, W, H);

    for (const it of this.items) if (it.y < this.ty) this.drawSprite(c, it, it.sprite);

    const breath = reduce ? 0 : Math.sin(t * 1.3);
    const lit = this.candles.filter(k => k.lit).length / 5;
    c.globalAlpha = .28 + .05 * breath + lit * .25;
    c.drawImage(this.sGlow, this.cx - 150 * u, this.top3 - 150 * u, 300 * u, 250 * u);
    c.globalAlpha = 1;
    const cs = clamp(this.cake.s, -.3, .3);
    c.save();
    c.translate(this.cx, this.ty);
    c.scale((1 + .006 * breath) * (1 - cs * .5), (1 + .008 * breath) * (1 + cs));
    c.translate(-this.cx, -this.ty);
    const sp = this.cakeSprite;
    c.drawImage(sp.cvs, sp.x0, sp.y0, sp.w, sp.h);
    this.drawFlames(c, t);
    c.restore();
    for (const it of this.items) if (it.y >= this.ty) this.drawSprite(c, it, it.sprite);

    for (const h of this.hearts || []) {
      const a = clamp(h.t * 2), pulse = 1 + .12 * Math.sin(t * 3 + h.ph);
      c.save(); c.globalCompositeOperation = "lighter";
      c.globalAlpha = .35 * a; c.drawImage(this.sGlow, h.x - 14 * u, h.y - 14 * u, 28 * u, 28 * u);
      c.restore();
      c.globalAlpha = a; c.fillStyle = "#ff7fab";
      drawHeartShape(c, h.x, h.y + 3 * u, 5.5 * u * pulse * easeOut(a)); c.fill();
      c.fillStyle = "rgba(255,255,255,.6)"; c.beginPath(); c.arc(h.x - 2 * u, h.y - 1 * u, 1 * u, 0, 6.283); c.fill();
      c.globalAlpha = 1;
    }

    for (const p of this.puffs || []) {
      if (p.age < 0) continue;
      const k = p.age / 2.2, r = (6 + p.age * 18) * u;
      c.globalAlpha = .8 * (1 - k) * Math.min(1, p.age * 5);
      c.drawImage(this.sSteam, p.x + p.vx * p.age * u + Math.sin(p.age * 3 + p.ph) * 5 * u - r, p.y - p.age * 46 * u - r, r * 2, r * 2);
    }
    c.globalAlpha = 1;

    const mug = this.items.find(i => i.k === "brownie");
    c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 2 * u; c.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const ph = (t * .5 + i / 3) % 1, x0 = mug.x + (i - 1) * 6 * u, y0b = mug.y - mug.h - 44 * u - ph * 26 * u;
      c.globalAlpha = Math.sin(ph * Math.PI) * .7;
      c.beginPath();
      for (let k = 0; k <= 10; k++) c.lineTo(x0 + Math.sin(k * .7 + t * 2 + i) * 3 * u, y0b - k * 1.6 * u);
      c.stroke();
    }
    c.globalAlpha = 1;

    for (const s of this.smoke) {
      if (s.age < 0) continue;
      const k = s.age / 2.6, r = (5 + s.age * 16) * u;
      const curl = Math.sin(s.age * 4 + s.ph) * (3 + s.age * 7) * u;
      const x = s.x + curl + s.dx * s.age * 26 * u, y = s.y - s.age * 40 * u;
      c.globalAlpha = .75 * (1 - k) * Math.min(1, s.age * 4);
      c.drawImage(this.sSmoke, x - r, y - r, r * 2, r * 2);
    }
    c.globalAlpha = 1;

    c.lineCap = "round";
    for (const b of this.blades) {
      const sw = reduce ? 0 : Math.sin(t * 1.4 + b.x * .015 + b.p) * 5 * u;
      c.strokeStyle = b.c; c.lineWidth = b.w;
      c.beginPath(); c.moveTo(b.x, H + 6); c.quadraticCurveTo(b.x + sw * .3, H - b.h * .5, b.x + sw, H - b.h); c.stroke();
      if (b.f) { c.fillStyle = b.f; c.beginPath(); c.arc(b.x + sw, H - b.h, 2.6 * u, 0, 6.283); c.fill(); c.fillStyle = "#ffcf3a"; c.beginPath(); c.arc(b.x + sw, H - b.h, 1 * u, 0, 6.283); c.fill(); }
    }
    for (const a of this.ants) {
      pqAnt(c, a.x, a.y, 1.15 * u, t, a.ph);
      if (a.leaf) {
        c.fillStyle = "#6fbf4f"; c.save(); c.translate(a.x + 1 * u, a.y - 9 * u); c.rotate(-.4 + Math.sin(t * 6 + a.ph) * .08);
        c.beginPath(); c.ellipse(0, -4 * u, 4 * u, 6.5 * u, 0, 0, 6.283); c.fill(); c.restore();
      }
    }

    for (const f of this.flies || []) {
      const open = f.state === "rest" ? .35 + .65 * Math.abs(Math.sin(t * 1.3 + f.ph)) : .15 + .85 * Math.abs(Math.sin(t * 16 + f.ph));
      if (f.state === "rest") { c.globalAlpha = .25; c.drawImage(this.sShadow, f.x - 8 * f.s, f.y + 2 * f.s, 16 * f.s, 5 * f.s); c.globalAlpha = 1; }
      pqButterfly(c, f.x, f.y, f.s, open, f.rot, f.col);
    }
    c.fillStyle = "rgba(255,244,190,.85)";
    for (const p of this.pollen) { c.globalAlpha = .4 + .4 * Math.sin(t * 2 + p.p); c.beginPath(); c.arc(p.x, p.y, 1.4 * p.s, 0, 6.283); c.fill(); }
    c.globalAlpha = 1;
    c.restore();

    c.save(); this.apply(c, 1.6);
    const sk = reduce ? 0 : Math.sin(t * .9) * .025;
    c.translate(0, H); c.transform(1, 0, sk, 1, 0, 0); c.translate(0, -H);
    c.drawImage(this.fgBlur.cvs, 0, 0, W, H);
    c.restore();

    c.save();
    c.globalCompositeOperation = "screen";
    const lg = c.createRadialGradient(W * .12, H * .05, 0, W * .12, H * .05, Math.max(W, H) * .9);
    lg.addColorStop(0, "rgba(255,214,140,.35)"); lg.addColorStop(.5, "rgba(255,190,120,.08)"); lg.addColorStop(1, "rgba(255,190,120,0)");
    c.fillStyle = lg; c.fillRect(0, 0, W, H);
    for (const bk of this.bokeh) {
      const v = this.camFor(bk.d);
      c.globalAlpha = bk.a * (.7 + .3 * Math.sin(t * .8 + bk.p));
      c.drawImage(this.sBokeh, bk.x + v.ox - bk.r, bk.y + v.oy - bk.r, bk.r * 2, bk.r * 2);
    }
    c.restore();

    for (const q of this.conf) {
      const fl = Math.cos(q.flip);
      c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.scale(1, Math.max(.08, Math.abs(fl)));
      const base = clamp(.45 + q.z * .35);
      c.fillStyle = q.col;
      if (q.z > 1.45) { c.globalAlpha = base * .35; c.fillRect(-q.w * .8, -q.h * .8, q.w * 1.6, q.h * 1.6); }
      c.globalAlpha = base;
      if (q.shape === "star") { drawStarShape(c, 0, 0, q.w, 0); c.fill(); }
      else c.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
      if (fl < 0) { c.fillStyle = "rgba(120,80,0,.3)"; c.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); }
      else { c.fillStyle = "rgba(255,255,255,.35)"; c.fillRect(-q.w / 2, -q.h / 2, q.w, q.h * .25); }
      c.restore();
    }
  },

  drawFlames(c, t) {
    const u = this.u;
    for (const k of this.candles) {
      const a = 1 - k.out;
      if (a <= 0) continue;

      const bend = k.lit ? 0 : easeOut(clamp(k.bt / .28));
      const fl = 1 + .12 * Math.sin(t * 17 + k.ph) + .07 * Math.sin(t * 29 + k.ph * 2);
      const h = 14 * u * fl * a * (1 - bend * .35), w = 5.2 * u * a * (1 + bend * .25);
      const sway = Math.sin(t * 5 + k.ph) * 1.4 * u + bend * k.dir * 11 * u;
      const bx = k.fx, by = k.fy;
      c.save();
      c.globalCompositeOperation = "lighter";
      c.globalAlpha = .55 * a;
      c.drawImage(this.sGlow, bx - 26 * u + sway * .4, by - h * .5 - 26 * u, 52 * u, 52 * u);
      c.globalAlpha = .18 * a * (.85 + .15 * fl);
      c.drawImage(this.sGlow, bx - 60 * u, by - 70 * u, 120 * u, 120 * u);
      c.restore();
      const fg = c.createLinearGradient(0, by, 0, by - h);
      fg.addColorStop(0, "#ff8a2a"); fg.addColorStop(.35, "#ffc23d"); fg.addColorStop(.8, "#fff2b0"); fg.addColorStop(1, "#ffffff");
      c.fillStyle = fg;
      c.beginPath(); c.moveTo(bx, by + 1.5 * u);
      c.bezierCurveTo(bx - w * 1.1, by - h * .2, bx - w * .5 + sway * .4, by - h * .7, bx + sway, by - h);
      c.bezierCurveTo(bx + w * .5 + sway * .4, by - h * .7, bx + w * 1.1, by - h * .2, bx, by + 1.5 * u);
      c.fill();
      c.fillStyle = `rgba(90,150,255,${.5 * a})`; c.beginPath(); c.ellipse(bx, by - 1 * u, w * .45, w * .55, 0, 0, 6.283); c.fill();
    }
  }
};
