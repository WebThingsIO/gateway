FROM sdthirlwall/raspberry-pi-cross-compiler

ARG NVM_VERSION="v0.33.8"
ARG NODE_VERSION="--lts"
ADD makeproc.sh /usr/bin/makeproc.sh
ADD rpdo /usr/bin/rpdo

# Install binary packages
RUN set -x &&\
        apt-get -y update &&\
        rpdo apt-get -y update &&\
        install-raspbian -y \
                libudev-dev \
                libpng-dev \
                autoconf \
                libtool \
                curl \
                pkg-config \
                python \
                python2.7 \
                git \
                build-essential &&\
        install-debian -y \
                pkg-config \
                python \
                python2.7 &&\
# cleanup
        rpdo "apt-get clean" &&\
        rpdo "rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*" &&\
# Make device files on sysroot.
        makeproc.sh &&\
        chmod 666 /rpxc/sysroot/dev/null &&\
        mknod -m 644 /rpxc/sysroot/dev/random c 1 8 &&\
        mknod -m 644 /rpxc/sysroot/dev/urandom c 1 9 &&\
        chown root:root /rpxc/sysroot/dev/random /rpxc/sysroot/dev/urandom &&\
        rpdo "ln -f -s /bin/bash /bin/sh" &&\
# Add user for build
        rpdo useradd -m builder

# Install nvm for native compile
ENV RPXC_UID builder
ENV HOME /home/builder
RUN set -x &&\
        rpdo curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | rpdo bash &&\
        rpdo "source $HOME/.nvm/nvm.sh && nvm install ${NODE_VERSION}" &&\
        rpdo "source $HOME/.nvm/nvm.sh && nvm use ${NODE_VERSION}" &&\
        rpdo "source $HOME/.nvm/nvm.sh && npm config set unsafe-perm true"
