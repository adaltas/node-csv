
const parse = require('..')
const generate = require('csv-generate')
const transform = require('stream-transform')

const parser = parse({
  delimiter: ':'
})
const input = generate({
  length: 20
})
const transformer = transform(function(record, callback){
  setTimeout(function(){
    callback(null, record.join(' ')+'\n')
  }, 500)
}, {
  parallel: 5
})
input.pipe(parser).pipe(transformer).pipe(process.stdout)
