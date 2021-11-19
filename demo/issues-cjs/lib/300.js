const {stringify} = require('csv-stringify')

/**
 * Testing CSV bug. When length of csv data exceeds 16500, stringifier
 * fails. This version fails. Shorten the string on line 22 by one
 * character and the generation succeeds.
 */

async function main() {
  const numberOfRows = 140;

  // Generate test data
  let generatedRows = [];
  for (let i = 0; i < numberOfRows; i++) {
    let row = ['row ' + i];
    for (let field = 0; field < 24; field++) {
      row.push(`f ${field}`);
    }

    // fine-tune data length
    if (i == 0) {
      row[0] = 'customlengthfield customlengthfield customlengthfield customlengthfield customlengthfield custom.';
    }

    let rowString = row.join('\t');
    generatedRows.push(rowString);
  }
  const csvData = generatedRows.join('\n');
  
  // At this point we have a simple CSV string, delimited by tabs and newlines.

  // Split data so we can feed it to the stringifier
  const rows = csvData.split('\n');

  // Generate CSV
  const data = [];
  const stringifier = stringify({
    delimiter: '\t',
  });

  stringifier.on('readable', function(){
    let row;
    while(row = stringifier.read()){
      data.push(row);
    }
  })

  rows.forEach((row) => {
    const fields = row.split('\t');
    console.log('>', stringifier.write(fields));
  });

  stringifier.end();
  
  stringifier.on('finish', function(){
    console.log('Generated contents of the CSV file should be shown between this line and "^data".');

    console.log(data.toString('utf8'));
    console.log('^data');

    console.log(csvData.length);
    console.log('^data length');

    process.exit();
  });
}

main();
