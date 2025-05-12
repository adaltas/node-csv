import "should";
import { generate } from "../lib/index.js";

describe("Option `sleep`", function () {
  it("as integer above 0", function (next) {
    this.timeout(10000);
    generate({ duration: 1000, sleep: 100, objectMode: true }, (err, data) => {
      if (!err) {
        data.length.should.be.within(8, 12);
      }
      next(err);
    });
  });

  it("sleep combined with length and objectMode false", function (next) {
    // Fix bug where chuncks where emited after end when sleep is activated
    this.timeout(10000);
    const records = [];
    generate({
      objectMode: false,
      length: 2,
      sleep: 10,
    })
      .on("readable", function () {
        let record;
        while ((record = this.read()) !== null) {
          records.push(record.toString());
        }
      })
      .on("error", next)
      .on("end", () => {
        records.join().split("\n").length.should.eql(2);
        next();
      });
  });
});
