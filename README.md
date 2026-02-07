# 🏆 Bolão - Copa do Mundo 2026

Bem-vindo ao **Bolão da Copa do Mundo 2026**! Esta é uma plataforma completa para gerenciar palpites, acompanhar resultados e visualizar rankings de usuários durante o torneio.

## 🚀 Sobre o Projeto

O projeto consiste em um sistema de "Bolão" onde usuários podem dar seus palpites para todos os jogos da Copa do Mundo 2026, desde a fase de grupos até a grande final. O sistema calcula pontos automaticamente com base nos resultados reais inseridos pelos administradores.

### ✨ Funcionalidades Principais

- **Sistema de Palpites**: Interface intuitiva para inserir palpites de jogos.
- **Progressão Dinâmica**: Os times avançam nos mata-matas conforme os palpites do usuário.
- **Ranking Global**: Visualização em tempo real dos melhores pontuadores.
- **Gestão de Grupos**: Visualização das tabelas de classificação atualizadas.
- **Painel Administrativo**: Interface para administradores atualizarem os resultados reais dos jogos.
- **Autenticação Segura**: Sistema de login e cadastro com JWT.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework**: [.NET 8](https://dotnet.microsoft.com/)
- **ORM**: [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- **Banco de Dados**: [MySQL 8.0](https://www.mysql.com/) (com Pomelo EF Core provider)
- **Autenticação**: JWT (JSON Web Token)
- **Documentação API**: Swagger/OpenAPI

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Roteamento**: React Router 7
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast

### Infraestrutura
- **Containerização**: Docker e Docker Compose

## 📦 Como Executar

### Pré-requisitos
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Passo a Passo

1.  **Clonar o Repositório**:
    ```bash
    git clone <url-do-repositorio>
    cd Bolao
    ```

2.  **Configurar Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
    ```bash
    cp .env.example .env
    ```
    Preencha as variáveis como `MYSQL_ROOT_PASSWORD`, `JWT_SECRET_KEY`, etc.

3.  **Subir os Containers**:
    ```bash
    docker compose up --build
    ```

4.  **Acessar a Aplicação**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend (API)**: [http://localhost:8080/swagger](http://localhost:8080/swagger)

## 📖 Documentação Detalhada

Para mais detalhes sobre cada parte do sistema, consulte as documentações específicas:

- 🖥️ [Documentação do Frontend](docs/frontend.md)
- ⚙️ [Documentação do Backend](docs/backend.md)
- 🛠️ [Guia de Manutenção](docs/maintenance.md)

## 🤝 Contribuição

Sinta-se à vontade para abrir Issues ou enviar Pull Requests para melhorias no projeto.

---

Desenvolvido com ❤️ para a comunidade futebolística.
