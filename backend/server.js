// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";
import { initializeDatabase } from "./db.js";

// Cargar variables de entorno (.env)
dotenv.config();

// Inicializar base de datos (crea tabla si no existe)
initializeDatabase();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api", routes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});