
import { get } from '../utils/get.js';
import { is_object } from '../utils/is_object.js';
import { normalize_columns } from './normalize_columns.js';
import { normalize_options } from './normalize_options.js';
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
        }else{
          chunk_string = chunk_string + this.options.record_delimiter;
        }
      }else{
        [err, chunk_string] = this.stringify(chunk);
        if(err) return err;
        if(chunk_string === undefined){
          return;
        }else{
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
      }else{
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
        }else{
          return [Error(`Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`)];
        }
        const {delimiter, escape, quote, quoted, quoted_empty, quoted_string, quoted_match, record_delimiter} = options;
        if('' === value && '' === field){
          let quotedMatch = quoted_match && quoted_match.filter(quoted_match => {
            if(typeof quoted_match === 'string'){
              return value.indexOf(quoted_match) !== -1;
            }else{
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
            }else{
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
      }else{
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
        }else{
          return [undefined, value, value];
        }
      }catch(err){
        return [err];
      }
    }
  };
};

export {stringifier};
