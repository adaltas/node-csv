import "should";
import ResizeableBuffer from "../lib/utils/ResizeableBuffer.js";

describe("ResizeableBuffer", function () {
  describe("append", function () {
    it("chars inside boundary", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc");
      for (let i = 0; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.length.should.eql(3);
      rb.clone().toString().should.eql("abc");
    });

    it("chars larger than size", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc,def;hij,klm;");
      for (let i = 0; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.length.should.eql(16);
      rb.clone().toString().should.eql("abc,def;hij,klm;");
    });
  });

  describe("prepend", function () {
    it("chars inside boundary", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc");
      for (let i = 1; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.prepend(buf[0]);
      rb.length.should.eql(3);
      rb.clone().toString().should.eql("abc");
    });

    it("buffer inside boundary", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc");
      for (let i = 1; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.prepend(Buffer.from([buf[0]]));
      rb.length.should.eql(3);
      rb.clone().toString().should.eql("abc");
    });

    it("chars same size as size, prepend byte", function () {
      const rb = new ResizeableBuffer(3);
      const buf = Buffer.from("abcd");
      for (let i = 1; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.prepend(buf[0]);
      rb.length.should.eql(4);
      rb.clone().toString().should.eql("abcd");
    });

    it("chars same size as size, prepend buffer", function () {
      const rb = new ResizeableBuffer(3);
      const buf = Buffer.from("abcd");
      for (let i = 1; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.prepend(Buffer.from([buf[0]]));
      rb.length.should.eql(4);
      rb.clone().toString().should.eql("abcd");
    });

    it("chars larger than size", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc,def;hij,klm;");
      for (let i = 1; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.prepend(buf[0]);
      rb.length.should.eql(16);
      rb.clone().toString().should.eql("abc,def;hij,klm;");
    });

    it("buffer larger than size", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc,def;hij,klm;");
      for (let i = 1; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.prepend(Buffer.from([buf[0]]));
      rb.length.should.eql(16);
      rb.clone().toString().should.eql("abc,def;hij,klm;");
    });

    it("buffer equlas size", function () {
      const rb = new ResizeableBuffer(6);
      for (const chr of "def") {
        rb.append(chr.charCodeAt());
      }
      rb.prepend(Buffer.from("abc"));
      rb.length.should.eql(6);
      rb.toString("utf8").should.eql("abcdef");
    });

    it("throw invalid state if size equal buffer size", function () {
      try {
        const rb = new ResizeableBuffer(3);
        for (const chr of "def") {
          rb.append(chr.charCodeAt());
        }
        rb.prepend(Buffer.from("abc"));
      } catch (err) {
        err.message.should.eql("INVALID_BUFFER_STATE");
      }
    });
  });

  describe("reset", function () {
    it("reset", function () {
      const rb = new ResizeableBuffer(5);
      let buf = Buffer.from("abc,def;");
      for (let i = 0; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.reset();
      buf = Buffer.from("hij,klm;");
      for (let i = 0; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.clone().toString().should.eql("hij,klm;");
    });

    it("toJSON", function () {
      const rb = new ResizeableBuffer(5);
      const buf = Buffer.from("abc,def;");
      for (let i = 0; i < buf.length; i++) {
        rb.append(buf[i]);
      }
      rb.toJSON().should.eql("abc,def;");
    });
  });
});
