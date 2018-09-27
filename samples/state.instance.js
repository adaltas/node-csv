
const transform = require('..')
// Generate a dataset of 5 records
const records = 'record\n'.repeat(5).trim().split('\n')
// Initialize the transformation
const transformer = transform(records, (record, callback) => {
  setTimeout( () => {
    const {running, started, finished} = transformer
    callback(null, `${running}_${started}_${finished}\n`)
  }, 100)
})
// Get notify when done
transformer.on('end', () => {
  process.stdout.write('-------\n')
  const {running, started, finished} = transformer
  process.stdout.write(`${running}_${started}_${finished}\n`)
})
// Print the transformed records to the standard output
transformer.pipe(process.stdout)
