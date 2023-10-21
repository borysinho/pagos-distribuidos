import express, { Request, QueueScheduler, json } from "express";
import { Queue } from "bullmq";
import cors from "cors";
import pagos from "./routes/pagos.routes.js";
import deudas from "./routes/deudas.routes.js";
import personas from "./routes/persona.routes.js";
import cajeros from "./routes/cajeros.routes.js";
import dotenv from "dotenv";

const redisOptions = { host: "localhost", port: 5050 };

const queues = {
  testQueue: new Queue("testQueue", {
    connection: redisOptions,
  }),
};

const schedulers = {
  testQueue: new QueueScheduler(queues.testQueue.name, {
    connection: redisOptions,
  }),
};

// UTILITIES

const addJobToTestQeue = (job) => queues.testQueue.add(job.type, job);

const addRetryableJobToTestQueue = (job) => {
  queues.testQueue.add(job.type, job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};

// EXPRESS SETUP

app.post("/hello-world", async (_req, res) => {
  await addJobToTestQeue({
    type: "PrintHeloWorld",
    data: { hello: "world" },
  });

  res.json({ queued: true });
});

app.post("/heavy-cmputing", async (req, res) => {
  await addJobToTestQeue({
    type: "DoSomeHeavyComputing",
    data: { magicNumber: 5 },
  });

  res.json({ queued: true });
});

app.post("/retryable", async (req, res) => {
  await addRetryableJobToTestQueue({
    type: "MayFailOrNot",
    data: { magicNumber: Math.floor(Math.random() * 1000) },
  });

  res.json({ queued: true });
});

// app.post("/retryable", async (req, res) => {
//   await addRetryableJobToTestQueue({
//     type: "MyFailOrNot",
//     data: { magicNumber: Math.floor(Math.random() * 1000) },
//   });
// });

dotenv.config();
const app = express();

//RUTAS
app.use(cors());
app.use(express.text());
app.use(express.json());

app.use("/api", pagos);
app.use("/api", deudas);
app.use("/api", personas);
app.use("/api", cajeros);

app.listen(process.env.SERVERPORT || 3000, () => {
  console.log("Servidor funcionando en puerto 3000");
});
// const myInit = {
//   method: "POST",
// };

// await fetch(
//   `http://localhost:${process.env.SERVERPORT || 3000}/api/cajeros/${
//     process.env.cantCajerosIni || 1
//   }`,
//   myInit
// );
