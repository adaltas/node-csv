
const generate = require('../lib')

generate({
  columns: ['int', 'bool'],
  length: 2
})
.pipe(process.stdout)
