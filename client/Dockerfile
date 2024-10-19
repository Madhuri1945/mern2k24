FROM node:14 as build-stage

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
