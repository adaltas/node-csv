import { stringify } from "../lib/index.js";

describe("Option `record_delimiter`", function () {
  it("validation", function () {
    stringify([], { record_delimiter: "" });
    stringify([], { record_delimiter: "," });
    stringify([], { record_delimiter: ",," });
    stringify([], { record_delimiter: Buffer.from(",") });
  });

  it("Test line breaks custom string", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: "::" },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544,8.8017226E7,ABC::28392898392,8.8392926E7,DEF::",
        );
        next();
      },
    );
  });

  it("Test line breaks custom buffer", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: Buffer.from("::") },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544,8.8017226E7,ABC::28392898392,8.8392926E7,DEF::",
        );
        next();
      },
    );
  });

  it("Test line breaks unix", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: "unix" },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544,8.8017226E7,ABC\n28392898392,8.8392926E7,DEF\n",
        );
        next();
      },
    );
  });

  it("Test line breaks unicode", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: "unicode" },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544,8.8017226E7,ABC\u202828392898392,8.8392926E7,DEF\u2028",
        );
        next();
      },
    );
  });

  it("Test line breaks mac", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: "mac" },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544,8.8017226E7,ABC\r28392898392,8.8392926E7,DEF\r",
        );
        next();
      },
    );
  });

  it("Test line breaks windows", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: "windows" },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544,8.8017226E7,ABC\r\n28392898392,8.8392926E7,DEF\r\n",
        );
        next();
      },
    );
  });

  it("Test line breaks ascii", function (next) {
    stringify(
      [
        ["20322051544", "8.8017226E7", "ABC"],
        ["28392898392", "8.8392926E7", "DEF"],
      ],
      { record_delimiter: "ascii", delimiter: "\u001f" },
      (err, result) => {
        if (err) return next(err);
        result.should.eql(
          "20322051544\u001f8.8017226E7\u001fABC\u001e28392898392\u001f8.8392926E7\u001fDEF\u001e",
        );
        next();
      },
    );
  });
});
