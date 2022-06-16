'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stream = require('stream');

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

const is_object = function(obj){
  return typeof obj === 'object' && obj !== null && ! Array.isArray(obj);
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

const normalize_columns = function(columns){
  if(columns === undefined || columns === null){
    return [undefined, undefined];
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
      }else if(typeof column === 'object' && column !== null && !Array.isArray(column)){
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
};

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase();
  });
};

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
        return [Error(`Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`)];
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
    return [Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`)];
  }
  if (options.escape.length > 1){
    return [Error(`Invalid Option: escape must be one character, got ${options.escape.length} characters`)];
  }
  // Normalize option `header`
  if(options.header === undefined || options.header === null){
    options.header = false;
  }
  // Normalize option `columns`
  const [errColumns, columns] = normalize_columns(options.columns);
  if(errColumns !== undefined) return [errColumns];
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
  return [undefined, options];
};

const bom_utf8 = Buffer.from([239, 187, 191]);

const stringifier = function(options, state, info){
  return {
    options: options,
    state: state,
    info: info,
    __transform: function(chunk, push){
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
          const [err, columns] = normalize_columns(Object.keys(chunk));
          if(err) return;
          this.options.columns = columns;
        }
      }
      // Emit the header
      if(this.info.records === 0){
        this.bom(push);
        const err = this.headers(push);
        if(err) return err;
      }
      // Emit and stringify the record if an object or an array
      try{
        // this.emit('record', chunk, this.info.records);
        if(this.options.on_record){
          this.options.on_record(chunk, this.info.records);
        }
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
      push(chunk_string);
    },
    stringify: function(chunk, chunkIsHeader=false){
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
        }else if(is_object(value)){
          options = value;
          value = options.value;
          delete options.value;
          if(typeof value !== "string" && value !== undefined && value !== null){
            if(err) return [Error(`Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`)];
          }
          options = {...this.options, ...options};
          [err, options] = normalize_options(options);
          if(err !== undefined){
            return [err];
          }
        }else if(value === undefined || value === null){
          options = this.options;
        }else {
          return [Error(`Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`)];
        }
        const {delimiter, escape, quote, quoted, quoted_empty, quoted_string, quoted_match, record_delimiter} = options;
        if('' === value && '' === field){
          let quotedMatch = quoted_match && quoted_match.filter(quoted_match => {
            if(typeof quoted_match === 'string'){
              return value.indexOf(quoted_match) !== -1;
            }else {
              return quoted_match.test(value);
            }
          });
          quotedMatch = quotedMatch && quotedMatch.length > 0;
          const shouldQuote = quotedMatch || true === quoted_empty ||
            (true === quoted_string && false !== quoted_empty);
          if(shouldQuote === true){
            value = quote + value + quote;
          }
          csvrecord += value;
        }else if(value){
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
    },
    bom: function(push){
      if(this.options.bom !== true){
        return;
      }
      push(bom_utf8);
    },
    headers: function(push){
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
      push(headers);
    },
    __cast: function(value, context){
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
  };
};

class Stringifier extends stream.Transform {
  constructor(opts = {}){
    super({...{writableObjectMode: true}, ...opts});
    const [err, options] = normalize_options(opts);
    if(err !== undefined) throw err;
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
    this.api = stringifier(this.options, this.state, this.info);
    this.api.options.on_record = (...args) => {
      this.emit('record', ...args);
    };
  }
  _transform(chunk, encoding, callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.api.__transform(chunk, this.push.bind(this));
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
      this.api.bom(this.push.bind(this));
      const err = this.api.headers(this.push.bind(this));
      if(err) callback(err);
    }
    callback();
  }
}

const stringify = function(){
  let data, options, callback;
  for(const i in arguments){
    const argument = arguments[i];
    const type = typeof argument;
    if(data === undefined && (Array.isArray(argument))){
      data = argument;
    }else if(options === undefined && is_object(argument)){
      options = argument;
    }else if(callback === undefined && type === 'function'){
      callback = argument;
    }else {
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ]);
    }
  }
  const stringifier = new Stringifier(options);
  if(callback){
    const chunks = [];
    stringifier.on('readable', function(){
      let chunk;
      while((chunk = this.read()) !== null){
        chunks.push(chunk);
      }
    });
    stringifier.on('error', function(err){
      callback(err);
    });
    stringifier.on('end', function(){
      callback(undefined, chunks.join(''));
    });
  }
  if(data !== undefined){
    const writer = function(){
      for(const record of data){
        stringifier.write(record);
      }
      stringifier.end();
    };
    // Support Deno, Rollup doesnt provide a shim for setImmediate
    if(typeof setImmediate === 'function'){
      setImmediate(writer);
    }else {
      setTimeout(writer, 0);
    }
  }
  return stringifier;
};

exports.CsvError = CsvError;
exports.Stringifier = Stringifier;
exports.stringify = stringify;
