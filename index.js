'use strict';

var findParentDir = require('find-parent-dir');
var path = require('path');

/**
 * Resolves the full path to the bin file of a given package by inspecting the "bin" field in its package.json.
 *
 * @name resolveBin
 * @function
 * @param {string} name   module name, i.e. 'tap'
 * @param {Object=} opts            options
 * @param {string} opts.executable (default: @name) executable name (e.g. 'buster-test')
 *  @param {function} cb  called back with the full path to the bin file of the module or an error if it couldn't be resolved
 */
module.exports = function (name, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  var executable = opts.executable || name;

  var mod;
  try {
    mod = require.resolve(name);
  } catch (err) {
    return cb(err);
  }

  findParentDir(mod, 'package.json', function (err, dir) {
    if (err) return cb(err);

    var pack = require(path.join(dir, 'package.json'));
    var binfield = pack.bin;

    var binpath = typeof binfield === 'object' ? binfield[executable] : binfield;
    var bin = path.join(dir, binpath);
    cb(null, bin);
  });
}
