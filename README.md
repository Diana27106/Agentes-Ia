# 🌐 Traductor IA

## Descripción general

**Traductor IA** es una aplicación **full-stack** que permite traducir texto entre tres idiomas: **Español**, **Inglés** y **Francés**, en cualquier dirección (es→en, es→fr, en→fr, etc.).

El proyecto integra un **backend en Node.js + Express** conectado a **Ollama**, un modelo de lenguaje local, para realizar las traducciones mediante IA. Las traducciones se almacenan automáticamente en una base de datos **SQLite3**, lo que permite mantener un **historial persistente** de las operaciones realizadas.

El **frontend**, desarrollado en **HTML, CSS y JavaScript vanilla**, proporciona una interfaz intuitiva donde el usuario puede:

- Ingresar texto a traducir
- Seleccionar idioma de origen y destino
- Ver la traducción en tiempo real
- Consultar el historial de traducciones anteriores
- Filtrar o eliminar traducciones guardadas

---

## 🧱 Estructura general del proyecto

```

traductor-ia-diana-rg-angel-/
│
├── 📂 backend/
│ ├── 📄 server.js # Servidor Express (punto de entrada)
│ ├── 📄 routes.js # Definición de rutas de la API REST
│ ├── 📄 services.js # Lógica de negocio: conexión a Ollama + gestión de historial
│ ├── 📄 db.js # Configuración e inicialización de la base de datos SQLite3
│ ├── 📂 db/
│ │ └── 📄 traducciones.db # Base de datos generada (no versionada)
│ ├── 🔐 .env # Variables de entorno (no versionado)
│ ├── 📋 .env.example # Ejemplo de configuración
│ ├── 🐳 Dockerfile # Imagen del servicio backend
│ └── 📦 package.json # Dependencias y scripts del backend
│
├── 📂 frontend/
│ ├── 📄 index.html # Interfaz principal
│ ├── 📄 style.css # Estilos CSS (vanilla)
│ ├── 📄 main.js # Lógica del frontend
│ └── 📂 images/ # Recursos o capturas opcionales
│
├── 🧪 validacion.http # Pruebas manuales de endpoints API
├── 🐳 docker-compose.yml # Orquestación de contenedores (backend + Ollama)
├── 📖 README.md # Documentación completa del proyecto
├── ✅ checklist.md # Control del progreso del desarrollo
└── 🚫 .gitignore # Archivos y carpetas excluidas del control de versiones

```

---

## 👩‍💻 Autores

**[Diana Alejandra Radu Giju, Ángel ]**

---

## 🧩 Requisitos del sistema

### 🔧 Software necesario

- **Node.js** v20 o superior
- **npm** (incluido con Node)
- **Ollama** instalado localmente (modelo: mistral:7b)
- **SQLite3** (para la base de datos embebida)
- **Docker + Docker Compose** V2
- **Visual Studio Code** como editor
- **Git** instalado
- **Rest Client** en VC para validar

### 📦 Dependencias principales

#### Backend

- `cors` — Comunicación entre frontend y backend en diferentes origenes
- `express` — Servidor HTTP para la API REST
- `sqlite3` — Base de datos local ligera
- `dotenv` — Gestión de variables de entorno
