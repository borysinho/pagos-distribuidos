import { Job, Worker } from "bullmq";
import queues from "../queues.service.js";
import params from "../../config/params.config.js";
import personaService from "../persona.service.js";
import pagoService from "../pago.service.js";
import lazyServicesWorkers from "./lazy.services.workers.js";

const worker = new Worker(
  "jobs-queue",
  async (job) => {
    switch (job.name) {
      case "getPersonas": {
        job.data.data = await personaService.getAllPersonas();
        break;
      }
      case "getPersonaId": {
        job.data.data = await personaService.getPersona(
          parseInt(job.data.params.id)
        );
        break;
      }
      case "postPago": {
        job.data.data = await pagoService.createPago(job.data.body);
        break;
      }
      default: {
        break;
      }
    }
  },
  {
    connection: params.redisConnection,
  }
);

worker.on("completed", async (job, returnvalue) => {
  // Do something with the return value.
  console.log(
    `[JOBS-QUEUE] [ESTADO: completed] [JOB: ${job.name}] [HASH: ${job.data.body.pagoHash}]`
  );
  job.data.JQStatus = "completed";
  queues.notificationsQueue.add(job.name, job.data);
  queues.lazyQueue.add(`job-queue.${job.data.name}.jobId: ${job.id}`, job.data);
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
  // console.log(
  //   `Error al ejecutar el proceso ${job.data.friendlyName}. Agregando el JOB a la cola`,
  //   error
  // );
  console.log(
    "Falló la ejecución del servicio en JOBQUEUE. Intento",
    job.attemptsMade
  );

  if (job.attemptsMade === queues.jobQueue.defaultJobOptions.attempts) {
    console.log(
      `[JOBS-QUEUE] [ESTADO: failed] [JOB: ${job.name}] [HASH: ${job.data.body.pagoHash}]`
    );
    job.data.JQStatus = "failed";
    job.data.JQErrorMessage = error.message;
    queues.notificationsQueue.add(job.name, job.data);

    // PROCESO DE LAZYQUEUE
    //Agregamos el job a la cola lazyQueue
    queues.lazyQueue.add(
      `job-queue.${job.data.name}.jobId: ${job.id}`,
      job.data
    );

    // Creamos un Worker para atender un elemento en la cola
    // lazyServicesWorkers.
  }
});

export default { worker };
