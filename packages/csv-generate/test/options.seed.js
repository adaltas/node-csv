import "should";
import { spawnSync } from "node:child_process";
import { generate } from "../lib/index.js";
import { generate as generateSync } from "../lib/sync.js";
import { random } from "../lib/api/random.js";

describe("Option `seed`", function () {
  describe("without seed", function () {
    it("generate different values", function () {
      random(generate().options).should.not.equal(random(generate().options));
    });

    it("generate between 0 and 1", function () {
      random(generate().options).should.be.above(0);
      random(generate().options).should.be.below(1);
    });
  });

  describe("with zero seed", function () {
    it("generate repeatable records synchronously", function () {
      const options = {
        seed: 0,
        columns: ["ascii", "ascii"],
        length: 3,
        objectMode: true,
      };
      const records = generateSync(options);
      records.should.eql(generateSync(options));
      records
        .every((record) => record.every((word) => word.length > 0))
        .should.be.true();
    });

    it("generate repeatable records with a callback", function (next) {
      const options = {
        seed: 0,
        columns: ["ascii", "ascii"],
        length: 3,
        objectMode: true,
      };
      generate(options, (err, records) => {
        if (err) return next(err);
        records.should.eql(generateSync(options));
        records
          .every((record) => record.every((word) => word.length > 0))
          .should.be.true();
        next();
      });
    });

    it("generate repeatable records as a stream", async function () {
      const options = {
        seed: 0,
        columns: ["ascii", "ascii"],
        length: 3,
        objectMode: true,
      };
      const records = [];
      for await (const record of generate(options)) records.push(record);
      records.should.eql(generateSync(options));
      records
        .every((record) => record.every((word) => word.length > 0))
        .should.be.true();
    });

    it("yield the first record from an unbounded object stream", function () {
      const moduleUrl = new URL("../lib/index.js", import.meta.url).href;
      const result = spawnSync(
        process.execPath,
        [
          "--max-old-space-size=32",
          "--input-type=module",
          "-e",
          `import { generate } from ${JSON.stringify(moduleUrl)};
         const generator = generate({ seed: 0, objectMode: true });
         generator.once("data", (record) => {
           console.log(JSON.stringify(record));
           generator.destroy();
         });`,
        ],
        { timeout: 10000, encoding: "utf8" },
      );
      if (result.error) throw result.error;
      result.status.should.equal(0, result.stderr);
      const record = JSON.parse(result.stdout);
      record.should.have.length(8);
      record.every((word) => word.length > 0).should.be.true();
    });
  });

  describe("with seed", function () {
    it("generate same values", function () {
      random(generate({ seed: 1 }).options).should.equal(
        random(generate({ seed: 1 }).options),
      );
    });

    it("generate between 0 and 1", function () {
      random(generate({ seed: 1 }).options).should.be.above(0);
      random(generate({ seed: 1 }).options).should.be.below(1);
    });

    it("generate data with highWaterMark", function (next) {
      this.timeout(1000000);
      let count = 0;
      const data = [];
      const generator = generate({ seed: 1, highWaterMark: 32 });
      generator.on("readable", () => {
        let d;
        while ((d = generator.read())) {
          data.push(d);
          if (count++ === 2) {
            generator.end();
          }
        }
      });
      generator.on("error", next);
      generator.on("end", () => {
        data
          .join("")
          .trim()
          .should.eql(
            "OMH,ONKCHhJmjadoA,D,GeACHiN,nnmiN,CGfDKB,NIl,JnnmjadnmiNL\n" +
              "KB,dmiM,fENL,Jn,opEMIkdmiOMFckep,MIj,bgIjadnn,fENLEOMIkbhLDK\n" +
              "B,LF,gGeBFaeAC,iLEO,IkdoAAC,hKpD,opENJ,opDLENLDJoAAABFP",
          );
        next();
      });
    });
  });
});
