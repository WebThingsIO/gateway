#!/bin/bash

run_app() {
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

  sudo /sbin/ldconfig

  echo "nvm version"
  nvm --version
  echo "node version"
  node --version
  echo "npm version"
  npm --version
  echo "Starting gateway ..."
  npm start
}

run_app > ${HOME}/mozilla-iot/gateway/run-app.log 2>&1
