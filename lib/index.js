
const { Transform } = require('stream')
const ResizeableBuffer = require('./ResizeableBuffer')

const default_options = {
  // cast: false,
  // cast_date: false,
  columns: null,
  delimiter: Buffer.from(','),
  escape: Buffer.from('"'),
  from: 1,
  from_line: 1,
  objname: undefined,
  // ltrim: false,
  quote: Buffer.from('"'),
  // TODO create a max_comment_size
  max_record_size: 0,
  // raw: false,
  relax: false,
  relax_column_count: false,
  // rtrim: false,
  skip_empty_lines: false,
  skip_lines_with_empty_values: false,
  skip_lines_with_error: false,
  to_line: -1,
  to: -1,
  trim: false
}

const cr = 13
const nl = 10
const space = 32

class Parser extends Transform {
  constructor(opts = {}){
    const options = {}
    for(let i in opts){
      options[i] = opts[i]
    }
    options.readableObjectMode = true
    super(options)
    // Import default options
    for(let k in default_options){
      if(options[k] === undefined){
        options[k] = default_options[k]
      }
    }
    // Normalize option `cast`
    let fnCastField = null
    if(options.cast === undefined || options.cast === null || options.cast === false || options.cast === ''){
      options.cast = undefined
    }else if(typeof options.cast === 'function'){
      fnCastField = options.cast
      options.cast = true
    }else if(options.cast !== true){
      throw new Error('Invalid Option: cast must be true or a function')
    }
    // Normize option `cast_date`
    if(options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === ''){
      options.cast_date = false
    }else if(options.cast_date === true){
      options.cast_date = function(value){
        const date = Date.parse(value)
        return !isNaN(date) ? new Date(date) : value
      }
    }else if(typeof options.cast_date !== 'function'){
      throw new Error('Invalid Option: cast_date must be true or a function')
    }
    // Normalize option `comment`
    if(options.comment === undefined || options.comment === null || options.comment === false || options.comment === ''){
      options.comment = null
    }else{
      if(typeof options.comment === 'string'){
        options.comment = Buffer.from(options.comment)
      }
      if(!Buffer.isBuffer(options.comment)){
        throw new Error(`Invalid Option: comment must be a buffer or a string, got ${JSON.stringify(options.comment)}`)
      }
    }
    // Normalize option `rowDelimiter`
    if(typeof options.delimiter === 'string'){
      options.delimiter = Buffer.from(options.delimiter)
    }
    if(!options.rowDelimiter){
      options.rowDelimiter = []
    }else if(!Array.isArray(options.rowDelimiter)){
      options.rowDelimiter = [options.rowDelimiter]
    }
    options.rowDelimiter = options.rowDelimiter.map( function(rd){
      if(typeof rd === 'string'){
        rd = Buffer.from(rd)
      }
      return rd
    })
    // Normalize option `quote`
    if(options.quote === null || options.quote === undefined || options.quote === false || options.quote === ''){
      options.quote = null
    }else{
      if(typeof options.quote === 'string'){
        options.quote = Buffer.from(options.quote)
      }
      if(!Buffer.isBuffer(options.quote)){
        throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`)
      }else if(options.quote.length !== 1){
        throw new Error(`Invalid Option Length: quote must be one character, got ${options.quote.length}`)
      }else{
        options.quote = options.quote[0]
      }
    }
    // Normalize option `buffer`
    if(typeof options.escape === 'string'){
      options.escape = Buffer.from(options.escape)
    }
    if(!Buffer.isBuffer(options.escape)){
      throw new Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`)
    }else if(options.escape.length !== 1){
      throw new Error(`Invalid Option Length: escape must be one character, got ${options.escape.length}`)
    }else{
      options.escape = options.escape[0]
    }
    // Normalize option `columns`
    let fnFirstLineToHeaders = null
    if(options.columns === true){
      fnFirstLineToHeaders = firstLineToHeadersDefault
    }else if(typeof options.columns === 'function'){
      fnFirstLineToHeaders = options.columns
      options.columns = true
    }else if(Array.isArray(options.columns)){
      normalizeColumnsArray(options.columns)
    }else if(options.columns === undefined || options.columns === null || options.columns === false){
      options.columns = false
    }else{
      throw new Error(`Invalid Option columns: expect an object or true, got ${JSON.stringify(options.columns)}`)
    }
    // Normalize options `trim`, `ltrim` and `rtrim`
    if(options.trim === true && options.ltrim !== false){
      options.ltrim = true
    }else if(options.ltrim !== true){
      options.ltrim = false
    }
    if(options.trim === true && options.rtrim !== false){
      options.rtrim = true
    }else if(options.rtrim !== true){
      options.rtrim = false
    }
    this.options = options
    this.state = {
      castField: fnCastField,
      commenting: false,
      escaping: false,
      escapeIsQuote: options.escape === options.quote,
      expectedRecordLength: options.columns === null ? 0 : options.columns.length,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      rowDelimiterMaxLength: options.rowDelimiter.length === 0 ? 2 : Math.max(...options.rowDelimiter.map( (v) => v.length)),
      trimChars: [Buffer.from(' ')[0], Buffer.from('\t')[0]],
      wasQuoting: false
    }
    this.info = {
      records: 0,
      lines: 1,
      empty_line_count: 0,
      skipped_line_count: 0
    }
  }
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(buf, false)
    if(err !== undefined){
      this.state.stop = true
    }
    callback(err)
  }
  _flush(callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(undefined, true)
    callback(err)
  }
  __parse(nextBuf, end){
    const {comment, escape, from, ltrim, max_record_size, quote, raw, relax, rtrim, skip_empty_lines, to} = this.options
    let {rowDelimiter} = this.options
    const {previousBuf, rawBuffer, escapeIsQuote, trimChars} = this.state
    let {commenting} = this.state
    let buf
    if(previousBuf === undefined && nextBuf !== undefined){
      buf = nextBuf
    }else if(previousBuf !== undefined && nextBuf === undefined){
      buf = previousBuf
    }else{
      buf = Buffer.concat([previousBuf, nextBuf])
    }
    const bufLen = buf.length
    let pos
    // let escaping = this.
    let wasRowDelimiter = false
    for(pos = 0; pos < bufLen; pos++){
      // Ensure we get enough space to look ahead
      // There should be a way to move this out of the loop
      if(this.__needMoreData(pos, bufLen, end)){
        break
      }
      if(wasRowDelimiter === true){
        this.info.lines++
        wasRowDelimiter = false
      }
      // if(to_line !== -1 && this.info.lines > to_line){
      //   this.push(null)
      //   break
      // }
      // Auto discovery of rowDelimiter, unix, mac and windows supported
      if(this.state.quoting === false && rowDelimiter.length === 0){
        const rowDelimiterCount = this.__autoDiscoverRowDelimiter(buf, pos)
        if(rowDelimiterCount){
          rowDelimiter = this.options.rowDelimiter
        }
      }
      const chr = buf[pos]
      if(raw === true){
        rawBuffer.append(chr)
      }
      let rowDelimiterLength = this.__isRowDelimiter(chr, buf, pos)
      if(rowDelimiterLength !== 0){
        wasRowDelimiter = true
      }
      // if(from_line !== 1 && this.info.lines < this.options.from_line){
      //   pos += rowDelimiterLength === 0 ? 0 : rowDelimiterLength - 1
      //   continue
      // }
      // Previous char was a valid escape char
      // treat the current char as a regular char
      if(this.state.escaping === true){
        this.state.escaping = false
      }else{
        // Escape is only active inside quoted fields
        if(this.state.quoting === true && chr === escape && pos + 1 < bufLen){
          // We are quoting, the char is an escape chr and there is a chr to escape
          if(escapeIsQuote){
            if(buf[pos+1] === quote){
              this.state.escaping = true
              continue
            }
          }else{
            this.state.escaping = true
            continue
          }
        }
        // Not currently escaping and chr is a quote
        // TODO: need to compare bytes instead of single char
        if(commenting === false && chr === quote){
          if(this.state.quoting === true){
            const nextChr = buf[pos+1]
            const isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr)
            // const isNextChrComment = nextChr === comment
            const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos+1, nextChr)
            const isNextChrDelimiter = this.__isDelimiter(nextChr, buf, pos+1)
            const isNextChrRowDelimiter = rowDelimiter.length === 0 ? this.__autoDiscoverRowDelimiter(buf, pos+1) : this.__isRowDelimiter(nextChr, buf, pos+1)
            // Escape a quote
            // Treat next char as a regular character
            // TODO: need to compare bytes instead of single char
            if(chr === escape && nextChr === quote){
              pos++
            }else if(!nextChr || isNextChrDelimiter || isNextChrRowDelimiter || isNextChrComment || isNextChrTrimable){
              this.state.quoting = false
              this.state.wasQuoting = true
              continue
            }else if(relax === false){
              const err = this.error(`Invalid Closing Quote: got "${String.fromCharCode(nextChr)}" at line ${this.info.lines} instead of delimiter, row delimiter, trimable character (if activated) or comment`)
              if(err !== undefined) return err
            }else{
              this.state.quoting = false
              this.state.wasQuoting = true
              // continue
              this.state.field.prepend(quote)
            }
          }else{
            if(this.state.field.length !== 0){
              // In relax mode, treat opening quote preceded by chrs as regular
              if( relax === false ){
                const err = this.error(`Invalid opening quote at line ${this.info.lines}`)
                if(err !== undefined) return err
              }
            }else{
              this.state.quoting = true
              continue
            }
          }
        }
        if(this.state.quoting === false){
          if(rowDelimiterLength !== 0){
            // Do not emit comments which take a full line
            const skipCommentLine = commenting && (this.state.record.length === 0 && this.state.field.length === 0)
            if(skipCommentLine){
              // TODO: update the doc, a line with comment is considered an
              // empty line in the sense that no record is found inside
              this.info.empty_line_count++
            }else{
              if(skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0){
                this.info.empty_line_count++
                continue
              }
              this.__onField()
              const err = this.__onRow()
              if(err !== undefined) return err
              if(to !== -1 && this.info.records >= to){
                this.state.stop = true
                this.push(null)
                return
              }
            }
            this.state.commenting = commenting = false
            pos += rowDelimiterLength - 1
            continue
          }
          if(commenting){
            continue
          }
          const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr)
          if(commentCount !== 0){
            this.state.commenting = commenting = true
            continue
          }
          let delimiterLength = this.__isDelimiter(chr, buf, pos)
          if(delimiterLength !== 0){
            this.__onField()
            pos += delimiterLength - 1
            continue
          }
        }
      }
      if(commenting === false && max_record_size !== 0){
        if(this.state.record_length + this.state.field.length > max_record_size){
          const err = this.error(`Max Record Size: record exceed the maximum number of tolerated bytes of ${max_record_size} on line ${this.info.lines}`)
          if(err !== undefined) return err
        }
      }
      const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr)
      // rtrim in non quoting is handle in __onField
      const rappend = rtrim === false || this.state.wasQuoting === false
      if( lappend === true && rappend === true ){
        this.state.field.append(chr)
      }else if(rtrim === true && !this.__isCharTrimable(chr)){
        const err = this.error(`Invalid Closing Quote: found non trimable byte after quote at line ${this.info.lines}`)
        if(err !== undefined) return err
      }
    }
    if(wasRowDelimiter === true){
      this.info.lines++
      wasRowDelimiter = false
    }
    if(end){
      if(this.state.quoting === true){
        const err = this.error(`Invalid Closing Quote: quote is not closed at line ${this.info.lines}`)
        if(err !== undefined) return err
      }else{
        // Skip last line if it has no characters
        if(this.state.record.length !== 0 || this.state.field.length !== 0){
          this.__onField()
          const err = this.__onRow()
          if(err !== undefined) return err
        }
      }
    }else{
      this.state.previousBuf = buf.slice(pos)
    }
  }
  __isCharTrimable(chr){
    return chr === space || chr === cr || chr === nl
  }
  __onRow(){
    const {columns, from, relax_column_count, raw, skip_lines_with_empty_values} = this.options
    const {record} = this.state
    const recordLength = record.length
    // Validate column length
    if(columns === true && this.state.firstLineToHeaders){
      return this.__firstLineToColumns(record)
    }
    if(columns === false && this.info.records === 0){
      this.state.expectedRecordLength = recordLength
    }else{
      if(relax_column_count === true){
        if(recordLength !== this.state.expectedRecordLength){
          this.info.skipped_line_count++
        }
      }else if(recordLength !== this.state.expectedRecordLength){
        if(columns === false){
          const err = this.error(`Invalid Record Length: expect ${this.state.expectedRecordLength}, got ${recordLength} on line ${this.info.lines}`)
          if(err !== undefined) return err
        }else{
          const err = this.error(`Invalid Record Length: header length is ${columns.length}, got ${recordLength} on line ${this.info.lines}`)
          if(err !== undefined) return err
        }
      }
    }
    if( skip_lines_with_empty_values === true){
      if(record.map( (field) => field.trim() ).join('') === ''){
        this.__resetRow()
        return
      }
    }
    if(this.state.recordHasError === true){
      this.__resetRow()
      this.state.recordHasError = false
      return
    }
    this.info.records++
    if(from === 1 || this.info.records >= from){
      if(columns !== false){
        const obj = {}
        for(let i in record){
          if(columns[i].disabled) continue
          obj[columns[i].name] = record[i]
        }
        const {objname} = this.options
        if(objname === undefined){
          if(raw === true){
            this.push({raw: this.state.rawBuffer.toString(), record: obj})
          }else{
            this.push(obj)
          }
        }else{
          if(raw === true){
            this.push({raw: this.state.rawBuffer.toString(), record: [obj[objname], obj]})
          }else{
            this.push([obj[objname], obj])
          }
        }
      }else{
        if(raw === true){
          this.push({raw: this.state.rawBuffer.toString(), record: record})
        }else{
          this.push(record)
        }
      }
    }
    this.__resetRow()
  }
  __firstLineToColumns(record){
    try{
      const headers = this.state.firstLineToHeaders.call(null, record)
      if(!Array.isArray(headers)){
        return this.error(`Invalid Header Mapping: expect an array, got ${JSON.stringify(headers)}`)
      }
      normalizeColumnsArray(headers)
      this.state.expectedRecordLength = headers.length
      this.options.columns = headers
      this.__resetRow()
      return
    }catch(err){
      return err
    }
  }
  __resetRow(){
    if(this.options.raw === true){
      this.state.rawBuffer.reset()
    }
    this.state.record = []
    this.state.record_length = 0
  }
  __onField(){
    const {cast, rtrim} = this.options
    const {wasQuoting} = this.state
    let field = this.state.field.toString()
    if(rtrim === true && wasQuoting === false){
      field = field.trimRight()
    }
    if(cast === true){
      field = this.__cast(field)
    }
    this.state.record.push(field)
    this.state.field.reset()
    this.state.record_length += field.length
    this.state.wasQuoting = false
  }
  __cast(field){
    const context = {
      column: Array.isArray(this.options.columns) === true ? this.options.columns[this.state.record.length] : this.state.record.length,
      header: this.options.columns === true,
      index: this.state.record.length,
      quoting: this.state.wasQuoting,
      lines: this.info.lines,
      records: this.info.records,
      empty_line_count: this.info.empty_line_count,
      skipped_line_count: this.info.skipped_line_count
    }
    if(this.state.castField !== null){
      return this.state.castField.call(null, field, context)
    }
    if(this.__isInt(field) === true){
      return parseInt(field)
    }else if(this.__isFloat(field)){
      return parseFloat(field)
    }else if(this.options.cast_date !== false){
      return this.options.cast_date(field, context)
    }
    return field
  }
  __isInt(value){
    return /^(\-|\+)?([1-9]+[0-9]*)$/.test(value)
  }
  __isFloat(value){
    return (value - parseFloat( value ) + 1) >= 0 // Borrowed from jquery
  }
  __compareBytes(sourceBuf, targetBuf, pos, firtByte){
    if(sourceBuf[0] !== firtByte) return 0
    const sourceLength = sourceBuf.length
    for(let i = 1; i < sourceLength; i++){
      if(sourceBuf[i] !== targetBuf[pos+i]) return 0
    }
    return sourceLength
  }
  __needMoreData(i, bufLen, end){
    if(end){
      return false
    }
    const {comment, delimiter, escape} = this.options
    const {quoting, rowDelimiterMaxLength} = this.state
    const numOfCharLeft = bufLen - i - 1
    const requiredLength = Math.max(
      // Skip if the remaining buffer smaller than comment
      comment ? comment.length : 0, 
      // Skip if the remaining buffer smaller than row delimiter
      rowDelimiterMaxLength,
      // Skip if the remaining buffer can be row delimiter following the closing quote
      // 1 is for quote.length
      quoting ? (1 + rowDelimiterMaxLength) : 0,
      // Skip if the remaining buffer can be delimiter
      delimiter.length,
      // Skip if the remaining buffer can be escape sequence
      // 1 is for escape.length
      1
    )
    return numOfCharLeft < requiredLength
  }
  __isDelimiter(chr, buf, pos){
    const {delimiter} = this.options
    const delLength = delimiter.length
    if(delimiter[0] !== chr) return 0
    for(let i = 1; i < delLength; i++){
      if(delimiter[i] !== buf[pos+i]) return 0
    }
    return delimiter.length
  }
  __isRowDelimiter(chr, buf, pos){
    const {rowDelimiter} = this.options
    const rowDelimiterLength = rowDelimiter.length
    loop1: for(let i = 0; i < rowDelimiterLength; i++){
      const rd = rowDelimiter[i]
      const rdLength = rd.length
      if(rd[0] !== chr){
        continue
      }
      for(let j = 1; j < rdLength; j++){
        if(rd[j] !== buf[pos+j]){
          continue loop1
        }
      }
      return rd.length
    }
    return 0
  }
  __autoDiscoverRowDelimiter(buf, pos){
    const chr = buf[pos]
    if(chr === cr){
      if(buf[pos+1] === nl){
        this.options.rowDelimiter.push(Buffer.from('\r\n'))
        this.state.rowDelimiterMaxLength = 2
        return 2
      }else{
        this.options.rowDelimiter.push(Buffer.from('\r'))
        this.state.rowDelimiterMaxLength = 1
        return 1
      }
    }else if(chr === nl){
      this.options.rowDelimiter.push(Buffer.from('\n'))
      this.state.rowDelimiterMaxLength = 1
      return 1
    }
    return 0
  }
  error(msg){
    const {skip_lines_with_error} = this.options
    const err = new Error(msg)
    if(skip_lines_with_error){
      this.state.recordHasError = true
      this.emit('skip', err)
      return undefined
    }else{
      return err
    }
  }
}

const parse = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new Error(`Invalid argument: got ${JSON.stringify(argument)} at index ${i}`)
    }
  }
  const parser = new Parser(options)
  if(callback){
    const records = options === undefined || options.objname === undefined ? [] : {}
    parser.on('readable', function(){
      let record
      while(record = this.read()){
        if(options === undefined || options.objname === undefined){
          records.push(record)
        }else{
          records[record[0]] = record[1]
        }
      }
    })
    parser.on('error', function(err){
      callback(err)
    })
    parser.on('end', function(){
      callback(null, records)
    })
  }
  if(data !== undefined){
    parser.write(data)
    parser.end()
  }
  return parser
}

parse.Parser = Parser

module.exports = parse

const isObject = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj))
}

const firstLineToHeadersDefault = function(record){
  return record.map(function(field){
    return {
      header: field,
      name: field
    }
  })
}

const normalizeColumnsArray = function(columns){
  for(let i=0; i< columns.length; i++){
    const column = columns[i]
    if(column === undefined || column === null || column === false){
      columns[i] = { disabled: true }
    }else if(typeof column === 'string'){
      columns[i] = { name: column }
    }else if(isObject(column)){
      if(typeof column.name !== 'string'){
        throw new Error(`Invalid Option columns: property "name" is required at position ${i}`)
      }
      columns[i] = column
    }else{
      throw new Error(`Invalid Option columns: expect a string or an object, got ${JSON.stringify(column)} at position ${i}`)
    }
  }
}
