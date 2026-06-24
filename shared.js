// shared.js — nav, footer, and EN↔Tamil translation engine

/* ── LANGUAGE STATE ── */
let LANG = localStorage.getItem('gh_lang') || 'en';

function t(obj, key) {
  // Returns obj[key_LANG] or falls back to obj[key_en]
  return obj[key + '_' + LANG] || obj[key + '_en'] || '';
}

/* ── BUILD NAV HTML ── */
function buildNav(data) {
  const nav = data.nav;
  const h = data.hospital;
  const links = nav.links.map(l =>
    `<li><a href="${l.href}">${t(l,'label')}</a></li>`
  ).join('');

  return `
<div class="nav-top">
  <div class="nav-top-left">
    <span>📞 ${h.phone[0]}</span>
    <span>✉️ ${h.email}</span>
  </div>
  <div class="nav-top-right">
    <button class="lang-btn ${LANG==='ta'?'active':''}" onclick="switchLang('ta')" aria-label="Switch to Tamil">தமிழ்</button>
    <button class="lang-btn ${LANG==='en'?'active':''}" onclick="switchLang('en')" aria-label="Switch to English">English</button>
    <span>🕐 ${t(h,'opd_hours')}</span>
  </div>
</div>
<div class="nav-main">
  <a class="nav-brand" href="/index.html">
    <div class="nav-emblem">🏥</div>
    <div class="nav-brand-text">
      <strong>${t(h,'name')}</strong>
      <span>${t(h,'tagline')}</span>
    </div>
  </a>
  <ul class="nav-links" id="navLinks">
    ${links}
    <li class="nav-cta"><a href="${nav.cta_href}">${LANG==='ta' ? nav.cta_ta : nav.cta_en}</a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</div>
<div class="mobile-menu" id="mobileMenu">
  ${nav.links.map(l => `<a href="${l.href}">${l.href.includes('index')?'🏠':l.href.includes('about')?'ℹ️':l.href.includes('dept')?'🏛️':l.href.includes('scope')?'📋':l.href.includes('patient')?'❤️':'⭐'} ${t(l,'label')}</a>`).join('')}
  ${nav.mobile_extra.map(l => `<a href="${l.href}">${l.icon} ${t(l,'label')}</a>`).join('')}
  <a href="${nav.cta_href}">♻️ ${LANG==='ta' ? nav.cta_ta : nav.cta_en}</a>
</div>`;
}

/* ── BUILD FOOTER HTML ── */
function buildFooter(data) {
  const h = data.hospital;
  return `
<div class="footer-grid">
  <div class="footer-brand">
    <strong>${t(h,'name')}</strong>
    <p>${LANG==='ta'
      ? 'ஈரோடு மற்றும் சுற்றியுள்ள மாவட்டங்களுக்கு சேவை செய்யும் மாவட்ட தலைமை மருத்துவமனை. தமிழ்நாடு அரசால் பல்நோக்கு சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனையாக தரமுயர்த்தப்பட்டது.'
      : 'A district headquarters hospital serving Erode and surrounding districts. Upgraded to a Multi Super Speciality Hospital under Government of Tamil Nadu.'}</p>
    <div style="font-size:12px;color:rgba(255,255,255,0.4)">${t(h,'authority')}</div>
  </div>
  <div>
    <h4>${LANG==='ta'?'விரைவு இணைப்புகள்':'Quick Links'}</h4>
    <ul>
      ${data.nav.links.slice(0,5).map(l=>`<li><a href="${l.href}">${t(l,'label')}</a></li>`).join('')}
    </ul>
  </div>
  <div>
    <h4>${LANG==='ta'?'சேவைகள்':'Services'}</h4>
    <ul>
      <li><a href="/patients.html">${LANG==='ta'?'நோயாளி நலன்கள்':'Patient Benefits'}</a></li>
      <li><a href="/waste.html">${LANG==='ta'?'கழிவு டாஷ்போர்டு':'Waste Dashboard'}</a></li>
      <li><a href="http://www.tnhealth.org" target="_blank">TN Health Portal</a></li>
      <li><a href="https://erode.nic.in" target="_blank">${LANG==='ta'?'ஈரோடு மாவட்டம்':'Erode District'}</a></li>
    </ul>
  </div>
  <div class="footer-contact">
    <h4>${LANG==='ta'?'தொடர்பு':'Contact'}</h4>
    <p>📍 ${t(h,'address')}</p>
    ${h.phone.map(p=>`<p>📞 ${p}</p>`).join('')}
    <p>🚑 ${LANG==='ta'?'அவசர சிகிச்சை':'Emergency'}: ${h.emergency}</p>
    <p>🩸 ${LANG==='ta'?'இரத்த வங்கி':'Blood Bank'}: ${h.blood_bank_phone}</p>
  </div>
</div>
<div class="footer-bottom">
  <span>© 2024 ${LANG==='ta'?'தமிழ்நாடு அரசு · சுகாதாரம் மற்றும் குடும்ப நலத்துறை':'Government of Tamil Nadu · Department of Health & Family Welfare'}</span>
  <span>${LANG==='ta'?'பொது வெளிப்படைத்தன்மைக்காக வடிவமைக்கப்பட்டது':'Designed for public transparency'}</span>
</div>`;
}

/* ── SWITCH LANGUAGE ── */
function switchLang(lang) {
  LANG = lang;
  localStorage.setItem('gh_lang', lang);
  // Re-render nav+footer, then fire page-level re-render
  initShared().then(() => {
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  });
}

/* ── INIT ── */
async function initShared() {
  try {
    const res  = await fetch('/hospital');
    const data = await res.json();

    const navbar = document.getElementById('navbar');
    if (navbar) navbar.innerHTML = buildNav(data);

    const footer = document.getElementById('footer');
    if (footer) footer.innerHTML = buildFooter(data);

    // Active nav link
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href && path.replace(/\/$/, '').endsWith(href.replace(/^\//, '').replace(/\/$/, ''))) {
        a.classList.add('active');
      }
    });

    // Hamburger
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
    }

    return data; // pages can await this too
  } catch(e) { console.error('shared.js init error:', e); }
}

document.addEventListener('DOMContentLoaded', initShared);