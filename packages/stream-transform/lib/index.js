
/*
Stream Transform

Please look at the [project documentation](https://csv.js.org/transform/) for
additional information.
*/

import stream from 'stream'
import util from 'util'

const Transformer = function(options = {}, handler){
  this.options = options
  if(options.consume === undefined || options.consume === null){
    this.options.consume = false
  }
  this.options.objectMode = true
  if(options.parallel === undefined || options.parallel === null){
    this.options.parallel = 100
  }
  if(options.params === undefined || options.params === null){
    options.params = null
  }
  this.handler = handler
  stream.Transform.call(this, this.options)
  this.state = {
    running: 0,
    started: 0,
    finished: 0
  }
  return this
}

util.inherits(Transformer, stream.Transform)

Transformer.prototype._transform = function(chunk, encoding, cb){
  this.state.started++
  this.state.running++
  if(this.state.running < this.options.parallel){
    cb()
    cb = null // Cancel further callback execution
  }
  try {
    let l = this.handler.length
    if(this.options.params !== null){  
      l--
    }
    if(l === 1){ // sync
      this.__done(null, [this.handler.call(this, chunk, this.options.params)], cb)
    }else if(l === 2){ // async
      const callback = (err, ...chunks) =>
        this.__done(err, chunks, cb)
      this.handler.call(this, chunk, callback, this.options.params)
    }else{
      throw Error('Invalid handler arguments')
    }
    return false
  }
  catch (err) {
    this.__done(err)
  }
}
Transformer.prototype._flush = function(cb){
  this._ending = function(){
    if(this.state.running === 0){
      cb()
    }
  }
  this._ending()
}

// Transformer.prototype.__done = function(err, chunks, cb) {
//   var chunk, j, len;
//   this.state.running--;
//   if (err) {
//     return this.emit('error', err);
//   }
//   this.state.finished++;
//   for (j = 0, len = chunks.length; j < len; j++) {
//     chunk = chunks[j];
//     if (typeof chunk === 'number') {
//       chunk = `${chunk}`;
//     }
//     if ((chunk != null) && chunk !== '') {
//       // We dont push empty string
//       // See https://nodejs.org/api/stream.html#stream_readable_push
//       this.push(chunk);
//     }
//   }
//   if (cb) {
//     cb();
//   }
//   if (this._ending) {
//     return this._ending();
//   }
// };
Transformer.prototype.__done = function(err, chunks, cb){
  this.state.running--
  if(err){
    return this.emit('error', err)
  }
  this.state.finished++
  for(let chunk of chunks){
    if (typeof chunk === 'number'){
      chunk = `${chunk}`
    }
    // We dont push empty string
    // See https://nodejs.org/api/stream.html#stream_readable_push
    if(chunk !== undefined && chunk !== null && chunk !== ''){
      this.push(chunk)
    }
  }
  if(cb){
    cb()
  }
  if(this._ending){
    this._ending()
  }
}
const transform = function(){
  let options = {}
  let callback, handler, records
  for(let i = 0; i< arguments.length; i++){
    const argument = arguments[i]
    let type = typeof argument
    if(argument === null){
      type = 'null'
    }else if(type === 'object' && Array.isArray(argument)){
      type = 'array'
    }
    if(type === 'array'){
      records = argument
    }else if(type === 'object'){
      options = {...argument}
    }else if(type === 'function'){
      if (handler && i === arguments.length - 1) {
        callback = argument
      } else {
        handler = argument
      }
    }else if(type !== 'null'){
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`)
    }
  }
  const transformer = new Transformer(options, handler)
  let error = false
  if (records) {
    setImmediate(function(){
      for(let record of records){
        if(error) break
        transformer.write(record)
      }
      transformer.end()
    })
  }
  if(callback || options.consume) {
    const result = []
    transformer.on( 'readable', function(){
      let record
      while(record = transformer.read()){
        if(callback){
          result.push(record)
        }
      }
    })
    transformer.on( 'error', function(err){
      error = true
      if (callback) callback(err)
    })
    transformer.on( 'end', function(){
      if (callback && !error) callback(null, result)
    })
  }
  return transformer
}

transform.Transformer = Transformer

export default transform
export {transform}
