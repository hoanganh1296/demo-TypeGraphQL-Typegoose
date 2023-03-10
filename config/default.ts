import * as dotenv from "dotenv";
dotenv.config();

export default {
  dbUri: process.env.mongoDBUri,
  queueName: "email",
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || "1"),
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT || "6379"),
  email_username: process.env.SMTP_AUTH_USER,
  email_password: process.env.SMTP_AUTH_PASS,
};
