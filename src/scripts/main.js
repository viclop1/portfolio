/* Client-side interactivity: router, theme, architecture explorer, trace, screenshot gallery, command palette.
   Static copy is rendered at build time from src/i18n; this file only handles dynamic, bilingual widgets through t(en, es). */
import { EMAIL } from "../data/site.js";
import { NODES, FLOWS } from "../data/architecture.js";
import { SPANS, NOWV, fr } from "../data/career.js";
import { TESTS } from "../data/how-i-work.js";
import { STATS, TOUR } from "../data/hoopline.js";

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = document.documentElement.lang === "es" ? "es" : "en";
  var renderers = [];

  /* ---------- i18n ---------- */
  function t(en, es) { return lang === "es" ? es : en; }
  function applyStatic() {
    $("#theme").textContent = isDark() ? t("light", "claro") : t("dark", "oscuro");
    renderers.forEach(function (fn) { fn(); });
  }
  try { localStorage.setItem("vlr-lang", lang); } catch (e) {}
  function switchLang(l) { var a = $("#l-" + l); if (a) location.href = a.getAttribute("href") + location.hash; }
  $$(".seg a").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); switchLang(a.getAttribute("hreflang")); });
  });

  /* ---------- theme ---------- */
  function isDark() {
    var th = root.getAttribute("data-theme");
    if (th) return th === "dark";
    return !(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
  }
  try { var st = localStorage.getItem("vlr-theme"); if (st) root.setAttribute("data-theme", st); } catch (e) {}
  var themeHooks = [];
  function toggleTheme() {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("vlr-theme", next); } catch (e) {}
    $("#theme").textContent = isDark() ? t("light", "claro") : t("dark", "oscuro");
    themeHooks.forEach(function (f) { f(); });
  }
  $("#theme").addEventListener("click", toggleTheme);
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onMq = function () { themeHooks.forEach(function (f) { f(); }); };
    if (mq.addEventListener) mq.addEventListener("change", onMq);
  }
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
  $("#kbd").textContent = isMac ? "⌘K" : "Ctrl K";

  /* ---------- scroll progress ---------- */
  var prog = $("#progress");
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- uptime ---------- */
  function renderUptime() {
    var s = new Date(2015, 3, 1), n = new Date();
    var m = (n.getFullYear() - s.getFullYear()) * 12 + (n.getMonth() - s.getMonth());
    if (n.getDate() < s.getDate()) m -= 1;
    var y = Math.floor(m / 12), mo = m % 12, out;
    if (lang === "es") out = y + " años" + (mo ? ", " + mo + (mo > 1 ? " meses" : " mes") : "");
    else out = y + " years" + (mo ? ", " + mo + (mo > 1 ? " months" : " month") : "");
    $("#uptime").textContent = out;
  }
  renderers.push(renderUptime);

  /* ---------- Hoopline architecture explorer ---------- */
  var NS = "http://www.w3.org/2000/svg";
  var svg = $("#svg"), diag = $("#diagram"), gEdges, gPacket, gNodes, packet, nodeEls = {}, curFlow = 0, curStep = 0, playT = null, raf = null;
  function mk(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el); return el;
  }
  function buildSvg() {
    var defs = mk("defs", {}, svg);
    var m = mk("marker", { id: "arr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
    mk("path", { d: "M0 1 L10 5 L0 9 z", "class": "mk" }, m);
    var grp = mk("g", { "class": "grp" }, svg);
    mk("rect", { x: 470, y: 14, width: 300, height: 368, rx: 16 }, grp);
    var tx = mk("text", { x: 486, y: 32 }, grp); tx.textContent = "Supabase";
    gEdges = mk("g", {}, svg); gPacket = mk("g", {}, svg); gNodes = mk("g", {}, svg);
    packet = mk("circle", { r: 6, "class": "pk", cx: -20, cy: -20 }, gPacket);
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id], g = mk("g", { "class": "nd" }, gNodes);
      mk("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 10 }, g);
      var ty = n.s ? n.y + n.h / 2 - 3 : n.y + n.h / 2 + 5;
      var a = mk("text", { x: n.x + n.w / 2, y: ty }, g); a.textContent = n.l;
      if (n.s) { var b = mk("text", { x: n.x + n.w / 2, y: n.y + n.h / 2 + 14, "class": "sb" }, g); b.textContent = n.s; }
      nodeEls[id] = g;
    });
  }
  function anchors(a, b) {
    var A = NODES[a], B = NODES[b], ax = A.x + A.w / 2, bx = B.x + B.w / 2, ay = A.y + A.h / 2, by = B.y + B.h / 2;
    if (Math.abs(ax - bx) > (A.w + B.w) / 2 - 10) {
      return bx > ax ? { x1: A.x + A.w, y1: ay, x2: B.x, y2: by, h: 1 } : { x1: A.x, y1: ay, x2: B.x + B.w, y2: by, h: 1 };
    }
    return by > ay ? { x1: ax, y1: A.y + A.h, x2: bx, y2: B.y, h: 0 } : { x1: ax, y1: A.y, x2: bx, y2: B.y + B.h, h: 0 };
  }
  function pathD(p) {
    if (p.h) { var mx = (p.x1 + p.x2) / 2; return "M" + p.x1 + " " + p.y1 + " C" + mx + " " + p.y1 + " " + mx + " " + p.y2 + " " + p.x2 + " " + p.y2; }
    var my = (p.y1 + p.y2) / 2; return "M" + p.x1 + " " + p.y1 + " C" + p.x1 + " " + my + " " + p.x2 + " " + my + " " + p.x2 + " " + p.y2;
  }
  function renderFlows() {
    var box = $("#flows"); box.innerHTML = "";
    FLOWS.forEach(function (f, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "pill"; b.textContent = lang === "es" ? f.es : f.en;
      b.setAttribute("aria-pressed", i === curFlow);
      b.addEventListener("click", function () { stopPlay(); curFlow = i; curStep = 0; renderArch(true); });
      box.appendChild(b);
    });
  }
  function renderArch(reveal) {
    var f = FLOWS[curFlow], st = f.steps[curStep], idx = lang === "es" ? "es" : "en";
    renderFlows();
    gEdges.innerHTML = "";
    $$(".pulse", gNodes).forEach(function (el) { el.parentNode.removeChild(el); });
    var nowPath = null, visited = {};
    f.steps.forEach(function (s, i) {
      if (i <= curStep) { visited[s.a] = 1; visited[s.b] = 1; }
      if (s.a === s.b) return;
      var cls = i < curStep ? "eg past" : i === curStep ? "eg now" : "eg fut";
      var p = mk("path", { d: pathD(anchors(s.a, s.b)), "class": cls }, gEdges);
      if (i <= curStep) p.setAttribute("marker-end", "url(#arr)");
      if (i === curStep) nowPath = p;
    });
    Object.keys(nodeEls).forEach(function (id) {
      nodeEls[id].setAttribute("class", "nd" + (id === st.a || id === st.b ? " act" : visited[id] ? " vis" : ""));
    });
    if (st.a === st.b) { var n = NODES[st.a]; mk("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 10, "class": "pulse" }, nodeEls[st.a]); }
    $("#stepinfo").innerHTML = '<div class="sn">' + t("Step ", "Paso ") + (curStep + 1) + "/" + f.steps.length + " · " + (lang === "es" ? f.es : f.en) + "</div><p>" + st[idx] + "</p>";
    $("#play").textContent = playT ? t("Pause", "Pausa") : t("Play", "Reproducir");
    $("#prev").disabled = curStep === 0; $("#next").disabled = curStep === f.steps.length - 1;
    svg.setAttribute("aria-label", t("Architecture of Hoopline GM", "Arquitectura de Hoopline GM"));
    animatePacket(nowPath);
    if (reveal) revealNode(st.b);
  }
  function animatePacket(path) {
    cancelAnimationFrame(raf);
    if (!path || reduce) { packet.setAttribute("cx", -20); packet.setAttribute("cy", -20); return; }
    var L = path.getTotalLength(), t0 = null;
    (function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (((ts - t0) % 1700) / 1000)), pt = path.getPointAtLength(L * p);
      packet.setAttribute("cx", pt.x); packet.setAttribute("cy", pt.y);
      raf = requestAnimationFrame(frame);
    })(performance.now());
  }
  function revealNode(id) {
    if (diag.scrollWidth <= diag.clientWidth + 2) return;
    var n = NODES[id], sc = diag.scrollWidth / 1000;
    diag.scrollTo({ left: Math.max(0, (n.x + n.w / 2) * sc - diag.clientWidth / 2), behavior: reduce ? "auto" : "smooth" });
  }
  function stopPlay() { clearInterval(playT); playT = null; }
  function togglePlay() {
    if (playT) { stopPlay(); renderArch(false); return; }
    if (curStep >= FLOWS[curFlow].steps.length - 1) curStep = 0;
    playT = setInterval(function () {
      if (curStep < FLOWS[curFlow].steps.length - 1) { curStep++; renderArch(true); } else { stopPlay(); renderArch(false); }
    }, 3600);
    renderArch(true);
  }
  $("#prev").addEventListener("click", function () { stopPlay(); if (curStep > 0) { curStep--; renderArch(true); } });
  $("#next").addEventListener("click", function () { stopPlay(); if (curStep < FLOWS[curFlow].steps.length - 1) { curStep++; renderArch(true); } });
  $("#play").addEventListener("click", togglePlay);
  buildSvg();
  renderers.push(function () { renderArch(false); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { if (!es[0].isIntersecting) { stopPlay(); cancelAnimationFrame(raf); } else { renderArch(false); } }, { threshold: 0.05 }).observe(diag);
  }

  /* ---------- career trace ---------- */
  var T0 = fr(2015, 3), T1 = NOWV + 0.08, SPAN_T = T1 - T0;
  function pct(v) { return ((v - T0) / SPAN_T) * 100; }
  var rowsEl = $("#rows"), range = $("#range"), curV = NOWV;
  (function build() {
    var ax = $("#axis");
    for (var y = 2015; y <= 2026; y++) {
      var tk = document.createElement("span"); tk.className = "tick" + (y % 2 ? " odd" : ""); tk.style.left = pct(y) + "%"; tk.textContent = y;
      if (pct(y) >= 0) ax.appendChild(tk);
    }
    SPANS.forEach(function (s) {
      var row = document.createElement("div"); row.className = "row"; row.setAttribute("data-id", s.id);
      row.innerHTML = '<div class="rl' + (s.child ? " child" : "") + '">' + (s.child ? "└ " : "") + s.name + '</div><div class="track"><div class="bar2' + (s.group ? " grp" : "") + (s.cur ? " cur" : "") + '" style="left:' + pct(s.from) + "%;width:" + (pct(s.to) - pct(s.from)) + '%"></div><div class="ph"></div></div>';
      row.addEventListener("click", function () { setV(Math.min(s.to - 0.01, Math.max(s.from, (s.from + s.to) / 2))); });
      rowsEl.appendChild(row);
    });
  })();
  function monthYear(v) {
    var y = Math.floor(v + 1e-6), m = Math.min(11, Math.floor((v - y) * 12 + 1e-6));
    try { return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" }).format(new Date(y, m, 1)); } catch (e) { return y + "-" + (m + 1); }
  }
  function renderTrace() {
    var v = curV, leaf = null;
    SPANS.forEach(function (s) { if (!s.group && v >= s.from && v < s.to) leaf = s; });
    $$(".row", rowsEl).forEach(function (row) {
      var id = row.getAttribute("data-id"), s = SPANS.filter(function (x) { return x.id === id; })[0];
      var on = v >= s.from && v < s.to; row.classList.toggle("on", on);
      $(".ph", row).style.left = Math.max(0, Math.min(100, pct(v))) + "%";
    });
    $("#when").textContent = (v >= NOWV - 0.04 ? t("now", "ahora") + " · " : "") + monthYear(Math.min(v, NOWV - 0.001));
    var d = $("#detail");
    if (!leaf) { d.innerHTML = "<h3>" + t("Between roles", "Entre puestos") + "</h3><p>" + t("A short gap in the timeline. Keep scrubbing.", "Un pequeño hueco en la línea de tiempo. Sigue moviendo el cursor.") + "</p>"; return; }
    var idx = lang === "es" ? 1 : 0, org = leaf.child ? leaf.parent : leaf.name;
    var from = monthYear(leaf.from), to = leaf.cur ? t("present", "actualidad") : monthYear(leaf.to - 0.001);
    d.innerHTML = "<h3>" + leaf.role[idx] + "</h3><div class=\"org\">" + org + " · " + leaf.loc + " · " + from + " → " + to + "</div><p>" + leaf.sum[idx] + "</p>" +
      (leaf.tech.length ? "<div class=\"tags\">" + leaf.tech.map(function (x) { return "<span class=\"tag\">" + x + "</span>"; }).join("") + "</div>" : "");
  }
  function setV(v) { curV = v; range.value = (v - T0) / SPAN_T; renderTrace(); }
  range.value = (curV - T0) / SPAN_T;
  range.addEventListener("input", function () { curV = T0 + parseFloat(range.value) * SPAN_T; renderTrace(); });
  renderers.push(renderTrace);

  /* ---------- Hoopline screenshots: language switch ---------- */
  var slangs = $$(".slang"), shotSets = $$(".shots");
  function showShots(l) {
    slangs.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-l") === l ? "true" : "false"); });
    shotSets.forEach(function (g) { g.hidden = g.getAttribute("data-l") !== l; });
  }
  slangs.forEach(function (b) { b.addEventListener("click", function () { showShots(b.getAttribute("data-l")); }); });

  /* ---------- test run ---------- */
  var tout = $("#tout"), runTimer = null;
  function testLines() {
    var L = [{ c: "dim", s: "> victor@1.0.0 test" }, { c: "dim", s: "> jest --colors" }, { c: "", s: "" }, { c: "hd", s: t("PASS  how-i-work.spec.ts", "PASS  how-i-work.spec.ts") }, { c: "hd", s: "  " + t("How I work", "Cómo trabajo") }];
    TESTS.forEach(function (x) { L.push({ c: "pass", s: "    ✓ " + (lang === "es" ? x[1] : x[0]) }); });
    L.push({ c: "todo", s: "    ○ todo: ", html: "todo: <a href=\"#contact\">" + t("solve your next backend problem", "resolver tu próximo problema backend") + "</a>" });
    L.push({ c: "", s: "" });
    L.push({ c: "hd", s: t("Tests:       ", "Tests:       ") + TESTS.length + t(" passed, 1 todo, ", " pasados, 1 pendiente, ") + (TESTS.length + 1) + t(" total", " en total") });
    return L;
  }
  function lineHtml(l) { return "<div class=\"l " + l.c + "\">" + (l.html ? "    <span class=\"todo\">○</span> " + l.html : l.s.replace(/&/g, "&amp;").replace(/</g, "&lt;")) + "&nbsp;</div>"; }
  function renderTests(animate) {
    clearTimeout(runTimer);
    var L = testLines();
    if (!animate || reduce) { tout.innerHTML = L.map(lineHtml).join(""); return; }
    tout.innerHTML = ""; var i = 0;
    (function next() { if (i >= L.length) return; tout.insertAdjacentHTML("beforeend", lineHtml(L[i])); i++; runTimer = setTimeout(next, i < 5 ? 160 : 300); })();
  }
  $("#rerun").addEventListener("click", function () { renderTests(true); });
  renderers.push(function () { renderTests(false); });


  /* ---------- hoopline overview: story tabs, built stats, repo tour ---------- */
  var s3b = $$(".s3b"), s3p = $$(".s3p");
  function showStory(k) {
    s3b.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-k") === k ? "true" : "false"); });
    s3p.forEach(function (p) { p.hidden = p.getAttribute("data-p") !== k; });
    if (k === "built") countStats();
  }
  s3b.forEach(function (b) { b.addEventListener("click", function () { showStory(b.getAttribute("data-k")); }); });
  function renderStats() {
    $("#bstats").innerHTML = STATS.map(function (x) { return "<div class=\"bstat\"><b data-n=\"" + x[0] + "\" data-suf=\"" + x[1] + "\">" + x[0] + x[1] + "</b><span>" + t(x[2], x[3]) + "</span></div>"; }).join("");
  }
  function countStats() {
    if (reduce) return;
    $$("#bstats b").forEach(function (b) {
      var n = +b.getAttribute("data-n"), suf = b.getAttribute("data-suf"), t0 = null;
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 800);
        b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suf : "");
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }
  renderers.push(renderStats);

  var tourSel = 0;
  function renderTour() {
    var tl = $("#tlist"), td = $("#tdetail"), i = lang === "es" ? 1 : 0, x = TOUR[tourSel];
    tl.innerHTML = TOUR.map(function (r, k) { return "<button type=\"button\" role=\"tab\" class=\"tl\" data-k=\"" + k + "\" aria-selected=\"" + (k === tourSel) + "\">" + r.p + "</button>"; }).join("");
    td.innerHTML = "<span class=\"pth\">" + x.p + "</span><h3>" + x.h[i] + "</h3><p>" + x.d[i] + "</p><span class=\"stt\">" + x.st[i] + "</span>";
    $$(".tl", tl).forEach(function (b) { b.addEventListener("click", function () { tourSel = +b.getAttribute("data-k"); renderTour(); }); });
  }
  renderers.push(renderTour);

  /* ---------- copy email ---------- */
  function selectMail() {
    try {
      var els = $$(".mail"), el = els.filter(function (e) { return e.offsetParent !== null; })[0] || els[0];
      var r = document.createRange(); r.selectNodeContents(el); var sel2 = window.getSelection(); sel2.removeAllRanges(); sel2.addRange(r);
    } catch (e) {}
  }
  function copyEmail(cb) {
    function done(ok) { if (cb) cb(ok); }
    try { navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { selectMail(); done(false); }); } catch (e) { selectMail(); done(false); }
  }
  $$(".js-copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var lbl = $(".lbl", b) || b, orig = lbl.textContent;
      copyEmail(function (ok) {
        lbl.textContent = ok ? t("Copied", "Copiado") : t("Select the address", "Selecciona la dirección");
        setTimeout(function () { lbl.textContent = orig; }, 1800);
      });
    });
  });

  /* ---------- command palette ---------- */
  var pal = $("#pal"), pin = $("#pin"), plist = $("#plist"), pidx = 0, pitems = [];
  function go(v, sub) { route(v, sub, true); }
  function commands() {
    return [
      { l: t("Home", "Inicio"), h: "/home", f: function () { go("home", ""); } },
      { l: t("Career timeline", "Línea de tiempo de la trayectoria"), h: "/career", f: function () { go("career", "timeline"); } },
      { l: t("Career highlights", "Proyectos destacados"), h: "/career-highlights", f: function () { go("career", "highlights"); } },
      { l: t("Tech stack", "Stack tecnológico"), h: "/career-stack", f: function () { go("career", "stack"); } },
      { l: t("Hoopline overview", "Resumen de Hoopline"), h: "/hoopline", f: function () { go("hoopline", "overview"); } },
      { l: t("Hoopline architecture", "Arquitectura de Hoopline"), h: "/hoopline-architecture", f: function () { go("hoopline", "architecture"); } },
      { l: t("Hoopline decisions", "Decisiones de Hoopline"), h: "/hoopline-decisions", f: function () { go("hoopline", "decisions"); } },
      { l: t("Hoopline screenshots", "Capturas de Hoopline"), h: "/hoopline-screens", f: function () { go("hoopline", "screens"); } },
      { l: t("About my story", "Mi historia"), h: "/about", f: function () { go("about", "story"); } },
      { l: t("Run the test suite", "Ejecutar la suite de tests"), h: "npm test", f: function () { go("about", "how"); renderTests(true); } },
      { l: t("Off the clock", "Fuera del trabajo"), h: "/about-off", f: function () { go("about", "off"); } },
      { l: t("Contact", "Contacto"), h: "/contact", f: function () { go("contact", ""); } },
      { l: t("Switch to Spanish", "Cambiar a inglés"), h: "EN / ES", f: function () { switchLang(lang === "es" ? "en" : "es"); } },
      { l: t("Toggle light / dark", "Alternar claro / oscuro"), h: t("theme", "tema"), f: toggleTheme },
      { l: t("Copy email", "Copiar email"), h: EMAIL, f: function () { copyEmail(); go("contact", ""); } },
      { l: "LinkedIn", h: t("opens a new tab", "abre otra pestaña"), href: "https://www.linkedin.com/in/victor-lopez-rodriguez/" },
      { l: "GitHub", h: "viclop1", href: "https://github.com/viclop1" },
      { l: "hooplinegm.com", h: t("opens a new tab", "abre otra pestaña"), href: "https://hooplinegm.com" }
    ];
  }
  function palRender() {
    var q = pin.value.trim().toLowerCase();
    pitems = commands().filter(function (c) { return !q || (c.l + " " + c.h).toLowerCase().indexOf(q) >= 0; });
    if (pidx >= pitems.length) pidx = 0;
    plist.innerHTML = "";
    if (!pitems.length) { plist.innerHTML = '<div class="pempty">' + t("No commands match.", "Ningún comando coincide.") + "</div>"; return; }
    pitems.forEach(function (c, i) {
      var el = document.createElement(c.href ? "a" : "button");
      el.className = "pitem"; el.setAttribute("aria-selected", i === pidx); el.innerHTML = "<span>" + c.l + "</span><small>" + c.h + "</small>";
      if (c.href) { el.href = c.href; el.target = "_blank"; el.rel = "noopener"; } else el.type = "button";
      el.addEventListener("click", function () { if (!c.href) { palClose(); c.f(); } else palClose(); });
      el.addEventListener("mousemove", function () { pidx = i; $$(".pitem", plist).forEach(function (x, j) { x.setAttribute("aria-selected", j === i); }); });
      plist.appendChild(el);
    });
  }
  function palOpen() { pal.hidden = false; pin.value = ""; pin.placeholder = t("Type a command…", "Escribe un comando…"); pidx = 0; palRender(); pin.focus(); }
  function palClose() { pal.hidden = true; }
  $("#palbtn").addEventListener("click", palOpen);
  pal.addEventListener("click", function (e) { if (e.target === pal) palClose(); });
  pin.addEventListener("input", function () { pidx = 0; palRender(); });
  pin.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); pidx = Math.min(pitems.length - 1, pidx + 1); palRender(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); pidx = Math.max(0, pidx - 1); palRender(); }
    else if (e.key === "Enter") { e.preventDefault(); var el = $$(".pitem", plist)[pidx]; if (el) el.click(); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (pal.hidden) palOpen(); else palClose(); }
    else if (e.key === "Escape" && !pal.hidden) palClose();
  });

  /* ---------- router: one view at a time, with sub-menus ---------- */
  var VIEWS = { home: [], career: ["timeline", "highlights", "stack"], hoopline: ["overview", "architecture", "decisions", "screens"], about: ["story", "how", "off"], contact: [] };
  var curView = "";
  function route(v, sub, fromClick) {
    if (!VIEWS[v]) v = "home";
    var subs = VIEWS[v];
    if (!subs.length) sub = ""; else if (subs.indexOf(sub) < 0) sub = subs[0];
    var changed = v !== curView;
    curView = v;
    $$(".view").forEach(function (el) { el.hidden = el.getAttribute("data-view") !== v; });
    var vw = $("#v-" + v);
    $$(".pane", vw).forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== sub; });
    $$(".subnav a", vw).forEach(function (a) { a.setAttribute("aria-selected", a.getAttribute("data-s") === sub ? "true" : "false"); });
    $$("#nav a").forEach(function (a) { if (a.getAttribute("data-v") === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false");
    if (changed || fromClick) window.scrollTo(0, 0);
    try { history.replaceState(null, "", "#" + v + (sub && sub !== subs[0] ? "-" + sub : "")); } catch (e) {}
    if (!(v === "hoopline" && sub === "architecture")) { stopPlay(); cancelAnimationFrame(raf); } else { renderArch(false); }
    onScroll();
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var h = a.getAttribute("href").slice(1);
    if (!h) return;
    var p = h.split("-"); if (!(p[0] in VIEWS)) return;
    e.preventDefault(); route(p[0], p[1], true);
  });
  window.addEventListener("hashchange", function () { var p = location.hash.slice(1).split("-"); if (p[0] in VIEWS) route(p[0], p[1]); });
  $("#burger").addEventListener("click", function () {
    var open = $("#nav").classList.toggle("open"); this.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- boot ---------- */
  applyStatic();
  (function () { var p = (location.hash || "").slice(1).split("-"); route(p[0] || "home", p[1]); })();
})();
