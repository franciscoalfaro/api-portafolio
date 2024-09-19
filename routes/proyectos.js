import express from "express";
import multer from "multer";
import * as ProyectosController from "../controller/ProyectosController.js";
import { auth as checkAuth } from "../middlewares/auth.js";

const router = express.Router();

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La carpeta se definirá en el controlador
        cb(null, "./uploads/proyectos");
    },
    filename: (req, file, cb) => {
        cb(null,"products-"+Date.now()+"-"+file.originalname); // Usar un nombre único para evitar colisiones
    }
});

const uploads = multer({ storage });


router.post("/create", checkAuth, ProyectosController.crearProyecto);
// Endpoint para subir y eliminar imagenes del proyecto
router.post("/uploads/:id",[checkAuth, uploads.array("files")], ProyectosController.upload)

//imagen
router.delete("/deleteimagen/:id", checkAuth,ProyectosController.eliminarImagen)
//proyecto
router.delete("/deleteproyecto/:id", checkAuth,ProyectosController.eliminarProyecto)

router.get("/list/:page?", checkAuth, ProyectosController.listarProyecto)
router.put("/update/:id", checkAuth, ProyectosController.actualizarProyecto);

router.get("/obtenido/:id", ProyectosController.obtenerProyecto)

router.get("/media/:file", ProyectosController.media)


//listado publico
router.get("/listado", ProyectosController.listado)

// Exportar router
export default router;