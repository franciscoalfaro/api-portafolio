import express from "express";
import multer from "multer";
import * as CvController from "../controller/CvController.js";
import { auth as checkAuth } from "../middlewares/auth.js";

const router = express.Router();

// Configuración de subida para CVs
const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/cvs"); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        cb(null, "cv-" + Date.now() + "-" + file.originalname);
    }
});

// Middleware de multer para CVs
const cvUploads = multer({ storage: cvStorage });


router.delete("/delete/:fileId", checkAuth,CvController.deleteFile)
//subir cv obtener cv
router.post("/uploadcv", [checkAuth, cvUploads.single("file0")], CvController.subircv);
//listar cv
router.get('/obtenercv', CvController.obtenercv)
//para mostrar en el front
router.get('/mostrarcv/:file', CvController.mostrarCV)
//para descargar
router.get("/download/:fileId", CvController.downloadFile);

// Exportar router
export default router;
