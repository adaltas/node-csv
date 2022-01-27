

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
  if(!value)
    value === undefined ? '[object Undefined]' : '[object Null]';
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

export {get};
