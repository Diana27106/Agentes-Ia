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
router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        server: true,
        ollama: true, // Aquí podrías hacer un ping real si usas Ollama
        timestamp: new Date().toISOString(),
    });
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

        if (text.length > process.env.MAX_TEXT_LENGTH)
            return res.status(400).json({ error: `El texto no puede superar ${process.env.MAX_TEXT_LENGTH} caracteres` });

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
        const response = await fetch(`${process.env.OLLAMA_HOST}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL,
                prompt,
                stream: false
            })
        });

        const data = await response.json();

        if (!data.response) {
            return res.status(500).json({ error: "Error en la respuesta de Ollama" });
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
        newTranslation.model = process.env.OLLAMA_MODEL;
        newTranslation.duration = duration;

        res.json(newTranslation);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar la traducción" });
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
