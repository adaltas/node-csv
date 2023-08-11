const { parse } = require("csv/sync");

const input = `
Date, Type, Description, Value, Balance, Account Name, Account Number

11/02/2022,BAC,"'FOO",10.00,33432.80,"'REF","'123123-12312312",
`;

const output = parse(input, {
  skip_empty_lines: true,
  relax_column_count: true,
});
console.log(output);
