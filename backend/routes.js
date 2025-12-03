// backend/routes.js
import express from "express";
import * as translationService from "./services.js";

const router = express.Router();

// Idiomas soportados
const supportedLanguages = [
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
    { code: "fr", name: "Francés" },
];

/* =========================================================
    1️⃣ HEALTH CHECK
   ========================================================= */
router.get("/health", async (req, res) => {
    const healthStatus = {
        status: "ok",
        server: true,
        ollama: false,
        timestamp: new Date().toISOString(),
    };

    // Verificar conexión con Ollama
    try {
        const ollamaHost = process.env.OLLAMA_HOST || "http://traductor-ia:11434";
        const response = await fetch(`${ollamaHost}/api/tags`, {
            method: "GET",
            timeout: 5000
        });
        healthStatus.ollama = response.ok;
    } catch (error) {
        healthStatus.ollama = false;
        healthStatus.ollamaError = error.message;
    }

    const statusCode = healthStatus.ollama ? 200 : 503;
    res.status(statusCode).json(healthStatus);
});

/* =========================================================
    2️⃣ TRANSLATE
   ========================================================= */
router.post("/translate", async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;

        // Validaciones
        if (!text || text.trim() === "")
            return res.status(400).json({ error: "El texto no puede estar vacío" });

        const maxLength = Number(process.env.MAX_TEXT_LENGTH) || 5000;
        if (text.length > maxLength)
            return res.status(400).json({ error: `El texto no puede superar ${maxLength} caracteres` });

        if (sourceLang === targetLang)
            return res.status(400).json({ error: "El idioma de origen y destino deben ser diferentes" });

        const validLangs = supportedLanguages.map(l => l.code);
        if (!validLangs.includes(sourceLang) || !validLangs.includes(targetLang))
            return res.status(400).json({ error: "Idiomas no soportados" });

        const start = Date.now();

        // Prompt para traducción
        const prompt = `
        Traduce lo siguiente del idioma ${sourceLang} al ${targetLang}:
        "${text}"
        Solo responde con la traducción final, sin explicaciones.
        `;

        // Llamada al contenedor Ollama
        const ollamaHost = process.env.OLLAMA_HOST || "http://traductor-ia:11434";
        const ollamaModel = process.env.OLLAMA_MODEL || "mistral:latest";
        
        console.log(`[Translate] Llamando a Ollama en: ${ollamaHost}/api/generate`);
        console.log(`[Translate] Modelo: ${ollamaModel}`);
        
        let response;
        try {
            response = await fetch(`${ollamaHost}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: ollamaModel,
                    prompt,
                    stream: false
                })
            });
        } catch (fetchError) {
            console.error("[Translate] Error de conexión con Ollama:", fetchError.message);
            return res.status(503).json({ 
                error: `No se pudo conectar con Ollama en ${ollamaHost}. Verifica que el servicio esté ejecutándose.`,
                details: fetchError.message 
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Translate] Ollama respondió con error ${response.status}:`, errorText);
            return res.status(502).json({ 
                error: `Ollama respondió con error ${response.status}`,
                details: errorText 
            });
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error("[Translate] Error al parsear respuesta de Ollama:", parseError.message);
            return res.status(500).json({ 
                error: "Error al procesar la respuesta de Ollama",
                details: parseError.message 
            });
        }

        if (!data || !data.response) {
            console.error("[Translate] Respuesta de Ollama sin 'response':", JSON.stringify(data));
            return res.status(500).json({ 
                error: "Ollama no devolvió una traducción válida",
                details: "La respuesta no contenía el campo 'response'" 
            });
        }

        const translatedText = data.response.trim();
        const duration = Date.now() - start;

        // Guardar en la base de datos
        const newTranslation = translationService.saveTranslation({
            texto_origen: text,
            idioma_origen: sourceLang,
            texto_destino: translatedText,
            idioma_destino: targetLang,
        });

        // Agregar información adicional
        newTranslation.model = ollamaModel;
        newTranslation.duration = duration;

        res.json(newTranslation);

    } catch (err) {
        console.error("[Translate] Error inesperado:", err);
        console.error("[Translate] Stack:", err.stack);
        res.status(500).json({ 
            error: "Error al procesar la traducción",
            details: err.message || "Error desconocido"
        });
    }
});

/* =========================================================
    3️⃣ GET ALL TRANSLATIONS
   ========================================================= */
router.get("/translations", (req, res) => {
    const { limit = 50 } = req.query;
    const translations = translationService.getAllTranslations(parseInt(limit));
    res.json(translations);
});

/* =========================================================
    4️⃣ GET TRANSLATION BY ID
   ========================================================= */
router.get("/translations/:id", (req, res) => {
    const { id } = req.params;
    const translation = translationService.getTranslationById(id);

    if (!translation)
        return res.status(404).json({ error: "Traducción no encontrada" });

    res.json(translation);
});

/* =========================================================
    5️⃣ DELETE TRANSLATION BY ID
   ========================================================= */
router.delete("/translations/:id", (req, res) => {
    const { id } = req.params;
    const deleted = translationService.deleteTranslation(id);

    if (!deleted)
        return res.status(404).json({ error: "Traducción no encontrada" });

    res.json({ message: `Traducción ${id} eliminada correctamente` });
});

/* =========================================================
    6️⃣ DELETE ALL TRANSLATIONS
   ========================================================= */
router.delete("/translations", (req, res) => {
    translationService.clearTranslations();
    res.json({ message: "Historial de traducciones limpiado" });
});

/* =========================================================
    7️⃣ GET SUPPORTED LANGUAGES
   ========================================================= */
router.get("/languages", (req, res) => {
    res.json(supportedLanguages);
});

export default router;
