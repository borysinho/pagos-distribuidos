import queues from "../services/queues.service.js";

const jobQueueMiddleware = async (req, res, next) => {
  try {
    const { method, body, params } = req;
    const path = req.route.path;
    let data = { method, path, params, body };
    if (method === "GET") {
      switch (path) {
        case "/personas": {
          data.name = "getPersonas";
          data.friendlyName = "Obtener Clientes";
          break;
        }
        case "/personas/:id": {
          data.name = "getPersonaId";
          data.friendlyName = "Obtener un Cliente";
          break;
        }

        default:
          break;
      }
    }
    if (method === "POST") {
      switch (path) {
        case "/pagos": {
          data.name = "postPago";
          data.friendlyName = "Realizar Pago";
          break;
        }

        default:
          break;
      }
    }
    // Add the task to the job queue
    const job = await queues.jobQueue.add(data.name, data);
    job.token = job.id;
    req.jobId = job.id;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: `job.queue.middleware.js jobQueueMiddleware : ${error}` });
    // Handle any errors that occur during job queue processing
  }
};

export default { jobQueueMiddleware };
