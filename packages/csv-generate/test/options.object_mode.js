import "should";
import { generate } from "../lib/index.js";

describe("Option `objectMode`", function () {
  for (const value of [42, "", "value"]) {
    it(`streams ${JSON.stringify(value)} without generating all records first`, function (next) {
      let generated = 0;
      let generatedAtFirstRecord;
      const records = [];
      const generator = generate({
        objectMode: true,
        highWaterMark: 1,
        length: 100,
        columns: [
          () => {
            generated++;
            return value;
          },
        ],
      });
      generator.on("data", (record) => {
        generatedAtFirstRecord ??= generated;
        records.push(record);
      });
      generator.on("error", next);
      generator.on("end", () => {
        generatedAtFirstRecord.should.be.within(1, 2);
        records.should.eql(Array.from({ length: 100 }, () => [value]));
        next();
      });
    });
  }

  it("return an array of array", function (next) {
    this.timeout(1000000);
    generate({ seed: 1, objectMode: true, length: 4 }, (err, data) => {
      if (err) return next(err);
      data.should.eql([
        [
          "OMH",
          "ONKCHhJmjadoA",
          "D",
          "GeACHiN",
          "nnmiN",
          "CGfDKB",
          "NIl",
          "JnnmjadnmiNL",
        ],
        [
          "KB",
          "dmiM",
          "fENL",
          "Jn",
          "opEMIkdmiOMFckep",
          "MIj",
          "bgIjadnn",
          "fENLEOMIkbhLDK",
        ],
        [
          "B",
          "LF",
          "gGeBFaeAC",
          "iLEO",
          "IkdoAAC",
          "hKpD",
          "opENJ",
          "opDLENLDJoAAABFP",
        ],
        [
          "iNJnmjPbhL",
          "Ik",
          "jPbhKCHhJn",
          "fDKCHhIkeAABEM",
          "kdnlh",
          "DKACIl",
          "HgGdoABEMIjP",
          "adlhKCGf",
        ],
      ]);
      next();
    });
  });
});
