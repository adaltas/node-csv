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
    finished: 0,
    paused: false,
  };
  return this;
};

util.inherits(Transformer, stream.Transform);

Transformer.prototype._transform = function(chunk, _, cb){
  this.state.started++;
  this.state.running++;
  // Accept additionnal chunks to be processed in parallel
  if(!this.state.paused && this.state.running < this.options.parallel){
    cb();
    cb = null; // Cancel further callback execution
  }
  try {
    let l = this.handler.length;
    if(this.options.params !== null){  
      l--;
    }
    if(l === 1){ // sync
      const result = this.handler.call(this, chunk, this.options.params);
      this.__done(null, [result], cb);
    }else if(l === 2){ // async
      const callback = (err, ...chunks) =>
        this.__done(err, chunks, cb);
      this.handler.call(this, chunk, callback, this.options.params);
    }else {
      throw Error('Invalid handler arguments');
    }
    return false;
  } catch (err) {
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
      this.state.paused = !this.push(chunk);
    }
  }
  // Chunk has been processed
  if(cb){
    cb();
  }
  if(this._ending && this.state.running === 0){
    this._ending();
  }
};
const transform = function(){
  let options = {};
  let callback, handler, records;
  for(let i = 0; i< arguments.length; i++){
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
      if (handler && i === arguments.length - 1) {
        callback = argument;
      } else {
        handler = argument;
      }
    }else if(type !== 'null'){
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`);
    }
  }
  const transformer = new Transformer(options, handler);
  let error = false;
  if (records) {
    const writer = function(){
      for(const record of records){
        if(error) break;
        transformer.write(record);
      }
      transformer.end();
    };
    // Support Deno, Rollup doesnt provide a shim for setImmediate
    if(typeof setImmediate === 'function'){
      setImmediate(writer);
    }else {
      setTimeout(writer, 0);
    }
  }
  if(callback || options.consume) {
    const result = [];
    transformer.on('readable', function(){
      let record; while((record = transformer.read()) !== null){
        if(callback){
          result.push(record);
        }
      }
    });
    transformer.on('error', function(err){
      error = true;
      if (callback) callback(err);
    });
    transformer.on('end', function(){
      if (callback && !error) callback(null, result);
    });
  }
  return transformer;
};

exports.Transformer = Transformer;
exports.transform = transform;
