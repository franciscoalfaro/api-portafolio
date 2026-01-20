#API PORTAFOLIO

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![AWS](https://img.shields.io/badge/Deployed-AWS-orange?logo=amazon-aws)
![License](https://img.shields.io/badge/License-MIT-blue)
==============

API Portafolio es un backend desarrollado en Node.js + Express usando ES Modules.
Está diseñado para soportar un portafolio profesional dinámico, permitiendo la
gestión de usuarios, CV, proyectos, habilidades, stacks tecnológicos, redes
sociales, contacto y monitoreo del estado del servidor.
Incluye Socket.IO para comunicación en tiempo real.

--------------------------------------------------

TECNOLOGÍAS
-----------

- Node.js + Express (ES Modules)
- MongoDB + Mongoose
- Socket.IO (tiempo real)
- JWT para autenticación
- Multer para subida de archivos
- dotenv para variables de entorno
- CORS
- Arquitectura modular (routes / controllers)

--------------------------------------------------

INSTALACIÓN Y EJECUCIÓN LOCAL
-----------------------------

Clonar el repositorio:

git clone https://github.com/franciscoalfaro/api-portafolio.git
cd api-portafolio

Instalar dependencias:

npm install

Crear archivo .env basado en .env.example:

PORT=3008
MONGODB_URI=mongodb://<usuario>:<password>@host:puerto/bd
JWT_SECRET=tu_secreto_jwt

Ejecutar el servidor:

npm run dev    (modo desarrollo)
npm start      (producción)

--------------------------------------------------

ESTRUCTURA DEL PROYECTO
-----------------------

api-portafolio/
│
├── controllers/      Controladores por módulo
├── routes/           Endpoints de la API
├── database/         Conexión a MongoDB
├── middlewares/      Auth, Multer, validaciones
├── helpers/          Funciones auxiliares
├── uploads/          Archivos subidos
├── server.js         Punto de entrada
├── .env
├── .env.example
└── package.json

--------------------------------------------------

AUTENTICACIÓN
-------------

La API utiliza JWT.
Las rutas protegidas requieren el header:

Authorization: Bearer <token>

--------------------------------------------------

ENDPOINTS
---------

USUARIO /api/user
-----------------
POST    /register          Registro de usuario
POST    /login             Login
GET     /profile/:id       Obtener perfil (JWT)
PUT     /update             Actualizar usuario (JWT)
POST    /upload             Subir avatar (JWT)
GET     /avatar/:file       Obtener avatar
GET     /listado            Listado público de usuarios

--------------------------------------------------

CV /api/cv
----------
POST    /uploadcv           Subir CV (JWT)
GET     /obtenercv          Obtener CV
GET     /mostrarcv/:file    Mostrar CV
GET     /download/:fileId   Descargar CV
DELETE  /delete/:fileId     Eliminar CV (JWT)

--------------------------------------------------

RECOVERY /api/recovery
---------------------
POST    /newpass            Recuperar contraseña

--------------------------------------------------

ESPACIO SERVIDOR /api/space
---------------------------
GET     /disk-space         Información de disco (JWT)

--------------------------------------------------

STACK TECNOLÓGICO /api/stack
----------------------------
POST    /create
PUT     /update/:id
DELETE  /delete/:id
GET     /list/:page?
GET     /listado

--------------------------------------------------

SKILLS /api/skill
-----------------
POST    /create
PUT     /update/:id
DELETE  /delete/:id
GET     /list/:page?
GET     /listado

--------------------------------------------------

PROYECTOS /api/project
----------------------
POST    /create              Crear proyecto
PUT     /update/:id          Actualizar proyecto
DELETE  /deleteproyecto/:id  Eliminar proyecto
POST    /uploads/:id         Subir imágenes
DELETE  /deleteimagen/:id    Eliminar imagen
GET     /list/:page?         Listar proyectos (JWT)
GET     /listado             Listado público
GET     /obtenido/:id        Obtener proyecto
GET     /media/:file         Obtener media

--------------------------------------------------

REDES SOCIALES /api/redes
-------------------------
POST    /create
PUT     /update/:id
DELETE  /delete/:id
GET     /list/:page?
GET     /listado

--------------------------------------------------

CONTACTO /api/contacto
----------------------
POST    /crear               Enviar mensaje de contacto

--------------------------------------------------

SOCKET.IO
---------

Path de conexión:
/api-portafolio/socket.io/

Eventos:
- estadoServidor  -> Emite información del servidor cada 5 segundos
- mensaje         -> Comunicación bidireccional cliente-servidor

--------------------------------------------------

DESPLIEGUE
----------

Compatible con:
- VPS + PM2
- Docker
- AWS EC2
- Railway / Render

--------------------------------------------------

ROADMAP
-------

- Documentación Swagger / OpenAPI
- Roles y permisos
- Tests unitarios y de integración
- Caché para endpoints públicos
- Dashboard administrativo

--------------------------------------------------

AUTOR
-----

Francisco Alfaro
GitHub: https://github.com/franciscoalfaro

--------------------------------------------------

LICENCIA
--------

MIT
