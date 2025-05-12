import should from "should";
import { CsvError } from "../lib/index.js";

/* eslint mocha/no-exports: "off" */
export const assert_error = (err, assert = {}, exhaustive = false) => {
  if (Array.isArray(err)) {
    err.forEach((e, i) => assert_error(e, assert[i]));
    return;
  }
  if (exhaustive) {
    for (const key in err) {
      assert.should.have.keys(key);
    }
  }
  err.should.be.an.Error();
  for (const [key, expect] of Object.entries(assert)) {
    let value = err[key];
    if (typeof expect === "string") {
      // eg, convert a buffer
      if (value?.toString) {
        value = value.toString();
      }
      should(value).deepEqual(expect);
    } else if (expect instanceof RegExp) {
      should(value).match(expect);
    } else if (expect === undefined) {
      should(value).be.undefined();
    } else if (expect === null) {
      should(value).be.null();
    } else {
      should(value).deepEqual(expect);
    }
  }
};

describe("API assert_error", function () {
  it("work on array", function () {
    const err = new CsvError("A_MESSAGE", "A message");
    assert_error(
      [err, err],
      [
        {
          code: "A_MESSAGE",
          message: "A message",
        },
        {
          code: "A_MESSAGE",
          message: "A message",
        },
      ],
    );
  });

  it("exhaustive detect a property not in assert", function () {
    const err = new CsvError(
      "A_MESSAGE",
      "A message",
      {},
      { a_key: "a value" },
    );
    (() => {
      assert_error(
        err,
        {
          code: "A_MESSAGE",
          message: "A message",
        },
        true,
      );
    }).should.throw(/expected Object .* to have key a_key/);
  });

  it("detect a property not in error", function () {
    const err = new CsvError("A_MESSAGE", "A message");
    (() => {
      assert_error(err, {
        code: "A_MESSAGE",
        message: "A message",
        a_key: "a value",
      });
    }).should.throw("expected undefined to equal 'a value'");
  });

  it("validate a string value", function () {
    const err = new CsvError("A_MESSAGE", "A message");
    assert_error(err, {
      code: "A_MESSAGE",
      message: "A message",
    });
    (() => {
      assert_error(err, {
        code: "A_MESSAGE",
        message: "Another mesage",
      });
    }).should.throw("expected 'A message' to equal 'Another mesage'");
  });

  it("validate a null value", function () {
    const err = new CsvError("A_MESSAGE", "A message");
    (() => {
      assert_error(err, {
        code: "A_MESSAGE",
        message: null,
      });
    }).should.throw("expected 'A message' to be null");
  });

  it("validate a undefined value", function () {
    const err = new CsvError("A_MESSAGE", "A message");
    (() => {
      assert_error(err, {
        code: "A_MESSAGE",
        message: undefined,
      });
    }).should.throw("expected 'A message' to be undefined");
  });

  it("validate a boolean true value", function () {
    const err = new CsvError("A_MESSAGE", "A message", {}, { a_boolean: true });
    assert_error(err, {
      a_boolean: true,
    });
    (() => {
      assert_error(err, {
        a_boolean: false,
      });
    }).should.throw("expected true to equal false");
  });

  it("validate a boolean false value", function () {
    const err = new CsvError(
      "A_MESSAGE",
      "A message",
      {},
      { a_boolean: false },
    );
    assert_error(err, {
      a_boolean: false,
    });
    (() => {
      assert_error(err, {
        a_boolean: true,
      });
    }).should.throw("expected false to equal true");
  });

  it("validate a regexp value", function () {
    const err = new CsvError("A_MESSAGE", "A message");
    assert_error(err, {
      code: "A_MESSAGE",
      message: /^A.*/,
    });
    (() => {
      assert_error(err, {
        code: "A_MESSAGE",
        message: /^Another.*/,
      });
    }).should.throw("expected 'A message' to match /^Another.*/");
  });
});
