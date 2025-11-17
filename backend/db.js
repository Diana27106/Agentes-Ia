/* USO DE LA BASE DE DATOS (EJEMPLO !!!) */

// Importar la base de datos que se acaba de instalar
import Database from 'better-sqlite3';
import path from 'path';

// Declaramos la ruta de la base de datos
const DB_PATH = path.join(path.resolve(), 'db', 'traducciones.db');

//Declarar opciones
const options = {
    verbose: console.log // Opcional: puedes dejarlo comentado o vacío
};
// Crear y abrir la conexión a la base de datos
export const db = new Database(DB_PATH, options);

// Configurar el modo WAL
db.pragma('journal_mode = WAL');

/**
 * Función para inicializar la base de datos
 */
export function initializeDatabase() { // Exportamos la función
    console.log(`Conectando a la base de datos en: ${DB_PATH}`);

    const createTableStmt = db.prepare(`
        CREATE TABLE IF NOT EXISTS historial (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            texto_origen TEXT NOT NULL,
            idioma_origen TEXT NOT NULL,
            texto_destino TEXT NOT NULL,
            idioma_destino TEXT NOT NULL,
            fecha_traduccion DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    try {
        createTableStmt.run();
        console.log('Tabla "historial" verificada/creada exitosamente.');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        process.exit(1);
    }
}