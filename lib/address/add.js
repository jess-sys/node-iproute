var exec = require('child_process').exec;

var build_base_cmd = require('../utils/internal').build_base_cmd;

/**
 * Add a new protocol address.
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
  var cmd = build_base_cmd(['ip', 'address', 'add'], options);
  var args = [];

  /*
   * Process options.
   */
  if (typeof options.dev != 'undefined') {
    args = args.concat('dev', options.dev);
  }

  // This acts as the address to be added.
  if (typeof options.local != 'undefined') {
    args = args.concat('local', options.local);
  }

  if (typeof options.peer != 'undefined') {
    args = args.concat('peer', options.peer);
  }

  if (typeof options.broadcast != 'undefined') {
    args = args.concat('broadcast', options.broadcast);
  }

  if (typeof options.label != 'undefined') {
    args = args.concat('label', options.label);
  }

  if (typeof options.scope != 'undefined') {
    args = args.concat('scope', options.scope);
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
