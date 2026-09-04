# Como configurar o Supabase no AvaliaRH

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Dê um nome (ex: `avaliarh`) e defina uma senha para o banco
4. Aguarde o projeto ser criado (~1 min)

---

## 2. Criar as tabelas

1. No painel do projeto, vá em **SQL Editor → New Query**
2. Cole todo o conteúdo do arquivo `SUPABASE_SETUP.sql`
3. Clique em **Run**
4. As 4 tabelas serão criadas: `colaboradores`, `avaliacoes`, `avaliacao_competencias`, `feedbacks_ia`

---

## 3. Pegar as credenciais

1. Vá em **Settings → API**
2. Copie:
   - **Project URL** → ex: `https://xyzxyz.supabase.co`
   - **anon public key** → chave longa começando com `eyJ...`

---

## 4. Colar as credenciais no projeto

Abra o arquivo `frontend/components/js/supabase.js` e substitua:

```js
const SUPABASE_URL = "COLE_SUA_URL_AQUI";
const SUPABASE_KEY = "COLE_SUA_ANON_KEY_AQUI";
```

Por seus dados reais:

```js
const SUPABASE_URL = "https://xyzxyz.supabase.co";
const SUPABASE_KEY = "eyJhbGci...sua_chave_aqui";
```

---

## 5. Configurar autenticação por e-mail

1. Vá em **Authentication → Providers**
2. Confirme que **Email** está ativado
3. Em **Authentication → URL Configuration**, configure:
   - **Site URL**: URL do seu projeto na Vercel (ex: `https://avaliarh.vercel.app`)
   - **Redirect URLs**: adicione também `http://localhost:5500` para desenvolvimento local

> ⚠️ Por padrão o Supabase envia e-mail de confirmação.
> Para desativar (facilita testes): **Authentication → Providers → Email → desativar "Confirm email"**

---

## 6. Na Vercel — variáveis de ambiente (opcional, se usar no backend)

No painel da Vercel, em **Settings → Environment Variables**, adicione:
- `GEMINI_API_KEY` — sua chave do Google Gemini

As credenciais do Supabase ficam **no frontend** (`supabase.js`), não precisam ir para variáveis de ambiente do backend.

---

## Fluxo completo do sistema

```
Usuário acessa login.html
    → Supabase Auth valida e-mail/senha
    → Redireciona para index.html

index.html (avaliação)
    → protegerPagina() verifica sessão
    → Salvar Avaliação → Supabase (avaliacoes + competencias + feedback_ia)

dashboard.html
    → protegerPagina() verifica sessão
    → Lê avaliações do Supabase em tempo real
    → Exibe KPIs, gráficos e histórico

colaboradores.html
    → protegerPagina() verifica sessão
    → CRUD completo de colaboradores no Supabase
```

---

## Tabelas criadas

| Tabela | O que armazena |
|---|---|
| `colaboradores` | Nome, e-mail, cargo e setor de cada colaborador |
| `avaliacoes` | Avaliação principal (colaborador, média, resultado, observações) |
| `avaliacao_competencias` | Nota e comentário de cada competência por avaliação |
| `feedbacks_ia` | Texto do feedback gerado pelo Gemini |

Todas as tabelas têm **Row Level Security (RLS)** ativado — cada gestor só vê seus próprios dados.
