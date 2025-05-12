import "should";
import { generate } from "../lib/index.js";
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
