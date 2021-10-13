
import { Stringifier } from './index.js';
import { StringDecoder } from 'string_decoder';

const stringify = function(records, options={}){
  const data = [];
  if(Buffer.isBuffer(records)){
    const decoder = new StringDecoder();
    records = decoder.write(records);
  }
  function onData(record){
    if(record){
      data.push(record.toString());
    }
  }
  const stringifier = new Stringifier(options);
  stringifier.on('data', onData);
  for(const record of records){
    stringifier.write(record); 
  }
  stringifier.end();
  stringifier.off('data', onData);
  return data.join('');
};

// export default stringify
export { stringify };
