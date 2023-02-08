FROM node:18-alpine
RUN npm install -g serve

WORKDIR /frontend
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "serve", "-s", "build" ]
