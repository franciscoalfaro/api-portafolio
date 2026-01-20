# API Portafolio 🚀

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![AWS](https://img.shields.io/badge/Deployed-AWS-orange?logo=amazon-aws)
![License](https://img.shields.io/badge/License-MIT-blue)

API REST desarrollada en **Node.js + Express** para gestionar un **portafolio profesional**, incluyendo usuarios, CV, proyectos, skills, stacks tecnológicos, redes sociales y formulario de contacto.  
Incluye **Socket.IO** para emitir información del estado del servidor en tiempo real y está pensada para ser consumida desde **frontends React o Vue**.

---

## 🛠 Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT (JSON Web Token)
- Multer (uploads)
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

Servidor por defecto:

```
http://localhost:3008
```

---

## ⚙️ Variables de entorno (.env)

```env
PORT=3008
MONGO_URI=mongodb://localhost:27017/portafolio
JWT_SECRET=tu_clave_secreta
```

---

## 🔐 Autenticación (JWT)

La API utiliza **Bearer Token**.

### Ejemplo Header
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

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

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3008", {
  path: "/api-portafolio/socket.io/"
});

socket.on("estadoServidor", data => {
  console.log("Estado del servidor:", data);
});
```

---

## 👨‍💻 Autor

**Francisco Alfaro**  
Backend Developer – MERN Stack  
GitHub: https://github.com/franciscoalfaro

---

## 📄 Licencia

MIT
