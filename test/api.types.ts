import * as parse from '../lib/index';
import {Options} from '../lib/index';
// import {} from 'should';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('API Types', () => {
  
  describe('options', () => {
    
    it('cast', () => {
      const options: Options = {};
      options.cast = true;
      options.cast = () => {};
    });
      
    it('cast_date', () => {
      const options: Options = {};
      options.cast_date = true;
    });
      
    it('columns', () => {
      const options: Options = {};
      options.columns = true;
      options.columns = [];
      options.columns = (record: string[]) => {
        const val: boolean = record.length > 1
        return val
      };
      options.columns = (record: string[]) => {
        const fields: string[] = record.map( (field: string) => {
          return field.toUpperCase()
        })
        return fields
      };
    });
    
    it('delimiter', () => {
      const options: Options = {};
      options.delimiter = ':';
      options.delimiter = Buffer.from(':');
    });
    
    it('escape', () => {
      const options: Options = {};
      options.escape = ':';
      options.escape = Buffer.from('"');
    });
    
    it('from', () => {
      const options: Options = {};
      options.from = 10;
    });
    
    it('from_line', () => {
      const options: Options = {};
      options.from_line = 10;
    });
    
    it('ltrim', () => {
      const options: Options = {};
      options.ltrim = true;
    });
    
    it('max_record_size', () => {
      const options: Options = {};
      options.max_record_size = 100;
    });
    
    it('objname', () => {
      const options: Options = {};
      options.objname = 'name';
    });
    
    it('quote', () => {
      const options: Options = {};
      options.quote = '"';
      options.quote = true;
      options.quote = Buffer.from('"');
    });
    
    it('relax', () => {
      const options: Options = {};
      options.relax = true;
    });
    
    it('relax_column_count', () => {
      const options: Options = {};
      options.relax_column_count = true;
    });
    
    it('raw', () => {
      const options: Options = {};
      options.raw = true;
    });
    
    it('record_delimiter', () => {
      const options: Options = {};
      options.record_delimiter = '\n';
      options.record_delimiter = ['\n'];
      options.record_delimiter = Buffer.from('\n');
      options.record_delimiter = [Buffer.from('\n')];
    });
    
    it('rtrim', () => {
      const options: Options = {};
      options.rtrim = true;
    });
    
    it('skip_empty_lines', () => {
      const options: Options = {};
      options.skip_empty_lines = true;
    });
    
    it('skip_empty_lines', () => {
      const options: Options = {};
      options.skip_empty_lines = true;
    });
    
    it('skip_lines_with_error', () => {
      const options: Options = {};
      options.skip_empty_lines = true;
    });
    
    it('to', () => {
      const options: Options = {};
      options.to = 10;
    });
    
    // it('to_line', () => {
    //   const options: Options = {};
    //   options.to_line = 10;
    // });
    
    it('trim', () => {
      const options: Options = {};
      options.trim = true;
    });
    
  });
  
});
