import express from "express";
import * as StackController from "../controller/StackController.js";
import { auth as checkAuth } from "../middlewares/auth.js";

const router = express.Router();


router.post("/create", checkAuth, StackController.crearStack);
router.delete("/delete/:id", checkAuth, StackController.eliminarStack);
router.put("/update/:id", checkAuth, StackController.actualizarStack);
router.get("/list/:page?", checkAuth, StackController.listarStacks)

//listado publico 
router.get("/listado", StackController.listado)

// Exportar router
export default router;
