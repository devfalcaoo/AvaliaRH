/* ============================================================
   supabase.js — Inicialização do cliente Supabase
   Carregado antes de todos os outros scripts
   ============================================================ */

// CDN do Supabase (carregado no HTML antes deste arquivo)
const { createClient } = supabase;

// Credenciais do projeto — altere com os seus dados do Supabase
const SUPABASE_URL  = "https://pnobvoqwjlkecfhenzkq.supabase.co";
const SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBub2J2b3F3amxrZWNmaGVuemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzc2NDEsImV4cCI6MjEwMjY1MzY0MX0.6Lpy2_F9Mob-jDcCUr51CcuhwmZAZ-3HNf9PamaEl1A";

// Cliente global usado em todos os módulos
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// Deixa disponível globalmente se outras páginas usam
window.sb = sb;