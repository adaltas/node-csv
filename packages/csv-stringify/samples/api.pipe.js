
import stringify from '../lib/index.js'
import generate from 'csv-generate'

generate({
  objectMode: true,
  seed: 1,
  headers: 2,
  duration: 400
})
.pipe(stringify({
  header: true,
  columns: {
   year: 'birthYear',
   phone: 'phone'
  }
}))
.pipe(process.stdout)
