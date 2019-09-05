#!/bin/bash

set -e -x

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
args=""
start_task="run-only"

is_container() {
  if [ -f /.dockerenv ]; then
    return 0
  fi

  if grep -q ':\/docker\/' /proc/1/cgroup 2>&1; then
    return 0
  fi

  if [ -d /pantavisor ]; then
    return 0
  fi

  return 1
}

run_app() {
  export NVM_DIR="${HOME}/.nvm"
  [ ! -s "${NVM_DIR}/nvm.sh" ] || \. "${NVM_DIR}/nvm.sh"  # This loads nvm

  if [ ! is_container ]; then
    sudo /sbin/ldconfig

    (sudo timedatectl set-local-rtc 0 && sudo timedatectl set-ntp 1) || true
  fi

  if [ -n "$(which nvm)" ]; then
    echo "nvm version"
    nvm --version
  else
    echo "Using system's node instead of nvm"
  fi

  echo "node version"
  node --version
  echo "npm version"
  npm --version
  echo "Starting gateway ..."
  npm run "${start_task}" -- $args
}

if ! is_container; then
  if [ ! -f .post_upgrade_complete ]; then
    ./tools/post-upgrade.sh
  fi
fi

mkdir -p "${MOZIOT_HOME}/log"
run_app
