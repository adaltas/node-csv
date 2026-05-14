import { CsvError, transform } from "./api/index.js";

const parse = function (data, opts = {}) {
  if (typeof data === "string") {
    data = Buffer.from(data);
  }
  const records = opts && opts.objname ? {} : [];
  const parser = transform(opts);
  const push = (record) => {
    if (parser.options.objname === undefined) records.push(record);
    else {
      records[record[0]] = record[1];
    }
  };
  const close = () => {};
  const error = parser.parse(data, true, push, close);
  if (error !== undefined) throw error;
  return records;
};

export { parse };
export { CsvError };
