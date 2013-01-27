//
// This sample shows how the write function can be used
// to write a new record into the output stream.
//
// In this rather contrived example, the first line read
// is interpreted as a header and is inserted before
// every other data line in the file.
//

var csv = require('..');
var header;

process.stdin.resume();

parser = csv()
.from.stream(process.stdin)
.to.stream(process.stdout, {end: false})
.transform(function(data){
  if (header) {
    parser.write(header);
  } else {
    header=data;
    return null;
  }
  return data;
})
.on('end',function(error){
  process.stdout.write("\n");
})
.on('error',function(error){
  console.log(error.message);
});

/*

`node samples/duplicate-headers.js < samples/duplicate-headers.in`

ts,year,ms,chars,age,date
20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
ts,year,ms,chars,age,date
28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27

*/
