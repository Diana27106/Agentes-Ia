// backend/services.js
import { db } from "./db.js";

/* =========================================================
    SERVICIO: GUARDAR UNA TRADUCCIÓN
   ========================================================= */
export function saveTranslation({ texto_origen, idioma_origen, texto_destino, idioma_destino }) {
    const stmt = db.prepare(`
        INSERT INTO historial (
            texto_origen,
            idioma_origen,
            texto_destino,
            idioma_destino
        ) VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
        texto_origen,
        idioma_origen,
        texto_destino,
        idioma_destino
    );

    return {
        id: result.lastInsertRowid,
        texto_origen,
        idioma_origen,
        texto_destino: texto_destino,
        idioma_destino,
    };
}

/* =========================================================
    SERVICIO: OBTENER TODO EL HISTORIAL
   ========================================================= */
export function getAllTranslations(limit = 50) {
    const stmt = db.prepare(`
        SELECT *
        FROM historial
        ORDER BY fecha_traduccion DESC
        LIMIT ?
    `);

    return stmt.all(limit);
}

/* =========================================================
    SERVICIO: OBTENER UNA TRADUCCIÓN POR ID
   ========================================================= */
export function getTranslationById(id) {
    const stmt = db.prepare(`
        SELECT *
        FROM historial
        WHERE id = ?
    `);

    return stmt.get(id);
}

/* =========================================================
    SERVICIO: ELIMINAR UNA TRADUCCIÓN POR ID
   ========================================================= */
export function deleteTranslation(id) {
    const stmt = db.prepare(`
        DELETE FROM historial
        WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
}

/* =========================================================
    SERVICIO: LIMPIAR TODO EL HISTORIAL
   ========================================================= */
export function clearTranslations() {
    const stmt = db.prepare(`DELETE FROM historial`);
    stmt.run();
    return true;
}
