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

export { read };
