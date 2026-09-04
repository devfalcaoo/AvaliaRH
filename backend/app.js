// ==========================================================================
// ARQUIVO: backend/app.js
// OBJETIVO: Configurar a aplicação Express, seus middlewares e suas rotas.
// ==========================================================================

const express = require("express");
const cors = require("cors");

// ==========================================================================
// IMPORTAÇÃO DAS ROTAS
// ==========================================================================

const feedbackRoutes = require("./routes/feedbackRoutes");

// ==========================================================================
// CRIAÇÃO DA APLICAÇÃO EXPRESS
// ==========================================================================

const app = express();

// ==========================================================================
// MIDDLEWARES
// ==========================================================================

// Permite requisições do frontend.
app.use(cors());

// Permite receber JSON.
app.use(express.json());

// Permite receber dados enviados por formulários.
app.use(
    express.urlencoded({
        extended: true
    })
);

// ==========================================================================
// ROTA PRINCIPAL
// ==========================================================================

app.get("/", (req, res) => {

    res.status(200).json({
        sucesso: true,
        mensagem: "API do AvaliaRH está funcionando."
    });

});

// ==========================================================================
// ROTA DE SAÚDE
// ==========================================================================

app.get("/api/health", (req, res) => {

    res.status(200).json({
        sucesso: true,
        status: "online",
        mensagem: "Servidor do AvaliaRH funcionando corretamente."
    });

});

// ==========================================================================
// ROTAS DE FEEDBACK COM IA
//
// A rota final será:
//
// POST /api/feedback/gerar
//
// Na Vercel, o /api será tratado pela Function e o Express receberá:
// /feedback/gerar
// ==========================================================================

app.use(
    "/api/feedback",
    feedbackRoutes
);

// ==========================================================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// ==========================================================================

app.use((req, res) => {

    res.status(404).json({
        sucesso: false,
        mensagem: "Rota não encontrada."
    });

});

// ==========================================================================
// TRATAMENTO GLOBAL DE ERROS
// ==========================================================================

app.use((erro, req, res, next) => {

    console.error("==============================================");
    console.error("ERRO INTERNO DO SERVIDOR");
    console.error("==============================================");

    console.error(erro);

    console.error("==============================================");

    res.status(500).json({
        sucesso: false,
        mensagem: "Ocorreu um erro interno no servidor."
    });

});

// ==========================================================================
// EXPORTA A APLICAÇÃO
// ==========================================================================

module.exports = app;