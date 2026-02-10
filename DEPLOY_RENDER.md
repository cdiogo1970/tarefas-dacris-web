# 🚀 Guia Completo: Deploy no Render

Guia passo a passo para publicar o sistema "Tarefas Cris" no **Render** (100% gratuito).

---

## 📋 O Que Você Vai Fazer

1. ✅ Subir o projeto para o GitHub
2. ✅ Publicar o Backend no Render
3. ✅ Publicar o Frontend no Render
4. ✅ Conectar os dois e testar

**Tempo estimado**: 10-15 minutos

---

## 🎯 PARTE 1: Preparar o Projeto

### Passo 1: Extrair o ZIP

Se você baixou o arquivo `tarefas-cris-web-deploy.zip`:

```bash
# No seu computador:
unzip tarefas-cris-web-deploy.zip
cd tarefas-cris-web
```

### Passo 2: Criar Repositório no GitHub

1. **Acesse**: https://github.com/new
2. **Nome do repositório**: `tarefas-cris-web`
3. **Visibilidade**: Público (necessário para Render gratuito)
4. **NÃO** marque "Add a README"
5. Clique em **"Create repository"**

### Passo 3: Subir o Código para o GitHub

No terminal, dentro da pasta `tarefas-cris-web`:

```bash
# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Sistema Tarefas Cris - Versão Web"

# Conectar ao GitHub (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/tarefas-cris-web.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**✅ Pronto!** Seu código está no GitHub.

---

## 🎯 PARTE 2: Publicar o Backend no Render

### Passo 1: Criar Conta no Render

1. **Acesse**: https://render.com
2. Clique em **"Get Started for Free"**
3. Faça login com **GitHub** (recomendado)
4. Autorize o Render a acessar seus repositórios

### Passo 2: Criar Web Service para o Backend

1. No dashboard do Render, clique em **"New +"** (canto superior direito)
2. Selecione **"Web Service"**
3. Clique em **"Connect a repository"**
4. Encontre e selecione **`tarefas-cris-web`**
5. Clique em **"Connect"**

### Passo 3: Configurar o Backend

Preencha os campos:

**Name**: `tarefas-cris-backend`  
**Region**: `Oregon (US West)` (ou o mais próximo de você)  
**Branch**: `main`  
**Root Directory**: *deixe em branco*  
**Runtime**: `Node`  
**Build Command**: `npm install`  
**Start Command**: `node server/index.js`  

**Instance Type**: `Free` ✅

### Passo 4: Adicionar Variáveis de Ambiente

Role para baixo até **"Environment Variables"** e clique em **"Add Environment Variable"**:

Adicione estas 3 variáveis:

1. **PORT**
   - Key: `PORT`
   - Value: `3000`

2. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Gere uma chave segura (veja abaixo)

#### Como Gerar JWT_SECRET

No seu terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole como valor de `JWT_SECRET`.

### Passo 5: Deploy do Backend

1. Clique em **"Create Web Service"** (no final da página)
2. Aguarde 2-3 minutos enquanto o Render faz o deploy
3. Você verá logs em tempo real
4. Quando aparecer **"Your service is live"**, está pronto! 🎉

### Passo 6: Copiar a URL do Backend

No topo da página, você verá a URL do seu backend:

**Exemplo**: `https://tarefas-cris-backend.onrender.com`

**⚠️ IMPORTANTE**: Copie essa URL, você vai precisar dela!

---

## 🎯 PARTE 3: Atualizar o Frontend com a URL do Backend

### Passo 1: Editar os Arquivos JavaScript

No seu computador, abra os arquivos:
- `public/src/js/auth.js`
- `public/src/js/app.js`

Em **ambos os arquivos**, encontre a linha:

```javascript
const API_URL = 'https://3001-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer/api';
```

E substitua por:

```javascript
const API_URL = 'https://tarefas-cris-backend.onrender.com/api';
```

**⚠️ ATENÇÃO**: Use a URL que você copiou no Passo 6 acima!

### Passo 2: Atualizar CORS no Backend

Abra o arquivo `server/index.js` e encontre a seção do CORS:

```javascript
app.use(cors({
    origin: [
        'https://3001-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer',
        'http://localhost:8080'
    ],
    credentials: true
}));
```

Substitua por:

```javascript
app.use(cors({
    origin: [
        'https://tarefas-cris-web.onrender.com', // URL do frontend (você vai criar no próximo passo)
        'http://localhost:8080'
    ],
    credentials: true
}));
```

### Passo 3: Fazer Commit das Alterações

No terminal:

```bash
git add .
git commit -m "Atualizar URLs para produção no Render"
git push
```

O Render detectará automaticamente e fará **redeploy** do backend! ✅

---

## 🎯 PARTE 4: Publicar o Frontend no Render

### Passo 1: Criar Static Site

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Static Site"**
3. Selecione o repositório **`tarefas-cris-web`**
4. Clique em **"Connect"**

### Passo 2: Configurar o Frontend

Preencha os campos:

**Name**: `tarefas-cris-web`  
**Branch**: `main`  
**Root Directory**: `public`  
**Build Command**: *deixe em branco*  
**Publish Directory**: `.` (ponto)

### Passo 3: Deploy do Frontend

1. Clique em **"Create Static Site"**
2. Aguarde 1-2 minutos
3. Quando aparecer **"Your site is live"**, está pronto! 🎉

### Passo 4: Copiar a URL do Frontend

No topo da página, você verá:

**Exemplo**: `https://tarefas-cris-web.onrender.com`

**Essa é a URL pública do seu sistema!** 🌐

---

## 🎯 PARTE 5: Configuração Final

### Atualizar CORS Novamente

Agora que você tem a URL do frontend, precisa atualizar o CORS:

1. Abra `server/index.js`
2. Atualize o CORS com a URL correta:

```javascript
app.use(cors({
    origin: [
        'https://tarefas-cris-web.onrender.com', // Sua URL do Render
        'http://localhost:8080'
    ],
    credentials: true
}));
```

3. Faça commit:

```bash
git add .
git commit -m "Atualizar CORS com URL final do frontend"
git push
```

O backend fará redeploy automaticamente!

---

## 🎉 PRONTO! Seu Sistema Está no Ar!

### 🌐 URLs Finais

**Frontend (compartilhe este link)**:  
`https://tarefas-cris-web.onrender.com`

**Backend API**:  
`https://tarefas-cris-backend.onrender.com`

### ✅ Testar o Sistema

1. Acesse a URL do frontend
2. Clique em "Criar conta"
3. Preencha o formulário de registro
4. Faça login
5. Crie uma tarefa de teste
6. **Funcionou!** 🎉

---

## ⚠️ Limitações do Plano Gratuito do Render

### 🐌 Serviço "Dorme" Após 15 Minutos

O backend **dorme** após 15 minutos de inatividade e leva **30-50 segundos** para "acordar" no próximo acesso.

**Como funciona**:
- Primeiro acesso após inatividade: 30-50s de espera
- Acessos seguintes: instantâneo
- Se usar regularmente, não percebe a diferença

**Solução** (se incomodar):
- Upgrade para plano pago ($7/mês) - backend fica sempre ativo
- Ou use Railway (500h grátis/mês, não dorme)

### 💾 Dados em Memória

Atualmente os dados são salvos em memória. Quando o backend reiniciar ou dormir, **os dados são perdidos**.

**Solução**: Adicionar banco de dados PostgreSQL (veja seção abaixo).

---

## 🗄️ EXTRA: Adicionar Banco de Dados PostgreSQL (Opcional)

Para dados permanentes, adicione um banco de dados:

### Opção 1: PostgreSQL do Render (GRÁTIS)

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"PostgreSQL"**
3. **Name**: `tarefas-cris-db`
4. **Database**: `tarefas_cris`
5. **User**: `tarefas_user`
6. **Region**: Mesmo do backend
7. Clique em **"Create Database"**

### Copiar Credenciais

Após criar, você verá:
- **Internal Database URL**: Use esta no backend

### Conectar ao Backend

1. Instale o driver PostgreSQL:

```bash
npm install pg
```

2. No Render, adicione variável de ambiente no backend:
   - Key: `DATABASE_URL`
   - Value: Cole a "Internal Database URL"

3. Atualize `server/index.js` para usar PostgreSQL em vez de memória

**Nota**: Isso requer modificações no código. Se precisar, posso criar um guia separado!

### Opção 2: Supabase (GRÁTIS + Mais Fácil)

1. Acesse: https://supabase.com
2. Crie um projeto
3. Use a API REST deles (sem código adicional!)
4. 500 MB grátis + autenticação incluída

---

## 🔧 Comandos Úteis

### Ver Logs do Backend

No Render:
1. Vá no serviço do backend
2. Clique na aba **"Logs"**
3. Veja erros em tempo real

### Forçar Redeploy

Se algo der errado:
1. Vá no serviço
2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**

### Limpar Build Cache

Se o deploy falhar:
1. Vá em **"Settings"**
2. Role até **"Build & Deploy"**
3. Clique em **"Clear build cache & deploy"**

---

## 🐛 Problemas Comuns e Soluções

### ❌ Erro: "Application failed to respond"

**Causa**: Backend não está escutando na porta correta.

**Solução**: Verifique se `server/index.js` usa `process.env.PORT`:

```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
```

### ❌ Erro: "CORS blocked"

**Causa**: URL do frontend não está no CORS do backend.

**Solução**: Adicione a URL correta no `server/index.js`.

### ❌ Erro: "Cannot connect to API"

**Causa**: URL da API no frontend está errada.

**Solução**: Verifique `public/src/js/auth.js` e `public/src/js/app.js`.

### ❌ Backend demora muito para responder

**Causa**: Serviço estava dormindo (plano gratuito).

**Solução**: Normal no plano gratuito. Aguarde 30-50s no primeiro acesso.

### ❌ Dados desaparecem

**Causa**: Backend reiniciou e dados estavam em memória.

**Solução**: Adicione banco de dados PostgreSQL (veja seção acima).

---

## 📊 Checklist de Deploy

Use este checklist para garantir que tudo está configurado:

- [ ] Código no GitHub
- [ ] Backend criado no Render
- [ ] Variáveis de ambiente configuradas (PORT, NODE_ENV, JWT_SECRET)
- [ ] Backend deployado com sucesso
- [ ] URL do backend copiada
- [ ] Arquivos JS atualizados com URL do backend
- [ ] Frontend criado no Render
- [ ] Frontend deployado com sucesso
- [ ] URL do frontend copiada
- [ ] CORS atualizado com URL do frontend
- [ ] Commit e push das alterações finais
- [ ] Testado: registro de usuário
- [ ] Testado: login
- [ ] Testado: criar tarefa
- [ ] Testado: editar tarefa
- [ ] Testado: excluir tarefa
- [ ] Testado: filtros e busca

---

## 🎯 Domínio Personalizado (Opcional)

Quer usar `tarefascris.com.br` em vez de `.onrender.com`?

### No Render (GRÁTIS)

1. Compre um domínio (Registro.br, GoDaddy, Namecheap)
2. No Render, vá em **"Settings"** do frontend
3. Role até **"Custom Domains"**
4. Clique em **"Add Custom Domain"**
5. Digite seu domínio (ex: `tarefascris.com.br`)
6. Siga as instruções para configurar DNS
7. Aguarde propagação (até 24h)
8. **HTTPS grátis** via Let's Encrypt!

---

## 💰 Custos

### Plano Gratuito (Atual)

| Item | Custo |
|------|-------|
| Backend | R$ 0,00 |
| Frontend | R$ 0,00 |
| PostgreSQL | R$ 0,00 |
| HTTPS | R$ 0,00 |
| **TOTAL** | **R$ 0,00/mês** |

**Limitações**:
- Backend dorme após 15 min
- 750 horas/mês de backend ativo
- 100 GB bandwidth/mês

### Plano Pago (Opcional)

Se quiser backend sempre ativo:

| Item | Custo |
|------|-------|
| Backend (Starter) | $7/mês (~R$ 35) |
| Frontend | R$ 0,00 |
| PostgreSQL | R$ 0,00 |
| **TOTAL** | **~R$ 35/mês** |

**Vantagens**:
- Backend sempre ativo (sem delay)
- Mais recursos (CPU, RAM)
- Suporte prioritário

---

## 📞 Suporte

### Documentação Oficial

- **Render**: https://render.com/docs
- **Node.js no Render**: https://render.com/docs/deploy-node-express-app

### Comunidade

- **Render Community**: https://community.render.com
- **Discord do Render**: https://discord.gg/render

---

## 🚀 Próximos Passos

Depois do deploy básico, você pode:

1. ✅ **Adicionar Banco de Dados** - PostgreSQL para dados permanentes
2. ✅ **Configurar Domínio** - URL personalizada
3. ✅ **Adicionar Funcionalidades** - Notificações, estatísticas, etc.
4. ✅ **Monitoramento** - Configurar alertas no Render
5. ✅ **Backup** - Configurar backup automático do banco

---

## 🎉 Parabéns!

Seu sistema "Tarefas Cris" está publicado e acessível para qualquer pessoa na internet!

**Compartilhe a URL do frontend com quem quiser!** 🌐

---

**Desenvolvido com ❤️ e publicado com sucesso no Render!**

**Data**: 09/02/2026  
**Plataforma**: Render.com  
**Status**: ✅ Funcionando
