
import {random} from './random.js';

const types = {
  // Generate an ASCII value.
  ascii: function({options}){
    const column = [];
    const nb_chars = Math.ceil(random(options) * options.maxWordLength);
    for(let i=0; i<nb_chars; i++){
      const char = Math.floor(random(options) * 32);
      column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
    }
    return column.join('');
  },
  // Generate an integer value.
  int: function({options}){
    return Math.floor(random(options) * Math.pow(2, 52));
  },
  // Generate an boolean value.
  bool: function({options}){
    return Math.floor(random(options) * 2);
  }
};

export {types};
