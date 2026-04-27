// === PARTICLE SYSTEM ===
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
}

// === SCROLL REVEAL ===
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// === NAVBAR SCROLL ===
function initNavbar() {
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
      ? 'rgba(10,14,26,0.95)' : 'rgba(10,14,26,0.8)';
  });
}

// === PRICING LOGIC ===
const BASE_PRICE = 2999;
const EXTRAS = {
  report: { price: 299, label: 'Project Report' },
  documentation: { price: 299, label: 'Documentation' },
  ppt: { price: 299, label: 'PPT' },
  assistance: { price: 99, label: 'Project Assistance' }
};
const COMBO_PRICE = 599;
const PROMO_CODE = 'KUMAR500';
const PROMO_DISCOUNT = 500;
let promoApplied = false;

function initPricing() {
  const individualItems = document.querySelectorAll('.extra-item:not(.combo)');
  const comboItem = document.querySelector('.extra-item.combo');

  individualItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('disabled')) return;
      item.classList.toggle('selected');
      updateTotal();
    });
  });

  if (comboItem) {
    comboItem.addEventListener('click', () => {
      comboItem.classList.toggle('selected');
      const isCombo = comboItem.classList.contains('selected');
      individualItems.forEach(item => {
        if (isCombo) {
          item.classList.remove('selected');
          item.classList.add('disabled');
        } else {
          item.classList.remove('disabled');
        }
      });
      updateTotal();
    });
  }
}

function updateTotal() {
  let total = BASE_PRICE;
  const comboItem = document.querySelector('.extra-item.combo');

  if (comboItem && comboItem.classList.contains('selected')) {
    total += COMBO_PRICE;
  } else {
    document.querySelectorAll('.extra-item:not(.combo).selected').forEach(item => {
      const key = item.dataset.extra;
      if (EXTRAS[key]) total += EXTRAS[key].price;
    });
  }

  if (promoApplied) {
    total -= PROMO_DISCOUNT;
  }

  const amountEl = document.getElementById('totalAmount');
  amountEl.textContent = '₹' + total.toLocaleString('en-IN');
  amountEl.classList.remove('animate');
  void amountEl.offsetWidth;
  amountEl.classList.add('animate');
}

// === PROMO CODE ===
function initPromo() {
  const applyBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('promoCode');
  const promoMsg = document.getElementById('promoMessage');

  if (!applyBtn) return;

  applyBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();

    if (promoApplied) {
      showPromoMessage('Promo code already applied!', 'info');
      return;
    }

    if (!code) {
      showPromoMessage('⚠️ Please enter a promo code.', 'error');
      return;
    }

    if (code === PROMO_CODE) {
      promoApplied = true;
      showPromoMessage('✅ Promo code KUMAR500 applied! You saved ₹500 extra!', 'success');
      promoInput.disabled = true;
      promoInput.classList.add('promo-applied');
      applyBtn.textContent = 'Applied ✓';
      applyBtn.classList.add('applied');
      applyBtn.disabled = true;
      updateTotal();
      showToast('🎉 ₹500 discount applied!', 'success');
    } else {
      showPromoMessage('❌ Invalid promo code. Try KUMAR500.', 'error');
      promoInput.classList.add('promo-error');
      setTimeout(() => promoInput.classList.remove('promo-error'), 1500);
    }
  });

  // Allow Enter key to apply
  promoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyBtn.click();
    }
  });
}

function showPromoMessage(msg, type) {
  const promoMsg = document.getElementById('promoMessage');
  promoMsg.textContent = msg;
  promoMsg.className = 'promo-message ' + type;
  promoMsg.classList.add('visible');
}

// === TOAST NOTIFICATION ===
function showToast(msg, type = 'error') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// === FORM VALIDATION & SUBMIT ===
function initForm() {
  const form = document.getElementById('projectForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = {
      fullName: { el: document.getElementById('fullName'), label: 'Full Name' },
      college: { el: document.getElementById('college'), label: 'College Name' },
      rollNo: { el: document.getElementById('rollNo'), label: 'Roll Number' },
      projectTitle: { el: document.getElementById('projectTitle'), label: 'Project Title' },
      whatsapp: { el: document.getElementById('whatsapp'), label: 'WhatsApp Number' }
    };

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Validate
    let firstError = null;
    for (const key in fields) {
      const val = fields[key].el.value.trim();
      if (!val) {
        fields[key].el.classList.add('error');
        if (!firstError) firstError = fields[key].label;
      }
    }

    if (firstError) {
      showToast('⚠️ Please fill: ' + firstError);
      return;
    }

    // Validate terms checkbox
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (!termsCheckbox || !termsCheckbox.checked) {
      showToast('⚠️ Please accept the Terms & Conditions');
      termsCheckbox?.closest('.terms-checkbox-wrapper')?.classList.add('shake');
      setTimeout(() => termsCheckbox?.closest('.terms-checkbox-wrapper')?.classList.remove('shake'), 600);
      return;
    }

    // Gather data
    const name = fields.fullName.el.value.trim();
    const college = fields.college.el.value.trim();
    const rollNo = fields.rollNo.el.value.trim();
    const title = fields.projectTitle.el.value.trim();
    const desc = document.getElementById('projectDesc').value.trim() || 'Not provided';
    const phone = fields.whatsapp.el.value.trim();

    // Selected extras
    let selectedExtras = [];
    const comboItem = document.querySelector('.extra-item.combo');
    if (comboItem && comboItem.classList.contains('selected')) {
      selectedExtras.push('🔥 Combo Pack (Report + Documentation + PPT + Assistance)');
    } else {
      document.querySelectorAll('.extra-item:not(.combo).selected').forEach(item => {
        const key = item.dataset.extra;
        if (EXTRAS[key]) selectedExtras.push(EXTRAS[key].label);
      });
    }
    const extrasStr = selectedExtras.length > 0 ? selectedExtras.join(', ') : 'None';

    // Promo info
    const promoInfo = promoApplied ? '✅ KUMAR500 (₹500 discount applied)' : 'No promo code used';

    // Total
    const totalText = document.getElementById('totalAmount').textContent;

    // Build message
    const message = `Hi Kumar,
This is ${name}

College: ${college}
Roll No: ${rollNo}

Project Title: ${title}
Description: ${desc}

Selected Extras: ${extrasStr}
Promo Code: ${promoInfo}

Total Price: ${totalText}

My Contact Number: ${phone}`;

    // Encode & redirect
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/918978943122?text=${encoded}`;

    showToast('✅ Redirecting to WhatsApp...', 'success');
    setTimeout(() => window.open(url, '_blank'), 800);
  });
}

// === SMOOTH SCROLL FOR NAV CTA ===
function initSmoothScroll() {
  document.querySelector('.nav-cta')?.addEventListener('click', () => {
    document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.hero-cta')?.addEventListener('click', () => {
    document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + '+';
    }, 30);
  });
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initReveal();
  initNavbar();
  initPricing();
  initPromo();
  initForm();
  initSmoothScroll();
  setTimeout(animateCounters, 500);
});
