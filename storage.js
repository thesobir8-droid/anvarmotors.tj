const STORAGE_KEY = 'anvar_motors_data_v1';
const AUTH_KEY = 'anvar_motors_auth';
const PASSWORD_KEY = 'anvar_motors_password';
const DEFAULT_PASSWORD = 'anvar2026';

const DEFAULT_DATA = {
  site: {
    brand: 'ANVAR MOTORS',
    heroTitle: 'Қисмҳои эҳтиётии аслӣ барои мошини шумо',
    heroText: 'Мо қисмҳои эҳтиётӣ, равған, филтр ва лавозимоти мошини шуморо бо сифати баланд ва нархи муносиб пешниҳод мекунем.',
    aboutTitle: 'Дар бораи мо',
    aboutText: 'ANVAR MOTORS — мағозаи қисмҳои эҳтиётии мошин. Мо ба сифат, суръати хизматрасонӣ ва эътимоди муштариён аҳамият медиҳем. Аз тормоз то муҳаррик — ҳама чиз дар як ҷо.',
    catalogTitle: 'Каталоги маҳсулот',
    catalogText: 'Маҳсулоти навтаринро аз админ панел илова кунед — дар ин ҷо фавран намоиш дода мешавад.',
    contactTitle: 'Тамос',
    contactText: 'Ба мо занг занед ё тавассути шабакаҳои иҷтимоӣ нависед — зуд ҷавоб медиҳем.',
    footerText: '© ANVAR MOTORS — Қисмҳои эҳтиётии мошин',
    logo: '',
    aboutNote: 'Сифати аслӣ, маслиҳати касбӣ ва расонидани зуд — ҳадафи асосии мо.',
    publicUrl: '',
    shareText: 'ANVAR MOTORS — қисмҳои эҳтиётии мошин. Дида бароед:',
  },
  stats: [
    { value: '500+', label: 'Номгӯи қисмҳо' },
    { value: '7', label: 'Сол таҷриба' },
    { value: '24/7', label: 'Дастгирӣ' },
  ],
  phones: ['+992 90 000 00 00', '+992 91 000 00 00'],
  social: {
    instagram: 'https://instagram.com/',
    telegram: 'https://t.me/',
    whatsapp: 'https://wa.me/992900000000',
  },
  products: [
    {
      id: 'p1',
      name: 'Филтри равған',
      category: 'Филтрҳо',
      description: 'Филтри равғани муҳаррик барои аксари моделҳо.',
      price: '45 с.',
      image: '',
    },
    {
      id: 'p2',
      name: 'Лампаҳои LED',
      category: 'Равшанӣ',
      description: 'Лампаҳои LED барои фараҳои пеш ва қафо.',
      price: '120 с.',
      image: '',
    },
    {
      id: 'p3',
      name: 'Тормози дискӣ',
      category: 'Тормоз',
      description: 'Дискҳои тормози аслӣ бо кафолати сифат.',
      price: '350 с.',
      image: '',
    },
  ],
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = deepClone(DEFAULT_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      ...deepClone(DEFAULT_DATA),
      ...parsed,
      site: { ...DEFAULT_DATA.site, ...(parsed.site || {}) },
      social: { ...DEFAULT_DATA.social, ...(parsed.social || {}) },
      phones: Array.isArray(parsed.phones) ? parsed.phones : DEFAULT_DATA.phones,
      products: Array.isArray(parsed.products) ? parsed.products : DEFAULT_DATA.products,
      stats: Array.isArray(parsed.stats) && parsed.stats.length
        ? parsed.stats
        : deepClone(DEFAULT_DATA.stats),
    };
  } catch {
    return deepClone(DEFAULT_DATA);
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function setAuth(ok) {
  if (ok) sessionStorage.setItem(AUTH_KEY, '1');
  else sessionStorage.removeItem(AUTH_KEY);
}

function getPassword() {
  const saved = localStorage.getItem(PASSWORD_KEY);
  return saved && saved.length ? saved : DEFAULT_PASSWORD;
}

function isDefaultPassword() {
  return getPassword() === DEFAULT_PASSWORD;
}

function checkPassword(password) {
  return password === getPassword();
}

function changePassword(currentPassword, newPassword) {
  if (!checkPassword(currentPassword)) {
    return { ok: false, error: 'Рамзи ҳозира нодуруст аст.' };
  }
  const next = String(newPassword || '').trim();
  if (next.length < 4) {
    return { ok: false, error: 'Рамзи нав ҳадди ақал 4 аломат бошад.' };
  }
  if (next === currentPassword) {
    return { ok: false, error: 'Рамзи нав бояд аз рамзи куҳна фарқ кунад.' };
  }
  localStorage.setItem(PASSWORD_KEY, next);
  return { ok: true };
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function placeholderImage(name) {
  const label = encodeURIComponent((name || 'AM').slice(0, 18));
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%231a2028'/%3E%3Cstop offset='1' stop-color='%230a0c0f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g)'/%3E%3Ccircle cx='400' cy='250' r='70' fill='none' stroke='%23e85d04' stroke-width='8'/%3E%3Ctext x='400' y='400' text-anchor='middle' fill='%23e85d04' font-family='Arial' font-size='28' font-weight='700'%3E${label}%3C/text%3E%3C/svg%3E`;
}

const DEFAULT_LOGO = 'anvar-motors-logo.png';

function getLogoUrl(site) {
  return (site && site.logo) || DEFAULT_LOGO;
}

function getShareUrl(site) {
  const custom = site && site.publicUrl ? String(site.publicUrl).trim() : '';
  if (custom) return custom;
  if (typeof location !== 'undefined') {
    const path = location.pathname.replace(/index\.html$/i, '');
    return location.origin + path;
  }
  return '';
}

window.AnvarStore = {
  STORAGE_KEY,
  PASSWORD_KEY,
  DEFAULT_PASSWORD,
  DEFAULT_LOGO,
  DEFAULT_DATA,
  loadData,
  saveData,
  isAuthed,
  setAuth,
  getPassword,
  isDefaultPassword,
  checkPassword,
  changePassword,
  getLogoUrl,
  getShareUrl,
  uid,
  escapeHtml,
  placeholderImage,
  deepClone,
};
