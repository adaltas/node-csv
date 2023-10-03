
/*
CSV Generate - sync module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/

import { Generator } from './index.js';

const generate = function(options){
  if(typeof options === 'string' && /\d+/.test(options)){
    options = parseInt(options);
  }
  if(Number.isInteger(options)){
    options = {length: options};
  }else if(typeof options !== 'object' || options === null){
    throw Error('Invalid Argument: options must be an object or an integer');
  }
  if(!Number.isInteger(options.length)){
    throw Error('Invalid Argument: length is not defined');
  }
  const chunks = [];
  let work = true;
  const generator = new Generator(options);
  generator.push = function(chunk){
    if(chunk === null){
      return work = false; 
    }
    chunks.push(chunk); 
  };
  while(work){
    generator.__read(options.highWaterMark);
  }
  if(!options.objectMode){
    return chunks.join('');
  }else{
    return chunks;
  }
};

// export default generate
export {generate};
