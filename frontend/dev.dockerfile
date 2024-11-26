FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY . ./tmp
RUN rm -rf ./tmp/src
RUN cp -rf ./tmp/* ./
RUN rm -rf ./tmp

CMD ["npm","run", "dev"]
