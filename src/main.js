/* =====================================================
   TITANIC DASHBOARD — main.js  (index.html logic)
   Chart.js charts + KPI counters + scroll reveal
===================================================== */

/* ── Titanic Dataset Summary (pre-computed) ──────── */
const DATA = {
  total:        891,
  survived:     342,
  perished:     549,
  femaleSurv:   233,
  femaleTotal:  314,
  maleSurv:     109,
  maleTotal:    577,

  byClass: {
    labels: ['1st Class', '2nd Class', '3rd Class'],
    survived: [136, 87, 119],
    perished: [80,  97, 372],
  },

  embarked: {
    labels: ['Southampton', 'Cherbourg', 'Queenstown'],
    counts: [644, 168, 77],
  },

  // Bucketed age groups
  ageBuckets: {
    labels: ['0-9','10-19','20-29','30-39','40-49','50-59','60+'],
    counts:  [64,  103,  220,  167,  89,   48,   36],
    survived:[39,   57,   84,   75,   37,   22,   14],
  },

  // Average fare by class
  fareByClass: {
    labels: ['1st', '2nd', '3rd'],
    avgFare: [84.2, 20.7, 13.7],
    survRate: [63,   47,   24],
  },
};

/* ── Chart.js Global Defaults ────────────────────── */
function applyChartDefaults() {
  Chart.defaults.color            = '#b8dce8';
  Chart.defaults.borderColor      = 'rgba(0,200,255,0.1)';
  Chart.defaults.font.family      = "'Inter', sans-serif";
  Chart.defaults.plugins.legend.labels.boxRadius = 4;
}

/* ── KPI Counters ────────────────────────────────── */
const KPIs = [
  { icon: '👥', label: 'Total Passengers', value: DATA.total,     cls: 'cyan',   sub: 'Aboard RMS Titanic' },
  { icon: '🟢', label: 'Survived',         value: DATA.survived,  cls: 'green',  sub: `${Math.round(DATA.survived/DATA.total*100)}% of passengers` },
  { icon: '🔴', label: 'Perished',         value: DATA.perished,  cls: 'red',    sub: `${Math.round(DATA.perished/DATA.total*100)}% of passengers` },
  { icon: '👩', label: 'Female Survivors', value: DATA.femaleSurv,cls: 'gold',   sub: `${Math.round(DATA.femaleSurv/DATA.femaleTotal*100)}% of women` },
  { icon: '👨', label: 'Male Survivors',   value: DATA.maleSurv,  cls: 'orange', sub: `${Math.round(DATA.maleSurv/DATA.maleTotal*100)}% of men` },
];

function renderKPIs() {
  const grid = document.getElementById('kpiGrid');
  if (!grid) return;

  KPIs.forEach(kpi => {
    const card = document.createElement('div');
    card.className = 'glass-card kpi-card reveal';
    card.innerHTML = `
      <span class="kpi-icon">${kpi.icon}</span>
      <div class="kpi-label">${kpi.label}</div>
      <div class="kpi-value ${kpi.cls}" data-target="${kpi.value}">0</div>
      <div class="kpi-sub">${kpi.sub}</div>
    `;
    grid.appendChild(card);
  });
}

function animateCounters() {
  document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const duration = 1100;  // faster: was 1800ms
    const step = 14;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current).toLocaleString();
    }, step);
  });
}

/* ── Scroll Reveal ─────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('kpi-card')) {
          animateCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });  // lowered: triggers earlier

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Nautical Color Palette ──────────────────────── */
const COLORS = {
  cyan:    'rgba(0,200,255,0.85)',
  cyanFad: 'rgba(0,200,255,0.15)',
  orange:  'rgba(255,107,43,0.85)',
  orgFad:  'rgba(255,107,43,0.15)',
  green:   'rgba(0,230,118,0.85)',
  grnFad:  'rgba(0,230,118,0.15)',
  red:     'rgba(255,23,68,0.85)',
  redFad:  'rgba(255,23,68,0.15)',
  gold:    'rgba(255,215,0,0.85)',
  navy:    'rgba(26,42,108,0.85)',
  ice:     'rgba(184,220,232,0.85)',
};

/* ── Charts ──────────────────────────────────────── */
function buildCharts() {

  /* 1. Survival by Class */
  new Chart(document.getElementById('chartClass'), {
    type: 'bar',
    data: {
      labels: DATA.byClass.labels,
      datasets: [
        {
          label: 'Survived',
          data: DATA.byClass.survived,
          backgroundColor: COLORS.green,
          borderColor: 'rgba(0,230,118,0.9)',
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Perished',
          data: DATA.byClass.perished,
          backgroundColor: COLORS.red,
          borderColor: 'rgba(255,23,68,0.9)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true },
      },
    },
  });

  /* 2. Overall Survival Doughnut */
  new Chart(document.getElementById('chartSurvival'), {
    type: 'doughnut',
    data: {
      labels: ['⛵ Survived', '🌊 Perished'],
      datasets: [{
        data: [DATA.survived, DATA.perished],
        backgroundColor: [COLORS.green, COLORS.red],
        borderColor: ['rgba(0,230,118,0.9)', 'rgba(255,23,68,0.9)'],
        borderWidth: 2,
        hoverOffset: 10,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '62%',
      plugins: { legend: { position: 'bottom' } },
    },
  });

  /* 3. Survival by Gender */
  new Chart(document.getElementById('chartGender'), {
    type: 'bar',
    data: {
      labels: ['Female', 'Male'],
      datasets: [
        {
          label: 'Survived',
          data: [DATA.femaleSurv, DATA.maleSurv],
          backgroundColor: [COLORS.gold, COLORS.cyan],
          borderColor: ['rgba(255,215,0,0.9)', 'rgba(0,200,255,0.9)'],
          borderWidth: 1,
          borderRadius: 8,
        },
        {
          label: 'Perished',
          data: [DATA.femaleTotal - DATA.femaleSurv, DATA.maleTotal - DATA.maleSurv],
          backgroundColor: [COLORS.orgFad, COLORS.redFad],
          borderColor: [COLORS.orange, COLORS.red],
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true },
      },
    },
  });

  /* 4. Age Distribution Line */
  new Chart(document.getElementById('chartAge'), {
    type: 'line',
    data: {
      labels: DATA.ageBuckets.labels,
      datasets: [
        {
          label: 'Total',
          data: DATA.ageBuckets.counts,
          borderColor: COLORS.cyan,
          backgroundColor: COLORS.cyanFad,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: COLORS.cyan,
          pointRadius: 5,
        },
        {
          label: 'Survived',
          data: DATA.ageBuckets.survived,
          borderColor: COLORS.green,
          backgroundColor: COLORS.grnFad,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: COLORS.green,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true },
      },
    },
  });

  /* 5. Embarkation Pie */
  new Chart(document.getElementById('chartEmbarked'), {
    type: 'pie',
    data: {
      labels: DATA.embarked.labels,
      datasets: [{
        data: DATA.embarked.counts,
        backgroundColor: [COLORS.cyan, COLORS.orange, COLORS.gold],
        borderColor: ['rgba(0,200,255,0.7)', 'rgba(255,107,43,0.7)', 'rgba(255,215,0,0.7)'],
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
    },
  });

  /* 6. Fare Radar */
  new Chart(document.getElementById('chartFare'), {
    type: 'radar',
    data: {
      labels: ['Avg Fare', 'Survival Rate %', 'Lifeboat Access', 'Comfort Index', 'Upper Deck'],
      datasets: [
        {
          label: '1st Class',
          data: [84, 63, 90, 95, 88],
          borderColor: COLORS.gold,
          backgroundColor: 'rgba(255,215,0,0.12)',
          pointBackgroundColor: COLORS.gold,
        },
        {
          label: '2nd Class',
          data: [21, 47, 55, 60, 48],
          borderColor: COLORS.cyan,
          backgroundColor: 'rgba(0,200,255,0.1)',
          pointBackgroundColor: COLORS.cyan,
        },
        {
          label: '3rd Class',
          data: [14, 24, 20, 25, 12],
          borderColor: COLORS.red,
          backgroundColor: 'rgba(255,23,68,0.08)',
          pointBackgroundColor: COLORS.red,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        r: {
          angleLines:  { color: 'rgba(255,255,255,0.08)' },
          grid:        { color: 'rgba(255,255,255,0.08)' },
          ticks:       { display: false },
          pointLabels: { font: { size: 10 } },
        },
      },
      plugins: { legend: { position: 'bottom' } },
    },
  });
}

/* ── Toast ───────────────────────────────────────── */
function showToast(msg, icon = '✅', duration = 3000) {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  if (!toast) return;
  toastMsg.textContent  = msg;
  toastIcon.textContent = icon;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Navbar Toggle ───────────────────────────────── */
function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

/* ── Range Slider Gradient Fill ──────────────────── */
function initSlider(sliderId, displayId) {
  const slider  = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  if (!slider || !display) return;

  function update() {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(90deg, var(--cyan) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    display.textContent = slider.value;
  }

  slider.addEventListener('input', update);
  update();
}

/* ── Feedback Tooltip Auto-show ───────────────────── */
function initFeedbackTooltip() {
  const tip   = document.getElementById('feedbackTooltip');
  const close = document.getElementById('closeFbTip');
  const tab   = document.getElementById('feedbackTab');
  if (!tip || !close || !tab) return;

  const STORAGE_KEY = 'fbTipDismissed';
  if (sessionStorage.getItem(STORAGE_KEY)) return;  // don't re-show in same session

  // Auto-show after 8 seconds
  const autoTimer = setTimeout(() => tip.classList.add('visible'), 8000);

  // Close button
  close.addEventListener('click', (e) => {
    e.preventDefault();
    tip.classList.remove('visible');
    sessionStorage.setItem(STORAGE_KEY, '1');
    clearTimeout(autoTimer);
  });

  // Clicking feedback tab hides tooltip
  tab.addEventListener('click', () => {
    tip.classList.remove('visible');
    sessionStorage.setItem(STORAGE_KEY, '1');
  });

  // Hide on outside click
  document.addEventListener('click', (e) => {
    if (!tip.contains(e.target) && e.target !== tab) {
      tip.classList.remove('visible');
    }
  });
}

/* ── Init ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyChartDefaults();
  renderKPIs();
  buildCharts();
  initScrollReveal();
  initNavbar();
  initSlider('age', 'ageDisplay');
  initFeedbackTooltip();
  showToast('Dashboard loaded! 🚢', '⦳', 2000);
});
