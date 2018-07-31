# gateway-wifi-setup

This repo is an Express server that runs on the Moz Gateway device and
handles the first-time setup required to get the device working:

- since the device is not on the local wifi network when it is first
  turned on, the device broadcasts its own wifi access point and runs
  the server on that. The user then connects their phone or laptop to
  that wifi network and uses a web browser (not a native app!) to
  connect to the device at the URL `gateway.local`. The user can select
  then their home wifi network and enter the password on a web page
  and transfer it to the web server running on the device. At this
  point, the device can turn off its private network and connect to
  the internet using the credentials the user provided.

The code is Linux-specific, depends on systemd, and has so far only
been tested on a Raspberry Pi 3. It requires hostapd and dnsmasq to be
installed and properly configured. Here are the steps I followed to
configure and run this server. Note that the steps include
instructions for Raspberry Pi and Edison, but that I have not yet been
able to successfully run on Edison.

If you intend to modify this code and need to test your changes in a real device, please refer
to: https://github.com/mozilla-iot/gateway-wifi-setup/wiki/Testing-on-WoT-Base-Image

### Step 0: clone and install

First, clone this repo and download its dependencies from npm:

```
$ git clone https://github.com/mozilla-iot/gateway-wifi-setup
$ cd gateway-wifi-setup.setup
$ npm install
```

### Step 1: Edison specific setup

If you're running this software on an Intel Edison instead of a
Raspberry Pi, you'll probably need to modify the default yocto Linux
build, as follows:

If you don't already have node 4.4, update your node and npm with
commands like these:

```
# curl https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-x86.tar.xz | zcat | tar xf - -C /usr/local
# cat <<EOF >> ~/.profile
export PATH=/usr/local/node-v4.4.7-linux-x86/bin:$PATH
EOF
# source ~/.profile
# node --version
v4.4.7
```

If your Edison is running mdnsd, you'll probably need to disable that
and install avahi instead. These software packages are both supposed
to do mdns aka zeroconf aka bonjour so that you can refer to your
device by the name 'hostname.local'. But the mdns package doesn't work
on my Edison, so I've swapped it out for avahi, which is what
Raspberry pi uses. Commands like these should work:

```
# systemctl disable mdns
# systemctl stop mdns
# opkg install avahi
# reboot
```

By default, my Edison was already running an HTTP server on port 80,
so this server was not able to run. I disabled the
edison_config server like this:

```
# systemctl disable edison_config
# systemctl stop edison_config
```

### Step 2: AP mode setup

Install software we need to host an access point, but
make sure it does not run by default each time we boot. For Raspberry
Pi, we need to do:

```
$ sudo apt-get install hostapd
$ sudo apt-get install dnsmasq
$ sudo systemctl disable hostapd
$ sudo systemctl disable dnsmasq
```


### Step 3: configuration files
Next, configure the software:

- On Raspberry Pi, edit /etc/default/hostapd to add the line:

```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```
this step is not necessary on Edison.

- Copy `config/hostapd.conf` to `/etc/hostapd/hostapd.conf`.  This
  config file defines the access point name "Mozilla IoT Gateway". Edit 
  it if
  you want to use a different name. On Edison
  `/etc/hostapd/hostapd.conf` alread exists. You may want to rename
  the existing file rather than overwriting it.


- On Edison (but not Raspberry Pi) edit the file
  `/lib/systemd/system/udhcpd-for-hostapd.service` and modify this
  line:

```
ExecStartPre=/sbin/ifconfig wlan0 192.168.42.1 up
```
changing `192.168.42.1` to `192.168.220.1`. This is necessary because
`config/dnsmasq.conf` and `wifi.js` use 192.168.220.1 as the local IP
address when we're broadcasting an access point. This ip should match the one set
on `platforms/default.js` at variable `ap_ip`.

- On Raspberry Pi, copy `config/dnsmasq.conf` to `/etc/dnsmasq.conf`.

### Step 4: run the server

If you have a keyboard and monitor hooked up to your device, or have a
serial connection to the device, then you can try out the server at
this point:

```
sudo node index.js
```

If you want to run the server on a device that has no network
connection and no keyboard or monitor, you probably want to set it up
to run automatically when the device boots up. To do this, copy
`config/mozilla-gateway-wifi-setup.service` to `/lib/systemd/system`, 
edit it to set the correct paths for node and for the server code, and then 
enable
the service with systemd:

```
$ sudo cp config/mozilla-gateway-wifi-setup.service /lib/systemd/system
$ sudo vi /lib/systemd/system/mozilla-gateway-wifi-setup.service # edit paths as needed
$ sudo systemctl enable mozilla-gateway-wifi-setup
```

At this point, the server will run each time you reboot.  If you want
to run it manually without rebooting, do this:

```
$ sudo systemctl start mozilla-gateway-wifi-setup
```

Any output from the server is sent to the systemd journal, and you can
review it with:

```
$ sudo journalctl -u mozilla-gateway-wifi-setup
```

Add the -b option to the line above if you just want to view output
from the current boot.  Add -f if you want to watch the output live as
you interact with the server.

If you want these journals to persist across reboots (you probably do)
then ensure that the `/var/log/journal/` directory
exists:

```
$ sudo mkdir /var/log/journal
```
