import { transform } from "../lib/index.js";

describe("state.running", function () {
  it("start at 0", function (next) {
    const transformer = transform(
      (val) => val,
      (err) => next(err),
    );
    transformer.state.running.should.eql(0);
    for (let i = 1; i <= 3; i++) {
      transformer.write([i]);
    }
    transformer.end();
  });

  it("equals parallel", function (next) {
    const transformer = transform(
      function (val, callback) {
        setTimeout(() => {
          this.state.running.should.be.within(1, 3);
          callback(null, val);
        }, 100);
      },
      {
        parallel: 3,
      },
      (err) => next(err),
    );
    for (let i = 1; i <= 10; i++) {
      transformer.write([i]);
    }
    transformer.end();
  });

  it("end at 0", function (next) {
    const transformer = transform(
      (val) => val,
      (err) => {
        transformer.state.running.should.eql(0);
        next(err);
      },
    );
    for (let i = 1; i <= 3; i++) {
      transformer.write([i]);
    }
    transformer.end();
  });
});
