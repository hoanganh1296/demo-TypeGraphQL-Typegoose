import { Server } from 'http';
import logger from '../logger/winston.logger';
import { mongooseConnection } from '../mongo';
import { emailQueue } from '../../bull/queues/queue.email';
import emailWorker from '../../bull/workers/sendMail.worker';

export const shutdownGracefully = async (server: Server) => {
  try {
    logger.warn('Closing http server...');
    await emailWorker.close();
    logger.warn('Closed worker');
    await emailQueue.pause();
    logger.warn('Paused queue');
    server.close(() => {
      logger.warn('Http server closed.');
      mongooseConnection.close(false, () => {
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Unable to shut down sever because:\n${error}`);
  }
};
