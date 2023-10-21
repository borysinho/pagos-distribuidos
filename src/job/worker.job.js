// import { parentPort, workerData, isMainThread, threadId } from "worker_threads";
// import connect from "../config/redis.config.js";
// parentPort.on("message", async (data) => {
//   if (data.msg === "init") {
//     //atenderCliente(data.nroWorker);
//     const redis = await connect();
//     console.log("data.msg", data.msg);
//   }
// });

import { Job, Worker, WorkerOptions } from "bullmq";
//import { DoSomeHeavyComputingUseCase } from "./utils"

const workerHandler = async (job: Job<WorkerJob>) => {
  switch (job.data.type) {
    case "PrintHelloWorld": {
      console.log("Hello world!", job.data);
      return;
    }
    case "DoSomeHeavyComputing": {
      console.log("Starting Job", job.name);
      job.updateProgress(10);

      await DoSomeHeavyComputingUseCase(job.data);

      job.updateProgress(100);
      console.log("Finished job: ", job.name);
    }
    case "MayFailOrNot": {
      if (Math.random() > 0.3) {
        console.log("FAILED. MagicNumber: ", job.data.magicNumber);
        throw new Error("Something went wrong");
      }

      console.log("Completado - ", job.data.data.magicNumber);
      return "Done!";
    }
  }
};

const workerOptions: WorkerOptions = {
  connection: {
    host: "localhost",
    port: 5050,
  },
};

const worker = new Worker("testQueue", workerHandler, workerOptions);

console.log("Worker Started!");
