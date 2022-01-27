
import {
  TransformStream,
} from 'node:stream/web';
import {transform} from './api/index.js';

const parse = (opts) => {
  const api = transform(opts);
  return new TransformStream({
    async transform(chunk, controller) {
      const err = api.parse(chunk, false, (record) => {
        controller.enqueue(record);
      }, () => {
        controller.close()
      });
    },
    async flush(controller){
      const err = api.parse(undefined, true, (record) => {
        controller.enqueue(record);
      }, () => {
        controller.close()
      });
    }
  });
}

export {parse};
