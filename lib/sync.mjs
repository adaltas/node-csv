// Alias to the sync modules exposing the sync API

import generate from 'csv-generate/lib/sync.js'
import parse from 'csv-parse/lib/sync.js'
import transform from 'stream-transform/lib/sync.js'
import stringify from 'csv-stringify/lib/sync.js'

export { generate, parse, transform, stringify }
