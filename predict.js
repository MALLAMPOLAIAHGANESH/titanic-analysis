/* =====================================================
   TITANIC DASHBOARD — predict.js  (predict.html logic)
   Client-side survival prediction + feature importance
===================================================== */

/* ── Scroll Reveal (shared) ──────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Navbar Toggle ───────────────────────────────── */
function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

/* ── Toast ───────────────────────────────────────── */
function showToast(msg, icon = '✅', duration = 3000) {
  const toast    = document.getElementById('toast');
  const toastMsg  = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  if (!toast) return;
  toastMsg.textContent  = msg;
  toastIcon.textContent = icon;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Age Slider ──────────────────────────────────── */
function initSlider() {
  const slider  = document.getElementById('age');
  const display = document.getElementById('ageDisplay');
  if (!slider || !display) return;

  function update() {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(90deg, var(--cyan) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    display.textContent = slider.value;
  }

  slider.addEventListener('input', update);
  update();
}

/* ─────────────────────────────────────────────────────
   ML Prediction Model
   A realistic logistic-regression-inspired scoring model
   based on the actual Titanic dataset feature weights.
───────────────────────────────────────────────────── */

/**
 * Predict survival probability based on passenger features.
 * Uses coefficient-weighted logistic model approximation.
 */
function predictSurvival(features) {
  const { pclass, gender, age, fare, sibSp, parCh, embarked, title } = features;

  /* Base score (intercept) */
  let score = 0.12;

  /* ── Gender ──────────────── */
  if (gender === 'female') score += 0.45;   // huge positive factor
  else                      score -= 0.18;

  /* ── Ticket Class ─────────── */
  if (pclass == 1)      score += 0.30;
  else if (pclass == 2) score += 0.10;
  else                  score -= 0.20;

  /* ── Age ─────────────────── */
  if (age <= 10)        score += 0.22;
  else if (age <= 18)   score += 0.10;
  else if (age <= 40)   score += 0.00;
  else if (age <= 60)   score -= 0.06;
  else                  score -= 0.14;

  /* ── Fare (normalised) ────── */
  const fareNorm = Math.min(fare / 100, 1.0);
  score += fareNorm * 0.18;

  /* ── Family Size ─────────── */
  const familySize = +sibSp + +parCh + 1;
  if (familySize === 1) score -= 0.02;              // solo
  else if (familySize <= 4) score += 0.07;          // small family
  else score -= 0.12;                               // large family

  /* ── Embarkation ─────────── */
  if (embarked === 'C') score += 0.08;              // Cherbourg had more 1st class
  else if (embarked === 'Q') score -= 0.04;
  // Southampton neutral

  /* ── Title ───────────────── */
  if (title === 'Mrs' || title === 'Miss') score += 0.12;
  else if (title === 'Master')             score += 0.15;
  else if (title === 'Dr' || title === 'Rev') score += 0.05;
  else if (title === 'Mr')                 score -= 0.08;

  /* ── Clamp to [0.02, 0.97] ─ */
  score = Math.max(0.02, Math.min(0.97, score));

  /* Run through sigmoid for smooth output */
  // σ(x) = 1 / (1 + e^(-x))
  const logit = Math.log(score / (1 - score));
  const probability = 1 / (1 + Math.exp(-logit * 1.3));

  return Math.max(0.02, Math.min(0.97, probability));
}

/**
 * Compute per-feature contribution for importance bars.
 */
function computeFeatureImportance(features) {
  const { pclass, gender, age, fare, sibSp, parCh, embarked } = features;

  const items = [
    {
      name: 'Gender',
      weight: gender === 'female' ? 0.85 : 0.15,
      color: 'linear-gradient(90deg, #1a2a6c, #00c8ff)',
    },
    {
      name: 'Class',
      weight: pclass == 1 ? 0.78 : pclass == 2 ? 0.52 : 0.25,
      color: 'linear-gradient(90deg, #0b3d91, #ffd700)',
    },
    {
      name: 'Age',
      weight: age <= 10 ? 0.80 : age <= 18 ? 0.62 : age <= 40 ? 0.50 : 0.35,
      color: 'linear-gradient(90deg, #1a2a6c, #00e676)',
    },
    {
      name: 'Fare',
      weight: Math.min(+fare / 100, 0.9) || 0.1,
      color: 'linear-gradient(90deg, #0b3d91, #ff6b2b)',
    },
    {
      name: 'Family',
      weight: (+sibSp + +parCh) === 0 ? 0.30 : (+sibSp + +parCh) <= 3 ? 0.60 : 0.20,
      color: 'linear-gradient(90deg, #1a2a6c, #ff1744)',
    },
    {
      name: 'Embarked',
      weight: embarked === 'C' ? 0.55 : embarked === 'Q' ? 0.38 : 0.45,
      color: 'linear-gradient(90deg, #0b3d91, #b0bec5)',
    },
  ];

  return items;
}

/* ── Render Result ───────────────────────────────── */
function renderResult(probability, features) {
  const survived = probability >= 0.5;

  const placeholder   = document.getElementById('resultPlaceholder');
  const resultContent = document.getElementById('resultContent');
  const verdict       = document.getElementById('resultVerdict');
  const verdictIcon   = document.getElementById('verdictIcon');
  const verdictText   = document.getElementById('verdictText');
  const verdictSub    = document.getElementById('verdictSubtitle');
  const confPct       = document.getElementById('confidencePct');
  const confBar       = document.getElementById('confidenceBar');
  const featBars      = document.getElementById('featureBars');

  /* Show result, hide placeholder */
  placeholder.style.display   = 'none';
  resultContent.style.display = 'block';

  /* Verdict */
  verdict.className = `result-verdict ${survived ? 'survived' : 'perished'}`;
  verdictIcon.textContent = survived ? '⛵' : '🌊';
  verdictText.className   = `verdict-text ${survived ? 'survived' : 'perished'}`;
  verdictText.textContent = survived ? 'SURVIVED!' : 'PERISHED';
  verdictSub.textContent  = survived
    ? `You likely made it onto a lifeboat! Survival chance: ${Math.round(probability * 100)}%`
    : `You did not make it. Survival chance: ${Math.round(probability * 100)}%`;

  /* Confidence bar */
  const pct = Math.round(probability * 100);
  confPct.textContent = `${pct}%`;
  // Trigger reflow before animating
  confBar.style.width = '0';
  requestAnimationFrame(() => {
    setTimeout(() => {
      confBar.style.width = `${pct}%`;
      if (survived) {
        confBar.style.background = 'linear-gradient(90deg, var(--survived), #00c8ff)';
      } else {
        confBar.style.background = 'linear-gradient(90deg, var(--danger), var(--lifeboat))';
      }
    }, 100);
  });

  /* Feature importance bars */
  const feats = computeFeatureImportance(features);
  featBars.innerHTML = '';
  feats.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'feature-bar-row';
    const barPct = Math.round(f.weight * 100);
    row.innerHTML = `
      <span class="feature-name">${f.name}</span>
      <div class="feature-bar-bg">
        <div class="feature-bar-fill" id="fb${i}" style="background:${f.color};"></div>
      </div>
      <span class="feature-pct">${barPct}%</span>
    `;
    featBars.appendChild(row);

    /* Animate with stagger */
    setTimeout(() => {
      document.getElementById(`fb${i}`).style.width = `${barPct}%`;
    }, 200 + i * 120);
  });
}

/* ── Form Validation ─────────────────────────────── */
function validateForm(fd) {
  const errors = [];
  if (!fd.pclass)   errors.push('Ticket class');
  if (!fd.gender)   errors.push('Gender');
  if (!fd.fare && fd.fare !== 0) errors.push('Fare');
  if (!fd.embarked) errors.push('Embarkation port');
  return errors;
}

/* ── Form Submit ─────────────────────────────────── */
function initForm() {
  const form     = document.getElementById('predictForm');
  const resetBtn = document.getElementById('resetBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const features = {
      pclass:   document.getElementById('pclass').value,
      gender:   document.getElementById('gender').value,
      age:      +document.getElementById('age').value,
      fare:     +document.getElementById('fare').value,
      sibSp:    +document.getElementById('sibSp').value,
      parCh:    +document.getElementById('parCh').value,
      embarked: document.getElementById('embarked').value,
      title:    document.getElementById('title').value,
    };

    const errors = validateForm(features);
    if (errors.length) {
      showToast(`Please fill in: ${errors.join(', ')}`, '⚠️', 3500);
      return;
    }

    /* Simulate backend call delay */
    const btn = document.getElementById('predictBtn');
    btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;display:inline-block;"></span><span>Analysing…</span>';
    btn.disabled = true;

    setTimeout(() => {
      const probability = predictSurvival(features);
      renderResult(probability, features);

      btn.innerHTML = '<span>⛵ Predict My Survival</span>';
      btn.disabled  = false;

      const survived = probability >= 0.5;
      showToast(
        survived ? 'You would have survived! ⛵' : 'You would not have survived 🌊',
        survived ? '✅' : '💀',
        3000
      );
    }, 1200);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      initSlider();
      document.getElementById('resultPlaceholder').style.display = 'block';
      document.getElementById('resultContent').style.display     = 'none';
      showToast('Ready for a new passenger!', '🔄', 2000);
    });
  }
}

/* ── Init ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initSlider();
  initForm();
});
