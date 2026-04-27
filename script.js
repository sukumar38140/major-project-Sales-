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
const REFERRAL_DISCOUNT = 1000;
let promoApplied = false;
let referralApplied = false;
let paymentInitiated = false;

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
  
  if (referralApplied) {
    total -= REFERRAL_DISCOUNT;
  }
  
  // Ensure total doesn't go below 0
  if (total < 0) total = 0;

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

  // === REFERRAL LOGIC ===
  const applyRefBtn = document.getElementById('applyReferralBtn');
  const refInput = document.getElementById('referralCode');
  
  if (!applyRefBtn) return;

  applyRefBtn.addEventListener('click', () => {
    const code = refInput.value.trim();

    if (referralApplied) {
      showReferralMessage('Referral code already applied!', 'info');
      return;
    }

    if (code.length < 10) {
      showReferralMessage('⚠️ Please enter a valid 10-digit phone number.', 'error');
      return;
    }

    referralApplied = true;
    showReferralMessage('✅ Referral applied! ₹1000 extra discount added!', 'success');
    refInput.disabled = true;
    refInput.classList.add('promo-applied');
    applyRefBtn.textContent = 'Applied ✓';
    applyRefBtn.classList.add('applied');
    applyRefBtn.disabled = true;
    updateTotal();
    showToast('🎉 ₹1000 referral discount applied!', 'success');
  });

  refInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyRefBtn.click();
    }
  });
}

function showReferralMessage(msg, type) {
  const refMsg = document.getElementById('referralMessage');
  refMsg.textContent = msg;
  refMsg.className = 'promo-message ' + type;
  refMsg.classList.add('visible');
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

    // Promo & Referral info
    const promoInfo = promoApplied ? '✅ KUMAR500 (₹500 discount)' : 'None';
    const referralInfo = referralApplied ? '✅ ' + document.getElementById('referralCode').value + ' (₹1000 discount)' : 'None';

    // Total
    const totalText = document.getElementById('totalAmount').textContent;

    // Payment Integration (UPI)
    if (!paymentInitiated) {
      const upiId = "8978943122@upi";
      const payeeName = encodeURIComponent("Kumar");
      const amount = "499.00";
      const note = encodeURIComponent("Project Advance - " + name);
      
      const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;
      
      // Attempt to open UPI App
      window.location.href = upiUrl;
      
      paymentInitiated = true;
      document.getElementById('utrContainer').style.display = 'block';
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.innerHTML = `
        <span class="wa-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
        Verify Payment &amp; Chat
      `;
      submitBtn.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
      
      showToast('📱 Opening UPI App... Complete payment and enter the UTR below to verify!', 'success');
      return; // Stop here and wait for second click
    }

    // Validate UTR on second click
    const utrInput = document.getElementById('utrInput');
    const utrValue = utrInput.value.trim();
    
    if (utrValue.length < 8) {
      showToast('⚠️ Please enter a valid UPI UTR or Reference Number to verify your payment.', 'error');
      utrInput.style.borderColor = '#ef4444';
      utrInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
      setTimeout(() => {
        utrInput.style.borderColor = 'var(--border)';
        utrInput.style.boxShadow = 'none';
      }, 2000);
      return;
    }

    // Build message for WhatsApp (Execute on 2nd Click if UTR is valid)
    const message = `Hi Kumar,
This is ${name}

College: ${college}
Roll No: ${rollNo}

Project Title: ${title}
Description: ${desc}

Selected Extras: ${extrasStr}
Promo Code: ${promoInfo}
Referral: ${referralInfo}

Total Price: ${totalText}
Advance: ₹499 (Paid via UPI)
UTR No: ${utrValue}

My Contact Number: ${phone}`;

    // Encode & redirect
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/919494565162?text=${encoded}`;

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
