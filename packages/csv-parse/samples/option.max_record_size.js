
import assert from 'assert'
import { parse } from 'csv-parse'

parse(`
"first","last"
"Paul-Émile","Victor"
`.trim(), {
  max_record_size: 10
}, function(err, records){
  assert.ok(
    /Max Record Size/.test(err.message)
  )
})
