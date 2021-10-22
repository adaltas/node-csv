
import {parse} from 'csv-parse/sync';

const camelCaseColumns = (header) => {
  return header.map((label) => {
    return label.toUpperCase();
  });
};
console.log(
  parse('a,b,c\n1,2,3', { encoding: 'utf8',
    columns: camelCaseColumns,
    // cast: castToSchema(schema),
    trim: true,
  })
);
