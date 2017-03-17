/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var express = require('express');
var app = express();

app.use('/things', function(request, response) {
  var options = {
    root: 'static'
  };
  response.sendFile('things.json', options);
});
app.use(express.static('static'));

app.listen(8080, function () {
  console.log('Listening on port 8080.');
});
