'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stream = require('stream');
var util = require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);

const init_state = (options) => {
  // State
  return {
    start_time: options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0,
  };
};

// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
const random = function(options={}){
  if(options.seed){
    return options.seed = options.seed * Math.PI * 100 % 100 / 100;
  }else {
    return Math.random();
  }
};

const types = {
  // Generate an ASCII value.
  ascii: function({options}){
    const column = [];
    const nb_chars = Math.ceil(random(options) * options.maxWordLength);
    for(let i=0; i<nb_chars; i++){
      const char = Math.floor(random(options) * 32);
      column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
    }
    return column.join('');
  },
  // Generate an integer value.
  int: function({options}){
    return Math.floor(random(options) * Math.pow(2, 52));
  },
  // Generate an boolean value.
  bool: function({options}){
    return Math.floor(random(options) * 2);
  }
};

const camelize = function(str){
  return str.replace(/_([a-z])/gi, function(_, match){
    return match.toUpperCase();
  });
};

const normalize_options = (opts) => {
  // Convert Stream Readable options if underscored
  if(opts.high_water_mark){
    opts.highWaterMark = opts.high_water_mark;
  }
  if(opts.object_mode){
    opts.objectMode = opts.object_mode;
  }
  // Clone and camelize options
  const options = {};
  for(const k in opts){
    options[camelize(k)] = opts[k];
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
    if(options[k] === undefined){
      options[k] = dft[k];
    }
  }
  // Default values
  if(options.eof === true){
    options.eof = options.rowDelimiter;
  }
  if(typeof options.columns === 'number'){
    options.columns = new Array(options.columns);
  }
  const accepted_header_types = Object.keys(types).filter((t) => (!['super_', 'camelize'].includes(t)));
  for(let i = 0; i < options.columns.length; i++){
    const v = options.columns[i] || 'ascii';
    if(typeof v === 'string'){
      if(!accepted_header_types.includes(v)){
        throw Error(`Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`);
      }
      options.columns[i] = types[v];
    }
  }
  return options;
};

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
        }else {
          push(data.join('') + (options.eof ? options.eof : ''));
        }
        state.end = true;
      }else {
        close();
      }
      return;
    }
    // Create the record
    let record = [];
    let recordLength;
    for(const fn of options.columns){
      const result = fn({options: options, state: state});
      const type = typeof result;
      if(result !== null && type !== 'string' && type !== 'number'){
        return Error([
          'INVALID_VALUE:',
          'values returned by column function must be',
          'a string, a number or null,',
          `got ${JSON.stringify(result)}`
        ].join(' '));
      }
      record.push(result);
    }
    // Obtain record length
    if(options.objectMode){
      recordLength = 0;
      // recordLength is currently equal to the number of columns
      // This is wrong and shall equal to 1 record only
      for(const column of record){
        recordLength += column.length;
      }
    }else {
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
      }else {
        if(options.fixedSize){
          state.fixed_size_buffer = record.substr(size - length);
          data.push(record.substr(0, size - length));
        }else {
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

const Generator = function(options = {}){
  this.options = normalize_options(options);
  // Call parent constructor
  stream__default["default"].Readable.call(this, this.options);
  this.state = init_state(this.options);
  return this;
};
util__default["default"].inherits(Generator, stream__default["default"].Readable);

// Stop the generation.
Generator.prototype.end = function(){
  this.push(null);
};
// Put new data into the read queue.
Generator.prototype._read = function(size){
  const self = this;
  const err = read(this.options, this.state, size, function(chunk) {
    self.__push(chunk);
  }, function(){
    self.push(null);
  });
  if(err){
    this.destroy(err);
  }
};
// Put new data into the read queue.
Generator.prototype.__push = function(record){
  // console.log('push', record)
  const push = () => {
    this.state.count_written++;
    this.push(record);
    if(this.state.end === true){
      return this.push(null);
    }
  };
  this.options.sleep > 0 ? setTimeout(push, this.options.sleep) : push();
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
    }else {
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
      }else {
        if(generator.options.encoding){
          callback(null, data.join(''));
        }else {
          callback(null, Buffer.concat(data));
        }
      }
    });
  }
  return generator;
};

exports.Generator = Generator;
exports.generate = generate;
