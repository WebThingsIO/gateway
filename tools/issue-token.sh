#!/bin/bash

# Issues JWT token signature with JSONWebToken APIs.

# We need ts-node to handle TypeScript scripts.
# Check if the required npm module is installed
# and install the module if not.
function npm_package_is_installed {
  local installed_=1
  # Set return value to 0 if not installed
  npm list -g | grep $1 >/dev/null 2>&1 || { local installed_=0; }
  if [ $installed_ == 0 ]; then
    npm install -g $1
  else
    echo "Required module $1 is already installed"
  fi
}

npm_package_is_installed ts-node
npm_package_is_installed typescript

# check if config directory exists
if [[ -d config && -L config ]] ; then
  echo "symbolic config dir exists!"
else
  ln -s ../config
fi

ts-node -O '{"module": "commonjs"}' issue-token.js
