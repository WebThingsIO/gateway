#!/bin/bash -e

set -x

# Allow python3 to use the Bluetooth adapter
setcap cap_net_raw+eip $(eval readlink -f $(which python3))

su - ${FIRST_USER_NAME} << 'EOF'
set -e -x

NVM_VERSION="v0.37.2"
NODE_VERSION="--lts=dubnium"

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash

# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm

# Override nvm_get_arch to make sure we get the armv6l version
nvm_get_arch() {
  echo armv6l
}

# Install node
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}
nvm install-latest-npm

# Allow node to use the Bluetooth adapter
sudo setcap cap_net_raw+eip $(eval readlink -f $(which node))
EOF
