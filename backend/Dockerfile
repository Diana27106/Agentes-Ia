FROM node:20-bullseye

WORKDIR /app

# Copiar solo package.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias en Linux (compila better-sqlite3)
RUN npm install

# Copiar todo el código
COPY . .

EXPOSE 4000

ENV MAX_TEXT_LENGTH=5000
ENV OLLAMA_HOST=http://traductor-ia:11434
ENV OLLAMA_MODEL=mistral:latest

CMD ["node", "server.js"]