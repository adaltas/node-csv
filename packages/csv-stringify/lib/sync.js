
import { Stringifier } from './index.js';
import { StringDecoder } from 'string_decoder';

const stringify = function(records, options={}){
  const data = [];
  if(Buffer.isBuffer(records)){
    const decoder = new StringDecoder();
    records = decoder.write(records);
  }
  const stringifier = new Stringifier(options);
  stringifier.push = function(record){
    if(record === null){
      return;
    }
    data.push(record.toString());
  };
  for(const record of records){
    const err = stringifier.__transform(record, null);
    if(err !== undefined) throw err;
  }
  return data.join('');
};

// export default stringify
export { stringify };
