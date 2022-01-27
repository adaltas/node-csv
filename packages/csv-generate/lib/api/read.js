

const read = (options, state, size, push, close) => {
  // Already started
  const data = [];
  let length = state.fixed_size_buffer.length;
  if(length !== 0){
    data.push(state.fixed_size_buffer);
  }
  // eslint-disable-next-line
  while(true){
    // Time for some rest: flush first and stop later
    if((state.count_created === options.length) || (options.end && Date.now() > options.end) || (options.duration && Date.now() > state.start_time + options.duration)){
      // Flush
      if(data.length){
        if(options.objectMode){
          for(const record of data){
            push(record);
          }
        }else{
          push(data.join('') + (options.eof ? options.eof : ''));
        }
        state.end = true;
      }else{
        close();
      }
      return;
    }
    // Create the record
    let record = [];
    let recordLength;
    options.columns.forEach((fn) => {
      const result = fn({options: options, state: state});
      const type = typeof result;
      if(result !== null && type !== 'string' && type !== 'number'){
        throw Error([
          'INVALID_VALUE:',
          'values returned by column function must be',
          'a string, a number or null,',
          `got ${JSON.stringify(result)}`
        ].join(' '));
      }
      record.push(result);
    });
    // Obtain record length
    if(options.objectMode){
      recordLength = 0;
      // recordLength is currently equal to the number of columns
      // This is wrong and shall equal to 1 record only
      for(const column of record){
        recordLength += column.length;
      }
    }else{
      // Stringify the record
      record = (state.count_created === 0 ? '' : options.rowDelimiter)+record.join(options.delimiter);
      recordLength = record.length;
    }
    state.count_created++;
    if(length + recordLength > size){
      if(options.objectMode){
        data.push(record);
        for(const record of data){
          push(record);
        }
      }else{
        if(options.fixedSize){
          state.fixed_size_buffer = record.substr(size - length);
          data.push(record.substr(0, size - length));
        }else{
          data.push(record);
        }
        push(data.join(''));
      }
      return;
    }
    length += recordLength;
    data.push(record);
  }
};

export {read};
