# API Portafolio 🚀

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![AWS](https://img.shields.io/badge/Deployed-AWS-orange?logo=amazon-aws)
![License](https://img.shields.io/badge/License-MIT-blue)

API REST desarrollada en **Node.js + Express** para gestionar un **portafolio profesional**, incluyendo usuarios, CV, proyectos, skills, stacks tecnológicos, redes sociales y formulario de contacto.  
Incluye **Socket.IO** para emitir información del estado del servidor en tiempo real.

---

## 🛠 Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT
- Multer
- Cors
- Dotenv

---

## 📦 Instalación

```bash
git clone https://github.com/franciscoalfaro/api-portafolio.git
cd api-portafolio
npm install
```

---

## ▶️ Ejecución

```bash
npm run dev
```

Servidor disponible en:

```
http://localhost:3008
```

---

## ⚙️ Variables de entorno (.env)

```env
PORT=3008
MONGO_URI=mongodb://localhost:27017/portafolio
JWT_SECRET=clave_secreta
```

---

## 📂 Estructura del proyecto

```
src/
├── controller/
├── database/
│   └── connection.js
├── models/
├── routes/
├── helpers/
├── index.js
```

---

## 🔐 Autenticación

Los endpoints protegidos requieren un **JWT** enviado en el header:

```http
Authorization: Bearer <token>
```

---

## 📌 Endpoints API

### 👤 Usuarios

| Método | Ruta | Descripción | Auth |
|------|------|------------|------|
| POST | /api/user/register | Registro de usuario | ❌ |
| POST | /api/user/login | Login de usuario | ❌ |
| GET | /api/user/profile/:id | Obtener perfil | ✅ |
| PUT | /api/user/update | Actualizar usuario | ✅ |
| POST | /api/user/upload | Subir avatar | ✅ |
| GET | /api/user/avatar/:file | Obtener avatar | ❌ |
| GET | /api/user/listado | Listado público | ❌ |

---

### 📄 CV

| Método | Ruta | Descripción | Auth |
|------|------|------------|------|
| POST | /api/cv/uploadcv | Subir CV | ✅ |
| GET | /api/cv/obtenercv | Listar CV | ❌ |
| GET | /api/cv/mostrarcv/:file | Ver CV | ❌ |
| GET | /api/cv/download/:fileId | Descargar CV | ❌ |
| DELETE | /api/cv/delete/:fileId | Eliminar CV | ✅ |

---

### 🧠 Skills

| Método | Ruta | Descripción | Auth |
|------|------|------------|------|
| POST | /api/skill/create | Crear skill | ✅ |
| PUT | /api/skill/update/:id | Actualizar skill | ✅ |
| DELETE | /api/skill/delete/:id | Eliminar skill | ✅ |
| GET | /api/skill/list/:page? | Listar skills | ✅ |
| GET | /api/skill/listado | Listado público | ❌ |

---

### 📁 Proyectos

| Método | Ruta | Descripción | Auth |
|------|------|------------|------|
| POST | /api/project/create | Crear proyecto | ✅ |
| PUT | /api/project/update/:id | Actualizar proyecto | ✅ |
| DELETE | /api/project/deleteproyecto/:id | Eliminar proyecto | ✅ |
| POST | /api/project/uploads/:id | Subir imágenes | ✅ |
| GET | /api/project/listado | Listado público | ❌ |

---

### ✉️ Contacto

| Método | Ruta | Descripción |
|------|------|------------|
| POST | /api/contacto/crear | Enviar mensaje |

---

## 🔌 Socket.IO

Conexión:

```js
const socket = io("http://localhost:3008", {
  path: "/api-portafolio/socket.io/"
});
```

Evento emitido:
- estadoServidor (cada 5 segundos)

---

## 👨‍💻 Autor

Francisco Alfaro  
Backend Developer – MERN Stack  
https://github.com/franciscoalfaro

---

## 📄 Licencia

MIT
