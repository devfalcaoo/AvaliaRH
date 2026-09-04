// ==========================================================================
// ARQUIVO: backend/server.js
// OBJETIVO: Inicializar o servidor Express do sistema AvaliaRH,
//           carregar as variáveis de ambiente e disponibilizar as rotas.
// ==========================================================================

const path = require("path");
const dotenv = require("dotenv");

// ==========================================================================
// CARREGA AS VARIÁVEIS DO ARQUIVO .env
//
// O arquivo .env deve estar dentro da pasta backend:
//
// backend/
// ├── .env
// ├── server.js
// ├── app.js
// ├── controllers/
// ├── routes/
// └── services/
//
// Depois desta chamada, as variáveis poderão ser acessadas através de:
// process.env.NOME_DA_VARIAVEL
// ==========================================================================

// Carrega o .env sempre da pasta backend/, independente de onde o processo for iniciado
dotenv.config({ path: path.join(__dirname, ".env") });

// ==========================================================================
// VERIFICA SE A CHAVE DO GEMINI FOI CONFIGURADA
// ==========================================================================

if (!process.env.GEMINI_API_KEY) {

    console.error("==============================================");
    console.error("ERRO DE CONFIGURAÇÃO");
    console.error("==============================================");
    console.error(
        "A variável GEMINI_API_KEY não foi encontrada."
    );
    console.error(
        "Verifique se o arquivo backend/.env existe e contém:"
    );
    console.error("");
    console.error("");
    console.error("");
    console.error("O servidor não será iniciado.");
    console.error("==============================================");

    process.exit(1);
}

// ==========================================================================
// IMPORTA A APLICAÇÃO EXPRESS
//
// O app.js é responsável por configurar o Express, middlewares e rotas.
// ==========================================================================

const app = require("./app");

// ==========================================================================
// CONFIGURAÇÕES
// ==========================================================================

const PORT = process.env.PORT || 3001;

// ==========================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================================================

app.listen(PORT, () => {

    console.log("==============================================");
    console.log("       AvaliaRH - Backend iniciado");
    console.log("==============================================");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`API:      http://localhost:${PORT}/api`);
    console.log(`Health:   http://localhost:${PORT}/api/health`);
    console.log(
        `Feedback: http://localhost:${PORT}/api/feedback/gerar`
    );
    console.log("==============================================");
    console.log("Variáveis de ambiente carregadas.");
    console.log("Google Gemini configurado.");
    console.log("==============================================");

});