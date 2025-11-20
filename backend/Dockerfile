#Dockerfile para el backend de la aplicación
# Asusmiendo que se ejecutará desde la carpeta backend

FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias e instalar
COPY package*.json ./
RUN npm install --production

# Copiar el resto de los archivos de la aplicación
COPY . . 

# Puerto en el que la aplicación escuchará (express)
EXPOSE 3005

# Comando para iniciar la aplicación
CMD ["node", "./server.js"]