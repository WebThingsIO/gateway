#!/bin/bash
set -e
set -x

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
args=""
start_task="start"

is_docker_container() {
  if [ -f /.dockerenv ]; then
    return 0
  fi

  if grep -q ':\/docker\/' /proc/1/cgroup 2>&1; then
    return 0
  fi

  return 1
}
if ! is_docker_container; then
  start_task="run-only"
  if [ ! -f .post_upgrade_complete ]; then
    ./tools/post-upgrade.sh
  fi
fi

run_app() {
  export NVM_DIR="$HOME/.nvm"
  [ ! -s "$NVM_DIR/nvm.sh" ] || \. "$NVM_DIR/nvm.sh"  # This loads nvm

  if [ ! is_docker_container ]; then
    sudo /sbin/ldconfig
  ### removed temporarily to fix docker containers ###
  # else
  #   /sbin/ldconfig
  fi


  echo "nvm version"
  nvm --version || echo "Use system's node insead of nvm"
  echo "node version"
  node --version
  echo "npm version"
  npm --version
  echo "Starting gateway ..."
  npm run $start_task -- $args
}

mkdir -p "${MOZIOT_HOME}/log"
run_app
