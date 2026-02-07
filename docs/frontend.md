# 🖥️ Documentação do Frontend

O frontend do Bolão é uma aplicação moderna do lado do cliente (SPA) construída com React e Vite, focada em performance e experiência do usuário (UX).

## 🎨 Design e UI

- **Framework CSS**: Tailwind CSS 4, permitindo um design responsivo e customizado sem sair do HTML.
- **Aparência**: Design premiun com cores vibrantes, suporte a layouts modernos e ícones da biblioteca Lucide.
- **Feedback**: Notificações em tempo real usando `react-hot-toast` para ações como sucesso ao salvar palpites ou erros de login.

## 🏗️ Estrutura do Projeto

O código fonte está localizado em `bolado-frontend/src`:

- `components/`: Componentes reutilizáveis (MatchCard, Navbar, RankingTable, etc).
- `context/`: Contextos do React para gerenciamento de estado global (ex: `AuthContext`).
- `hooks/`: Hooks customizados para isolar a lógica de negócio dos componentes (ex: `useGameMake`, `useMatches`).
- `pages/`: Páginas principais da aplicação (Home, GameMake, Ranking, Login).
- `services/`: Configuração de chamadas de API (axios).

## 🔄 Fluxo de Palpites (`GameMake`)

A página `GameMake` é o coração da aplicação para o usuário:

1. **Fase de Grupos**: O usuário insere os scores para os jogos das seleções em cada grupo (A-L).
2. **Cálculo de Classificação**: O frontend calcula as posições dos times nos grupos em tempo real à medida que o usuário preenche os palpites.
3. **Mata-mata**: Com base nos classificados dos grupos, os confrontos das fases seguintes (32-avos, Oitavas, etc) são gerados dinamicamente.
4. **Finalização**: O sistema valida se todos os jogos foram preenchidos antes de permitir o salvamento ("Salvar Jogo").

## 🔐 Gerenciamento de Estado

- **Autenticação**: O `AuthContext` mantém as informações do usuário logado e o token JWT, persistido de forma segura para manter a sessão.
- **Navegação**: Proteção de rotas usando `react-router-dom`, redirecionando usuários não autenticados para a página de login quando necessário.

## 🛠️ Comandos Úteis (Desenvolvimento Local)

Se desejar rodar apenas o frontend sem Docker:

```bash
cd bolado-frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.
