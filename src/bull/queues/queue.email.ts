import { Queue } from 'bullmq';
import config from "config"
import { redisConnection } from '../../utils/redisConnection';


const queueName = config.get<string>('queueName');

const emailQueue = new Queue(queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 500,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

export { emailQueue, queueName };
