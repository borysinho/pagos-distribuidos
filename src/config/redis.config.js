import { createClient } from "redis";

const connect = async () => {
  const client = createClient();

  client.on("error", (err) => {
    console.log("Redis client error");
    throw err;
  });

  console.log("Redis connection success");
  return client;
};

export default { connect };
