
/*
CSV Generate - main module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/

import stream from 'stream';
import util from 'util';

const Generator = function(options = {}){
  // Convert Stream Readable options if underscored
  if(options.high_water_mark){
    options.highWaterMark = options.high_water_mark;
  }
  if(options.object_mode){
    options.objectMode = options.object_mode;
  }
  // Call parent constructor
  stream.Readable.call(this, options);
  // Clone and camelize options
  this.options = {};
  for(const k in options){
    this.options[Generator.camelize(k)] = options[k];
  }
  // Normalize options
  const dft = {
    columns: 8,
    delimiter: ',',
    duration: null,
    encoding: null,
    end: null,
    eof: false,
    fixedSize: false,
    length: -1,
    maxWordLength: 16,
    rowDelimiter: '\n',
    seed: false,
    sleep: 0,
  };
  for(const k in dft){
    if(this.options[k] === undefined){
      this.options[k] = dft[k];
    }
  }
  // Default values
  if(this.options.eof === true){
    this.options.eof = this.options.rowDelimiter;
  }
  // State
  this._ = {
    start_time: this.options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0,
  };
  if(typeof this.options.columns === 'number'){
    this.options.columns = new Array(this.options.columns);
  }
  const accepted_header_types = Object.keys(Generator).filter((t) => (!['super_', 'camelize'].includes(t)));
  for(let i = 0; i < this.options.columns.length; i++){
    const v = this.options.columns[i] || 'ascii';
    if(typeof v === 'string'){
      if(!accepted_header_types.includes(v)){
        throw Error(`Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`);
      }
      this.options.columns[i] = Generator[v];
    }
  }
  return this;
};
util.inherits(Generator, stream.Readable);

// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
Generator.prototype.random = function(){
  if(this.options.seed){
    return this.options.seed = this.options.seed * Math.PI * 100 % 100 / 100;
  }else{
    return Math.random();
  }
};
// Stop the generation.
Generator.prototype.end = function(){
  this.push(null);
};
// Put new data into the read queue.
Generator.prototype._read = function(size){
  // Already started
  const data = [];
  let length = this._.fixed_size_buffer.length;
  if(length !== 0){
    data.push(this._.fixed_size_buffer);
  }
  // eslint-disable-next-line
  while(true){
    // Time for some rest: flush first and stop later
    if((this._.count_created === this.options.length) || (this.options.end && Date.now() > this.options.end) || (this.options.duration && Date.now() > this._.start_time + this.options.duration)){
      // Flush
      if(data.length){
        if(this.options.objectMode){
          for(const record of data){
            this.__push(record);
          }
        }else{
          this.__push(data.join('') + (this.options.eof ? this.options.eof : ''));
        }
        this._.end = true;
      }else{
        this.push(null);
      }
      return;
    }
    // Create the record
    let record = [];
    let recordLength;
    this.options.columns.forEach((fn) => {
      record.push(fn(this));
    });
    // Obtain record length
    if(this.options.objectMode){
      recordLength = 0;
      // recordLength is currently equal to the number of columns
      // This is wrong and shall equal to 1 record only
      for(const column of record)
        recordLength += column.length;
    }else{
      // Stringify the record
      record = (this._.count_created === 0 ? '' : this.options.rowDelimiter)+record.join(this.options.delimiter);
      recordLength = record.length;
    }
    this._.count_created++;
    if(length + recordLength > size){
      if(this.options.objectMode){
        data.push(record);
        for(const record of data){
          this.__push(record);
        }
      }else{
        if(this.options.fixedSize){
          this._.fixed_size_buffer = record.substr(size - length);
          data.push(record.substr(0, size - length));
        }else{
          data.push(record);
        }
        this.__push(data.join(''));
      }
      return;
    }
    length += recordLength;
    data.push(record);
  }
};
// Put new data into the read queue.
Generator.prototype.__push = function(record){
  const push = () => {
    this._.count_written++;
    this.push(record);
    if(this._.end === true){
      return this.push(null);
    }
  };
  this.options.sleep > 0 ? setTimeout(push, this.options.sleep) : push();
};
// Generate an ASCII value.
Generator.ascii = function(gen){
  // Column
  const column = [];
  const nb_chars = Math.ceil(gen.random() * gen.options.maxWordLength);
  for(let i=0; i<nb_chars; i++){
    const char = Math.floor(gen.random() * 32);
    column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
  }
  return column.join('');
};
// Generate an integer value.
Generator.int = function(gen){
  return Math.floor(gen.random() * Math.pow(2, 52));
};
// Generate an boolean value.
Generator.bool = function(gen){
  return Math.floor(gen.random() * 2);
};
// Camelize option properties
Generator.camelize = function(str){
  return str.replace(/_([a-z])/gi, function(_, match){
    return match.toUpperCase();
  });
};

const generate = function(){
  let options;
  let callback;
  if(arguments.length === 2){
    options = arguments[0];
    callback = arguments[1];
  }else if(arguments.length === 1){
    if(typeof arguments[0] === 'function'){
      options = {};
      callback = arguments[0];
    }else{
      options = arguments[0];
    }
  }else if(arguments.length === 0){
    options = {};
  }
  const generator = new Generator(options);
  if(callback){
    const data = [];
    generator.on('readable', function(){
      let d; while((d = generator.read()) !== null){
        data.push(d);
      }
    });
    generator.on('error', callback);
    generator.on('end', function(){
      if(generator.options.objectMode){
        callback(null, data);
      }else{
        if(generator.options.encoding){
          callback(null, data.join(''));
        }else{
          callback(null, Buffer.concat(data));
        }
      }
    });
  }
  return generator;
};

// export default generate
export {generate, Generator};
