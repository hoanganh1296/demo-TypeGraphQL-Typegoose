"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    queueName: process.env.QUEUE_NAME || "mailbot",
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || "1"),
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : void 0,
        secure: true,
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS,
        },
    },
};
