import "should";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("handler.mode.sync", function () {
  describe("api", function () {
    it("take array, handler and pipe", function (next) {
      const t = transform(
        [
          ["1", "2", "3", "4"],
          ["a", "b", "c", "d"],
        ],
        (data) => {
          data.push(data.shift());
          return data.join(",") + "\n";
        },
      );
      let results = "";
      t.on("readable", () => {
        let r;
        while ((r = t.read())) results += r;
      });
      t.on("error", next);
      t.on("end", () => {
        results.should.eql("2,3,4,1\nb,c,d,a\n");
        next();
      });
    });

    it("take array, handler, callback", function (next) {
      transform(
        [
          ["1", "2", "3", "4"],
          ["a", "b", "c", "d"],
        ],
        (data) => {
          data.push(data.shift());
          return data.join(",") + "\n";
        },
        (err, output) => {
          output.should.eql(["2,3,4,1\n", "b,c,d,a\n"]);
          next();
        },
      );
    });
  });

  it("modify the received object", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      (record) => {
        record.push(record.shift());
        return record;
      },
      (err, data) => {
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

  it("skip all lines when undefined is returned", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      (record) => {
        record;
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql([]);
        next();
      },
    );
  });

  it("skip lines when undefined is returned", function (next) {
    let index = 0;
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
        ["47191084482", "1978", "8.8392926E7", "2FF", "23", "2064-02-15"],
      ],
      (record) => {
        index++;
        return index % 2 ? record : null;
      },
      (err, data) => {
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
      (record) => ({ field_1: record[4], field_2: record[3] }),
      (err, data) => {
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
      (record) => {
        index++;
        return (index > 0 ? "," : "") + `${record[4]}:${record[3]}`;
      },
      (err, data) => {
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
      (record) => {
        record;
        return index++;
      },
      (err, data) => {
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
      (record) => {
        const [year, month, day] = record[3].split("-");
        return [
          parseInt(record[0]),
          parseFloat(record[2]),
          Date.UTC(year, month, day),
        ];
      },
      (err, data) => {
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

  describe("behavior", function () {
    it("respect order", function () {
      generate(
        { length: 1000, objectMode: true, seed: 1, columns: 2 },
        function (err, source) {
          transform(
            source,
            { parallel: 1 },
            (record) => record,
            (err, result) => result.should.eql(source),
          );
        },
      );
    });
  });
});
