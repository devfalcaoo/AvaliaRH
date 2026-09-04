// ==========================================================================
// ARQUIVO: routes/feedbackRoutes.js
// OBJETIVO: Definir as rotas relacionadas ao feedback por IA.
// ==========================================================================

const express = require("express");

const router = express.Router();

const feedbackController = require(
    "../controllers/feedbackController"
);

// --------------------------------------------------------------------------
// POST /api/feedback/gerar
// --------------------------------------------------------------------------

router.post(
    "/gerar",
    feedbackController.gerarFeedback
);

module.exports = router;