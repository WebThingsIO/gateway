#!/bin/bash

WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.webthings}"
sqlite3 "${WEBTHINGS_HOME}/config/db.sqlite3" "DELETE FROM settings WHERE key='tunneltoken'"
sqlite3 "${WEBTHINGS_HOME}/config/db.sqlite3" "DELETE FROM settings WHERE key='notunnel'"
rm -rf "${WEBTHINGS_HOME}/ssl/"
sudo systemctl restart webthings-gateway
