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
#   - /build/gateway                - git repository containing the gateway software

set -e

NVM_VERSION="v0.33.8"
NODE_VERSION="--lts=carbon"

GATEWAY=gateway
GATEWAY_TARBALL=gateway.tar.gz

ARCH=armv6l
SYSROOT=/rpxc/sysroot

# Remove the output, if it exists
rm -f ${GATEWAY_TARBALL}

# Clean any previous node modules
rm -rf ${GATEWAY}/node_modules

# Under rpxc /rpxc/sysroot/usr/lib/arm-linux-gnueabihf/libudev.so is
# a symlink back to /lib/arm-linux-gnueabihf/libudev.so.1.5.0 which
# doesn't exist. So we go ahead and create a symlink there and point
# it to the same path under /rpxc/sysroot
#
# My guess is that this would be fine for chrooted apps, but I don't
# think that the cross compilers run chrooted.
LIBUDEV_SO=/lib/arm-linux-gnueabihf/libudev.so.1.5.0
sudo mkdir -p $(dirname ${LIBUDEV_SO})
sudo ln -s ${SYSROOT}/${LIBUDEV_SO} ${LIBUDEV_SO}

# Setup Cross compiler vars which are used by node-gyp when building native node modules.
OPTS="--sysroot=${SYSROOT}"
export CC="arm-linux-gnueabihf-gcc ${OPTS}"
export CXX="arm-linux-gnueabihf-g++ ${OPTS}"

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash
# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# Install development-specific node modules and prerun webpack
(cd ${GATEWAY}; rm -rf node_modules; npm install --ignore-scripts; npm rebuild --arch=${ARCH} --target_arch=arm; node_modules/.bin/webpack)

echo "DEV_BUILD=${DEV_BUILD}"
if [ "${DEV_BUILD}" != "1" ]; then
  # Clear out node_modules just in case then build only the modules we'll use in
  # the image, cross compiling any native code.
  (cd ${GATEWAY}; rm -rf node_modules; npm install --ignore-scripts --production; npm rebuild --arch=${ARCH} --target_arch=arm)
fi

set -x

# Create a tarball with the gateway project, including node_modules
tar czf ${GATEWAY_TARBALL} ${GATEWAY}

echo "Done"
