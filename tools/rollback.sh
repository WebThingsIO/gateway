#!/bin/bash

# This script performs a rollback of a failed upgrade. It expects to be run in
# the ~/mozilla-iot directory where it can see gateway, gateway_old, and
# gateway_failed

# from https://stackoverflow.com/questions/552724/
function recentEnough() {
  local filename=$1
  local changed=`stat -c %Y "$filename"`
  local now=`date +%s`
  local elapsed

  let elapsed=now-changed
  # if less than 60 * 60 * 24 * 14 seconds have passed
  if [ $elapsed -lt 1209600 ]; then
    return 0 # successful exit
  fi
  return 1
}

if [ -d "gateway_old" ] && $(recentEnough "gateway_old"); then
  systemctl stop mozilla-iot-gateway
  rm -fr gateway_failed
  mv gateway gateway_failed
  mv gateway_old gateway
  systemctl reset-failed mozilla-iot-gateway
  systemctl start mozilla-iot-gateway
fi
