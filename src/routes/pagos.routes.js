import { Router } from "express";
import controller from "../controllers/pagos.controller.js";
const router = Router();

router.get("/pagos", controller.getAllPagos);
router.get("/pagos/:id", controller.getPago);
router.post("/pagos", controller.createPago);

export default router;
