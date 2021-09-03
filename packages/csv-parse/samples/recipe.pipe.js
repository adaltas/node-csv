
import parse from '../lib/index.js'
import generate from 'csv-generate'
import transform from 'csv-transform'

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
