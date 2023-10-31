import serviceWorker from "../services/workers/jobs.services.workers.js";
import notificationWorker from "../services/workers/notifications.services.workers.js";

const getServiceWorkerThreadCount = async (req, res) => {
  try {
    const nroThreads = serviceWorker.worker.concurrency;
    res.json({ count: nroThreads });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getNotificationWorkerThreadCount = async (req, res) => {
  try {
    const nroThreads = notificationWorker.worker.concurrency;
    res.json({ count: nroThreads });
  } catch (error) {
    res.status(500).json(error);
  }
};

const setServiceWorkerThreadCount = async (req, res) => {
  try {
    const nroThreads = parseInt(req.params.id);
    serviceWorker.worker.concurrency = nroThreads;
    res.json({ count: nroThreads });
  } catch (error) {
    res.status(500).json(error);
  }
};

const setNotificationWorkerThreadCount = async (req, res) => {
  try {
    const nroThreads = parseInt(req.params.id);
    notificationWorker.worker.concurrency = nroThreads;
    res.json({ count: nroThreads });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default {
  getServiceWorkerThreadCount,
  getNotificationWorkerThreadCount,
  setServiceWorkerThreadCount,
  setNotificationWorkerThreadCount,
};
