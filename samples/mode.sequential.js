
const transform = require('..')
const assert = require('assert')

// Generate a dataset of 500 records
const records = '.'.repeat(500).split('.').map( (_, i) => i )
// Transform the dataset
transform(records, {
  parallel: 1
}, function(record, callback){
  setTimeout(function(){
    callback(null, record)
  // Random timeout to prove sequential execution
  }, Math.ceil(Math.random() * 10))
}, function(err, records){
  assert.equal(
    records.join(','),
    '.'.repeat(500).split('.').map( (_, i) => i ).join(',')
  )
})
