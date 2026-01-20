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

## 📌 Endpoints con ejemplos

## 👤 Usuarios

### 🔹 Registro
**POST** `/api/user/register`

**Request**
```json
{
  "name": "Francisco Alfaro",
  "email": "francisco@email.com",
  "password": "123456"
}
```

**Response**
```json
{
  "status": "success",
  "message": "Usuario registrado correctamente"
}
```

---

### 🔹 Login
**POST** `/api/user/login`

**Request**
```json
{
  "email": "francisco@email.com",
  "password": "123456"
}
```

**Response**
```json
{
  "status": "success",
  "token": "jwt_token_aqui",
  "user": {
    "_id": "123",
    "name": "Francisco Alfaro"
  }
}
```

---

### 🔹 Perfil
**GET** `/api/user/profile/:id`

**Response**
```json
{
  "_id": "123",
  "name": "Francisco Alfaro",
  "email": "francisco@email.com",
  "avatar": "avatar.png"
}
```

---

## 📄 CV

### Subir CV
**POST** `/api/cv/uploadcv`

- Content-Type: `multipart/form-data`
- Campo: `file0`

**Response**
```json
{
  "status": "success",
  "message": "CV subido correctamente"
}
```

---

## 🧠 Skills

### Crear Skill
**POST** `/api/skill/create`

**Request**
```json
{
  "name": "Node.js",
  "level": "Avanzado"
}
```

**Response**
```json
{
  "status": "success",
  "skill": {
    "_id": "abc123",
    "name": "Node.js"
  }
}
```

---

## 📁 Proyectos

### Crear Proyecto
**POST** `/api/project/create`

**Request**
```json
{
  "title": "API Portafolio",
  "description": "Backend profesional con Node.js",
  "url": "https://github.com/franciscoalfaro/api-portafolio"
}
```

**Response**
```json
{
  "status": "success",
  "project": {
    "_id": "xyz789",
    "title": "API Portafolio"
  }
}
```

---

## ✉️ Contacto

### Enviar mensaje
**POST** `/api/contacto/crear`

**Request**
```json
{
  "name": "Juan",
  "email": "juan@email.com",
  "message": "Hola, quiero contactarte"
}
```

**Response**
```json
{
  "status": "success",
  "message": "Mensaje enviado correctamente"
}
```

---

## ⚛️ Uso desde Frontend (React / Vue)

### Ejemplo con Fetch
```js
fetch("http://localhost:3008/api/user/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "francisco@email.com",
    password: "123456"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### Ejemplo con Axios
```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3008",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

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
