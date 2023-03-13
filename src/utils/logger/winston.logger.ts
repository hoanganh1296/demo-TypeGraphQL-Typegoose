import moment from 'moment';
import { createLogger, transports, format } from 'winston';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = createLogger({
  transports: new transports.File({
    dirname: 'logs',
    filename: `${moment().local().format('YYYY-MM-DD')}.log`,
  }),
  format: format.combine(
    format.timestamp({ format: () => moment().local().format('YYYY-MM-DD HH:mm:ss:SSS') }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}]: ${message}`;
    }),
  ),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        }),
      ),
    }),
  );
}
export default logger;
