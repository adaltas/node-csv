import { TransformStream, CountQueuingStrategy } from "node:stream/web";
import { CsvError, transform } from "./api/index.js";
import { normalize_options } from "./api/normalize_options.js";

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
        const error = api.parse(chunk, false, enqueue, terminate);
        if (error) {
          controller.error(error);
        }
      },
      flush() {
        const error = api.parse(undefined, true, enqueue, terminate);
        if (error) {
          controller.error(error);
        }
      },
    },
    new CountQueuingStrategy({ highWaterMark: 1024 }),
    new CountQueuingStrategy({ highWaterMark: 1024 }),
  );
};

export { parse, CsvError, normalize_options };
