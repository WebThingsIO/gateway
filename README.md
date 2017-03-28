# MozIoT Gateway
Web of Things gateway.

## Get Started
Make sure that you have a recent version of [NodeJS](https://nodejs.org) installed.

Clone the GitHub repository (or fork it first):

```$ git clone https://github.com/moziot/gateway.git```

Change into the gateway directory:

```$ cd gateway```

Install dependencies:

```$ npm install```

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
* **adapters.js** - Manages the various network adapters of the gateway (e.g. ZigBee, Z-Wave)
* **package.json** - npm module manifest
