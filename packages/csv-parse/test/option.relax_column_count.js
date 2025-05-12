import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `relax_column_count`", function () {
  it("validation", function () {
    parse("", { relax_column_count: true }, () => {});
    parse("", { relax_column_count: false }, () => {});
    parse("", { relax_column_count: null }, () => {});
    parse("", { relax_column_count: undefined }, () => {});
    (() => {
      parse("", { relax_column_count: 1 }, () => {});
    }).should.throw(
      "Invalid Option: relax_column_count must be a boolean, got 1",
    );
    (() => {
      parse("", { relax_column_count: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: relax_column_count must be a boolean, got "oh no"',
    );
  });

  it("throw error by default", function (next) {
    parse(
      dedent`
        1,2,3
        4,5
      `,
      (err) => {
        assert_error(err, {
          code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
          message: "Invalid Record Length: expect 3, got 2 on line 2",
          record: ["4", "5"],
        });
        next();
      },
    );
  });

  it("emit single error when column count is invalid on multiple lines", function (next) {
    parse(
      dedent`
        1,2
        1
        3,4
        5,6,7
      `,
      (err) => {
        assert_error(err, {
          code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
          message: "Invalid Record Length: expect 2, got 1 on line 2",
          record: ["1"],
        });
        next();
      },
    );
  });

  it("dont throw error if true", function (next) {
    parse(
      dedent`
        1,2,3
        4,5
      `,
      { relax_column_count: true },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["1", "2", "3"],
            ["4", "5"],
          ]);
        }
        next(err);
      },
    );
  });

  it("with columns bigger than records", function (next) {
    parse(
      dedent`
        1,2,3
        4,5
      `,
      { columns: ["a", "b", "c", "d"], relax_column_count: true },
      (err, records) => {
        if (!err) {
          records.should.eql([
            { a: "1", b: "2", c: "3" },
            { a: "4", b: "5" },
          ]);
        }
        next(err);
      },
    );
  });

  it("with columns smaller than records", function (next) {
    parse(
      dedent`
        1,2,3,4
        5,6,7
      `,
      { columns: ["a", "b", "c"], relax_column_count: true },
      (err, records) => {
        if (!err) {
          records.should.eql([
            { a: "1", b: "2", c: "3" },
            { a: "5", b: "6", c: "7" },
          ]);
        }
        next(err);
      },
    );
  });

  it("with columns and from, doesnt break count and relying options like from", function (next) {
    parse(
      dedent`
        1,2,3
        4,5
        6,7,8
        9,10
      `,
      { relax_column_count: true, columns: ["a", "b", "c", "d"], from: 3 },
      (err, records) => {
        if (!err) {
          records.should.eql([
            { a: "6", b: "7", c: "8" },
            { a: "9", b: "10" },
          ]);
        }
        next(err);
      },
    );
  });

  describe("relax_column_count_more", function () {
    it("when more", function (next) {
      parse(
        dedent`
          1,2,3
          a,b,c,d
        `,
        { relax_column_count_more: true },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["1", "2", "3"],
              ["a", "b", "c", "d"],
            ]);
          }
          next(err);
        },
      );
    });

    it("when less", function (next) {
      parse(
        dedent`
          1,2,3
          a,b
        `,
        { relax_column_count_more: true },
        (err) => {
          assert_error(err, {
            code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
            message: "Invalid Record Length: expect 3, got 2 on line 2",
            record: ["a", "b"],
          });
          next();
        },
      );
    });
  });

  describe("relax_column_count_less", function () {
    it("when less", function (next) {
      parse(
        dedent`
          1,2,3
          a,b
        `,
        { relax_column_count_less: true },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["1", "2", "3"],
              ["a", "b"],
            ]);
          }
          next(err);
        },
      );
    });

    it("when more", function (next) {
      parse(
        dedent`
          1,2,3
          a,b,c,d
        `,
        { relax_column_count_less: true },
        (err) => {
          assert_error(err, {
            code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
            message: "Invalid Record Length: expect 3, got 4 on line 2",
            record: ["a", "b", "c", "d"],
          });
          next();
        },
      );
    });
  });

  describe("with on_record", function () {
    it("and without columns", function (next) {
      parse(
        dedent`
          1,2
          in:va:lid
          3,4
        `,
        {
          relax_column_count: true,
          raw: true,
          on_record: ({ raw, record }, { error }) => {
            if (error?.code === "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH") {
              return raw.trim().split(":");
            } else {
              return record;
            }
          },
        },
        (err, records) => {
          records.should.eql([
            ["1", "2"],
            ["in", "va", "lid"],
            ["3", "4"],
          ]);
          next();
        },
      );
    });

    it("and with columns", function (next) {
      parse(
        dedent`
          1,2
          in:va:lid
          3,4
        `,
        {
          columns: ["a", "b"],
          relax_column_count: true,
          raw: true,
          on_record: ({ raw, record }, { error }) => {
            if (error?.code === "CSV_RECORD_INCONSISTENT_COLUMNS") {
              return raw.trim().split(":");
            } else {
              return record;
            }
          },
        },
        (err, records) => {
          records.should.eql([
            { a: "1", b: "2" },
            ["in", "va", "lid"],
            { a: "3", b: "4" },
          ]);
          next();
        },
      );
    });
  });

  describe("with skip_records_with_error", function () {
    it("dont skip records", function () {
      parse(
        dedent`
          column_a
          a,b
        `,
        {
          skip_records_with_error: true,
          relax_column_count: true,
        },
        (err, records) => {
          records.should.eql([["column_a"], ["a", "b"]]);
        },
      );
    });
  });
});
