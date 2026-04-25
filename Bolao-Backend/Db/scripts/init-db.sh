#!/bin/bash
set -e

export MYSQL_PWD="${MYSQL_PASSWORD}"

echo "Aguardando o MySQL..."
until mysql -h"db" -u"${MYSQL_USER}" --default-character-set=utf8mb4 "${MYSQL_DATABASE}" -e "SELECT 1" >/dev/null 2>&1; do
  sleep 2
done

echo "MySQL pronto. Aguardando a tabela 'Teams' (migrations)..."

# Loop de espera pela tabela
MAX_RETRIES=30
COUNT=0
until mysql -h"db" -u"${MYSQL_USER}" --default-character-set=utf8mb4 "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}' AND table_name = 'Teams';" | grep -q "1"; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX_RETRIES ]; then exit 1; fi
  sleep 2
done

echo "✅ Tabela Teams encontrada!"

ROW_COUNT=$(mysql -h"db" -u"${MYSQL_USER}" --default-character-set=utf8mb4 "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM Teams;")

if [ "$ROW_COUNT" -eq "0" ]; then
  echo "Executando importação..."
  # Usamos SET sql_mode='' para garantir que campos extras obrigatórios não barrem o insert
  {
    echo "SET FOREIGN_KEY_CHECKS = 0;"
    echo "SET sql_mode = '';"
    cat /scripts/init-teams.sql
    echo "SET FOREIGN_KEY_CHECKS = 1;"
  } | mysql -h"db" -u"${MYSQL_USER}" --default-character-set=utf8mb4 "${MYSQL_DATABASE}"
  
  echo "✅ Importação concluída com sucesso!"

else
  echo "ℹ️  Dados já existentes. Pulando."
fi
