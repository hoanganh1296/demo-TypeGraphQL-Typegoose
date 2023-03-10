import * as dotenv from "dotenv";
import { Job } from "bullmq";
import EmailSender from "../../service/nodemailer.service";
import logger from "../../utils/logger/winston.logger";
dotenv.config();

export const sendMailJob = async (job: Job<string>) => {
  try {
    const data = job.data;
    EmailSender(data);
    return job.data
  } catch (error) {
    logger.error("Send mail fail");
  }
};
