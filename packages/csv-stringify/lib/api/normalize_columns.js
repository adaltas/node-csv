
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
  }else{
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
      }else{
        return [Error('Invalid column definition: expect a string or an object')];
      }
    }
    columns = newcolumns;
  }
  return [undefined, columns];
};

export {normalize_columns};
