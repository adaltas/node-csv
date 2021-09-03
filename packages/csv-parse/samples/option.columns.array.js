
import assert from 'assert'
import parse from '../lib/index.js'

parse(`
"value 1","value 2"
`.trim(), {
  columns: ['key_1', 'key_2']
}, function(err, records){
  assert.deepStrictEqual(
    records, [{
      key_1: 'value 1',
      key_2: 'value 2'
    }]
  )
})
