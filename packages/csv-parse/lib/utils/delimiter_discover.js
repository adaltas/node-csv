import { normalize_options } from "../api/normalize_options.js";
import { transform } from "../api/index.js";

// Discussed in [issue #400](https://github.com/adaltas/node-csv/issues/400)
// See https://github.com/python/cpython/blob/ea1b1c579f600cc85d145c60862b2e6b98701b24/Lib/csv.py#L349
const delimiter_discover = function (records, options) {
  // Normalize the configuration
  if (!options) {
    ({ delimiter_auto: options } = normalize_options({ delimiter_auto: true }));
  }
  // Convert String to Buffer
  if (typeof records === "string") {
    records = Buffer.from(records);
  }
  // Convert Buffer to an array of records
  if (Buffer.isBuffer(records)) {
    records = ((data) => {
      const records = [];
      const parser = transform({ delimiter: [] });
      const push = (record) => records.push(record);
      const close = () => {};
      const error = parser.parse(data, true, push, close);
      if (error !== undefined) throw error;
      return records;
    })(records);
  }
  // Info array initialization, 127 entries, one per char code
  const info = Array(127)
    .fill()
    .map(() => ({ lines: [] }));
  // Traverse each records, count occurences per char code
  records.map(([record], line) => {
    for (let i = 0, l = record.length; i < l; i++) {
      // Count the character frequency
      const code = record.charCodeAt(i);
      info[code].lines[line] ??= 0;
      info[code].lines[line]++;
    }
  });
  // Traverse each char code, compute the score
  info.map((info, i) => {
    info.char_code = i;
    info.std = std(info.lines);
    info.total = info.lines.reduce((acc, val) => acc + val, 0);
    info.preferred = !!options.preferred[i];
    info.score = options.score(info, options);
  });
  // Extract the dominant character
  const result = info.reduce(
    (acc, info) => (acc.score > info.score ? acc : info),
    {},
  );
  return String.fromCharCode(result.char_code);
};

const std = function (array) {
  const n = array.length;
  if (n === 0) return 0;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n,
  );
};

export { delimiter_discover };
