const SUPABASE_URL = 'https://lzctkloxpzonuakpdtzi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Y3RrbG94cHpvbnVha3BkdHppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE5MTI2NiwiZXhwIjoyMDkzNzY3MjY2fQ.Xd_7Sh7o0VjId6Crbui5FQIS6Xp-ipZTaXTksRXhOlQ';

// Usando um nome diferente para a instância para evitar conflito com a biblioteca global
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Exportando para o resto do sistema usar
window.supabaseClient = _supabase;
