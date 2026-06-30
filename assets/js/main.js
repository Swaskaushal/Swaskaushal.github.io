/* ════════════════════════════════════════════════════════════════════
   Swas Kaushal — Portfolio interactions
   All content is loaded from /data/*.json so the site is easy to extend.
   ════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initTheme();
  initNav();
  initScrollFx();
  initReveal();
  initCounters();
  loadJourney();
  loadProjects();
  loadPublications();
  loadBlog();
  loadAwards();
  loadMentees();
  loadGallery();
  initCharts();
});

/* ── Footer year ─────────────────────────────────────────────────── */
function initYear() {
  document.getElementById('year').textContent = new Date().getFullYear();
}

/* ── Theme toggle (persisted) ────────────────────────────────────── */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
    if (window.__charts) refreshChartTheme();
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.querySelector('#theme-toggle i');
  if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ── Mobile nav + active link ────────────────────────────────────── */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  const sections = [...document.querySelectorAll('section[id]')];
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = links.querySelector(`a[href="#${e.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

/* ── Navbar shadow, progress bar, back-to-top ────────────────────── */
function initScrollFx() {
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  const toTop = document.getElementById('back-to-top');
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 12);
    toTop.classList.toggle('show', y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (y / h * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Reveal-on-scroll ────────────────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-head, .about-grid, .about-card').forEach(el => {
    el.classList.add('reveal'); io.observe(el);
  });
  window.__revealObserver = io;
}
function observeReveal(el) {
  el.classList.add('reveal');
  if (window.__revealObserver) window.__revealObserver.observe(el);
  else el.classList.add('visible');
}

/* ── Animated stat counters ──────────────────────────────────────── */
function initCounters() {
  const strip = document.getElementById('stats-strip');
  const nums = strip.querySelectorAll('.stat-num');
  let done = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !done) {
        done = true;
        nums.forEach(n => {
          const target = +n.dataset.count;
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const t = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            n.textContent = cur;
          }, 28);
        });
      }
    });
  }, { threshold: 0.5 });
  io.observe(strip);
}

/* ── Generic JSON fetch helper ───────────────────────────────────── */
async function getJSON(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

/* ── Journey timeline ────────────────────────────────────────────── */
async function loadJourney() {
  const root = document.getElementById('timeline');
  try {
    const items = await getJSON('data/journey.json');
    root.innerHTML = items.map(it => `
      <div class="tl-item" data-type="${it.type || 'research'}">
        <span class="tl-date">${escapeHtml(it.date)}</span>
        <div class="tl-card">
          <div class="tl-head">
            ${it.logo ? `<span class="tl-logo"><img src="${escapeAttr(it.logo)}" alt="${escapeAttr(it.org || '')} logo" loading="lazy"></span>` : ''}
            <div class="tl-head-text">
              <h3>${escapeHtml(it.title)}</h3>
              <p class="tl-org">${escapeHtml(it.org || '')}</p>
            </div>
          </div>
          <p>${escapeHtml(it.description || '')}</p>
        </div>
      </div>`).join('');
    root.querySelectorAll('.tl-item').forEach(observeReveal);
  } catch (e) {
    root.innerHTML = `<p class="loading">Could not load journey data.</p>`;
  }
}

/* ── Projects + filters ──────────────────────────────────────────── */
let _projects = [];
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  const filters = document.getElementById('project-filters');
  grid.innerHTML = `<p class="loading">Loading projects…</p>`;
  try {
    _projects = await getJSON('data/projects.json');
    const cats = ['All', ...new Set(_projects.flatMap(p => p.categories || []))];
    filters.innerHTML = cats.map((c, i) =>
      `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${escapeAttr(c)}">${escapeHtml(c)}</button>`
    ).join('');
    filters.querySelectorAll('.filter-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.cat);
      })
    );
    renderProjects('All');
  } catch (e) {
    grid.innerHTML = `<p class="loading">Could not load projects.</p>`;
  }
}
function renderProjects(cat) {
  const grid = document.getElementById('projects-grid');
  const list = cat === 'All' ? _projects : _projects.filter(p => (p.categories || []).includes(cat));
  grid.innerHTML = list.map(p => `
    <article class="project-card">
      <div class="pc-icon"><i class="${escapeAttr(p.icon || 'fa-solid fa-code')}"></i></div>
      <h3 class="pc-title">${escapeHtml(p.title)}</h3>
      <p class="pc-desc">${escapeHtml(p.description)}</p>
      <div class="pc-tags">${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
      <div class="pc-links">
        ${p.repo ? `<a href="${escapeAttr(p.repo)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>` : ''}
        ${p.demo ? `<a href="${escapeAttr(p.demo)}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
      </div>
    </article>`).join('');
  grid.querySelectorAll('.project-card').forEach(observeReveal);
}

/* ── Publications ────────────────────────────────────────────────── */
async function loadPublications() {
  const root = document.getElementById('pub-list');
  root.innerHTML = `<p class="loading">Loading publications…</p>`;
  try {
    const pubs = await getJSON('data/publications.json');
    pubs.sort((a, b) => (b.year || 0) - (a.year || 0));
    root.innerHTML = pubs.map(p => `
      <article class="pub-item">
        <span class="pub-year">${escapeHtml(String(p.year || '—'))}</span>
        <div class="pub-body">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="pub-authors">${highlightAuthor(p.authors || '')}</p>
          <p class="pub-venue">${escapeHtml(p.venue || '')}</p>
          <div class="pub-links">
            ${p.link ? `<a href="${escapeAttr(p.link)}" target="_blank" rel="noopener"><i class="fa-solid fa-link"></i> View</a>` : ''}
            ${p.pdf ? `<a href="${escapeAttr(p.pdf)}" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf"></i> PDF</a>` : ''}
            ${p.doi ? `<a href="https://doi.org/${escapeAttr(p.doi)}" target="_blank" rel="noopener"><i class="fa-solid fa-fingerprint"></i> DOI</a>` : ''}
          </div>
        </div>
      </article>`).join('');
    root.querySelectorAll('.pub-item').forEach(observeReveal);
  } catch (e) {
    root.innerHTML = `<p class="loading">Could not load publications.</p>`;
  }
}
function highlightAuthor(authors) {
  return escapeHtml(authors).replace(/(Kaushal,?\s*S\.?|S\.?\s*Kaushal|Swas Kaushal)/gi, '<b>$1</b>');
}

/* ── Blog ────────────────────────────────────────────────────────── */
let _posts = [];
async function loadBlog() {
  const grid = document.getElementById('blog-grid');
  grid.innerHTML = `<p class="loading">Loading posts…</p>`;
  try {
    _posts = await getJSON('data/blog/posts.json');
    _posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    grid.innerHTML = _posts.map((p, i) => `
      <article class="blog-card" data-idx="${i}">
        <div class="blog-cover"></div>
        <div class="blog-inner">
          <div class="blog-meta">
            <span><i class="fa-regular fa-calendar"></i> ${formatDate(p.date)}</span>
            <span><i class="fa-regular fa-clock"></i> ${escapeHtml(p.readTime || '3 min')}</span>
          </div>
          <h3>${escapeHtml(p.title)}</h3>
          <p class="blog-excerpt">${escapeHtml(p.excerpt || '')}</p>
          <div class="blog-tags">${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
          <span class="blog-read">Read more <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </article>`).join('');
    grid.querySelectorAll('.blog-card').forEach(card => {
      observeReveal(card);
      card.addEventListener('click', () => openPost(+card.dataset.idx));
    });
  } catch (e) {
    grid.innerHTML = `<p class="loading">No posts yet — add some in <code>data/blog/</code>.</p>`;
  }
  initModal();
}
async function openPost(idx) {
  const post = _posts[idx];
  const modal = document.getElementById('post-modal');
  const body = document.getElementById('post-content');
  body.innerHTML = `<p class="loading">Loading…</p>`;
  openModal();
  try {
    const md = await fetch(`data/blog/${post.file}`, { cache: 'no-cache' }).then(r => r.text());
    body.innerHTML =
      `<div class="post-head-meta"><i class="fa-regular fa-calendar"></i> ${formatDate(post.date)} · ${escapeHtml(post.readTime || '3 min')} read</div>` +
      marked.parse(md);
  } catch (e) {
    body.innerHTML = `<p>Could not load this post.</p>`;
  }
}

/* ── Modal control ───────────────────────────────────────────────── */
function initModal() {
  const modal = document.getElementById('post-modal');
  if (modal.dataset.bound) return;
  modal.dataset.bound = '1';
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
function openModal() {
  document.getElementById('post-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('post-modal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Awards ──────────────────────────────────────────────────────── */
async function loadAwards() {
  const grid = document.getElementById('awards-grid');
  grid.innerHTML = `<p class="loading">Loading awards…</p>`;
  try {
    const awards = await getJSON('data/awards.json');
    grid.innerHTML = awards.map(a => `
      <article class="award-card">
        <div class="award-medal"><i class="${escapeAttr(a.icon || 'fa-solid fa-trophy')}"></i></div>
        <h3>${escapeHtml(a.title)}</h3>
        <p class="award-org">${escapeHtml(a.org || '')}</p>
        <p class="award-year">${escapeHtml(String(a.year || ''))}</p>
        <p class="award-story">${escapeHtml(a.story || '')}</p>
      </article>`).join('');
    grid.querySelectorAll('.award-card').forEach(observeReveal);
  } catch (e) {
    grid.innerHTML = `<p class="loading">Could not load awards.</p>`;
  }
}

/* ── Mentorship ──────────────────────────────────────────────────── */
async function loadMentees() {
  const grid = document.getElementById('mentor-grid');
  if (!grid) return;
  grid.innerHTML = `<p class="loading">Loading…</p>`;
  try {
    const mentees = await getJSON('data/mentees.json');
    grid.innerHTML = mentees.map(m => `
      <article class="mentor-card">
        <div class="mentor-photo"><img src="${escapeAttr(m.photo || 'assets/profile.jpg')}" alt="${escapeAttr(m.name)}" loading="lazy" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=2563eb&color=fff&size=200'"></div>
        <h3>${escapeHtml(m.name)}</h3>
        ${m.role ? `<p class="mentor-role">${escapeHtml(m.role)}</p>` : ''}
        <p class="mentor-univ">${escapeHtml(m.university || '')}</p>
        <div class="mentor-links">
          ${m.linkedin ? `<a href="${escapeAttr(m.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
          ${m.scholar ? `<a href="${escapeAttr(m.scholar)}" target="_blank" rel="noopener" title="Scholar"><i class="fa-solid fa-graduation-cap"></i></a>` : ''}
          ${m.email ? `<a href="mailto:${escapeAttr(m.email)}" title="Email"><i class="fa-solid fa-envelope"></i></a>` : ''}
        </div>
      </article>`).join('');
    grid.querySelectorAll('.mentor-card').forEach(observeReveal);
  } catch (e) {
    grid.innerHTML = `<p class="loading">Add the people you mentor in <code>data/mentees.json</code>.</p>`;
  }
}

/* ── Gallery + lightbox ──────────────────────────────────────────── */
let _gallery = [];
async function loadGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = `<p class="loading">Loading…</p>`;
  try {
    _gallery = await getJSON('data/gallery.json');
    _gallery.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    grid.innerHTML = _gallery.map((g, i) => `
      <figure class="gallery-item" data-idx="${i}">
        <img src="${escapeAttr(g.image)}" alt="${escapeAttr(g.caption || 'Photo')}" loading="lazy" onerror="this.src='https://picsum.photos/seed/'+${i}+'/600/420'">
        <figcaption class="gallery-cap">
          <span class="g-text">${escapeHtml(g.caption || '')}</span>
          ${g.date ? `<span class="g-date">${formatDate(g.date)}</span>` : ''}
        </figcaption>
      </figure>`).join('');
    grid.querySelectorAll('.gallery-item').forEach(item =>
      item.addEventListener('click', () => openLightbox(+item.dataset.idx))
    );
  } catch (e) {
    grid.innerHTML = `<p class="loading">Add photos in <code>data/gallery.json</code> (images go in <code>assets/gallery/</code>).</p>`;
  }
  initLightbox();
}
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.dataset.bound) return;
  lb.dataset.bound = '1';
  lb.querySelectorAll('[data-lbclose]').forEach(el => el.addEventListener('click', closeLightbox));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
function openLightbox(idx) {
  const g = _gallery[idx];
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = g.image;
  document.getElementById('lightbox-img').alt = g.caption || '';
  document.getElementById('lightbox-cap').textContent =
    (g.caption || '') + (g.date ? `  ·  ${formatDate(g.date)}` : '');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Charts (Chart.js) ───────────────────────────────────────────── */
async function initCharts() {
  if (typeof Chart === 'undefined') return;
  let cfg;
  try { cfg = await getJSON('data/insights.json'); }
  catch { cfg = defaultInsights(); }

  Chart.defaults.font.family = "'Inter', sans-serif";
  window.__charts = {};

  const c = chartColors();

  window.__charts.radar = new Chart(document.getElementById('chart-radar'), {
    type: 'radar',
    data: {
      labels: cfg.focus.labels,
      datasets: [{
        label: 'Focus', data: cfg.focus.values,
        backgroundColor: c.fill, borderColor: c.brand, pointBackgroundColor: c.brand, borderWidth: 2,
      }]
    },
    options: radarOpts(c)
  });

  window.__charts.pubs = new Chart(document.getElementById('chart-pubs'), {
    type: 'bar',
    data: {
      labels: cfg.pubsByYear.labels,
      datasets: [{ label: 'Publications', data: cfg.pubsByYear.values, backgroundColor: c.brand, borderRadius: 6 }]
    },
    options: barOpts(c, false)
  });
}
function chartColors() {
  const css = getComputedStyle(document.documentElement);
  const brand = css.getPropertyValue('--brand').trim();
  const brand2 = css.getPropertyValue('--brand-2').trim();
  const grid = css.getPropertyValue('--border').trim();
  const text = css.getPropertyValue('--text-soft').trim();
  return { brand, brand2, grid, text, fill: hexA(brand, .18) };
}
function radarOpts(c) {
  return {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { angleLines: { color: c.grid }, grid: { color: c.grid }, pointLabels: { color: c.text, font: { size: 12 } }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 100 } },
    plugins: { legend: { display: false } }
  };
}
function barOpts(c, horizontal) {
  return {
    responsive: true, maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    scales: {
      x: { grid: { color: c.grid, display: !horizontal }, ticks: { color: c.text }, beginAtZero: true },
      y: { grid: { color: c.grid, display: horizontal }, ticks: { color: c.text }, beginAtZero: true, max: horizontal ? 100 : undefined }
    },
    plugins: { legend: { display: false } }
  };
}
function refreshChartTheme() {
  const c = chartColors();
  Object.values(window.__charts).forEach(ch => {
    if (ch.config.type === 'radar') {
      ch.options.scales.r.angleLines.color = c.grid;
      ch.options.scales.r.grid.color = c.grid;
      ch.options.scales.r.pointLabels.color = c.text;
      ch.data.datasets[0].backgroundColor = c.fill;
      ch.data.datasets[0].borderColor = c.brand;
    } else {
      ch.options.scales.x.grid.color = c.grid;
      ch.options.scales.y.grid.color = c.grid;
      ch.options.scales.x.ticks.color = c.text;
      ch.options.scales.y.ticks.color = c.text;
    }
    ch.update();
  });
}
function defaultInsights() {
  return {
    focus: { labels: ['Plant Breeding', 'Phenomics', 'Quant. Genetics', 'AI / ML', 'Data Science', 'Field Trials'], values: [95, 88, 85, 82, 80, 78] },
    pubsByYear: { labels: ['2021', '2022', '2023', '2024', '2025'], values: [1, 2, 4, 5, 5] },
    skills: { labels: ['Python', 'R', 'PyTorch / DL', 'Genomic Selection', 'UAS Phenotyping', 'Statistics'], values: [92, 88, 80, 85, 82, 86] }
  };
}

/* ── Utilities ───────────────────────────────────────────────────── */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function escapeAttr(s) { return escapeHtml(s); }
function formatDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function hexA(hex, a) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
