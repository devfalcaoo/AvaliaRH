/* ============================================================
   auth.js — Login, logout e proteção de páginas
   ============================================================ */


// ------------------------------------------------------------
// RESOLVER CAMINHO DO LOGIN
// Funciona em index.html (raiz) e em pages/ (2 níveis abaixo)
// ------------------------------------------------------------

function resolverCaminhoLogin() {
    const path = window.location.pathname;

    // Se estiver em /frontend/components/pages/
    if (path.includes("/frontend/components/pages/")) {
        return "../../../login.html";
    }
    // Raiz
    return "login.html";
}


// ------------------------------------------------------------
// PROTEÇÃO DE PÁGINA
// Redireciona para login se não houver sessão ativa
// ------------------------------------------------------------

async function protegerPagina() {
    try {
        const { data: { session }, error } = await sb.auth.getSession();

        if (error || !session) {
            window.location.href = resolverCaminhoLogin();
            return null;
        }

        return session;

    } catch (e) {
        console.error("Erro ao verificar sessão:", e);
        window.location.href = resolverCaminhoLogin();
        return null;
    }
}


// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------

async function fazerLogin(email, senha) {
    const { data, error } = await sb.auth.signInWithPassword({
        email,
        password: senha
    });
    if (error) throw new Error(error.message);
    return data;
}


// ------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------

async function fazerLogout() {
    try {
        await sb.auth.signOut();
    } catch (_) {}
    window.location.href = resolverCaminhoLogin();
}


// ------------------------------------------------------------
// OBTER USUÁRIO ATUAL
// ------------------------------------------------------------

async function obterUsuario() {
    const { data: { user }, error } = await sb.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
}


// ------------------------------------------------------------
// EXIBIR E-MAIL NO HEADER
// ------------------------------------------------------------

async function exibirUsuarioHeader() {
    try {
        const user = await obterUsuario();
        const el   = document.getElementById("usuarioHeader");
        if (el && user) el.textContent = user.email;
    } catch (_) {}
}
