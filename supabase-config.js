const SUPABASE_URL = 'https://lzctkloxpzonuakpdtzi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Y3RrbG94cHpvbnVha3BkdHppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE5MTI2NiwiZXhwIjoyMDkzNzY3MjY2fQ.Xd_7Sh7o0VjId6Crbui5FQIS6Xp-ipZTaXTksRXhOlQ';

let supabaseClient;

try {
  // Inicializa o cliente se a biblioteca global 'supabase' existir
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.supabaseClient = supabaseClient;
    console.log('Supabase configurado com sucesso! ✅');
  } else {
    console.error('Biblioteca Supabase não encontrada! ❌');
  }
} catch (e) {
  console.error('Erro ao inicializar Supabase:', e);
}
