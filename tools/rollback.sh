#!/bin/bash

# This script performs a rollback of a failed upgrade. It expects to be run in
# the ~/mozilla-iot directory where it can see gateway and gateway_old.

COUNTER_FILE=/tmp/mozilla-iot-gateway-reset-counter

export NVM_DIR=${HOME}/.nvm
\. "$NVM_DIR/nvm.sh"  # This loads nvm

# from https://stackoverflow.com/questions/552724/
function recentEnough() {
  local filename=$1
  local changed=$(stat -c %Y "$filename")
  local now=$(date +%s)
  local elapsed

  let elapsed=now-changed
  # if less than 60 * 60 * 24 * 14 seconds have passed
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

if [ -d "gateway_old" ] && $(recentEnough "gateway_old") && $(checkCounter); then
  systemctl stop webthings-gateway || true
  systemctl stop mozilla-iot-gateway || true
  mv gateway_old gateway

  # restore the user profile
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
  popd

  cd "$HOME/mozilla-iot/gateway/node_modules/gateway-addon"
  npm link || true
  cd -

  if [ -f "$HOME/mozilla-iot/gateway/image/stage3/02-systemd-units/files/etc/systemd/system/webthings-gateway.service" ]; then
    systemctl start webthings-gateway
  else
    systemctl disable webthings-gateway
    systemctl enable mozilla-iot-gateway
    systemctl start mozilla-iot-gateway
  fi
fi
