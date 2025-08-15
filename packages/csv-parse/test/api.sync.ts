import "should";
import dedent from "dedent";
import { parse } from "../lib/sync.js";

describe("API sync", function () {
  describe("content", function () {
    it("take a string and return records", function () {
      const records = parse("field_1,field_2\nvalue 1,value 2");
      records.should.eql([
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ]);
    });

    it("take a buffer and return records", function () {
      const records = parse(Buffer.from("field_1,field_2\nvalue 1,value 2"));
      records.should.eql([
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ]);
    });

    it("take a Uint8Array and return records", function () {
      const records = parse(
        new TextEncoder().encode("field_1,field_2\nvalue 1,value 2"),
      );
      records.should.eql([
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ]);
    });
  });

  describe("options", function () {
    it("`columns` option without generic", function () {
      // Parse returns unknown[]
      const records = parse("field_1,field_2\nvalue 1,value 2", {
        columns: true,
      });
      records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
    });

    it("`columns` option with generic", function () {
      // Parse returns Record[]
      interface Record {
        field_1: string;
        field_2: string;
      }
      const records: Record[] = parse<Record>(
        "field_1,field_2\nvalue 1,value 2",
        {
          columns: true,
        },
      );
      records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
    });

    it("`columns` and `on_record` options with generic", function () {
      // Parse returns Record[]
      interface RecordOriginal {
        field_a: string;
        field_b: string;
      }
      interface Record {
        field_1: string;
        field_2: string;
      }
      const records: Record[] = parse<Record, RecordOriginal>(
        "field_a,field_b\nvalue 1,value 2",
        {
          columns: true,
          on_record: (record: RecordOriginal) => ({
            field_1: record.field_a,
            field_2: record.field_b,
          }),
        },
      );
      records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
    });

    it("`objname` option", function () {
      // Not good, parse returns unknown[]
      const records = parse("field_1,field_2\nname 1,value 1\nname 2,value 2", {
        objname: "field_1",
        columns: true,
      });
      records.should.eql({
        "name 1": { field_1: "name 1", field_2: "value 1" },
        "name 2": { field_1: "name 2", field_2: "value 2" },
      });
    });

    it("`to_line` option", function () {
      const records = parse("1\n2\n3\n4", { to_line: 2 });
      records.should.eql([["1"], ["2"]]);
    });
  });

  describe("errors", function () {
    it("catch errors", function () {
      try {
        parse("A,B\nB\nC,K", { trim: true });
        throw Error("Error not catched");
      } catch (err) {
        if (!err) throw Error("Invalid assessment");
        (err as Error).message.should.eql(
          "Invalid Record Length: expect 2, got 1 on line 2",
        );
      }
    });

    it("catch err in last line while flushing", function () {
      (() => {
        parse(dedent`
          headerA, headerB
          A2, B2
          A1, B1, C2, D2
        `);
      }).should.throw("Invalid Record Length: expect 2, got 4 on line 3");
    });
  });
});
