# #!/bin/bash
# # Script para executar a inicialização do banco de dados sempre que o container subir

# set -e

# echo "Aguardando o MySQL estar pronto..."
# until mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -e "SELECT 1" >/dev/null 2>&1; do
#   sleep 2
# done

# echo "MySQL está pronto! Aguardando migrations do backend..."
# sleep 10

# echo "Verificando se a tabela Teams existe..."

# # Verifica se a tabela Teams existe
# TABLE_EXISTS=$(mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}' AND table_name = 'Teams';")

# if [ "$TABLE_EXISTS" -eq "1" ]; then
#   echo "Tabela Teams encontrada. Verificando se já possui dados..."
  
#   # Verifica se a tabela já tem dados
#   ROW_COUNT=$(mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM Teams;")
  
#   if [ "$ROW_COUNT" -eq "0" ]; then
#     echo "Tabela Teams está vazia. Executando script de inicialização..."
#     mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" < /scripts/init-teams.sql
#     echo "✅ Dados dos times inseridos com sucesso!"
#   else
#     echo "ℹ️  Tabela Teams já possui $ROW_COUNT registros. Pulando inicialização."
#   fi
# else
#   echo "⚠️  Tabela Teams não existe ainda. Aguardando migrations do Entity Framework..."
# fi


#!/bin/bash
set -e

export MYSQL_PWD="${MYSQL_PASSWORD}"

echo "Aguardando o MySQL..."
until mysql -h"db" -u"${MYSQL_USER}" "${MYSQL_DATABASE}" -e "SELECT 1" >/dev/null 2>&1; do
  sleep 2
done

echo "MySQL pronto. Aguardando a tabela 'Teams' (migrations)..."

# Loop de espera pela tabela
MAX_RETRIES=30
COUNT=0
until mysql -h"db" -u"${MYSQL_USER}" "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}' AND table_name = 'Teams';" | grep -q "1"; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX_RETRIES ]; then exit 1; fi
  sleep 2
done

echo "✅ Tabela Teams encontrada!"

ROW_COUNT=$(mysql -h"db" -u"${MYSQL_USER}" "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM Teams;")

if [ "$ROW_COUNT" -eq "0" ]; then
  echo "🚀 Preparando SQL para IDs Inteiros e colunas EF Core..."
  
  # O segredo está nestes comandos sed:
  # 1. Remove 'Id,' da lista de colunas do INSERT
  # 2. Remove 'UUID(),' da lista de valores
  # 3. Ajusta as colunas HomeTeamId/AwayTeamId para o padrão do EF Core
  sed -e 's/(Id, /( /g' \
      -e 's/UUID(), //g' \
      -e 's/HomeTeamId/HomeTeamId1/g' \
      -e 's/AwayTeamId/AwayTeamId1/g' \
      /scripts/init-teams.sql > /tmp/init-final.sql

  echo "Executando importação..."
  # Usamos SET sql_mode='' para garantir que campos extras obrigatórios não barrem o insert
  {
    echo "SET FOREIGN_KEY_CHECKS = 0;"
    echo "SET sql_mode = '';"
    cat /tmp/init-final.sql
    echo "SET FOREIGN_KEY_CHECKS = 1;"
  } | mysql -h"db" -u"${MYSQL_USER}" "${MYSQL_DATABASE}"
  
  echo "✅ Importação concluída com sucesso!"
  rm /tmp/init-final.sql
else
  echo "ℹ️  Dados já existentes. Pulando."
fi