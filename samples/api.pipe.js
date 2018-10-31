
const parse = require('..')
const generate = require('csv-generate')
const transform = require('stream-transform')

const generator = generate({
  length: 20
})
const parser = parse({
  delimiter: ':'
})
const transformer = transform(function(record, callback){
  setTimeout(function(){
    callback(null, record.join(' ')+'\n')
  }, 500)
}, {
  parallel: 5
})
generator.pipe(parser).pipe(transformer).pipe(process.stdout)
