# 🎯 MyGoal — Frontend

Interface web do MyGoal, uma plataforma SaaS de gestão de metas pessoais com geração de missões diárias por Inteligência Artificial.

## 📋 Sobre o Projeto

O MyGoal permite que usuários cadastrem metas pessoais com prazo definido e acompanhem seu progresso através de **missões diárias geradas por IA**. A interface é responsiva, intuitiva e construída com Angular Material.

## ✨ Funcionalidades

- 🔐 Login com e-mail/senha e login social com Google OAuth2
- 📊 Dashboard com grid de metas e progresso visual
- 🎯 Criação de metas com validação de data futura
- ✅ Conclusão de missões com atualização em tempo real da barra de progresso
- ⚠️ Destaque visual para missões pendentes de dias anteriores
- 📱 Interface responsiva com Angular Material

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 17+ | Framework principal |
| TypeScript | 5.x | Linguagem principal |
| Angular Material | 17+ | Componentes de UI |
| RxJS | 7.x | Programação reativa |
| Angular CDK | 17+ | Utilitários de UI |
| SCSS | — | Estilização |
| Nginx | alpine | Servidor web (produção) |
| Docker | latest | Containerização para deploy |

## 🏗️ Arquitetura

```
src/app/
├── core/                        # Infraestrutura da aplicação
│   ├── guards/
│   │   └── auth.guard.ts        # Protege rotas autenticadas
│   ├── interceptors/
│   │   └── jwt.interceptor.ts   # Adiciona JWT em todas as requisições
│   ├── models/
│   │   ├── auth.model.ts        # Interfaces: User, LoginRequest, AuthResponse
│   │   └── goal.model.ts        # Interfaces: Goal, Mission, GoalRequest
│   └── services/
│       ├── auth.service.ts      # Autenticação, sessão e OAuth2
│       └── goal.service.ts      # CRUD de metas e missões
│
├── features/                    # Telas da aplicação
│   ├── auth/
│   │   ├── login/               # Tela de login
│   │   ├── register/            # Tela de cadastro
│   │   └── callback/            # Callback do OAuth2 Google
│   ├── dashboard/               # Tela principal com lista de metas
│   ├── goal-create/             # Formulário de criação de meta
│   └── goal-detail/             # Detalhe da meta com missões
│
├── app.routes.ts                # Definição de rotas com lazy loading
├── app.config.ts                # Configuração central do Angular
└── app.component.ts             # Componente raiz

src/environments/
├── environment.ts               # Config de desenvolvimento (localhost)
└── environment.prod.ts          # Config de produção (Render)
```

## 🗺️ Rotas da Aplicação

| Rota | Componente | Guard | Descrição |
|------|-----------|-------|-----------|
| `/login` | Login | noAuthGuard | Tela de login |
| `/register` | Register | noAuthGuard | Tela de cadastro |
| `/auth/callback` | Callback | — | Callback OAuth2 Google |
| `/dashboard` | Dashboard | authGuard | Lista de metas |
| `/goals/new` | GoalCreate | authGuard | Criar nova meta |
| `/goals/:id` | GoalDetail | authGuard | Detalhe da meta |

## ⚙️ Configuração de Ambiente

### Desenvolvimento (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

### Produção (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-backend.onrender.com/api/v1'
};
```

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 20+
- npm 10+
- Angular CLI 17+
- Backend do MyGoal rodando em `http://localhost:8080`

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/mygoal-frontend.git
cd mygoal-frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Rode o projeto
```bash
ng serve
```

A aplicação estará disponível em `http://localhost:4200`

## 🏗️ Build para Produção

```bash
ng build --configuration production
```

Os arquivos serão gerados em `dist/mygoal-frontend/browser/`

## 🐳 Docker

```bash
# Build da imagem
docker build -t mygoal-frontend .

# Rodar o container
docker run -p 80:80 mygoal-frontend
```

## 🔐 Fluxo de Autenticação

### Login com e-mail/senha
1. Usuário preenche e-mail e senha
2. `AuthService.login()` chama `POST /api/v1/auth/login`
3. Backend retorna JWT
4. JWT é salvo no `localStorage`
5. `jwtInterceptor` adiciona o token em todas as requisições seguintes

### Login com Google OAuth2
1. Usuário clica em "Entrar com Google"
2. Frontend redireciona para o backend (`/oauth2/authorization/google`)
3. Backend redireciona para o Google
4. Após autorização, Google redireciona para o backend
5. Backend redireciona para `/auth/callback?token=eyJ...`
6. `CallbackComponent` salva o token e redireciona para `/dashboard`

## 🎨 Componentes Principais

### Dashboard
- Grid responsivo de cards com as metas
- Cada card exibe: título, status (chip colorido), data limite, barra de progresso e missões do dia
- Exclusão de meta com confirmação
- Estado vazio com call-to-action para criar primeira meta

### Goal Detail
- Barra de progresso animada com percentual
- Lista de missões com estados visuais:
  - ✅ Verde: missão concluída
  - 🔵 Azul: missão de hoje pendente
  - 🟠 Laranja: missão de dia anterior pendente (acumulada)
- Banner de parabéns quando a meta é concluída (100%)

### Goal Create
- Formulário reativo com validação em tempo real
- Datepicker com bloqueio de datas passadas (`[min]="minDate"`)
- Feedback de carregamento durante geração das missões pela IA

## 📦 Deploy

O frontend está configurado para deploy no **Vercel**.

Conecte o repositório GitHub ao Vercel e configure:
- **Framework Preset:** Angular
- **Build Command:** `npm run build`
- **Output Directory:** `dist/mygoal-frontend/browser`

O Vercel fará deploy automático a cada push na branch `main`.

> **Importante:** Atualize `environment.prod.ts` com a URL real do seu backend antes de fazer o deploy.

## 🔗 Repositório do Backend

👉 [mygoal-backend](https://github.com/RaphaelPursino/mygoal-backend)

## 📄 Licença

Este projeto está sob a licença MIT.
