# Como rodar o AvaliaRH localmente

## 1. Instalar dependências (primeira vez)

```bash
cd AvaliaRH-V3
npm install
```

## 2. Iniciar o backend

Abra um terminal e rode:

```bash
cd AvaliaRH-V3
npm run dev
```

Ou sem o nodemon:

```bash
node backend/server.js
```

Você deve ver no terminal:
```
==============================================
       AvaliaRH - Backend iniciado
==============================================
Servidor: http://localhost:3001
API:      http://localhost:3001/api
==============================================
```

## 3. Abrir o frontend

Com o Live Server do VS Code, abra o arquivo `index.html`.

**⚠️ O backend PRECISA estar rodando antes de clicar em "Gerar Feedback IA".**

## Verificar se o backend está online

Acesse no navegador: http://localhost:3001/api/health

Deve retornar:
```json
{ "sucesso": true, "status": "online" }
```

## Problemas comuns

| Erro | Causa | Solução |
|---|---|---|
| `Failed to load localhost:3001` | Backend não está rodando | Rodar `npm run dev` no terminal |
| `Rota não encontrada` | Backend rodando mas rota errada | Verificar se vê a mensagem de início no terminal |
| `GEMINI_API_KEY não configurada` | .env não encontrado | Confirmar que `backend/.env` existe com a chave |
