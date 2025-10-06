import "should";
import { transform } from "../lib/index.js";

describe("handler.async", function () {
  it("modify the received object", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          record.push(record.shift());
          callback(null, record);
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.should.eql([
          ["1979", "8.8017226E7", "ABC", "45", "2000-01-01", "20322051544"],
          ["1974", "8.8392926E7", "DEF", "23", "2050-11-27", "28392898392"],
          ["1944", "8.8349294E2", "HIJ", "17", "2060-08-28", "83929843999"],
        ]);
        next();
      },
    );
  });

  it("skip all records when undefined", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      function (record, callback) {
        process.nextTick(callback);
      },
      function (err, data) {
        if (err) return next(err);
        data.should.eql([]);
        next();
      },
    );
  });

  it("skip individual records when undefined", function (next) {
    let index = 0;
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
        ["47191084482", "1978", "8.8392926E7", "2FF", "23", "2064-02-15"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          index++;
          callback(null, index % 2 ? record : null);
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.should.eql([
          ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
          ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
        ]);
        next();
      },
    );
  });

  it("receive an array and return an object", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          callback(null, { field_1: record[4], field_2: record[3] });
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.should.eql([
          { field_1: "45", field_2: "ABC" },
          { field_1: "23", field_2: "DEF" },
        ]);
        next();
      },
    );
  });

  it("should accept a returned string", function (next) {
    let index = -1;
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          index++;
          callback(null, (index > 0 ? "," : "") + `${record[4]}:${record[3]}`);
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.join("").should.eql("45:ABC,23:DEF");
        next();
      },
    );
  });

  it("should accept a returned number", function (next) {
    let index = 0;
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          callback(null, index++);
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.join("").should.eql("012");
        next();
      },
    );
  });

  it("should accept a returned array with different types", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "2060-08-28"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          const [year, month, day] = record[3].split("-");
          callback(null, [
            parseInt(record[0]),
            parseFloat(record[2]),
            Date.UTC(year, month, day),
          ]);
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.should.eql([
          [20322051544, 88017226, 949363200000],
          [28392898392, 88392926, 2555712000000],
          [83929843999, 883.49294, 2863555200000],
        ]);
        next();
      },
    );
  });

  it("should accept multiple emit", function (next) {
    const chunks = [
      ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
      ["47191084482", "1978", "8.8392926E7", "2FF", "23", "2064-02-15"],
    ];
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      function (record, callback) {
        process.nextTick(function () {
          callback(null, record, chunks.shift());
        });
      },
      function (err, data) {
        if (err) return next(err);
        data.should.eql([
          ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
          ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
          ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
          ["47191084482", "1978", "8.8392926E7", "2FF", "23", "2064-02-15"],
        ]);
        next();
      },
    );
  });
});
