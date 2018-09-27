
const transform = require('..')
const assert = require('assert')
// Generate a dataset of 5 records
const records = 'record\n'.repeat(5).trim().split('\n')
let test_running = records.length
let test_started = records.length
let test_finished = 0
// Execute the transformation
transform(records, function(record, callback){
  setTimeout( () => {
    const {running, started, finished} = this
    assert.equal(running, test_running--)
    assert.equal(started, test_started)
    assert.equal(finished, test_finished++)
    callback(null, `${running}_${started}_${finished}\n`)
  }, 100)
})
// Get notify on error
.on('end', function(){
  process.stdout.write('-------\n')
  const {running, started, finished} = this
  process.stdout.write(`${running}_${started}_${finished}\n`)
})
// Print the transformed records to the standard output
.pipe(process.stdout)
