import pad from "pad";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

const letters = (number) => {
  let text = `${number}`;
  text = `${pad(3, text, "0")}`;
  text = [...text].map((c) => 65 - 49 + 1 + c.charCodeAt(0));
  return String.fromCharCode(...text);
};

describe("option.parallel", function () {
  it("respect running", function (next) {
    this.timeout(0);
    let data = [];
    let count = 0;
    let running = 0;
    const generator = generate({
      length: 1000,
      objectMode: true,
      highWaterMark: 40,
      headers: 2,
      seed: 1,
      columns: [
        (g) => letters(pad(3, g.state.count_created, "0")),
        (g) => pad(3, g.state.count_created - 1, "0"),
      ],
    });
    const transformer = generator.pipe(
      transform(
        (record, next) => {
          count++;
          record[1] = letters(count - 1);
          running++;
          running.should.be.below(6);
          setTimeout(
            () => {
              running--;
              next(null, `${record[0]},${record[1]}`);
            },
            1 + Math.ceil(count % 5),
          );
        },
        { parallel: 5 },
      ),
    );
    transformer.on("readable", () => {
      let d;
      while ((d = transformer.read())) {
        data.push(d);
      }
    });
    transformer.on("error", next);
    transformer.on("finish", () => {
      data.sort();
      data = data.slice(0, 8);
      data.should.eql([
        "AAA,AAA",
        "AAB,AAB",
        "AAC,AAC",
        "AAD,AAD",
        "AAE,AAE",
        "AAF,AAF",
        "AAG,AAG",
        "AAH,AAH",
      ]);
      next();
    });
  });
});
