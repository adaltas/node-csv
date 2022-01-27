
/*
CSV Stringify

Please look at the [project documentation](https://csv.js.org/stringify/) for
additional information.
*/

import { Transform } from 'stream';
import { CsvError } from './api/CsvError.js';
import { is_object } from './utils/is_object.js';
import { stringifier } from './api/index.js';
import { normalize_options } from './api/normalize_options.js';

class Stringifier extends Transform {
  constructor(opts = {}){
    super({...{writableObjectMode: true}, ...opts});
    const [err, options] = normalize_options(opts);
    if(err !== undefined) throw err;
    // Expose options
    this.options = options;
    // Internal state
    this.state = {
      stop: false
    };
    // Information
    this.info = {
      records: 0
    };
    this.api = stringifier(this.options, this.state, this.info);
    this.api.options.on_record = (...args) => {
      this.emit('record', ...args);
    };
  }
  _transform(chunk, encoding, callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.api.__transform(chunk, this.push.bind(this));
    if(err !== undefined){
      this.state.stop = true;
    }
    callback(err);
  }
  _flush(callback){
    if(this.state.stop === true){
      // Note, Node.js 12 call flush even after an error, we must prevent
      // `callback` from being called in flush without any error.
      return;
    }
    if(this.info.records === 0){
      this.api.bom(this.push.bind(this));
      const err = this.api.headers(this.push.bind(this));
      if(err) callback(err);
    }
    callback();
  }
}

const stringify = function(){
  let data, options, callback;
  for(const i in arguments){
    const argument = arguments[i];
    const type = typeof argument;
    if(data === undefined && (Array.isArray(argument))){
      data = argument;
    }else if(options === undefined && is_object(argument)){
      options = argument;
    }else if(callback === undefined && type === 'function'){
      callback = argument;
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ]);
    }
  }
  const stringifier = new Stringifier(options);
  if(callback){
    const chunks = [];
    stringifier.on('readable', function(){
      let chunk;
      while((chunk = this.read()) !== null){
        chunks.push(chunk);
      }
    });
    stringifier.on('error', function(err){
      callback(err);
    });
    stringifier.on('end', function(){
      callback(undefined, chunks.join(''));
    });
  }
  if(data !== undefined){
    const writer = function(){
      for(const record of data){
        stringifier.write(record);
      }
      stringifier.end();
    };
    // Support Deno, Rollup doesnt provide a shim for setImmediate
    if(typeof setImmediate === 'function'){
      setImmediate(writer);
    }else{
      setTimeout(writer, 0);
    }
  }
  return stringifier;
};

// export default stringify
export { stringify, CsvError, Stringifier };
