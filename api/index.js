// ==========================================================================
// ARQUIVO: api/index.js
// OBJETIVO: Ponto de entrada da Serverless Function na Vercel.
//
// Na Vercel, o server.js nunca é executado — apenas este arquivo.
// Por isso, o dotenv precisa ser carregado aqui, antes do app.
// ==========================================================================

require("dotenv").config();

const app = require("../backend/app");

// ==========================================================================
// EXPORTA A APLICAÇÃO EXPRESS
// ==========================================================================

module.exports = app;
