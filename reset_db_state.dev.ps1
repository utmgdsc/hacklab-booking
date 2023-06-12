# completely resets the database state
docker compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
Remove-Item "./backend/logs" -Recurse
Remove-Item "./db_data" -Recurse
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml exec backend bash -c "cd app;npx prisma migrate dev"
# restart backend to make sure it connects to the database
docker compose -f docker-compose.dev.yml restart backend
