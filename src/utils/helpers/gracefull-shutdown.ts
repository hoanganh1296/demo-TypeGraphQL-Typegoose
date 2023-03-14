import { Server } from "http";
import logger from "../logger/winston.logger";
import { mongooseConnection } from "../mongo";
import { emailQueue } from "../../bull/queues/queue.email";
import emailWorker from "../../bull/workers/sendMail.worker";
import { AppDataSource } from "../mysqlDataSource";

export const shutdownGracefully = async (server: Server) => {
  try {
    logger.warn("Closing http server...");
    await emailWorker.close();
    logger.warn("Closed worker");
    await emailQueue.pause();
    logger.warn("Paused queue");
    server.close(() => {
      logger.warn("Http server closed.");
      AppDataSource.destroy()
        .then(() => {
          logger.warn("Closed postgres database connection");
        })
        .catch(() => {
          logger.error("Failed to close postgres database");
        });
      mongooseConnection.close(false, () => {
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Unable to shut down sever because:\n${error}`);
  }
};
