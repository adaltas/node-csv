import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `columns`", function () {
  describe("definition", function () {
    it("accepts frozen column definitions without adding a header", function () {
      const column = Object.freeze({ key: "a" });
      const columns = Object.freeze([column]);
      stringifySync([{ a: "value" }], { columns, header: true }).should.eql(
        "a\nvalue\n",
      );
      Object.keys(column).should.eql(["key"]);
    });

    const structuralColumns = [
      ["inherited", Object.create({ key: "a" })],
      ["non-enumerable", Object.defineProperty({}, "key", { value: "a" })],
      [
        "getter",
        Object.create({
          get key() {
            return "a";
          },
        }),
      ],
    ];
    for (const [name, column] of structuralColumns) {
      it(`preserves a ${name} column key`, function () {
        stringifySync([{ a: "value" }], {
          columns: [column],
          header: true,
        }).should.eql("a\nvalue\n");
        Object.keys(column).should.eql([]);
      });
    }

    it("does not mutate reusable column definitions", function () {
      const column = { key: "a" };
      stringifySync([{ a: "first" }], { columns: [column], header: true });
      column.key = "b";
      stringifySync([{ b: "second" }], {
        columns: [column],
        header: true,
      }).should.eql("b\nsecond\n");
      Object.keys(column).should.eql(["key"]);
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
