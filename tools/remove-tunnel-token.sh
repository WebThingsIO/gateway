#!/bin/bash

WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.mozilla-iot}"
sqlite3 "${WEBTHINGS_HOME}/config/db.sqlite3" "DELETE FROM settings WHERE key='tunneltoken'"
sqlite3 "${WEBTHINGS_HOME}/config/db.sqlite3" "DELETE FROM settings WHERE key='notunnel'"
rm -rf "${WEBTHINGS_HOME}/ssl/"
sudo service mozilla-iot-gateway restart
