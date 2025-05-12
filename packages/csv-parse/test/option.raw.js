import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `raw`", function () {
  it("validation", function () {
    parse("", { raw: undefined }, () => {});
    parse("", { raw: null }, () => {});
    parse("", { raw: false }, () => {});
    (() => parse("", { raw: "" }, () => {})).should.throw(
      'Invalid Option: raw must be true, got ""',
    );
    (() => parse("", { raw: 2 }, () => {})).should.throw(
      "Invalid Option: raw must be true, got 2",
    );
  });

  it("includes escape chars", function (next) {
    const str = dedent`
    "hello""world",LOL
    `;
    parse(str, { raw: true, escape: '"' }, (err, records) => {
      if (err) return next(err);
      records[0].raw.should.eql(str);
      records[0].record.should.eql(['hello"world', "LOL"]);
      next();
    });
  });

  it("includes line breaks", function (next) {
    parse(
      dedent`
      hello
      my
      friend
    `,
      { raw: true, escape: '"' },
      (err, records) => {
        if (err) return next(err);
        records[1].raw.should.match(/\n$/);
        next();
      },
    );
  });

  it("has the inner line breaks", function (next) {
    const str = dedent`
    foo,"b
    a
    r"
    `;
    parse(str, { raw: true, escape: '"' }, (err, records) => {
      if (err) return next(err);
      records[0].raw.should.eql(str);
      next();
    });
  });

  it("preserve columns", function (next) {
    parse(
      dedent`
    name,last name
    Boudreau,Jonathan
    `,
      { raw: true, columns: ["FIELD_1", false] },
      (err, records) => {
        if (err) return next(err);
        records[0].raw.should.eql("name,last name\n");
        records[0].record.should.eql({ FIELD_1: "name" });
        next();
      },
    );
  });
});
