FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ENV MAX_TEXT_LENGTH=5000
ENV OLLAMA_HOST=http://traductor-ia:11434
ENV OLLAMA_MODEL=mistral:latest

CMD ["node", "server.js"]