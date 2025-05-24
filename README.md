# 🌐 ACEF — Aplicación de Control y Evolución Formativa

> Plataforma web para la **gestión académica**, el **seguimiento formativo** y la **integración institucional** en ambientes educativos del **SENA**.

---

## 🧩 ¿Qué es ACEF?

**ACEF** es una solución integral desarrollada por aprendices del SENA para facilitar la administración académica en programas de formación. Está enfocada en:

- Simplificar la gestión de fichas, competencias y aprendices.
- Brindar seguimiento a resultados de aprendizaje.
- Emitir alertas institucionales automatizadas.
- Sincronizar datos con plataformas como **SENA Sofía**.

> 🎯 Problema resuelto: Falta de una herramienta digital unificada para seguimiento, gestión de actas y comunicación académica con integración a los sistemas existentes del SENA.

---

## 👥 Equipo de Desarrollo

Aprendices del Centro de Gestión de Mercados, Logística y Tecnologías de la Información:

- 👩‍💻 Laura Liseth Buitrago Castillo  
- 👩‍💻 Leslye Marcela Buitrago Mora  
- 👨‍💻 Samuel Andrés Torres Romero  
- 👨‍💻 David Santiago Rubiano Hernández  

---

## ⚙️ Configuración del Entorno de Desarrollo

### 🔐 Prerrequisitos

- Node.js (v18 o superior)
- MySQL o MariaDB
- Git

### 📦 Clonar el Repositorio

```bash
git clone https://github.com/usuario/acef-project.git
cd acef-project
```

---

## 🚀 Instalación y Ejecución

### 🔧 Backend (Express + MySQL)

1. Instalar dependencias:

```bash
cd server
npm install
```

2. Configurar variables de entorno:

Crea un archivo `.env` con los siguientes datos:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
```

3. Iniciar servidor:

```bash
npm run dev
```

📍 Disponible en: [http://localhost:3000](http://localhost:3000)

---

### 🖥️ Frontend (HTML, JS o React)

Si usas proyecto estático (HTML):

```bash
cd client
# Abrir index.html manualmente
```

Si está migrado a React:

```bash
cd client
npm install
npm run dev
```

📍 Disponible en: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Tecnologías Utilizadas

| Frontend        | Backend          | Base de Datos |
|-----------------|------------------|---------------|
| HTML, CSS, JS / React + Vite | Node.js + Express | MySQL |

Otras herramientas:

- Axios / Fetch API
- ESLint + Prettier
- GitHub Actions (CI/CD)
- Dotenv
- Nodemon

---

## 📚 Funcionalidades Clave

- Selección de centro y coordinación.
- Inicio y cierre de sesión.
- Búsqueda avanzada por ficha, trimestre, competencia.
- Visualización de aprendizajes y progreso.
- Alertas y notificaciones automáticas.
- Subida de actas y conexión con **SENA Sofía**.

---

## 📄 Licencia

Distribuido bajo la Licencia MIT.

---

## 💬 Contacto

Para soporte o sugerencias, contactar al equipo en el aula virtual SENA o vía correo institucional.