import "should";
import { stringify } from "../lib/index.js";

describe("Option `columns`", function () {
  describe("definition", function () {
    it("validates option types", function () {
      (() => {
        stringify([], { columns: true }, () => {});
      }).should.throw('Invalid option "columns": expect an array or an object');
      (() => {
        stringify([], { columns: false }, () => {});
      }).should.throw('Invalid option "columns": expect an array or an object');
      (() => {
        stringify([], { columns: "" }, () => {});
      }).should.throw('Invalid option "columns": expect an array or an object');
      (() => {
        stringify([], { columns: () => {} }, () => {});
      }).should.throw('Invalid option "columns": expect an array or an object');
    });

    it("validates column definition", function () {
      (() => {
        stringify(
          [],
          {
            columns: [
              {
                key_does_not_exists: "yes",
              },
            ],
          },
          () => {},
        );
      }).should.throw('Invalid column definition: property "key" is required');
      (() => {
        stringify(
          [],
          {
            columns: [true],
          },
          () => {},
        );
      }).should.throw(
        "Invalid column definition: expect a string or an object",
      );
    });
  });
});
