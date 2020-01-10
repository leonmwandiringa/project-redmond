FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install nodemon -g
RUN npm install

COPY . .

EXPOSE 5004
CMD [ "nodemon", "RabbitMQConsumeWorker" ]