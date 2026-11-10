/*
CSV Stringify

Please look at the [Sync API](https://csv.js.org/stringify/api/sync/) for
additional information.
*/

import { stringifier } from "./api/index.js";
import { normalize_options } from "./api/normalize_options.js";

const stringify = function (records, opts = {}) {
  const data = [];
  // Join the records by batch, holding many small strings built with `+=`
  // until a single final join is slow on large datasets
  let batch = [];
  const push = function (chunk) {
    batch.push(chunk);
    if (batch.length === 1000) {
      data.push(batch.join(""));
      batch = [];
    }
  };
  const [err, options] = normalize_options(opts);
  if (err !== undefined) throw err;
  const state = {
    stop: false,
  };
  // Information
  const info = {
    records: 0,
  };
  const api = stringifier(options, state, info);
  for (const record of records) {
    const err = api.__transform(record, push);
    if (err !== undefined) throw err;
  }
  if (data.length === 0 && batch.length === 0) {
    api.bom(push);
    const err = api.headers(push);
    if (err !== undefined) throw err;
  }
  data.push(batch.join(""));
  return data.join("");
};

export { stringify, normalize_options };
