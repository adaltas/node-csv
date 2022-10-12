'use strict';

var stream = require('stream');
var util = require('util');

const Transformer = function(options = {}, handler){
  this.options = options;
  if(options.consume === undefined || options.consume === null){
    this.options.consume = false;
  }
  this.options.objectMode = true;
  if(options.parallel === undefined || options.parallel === null){
    this.options.parallel = 100;
  }
  if(options.params === undefined || options.params === null){
    options.params = null;
  }
  this.handler = handler;
  stream.Transform.call(this, this.options);
  this.state = {
    running: 0,
    started: 0,
    finished: 0
  };
  return this;
};

util.inherits(Transformer, stream.Transform);

Transformer.prototype._transform = function(chunk, encoding, cb){
  this.state.started++;
  this.state.running++;
  if(this.state.running < this.options.parallel){
    cb();
    cb = null; // Cancel further callback execution
  }
  try {
    let l = this.handler.length;
    if(this.options.params !== null){  
      l--;
    }
    if(l === 1){ // sync
      this.__done(null, [this.handler.call(this, chunk, this.options.params)], cb);
    }else if(l === 2){ // async
      const callback = (err, ...chunks) =>
        this.__done(err, chunks, cb);
      this.handler.call(this, chunk, callback, this.options.params);
    }else {
      throw Error('Invalid handler arguments');
    }
    return false;
  }
  catch (err) {
    this.__done(err);
  }
};
Transformer.prototype._flush = function(cb){
  if(this.state.running === 0){
    cb();
  }else {
    this._ending = function(){
      cb();
    };
  }
};
Transformer.prototype.__done = function(err, chunks, cb){
  this.state.running--;
  if(err){
    return this.emit('error', err);
  }
  this.state.finished++;
  for(let chunk of chunks){
    if (typeof chunk === 'number'){
      chunk = `${chunk}`;
    }
    // We dont push empty string
    // See https://nodejs.org/api/stream.html#stream_readable_push
    if(chunk !== undefined && chunk !== null && chunk !== ''){
      this.push(chunk);
    }
  }
  if(cb){
    cb();
  }
  if(this._ending && this.state.running === 0){
    this._ending();
  }
};

const transform = function(){
  // Import arguments normalization
  let handler, records;
  let options = {};
  for(const i in arguments){
    const argument = arguments[i];
    let type = typeof argument;
    if(argument === null){
      type = 'null';
    }else if(type === 'object' && Array.isArray(argument)){
      type = 'array';
    }
    if(type === 'array'){
      records = argument;
    }else if(type === 'object'){
      options = {...argument};
    }else if(type === 'function'){
      handler = argument;
    }else if(type !== 'null'){
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`);
    }
  }
  // Validate arguments
  let expected_handler_length = 1;
  if(options.params){
    expected_handler_length++;
  }
  if(handler.length > expected_handler_length){
    throw Error('Invalid Handler: only synchonous handlers are supported');
  }
  // Start transformation
  const chunks = [];
  const transformer = new Transformer(options, handler);
  transformer.push = function(chunk){
    chunks.push(chunk);
  };
  for(const record of records){
    transformer._transform(record, null, function(){});
  }
  return chunks;  
};

exports.transform = transform;
