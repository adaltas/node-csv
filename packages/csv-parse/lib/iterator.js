import { CsvError, transform } from "./api/index.js";
import { normalize_options } from "./api/normalize_options.js";

// Parse an asynchronous iterable without a stream wrapper. Drain each chunk's
// records before requesting another chunk, including records preceding an error.
async function* parse(input, opts = {}) {
  const api = transform(opts);
  let records = [];
  let stopped = false;
  const push = (record) => records.push(record);
  const close = () => {
    stopped = true;
  };
  for await (const chunk of input) {
    const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
    const error = api.parse(buffer, false, push, close);
    for (const record of records) yield record;
    records = [];
    if (error !== undefined) throw error;
    if (stopped) return;
  }
  const error = api.parse(undefined, true, push, close);
  for (const record of records) yield record;
  if (error !== undefined) throw error;
}

export { parse, CsvError, normalize_options };
