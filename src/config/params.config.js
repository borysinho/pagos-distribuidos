import dotenv from "dotenv";
dotenv.config();
const params = {
  tiempoAtencion: 2000,
  cantCajeros: 1,
};

const redisConnection = {
  host: process.env.redisHost || "localhost",
  port: process.env.redisPort || 6379,
};

export default { params, redisConnection };
