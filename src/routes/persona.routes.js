import { Router } from "express";
import controller from "../controllers/persona.controller.js";

const router = Router();

router.get("/personas", controller.getAllPersonas);
router.get("/personas/:id", controller.getPersona);

export default router;
