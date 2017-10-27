// Link types.
exports.types = {
  loopback   : 'loopback',    // Loopback.
  ethernet   : 'ether',       // Ethernet.
  pointopoint: 'ppp'          // Point to Point.
};

// Virtual link types.
exports.vl_types = {
  bridge : 'bridge',   // Ethernet Bridge device.
  can    : 'can',      // Controller Area Network interface.
  dummy  : 'dummy',    // Dummy network interface.
  ifb    : 'ifb',      // Intermediate Functional Block device.
  ipoib  : 'ipoib',    // IP over Infiniband device.
  macvlan: 'macvlan',  // Virtual interface base on link layer address (MAC).
  vcan   : 'vcan',     // Virtual Local CAN interface.
  veth   : 'veth',     // Virtual ethernet interface.
  vlan   : 'vlan',     // 802.1q tagged virtual LAN interface.
  vxlan  : 'vxlan'     // Virtual eXtended LAN.
};

// Interface flags.
exports.flags = [
  'UP',
  'LOOPBACK',
  'BROADCAST',
  'POINTOPOINT',
  'MULTICAST',
  'PROMISC',
  'ALLMULTI',
  'NOARP',
  'DYNAMIC',
  'SLAVE',

  // Undocumented.
  'LOWER_UP',
  'NO-CARRIER',
  'M-DOWN'
];

exports.flag_statuses = {
  on : 'on',
  off: 'off'
};

// Interface statuses.
exports.statuses = {
  UP            : 'UP',               // Ready to pass packets (if admin status is changed to up, then operational status should change to up if the interface is ready to transmit and receive network traffic).
  DOWN          : 'DOWN',             // If admin status is down, then operational status should be down.
  UNKNOWN       : 'UNKNOWN',          // Status can not be determined for some reason.
  LOWERLAYERDOWN: 'LOWERLAYERDOWN',   // Down due to state of lower layer interface.
  NOTPRESENT    : 'NOTPRESENT',       // Some component is missing, typically hardware.
  TESTING       : 'TESTING',          // In test mode, no operational packets can be passed.
  DORMANT       : 'DORMANT'           // Interface is waiting for external actions.
};

/**
 * Parses .show() output.
 *
 * @param {string} raw_data
 * @returns {Array}
 */
exports.parse_links = function (raw_data) {
  if (!raw_data) {
    throw new Error('Invalid arguments.');
  }
  else {
    /*
     * Process the output to give parsed results.
     */
    var links = [];

    var output = raw_data.split('\n');

    const new_line_regex = /^[0-9]+:.*$/g;
    let current_link = {};
    let current_line = 0;
    for (var line = 0, output_length = output.length - 1;
         line < output_length;
         line++ /* Each link is composed for two lines. */) {
        
      const link_line = output[line];
      if (new_line_regex.test(link_line)) {
        if (current_link.name) {
          links.push(current_link);
        }
        current_link = {};
        current_line = 0;
      }
      const link_fields = link_line.trim().split(/\s/g);

      if (current_line === 0) {
        const wasDeleted = link_fields[0] === 'Deleted';
        if (wasDeleted) {
          link_fields.shift();
        }
        const name = link_fields[1].split(':')[0];

        current_link.index = link_fields[0].split(':')[0]; // Don't needed since the array is ordered anyway but just in case.
        current_link.deleted = wasDeleted;
        current_link.name = name;
        current_link.flags = link_fields[2].slice(1, -1).split(','); // First remove the <,> chars.


        /*
         * Parses dynamically the following fields, if are there.
         *
         * mtu
         * qdisc
         * state
         * mode
         * qlen
         */
        const rest_line_fields = link_fields.slice(3);
        for (var i = 0, rest_line_length = rest_line_fields.length - 1;
             i < rest_line_length;
             i += 2 /* Each field is composed for two consecutive items. */) {

          current_link[rest_line_fields[i]] = rest_line_fields[i + 1];
        }

        /*
         * Parses and append the virtual link type, if any.
         */
        const splitted_name = name.split('@');
        if (splitted_name.length == 2) {
          // Is a VLAN.
          current_link['vl_type'] = 'vlan';
          current_link['name']    = splitted_name[0];
          current_link['parent']  = splitted_name[1].split(':')[0];
        }
      } else if (current_line === 1) {
        current_link.type = link_fields[0].split('\/')[1];
        current_link.mac = link_fields[1];
        current_link.brd = link_fields[3];
      } else if (current_line === 2) {
        const link_fields = link_line.trim().split(/\s/g);
        const id_idx = link_fields.indexOf('id');
        const id = link_fields[id_idx + 1];
        if (id_idx !== -1 && id) {
          current_link.id = id;
        }
      }

      current_line++;
    }

    if (current_link.name) {
      links.push(current_link);
    }

    return links;
  }
};