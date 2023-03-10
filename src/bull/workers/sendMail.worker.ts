import { Worker } from "bullmq";
import logger from "../../utils/logger/winston.logger";
import { redisConnection } from "../../utils/redisConnection";
import { sendMailJob } from "../job/mail.job";
import { queueName } from "../queues/queue.email";


console.log(queueName);

const emailWorker = new Worker(queueName, sendMailJob, {
  connection: redisConnection,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
emailWorker.on("completed", (job) => {
  logger.info("Sent voucher");
});
emailWorker.on("failed", (job) => {
  logger.error(`Failed send voucher job at ${job?.id}`);
});


export default emailWorker;
