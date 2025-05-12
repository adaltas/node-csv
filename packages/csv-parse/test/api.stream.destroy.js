import fs from "fs";
import os from "os";
import "should";
import { generate } from "csv-generate";
import { parse } from "../lib/index.js";

describe("API destroy", function () {
  it("inside readable with input string", function (next) {
    const parser = parse();
    parser.on("readable", function () {
      while (this.read()) {
        parser.destroy(Error("Catch me"));
      }
    });
    parser.write('"ABC","45"\n"DEF","23"');
    parser.on("error", (err) => {
      err.message.should.eql("Catch me");
      parser._readableState.destroyed.should.be.true();
      next();
    });
    parser.on("end", () => {
      next(Error("End event shouldnt be called"));
    });
    // Note, removing =nextTick trigger both the error and end events
    process.nextTick(() => {
      parser.end();
    });
  });

  it("inside readable with fs input stream", function (next) {
    fs.writeFile(`${os.tmpdir()}/data.csv`, "a,b,c\n1,2,3", (err) => {
      if (err) return next(err);
      const parser = parse();
      parser.on("readable", function () {
        while (this.read()) {
          parser.destroy(Error("Catch me"));
        }
      });
      parser.on("error", (err) => {
        err.message.should.eql("Catch me");
        parser._readableState.destroyed.should.be.true();
        next();
      });
      parser.on("end", () => {
        next(Error("End event shouldnt be called"));
      });
      fs.createReadStream(`${os.tmpdir()}/data.csv`).pipe(parser);
    });
  });

  it("inside readable with generator input stream", function (next) {
    // csv-generate emit data synchronously, it cant detect error on time
    const parser = parse();
    parser.on("readable", function () {
      while (this.read()) {
        parser.destroy(Error("Catch me"));
      }
    });
    parser.on("error", (err) => {
      err.message.should.eql("Catch me");
      parser._readableState.destroyed.should.be.true();
      const version = parseInt(/^v(\d+)/.exec(process.version)[1], 10);
      if (version >= 14) next();
    });
    parser.on("end", () => {
      next();
    });
    generate({ length: 2, seed: 1, columns: 2, fixed_size: true }).pipe(parser);
  });
});
