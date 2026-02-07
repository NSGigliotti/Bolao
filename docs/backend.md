# ⚙️ Documentação do Backend (API)

O backend do projeto Bolão é uma API robusta construída com .NET 8, seguindo princípios de arquitetura limpa e utilizando Entity Framework Core para persistência de dados.

## 🏗️ Estrutura de Pastas

Abaixo está a organização principal do projeto `Bolao-Backend`:

- `Controllers/`: Endpoints da API agrupados por funcionalidade (Auth, Matches, Predictions).
- `DTOs/`: Objetos de Transferência de Dados para entrada e saída de dados.
- `Db/`: Contexto do banco de dados e scripts de inicialização.
- `Enum/`: Enumerações para status de jogos e estágios da copa.
- `Interface/`: Definições de contratos para serviços e repositórios.
- `Models/`: Entidades do banco de dados.
- `Repository/`: Implementação do acesso aos dados.
- `Services/`: Lógica de negócio, incluindo cálculo de pontos e validação.

## 🔐 Autenticação e Autorização

A API utiliza **JWT (JSON Web Token)** para autenticação.

- **Cadastro**: `/api/Auth/register`
- **Login**: `/api/Auth/login`
- **Administração**: Algumas rotas são protegidas e exigem que o e-mail do usuário esteja na lista `ADMIN_EMAILS` configurada nas variáveis de ambiente.

## 📊 Lógica de Pontuação

O sistema de pontuação é processado pelo `AdminService` quando um resultado real é inserido. A pontuação padrão segue estas regras (ajustáveis):

| Acerto | Pontos |
| :--- | :--- |
| Placar Exato | 3 |
| Ganhador | 1 |
| Nenhum acerto | 0 |

## 🚀 Endpoints Principais

A documentação interativa completa pode ser acessada via **Swagger** em `/swagger` quando a aplicação está rodando em modo de desenvolvimento.

### Matches (Jogos)
- `GET /api/Maches`: Lista todos os jogos.
- `GET /api/Maches/groups`: Detalhes dos grupos e classificações.
- `POST /api/Maches/update-result`: (Admin) Atualiza o resultado de um jogo e recalcula pontos.

### Predictions (Palpites)
- `GET /api/Prediction/user/{id}`: Busca palpites de um usuário específico.
- `POST /api/Prediction`: Salva ou atualiza os palpites do usuário.

### Ranking
- `GET /api/Maches/ranking`: Retorna a lista de usuários ordenada por pontos conquistados.

## 🛠️ Configuração de Desenvolvimento

Para rodar o backend fora do Docker:
1. Certifique-se de ter o .NET 8 SDK instalado.
2. Tenha um servidor MySQL rodando.
3. Configure o arquivo `appsettings.json` ou variáveis de ambiente.
4. Execute: `dotnet run`
