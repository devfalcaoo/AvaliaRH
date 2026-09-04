/* ============================================================
   dashboard.js — Lê avaliações do Supabase e renderiza KPIs,
   gráficos e histórico
   ============================================================ */


// ------------------------------------------------------------
// BUSCAR AVALIAÇÕES DO SUPABASE
// ------------------------------------------------------------

async function obterHistorico() {
    const { data, error } = await sb
        .from("avaliacoes")
        .select(`
            *,
            avaliacao_competencias (*),
            feedbacks_ia (texto)
        `)
        .order("criado_em", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}


// ------------------------------------------------------------
// HELPERS DE CÁLCULO
// ------------------------------------------------------------

function mediaGeral(historico) {
    if (!historico.length) return "0.0";
    const soma = historico.reduce((acc, a) => acc + Number(a.media || 0), 0);
    return (soma / historico.length).toFixed(1);
}

function avaliacoesDoMes(historico) {
    const agora = new Date();
    return historico.filter(a => {
        const d = new Date(a.criado_em);
        return d.getMonth() === agora.getMonth() &&
               d.getFullYear() === agora.getFullYear();
    }).length;
}

function resultadoMaisFrequente(historico) {
    if (!historico.length) return "—";
    const mapa = {};
    historico.forEach(a => {
        const r = a.resultado || "Não Avaliado";
        mapa[r] = (mapa[r] || 0) + 1;
    });
    return Object.entries(mapa).sort((a, b) => b[1] - a[1])[0][0];
}

function distribuicaoResultados(historico) {
    const mapa = {};
    historico.forEach(a => {
        const r = a.resultado || "Não Avaliado";
        mapa[r] = (mapa[r] || 0) + 1;
    });
    return Object.entries(mapa).map(([nome, qtd]) => ({ nome, qtd }));
}

function mediaPorCompetencia(historico) {
    const mapa = {};
    historico.forEach(a => {
        (a.avaliacao_competencias || []).forEach(c => {
            const nota = Number(c.nota);
            if (nota > 0) {
                if (!mapa[c.nome]) mapa[c.nome] = { soma: 0, qtd: 0 };
                mapa[c.nome].soma += nota;
                mapa[c.nome].qtd  += 1;
            }
        });
    });
    return Object.entries(mapa)
        .map(([nome, v]) => ({ nome, media: v.soma / v.qtd }))
        .sort((a, b) => b.media - a.media);
}


// ------------------------------------------------------------
// RENDERIZAÇÃO
// ------------------------------------------------------------

function renderBarras(containerId, itens, getLabel, getValue, maxValue) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!itens.length) {
        container.innerHTML = `<p class="sem-dados">Sem dados ainda.</p>`;
        return;
    }

    container.innerHTML = itens.map(item => {
        const label = getLabel(item);
        const value = getValue(item);
        const pct   = maxValue ? Math.round((value / maxValue) * 100) : 0;
        return `
        <div class="bar-row">
            <span title="${label}">${label}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <strong>${typeof value === "number" ? value.toFixed(1) : value}</strong>
        </div>`;
    }).join("");
}

function renderUltimas(historico) {
    const container = document.getElementById("ultimasAvaliacoes");
    if (!container) return;

    if (!historico.length) {
        container.innerHTML = `<p class="sem-dados">Nenhuma avaliação salva ainda.<br>
            Faça uma avaliação e clique em "Salvar Avaliação".</p>`;
        return;
    }

    container.innerHTML = historico.slice(0, 8).map(a => {

        // Formata data do Supabase (ISO) para pt-BR
        const data = a.criado_em
            ? new Date(a.criado_em).toLocaleString("pt-BR")
            : a.data_hora || "";

        // Badge de resultado
        const classeRes = {
            "Excepcional":        "badge-excepcional",
            "Excelente":          "badge-excelente",
            "Muito Bom":          "badge-muito-bom",
            "Bom":                "badge-bom",
            "Regular":            "badge-regular",
            "Abaixo do Esperado": "badge-abaixo",
            "Crítico":            "badge-critico"
        }[a.resultado] || "";

        return `
        <div class="lista-dash-item">
            <div>
                <strong>${a.colaborador_nome || "—"}</strong>
                <div class="lista-dash-meta">${data}</div>
            </div>
            <div class="text-end">
                <strong style="color:var(--azul-medio)">${a.media ?? "—"}/10</strong>
                <div class="lista-dash-meta">${a.resultado || ""}</div>
            </div>
            <button class="btn-excluir-aval" onclick="excluirAv('${a.id}')">🗑</button>
        </div>`;
    }).join("");
}


// ------------------------------------------------------------
// EXCLUIR AVALIAÇÃO
// ------------------------------------------------------------

async function excluirAv(id) {
    if (!confirm("Excluir esta avaliação? Esta ação não pode ser desfeita.")) return;
    try {
        await excluirAvaliacao(id);
        await carregarDashboard();
    } catch(e) {
        alert("Erro ao excluir: " + e.message);
    }
}


// ------------------------------------------------------------
// CARREGAR DASHBOARD
// ------------------------------------------------------------

async function carregarDashboard() {

    // Mostrar loading nos KPIs
    ["kpiTotal","kpiMedia","kpiMes","kpiResultado"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "...";
    });

    try {

        const historico = await obterHistorico();

        // KPIs
        document.getElementById("kpiTotal").textContent     = historico.length;
        document.getElementById("kpiMedia").textContent     = mediaGeral(historico);
        document.getElementById("kpiMes").textContent       = avaliacoesDoMes(historico);
        document.getElementById("kpiResultado").textContent = resultadoMaisFrequente(historico);

        // Distribuição de resultados
        const dist    = distribuicaoResultados(historico);
        const maxDist = Math.max(...dist.map(i => i.qtd), 1);
        renderBarras("distribuicao", dist, i => i.nome, i => i.qtd, maxDist);

        // Média por competência
        const comps   = mediaPorCompetencia(historico);
        const maxComp = Math.max(...comps.map(c => c.media), 1);
        renderBarras("mediaCompetencias", comps, i => i.nome, i => i.media, maxComp);

        // Últimas avaliações
        renderUltimas(historico);

    } catch(e) {
        console.error("Erro ao carregar dashboard:", e);
        document.getElementById("kpiTotal").textContent = "Erro";
        const ul = document.getElementById("ultimasAvaliacoes");
        if (ul) ul.innerHTML = `<p class="sem-dados">Erro ao conectar com o banco: ${e.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", carregarDashboard);
