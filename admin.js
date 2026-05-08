// ===== ADMIN PANEL =====

function showAdminLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h2>Área do Lojista</h2>
        <p class="subtitle">Acesse seu painel administrativo</p>
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input type="email" id="loginEmail" class="form-input" placeholder="seu@email.com" value="admin@techstore.com">
        </div>
        <div class="form-group">
          <label class="form-label">Senha</label>
          <input type="password" id="loginPass" class="form-input" placeholder="••••••••" value="admin123">
        </div>
        <button class="btn-full" onclick="doLogin()">Entrar</button>
        <p style="text-align:center;margin-top:20px">
          <a href="#" style="color:var(--accent);text-decoration:none;font-size:13px" onclick="event.preventDefault();window.location.hash='';renderCatalog()">← Voltar ao catálogo</a>
        </p>
      </div>
    </div>
    <div id="toast" class="toast"></div>
  `;
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  const store = await Storage.getStore();
  
  if (email === store.email && pass === store.password) {
    isAdmin = true;
    sessionStorage.setItem('saas_admin_logged', store.slug);
    await renderAdmin();
  } else {
    showToast('Credenciais inválidas ❌');
  }
}

async function renderAdmin() {
  const store = await Storage.getStore();
  const products = await Storage.getProducts();
  const categories = await Storage.getCategories();
  const reviews = await Storage.getReviews();

  document.getElementById('app').innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="brand">
          <div class="store-logo" style="background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;width:36px;height:36px;border-radius:8px">${store.name.charAt(0)}</div>
          <div>
            <div class="brand-name">${store.name}</div>
            <div class="brand-label">Painel Admin</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <button class="sidebar-link active" data-section="dashboard" onclick="switchSection('dashboard',this)">📊 Dashboard</button>
          <button class="sidebar-link" data-section="store-settings" onclick="switchSection('store-settings',this)">⚙️ Personalização</button>
          <button class="sidebar-link" data-section="products" onclick="switchSection('products',this)">📦 Produtos</button>
          <button class="sidebar-link" data-section="categories" onclick="switchSection('categories',this)">📂 Categorias</button>
          <button class="sidebar-link" data-section="reviews" onclick="switchSection('reviews',this)">⭐ Avaliações</button>
          <button class="sidebar-link" data-section="share" onclick="switchSection('share',this)">🔗 Compartilhar</button>
          <button class="sidebar-link" style="margin-top:auto;color:var(--red)" onclick="adminLogout()">🚪 Sair</button>
        </nav>
      </aside>
      <main class="admin-main">
        <div class="admin-topbar">
          <div>
            <button id="adminMenuToggle" class="menu-toggle" onclick="document.getElementById('adminSidebar').classList.toggle('open')" style="display:none;margin-right:12px">☰</button>
            <h1 id="adminTitle">Dashboard</h1>
          </div>
          <button class="btn-outline" onclick="window.open(window.location.href.split('#')[0] + '?s=' + currentStoreData.slug, '_blank')" style="font-size:13px;padding:8px 16px">👁️ Ver Catálogo</button>
        </div>

        <!-- DASHBOARD -->
        <div class="admin-section active" id="sec-dashboard">
          <div class="stat-grid">
            <div class="stat-card"><div class="label">Produtos</div><div class="value">${products.length}</div></div>
            <div class="stat-card"><div class="label">Categorias</div><div class="value">${categories.length}</div></div>
            <div class="stat-card"><div class="label">Em Destaque</div><div class="value">${products.filter(p=>p.featured).length}</div></div>
            <div class="stat-card"><div class="label">Em Promoção</div><div class="value">${products.filter(p=>p.badge==='promo').length}</div></div>
          </div>
        </div>

        <!-- STORE SETTINGS -->
        <div class="admin-section" id="sec-store-settings">
          <div class="settings-grid">
            <div class="settings-card">
              <h4>Dados da Loja</h4>
              <div class="form-group">
                <label class="form-label">Nome da Loja</label>
                <input class="form-input" id="sStoreName" value="${store.name}">
              </div>
              <div class="form-group">
                <label class="form-label">Slogan</label>
                <input class="form-input" id="sStoreSlogan" value="${store.slogan}">
              </div>
              <div class="form-group">
                <label class="form-label">WhatsApp (com DDD)</label>
                <input class="form-input" id="sStoreWA" value="${store.whatsapp}" placeholder="5511999999999">
              </div>
              <button class="btn-full" onclick="saveStoreSettings()">Salvar Alterações</button>
            </div>
            <div class="settings-card">
              <h4>Logo da Loja</h4>
              <div class="upload-area" onclick="document.getElementById('logoUpload').click()">
                <p>📷 Clique para enviar logo</p>
                ${store.logo ? `<div class="upload-preview"><img src="${store.logo}" alt="Logo"></div>` : ''}
              </div>
              <input type="file" id="logoUpload" class="file-hidden" accept="image/*" onchange="uploadLogo(event)">
            </div>
            <div class="settings-card">
              <h4>Credenciais de Acesso</h4>
              <div class="form-group">
                <label class="form-label">E-mail</label>
                <input class="form-input" id="sStoreEmail" value="${store.email}">
              </div>
              <div class="form-group">
                <label class="form-label">Nova Senha</label>
                <input class="form-input" type="password" id="sStorePass" placeholder="Deixe em branco para manter">
              </div>
              <button class="btn-full" onclick="saveCredentials()">Atualizar Credenciais</button>
            </div>
          </div>
        </div>

        <!-- PRODUCTS -->
        <div class="admin-section" id="sec-products">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
            <p style="color:var(--text-muted);font-size:14px">${products.length} produtos cadastrados</p>
            <button class="btn-primary" onclick="openProductModal()" style="font-size:13px;padding:10px 20px">+ Novo Produto</button>
          </div>
          <div style="overflow-x:auto">
            <table class="admin-table">
              <thead><tr><th>Foto</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
              <tbody id="adminProductList">
                ${products.map(p => `
                  <tr>
                    <td><img src="${p.image}" class="prod-thumb" alt=""></td>
                    <td><strong>${p.name}</strong><br><span style="font-size:12px;color:var(--text-muted)">${p.condition}</span></td>
                    <td>${getCatName(categories, p.category)}</td>
                    <td><strong style="color:var(--green)">R$ ${fmt(p.price)}</strong></td>
                    <td>${p.stock || 0}</td>
                    <td>
                      <button class="btn-sm btn-edit" onclick="openProductModal('${p.id}')">Editar</button>
                      <button class="btn-sm btn-delete" onclick="deleteProduct('${p.id}')">Excluir</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- CATEGORIES -->
        <div class="admin-section" id="sec-categories">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
            <p style="color:var(--text-muted);font-size:14px">${categories.length} categorias</p>
            <button class="btn-primary" onclick="openCategoryModal()" style="font-size:13px;padding:10px 20px">+ Nova Categoria</button>
          </div>
          <div class="settings-grid">
            ${categories.map(c => `
              <div class="settings-card" style="display:flex;align-items:center;justify-content:space-between">
                <div><span style="font-size:20px">${c.icon}</span> <strong>${c.name}</strong></div>
                <button class="btn-sm btn-delete" onclick="deleteCategory('${c.id}')">Remover</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- REVIEWS -->
        <div class="admin-section" id="sec-reviews">
          <div style="margin-bottom:20px">
            <button class="btn-primary" onclick="openReviewModal()" style="font-size:13px;padding:10px 20px">+ Nova Avaliação</button>
          </div>
          <div class="settings-grid">
            ${reviews.map(r => `
              <div class="review-card">
                <div class="review-stars">${'★'.repeat(r.stars)}</div>
                <p class="review-text">"${r.text}"</p>
                <div class="review-author">${r.name}</div>
                <button class="btn-sm btn-delete" style="margin-top:8px" onclick="deleteReview('${r.id}')">Remover</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SHARE -->
        <div class="admin-section" id="sec-share">
          <div class="settings-card" style="max-width:500px">
            <h4>Link do seu Catálogo</h4>
            <div class="form-group">
              <input class="form-input" id="catalogLink" readonly value="${window.location.href.split('#')[0]}" style="font-size:13px">
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('catalogLink').value);showToast('Link copiado! 🔗')" style="font-size:13px;padding:10px 20px">📋 Copiar Link</button>
              <button class="btn-full" style="background:var(--green);max-width:240px;font-size:13px;padding:10px 20px" onclick="shareWhatsAppAdmin()">📲 Enviar no WhatsApp</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- PRODUCT MODAL -->
    <div class="modal-overlay" id="productModal">
      <div class="modal">
        <h3 id="modalTitle">Novo Produto</h3>
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" id="pName">
        </div>
        <div class="form-group">
          <label class="form-label">Categoria</label>
          <select class="form-select" id="pCategory">
            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Preço (R$)</label>
            <input class="form-input" type="number" id="pPrice">
          </div>
          <div class="form-group">
            <label class="form-label">Preço Antigo (R$)</label>
            <input class="form-input" type="number" id="pOldPrice">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Armazenamento</label>
            <input class="form-input" id="pStorage" placeholder="128GB">
          </div>
          <div class="form-group">
            <label class="form-label">Cor</label>
            <input class="form-input" id="pColor" placeholder="Preto">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Condição</label>
            <select class="form-select" id="pCondition">
              <option value="Novo">Novo</option>
              <option value="Seminovo - Grade A">Seminovo - Grade A</option>
              <option value="Seminovo - Grade B">Seminovo - Grade B</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Estoque</label>
            <input class="form-input" type="number" id="pStock" value="1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <textarea class="form-input" id="pDesc" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Imagem</label>
          <div class="upload-area" onclick="document.getElementById('pImageUpload').click()">
            <p>📷 Clique para enviar imagem</p>
            <div class="upload-preview" id="pImagePreview"></div>
          </div>
          <input type="file" id="pImageUpload" class="file-hidden" accept="image/*" onchange="previewProductImage(event)">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Selo</label>
            <select class="form-select" id="pBadge">
              <option value="">Nenhum</option>
              <option value="new">Novo</option>
              <option value="promo">Promoção</option>
              <option value="featured">Destaque</option>
            </select>
          </div>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="pFeatured">
          <label for="pFeatured">Produto em destaque (carrossel)</label>
        </div>
        <div class="modal-actions">
          <button class="btn-outline" onclick="closeModal('productModal')" style="padding:10px 20px;font-size:13px">Cancelar</button>
          <button class="btn-primary" onclick="saveProduct()" style="font-size:13px;padding:10px 20px">Salvar</button>
        </div>
      </div>
    </div>

    <!-- CATEGORY MODAL -->
    <div class="modal-overlay" id="categoryModal">
      <div class="modal">
        <h3>Nova Categoria</h3>
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" id="cName">
        </div>
        <div class="form-group">
          <label class="form-label">Ícone (emoji)</label>
          <input class="form-input" id="cIcon" placeholder="📱" maxlength="4">
        </div>
        <div class="modal-actions">
          <button class="btn-outline" onclick="closeModal('categoryModal')" style="padding:10px 20px;font-size:13px">Cancelar</button>
          <button class="btn-primary" onclick="saveCategory()" style="font-size:13px;padding:10px 20px">Salvar</button>
        </div>
      </div>
    </div>

    <!-- REVIEW MODAL -->
    <div class="modal-overlay" id="reviewModal">
      <div class="modal">
        <h3>Nova Avaliação</h3>
        <div class="form-group">
          <label class="form-label">Nome do Cliente</label>
          <input class="form-input" id="rName">
        </div>
        <div class="form-group">
          <label class="form-label">Estrelas</label>
          <select class="form-select" id="rStars">
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Depoimento</label>
          <textarea class="form-input" id="rText" rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-outline" onclick="closeModal('reviewModal')" style="padding:10px 20px;font-size:13px">Cancelar</button>
          <button class="btn-primary" onclick="saveReview()" style="font-size:13px;padding:10px 20px">Salvar</button>
        </div>
      </div>
    </div>

    <div id="toast" class="toast"></div>
  `;

  // Show mobile menu toggle
  if (window.innerWidth <= 768) {
    document.getElementById('adminMenuToggle')?.style?.setProperty('display', 'block');
  }
}

// ===== ADMIN SECTION SWITCHING =====
function switchSection(section, btn) {
  currentAdminSection = section;
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`sec-${section}`)?.classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  btn?.classList.add('active');
  const titles = { dashboard: 'Dashboard', 'store-settings': 'Personalização', products: 'Produtos', categories: 'Categorias', reviews: 'Avaliações', share: 'Compartilhar' };
  document.getElementById('adminTitle').textContent = titles[section] || 'Dashboard';
}

// ===== STORE SETTINGS =====
async function saveStoreSettings() {
  const store = await Storage.getStore();
  store.name = document.getElementById('sStoreName').value;
  store.slogan = document.getElementById('sStoreSlogan').value;
  store.whatsapp = document.getElementById('sStoreWA').value;
  await Storage.saveStore(store);
  showToast('Configurações salvas! ✅');
}

async function saveCredentials() {
  const store = await Storage.getStore();
  store.email = document.getElementById('sStoreEmail').value;
  const newPass = document.getElementById('sStorePass').value;
  if (newPass) store.password = newPass;
  await Storage.saveStore(store);
  showToast('Credenciais atualizadas! ✅');
}

async function uploadLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const store = await Storage.getStore();
    store.logo = e.target.result;
    await Storage.saveStore(store);
    await renderAdmin();
    showToast('Logo atualizada! ✅');
  };
  reader.readAsDataURL(file);
}

// ===== PRODUCT CRUD =====
let tempProductImage = '';

async function openProductModal(id) {
  editingProductId = id || null;
  tempProductImage = '';
  const modal = document.getElementById('productModal');
  document.getElementById('modalTitle').textContent = id ? 'Editar Produto' : 'Novo Produto';

  if (id) {
    const products = await Storage.getProducts();
    const p = products.find(x => x.id === id);
    if (p) {
      document.getElementById('pName').value = p.name;
      document.getElementById('pCategory').value = p.category_id || p.category;
      document.getElementById('pPrice').value = p.price;
      document.getElementById('pOldPrice').value = p.oldPrice || '';
      document.getElementById('pStorage').value = p.storage || '';
      document.getElementById('pColor').value = p.color || '';
      document.getElementById('pCondition').value = p.condition || 'Novo';
      document.getElementById('pStock').value = p.stock || 0;
      document.getElementById('pDesc').value = p.description || '';
      document.getElementById('pBadge').value = p.badge || '';
      document.getElementById('pFeatured').checked = p.featured || false;
      tempProductImage = p.image;
      document.getElementById('pImagePreview').innerHTML = p.image ? `<img src="${p.image}" alt="">` : '';
    }
  } else {
    ['pName','pPrice','pOldPrice','pStorage','pColor','pDesc'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('pStock').value = '1';
    document.getElementById('pBadge').value = '';
    document.getElementById('pFeatured').checked = false;
    document.getElementById('pImagePreview').innerHTML = '';
  }
  modal.classList.add('show');
}

function previewProductImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    tempProductImage = e.target.result;
    document.getElementById('pImagePreview').innerHTML = `<img src="${e.target.result}" alt="">`;
  };
  reader.readAsDataURL(file);
}

async function saveProduct() {
  const data = {
    id: editingProductId || null,
    name: document.getElementById('pName').value,
    category_id: document.getElementById('pCategory').value,
    price: parseFloat(document.getElementById('pPrice').value) || 0,
    old_price: parseFloat(document.getElementById('pOldPrice').value) || 0,
    storage: document.getElementById('pStorage').value,
    color: document.getElementById('pColor').value,
    condition: document.getElementById('pCondition').value,
    stock: parseInt(document.getElementById('pStock').value) || 0,
    description: document.getElementById('pDesc').value,
    badge: document.getElementById('pBadge').value,
    featured: document.getElementById('pFeatured').checked,
    image: tempProductImage || 'images/iphone-product.png'
  };

  if (!data.name) { showToast('Preencha o nome ❌'); return; }

  await Storage.saveProduct(data);
  closeModal('productModal');
  await renderAdmin();
  showToast(editingProductId ? 'Produto atualizado! ✅' : 'Produto adicionado! ✅');
}

async function deleteProduct(id) {
  if (!confirm('Remover este produto?')) return;
  await Storage.deleteProduct(id);
  await renderAdmin();
  showToast('Produto removido! 🗑️');
}

// ===== CATEGORY CRUD =====
function openCategoryModal() {
  document.getElementById('cName').value = '';
  document.getElementById('cIcon').value = '';
  document.getElementById('categoryModal').classList.add('show');
}

async function saveCategory() {
  const name = document.getElementById('cName').value;
  const icon = document.getElementById('cIcon').value || '📦';
  if (!name) { showToast('Preencha o nome ❌'); return; }
  await Storage.saveCategory({ name, icon });
  closeModal('categoryModal');
  await renderAdmin();
  showToast('Categoria adicionada! ✅');
}

async function deleteCategory(id) {
  if (!confirm('Remover esta categoria?')) return;
  await Storage.deleteCategory(id);
  await renderAdmin();
  showToast('Categoria removida! 🗑️');
}

// ===== REVIEW CRUD =====
function openReviewModal() {
  document.getElementById('rName').value = '';
  document.getElementById('rText').value = '';
  document.getElementById('reviewModal').classList.add('show');
}

async function saveReview() {
  const name = document.getElementById('rName').value;
  const text = document.getElementById('rText').value;
  const stars = parseInt(document.getElementById('rStars').value);
  if (!name || !text) { showToast('Preencha todos os campos ❌'); return; }
  await Storage.saveReview({ name, text, stars, date: 'Agora' });
  closeModal('reviewModal');
  await renderAdmin();
  showToast('Avaliação adicionada! ✅');
}

async function deleteReview(id) {
  if (!confirm('Remover esta avaliação?')) return;
  await Storage.deleteReview(id);
  await renderAdmin();
  showToast('Avaliação removida! 🗑️');
}

// ===== MODAL HELPERS =====
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

function shareWhatsAppAdmin() {
  const url = window.location.href.split('#')[0];
  const msg = encodeURIComponent(`Olá, segue nosso catálogo atualizado: ${url}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function adminLogout() {
  isAdmin = false;
  sessionStorage.removeItem('saas_admin_logged');
  window.location.hash = '';
  renderCatalog();
}
