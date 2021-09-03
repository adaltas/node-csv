"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = exports["default"] = void 0;

var _stream = _interopRequireDefault(require("stream"));

var _util = _interopRequireDefault(require("util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Transformer = function Transformer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var handler = arguments.length > 1 ? arguments[1] : undefined;
  this.options = options;

  if (options.consume === undefined || options.consume === null) {
    this.options.consume = false;
  }

  this.options.objectMode = true;

  if (options.parallel === undefined || options.parallel === null) {
    this.options.parallel = 100;
  }

  if (options.params === undefined || options.params === null) {
    options.params = null;
  }

  this.handler = handler;

  _stream["default"].Transform.call(this, this.options);

  this.state = {
    running: 0,
    started: 0,
    finished: 0
  };
  return this;
};

_util["default"].inherits(Transformer, _stream["default"].Transform);

Transformer.prototype._transform = function (chunk, encoding, cb) {
  var _this = this;

  this.state.started++;
  this.state.running++;

  if (this.state.running < this.options.parallel) {
    cb();
    cb = null; // Cancel further callback execution
  }

  try {
    var l = this.handler.length;

    if (this.options.params !== null) {
      l--;
    }

    if (l === 1) {
      // sync
      this.__done(null, [this.handler.call(this, chunk, this.options.params)], cb);
    } else if (l === 2) {
      // async
      var callback = function callback(err) {
        for (var _len = arguments.length, chunks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          chunks[_key - 1] = arguments[_key];
        }

        return _this.__done(err, chunks, cb);
      };

      this.handler.call(this, chunk, callback, this.options.params);
    } else {
      throw Error('Invalid handler arguments');
    }

    return false;
  } catch (err) {
    this.__done(err);
  }
};

Transformer.prototype._flush = function (cb) {
  this._ending = function () {
    if (this.state.running === 0) {
      cb();
    }
  };

  this._ending();
}; // Transformer.prototype.__done = function(err, chunks, cb) {
//   var chunk, j, len;
//   this.state.running--;
//   if (err) {
//     return this.emit('error', err);
//   }
//   this.state.finished++;
//   for (j = 0, len = chunks.length; j < len; j++) {
//     chunk = chunks[j];
//     if (typeof chunk === 'number') {
//       chunk = `${chunk}`;
//     }
//     if ((chunk != null) && chunk !== '') {
//       // We dont push empty string
//       // See https://nodejs.org/api/stream.html#stream_readable_push
//       this.push(chunk);
//     }
//   }
//   if (cb) {
//     cb();
//   }
//   if (this._ending) {
//     return this._ending();
//   }
// };


Transformer.prototype.__done = function (err, chunks, cb) {
  this.state.running--;

  if (err) {
    return this.emit('error', err);
  }

  this.state.finished++;

  var _iterator = _createForOfIteratorHelper(chunks),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var chunk = _step.value;

      if (typeof chunk === 'number') {
        chunk = "".concat(chunk);
      } // We dont push empty string
      // See https://nodejs.org/api/stream.html#stream_readable_push


      if (chunk !== undefined && chunk !== null && chunk !== '') {
        this.push(chunk);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (cb) {
    cb();
  }

  if (this._ending) {
    this._ending();
  }
};

var transform = function transform() {
  var options = {};
  var callback, handler, records;

  for (var i = 0; i < arguments.length; i++) {
    var argument = arguments[i];

    var type = _typeof(argument);

    if (argument === null) {
      type = 'null';
    } else if (type === 'object' && Array.isArray(argument)) {
      type = 'array';
    }

    if (type === 'array') {
      records = argument;
    } else if (type === 'object') {
      options = _objectSpread({}, argument);
    } else if (type === 'function') {
      if (handler && i === arguments.length - 1) {
        callback = argument;
      } else {
        handler = argument;
      }
    } else if (type !== 'null') {
      throw new Error("Invalid Arguments: got ".concat(JSON.stringify(argument), " at position ").concat(i));
    }
  }

  var transformer = new Transformer(options, handler);
  var error = false;

  if (records) {
    setImmediate(function () {
      var _iterator2 = _createForOfIteratorHelper(records),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var record = _step2.value;
          if (error) break;
          transformer.write(record);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      transformer.end();
    });
  }

  if (callback || options.consume) {
    var result = [];
    transformer.on('readable', function () {
      var record;

      while (record = transformer.read()) {
        if (callback) {
          result.push(record);
        }
      }
    });
    transformer.on('error', function (err) {
      error = true;
      if (callback) callback(err);
    });
    transformer.on('end', function () {
      if (callback && !error) callback(null, result);
    });
  }

  return transformer;
};

exports.transform = transform;
transform.Transformer = Transformer;
var _default = transform;
exports["default"] = _default;