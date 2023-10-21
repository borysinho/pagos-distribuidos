import { Router } from "express";
import controller from "../controllers/cajeros.controller.js";

const router = Router();

router.post("/cajeros/:id", controller.postCajero);

export default router;
