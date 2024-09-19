import express from "express";
import * as SkillController from "../controller/SkillController.js";
import { auth as checkAuth } from "../middlewares/auth.js";

const router = express.Router();


router.post("/create", checkAuth, SkillController.crearSkill);
router.delete("/delete/:id", checkAuth, SkillController.eliminarSkill);
router.put("/update/:id", checkAuth, SkillController.actualizarSkill);
router.get("/list/:page?", checkAuth, SkillController.listarSkill)

//listado publico 
router.get("/listado", SkillController.listado)

// Exportar router
export default router;
