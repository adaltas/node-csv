
const parse = require('..')
const assert = require('assert')

parse(`
friend,username,friend
athos,porthos,aramis
porthos,d_artagnan,athos
`.trim(), {
  columns: true,
  columns_duplicates_to_array: true
}, function(err, records){
  assert.deepStrictEqual(
    records, [{
      username: 'porthos',
      friend: ['athos', 'aramis']
    }, {
      username: 'd_artagnan',
      friend: ['porthos', 'athos']
    }]
  )
})
