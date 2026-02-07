# 🛠️ Guia de Manutenção e Suporte

Este guia é destinado a desenvolvedores e administradores de sistema para garantir a continuidade e correta manutenção do Bolão Copa 2026.

## 🗄️ Gerenciamento de Banco de Dados

O projeto utiliza **Entity Framework Core** com Migrations para gerenciar o esquema do banco de dados MySQL.

### Adicionando uma Nova Migration
Sempre que o modelo de dados (`Models/`) for alterado:
```bash
cd Bolao-Backend
dotnet ef migrations add <NomeDaMigration>
```

### Aplicando Migrations em Produção
No ambiente Docker, as migrations são aplicadas automaticamente pela API ao iniciar, mas você pode forçar manualmente se necessário:
```bash
dotnet ef database update
```

### Resetando o Banco de Dados
Para limpar tudo e recomeçar (CUIDADO: remove todos os palpites e usuários):
1. Pare os containers: `docker compose down`
2. Remova o volume de dados: `docker volume rm bolao_db_data` (verifique o nome exato com `docker volume ls`)
3. Suba novamente: `docker compose up --build`

## 🔑 Variáveis de Ambiente (`.env`)

O arquivo `.env` na raiz é crítico. Aqui estão os detalhes:

| Variável | Descrição |
| :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | Senha do usuário root do MySQL. |
| `MYSQL_DATABASE` | Nome do banco de dados (padrão: `bolao_db`). |
| `MYSQL_USER` / `PASSWORD` | Credenciais para a conexão da API. |
| `JWT_SECRET_KEY` | Chave longa e segura para assinar os tokens JWT. |
| `ADMIN_EMAILS` | Lista de e-mails separados por vírgula que terão permissões de Admin. |

## ⚽ Atualizando Times e Jogos (Seeding)

Os dados iniciais são inseridos pelo container `db-init` usando o script:
`Bolao-Backend/Db/scripts/init-teams.sql`.

Se precisar alterar os times ou datas dos jogos:
1. Edite o arquivo `.sql`.
2. Reinicie o container `db-init` ou siga os passos de "Resetando o Banco" acima.

## 🧪 Executando Testes

O projeto possui uma suite de testes unitários e de integração no diretório `Bolao-Test`.

Para executar os testes:
```bash
cd Bolao-Test
dotnet test
```

Os testes principais cobrem:
- Validação de números de telefone.
- Lógica de cálculo de resultados de jogos.
- Simulação de progressão de times no torneio.

## 🚨 Troubleshooting (Resolução de Problemas)

### API não conecta no Banco
- Verifique se o container `db` está `healthy`.
- Confira se a `ConnectionString` no `docker-compose.yml` está usando o nome do serviço `db`.

### Usuário não consegue permissão de Admin
- Certifique-se de que o e-mail cadastrado pelo usuário coincide exatamente (case sensitive) com o que está em `ADMIN_EMAILS` no `.env`.
- Reinicie o container `backend` após alterar o `.env`.

### Erro de CORS na API
- Verifique a configuração de CORS no `Program.cs` do backend, garantindo que a URL do frontend (ex: `http://localhost:3000`) esteja permitida.
