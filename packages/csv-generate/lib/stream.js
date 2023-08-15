
import {
  ReadableStream,
} from 'node:stream/web';
import {normalize_options, init_state, read} from './api/index.js';

const generate = (opts) => {
  const options = normalize_options(opts || {});
  const state = init_state(options);
  return new ReadableStream({
    async pull(controller) {
      read(options, state, 1024, function(chunk) {
        chunk = Buffer.from(chunk);
        controller.enqueue(chunk);
      }, function(){
        controller.close();
      });
    }
  }, {highWaterMark: 1024});
  // return new Generator(options || {})
};

export {generate};
