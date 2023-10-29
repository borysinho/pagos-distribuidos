import { Router } from "express";
import middleware from "../middleware/job.queue.middleware.js";
import personaController from "../controllers/persona.controller.js";

const router = Router();

// router.get("/personas", middleware.jobQueueMiddleware, (req, res) => {
//   res.json(`Trabajo registrado. [JOB: ${req.jobId}]`);
// });

// router.get("/personas/:id", middleware.jobQueueMiddleware, (req, res) => {
//   res.json(`Trabajo registrado. [JOB: ${req.jobId}]`);
// });

router.get("/personas", personaController.getAllPersonas);
router.get("/personas/:id", personaController.getPersona);

export default router;
