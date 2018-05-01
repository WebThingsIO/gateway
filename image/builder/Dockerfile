FROM sdthirlwall/raspberry-pi-cross-compiler

ARG NVM_VERSION="v0.33.8"
ARG NODE_VERSION="--lts"

# Install binary packages
RUN set -x &&\
        apt-get update &&\
        apt-get -y upgrade &&\
        rpdo apt-get update &&\
        rpdo apt-get -y upgrade &&\
        install-raspbian -y libudev-dev &&\
        install-raspbian -y libpng-dev &&\
        install-raspbian -y autoconf &&\
        install-raspbian -y curl &&\
        install-raspbian -y pkg-config &&\
        install-raspbian -y python &&\
        install-raspbian -y python2.7 &&\
        install-raspbian -y git &&\
        install-raspbian -y build-essential

# Make device files on sysroot.
ADD makeproc.sh /usr/bin/makeproc.sh
RUN set -x &&\
        makeproc.sh &&\
        chmod 666 /rpxc/sysroot/dev/null &&\
        mknod -m 644 /rpxc/sysroot/dev/random c 1 8 &&\
        mknod -m 644 /rpxc/sysroot/dev/urandom c 1 9 &&\
        chown root:root /rpxc/sysroot/dev/random /rpxc/sysroot/dev/urandom

RUN set -x &&\
        rpdo ln -f -s /bin/bash /bin/sh

# Add user for build
ADD rpdo /usr/bin/rpdo
RUN set -x &&\
        rpdo useradd -m builder

ENV RPXC_UID builder
ENV HOME /home/builder
RUN set -x &&\
        rpdo curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | rpdo bash &&\
        rpdo "source $HOME/.nvm/nvm.sh && nvm install ${NODE_VERSION}" &&\
        rpdo "source $HOME/.nvm/nvm.sh && nvm use ${NODE_VERSION}" &&\
        rpdo "source $HOME/.nvm/nvm.sh && npm config set unsafe-perm true" &&\
        rpdo "source $HOME/.nvm/nvm.sh && npm install -g yarn"
