# MozIoT Gateway
Web of Things gateway.

## Get Started

### Prerequisites
* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org) ([Installation instructions](https://github.com/moziot/wiki/wiki/Installing-nodejs))
* [OpenZWave](http://www.openzwave.com/) ([Installation instructions](https://github.com/moziot/wiki/wiki/Installing-openzwave))

### Get the Source

Clone the GitHub repository (or fork it first):

```$ git clone https://github.com/moziot/gateway.git```

Change into the gateway directory:

```$ cd gateway```

Install dependencies:

```$ npm install```

### Run

 Start the web server:

```$ node app.js```

Load ```http://localhost:8080``` in your web browser.


## Source Code Structure

* **models/** - Data model and business logic for Things
* **views/** - Templates which are rendered and served by controllers
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
* **device.js** - Base class used by adapter devices
* **adapter-manager.js** - Manages the various network adapters of the gateway (e.g. ZigBee, Z-Wave)
* **package.json** - npm module manifest
