'use strict';

var web = require('node:stream/web');

const init_state = (options) => {
  // State
  return {
    start_time: options.duration ? Date.now() : null,
    fixed_size_buffer: "",
    count_written: 0,
    count_created: 0,
  };
};

// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
const random = function (options = {}) {
  if (options.seed) {
    return (options.seed = ((options.seed * Math.PI * 100) % 100) / 100);
  } else {
    return Math.random();
  }
};

const types = {
  // Generate an ASCII value.
  ascii: function ({ options }) {
    const column = [];
    const nb_chars = Math.ceil(random(options) * options.maxWordLength);
    for (let i = 0; i < nb_chars; i++) {
      const char = Math.floor(random(options) * 32);
      column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
    }
    return column.join("");
  },
  // Generate an integer value.
  int: function ({ options }) {
    return Math.floor(random(options) * Math.pow(2, 52));
  },
  // Generate an boolean value.
  bool: function ({ options }) {
    return Math.floor(random(options) * 2);
  },
};

const camelize = function (str) {
  return str.replace(/_([a-z])/gi, function (_, match) {
    return match.toUpperCase();
  });
};

const normalize_options = (opts) => {
  // Convert Stream Readable options if underscored
  if (opts.object_mode) {
    opts.objectMode = opts.object_mode;
  }
  if (opts.high_water_mark) {
    opts.highWaterMark = opts.high_water_mark;
  }
  // See https://nodejs.org/api/stream.html#stream_new_stream_readable_options
  // Node.js 20 introduced `stream.getDefaultHighWaterMark(opts.objectMode)`
  // opts.highWaterMark = opts.highWaterMark ?? (opts.objectMode ? 16 : 16384);
  // opts.highWaterMark = opts.highWaterMark ?? stream.getDefaultHighWaterMark(opts.objectMode);
  // Clone and camelize options
  const options = {};
  for (const k in opts) {
    options[camelize(k)] = opts[k];
  }
  // Normalize options
  const dft = {
    columns: 8,
    delimiter: ",",
    duration: null,
    encoding: null,
    end: null,
    eof: false,
    fixedSize: false,
    length: -1,
    maxWordLength: 16,
    rowDelimiter: "\n",
    seed: false,
    sleep: 0,
  };
  for (const k in dft) {
    if (options[k] === undefined) {
      options[k] = dft[k];
    }
  }
  // Default values
  if (options.eof === true) {
    options.eof = options.rowDelimiter;
  }
  if (typeof options.columns === "number") {
    options.columns = new Array(options.columns);
  }
  const accepted_header_types = Object.keys(types).filter(
    (t) => !["super_", "camelize"].includes(t),
  );
  for (let i = 0; i < options.columns.length; i++) {
    const v = options.columns[i] || "ascii";
    if (typeof v === "string") {
      if (!accepted_header_types.includes(v)) {
        throw Error(
          `Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`,
        );
      }
      options.columns[i] = types[v];
    }
  }
  return options;
};

const read = (options, state, size, push, close) => {
  // Already started
  const data = [];
  let recordsLength = 0;
  // Get remaining buffer when fixedSize is enable
  if (options.fixedSize) {
    recordsLength = state.fixed_size_buffer.length;
    if (recordsLength !== 0) {
      data.push(state.fixed_size_buffer);
    }
  }
  // eslint-disable-next-line
  while(true){
    // Exit
    if (
      state.count_created === options.length ||
      (options.end && Date.now() > options.end) ||
      (options.duration && Date.now() > state.start_time + options.duration)
    ) {
      // Flush
      if (data.length) {
        if (options.objectMode) {
          for (const record of data) {
            push(record);
          }
        } else {
          push(data.join("") + (options.eof ? options.eof : ""));
        }
        state.end = true;
      } else {
        close();
      }
      return;
    }
    // Create the record
    let record = [];
    let recordLength;
    for (const fn of options.columns) {
      const result = fn({ options: options, state: state });
      const type = typeof result;
      if (result !== null && type !== "string" && type !== "number") {
        close(
          Error(
            [
              "INVALID_VALUE:",
              "values returned by column function must be",
              "a string, a number or null,",
              `got ${JSON.stringify(result)}`,
            ].join(" "),
          ),
        );
        return;
      }
      record.push(result);
    }
    // Obtain record length
    if (options.objectMode) {
      recordLength = 0;
      // recordLength is currently equal to the number of columns
      // This is wrong and shall equal to 1 record only
      for (const column of record) {
        recordLength += column.length;
      }
    } else {
      // Stringify the record
      record =
        (state.count_created === 0 ? "" : options.rowDelimiter) +
        record.join(options.delimiter);
      recordLength = record.length;
    }
    state.count_created++;
    if (recordsLength + recordLength > size) {
      if (options.objectMode) {
        data.push(record);
        for (const record of data) {
          push(record);
        }
      } else {
        if (options.fixedSize) {
          state.fixed_size_buffer = record.substr(size - recordsLength);
          data.push(record.substr(0, size - recordsLength));
        } else {
          data.push(record);
        }
        push(data.join(""));
      }
      return;
    }
    recordsLength += recordLength;
    data.push(record);
  }
};

const generate = (opts) => {
  const options = normalize_options(opts || {});
  const state = init_state(options);
  return new web.ReadableStream(
    {
      async pull(controller) {
        read(
          options,
          state,
          1024,
          function (chunk) {
            chunk = Buffer.from(chunk);
            controller.enqueue(chunk);
          },
          function () {
            controller.close();
          },
        );
      },
    },
    { highWaterMark: 1024 },
  );
  // return new Generator(options || {})
};

exports.generate = generate;
