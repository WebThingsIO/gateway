/**
 * Things Model.
 *
 * Manages the data model and business logic for a collection of Things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var Database = require('../db.js');

var Things = {

   /**
    * Get all Things stored in the database.
    *
    * @return Promise which resolves with a list of Thing objects.
    */
   getAllThings: function() {
     return Database.getAllThings();
   }
 };

module.exports = Things;
