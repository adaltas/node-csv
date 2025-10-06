import "should";
import { generate } from "../lib/index.js";

describe("Option `max_word_length", function () {
  it("default to 16", function (next) {
    this.timeout(1000000);
    generate({ seed: 1, objectMode: true, length: 10 }, (err, records) => {
      if (err) return next(err);
      for (const record of records) {
        for (const field of record) {
          field.length.should.be.below(17);
        }
      }
      next();
    });
  });

  it("is set to 4", function (next) {
    this.timeout(1000000);
    generate(
      { max_word_length: 4, seed: 1, objectMode: true, length: 10 },
      (err, records) => {
        if (err) return next(err);
        for (const record of records) {
          for (const field of record) {
            field.length.should.be.below(5);
          }
        }
        next();
      },
    );
  });
});
