
const parseSync = require('csv-parse/sync');

const input = 'Ref,Sample No,Analysis Date,Legionella pneumophila (total),L. pneumophila - Serogroup 1,L. pneumophila - Serogroup 2-14,Legionella L (total),Legionella species,Detection limit,Unit,COA\nKQL-25551,6248776,06/20/2022,<5000,<5000,<5000,<5000,<5000,<5000,CFU/L,3303861'

const records = parseSync.parse(input, {
  columns: true, to_line: 2, skip_lines_with_error: true, delimiter:",",
  skip_empty_lines: true
});

console.log(records)
