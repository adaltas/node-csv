
import generate from '../lib/index.js'

generate({
  columns: ['int', 'bool'],
  length: 2
})
.pipe(process.stdout)
