FROM node:lts AS builder

RUN npm install -g serve

WORKDIR /

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

CMD ["serve", "-s", "dist", "-l", "3000"]
