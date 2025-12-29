#!/bin/bash

# Загрузить переменные из .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

# Настройки из .env
CONTAINER_NAME=$(docker ps --filter "name=postgres" --format "{{.Names}}" | head -n 1)
DB_USER="${DB_USERNAME}"
DB_NAME="${DB_NAME}"

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lht ./backups/backup_*.sql.gz | head -n 10
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Database: $DB_NAME"
echo "Container: $CONTAINER_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""
echo "⚠️  WARNING: This will DROP and recreate the database!"
echo "All current data will be lost!"
read -p "Continue? (yes/no): " -r
echo

if [[ $REPLY == "yes" ]]; then
    echo "Starting restore process..."
    
    # Отключить все подключения
    echo "Disconnecting active connections..."
    docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c \
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();"
    
    # Пересоздать базу
    echo "Dropping database..."
    docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    
    echo "Creating database..."
    docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    # Восстановить
    echo "Restoring data..."
    if [[ $BACKUP_FILE == *.gz ]]; then
        gunzip < $BACKUP_FILE | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME
    else
        docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Restore completed successfully!"
    else
        echo "❌ Restore failed!"
        exit 1
    fi
else
    echo "Restore cancelled."
    exit 0
fi
