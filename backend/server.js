// CONFIGURACION INICIAL PARA USAR EL MODULO ES6 SQLITE

import express from 'express'; // Importamos Express
import { initializeDatabase } from './db.js'; // Importamos la función para inicializar la base de datos

// También necesitarás importar el enrutador
import router from './routes.js';

const app = express();
const PORT = process.env.PORT || 3005;

// 1. Inicializa la base de datos
initializeDatabase();

// Configuración de middlewares
app.use(express.json());

// Configuración de rutas
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});