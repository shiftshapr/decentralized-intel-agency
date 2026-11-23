/**
 * Estate chrome: GDPR consent bar + release-stage chip (data-stage: development | private-beta | public-beta).
 * Canonical copy: meta-console/static/estate-chrome/
 * Load with id="estate-chrome" and optional data-* config.
 */
(function () {
  if (window.__mlEstateChrome) return;
  window.__mlEstateChrome = true;

  var CONSENT_KEY = 'ml_consent_v1';
  var CONSENT_VERSION = 1;
  var BETA_KEY = 'ml_beta_welcome_v1';

  function attr(name, fallback) {
    var el = document.getElementById('estate-chrome') || document.currentScript;
    if (!el) return fallback;
    var v = el.getAttribute(name);
    return v == null || v === '' ? fallback : v;
  }

  var SITE = attr('data-site-name', document.title.split('|')[0].trim() || 'this site');
  var SUPPORT = attr('data-support-url', 'https://metawebbook.com/activity/?tab=contact');
  var PRIVACY = attr('data-privacy-url', '/privacy');
  var TERMS = attr('data-terms-url', '/terms');
  var COOKIES = attr('data-cookies-url', '');
  var EMAIL = attr('data-contact-email', 'info@bridgit.io');
  var WAITLIST = attr('data-waitlist-url', '');
  var STAGES = {
    'development': {
      label: 'In development',
      body: SITE + ' is in development. What you see here is the plan and the parts being built; most of it is not open for use yet.' +
        (WAITLIST ? ' <a href="' + WAITLIST + '">Join the waitlist</a> to hear when it opens.' : '')
    },
    'private-beta': {
      label: 'Private beta',
      body: 'We are so happy you are here. ' + SITE + ' is in private beta: access is by invitation while we test with early communities, and features may change.'
    },
    'public-beta': {
      label: 'Public beta',
      body: 'We are so happy you are here. We are in public beta. We encourage you to explore these largely uncharted waters.'
    }
  };
  var STAGE_KEY = STAGES[attr('data-stage', 'public-beta')] ? attr('data-stage', 'public-beta') : 'public-beta';
  var STAGE = STAGES[STAGE_KEY];
  if (STAGE_KEY !== 'public-beta') BETA_KEY = BETA_KEY + '_' + STAGE_KEY;

  function css() {
    return [
      '#ml-ec{all:initial;font-family:Inter,ui-sans-serif,system-ui,sans-serif}',
      '#ml-ec, #ml-ec *{box-sizing:border-box}',
      '.ml-beta-chip{display:inline-flex;align-items:center;margin-left:8px;vertical-align:middle;',
      'padding:2px 8px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.08em;',
      'text-transform:uppercase;color:#061018;background:linear-gradient(135deg,#7ee8ff 0%,#c4a7ff 55%,#ffd6a5 100%);',
      'border:0;cursor:pointer;line-height:1.4;box-shadow:0 0 0 1px rgba(255,255,255,.25),0 6px 18px rgba(90,40,180,.28);',
      'animation:ml-beta-breathe 2.8s ease-in-out infinite}',
      '.ml-beta-chip:hover,.ml-beta-chip:focus-visible{outline:2px solid #7ee8ff;outline-offset:2px}',
      '@keyframes ml-beta-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}',
      '.ml-beta-pop{position:absolute;z-index:2147483000;width:min(280px,calc(100vw - 24px));padding:12px 14px;',
      'border-radius:14px;background:rgba(10,16,28,.96);color:#e8f4ff;font-size:13px;line-height:1.45;',
      'box-shadow:0 16px 40px rgba(0,0,0,.4);border:1px solid rgba(126,232,255,.35);}',
      '.ml-beta-pop h3{margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#7ee8ff}',
      '.ml-beta-pop p{margin:0 0 8px}',
      '.ml-beta-pop a{color:#7ee8ff}',
      '.ml-beta-pop .ml-x{position:absolute;top:6px;right:8px;background:transparent;border:0;color:#9bb;cursor:pointer;font-size:16px}',
      '#ml-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147482000;padding:14px 16px;',
      'border-radius:18px;background:linear-gradient(180deg,rgba(12,18,32,.94),rgba(8,12,22,.96));',
      'color:#eaf4ff;border:1px solid rgba(126,232,255,.28);box-shadow:0 18px 50px rgba(0,0,0,.45);',
      'backdrop-filter:blur(16px);padding-bottom:max(14px,env(safe-area-inset-bottom))}',
      '#ml-consent .ml-row{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}',
      '#ml-consent .ml-copy{flex:1;min-width:220px;font-size:13.5px;line-height:1.5}',
      '#ml-consent .ml-copy strong{color:#7ee8ff}',
      '#ml-consent .ml-actions{display:flex;flex-wrap:wrap;gap:8px}',
      '#ml-consent button{border:0;border-radius:999px;padding:8px 14px;font-weight:700;cursor:pointer;font-size:13px}',
      '#ml-consent .ml-accept{background:linear-gradient(135deg,#5ce1ff,#9b7dff);color:#071018}',
      '#ml-consent .ml-reject{background:transparent;color:#d7e8f7;border:1px solid rgba(255,255,255,.28)}',
      '#ml-consent .ml-manage{background:rgba(255,255,255,.08);color:#fff}',
      '#ml-consent a{color:#7ee8ff}',
      '#ml-consent .ml-panel{display:none;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.12);font-size:13px}',
      '#ml-consent.is-open .ml-panel{display:block}',
      '#ml-consent .ml-cat{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:8px 0}',
      '#ml-consent .ml-cat p{margin:2px 0 0;color:#9bb3c9;font-size:12px}',
      '#ml-cookie-link,.ml-legal-privacy,.ml-legal-terms{margin-left:8px;background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit}',
      '@media (max-width:640px){#ml-consent .ml-actions{width:100%} #ml-consent button{flex:1}}'
    ].join('');
  }

  function injectStyle() {
    if (document.getElementById('ml-ec-style')) return;
    var s = document.createElement('style');
    s.id = 'ml-ec-style';
    s.textContent = css();
    document.head.appendChild(s);
  }

  function readConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(analytics) {
    var data = {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: !!analytics,
      ts: Date.now()
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    } catch (e) {}
    window.MLConsent = window.MLConsent || {};
    window.MLConsent.value = data;
    document.dispatchEvent(new CustomEvent('ml-consent-change', { detail: data }));
  }

  function policyLinks() {
    var bits = [];
    if (COOKIES) bits.push('<a href="' + COOKIES + '">Cookie policy</a>');
    if (PRIVACY) bits.push('<a href="' + PRIVACY + '">Privacy</a>');
    if (TERMS) bits.push('<a href="' + TERMS + '">Terms</a>');
    return bits.length ? ' ' + bits.join(' · ') : '';
  }

  function openCookieSettings() {
    var bar = document.getElementById('ml-consent');
    if (!bar) {
      renderBar();
      bar = document.getElementById('ml-consent');
    }
    if (bar) {
      bar.classList.add('is-open');
      bar.hidden = false;
      var btn = bar.querySelector('.ml-manage');
      if (btn) btn.focus();
    }
  }

  function renderBar() {
    if (document.getElementById('ml-consent')) return;
    var wrap = document.createElement('div');
    wrap.id = 'ml-ec';
    wrap.innerHTML =
      '<div id="ml-consent" role="dialog" aria-label="Cookie consent">' +
      '<div class="ml-row">' +
      '<div class="ml-copy"><strong>Cookies on ' + SITE + '.</strong> We use essential cookies for sign-in and site operation. With your permission we also use first-party analytics and attribution. We do not sell personal information.' +
      policyLinks() +
      '</div>' +
      '<div class="ml-actions">' +
      '<button type="button" class="ml-reject">Reject non-essential</button>' +
      '<button type="button" class="ml-manage">Manage</button>' +
      '<button type="button" class="ml-accept">Accept all</button>' +
      '</div></div>' +
      '<div class="ml-panel">' +
      '<div class="ml-cat"><div><strong>Necessary</strong><p>Sign-in, security, checkout, and basic operation. Always on.</p></div><span>On</span></div>' +
      '<div class="ml-cat"><div><strong>Analytics &amp; attribution</strong><p>First-party usage and referrals. Off until you opt in. Not sold to ad networks.</p></div>' +
      '<label><input type="checkbox" id="ml-analytics-toggle"> Allow</label></div>' +
      '<div class="ml-actions" style="margin-top:10px">' +
      '<button type="button" class="ml-accept" id="ml-save">Save preferences</button>' +
      '</div></div></div>';
    document.body.appendChild(wrap);

    var bar = wrap.querySelector('#ml-consent');
    bar.querySelector('.ml-accept').addEventListener('click', function () {
      writeConsent(true);
      bar.remove();
    });
    bar.querySelector('.ml-reject').addEventListener('click', function () {
      writeConsent(false);
      bar.remove();
    });
    bar.querySelector('.ml-manage').addEventListener('click', function () {
      bar.classList.toggle('is-open');
    });
    var save = bar.querySelector('#ml-save');
    save.addEventListener('click', function () {
      var on = bar.querySelector('#ml-analytics-toggle').checked;
      writeConsent(on);
      bar.remove();
    });
  }

  function addFooterLink() {
    var footers = document.querySelectorAll('footer, #gh-site-footer, .site-footer');
    footers.forEach(function (el) {
      if (!el.querySelector('.ml-legal-privacy') && PRIVACY) {
        var privacy = document.createElement('a');
        privacy.className = 'ml-legal-privacy';
        privacy.href = PRIVACY;
        privacy.textContent = 'Privacy';
        el.appendChild(privacy);
      }
      if (!el.querySelector('.ml-legal-terms') && TERMS) {
        var terms = document.createElement('a');
        terms.className = 'ml-legal-terms';
        terms.href = TERMS;
        terms.textContent = 'Terms';
        el.appendChild(terms);
      }
      if (el.querySelector('.ml-cookie-settings')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ml-cookie-settings';
      btn.id = 'ml-cookie-link';
      btn.textContent = 'Cookie settings';
      btn.addEventListener('click', openCookieSettings);
      el.appendChild(btn);
    });
  }

  function findBrand() {
    return document.querySelector(
      '[data-estate-brand], a.navbar-brand, a.brand, a.site-nav__brand, .navbar-brand'
    );
  }

  function placePopover(chip, pop) {
    var r = chip.getBoundingClientRect();
    pop.style.top = Math.min(window.innerHeight - 12, r.bottom + 10) + 'px';
    pop.style.left = Math.max(12, Math.min(r.left, window.innerWidth - 292)) + 'px';
  }

  function betaCopyHtml() {
    return (
      '<button type="button" class="ml-x" aria-label="Close">&times;</button>' +
      '<h3>' + STAGE.label + '</h3>' +
      '<p>' + STAGE.body + '</p>' +
      '<p>If you have any questions, please fill out the <a href="' + SUPPORT + '">support form</a> or contact <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.</p>'
    );
  }

  function showBetaPop(chip, persistHide) {
    var existing = document.getElementById('ml-beta-pop');
    if (existing) existing.remove();
    var pop = document.createElement('div');
    pop.id = 'ml-beta-pop';
    pop.className = 'ml-beta-pop';
    pop.setAttribute('role', 'dialog');
    pop.innerHTML = betaCopyHtml();
    document.body.appendChild(pop);
    placePopover(chip, pop);
    pop.querySelector('.ml-x').addEventListener('click', function () {
      pop.remove();
      if (persistHide) {
        try { localStorage.setItem(BETA_KEY, '1'); } catch (e) {}
      }
    });
    function onWin() { if (document.body.contains(pop)) placePopover(chip, pop); }
    window.addEventListener('scroll', onWin, { passive: true });
    window.addEventListener('resize', onWin);
  }

  function attachBeta() {
    var brand = findBrand();
    if (!brand || brand.querySelector('.ml-beta-chip')) return;
    if (getComputedStyle(brand).position === 'static') brand.style.position = 'relative';
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ml-beta-chip';
    chip.setAttribute('aria-label', STAGE.label);
    chip.textContent = STAGE_KEY === 'public-beta' ? 'Beta' : STAGE.label;
    brand.appendChild(chip);

    var hoverTimer;
    chip.addEventListener('mouseenter', function () {
      clearTimeout(hoverTimer);
      showBetaPop(chip, false);
    });
    chip.addEventListener('mouseleave', function () {
      hoverTimer = setTimeout(function () {
        var pop = document.getElementById('ml-beta-pop');
        if (pop && !pop.matches(':hover')) pop.remove();
      }, 280);
    });
    chip.addEventListener('focus', function () { showBetaPop(chip, false); });
    chip.addEventListener('click', function () { showBetaPop(chip, false); });

    function maybeWelcome() {
      try {
        if (localStorage.getItem(BETA_KEY) === '1') return;
      } catch (e) {}
      showBetaPop(chip, true);
      window.removeEventListener('scroll', maybeWelcome);
      window.removeEventListener('mousemove', maybeWelcome);
    }
    window.addEventListener('scroll', maybeWelcome, { passive: true, once: true });
    window.addEventListener('mousemove', maybeWelcome, { once: true });
  }

    var tries = 0;
    function retryBeta() {
      attachBeta();
      if (findBrand() && findBrand().querySelector('.ml-beta-chip')) return;
      tries += 1;
      if (tries < 20) setTimeout(retryBeta, 250);
    }

    function boot() {
      injectStyle();
      window.MLConsent = window.MLConsent || { get: readConsent, open: openCookieSettings };
      window.MLConsent.get = readConsent;
      window.MLConsent.open = openCookieSettings;
      if (!readConsent()) renderBar();
      addFooterLink();
      retryBeta();
    }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
