// ===== DATA LAYER - Supabase Multi-Store SaaS Integration =====

let currentStoreId = null;
let currentStoreData = null;

const Storage = {
  // Identificar a loja pelo slug na URL (?s=slug)
  async identifyStore() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s') || params.get('slug');
    
    if (!slug) {
      // Se não houver slug, podemos redirecionar para uma landing page ou mostrar erro
      console.error('Nenhuma loja identificada na URL');
      return null;
    }

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (error || !data) {
      console.error('Loja não encontrada ou inativa');
      return null;
    }

    currentStoreId = data.id;
    currentStoreData = data;
    return data;
  },

  async getStore() {
    if (currentStoreData) return currentStoreData;
    return await this.identifyStore();
  },

  async saveStore(store) {
    const { data, error } = await supabase
      .from('stores')
      .update(store)
      .eq('id', currentStoreId);
    if (error) throw error;
    currentStoreData = { ...currentStoreData, ...store };
    return data;
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', currentStoreId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async saveProduct(product) {
    product.store_id = currentStoreId;
    if (product.id && product.id.length > 20) { // UUID check
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id);
      if (error) throw error;
      return data;
    } else {
      delete product.id; // Let Supabase generate UUID
      const { data, error } = await supabase
        .from('products')
        .insert([product]);
      if (error) throw error;
      return data;
    }
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', currentStoreId);
    if (error) return [];
    return data;
  },

  async saveCategory(cat) {
    cat.store_id = currentStoreId;
    const { data, error } = await supabase
      .from('categories')
      .insert([cat]);
    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('store_id', currentStoreId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async saveReview(review) {
    review.store_id = currentStoreId;
    const { data, error } = await supabase
      .from('reviews')
      .insert([review]);
    if (error) throw error;
    return data;
  },

  async deleteReview(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Método legado para evitar erros de inicialização, mas não faz nada agora
  initDefaults() {
    console.log('Sistema migrado para Supabase. Ignorando LocalStorage.');
  }
};
