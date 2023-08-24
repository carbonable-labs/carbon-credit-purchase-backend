FROM node:20-alpine3.17 as builder

WORKDIR /srv/www

#Install pnpm
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build && pnpm install --production

FROM node:20-alpine3.17 as production

RUN addgroup --system carbonable
RUN adduser --system carbonable --ingroup carbonable
USER carbonable:carbonable

WORKDIR /srv/www

COPY --chown=carbonable:carbonable --from=builder /srv/www/package.json ./package.json
COPY --chown=carbonable:carbonable --from=builder /srv/www/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=carbonable:carbonable --from=builder /srv/www/node_modules ./node_modules
COPY --chown=carbonable:carbonable --from=builder /srv/www/dist ./dist
COPY --chown=carbonable:carbonable --from=builder /srv/www/src/schemas ./src/schemas
COPY --chown=carbonable:carbonable --from=builder /srv/www/prisma ./prisma

EXPOSE 8080

ENTRYPOINT ["node_modules/.bin/pm2-runtime", "start", "dist/src/main.js", "--name", "carbon-credit-manager"]