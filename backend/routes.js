// backend/routes.js
import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Base de datos simulada (en memoria)
let translations = [];

// Idiomas soportados (puedes ampliar)
const supportedLanguages = [
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
    { code: "fr", name: "Francés" },
    { code: "de", name: "Alemán" },
    { code: "it", name: "Italiano" },
];

// 1. GET /api/health
router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        server: true,
        ollama: true, // aquí podrías hacer un ping real si usas Ollama
        timestamp: new Date().toISOString(),
    });
});

// 2. POST /api/translate
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

        const validLangs = supportedLanguages.map((l) => l.code);
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

        // Guardar en "BD"
        const newTranslation = {
            id: uuidv4(),
            text,
            translatedText,
            sourceLang,
            targetLang,
            model: process.env.OLLAMA_MODEL,
            duration,
            createdAt: new Date().toISOString(),
        };

        translations.push(newTranslation);

        res.json(newTranslation);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar la traducción" });
    }
});

// 3. GET /api/translations
router.get("/translations", (req, res) => {
    const { sourceLang, targetLang, limit = 50 } = req.query;

    let filtered = translations;

    if (sourceLang) filtered = filtered.filter((t) => t.sourceLang === sourceLang);
    if (targetLang) filtered = filtered.filter((t) => t.targetLang === targetLang);

    res.json(filtered.slice(0, parseInt(limit)));
});

// 4. GET /api/translations/:id
router.get("/translations/:id", (req, res) => {
    const { id } = req.params;
    const translation = translations.find((t) => t.id === id);

    if (!translation)
        return res.status(404).json({ error: "Traducción no encontrada" });

    res.json(translation);
});

// 5. DELETE /api/translations/:id
router.delete("/translations/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = translations.length;
    translations = translations.filter((t) => t.id !== id);

    if (translations.length === initialLength)
        return res.status(404).json({ error: "Traducción no encontrada" });

    res.json({ message: `Traducción ${id} eliminada correctamente` });
});

// 6. DELETE /api/translations
router.delete("/translations", (req, res) => {
    translations = [];
    res.json({ message: "Historial de traducciones limpiado" });
});

// 7. GET /api/languages
router.get("/languages", (req, res) => {
    res.json(supportedLanguages);
});

export default router;