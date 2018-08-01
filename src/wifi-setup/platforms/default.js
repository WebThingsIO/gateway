const path = require('path');

module.exports = {
  platform: 'default',

  // ip to be used by the AP
  ap_ip: '192.168.220.1',

  // A shell command that outputs the string "COMPLETED" if we are
  // connected to a wifi network and outputs something else otherwise
  getStatus:
    'wpa_cli -iwlan0 status | sed -n -e \'/^wpa_state=/{s/wpa_state=//;p;q}\'',

  // A shell command that outputs the SSID of the current wifi network
  // or outputs nothing if we are not connected to wifi
  getConnectedNetwork:
    'wpa_cli -iwlan0 status | sed -n -e \'/^ssid=/{s/ssid=//;p;q}\'',

  // A Python script that scans for wifi networks and outputs the ssids in
  // order from best signal to worst signal, omitting hidden networks
  scan: `sudo ${path.join(__dirname, './scan.py')}`,

  // A shell command that lists the names of known wifi networks, one
  // to a line.
  getKnownNetworks:
    // eslint-disable-next-line
    'wpa_cli -iwlan0 list_networks | sed -e "1d" | awk \'BEGIN {FS="\\t"}; {print $2}\'',

  // Start broadcasting an access point.
  // The name of the AP is defined in a config file elsewhere
  // Note that we use different commands on Yocto systems than
  // we do on Raspbian systems
  startAP:
    // eslint-disable-next-line
    'sudo ifconfig wlan0 $IP; sudo systemctl start hostapd; sudo systemctl start dnsmasq',

  // Stop broadcasting an AP and attempt to reconnect to local wifi
  stopAP:
    // eslint-disable-next-line
    'sudo systemctl stop hostapd; sudo systemctl stop dnsmasq; sudo ifconfig wlan0 0.0.0.0',

  // Remove an existing network. Expects the network ID in the environment
  // variable ID.
  removeNetwork:
    'wpa_cli -iwlan0 remove_network $ID && wpa_cli -iwlan0 save_config',

  // Define a new wifi network. Expects the network name and password
  // in the environment variables SSID and PSK.
  defineNetwork:
    // eslint-disable-next-line
    'ID=`wpa_cli -iwlan0 add_network` && wpa_cli -iwlan0 set_network $ID ssid \\"$SSID\\" && wpa_cli -iwlan0 set_network $ID psk \\"$PSK\\" && wpa_cli -iwlan0 enable_network $ID && wpa_cli -iwlan0 save_config',

  // Define a new open wifi network. Expects the network name
  // in the environment variable SSID.
  defineOpenNetwork:
    // eslint-disable-next-line
    'ID=`wpa_cli -iwlan0 add_network` && wpa_cli -iwlan0 set_network $ID ssid \\"$SSID\\" && wpa_cli -iwlan0 set_network $ID key_mgmt NONE && wpa_cli -iwlan0 enable_network $ID && wpa_cli -iwlan0 save_config',

  // Lists configured networks
  listNetworks: 'wpa_cli -iwlan0 list_networks',

  // Broadcast an Eddystone beacon
  broadcastBeacon:
    // eslint-disable-next-line
    'sudo hciconfig hci0 up && sudo hciconfig hci0 leadv 3 && sudo hcitool -i hci0 cmd',
};
