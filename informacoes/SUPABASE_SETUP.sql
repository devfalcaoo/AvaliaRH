-- ================================================================
-- AvaliaRH — Script de criação das tabelas no Supabase
-- Execute no painel: Supabase > SQL Editor > New Query
-- ================================================================


-- ----------------------------------------------------------------
-- 1. COLABORADORES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS colaboradores (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome        TEXT NOT NULL,
    email       TEXT NOT NULL,
    cargo       TEXT,
    setor       TEXT,
    criado_em   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "colaboradores_proprios" ON colaboradores
    FOR ALL USING (auth.uid() = user_id);


-- ----------------------------------------------------------------
-- 2. AVALIAÇÕES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacoes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    colaborador_id   UUID REFERENCES colaboradores(id) ON DELETE SET NULL,
    colaborador_nome TEXT NOT NULL,
    data_hora        TEXT NOT NULL,
    media            NUMERIC(4,2) NOT NULL DEFAULT 0,
    resultado        TEXT NOT NULL DEFAULT 'Não Avaliado',
    observacoes      TEXT,
    criado_em        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "avaliacoes_proprias" ON avaliacoes
    FOR ALL USING (auth.uid() = user_id);


-- ----------------------------------------------------------------
-- 3. COMPETÊNCIAS DA AVALIAÇÃO
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacao_competencias (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avaliacao_id   UUID REFERENCES avaliacoes(id) ON DELETE CASCADE,
    nome           TEXT NOT NULL,
    nota           INTEGER NOT NULL DEFAULT 0,
    comentario     TEXT,
    criado_em      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE avaliacao_competencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "competencias_via_avaliacao" ON avaliacao_competencias
    FOR ALL USING (
        avaliacao_id IN (
            SELECT id FROM avaliacoes WHERE user_id = auth.uid()
        )
    );


-- ----------------------------------------------------------------
-- 4. FEEDBACKS DA IA
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedbacks_ia (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avaliacao_id   UUID REFERENCES avaliacoes(id) ON DELETE CASCADE UNIQUE,
    texto          TEXT NOT NULL,
    criado_em      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedbacks_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedbacks_via_avaliacao" ON feedbacks_ia
    FOR ALL USING (
        avaliacao_id IN (
            SELECT id FROM avaliacoes WHERE user_id = auth.uid()
        )
    );
