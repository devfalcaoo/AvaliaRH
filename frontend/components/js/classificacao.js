/* ============================================================
   classificacao.js — Cálculo de média, classificação e
   salvamento no Supabase
   ============================================================ */

function calcularMedia() {
    const avaliadas = competencias
        .map(c => ({ ...c, nota: Number(c.nota) }))
        .filter(c => Number.isFinite(c.nota) && c.nota > 0);
    const mediaEl   = document.getElementById("media");
    const resultEl  = document.getElementById("resultado");

    if (avaliadas.length === 0) {
        mediaEl.innerText  = "0.0";
        resultEl.innerText = "Não Avaliado";
        resultEl.className = "resultado-valor";
        return;
    }

    const soma  = avaliadas.reduce((t, c) => t + c.nota, 0);
    const media = soma / avaliadas.length;
    mediaEl.innerText = media.toFixed(1);
    definirResultado(media);
}

function definirResultado(media) {
    const resultEl = document.getElementById("resultado");
    let resultado, classe;

    if      (media >= 9.5) { resultado = "Excepcional";        classe = "resultado-excepcional"; }
    else if (media >= 8.5) { resultado = "Excelente";          classe = "resultado-excelente"; }
    else if (media >= 7)   { resultado = "Muito Bom";          classe = "resultado-muito-bom"; }
    else if (media >= 5.5) { resultado = "Bom";                classe = "resultado-bom"; }
    else if (media >= 4)   { resultado = "Regular";            classe = "resultado-regular"; }
    else if (media >= 2.5) { resultado = "Abaixo do Esperado"; classe = "resultado-abaixo-do-esperado"; }
    else                   { resultado = "Crítico";             classe = "resultado-critico"; }

    resultEl.innerText  = resultado;
    resultEl.className  = "resultado-valor " + classe;
}


// ------------------------------------------------------------
// SALVAR AVALIAÇÃO — grava no Supabase e no localStorage
// (localStorage como fallback para o dashboard offline)
// ------------------------------------------------------------

async function salvarAvaliacao() {

    const colaborador = document.getElementById("nome").value.trim();

    if (colaborador === "") {
        alert("Informe o nome do colaborador antes de salvar.");
        return;
    }

    const avaliadas = competencias.filter(c => c.nota > 0);
    if (avaliadas.length === 0) {
        alert("Avalie pelo menos uma competência antes de salvar.");
        return;
    }

    const btn = document.getElementById("btnSalvar");
    if (btn) { btn.textContent = "Salvando..."; btn.disabled = true; }

    const avaliacao = {
        colaborador: colaborador,
        dataHora:    document.getElementById("dataHora").value,
        media:       document.getElementById("media").innerText,
        resultado:   document.getElementById("resultado").innerText,
        observacoes: document.getElementById("observacoes").value.trim()
    };

    const feedbackTexto = window.feedbackIATexto || "";

    try {
        // Salva no Supabase
        await salvarAvaliacaoCompleta(avaliacao, competencias, feedbackTexto);

        alert(`Avaliação de "${colaborador}" salva com sucesso!`);

    } catch (e) {
        alert("Erro ao salvar: " + e.message);
    } finally {
        if (btn) { btn.textContent = "💾 Salvar Avaliação"; btn.disabled = false; }
    }
}
