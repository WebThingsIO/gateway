#!/bin/bash

WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.mozilla-iot}"
sqlite3 "${WEBTHINGS_HOME}/config/db.sqlite3" "DELETE FROM users"
sudo service mozilla-iot-gateway restart
