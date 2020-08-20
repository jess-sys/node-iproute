var exec = require('child_process').exec;

var build_base_cmd = require('../utils/internal').build_base_cmd;

/**
 * Add virtual link.
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
  var cmd = build_base_cmd(['link', 'add'], options);
  var args = [];

  /*
   * Process options.
   */
  if (typeof options.link != 'undefined') {
    args = args.concat('link', options.link);
  }

  if (typeof options.name != 'undefined') {
    args = args.concat('name', options.name);
  }

  if (typeof options.txqueuelen != 'undefined') {
    args = args.concat('txqueuelen', options.txqueuelen);
  }

  if (typeof options.address != 'undefined') {
    args = args.concat('address', options.address);
  }

  if (typeof options.broadcast != 'undefined') {
    args = args.concat('broadcast', options.broadcast);
  }

  if (typeof options.mtu != 'undefined') {
    args = args.concat('mtu', options.mtu);
  }

  if (typeof options.numtxqueues != 'undefined') {
    args = args.concat('numtxqueues', options.numtxqueues);
  }

  if (typeof options.numrxqueues != 'undefined') {
    args = args.concat('numrxqueues', options.numrxqueues);
  }

  if (typeof options.type != 'undefined') {
    args = args.concat('type', options.type);
  }
  
  if (typeof options.dstport != 'undefined') {
    args = args.concat('dstport', options.dstport);
  }
  
  if (typeof options.remote != 'undefined') {
    args = args.concat('remote', options.remote);
  }
  
  if (typeof options.local != 'undefined') {
    args = args.concat('local', options.local);
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
