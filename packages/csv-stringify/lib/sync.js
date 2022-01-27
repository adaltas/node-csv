
import { stringifier } from './api/index.js';
import { normalize_options } from './api/normalize_options.js';

const stringify = function(records, opts={}){
  const data = [];
  const [err, options] = normalize_options(opts);
  if(err !== undefined) throw err;
  const state = {
    stop: false
  };
  // Information
  const info = {
    records: 0
  };
  const api = stringifier(options, state, info);
  // stringifier.push = function(record){
  //   if(record === null){
  //     return;
  //   }
  //   data.push(record.toString());
  // };
  for(const record of records){
    const err = api.__transform(record, function(record){
      data.push(record);
    });
    if(err !== undefined) throw err;
  }
  return data.join('');
};

// export default stringify
export { stringify };
