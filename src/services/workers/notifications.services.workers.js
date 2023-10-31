import { Worker } from "bullmq";
import axios from "axios";
import params from "../../config/params.config.js";
import queues from "../queues.service.js";

const answerClient = async (responseURL, data) => {
  // try {
  const headers = { "Content-Type": "application/json" };
  await axios.post(responseURL, data, { headers, timeout: 3000 });
  // .then(
  //   (response) => response.data
  //   //console.log(`[SERVER] - [PROCESS: undefined] - [STATUS: Procesado]`)
  // )
  // .catch((error) => console.log(error));
  // } catch (error) {
  return;
  // }
};

const worker = new Worker(
  "notifications-queue",
  async (job) => {
    if (
      job.name === "getPersonas" ||
      job.name === "getPersonaId" ||
      job.name === "postPago"
    ) {
      //console.log("job.data(notification)", job.data);
      await answerClient(job.data.body.responseURL, job.data);
      // if (res.status() === 200) {
      //   job.updateProgress(100);
      // }
      //return "completed";
    }
    //TODO Falló la notificación al cliente, reintentar indefinidamente
    // if (job.name === "getPersonaId") {
    //   await answerClient(job.data.body.responseURL, job.data);
    //   return "completed";
    // }
  },
  {
    connection: params.redisConnection,
  }
);

worker.on("completed", async (job, returnvalue) => {
  //console.log("Respuesta enviada al cliente");
  // Do something with the return value.
  console.log(
    `[NOTI-QUEUE] [ESTADO: completed] [JOB: ${job.name}] [HASH: ${job.data.body.pagoHash}]`
  );
  job.data.NQStatus = "completed";

  queues.lazyQueue.add(
    `notif-queue.${job.data.name}.jobId: ${job.id}`,
    job.data
  );
});

worker.on("error", (err) => {
  // log the error
  //console.error(err);
});

worker.on("progress", (job, progress) => {
  // Do something with the return value.
  //console.log("progress", progress);
});

worker.on("failed", (job, error) => {
  // Do something with the return value.

  console.log(
    "Falló la ejecución del servicio en NOTIFICATION QUEUE. Intento",
    job.attemptsMade
  );
  if (
    job.attemptsMade === queues.notificationsQueue.defaultJobOptions.attempts
  ) {
    console.log(
      `[NOTI-QUEUE] [ESTADO: failed] [JOB: ${job.name}] [HASH: ${job.data.body.pagoHash}]`
    );
    job.data.NQStatus = "failed";
    job.data.NQErrorMessage = error.message;
    queues.lazyQueue.add(
      `notif-queue.${job.data.name}.jobId: ${job.id}`,
      job.data
    );
  }
});

export default { worker };
