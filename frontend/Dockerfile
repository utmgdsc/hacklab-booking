FROM node:lts AS builder

WORKDIR /

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM httpd:2.4 AS runner

COPY --from=builder /dist/ /usr/local/apache2/htdocs/

EXPOSE 80
