import { Job, QueueEvents, Worker } from "bullmq";
import queues from "../queues.service.js";
import params from "../../config/params.config.js";
import personaService from "../persona.service.js";
import pagoService from "../pago.service.js";

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
        // job.updateProgress(100);
        break;
      }
      default: {
        break;
      }
    }
  },
  {
    connection: params.redisConnection,
    concurrency: 1,
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

worker.on("failed", async (job, error) => {
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

    //Agregamos a la cola BULL solo para muestra
    queues.lazyQueue.add(
      `job-queue.${job.data.name}.jobId: ${job.id}`,
      job.data
    );

    // Agregamos a la cola normal
    // const clonedJob = { ...job };
    // clonedJob.name = `job-queue.${job.data.name}.jobId: ${job.id}`;
    // const clonedJob = { ...job };
    // clonedJob.name = `job-queue.${job.data.name}.jobId: ${job.id}`;
    // queues.finishedJobs.push(clonedJob);
    // console.log("clonedJob", clonedJob);
    // queues.lazyQueue.add(job);
    // queues.lazyQueue.add(
    //   `job-queue.${job.data.name}.jobId: ${job.id}`,
    //   job.data
    // );

    // PROCESO DE LAZYQUEUE
    // const clonedJob = { ...job };
    // clonedJob.name = `job-queue.${job.data.name}.jobId: ${job.id}`;

    // queues.lazyQueue.add(clonedJob);

    // Creamos un Worker para atender un elemento en la cola
    // lazyServicesWorkers.
  }
});

export default { worker };
