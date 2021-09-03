
import stringify from './index.js'
import {StringDecoder} from 'string_decoder'

export default function(records, options={}){
  const data = []
  if(Buffer.isBuffer(records)){
    const decoder = new StringDecoder()
    records = decoder.write(records)
  }
  function onData(record){
    if(record){
      data.push(record.toString())
    }
  }
  let stringifier = new stringify.Stringifier(options)
  stringifier.on('data', onData);
  for(let record of records){
    stringifier.write(record) 
  }
  stringifier.end()
  stringifier.off('data', onData);
  return data.join('')
}
