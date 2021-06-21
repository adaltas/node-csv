
const parse = require('..')
const assert = require('assert')

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
