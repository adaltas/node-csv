import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `columns`", function () {
  describe("definition", function () {
    it("accepts an empty record key with an explicit header", function () {
      stringifySync([{ "": "value" }], {
        columns: [{ key: "", header: "blank" }],
        header: true,
      }).should.eql("blank\nvalue\n");
    });

    it("accepts an empty record key with the default header", function () {
      stringifySync([{ "": "value" }], {
        columns: [{ key: "" }],
        header: true,
      }).should.eql("\nvalue\n");
    });

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
