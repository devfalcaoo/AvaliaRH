/* ============================================================
   feedbackIA.js — Envia avaliação para o Gemini e exibe feedback
   NÃO usar type="module" — precisa acessar `competencias` global
   ============================================================ */

// URL da API: localhost em dev, relativa na Vercel
const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3001"
        : "";


// ------------------------------------------------------------
// GERAR FEEDBACK
// ------------------------------------------------------------

async function gerarFeedbackIA() {

    const colaborador = document.getElementById("nome").value.trim();
    const media       = document.getElementById("media").innerText.trim();
    const resultado   = document.getElementById("resultado").innerText.trim();
    const observacoes = document.getElementById("observacoes").value.trim();
    const campo       = document.getElementById("feedbackIA");

    if (!colaborador) {
        alert("Informe o nome do colaborador.");
        return;
    }

    const competenciasAvaliadas = Array.isArray(competencias)
        ? competencias.filter(c => Number(c.nota) > 0)
        : [];

    if (competenciasAvaliadas.length === 0) {
        alert("Avalie pelo menos uma competência antes de gerar o feedback.");
        return;
    }

    campo.innerHTML = `<p class="feedback-ia-placeholder">⏳ Gerando feedback da IA...</p>`;

    const competenciasDados = competencias.map(c => ({
        nome:       c.nome,
        nota:       Number(c.nota),
        comentario: c.comentario || ""
    }));

    try {

        const resposta = await fetch(`${API_BASE_URL}/api/feedback/gerar`, {
            method:  "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body:    JSON.stringify({ nome: colaborador, media, resultado, competencias: competenciasDados, observacoes })
        });

        const textoResposta = await resposta.text();

        if (!textoResposta || textoResposta.trim() === "") {
            throw new Error(`Resposta vazia do servidor (HTTP ${resposta.status}).`);
        }

        let dados;
        try { dados = JSON.parse(textoResposta); }
        catch (_) { throw new Error("O servidor não retornou um JSON válido."); }

        if (!resposta.ok || !dados.sucesso) {
            throw new Error(dados.mensagem || "Não foi possível gerar o feedback.");
        }

        window.feedbackIATexto = dados.feedback;
        campo.innerHTML = formatarFeedbackIA(dados.feedback);

    } catch (erro) {
        console.error("Erro ao gerar feedback:", erro);
        window.feedbackIATexto = "";
        campo.innerHTML = `<p class="feedback-ia-placeholder">Nenhum feedback gerado ainda.</p>`;
        alert("Erro ao gerar feedback:\n\n" + erro.message);
    }
}


// ------------------------------------------------------------
// FORMATAR MARKDOWN → HTML
// ------------------------------------------------------------

function formatarFeedbackIA(texto) {
    const linhas = texto.split("\n").map(l => l.trim());
    let html = "", lista = false;
    const fecharLista = () => { if (lista) { html += "</ul>"; lista = false; } };

    linhas.forEach(linha => {
        if (linha === "") return;
        if (linha.startsWith("## ")) { fecharLista(); html += `<h3>${escaparHtml(linha.slice(3))}</h3>`; return; }
        if (linha.startsWith("- ") || linha.startsWith("* ")) {
            if (!lista) { html += "<ul>"; lista = true; }
            html += `<li>${escaparHtml(linha.replace(/^[-*]\s/, ""))}</li>`;
            return;
        }
        fecharLista();
        html += `<p>${escaparHtml(linha)}</p>`;
    });
    fecharLista();
    return html;
}

function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}
