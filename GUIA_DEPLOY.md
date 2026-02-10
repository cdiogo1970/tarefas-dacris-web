# 🚀 Guia de Deploy - Tarefas Cris (Versão Web)

Este guia mostra como publicar o sistema "Tarefas Cris" gratuitamente na internet, sem depender do Manus.

---

## 📋 Visão Geral

O sistema tem 2 partes que precisam ser publicadas:

1. **Frontend** (HTML, CSS, JS) → Vercel ou Netlify (GRÁTIS)
2. **Backend** (API Node.js) → Railway ou Render (GRÁTIS)

---

## 🎯 OPÇÃO 1: Deploy Completo (RECOMENDADO)

### Passo 1: Publicar o Backend (Railway)

**Railway** oferece 500 horas grátis por mês - suficiente para uso pessoal!

#### 1.1. Criar conta no Railway

1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub

#### 1.2. Preparar o projeto

Primeiro, vamos criar os arquivos necessários:

```bash
cd /home/ubuntu/tarefas-cris-web
```

Crie o arquivo `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Crie o arquivo `.gitignore`:
```
node_modules/
.env
*.log
```

#### 1.3. Subir para o GitHub

```bash
cd /home/ubuntu/tarefas-cris-web
git init
git add .
git commit -m "Initial commit - Tarefas Cris"

# Crie um repositório no GitHub (https://github.com/new)
# Depois execute:
git remote add origin https://github.com/SEU_USUARIO/tarefas-cris.git
git branch -M main
git push -u origin main
```

#### 1.4. Deploy no Railway

1. No Railway, clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório `tarefas-cris`
4. Railway detectará automaticamente o Node.js
5. Aguarde o deploy (2-3 minutos)
6. Copie a URL gerada (ex: `https://tarefas-cris-production.up.railway.app`)

#### 1.5. Configurar Variáveis de Ambiente

No Railway:
1. Vá em "Variables"
2. Adicione:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `sua-chave-secreta-aqui` (gere uma aleatória)

### Passo 2: Publicar o Frontend (Vercel)

**Vercel** é 100% gratuito para projetos pessoais!

#### 2.1. Criar conta na Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Faça login com GitHub

#### 2.2. Preparar o Frontend

Crie o arquivo `vercel.json` na pasta `public`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### 2.3. Atualizar URLs da API

Edite `public/src/js/auth.js` e `public/src/js/app.js`:

```javascript
// Substitua a linha:
const API_URL = 'https://3001-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer/api';

// Por:
const API_URL = 'https://SEU-BACKEND.up.railway.app/api';
```

#### 2.4. Deploy na Vercel

**Opção A: Via GitHub** (Recomendado)
1. Faça commit das alterações:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```
2. Na Vercel, clique em "New Project"
3. Importe o repositório do GitHub
4. Configure:
   - **Root Directory**: `public`
   - **Framework Preset**: Other
5. Clique em "Deploy"
6. Aguarde 1-2 minutos

**Opção B: Via CLI**
```bash
npm install -g vercel
cd /home/ubuntu/tarefas-cris-web/public
vercel --prod
```

#### 2.5. Pegar a URL Final

A Vercel gerará uma URL tipo:
- `https://tarefas-cris.vercel.app`

Você pode configurar um domínio personalizado depois!

### Passo 3: Configurar CORS no Backend

Edite `server/index.js` e atualize o CORS:

```javascript
app.use(cors({
    origin: [
        'https://tarefas-cris.vercel.app', // Sua URL da Vercel
        'http://localhost:8080'
    ],
    credentials: true
}));
```

Faça commit e push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

O Railway fará redeploy automaticamente!

---

## 🎯 OPÇÃO 2: Deploy Simplificado (Apenas Frontend)

Se você quiser apenas testar sem backend, pode usar **LocalStorage** para salvar dados no navegador.

### Modificar para usar LocalStorage

Edite `public/src/js/app.js` e substitua todas as chamadas de API por:

```javascript
// Salvar tarefas
localStorage.setItem('tasks', JSON.stringify(tasks));

// Carregar tarefas
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
```

Depois faça deploy apenas do frontend na Vercel (sem backend).

**Limitação**: Os dados ficam apenas no navegador local, não sincronizam entre dispositivos.

---

## 🎯 OPÇÃO 3: Alternativas Gratuitas

### Backend Alternativo: Render.com

1. Acesse: https://render.com
2. Crie conta gratuita
3. "New Web Service"
4. Conecte o GitHub
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
6. Deploy!

**Limitação**: Render gratuito "dorme" após 15 min de inatividade (demora 30s para acordar).

### Frontend Alternativo: Netlify

1. Acesse: https://netlify.com
2. Arraste a pasta `public` para o site
3. Pronto! URL gerada instantaneamente

---

## 📦 Arquivos Necessários para Deploy

Vou criar todos os arquivos de configuração necessários agora:

### 1. `package.json` (raiz do projeto)

```json
{
  "name": "tarefas-cris-web",
  "version": "1.0.0",
  "description": "Sistema de gerenciamento de tarefas diárias",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  },
  "keywords": ["tarefas", "notas", "organização"],
  "author": "Cristina",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. `.gitignore`

```
node_modules/
.env
*.log
.DS_Store
```

### 3. `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 4. `public/vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🔐 Segurança para Produção

### Gerar JWT Secret Seguro

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use o resultado como `JWT_SECRET` no Railway.

### Adicionar HTTPS

Tanto Vercel quanto Railway fornecem HTTPS automaticamente! ✅

---

## 🗄️ Banco de Dados (Opcional)

Para dados persistentes, adicione um banco de dados:

### Opção 1: Railway PostgreSQL (GRÁTIS)

1. No Railway, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Copie as credenciais
4. Instale o driver:
   ```bash
   npm install pg
   ```
5. Atualize `server/index.js` para usar PostgreSQL

### Opção 2: Supabase (GRÁTIS)

1. Acesse: https://supabase.com
2. Crie um projeto
3. Use a API REST deles
4. 500 MB grátis + autenticação incluída!

---

## 📊 Resumo de Custos

| Serviço | Plano Gratuito | Limitações |
|---------|----------------|------------|
| **Vercel** | Ilimitado | 100 GB bandwidth/mês |
| **Railway** | 500h/mês | ~$5 de crédito/mês |
| **Netlify** | Ilimitado | 100 GB bandwidth/mês |
| **Render** | Ilimitado | Dorme após 15 min |
| **Supabase** | 500 MB | 2 projetos ativos |

**Conclusão**: Você pode hospedar **100% GRÁTIS** para sempre!

---

## 🚀 Checklist de Deploy

- [ ] Criar conta no Railway
- [ ] Criar conta na Vercel
- [ ] Criar repositório no GitHub
- [ ] Adicionar arquivos de configuração
- [ ] Fazer commit e push
- [ ] Deploy do backend no Railway
- [ ] Configurar variáveis de ambiente
- [ ] Atualizar URL da API no frontend
- [ ] Deploy do frontend na Vercel
- [ ] Atualizar CORS no backend
- [ ] Testar login e criação de tarefas
- [ ] Configurar domínio personalizado (opcional)

---

## 🎯 URLs Finais

Depois do deploy, você terá:

**Frontend**: `https://tarefas-cris.vercel.app`  
**Backend**: `https://tarefas-cris-production.up.railway.app`

Compartilhe a URL do frontend com quem quiser! 🎉

---

## 🆘 Problemas Comuns

### Erro: "Cannot connect to API"

**Solução**: Verifique se a URL da API no frontend está correta.

### Erro: "CORS blocked"

**Solução**: Adicione a URL da Vercel no CORS do backend.

### Backend não inicia no Railway

**Solução**: Verifique os logs no Railway. Pode ser falta de `package.json` ou `PORT` errado.

### Frontend mostra página em branco

**Solução**: Verifique o console do navegador (F12). Pode ser caminho errado dos arquivos.

---

## 📞 Próximos Passos

1. **Domínio Personalizado** (Opcional)
   - Compre um domínio (ex: `tarefascris.com.br`)
   - Configure na Vercel (gratuito)

2. **Banco de Dados Real**
   - Adicione PostgreSQL do Railway
   - Migre de memória para DB

3. **Funcionalidades Extras**
   - Notificações web
   - Compartilhamento de tarefas
   - Backup automático

---

**Boa sorte com o deploy! 🚀**

Se tiver dúvidas, consulte a documentação:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Netlify: https://docs.netlify.com
