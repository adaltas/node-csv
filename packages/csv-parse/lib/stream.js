import { TransformStream } from "node:stream/web";
import { transform } from "./api/index.js";

const parse = (opts) => {
  const api = transform(opts);

  let controller;

  const enqueue = (record) => {
    controller.enqueue(record);
  };
  const close = () => {
    controller.close();
  };

  return new TransformStream({
    start(ctr) {
      controller = ctr;
    },
    transform(chunk) {
      api.parse(chunk, false, enqueue, close);
    },
    flush() {
      api.parse(undefined, true, enqueue, close);
    },
  });
};

export { parse };
