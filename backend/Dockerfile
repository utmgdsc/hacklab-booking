FROM node:18-alpine

RUN npm install -g typescript

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "prod.sh"]