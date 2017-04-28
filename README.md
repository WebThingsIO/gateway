# MozIoT Gateway
Web of Things gateway.

## Prerequisites

### Install OS

(If you're just installing on your PC, you can skip this step).

If you're installing on a Raspberry Pi then you may need to set up the OS on the Raspberry Pi first. [See here](https://github.com/moziot/wiki/wiki/Setting-up-Raspberry-Pi) for instructions.

### Install pkg-config

Under Linux:
```
$ sudo apt-get install pkg-config
```

Under OSX:

[See here](http://macappstore.org/pkg-config/).


### Install nvm (Recommended)

nvm allows you to easily install different versions of node. To install nvm:

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
```

Close and reopen your terminal window. Use nvm to install node and set the
default version.

```
$ nvm install v7.7.2
$ nvm use v7.7.2
$ nvm alias default v7.7.2
```

Verify that node and npm have been installed:
```
$ npm --version
4.1.2
$ node --version
v7.7.2
```

### Install node (if you didn't use nvm)

(If you already installed node via nvm you can skip this step)

Follow the directions from [NodeJS](https://nodejs.org) to install on your platform.

### Install libusb and libudev (Linux only)
```
$ sudo apt-get install libusb-1.0-0-dev libudev-dev
```

### Install git

You'll need git to checkout the repositories.

`$ sudo apt-get install git`

### Build and Install openzwave

```
$ cd
$ git clone https://github.com/OpenZWave/open-zwave.git
$ cd open-zwave
$ make && sudo make install
```

Note: You may need to manually add `/usr/local/lib` to your `LD_LIBRARY_PATH` enviroment variable by adding the following to your `~/.profile` file:

`export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH`

(You can run this on the command line as well so it has immediate effect).

## Download and Install gateway

Clone the GitHub repository (or fork it first):
```
$ cd
$ git clone https://github.com/moziot/gateway.git
```

Change into the gateway directory:

```
$ cd gateway
```

Install dependencies:

```
$ npm install
```

 Add SSL certificate:

 The HTTPS server looks for privatekey.pem and certificate.pem. You can use a real certificate or generate a self-signed one by following the steps below.

 ```
 $ openssl genrsa -out privatekey.pem 2048
 $ openssl req -new -sha256 -key privatekey.pem -out csr.pem
 $ openssl x509 -req -in csr.pem -signkey privatekey.pem -out certificate.pem
```

 Start the web server:

```
$ node app.js
```

Load ```http://localhost:8080``` in your web browser (or use the server's IP address if loading remotely).


## Source Code Structure

* **models/** - Data model and business logic for Things
* **controllers/** - App URL routes and their logic
* **adapters/** - Network adapter device drivers (e.g. ZigBee, Z-Wave)
* **static/** - Static HTML, CSS, JavaScript & image resources for web app front end
  * **css/** - Style sheets
  * **images/** - Image files
  * **js/** - JavaScript files for the web app front end
  * **index.html** - The home page of the gateway
  * **things.json** - A default list of devices to populate the database with
  * **app.webmanifest** - W3C web app manifest for front end
* **app.js** - The main back end script
* **db.js** - Manages the SQLite3 database
* **adapter.js** - Base class used by adapters
* **device.js** - Base class used by adapter devices.
* **adapter-manager.js** - Manages the various network adapters of the gateway (e.g. ZigBee, Z-Wave)
* **package.json** - npm module manifest
