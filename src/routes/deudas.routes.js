import { Router } from "express";
import controller from "../controllers/deudas.controller.js";

const router = Router();

router.get("/deudas", controller.getAllDeudas);
router.get("/deudas/:id", controller.getDeuda);
router.get("/deudas/persona/:id", controller.getDeudasPersona);

export default router;
