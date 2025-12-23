#!/bin/bash
# Script para executar a inicialização do banco de dados sempre que o container subir

set -e

echo "Aguardando o MySQL estar pronto..."
until mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -e "SELECT 1" >/dev/null 2>&1; do
  sleep 2
done

echo "MySQL está pronto! Aguardando migrations do backend..."
sleep 10

echo "Verificando se a tabela Teams existe..."

# Verifica se a tabela Teams existe
TABLE_EXISTS=$(mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}' AND table_name = 'Teams';")

if [ "$TABLE_EXISTS" -eq "1" ]; then
  echo "Tabela Teams encontrada. Verificando se já possui dados..."
  
  # Verifica se a tabela já tem dados
  ROW_COUNT=$(mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -sse "SELECT COUNT(*) FROM Teams;")
  
  if [ "$ROW_COUNT" -eq "0" ]; then
    echo "Tabela Teams está vazia. Executando script de inicialização..."
    mysql -h"db" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" < /scripts/init-teams.sql
    echo "✅ Dados dos times inseridos com sucesso!"
  else
    echo "ℹ️  Tabela Teams já possui $ROW_COUNT registros. Pulando inicialização."
  fi
else
  echo "⚠️  Tabela Teams não existe ainda. Aguardando migrations do Entity Framework..."
fi
