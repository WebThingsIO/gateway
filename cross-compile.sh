#!/bin/bash
#
# This script is expected to run inside a docker container which has the Raspberry Pi toolchain
# and required prerequisites:
#   - pkg-config
#   - libusb-1.0-0-dev
#   - libudev-dev
#
# /build corresponds to the current directory when the docker container is run and it is expected
# that the following directory structure has been setup:
#
#   - /build/Open-ZWave/open-zwave  - git repository containing the desired version of OpenZWave
#   - /build/gateway                - git repository containing the gateway software

NODE_MODULES_TARBALL=node_modules.tar.gz
OPENZWAVE_TARBALL=openzwave.tar.gz

# Remove the output, if it exists
rm -f ${NODE_MODULES_TARBALL} ${OPENZWAVE_TARBALL}

NODE_VERSION="--lts"

ARCH=armv7l
SYSROOT=/rpxc/sysroot
OPEN_ZWAVE=OpenZWave/open-zwave

# Cross compile and install Open-ZWave
PREFIX=${SYSROOT}/usr/local CFLAGS=--sysroot=${SYSROOT} LDFLAGS=--sysroot=${SYSROOT} make -C ${OPEN_ZWAVE} CROSS_COMPILE=arm-linux-gnueabihf-
sudo PREFIX=${SYSROOT}/usr/local make  -C ${OPEN_ZWAVE} CROSS_COMPILE=arm-linux-gnueabihf- MACHINE=${ARCH} install

# Setup Cross compiler vars which are used by node-gyp when building native node modules.
OPTS="--sysroot=${SYSROOT}"
export CC="arm-linux-gnueabihf-gcc ${OPTS}"
export CXX="arm-linux-gnueabihf-g++ ${OPTS}"

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

cd gateway
npm --arch=${ARCH} install

# Create a tarball with all of the node modules
tar czf ${NODE_MODULES_TARBALL}  node_modules

# And one with OpenZWave
tar czf ${OPENZWAVE_TARBALL} -C ${SYSROOT} usr/local/include/openzwave usr/local/lib
