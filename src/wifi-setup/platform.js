const child_process = require('child_process');

module.exports = {
  getStatus: function() {
    let connected = false, ssid = '';

    const proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'status'],
      {encoding: 'utf8'}
    );
    if (proc.status !== 0) {
      return {connected, ssid};
    }

    for (const line of proc.stdout.split('\n')) {
      if (line.startsWith('wpa_state')) {
        connected = line.split('=')[1] === 'COMPLETED';
      } else if (line.startsWith('ssid')) {
        ssid = line.substring(5);
      }
    }

    return {connected, ssid};
  },

  scan: function() {
    const proc = child_process.spawnSync(
      'sudo',
      ['iwlist', 'scanning'],
      {encoding: 'utf8'}
    );

    if (proc.status !== 0) {
      return [];
    }

    const lines = proc.stdout
      .split('\n')
      .filter((l) => l.startsWith(' '))
      .map((l) => l.trim());

    const cells = [];
    let cell = {};

    for (const line of lines) {
      // New cell, start over
      if (line.startsWith('Cell ')) {
        if (cell.hasOwnProperty('ssid') &&
            cell.hasOwnProperty('quality') &&
            cell.hasOwnProperty('encryption') &&
            cell.ssid.length > 0) {
          cells.push(cell);
        }

        cell = {};
      }

      if (line.startsWith('ESSID:')) {
        cell.ssid = line.substring(7, line.length - 1);
      }

      if (line.startsWith('Quality=')) {
        cell.quality = parseInt(line.split(' ')[0].split('=')[1].split('/')[0]);
      }

      if (line.startsWith('Encryption key:')) {
        cell.encryption = line.split(':')[1] === 'on';
      }
    }

    return cells;
  },

  getKnownNetworks: function() {
    const proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'list_networks'],
      {encoding: 'utf8'}
    );
    if (proc.status !== 0) {
      return [];
    }

    const networks = [];
    for (const line of proc.stdout.trim().split('\n')) {
      if (line.startsWith('network')) {
        continue;
      }

      const ssid = line.split('\t')[1];
      if (ssid) {
        networks.push(ssid);
      }
    }

    return networks;
  },

  startAP: function(ip) {
    let proc = child_process.spawnSync('sudo', ['ifconfig', 'wlan0', ip]);
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync('sudo', ['systemctl', 'start', 'hostapd']);
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync('sudo', ['systemctl', 'start', 'dnsmasq']);
    return proc.status === 0;
  },

  // Stop broadcasting an AP and attempt to reconnect to local wifi
  stopAP: function() {
    let proc = child_process.spawnSync(
      'sudo',
      ['systemctl', 'stop', 'hostapd']
    );
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync('sudo', ['systemctl', 'stop', 'dnsmasq']);
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync('sudo', ['ifconfig', 'wlan0', '0.0.0.0']);
    return proc.status === 0;
  },

  removeNetwork: function(id) {
    let proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'remove_network', `${id}`]
    );
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'save_config']
    );
    return proc.status === 0;
  },

  defineNetwork: function(ssid, psk) {
    let proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'add_network'],
      {encoding: 'utf8'}
    );
    if (proc.status !== 0) {
      return false;
    }

    const id = proc.stdout.trim();

    ssid = ssid.replace('"', '\\"');
    proc = child_process.spawnSync(
      'wpa_cli',
      // the ssid argument MUST be quoted
      ['-i', 'wlan0', 'set_network', id, 'ssid', `"${ssid}"`]
    );
    if (proc.status !== 0) {
      return false;
    }

    if (psk) {
      psk = psk.replace('"', '\\"');
      proc = child_process.spawnSync(
        'wpa_cli',
        // the psk argument MUST be quoted
        ['-i', 'wlan0', 'set_network', id, 'psk', `"${psk}"`]
      );
    } else {
      proc = child_process.spawnSync(
        'wpa_cli',
        ['-i', 'wlan0', 'set_network', id, 'key_mgmt', 'NONE']
      );
    }

    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'enable_network', id]
    );
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'save_config']
    );
    return proc.status === 0;
  },
};
