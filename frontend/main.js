/**
 * Frontend Logic for Translation App
 * Handles API interactions and UI updates.
 */

const API_URL = 'http://localhost:4000/api';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sourceLangSelect = document.getElementById('source-lang');
    const targetLangSelect = document.getElementById('target-lang');
    const swapBtn = document.getElementById('swap-btn');
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    const charCount = document.getElementById('source-char-count');
    const translateBtn = document.getElementById('translate-btn');
    const messageArea = document.getElementById('message-area');
    const copyBtn = document.getElementById('copy-btn');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // --- Initialization ---

    // Fetch supported languages
    fetch(`${API_URL}/languages`)
        .then(response => response.json())
        .then(languages => {
            populateLanguageSelect(sourceLangSelect, languages);
            populateLanguageSelect(targetLangSelect, languages);
            // Set defaults if needed, though HTML has defaults. 
            // We might want to ensure they match available languages.
            // For now, we trust the HTML defaults or let the user pick.
            // Let's set some sensible defaults if the HTML ones aren't valid, 
            // but the HTML has hardcoded options. We should probably clear them and use the API ones
            // to be dynamic.

            // Re-populating to ensure we have the correct codes and names from backend
            // This overrides the hardcoded HTML options which is safer.
            // However, to respect the "es" and "en" default selection logic:
            sourceLangSelect.value = 'es';
            targetLangSelect.value = 'en';
        })
        .catch(err => console.error('Error fetching languages:', err));

    // Fetch initial history
    fetchHistory();

    // --- Event Listeners ---

    // Character Count
    sourceText.addEventListener('input', () => {
        const length = sourceText.value.length;
        charCount.textContent = `${length}/500`;
        if (length > 500) {
            charCount.style.color = 'red';
            translateBtn.disabled = true;
        } else {
            charCount.style.color = '#666';
            translateBtn.disabled = false;
        }
    });

    // Swap Languages
    swapBtn.addEventListener('click', () => {
        // Swap Select values
        const tempLang = sourceLangSelect.value;
        sourceLangSelect.value = targetLangSelect.value;
        targetLangSelect.value = tempLang;

        // Swap Text values
        const tempText = sourceText.value;
        sourceText.value = targetText.value;
        targetText.value = tempText;

        // Trigger input event to update char count
        sourceText.dispatchEvent(new Event('input'));
    });

    // Translate
    translateBtn.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        const sourceLang = sourceLangSelect.value;
        const targetLang = targetLangSelect.value;

        if (!text) {
            showMessage('Por favor, introduce texto para traducir.', 'error');
            return;
        }

        if (sourceLang === targetLang) {
            showMessage('El idioma de origen y destino deben ser diferentes.', 'error');
            return;
        }

        showMessage('Traduciendo...', 'info');
        targetText.value = '...';

        try {
            const response = await fetch(`${API_URL}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, sourceLang, targetLang })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la traducción');
            }

            targetText.value = data.texto_destino;
            showMessage('Traducción completada.', 'success');
            fetchHistory(); // Refresh history
        } catch (error) {
            console.error(error);
            targetText.value = '';
            showMessage(error.message, 'error');
        }
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        if (!targetText.value) return;

        navigator.clipboard.writeText(targetText.value)
            .then(() => showMessage('Texto copiado al portapapeles', 'success'))
            .catch(err => showMessage('Error al copiar', 'error'));
    });

    // Clear History
    clearHistoryBtn.addEventListener('click', async () => {
        if (!confirm('¿Estás seguro de que quieres borrar todo el historial?')) return;

        try {
            const response = await fetch(`${API_URL}/translations`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchHistory();
                showMessage('Historial borrado.', 'success');
            } else {
                showMessage('Error al borrar historial.', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Error de conexión.', 'error');
        }
    });

    // --- Helper Functions ---

    function populateLanguageSelect(selectElement, languages) {
        selectElement.innerHTML = ''; // Clear existing
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            selectElement.appendChild(option);
        });
    }

    function showMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.className = `message-area ${type}`; // Assumes CSS has .error, .success, .info

        // Auto-clear after a few seconds
        setTimeout(() => {
            messageArea.textContent = '';
            messageArea.className = 'message-area';
        }, 3000);
    }

    function fetchHistory() {
        fetch(`${API_URL}/translations`)
            .then(response => response.json())
            .then(translations => {
                renderHistory(translations);
            })
            .catch(err => console.error('Error fetching history:', err));
    }

    function renderHistory(translations) {
        historyList.innerHTML = '';
        if (translations.length === 0) {
            historyList.innerHTML = '<li>No hay traducciones recientes.</li>';
            return;
        }

        translations.forEach(t => {
            const li = document.createElement('li');
            li.className = 'history-item';

            // Create content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'history-content';

            // Format: [ES -> EN] Hola -> Hello
            // Truncate long texts for display
            const sourcePreview = t.texto_origen.length > 30 ? t.texto_origen.substring(0, 30) + '...' : t.texto_origen;
            const targetPreview = t.texto_destino.length > 30 ? t.texto_destino.substring(0, 30) + '...' : t.texto_destino;

            contentDiv.innerHTML = `
                <strong>${t.idioma_origen.toUpperCase()} &rarr; ${t.idioma_destino.toUpperCase()}</strong>: 
                <span>${sourcePreview}</span> &rarr; <span>${targetPreview}</span>
            `;

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.title = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTranslation(t.id);

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            historyList.appendChild(li);
        });
    }

    async function deleteTranslation(id) {
        try {
            const response = await fetch(`${API_URL}/translations/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchHistory();
            } else {
                showMessage('Error al eliminar traducción.', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Error de conexión.', 'error');
        }
    }
});
