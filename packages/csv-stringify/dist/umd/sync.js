(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.csv_stringify_sync = {}));
})(this, (function (exports) { 'use strict';

            var global$1 = (typeof global !== "undefined" ? global :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {});

            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
            var inited = false;
            function init () {
              inited = true;
              var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              for (var i = 0, len = code.length; i < len; ++i) {
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i;
              }

              revLookup['-'.charCodeAt(0)] = 62;
              revLookup['_'.charCodeAt(0)] = 63;
            }

            function toByteArray (b64) {
              if (!inited) {
                init();
              }
              var i, j, l, tmp, placeHolders, arr;
              var len = b64.length;

              if (len % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4')
              }

              // the number of equal signs (place holders)
              // if there are two placeholders, than the two characters before it
              // represent one byte
              // if there is only one, then the three characters before it represent 2 bytes
              // this is just a cheap hack to not do indexOf twice
              placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

              // base64 is 4/3 + up to two characters of the original data
              arr = new Arr(len * 3 / 4 - placeHolders);

              // if there are placeholders, only get up to the last complete 4 chars
              l = placeHolders > 0 ? len - 4 : len;

              var L = 0;

              for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
                arr[L++] = (tmp >> 16) & 0xFF;
                arr[L++] = (tmp >> 8) & 0xFF;
                arr[L++] = tmp & 0xFF;
              }

              if (placeHolders === 2) {
                tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
                arr[L++] = tmp & 0xFF;
              } else if (placeHolders === 1) {
                tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
                arr[L++] = (tmp >> 8) & 0xFF;
                arr[L++] = tmp & 0xFF;
              }

              return arr
            }

            function tripletToBase64 (num) {
              return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
            }

            function encodeChunk (uint8, start, end) {
              var tmp;
              var output = [];
              for (var i = start; i < end; i += 3) {
                tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
                output.push(tripletToBase64(tmp));
              }
              return output.join('')
            }

            function fromByteArray (uint8) {
              if (!inited) {
                init();
              }
              var tmp;
              var len = uint8.length;
              var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
              var output = '';
              var parts = [];
              var maxChunkLength = 16383; // must be multiple of 3

              // go through the array every three bytes, we'll deal with trailing stuff later
              for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
              }

              // pad the end with zeros, but make sure to not forget the extra bytes
              if (extraBytes === 1) {
                tmp = uint8[len - 1];
                output += lookup[tmp >> 2];
                output += lookup[(tmp << 4) & 0x3F];
                output += '==';
              } else if (extraBytes === 2) {
                tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
                output += lookup[tmp >> 10];
                output += lookup[(tmp >> 4) & 0x3F];
                output += lookup[(tmp << 2) & 0x3F];
                output += '=';
              }

              parts.push(output);

              return parts.join('')
            }

            function read (buffer, offset, isLE, mLen, nBytes) {
              var e, m;
              var eLen = nBytes * 8 - mLen - 1;
              var eMax = (1 << eLen) - 1;
              var eBias = eMax >> 1;
              var nBits = -7;
              var i = isLE ? (nBytes - 1) : 0;
              var d = isLE ? -1 : 1;
              var s = buffer[offset + i];

              i += d;

              e = s & ((1 << (-nBits)) - 1);
              s >>= (-nBits);
              nBits += eLen;
              for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

              m = e & ((1 << (-nBits)) - 1);
              e >>= (-nBits);
              nBits += mLen;
              for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

              if (e === 0) {
                e = 1 - eBias;
              } else if (e === eMax) {
                return m ? NaN : ((s ? -1 : 1) * Infinity)
              } else {
                m = m + Math.pow(2, mLen);
                e = e - eBias;
              }
              return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            }

            function write (buffer, value, offset, isLE, mLen, nBytes) {
              var e, m, c;
              var eLen = nBytes * 8 - mLen - 1;
              var eMax = (1 << eLen) - 1;
              var eBias = eMax >> 1;
              var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
              var i = isLE ? 0 : (nBytes - 1);
              var d = isLE ? 1 : -1;
              var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

              value = Math.abs(value);

              if (isNaN(value) || value === Infinity) {
                m = isNaN(value) ? 1 : 0;
                e = eMax;
              } else {
                e = Math.floor(Math.log(value) / Math.LN2);
                if (value * (c = Math.pow(2, -e)) < 1) {
                  e--;
                  c *= 2;
                }
                if (e + eBias >= 1) {
                  value += rt / c;
                } else {
                  value += rt * Math.pow(2, 1 - eBias);
                }
                if (value * c >= 2) {
                  e++;
                  c /= 2;
                }

                if (e + eBias >= eMax) {
                  m = 0;
                  e = eMax;
                } else if (e + eBias >= 1) {
                  m = (value * c - 1) * Math.pow(2, mLen);
                  e = e + eBias;
                } else {
                  m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                  e = 0;
                }
              }

              for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

              e = (e << mLen) | m;
              eLen += mLen;
              for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

              buffer[offset + i - d] |= s * 128;
            }

            var toString = {}.toString;

            var isArray = Array.isArray || function (arr) {
              return toString.call(arr) == '[object Array]';
            };

            var INSPECT_MAX_BYTES = 50;

            /**
             * If `Buffer.TYPED_ARRAY_SUPPORT`:
             *   === true    Use Uint8Array implementation (fastest)
             *   === false   Use Object implementation (most compatible, even IE6)
             *
             * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
             * Opera 11.6+, iOS 4.2+.
             *
             * Due to various browser bugs, sometimes the Object implementation will be used even
             * when the browser supports typed arrays.
             *
             * Note:
             *
             *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
             *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
             *
             *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
             *
             *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
             *     incorrect length in some situations.

             * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
             * get the Object implementation, which is slower but behaves correctly.
             */
            Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
              ? global$1.TYPED_ARRAY_SUPPORT
              : true;

            /*
             * Export kMaxLength after typed array support is determined.
             */
            kMaxLength();

            function kMaxLength () {
              return Buffer.TYPED_ARRAY_SUPPORT
                ? 0x7fffffff
                : 0x3fffffff
            }

            function createBuffer (that, length) {
              if (kMaxLength() < length) {
                throw new RangeError('Invalid typed array length')
              }
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                // Return an augmented `Uint8Array` instance, for best performance
                that = new Uint8Array(length);
                that.__proto__ = Buffer.prototype;
              } else {
                // Fallback: Return an object instance of the Buffer class
                if (that === null) {
                  that = new Buffer(length);
                }
                that.length = length;
              }

              return that
            }

            /**
             * The Buffer constructor returns instances of `Uint8Array` that have their
             * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
             * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
             * and the `Uint8Array` methods. Square bracket notation works as expected -- it
             * returns a single octet.
             *
             * The `Uint8Array` prototype remains unmodified.
             */

            function Buffer (arg, encodingOrOffset, length) {
              if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
                return new Buffer(arg, encodingOrOffset, length)
              }

              // Common case.
              if (typeof arg === 'number') {
                if (typeof encodingOrOffset === 'string') {
                  throw new Error(
                    'If encoding is specified then the first argument must be a string'
                  )
                }
                return allocUnsafe(this, arg)
              }
              return from(this, arg, encodingOrOffset, length)
            }

            Buffer.poolSize = 8192; // not used by this implementation

            // TODO: Legacy, not needed anymore. Remove in next major version.
            Buffer._augment = function (arr) {
              arr.__proto__ = Buffer.prototype;
              return arr
            };

            function from (that, value, encodingOrOffset, length) {
              if (typeof value === 'number') {
                throw new TypeError('"value" argument must not be a number')
              }

              if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
                return fromArrayBuffer(that, value, encodingOrOffset, length)
              }

              if (typeof value === 'string') {
                return fromString(that, value, encodingOrOffset)
              }

              return fromObject(that, value)
            }

            /**
             * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
             * if value is a number.
             * Buffer.from(str[, encoding])
             * Buffer.from(array)
             * Buffer.from(buffer)
             * Buffer.from(arrayBuffer[, byteOffset[, length]])
             **/
            Buffer.from = function (value, encodingOrOffset, length) {
              return from(null, value, encodingOrOffset, length)
            };

            if (Buffer.TYPED_ARRAY_SUPPORT) {
              Buffer.prototype.__proto__ = Uint8Array.prototype;
              Buffer.__proto__ = Uint8Array;
              if (typeof Symbol !== 'undefined' && Symbol.species &&
                  Buffer[Symbol.species] === Buffer) ;
            }

            function assertSize (size) {
              if (typeof size !== 'number') {
                throw new TypeError('"size" argument must be a number')
              } else if (size < 0) {
                throw new RangeError('"size" argument must not be negative')
              }
            }

            function alloc (that, size, fill, encoding) {
              assertSize(size);
              if (size <= 0) {
                return createBuffer(that, size)
              }
              if (fill !== undefined) {
                // Only pay attention to encoding if it's a string. This
                // prevents accidentally sending in a number that would
                // be interpretted as a start offset.
                return typeof encoding === 'string'
                  ? createBuffer(that, size).fill(fill, encoding)
                  : createBuffer(that, size).fill(fill)
              }
              return createBuffer(that, size)
            }

            /**
             * Creates a new filled Buffer instance.
             * alloc(size[, fill[, encoding]])
             **/
            Buffer.alloc = function (size, fill, encoding) {
              return alloc(null, size, fill, encoding)
            };

            function allocUnsafe (that, size) {
              assertSize(size);
              that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
              if (!Buffer.TYPED_ARRAY_SUPPORT) {
                for (var i = 0; i < size; ++i) {
                  that[i] = 0;
                }
              }
              return that
            }

            /**
             * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
             * */
            Buffer.allocUnsafe = function (size) {
              return allocUnsafe(null, size)
            };
            /**
             * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
             */
            Buffer.allocUnsafeSlow = function (size) {
              return allocUnsafe(null, size)
            };

            function fromString (that, string, encoding) {
              if (typeof encoding !== 'string' || encoding === '') {
                encoding = 'utf8';
              }

              if (!Buffer.isEncoding(encoding)) {
                throw new TypeError('"encoding" must be a valid string encoding')
              }

              var length = byteLength(string, encoding) | 0;
              that = createBuffer(that, length);

              var actual = that.write(string, encoding);

              if (actual !== length) {
                // Writing a hex string, for example, that contains invalid characters will
                // cause everything after the first invalid character to be ignored. (e.g.
                // 'abxxcd' will be treated as 'ab')
                that = that.slice(0, actual);
              }

              return that
            }

            function fromArrayLike (that, array) {
              var length = array.length < 0 ? 0 : checked(array.length) | 0;
              that = createBuffer(that, length);
              for (var i = 0; i < length; i += 1) {
                that[i] = array[i] & 255;
              }
              return that
            }

            function fromArrayBuffer (that, array, byteOffset, length) {
              array.byteLength; // this throws if `array` is not a valid ArrayBuffer

              if (byteOffset < 0 || array.byteLength < byteOffset) {
                throw new RangeError('\'offset\' is out of bounds')
              }

              if (array.byteLength < byteOffset + (length || 0)) {
                throw new RangeError('\'length\' is out of bounds')
              }

              if (byteOffset === undefined && length === undefined) {
                array = new Uint8Array(array);
              } else if (length === undefined) {
                array = new Uint8Array(array, byteOffset);
              } else {
                array = new Uint8Array(array, byteOffset, length);
              }

              if (Buffer.TYPED_ARRAY_SUPPORT) {
                // Return an augmented `Uint8Array` instance, for best performance
                that = array;
                that.__proto__ = Buffer.prototype;
              } else {
                // Fallback: Return an object instance of the Buffer class
                that = fromArrayLike(that, array);
              }
              return that
            }

            function fromObject (that, obj) {
              if (internalIsBuffer(obj)) {
                var len = checked(obj.length) | 0;
                that = createBuffer(that, len);

                if (that.length === 0) {
                  return that
                }

                obj.copy(that, 0, 0, len);
                return that
              }

              if (obj) {
                if ((typeof ArrayBuffer !== 'undefined' &&
                    obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
                  if (typeof obj.length !== 'number' || isnan(obj.length)) {
                    return createBuffer(that, 0)
                  }
                  return fromArrayLike(that, obj)
                }

                if (obj.type === 'Buffer' && isArray(obj.data)) {
                  return fromArrayLike(that, obj.data)
                }
              }

              throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
            }

            function checked (length) {
              // Note: cannot use `length < kMaxLength()` here because that fails when
              // length is NaN (which is otherwise coerced to zero.)
              if (length >= kMaxLength()) {
                throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                                     'size: 0x' + kMaxLength().toString(16) + ' bytes')
              }
              return length | 0
            }
            Buffer.isBuffer = isBuffer;
            function internalIsBuffer (b) {
              return !!(b != null && b._isBuffer)
            }

            Buffer.compare = function compare (a, b) {
              if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
                throw new TypeError('Arguments must be Buffers')
              }

              if (a === b) return 0

              var x = a.length;
              var y = b.length;

              for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                if (a[i] !== b[i]) {
                  x = a[i];
                  y = b[i];
                  break
                }
              }

              if (x < y) return -1
              if (y < x) return 1
              return 0
            };

            Buffer.isEncoding = function isEncoding (encoding) {
              switch (String(encoding).toLowerCase()) {
                case 'hex':
                case 'utf8':
                case 'utf-8':
                case 'ascii':
                case 'latin1':
                case 'binary':
                case 'base64':
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return true
                default:
                  return false
              }
            };

            Buffer.concat = function concat (list, length) {
              if (!isArray(list)) {
                throw new TypeError('"list" argument must be an Array of Buffers')
              }

              if (list.length === 0) {
                return Buffer.alloc(0)
              }

              var i;
              if (length === undefined) {
                length = 0;
                for (i = 0; i < list.length; ++i) {
                  length += list[i].length;
                }
              }

              var buffer = Buffer.allocUnsafe(length);
              var pos = 0;
              for (i = 0; i < list.length; ++i) {
                var buf = list[i];
                if (!internalIsBuffer(buf)) {
                  throw new TypeError('"list" argument must be an Array of Buffers')
                }
                buf.copy(buffer, pos);
                pos += buf.length;
              }
              return buffer
            };

            function byteLength (string, encoding) {
              if (internalIsBuffer(string)) {
                return string.length
              }
              if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
                  (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                return string.byteLength
              }
              if (typeof string !== 'string') {
                string = '' + string;
              }

              var len = string.length;
              if (len === 0) return 0

              // Use a for loop to avoid recursion
              var loweredCase = false;
              for (;;) {
                switch (encoding) {
                  case 'ascii':
                  case 'latin1':
                  case 'binary':
                    return len
                  case 'utf8':
                  case 'utf-8':
                  case undefined:
                    return utf8ToBytes(string).length
                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return len * 2
                  case 'hex':
                    return len >>> 1
                  case 'base64':
                    return base64ToBytes(string).length
                  default:
                    if (loweredCase) return utf8ToBytes(string).length // assume utf8
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
                }
              }
            }
            Buffer.byteLength = byteLength;

            function slowToString (encoding, start, end) {
              var loweredCase = false;

              // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
              // property of a typed array.

              // This behaves neither like String nor Uint8Array in that we set start/end
              // to their upper/lower bounds if the value passed is out of range.
              // undefined is handled specially as per ECMA-262 6th Edition,
              // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
              if (start === undefined || start < 0) {
                start = 0;
              }
              // Return early if start > this.length. Done here to prevent potential uint32
              // coercion fail below.
              if (start > this.length) {
                return ''
              }

              if (end === undefined || end > this.length) {
                end = this.length;
              }

              if (end <= 0) {
                return ''
              }

              // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
              end >>>= 0;
              start >>>= 0;

              if (end <= start) {
                return ''
              }

              if (!encoding) encoding = 'utf8';

              while (true) {
                switch (encoding) {
                  case 'hex':
                    return hexSlice(this, start, end)

                  case 'utf8':
                  case 'utf-8':
                    return utf8Slice(this, start, end)

                  case 'ascii':
                    return asciiSlice(this, start, end)

                  case 'latin1':
                  case 'binary':
                    return latin1Slice(this, start, end)

                  case 'base64':
                    return base64Slice(this, start, end)

                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return utf16leSlice(this, start, end)

                  default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                    encoding = (encoding + '').toLowerCase();
                    loweredCase = true;
                }
              }
            }

            // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
            // Buffer instances.
            Buffer.prototype._isBuffer = true;

            function swap (b, n, m) {
              var i = b[n];
              b[n] = b[m];
              b[m] = i;
            }

            Buffer.prototype.swap16 = function swap16 () {
              var len = this.length;
              if (len % 2 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 16-bits')
              }
              for (var i = 0; i < len; i += 2) {
                swap(this, i, i + 1);
              }
              return this
            };

            Buffer.prototype.swap32 = function swap32 () {
              var len = this.length;
              if (len % 4 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 32-bits')
              }
              for (var i = 0; i < len; i += 4) {
                swap(this, i, i + 3);
                swap(this, i + 1, i + 2);
              }
              return this
            };

            Buffer.prototype.swap64 = function swap64 () {
              var len = this.length;
              if (len % 8 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 64-bits')
              }
              for (var i = 0; i < len; i += 8) {
                swap(this, i, i + 7);
                swap(this, i + 1, i + 6);
                swap(this, i + 2, i + 5);
                swap(this, i + 3, i + 4);
              }
              return this
            };

            Buffer.prototype.toString = function toString () {
              var length = this.length | 0;
              if (length === 0) return ''
              if (arguments.length === 0) return utf8Slice(this, 0, length)
              return slowToString.apply(this, arguments)
            };

            Buffer.prototype.equals = function equals (b) {
              if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
              if (this === b) return true
              return Buffer.compare(this, b) === 0
            };

            Buffer.prototype.inspect = function inspect () {
              var str = '';
              var max = INSPECT_MAX_BYTES;
              if (this.length > 0) {
                str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
                if (this.length > max) str += ' ... ';
              }
              return '<Buffer ' + str + '>'
            };

            Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
              if (!internalIsBuffer(target)) {
                throw new TypeError('Argument must be a Buffer')
              }

              if (start === undefined) {
                start = 0;
              }
              if (end === undefined) {
                end = target ? target.length : 0;
              }
              if (thisStart === undefined) {
                thisStart = 0;
              }
              if (thisEnd === undefined) {
                thisEnd = this.length;
              }

              if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                throw new RangeError('out of range index')
              }

              if (thisStart >= thisEnd && start >= end) {
                return 0
              }
              if (thisStart >= thisEnd) {
                return -1
              }
              if (start >= end) {
                return 1
              }

              start >>>= 0;
              end >>>= 0;
              thisStart >>>= 0;
              thisEnd >>>= 0;

              if (this === target) return 0

              var x = thisEnd - thisStart;
              var y = end - start;
              var len = Math.min(x, y);

              var thisCopy = this.slice(thisStart, thisEnd);
              var targetCopy = target.slice(start, end);

              for (var i = 0; i < len; ++i) {
                if (thisCopy[i] !== targetCopy[i]) {
                  x = thisCopy[i];
                  y = targetCopy[i];
                  break
                }
              }

              if (x < y) return -1
              if (y < x) return 1
              return 0
            };

            // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
            // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
            //
            // Arguments:
            // - buffer - a Buffer to search
            // - val - a string, Buffer, or number
            // - byteOffset - an index into `buffer`; will be clamped to an int32
            // - encoding - an optional encoding, relevant is val is a string
            // - dir - true for indexOf, false for lastIndexOf
            function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
              // Empty buffer means no match
              if (buffer.length === 0) return -1

              // Normalize byteOffset
              if (typeof byteOffset === 'string') {
                encoding = byteOffset;
                byteOffset = 0;
              } else if (byteOffset > 0x7fffffff) {
                byteOffset = 0x7fffffff;
              } else if (byteOffset < -0x80000000) {
                byteOffset = -0x80000000;
              }
              byteOffset = +byteOffset;  // Coerce to Number.
              if (isNaN(byteOffset)) {
                // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                byteOffset = dir ? 0 : (buffer.length - 1);
              }

              // Normalize byteOffset: negative offsets start from the end of the buffer
              if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
              if (byteOffset >= buffer.length) {
                if (dir) return -1
                else byteOffset = buffer.length - 1;
              } else if (byteOffset < 0) {
                if (dir) byteOffset = 0;
                else return -1
              }

              // Normalize val
              if (typeof val === 'string') {
                val = Buffer.from(val, encoding);
              }

              // Finally, search either indexOf (if dir is true) or lastIndexOf
              if (internalIsBuffer(val)) {
                // Special case: looking for empty string/buffer always fails
                if (val.length === 0) {
                  return -1
                }
                return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
              } else if (typeof val === 'number') {
                val = val & 0xFF; // Search for a byte value [0-255]
                if (Buffer.TYPED_ARRAY_SUPPORT &&
                    typeof Uint8Array.prototype.indexOf === 'function') {
                  if (dir) {
                    return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                  } else {
                    return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                  }
                }
                return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
              }

              throw new TypeError('val must be string, number or Buffer')
            }

            function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
              var indexSize = 1;
              var arrLength = arr.length;
              var valLength = val.length;

              if (encoding !== undefined) {
                encoding = String(encoding).toLowerCase();
                if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                    encoding === 'utf16le' || encoding === 'utf-16le') {
                  if (arr.length < 2 || val.length < 2) {
                    return -1
                  }
                  indexSize = 2;
                  arrLength /= 2;
                  valLength /= 2;
                  byteOffset /= 2;
                }
              }

              function read (buf, i) {
                if (indexSize === 1) {
                  return buf[i]
                } else {
                  return buf.readUInt16BE(i * indexSize)
                }
              }

              var i;
              if (dir) {
                var foundIndex = -1;
                for (i = byteOffset; i < arrLength; i++) {
                  if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                    if (foundIndex === -1) foundIndex = i;
                    if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                  } else {
                    if (foundIndex !== -1) i -= i - foundIndex;
                    foundIndex = -1;
                  }
                }
              } else {
                if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
                for (i = byteOffset; i >= 0; i--) {
                  var found = true;
                  for (var j = 0; j < valLength; j++) {
                    if (read(arr, i + j) !== read(val, j)) {
                      found = false;
                      break
                    }
                  }
                  if (found) return i
                }
              }

              return -1
            }

            Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
              return this.indexOf(val, byteOffset, encoding) !== -1
            };

            Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
              return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
            };

            Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
              return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
            };

            function hexWrite (buf, string, offset, length) {
              offset = Number(offset) || 0;
              var remaining = buf.length - offset;
              if (!length) {
                length = remaining;
              } else {
                length = Number(length);
                if (length > remaining) {
                  length = remaining;
                }
              }

              // must be an even number of digits
              var strLen = string.length;
              if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

              if (length > strLen / 2) {
                length = strLen / 2;
              }
              for (var i = 0; i < length; ++i) {
                var parsed = parseInt(string.substr(i * 2, 2), 16);
                if (isNaN(parsed)) return i
                buf[offset + i] = parsed;
              }
              return i
            }

            function utf8Write (buf, string, offset, length) {
              return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
            }

            function asciiWrite (buf, string, offset, length) {
              return blitBuffer(asciiToBytes(string), buf, offset, length)
            }

            function latin1Write (buf, string, offset, length) {
              return asciiWrite(buf, string, offset, length)
            }

            function base64Write (buf, string, offset, length) {
              return blitBuffer(base64ToBytes(string), buf, offset, length)
            }

            function ucs2Write (buf, string, offset, length) {
              return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
            }

            Buffer.prototype.write = function write (string, offset, length, encoding) {
              // Buffer#write(string)
              if (offset === undefined) {
                encoding = 'utf8';
                length = this.length;
                offset = 0;
              // Buffer#write(string, encoding)
              } else if (length === undefined && typeof offset === 'string') {
                encoding = offset;
                length = this.length;
                offset = 0;
              // Buffer#write(string, offset[, length][, encoding])
              } else if (isFinite(offset)) {
                offset = offset | 0;
                if (isFinite(length)) {
                  length = length | 0;
                  if (encoding === undefined) encoding = 'utf8';
                } else {
                  encoding = length;
                  length = undefined;
                }
              // legacy write(string, encoding, offset, length) - remove in v0.13
              } else {
                throw new Error(
                  'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                )
              }

              var remaining = this.length - offset;
              if (length === undefined || length > remaining) length = remaining;

              if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                throw new RangeError('Attempt to write outside buffer bounds')
              }

              if (!encoding) encoding = 'utf8';

              var loweredCase = false;
              for (;;) {
                switch (encoding) {
                  case 'hex':
                    return hexWrite(this, string, offset, length)

                  case 'utf8':
                  case 'utf-8':
                    return utf8Write(this, string, offset, length)

                  case 'ascii':
                    return asciiWrite(this, string, offset, length)

                  case 'latin1':
                  case 'binary':
                    return latin1Write(this, string, offset, length)

                  case 'base64':
                    // Warning: maxLength not taken into account in base64Write
                    return base64Write(this, string, offset, length)

                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return ucs2Write(this, string, offset, length)

                  default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
                }
              }
            };

            Buffer.prototype.toJSON = function toJSON () {
              return {
                type: 'Buffer',
                data: Array.prototype.slice.call(this._arr || this, 0)
              }
            };

            function base64Slice (buf, start, end) {
              if (start === 0 && end === buf.length) {
                return fromByteArray(buf)
              } else {
                return fromByteArray(buf.slice(start, end))
              }
            }

            function utf8Slice (buf, start, end) {
              end = Math.min(buf.length, end);
              var res = [];

              var i = start;
              while (i < end) {
                var firstByte = buf[i];
                var codePoint = null;
                var bytesPerSequence = (firstByte > 0xEF) ? 4
                  : (firstByte > 0xDF) ? 3
                  : (firstByte > 0xBF) ? 2
                  : 1;

                if (i + bytesPerSequence <= end) {
                  var secondByte, thirdByte, fourthByte, tempCodePoint;

                  switch (bytesPerSequence) {
                    case 1:
                      if (firstByte < 0x80) {
                        codePoint = firstByte;
                      }
                      break
                    case 2:
                      secondByte = buf[i + 1];
                      if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
                        if (tempCodePoint > 0x7F) {
                          codePoint = tempCodePoint;
                        }
                      }
                      break
                    case 3:
                      secondByte = buf[i + 1];
                      thirdByte = buf[i + 2];
                      if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                          codePoint = tempCodePoint;
                        }
                      }
                      break
                    case 4:
                      secondByte = buf[i + 1];
                      thirdByte = buf[i + 2];
                      fourthByte = buf[i + 3];
                      if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                          codePoint = tempCodePoint;
                        }
                      }
                  }
                }

                if (codePoint === null) {
                  // we did not generate a valid codePoint so insert a
                  // replacement char (U+FFFD) and advance only 1 byte
                  codePoint = 0xFFFD;
                  bytesPerSequence = 1;
                } else if (codePoint > 0xFFFF) {
                  // encode to utf16 (surrogate pair dance)
                  codePoint -= 0x10000;
                  res.push(codePoint >>> 10 & 0x3FF | 0xD800);
                  codePoint = 0xDC00 | codePoint & 0x3FF;
                }

                res.push(codePoint);
                i += bytesPerSequence;
              }

              return decodeCodePointsArray(res)
            }

            // Based on http://stackoverflow.com/a/22747272/680742, the browser with
            // the lowest limit is Chrome, with 0x10000 args.
            // We go 1 magnitude less, for safety
            var MAX_ARGUMENTS_LENGTH = 0x1000;

            function decodeCodePointsArray (codePoints) {
              var len = codePoints.length;
              if (len <= MAX_ARGUMENTS_LENGTH) {
                return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
              }

              // Decode in chunks to avoid "call stack size exceeded".
              var res = '';
              var i = 0;
              while (i < len) {
                res += String.fromCharCode.apply(
                  String,
                  codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
                );
              }
              return res
            }

            function asciiSlice (buf, start, end) {
              var ret = '';
              end = Math.min(buf.length, end);

              for (var i = start; i < end; ++i) {
                ret += String.fromCharCode(buf[i] & 0x7F);
              }
              return ret
            }

            function latin1Slice (buf, start, end) {
              var ret = '';
              end = Math.min(buf.length, end);

              for (var i = start; i < end; ++i) {
                ret += String.fromCharCode(buf[i]);
              }
              return ret
            }

            function hexSlice (buf, start, end) {
              var len = buf.length;

              if (!start || start < 0) start = 0;
              if (!end || end < 0 || end > len) end = len;

              var out = '';
              for (var i = start; i < end; ++i) {
                out += toHex(buf[i]);
              }
              return out
            }

            function utf16leSlice (buf, start, end) {
              var bytes = buf.slice(start, end);
              var res = '';
              for (var i = 0; i < bytes.length; i += 2) {
                res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
              }
              return res
            }

            Buffer.prototype.slice = function slice (start, end) {
              var len = this.length;
              start = ~~start;
              end = end === undefined ? len : ~~end;

              if (start < 0) {
                start += len;
                if (start < 0) start = 0;
              } else if (start > len) {
                start = len;
              }

              if (end < 0) {
                end += len;
                if (end < 0) end = 0;
              } else if (end > len) {
                end = len;
              }

              if (end < start) end = start;

              var newBuf;
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                newBuf = this.subarray(start, end);
                newBuf.__proto__ = Buffer.prototype;
              } else {
                var sliceLen = end - start;
                newBuf = new Buffer(sliceLen, undefined);
                for (var i = 0; i < sliceLen; ++i) {
                  newBuf[i] = this[i + start];
                }
              }

              return newBuf
            };

            /*
             * Need to make sure that buffer isn't trying to write out of bounds.
             */
            function checkOffset (offset, ext, length) {
              if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
              if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
            }

            Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) checkOffset(offset, byteLength, this.length);

              var val = this[offset];
              var mul = 1;
              var i = 0;
              while (++i < byteLength && (mul *= 0x100)) {
                val += this[offset + i] * mul;
              }

              return val
            };

            Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) {
                checkOffset(offset, byteLength, this.length);
              }

              var val = this[offset + --byteLength];
              var mul = 1;
              while (byteLength > 0 && (mul *= 0x100)) {
                val += this[offset + --byteLength] * mul;
              }

              return val
            };

            Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 1, this.length);
              return this[offset]
            };

            Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              return this[offset] | (this[offset + 1] << 8)
            };

            Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              return (this[offset] << 8) | this[offset + 1]
            };

            Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return ((this[offset]) |
                  (this[offset + 1] << 8) |
                  (this[offset + 2] << 16)) +
                  (this[offset + 3] * 0x1000000)
            };

            Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return (this[offset] * 0x1000000) +
                ((this[offset + 1] << 16) |
                (this[offset + 2] << 8) |
                this[offset + 3])
            };

            Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) checkOffset(offset, byteLength, this.length);

              var val = this[offset];
              var mul = 1;
              var i = 0;
              while (++i < byteLength && (mul *= 0x100)) {
                val += this[offset + i] * mul;
              }
              mul *= 0x80;

              if (val >= mul) val -= Math.pow(2, 8 * byteLength);

              return val
            };

            Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) checkOffset(offset, byteLength, this.length);

              var i = byteLength;
              var mul = 1;
              var val = this[offset + --i];
              while (i > 0 && (mul *= 0x100)) {
                val += this[offset + --i] * mul;
              }
              mul *= 0x80;

              if (val >= mul) val -= Math.pow(2, 8 * byteLength);

              return val
            };

            Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 1, this.length);
              if (!(this[offset] & 0x80)) return (this[offset])
              return ((0xff - this[offset] + 1) * -1)
            };

            Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              var val = this[offset] | (this[offset + 1] << 8);
              return (val & 0x8000) ? val | 0xFFFF0000 : val
            };

            Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              var val = this[offset + 1] | (this[offset] << 8);
              return (val & 0x8000) ? val | 0xFFFF0000 : val
            };

            Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return (this[offset]) |
                (this[offset + 1] << 8) |
                (this[offset + 2] << 16) |
                (this[offset + 3] << 24)
            };

            Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return (this[offset] << 24) |
                (this[offset + 1] << 16) |
                (this[offset + 2] << 8) |
                (this[offset + 3])
            };

            Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);
              return read(this, offset, true, 23, 4)
            };

            Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);
              return read(this, offset, false, 23, 4)
            };

            Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 8, this.length);
              return read(this, offset, true, 52, 8)
            };

            Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 8, this.length);
              return read(this, offset, false, 52, 8)
            };

            function checkInt (buf, value, offset, ext, max, min) {
              if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
              if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
              if (offset + ext > buf.length) throw new RangeError('Index out of range')
            }

            Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                checkInt(this, value, offset, byteLength, maxBytes, 0);
              }

              var mul = 1;
              var i = 0;
              this[offset] = value & 0xFF;
              while (++i < byteLength && (mul *= 0x100)) {
                this[offset + i] = (value / mul) & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                checkInt(this, value, offset, byteLength, maxBytes, 0);
              }

              var i = byteLength - 1;
              var mul = 1;
              this[offset + i] = value & 0xFF;
              while (--i >= 0 && (mul *= 0x100)) {
                this[offset + i] = (value / mul) & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
              if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
              this[offset] = (value & 0xff);
              return offset + 1
            };

            function objectWriteUInt16 (buf, value, offset, littleEndian) {
              if (value < 0) value = 0xffff + value + 1;
              for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
                buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                  (littleEndian ? i : 1 - i) * 8;
              }
            }

            Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value & 0xff);
                this[offset + 1] = (value >>> 8);
              } else {
                objectWriteUInt16(this, value, offset, true);
              }
              return offset + 2
            };

            Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 8);
                this[offset + 1] = (value & 0xff);
              } else {
                objectWriteUInt16(this, value, offset, false);
              }
              return offset + 2
            };

            function objectWriteUInt32 (buf, value, offset, littleEndian) {
              if (value < 0) value = 0xffffffff + value + 1;
              for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
                buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
              }
            }

            Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset + 3] = (value >>> 24);
                this[offset + 2] = (value >>> 16);
                this[offset + 1] = (value >>> 8);
                this[offset] = (value & 0xff);
              } else {
                objectWriteUInt32(this, value, offset, true);
              }
              return offset + 4
            };

            Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 24);
                this[offset + 1] = (value >>> 16);
                this[offset + 2] = (value >>> 8);
                this[offset + 3] = (value & 0xff);
              } else {
                objectWriteUInt32(this, value, offset, false);
              }
              return offset + 4
            };

            Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) {
                var limit = Math.pow(2, 8 * byteLength - 1);

                checkInt(this, value, offset, byteLength, limit - 1, -limit);
              }

              var i = 0;
              var mul = 1;
              var sub = 0;
              this[offset] = value & 0xFF;
              while (++i < byteLength && (mul *= 0x100)) {
                if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                  sub = 1;
                }
                this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) {
                var limit = Math.pow(2, 8 * byteLength - 1);

                checkInt(this, value, offset, byteLength, limit - 1, -limit);
              }

              var i = byteLength - 1;
              var mul = 1;
              var sub = 0;
              this[offset + i] = value & 0xFF;
              while (--i >= 0 && (mul *= 0x100)) {
                if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                  sub = 1;
                }
                this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
              if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
              if (value < 0) value = 0xff + value + 1;
              this[offset] = (value & 0xff);
              return offset + 1
            };

            Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value & 0xff);
                this[offset + 1] = (value >>> 8);
              } else {
                objectWriteUInt16(this, value, offset, true);
              }
              return offset + 2
            };

            Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 8);
                this[offset + 1] = (value & 0xff);
              } else {
                objectWriteUInt16(this, value, offset, false);
              }
              return offset + 2
            };

            Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value & 0xff);
                this[offset + 1] = (value >>> 8);
                this[offset + 2] = (value >>> 16);
                this[offset + 3] = (value >>> 24);
              } else {
                objectWriteUInt32(this, value, offset, true);
              }
              return offset + 4
            };

            Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
              if (value < 0) value = 0xffffffff + value + 1;
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 24);
                this[offset + 1] = (value >>> 16);
                this[offset + 2] = (value >>> 8);
                this[offset + 3] = (value & 0xff);
              } else {
                objectWriteUInt32(this, value, offset, false);
              }
              return offset + 4
            };

            function checkIEEE754 (buf, value, offset, ext, max, min) {
              if (offset + ext > buf.length) throw new RangeError('Index out of range')
              if (offset < 0) throw new RangeError('Index out of range')
            }

            function writeFloat (buf, value, offset, littleEndian, noAssert) {
              if (!noAssert) {
                checkIEEE754(buf, value, offset, 4);
              }
              write(buf, value, offset, littleEndian, 23, 4);
              return offset + 4
            }

            Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
              return writeFloat(this, value, offset, true, noAssert)
            };

            Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
              return writeFloat(this, value, offset, false, noAssert)
            };

            function writeDouble (buf, value, offset, littleEndian, noAssert) {
              if (!noAssert) {
                checkIEEE754(buf, value, offset, 8);
              }
              write(buf, value, offset, littleEndian, 52, 8);
              return offset + 8
            }

            Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
              return writeDouble(this, value, offset, true, noAssert)
            };

            Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
              return writeDouble(this, value, offset, false, noAssert)
            };

            // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
            Buffer.prototype.copy = function copy (target, targetStart, start, end) {
              if (!start) start = 0;
              if (!end && end !== 0) end = this.length;
              if (targetStart >= target.length) targetStart = target.length;
              if (!targetStart) targetStart = 0;
              if (end > 0 && end < start) end = start;

              // Copy 0 bytes; we're done
              if (end === start) return 0
              if (target.length === 0 || this.length === 0) return 0

              // Fatal error conditions
              if (targetStart < 0) {
                throw new RangeError('targetStart out of bounds')
              }
              if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
              if (end < 0) throw new RangeError('sourceEnd out of bounds')

              // Are we oob?
              if (end > this.length) end = this.length;
              if (target.length - targetStart < end - start) {
                end = target.length - targetStart + start;
              }

              var len = end - start;
              var i;

              if (this === target && start < targetStart && targetStart < end) {
                // descending copy from end
                for (i = len - 1; i >= 0; --i) {
                  target[i + targetStart] = this[i + start];
                }
              } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                // ascending copy from start
                for (i = 0; i < len; ++i) {
                  target[i + targetStart] = this[i + start];
                }
              } else {
                Uint8Array.prototype.set.call(
                  target,
                  this.subarray(start, start + len),
                  targetStart
                );
              }

              return len
            };

            // Usage:
            //    buffer.fill(number[, offset[, end]])
            //    buffer.fill(buffer[, offset[, end]])
            //    buffer.fill(string[, offset[, end]][, encoding])
            Buffer.prototype.fill = function fill (val, start, end, encoding) {
              // Handle string cases:
              if (typeof val === 'string') {
                if (typeof start === 'string') {
                  encoding = start;
                  start = 0;
                  end = this.length;
                } else if (typeof end === 'string') {
                  encoding = end;
                  end = this.length;
                }
                if (val.length === 1) {
                  var code = val.charCodeAt(0);
                  if (code < 256) {
                    val = code;
                  }
                }
                if (encoding !== undefined && typeof encoding !== 'string') {
                  throw new TypeError('encoding must be a string')
                }
                if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                  throw new TypeError('Unknown encoding: ' + encoding)
                }
              } else if (typeof val === 'number') {
                val = val & 255;
              }

              // Invalid ranges are not set to a default, so can range check early.
              if (start < 0 || this.length < start || this.length < end) {
                throw new RangeError('Out of range index')
              }

              if (end <= start) {
                return this
              }

              start = start >>> 0;
              end = end === undefined ? this.length : end >>> 0;

              if (!val) val = 0;

              var i;
              if (typeof val === 'number') {
                for (i = start; i < end; ++i) {
                  this[i] = val;
                }
              } else {
                var bytes = internalIsBuffer(val)
                  ? val
                  : utf8ToBytes(new Buffer(val, encoding).toString());
                var len = bytes.length;
                for (i = 0; i < end - start; ++i) {
                  this[i + start] = bytes[i % len];
                }
              }

              return this
            };

            // HELPER FUNCTIONS
            // ================

            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

            function base64clean (str) {
              // Node strips out invalid characters like \n and \t from the string, base64-js does not
              str = stringtrim(str).replace(INVALID_BASE64_RE, '');
              // Node converts strings with length < 2 to ''
              if (str.length < 2) return ''
              // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
              while (str.length % 4 !== 0) {
                str = str + '=';
              }
              return str
            }

            function stringtrim (str) {
              if (str.trim) return str.trim()
              return str.replace(/^\s+|\s+$/g, '')
            }

            function toHex (n) {
              if (n < 16) return '0' + n.toString(16)
              return n.toString(16)
            }

            function utf8ToBytes (string, units) {
              units = units || Infinity;
              var codePoint;
              var length = string.length;
              var leadSurrogate = null;
              var bytes = [];

              for (var i = 0; i < length; ++i) {
                codePoint = string.charCodeAt(i);

                // is surrogate component
                if (codePoint > 0xD7FF && codePoint < 0xE000) {
                  // last char was a lead
                  if (!leadSurrogate) {
                    // no lead yet
                    if (codePoint > 0xDBFF) {
                      // unexpected trail
                      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                      continue
                    } else if (i + 1 === length) {
                      // unpaired lead
                      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                      continue
                    }

                    // valid lead
                    leadSurrogate = codePoint;

                    continue
                  }

                  // 2 leads in a row
                  if (codePoint < 0xDC00) {
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    leadSurrogate = codePoint;
                    continue
                  }

                  // valid surrogate pair
                  codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                } else if (leadSurrogate) {
                  // valid bmp char, but last char was a lead
                  if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                }

                leadSurrogate = null;

                // encode utf8
                if (codePoint < 0x80) {
                  if ((units -= 1) < 0) break
                  bytes.push(codePoint);
                } else if (codePoint < 0x800) {
                  if ((units -= 2) < 0) break
                  bytes.push(
                    codePoint >> 0x6 | 0xC0,
                    codePoint & 0x3F | 0x80
                  );
                } else if (codePoint < 0x10000) {
                  if ((units -= 3) < 0) break
                  bytes.push(
                    codePoint >> 0xC | 0xE0,
                    codePoint >> 0x6 & 0x3F | 0x80,
                    codePoint & 0x3F | 0x80
                  );
                } else if (codePoint < 0x110000) {
                  if ((units -= 4) < 0) break
                  bytes.push(
                    codePoint >> 0x12 | 0xF0,
                    codePoint >> 0xC & 0x3F | 0x80,
                    codePoint >> 0x6 & 0x3F | 0x80,
                    codePoint & 0x3F | 0x80
                  );
                } else {
                  throw new Error('Invalid code point')
                }
              }

              return bytes
            }

            function asciiToBytes (str) {
              var byteArray = [];
              for (var i = 0; i < str.length; ++i) {
                // Node's code seems to be doing this and not & 0x7F..
                byteArray.push(str.charCodeAt(i) & 0xFF);
              }
              return byteArray
            }

            function utf16leToBytes (str, units) {
              var c, hi, lo;
              var byteArray = [];
              for (var i = 0; i < str.length; ++i) {
                if ((units -= 2) < 0) break

                c = str.charCodeAt(i);
                hi = c >> 8;
                lo = c % 256;
                byteArray.push(lo);
                byteArray.push(hi);
              }

              return byteArray
            }


            function base64ToBytes (str) {
              return toByteArray(base64clean(str))
            }

            function blitBuffer (src, dst, offset, length) {
              for (var i = 0; i < length; ++i) {
                if ((i + offset >= dst.length) || (i >= src.length)) break
                dst[i + offset] = src[i];
              }
              return i
            }

            function isnan (val) {
              return val !== val // eslint-disable-line no-self-compare
            }


            // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
            // The _isBuffer check is for Safari 5-7 support, because it's missing
            // Object.prototype.constructor. Remove this eventually
            function isBuffer(obj) {
              return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
            }

            function isFastBuffer (obj) {
              return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
            }

            // For Node v0.10 support. Remove this eventually.
            function isSlowBuffer (obj) {
              return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
            }

            // Lodash implementation of `get`

            const charCodeOfDot = ".".charCodeAt(0);
            const reEscapeChar = /\\(\\)?/g;
            const rePropName = RegExp(
              // Match anything that isn't a dot or bracket.
              "[^.[\\]]+" +
                "|" +
                // Or match property names within brackets.
                "\\[(?:" +
                // Match a non-string expression.
                "([^\"'][^[]*)" +
                "|" +
                // Or match strings (supports escaping characters).
                "([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2" +
                ")\\]" +
                "|" +
                // Or match "" as the space between consecutive dots or empty brackets.
                "(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))",
              "g",
            );
            const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
            const reIsPlainProp = /^\w*$/;

            const getTag = function (value) {
              return Object.prototype.toString.call(value);
            };

            const isSymbol = function (value) {
              const type = typeof value;
              return (
                type === "symbol" ||
                (type === "object" && value && getTag(value) === "[object Symbol]")
              );
            };

            const isKey = function (value, object) {
              if (Array.isArray(value)) {
                return false;
              }
              const type = typeof value;
              if (
                type === "number" ||
                type === "symbol" ||
                type === "boolean" ||
                !value ||
                isSymbol(value)
              ) {
                return true;
              }
              return (
                reIsPlainProp.test(value) ||
                !reIsDeepProp.test(value) ||
                (object != null && value in Object(object))
              );
            };

            const stringToPath = function (string) {
              const result = [];
              if (string.charCodeAt(0) === charCodeOfDot) {
                result.push("");
              }
              string.replace(rePropName, function (match, expression, quote, subString) {
                let key = match;
                if (quote) {
                  key = subString.replace(reEscapeChar, "$1");
                } else if (expression) {
                  key = expression.trim();
                }
                result.push(key);
              });
              return result;
            };

            const castPath = function (value, object) {
              if (Array.isArray(value)) {
                return value;
              } else {
                return isKey(value, object) ? [value] : stringToPath(value);
              }
            };

            const toKey = function (value) {
              if (typeof value === "string" || isSymbol(value)) return value;
              const result = `${value}`;
              // eslint-disable-next-line
              return result == "0" && 1 / value == -INFINITY ? "-0" : result;
            };

            const get = function (object, path) {
              path = castPath(path, object);
              let index = 0;
              const length = path.length;
              while (object != null && index < length) {
                object = object[toKey(path[index++])];
              }
              return index && index === length ? object : undefined;
            };

            const is_object = function (obj) {
              return typeof obj === "object" && obj !== null && !Array.isArray(obj);
            };

            const normalize_columns = function (columns) {
              if (columns === undefined || columns === null) {
                return [undefined, undefined];
              }
              if (typeof columns !== "object") {
                return [Error('Invalid option "columns": expect an array or an object')];
              }
              if (!Array.isArray(columns)) {
                const newcolumns = [];
                for (const k in columns) {
                  newcolumns.push({
                    key: k,
                    header: columns[k],
                  });
                }
                columns = newcolumns;
              } else {
                const newcolumns = [];
                for (const column of columns) {
                  if (typeof column === "string") {
                    newcolumns.push({
                      key: column,
                      header: column,
                    });
                  } else if (
                    typeof column === "object" &&
                    column !== null &&
                    !Array.isArray(column)
                  ) {
                    if (!column.key) {
                      return [
                        Error('Invalid column definition: property "key" is required'),
                      ];
                    }
                    if (column.header === undefined) {
                      column.header = column.key;
                    }
                    newcolumns.push(column);
                  } else {
                    return [
                      Error("Invalid column definition: expect a string or an object"),
                    ];
                  }
                }
                columns = newcolumns;
              }
              return [undefined, columns];
            };

            class CsvError extends Error {
              constructor(code, message, ...contexts) {
                if (Array.isArray(message)) message = message.join(" ");
                super(message);
                if (Error.captureStackTrace !== undefined) {
                  Error.captureStackTrace(this, CsvError);
                }
                this.code = code;
                for (const context of contexts) {
                  for (const key in context) {
                    const value = context[key];
                    this[key] = isBuffer(value)
                      ? value.toString()
                      : value == null
                        ? value
                        : JSON.parse(JSON.stringify(value));
                  }
                }
              }
            }

            const underscore = function (str) {
              return str.replace(/([A-Z])/g, function (_, match) {
                return "_" + match.toLowerCase();
              });
            };

            const normalize_options = function (opts) {
              const options = {};
              // Merge with user options
              for (const opt in opts) {
                options[underscore(opt)] = opts[opt];
              }
              // Normalize option `bom`
              if (
                options.bom === undefined ||
                options.bom === null ||
                options.bom === false
              ) {
                options.bom = false;
              } else if (options.bom !== true) {
                return [
                  new CsvError("CSV_OPTION_BOOLEAN_INVALID_TYPE", [
                    "option `bom` is optional and must be a boolean value,",
                    `got ${JSON.stringify(options.bom)}`,
                  ]),
                ];
              }
              // Normalize option `delimiter`
              if (options.delimiter === undefined || options.delimiter === null) {
                options.delimiter = ",";
              } else if (isBuffer(options.delimiter)) {
                options.delimiter = options.delimiter.toString();
              } else if (typeof options.delimiter !== "string") {
                return [
                  new CsvError("CSV_OPTION_DELIMITER_INVALID_TYPE", [
                    "option `delimiter` must be a buffer or a string,",
                    `got ${JSON.stringify(options.delimiter)}`,
                  ]),
                ];
              }
              // Normalize option `quote`
              if (options.quote === undefined || options.quote === null) {
                options.quote = '"';
              } else if (options.quote === true) {
                options.quote = '"';
              } else if (options.quote === false) {
                options.quote = "";
              } else if (isBuffer(options.quote)) {
                options.quote = options.quote.toString();
              } else if (typeof options.quote !== "string") {
                return [
                  new CsvError("CSV_OPTION_QUOTE_INVALID_TYPE", [
                    "option `quote` must be a boolean, a buffer or a string,",
                    `got ${JSON.stringify(options.quote)}`,
                  ]),
                ];
              }
              // Normalize option `quoted`
              if (options.quoted === undefined || options.quoted === null) {
                options.quoted = false;
              }
              // Normalize option `escape_formulas`
              if (
                options.escape_formulas === undefined ||
                options.escape_formulas === null
              ) {
                options.escape_formulas = false;
              } else if (typeof options.escape_formulas !== "boolean") {
                return [
                  new CsvError("CSV_OPTION_ESCAPE_FORMULAS_INVALID_TYPE", [
                    "option `escape_formulas` must be a boolean,",
                    `got ${JSON.stringify(options.escape_formulas)}`,
                  ]),
                ];
              }
              // Normalize option `quoted_empty`
              if (options.quoted_empty === undefined || options.quoted_empty === null) {
                options.quoted_empty = undefined;
              }
              // Normalize option `quoted_match`
              if (
                options.quoted_match === undefined ||
                options.quoted_match === null ||
                options.quoted_match === false
              ) {
                options.quoted_match = null;
              } else if (!Array.isArray(options.quoted_match)) {
                options.quoted_match = [options.quoted_match];
              }
              if (options.quoted_match) {
                for (const quoted_match of options.quoted_match) {
                  const isString = typeof quoted_match === "string";
                  const isRegExp = quoted_match instanceof RegExp;
                  if (!isString && !isRegExp) {
                    return [
                      Error(
                        `Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`,
                      ),
                    ];
                  }
                }
              }
              // Normalize option `quoted_string`
              if (options.quoted_string === undefined || options.quoted_string === null) {
                options.quoted_string = false;
              }
              // Normalize option `eof`
              if (options.eof === undefined || options.eof === null) {
                options.eof = true;
              }
              // Normalize option `escape`
              if (options.escape === undefined || options.escape === null) {
                options.escape = '"';
              } else if (isBuffer(options.escape)) {
                options.escape = options.escape.toString();
              } else if (typeof options.escape !== "string") {
                return [
                  Error(
                    `Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`,
                  ),
                ];
              }
              if (options.escape.length > 1) {
                return [
                  Error(
                    `Invalid Option: escape must be one character, got ${options.escape.length} characters`,
                  ),
                ];
              }
              // Normalize option `header`
              if (options.header === undefined || options.header === null) {
                options.header = false;
              }
              // Normalize option `columns`
              const [errColumns, columns] = normalize_columns(options.columns);
              if (errColumns !== undefined) return [errColumns];
              options.columns = columns;
              // Normalize option `quoted`
              if (options.quoted === undefined || options.quoted === null) {
                options.quoted = false;
              }
              // Normalize option `cast`
              if (options.cast === undefined || options.cast === null) {
                options.cast = {};
              }
              // Normalize option cast.bigint
              if (options.cast.bigint === undefined || options.cast.bigint === null) {
                // Cast boolean to string by default
                options.cast.bigint = (value) => "" + value;
              }
              // Normalize option cast.boolean
              if (options.cast.boolean === undefined || options.cast.boolean === null) {
                // Cast boolean to string by default
                options.cast.boolean = (value) => (value ? "1" : "");
              }
              // Normalize option cast.date
              if (options.cast.date === undefined || options.cast.date === null) {
                // Cast date to timestamp string by default
                options.cast.date = (value) => "" + value.getTime();
              }
              // Normalize option cast.number
              if (options.cast.number === undefined || options.cast.number === null) {
                // Cast number to string using native casting by default
                options.cast.number = (value) => "" + value;
              }
              // Normalize option cast.object
              if (options.cast.object === undefined || options.cast.object === null) {
                // Stringify object as JSON by default
                options.cast.object = (value) => JSON.stringify(value);
              }
              // Normalize option cast.string
              if (options.cast.string === undefined || options.cast.string === null) {
                // Leave string untouched
                options.cast.string = function (value) {
                  return value;
                };
              }
              // Normalize option `on_record`
              if (
                options.on_record !== undefined &&
                typeof options.on_record !== "function"
              ) {
                return [Error(`Invalid Option: "on_record" must be a function.`)];
              }
              // Normalize option `record_delimiter`
              if (
                options.record_delimiter === undefined ||
                options.record_delimiter === null
              ) {
                options.record_delimiter = "\n";
              } else if (isBuffer(options.record_delimiter)) {
                options.record_delimiter = options.record_delimiter.toString();
              } else if (typeof options.record_delimiter !== "string") {
                return [
                  Error(
                    `Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(options.record_delimiter)}`,
                  ),
                ];
              }
              switch (options.record_delimiter) {
                case "unix":
                  options.record_delimiter = "\n";
                  break;
                case "mac":
                  options.record_delimiter = "\r";
                  break;
                case "windows":
                  options.record_delimiter = "\r\n";
                  break;
                case "ascii":
                  options.record_delimiter = "\u001e";
                  break;
                case "unicode":
                  options.record_delimiter = "\u2028";
                  break;
              }
              return [undefined, options];
            };

            const bom_utf8 = Buffer.from([239, 187, 191]);

            const stringifier = function (options, state, info) {
              return {
                options: options,
                state: state,
                info: info,
                __transform: function (chunk, push) {
                  // Chunk validation
                  if (!Array.isArray(chunk) && typeof chunk !== "object") {
                    return Error(
                      `Invalid Record: expect an array or an object, got ${JSON.stringify(chunk)}`,
                    );
                  }
                  // Detect columns from the first record
                  if (this.info.records === 0) {
                    if (Array.isArray(chunk)) {
                      if (
                        this.options.header === true &&
                        this.options.columns === undefined
                      ) {
                        return Error(
                          "Undiscoverable Columns: header option requires column option or object records",
                        );
                      }
                    } else if (this.options.columns === undefined) {
                      const [err, columns] = normalize_columns(Object.keys(chunk));
                      if (err) return;
                      this.options.columns = columns;
                    }
                  }
                  // Emit the header
                  if (this.info.records === 0) {
                    this.bom(push);
                    const err = this.headers(push);
                    if (err) return err;
                  }
                  // Emit and stringify the record if an object or an array
                  try {
                    // this.emit('record', chunk, this.info.records);
                    if (this.options.on_record) {
                      this.options.on_record(chunk, this.info.records);
                    }
                  } catch (err) {
                    return err;
                  }
                  // Convert the record into a string
                  let err, chunk_string;
                  if (this.options.eof) {
                    [err, chunk_string] = this.stringify(chunk);
                    if (err) return err;
                    if (chunk_string === undefined) {
                      return;
                    } else {
                      chunk_string = chunk_string + this.options.record_delimiter;
                    }
                  } else {
                    [err, chunk_string] = this.stringify(chunk);
                    if (err) return err;
                    if (chunk_string === undefined) {
                      return;
                    } else {
                      if (this.options.header || this.info.records) {
                        chunk_string = this.options.record_delimiter + chunk_string;
                      }
                    }
                  }
                  // Emit the csv
                  this.info.records++;
                  push(chunk_string);
                },
                stringify: function (chunk, chunkIsHeader = false) {
                  if (typeof chunk !== "object") {
                    return [undefined, chunk];
                  }
                  const { columns } = this.options;
                  const record = [];
                  // Record is an array
                  if (Array.isArray(chunk)) {
                    // We are getting an array but the user has specified output columns. In
                    // this case, we respect the columns indexes
                    if (columns) {
                      chunk.splice(columns.length);
                    }
                    // Cast record elements
                    for (let i = 0; i < chunk.length; i++) {
                      const field = chunk[i];
                      const [err, value] = this.__cast(field, {
                        index: i,
                        column: i,
                        records: this.info.records,
                        header: chunkIsHeader,
                      });
                      if (err) return [err];
                      record[i] = [value, field];
                    }
                    // Record is a literal object
                    // `columns` is always defined: it is either provided or discovered.
                  } else {
                    for (let i = 0; i < columns.length; i++) {
                      const field = get(chunk, columns[i].key);
                      const [err, value] = this.__cast(field, {
                        index: i,
                        column: columns[i].key,
                        records: this.info.records,
                        header: chunkIsHeader,
                      });
                      if (err) return [err];
                      record[i] = [value, field];
                    }
                  }
                  let csvrecord = "";
                  for (let i = 0; i < record.length; i++) {
                    let options, err;

                    let [value, field] = record[i];
                    if (typeof value === "string") {
                      options = this.options;
                    } else if (is_object(value)) {
                      options = value;
                      value = options.value;
                      delete options.value;
                      if (
                        typeof value !== "string" &&
                        value !== undefined &&
                        value !== null
                      ) {
                        if (err)
                          return [
                            Error(
                              `Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`,
                            ),
                          ];
                      }
                      options = { ...this.options, ...options };
                      [err, options] = normalize_options(options);
                      if (err !== undefined) {
                        return [err];
                      }
                    } else if (value === undefined || value === null) {
                      options = this.options;
                    } else {
                      return [
                        Error(
                          `Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`,
                        ),
                      ];
                    }
                    const {
                      delimiter,
                      escape,
                      quote,
                      quoted,
                      quoted_empty,
                      quoted_string,
                      quoted_match,
                      record_delimiter,
                      escape_formulas,
                    } = options;
                    if ("" === value && "" === field) {
                      let quotedMatch =
                        quoted_match &&
                        quoted_match.filter((quoted_match) => {
                          if (typeof quoted_match === "string") {
                            return value.indexOf(quoted_match) !== -1;
                          } else {
                            return quoted_match.test(value);
                          }
                        });
                      quotedMatch = quotedMatch && quotedMatch.length > 0;
                      const shouldQuote =
                        quotedMatch ||
                        true === quoted_empty ||
                        (true === quoted_string && false !== quoted_empty);
                      if (shouldQuote === true) {
                        value = quote + value + quote;
                      }
                      csvrecord += value;
                    } else if (value) {
                      if (typeof value !== "string") {
                        return [
                          Error(
                            `Formatter must return a string, null or undefined, got ${JSON.stringify(value)}`,
                          ),
                        ];
                      }
                      const containsdelimiter =
                        delimiter.length && value.indexOf(delimiter) >= 0;
                      const containsQuote = quote !== "" && value.indexOf(quote) >= 0;
                      const containsEscape = value.indexOf(escape) >= 0 && escape !== quote;
                      const containsRecordDelimiter = value.indexOf(record_delimiter) >= 0;
                      const quotedString = quoted_string && typeof field === "string";
                      let quotedMatch =
                        quoted_match &&
                        quoted_match.filter((quoted_match) => {
                          if (typeof quoted_match === "string") {
                            return value.indexOf(quoted_match) !== -1;
                          } else {
                            return quoted_match.test(value);
                          }
                        });
                      quotedMatch = quotedMatch && quotedMatch.length > 0;
                      // See https://github.com/adaltas/node-csv/pull/387
                      // More about CSV injection or formula injection, when websites embed
                      // untrusted input inside CSV files:
                      // https://owasp.org/www-community/attacks/CSV_Injection
                      // http://georgemauer.net/2017/10/07/csv-injection.html
                      // Apple Numbers unicode normalization is empirical from testing
                      if (escape_formulas) {
                        switch (value[0]) {
                          case "=":
                          case "+":
                          case "-":
                          case "@":
                          case "\t":
                          case "\r":
                          case "\uFF1D": // Unicode '='
                          case "\uFF0B": // Unicode '+'
                          case "\uFF0D": // Unicode '-'
                          case "\uFF20": // Unicode '@'
                            value = `'${value}`;
                            break;
                        }
                      }
                      const shouldQuote =
                        containsQuote === true ||
                        containsdelimiter ||
                        containsRecordDelimiter ||
                        quoted ||
                        quotedString ||
                        quotedMatch;
                      if (shouldQuote === true && containsEscape === true) {
                        const regexp =
                          escape === "\\"
                            ? new RegExp(escape + escape, "g")
                            : new RegExp(escape, "g");
                        value = value.replace(regexp, escape + escape);
                      }
                      if (containsQuote === true) {
                        const regexp = new RegExp(quote, "g");
                        value = value.replace(regexp, escape + quote);
                      }
                      if (shouldQuote === true) {
                        value = quote + value + quote;
                      }
                      csvrecord += value;
                    } else if (
                      quoted_empty === true ||
                      (field === "" && quoted_string === true && quoted_empty !== false)
                    ) {
                      csvrecord += quote + quote;
                    }
                    if (i !== record.length - 1) {
                      csvrecord += delimiter;
                    }
                  }
                  return [undefined, csvrecord];
                },
                bom: function (push) {
                  if (this.options.bom !== true) {
                    return;
                  }
                  push(bom_utf8);
                },
                headers: function (push) {
                  if (this.options.header === false) {
                    return;
                  }
                  if (this.options.columns === undefined) {
                    return;
                  }
                  let err;
                  let headers = this.options.columns.map((column) => column.header);
                  if (this.options.eof) {
                    [err, headers] = this.stringify(headers, true);
                    headers += this.options.record_delimiter;
                  } else {
                    [err, headers] = this.stringify(headers);
                  }
                  if (err) return err;
                  push(headers);
                },
                __cast: function (value, context) {
                  const type = typeof value;
                  try {
                    if (type === "string") {
                      // Fine for 99% of the cases
                      return [undefined, this.options.cast.string(value, context)];
                    } else if (type === "bigint") {
                      return [undefined, this.options.cast.bigint(value, context)];
                    } else if (type === "number") {
                      return [undefined, this.options.cast.number(value, context)];
                    } else if (type === "boolean") {
                      return [undefined, this.options.cast.boolean(value, context)];
                    } else if (value instanceof Date) {
                      return [undefined, this.options.cast.date(value, context)];
                    } else if (type === "object" && value !== null) {
                      return [undefined, this.options.cast.object(value, context)];
                    } else {
                      return [undefined, value, value];
                    }
                  } catch (err) {
                    return [err];
                  }
                },
              };
            };

            const stringify = function (records, opts = {}) {
              const data = [];
              const [err, options] = normalize_options(opts);
              if (err !== undefined) throw err;
              const state = {
                stop: false,
              };
              // Information
              const info = {
                records: 0,
              };
              const api = stringifier(options, state, info);
              for (const record of records) {
                const err = api.__transform(record, function (record) {
                  data.push(record);
                });
                if (err !== undefined) throw err;
              }
              if (data.length === 0) {
                api.bom((d) => {
                  data.push(d);
                });
                const err = api.headers((headers) => {
                  data.push(headers);
                });
                if (err !== undefined) throw err;
              }
              return data.join("");
            };

            exports.stringify = stringify;

}));
