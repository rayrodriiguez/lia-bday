const T_TERRA = {
  falas1: ["chegamos na Terra!", "agora olha com atenção, porque tem duas pessoas importantes aqui.", "uma tá de um lado do mapa...", "e a outra tá do outro."],
  ray: "Ray",
  rayLugar: "Pernambuco",
  lia: "Lia",
  liaLugar: "Brasília",
  distancia: "aproximadamente 1.650 km",
  falas2: ["daqui até aí são uns 1.650 km.", "seis anos conversando, fazendo planos e imaginando como vai ser quando a gente se encontrar.", "e agora tá pertinho de acontecer de verdade.", "depois de tanto tempo, finalmente vai ser a gente no mesmo lugar, sem precisar de uma tela no meio."],
  cartaoRay: { title: "Pernambuco", text: "onde eu tô, esperando o dia de finalmente trocar essa tela por um abraço seu." },
  cartaoLia: { title: "Brasília", text: "onde mora a aniversariante mais linda do planalto central." },
  dica: "toca nos pontinhos",
  abraco: "seis anos imaginando esse abraço. agora falta pouco.",
  rotulos: ["dias", "horas", "min", "seg"],
  ate: "até 12/11",
  hoje: "é hoje!!"
};

const ENCONTRO = new Date("2026-11-12T00:00:00-03:00");

function countdownHeart() {
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity 1.2s ease;background:radial-gradient(circle at 50% 56%, rgba(8,10,36,.55), rgba(8,10,36,0) 70%)";
  const box = document.createElement("div");
  box.style.cssText = "width:min(330px,84vw);margin-top:12vh;transform:scale(.6);transition:transform 1.4s cubic-bezier(.2,1.4,.4,1);filter:drop-shadow(0 12px 30px rgba(255,120,180,.45))";
  box.innerHTML = `
<svg viewBox="0 0 200 190" width="100%" role="img" aria-label="contagem regressiva para o encontro">
  <defs>
    <linearGradient id="cdh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc4de"/><stop offset="1" stop-color="#ff6fa8"/></linearGradient>
    <radialGradient id="cdg" cx=".35" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="M100 182 C40 142 4 110 4 63 C4 30 28 8 57 8 C77 8 92 20 100 36 C108 20 123 8 143 8 C172 8 196 30 196 63 C196 110 160 142 100 182Z" fill="url(#cdh)" stroke="#fff" stroke-width="3"/>
  <path d="M100 182 C40 142 4 110 4 63 C4 30 28 8 57 8 C77 8 92 20 100 36 C108 20 123 8 143 8 C172 8 196 30 196 63 C196 110 160 142 100 182Z" fill="url(#cdg)"/>
  <g class="cd-girls">

    <g transform="rotate(8 78 76)">
      <path d="M56 112 Q58 94 78 92 Q98 94 100 112 Z" fill="#26222e"/>
      <g fill="#7a4524">
        <circle cx="62" cy="62" r="9"/><circle cx="68" cy="51" r="9"/><circle cx="79" cy="47" r="10"/><circle cx="90" cy="52" r="9"/>
        <circle cx="95" cy="63" r="8"/><circle cx="60" cy="74" r="8"/><circle cx="96" cy="75" r="7"/><circle cx="62" cy="85" r="7"/><circle cx="94" cy="86" r="6"/>
      </g>
      <g fill="#a8653a"><circle cx="70" cy="49" r="3"/><circle cx="85" cy="47" r="3"/><circle cx="61" cy="66" r="2.5"/><circle cx="94" cy="60" r="2.5"/></g>
      <ellipse cx="78" cy="72" rx="16" ry="17" fill="#f2c4a2"/>
      <circle cx="69" cy="58" r="7" fill="#7a4524"/><circle cx="86" cy="57" r="7" fill="#7a4524"/><circle cx="78" cy="55" r="7" fill="#7a4524"/>
      <path d="M69 72 q3 -3 6 0" stroke="#3a2230" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M82 72 q3 -3 6 0" stroke="#3a2230" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="67" cy="79" rx="4" ry="2.5" fill="#ff8fb3" opacity=".6"/><ellipse cx="89" cy="79" rx="4" ry="2.5" fill="#ff8fb3" opacity=".6"/>
      <ellipse cx="78" cy="81" rx="3" ry="2.4" fill="#c9506e"/>
    </g>

    <g transform="rotate(-8 122 76)">
      <path d="M103 64 Q102 46 122 45 Q142 46 141 64 L143 104 Q122 112 101 104 Z" fill="#2a1914"/>
      <path d="M100 112 Q102 94 122 92 Q142 94 144 112 Z" fill="#f7cf45"/>
      <ellipse cx="122" cy="72" rx="16" ry="17" fill="#f4cdb0"/>
      <path d="M105 66 Q106 50 122 50 Q139 50 139 66 Q134 60 128 63 Q124 58 118 62 Q112 58 105 66 Z" fill="#2a1914"/>
      <path d="M113 73 q3 -3 6 0" stroke="#3a2230" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M126 73 q3 -3 6 0" stroke="#3a2230" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="111" cy="80" rx="4" ry="2.5" fill="#ff8fb3" opacity=".6"/><ellipse cx="133" cy="80" rx="4" ry="2.5" fill="#ff8fb3" opacity=".6"/>
      <path d="M118 82 q4 3.5 8 0" stroke="#b8475f" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    <path class="cd-mini" d="M100 40 c-3 -5 -10 -3 -9 2 c1 4 6 7 9 9 c3 -2 8 -5 9 -9 c1 -5 -6 -7 -9 -2z" fill="#fff"/>
  </g>
  <g font-family="Nunito, system-ui, sans-serif" text-anchor="middle" fill="#fff">
    <g class="cd-nums" font-weight="800" font-size="19">
      <text x="56" y="133">00</text><text x="85" y="133">00</text><text x="115" y="133">00</text><text x="144" y="133">00</text>
    </g>
    <g font-weight="700" font-size="7.5" opacity=".9" letter-spacing=".5">
      <text x="56" y="143">${T_TERRA.rotulos[0].toUpperCase()}</text><text x="85" y="143">${T_TERRA.rotulos[1].toUpperCase()}</text>
      <text x="115" y="143">${T_TERRA.rotulos[2].toUpperCase()}</text><text x="144" y="143">${T_TERRA.rotulos[3].toUpperCase()}</text>
    </g>
  </g>
</svg>`;
  wrap.appendChild(box);
  $("stage").appendChild(wrap);
  const nums = box.querySelectorAll(".cd-nums text"), mini = box.querySelector(".cd-mini");
  const tick = () => {
    const ms = ENCONTRO - Date.now();
    if (ms <= 0) {
      nums.forEach((n, i) => n.textContent = i === 1 ? T_TERRA.hoje : "");
      nums[1].setAttribute("x", "100");
      return;
    }
    const s = Math.floor(ms / 1000);
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    nums.forEach((n, i) => n.textContent = String(v[i]).padStart(2, "0"));
  };
  tick();
  const iv = setInterval(tick, 250);
  let k = 0;
  const bob = setInterval(() => { k += .1; mini.setAttribute("transform", `translate(0 ${Math.sin(k) * 2}) scale(1)`); }, 50);
  requestAnimationFrame(() => requestAnimationFrame(() => { wrap.style.opacity = "1"; box.style.transform = "scale(1)"; }));
  return {
    hide() { wrap.style.opacity = "0"; box.style.transform = "scale(.85)"; setTimeout(() => { clearInterval(iv); clearInterval(bob); wrap.remove(); }, 1300); }
  };
}

function drawPlane(c, x, y, ang, s) {
  c.save(); c.translate(x + 6 * s, y + 10 * s); c.rotate(ang); c.scale(s, s);
  c.fillStyle = "rgba(0,10,40,.25)";
  c.beginPath(); c.ellipse(0, 0, 16, 4, 0, 0, 6.283); c.fill();
  c.beginPath(); c.moveTo(2, 0); c.lineTo(-6, -15); c.lineTo(-10, -15); c.lineTo(-5, 0); c.lineTo(-10, 15); c.lineTo(-6, 15); c.closePath(); c.fill();
  c.restore();
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);

  const wg = c.createLinearGradient(0, -16, 0, 16);
  wg.addColorStop(0, "#e9ecf7"); wg.addColorStop(.5, "#ffffff"); wg.addColorStop(1, "#c9cfe2");
  c.fillStyle = wg;
  c.beginPath(); c.moveTo(3, -2); c.lineTo(-5, -17); c.lineTo(-10, -17); c.lineTo(-5, -2); c.lineTo(-5, 2); c.lineTo(-10, 17); c.lineTo(-5, 17); c.lineTo(3, 2); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-12, -1); c.lineTo(-17, -7); c.lineTo(-19, -7); c.lineTo(-16, 0); c.lineTo(-19, 7); c.lineTo(-17, 7); c.lineTo(-12, 1); c.closePath(); c.fill();

  const bg = c.createLinearGradient(0, -4, 0, 4);
  bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, "#d6dbea");
  c.fillStyle = bg;
  c.beginPath(); c.ellipse(-2, 0, 17, 3.8, 0, 0, 6.283); c.fill();
  c.fillStyle = "#ff8fbf";
  c.beginPath(); c.ellipse(-2, 0, 17, 1.2, 0, 0, 6.283); c.fill();
  c.fillStyle = "#7fb6ff";
  c.beginPath(); c.ellipse(11, 0, 3, 2.2, 0, 0, 6.283); c.fill();
  c.restore();
}

const GEO = {
  sa: [[-77.4, 7.9], [-75.5, 10.6], [-72, 12], [-67, 10.7], [-63, 10.7], [-60, 8.5], [-57, 6], [-53.9, 5.6], [-51.6, 4.4], [-50, 1.8], [-49.5, -.2], [-48.5, -1.3], [-44.3, -2.5], [-41.8, -2.9], [-38.5, -3.7], [-37.2, -4.9], [-35.2, -5.8], [-34.8, -7.15], [-34.9, -8.05], [-35.7, -9.7], [-37, -10.9], [-38.5, -13], [-39, -15.5], [-39.2, -17.8], [-40.3, -20.3], [-42, -22.9], [-43.2, -23], [-46.3, -24], [-48.5, -26], [-48.5, -27.6], [-49.5, -29], [-50.3, -30.5], [-52.1, -32], [-53.4, -33.7], [-56, -34.9], [-58.4, -34.6], [-57.5, -38], [-62, -39], [-65, -42], [-67.5, -46], [-69, -51], [-68.5, -52.5], [-71, -54], [-74, -52], [-75.5, -47], [-73.5, -42], [-73.5, -37], [-71.6, -33], [-71.4, -28], [-70.4, -23.6], [-70.3, -18.4], [-75, -15.5], [-77, -12], [-79.5, -7.5], [-81.3, -4.5], [-80, -1], [-80, 1], [-78.8, 1.8], [-77.4, 4]],
  br: [[-51.6, 4.4], [-50, 1.8], [-49.5, -.2], [-48.5, -1.3], [-44.3, -2.5], [-41.8, -2.9], [-38.5, -3.7], [-37.2, -4.9], [-35.2, -5.8], [-34.8, -7.15], [-34.9, -8.05], [-35.7, -9.7], [-37, -10.9], [-38.5, -13], [-39, -15.5], [-39.2, -17.8], [-40.3, -20.3], [-42, -22.9], [-43.2, -23], [-46.3, -24], [-48.5, -26], [-48.5, -27.6], [-49.5, -29], [-50.3, -30.5], [-52.1, -32], [-53.4, -33.7], [-53.4, -32.6], [-55.8, -30.9], [-57.1, -29.8], [-55.7, -28.2], [-53.8, -27.1], [-54.6, -25.5], [-54.3, -24], [-55.7, -22.5], [-57.9, -22.1], [-58, -20], [-57.7, -19], [-58.4, -17.3], [-60.2, -16.3], [-60, -13.6], [-62.5, -13], [-65.3, -10.8], [-66.6, -9.9], [-69.6, -10.9], [-72.6, -9.8], [-74, -7.5], [-72.9, -5.2], [-69.9, -4.2], [-69.4, -1.1], [-69.9, 1], [-66.8, 1.2], [-64, 2], [-64.8, 4.2], [-60.7, 5.2], [-60.2, 5.2], [-59.8, 4.5], [-58, 1.9], [-56.5, 1.9], [-54, 2.2]],
  af: [[-17, 14.7], [-16.5, 12], [-13, 8.5], [-8, 4.5], [-3, 5], [4.5, 6.3], [9.5, 4], [9.5, -1], [12, -5.5], [13.5, -12], [11.8, -17], [14.5, -22.9], [17, -29], [18.5, -34.3], [20, -34.8], [25.6, -34], [30.5, -31], [32.9, -26], [35.5, -24], [35, -20], [40.7, -15], [39.5, -7], [40, -3], [43, 1], [51.2, 11.8], [43.3, 11.8], [38.5, 18], [34, 27], [32.3, 31.3], [20, 31], [11, 33.5], [10, 37], [-1.5, 35.5], [-5.9, 35.8], [-9.6, 30.5], [-13, 27.5], [-16, 19]],
  na: [[-77.4, 7.9], [-80, 9], [-83, 9.5], [-85.5, 11], [-87.5, 13.3], [-92, 14.5], [-95, 16], [-97, 19], [-97.3, 25.9], [-94, 29.5], [-89.5, 29.3], [-85, 29.9], [-82.7, 27.8], [-81, 25.2], [-80, 26.8], [-81.4, 30.5], [-75.5, 35.3], [-74, 40.6], [-70, 41.7], [-66, 44.5], [-61, 45.5], [-55.5, 51.5], [-60, 55], [-64.5, 60.3], [-70, 62], [-78, 62.5], [-82, 58], [-92, 57], [-95, 61], [-110, 68], [-125, 70], [-140, 69], [-130, 55], [-124.5, 48], [-124, 42], [-122.5, 37.8], [-117.2, 32.7], [-114, 30], [-110, 23], [-105.7, 20.5], [-102.5, 18], [-96, 15.7], [-92, 14.5]],
  eu: [[-9.5, 37], [-8.9, 43], [-1.8, 43.4], [-4.7, 48.4], [1.5, 50.9], [4.5, 53], [8.6, 57.1], [5, 62], [14, 68], [25, 71], [30, 70], [30, 60], [30, 46], [28, 41], [23, 37.5], [15.5, 38], [12.5, 41.7], [8.5, 44.3], [3, 43.3], [-.5, 38.5], [-5.6, 36]],
  pe: [[-34.8, -7.5], [-35.6, -7.35], [-36.6, -7.55], [-37.2, -7.3], [-38.2, -7.6], [-39, -7.35], [-39.7, -7.5], [-40.5, -7.4], [-41, -7.8], [-41.3, -8.3], [-40.9, -8.9], [-40.6, -9.4], [-39.7, -9.2], [-38.8, -9], [-38.3, -9.3], [-37.8, -9.1], [-37, -9], [-36.2, -9], [-35.5, -8.9], [-35.1, -8.9], [-34.95, -8.4]],
  df: [[-48.28, -15.5], [-47.31, -15.5], [-47.31, -16.05], [-48.28, -16.05]],
  greenland: [[-45, 60], [-52, 64], [-55, 70], [-60, 76], [-70, 78], [-40, 83], [-20, 80], [-20, 72], [-30, 68], [-40, 65]]
};
const RECIFE = [-34.88, -8.05], BSB = [-47.88, -15.79];
const CLOUDS = Array.from({ length: 26 }, () => ({ lon: rand(-180, 180), lat: rand(-60, 60), r: rand(4, 11), sp: rand(.4, 1.2) }));

function geoProj(lon, lat, lon0, lat0) {
  const d = Math.PI / 180, l = (lon - lon0) * d, p = lat * d, p0 = lat0 * d;
  return {
    x: Math.cos(p) * Math.sin(l),
    y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l),
    z: Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l)
  };
}
function globePoint(lon, lat, g) {
  const q = geoProj(lon, lat, g.lon0, g.lat0);
  return { x: g.cx + q.x * g.R, y: g.cy - q.y * g.R, z: q.z };
}

function globePath(c, pts, g) {
  const P = pts.map(([lon, lat]) => {
    const q = geoProj(lon, lat, g.lon0, g.lat0);
    let x = q.x, y = q.y;
    if (q.z < 0) { const n = Math.hypot(x, y) || 1; x /= n; y /= n; }
    return { x: g.cx + x * g.R, y: g.cy - y * g.R };
  });
  const n = P.length;
  c.beginPath();
  c.moveTo((P[n - 1].x + P[0].x) / 2, (P[n - 1].y + P[0].y) / 2);
  for (let i = 0; i < n; i++) {
    const p = P[i], q = P[(i + 1) % n];
    c.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
  }
  c.closePath();
}

function drawGlobe(c, g, t, o = {}) {
  const { cx, cy, R } = g;
  const zoom = clamp((R / Math.min(W, H) - .5) / 2.5);

  const ag = c.createRadialGradient(cx, cy, R * .96, cx, cy, R * 1.18);
  ag.addColorStop(0, "rgba(120,190,255,.55)"); ag.addColorStop(.4, "rgba(90,150,255,.18)"); ag.addColorStop(1, "rgba(60,100,255,0)");
  c.fillStyle = ag; c.beginPath(); c.arc(cx, cy, R * 1.18, 0, 6.283); c.fill();
  c.save();
  c.beginPath(); c.arc(cx, cy, R, 0, 6.283); c.clip();

  const og = c.createRadialGradient(cx - R * .3, cy - R * .35, R * .05, cx, cy, R);
  og.addColorStop(0, "#4fb3e8"); og.addColorStop(.5, "#1f6fb8"); og.addColorStop(1, "#0b2a63");
  c.fillStyle = og; c.fillRect(cx - R, cy - R, R * 2, R * 2);

  c.lineJoin = "round";
  for (const k of ["na", "greenland", "eu", "af", "sa"]) {
    globePath(c, GEO[k], g);
    c.fillStyle = k === "greenland" ? "#e9f3f5" : "#6fb27a"; c.fill();
  }
  globePath(c, GEO.br, g);
  c.fillStyle = "#4fae6a"; c.fill();
  c.strokeStyle = `rgba(255,236,150,${.35 + zoom * .5})`; c.lineWidth = 1 + zoom * 2; c.stroke();

  const hl = o.highlight || 0;
  if (hl > 0) {
    c.save();
    globePath(c, GEO.pe, g);
    c.shadowColor = "rgba(255,200,90,.9)"; c.shadowBlur = 18 * hl;
    c.fillStyle = `rgba(255,198,96,${.6 * hl})`; c.fill();
    c.shadowBlur = 0;
    c.strokeStyle = `rgba(255,250,230,${.85 * hl})`; c.lineWidth = 1.6; c.lineJoin = "round"; c.stroke();
    const d = globePoint(BSB[0], BSB[1], g), rr = Math.max(16, R * .011) * (1 + Math.sin(t * 2) * .06);
    const dg = c.createRadialGradient(d.x, d.y, 0, d.x, d.y, rr * 2.2);
    dg.addColorStop(0, `rgba(255,160,205,${.85 * hl})`); dg.addColorStop(.45, `rgba(255,140,195,${.45 * hl})`); dg.addColorStop(1, "rgba(255,140,195,0)");
    c.fillStyle = dg; c.beginPath(); c.arc(d.x, d.y, rr * 2.2, 0, 6.283); c.fill();
    c.restore();
  }

  const ca = 1 - zoom * .85;
  if (ca > .05) {
    for (const cl of CLOUDS) {
      const p = globePoint(cl.lon + t * cl.sp, cl.lat, g);
      if (p.z < .05) continue;
      const rr = cl.r / 57.3 * R;
      c.globalAlpha = ca * .55 * p.z;
      const cg = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
      cg.addColorStop(0, "rgba(255,255,255,.9)"); cg.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = cg; c.beginPath(); c.ellipse(p.x, p.y, rr * 1.4, rr * .8 * Math.max(.3, p.z), 0, 0, 6.283); c.fill();
    }
    c.globalAlpha = 1;
  }

  const sh = c.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  sh.addColorStop(0, `rgba(255,255,255,${.12 * (1 - zoom)})`); sh.addColorStop(.55, "rgba(0,0,0,0)"); sh.addColorStop(1, `rgba(0,0,30,${.55 * (1 - zoom)})`);
  c.fillStyle = sh; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  const rim = c.createRadialGradient(cx, cy, R * .82, cx, cy, R);
  rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, "rgba(150,210,255,.35)");
  c.fillStyle = rim; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  c.restore();

  const a = globePoint(RECIFE[0], RECIFE[1], g), b = globePoint(BSB[0], BSB[1], g);
  const line = o.line || 0, meet = o.meet || 0;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - dist(a.x, a.y, b.x, b.y) * .35;
  const at = u => ({ x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * mx + u * u * b.x, y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * my + u * u * b.y, z: 1 });

  const u0 = meet * .5, u1 = Math.min(line, 1 - meet * .5);
  if (line > 0 && a.z > 0 && b.z > 0 && u1 > u0 + .002) {
    c.save();
    c.strokeStyle = "rgba(255,240,200,.95)"; c.lineWidth = 2.6; c.lineCap = "round";
    c.shadowColor = "rgba(255,210,120,.9)"; c.shadowBlur = 12;
    c.setLineDash([2, 9]); c.lineDashOffset = -t * 30;
    c.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) { const q = at(u0 + (u1 - u0) * i / steps); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }
    c.stroke(); c.setLineDash([]); c.restore();
    if (line >= 1 && !meet) {
      const q = at((t * .25) % 1);
      c.fillStyle = "#ff8fbf"; c.shadowColor = "#ff8fbf"; c.shadowBlur = 10;
      drawHeartShape(c, q.x, q.y + 4, 8); c.fill(); c.shadowBlur = 0;
    }
    if (line >= 1 && o.label && !meet) {
      c.font = "800 13px Nunito, system-ui, sans-serif"; c.textAlign = "center";
      const tw = c.measureText(T_TERRA.distancia).width + 22;
      c.fillStyle = "rgba(10,14,40,.72)";
      c.beginPath(); c.roundRect ? c.roundRect(mx - tw / 2, my - 40, tw, 26, 13) : c.rect(mx - tw / 2, my - 40, tw, 26); c.fill();
      c.fillStyle = "#fff6dc"; c.fillText(T_TERRA.distancia, mx, my - 22);
    }
  }

  const heart = o.heart || 0;
  if (heart > 0) {
    const q = at(.5), s = 10 + easeOut(heart) * 34 * (1 + Math.sin(t * 3) * .05);
    c.save();
    c.fillStyle = "#ff7fb6"; c.shadowColor = "#ffb3d6"; c.shadowBlur = 26;
    const hg = c.createLinearGradient(q.x, q.y - s, q.x, q.y + s);
    hg.addColorStop(0, "#ffb3d6"); hg.addColorStop(1, "#ff5fa2");
    c.fillStyle = hg; c.globalAlpha = clamp(heart * 2);
    drawHeartShape(c, q.x, q.y + s * .3, s); c.fill();
    c.restore();
  }
  const pins = o.pins || 0;
  if (pins > 0) {
    const pa = meet ? { ...at(u0), z: a.z } : a, pb = meet ? { ...at(1 - u0), z: b.z } : b;
    const fade = 1 - clamp((heart - .1) * 3);
    if (fade > 0) {
      c.globalAlpha = fade;
      drawPin(c, pa, clamp(pins * 2), T_TERRA.ray, meet ? "" : T_TERRA.rayLugar, "#ffb347", t, 1);
      c.globalAlpha = fade;
      drawPin(c, pb, clamp(pins * 2 - 1), T_TERRA.lia, meet ? "" : T_TERRA.liaLugar, "#ff6fa8", t, -1);
      c.globalAlpha = 1;
    }
  }
  return { a, b };
}
function drawPin(c, p, k, name, place, col, t, side) {
  if (k <= 0 || p.z <= 0) return;
  const A = c.globalAlpha, s = easeOut(k), y = p.y - 26 * s;
  const pulse = (t * .8) % 1;
  c.strokeStyle = col; c.globalAlpha = A * (1 - pulse) * s; c.lineWidth = 2;
  c.beginPath(); c.ellipse(p.x, p.y, 8 + pulse * 26, (8 + pulse * 26) * .45, 0, 0, 6.283); c.stroke();
  c.globalAlpha = A * s;
  c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 14;
  c.beginPath(); c.moveTo(p.x, p.y);
  c.bezierCurveTo(p.x - 13, y + 4, p.x - 13, y - 16, p.x, y - 16);
  c.bezierCurveTo(p.x + 13, y - 16, p.x + 13, y + 4, p.x, p.y); c.fill();
  c.shadowBlur = 0; c.fillStyle = "#fff";
  c.beginPath(); c.arc(p.x, y - 6, 4.5, 0, 6.283); c.fill();
  c.textAlign = "center";
  c.font = "700 32px Caveat, cursive"; c.fillStyle = "#ffffff";
  c.shadowColor = "rgba(0,0,30,.9)"; c.shadowBlur = 8;
  c.fillText(name, p.x, y - 24);
  c.font = "800 11px Nunito, system-ui, sans-serif"; c.fillStyle = "rgba(255,246,220,.95)";
  c.fillText(place.toUpperCase(), p.x, p.y + 22);
  c.shadowBlur = 0; c.globalAlpha = A;
}

S.terra = {
  music: "terra", tone: "dark",
  stars: [], g: { cx: 0, cy: 0, R: 100, lon0: -20, lat0: 0 }, o: { pins: 0, line: 0, highlight: 0, label: false },
  phase: "idle", tapped: new Set(),
  init() {
    this.stars = makeStarfield(Math.round(W * H / 2400));
    if (this.phase === "idle") this.g = { ...this.startView() };
  },
  startView() { return { cx: W / 2, cy: H * .66, R: Math.min(W, H) * .42, lon0: -10, lat0: 0 }; },
  pinsView() {
    const sep = .257, target = Math.min(W * .5, H * .45);
    return { cx: W / 2, cy: H * .58, R: target / sep, lon0: -41.4, lat0: -12.3 };
  },
  pose(name) {
    if (name === "pins") { this.g = this.pinsView(); this.o = { pins: 1, line: 1, highlight: 1, label: true }; }
  },
  async enter() {
    this.phase = "story"; this.tapped = new Set();
    const from = { ...this.g }, mid = { cx: W / 2, cy: H * .55, R: Math.min(W, H) * .4, lon0: -48, lat0: -12 };
    this.o = { pins: 0, line: 0, highlight: 0, label: false };
    const run = animate(4200, p => { for (const k in mid) this.g[k] = lerp(from[k], mid[k], p); }, easeInOut);
    await narrate(T_TERRA.falas1, { keepLast: true });
    await run;
    const pv = this.pinsView(), z0 = { ...this.g };
    sfx.whoosh(2.4);
    await animate(3200, p => { for (const k in pv) this.g[k] = lerp(z0[k], pv[k], p); }, easeInOut);
    unsay();
    await animate(900, p => this.o.highlight = p);
    sfx.chime(2); await animate(700, p => this.o.pins = p * .5);
    sfx.chime(5); await animate(700, p => this.o.pins = .5 + p * .5);
    sfx.sparkle();
    await animate(1600, p => this.o.line = p, easeInOut);
    this.o.label = true;
    this.phase = "pins";
    await narrate(T_TERRA.falas2);
    hint(T_TERRA.dica);
    await wait(5000);
    hint(""); hideInfo();

    this.phase = "meet";
    await say(T_TERRA.abraco);
    sfx.whoosh(3);
    await animate(4200, p => this.o.meet = p, easeInOut);
    const meetPt = this.pp ? { x: (this.pp.a.x + this.pp.b.x) / 2, y: (this.pp.a.y + this.pp.b.y) / 2 - dist(this.pp.a.x, this.pp.a.y, this.pp.b.x, this.pp.b.y) * .175 } : { x: W / 2, y: H / 2 };
    sparkle(meetPt.x, meetPt.y, 50, { colors: ["#ffb3d6", "#ffffff", "#ffe2b0"], speed: 200, gravity: 0, shape: "heart", glow: 8, size: 2.6 });
    sfx.fanfare();
    await animate(1000, p => this.o.heart = p, easeOut);
    await wait(800);
    const cd = countdownHeart();
    await wait(10000);
    cd.hide(); unsay();
    await animate(800, p => this.o.heart = 1 - p);
    await animate(1500, p => this.o.meet = 1 - p, easeInOut);
    this.o.meet = 0; this.o.heart = 0;

    this.phase = "plane";
    this.plane = { u: 0, trail: [] };
    this.o.label = false;
    sfx.whoosh(3);
    await animate(5200, p => { this.plane.u = p; }, easeInOut);
    const pa = this.pp.a;
    sparkle(pa.x, pa.y, 26, { colors: ["#ffffff", "#ffe2b0", "#ffd0e4"], speed: 90, gravity: 0, shape: "heart", glow: 6 });
    sfx.chime(7); sfx.sparkle();
    await wait(1100);
    this.plane = null;
    this.phase = "dive";
    const z1 = { ...this.g }, dive = { cx: W / 2, cy: H / 2, R: z1.R * 9, lon0: RECIFE[0] + 1.2, lat0: RECIFE[1] };
    sfx.whoosh(2.4);
    this.puffs = Array.from({ length: 16 }, () => ({ a: rand(0, 6.283), d: rand(.05, .5), s: rand(.6, 1.4), delay: rand(0, .5) }));
    await animate(2600, p => { for (const k in dive) this.g[k] = lerp(z1[k], dive[k], p); this.o.pins = 1 - p; this.o.line = 1 - p; this.dive = p; }, easeIn);
    await go("mar", { color: "#dff1ff", out: 400, inn: 900 });
    this.dive = 0; this.phase = "idle";
  },
  exit() {},
  update() {
    if (this.phase === "idle") this.g.lon0 = -10 + Math.sin(TIME * .05) * 20;
  },
  draw(c, t) {
    const bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#04050f"); bg.addColorStop(1, "#0d0b26");
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    drawStarfield(c, this.stars, t);

    const sg = c.createRadialGradient(-W * .1, -H * .05, 0, -W * .1, -H * .05, Math.max(W, H) * .6);
    sg.addColorStop(0, "rgba(255,230,190,.18)"); sg.addColorStop(1, "rgba(255,230,190,0)");
    c.fillStyle = sg; c.fillRect(0, 0, W, H);
    this.pp = drawGlobe(c, this.g, t, this.o);
    if (this.plane && this.pp) {
      const { a, b } = this.pp, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - dist(a.x, a.y, b.x, b.y) * .35;
      const at = u => ({ x: (1 - u) * (1 - u) * b.x + 2 * (1 - u) * u * mx + u * u * a.x, y: (1 - u) * (1 - u) * b.y + 2 * (1 - u) * u * my + u * u * a.y });
      const u = this.plane.u, p = at(u), q = at(Math.min(1, u + .01));
      const ang = Math.atan2(q.y - p.y, q.x - p.x) || 0;

      c.save(); c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 2.5; c.lineCap = "round";
      c.beginPath();
      for (let k = 0; k <= 24; k++) { const v = Math.max(0, u - .35 + .35 * k / 24), pt = at(v); k ? c.lineTo(pt.x, pt.y) : c.moveTo(pt.x, pt.y); }
      c.globalAlpha = .6; c.stroke(); c.restore();
      const alt = Math.sin(u * Math.PI);
      drawPlane(c, p.x, p.y - alt * 10, ang, (isSmall() ? 1.5 : 1.8) * (1 + alt * .45));
    }

    if (this.dive > 0) {
      if (!this.cloudSpr) this.cloudSpr = glowSprite("rgba(255,255,255,.95)", 128);
      const m = Math.max(W, H);
      for (const pf of this.puffs) {
        const k = clamp((this.dive - pf.delay) / (1 - pf.delay));
        if (k <= 0) continue;
        const e = easeIn(k), dd = (pf.d + e * 1.2) * m, r = m * pf.s * (.15 + e * .9);
        c.globalAlpha = Math.sin(k * Math.PI) * .9;
        c.drawImage(this.cloudSpr, W / 2 + Math.cos(pf.a) * dd - r, H / 2 + Math.sin(pf.a) * dd - r, r * 2, r * 2);
      }
      c.globalAlpha = 1;
      c.fillStyle = `rgba(223,241,255,${easeIn(clamp((this.dive - .6) / .4)) * .85})`;
      c.fillRect(0, 0, W, H);
    }
  },
  down(x, y) {
    if (this.phase !== "pins" || !this.pp) return;
    const { a, b } = this.pp;
    if (dist(x, y, a.x, a.y - 20) < 44) { sfx.chime(3); sparkle(a.x, a.y - 20, 24, { colors: ["#ffd27a", "#fff"], gravity: 0, shape: "star", glow: 6 }); info(T_TERRA.cartaoRay); }
    else if (dist(x, y, b.x, b.y - 20) < 44) { sfx.chime(6); sparkle(b.x, b.y - 20, 24, { colors: ["#ff9cc8", "#fff"], gravity: 0, shape: "heart", glow: 6 }); info(T_TERRA.cartaoLia); }
  }
};
