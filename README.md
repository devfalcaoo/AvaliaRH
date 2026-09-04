# AvaliaRH

Sistema web de **avaliação de desempenho e competências**, desenvolvido
para apoiar gestores e profissionais de Recursos Humanos na avaliação de
colaboradores e na geração de feedback profissional com **Inteligência
Artificial**.

O projeto combina uma interface web simples com um **backend em
Node.js/Express**, responsável pela comunicação segura com a API do
**Google Gemini**. Também permite gerar um relatório da avaliação em
PDF.

------------------------------------------------------------------------

## 📌 Visão geral

O AvaliaRH permite realizar uma avaliação de competências de forma
prática, registrando:

-   Nome do colaborador;
-   Data e hora da avaliação;
-   Competências avaliadas;
-   Notas de 1 a 5;
-   Média final;
-   Classificação do desempenho;
-   Observações do gestor;
-   Feedback gerado por Inteligência Artificial;
-   Relatório da avaliação em PDF.

As competências podem ser adicionadas e removidas dinamicamente, e os
dados das competências e da última avaliação são mantidos localmente no
navegador por meio do `localStorage`.

------------------------------------------------------------------------

## 🎯 Objetivo do projeto

O objetivo do AvaliaRH é demonstrar uma solução web para **avaliação de
desempenho de colaboradores**, incorporando Inteligência Artificial ao
processo de feedback.

A aplicação foi estruturada separando responsabilidades entre
**frontend**, **backend**, **rotas**, **controller** e **service**,
permitindo que o projeto seja evoluído posteriormente para uma solução
corporativa mais completa.

------------------------------------------------------------------------

## ✨ Funcionalidades

### Avaliação de competências

-   Cadastro do nome do colaborador;
-   Registro automático da data e hora;
-   Lista inicial de competências;
-   Adição de novas competências;
-   Exclusão de competências;
-   Seleção de notas de 1 a 5;
-   Cálculo automático da média;
-   Classificação automática do desempenho.

### Classificação

A classificação é determinada de acordo com a média das competências que
receberam nota:

          Média Classificação
  ------------- ---------------
    `4,5 – 5,0` Excelente
    `3,5 – 4,4` Muito Bom
    `2,5 – 3,4` Bom
    `1,5 – 2,4` Regular
    `0,0 – 1,4` Crítico

> Competências com nota `0` são consideradas não avaliadas e não entram
> no cálculo da média.

### Feedback com Inteligência Artificial

O sistema envia os dados da avaliação para o backend, que utiliza a API
do **Google Gemini** para produzir um feedback profissional.

O feedback possui quatro seções:

``` text
## Resumo Geral
## Pontos Fortes
## Oportunidades de Melhoria
## Recomendações
```

O frontend também realiza uma formatação básica do retorno da IA antes
de apresentá-lo ao usuário.

### Geração de PDF

É possível gerar um relatório em PDF contendo:

-   Dados do colaborador;
-   Data e hora;
-   Competências e respectivas notas;
-   Média final;
-   Resultado da avaliação;
-   Observações do gestor;
-   Feedback gerado pela IA;
-   Campo para assinatura do gestor;
-   Rodapé de identificação do documento.

------------------------------------------------------------------------

## 🧰 Tecnologias utilizadas

### Frontend

-   **HTML5**
-   **CSS3**
-   **JavaScript**
-   **Bootstrap 5.3.3**
-   **jsPDF 2.5.1**
-   **localStorage**

### Backend

-   **Node.js**
-   **Express 4**
-   **CORS**
-   **dotenv**
-   **Google GenAI SDK (`@google/genai`)**
-   **Nodemon** para desenvolvimento

### Inteligência Artificial

-   **Google Gemini**
-   Modelo configurado atualmente no backend: `gemini-flash-latest`

------------------------------------------------------------------------

## 📁 Estrutura do projeto

``` text
AvaliaRH/
│
├── backend/
│   ├── controllers/
│   │   └── feedbackController.js
│   │
│   ├── routes/
│   │   └── feedbackRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js
│   │
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── components/
│   │   ├── classificacao.js
│   │   ├── feedbackIA.js
│   │   ├── geracaoPDF.js
│   │   └── variaveis.js
│   │
│   └── style.css
│
├── index.html
├── .gitignore
└── README.md
```

> A pasta `node_modules/` não deve ser versionada. Ela é criada
> novamente através do `npm install`.

------------------------------------------------------------------------

## 🧩 Arquitetura

A comunicação para geração do feedback segue o fluxo:

``` text
┌─────────────────────┐
│      Frontend       │
│     index.html      │
│   JavaScript/CSS    │
└──────────┬──────────┘
           │
           │ POST /api/feedback/gerar
           ▼
┌─────────────────────┐
│       Express       │
│       app.js        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Routes        │
│ feedbackRoutes.js   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Controller      │
│feedbackController.js│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Service       │
│  geminiService.js   │
└──────────┬──────────┘
           │
           │ API Key protegida no .env
           ▼
┌─────────────────────┐
│    Google Gemini    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Frontend       │
│ Exibição do feedback│
└─────────────────────┘
```

Essa separação evita que a chave da API do Gemini seja colocada
diretamente no código JavaScript enviado ao navegador.

------------------------------------------------------------------------

## 📄 Responsabilidade dos principais arquivos

### `index.html`

Página principal da aplicação.

Responsável pela interface da avaliação e pelo carregamento das
bibliotecas e scripts do frontend.

### `frontend/components/variaveis.js`

Gerencia as competências e seus respectivos dados.

Responsabilidades principais:

-   Inicializar competências;
-   Recuperar competências do `localStorage`;
-   Atualizar data e hora;
-   Renderizar a tabela;
-   Adicionar competências;
-   Remover competências;
-   Alterar notas;
-   Persistir competências no navegador.

Competências iniciais:

``` text
Comunicação
Trabalho em Equipe
Organização
```

### `frontend/components/classificacao.js`

Implementa as regras da avaliação.

Responsável por:

-   Calcular a média;
-   Determinar a classificação;
-   Salvar a última avaliação;
-   Recuperar a última avaliação salva.

### `frontend/components/feedbackIA.js`

Responsável pela comunicação do frontend com o endpoint:

``` text
POST http://localhost:3001/api/feedback/gerar
```

Também:

-   Valida os dados básicos;
-   Envia competências, notas, média e observações;
-   Exibe o estado de carregamento;
-   Recebe o feedback do backend;
-   Formata o conteúdo retornado pela IA;
-   Escapa o HTML retornado para evitar interpretação indevida de
    conteúdo como código;
-   Mantém o texto original para utilização no PDF.

### `frontend/components/geracaoPDF.js`

Utiliza o `jsPDF` para criar o documento da avaliação e realizar o
download do relatório.

### `frontend/style.css`

Contém a estilização visual da aplicação, incluindo os componentes da
avaliação, resultados e área de feedback.

### `backend/server.js`

Ponto de entrada do backend.

Responsável por:

-   Carregar variáveis de ambiente;
-   Validar a existência da `GEMINI_API_KEY`;
-   Importar a aplicação Express;
-   Iniciar o servidor.

### `backend/app.js`

Configura o Express e seus middlewares.

Atualmente utiliza:

-   CORS;
-   `express.json()`;
-   `express.urlencoded()`;
-   Rotas da API;
-   Tratamento de rota não encontrada;
-   Tratamento global de erros.

### `backend/routes/feedbackRoutes.js`

Define as rotas relacionadas à geração de feedback.

Atualmente existe:

``` http
POST /api/feedback/gerar
```

### `backend/controllers/feedbackController.js`

Recebe e valida os dados enviados pelo frontend e solicita a geração do
feedback ao serviço do Gemini.

### `backend/services/geminiService.js`

Centraliza a integração com o Google Gemini.

É neste serviço que:

-   O cliente do Gemini é inicializado;
-   Os dados da avaliação são transformados em prompt;
-   A solicitação é enviada ao modelo;
-   O texto do feedback é retornado ao controller.

------------------------------------------------------------------------

## 🚀 Como executar o projeto

### Pré-requisitos

Instale:

-   **Node.js 18 ou superior**;
-   **npm**;
-   Um navegador moderno;
-   Uma chave válida da API do Google Gemini.

Você pode verificar o Node.js com:

``` bash
node --version
```

E o npm com:

``` bash
npm --version
```

------------------------------------------------------------------------

## 1. Clonar o repositório

``` bash
git clone URL_DO_SEU_REPOSITORIO
```

Entre na pasta:

``` bash
cd AvaliaRH
```

------------------------------------------------------------------------

## 2. Configurar o backend

Entre na pasta:

``` bash
cd backend
```

Instale as dependências:

``` bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

### Windows CMD

``` cmd
copy .env.example .env
```

### PowerShell

``` powershell
Copy-Item .env.example .env
```

### Linux/macOS

``` bash
cp .env.example .env
```

Depois, edite `backend/.env`:

``` env
GEMINI_API_KEY=sua_chave_do_gemini
PORT=3001
```

**Nunca publique o arquivo `.env`.** Ele está incluído no `.gitignore`
justamente para impedir o envio de credenciais ao Git.

------------------------------------------------------------------------

## 3. Iniciar o backend

Dentro da pasta `backend`:

### Desenvolvimento

``` bash
npm run dev
```

### Produção

``` bash
npm start
```

O backend será iniciado, por padrão, em:

``` text
http://localhost:3001
```

------------------------------------------------------------------------

## 4. Verificar a API

Abra no navegador:

``` text
http://localhost:3001/api
```

Deve ser retornado um JSON indicando que a API está funcionando.

Também existe o endpoint de saúde:

``` text
http://localhost:3001/api/health
```

------------------------------------------------------------------------

## 5. Executar o frontend

O frontend é uma aplicação estática. Recomenda-se servi-lo por um
servidor HTTP local.

Na raiz do projeto, por exemplo:

``` bash
npx http-server .
```

Depois acesse o endereço informado pelo servidor.

Também é possível utilizar a extensão **Live Server** do Visual Studio
Code.

> O backend precisa estar rodando na porta `3001`, pois o frontend
> atualmente realiza a chamada para
> `http://localhost:3001/api/feedback/gerar`.

------------------------------------------------------------------------

## 🔌 API

### `GET /api`

Verifica se a API principal está funcionando.

Resposta esperada:

``` json
{
  "sucesso": true,
  "mensagem": "API do AvaliaRH está funcionando."
}
```

### `GET /api/health`

Endpoint de saúde da aplicação.

Resposta esperada:

``` json
{
  "sucesso": true,
  "status": "online",
  "mensagem": "Servidor do AvaliaRH funcionando corretamente."
}
```

### `POST /api/feedback/gerar`

Gera um feedback utilizando o Google Gemini.

Exemplo de requisição:

``` json
{
  "nome": "Maria da Silva",
  "media": "4.3",
  "resultado": "Muito Bom",
  "competencias": [
    {
      "nome": "Comunicação",
      "nota": 5
    },
    {
      "nome": "Trabalho em Equipe",
      "nota": 4
    },
    {
      "nome": "Organização",
      "nota": 4
    }
  ],
  "observacoes": "Apresenta boa comunicação e colaboração com a equipe."
}
```

Resposta de sucesso:

``` json
{
  "sucesso": true,
  "feedback": "..."
}
```

------------------------------------------------------------------------

## 💾 Armazenamento local

O frontend utiliza o `localStorage` do navegador.

Principais chaves utilizadas:

``` text
competencias
ultimaAvaliacao
```

Isso significa que os dados da avaliação são armazenados localmente no
navegador e **não existe atualmente um banco de dados** no projeto.

Consequentemente:

-   Os dados não são sincronizados entre computadores;
-   Limpar os dados do navegador pode apagar as informações locais;
-   Outro navegador não terá acesso às avaliações armazenadas;
-   O sistema ainda não possui histórico centralizado de avaliações.

------------------------------------------------------------------------

## 🔐 Segurança

A integração atual com o Gemini foi estruturada para manter a chave da
API no backend:

``` text
Frontend → Backend → Google Gemini
```

A variável deve ser armazenada em:

``` text
backend/.env
```

E nunca diretamente no JavaScript do frontend.

### ⚠️ Chave de API exposta anteriormente

Durante o desenvolvimento deste projeto, uma chave da API do Google
Gemini chegou a ser inserida no código/histórico do Git e o **GitHub
Push Protection bloqueou o envio do repositório**.

A solução aplicada foi remover o segredo do código e recriar o histórico
do repositório antes do novo `push`.

Mesmo após a limpeza do histórico, **uma chave que já foi exposta deve
ser considerada comprometida**. Recomenda-se revogar a chave antiga no
Google Cloud e utilizar uma nova exclusivamente no `backend/.env`.

> O README não contém e não deve conter nenhuma chave real.

### Recomendações para produção

Antes de utilizar o sistema em ambiente corporativo, recomenda-se
implementar:

-   Autenticação de usuários;
-   Controle de acesso por perfil;
-   Restrição do CORS às origens autorizadas;
-   Validação mais rigorosa dos dados recebidos;
-   Rate limiting;
-   Logs e auditoria;
-   Banco de dados;
-   Proteção de dados pessoais;
-   Adequação à LGPD;
-   Gerenciamento seguro de segredos;
-   HTTPS;
-   Controle de tamanho e conteúdo das requisições;
-   Monitoramento da API.

------------------------------------------------------------------------

## ⚠️ Pontos de atenção atuais

### Caminho do CSS

O `index.html` atualmente referencia:

``` html
<link rel="stylesheet" href="style.css">
```

Enquanto o arquivo está localizado em:

``` text
frontend/style.css
```

Se o frontend for executado exatamente com a estrutura atual do
repositório, o caminho recomendado é:

``` html
<link rel="stylesheet" href="./frontend/style.css">
```

### URL do backend no frontend

O endpoint está definido diretamente em
`frontend/components/feedbackIA.js`:

``` text
http://localhost:3001/api/feedback/gerar
```

Para ambientes diferentes de desenvolvimento, recomenda-se centralizar
essa URL em uma configuração apropriada.

### CORS

O backend utiliza atualmente:

``` javascript
app.use(cors());
```

Isso permite requisições de qualquer origem. Em produção, o ideal é
restringir as origens autorizadas.

------------------------------------------------------------------------

## 🛣️ Próximas evoluções

O projeto pode ser expandido para se tornar uma plataforma completa de
gestão de desempenho.

### Funcionalidades de RH

-   Cadastro de colaboradores;
-   Cadastro de gestores;
-   Cadastro de cargos;
-   Cadastro de departamentos;
-   Cadastro de equipes;
-   Cadastro de competências;
-   Histórico de avaliações;
-   Ciclos de avaliação;
-   Dashboard de indicadores;
-   Relatórios gerenciais;
-   Plano de Desenvolvimento Individual (PDI).

### Infraestrutura

-   Banco de dados;
-   Autenticação;
-   Autorização por perfil;
-   API REST completa;
-   Deploy do backend;
-   Deploy do frontend;
-   Variáveis de ambiente por ambiente;
-   Monitoramento e logs.

### Inteligência Artificial

-   Feedback personalizado por competência;
-   Sugestões de desenvolvimento;
-   Identificação de padrões de desempenho;
-   Recomendações de treinamentos;
-   Resumos gerenciais;
-   Análise histórica das avaliações.

------------------------------------------------------------------------

## 🧪 Testes manuais básicos

Depois de iniciar o projeto, recomenda-se verificar:

1.  A página principal abre corretamente;
2.  A data e hora são atualizadas;
3.  É possível adicionar uma competência;
4.  É possível excluir uma competência;
5.  É possível alterar uma nota;
6.  A média é recalculada automaticamente;
7.  A classificação muda conforme a média;
8.  A última avaliação é recuperada após recarregar a página;
9.  O backend responde em `/api/health`;
10. O botão **Gerar Feedback IA** recebe uma resposta do backend;
11. O feedback é exibido corretamente;
12. O botão **Baixar PDF** gera o relatório.

------------------------------------------------------------------------

## 📜 Scripts do backend

Dentro de `backend/`:

  Comando         Função
  --------------- -------------------------------
  `npm install`   Instala as dependências
  `npm run dev`   Inicia o servidor com Nodemon
  `npm start`     Inicia o servidor com Node.js

------------------------------------------------------------------------

## 📄 Licença

O projeto atualmente utiliza a licença `ISC`, conforme definido no
`package.json` do backend.

------------------------------------------------------------------------

## 👩‍💻 Projeto

**AvaliaRH --- Sistema de Avaliação de Desempenho e Competências**

Projeto desenvolvido como uma aplicação web para avaliação de
colaboradores, geração de feedback profissional com IA e emissão de
relatórios em PDF.
