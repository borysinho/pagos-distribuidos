import { Worker } from "bullmq";
import params from "../../config/params.config.js";

const worker = new Worker(
  "lazy-queue",
  (job) => {
    // console.log("Iniciamos proceso LAZYQUEUE");
    // console.log("job.data.JQStatus", job.data.JQStatus);
    // No tiene una notificación de la cola de notificacoines
    // Viene de la cola de servicios y generó un error
    if (
      !job.data.NQStatus &&
      job.data.JQStatus &&
      job.data.JQStatus === "failed"
    ) {
      // console.log("Ejecutado FAILED de cola JOBS");
      throw new Error("JOBQueue Proxy error for lazyQueue");
    } else {
      // Viene de la cola de notificaciones y generó un error
      // console.log("job.data.NQStatus", job.data.NQStatus);
      if (job.data.NQStatus && job.data.NQStatus === "failed") {
        // console.log("Ejecutado FAILED de cola NOTIFICATIONS");
        throw new Error("NOTIFQueue Proxy error for lazyQueue");
      }
    }
  },
  {
    connection: params.redisConnection,
  }
);

/**
 *
 * @param {Worker} worker El worker que atenderá la cola
 * @param {String} uuid El token
 */
// const processLazyJob = async (worker, uuid) => {
//   const job = await worker.getNextJob(uuid);
//   console.log("1er status: ", await job.getState());

//   if (!job.data.NQStatus && job.data.JQStatus === "completed") {
//     console.log("Movido a completado en el 1er IF");
//     await job.moveToCompleted("Movido a completado", uuid, false);
//   } else {
//     //Se ejecutó la segunda cola y además se completó
//     if (job.data.NQStatus && job.data.NQStatus === "completed") {
//       console.log("Movido a completado en el 2do IF");
//       await job.moveToCompleted("Movido a completado", uuid, false);
//     } else {
//       //Solo se ejecutó la primera cola y además dió error
//       if (!job.data.NQStatus && job.data.JQStatus === "failed") {
//         console.log("Failed completado en el 1er IF");
//         await job.moveToFailed(new Error(job.data.JQErrorMessage), uuid, false);
//       } else {
//         // Se ejecutó la segunda cola y además dió error
//         console.log("Failed completado en el 2do IF");
//         await job.moveToFailed(new Error(job.data.NQErrorMessage), uuid, false);
//       }
//     }
//   }
// };

// const job = worker.getNextJob(token);

// if (!job.data.NQStatus && job.data.JQStatus === "completed") {
//   console.log("Movido a completado en el 1er IF");
//   await job.moveToCompleted("Movido a completado", token, false);
// } else {
//   //Se ejecutó la segunda cola y además se completó
//   if (job.data.NQStatus && job.data.NQStatus === "completed") {
//     console.log("Movido a completado en el 2do IF");
//     await job.moveToCompleted("Movido a completado", token, false);
//   } else {
//     //Solo se ejecutó la primera cola y además dió error
//     if (!job.data.NQStatus && job.data.JQStatus === "failed") {
//       console.log("Failed a completado en el 1er IF");
//       await job.moveToFailed(new Error(job.data.JQErrorMessage), token, false);
//     } else {
//       // Se ejecutó la segunda cola y además dió error
//       await job.moveToFailed(new Error(job.data.NQErrorMessage), token, false);
//     }
//   }
// }

// await worker.close();

export default { worker };

// Access job.data and do something with the job
// processJob(job.data)
// if (succeeded) {
//   await job.moveToCompleted("some return value", token, false);
// } else {
//   await job.moveToFailed(new Error("my error message"), token, false);
// }

// const token = "my-token";

// const worker = new Worker(
//   "lazy-queue",
//   async (job) => {
//     //Solo se ejecutó la cola primera cola y además se completó
//     if (!job.data.NQStatus && job.data.JQStatus === "completed") {
//       console.log("Movido a completado en el 1er IF");
//       await job.moveToCompleted("Movido a completado", token, false);
//     } else {
//       //Se ejecutó la segunda cola y además se completó
//       if (job.data.NQStatus && job.data.NQStatus === "completed") {
//         console.log("Movido a completado en el 2do IF");
//         await job.moveToCompleted("Movido a completado", token, false);
//       } else {
//         //Solo se ejecutó la primera cola y además dió error
//         if (!job.data.NQStatus && job.data.JQStatus === "failed") {
//           console.log("Failed a completado en el 1er IF");
//           await job.moveToFailed(
//             new Error(job.data.JQErrorMessage),
//             token,
//             false
//           );
//         } else {
//           // Se ejecutó la segunda cola y además dió error
//           await job.moveToFailed(
//             new Error(job.data.NQErrorMessage),
//             token,
//             false
//           );
//         }
//       }
//     }
//   },
//   {
//     connection: params.redisConnection,
//   }
// );

// export default { worker };
