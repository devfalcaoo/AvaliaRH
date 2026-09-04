// ==========================================================================
// ARQUIVO: controllers/feedbackController.js
// OBJETIVO: Receber os dados enviados pelo frontend e solicitar à IA
//           a geração do feedback.
// ==========================================================================

const geminiService = require("../services/geminiService");

// --------------------------------------------------------------------------
// Gera o feedback da avaliação.
// --------------------------------------------------------------------------

async function gerarFeedback(req, res) {

    try {

        const dadosAvaliacao = req.body;

        // ------------------------------------------------------------------
        // Validação básica.
        // ------------------------------------------------------------------

        if (!dadosAvaliacao.nome) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "O nome do colaborador é obrigatório."
            });

        }

        if (!dadosAvaliacao.competencias ||
            !Array.isArray(dadosAvaliacao.competencias)) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "As competências da avaliação são obrigatórias."
            });

        }

        // ------------------------------------------------------------------
        // Solicita o feedback ao serviço do Gemini.
        // ------------------------------------------------------------------

        const feedback = await geminiService.gerarFeedbackIA(
            dadosAvaliacao
        );

        // ------------------------------------------------------------------
        // Retorna o resultado para o frontend.
        // ------------------------------------------------------------------

        return res.status(200).json({
            sucesso: true,
            feedback: feedback
        });

    } catch (erro) {

        console.error(
            "Erro ao gerar feedback com IA:",
            erro
        );

        return res.status(500).json({
            sucesso: false,
            mensagem: "Não foi possível gerar o feedback com IA."
        });
    }
}

module.exports = {
    gerarFeedback
};