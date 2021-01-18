
const parse = require('..')
const assert = require('assert')

parse(`
format,description
CSV,CSV delimited text file that uses a comma, by default, to separate values.
SSA,SSA is a subtitle file format that allows for more advanced subtitles than the conventional SRT and similar formats.
ASS,Advanced SubStation Alpha (ASS), technically SSA v4+, is a script for more advanced subtitles than SSA.
`.trim(), {
  columns: true,
  ignore_last_delimiters: 10
}, function(err, records){
  assert.deepEqual(records, [{
      format: 'CSV',
      description: 'CSV delimited text file that uses a comma, by default, to separate values.'
    },{
      format: 'SSA',
      description: 'SSA is a subtitle file format that allows for more advanced subtitles than the conventional SRT and similar formats.'
    },{
      format: 'ASS',
      description: 'Advanced SubStation Alpha (ASS), technically SSA v4+, is a script for more advanced subtitles than SSA.'
    }
  ])
})
