import { stringify } from "../lib/index.js";

describe("types", function () {
  describe("defaults", function () {
    it("should map date to getTime", function (next) {
      const date = new Date();
      stringify([{ value: date }], (err, data) => {
        if (!err) data.should.eql(date.getTime() + "\n");
        next(err);
      });
    });

    it("should map true boolean value to 1", function (next) {
      stringify([{ value: true }], (err, data) => {
        if (!err) data.should.eql("1\n");
        next(err);
      });
    });

    it("should map object to its json representation", function (next) {
      stringify([{ value: { a: 1 } }], (err, data) => {
        if (!err) data.should.eql('"{""a"":1}"\n');
        next(err);
      });
    });
  });
});
