var exec = require('child_process').exec;

var build_base_cmd = require('../utils/internal').build_base_cmd;

/**
 * Add network namespace.
 *
 * @param options
 * @param cb
 */
module.exports = function (options, cb) {
  if (typeof arguments[0] != 'object'
    || typeof arguments[1] != 'function') {

    throw new Error('Invalid arguments. Signature: (options, callback)');
  }

  /*
   * Build cmd to execute.
   */
  var cmd = build_base_cmd(['netns', 'add'], options);
  var args = [];

  /*
   * Process options.
   */
  if (typeof options.name != 'undefined') {
    args = args.concat(options.name);
  }

  /*
   * An array of {key: value} pair.
   */
  if (typeof options.type_args != 'undefined') {
    for (var i = 0, j = options.type_args.length; i < j; i++) {
      var key = Object.keys(options.type_args[i])[0];
      value = options.type_args[i][key];

      args = args.concat(key, value);
    }
  }

  /*
   * Execute command.
   */
  exec(cmd.concat(args).join(' '), function (error, stdout, stderror) {
    if (error) {
      var err = new Error(stderror.replace(/\n/g, ''));
      err.cmd = cmd.concat(args).join(' ');
      err.code = error.code;

      cb(err);
    }
    else {
      cb(null);
    }
  });
};
