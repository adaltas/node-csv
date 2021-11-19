
import { Stringifier } from './index.js';

const stringify = function(records, options={}){
  const data = [];
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
