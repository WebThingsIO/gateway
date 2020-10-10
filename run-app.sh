#!/bin/bash

set -e -x

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
args=""
start_task="run-only"

is_container() {
  if [ -f /.dockerenv ]; then
    return 0
  fi

  if [ -f /run/.containerenv ]; then
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
  # load nvm
  export NVM_DIR="${HOME}/.nvm"
  [ ! -s "${NVM_DIR}/nvm.sh" ] || \. "${NVM_DIR}/nvm.sh"

  if [ ! is_container ]; then
    sudo /sbin/ldconfig

    (sudo timedatectl set-local-rtc 0 && sudo timedatectl set-ntp 1) || true
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
else
  _node_version=$(node --version | egrep -o '[0-9]+' | head -n1)
  if [[ ! -f "${MOZIOT_HOME}/.node_version" ||
        "$(< "${MOZIOT_HOME}/.node_version")" != "${_node_version}" ]]; then
    cd "${HOME}/mozilla-iot/gateway"
    mkdir -p "${MOZIOT_HOME}/config"
    ./tools/update-addons.sh
    cd -
    echo "${_node_version}" > "${MOZIOT_HOME}/.node_version"
  fi
fi

mkdir -p "${MOZIOT_HOME}/log"

if [ -f "${MOZIOT_HOME}/log/run-app.log" ]; then
  rm -f "${MOZIOT_HOME}/log/run-app.log"
fi

run_app
