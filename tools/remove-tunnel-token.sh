#!/bin/bash

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
sqlite3 "${MOZIOT_HOME}/config/db.sqlite3" "DELETE FROM settings WHERE key='tunneltoken';"
rm -rf "${MOZIOT_HOME}/ssl/"
sudo service mozilla-iot-gateway restart
