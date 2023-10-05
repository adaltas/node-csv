
import { CsvError } from './CsvError.js';
import { normalize_columns } from './normalize_columns.js';
import { underscore } from '../utils/underscore.js';

const normalize_options = function(opts) {
  const options = {};
  // Merge with user options
  for(const opt in opts){
    options[underscore(opt)] = opts[opt];
  }
  // Normalize option `bom`
  if(options.bom === undefined || options.bom === null || options.bom === false){
    options.bom = false;
  }else if(options.bom !== true){
    return [new CsvError('CSV_OPTION_BOOLEAN_INVALID_TYPE', [
      'option `bom` is optional and must be a boolean value,',
      `got ${JSON.stringify(options.bom)}`
    ])];
  }
  // Normalize option `delimiter`
  if(options.delimiter === undefined || options.delimiter === null){
    options.delimiter = ',';
  }else if(Buffer.isBuffer(options.delimiter)){
    options.delimiter = options.delimiter.toString();
  }else if(typeof options.delimiter !== 'string'){
    return [new CsvError('CSV_OPTION_DELIMITER_INVALID_TYPE', [
      'option `delimiter` must be a buffer or a string,',
      `got ${JSON.stringify(options.delimiter)}`
    ])];
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
    return [new CsvError('CSV_OPTION_QUOTE_INVALID_TYPE', [
      'option `quote` must be a boolean, a buffer or a string,',
      `got ${JSON.stringify(options.quote)}`
    ])];
  }
  // Normalize option `quoted`
  if(options.quoted === undefined || options.quoted === null){
    options.quoted = false;
  }else{
    // todo
  }
  // Normalize option `escape_formulas`
  if(options.escape_formulas === undefined || options.escape_formulas === null){
    options.escape_formulas = false;
  }else if(typeof options.escape_formulas !== 'boolean'){
    return [new CsvError('CSV_OPTION_ESCAPE_FORMULAS_INVALID_TYPE', [
      'option `escape_formulas` must be a boolean,',
      `got ${JSON.stringify(options.escape_formulas)}`
    ])];
  }
  // Normalize option `quoted_empty`
  if(options.quoted_empty === undefined || options.quoted_empty === null){
    options.quoted_empty = undefined;
  }else{
    // todo
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
        return [Error(`Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`)];
      }
    }
  }
  // Normalize option `quoted_string`
  if(options.quoted_string === undefined || options.quoted_string === null){
    options.quoted_string = false;
  }else{
    // todo
  }
  // Normalize option `eof`
  if(options.eof === undefined || options.eof === null){
    options.eof = true;
  }else{
    // todo
  }
  // Normalize option `escape`
  if(options.escape === undefined || options.escape === null){
    options.escape = '"';
  }else if(Buffer.isBuffer(options.escape)){
    options.escape = options.escape.toString();
  }else if(typeof options.escape !== 'string'){
    return [Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`)];
  }
  if (options.escape.length > 1){
    return [Error(`Invalid Option: escape must be one character, got ${options.escape.length} characters`)];
  }
  // Normalize option `header`
  if(options.header === undefined || options.header === null){
    options.header = false;
  }else{
    // todo
  }
  // Normalize option `columns`
  const [errColumns, columns] = normalize_columns(options.columns);
  if(errColumns !== undefined) return [errColumns];
  options.columns = columns;
  // Normalize option `quoted`
  if(options.quoted === undefined || options.quoted === null){
    options.quoted = false;
  }else{
    // todo
  }
  // Normalize option `cast`
  if(options.cast === undefined || options.cast === null){
    options.cast = {};
  }else{
    // todo
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
  // Normalize option `on_record`
  if(options.on_record !== undefined && typeof options.on_record !== 'function'){
    return [Error(`Invalid Option: "on_record" must be a function.`)];
  }
  // Normalize option `record_delimiter`
  if(options.record_delimiter === undefined || options.record_delimiter === null){
    options.record_delimiter = '\n';
  }else if(Buffer.isBuffer(options.record_delimiter)){
    options.record_delimiter = options.record_delimiter.toString();
  }else if(typeof options.record_delimiter !== 'string'){
    return [Error(`Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(options.record_delimiter)}`)];
  }
  switch(options.record_delimiter){
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
  return [undefined, options];
};

export {normalize_options};
