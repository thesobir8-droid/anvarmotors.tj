(function () {
  const {
    loadData,
    escapeHtml,
    placeholderImage,
    getLogoUrl,
    getShareUrl,
  } = window.AnvarStore;

  const SOCIAL_ICONS = {
    instagram: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stop-color="#fdf497"/>
            <stop offset="5%" stop-color="#fdf497"/>
            <stop offset="45%" stop-color="#fd5949"/>
            <stop offset="60%" stop-color="#d6249f"/>
            <stop offset="90%" stop-color="#285AEB"/>
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad)"/>
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/>
        <circle cx="17.2" cy="6.8" r="1.15" fill="#fff"/>
        <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="3.8" fill="none" stroke="#fff" stroke-width="1.8"/>
      </svg>`,
    telegram: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#229ED9"/>
        <path fill="#fff" d="M17.8 7.2c.2-.1.5 0 .5.3l-1.5 8.8c-.1.5-.4.6-.8.4l-2.5-1.9-1.2 1.2c-.1.1-.3.2-.4.2l.2-2.7 4.9-4.4c.2-.2 0-.3-.2-.1l-6.1 3.8-2.6-.8c-.6-.2-.6-.6.1-.9l10.1-3.9z"/>
      </svg>`,
    whatsapp: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#25D366"/>
        <path fill="#fff" d="M16.6 13.9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1-.1.2-.6.7-.7.8-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3z"/>
        <path fill="#fff" d="M12.1 4.5c-4.1 0-7.4 3.3-7.4 7.4 0 1.3.3 2.5.9 3.6L4.5 19.5l4.1-1.1c1.1.6 2.3.9 3.5.9h0c4.1 0 7.4-3.3 7.4-7.4s-3.3-7.4-7.4-7.4zm0 13.4h0c-1.1 0-2.2-.3-3.2-.9l-.2-.1-2.4.6.7-2.4-.2-.2c-.6-1-1-2.1-1-3.3 0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2-2.7 6.3-6.1 6.3z"/>
      </svg>`,
  };

  const els = {
    header: document.getElementById('header'),
    menuToggle: document.getElementById('menuToggle'),
    navLinks: document.getElementById('navLinks'),
    heroTitle: document.getElementById('heroTitle'),
    heroText: document.getElementById('heroText'),
    catalogTitle: document.getElementById('catalogTitle'),
    catalogText: document.getElementById('catalogText'),
    aboutTitle: document.getElementById('aboutTitle'),
    aboutText: document.getElementById('aboutText'),
    aboutNote: document.getElementById('aboutNote'),
    contactTitle: document.getElementById('contactTitle'),
    contactText: document.getElementById('contactText'),
    footerText: document.getElementById('footerText'),
    productsGrid: document.getElementById('productsGrid'),
    phonesList: document.getElementById('phonesList'),
    socialList: document.getElementById('socialList'),
    searchInput: document.getElementById('searchInput'),
    statsRow: document.getElementById('statsRow'),
    shareUrlInput: document.getElementById('shareUrlInput'),
    copyLinkBtn: document.getElementById('copyLinkBtn'),
    shareWhatsAppBtn: document.getElementById('shareWhatsAppBtn'),
    shareTelegramBtn: document.getElementById('shareTelegramBtn'),
    shareNativeBtn: document.getElementById('shareNativeBtn'),
  };

  let data = loadData();

  function renderLogos() {
    const src = getLogoUrl(data.site);
    document.querySelectorAll('.site-logo').forEach((img) => {
      img.src = src;
    });
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = src;
  }

  function renderStats() {
    const stats = data.stats || [];
    els.statsRow.innerHTML = stats
      .map(
        (s) => `
        <div class="stat">
          <strong>${escapeHtml(s.value || '')}</strong>
          <span>${escapeHtml(s.label || '')}</span>
        </div>`
      )
      .join('');
  }

  function renderTexts() {
    const s = data.site;
    els.heroTitle.textContent = s.heroTitle;
    els.heroText.textContent = s.heroText;
    els.catalogTitle.textContent = s.catalogTitle;
    els.catalogText.textContent = s.catalogText;
    els.aboutTitle.textContent = s.aboutTitle;
    els.aboutText.textContent = s.aboutText;
    els.aboutNote.textContent = s.aboutNote || '';
    els.contactTitle.textContent = s.contactTitle;
    els.contactText.textContent = s.contactText;
    els.footerText.textContent = s.footerText;
    document.title = `${s.brand} — Қисмҳои эҳтиётии мошин`;
  }

  function renderProducts(filter = '') {
    const q = filter.trim().toLowerCase();
    const list = data.products.filter((p) => {
      if (!q) return true;
      return [p.name, p.category, p.description, p.price]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });

    if (!list.length) {
      els.productsGrid.innerHTML = `
        <div class="empty-state">
          Ҳоло маҳсулот ёфт нашуд. Аз админ панел илова кунед.
        </div>`;
      return;
    }

    els.productsGrid.innerHTML = list
      .map((p, i) => {
        const img = p.image || placeholderImage(p.name);
        return `
          <article class="product-card" style="animation-delay:${i * 0.05}s">
            <div class="product-media">
              <img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" loading="lazy" />
            </div>
            <div class="product-body">
              <div class="product-category">${escapeHtml(p.category || 'Умумӣ')}</div>
              <h3 class="product-name">${escapeHtml(p.name)}</h3>
              <p class="product-desc">${escapeHtml(p.description || '')}</p>
              <div class="product-price">${escapeHtml(p.price || 'Нарх дархост')}</div>
            </div>
          </article>`;
      })
      .join('');
  }

  function renderPhones() {
    const phones = (data.phones || []).filter(Boolean);
    if (!phones.length) {
      els.phonesList.innerHTML = '<p style="color:var(--muted)">Рақам илова нашудааст.</p>';
      return;
    }
    els.phonesList.innerHTML = phones
      .map((phone) => {
        const href = 'tel:' + phone.replace(/[^\d+]/g, '');
        return `
          <a class="phone-link" href="${escapeHtml(href)}">
            <span class="phone-icon">☎</span>
            <span>${escapeHtml(phone)}</span>
          </a>`;
      })
      .join('');
  }

  function renderSocial() {
    const s = data.social || {};
    const items = [
      { key: 'instagram', label: 'Instagram', className: 'ig', url: s.instagram, hint: 'instagram.com' },
      { key: 'telegram', label: 'Telegram', className: 'tg', url: s.telegram, hint: 't.me' },
      { key: 'whatsapp', label: 'WhatsApp', className: 'wa', url: s.whatsapp, hint: 'wa.me' },
    ];

    els.socialList.innerHTML = items
      .map((item) => {
        const url = item.url || '#';
        return `
          <a class="social-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
            <span class="social-icon ${item.className}">${SOCIAL_ICONS[item.key]}</span>
            <span class="social-meta">
              <span>${item.label}</span>
              <small>${escapeHtml(item.hint)}</small>
            </span>
          </a>`;
      })
      .join('');
  }

  function getSharePayload() {
    const url = getShareUrl(data.site) || location.href;
    const text = (data.site && data.site.shareText) || 'ANVAR MOTORS';
    return { url, text };
  }

  function renderShare() {
    const { url } = getSharePayload();
    if (els.shareUrlInput) els.shareUrlInput.value = url;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', url);
    else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.setAttribute('content', url);
      document.head.appendChild(meta);
    }
  }

  function showCopyFeedback() {
    const prev = els.copyLinkBtn.textContent;
    els.copyLinkBtn.textContent = 'Нусха шуд ✓';
    setTimeout(() => {
      els.copyLinkBtn.textContent = prev;
    }, 1800);
  }

  async function copyShareLink() {
    const { url } = getSharePayload();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        els.shareUrlInput.select();
        document.execCommand('copy');
      }
      showCopyFeedback();
    } catch {
      els.shareUrlInput.select();
      showCopyFeedback();
    }
  }

  function shareViaWhatsApp() {
    const { url, text } = getSharePayload();
    const msg = encodeURIComponent(text + ' ' + url);
    window.open('https://wa.me/?text=' + msg, '_blank', 'noopener,noreferrer');
  }

  function shareViaTelegram() {
    const { url, text } = getSharePayload();
    const link =
      'https://t.me/share/url?url=' +
      encodeURIComponent(url) +
      '&text=' +
      encodeURIComponent(text);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  async function shareNative() {
    const { url, text } = getSharePayload();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ANVAR MOTORS', text, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    await copyShareLink();
  }

  function renderAll() {
    data = loadData();
    renderLogos();
    renderTexts();
    renderStats();
    renderProducts(els.searchInput.value);
    renderPhones();
    renderSocial();
    renderShare();
  }

  els.copyLinkBtn.addEventListener('click', copyShareLink);
  els.shareWhatsAppBtn.addEventListener('click', shareViaWhatsApp);
  els.shareTelegramBtn.addEventListener('click', shareViaTelegram);
  els.shareNativeBtn.addEventListener('click', shareNative);

  els.searchInput.addEventListener('input', () => {
    renderProducts(els.searchInput.value);
  });

  els.menuToggle.addEventListener('click', () => {
    els.navLinks.classList.toggle('open');
  });

  els.navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => els.navLinks.classList.remove('open'));
  });

  window.addEventListener('scroll', () => {
    els.header.classList.toggle('scrolled', window.scrollY > 20);
  });

  window.addEventListener('storage', (e) => {
    if (e.key === window.AnvarStore.STORAGE_KEY) renderAll();
  });

  renderAll();
})();
