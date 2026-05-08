// ===== CATALOG APP - Main Application Logic =====

let currentCategory = 'todos';
let carouselIndex = 0;
let isAdmin = false;
let editingProductId = null;
let currentAdminSection = 'dashboard';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  Storage.initDefaults();
  
  // Identificar a loja primeiro
  const store = await Storage.identifyStore();
  
  if (!store) {
    renderError('Loja não encontrada ou link inválido. Verifique o endereço.');
    return;
  }

  setTimeout(() => {
    document.querySelector('.loading-screen')?.classList.add('hidden');
  }, 1200);
  
  checkRoute();
  initScrollAnimations();
});

async function checkRoute() {
  const hash = window.location.hash;
  if (hash === '#admin' || hash === '#admin-login') {
    showAdminLogin();
  } else {
    await renderCatalog();
  }
}

window.addEventListener('hashchange', checkRoute);

// ===== RENDER CATALOG =====
async function renderCatalog() {
  const store = await Storage.getStore();
  const products = await Storage.getProducts();
  const categories = await Storage.getCategories();
  const reviews = await Storage.getReviews();
  const featured = products.filter(p => p.featured);
  const whatsappLink = `https://wa.me/${store.whatsapp}`;

  document.getElementById('app').innerHTML = `
    <div class="catalog-page">
      <!-- HEADER -->
      <header class="header" id="mainHeader">
        <div class="header-inner">
          <div class="store-brand">
            ${store.logo ? `<img src="${store.logo}" class="store-logo" alt="Logo">` : `<div class="store-logo" style="background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px">${store.name.charAt(0)}</div>`}
            <div>
              <div class="store-name">${store.name}</div>
              <div class="store-slogan">${store.slogan}</div>
            </div>
          </div>
          <nav class="nav-links">
            <a href="#produtos">Produtos</a>
            <a href="#categorias">Categorias</a>
            <a href="#avaliacoes">Avaliações</a>
          </nav>
          <button class="btn-whatsapp-header" onclick="window.open('${whatsappLink}','_blank')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>Falar no WhatsApp</span>
          </button>
          <button class="menu-toggle" onclick="toggleMobileNav()">☰</button>
        </div>
      </header>

      <!-- MOBILE NAV -->
      <div class="mobile-nav" id="mobileNav">
        <button class="close-nav" onclick="toggleMobileNav()">✕</button>
        <a href="#produtos" onclick="toggleMobileNav()">Produtos</a>
        <a href="#categorias" onclick="toggleMobileNav()">Categorias</a>
        <a href="#avaliacoes" onclick="toggleMobileNav()">Avaliações</a>
        <a href="${whatsappLink}" target="_blank">WhatsApp</a>
      </div>

      <!-- HERO -->
      <section class="hero">
        <div class="hero-content fade-up">
          <div class="hero-badge"><span class="dot"></span> Catálogo Atualizado</div>
          <h1>Descubra o melhor da <span class="gradient-text">Apple</span></h1>
          <p>${store.slogan}. Produtos originais com garantia, entrega rápida e os melhores preços.</p>
          <div class="hero-buttons">
            <button class="btn-primary" onclick="window.open('${whatsappLink}','_blank')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Falar no WhatsApp
            </button>
            <button class="btn-outline" onclick="document.getElementById('produtos').scrollIntoView({behavior:'smooth'})">
              Ver Produtos
            </button>
          </div>
        </div>
      </section>

      <!-- FEATURED CAROUSEL -->
      ${featured.length > 0 ? `
      <section class="section">
        <div class="section-header fade-up">
          <div class="section-label">✨ Destaques</div>
          <h2 class="section-title">Produtos em Destaque</h2>
        </div>
        <div class="carousel-wrapper fade-up">
          <div class="carousel-track" id="carouselTrack">
            ${featured.map(p => `
              <div class="carousel-slide">
                <img src="${p.image}" alt="${p.name}" class="carousel-slide-img">
                <div class="carousel-slide-info">
                  <div class="product-category">${getCatName(categories, p.category)}</div>
                  <h3>${p.name}</h3>
                  <p>${p.description}</p>
                  <div class="product-price-row">
                    ${p.oldPrice ? `<span class="product-old-price">R$ ${fmt(p.oldPrice)}</span>` : ''}
                    <span class="product-price">R$ ${fmt(p.price)}</span>
                  </div>
                  <button class="btn-primary" onclick="buyProduct('${p.name}', '${store.whatsapp}')">
                    Comprar no WhatsApp
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
          ${featured.length > 1 ? `
            <button class="carousel-nav carousel-prev" onclick="moveCarousel(-1)">‹</button>
            <button class="carousel-nav carousel-next" onclick="moveCarousel(1)">›</button>
          ` : ''}
        </div>
        ${featured.length > 1 ? `
        <div class="carousel-dots" id="carouselDots">
          ${featured.map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>`).join('')}
        </div>
        ` : ''}
      </section>
      ` : ''}

      <!-- PRODUCTS -->
      <section class="section" id="produtos">
        <div class="section-header fade-up">
          <div class="section-label">📱 Catálogo</div>
          <h2 class="section-title">Nossos Produtos</h2>
          <p class="section-desc">Encontre o produto perfeito para você</p>
        </div>
        <div class="category-tabs fade-up" id="categorias">
          <button class="cat-tab active" onclick="filterCategory('todos', this)">Todos</button>
          ${categories.map(c => `<button class="cat-tab" onclick="filterCategory('${c.id}', this)">${c.icon} ${c.name}</button>`).join('')}
        </div>
        <div class="products-grid fade-up" id="productsGrid">
          ${renderProductCards(products, categories, store.whatsapp)}
        </div>
      </section>

      <!-- REVIEWS -->
      <section class="section" id="avaliacoes">
        <div class="section-header fade-up">
          <div class="section-label">⭐ Avaliações</div>
          <h2 class="section-title">O que nossos clientes dizem</h2>
        </div>
        <div class="reviews-grid fade-up">
          ${reviews.map(r => `
            <div class="review-card">
              <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
              <p class="review-text">"${r.text}"</p>
              <div class="review-author">${r.name}</div>
              <div class="review-date">${r.date}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <p>${store.name} &copy; ${new Date().getFullYear()} &mdash; Todos os direitos reservados</p>
        <p style="margin-top:8px"><a href="#admin-login">Área do Lojista</a></p>
      </footer>

      <!-- FLOATING BUTTONS -->
      <button class="floating-whatsapp" onclick="window.open('${whatsappLink}','_blank')" title="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>

      <div class="share-bar">
        <button class="share-btn" onclick="shareCatalog()">🔗 Compartilhar</button>
        <button class="share-btn" onclick="shareWhatsApp()">📲 Enviar no WhatsApp</button>
      </div>
    </div>
    <div id="toast" class="toast"></div>
  `;
  initScrollAnimations();
}

function renderProductCards(products, categories, whatsapp) {
  return products.map(p => `
    <div class="product-card" data-category="${p.category}">
      ${p.badge === 'new' ? '<span class="product-badge badge-new">Novo</span>' : ''}
      ${p.badge === 'promo' ? '<span class="product-badge badge-promo">Promoção</span>' : ''}
      ${p.badge === 'featured' ? '<span class="product-badge badge-featured">Destaque</span>' : ''}
      <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
      <div class="product-info">
        <div class="product-category">${getCatName(categories, p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-specs">${[p.storage, p.color, p.condition].filter(Boolean).join(' • ')}</div>
        <div class="product-price-row">
          ${p.oldPrice ? `<span class="product-old-price">R$ ${fmt(p.oldPrice)}</span>` : ''}
          <span class="product-price">R$ ${fmt(p.price)}</span>
        </div>
        <button class="btn-buy" onclick="buyProduct('${p.name.replace(/'/g, "\\'")}', '${whatsapp}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Comprar no WhatsApp
        </button>
      </div>
    </div>
  `).join('');
}

// ===== HELPERS =====
function fmt(n) { return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 }); }
function getCatName(cats, id) { return cats.find(c => c.id === id)?.name || id; }

function buyProduct(name, whatsapp) {
  const msg = encodeURIComponent(`Olá, tenho interesse no ${name}`);
  window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank');
}

function shareCatalog() {
  const url = window.location.href.split('#')[0];
  navigator.clipboard?.writeText(url).then(() => showToast('Link copiado! 🔗'));
}

function shareWhatsApp() {
  const store = Storage.getStore();
  const url = window.location.href.split('#')[0];
  const msg = encodeURIComponent(`Olá, segue nosso catálogo atualizado: ${url}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== CATEGORY FILTER =====
function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.style.display = (cat === 'todos' || card.dataset.category === cat) ? '' : 'none';
  });
}

// ===== CAROUSEL =====
function moveCarousel(dir) {
  const featured = Storage.getProducts().filter(p => p.featured);
  carouselIndex = (carouselIndex + dir + featured.length) % featured.length;
  updateCarousel();
}
function goToSlide(i) { carouselIndex = i; updateCarousel(); }
function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  if (track) track.style.transform = `translateX(-${carouselIndex * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
}

// ===== MOBILE NAV =====
function toggleMobileNav() { document.getElementById('mobileNav')?.classList.toggle('open'); }

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
// ===== ERROR HANDLING =====
function renderError(msg) {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;background:var(--bg);color:white;font-family:sans-serif;">
      <div>
        <h1 style="font-size:48px;margin-bottom:10px">⚠️</h1>
        <h2>Oops!</h2>
        <p style="color:var(--text-muted);margin:15px 0 30px">${msg}</p>
        <a href="https://wa.me/5511999999999" target="_blank" class="btn-primary" style="text-decoration:none">Falar com Suporte</a>
      </div>
    </div>
  `;
}
