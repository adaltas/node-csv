import "should";
import dedent from "dedent";
import { generate } from "../lib/index.js";

describe("api read", function () {
  it("sync read text", function (next) {
    const buffers = [];
    const generator = generate({ length: 5, seed: 1, columns: 2 });
    generator.on("readable", () => {
      let buffer;
      while ((buffer = generator.read())) {
        Buffer.isBuffer(buffer);
        buffers.push(buffer);
      }
    });
    generator.on("error", next);
    generator.on("end", () => {
      Buffer.concat(buffers)
        .toString()
        .should.eql(
          dedent`
            OMH,ONKCHhJmjadoA
            D,GeACHiN
            nnmiN,CGfDKB
            NIl,JnnmjadnmiNL
            KB,dmiM
          `,
        );
      next();
    });
  });

  it("sync read objects", function (next) {
    const rows = [];
    const generator = generate({
      length: 5,
      objectMode: true,
      seed: 1,
      columns: 2,
    });
    generator.on("readable", () => {
      let row;
      while ((row = generator.read())) {
        rows.push(row);
      }
    });
    generator.on("error", next);
    generator.on("end", () => {
      rows.should.eql([
        ["OMH", "ONKCHhJmjadoA"],
        ["D", "GeACHiN"],
        ["nnmiN", "CGfDKB"],
        ["NIl", "JnnmjadnmiNL"],
        ["KB", "dmiM"],
      ]);
      next();
    });
  });

  it("async read", function (next) {
    this.timeout(0);
    const rows = [];
    const generator = generate({
      length: 5,
      objectMode: true,
      seed: 1,
      columns: 2,
    });
    generator.on("readable", () => {
      const run = () => {
        const row = generator.read();
        if (!row) return;
        rows.push(row);
        setTimeout(run, 10);
      };
      run();
    });
    generator.on("error", next);
    generator.on("end", () => {
      rows.should.eql([
        ["OMH", "ONKCHhJmjadoA"],
        ["D", "GeACHiN"],
        ["nnmiN", "CGfDKB"],
        ["NIl", "JnnmjadnmiNL"],
        ["KB", "dmiM"],
      ]);
      next();
    });
  });
});
