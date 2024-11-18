import { TransformStream } from "node:stream/web";
import { transform } from "./api/index.js";

const parse = (opts) => {
  const api = transform(opts);

  let controller;

  const enqueue = (record) => {
    controller.enqueue(record);
  };

  const terminate = () => {
    controller.terminate();
  };

  return new TransformStream(
    {
      start(ctr) {
        controller = ctr;
      },
      transform(chunk) {
        api.parse(chunk, false, enqueue, terminate);
      },
      flush() {
        api.parse(undefined, true, enqueue, terminate);
      },
    },
    new CountQueuingStrategy({ highWaterMark: 1024 }),
    new CountQueuingStrategy({ highWaterMark: 1024 }),
  );
};

export { parse };
