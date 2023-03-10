import config from "config";

const redisHost = config.get<string>("redisHost");
const redisPort = config.get<number>("redisPort");

export const redisConnection = {
  host: redisHost,
  port: redisPort,
};
