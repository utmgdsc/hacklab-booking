FROM node

RUN npm install -g typescript

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["bash", "prod.sh"]