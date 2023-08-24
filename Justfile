default:
    just --list

install: start_db
    cp .env.dist .env
    pnpm install
    npx prisma db push
    pnpm fixtures

# start docker database
start_db:
    docker compose up -d
    
# stop docker database
stop_db:
    docker compose down