// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/guitarstring.js":[function(require,module,exports) {
var GuitarString = function GuitarString(stringNumber, openFrequency) {
  this.stringNumber = stringNumber;
  this.openFrequency = openFrequency; // Any music note frequency f is related to another frequency f0 by:
  // f = f0 * alpha ^ s
  // where alpha = 2 ^ (1/12)
  // s = # of semitones from f0 to f (s > 0 if ascending, s < 0 if descending)

  this.alpha = Math.pow(2, 1 / 12);
  this.logalpha = Math.log(2) / 12;
  this.logopenFreq = Math.log(openFrequency);
};
/**
* get fret from frequency.
*
* @param {number} frequency
* @returns {number}
*/


GuitarString.prototype.getFret = function (frequency) {
  /* Derivation:
     Since f = f0 * alpha ^ s,
     f / f0 = alpha ^ s
     s = Math.log(f / f0) / Math.log(alpha)
     s = (Math.log(f) - Math.log(f0)) / Math.log(alpha)
  */
  var s = (Math.log(frequency) - this.logopenFreq) / this.logalpha;
  return Math.round(s);
};

module.exports = {
  GuitarString: GuitarString
};
},{}],"../node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"../node_modules/process/browser.js"}],"js/aubio.js":[function(require,module,exports) {
var process = require("process");
var __dirname = "/Users/jeff/Documents/Projects/parcel-gh-test/src/js";
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Aubio = function Aubio(_Aubio) {
  _Aubio = _Aubio || {};
  var c;
  c || (c = typeof _Aubio !== 'undefined' ? _Aubio : {});
  var n = {},
      r;

  for (r in c) {
    c.hasOwnProperty(r) && (n[r] = c[r]);
  }

  c.arguments = [];
  c.thisProgram = "./this.program";

  c.quit = function (a, b) {
    throw b;
  };

  c.preRun = [];
  c.postRun = [];
  var u = !1,
      v = !1,
      aa = !1,
      ba = !1;
  u = "object" === (typeof window === "undefined" ? "undefined" : _typeof(window));
  v = "function" === typeof importScripts;
  aa = "object" === (typeof process === "undefined" ? "undefined" : _typeof(process)) && "function" === typeof require && !u && !v;
  ba = !u && !aa && !v;
  var w = "";

  function ca(a) {
    return c.locateFile ? c.locateFile(a, w) : w + a;
  }

  if (aa) {
    w = __dirname + "/";
    var da, ea;

    c.read = function (a, b) {
      da || (da = require("fs"));
      ea || (ea = require("path"));
      a = ea.normalize(a);
      a = da.readFileSync(a);
      return b ? a : a.toString();
    };

    c.readBinary = function (a) {
      a = c.read(a, !0);
      a.buffer || (a = new Uint8Array(a));
      assert(a.buffer);
      return a;
    };

    1 < process.argv.length && (c.thisProgram = process.argv[1].replace(/\\/g, "/"));
    c.arguments = process.argv.slice(2);
    process.on("uncaughtException", function (a) {
      throw a;
    });
    process.on("unhandledRejection", function () {
      process.exit(1);
    });

    c.quit = function (a) {
      process.exit(a);
    };

    c.inspect = function () {
      return "[Emscripten Module object]";
    };
  } else if (ba) "undefined" != typeof read && (c.read = function (a) {
    return read(a);
  }), c.readBinary = function (a) {
    if ("function" === typeof readbuffer) return new Uint8Array(readbuffer(a));
    a = read(a, "binary");
    assert("object" === _typeof(a));
    return a;
  }, "undefined" != typeof scriptArgs ? c.arguments = scriptArgs : "undefined" != typeof arguments && (c.arguments = arguments), "function" === typeof quit && (c.quit = function (a) {
    quit(a);
  });else if (u || v) {
    if (u) {
      var fa = this._currentScript || document.currentScript;
      0 !== fa.src.indexOf("blob:") && (w = fa.src.split("/").slice(0, -1).join("/") + "/");
    } else v && (w = self.location.href.split("/").slice(0, -1).join("/") + "/");

    c.read = function (a) {
      var b = new XMLHttpRequest();
      b.open("GET", a, !1);
      b.send(null);
      return b.responseText;
    };

    v && (c.readBinary = function (a) {
      var b = new XMLHttpRequest();
      b.open("GET", a, !1);
      b.responseType = "arraybuffer";
      b.send(null);
      return new Uint8Array(b.response);
    });

    c.readAsync = function (a, b, d) {
      var e = new XMLHttpRequest();
      e.open("GET", a, !0);
      e.responseType = "arraybuffer";

      e.onload = function () {
        200 == e.status || 0 == e.status && e.response ? b(e.response) : d();
      };

      e.onerror = d;
      e.send(null);
    };

    c.setWindowTitle = function (a) {
      document.title = a;
    };
  }

  var ha = c.print || ("undefined" !== typeof console ? console.log.bind(console) : "undefined" !== typeof print ? print : null),
      x = c.printErr || ("undefined" !== typeof printErr ? printErr : "undefined" !== typeof console && console.warn.bind(console) || ha);

  for (r in n) {
    n.hasOwnProperty(r) && (c[r] = n[r]);
  }

  n = void 0;

  function ia(a) {
    var b;
    b || (b = 16);
    return Math.ceil(a / b) * b;
  }

  var ja = {
    "f64-rem": function f64Rem(a, b) {
      return a % b;
    },
    "debugger": function _debugger() {
      debugger;
    }
  },
      ka = 0;

  function assert(a, b) {
    a || y("Assertion failed: " + b);
  }

  var la = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
  "undefined" !== typeof TextDecoder && new TextDecoder("utf-16le");
  var buffer, ma, z, na, oa, A, B, pa, qa;

  function ra() {
    c.HEAP8 = ma = new Int8Array(buffer);
    c.HEAP16 = na = new Int16Array(buffer);
    c.HEAP32 = A = new Int32Array(buffer);
    c.HEAPU8 = z = new Uint8Array(buffer);
    c.HEAPU16 = oa = new Uint16Array(buffer);
    c.HEAPU32 = B = new Uint32Array(buffer);
    c.HEAPF32 = pa = new Float32Array(buffer);
    c.HEAPF64 = qa = new Float64Array(buffer);
  }

  var sa, C, ta, ua, va, wa, xa;
  sa = C = ta = ua = va = wa = xa = 0;

  function ya() {
    y("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + E + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
  }

  var za = c.TOTAL_STACK || 5242880,
      E = c.TOTAL_MEMORY || 16777216;
  E < za && x("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + E + "! (TOTAL_STACK=" + za + ")");
  c.buffer ? buffer = c.buffer : ("object" === (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) && "function" === typeof WebAssembly.Memory ? (c.wasmMemory = new WebAssembly.Memory({
    initial: E / 65536,
    maximum: E / 65536
  }), buffer = c.wasmMemory.buffer) : buffer = new ArrayBuffer(E), c.buffer = buffer);
  ra();

  function Aa(a) {
    for (; 0 < a.length;) {
      var b = a.shift();
      if ("function" == typeof b) b();else {
        var d = b.B;
        "number" === typeof d ? void 0 === b.F ? c.dynCall_v(d) : c.dynCall_vi(d, b.F) : d(void 0 === b.F ? null : b.F);
      }
    }
  }

  var Ba = [],
      Ca = [],
      Da = [],
      Ea = [],
      Fa = !1;

  function Ga() {
    var a = c.preRun.shift();
    Ba.unshift(a);
  }

  var Ha = Math.cos,
      Ia = Math.sin,
      F = 0,
      Ja = null,
      G = null;
  c.preloadedImages = {};
  c.preloadedAudios = {};

  function Ka(a) {
    return String.prototype.startsWith ? a.startsWith("data:application/octet-stream;base64,") : 0 === a.indexOf("data:application/octet-stream;base64,");
  }

  (function () {
    function a() {
      try {
        if (c.wasmBinary) return new Uint8Array(c.wasmBinary);
        if (c.readBinary) return c.readBinary(f);
        throw "both async and sync fetching of the wasm failed";
      } catch (g) {
        y(g);
      }
    }

    function b() {
      return c.wasmBinary || !u && !v || "function" !== typeof fetch ? new Promise(function (b) {
        b(a());
      }) : fetch(f, {
        credentials: "same-origin"
      }).then(function (a) {
        if (!a.ok) throw "failed to load wasm binary file at '" + f + "'";
        return a.arrayBuffer();
      }).catch(function () {
        return a();
      });
    }

    function d(a) {
      function d(a) {
        k = a.exports;

        if (k.memory) {
          a = k.memory;
          var b = c.buffer;
          a.byteLength < b.byteLength && x("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
          b = new Int8Array(b);
          new Int8Array(a).set(b);
          c.buffer = buffer = a;
          ra();
        }

        c.asm = k;
        c.usingWasm = !0;
        F--;
        c.monitorRunDependencies && c.monitorRunDependencies(F);
        0 == F && (null !== Ja && (clearInterval(Ja), Ja = null), G && (a = G, G = null, a()));
      }

      function e(a) {
        d(a.instance);
      }

      function g(a) {
        b().then(function (a) {
          return WebAssembly.instantiate(a, h);
        }).then(a).catch(function (a) {
          x("failed to asynchronously prepare wasm: " + a);
          y(a);
        });
      }

      if ("object" !== (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly))) return x("no native wasm support detected"), !1;
      if (!(c.wasmMemory instanceof WebAssembly.Memory)) return x("no native wasm Memory in use"), !1;
      a.memory = c.wasmMemory;
      h.global = {
        NaN: NaN,
        Infinity: Infinity
      };
      h["global.Math"] = Math;
      h.env = a;
      F++;
      c.monitorRunDependencies && c.monitorRunDependencies(F);
      if (c.instantiateWasm) try {
        return c.instantiateWasm(h, d);
      } catch (vb) {
        return x("Module.instantiateWasm callback failed with error: " + vb), !1;
      }
      c.wasmBinary || "function" !== typeof WebAssembly.instantiateStreaming || Ka(f) || "function" !== typeof fetch ? g(e) : WebAssembly.instantiateStreaming(fetch(f, {
        credentials: "same-origin"
      }), h).then(e).catch(function (a) {
        x("wasm streaming compile failed: " + a);
        x("falling back to ArrayBuffer instantiation");
        g(e);
      });
      return {};
    }

    var e = "aubio.wast",
        f = "aubio.wasm",
        l = "aubio.temp.asm.js";
    Ka(e) || (e = ca(e));
    Ka(f) || (f = ca(f));
    Ka(l) || (l = ca(l));
    var h = {
      global: null,
      env: null,
      asm2wasm: ja,
      parent: c
    },
        k = null;
    c.asmPreload = c.asm;
    var m = c.reallocBuffer;

    c.reallocBuffer = function (a) {
      if ("asmjs" === p) var b = m(a);else a: {
        var d = c.usingWasm ? 65536 : 16777216;
        0 < a % d && (a += d - a % d);
        d = c.buffer.byteLength;
        if (c.usingWasm) try {
          b = -1 !== c.wasmMemory.grow((a - d) / 65536) ? c.buffer = c.wasmMemory.buffer : null;
          break a;
        } catch (t) {
          b = null;
          break a;
        }
        b = void 0;
      }
      return b;
    };

    var p = "";

    c.asm = function (a, b) {
      if (!b.table) {
        a = c.wasmTableSize;
        void 0 === a && (a = 1024);
        var e = c.wasmMaxTableSize;
        b.table = "object" === (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) && "function" === typeof WebAssembly.Table ? void 0 !== e ? new WebAssembly.Table({
          initial: a,
          maximum: e,
          element: "anyfunc"
        }) : new WebAssembly.Table({
          initial: a,
          element: "anyfunc"
        }) : Array(a);
        c.wasmTable = b.table;
      }

      b.memoryBase || (b.memoryBase = c.STATIC_BASE);
      b.tableBase || (b.tableBase = 0);
      b = d(b);
      assert(b, "no binaryen method succeeded.");
      return b;
    };
  })();

  sa = 1024;
  C = sa + 9312;
  Ca.push({
    B: function B() {
      La();
    }
  }, {
    B: function B() {
      Ma();
    }
  }, {
    B: function B() {
      Na();
    }
  }, {
    B: function B() {
      Oa();
    }
  });
  c.STATIC_BASE = sa;
  c.STATIC_BUMP = 9312;
  C += 16;
  var H = 0;

  function I() {
    H += 4;
    return A[H - 4 >> 2];
  }

  var Pa = {};

  function J(a, b) {
    H = b;

    try {
      var d = I(),
          e = I(),
          f = I();
      a = 0;
      J.J || (J.J = [null, [], []], J.P = function (a, b) {
        var d = J.J[a];
        assert(d);

        if (0 === b || 10 === b) {
          a = 1 === a ? ha : x;

          a: {
            for (var e = b = 0; d[e];) {
              ++e;
            }

            if (16 < e - b && d.subarray && la) b = la.decode(d.subarray(b, e));else for (e = "";;) {
              var f = d[b++];

              if (!f) {
                b = e;
                break a;
              }

              if (f & 128) {
                var k = d[b++] & 63;
                if (192 == (f & 224)) e += String.fromCharCode((f & 31) << 6 | k);else {
                  var l = d[b++] & 63;
                  if (224 == (f & 240)) f = (f & 15) << 12 | k << 6 | l;else {
                    var h = d[b++] & 63;
                    if (240 == (f & 248)) f = (f & 7) << 18 | k << 12 | l << 6 | h;else {
                      var bb = d[b++] & 63;
                      if (248 == (f & 252)) f = (f & 3) << 24 | k << 18 | l << 12 | h << 6 | bb;else {
                        var m = d[b++] & 63;
                        f = (f & 1) << 30 | k << 24 | l << 18 | h << 12 | bb << 6 | m;
                      }
                    }
                  }
                  65536 > f ? e += String.fromCharCode(f) : (f -= 65536, e += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023));
                }
              } else e += String.fromCharCode(f);
            }
          }

          a(b);
          d.length = 0;
        } else d.push(b);
      });

      for (b = 0; b < f; b++) {
        for (var l = A[e + 8 * b >> 2], h = A[e + (8 * b + 4) >> 2], k = 0; k < h; k++) {
          J.P(d, z[l + k]);
        }

        a += h;
      }

      return a;
    } catch (m) {
      return "undefined" !== typeof FS && m instanceof FS.I || y(m), -m.L;
    }
  }

  function Qa(a) {
    switch (a) {
      case 1:
        return 0;

      case 2:
        return 1;

      case 4:
        return 2;

      case 8:
        return 3;

      default:
        throw new TypeError("Unknown type size: " + a);
    }
  }

  var Ra = void 0;

  function K(a) {
    for (var b = ""; z[a];) {
      b += Ra[z[a++]];
    }

    return b;
  }

  var L = {},
      M = {},
      Sa = {};

  function Ta(a) {
    if (void 0 === a) return "_unknown";
    a = a.replace(/[^a-zA-Z0-9_]/g, "$");
    var b = a.charCodeAt(0);
    return 48 <= b && 57 >= b ? "_" + a : a;
  }

  function Ua(a, b) {
    a = Ta(a);
    return new Function("body", "return function " + a + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(b);
  }

  function Va(a) {
    var b = Error,
        d = Ua(a, function (b) {
      this.name = a;
      this.message = b;
      b = Error(b).stack;
      void 0 !== b && (this.stack = this.toString() + "\n" + b.replace(/^Error(:[^\n]*)?\n/, ""));
    });
    d.prototype = Object.create(b.prototype);
    d.prototype.constructor = d;

    d.prototype.toString = function () {
      return void 0 === this.message ? this.name : this.name + ": " + this.message;
    };

    return d;
  }

  var O = void 0;

  function P(a) {
    throw new O(a);
  }

  var Wa = void 0;

  function Xa(a) {
    throw new Wa(a);
  }

  function Ya(a, b, d) {
    function e(b) {
      b = d(b);
      b.length !== a.length && Xa("Mismatched type converter count");

      for (var e = 0; e < a.length; ++e) {
        Q(a[e], b[e]);
      }
    }

    a.forEach(function (a) {
      Sa[a] = b;
    });
    var f = Array(b.length),
        l = [],
        h = 0;
    b.forEach(function (a, b) {
      M.hasOwnProperty(a) ? f[b] = M[a] : (l.push(a), L.hasOwnProperty(a) || (L[a] = []), L[a].push(function () {
        f[b] = M[a];
        ++h;
        h === l.length && e(f);
      }));
    });
    0 === l.length && e(f);
  }

  function Q(a, b, d) {
    d = d || {};
    if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
    var e = b.name;
    a || P('type "' + e + '" must have a positive integer typeid pointer');

    if (M.hasOwnProperty(a)) {
      if (d.X) return;
      P("Cannot register type '" + e + "' twice");
    }

    M[a] = b;
    delete Sa[a];
    L.hasOwnProperty(a) && (b = L[a], delete L[a], b.forEach(function (a) {
      a();
    }));
  }

  function Za(a) {
    P(a.a.f.b.name + " instance already deleted");
  }

  var $a = void 0,
      ab = [];

  function cb() {
    for (; ab.length;) {
      var a = ab.pop();
      a.a.s = !1;
      a["delete"]();
    }
  }

  function R() {}

  var db = {};

  function eb(a, b, d) {
    if (void 0 === a[b].j) {
      var e = a[b];

      a[b] = function () {
        a[b].j.hasOwnProperty(arguments.length) || P("Function '" + d + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + a[b].j + ")!");
        return a[b].j[arguments.length].apply(this, arguments);
      };

      a[b].j = [];
      a[b].j[e.A] = e;
    }
  }

  function fb(a, b) {
    c.hasOwnProperty(a) ? (P("Cannot register public name '" + a + "' twice"), eb(c, a, a), c.hasOwnProperty(void 0) && P("Cannot register multiple overloads of a function with the same number of arguments (undefined)!"), c[a].j[void 0] = b) : c[a] = b;
  }

  function gb(a, b, d, e, f, l, h, k) {
    this.name = a;
    this.constructor = b;
    this.u = d;
    this.o = e;
    this.i = f;
    this.T = l;
    this.w = h;
    this.S = k;
    this.Z = [];
  }

  function hb(a, b, d) {
    for (; b !== d;) {
      b.w || P("Expected null or instance of " + d.name + ", got an instance of " + b.name), a = b.w(a), b = b.i;
    }

    return a;
  }

  function ib(a, b) {
    if (null === b) return this.G && P("null is not a valid " + this.name), 0;
    b.a || P('Cannot pass "' + S(b) + '" as a ' + this.name);
    b.a.c || P("Cannot pass deleted object as a pointer of type " + this.name);
    return hb(b.a.c, b.a.f.b, this.b);
  }

  function jb(a, b) {
    if (null === b) {
      this.G && P("null is not a valid " + this.name);

      if (this.D) {
        var d = this.$();
        null !== a && a.push(this.o, d);
        return d;
      }

      return 0;
    }

    b.a || P('Cannot pass "' + S(b) + '" as a ' + this.name);
    b.a.c || P("Cannot pass deleted object as a pointer of type " + this.name);
    !this.C && b.a.f.C && P("Cannot convert argument of type " + (b.a.h ? b.a.h.name : b.a.f.name) + " to parameter type " + this.name);
    d = hb(b.a.c, b.a.f.b, this.b);
    if (this.D) switch (void 0 === b.a.g && P("Passing raw pointer to smart pointer is illegal"), this.ba) {
      case 0:
        b.a.h === this ? d = b.a.g : P("Cannot convert argument of type " + (b.a.h ? b.a.h.name : b.a.f.name) + " to parameter type " + this.name);
        break;

      case 1:
        d = b.a.g;
        break;

      case 2:
        if (b.a.h === this) d = b.a.g;else {
          var e = b.clone();
          d = this.aa(d, T(function () {
            e["delete"]();
          }));
          null !== a && a.push(this.o, d);
        }
        break;

      default:
        P("Unsupporting sharing policy");
    }
    return d;
  }

  function kb(a, b) {
    if (null === b) return this.G && P("null is not a valid " + this.name), 0;
    b.a || P('Cannot pass "' + S(b) + '" as a ' + this.name);
    b.a.c || P("Cannot pass deleted object as a pointer of type " + this.name);
    b.a.f.C && P("Cannot convert argument of type " + b.a.f.name + " to parameter type " + this.name);
    return hb(b.a.c, b.a.f.b, this.b);
  }

  function lb(a) {
    return this.fromWireType(B[a >> 2]);
  }

  function ob(a, b, d) {
    if (b === d) return a;
    if (void 0 === d.i) return null;
    a = ob(a, b, d.i);
    return null === a ? null : d.S(a);
  }

  var pb = {};

  function qb(a, b) {
    for (void 0 === b && P("ptr should not be undefined"); a.i;) {
      b = a.w(b), a = a.i;
    }

    return pb[b];
  }

  function rb(a, b) {
    b.f && b.c || Xa("makeClassHandle requires ptr and ptrType");
    !!b.h !== !!b.g && Xa("Both smartPtrType and smartPtr must be specified");
    b.count = {
      value: 1
    };
    return Object.create(a, {
      a: {
        value: b
      }
    });
  }

  function U(a, b, d, e, f, l, h, k, m, p, g) {
    this.name = a;
    this.b = b;
    this.G = d;
    this.C = e;
    this.D = f;
    this.Y = l;
    this.ba = h;
    this.M = k;
    this.$ = m;
    this.aa = p;
    this.o = g;
    f || void 0 !== b.i ? this.toWireType = jb : (this.toWireType = e ? ib : kb, this.l = null);
  }

  function sb(a, b) {
    c.hasOwnProperty(a) || Xa("Replacing nonexistant public symbol");
    c[a] = b;
    c[a].A = void 0;
  }

  function V(a, b) {
    a = K(a);
    if (void 0 !== c["FUNCTION_TABLE_" + a]) var d = c["FUNCTION_TABLE_" + a][b];else if ("undefined" !== typeof FUNCTION_TABLE) d = FUNCTION_TABLE[b];else {
      d = c.asm["dynCall_" + a];
      void 0 === d && (d = c.asm["dynCall_" + a.replace(/f/g, "d")], void 0 === d && P("No dynCall invoker for signature: " + a));

      for (var e = [], f = 1; f < a.length; ++f) {
        e.push("a" + f);
      }

      f = "return function " + ("dynCall_" + a + "_" + b) + "(" + e.join(", ") + ") {\n";
      f += "    return dynCall(rawFunction" + (e.length ? ", " : "") + e.join(", ") + ");\n";
      d = new Function("dynCall", "rawFunction", f + "};\n")(d, b);
    }
    "function" !== typeof d && P("unknown function pointer with signature " + a + ": " + b);
    return d;
  }

  var tb = void 0;

  function ub(a) {
    a = wb(a);
    var b = K(a);
    X(a);
    return b;
  }

  function xb(a, b) {
    function d(a) {
      f[a] || M[a] || (Sa[a] ? Sa[a].forEach(d) : (e.push(a), f[a] = !0));
    }

    var e = [],
        f = {};
    b.forEach(d);
    throw new tb(a + ": " + e.map(ub).join([", "]));
  }

  function yb(a, b) {
    for (var d = [], e = 0; e < a; e++) {
      d.push(A[(b >> 2) + e]);
    }

    return d;
  }

  function zb(a) {
    for (; a.length;) {
      var b = a.pop();
      a.pop()(b);
    }
  }

  function Ab(a) {
    var b = Function;
    if (!(b instanceof Function)) throw new TypeError("new_ called with constructor type " + _typeof(b) + " which is not a function");
    var d = Ua(b.name || "unknownFunctionName", function () {});
    d.prototype = b.prototype;
    d = new d();
    a = b.apply(d, a);
    return a instanceof Object ? a : d;
  }

  var Bb = [],
      Y = [{}, {
    value: void 0
  }, {
    value: null
  }, {
    value: !0
  }, {
    value: !1
  }];

  function Cb(a) {
    4 < a && 0 === --Y[a].H && (Y[a] = void 0, Bb.push(a));
  }

  function T(a) {
    switch (a) {
      case void 0:
        return 1;

      case null:
        return 2;

      case !0:
        return 3;

      case !1:
        return 4;

      default:
        var b = Bb.length ? Bb.pop() : Y.length;
        Y[b] = {
          H: 1,
          value: a
        };
        return b;
    }
  }

  function S(a) {
    if (null === a) return "null";

    var b = _typeof(a);

    return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
  }

  function Db(a, b) {
    switch (b) {
      case 2:
        return function (a) {
          return this.fromWireType(pa[a >> 2]);
        };

      case 3:
        return function (a) {
          return this.fromWireType(qa[a >> 3]);
        };

      default:
        throw new TypeError("Unknown float type: " + a);
    }
  }

  function Eb(a, b, d) {
    switch (b) {
      case 0:
        return d ? function (a) {
          return ma[a];
        } : function (a) {
          return z[a];
        };

      case 1:
        return d ? function (a) {
          return na[a >> 1];
        } : function (a) {
          return oa[a >> 1];
        };

      case 2:
        return d ? function (a) {
          return A[a >> 2];
        } : function (a) {
          return B[a >> 2];
        };

      default:
        throw new TypeError("Unknown integer type: " + a);
    }
  }

  function Z(a) {
    a || P("Cannot use deleted val. handle = " + a);
    return Y[a].value;
  }

  function Fb(a, b) {
    var d = M[a];
    void 0 === d && P(b + " has unknown type " + ub(a));
    return d;
  }

  for (var Gb = {}, Hb = Array(256), Ib = 0; 256 > Ib; ++Ib) {
    Hb[Ib] = String.fromCharCode(Ib);
  }

  Ra = Hb;
  O = c.BindingError = Va("BindingError");
  Wa = c.InternalError = Va("InternalError");

  R.prototype.isAliasOf = function (a) {
    if (!(this instanceof R && a instanceof R)) return !1;
    var b = this.a.f.b,
        d = this.a.c,
        e = a.a.f.b;

    for (a = a.a.c; b.i;) {
      d = b.w(d), b = b.i;
    }

    for (; e.i;) {
      a = e.w(a), e = e.i;
    }

    return b === e && d === a;
  };

  R.prototype.clone = function () {
    this.a.c || Za(this);
    if (this.a.v) return this.a.count.value += 1, this;
    var a = this.a;
    a = Object.create(Object.getPrototypeOf(this), {
      a: {
        value: {
          count: a.count,
          s: a.s,
          v: a.v,
          c: a.c,
          f: a.f,
          g: a.g,
          h: a.h
        }
      }
    });
    a.a.count.value += 1;
    a.a.s = !1;
    return a;
  };

  R.prototype["delete"] = function () {
    this.a.c || Za(this);
    this.a.s && !this.a.v && P("Object already scheduled for deletion");
    --this.a.count.value;

    if (0 === this.a.count.value) {
      var a = this.a;
      a.g ? a.h.o(a.g) : a.f.b.o(a.c);
    }

    this.a.v || (this.a.g = void 0, this.a.c = void 0);
  };

  R.prototype.isDeleted = function () {
    return !this.a.c;
  };

  R.prototype.deleteLater = function () {
    this.a.c || Za(this);
    this.a.s && !this.a.v && P("Object already scheduled for deletion");
    ab.push(this);
    1 === ab.length && $a && $a(cb);
    this.a.s = !0;
    return this;
  };

  U.prototype.U = function (a) {
    this.M && (a = this.M(a));
    return a;
  };

  U.prototype.K = function (a) {
    this.o && this.o(a);
  };

  U.prototype.argPackAdvance = 8;
  U.prototype.readValueFromPointer = lb;

  U.prototype.deleteObject = function (a) {
    if (null !== a) a["delete"]();
  };

  U.prototype.fromWireType = function (a) {
    function b() {
      return this.D ? rb(this.b.u, {
        f: this.Y,
        c: d,
        h: this,
        g: a
      }) : rb(this.b.u, {
        f: this,
        c: a
      });
    }

    var d = this.U(a);
    if (!d) return this.K(a), null;
    var e = qb(this.b, d);

    if (void 0 !== e) {
      if (0 === e.a.count.value) return e.a.c = d, e.a.g = a, e.clone();
      e = e.clone();
      this.K(a);
      return e;
    }

    e = this.b.T(d);
    e = db[e];
    if (!e) return b.call(this);
    e = this.C ? e.R : e.pointerType;
    var f = ob(d, this.b, e.b);
    return null === f ? b.call(this) : this.D ? rb(e.b.u, {
      f: e,
      c: f,
      h: this,
      g: a
    }) : rb(e.b.u, {
      f: e,
      c: f
    });
  };

  c.getInheritedInstanceCount = function () {
    return Object.keys(pb).length;
  };

  c.getLiveInheritedInstances = function () {
    var a = [],
        b;

    for (b in pb) {
      pb.hasOwnProperty(b) && a.push(pb[b]);
    }

    return a;
  };

  c.flushPendingDeletes = cb;

  c.setDelayFunction = function (a) {
    $a = a;
    ab.length && $a && $a(cb);
  };

  tb = c.UnboundTypeError = Va("UnboundTypeError");

  c.count_emval_handles = function () {
    for (var a = 0, b = 5; b < Y.length; ++b) {
      void 0 !== Y[b] && ++a;
    }

    return a;
  };

  c.get_first_emval = function () {
    for (var a = 5; a < Y.length; ++a) {
      if (void 0 !== Y[a]) return Y[a];
    }

    return null;
  };

  var Jb = C;
  C = C + 4 + 15 & -16;
  xa = Jb;
  ta = ua = ia(C);
  va = ta + za;
  wa = ia(va);
  A[xa >> 2] = wa;
  c.wasmTableSize = 83;
  c.wasmMaxTableSize = 83;
  c.N = {};
  c.O = {
    abort: y,
    enlargeMemory: function enlargeMemory() {
      ya();
    },
    getTotalMemory: function getTotalMemory() {
      return E;
    },
    abortOnCannotGrowMemory: ya,
    ___setErrNo: function ___setErrNo(a) {
      c.___errno_location && (A[c.___errno_location() >> 2] = a);
      return a;
    },
    ___syscall140: function ___syscall140(a, b) {
      H = b;

      try {
        var d = Pa.V();
        I();
        var e = I(),
            f = I(),
            l = I();
        FS.ea(d, e, l);
        A[f >> 2] = d.position;
        d.W && 0 === e && 0 === l && (d.W = null);
        return 0;
      } catch (h) {
        return "undefined" !== typeof FS && h instanceof FS.I || y(h), -h.L;
      }
    },
    ___syscall146: J,
    ___syscall54: function ___syscall54(a, b) {
      H = b;
      return 0;
    },
    ___syscall6: function ___syscall6(a, b) {
      H = b;

      try {
        var d = Pa.V();
        FS.close(d);
        return 0;
      } catch (e) {
        return "undefined" !== typeof FS && e instanceof FS.I || y(e), -e.L;
      }
    },
    __embind_register_bool: function __embind_register_bool(a, b, d, e, f) {
      var l = Qa(d);
      b = K(b);
      Q(a, {
        name: b,
        fromWireType: function fromWireType(a) {
          return !!a;
        },
        toWireType: function toWireType(a, b) {
          return b ? e : f;
        },
        argPackAdvance: 8,
        readValueFromPointer: function readValueFromPointer(a) {
          if (1 === d) var e = ma;else if (2 === d) e = na;else if (4 === d) e = A;else throw new TypeError("Unknown boolean type size: " + b);
          return this.fromWireType(e[a >> l]);
        },
        l: null
      });
    },
    __embind_register_class: function __embind_register_class(a, b, d, e, f, l, h, k, m, p, g, q, D) {
      g = K(g);
      l = V(f, l);
      k && (k = V(h, k));
      p && (p = V(m, p));
      D = V(q, D);
      var t = Ta(g);
      fb(t, function () {
        xb("Cannot construct " + g + " due to unbound types", [e]);
      });
      Ya([a, b, d], e ? [e] : [], function (b) {
        b = b[0];

        if (e) {
          var d = b.b;
          var f = d.u;
        } else f = R.prototype;

        b = Ua(t, function () {
          if (Object.getPrototypeOf(this) !== h) throw new O("Use 'new' to construct " + g);
          if (void 0 === m.m) throw new O(g + " has no accessible constructor");
          var a = m.m[arguments.length];
          if (void 0 === a) throw new O("Tried to invoke ctor of " + g + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(m.m).toString() + ") parameters instead!");
          return a.apply(this, arguments);
        });
        var h = Object.create(f, {
          constructor: {
            value: b
          }
        });
        b.prototype = h;
        var m = new gb(g, b, h, D, d, l, k, p);
        d = new U(g, m, !0, !1, !1);
        f = new U(g + "*", m, !1, !1, !1);
        var q = new U(g + " const*", m, !1, !0, !1);
        db[a] = {
          pointerType: f,
          R: q
        };
        sb(t, b);
        return [d, f, q];
      });
    },
    __embind_register_class_constructor: function __embind_register_class_constructor(a, b, d, e, f, l) {
      var h = yb(b, d);
      f = V(e, f);
      Ya([], [a], function (a) {
        a = a[0];
        var d = "constructor " + a.name;
        void 0 === a.b.m && (a.b.m = []);
        if (void 0 !== a.b.m[b - 1]) throw new O("Cannot register multiple constructors with identical number of parameters (" + (b - 1) + ") for class '" + a.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");

        a.b.m[b - 1] = function () {
          xb("Cannot construct " + a.name + " due to unbound types", h);
        };

        Ya([], h, function (e) {
          a.b.m[b - 1] = function () {
            arguments.length !== b - 1 && P(d + " called with " + arguments.length + " arguments, expected " + (b - 1));
            var a = [],
                h = Array(b);
            h[0] = l;

            for (var k = 1; k < b; ++k) {
              h[k] = e[k].toWireType(a, arguments[k - 1]);
            }

            h = f.apply(null, h);
            zb(a);
            return e[0].fromWireType(h);
          };

          return [];
        });
        return [];
      });
    },
    __embind_register_class_function: function __embind_register_class_function(a, b, d, e, f, l, h, k) {
      var m = yb(d, e);
      b = K(b);
      l = V(f, l);
      Ya([], [a], function (a) {
        function e() {
          xb("Cannot call " + f + " due to unbound types", m);
        }

        a = a[0];
        var f = a.name + "." + b;
        k && a.b.Z.push(b);
        var p = a.b.u,
            t = p[b];
        void 0 === t || void 0 === t.j && t.className !== a.name && t.A === d - 2 ? (e.A = d - 2, e.className = a.name, p[b] = e) : (eb(p, b, f), p[b].j[d - 2] = e);
        Ya([], m, function (e) {
          var k = f,
              g = a,
              m = l,
              q = e.length;
          2 > q && P("argTypes array size mismatch! Must at least get return value and 'this' types!");
          var t = null !== e[1] && null !== g,
              D = !1;

          for (g = 1; g < e.length; ++g) {
            if (null !== e[g] && void 0 === e[g].l) {
              D = !0;
              break;
            }
          }

          var mb = "void" !== e[0].name,
              N = "",
              W = "";

          for (g = 0; g < q - 2; ++g) {
            N += (0 !== g ? ", " : "") + "arg" + g, W += (0 !== g ? ", " : "") + "arg" + g + "Wired";
          }

          k = "return function " + Ta(k) + "(" + N + ") {\nif (arguments.length !== " + (q - 2) + ") {\nthrowBindingError('function " + k + " called with ' + arguments.length + ' arguments, expected " + (q - 2) + " args!');\n}\n";
          D && (k += "var destructors = [];\n");
          var nb = D ? "destructors" : "null";
          N = "throwBindingError invoker fn runDestructors retType classParam".split(" ");
          m = [P, m, h, zb, e[0], e[1]];
          t && (k += "var thisWired = classParam.toWireType(" + nb + ", this);\n");

          for (g = 0; g < q - 2; ++g) {
            k += "var arg" + g + "Wired = argType" + g + ".toWireType(" + nb + ", arg" + g + "); // " + e[g + 2].name + "\n", N.push("argType" + g), m.push(e[g + 2]);
          }

          t && (W = "thisWired" + (0 < W.length ? ", " : "") + W);
          k += (mb ? "var rv = " : "") + "invoker(fn" + (0 < W.length ? ", " : "") + W + ");\n";
          if (D) k += "runDestructors(destructors);\n";else for (g = t ? 1 : 2; g < e.length; ++g) {
            q = 1 === g ? "thisWired" : "arg" + (g - 2) + "Wired", null !== e[g].l && (k += q + "_dtor(" + q + "); // " + e[g].name + "\n", N.push(q + "_dtor"), m.push(e[g].l));
          }
          mb && (k += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
          N.push(k + "}\n");
          e = Ab(N).apply(null, m);
          void 0 === p[b].j ? (e.A = d - 2, p[b] = e) : p[b].j[d - 2] = e;
          return [];
        });
        return [];
      });
    },
    __embind_register_emval: function __embind_register_emval(a, b) {
      b = K(b);
      Q(a, {
        name: b,
        fromWireType: function fromWireType(a) {
          var b = Y[a].value;
          Cb(a);
          return b;
        },
        toWireType: function toWireType(a, b) {
          return T(b);
        },
        argPackAdvance: 8,
        readValueFromPointer: lb,
        l: null
      });
    },
    __embind_register_float: function __embind_register_float(a, b, d) {
      d = Qa(d);
      b = K(b);
      Q(a, {
        name: b,
        fromWireType: function fromWireType(a) {
          return a;
        },
        toWireType: function toWireType(a, b) {
          if ("number" !== typeof b && "boolean" !== typeof b) throw new TypeError('Cannot convert "' + S(b) + '" to ' + this.name);
          return b;
        },
        argPackAdvance: 8,
        readValueFromPointer: Db(b, d),
        l: null
      });
    },
    __embind_register_integer: function __embind_register_integer(a, b, d, e, f) {
      function l(a) {
        return a;
      }

      b = K(b);
      -1 === f && (f = 4294967295);
      var h = Qa(d);

      if (0 === e) {
        var k = 32 - 8 * d;

        l = function l(a) {
          return a << k >>> k;
        };
      }

      var m = -1 != b.indexOf("unsigned");
      Q(a, {
        name: b,
        fromWireType: l,
        toWireType: function toWireType(a, d) {
          if ("number" !== typeof d && "boolean" !== typeof d) throw new TypeError('Cannot convert "' + S(d) + '" to ' + this.name);
          if (d < e || d > f) throw new TypeError('Passing a number "' + S(d) + '" from JS side to C/C++ side to an argument of type "' + b + '", which is outside the valid range [' + e + ", " + f + "]!");
          return m ? d >>> 0 : d | 0;
        },
        argPackAdvance: 8,
        readValueFromPointer: Eb(b, h, 0 !== e),
        l: null
      });
    },
    __embind_register_memory_view: function __embind_register_memory_view(a, b, d) {
      function e(a) {
        a >>= 2;
        var b = B;
        return new f(b.buffer, b[a + 1], b[a]);
      }

      var f = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][b];
      d = K(d);
      Q(a, {
        name: d,
        fromWireType: e,
        argPackAdvance: 8,
        readValueFromPointer: e
      }, {
        X: !0
      });
    },
    __embind_register_std_string: function __embind_register_std_string(a, b) {
      b = K(b);
      Q(a, {
        name: b,
        fromWireType: function fromWireType(a) {
          for (var b = B[a >> 2], d = Array(b), l = 0; l < b; ++l) {
            d[l] = String.fromCharCode(z[a + 4 + l]);
          }

          X(a);
          return d.join("");
        },
        toWireType: function toWireType(a, b) {
          function d(a, b) {
            return a[b];
          }

          function e(a, b) {
            return a.charCodeAt(b);
          }

          b instanceof ArrayBuffer && (b = new Uint8Array(b));
          var h;
          b instanceof Uint8Array ? h = d : b instanceof Uint8ClampedArray ? h = d : b instanceof Int8Array ? h = d : "string" === typeof b ? h = e : P("Cannot pass non-string to std::string");
          var k = b.length,
              m = Kb(4 + k);
          B[m >> 2] = k;

          for (var p = 0; p < k; ++p) {
            var g = h(b, p);
            255 < g && (X(m), P("String has UTF-16 code units that do not fit in 8 bits"));
            z[m + 4 + p] = g;
          }

          null !== a && a.push(X, m);
          return m;
        },
        argPackAdvance: 8,
        readValueFromPointer: lb,
        l: function l(a) {
          X(a);
        }
      });
    },
    __embind_register_std_wstring: function __embind_register_std_wstring(a, b, d) {
      d = K(d);

      if (2 === b) {
        var e = function e() {
          return oa;
        };

        var f = 1;
      } else 4 === b && (e = function e() {
        return B;
      }, f = 2);

      Q(a, {
        name: d,
        fromWireType: function fromWireType(a) {
          for (var b = e(), d = B[a >> 2], l = Array(d), p = a + 4 >> f, g = 0; g < d; ++g) {
            l[g] = String.fromCharCode(b[p + g]);
          }

          X(a);
          return l.join("");
        },
        toWireType: function toWireType(a, d) {
          var k = e(),
              h = d.length,
              l = Kb(4 + h * b);
          B[l >> 2] = h;

          for (var g = l + 4 >> f, q = 0; q < h; ++q) {
            k[g + q] = d.charCodeAt(q);
          }

          null !== a && a.push(X, l);
          return l;
        },
        argPackAdvance: 8,
        readValueFromPointer: lb,
        l: function l(a) {
          X(a);
        }
      });
    },
    __embind_register_void: function __embind_register_void(a, b) {
      b = K(b);
      Q(a, {
        da: !0,
        name: b,
        argPackAdvance: 0,
        fromWireType: function fromWireType() {},
        toWireType: function toWireType() {}
      });
    },
    __emval_as: function __emval_as(a, b, d) {
      a = Z(a);
      b = Fb(b, "emval::as");
      var e = [],
          f = T(e);
      A[d >> 2] = f;
      return b.toWireType(e, a);
    },
    __emval_decref: Cb,
    __emval_get_property: function __emval_get_property(a, b) {
      a = Z(a);
      b = Z(b);
      return T(a[b]);
    },
    __emval_incref: function __emval_incref(a) {
      4 < a && (Y[a].H += 1);
    },
    __emval_new_array: function __emval_new_array() {
      return T([]);
    },
    __emval_new_cstring: function __emval_new_cstring(a) {
      var b = Gb[a];
      return T(void 0 === b ? K(a) : b);
    },
    __emval_new_object: function __emval_new_object() {
      return T({});
    },
    __emval_run_destructors: function __emval_run_destructors(a) {
      zb(Y[a].value);
      Cb(a);
    },
    __emval_set_property: function __emval_set_property(a, b, d) {
      a = Z(a);
      b = Z(b);
      d = Z(d);
      a[b] = d;
    },
    __emval_take_value: function __emval_take_value(a, b) {
      a = Fb(a, "_emval_take_value");
      a = a.readValueFromPointer(b);
      return T(a);
    },
    _abort: function _abort() {
      c.abort();
    },
    _emscripten_memcpy_big: function _emscripten_memcpy_big(a, b, d) {
      z.set(z.subarray(b, b + d), a);
      return a;
    },
    _llvm_cos_f32: Ha,
    _llvm_log10_f32: function _llvm_log10_f32(a) {
      return Math.log(a) / Math.LN10;
    },
    _llvm_sin_f32: Ia,
    DYNAMICTOP_PTR: xa,
    STACKTOP: ua
  };
  var Lb = c.asm(c.N, c.O, buffer);
  c.asm = Lb;

  var Oa = c.__GLOBAL__sub_I_bind_cpp = function () {
    return c.asm.__GLOBAL__sub_I_bind_cpp.apply(null, arguments);
  },
      La = c.__GLOBAL__sub_I_fft_cc = function () {
    return c.asm.__GLOBAL__sub_I_fft_cc.apply(null, arguments);
  },
      Na = c.__GLOBAL__sub_I_pitch_cc = function () {
    return c.asm.__GLOBAL__sub_I_pitch_cc.apply(null, arguments);
  },
      Ma = c.__GLOBAL__sub_I_tempo_cc = function () {
    return c.asm.__GLOBAL__sub_I_tempo_cc.apply(null, arguments);
  },
      wb = c.___getTypeName = function () {
    return c.asm.___getTypeName.apply(null, arguments);
  },
      X = c._free = function () {
    return c.asm._free.apply(null, arguments);
  },
      Kb = c._malloc = function () {
    return c.asm._malloc.apply(null, arguments);
  };

  c.dynCall_ffii = function () {
    return c.asm.dynCall_ffii.apply(null, arguments);
  };

  c.dynCall_fi = function () {
    return c.asm.dynCall_fi.apply(null, arguments);
  };

  c.dynCall_fii = function () {
    return c.asm.dynCall_fii.apply(null, arguments);
  };

  c.dynCall_fiii = function () {
    return c.asm.dynCall_fiii.apply(null, arguments);
  };

  c.dynCall_ii = function () {
    return c.asm.dynCall_ii.apply(null, arguments);
  };

  c.dynCall_iii = function () {
    return c.asm.dynCall_iii.apply(null, arguments);
  };

  c.dynCall_iiii = function () {
    return c.asm.dynCall_iiii.apply(null, arguments);
  };

  c.dynCall_iiiii = function () {
    return c.asm.dynCall_iiiii.apply(null, arguments);
  };

  c.dynCall_iiiiii = function () {
    return c.asm.dynCall_iiiiii.apply(null, arguments);
  };

  c.dynCall_v = function () {
    return c.asm.dynCall_v.apply(null, arguments);
  };

  c.dynCall_vi = function () {
    return c.asm.dynCall_vi.apply(null, arguments);
  };

  c.dynCall_viii = function () {
    return c.asm.dynCall_viii.apply(null, arguments);
  };

  c.asm = Lb;

  c.then = function (a) {
    if (c.calledRun) a(c);else {
      var b = c.onRuntimeInitialized;

      c.onRuntimeInitialized = function () {
        b && b();
        a(c);
      };
    }
    return c;
  };

  G = function Mb() {
    c.calledRun || Nb();
    c.calledRun || (G = Mb);
  };

  function Nb() {
    function a() {
      if (!c.calledRun && (c.calledRun = !0, !ka)) {
        Fa || (Fa = !0, Aa(Ca));
        Aa(Da);
        if (c.onRuntimeInitialized) c.onRuntimeInitialized();
        if (c.postRun) for ("function" == typeof c.postRun && (c.postRun = [c.postRun]); c.postRun.length;) {
          var a = c.postRun.shift();
          Ea.unshift(a);
        }
        Aa(Ea);
      }
    }

    if (!(0 < F)) {
      if (c.preRun) for ("function" == typeof c.preRun && (c.preRun = [c.preRun]); c.preRun.length;) {
        Ga();
      }
      Aa(Ba);
      0 < F || c.calledRun || (c.setStatus ? (c.setStatus("Running..."), setTimeout(function () {
        setTimeout(function () {
          c.setStatus("");
        }, 1);
        a();
      }, 1)) : a());
    }
  }

  c.run = Nb;

  function y(a) {
    if (c.onAbort) c.onAbort(a);
    void 0 !== a ? (ha(a), x(a), a = JSON.stringify(a)) : a = "";
    ka = !0;
    throw "abort(" + a + "). Build with -s ASSERTIONS=1 for more info.";
  }

  c.abort = y;
  if (c.preInit) for ("function" == typeof c.preInit && (c.preInit = [c.preInit]); 0 < c.preInit.length;) {
    c.preInit.pop()();
  }
  c.noExitRuntime = !0;
  Nb();
  return _Aubio;
};

Aubio = Aubio.bind({
  _currentScript: typeof document !== 'undefined' ? document.currentScript : undefined
});
if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = Aubio;else if (typeof define === 'function' && define['amd']) define([], function () {
  return Aubio;
});else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports["Aubio"] = Aubio;
},{"fs":"../node_modules/parcel-bundler/src/builtins/_empty.js","path":"../node_modules/path-browserify/index.js","process":"../node_modules/process/browser.js"}],"js/tuner.js":[function(require,module,exports) {
"use strict";

var _aubio = _interopRequireDefault(require("./aubio.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tuner = function Tuner(a4) {
  this.middleA = a4 || 440;
  this.semitone = 69;
  this.bufferSize = 4096;
  this.noteStrings = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  this.initGetUserMedia();
};

Tuner.prototype.initGetUserMedia = function () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!window.AudioContext) {
    return alert('AudioContext not supported');
  } // Older browsers might not implement mediaDevices at all, so we set an empty object first


  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  } // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.


  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface

      if (!getUserMedia) {
        alert('getUserMedia is not implemented in this browser');
      } // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise


      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
};

Tuner.prototype.startRecord = function () {
  var self = this;
  navigator.mediaDevices.getUserMedia({
    audio: true
  }).then(function (stream) {
    self.audioContext.createMediaStreamSource(stream).connect(self.analyser);
    self.analyser.connect(self.scriptProcessor);
    self.scriptProcessor.connect(self.audioContext.destination);
    self.scriptProcessor.addEventListener('audioprocess', function (event) {
      var frequency = self.pitchDetector.do(event.inputBuffer.getChannelData(0));

      if (frequency && self.onNoteDetected) {
        var note = self.getNote(frequency);
        self.onNoteDetected({
          name: self.noteStrings[note % 12],
          value: note,
          cents: self.getCents(frequency, note),
          octave: parseInt(note / 12) - 1,
          frequency: frequency,
          standard: self.getStandardFrequency(note)
        });
      }

      if (!frequency && self.onNoteDetected) {
        self.onNoteDetected({
          name: 'rest',
          value: 0,
          cents: 0,
          octave: 0,
          frequency: 0,
          standard: 0
        });
      }
    });
  }).catch(function (error) {
    alert(error.name + ': ' + error.message);
  });
};

Tuner.prototype.init = function () {
  this.audioContext = new window.AudioContext();
  this.analyser = this.audioContext.createAnalyser();
  this.scriptProcessor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
  var self = this;
  (0, _aubio.default)().then(function (aubio) {
    self.pitchDetector = new aubio.Pitch('default', self.bufferSize, 1, self.audioContext.sampleRate);
    self.startRecord();
  });
};
/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */


Tuner.prototype.getNote = function (frequency) {
  var note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
  return Math.round(note) + this.semitone;
};
/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */


Tuner.prototype.getStandardFrequency = function (note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12);
};
/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */


Tuner.prototype.getCents = function (frequency, note) {
  return Math.floor(1200 * Math.log(frequency / this.getStandardFrequency(note)) / Math.log(2));
};
/**
 * play the musical note
 *
 * @param {number} frequency
 */


Tuner.prototype.play = function (frequency) {
  if (!this.oscillator) {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.audioContext.destination);
    this.oscillator.start();
  }

  this.oscillator.frequency.value = frequency;
};

Tuner.prototype.stop = function () {
  this.oscillator.stop();
  this.oscillator = null;
};

module.exports = {
  Tuner: Tuner
};
},{"./aubio.js":"js/aubio.js"}],"js/app.js":[function(require,module,exports) {
"use strict";

var _guitarstring = require("./guitarstring.js");

var _tuner = require("./tuner.js");

var Application = function Application() {
  var a4 = 440;
  this.tuner = new _tuner.Tuner(a4);
  this.$rawnote = document.querySelector('.rawnote span');
  this.notes = [];
}; // Frequencies from https://en.wikipedia.org/wiki/Guitar_tunings


var stringFreqs = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];
var GuitarStrings = stringFreqs.map(function (f, i) {
  return new _guitarstring.GuitarString(i, f);
});

Application.prototype.start = function () {
  var self = this;
  this.currNote = null;
  this.currNoteStart = null; // Milliseconds duration note must reach before being processed.

  var MIN_DURATION = 400; // Only add the current note _once_ after it has lasted the min
  // duration.

  this.currNoteProcessed = false;

  this.tuner.onNoteDetected = function (note) {
    var now = Date.now(); // Ignore first sample, as we can't do anything with a note until it
    // reaches MIN_DURATION.

    if (!self.currNote) {
      self.currNote = note;
      self.currNoteStart = now;
      return;
    }

    var currNoteAge = now - self.currNoteStart;

    if (!self.currNoteProcessed && currNoteAge > MIN_DURATION) {
      // console.log(`Curr note duration ${duration} exceeds min, updating`)
      self.update(self.currNote);
      self.currNoteProcessed = true;
    }

    if (note.standard !== self.currNote.standard) {
      // console.log('New current note)
      self.currNote = note;
      self.currNoteStart = now;
      self.currNoteProcessed = false;
    }
  };

  swal.fire('Start getting notes').then(function () {
    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
  });
};

Application.prototype.update = function (note) {
  if (note.standard !== 0) {
    note.frets = GuitarStrings.map(function (s, i) {
      return s.getFret(note.frequency);
    });
    this.$rawnote.innerHTML = note.standard + ": " + note.frets.join(', ');
    this.notes.push(note);
  }
}; // noinspection JSUnusedGlobalSymbols


Application.prototype.toggleAutoMode = function () {
  this.notes.toggleAutoMode();
};

window.app = new Application();
window.app.start();
},{"./guitarstring.js":"js/guitarstring.js","./tuner.js":"js/tuner.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57258" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map