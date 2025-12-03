# 🌐 Proyecto: Traductor IA con Ollama + SQLite + Frontend Web

---

## Autores

- **Diana (Frontend, DB, DevOps, QA)**
- **Ángel (Backend, API, Integración IA, DevOps)**

---

# 1. Descripción del proyecto

Este proyecto implementa una **aplicación web completa** (full-stack) que permite traducir textos utilizando un **modelo IA ejecutado en un contenedor (Docker) a través de Ollama**.
Incluye:

- **Backend con Node.js + Express**
- **Base de datos SQLite** para almacenar el historial
- **Frontend HTML/CSS/JS vanilla**
- **Contenedores Docker (backend + frontend + ollama)**
- **API REST completa** para traducción y gestión del historial

El objetivo es desarrollar un agente de traducción funcional, documentado y preparado para producción mediante Docker Compose.

---

## 🖥️ 2. Requisitos del sistema (actualizado)

**Software necesario**

- Node.js (v18 o superior)
- NPM (o Yarn)
- SQLite3 (o el cliente que prefieras para inspeccionar la DB)
- Docker y Docker Compose (opcional para despliegue)
- Ollama instalado y funcionando localmente

**Dependencias de backend (npm)**
El backend utiliza las siguientes librerías (con versiones recomendadas):

- `better-sqlite3` `^12.4.1`
- `cors` `^2.8.5`
- `dotenv` `^17.2.3`
- `express` `^5.1.0`
- `uuid` `^13.0.0`

---

# 3. Instalación

## 3.1 Clonar el repositorio

```bash
git clone git@github.com:Diana27106/Agentes-Ia.git
cd traductor-ia
```

---

## 3.2 Instalar dependencias

### Backend:

```bash
cd backend
npm install
```

### Dependencias

Desde la carpeta `backend/` puedes instalar las dependencias con este comando:

```bash
cd backend
npm install better-sqlite3@^12.4.1 cors@^2.8.5 dotenv@^17.2.3 express@^5.1.0 uuid@^13.0.0
```

> Alternativa: añade estas dependencias en `backend/package.json` y luego ejecuta `npm install` para instalarlas todas de una vez.

### Frontend:

(No requiere instalación, es HTML/CSS/JS)

---

## 3.3 Descargar el modelo de Ollama

Asegúrate de tener Ollama instalado y ejecuta:

```bash
ollama pull mistral
```

---

## 3.4 Configurar el archivo `.env`

Dentro de `/backend/.env`:

```
PORT=
HOST=
SERVER_URL=
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral:7b
DB_PATH=./path/db.js
MAX_TEXT_LENGTH=500
```

---

# 4. Ejecución del proyecto

## 4.1 Ejecución en desarrollo (requiere 3 terminales)

### **Terminal 1 – Backend**

```bash
cd backend
npm start
```

### **Terminal 2 – Frontend**

Usando un servidor simple:

```bash
cd frontend
npx serve
```

O si usáis Live Server, basta con abrir index.html.

### **Terminal 3 – Ollama**

```bash
ollama serve
```

---

## 4.2 Ejecución con Docker Compose (1 solo comando)

```bash
docker compose up --build
```

---

## 4.3 URLs de acceso

| Servicio    | URL                                              |
| ----------- | ------------------------------------------------ |
| Frontend    | [http://localhost:5173](http://localhost:5173)   |
| Backend API | [http://localhost:4000](http://localhost:4000)   |
| Ollama      | [http://localhost:11434](http://localhost:11434) |

---

# 5. API – Endpoints

| Método | Endpoint | Descripción | Cuerpo (JSON) / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica el estado del servidor y conexión con Ollama | - |
| `POST` | `/api/translate` | Traduce un texto | `{ "text": "Hola", "sourceLang": "es", "targetLang": "en" }` |
| `GET` | `/api/translations` | Obtiene el historial de traducciones | `?limit=50` (opcional) |
| `GET` | `/api/translations/:id` | Obtiene una traducción por ID | - |
| `DELETE` | `/api/translations/:id` | Elimina una traducción por ID | - |
| `DELETE` | `/api/translations` | Elimina todo el historial | - |
| `GET` | `/api/languages` | Lista los idiomas soportados | - |

---

# 6. Estructura de carpetas

```
/project
│
├── backend
│   ├── server.js          # Servidor Express y configuración general
│   ├── routes.js          # Rutas REST
│   ├── db.js              # Lógica de la base de datos
│   ├── services.js        # Comunicación con la IA
│   ├── db/
│   │   └── traducciones.db # Base de datos
│   ├── Dockerfile
│   ├── node_modules
│   ├── .dockerignore
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── index.html         # Interfaz principal
│   ├── style.css         # Diseño visual
│   ├── main.js             # Lógica de traducción e historial
│   └── Dockerfile
│
├── docker-compose.yml
├── checklist.md
├── validacion.http
├── .gitignore
└── README.md
```

---

# 7. Decisiones de diseño

### **✔️ ¿Por qué SQLite3 en lugar de JSON?**

- No requiere servidor externo
- Mejor consistencia y consultas
- Permite crecer el proyecto (joins, índices, migraciones)

### **✔️ ¿Por qué JavaScript vanilla en el frontend?**

- Código más ligero
- Fácil despliegue en cualquier entorno

### **✔️ ¿Por qué Ollama local?**

- Computo 100% privado
- Posibilidad de probar modelos offline
- Instalación sencilla

### **✔️ Limitaciones conocidas**

- Traducciones largas pueden tardar
- No existe autenticación
- No hay soporte multisesión
- El historial no tiene paginación

---

# 8. Extensiones futuras

- Soporte para más idiomas
- Caché de traducciones frecuentes
- Detección automática del idioma
- Exportar historial a CSV / PDF
- Interfaz oscura (Dark Mode)
- Integrar WebSockets para ver el progreso en tiempo real
- Autenticación de usuarios
