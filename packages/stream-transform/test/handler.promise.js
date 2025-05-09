import "should";
import { transform } from "../lib/index.js";

describe("handler.promise", function () {
  it("handle records", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      (record) => {
        return new Promise((resolve) => {
          process.nextTick(() => {
            record.push(record.shift());
            resolve(record);
          });
        });
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

  it("handle errors", function (next) {
    transform(
      [
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["83929843999", "1944", "8.8349294E2", "HIJ", "17", "2060-08-28"],
      ],
      (record) => {
        return new Promise((_, reject) => {
          process.nextTick(() => {
            record.push(record.shift());
            reject(new Error("Catchme"));
          });
        });
      },
      (err) => {
        err.message.should.eql("Catchme");
        next();
      },
    );
  });
});
