<#
.SYNOPSIS
    Resets the dev env. Only run this when needed.

.DESCRIPTION
    Resets the database state for the dev environment. This includes:
    - removing all containers
    - removing all volumes (including orphaned volumes)
    - removing all images (including orphaned images)
    - removing all logs
    - removing all database data

    After that, it starts the dev environment again and reconfigures postgres.

    Precondition:
    - Docker is running. The script will fail otherwise.
    - The script's cwd in the repo's root directory.
    - The docker backend starts within 30 seconds.
#>

# completely resets the database state
docker compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
Remove-Item "./backend/logs" -Recurse
Remove-Item "./db_data" -Recurse
Remove-Item "./backend/node_modules" -Recurse
Set-Location backend
npm ci
Set-Location ..
docker compose -f docker-compose.dev.yml up -d

timeout 30
# restart backend to make sure it connects to the database
docker compose -f docker-compose.dev.yml exec backend bash -c "cd app;npx prisma migrate dev"
docker compose -f docker-compose.dev.yml restart backend
