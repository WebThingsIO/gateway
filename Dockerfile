FROM node:12-buster-slim

EXPOSE 8080 4443

ARG DEBIAN_FRONTEND=noninteractive
RUN set -x && \
    echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
    apt update && \
    apt dist-upgrade -y && \
    apt install -y \
        arping \
        autoconf \
        build-essential \
        ffmpeg \
        git \
        iputils-ping \
        libcap2-bin \
        libffi-dev \
        libnss-mdns \
        libpng-dev \
        libtool \
        lsb-release \
        mosquitto \
        net-tools \
        pkg-config \
        python \
        python-six \
        python3 \
        python3-pip \
        python3-setuptools \
        sudo \
        zlib1g-dev && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -g 997 gpio && \
    usermod -a -G sudo,dialout,gpio node && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

COPY --chown=node:node . /home/node/webthings/gateway/
RUN pip3 install -r /home/node/webthings/gateway/requirements.txt

USER node
WORKDIR /home/node/webthings/gateway
RUN set -x && \
    CPPFLAGS="-DPNG_ARM_NEON_OPT=0" npm ci && \
    ./node_modules/.bin/webpack && \
    rm -rf ./node_modules/gifsicle && \
    rm -rf ./node_modules/mozjpeg && \
    npm prune --production && \
    sed -i \
        -e 's/ behindForwarding: true/ behindForwarding: false/' \
        config/default.js

USER root
RUN cp /home/node/webthings/gateway/tools/udevadm /bin/udevadm && \
    cp /home/node/webthings/gateway/docker/avahi-daemon.conf /etc/avahi/ && \
    cp /home/node/webthings/gateway/docker/init.sh /

ENTRYPOINT ["/init.sh"]
