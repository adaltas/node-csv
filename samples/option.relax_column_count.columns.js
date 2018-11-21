
const parse = require('../lib')
const assert = require('assert')

parse(`
lastname,firstname,fullname
Ritchie
Lovelace,Ada,"Augusta Ada King, Countess of Lovelace"
`.trim(), {
  relax_column_count: true,
  columns: true
}, function(err, records){
  assert.deepEqual(
    records, [
      { lastname: 'Ritchie' },
      { lastname: 'Lovelace',
        firstname: 'Ada',
        fullname: 'Augusta Ada King, Countess of Lovelace' }
    ]
  )
})
