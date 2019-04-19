# WebThings Gateway by Mozilla

[![Build Status](https://travis-ci.org/mozilla-iot/gateway.svg?branch=master)](https://travis-ci.org/mozilla-iot/gateway)
[![codecov](https://codecov.io/gh/mozilla-iot/gateway/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla-iot/gateway)
[![dependencies](https://david-dm.org/mozilla-iot/gateway.svg)](https://david-dm.org/mozilla-iot/gateway)
[![devDependencies](https://david-dm.org/mozilla-iot/gateway/dev-status.svg)](https://david-dm.org/mozilla-iot/gateway?type=dev)
[![optionalDependencies](https://david-dm.org/mozilla-iot/gateway/optional-status.svg)](https://david-dm.org/mozilla-iot/gateway?type=optional)
[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Web of Things gateway.

If you have a Rasberry Pi, the easiest way to use the gateway is to [download and flash](http://iot.mozilla.org/gateway/) a pre-built software image from Mozilla to an SD card. Otherwise you can build it from source yourself (see below).

## Prerequisites for Building

### Install OS

(If you're just installing on your PC, you can skip this step).

If you're installing on a Raspberry Pi then you may need to set up the OS on the Raspberry Pi first. [See here](https://github.com/mozilla-iot/wiki/wiki/Setting-up-Raspberry-Pi) for instructions.

### Update Package Cache (Linux only)

Under Ubuntu/Debian Linux:
```
$ sudo apt update
```

Under Fedora Linux:
```
$ sudo dnf --refresh upgrade
```

### Install pkg-config

Under Ubuntu/Debian Linux:
```
$ sudo apt install pkg-config
```

Under Fedora Linux:
```
$ sudo dnf install pkgconfig
```

Under macOS:
```
$ brew install pkg-config
```

### Install curl (needed to install nvm)

Under Ubuntu/Debian Linux:
```
$ sudo apt install curl
```

Under Fedora Linux:
```
$ sudo dnf install curl
```

### Install nvm (Recommended)

nvm allows you to easily install different versions of node. To install nvm:

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

Reinitialize your terminal session.

```
$ . ~/.bashrc
```

### Install node (if you didn't use nvm)

(If you already installed node via nvm you can skip this step)

Follow the directions from [NodeJS](https://nodejs.org) to install on your platform.

### Set up Bluetooth permissions (Linux only)

The following is required in order to let node and python3 use the Bluetooth adapter.

```
$ sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
$ sudo setcap cap_net_raw+eip $(eval readlink -f `which python3`)
```

### Install Bluetooth and BT Low Energy support libraries (Linux only)

The following are required in order to install the Python modules that support Bluetooth

Under Ubuntu/Debian Linux:
```
$ sudo apt install libboost-python-dev libboost-thread-dev libbluetooth-dev libglib2.0-dev
```

Under Fedora Linux:
```
$ sudo dnf install boost-python2-devel boost-python3-devel boost-devel bluez-libs-devel glib2-devel
```

### Install libusb and libudev (Linux only)

Under Ubuntu/Debian Linux:
```
$ sudo apt install libusb-1.0-0-dev libudev-dev
```

Under Fedora Linux:
```
$ sudo dnf install libudev-devel libusb1-devel
```

### Install autoconf

Under Ubuntu/Debian Linux:
```
$ sudo apt install autoconf
```

Under Fedora Linux:
```
$ sudo dnf install autoconf
```

Under macOS:
```
$ brew install autoconf
```

### Install libpng (Linux only)

Under x86-64 or x86 Ubuntu/Debian Linux:
```
$ sudo apt install libpng16-16
```

Under ARM Ubuntu/Debian Linux:
```
$ sudo apt install libpng-dev
```

Under Fedora Linux:
```
$ sudo dnf install libpng-devel
```

### Install git

You'll need git to checkout the repositories.

Under Ubuntu/Debian Linux:
```
$ sudo apt install git
```

Under Fedora Linux:
```
$ sudo dnf install git
```

### Install gcc

Under Ubuntu/Debian Linux:
```
$ sudo apt install build-essential
```

Under Fedora Linux:
```
$ sudo dnf group install "C Development Tools and Libraries"
```

### Install nanomsg

#### Linux

Under Ubuntu/Debian Linux:
```
$ sudo apt install libnanomsg4 libnanomsg-dev
```

#### Windows

* Follow the directions from [nanomsg](https://github.com/nanomsg/nanomsg) to install in the same bitness as your Python 3.X.
* If you want to build for 64-bit, you need to execute cmake with `-DCMAKE_GENERATOR_PLATFORM=x64`.
* Add `C:\path\to\nanomsg\bin` to `PATH`.

### Install OpenSSL (Windows only)

The Gateway depends on [`ursa`](https://github.com/JoshKaufman/ursa), which requires OpenSSL.

Install [OpenSSL](http://slproweb.com/products/Win32OpenSSL.html) =< 1.0.2 (normal, not light) in the same bitness as your Node.js.

[See here](https://github.com/JoshKaufman/ursa#windows-install).

### Install Python 2.7 (Windows only)

PageKite works with Python 2.7.

Install Python 2.7 from [here](https://www.python.org/downloads/windows/).

Enable "register extensions" on installing package, or associate file extension `.py` with python.

### Install Python 3.X (Optional, Windows only)

This is required in order to use Python 3 add-ons, e.g. [tplink-adapter](https://github.com/mozilla-iot/tplink-adapter/).

* Install Python 3.4+ from [here](https://www.python.org/downloads/windows/).
  * Enable "Install launcher for all users" and "Add Python 3.X to PATH" on installing.
  * Enable `python3` command using the following.
```
mklink "C:\path\to\python3\python3.exe" "C:\path\to\python3\python.exe"
```
* Install nnpy
```
git clone https://github.com/nanomsg/nnpy.git
cd nnpy
```
Add a file: site.cfg
```
[DEFAULT]
include_dirs = C:\path\to\nanomsg\include\nanomsg
library_dirs = C:\path\to\nanomsg\lib
host_library = C:\path\to\nanomsg\bin\nanomsg.dll
```

### Install Python Add-on Bindings (Optional)

This is required in order to use Python 3 add-ons, e.g. [tplink-adapter](https://github.com/mozilla-iot/tplink-adapter/).

Execute the following command as sudo (Linux) or administrator (Windows).

```
python2 -m pip install git+https://github.com/mozilla-iot/gateway-addon-python#egg=gateway_addon
python3 -m pip install git+https://github.com/mozilla-iot/gateway-addon-python#egg=gateway_addon
```

**Note:** 2018-04-12: `pip3` has an [issue](https://github.com/pypa/pip/issues/4251) with some languages.

## Download and Build Gateway

* Clone the GitHub repository (or fork it first):

    ```
    $ git clone https://github.com/mozilla-iot/gateway.git
    ```

* Change into the gateway directory:

    ```
    $ cd gateway
    ```

* If you have chosen to install nvm above, install and use an LTS version of node and then set the default version. The **`.nvmrc`** file will be used by nvm to determine which version of node to install.

    ```
    $ nvm install
    $ nvm use
    $ nvm alias default $(node -v)
    ```

* Verify that node and npm have been installed:

    ```
    $ node --version
    v8.15.1
    $ npm --version
    6.4.1
    ```

    Note: these versions might differ from the LTS version installed locally.

* Install dependencies:

    ```
    $ npm install
    ```

* Add Firewall exceptions (Fedora Linux Only)

    ```
    $ sudo firewall-cmd --zone=public --add-port=4443/tcp --permanent
    $ sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
    $ sudo firewall-cmd --zone=public --add-port=5353/udp --permanent
    ```


* Set up domain:
    * If you plan to use Mozilla's provided tunneling service to set up a `*.mozilla-iot.org` domain:
        * Start the web server:

            ```
            $ npm start
            ```

        * Load `http://localhost:8080` in your web browser (or use the server's IP address if loading remotely). Then follow the instructions on the web page to set up domain and register. Once this is done you can load
`https://localhost:4443` in your web browser (or use the server's IP address if loading remotely).
    * If you plan to use your own SSL certificate:
        * The HTTPS server looks for `privatekey.pem` and `certificate.pem` in the `ssl` sub-directory of the `userProfile` directory specified in your config. You can use a real certificate or generate a self-signed one by following the steps below.

            ```
            $ MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
            $ SSL_DIR="${MOZIOT_HOME}/ssl"
            $ [ ! -d "${SSL_DIR}" ] && mkdir -p "${SSL_DIR}"
            $ openssl genrsa -out "${SSL_DIR}/privatekey.pem" 2048
            $ openssl req -new -sha256 -key "${SSL_DIR}/privatekey.pem" -out "${SSL_DIR}/csr.pem"
            $ openssl x509 -req -in "${SSL_DIR}/csr.pem" -signkey "${SSL_DIR}/privatekey.pem" -out "${SSL_DIR}/certificate.pem"
            ```

        * Start the web server:

            ```
            $ npm start
            ```

        * Load `https://localhost:4443` in your web browser (or use the server's IP address if loading remotely). Since you're using a self-signed certificate, you'll need to add a security exception in the browser.

## Browser Support

The Gateway only supports the following browsers, due to its use of the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) and [`WebSocket API`](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API):
* Firefox 52+
* Chrome 43+
* Edge 14+
* Safari 10.1+
* Opera 29+

## Debugging

If you are using VS Code, simply use the "launch" target. It will build the gateway in debugger mode.

If you are not using VS Code, run `npm run debug` and it will build the gateway and launch it with `--inspect`.

## Install additional dependencies for Test (Debian)

These steps are required on Debian (where python points to python 2.7)
```
$ sudo apt install python-pip python3-pip firefox openjdk-8-jre
$ sudo python3 -m pip install git+https://github.com/mycroftai/adapt#egg=adapt-parser
```

## Running Tests
To run the linter and all tests:
```
$ npm test
```

To run a single test:
```
$ jest src/test/{test-name}.js
```
(assumes you have the `jest` command on your `PATH`, otherwise use `./node_modules/jest/bin/jest.js`)

To compare UI with parent branch:
```
$ npm run screenshots
$ npm test
```
(if you have the screenshots in the folder `./browser-test-screenshots`, `npm test` should compare UI with screenshots stored)

## Source Code Structure

* **`config/`** - Gateway configuration files
* **`image/`** - Tools for building the Raspberry Pi image
* **`src/`**
  * **`addons-test/`** - Add-ons used strictly for testing
  * **`controllers/`** - App URL routes and their logic
  * **`models/`** - Data model and business logic
  * **`platforms/`** - Platform-specific functionality
  * **`plugin/`** - Utility classes and methods used by add-ons
  * **`rules-engine/`** - The rules engine
  * **`test/`** - Integration tests
  * **`views/`** - HTML views
  * **`addon-loader.js`** - Script used for starting up Node-based add-ons
  * **`addon-manager.js`** - Manages add-ons (e.g. Zigbee, Z-Wave)
  * **`app.js`** - The main back end
  * **`app-instance.js`** - Application wrapper for integration tests
  * **`certificate-manager.js`** - Certificate registration and renewal, via Let's Encrypt
  * **`command-utils.js`** - Utilities used by commands parser
  * **`constants.js`** - System-wide constants
  * **`db.js`** - Manages the SQLite3 database
  * **`deferred.js`** - Wraps up a promise in a slightly more convenient manner for passing around, or saving
  * **`dynamic-require.js`** - Small utility to require code from file system, rather than webpacked bundle
  * **`ec-crypto.js`** - Elliptic curve helpers for the ES256 curve
  * **`jwt-middleware.js`** - Express middleware for determining authentication status
  * **`log-timestamps.js`** - Utilities for adding timestamps to console logging functions
  * **`mdns-server.js`** - mDNS server
  * **`oauth-types.js`** - OAuth types
  * **`passwords.js`** - Password utilities
  * **`platform.js`** - Platform-specific utilities
  * **`push-service.js`** - Push notification service
  * **`router.js`** - Routes app URLs to controllers
  * **`router-setup.js`** - Initial router setup code for OpenWrt
  * **`sleep.js`** - Small utility to implement a promise-based sleep
  * **`ssltunnel.js`** - Utilities to determine state of tunnel and manage the PageKite process
  * **`user-profile.js`** - Manages persistent user data
  * **`utils.js`** - Various utility functions
  * **`wifi-setup.js`** - Initial Wi-Fi setup code for Raspbian
* **`static/`** - Static CSS, JavaScript & image resources for web app front end
* **`tools/`** - Helpful utilities (not part of the build)
* **`package.json`** - npm module manifest
