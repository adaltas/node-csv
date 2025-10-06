import "should";
import { parse } from "../lib/index.js";

describe("API arguments", function () {
  describe("2 args", function () {
    it("data:undefined, options:object", function () {
      (() => {
        parse(undefined, {});
      }).should.throw({
        message: "Invalid argument: got undefined at index 0",
        code: "CSV_INVALID_ARGUMENT",
      });
    });

    it("data:undefined, callback:function", function () {
      (() => {
        parse(undefined, () => {});
      }).should.throw({
        message: "Invalid argument: got undefined at index 0",
        code: "CSV_INVALID_ARGUMENT",
      });
    });

    it("data:array, callback:function", function () {
      (() => {
        parse(["value a,value b", "value 1,value 2"], () => {});
      }).should.throw({
        message:
          'Invalid argument: got ["value a,value b","value 1,value 2"] at index 0',
        code: "CSV_INVALID_ARGUMENT",
      });
    });

    it("options:object, options:object", function () {
      (() => {
        parse({}, {});
      }).should.throw({
        message: "Invalid argument: got {} at index 1",
        code: "CSV_INVALID_ARGUMENT",
      });
    });
  });

  describe("3 args", function () {
    it("data:undefined, options:object, callback:function", function () {
      (() => {
        parse(undefined, { columns: true }, () => {});
      }).should.throw({
        message: "Invalid argument: got undefined at index 0",
        code: "CSV_INVALID_ARGUMENT",
      });
    });
  });
});
