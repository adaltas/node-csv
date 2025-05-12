import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `header`", function () {
  it('as "true" and without "column" option with objects', function (next) {
    stringify(
      [
        { field1: "val11", field2: "val12", field3: "val13" },
        { field1: "val21", field2: "val22", field3: "val23" },
      ],
      {
        header: true,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          dedent`
            field1,field2,field3
            val11,val12,val13
            val21,val22,val23
          ` + "\n",
        );
        next();
      },
    );
  });

  it("must get columns from somewhere", function (next) {
    stringify(
      [
        ["h1", "h2", "h3"],
        ["1", "2", "3"],
        ["4", "5", "6"],
      ],
      {
        header: true,
      },
      (err) => {
        err.message.should.eql(
          "Undiscoverable Columns: header option requires column option or object records",
        );
        next();
      },
    );
  });

  it("is immutable", function (next) {
    const options = { header: true, quotedEmpty: true, delimiter: "|" };
    const data1 = [
      { a: "1", b: "2", c: "3" },
      { a: "4", b: "5", c: "6" },
    ];
    const data2 = [
      { x: "1", y: "2", z: "3" },
      { x: "4", y: "5", z: "6" },
    ];
    stringify(data1, options, (err, result1) => {
      stringify(data2, options, (err, result2) => {
        if (!err) {
          result1.should.eql("a|b|c\n1|2|3\n4|5|6\n");
          result2.should.eql("x|y|z\n1|2|3\n4|5|6\n");
        }
        next(err);
      });
    });
  });

  describe("event", function () {
    it("emit header", function (next) {
      let count = 0;
      let data = "";
      const stringifier = stringify({
        columns: ["col1", "col2"],
        header: true,
      });
      stringifier.on("readable", () => {
        let d;
        while ((d = stringifier.read())) {
          data += d;
        }
      });
      stringifier.on("record", () => {
        count++;
      });
      stringifier.on("finish", () => {
        count.should.eql(2);
        data.should.eql("col1,col2\nfoo1,goo1\nfoo2,goo2\n");
        next();
      });
      stringifier.write({ col1: "foo1", col2: "goo1" });
      stringifier.write({ col1: "foo2", col2: "goo2" });
      stringifier.end();
    });

    it("emit header even without a source", function (next) {
      let data = "";
      const stringifier = stringify({
        columns: ["col1", "col2"],
        header: true,
      });
      stringifier.on("readable", () => {
        let d;
        while ((d = stringifier.read())) {
          data += d;
        }
      });
      stringifier.on("end", () => {
        data.should.eql("col1,col2\n");
        next();
      });
      stringifier.end();
    });
  });

  describe("without records", function () {
    it("print headers if no records to parse", function (next) {
      stringify(
        [],
        {
          header: true,
          columns: ["some", "headers"],
        },
        (err, data) => {
          data.should.eql("some,headers\n");
          next();
        },
      );
    });

    it("print headers if no records to parse in sync mode, fix #343", function () {
      const data = stringifySync([], {
        header: true,
        columns: ["some", "headers"],
      });
      data.should.eql("some,headers\n");
    });

    it("not print headers if no records to parse and no header option", function (next) {
      stringify(
        [],
        {
          header: false,
          columns: ["some", "headers"],
        },
        (err, data) => {
          data.should.eql("");
          next();
        },
      );
    });
  });

  describe("with column", function () {
    it("filter records array properties not listed as columns", function (next) {
      stringify(
        [
          [20322051544, 1979, "ABC", 45],
          [28392898392, 1974, "DEF", 23],
        ],
        {
          header: true,
          columns: ["a", "b"],
          eof: false,
        },
        (err, data) => {
          if (!err) {
            data.should.eql(
              dedent`
                a,b
                20322051544,1979
                28392898392,1974
              `,
            );
          }
          next(err);
        },
      );
    });

    it("filter records object properties not listed as columns", function (next) {
      stringify(
        [
          { a: 20322051544, b: "1979", c: "8.8017226E7" },
          { a: 28392898392, b: "1974", c: "8.8392926E7" },
        ],
        {
          header: true,
          columns: ["a", "c"],
          eof: false,
        },
        (err, data) => {
          data.should.eql(
            dedent`
              a,c
              20322051544,8.8017226E7
              28392898392,8.8392926E7
            `,
          );
          next();
        },
      );
    });

    it("map the column property name to display name", function (next) {
      stringify(
        [
          { field1: "val11", field2: "val12", field3: "val13" },
          { field1: "val21", field2: "val22", field3: "val23" },
        ],
        {
          header: true,
          columns: { field1: "column1", field3: "column3" },
        },
        (err, data) => {
          if (!err) {
            data.should.eql(
              dedent`
                column1,column3\nval11,val13\nval21,val23
              ` + "\n",
            );
          }
          next(err);
        },
      );
    });
  });

  describe("nested columns", function () {
    it("and nested properties", function (next) {
      stringify(
        [
          { field1: { nested: "val11" }, field2: "val12", field3: "val13" },
          { field1: {}, field2: "val22", field3: "val23" },
        ],
        {
          header: true,
          columns: { "field1.nested": "column1", field3: "column3" },
        },
        (err, data) => {
          if (!err) {
            data.should.eql("column1,column3\nval11,val13\n,val23\n");
          }
          next(err);
        },
      );
    });

    it("also work for nested properties", function (next) {
      stringify(
        [
          { field1: { nested: "val11" }, field2: "val12", field3: "val13" },
          { field1: {}, field2: "val22", field3: "val23" },
        ],
        {
          header: true,
          columns: { "field1.nested": "column1", field3: "column3" },
        },
        (err, data) => {
          if (!err) {
            data.should.eql("column1,column3\nval11,val13\n,val23\n");
          }
          next(err);
        },
      );
    });
  });
});
