// ===== DATA LAYER - Multi-Store White Label System =====

const DEFAULT_STORE = {
  id: 'demo-store',
  name: 'TechStore Premium',
  slogan: 'O melhor em tecnologia Apple',
  whatsapp: '5511999999999',
  logo: '',
  banner: '',
  email: 'admin@techstore.com',
  password: 'admin123',
  createdAt: new Date().toISOString()
};

const DEFAULT_CATEGORIES = [
  { id: 'iphones-novos', name: 'iPhones Novos', icon: '📱' },
  { id: 'iphones-seminovos', name: 'iPhones Seminovos', icon: '🔄' },
  { id: 'capinhas', name: 'Capinhas', icon: '🛡️' },
  { id: 'carregadores', name: 'Carregadores', icon: '🔌' },
  { id: 'airpods', name: 'AirPods', icon: '🎧' },
  { id: 'smartwatches', name: 'Smartwatches', icon: '⌚' },
  { id: 'acessorios', name: 'Acessórios', icon: '✨' }
];

const DEFAULT_PRODUCTS = [
  {
    id: '1', name: 'iPhone 15 Pro Max', category: 'iphones-novos',
    storage: '256GB', color: 'Titânio Natural', condition: 'Novo',
    price: 8999, oldPrice: 9999, description: 'O iPhone mais poderoso já criado. Chip A17 Pro, câmera de 48MP e design em titânio.',
    image: 'images/iphone-product.png', badge: 'new', featured: true, stock: 12
  },
  {
    id: '2', name: 'iPhone 14 Pro', category: 'iphones-seminovos',
    storage: '128GB', color: 'Roxo Profundo', condition: 'Seminovo - Grade A',
    price: 5499, oldPrice: 7499, description: 'Estado impecável, bateria acima de 90%. Garantia de 6 meses.',
    image: 'images/iphone-product.png', badge: 'promo', featured: true, stock: 5
  },
  {
    id: '3', name: 'AirPods Pro 2ª Geração', category: 'airpods',
    storage: '', color: 'Branco', condition: 'Novo',
    price: 1899, oldPrice: 2299, description: 'Cancelamento ativo de ruído, áudio adaptativo e até 6h de reprodução.',
    image: 'images/airpods-product.png', badge: 'featured', featured: true, stock: 20
  },
  {
    id: '4', name: 'Apple Watch Ultra 2', category: 'smartwatches',
    storage: '', color: 'Titânio', condition: 'Novo',
    price: 5999, oldPrice: 6999, description: 'O relógio mais robusto e capaz da Apple. GPS de dupla frequência e até 36h de bateria.',
    image: 'images/watch-product.png', badge: 'new', featured: false, stock: 8
  },
  {
    id: '5', name: 'Carregador MagSafe', category: 'carregadores',
    storage: '', color: 'Branco', condition: 'Novo',
    price: 399, oldPrice: 499, description: 'Carregamento sem fio magnético de até 15W. Compatível com iPhone 12 ou superior.',
    image: 'images/charger-product.png', badge: '', featured: false, stock: 30
  },
  {
    id: '6', name: 'Capa Clear MagSafe', category: 'capinhas',
    storage: '', color: 'Transparente', condition: 'Novo',
    price: 249, oldPrice: 349, description: 'Proteção premium transparente com anel MagSafe integrado. Anti-amarelamento.',
    image: 'images/case-product.png', badge: '', featured: false, stock: 50
  },
  {
    id: '7', name: 'iPhone 13', category: 'iphones-seminovos',
    storage: '128GB', color: 'Azul', condition: 'Seminovo - Grade A',
    price: 3299, oldPrice: 4999, description: 'Excelente estado, sem marcas de uso. Bateria acima de 85%.',
    image: 'images/iphone-product.png', badge: 'promo', featured: false, stock: 7
  },
  {
    id: '8', name: 'iPhone 15', category: 'iphones-novos',
    storage: '128GB', color: 'Rosa', condition: 'Novo',
    price: 5999, oldPrice: 6499, description: 'Design com Dynamic Island, câmera de 48MP e conector USB-C.',
    image: 'images/iphone-product.png', badge: 'new', featured: true, stock: 15
  }
];

const DEFAULT_REVIEWS = [
  { id: '1', name: 'Maria Silva', stars: 5, text: 'Comprei meu iPhone 15 Pro aqui e estou apaixonada! Entrega super rápida e preço justo. Recomendo demais!', date: '2 dias atrás' },
  { id: '2', name: 'João Santos', stars: 5, text: 'Melhor loja de iPhones da região. Atendimento nota 10 pelo WhatsApp, tiraram todas as minhas dúvidas.', date: '1 semana atrás' },
  { id: '3', name: 'Ana Costa', stars: 4, text: 'Seminovo em estado impecável, parecia novo! Garantia de 6 meses deu tranquilidade na compra.', date: '2 semanas atrás' }
];

// ===== STORAGE MANAGER =====
const Storage = {
  getStore() {
    const data = localStorage.getItem('cp_store');
    return data ? JSON.parse(data) : { ...DEFAULT_STORE };
  },
  saveStore(store) {
    localStorage.setItem('cp_store', JSON.stringify(store));
  },
  getProducts() {
    const data = localStorage.getItem('cp_products');
    return data ? JSON.parse(data) : [...DEFAULT_PRODUCTS];
  },
  saveProducts(products) {
    localStorage.setItem('cp_products', JSON.stringify(products));
  },
  getCategories() {
    const data = localStorage.getItem('cp_categories');
    return data ? JSON.parse(data) : [...DEFAULT_CATEGORIES];
  },
  saveCategories(cats) {
    localStorage.setItem('cp_categories', JSON.stringify(cats));
  },
  getReviews() {
    const data = localStorage.getItem('cp_reviews');
    return data ? JSON.parse(data) : [...DEFAULT_REVIEWS];
  },
  saveReviews(reviews) {
    localStorage.setItem('cp_reviews', JSON.stringify(reviews));
  },
  initDefaults() {
    if (!localStorage.getItem('cp_store')) this.saveStore({ ...DEFAULT_STORE });
    if (!localStorage.getItem('cp_products')) this.saveProducts([...DEFAULT_PRODUCTS]);
    if (!localStorage.getItem('cp_categories')) this.saveCategories([...DEFAULT_CATEGORIES]);
    if (!localStorage.getItem('cp_reviews')) this.saveReviews([...DEFAULT_REVIEWS]);
  }
};
