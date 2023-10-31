import express from "express";
import cors from "cors";
import pagos from "./routes/pagos.routes.js";
import deudas from "./routes/deudas.routes.js";
import personas from "./routes/persona.routes.js";
import threads from "./routes/threads.routes.js";
import jobWorker from "./services/workers/jobs.services.workers.js";
import notifWorker from "./services/workers/notifications.services.workers.js";
import lazyWorker from "./services/workers/lazy.services.workers.js";
import queuesService from "./services/queues.service.js";
import dotenv from "dotenv";
import Arena from "bull-arena";
import { Queue } from "bullmq";

dotenv.config();
const app = express();

//RUTAS
app.use(cors());
app.use(express.json());

app.use("/api", pagos);
app.use("/api", deudas);
app.use("/api", personas);
app.use("/api", threads);

app.post("/api/messages", (req, res) => {
  res.send("Mensaje recibido");
});

app.use(
  "/",
  new Arena(
    {
      BullMQ: Queue,
      queues: queuesService.arenaQueues,
    },
    {
      basePath: "/arena",
      disableListen: true,
    }
  )
);

app.listen(process.env.SERVERPORT || 3000, () => {
  console.log("Servidor iniciado. Puerto 3000");
  jobWorker.worker;
  notifWorker.worker;
  lazyWorker.worker;
});
