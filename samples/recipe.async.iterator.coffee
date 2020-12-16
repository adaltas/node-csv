
parse = require('..')
fs = require('fs')
 
processFile = () ->
  records = []
  parser = fs
  .createReadStream "#{__dirname}/fs_read.csv"
  .pipe parse(
    # CSV options if any
  )
  for await record from parser
    # Work with each record
    records.push(record)
  records

(() ->
  records = await processFile()
  console.info records
)()
