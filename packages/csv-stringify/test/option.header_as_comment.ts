import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("Option `header_as_comment`", function () {
  it("require column detection", function (next) {
    stringify(
      [["abc"]],
      {
        header: true,
        header_as_comment: true,
      },
      (err) => {
        if (!err) return next(Error("Invalid assessment"));
        err.should.match({
          message:
            "Undiscoverable Columns: header option requires column option or object records",
        });
        next();
      },
    );
  });

  it("when true it default to hash sign", function (next) {
    stringify(
      [
        { field1: "val11", field2: "val12", field3: "val13" },
        { field1: "val21", field2: "val22", field3: "val23" },
      ],
      {
        header: true,
        header_as_comment: true,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          dedent`
            # field1,field2,field3
            val11,val12,val13
            val21,val22,val23
          ` + "\n",
        );
        next();
      },
    );
  });

  it("when string it use the value", function (next) {
    stringify(
      [
        { field1: "val11", field2: "val12", field3: "val13" },
        { field1: "val21", field2: "val22", field3: "val23" },
      ],
      {
        header: true,
        header_as_comment: "//",
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          dedent`
                // field1,field2,field3
                val11,val12,val13
                val21,val22,val23
              ` + "\n",
        );
        next();
      },
    );
  });

  it("when buffer it use the value", function (next) {
    stringify(
      [
        { field1: "val11", field2: "val12", field3: "val13" },
        { field1: "val21", field2: "val22", field3: "val23" },
      ],
      {
        header: true,
        header_as_comment: Buffer.from("//"),
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          dedent`
              // field1,field2,field3
              val11,val12,val13
              val21,val22,val23
            ` + "\n",
        );
        next();
      },
    );
  });
});
