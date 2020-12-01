#!/bin/bash

# This script performs a rollback of a failed upgrade. It expects to be run in
# the ~/webthings directory where it can see gateway and gateway_old.

COUNTER_FILE=/tmp/webthings-gateway-reset-counter

# Load nvm
export NVM_DIR=${HOME}/.nvm
\. "$NVM_DIR/nvm.sh"

# From https://stackoverflow.com/questions/552724/
function recentEnough() {
  local filename=$1
  local changed=$(stat -c %Y "$filename")
  local now=$(date +%s)
  local elapsed

  let elapsed=now-changed
  # if less than 60 * 60 * 24 * 14 seconds (14 days) have passed
  if [ $elapsed -lt 1209600 ]; then
    return 0 # successful exit
  fi
  return 1
}

# Only roll back if the gateway has died at least twice in the past 30 minutes.
function checkCounter() {
  if [ ! -f "${COUNTER_FILE}" ]; then
    date +%s > "${COUNTER_FILE}"
    return 1
  fi

  local now=$(date +%s)
  local elapsed
  local counter=0

  while read line; do
    let elapsed=now-line
    if [ $elapsed -lt 1800 ]; then
      let counter=counter+1
    fi
  done <"${COUNTER_FILE}"

  if [ $counter -ge 2 ]; then
    return 0
  fi

  date +%s >> "${COUNTER_FILE}"
  return 1
}

# Roll back if we need to
if [ -d "gateway_old" ] && $(recentEnough "gateway_old") && $(checkCounter); then
  # Stop the gateway
  sudo systemctl stop webthings-gateway.service || true
  sudo systemctl stop mozilla-iot-gateway.service || true

  # Roll back to the old gateway
  rm -rf gateway
  mv gateway_old gateway

  # Restore the user profile
  if [ -d "$HOME/.webthings.old" ]; then
    rm -rf "$HOME/.webthings"
    mv "$HOME/.webthings.old" "$HOME/.webthings"
  elif [ -d "$HOME/.mozilla-iot.old" ]; then
    rm -rf "$HOME/.webthings"
    mv "$HOME/.mozilla-iot.old" "$HOME/.mozilla-iot"
  fi

  # Install and use the version of node specified in .nvmrc
  pushd ./gateway
  nvm install
  nvm use
  nvm alias default node
  nvm install-latest-npm
  popd

  # Link the gateway-addon module globally
  cd "$HOME/webthings/gateway/node_modules/gateway-addon"
  npm link || true
  cd -

  # Start the gateway back up
  if [ -f "$HOME/webthings/gateway/image/stage3/02-systemd-units/files/etc/systemd/system/webthings-gateway.service" ]; then
    sudo systemctl start webthings-gateway.service
  else
    sudo systemctl disable webthings-gateway || true
    sudo systemctl disable webthings-gateway.check-for-update.timer || true
    sudo systemctl stop webthings-gateway.check-for-update.timer || true
    sudo systemctl enable mozilla-iot-gateway.service
    sudo systemctl start mozilla-iot-gateway.service
    sudo systemctl enable mozilla-iot-gateway.check-for-update.timer
    sudo systemctl start mozilla-iot-gateway.check-for-update.timer
  fi
fi
