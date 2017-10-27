/**
 * Builds full command from supplied command and options.
 *
 * @param {Array<string>} parameters - ip command parameters (ex: ['link', 'show'])
 * @param options
 * @returns {Array}
 */
exports.build_base_cmd = function (parameters, options) {
  var sudo_cmd = (options.sudo)
    ? ['sudo']
    : [];

  var ip_netns_exec_cmd = (options.namespace)
    ? ['ip', 'netns', 'exec', options.namespace]
    : [];

  const command = build_ip_cmd(parameters, options);
  return sudo_cmd.concat(ip_netns_exec_cmd).concat(command);
}

/**
 * Builds ip command with flags.
 *
 * @param {Array<string>} parameters - ip command parameters (ex: ['link', 'show'])
 * @param options
 * @returns {Array}
 */
function build_ip_cmd(parameters, options) {
  let flags = [];
  if (options.details) {
    flags = flags.concat('-d');
  }

  return ['ip'].concat(flags).concat(parameters);
}