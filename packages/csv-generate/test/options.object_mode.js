import "should";
import { generate } from "../lib/index.js";

describe("Option `objectMode`", function () {
  it("return an array of array", function (next) {
    this.timeout(1000000);
    generate({ seed: 1, objectMode: true, length: 4 }, (err, data) => {
      if (err) return next(err);
      data.should.eql([
        [
          "OMH",
          "ONKCHhJmjadoA",
          "D",
          "GeACHiN",
          "nnmiN",
          "CGfDKB",
          "NIl",
          "JnnmjadnmiNL",
        ],
        [
          "KB",
          "dmiM",
          "fENL",
          "Jn",
          "opEMIkdmiOMFckep",
          "MIj",
          "bgIjadnn",
          "fENLEOMIkbhLDK",
        ],
        [
          "B",
          "LF",
          "gGeBFaeAC",
          "iLEO",
          "IkdoAAC",
          "hKpD",
          "opENJ",
          "opDLENLDJoAAABFP",
        ],
        [
          "iNJnmjPbhL",
          "Ik",
          "jPbhKCHhJn",
          "fDKCHhIkeAABEM",
          "kdnlh",
          "DKACIl",
          "HgGdoABEMIjP",
          "adlhKCGf",
        ],
      ]);
      next();
    });
  });
});
