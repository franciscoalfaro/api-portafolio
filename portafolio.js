//importar dependencia de conexion
import {connection} from './database/connection.js'
import express from "express"
import cors from  "cors"
import { createServer } from "http";
import { Server } from "socket.io";

import { getSocketSpace, obtenerDatosServidor } from './controller/SpaceController.js'; 

// efectuar conexion a BD
connection();

//crear conexion a servidor de node
const app = express();
const puerto = 3008;

// crear servidor HTTP con express
const server = createServer(app);

// configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // permitir cualquier origen, puedes limitarlo si lo necesitas
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Disposition"],
    credentials: true
  }
});

app.use(cors({
    origin: 'https://dashboard.franciscoalfaro.cl',  // Cambia esto a la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Para permitir que las cookies o las credenciales se envíen si es necesario
}));

//configurar cors
app.use(cors({
    exposedHeaders: ['Content-Disposition']
  }));

//conertir los datos del body a obj js
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//cargar rutas
import UserRoutes from "./routes/user.js";
import RecoveryRoutes from "./routes/recovery.js";
import SpaceRoutes from "./routes/space.js";
import StackRoutes from "./routes/stack.js";
import SkillRoutes from "./routes/skill.js";
import RedesRoutes from "./routes/redes.js";
import ProjectRoutes from "./routes/proyectos.js";
import ContactoRoutes from "./routes/contacto.js";


// llamado a la ruta user
app.use("/api/user", UserRoutes);

//recovery
app.use("/api/recovery", RecoveryRoutes)

//espacio
app.use("/api/space",SpaceRoutes)

//stack
app.use("/api/stack",StackRoutes)

//skill
app.use("/api/skill",SkillRoutes)

//proyectos
app.use("/api/project",ProjectRoutes)

//redes
app.use("/api/redes",RedesRoutes)

//contacto
app.use("/api/contacto",ContactoRoutes)


// lógica de Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Emitir datos del servidor periódicamente
  const intervalo = setInterval(async () => {
    try {
      const datosServidor = obtenerDatosServidor(); // Datos del servidor (síncrono)      
      socket.emit('estadoServidor', datosServidor); // Enviar datos al cliente

    } catch (error) {
      console.error('Error al obtener datos del disco:', error);
    }
    //para emitir por socket el estado del disco
    //await getSocketSpace(socket);
  }, 5000); // Emitir cada 5 segundos

  // Escuchar eventos desde el cliente
  socket.on('mensaje', (data) => {
    console.log(`Mensaje recibido: ${data}`);
    
    // Emitir respuesta a todos los clientes conectados
    io.emit('mensaje', data);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    clearInterval(intervalo); // Limpiar intervalo cuando se desconecta
  });
});


server.listen(puerto, ()=> {
    console.log("Server runing in port :" +puerto)
})