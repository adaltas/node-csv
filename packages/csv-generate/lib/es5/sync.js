"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _default(options) {
  if (typeof options === 'string' && /\d+/.test(options)) {
    options = parseInt(options);
  }

  if (Number.isInteger(options)) {
    options = {
      length: options
    };
  } else if (_typeof(options) !== 'object' || options === null) {
    throw Error('Invalid Argument: options must be an object or an integer');
  }

  if (!Number.isInteger(options.length)) {
    throw Error('Invalid Argument: length is not defined');
  }

  var chunks = [];
  var work = true; // See https://nodejs.org/api/stream.html#stream_new_stream_readable_options

  options.highWaterMark = options.objectMode ? 16 : 16384;
  var generator = new _index["default"](options);

  generator.push = function (chunk) {
    if (chunk === null) {
      return work = false;
    }

    if (options.objectMode) {
      chunks.push(chunk);
    } else {
      chunks.push(chunk);
    }
  };

  while (work) {
    generator._read(options.highWaterMark);
  }

  if (!options.objectMode) {
    return chunks.join('');
  } else {
    return chunks;
  }
}