import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "./queues/queue.email";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

export default serverAdapter;
