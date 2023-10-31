import { Router } from "express";
import controller from "../controllers/threads.controller.js";

const router = Router();

// router.get("/threads/services", controller.getServiceWorkerThreadCount);
// router.get(
//   "/threads/notifications",
//   controller.getNotificationWorkerThreadCount
// );

router.post("/threads/services/:id", controller.setServiceWorkerThreadCount);
router.post(
  "/threads/notifications/:id",
  controller.setNotificationWorkerThreadCount
);

export default router;
