(() => {
  const WHATSAPP = "553298277974";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Tema claro / escuro */
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const syncToggle = () => {
    const dark = root.getAttribute("data-theme") === "dark";
    toggle?.setAttribute("aria-pressed", String(dark));
    toggle?.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
  };
  syncToggle();
  toggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (!reduceMotion) root.classList.add("theme-anim");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ulox-theme", next); } catch (e) {}
    syncToggle();
    setTimeout(() => root.classList.remove("theme-anim"), 450);
  });

  /* Header: fundo ao rolar */
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Link ativo do menu conforme a seção */
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* Animações de entrada */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Contadores */
  const fmt = (n) => n.toLocaleString("pt-BR");
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = +el.dataset.count;
    const pre = el.dataset.prefix || "";
    const suf = el.dataset.suffix || "";
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(Math.round(target * eased)) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* Parallax suave das fotos do hero (só com mouse) */
  const heroVisual = document.getElementById("hero-visual");
  if (heroVisual && !reduceMotion && matchMedia("(pointer: fine)").matches) {
    const layers = heroVisual.querySelectorAll("[data-depth]");
    document.querySelector(".hero").addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => {
        const d = +l.dataset.depth;
        l.style.setProperty("--tx", `${(-x * d).toFixed(1)}px`);
        l.style.setProperty("--ty", `${(-y * d).toFixed(1)}px`);
      });
    });
  }

  /* Linha dos passos preenche conforme a rolagem */
  const steps = document.querySelector(".steps");
  if (steps) {
    const items = [...steps.querySelectorAll(".step")];
    const updateSteps = () => {
      const r = steps.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.25), 0), 1);
      steps.style.setProperty("--p", p.toFixed(3));
      items.forEach((it, i) => it.classList.toggle("is-done", p >= (i / (items.length - 1)) * 0.98));
    };
    updateSteps();
    addEventListener("scroll", updateSteps, { passive: true });
    addEventListener("resize", updateSteps);
  }

  /* Depoimentos */
  const quotes = [...document.querySelectorAll("#slider .quote")];
  const photos = [...document.querySelectorAll(".testimonials__photo img")];
  const dotsWrap = document.getElementById("slider-dots");
  const dots = quotes.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Depoimento ${i + 1}`);
    b.addEventListener("click", () => { show(i); auto(); });
    dotsWrap?.appendChild(b);
    return b;
  });
  let current = 0;
  let timer;
  const show = (i) => {
    current = (i + quotes.length) % quotes.length;
    quotes.forEach((q, idx) => q.classList.toggle("is-active", idx === current));
    photos.forEach((p, idx) => p.classList.toggle("is-active", idx === current));
    dots.forEach((d, idx) => {
      d.classList.remove("is-active");
      if (idx === current) { void d.offsetWidth; d.classList.add("is-active"); }
      d.setAttribute("aria-current", idx === current ? "true" : "false");
    });
  };
  show(0);
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), 7000); };
  document.querySelectorAll(".slider__nav [data-dir]").forEach((b) =>
    b.addEventListener("click", () => { show(current + +b.dataset.dir); auto(); })
  );
  if (quotes.length > 1) auto();

  /* FAQ: só um aberto por vez */
  const details = document.querySelectorAll(".faq details");
  details.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) details.forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* Máscara simples de telefone */
  const tel = document.querySelector('input[name="whats"]');
  tel?.addEventListener("input", () => {
    const d = tel.value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    tel.value = out;
  });

  /* Formulário -> WhatsApp */
  const form = document.getElementById("form-parceiro");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach((f) => {
      const bad = !f.value.trim() || (f.name === "whats" && f.value.replace(/\D/g, "").length < 10);
      f.classList.toggle("is-invalid", bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;
    const v = Object.fromEntries(new FormData(form));
    const msg =
      `Olá! Vim pelo site da Ulox e quero ser uma imobiliária parceira.\n\n` +
      `*Nome:* ${v.nome}\n*Imobiliária:* ${v.empresa}\n*WhatsApp:* ${v.whats}\n*Estado:* ${v.uf}` +
      (v.volume ? `\n*Contratos/mês:* ${v.volume}` : "");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });
  form?.querySelectorAll("input, select").forEach((f) =>
    f.addEventListener("input", () => f.classList.remove("is-invalid"))
  );

  /* Balão do WhatsApp aparece depois de alguns segundos */
  const wa = document.querySelector(".wa-float");
  setTimeout(() => wa?.classList.add("show-bubble"), 4000);
  setTimeout(() => wa?.classList.remove("show-bubble"), 12000);

  document.getElementById("ano").textContent = new Date().getFullYear();
})();
