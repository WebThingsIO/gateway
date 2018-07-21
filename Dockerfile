#!/bin/echo docker build . -f
# -*- coding: utf-8 -*-
#{
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/ .
#}
# WARNING: this docker file is *ONLY* for developer convenience
# WARNING: for production deployment please consider supported project:
# WARNING: https://github.com/mozilla-iot/gateway-docker

FROM debian:stable
LABEL maintainer="p.coval@samsung.com"

ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL en_US.UTF-8
ENV LANG ${LC_ALL}

RUN echo "#log: Configuring locales" \
  && set -x \
  && apt-get update -y \
  && apt-get install -y locales \
  && echo "${LC_ALL} UTF-8" | tee /etc/locale.gen \
  && locale-gen ${LC_ALL} \
  && dpkg-reconfigure locales \
  && sync

ENV project mozilla-iot

RUN echo "#log: ${project}: Setup system" \
  && set -x \
  && apt-get update -y \
  && apt-get install -y \
  sudo \
  && apt-get clean \
  && sync

ADD . /root/mozilla-iot/gateway
WORKDIR /root/mozilla-iot/gateway/..
RUN echo "#log: ${project}: Preparing sources" \
  && set -x \
  && ./gateway/install.sh \
  && sync

EXPOSE 8080
WORKDIR /root/mozilla-iot/gateway
CMD [ "./run-app.sh" ]
