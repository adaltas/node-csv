import "should";
import dedent from "dedent";
import { generate } from "../lib/index.js";

describe("Option `delimiter`", function () {
  it("one char", function (next) {
    generate(
      { seed: 1, delimiter: "|", length: 4, encoding: "ascii" },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          dedent`
            OMH|ONKCHhJmjadoA|D|GeACHiN|nnmiN|CGfDKB|NIl|JnnmjadnmiNL
            KB|dmiM|fENL|Jn|opEMIkdmiOMFckep|MIj|bgIjadnn|fENLEOMIkbhLDK
            B|LF|gGeBFaeAC|iLEO|IkdoAAC|hKpD|opENJ|opDLENLDJoAAABFP
            iNJnmjPbhL|Ik|jPbhKCHhJn|fDKCHhIkeAABEM|kdnlh|DKACIl|HgGdoABEMIjP|adlhKCGf
          `,
        );
        next();
      },
    );
  });

  it("multiple chars", function (next) {
    generate(
      { seed: 1, columns: 3, delimiter: "||", length: 2, encoding: "ascii" },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(dedent`
          OMH||ONKCHhJmjadoA||D
          GeACHiN||nnmiN||CGfDKB
        `);
        next();
      },
    );
  });
});
