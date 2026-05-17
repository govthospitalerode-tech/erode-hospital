// shared.js — injected nav + footer on every page

const NAV_HTML = `
<div class="nav-top">
  <div class="nav-top-left">
    <span>📞 0424-2253676</span>
    <span>✉️ ghqherode@tnhealth.org</span>
  </div>
  <div class="nav-top-right">
    <a href="#">தமிழ்</a>
    <a href="#">English</a>
    <span>🕐 OPD: Mon–Sat 8AM–1PM</span>
  </div>
</div>
<div class="nav-main">
  <a class="nav-brand" href="/index.html">
    <div class="nav-emblem">🏥</div>
    <div class="nav-brand-text">
      <strong>Thanthai Periyar Govt Hospital</strong>
      <span>Erode · Tamil Nadu</span>
    </div>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="/index.html">Home</a></li>
    <li><a href="/about.html">About</a></li>
    <li><a href="/departments.html">Departments</a></li>
    <li><a href="/events.html">Events</a></li>
    <li><a href="/achievements.html">Achievements</a></li>
    <li><a href="/patients.html">Patient Benefits</a></li>
    <li class="nav-cta"><a href="/waste.html">Waste Dashboard</a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</div>
<div class="mobile-menu" id="mobileMenu">
  <a href="/index.html">🏠 Home</a>
  <a href="/about.html">ℹ️ About</a>
  <a href="/departments.html">🏛️ Departments</a>
  <a href="/events.html">📅 Events</a>
  <a href="/achievements.html">🏆 Achievements</a>
  <a href="/patients.html">❤️ Patient Benefits</a>
  <a href="/waste.html">♻️ Waste Dashboard</a>
</div>
`;

const FOOTER_HTML = `
<div class="footer-grid">
  <div class="footer-brand">
    <strong>Thanthai Periyar Govt Headquarters Hospital</strong>
    <p>A 700-bed tertiary care district headquarters hospital serving the people of Erode and surrounding districts. Now upgraded to a Multi Super Speciality Hospital under Government of Tamil Nadu.</p>
    <div style="font-size:12px;color:rgba(255,255,255,0.4)">Under: Tamil Nadu Directorate of Medical & Rural Health Services</div>
  </div>
  <div>
    <h4>Quick Links</h4>
    <ul>
      <li><a href="/index.html">Home</a></li>
      <li><a href="/about.html">About Hospital</a></li>
      <li><a href="/departments.html">Departments</a></li>
      <li><a href="/events.html">Events & Camps</a></li>
      <li><a href="/achievements.html">Achievements</a></li>
    </ul>
  </div>
  <div>
    <h4>Services</h4>
    <ul>
      <li><a href="/patients.html">Patient Benefits</a></li>
      <li><a href="/patients.html#schemes">Govt Schemes</a></li>
      <li><a href="/waste.html">Waste Dashboard</a></li>
      <li><a href="http://www.tnhealth.org" target="_blank">TN Health Portal</a></li>
      <li><a href="https://erode.nic.in" target="_blank">Erode District</a></li>
    </ul>
  </div>
  <div class="footer-contact">
    <h4>Contact</h4>
    <p>📍 EVN Road, Kaikolar Thottam, Erode – 638 009</p>
    <p>📞 0424-2253676</p>
    <p>📞 0424-2258355</p>
    <p>🚑 Emergency: 108</p>
    <p>🩸 Blood Bank: 0424-2252356</p>
  </div>
</div>
<div class="footer-bottom">
  <span>© 2024 Government of Tamil Nadu · Department of Health & Family Welfare</span>
  <span>Designed for public transparency · No login required</span>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
  // Inject nav
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.innerHTML = NAV_HTML;

  // Inject footer
  const footer = document.getElementById('footer');
  if (footer) footer.innerHTML = FOOTER_HTML;

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') && path.endsWith(a.getAttribute('href').replace(/^\//, ''))) {
      a.classList.add('active');
    }
  });
});