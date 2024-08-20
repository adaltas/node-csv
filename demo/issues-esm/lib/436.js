import dedent from "dedent";
import { parse } from "csv-parse/sync";

const [headers, ...records] = parse(
  dedent`
  name;description;price
  Image 1;First image;100
  Image 2;Second image;200
  Image 3;Third image;50
  `,
  { delimiter: ";" }
);
console.info("headers", headers);
console.info("records", records);

// Output:
// headers [ 'name', 'description', 'price' ]
// records [
//   [ 'Image 1', 'First image', '100' ],
//   [ 'Image 2', 'Second image', '200' ],
//   [ 'Image 3', 'Third image', '50' ]
// ]
