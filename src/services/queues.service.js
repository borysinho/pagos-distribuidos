import { Queue } from "bullmq";
import params from "../config/params.config.js";

const jobQueue = new Queue("jobs-queue", {
  connection: params.redisConnection,
  //prefix: "bullmq",
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "fixed",
      delay: 1000,
    },
    removeOnFail: true,
    removeOnComplete: true,
  },
});
const notificationsQueue = new Queue("notifications-queue", {
  connection: params.redisConnection,
  //prefix: "bullmq",
  //delay: 3000,
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "fixed",
      delay: 1000,
    },
    removeOnFail: true,
    removeOnComplete: true,
    //priority: 2,
  },

  //delay: 1000,
  //removeOnComplete: true,
});

const lazyQueue = new Queue("lazy-queue", {
  connection: params.redisConnection,
  //prefix: "bullmq",
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false,
  },
});

const arenaQueues = [
  {
    type: "bullmq",
    name: "jobs-queue",
    hostId: "Services Queue Manager",
    redis: params.redisConnection,
  },
  {
    type: "bullmq",
    name: "notifications-queue",
    hostId: "Notifications Queue Manager",
    redis: params.redisConnection,
  },
  {
    type: "bullmq",
    name: "lazy-queue",
    hostId: "Completed and Failed Jobs Queue Manager",
    redis: params.redisConnection,
  },
];

export default { jobQueue, notificationsQueue, lazyQueue, arenaQueues };
