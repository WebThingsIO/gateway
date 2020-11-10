#!/bin/bash

WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.webthings}"
sqlite3 "${WEBTHINGS_HOME}/config/db.sqlite3" "DELETE FROM users"
sudo service webthings-gateway restart
