'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stream = require('stream');
var util = require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);

const Generator = function(options = {}){
  // Convert Stream Readable options if underscored
  if(options.high_water_mark){
    options.highWaterMark = options.high_water_mark;
  }
  if(options.object_mode){
    options.objectMode = options.object_mode;
  }
  // Call parent constructor
  stream__default["default"].Readable.call(this, options);
  // Clone and camelize options
  this.options = {};
  for(const k in options){
    this.options[Generator.camelize(k)] = options[k];
  }
  // Normalize options
  const dft = {
    columns: 8,
    delimiter: ',',
    duration: null,
    encoding: null,
    end: null,
    eof: false,
    fixedSize: false,
    length: -1,
    maxWordLength: 16,
    rowDelimiter: '\n',
    seed: false,
    sleep: 0,
  };
  for(const k in dft){
    if(this.options[k] === undefined){
      this.options[k] = dft[k];
    }
  }
  // Default values
  if(this.options.eof === true){
    this.options.eof = this.options.rowDelimiter;
  }
  // State
  this._ = {
    start_time: this.options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0,
  };
  if(typeof this.options.columns === 'number'){
    this.options.columns = new Array(this.options.columns);
  }
  const accepted_header_types = Object.keys(Generator).filter((t) => (!['super_', 'camelize'].includes(t)));
  for(let i = 0; i < this.options.columns.length; i++){
    const v = this.options.columns[i] || 'ascii';
    if(typeof v === 'string'){
      if(!accepted_header_types.includes(v)){
        throw Error(`Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`);
      }
      this.options.columns[i] = Generator[v];
    }
  }
  return this;
};
util__default["default"].inherits(Generator, stream__default["default"].Readable);

// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
Generator.prototype.random = function(){
  if(this.options.seed){
    return this.options.seed = this.options.seed * Math.PI * 100 % 100 / 100;
  }else {
    return Math.random();
  }
};
// Stop the generation.
Generator.prototype.end = function(){
  this.push(null);
};
// Put new data into the read queue.
Generator.prototype._read = function(size){
  // Already started
  const data = [];
  let length = this._.fixed_size_buffer.length;
  if(length !== 0){
    data.push(this._.fixed_size_buffer);
  }
  // eslint-disable-next-line
  while(true){
    // Time for some rest: flush first and stop later
    if((this._.count_created === this.options.length) || (this.options.end && Date.now() > this.options.end) || (this.options.duration && Date.now() > this._.start_time + this.options.duration)){
      // Flush
      if(data.length){
        if(this.options.objectMode){
          for(const record of data){
            this.__push(record);
          }
        }else {
          this.__push(data.join('') + (this.options.eof ? this.options.eof : ''));
        }
        this._.end = true;
      }else {
        this.push(null);
      }
      return;
    }
    // Create the record
    let record = [];
    let recordLength;
    this.options.columns.forEach((fn) => {
      record.push(fn(this));
    });
    // Obtain record length
    if(this.options.objectMode){
      recordLength = 0;
      // recordLength is currently equal to the number of columns
      // This is wrong and shall equal to 1 record only
      for(const column of record)
        recordLength += column.length;
    }else {
      // Stringify the record
      record = (this._.count_created === 0 ? '' : this.options.rowDelimiter)+record.join(this.options.delimiter);
      recordLength = record.length;
    }
    this._.count_created++;
    if(length + recordLength > size){
      if(this.options.objectMode){
        data.push(record);
        for(const record of data){
          this.__push(record);
        }
      }else {
        if(this.options.fixedSize){
          this._.fixed_size_buffer = record.substr(size - length);
          data.push(record.substr(0, size - length));
        }else {
          data.push(record);
        }
        this.__push(data.join(''));
      }
      return;
    }
    length += recordLength;
    data.push(record);
  }
};
// Put new data into the read queue.
Generator.prototype.__push = function(record){
  const push = () => {
    this._.count_written++;
    this.push(record);
    if(this._.end === true){
      return this.push(null);
    }
  };
  this.options.sleep > 0 ? setTimeout(push, this.options.sleep) : push();
};
// Generate an ASCII value.
Generator.ascii = function(gen){
  // Column
  const column = [];
  const nb_chars = Math.ceil(gen.random() * gen.options.maxWordLength);
  for(let i=0; i<nb_chars; i++){
    const char = Math.floor(gen.random() * 32);
    column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
  }
  return column.join('');
};
// Generate an integer value.
Generator.int = function(gen){
  return Math.floor(gen.random() * Math.pow(2, 52));
};
// Generate an boolean value.
Generator.bool = function(gen){
  return Math.floor(gen.random() * 2);
};
// Camelize option properties
Generator.camelize = function(str){
  return str.replace(/_([a-z])/gi, function(_, match){
    return match.toUpperCase();
  });
};

const generate = function(options){
  if(typeof options === 'string' && /\d+/.test(options)){
    options = parseInt(options);
  }
  if(Number.isInteger(options)){
    options = {length: options};
  }else if(typeof options !== 'object' || options === null){
    throw Error('Invalid Argument: options must be an object or an integer');
  }
  if(!Number.isInteger(options.length)){
    throw Error('Invalid Argument: length is not defined');
  }
  const chunks = [];
  let work = true;
  // See https://nodejs.org/api/stream.html#stream_new_stream_readable_options
  options.highWaterMark = options.objectMode ? 16 : 16384;
  const generator = new Generator(options);
  generator.push = function(chunk){
    if(chunk === null){
      return work = false; 
    }
    if(options.objectMode){
      chunks.push(chunk);
    }else {
      chunks.push(chunk);  
    }
  };
  while(work){
    generator._read(options.highWaterMark);
  }
  if(!options.objectMode){
    return chunks.join('');
  }else {
    return chunks;
  }
};

class ResizeableBuffer{
  constructor(size=100){
    this.size = size;
    this.length = 0;
    this.buf = Buffer.allocUnsafe(size);
  }
  prepend(val){
    if(Buffer.isBuffer(val)){
      const length = this.length + val.length;
      if(length >= this.size){
        this.resize();
        if(length >= this.size){
          throw Error('INVALID_BUFFER_STATE');
        }
      }
      const buf = this.buf;
      this.buf = Buffer.allocUnsafe(this.size);
      val.copy(this.buf, 0);
      buf.copy(this.buf, val.length);
      this.length += val.length;
    }else {
      const length = this.length++;
      if(length === this.size){
        this.resize();
      }
      const buf = this.clone();
      this.buf[0] = val;
      buf.copy(this.buf,1, 0, length);
    }
  }
  append(val){
    const length = this.length++;
    if(length === this.size){
      this.resize();
    }
    this.buf[length] = val;
  }
  clone(){
    return Buffer.from(this.buf.slice(0, this.length));
  }
  resize(){
    const length = this.length;
    this.size = this.size * 2;
    const buf = Buffer.allocUnsafe(this.size);
    this.buf.copy(buf,0, 0, length);
    this.buf = buf;
  }
  toString(encoding){
    if(encoding){
      return this.buf.slice(0, this.length).toString(encoding);
    }else {
      return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length));
    }
  }
  toJSON(){
    return this.toString('utf8');
  }
  reset(){
    this.length = 0;
  }
}

// white space characters
// https://en.wikipedia.org/wiki/Whitespace_character
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types
// \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff
const tab = 9;
const nl = 10; // \n, 0x0A in hexadecimal, 10 in decimal
const np = 12;
const cr = 13; // \r, 0x0D in hexadécimal, 13 in decimal
const space = 32;
const boms = {
  // Note, the following are equals:
  // Buffer.from("\ufeff")
  // Buffer.from([239, 187, 191])
  // Buffer.from('EFBBBF', 'hex')
  'utf8': Buffer.from([239, 187, 191]),
  // Note, the following are equals:
  // Buffer.from "\ufeff", 'utf16le
  // Buffer.from([255, 254])
  'utf16le': Buffer.from([255, 254])
};

class CsvError$1 extends Error {
  constructor(code, message, options, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ');
    super(message);
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError$1);
    }
    this.code = code;
    for(const context of contexts){
      for(const key in context){
        const value = context[key];
        this[key] = Buffer.isBuffer(value) ? value.toString(options.encoding) : value == null ? value : JSON.parse(JSON.stringify(value));
      }
    }
  }
}

const underscore$1 = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase();
  });
};

const isObject$1 = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj));
};

const isRecordEmpty = function(record){
  return record.every((field) => field == null || field.toString && field.toString().trim() === '');
};

const normalizeColumnsArray = function(columns){
  const normalizedColumns = [];
  for(let i = 0, l = columns.length; i < l; i++){
    const column = columns[i];
    if(column === undefined || column === null || column === false){
      normalizedColumns[i] = { disabled: true };
    }else if(typeof column === 'string'){
      normalizedColumns[i] = { name: column };
    }else if(isObject$1(column)){
      if(typeof column.name !== 'string'){
        throw new CsvError$1('CSV_OPTION_COLUMNS_MISSING_NAME', [
          'Option columns missing name:',
          `property "name" is required at position ${i}`,
          'when column is an object literal'
        ]);
      }
      normalizedColumns[i] = column;
    }else {
      throw new CsvError$1('CSV_INVALID_COLUMN_DEFINITION', [
        'Invalid column definition:',
        'expect a string or a literal object,',
        `got ${JSON.stringify(column)} at position ${i}`
      ]);
    }
  }
  return normalizedColumns;
};

class Parser extends stream.Transform {
  constructor(opts = {}){
    super({...{readableObjectMode: true}, ...opts, encoding: null});
    this.__originalOptions = opts;
    this.__normalizeOptions(opts);
  }
  __normalizeOptions(opts){
    const options = {};
    // Merge with user options
    for(const opt in opts){
      options[underscore$1(opt)] = opts[opt];
    }
    // Normalize option `encoding`
    // Note: defined first because other options depends on it
    // to convert chars/strings into buffers.
    if(options.encoding === undefined || options.encoding === true){
      options.encoding = 'utf8';
    }else if(options.encoding === null || options.encoding === false){
      options.encoding = null;
    }else if(typeof options.encoding !== 'string' && options.encoding !== null){
      throw new CsvError$1('CSV_INVALID_OPTION_ENCODING', [
        'Invalid option encoding:',
        'encoding must be a string or null to return a buffer,',
        `got ${JSON.stringify(options.encoding)}`
      ], options);
    }
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false;
    }else if(options.bom !== true){
      throw new CsvError$1('CSV_INVALID_OPTION_BOM', [
        'Invalid option bom:', 'bom must be true,',
        `got ${JSON.stringify(options.bom)}`
      ], options);
    }
    // Normalize option `cast`
    let fnCastField = null;
    if(options.cast === undefined || options.cast === null || options.cast === false || options.cast === ''){
      options.cast = undefined;
    }else if(typeof options.cast === 'function'){
      fnCastField = options.cast;
      options.cast = true;
    }else if(options.cast !== true){
      throw new CsvError$1('CSV_INVALID_OPTION_CAST', [
        'Invalid option cast:', 'cast must be true or a function,',
        `got ${JSON.stringify(options.cast)}`
      ], options);
    }
    // Normalize option `cast_date`
    if(options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === ''){
      options.cast_date = false;
    }else if(options.cast_date === true){
      options.cast_date = function(value){
        const date = Date.parse(value);
        return !isNaN(date) ? new Date(date) : value;
      };
    }else {
      throw new CsvError$1('CSV_INVALID_OPTION_CAST_DATE', [
        'Invalid option cast_date:', 'cast_date must be true or a function,',
        `got ${JSON.stringify(options.cast_date)}`
      ], options);
    }
    // Normalize option `columns`
    let fnFirstLineToHeaders = null;
    if(options.columns === true){
      // Fields in the first line are converted as-is to columns
      fnFirstLineToHeaders = undefined;
    }else if(typeof options.columns === 'function'){
      fnFirstLineToHeaders = options.columns;
      options.columns = true;
    }else if(Array.isArray(options.columns)){
      options.columns = normalizeColumnsArray(options.columns);
    }else if(options.columns === undefined || options.columns === null || options.columns === false){
      options.columns = false;
    }else {
      throw new CsvError$1('CSV_INVALID_OPTION_COLUMNS', [
        'Invalid option columns:',
        'expect an array, a function or true,',
        `got ${JSON.stringify(options.columns)}`
      ], options);
    }
    // Normalize option `group_columns_by_name`
    if(options.group_columns_by_name === undefined || options.group_columns_by_name === null || options.group_columns_by_name === false){
      options.group_columns_by_name = false;
    }else if(options.group_columns_by_name !== true){
      throw new CsvError$1('CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME', [
        'Invalid option group_columns_by_name:',
        'expect an boolean,',
        `got ${JSON.stringify(options.group_columns_by_name)}`
      ], options);
    }else if(options.columns === false){
      throw new CsvError$1('CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME', [
        'Invalid option group_columns_by_name:',
        'the `columns` mode must be activated.'
      ], options);
    }
    // Normalize option `comment`
    if(options.comment === undefined || options.comment === null || options.comment === false || options.comment === ''){
      options.comment = null;
    }else {
      if(typeof options.comment === 'string'){
        options.comment = Buffer.from(options.comment, options.encoding);
      }
      if(!Buffer.isBuffer(options.comment)){
        throw new CsvError$1('CSV_INVALID_OPTION_COMMENT', [
          'Invalid option comment:',
          'comment must be a buffer or a string,',
          `got ${JSON.stringify(options.comment)}`
        ], options);
      }
    }
    // Normalize option `delimiter`
    const delimiter_json = JSON.stringify(options.delimiter);
    if(!Array.isArray(options.delimiter)) options.delimiter = [options.delimiter];
    if(options.delimiter.length === 0){
      throw new CsvError$1('CSV_INVALID_OPTION_DELIMITER', [
        'Invalid option delimiter:',
        'delimiter must be a non empty string or buffer or array of string|buffer,',
        `got ${delimiter_json}`
      ], options);
    }
    options.delimiter = options.delimiter.map(function(delimiter){
      if(delimiter === undefined || delimiter === null || delimiter === false){
        return Buffer.from(',', options.encoding);
      }
      if(typeof delimiter === 'string'){
        delimiter = Buffer.from(delimiter, options.encoding);
      }
      if(!Buffer.isBuffer(delimiter) || delimiter.length === 0){
        throw new CsvError$1('CSV_INVALID_OPTION_DELIMITER', [
          'Invalid option delimiter:',
          'delimiter must be a non empty string or buffer or array of string|buffer,',
          `got ${delimiter_json}`
        ], options);
      }
      return delimiter;
    });
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === true){
      options.escape = Buffer.from('"', options.encoding);
    }else if(typeof options.escape === 'string'){
      options.escape = Buffer.from(options.escape, options.encoding);
    }else if (options.escape === null || options.escape === false){
      options.escape = null;
    }
    if(options.escape !== null){
      if(!Buffer.isBuffer(options.escape)){
        throw new Error(`Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`);
      }
    }
    // Normalize option `from`
    if(options.from === undefined || options.from === null){
      options.from = 1;
    }else {
      if(typeof options.from === 'string' && /\d+/.test(options.from)){
        options.from = parseInt(options.from);
      }
      if(Number.isInteger(options.from)){
        if(options.from < 0){
          throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`);
        }
      }else {
        throw new Error(`Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`);
      }
    }
    // Normalize option `from_line`
    if(options.from_line === undefined || options.from_line === null){
      options.from_line = 1;
    }else {
      if(typeof options.from_line === 'string' && /\d+/.test(options.from_line)){
        options.from_line = parseInt(options.from_line);
      }
      if(Number.isInteger(options.from_line)){
        if(options.from_line <= 0){
          throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`);
        }
      }else {
        throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`);
      }
    }
    // Normalize options `ignore_last_delimiters`
    if(options.ignore_last_delimiters === undefined || options.ignore_last_delimiters === null){
      options.ignore_last_delimiters = false;
    }else if(typeof options.ignore_last_delimiters === 'number'){
      options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters);
      if(options.ignore_last_delimiters === 0){
        options.ignore_last_delimiters = false;
      }
    }else if(typeof options.ignore_last_delimiters !== 'boolean'){
      throw new CsvError$1('CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS', [
        'Invalid option `ignore_last_delimiters`:',
        'the value must be a boolean value or an integer,',
        `got ${JSON.stringify(options.ignore_last_delimiters)}`
      ], options);
    }
    if(options.ignore_last_delimiters === true && options.columns === false){
      throw new CsvError$1('CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS', [
        'The option `ignore_last_delimiters`',
        'requires the activation of the `columns` option'
      ], options);
    }
    // Normalize option `info`
    if(options.info === undefined || options.info === null || options.info === false){
      options.info = false;
    }else if(options.info !== true){
      throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`);
    }
    // Normalize option `max_record_size`
    if(options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false){
      options.max_record_size = 0;
    }else if(Number.isInteger(options.max_record_size) && options.max_record_size >= 0);else if(typeof options.max_record_size === 'string' && /\d+/.test(options.max_record_size)){
      options.max_record_size = parseInt(options.max_record_size);
    }else {
      throw new Error(`Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`);
    }
    // Normalize option `objname`
    if(options.objname === undefined || options.objname === null || options.objname === false){
      options.objname = undefined;
    }else if(Buffer.isBuffer(options.objname)){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty buffer`);
      }
      if(options.encoding === null);else {
        options.objname = options.objname.toString(options.encoding);
      }
    }else if(typeof options.objname === 'string'){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty string`);
      }
      // Great, nothing to do
    }else if(typeof options.objname === 'number');else {
      throw new Error(`Invalid Option: objname must be a string or a buffer, got ${options.objname}`);
    }
    if(options.objname !== undefined){
      if(typeof options.objname === 'number'){
        if(options.columns !== false){
          throw Error('Invalid Option: objname index cannot be combined with columns or be defined as a field');
        }
      }else { // A string or a buffer
        if(options.columns === false){
          throw Error('Invalid Option: objname field must be combined with columns or be defined as an index');
        }
      }
    }
    // Normalize option `on_record`
    if(options.on_record === undefined || options.on_record === null){
      options.on_record = undefined;
    }else if(typeof options.on_record !== 'function'){
      throw new CsvError$1('CSV_INVALID_OPTION_ON_RECORD', [
        'Invalid option `on_record`:',
        'expect a function,',
        `got ${JSON.stringify(options.on_record)}`
      ], options);
    }
    // Normalize option `quote`
    if(options.quote === null || options.quote === false || options.quote === ''){
      options.quote = null;
    }else {
      if(options.quote === undefined || options.quote === true){
        options.quote = Buffer.from('"', options.encoding);
      }else if(typeof options.quote === 'string'){
        options.quote = Buffer.from(options.quote, options.encoding);
      }
      if(!Buffer.isBuffer(options.quote)){
        throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`);
      }
    }
    // Normalize option `raw`
    if(options.raw === undefined || options.raw === null || options.raw === false){
      options.raw = false;
    }else if(options.raw !== true){
      throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`);
    }
    // Normalize option `record_delimiter`
    if(options.record_delimiter === undefined){
      options.record_delimiter = [];
    }else if(typeof options.record_delimiter === 'string' || Buffer.isBuffer(options.record_delimiter)){
      if(options.record_delimiter.length === 0){
        throw new CsvError$1('CSV_INVALID_OPTION_RECORD_DELIMITER', [
          'Invalid option `record_delimiter`:',
          'value must be a non empty string or buffer,',
          `got ${JSON.stringify(options.record_delimiter)}`
        ], options);
      }
      options.record_delimiter = [options.record_delimiter];
    }else if(!Array.isArray(options.record_delimiter)){
      throw new CsvError$1('CSV_INVALID_OPTION_RECORD_DELIMITER', [
        'Invalid option `record_delimiter`:',
        'value must be a string, a buffer or array of string|buffer,',
        `got ${JSON.stringify(options.record_delimiter)}`
      ], options);
    }
    options.record_delimiter = options.record_delimiter.map(function(rd, i){
      if(typeof rd !== 'string' && ! Buffer.isBuffer(rd)){
        throw new CsvError$1('CSV_INVALID_OPTION_RECORD_DELIMITER', [
          'Invalid option `record_delimiter`:',
          'value must be a string, a buffer or array of string|buffer',
          `at index ${i},`,
          `got ${JSON.stringify(rd)}`
        ], options);
      }else if(rd.length === 0){
        throw new CsvError$1('CSV_INVALID_OPTION_RECORD_DELIMITER', [
          'Invalid option `record_delimiter`:',
          'value must be a non empty string or buffer',
          `at index ${i},`,
          `got ${JSON.stringify(rd)}`
        ], options);
      }
      if(typeof rd === 'string'){
        rd = Buffer.from(rd, options.encoding);
      }
      return rd;
    });
    // Normalize option `relax_column_count`
    if(typeof options.relax_column_count === 'boolean');else if(options.relax_column_count === undefined || options.relax_column_count === null){
      options.relax_column_count = false;
    }else {
      throw new Error(`Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`);
    }
    if(typeof options.relax_column_count_less === 'boolean');else if(options.relax_column_count_less === undefined || options.relax_column_count_less === null){
      options.relax_column_count_less = false;
    }else {
      throw new Error(`Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`);
    }
    if(typeof options.relax_column_count_more === 'boolean');else if(options.relax_column_count_more === undefined || options.relax_column_count_more === null){
      options.relax_column_count_more = false;
    }else {
      throw new Error(`Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`);
    }
    // Normalize option `relax_quotes`
    if(typeof options.relax_quotes === 'boolean');else if(options.relax_quotes === undefined || options.relax_quotes === null){
      options.relax_quotes = false;
    }else {
      throw new Error(`Invalid Option: relax_quotes must be a boolean, got ${JSON.stringify(options.relax_quotes)}`);
    }
    // Normalize option `skip_empty_lines`
    if(typeof options.skip_empty_lines === 'boolean');else if(options.skip_empty_lines === undefined || options.skip_empty_lines === null){
      options.skip_empty_lines = false;
    }else {
      throw new Error(`Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`);
    }
    // Normalize option `skip_records_with_empty_values`
    if(typeof options.skip_records_with_empty_values === 'boolean');else if(options.skip_records_with_empty_values === undefined || options.skip_records_with_empty_values === null){
      options.skip_records_with_empty_values = false;
    }else {
      throw new Error(`Invalid Option: skip_records_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_records_with_empty_values)}`);
    }
    // Normalize option `skip_records_with_error`
    if(typeof options.skip_records_with_error === 'boolean');else if(options.skip_records_with_error === undefined || options.skip_records_with_error === null){
      options.skip_records_with_error = false;
    }else {
      throw new Error(`Invalid Option: skip_records_with_error must be a boolean, got ${JSON.stringify(options.skip_records_with_error)}`);
    }
    // Normalize option `rtrim`
    if(options.rtrim === undefined || options.rtrim === null || options.rtrim === false){
      options.rtrim = false;
    }else if(options.rtrim !== true){
      throw new Error(`Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`);
    }
    // Normalize option `ltrim`
    if(options.ltrim === undefined || options.ltrim === null || options.ltrim === false){
      options.ltrim = false;
    }else if(options.ltrim !== true){
      throw new Error(`Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`);
    }
    // Normalize option `trim`
    if(options.trim === undefined || options.trim === null || options.trim === false){
      options.trim = false;
    }else if(options.trim !== true){
      throw new Error(`Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`);
    }
    // Normalize options `trim`, `ltrim` and `rtrim`
    if(options.trim === true && opts.ltrim !== false){
      options.ltrim = true;
    }else if(options.ltrim !== true){
      options.ltrim = false;
    }
    if(options.trim === true && opts.rtrim !== false){
      options.rtrim = true;
    }else if(options.rtrim !== true){
      options.rtrim = false;
    }
    // Normalize option `to`
    if(options.to === undefined || options.to === null){
      options.to = -1;
    }else {
      if(typeof options.to === 'string' && /\d+/.test(options.to)){
        options.to = parseInt(options.to);
      }
      if(Number.isInteger(options.to)){
        if(options.to <= 0){
          throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`);
        }
      }else {
        throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`);
      }
    }
    // Normalize option `to_line`
    if(options.to_line === undefined || options.to_line === null){
      options.to_line = -1;
    }else {
      if(typeof options.to_line === 'string' && /\d+/.test(options.to_line)){
        options.to_line = parseInt(options.to_line);
      }
      if(Number.isInteger(options.to_line)){
        if(options.to_line <= 0){
          throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`);
        }
      }else {
        throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`);
      }
    }
    this.info = {
      bytes: 0,
      comment_lines: 0,
      empty_lines: 0,
      invalid_field_length: 0,
      lines: 1,
      records: 0
    };
    this.options = options;
    this.state = {
      bomSkipped: false,
      bufBytesStart: 0,
      castField: fnCastField,
      commenting: false,
      // Current error encountered by a record
      error: undefined,
      enabled: options.from_line === 1,
      escaping: false,
      escapeIsQuote: Buffer.isBuffer(options.escape) && Buffer.isBuffer(options.quote) && Buffer.compare(options.escape, options.quote) === 0,
      // columns can be `false`, `true`, `Array`
      expectedRecordLength: Array.isArray(options.columns) ? options.columns.length : undefined,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      needMoreDataSize: Math.max(
        // Skip if the remaining buffer smaller than comment
        options.comment !== null ? options.comment.length : 0,
        // Skip if the remaining buffer can be delimiter
        ...options.delimiter.map((delimiter) => delimiter.length),
        // Skip if the remaining buffer can be escape sequence
        options.quote !== null ? options.quote.length : 0,
      ),
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max(...options.record_delimiter.map((v) => v.length)),
      trimChars: [Buffer.from(' ', options.encoding)[0], Buffer.from('\t', options.encoding)[0]],
      wasQuoting: false,
      wasRowDelimiter: false
    };
  }
  // Implementation of `Transform._transform`
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.__parse(buf, false);
    if(err !== undefined){
      this.state.stop = true;
    }
    callback(err);
  }
  // Implementation of `Transform._flush`
  _flush(callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.__parse(undefined, true);
    callback(err);
  }
  // Central parser implementation
  __parse(nextBuf, end){
    const {bom, comment, escape, from_line, ltrim, max_record_size, quote, raw, relax_quotes, rtrim, skip_empty_lines, to, to_line} = this.options;
    let {record_delimiter} = this.options;
    const {bomSkipped, previousBuf, rawBuffer, escapeIsQuote} = this.state;
    let buf;
    if(previousBuf === undefined){
      if(nextBuf === undefined){
        // Handle empty string
        this.push(null);
        return;
      }else {
        buf = nextBuf;
      }
    }else if(previousBuf !== undefined && nextBuf === undefined){
      buf = previousBuf;
    }else {
      buf = Buffer.concat([previousBuf, nextBuf]);
    }
    // Handle UTF BOM
    if(bomSkipped === false){
      if(bom === false){
        this.state.bomSkipped = true;
      }else if(buf.length < 3){
        // No enough data
        if(end === false){
          // Wait for more data
          this.state.previousBuf = buf;
          return;
        }
      }else {
        for(const encoding in boms){
          if(boms[encoding].compare(buf, 0, boms[encoding].length) === 0){
            // Skip BOM
            const bomLength = boms[encoding].length;
            this.state.bufBytesStart += bomLength;
            buf = buf.slice(bomLength);
            // Renormalize original options with the new encoding
            this.__normalizeOptions({...this.__originalOptions, encoding: encoding});
            break;
          }
        }
        this.state.bomSkipped = true;
      }
    }
    const bufLen = buf.length;
    let pos;
    for(pos = 0; pos < bufLen; pos++){
      // Ensure we get enough space to look ahead
      // There should be a way to move this out of the loop
      if(this.__needMoreData(pos, bufLen, end)){
        break;
      }
      if(this.state.wasRowDelimiter === true){
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
      if(to_line !== -1 && this.info.lines > to_line){
        this.state.stop = true;
        this.push(null);
        return;
      }
      // Auto discovery of record_delimiter, unix, mac and windows supported
      if(this.state.quoting === false && record_delimiter.length === 0){
        const record_delimiterCount = this.__autoDiscoverRecordDelimiter(buf, pos);
        if(record_delimiterCount){
          record_delimiter = this.options.record_delimiter;
        }
      }
      const chr = buf[pos];
      if(raw === true){
        rawBuffer.append(chr);
      }
      if((chr === cr || chr === nl) && this.state.wasRowDelimiter === false){
        this.state.wasRowDelimiter = true;
      }
      // Previous char was a valid escape char
      // treat the current char as a regular char
      if(this.state.escaping === true){
        this.state.escaping = false;
      }else {
        // Escape is only active inside quoted fields
        // We are quoting, the char is an escape chr and there is a chr to escape
        // if(escape !== null && this.state.quoting === true && chr === escape && pos + 1 < bufLen){
        if(escape !== null && this.state.quoting === true && this.__isEscape(buf, pos, chr) && pos + escape.length < bufLen){
          if(escapeIsQuote){
            if(this.__isQuote(buf, pos+escape.length)){
              this.state.escaping = true;
              pos += escape.length - 1;
              continue;
            }
          }else {
            this.state.escaping = true;
            pos += escape.length - 1;
            continue;
          }
        }
        // Not currently escaping and chr is a quote
        // TODO: need to compare bytes instead of single char
        if(this.state.commenting === false && this.__isQuote(buf, pos)){
          if(this.state.quoting === true){
            const nextChr = buf[pos+quote.length];
            const isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr);
            const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos+quote.length, nextChr);
            const isNextChrDelimiter = this.__isDelimiter(buf, pos+quote.length, nextChr);
            const isNextChrRecordDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRecordDelimiter(buf, pos+quote.length) : this.__isRecordDelimiter(nextChr, buf, pos+quote.length);
            // Escape a quote
            // Treat next char as a regular character
            if(escape !== null && this.__isEscape(buf, pos, chr) && this.__isQuote(buf, pos + escape.length)){
              pos += escape.length - 1;
            }else if(!nextChr || isNextChrDelimiter || isNextChrRecordDelimiter || isNextChrComment || isNextChrTrimable){
              this.state.quoting = false;
              this.state.wasQuoting = true;
              pos += quote.length - 1;
              continue;
            }else if(relax_quotes === false){
              const err = this.__error(
                new CsvError$1('CSV_INVALID_CLOSING_QUOTE', [
                  'Invalid Closing Quote:',
                  `got "${String.fromCharCode(nextChr)}"`,
                  `at line ${this.info.lines}`,
                  'instead of delimiter, record delimiter, trimable character',
                  '(if activated) or comment',
                ], this.options, this.__infoField())
              );
              if(err !== undefined) return err;
            }else {
              this.state.quoting = false;
              this.state.wasQuoting = true;
              this.state.field.prepend(quote);
              pos += quote.length - 1;
            }
          }else {
            if(this.state.field.length !== 0){
              // In relax_quotes mode, treat opening quote preceded by chrs as regular
              if(relax_quotes === false){
                const err = this.__error(
                  new CsvError$1('INVALID_OPENING_QUOTE', [
                    'Invalid Opening Quote:',
                    `a quote is found inside a field at line ${this.info.lines}`,
                  ], this.options, this.__infoField(), {
                    field: this.state.field,
                  })
                );
                if(err !== undefined) return err;
              }
            }else {
              this.state.quoting = true;
              pos += quote.length - 1;
              continue;
            }
          }
        }
        if(this.state.quoting === false){
          const recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos);
          if(recordDelimiterLength !== 0){
            // Do not emit comments which take a full line
            const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0);
            if(skipCommentLine){
              this.info.comment_lines++;
              // Skip full comment line
            }else {
              // Activate records emition if above from_line
              if(this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1: 0) >= from_line){
                this.state.enabled = true;
                this.__resetField();
                this.__resetRecord();
                pos += recordDelimiterLength - 1;
                continue;
              }
              // Skip if line is empty and skip_empty_lines activated
              if(skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0){
                this.info.empty_lines++;
                pos += recordDelimiterLength - 1;
                continue;
              }
              this.info.bytes = this.state.bufBytesStart + pos;
              const errField = this.__onField();
              if(errField !== undefined) return errField;
              this.info.bytes = this.state.bufBytesStart + pos + recordDelimiterLength;
              const errRecord = this.__onRecord();
              if(errRecord !== undefined) return errRecord;
              if(to !== -1 && this.info.records >= to){
                this.state.stop = true;
                this.push(null);
                return;
              }
            }
            this.state.commenting = false;
            pos += recordDelimiterLength - 1;
            continue;
          }
          if(this.state.commenting){
            continue;
          }
          const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr);
          if(commentCount !== 0){
            this.state.commenting = true;
            continue;
          }
          const delimiterLength = this.__isDelimiter(buf, pos, chr);
          if(delimiterLength !== 0){
            this.info.bytes = this.state.bufBytesStart + pos;
            const errField = this.__onField();
            if(errField !== undefined) return errField;
            pos += delimiterLength - 1;
            continue;
          }
        }
      }
      if(this.state.commenting === false){
        if(max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size){
          const err = this.__error(
            new CsvError$1('CSV_MAX_RECORD_SIZE', [
              'Max Record Size:',
              'record exceed the maximum number of tolerated bytes',
              `of ${max_record_size}`,
              `at line ${this.info.lines}`,
            ], this.options, this.__infoField())
          );
          if(err !== undefined) return err;
        }
      }
      const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr);
      // rtrim in non quoting is handle in __onField
      const rappend = rtrim === false || this.state.wasQuoting === false;
      if(lappend === true && rappend === true){
        this.state.field.append(chr);
      }else if(rtrim === true && !this.__isCharTrimable(chr)){
        const err = this.__error(
          new CsvError$1('CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE', [
            'Invalid Closing Quote:',
            'found non trimable byte after quote',
            `at line ${this.info.lines}`,
          ], this.options, this.__infoField())
        );
        if(err !== undefined) return err;
      }
    }
    if(end === true){
      // Ensure we are not ending in a quoting state
      if(this.state.quoting === true){
        const err = this.__error(
          new CsvError$1('CSV_QUOTE_NOT_CLOSED', [
            'Quote Not Closed:',
            `the parsing is finished with an opening quote at line ${this.info.lines}`,
          ], this.options, this.__infoField())
        );
        if(err !== undefined) return err;
      }else {
        // Skip last line if it has no characters
        if(this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0){
          this.info.bytes = this.state.bufBytesStart + pos;
          const errField = this.__onField();
          if(errField !== undefined) return errField;
          const errRecord = this.__onRecord();
          if(errRecord !== undefined) return errRecord;
        }else if(this.state.wasRowDelimiter === true){
          this.info.empty_lines++;
        }else if(this.state.commenting === true){
          this.info.comment_lines++;
        }
      }
    }else {
      this.state.bufBytesStart += pos;
      this.state.previousBuf = buf.slice(pos);
    }
    if(this.state.wasRowDelimiter === true){
      this.info.lines++;
      this.state.wasRowDelimiter = false;
    }
  }
  __onRecord(){
    const {columns, group_columns_by_name, encoding, info, from, relax_column_count, relax_column_count_less, relax_column_count_more, raw, skip_records_with_empty_values} = this.options;
    const {enabled, record} = this.state;
    if(enabled === false){
      return this.__resetRecord();
    }
    // Convert the first line into column names
    const recordLength = record.length;
    if(columns === true){
      if(skip_records_with_empty_values === true && isRecordEmpty(record)){
        this.__resetRecord();
        return;
      }
      return this.__firstLineToColumns(record);
    }
    if(columns === false && this.info.records === 0){
      this.state.expectedRecordLength = recordLength;
    }
    if(recordLength !== this.state.expectedRecordLength){
      const err = columns === false ?
        new CsvError$1('CSV_RECORD_INCONSISTENT_FIELDS_LENGTH', [
          'Invalid Record Length:',
          `expect ${this.state.expectedRecordLength},`,
          `got ${recordLength} on line ${this.info.lines}`,
        ], this.options, this.__infoField(), {
          record: record,
        })
        :
        new CsvError$1('CSV_RECORD_INCONSISTENT_COLUMNS', [
          'Invalid Record Length:',
          `columns length is ${columns.length},`, // rename columns
          `got ${recordLength} on line ${this.info.lines}`,
        ], this.options, this.__infoField(), {
          record: record,
        });
      if(relax_column_count === true ||
        (relax_column_count_less === true && recordLength < this.state.expectedRecordLength) ||
        (relax_column_count_more === true && recordLength > this.state.expectedRecordLength)){
        this.info.invalid_field_length++;
        this.state.error = err;
      // Error is undefined with skip_records_with_error
      }else {
        const finalErr = this.__error(err);
        if(finalErr) return finalErr;
      }
    }
    if(skip_records_with_empty_values === true && isRecordEmpty(record)){
      this.__resetRecord();
      return;
    }
    if(this.state.recordHasError === true){
      this.__resetRecord();
      this.state.recordHasError = false;
      return;
    }
    this.info.records++;
    if(from === 1 || this.info.records >= from){
      const {objname} = this.options;
      // With columns, records are object
      if(columns !== false){
        const obj = {};
        // Transform record array to an object
        for(let i = 0, l = record.length; i < l; i++){
          if(columns[i] === undefined || columns[i].disabled) continue;
          // Turn duplicate columns into an array
          if (group_columns_by_name === true && obj[columns[i].name] !== undefined) {
            if (Array.isArray(obj[columns[i].name])) {
              obj[columns[i].name] = obj[columns[i].name].concat(record[i]);
            } else {
              obj[columns[i].name] = [obj[columns[i].name], record[i]];
            }
          } else {
            obj[columns[i].name] = record[i];
          }
        }
        // Without objname (default)
        if(raw === true || info === true){
          const extRecord = Object.assign(
            {record: obj},
            (raw === true ? {raw: this.state.rawBuffer.toString(encoding)}: {}),
            (info === true ? {info: this.__infoRecord()}: {})
          );
          const err = this.__push(
            objname === undefined ? extRecord : [obj[objname], extRecord]
          );
          if(err){
            return err;
          }
        }else {
          const err = this.__push(
            objname === undefined ? obj : [obj[objname], obj]
          );
          if(err){
            return err;
          }
        }
      // Without columns, records are array
      }else {
        if(raw === true || info === true){
          const extRecord = Object.assign(
            {record: record},
            raw === true ? {raw: this.state.rawBuffer.toString(encoding)}: {},
            info === true ? {info: this.__infoRecord()}: {}
          );
          const err = this.__push(
            objname === undefined ? extRecord : [record[objname], extRecord]
          );
          if(err){
            return err;
          }
        }else {
          const err = this.__push(
            objname === undefined ? record : [record[objname], record]
          );
          if(err){
            return err;
          }
        }
      }
    }
    this.__resetRecord();
  }
  __firstLineToColumns(record){
    const {firstLineToHeaders} = this.state;
    try{
      const headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record);
      if(!Array.isArray(headers)){
        return this.__error(
          new CsvError$1('CSV_INVALID_COLUMN_MAPPING', [
            'Invalid Column Mapping:',
            'expect an array from column function,',
            `got ${JSON.stringify(headers)}`
          ], this.options, this.__infoField(), {
            headers: headers,
          })
        );
      }
      const normalizedHeaders = normalizeColumnsArray(headers);
      this.state.expectedRecordLength = normalizedHeaders.length;
      this.options.columns = normalizedHeaders;
      this.__resetRecord();
      return;
    }catch(err){
      return err;
    }
  }
  __resetRecord(){
    if(this.options.raw === true){
      this.state.rawBuffer.reset();
    }
    this.state.error = undefined;
    this.state.record = [];
    this.state.record_length = 0;
  }
  __onField(){
    const {cast, encoding, rtrim, max_record_size} = this.options;
    const {enabled, wasQuoting} = this.state;
    // Short circuit for the from_line options
    if(enabled === false){
      return this.__resetField();
    }
    let field = this.state.field.toString(encoding);
    if(rtrim === true && wasQuoting === false){
      field = field.trimRight();
    }
    if(cast === true){
      const [err, f] = this.__cast(field);
      if(err !== undefined) return err;
      field = f;
    }
    this.state.record.push(field);
    // Increment record length if record size must not exceed a limit
    if(max_record_size !== 0 && typeof field === 'string'){
      this.state.record_length += field.length;
    }
    this.__resetField();
  }
  __resetField(){
    this.state.field.reset();
    this.state.wasQuoting = false;
  }
  __push(record){
    const {on_record} = this.options;
    if(on_record !== undefined){
      const info = this.__infoRecord();
      try{
        record = on_record.call(null, record, info);
      }catch(err){
        return err;
      }
      if(record === undefined || record === null){ return; }
    }
    this.push(record);
  }
  // Return a tuple with the error and the casted value
  __cast(field){
    const {columns, relax_column_count} = this.options;
    const isColumns = Array.isArray(columns);
    // Dont loose time calling cast
    // because the final record is an object
    // and this field can't be associated to a key present in columns
    if(isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length){
      return [undefined, undefined];
    }
    if(this.state.castField !== null){
      try{
        const info = this.__infoField();
        return [undefined, this.state.castField.call(null, field, info)];
      }catch(err){
        return [err];
      }
    }
    if(this.__isFloat(field)){
      return [undefined, parseFloat(field)];
    }else if(this.options.cast_date !== false){
      const info = this.__infoField();
      return [undefined, this.options.cast_date.call(null, field, info)];
    }
    return [undefined, field];
  }
  // Helper to test if a character is a space or a line delimiter
  __isCharTrimable(chr){
    return chr === space || chr === tab || chr === cr || chr === nl || chr === np;
  }
  // Keep it in case we implement the `cast_int` option
  // __isInt(value){
  //   // return Number.isInteger(parseInt(value))
  //   // return !isNaN( parseInt( obj ) );
  //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
  // }
  __isFloat(value){
    return (value - parseFloat(value) + 1) >= 0; // Borrowed from jquery
  }
  __compareBytes(sourceBuf, targetBuf, targetPos, firstByte){
    if(sourceBuf[0] !== firstByte) return 0;
    const sourceLength = sourceBuf.length;
    for(let i = 1; i < sourceLength; i++){
      if(sourceBuf[i] !== targetBuf[targetPos+i]) return 0;
    }
    return sourceLength;
  }
  __needMoreData(i, bufLen, end){
    if(end) return false;
    const {quote} = this.options;
    const {quoting, needMoreDataSize, recordDelimiterMaxLength} = this.state;
    const numOfCharLeft = bufLen - i - 1;
    const requiredLength = Math.max(
      needMoreDataSize,
      // Skip if the remaining buffer smaller than record delimiter
      recordDelimiterMaxLength,
      // Skip if the remaining buffer can be record delimiter following the closing quote
      // 1 is for quote.length
      quoting ? (quote.length + recordDelimiterMaxLength) : 0,
    );
    return numOfCharLeft < requiredLength;
  }
  __isDelimiter(buf, pos, chr){
    const {delimiter, ignore_last_delimiters} = this.options;
    if(ignore_last_delimiters === true && this.state.record.length === this.options.columns.length - 1){
      return 0;
    }else if(ignore_last_delimiters !== false && typeof ignore_last_delimiters === 'number' && this.state.record.length === ignore_last_delimiters - 1){
      return 0;
    }
    loop1: for(let i = 0; i < delimiter.length; i++){
      const del = delimiter[i];
      if(del[0] === chr){
        for(let j = 1; j < del.length; j++){
          if(del[j] !== buf[pos+j]) continue loop1;
        }
        return del.length;
      }
    }
    return 0;
  }
  __isRecordDelimiter(chr, buf, pos){
    const {record_delimiter} = this.options;
    const recordDelimiterLength = record_delimiter.length;
    loop1: for(let i = 0; i < recordDelimiterLength; i++){
      const rd = record_delimiter[i];
      const rdLength = rd.length;
      if(rd[0] !== chr){
        continue;
      }
      for(let j = 1; j < rdLength; j++){
        if(rd[j] !== buf[pos+j]){
          continue loop1;
        }
      }
      return rd.length;
    }
    return 0;
  }
  __isEscape(buf, pos, chr){
    const {escape} = this.options;
    if(escape === null) return false;
    const l = escape.length;
    if(escape[0] === chr){
      for(let i = 0; i < l; i++){
        if(escape[i] !== buf[pos+i]){
          return false;
        }
      }
      return true;
    }
    return false;
  }
  __isQuote(buf, pos){
    const {quote} = this.options;
    if(quote === null) return false;
    const l = quote.length;
    for(let i = 0; i < l; i++){
      if(quote[i] !== buf[pos+i]){
        return false;
      }
    }
    return true;
  }
  __autoDiscoverRecordDelimiter(buf, pos){
    const {encoding} = this.options;
    const chr = buf[pos];
    if(chr === cr){
      if(buf[pos+1] === nl){
        this.options.record_delimiter.push(Buffer.from('\r\n', encoding));
        this.state.recordDelimiterMaxLength = 2;
        return 2;
      }else {
        this.options.record_delimiter.push(Buffer.from('\r', encoding));
        this.state.recordDelimiterMaxLength = 1;
        return 1;
      }
    }else if(chr === nl){
      this.options.record_delimiter.push(Buffer.from('\n', encoding));
      this.state.recordDelimiterMaxLength = 1;
      return 1;
    }
    return 0;
  }
  __error(msg){
    const {encoding, raw, skip_records_with_error} = this.options;
    const err = typeof msg === 'string' ? new Error(msg) : msg;
    if(skip_records_with_error){
      this.state.recordHasError = true;
      this.emit('skip', err, raw ? this.state.rawBuffer.toString(encoding) : undefined);
      return undefined;
    }else {
      return err;
    }
  }
  __infoDataSet(){
    return {
      ...this.info,
      columns: this.options.columns
    };
  }
  __infoRecord(){
    const {columns, raw, encoding} = this.options;
    return {
      ...this.__infoDataSet(),
      error: this.state.error,
      header: columns === true,
      index: this.state.record.length,
      raw: raw ? this.state.rawBuffer.toString(encoding) : undefined
    };
  }
  __infoField(){
    const {columns} = this.options;
    const isColumns = Array.isArray(columns);
    return {
      ...this.__infoRecord(),
      column: isColumns === true ?
        (columns.length > this.state.record.length ?
          columns[this.state.record.length].name :
          null
        ) :
        this.state.record.length,
      quoting: this.state.wasQuoting,
    };
  }
}

const parse = function(data, options={}){
  if(typeof data === 'string'){
    data = Buffer.from(data);
  }
  const records = options && options.objname ? {} : [];
  const parser = new Parser(options);
  parser.push = function(record){
    if(record === null){
      return;
    }
    if(options.objname === undefined)
      records.push(record);
    else {
      records[record[0]] = record[1];
    }
  };
  const err1 = parser.__parse(data, false);
  if(err1 !== undefined) throw err1;
  const err2 = parser.__parse(undefined, true);
  if(err2 !== undefined) throw err2;
  return records;
};

const bom_utf8 = Buffer.from([239, 187, 191]);

class CsvError extends Error {
  constructor(code, message, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ');
    super(message);
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError);
    }
    this.code = code;
    for(const context of contexts){
      for(const key in context){
        const value = context[key];
        this[key] = Buffer.isBuffer(value) ? value.toString() : value == null ? value : JSON.parse(JSON.stringify(value));
      }
    }
  }
}

const isObject = function(obj){
  return typeof obj === 'object' && obj !== null && ! Array.isArray(obj);
};

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase();
  });
};

// Lodash implementation of `get`

const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g');
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;
const getTag = function(value){
  return Object.prototype.toString.call(value);
};
const isSymbol = function(value){
  const type = typeof value;
  return type === 'symbol' || (type === 'object' && value && getTag(value) === '[object Symbol]');
};
const isKey = function(value, object){
  if(Array.isArray(value)){
    return false;
  }
  const type = typeof value;
  if(type === 'number' || type === 'symbol' || type === 'boolean' || !value || isSymbol(value)){
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
};
const stringToPath = function(string){
  const result = [];
  if(string.charCodeAt(0) === charCodeOfDot){
    result.push('');
  }
  string.replace(rePropName, function(match, expression, quote, subString){
    let key = match;
    if(quote){
      key = subString.replace(reEscapeChar, '$1');
    }else if(expression){
      key = expression.trim();
    }
    result.push(key);
  });
  return result;
};
const castPath = function(value, object){
  if(Array.isArray(value)){
    return value;
  } else {
    return isKey(value, object) ? [value] : stringToPath(value);
  }
};
const toKey = function(value){
  if(typeof value === 'string' || isSymbol(value))
    return value;
  const result = `${value}`;
  // eslint-disable-next-line
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
};
const get = function(object, path){
  path = castPath(path, object);
  let index = 0;
  const length = path.length;
  while(object != null && index < length){
    object = object[toKey(path[index++])];
  }
  return (index && index === length) ? object : undefined;
};

class Stringifier extends stream.Transform {
  constructor(opts = {}){
    super({...{writableObjectMode: true}, ...opts});
    const options = {};
    let err;
    // Merge with user options
    for(const opt in opts){
      options[underscore(opt)] = opts[opt];
    }
    if((err = this.normalize(options)) !== undefined) throw err;
    switch(options.record_delimiter){
    case 'auto':
      options.record_delimiter = null;
      break;
    case 'unix':
      options.record_delimiter = "\n";
      break;
    case 'mac':
      options.record_delimiter = "\r";
      break;
    case 'windows':
      options.record_delimiter = "\r\n";
      break;
    case 'ascii':
      options.record_delimiter = "\u001e";
      break;
    case 'unicode':
      options.record_delimiter = "\u2028";
      break;
    }
    // Expose options
    this.options = options;
    // Internal state
    this.state = {
      stop: false
    };
    // Information
    this.info = {
      records: 0
    };
  }
  normalize(options){
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false;
    }else if(options.bom !== true){
      return new CsvError('CSV_OPTION_BOOLEAN_INVALID_TYPE', [
        'option `bom` is optional and must be a boolean value,',
        `got ${JSON.stringify(options.bom)}`
      ]);
    }
    // Normalize option `delimiter`
    if(options.delimiter === undefined || options.delimiter === null){
      options.delimiter = ',';
    }else if(Buffer.isBuffer(options.delimiter)){
      options.delimiter = options.delimiter.toString();
    }else if(typeof options.delimiter !== 'string'){
      return new CsvError('CSV_OPTION_DELIMITER_INVALID_TYPE', [
        'option `delimiter` must be a buffer or a string,',
        `got ${JSON.stringify(options.delimiter)}`
      ]);
    }
    // Normalize option `quote`
    if(options.quote === undefined || options.quote === null){
      options.quote = '"';
    }else if(options.quote === true){
      options.quote = '"';
    }else if(options.quote === false){
      options.quote = '';
    }else if (Buffer.isBuffer(options.quote)){
      options.quote = options.quote.toString();
    }else if(typeof options.quote !== 'string'){
      return new CsvError('CSV_OPTION_QUOTE_INVALID_TYPE', [
        'option `quote` must be a boolean, a buffer or a string,',
        `got ${JSON.stringify(options.quote)}`
      ]);
    }
    // Normalize option `quoted`
    if(options.quoted === undefined || options.quoted === null){
      options.quoted = false;
    }
    // Normalize option `quoted_empty`
    if(options.quoted_empty === undefined || options.quoted_empty === null){
      options.quoted_empty = undefined;
    }
    // Normalize option `quoted_match`
    if(options.quoted_match === undefined || options.quoted_match === null || options.quoted_match === false){
      options.quoted_match = null;
    }else if(!Array.isArray(options.quoted_match)){
      options.quoted_match = [options.quoted_match];
    }
    if(options.quoted_match){
      for(const quoted_match of options.quoted_match){
        const isString = typeof quoted_match === 'string';
        const isRegExp = quoted_match instanceof RegExp;
        if(!isString && !isRegExp){
          return Error(`Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`);
        }
      }
    }
    // Normalize option `quoted_string`
    if(options.quoted_string === undefined || options.quoted_string === null){
      options.quoted_string = false;
    }
    // Normalize option `eof`
    if(options.eof === undefined || options.eof === null){
      options.eof = true;
    }
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === null){
      options.escape = '"';
    }else if(Buffer.isBuffer(options.escape)){
      options.escape = options.escape.toString();
    }else if(typeof options.escape !== 'string'){
      return Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`);
    }
    if (options.escape.length > 1){
      return Error(`Invalid Option: escape must be one character, got ${options.escape.length} characters`);
    }
    // Normalize option `header`
    if(options.header === undefined || options.header === null){
      options.header = false;
    }
    // Normalize option `columns`
    const [err, columns] = this.normalize_columns(options.columns);
    if(err) return err;
    options.columns = columns;
    // Normalize option `quoted`
    if(options.quoted === undefined || options.quoted === null){
      options.quoted = false;
    }
    // Normalize option `cast`
    if(options.cast === undefined || options.cast === null){
      options.cast = {};
    }
    // Normalize option cast.bigint
    if(options.cast.bigint === undefined || options.cast.bigint === null){
      // Cast boolean to string by default
      options.cast.bigint = value => '' + value;
    }
    // Normalize option cast.boolean
    if(options.cast.boolean === undefined || options.cast.boolean === null){
      // Cast boolean to string by default
      options.cast.boolean = value => value ? '1' : '';
    }
    // Normalize option cast.date
    if(options.cast.date === undefined || options.cast.date === null){
      // Cast date to timestamp string by default
      options.cast.date = value => '' + value.getTime();
    }
    // Normalize option cast.number
    if(options.cast.number === undefined || options.cast.number === null){
      // Cast number to string using native casting by default
      options.cast.number = value => '' + value;
    }
    // Normalize option cast.object
    if(options.cast.object === undefined || options.cast.object === null){
      // Stringify object as JSON by default
      options.cast.object = value => JSON.stringify(value);
    }
    // Normalize option cast.string
    if(options.cast.string === undefined || options.cast.string === null){
      // Leave string untouched
      options.cast.string = function(value){return value;};
    }
    // Normalize option `record_delimiter`
    if(options.record_delimiter === undefined || options.record_delimiter === null){
      options.record_delimiter = '\n';
    }else if(Buffer.isBuffer(options.record_delimiter)){
      options.record_delimiter = options.record_delimiter.toString();
    }else if(typeof options.record_delimiter !== 'string'){
      return Error(`Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(options.record_delimiter)}`);
    }
  }
  _transform(chunk, encoding, callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.__transform(chunk);
    if(err !== undefined){
      this.state.stop = true;
    }
    callback(err);
  }
  _flush(callback){
    if(this.state.stop === true){
      // Note, Node.js 12 call flush even after an error, we must prevent
      // `callback` from being called in flush without any error.
      return;
    }
    if(this.info.records === 0){
      this.bom();
      const err = this.headers();
      if(err) callback(err);
    }
    callback();
  }
  __transform(chunk){
    // Chunk validation
    if(!Array.isArray(chunk) && typeof chunk !== 'object'){
      return Error(`Invalid Record: expect an array or an object, got ${JSON.stringify(chunk)}`);
    }
    // Detect columns from the first record
    if(this.info.records === 0){
      if(Array.isArray(chunk)){
        if(this.options.header === true && this.options.columns === undefined){
          return Error('Undiscoverable Columns: header option requires column option or object records');
        }
      }else if(this.options.columns === undefined){
        const [err, columns] = this.normalize_columns(Object.keys(chunk));
        if(err) return;
        this.options.columns = columns;
      }
    }
    // Emit the header
    if(this.info.records === 0){
      this.bom();
      const err = this.headers();
      if(err) return err;
    }
    // Emit and stringify the record if an object or an array
    try{
      this.emit('record', chunk, this.info.records);
    }catch(err){
      return err;
    }
    // Convert the record into a string
    let err, chunk_string;
    if(this.options.eof){
      [err, chunk_string] = this.stringify(chunk);
      if(err) return err;
      if(chunk_string === undefined){
        return;
      }else {
        chunk_string = chunk_string + this.options.record_delimiter;
      }
    }else {
      [err, chunk_string] = this.stringify(chunk);
      if(err) return err;
      if(chunk_string === undefined){
        return;
      }else {
        if(this.options.header || this.info.records){
          chunk_string = this.options.record_delimiter + chunk_string;
        }
      }
    }
    // Emit the csv
    this.info.records++;
    this.push(chunk_string);
  }
  stringify(chunk, chunkIsHeader=false){
    if(typeof chunk !== 'object'){
      return [undefined, chunk];
    }
    const {columns} = this.options;
    const record = [];
    // Record is an array
    if(Array.isArray(chunk)){
      // We are getting an array but the user has specified output columns. In
      // this case, we respect the columns indexes
      if(columns){
        chunk.splice(columns.length);
      }
      // Cast record elements
      for(let i=0; i<chunk.length; i++){
        const field = chunk[i];
        const [err, value] = this.__cast(field, {
          index: i, column: i, records: this.info.records, header: chunkIsHeader
        });
        if(err) return [err];
        record[i] = [value, field];
      }
    // Record is a literal object
    // `columns` is always defined: it is either provided or discovered.
    }else {
      for(let i=0; i<columns.length; i++){
        const field = get(chunk, columns[i].key);
        const [err, value] = this.__cast(field, {
          index: i, column: columns[i].key, records: this.info.records, header: chunkIsHeader
        });
        if(err) return [err];
        record[i] = [value, field];
      }
    }
    let csvrecord = '';
    for(let i=0; i<record.length; i++){
      let options, err;
      // eslint-disable-next-line
      let [value, field] = record[i];
      if(typeof value === "string"){
        options = this.options;
      }else if(isObject(value)){
        options = value;
        value = options.value;
        delete options.value;
        if(typeof value !== "string" && value !== undefined && value !== null){
          if(err) return [Error(`Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`)];
        }
        options = {...this.options, ...options};
        if((err = this.normalize(options)) !== undefined){
          return [err];
        }
      }else if(value === undefined || value === null){
        options = this.options;
      }else {
        return [Error(`Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`)];
      }
      const {delimiter, escape, quote, quoted, quoted_empty, quoted_string, quoted_match, record_delimiter} = options;
      if(value){
        if(typeof value !== 'string'){
          return [Error(`Formatter must return a string, null or undefined, got ${JSON.stringify(value)}`)];
        }
        const containsdelimiter = delimiter.length && value.indexOf(delimiter) >= 0;
        const containsQuote = (quote !== '') && value.indexOf(quote) >= 0;
        const containsEscape = value.indexOf(escape) >= 0 && (escape !== quote);
        const containsRecordDelimiter = value.indexOf(record_delimiter) >= 0;
        const quotedString = quoted_string && typeof field === 'string';
        let quotedMatch = quoted_match && quoted_match.filter(quoted_match => {
          if(typeof quoted_match === 'string'){
            return value.indexOf(quoted_match) !== -1;
          }else {
            return quoted_match.test(value);
          }
        });
        quotedMatch = quotedMatch && quotedMatch.length > 0;
        const shouldQuote = containsQuote === true || containsdelimiter || containsRecordDelimiter || quoted || quotedString || quotedMatch;
        if(shouldQuote === true && containsEscape === true){
          const regexp = escape === '\\'
            ? new RegExp(escape + escape, 'g')
            : new RegExp(escape, 'g');
          value = value.replace(regexp, escape + escape);
        }
        if(containsQuote === true){
          const regexp = new RegExp(quote,'g');
          value = value.replace(regexp, escape + quote);
        }
        if(shouldQuote === true){
          value = quote + value + quote;
        }
        csvrecord += value;
      }else if(quoted_empty === true || (field === '' && quoted_string === true && quoted_empty !== false)){
        csvrecord += quote + quote;
      }
      if(i !== record.length - 1){
        csvrecord += delimiter;
      }
    }
    return [undefined, csvrecord];
  }
  bom(){
    if(this.options.bom !== true){
      return;
    }
    this.push(bom_utf8);
  }
  headers(){
    if(this.options.header === false){
      return;
    }
    if(this.options.columns === undefined){
      return;
    }
    let err;
    let headers = this.options.columns.map(column => column.header);
    if(this.options.eof){
      [err, headers] = this.stringify(headers, true);
      headers += this.options.record_delimiter;
    }else {
      [err, headers] = this.stringify(headers);
    }
    if(err) return err;
    this.push(headers);
  }
  __cast(value, context){
    const type = typeof value;
    try{
      if(type === 'string'){ // Fine for 99% of the cases
        return [undefined, this.options.cast.string(value, context)];
      }else if(type === 'bigint'){
        return [undefined, this.options.cast.bigint(value, context)];
      }else if(type === 'number'){
        return [undefined, this.options.cast.number(value, context)];
      }else if(type === 'boolean'){
        return [undefined, this.options.cast.boolean(value, context)];
      }else if(value instanceof Date){
        return [undefined, this.options.cast.date(value, context)];
      }else if(type === 'object' && value !== null){
        return [undefined, this.options.cast.object(value, context)];
      }else {
        return [undefined, value, value];
      }
    }catch(err){
      return [err];
    }
  }
  normalize_columns(columns){
    if(columns === undefined || columns === null){
      return [];
    }
    if(typeof columns !== 'object'){
      return [Error('Invalid option "columns": expect an array or an object')];
    }
    if(!Array.isArray(columns)){
      const newcolumns = [];
      for(const k in columns){
        newcolumns.push({
          key: k,
          header: columns[k]
        });
      }
      columns = newcolumns;
    }else {
      const newcolumns = [];
      for(const column of columns){
        if(typeof column === 'string'){
          newcolumns.push({
            key: column,
            header: column
          });
        }else if(typeof column === 'object' && column !== undefined && !Array.isArray(column)){
          if(!column.key){
            return [Error('Invalid column definition: property "key" is required')];
          }
          if(column.header === undefined){
            column.header = column.key;
          }
          newcolumns.push(column);
        }else {
          return [Error('Invalid column definition: expect a string or an object')];
        }
      }
      columns = newcolumns;
    }
    return [undefined, columns];
  }
}

const stringify = function(records, options={}){
  const data = [];
  const stringifier = new Stringifier(options);
  stringifier.push = function(record){
    if(record === null){
      return;
    }
    data.push(record.toString());
  };
  for(const record of records){
    const err = stringifier.__transform(record, null);
    if(err !== undefined) throw err;
  }
  return data.join('');
};

const Transformer = function(options = {}, handler){
  this.options = options;
  if(options.consume === undefined || options.consume === null){
    this.options.consume = false;
  }
  this.options.objectMode = true;
  if(options.parallel === undefined || options.parallel === null){
    this.options.parallel = 100;
  }
  if(options.params === undefined || options.params === null){
    options.params = null;
  }
  this.handler = handler;
  stream__default["default"].Transform.call(this, this.options);
  this.state = {
    running: 0,
    started: 0,
    finished: 0
  };
  return this;
};

util__default["default"].inherits(Transformer, stream__default["default"].Transform);

Transformer.prototype._transform = function(chunk, encoding, cb){
  this.state.started++;
  this.state.running++;
  if(this.state.running < this.options.parallel){
    cb();
    cb = null; // Cancel further callback execution
  }
  try {
    let l = this.handler.length;
    if(this.options.params !== null){  
      l--;
    }
    if(l === 1){ // sync
      this.__done(null, [this.handler.call(this, chunk, this.options.params)], cb);
    }else if(l === 2){ // async
      const callback = (err, ...chunks) =>
        this.__done(err, chunks, cb);
      this.handler.call(this, chunk, callback, this.options.params);
    }else {
      throw Error('Invalid handler arguments');
    }
    return false;
  }
  catch (err) {
    this.__done(err);
  }
};
Transformer.prototype._flush = function(cb){
  if(this.state.running === 0){
    cb();
  }else {
    this._ending = function(){
      cb();
    };
  }
};
Transformer.prototype.__done = function(err, chunks, cb){
  this.state.running--;
  if(err){
    return this.emit('error', err);
  }
  this.state.finished++;
  for(let chunk of chunks){
    if (typeof chunk === 'number'){
      chunk = `${chunk}`;
    }
    // We dont push empty string
    // See https://nodejs.org/api/stream.html#stream_readable_push
    if(chunk !== undefined && chunk !== null && chunk !== ''){
      this.push(chunk);
    }
  }
  if(cb){
    cb();
  }
  if(this._ending && this.state.running === 0){
    this._ending();
  }
};

const transform = function(){
  // Import arguments normalization
  let handler, records;
  let options = {};
  for(const i in arguments){
    const argument = arguments[i];
    let type = typeof argument;
    if(argument === null){
      type = 'null';
    }else if(type === 'object' && Array.isArray(argument)){
      type = 'array';
    }
    if(type === 'array'){
      records = argument;
    }else if(type === 'object'){
      options = {...argument};
    }else if(type === 'function'){
      handler = argument;
    }else if(type !== 'null'){
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`);
    }
  }
  // Validate arguments
  let expected_handler_length = 1;
  if(options.params){
    expected_handler_length++;
  }
  if(handler.length > expected_handler_length){
    throw Error('Invalid Handler: only synchonous handlers are supported');
  }
  // Start transformation
  const chunks = [];
  const transformer = new Transformer(options, handler);
  transformer.push = function(chunk){
    chunks.push(chunk);
  };
  for(const record of records){
    transformer._transform(record, null, function(){});
  }
  return chunks;  
};

exports.generate = generate;
exports.parse = parse;
exports.stringify = stringify;
exports.transform = transform;
