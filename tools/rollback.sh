#!/bin/bash

# This script performs a rollback of a failed upgrade. It expects to be run in
# the ~/mozilla-iot directory where it can see gateway, gateway_old, and
# gateway_failed

COUNTER_FILE=/tmp/mozilla-iot-gateway-reset-counter

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
  systemctl stop mozilla-iot-gateway
  rm -fr gateway_failed
  mv gateway gateway_failed
  mv gateway_old gateway
  systemctl start mozilla-iot-gateway
fi
