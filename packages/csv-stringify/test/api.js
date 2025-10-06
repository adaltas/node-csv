import "should";
import { generate } from "csv-generate";
import { stringify } from "../lib/index.js";

describe("API", function () {
  it("0 arg: write input and stream output", function (next) {
    let data = "";
    const stringifier = stringify();
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("err", (err) => {
      next(err);
    });
    stringifier.on("finish", () => {
      data.should.eql("field_1,field_2\nvalue 1,value 2\n");
      next();
    });
    stringifier.write(["field_1", "field_2"]);
    stringifier.write(["value 1", "value 2"]);
    stringifier.end();
  });

  it("1 arg: option; write input and stream output", function (next) {
    let data = "";
    const generator = generate({
      length: 2,
      objectMode: true,
      seed: 1,
      columns: 2,
    });
    const stringifier = stringify({ eof: false });
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    generator.on("error", next);
    generator.on("end", () => {
      stringifier.end();
    });
    generator.on("readable", () => {
      let row;
      while ((row = generator.read())) {
        stringifier.write(row);
      }
    });
    stringifier.on("finish", () => {
      data.should.eql("OMH,ONKCHhJmjadoA\nD,GeACHiN");
      next();
    });
  });

  it("1 arg: data and stream output", function (next) {
    let data = "";
    const stringifier = stringify([
      ["field_1", "field_2"],
      ["value 1", "value 2"],
    ]);
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("finish", () => {
      data.should.eql("field_1,field_2\nvalue 1,value 2\n");
      next();
    });
  });

  it("2 args: data, option and stream output", function (next) {
    let data = "";
    const stringifier = stringify(
      [
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ],
      { eof: false },
    );
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("finish", () => {
      data.should.eql("field_1,field_2\nvalue 1,value 2");
      next();
    });
  });
});
