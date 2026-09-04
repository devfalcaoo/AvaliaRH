/* ============================================================
   variaveis.js — Modelo de dados, renderização do accordion
   e funções de CRUD das competências
   ============================================================ */

// ------------------------------------------------------------
// MODELO DE DADOS
// Cada competência tem: id, nome, perguntas[], nota, comentario
// ------------------------------------------------------------

let competencias = [
    {
        id: 1,
        nome: "Comunicação",
        perguntas: [
            "O colaborador se expressa com clareza e objetividade?",
            "Sabe ouvir e considerar opiniões diferentes?",
            "Adapta a linguagem ao público e ao contexto?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 2,
        nome: "Trabalho em Equipe",
        perguntas: [
            "Colabora ativamente com colegas para atingir metas?",
            "Demonstra empatia e respeito nas relações interpessoais?",
            "Contribui para um ambiente de trabalho positivo?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 3,
        nome: "Organização e Planejamento",
        perguntas: [
            "Gerencia bem o próprio tempo e prioridades?",
            "Entrega tarefas dentro dos prazos estabelecidos?",
            "Mantém processos e documentos organizados?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 4,
        nome: "Pontualidade",
        perguntas: [
            "Cumpre horários de entrada e saída conforme estabelecido?",
            "Chega a reuniões e compromissos no horário?",
            "Avisa com antecedência quando há impossibilidade?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 5,
        nome: "Proatividade",
        perguntas: [
            "Identifica problemas e propõe soluções sem ser solicitado?",
            "Busca aprendizado e aprimoramento contínuo?",
            "Toma iniciativa em situações que exigem ação?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 6,
        nome: "Qualidade das Entregas",
        perguntas: [
            "Realiza as tarefas com atenção e precisão?",
            "Revisa o próprio trabalho antes de entregar?",
            "Atende ou supera o padrão de qualidade esperado?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 7,
        nome: "Criatividade e Inovação",
        perguntas: [
            "Apresenta ideias novas para melhorar processos ou resultados?",
            "Enfrenta desafios com pensamento criativo?",
            "Está aberto a experimentar abordagens diferentes?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 8,
        nome: "Pensamento Crítico e Analítico",
        perguntas: [
            "Analisa informações e situações antes de tomar decisões?",
            "Avalia diferentes alternativas antes de escolher uma solução?",
            "Demonstra capacidade de identificar riscos, oportunidades e possíveis melhorias?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 9,
        nome: "Resolução de Problemas",
        perguntas: [
            "Consegue resolver problemas dentro do seu nível de responsabilidade?",
            "Sabe quando é necessário solicitar apoio?",
            "Demonstra capacidade de identificar causas raiz e implementar soluções eficazes?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 10,
        nome: "Resiliência, Flexibilidade e Agilidade",
        perguntas: [
            "Mantém o equilíbrio diante de situações difíceis ou mudanças?",
            "Consegue se adaptar a novas demandas e prioridades?",
            "Demonstra disposição para aprender novas formas de trabalhar?",
            "Consegue ajustar suas atividades com rapidez quando necessário?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 11,
        nome: "Aprendizado Contínuo",
        perguntas: [
            "Demonstra interesse em desenvolver novos conhecimentos e habilidades?",
            "Busca aprender com experiências, erros e feedbacks?",
            "Procura atualizar seus conhecimentos relacionados à sua função?",
            "Demonstra interesse em ampliar suas competências profissionais?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 12,
        nome: "Inteligência Emocional",
        perguntas: [
            "Demonstra consciência emocional e capacidade de gerenciar suas emoções?",
            "Mantém uma postura respeitosa mesmo em situações de conflito?",
            "Consegue lidar com críticas e feedbacks?",
            "Demonstra empatia e compreensão em relação às emoções dos outros?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 13,
        nome: "Autoliderança e Autonomia",
        perguntas: [
            "Demonstra capacidade de liderar-se e tomar decisões de forma independente?",
            "Assume responsabilidade pelas próprias atividades e resultados?",
            "Toma decisões compatíveis com seu nível de responsabilidade?",
            "Demonstra iniciativa para buscar soluções e melhorias sem depender de supervisão constante?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 14,
        nome: "Foco em Resultados e Eficiência Operacional",
        perguntas: [
            "Cumpre os objetivos e metas estabelecidos?",
            "Demonstra preocupação com a melhoria dos resultados da equipe ou empresa?",
            "Mantém a produtividade esperada para sua função?",
            "Busca reduzir desperdícios, retrabalhos e atrasos?"
        ],
        nota: 0,
        comentario: ""
    },
    {
        id: 15,
        nome: "Agilidade de Aprendizagem",
        perguntas: [
            "Aprende novas tarefas e processos com facilidade?",
            "Assimila rapidamente novas informações e orientações?",
            "Adapta-se rapidamente a novos processos e métodos de trabalho?",
            "Demonstra facilidade para aprender novas ferramentas ou sistemas"
        ],
        nota: 0,
        comentario: ""
    }
];

// Próximo ID disponível (para competências adicionadas pelo gestor)
let proximoId = competencias.length + 1;

// Texto do último feedback gerado (usado no PDF)
window.feedbackIATexto = "";


// ------------------------------------------------------------
// DATA E HORA — atualiza a cada segundo
// ------------------------------------------------------------

function atualizarDataHora() {
    document.getElementById("dataHora").value =
        new Date().toLocaleString("pt-BR");
}

atualizarDataHora();
setInterval(atualizarDataHora, 1000);


// ------------------------------------------------------------
// RENDERIZAR ACCORDION
// Reconstrói todo o accordion com base no array competencias[]
// ------------------------------------------------------------

function renderizar() {

    const container = document.getElementById("accordionCompetencias");
    container.innerHTML = "";

    competencias.forEach((comp, index) => {

        const collapseId = `collapse-${comp.id}`;
        const headerId   = `header-${comp.id}`;

        // Monta as perguntas de apoio como lista
        const perguntasHtml = comp.perguntas.map(p =>
            `<li>${p}</li>`
        ).join("");

        // Monta as options do select (1 a 10)
        const optionsHtml = Array.from({ length: 10 }, (_, i) => {
            const val = i + 1;
            return `<option value="${val}" ${comp.nota === val ? "selected" : ""}>${val}</option>`;
        }).join("");

        // Badge de nota no cabeçalho
        const badgeNota = comp.nota > 0
            ? `<span class="badge-nota">${comp.nota}/10</span>`
            : `<span class="badge-nota badge-nota-vazia">—</span>`;

        container.innerHTML += `
        <div class="accordion-item avalia-accordion-item">

            <!-- CABEÇALHO DO ITEM -->
            <h2 class="accordion-header" id="${headerId}">
                <button
                    class="accordion-button avalia-accordion-btn collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#${collapseId}"
                    aria-expanded="false"
                    aria-controls="${collapseId}">

                    <span class="accordion-comp-nome">${comp.nome}</span>
                    ${badgeNota}

                </button>
            </h2>

            <!-- CORPO DO ITEM -->
            <div
                id="${collapseId}"
                class="accordion-collapse collapse"
                aria-labelledby="${headerId}"
                data-bs-parent="#accordionCompetencias">

                <div class="accordion-body avalia-accordion-body">

                    <!-- Perguntas de apoio -->
                    <div class="perguntas-apoio">
                        <p class="perguntas-titulo">Perguntas de apoio para avaliação:</p>
                        <ul class="perguntas-lista">${perguntasHtml}</ul>
                    </div>

                    <!-- Nota e comentário -->
                    <div class="row g-3 mt-1">

                        <div class="col-md-3">
                            <label class="avalia-label">Nota (1 a 10)</label>
                            <select
                                class="avalia-select"
                                onchange="alterarNota(${index}, this.value)">
                                <option value="0" ${comp.nota === 0 ? "selected" : ""}>— Selecione</option>
                                ${optionsHtml}
                            </select>
                        </div>

                        <div class="col-md-9">
                            <label class="avalia-label">Comentário sobre esta competência</label>
                            <textarea
                                class="avalia-textarea"
                                rows="3"
                                placeholder="Descreva observações, exemplos ou justificativa da nota..."
                                oninput="alterarComentario(${index}, this.value)">${comp.comentario}</textarea>
                        </div>

                    </div>

                    <!-- Botão remover -->
                    <div class="mt-3 text-end">
                        <button
                            class="btn-remove"
                            onclick="remover(${index})">
                            Remover competência
                        </button>
                    </div>

                </div>
            </div>
        </div>`;
    });

    calcularMedia();
}


// ------------------------------------------------------------
// ALTERAR NOTA
// ------------------------------------------------------------

function alterarNota(index, valor) {
    competencias[index].nota = Number(valor);
    renderizar();

    // Reabre o accordion que estava aberto (UX)
    const collapseId = `collapse-${competencias[index].id}`;
    const el = document.getElementById(collapseId);
    if (el) new bootstrap.Collapse(el, { show: true });
}


// ------------------------------------------------------------
// ALTERAR COMENTÁRIO
// Atualiza sem re-renderizar (evita perda de foco no textarea)
// ------------------------------------------------------------

function alterarComentario(index, valor) {
    competencias[index].comentario = valor;
}


// ------------------------------------------------------------
// ADICIONAR COMPETÊNCIA
// ------------------------------------------------------------

function adicionarCompetencia() {

    const input = document.getElementById("novaCompetencia");
    const nome  = input.value.trim();

    if (nome === "") {
        alert("Informe o nome da competência.");
        return;
    }

    competencias.push({
        id: proximoId++,
        nome: nome,
        perguntas: [
            "O colaborador demonstra essa competência nas atividades diárias?",
            "Há progresso visível em relação ao período anterior?",
            "De que forma essa competência impacta os resultados da equipe?"
        ],
        nota: 0,
        comentario: ""
    });

    input.value = "";
    renderizar();
}


// ------------------------------------------------------------
// REMOVER COMPETÊNCIA
// ------------------------------------------------------------

function remover(index) {
    if (!confirm("Deseja remover esta competência?")) return;
    competencias.splice(index, 1);
    renderizar();
}




// ------------------------------------------------------------
// INICIALIZAÇÃO — carrega dados salvos (se houver)
// ------------------------------------------------------------

(function inicializar() {

    const salvo = localStorage.getItem("competencias");

    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            // Só restaura se o modelo tiver o campo 'perguntas'
            if (parsed.length > 0 && parsed[0].perguntas) {
                competencias = parsed;
                proximoId = Math.max(...competencias.map(c => c.id)) + 1;
            }
        } catch (_) { /* mantém o padrão */ }
    }

    renderizar();

})();
