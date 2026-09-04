/* ============================================================
   db.js — Funções de acesso ao banco de dados (Supabase)
   Substitui o localStorage para avaliações e colaboradores
   ============================================================ */


// ============================================================
// COLABORADORES
// ============================================================

async function salvarColaborador(dados) {

    const user = await obterUsuario();

    const { data, error } = await sb
        .from("colaboradores")
        .insert({
            user_id: user.id,
            nome:    dados.nome,
            email:   dados.email,
            cargo:   dados.cargo  || null,
            setor:   dados.setor  || null
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function listarColaboradores() {

    const { data, error } = await sb
        .from("colaboradores")
        .select("*")
        .order("nome");

    if (error) throw new Error(error.message);
    return data || [];
}

async function editarColaborador(id, dados) {

    const { data, error } = await sb
        .from("colaboradores")
        .update({
            nome:  dados.nome,
            email: dados.email,
            cargo: dados.cargo || null,
            setor: dados.setor || null
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function excluirColaborador(id) {

    const { error } = await sb
        .from("colaboradores")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}


// ============================================================
// AVALIAÇÕES
// ============================================================

async function salvarAvaliacaoCompleta(avaliacao, competencias, feedbackTexto) {

    const user = await obterUsuario();

    // 1. Salvar avaliação principal
    const { data: av, error: erroAv } = await sb
        .from("avaliacoes")
        .insert({
            user_id:          user.id,
            colaborador_nome: avaliacao.colaborador,
            data_hora:        avaliacao.dataHora,
            media:            parseFloat(avaliacao.media) || 0,
            resultado:        avaliacao.resultado,
            observacoes:      avaliacao.observacoes || null
        })
        .select()
        .single();

    if (erroAv) throw new Error(erroAv.message);

    // 2. Salvar competências vinculadas
    if (competencias && competencias.length > 0) {

        const linhas = competencias.map(c => ({
            avaliacao_id: av.id,
            nome:         c.nome,
            nota:         Number(c.nota) || 0,
            comentario:   c.comentario || null
        }));

        const { error: erroComp } = await sb
            .from("avaliacao_competencias")
            .insert(linhas);

        if (erroComp) throw new Error(erroComp.message);
    }

    // 3. Salvar feedback da IA (se existir)
    if (feedbackTexto && feedbackTexto.trim() !== "") {

        const { error: erroFb } = await sb
            .from("feedbacks_ia")
            .insert({
                avaliacao_id: av.id,
                texto:        feedbackTexto.trim()
            });

        if (erroFb) throw new Error(erroFb.message);
    }

    return av;
}

async function listarAvaliacoes() {

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

async function excluirAvaliacao(id) {

    const { error } = await sb
        .from("avaliacoes")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}
