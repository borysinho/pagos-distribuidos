import { Router } from "express";
import controller from "../controllers/pagos.controller.js";
import middleware from "../middleware/job.queue.middleware.js";
const router = Router();

// router.get("/personas", middleware.jobQueueMiddleware, (req, res) => {
//   res.json(`Trabajo registrado. [JOB: ${req.jobId}]`);
// });

router.get("/pagos", controller.getAllPagos);
router.get("/pagos/:id", controller.getPago);
router.post("/pagos", middleware.jobQueueMiddleware, (req, res) => {
  res.json(`Trabajo registrado. [JOB: ${req.jobId}]`);
});
//router.post("/pagos", controller.createPago);

export default router;
