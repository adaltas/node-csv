import assert from "node:assert";
import { stringify } from "csv-stringify";

// Create the parser
const stringifier = stringify(
  {
    delimiter: ":",
  },
  function (err, data) {
    assert.deepStrictEqual(
      data,
      "root:x:0:0:root:/root:/bin/bash\n" +
        "someone:x:1022:1022::/home/someone:/bin/bash\n",
    );
  },
);
// Write records to the stream
stringifier.write(["root", "x", "0", "0", "root", "/root", "/bin/bash"]);
stringifier.write([
  "someone",
  "x",
  "1022",
  "1022",
  "",
  "/home/someone",
  "/bin/bash",
]);
// Close the writable stream
stringifier.end();
