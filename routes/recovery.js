import express from "express";
import * as RecoveryController from "../controller/RecoveryController.js";

const router = express.Router()


router.post("/request-reset", RecoveryController.requestPasswordReset)
router.post("/reset-password", RecoveryController.resetPasswordWithToken)

//exportar router
export default router;