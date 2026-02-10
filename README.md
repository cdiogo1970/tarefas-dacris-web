# Tarefas Cris - Versão Web

Sistema completo de gerenciamento de tarefas diárias com autenticação por email/senha.

## 🎯 Funcionalidades

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Proteção de rotas (apenas usuários autenticados)
- ✅ Logout seguro

### Gerenciamento de Tarefas
- ✅ Criar, editar e excluir tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Sistema de prioridades (Baixa, Média, Alta)
- ✅ Organização por temas personalizados
- ✅ Data (formato DD/MM) e horário para lembretes
- ✅ Descrição detalhada opcional

### Filtros e Busca
- ✅ Filtrar por status (Todas, Ativas, Concluídas)
- ✅ Filtrar por prioridade
- ✅ Filtrar por tema
- ✅ Busca por título e descrição
- ✅ Ordenação (Mais recentes, Alfabética, Por prioridade)

### Design
- ✅ Interface responsiva (mobile e desktop)
- ✅ Design profissional e moderno
- ✅ Cores personalizadas por tema
- ✅ Badges de prioridade coloridos

## 🚀 Como Usar

### 1. Iniciar o Backend

```bash
cd /home/ubuntu/tarefas-cris-web
node server/index.js
```

O servidor backend estará rodando em: `http://localhost:3001`

### 2. Iniciar o Frontend

Em outro terminal:

```bash
cd /home/ubuntu/tarefas-cris-web/public
python3.11 -m http.server 8080
```

O frontend estará disponível em: `http://localhost:8080`

### 3. Acessar o Sistema

Abra o navegador e acesse:
- **Login**: http://localhost:8080/login.html
- **Registro**: http://localhost:8080/register.html

## 📁 Estrutura do Projeto

```
tarefas-cris-web/
├── public/                    # Arquivos estáticos (frontend)
│   ├── login.html            # Página de login
│   ├── register.html         # Página de registro
│   ├── tasks.html            # Página principal de tarefas
│   └── src/
│       ├── css/
│       │   └── style.css     # Estilos CSS
│       └── js/
│           ├── auth.js       # Autenticação
│           └── app.js        # Lógica principal
├── server/                    # Backend Node.js
│   └── index.js              # Servidor Express
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

## 🔧 Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (design responsivo)
- JavaScript (ES6+)
- LocalStorage (para token de autenticação)

### Backend
- Node.js
- Express.js
- bcryptjs (criptografia de senhas)
- jsonwebtoken (JWT para autenticação)
- uuid (geração de IDs únicos)
- CORS (permitir requisições do frontend)

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT (JSON Web Tokens)
- Proteção de rotas no backend
- Validação de dados no frontend e backend

## 💾 Armazenamento de Dados

Atualmente, o sistema usa **armazenamento em memória** (variável `db` no servidor).

**Importante**: Os dados serão perdidos quando o servidor for reiniciado.

### Para Produção

Para uso em produção, você deve:

1. **Configurar um banco de dados real**:
   - PostgreSQL (recomendado)
   - MySQL
   - MongoDB

2. **Persistir dados**:
   - Substituir o objeto `db` por queries ao banco de dados
   - Usar um ORM como Sequelize, Prisma ou TypeORM

3. **Deploy**:
   - Backend: Heroku, Railway, Render, DigitalOcean
   - Frontend: Netlify, Vercel, GitHub Pages

## 📱 URLs Públicas (Temporárias)

**Frontend**: https://8080-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer/login.html

**Backend API**: https://3001-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer/api

⚠️ **Nota**: Estas URLs são temporárias e funcionam apenas enquanto o sandbox estiver ativo.

## 🎨 Temas Padrão

Ao criar uma conta, o usuário recebe automaticamente 3 temas:

1. **Trabalho** (azul)
2. **Pessoal** (verde)
3. **Estudos** (laranja)

Novos temas podem ser criados na interface.

## 📝 Exemplo de Uso

1. **Criar conta**: Acesse `/register.html` e preencha o formulário
2. **Fazer login**: Você será redirecionado automaticamente para `/tasks.html`
3. **Criar tarefa**: Clique em "+ Nova Tarefa"
4. **Preencher dados**:
   - Título: "Reunião com cliente"
   - Descrição: "Apresentar proposta do projeto"
   - Tema: Trabalho
   - Prioridade: Alta
   - Data: 10/02
   - Horário: 14:30
5. **Salvar**: A tarefa aparecerá na lista
6. **Filtrar**: Use os botões de filtro para organizar suas tarefas
7. **Buscar**: Digite no campo de busca para encontrar tarefas específicas
8. **Editar**: Clique na tarefa para editá-la
9. **Concluir**: Marque o checkbox para marcar como concluída

## 🐛 Resolução de Problemas

### Erro de CORS
Se aparecer erro de CORS no console:
- Verifique se o backend está rodando
- Confirme que o CORS está habilitado no `server/index.js`

### Página em branco
- Verifique se os arquivos CSS e JS estão sendo carregados
- Abra o console do navegador (F12) para ver erros

### Não consegue fazer login
- Verifique se o backend está rodando
- Confirme que a URL da API está correta nos arquivos JS
- Verifique o console do navegador para erros

### Token inválido
- Limpe o LocalStorage do navegador
- Faça logout e login novamente

## 🔄 Diferenças entre Versão Mobile e Web

| Recurso | Mobile (Expo) | Web (HTML/CSS/JS) |
|---------|---------------|-------------------|
| Armazenamento | AsyncStorage (local) | Backend + API |
| Autenticação | Não | Sim (email/senha) |
| Notificações | Sim (10h diárias) | Não implementado |
| Compartilhar | Sim (nativo) | Não implementado |
| Backup | Sim (JSON) | Não implementado |
| Estatísticas | Sim (gráficos) | Não implementado |
| Acesso | Apenas no celular | Qualquer navegador |
| Sincronização | Não | Sim (nuvem) |

## 📈 Próximos Passos

Para completar o sistema web, falta implementar:

1. ✅ **Autenticação** - CONCLUÍDO
2. ✅ **CRUD de Tarefas** - CONCLUÍDO
3. ✅ **Filtros e Busca** - CONCLUÍDO
4. ✅ **Temas Personalizados** - CONCLUÍDO
5. ⏳ **Página de Temas** - Criar interface para gerenciar temas
6. ⏳ **Página de Estatísticas** - Gráficos e métricas
7. ⏳ **Página de Configurações** - Preferências do usuário
8. ⏳ **Notificações Web** - Push notifications no navegador
9. ⏳ **Compartilhamento** - Compartilhar tarefas via link
10. ⏳ **Backup/Exportação** - Download de dados em JSON
11. ⏳ **Impressão** - Imprimir lista de tarefas
12. ⏳ **Banco de Dados Real** - PostgreSQL ou MySQL
13. ⏳ **Deploy em Produção** - Hospedar em servidor real

## 💡 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor backend
3. Consulte este README

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal da Cristina.

---

**Desenvolvido com ❤️ para organizar suas tarefas diárias!**
