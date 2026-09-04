// ============================================================
// geminiService.js — Comunicação com o Google Gemini
// ============================================================

const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    console.error("ERRO: GEMINI_API_KEY não configurada.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// ------------------------------------------------------------
// GERAR FEEDBACK
// Recebe dadosAvaliacao com o novo modelo (nota + comentario)
// ------------------------------------------------------------

async function gerarFeedbackIA(dadosAvaliacao) {

    const { nome, media, resultado, competencias, observacoes } = dadosAvaliacao;

    if (!competencias || competencias.length === 0) {
        throw new Error("Nenhuma competência informada.");
    }

    // Monta a lista de competências com nota e comentário do gestor
    const listaCompetencias = competencias.map(c => {

        const linhaComentario = c.comentario
            ? `\n  Comentário do gestor: "${c.comentario}"`
            : "";

        return `- ${c.nome}: ${c.nota}/10${linhaComentario}`;

    }).join("\n");


    const prompt = `
Você é um especialista em Recursos Humanos e avaliação de desempenho.

Analise a avaliação abaixo e produza um feedback profissional, construtivo e objetivo.

DADOS DO COLABORADOR:
Nome: ${nome}
Média da avaliação: ${media}/10
Classificação: ${resultado}

COMPETÊNCIAS AVALIADAS:
${listaCompetencias}

OBSERVAÇÕES DO GESTOR:
${observacoes || "Nenhuma observação registrada."}

Produza o feedback com exatamente estas seções:

## Resumo Geral
Visão geral do desempenho do colaborador considerando todas as competências.

## Pontos Fortes
Principais aspectos positivos observados nas notas e comentários.

## Oportunidades de Melhoria
Competências com menor desempenho e como podem ser desenvolvidas.

## Recomendações
Ações práticas e objetivas para o desenvolvimento profissional.

REGRAS:
- Use apenas as informações fornecidas.
- Linguagem profissional e corporativa.
- Seja objetivo e construtivo.
- Sem emojis, sem negrito em Markdown, sem informações inventadas.
`;

    try {

        let response;

        for (let tentativa = 0; tentativa < 3; tentativa++) {
            try {
                response = await ai.models.generateContent({
                    model:    "gemini-3.6-flash",
                    contents: prompt
                });
                break;
            } catch (erro) {
                const podeTentarNovamente = erro.status === 429 || erro.status === 503;
                if (!podeTentarNovamente || tentativa === 2) throw erro;
                await new Promise(resolve => setTimeout(resolve, 800 * (tentativa + 1)));
            }
        }

        const feedback = response.text;

        if (!feedback || feedback.trim() === "") {
            throw new Error("O Gemini retornou uma resposta vazia.");
        }

        return feedback.trim();

    } catch (erro) {

        console.error("Erro com o Gemini:", erro);
        throw new Error("Não foi possível gerar o feedback com a IA.");

    }
}

module.exports = { gerarFeedbackIA };
