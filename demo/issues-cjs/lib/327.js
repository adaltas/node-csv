const { stringify } = require("csv-stringify");
const fs = require("fs");

(() => {
  const stringifier = stringify({
    defaultEncoding: "latin1",
  });
  stringifier.pipe(fs.createWriteStream(__dirname + "/327.stringifier.csv"));
  stringifier.write(["field1", "field2"]);
  stringifier.write(["Acentuação1", "acentuação2"]);
  stringifier.end();
})();

(() => {
  const out = fs.createWriteStream(__dirname + "/327.cws.csv", {
    encoding: "latin1", // <== Here the encoding works
  });
  out.write("field1,field2\n");
  out.write("Acentuação1,acentuação2\n");
  out.end();
})();

(() => {
  const out = fs.createWriteStream(__dirname + "/327.cws.buf.csv", {
    encoding: "latin1", // <== Here the encoding works
  });
  out.write(Buffer.from("field1,field2\n", "utf8"));
  out.write(Buffer.from("Acentuação1,acentuação2\n", "utf8"));
  out.end();
})();
