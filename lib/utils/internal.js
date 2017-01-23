/**
 * Builds full command from supplied command and options.
 *
 * @param command
 * @param options
 * @returns {Array}
 */
exports.build_base_cmd = function (command, options) {
  var sudo_cmd = (options.sudo)
    ? ['sudo']
    : [];

  var ip_netns_exec_cmd = (options.namespace)
    ? ['ip', 'netns', 'exec', options.namespace]
    : [];

  console.log(sudo_cmd.concat(ip_netns_exec_cmd).concat(command));

  return sudo_cmd.concat(ip_netns_exec_cmd).concat(command);
}
