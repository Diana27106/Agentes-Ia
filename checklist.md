# CheckList - Formato Tabla

---

## ⚙️ **Backend**

| Task                                         | Phase          | Complexity | Dependencies      | Status  |
| -------------------------------------------- | -------------- | ---------- | ----------------- | ------- |
| Configurar entorno Node.js y Express         | Inicialización | 🟢 Baja    | Node.js           | Done    |
| Crear servidor básico (`server.js`)          | Desarrollo     | 🟢 Baja    | Express           | Pending |
| Implementar rutas REST (`routes.js`)         | Desarrollo     | 🟡 Media   | Express           | Pending |
| Conectar con servicio Ollama (`services.js`) | Integración    | 🔴 Alta    | Ollama API, Axios | Pending |
| Manejo de errores y logs                     | Mantenimiento  | 🟡 Media   | Express           | Pending |
| Habilitar CORS                               | Configuración  | 🟢 Baja    | cors              | Done    |

---

## 🗄️ **Base de datos**

| Task                                             | Phase          | Complexity | Dependencies | Status  |
| ------------------------------------------------ | -------------- | ---------- | ------------ | ------- |
| Configurar SQLite3 (`db.js`)                     | Inicialización | 🟢 Baja    | sqlite3      | Done    |
| Crear tabla de traducciones                      | Desarrollo     | 🟡 Media   | db.js        | Done    |
| Implementar inserción automática al traducir     | Integración    | 🟡 Media   | services.js  | Pending |
| Implementar endpoints de historial (GET, DELETE) | Desarrollo     | 🟡 Media   | routes.js    | Pending |
| Pruebas de persistencia y consultas              | Testing        | 🟡 Media   | sqlite3      | Pending |

---

## 💻 **Frontend**

| Task                                              | Phase          | Complexity | Dependencies      | Status  |
| ------------------------------------------------- | -------------- | ---------- | ----------------- | ------- |
| Crear estructura HTML base                        | Inicialización | 🟢 Baja    | —                 | Pending |
| Diseñar estilos CSS                               | Desarrollo     | 🟡 Media   | style.css         | Pending |
| Implementar lógica JS para traducción (`main.js`) | Integración    | 🔴 Alta    | API REST          | Pending |
| Mostrar historial de traducciones                 | Integración    | 🟡 Media   | main.js, API REST | Pending |
| Añadir filtros y botón de eliminación             | Mejora         | 🟡 Media   | main.js           | Pending |

---

## 🐳 **Infraestructura**

| Task                                 | Phase          | Complexity | Dependencies   | Status      |
| ------------------------------------ | -------------- | ---------- | -------------- | ----------- |
| Crear `Dockerfile` del backend       | Inicialización | 🟡 Media   | Node.js        | In progress |
| Configurar `docker-compose.yml`      | Integración    | 🟡 Media   | Docker, Ollama | Pending     |
| Configurar `.env` y `.env.example`   | Configuración  | 🟢 Baja    | dotenv         | Pending     |
| Crear `.gitignore` y `.dockerignore` | Configuración  | 🟢 Baja    | —              | Pending     |

---

## 🧪 **Pruebas y Validación**

| Task                              | Phase   | Complexity | Dependencies    | Status  |
| --------------------------------- | ------- | ---------- | --------------- | ------- |
| Crear archivo `validacion.http`   | Testing | 🟢 Baja    | API REST        | Pending |
| Testear endpoints de traducción   | Testing | 🟡 Media   | Express, Ollama | Pending |
| Verificar historial y eliminación | Testing | 🟡 Media   | SQLite3         | Pending |
| Validación manual del frontend    | Testing | 🟢 Baja    | Browser         | Pending |

---

## 🧾 **Documentación**

| Task                          | Phase         | Complexity | Dependencies | Status      |
| ----------------------------- | ------------- | ---------- | ------------ | ----------- |
| Crear `README.md` completo    | Documentación | 🟡 Media   | —            | In progress |
| Redactar `checklist.md`       | Documentación | 🟢 Baja    | README.md    | In progress |
| Agregar comentarios en código | Mantenimiento | 🟢 Baja    | —            | Pending     |

---
