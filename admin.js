(function () {
  const {
    loadData,
    saveData,
    isAuthed,
    setAuth,
    checkPassword,
    changePassword,
    isDefaultPassword,
    getLogoUrl,
    uid,
    escapeHtml,
    placeholderImage,
  } = window.AnvarStore;

  const loginCard = document.getElementById('loginCard');
  const adminPanel = document.getElementById('adminPanel');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const toast = document.getElementById('toast');

  const productForm = document.getElementById('productForm');
  const productId = document.getElementById('productId');
  const productName = document.getElementById('productName');
  const productCategory = document.getElementById('productCategory');
  const productDesc = document.getElementById('productDesc');
  const productPrice = document.getElementById('productPrice');
  const productImageFile = document.getElementById('productImageFile');
  const productImageUrl = document.getElementById('productImageUrl');
  const imagePreview = document.getElementById('imagePreview');
  const resetProductBtn = document.getElementById('resetProductBtn');
  const adminProductList = document.getElementById('adminProductList');
  const saveProductBtn = document.getElementById('saveProductBtn');

  const textsForm = document.getElementById('textsForm');
  const brandingForm = document.getElementById('brandingForm');
  const contactsForm = document.getElementById('contactsForm');
  const passwordForm = document.getElementById('passwordForm');
  const passwordError = document.getElementById('passwordError');
  const defaultPasswordHint = document.getElementById('defaultPasswordHint');
  const logoFile = document.getElementById('logoFile');
  const logoPreview = document.getElementById('logoPreview');
  const resetLogoBtn = document.getElementById('resetLogoBtn');

  let data = loadData();
  let pendingImageData = '';
  let pendingLogoData = null; // null = unchanged, '' = reset to default, string = new logo

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function updateLoginHint() {
    if (!defaultPasswordHint) return;
    defaultPasswordHint.classList.toggle('hidden', !isDefaultPassword());
  }

  function updateAdminLogos() {
    const src = getLogoUrl(data.site);
    document.querySelectorAll('.site-logo').forEach((img) => {
      img.src = src;
    });
    if (logoPreview) logoPreview.src = pendingLogoData !== null && pendingLogoData !== ''
      ? pendingLogoData
      : src;
  }

  function fillBrandingForm() {
    const stats = data.stats || [];
    for (let i = 0; i < 3; i++) {
      const stat = stats[i] || { value: '', label: '' };
      document.getElementById('stat' + (i + 1) + 'Value').value = stat.value || '';
      document.getElementById('stat' + (i + 1) + 'Label').value = stat.label || '';
    }
    document.getElementById('aboutNote').value = data.site.aboutNote || '';
    pendingLogoData = null;
    if (logoFile) logoFile.value = '';
    updateAdminLogos();
  }

  function refreshAuthUI() {
    const ok = isAuthed();
    loginCard.classList.toggle('hidden', ok);
    adminPanel.classList.toggle('hidden', !ok);
    logoutBtn.classList.toggle('hidden', !ok);
    updateLoginHint();
    if (ok) {
      data = loadData();
      fillTextsForm();
      fillBrandingForm();
      fillContactsForm();
      renderAdminProducts();
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (checkPassword(password)) {
      setAuth(true);
      loginError.textContent = '';
      refreshAuthUI();
      showToast('Хуш омадед!');
    } else {
      loginError.textContent = 'Рамз нодуруст аст.';
    }
  });

  logoutBtn.addEventListener('click', () => {
    setAuth(false);
    refreshAuthUI();
  });

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  function updatePreview(src) {
    if (src) {
      imagePreview.src = src;
      imagePreview.classList.add('show');
    } else {
      imagePreview.removeAttribute('src');
      imagePreview.classList.remove('show');
    }
  }

  productImageFile.addEventListener('change', () => {
    const file = productImageFile.files && productImageFile.files[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Акс бояд аз 2.5MB хурдтар бошад');
      productImageFile.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      pendingImageData = String(reader.result || '');
      productImageUrl.value = '';
      updatePreview(pendingImageData);
    };
    reader.readAsDataURL(file);
  });

  productImageUrl.addEventListener('input', () => {
    pendingImageData = '';
    updatePreview(productImageUrl.value.trim());
  });

  function resetProductForm() {
    productForm.reset();
    productId.value = '';
    pendingImageData = '';
    updatePreview('');
    saveProductBtn.textContent = 'Захира кардан';
  }

  resetProductBtn.addEventListener('click', resetProductForm);

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    data = loadData();
    const image = pendingImageData || productImageUrl.value.trim();
    const payload = {
      id: productId.value || uid(),
      name: productName.value.trim(),
      category: productCategory.value.trim(),
      description: productDesc.value.trim(),
      price: productPrice.value.trim(),
      image,
    };

    const idx = data.products.findIndex((p) => p.id === payload.id);
    if (idx >= 0) {
      if (!payload.image) payload.image = data.products[idx].image || '';
      data.products[idx] = payload;
    } else {
      data.products.unshift(payload);
    }

    saveData(data);
    resetProductForm();
    renderAdminProducts();
    showToast('Маҳсулот захира шуд');
  });

  function renderAdminProducts() {
    data = loadData();
    if (!data.products.length) {
      adminProductList.innerHTML = '<div class="empty-state">Ҳоло маҳсулот нест.</div>';
      return;
    }

    adminProductList.innerHTML = data.products
      .map((p) => {
        const img = p.image || placeholderImage(p.name);
        return `
          <div class="admin-item" data-id="${escapeHtml(p.id)}">
            <img src="${escapeHtml(img)}" alt="" />
            <div>
              <h4>${escapeHtml(p.name)}</h4>
              <p>${escapeHtml(p.category || 'Умумӣ')} · ${escapeHtml(p.price || 'бе нарх')}</p>
            </div>
            <div class="item-actions">
              <button class="btn-sm" type="button" data-action="edit">Таҳрир</button>
              <button class="btn-sm danger" type="button" data-action="delete">Нест</button>
            </div>
          </div>`;
      })
      .join('');
  }

  adminProductList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const item = btn.closest('.admin-item');
    const id = item && item.dataset.id;
    if (!id) return;

    data = loadData();
    const product = data.products.find((p) => p.id === id);
    if (!product) return;

    if (btn.dataset.action === 'edit') {
      productId.value = product.id;
      productName.value = product.name || '';
      productCategory.value = product.category || '';
      productDesc.value = product.description || '';
      productPrice.value = product.price || '';
      productImageUrl.value = product.image && !product.image.startsWith('data:') ? product.image : '';
      pendingImageData = product.image && product.image.startsWith('data:') ? product.image : '';
      updatePreview(product.image || '');
      saveProductBtn.textContent = 'Навсозӣ кардан';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (btn.dataset.action === 'delete') {
      if (!confirm('Ин маҳсулотро нест кунем?')) return;
      data.products = data.products.filter((p) => p.id !== id);
      saveData(data);
      renderAdminProducts();
      showToast('Нест карда шуд');
    }
  });

  function fillTextsForm() {
    const s = data.site;
    document.getElementById('heroTitle').value = s.heroTitle || '';
    document.getElementById('heroText').value = s.heroText || '';
    document.getElementById('catalogTitle').value = s.catalogTitle || '';
    document.getElementById('catalogText').value = s.catalogText || '';
    document.getElementById('aboutTitle').value = s.aboutTitle || '';
    document.getElementById('aboutText').value = s.aboutText || '';
    document.getElementById('contactTitle').value = s.contactTitle || '';
    document.getElementById('contactText').value = s.contactText || '';
    document.getElementById('footerText').value = s.footerText || '';
  }

  textsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    data = loadData();
    data.site = {
      ...data.site,
      heroTitle: document.getElementById('heroTitle').value.trim(),
      heroText: document.getElementById('heroText').value.trim(),
      catalogTitle: document.getElementById('catalogTitle').value.trim(),
      catalogText: document.getElementById('catalogText').value.trim(),
      aboutTitle: document.getElementById('aboutTitle').value.trim(),
      aboutText: document.getElementById('aboutText').value.trim(),
      contactTitle: document.getElementById('contactTitle').value.trim(),
      contactText: document.getElementById('contactText').value.trim(),
      footerText: document.getElementById('footerText').value.trim(),
    };
    saveData(data);
    showToast('Матнҳо захира шуданд');
  });

  logoFile.addEventListener('change', () => {
    const file = logoFile.files && logoFile.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Логотип бояд аз 2MB хурдтар бошад');
      logoFile.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      pendingLogoData = String(reader.result || '');
      logoPreview.src = pendingLogoData;
      logoPreview.classList.add('show');
    };
    reader.readAsDataURL(file);
  });

  resetLogoBtn.addEventListener('click', () => {
    pendingLogoData = '';
    logoFile.value = '';
    logoPreview.src = window.AnvarStore.DEFAULT_LOGO;
  });

  brandingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    data = loadData();

    if (pendingLogoData !== null) {
      data.site.logo = pendingLogoData;
    }

    data.site.aboutNote = document.getElementById('aboutNote').value.trim();
    data.stats = [1, 2, 3].map((n) => ({
      value: document.getElementById('stat' + n + 'Value').value.trim(),
      label: document.getElementById('stat' + n + 'Label').value.trim(),
    }));

    saveData(data);
    pendingLogoData = null;
    logoFile.value = '';
    updateAdminLogos();
    showToast('Логотип ва оморҳо захира шуданд');
  });

  function fillContactsForm() {
    document.getElementById('phones').value = (data.phones || []).join('\n');
    document.getElementById('instagram').value = data.social.instagram || '';
    document.getElementById('telegram').value = data.social.telegram || '';
    document.getElementById('whatsapp').value = data.social.whatsapp || '';
    document.getElementById('publicUrl').value = data.site.publicUrl || '';
    document.getElementById('shareText').value = data.site.shareText || '';
  }

  contactsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    data = loadData();
    data.phones = document
      .getElementById('phones')
      .value.split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
    data.social = {
      instagram: document.getElementById('instagram').value.trim(),
      telegram: document.getElementById('telegram').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim(),
    };
    data.site.publicUrl = document.getElementById('publicUrl').value.trim();
    data.site.shareText = document.getElementById('shareText').value.trim();
    saveData(data);
    showToast('Тамосҳо захира шуданд');
  });

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    passwordError.textContent = '';

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      passwordError.textContent = 'Рамзи нав ва такрораш мувофиқ нестанд.';
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (!result.ok) {
      passwordError.textContent = result.error;
      return;
    }

    passwordForm.reset();
    updateLoginHint();
    showToast('Рамз бомуваффақият иваз шуд');
  });

  refreshAuthUI();
})();
