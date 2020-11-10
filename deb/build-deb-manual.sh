#!/bin/bash -e

###############################################################################
# GitHub Actions time out after 6 hours. That tends to not be long enough to  #
# build certain packages.                                                     #
#                                                                             #
# To build and push them manually, uncomment the desired packages below and   #
# run the script.                                                             #
###############################################################################

packages=(
  #"ubuntu:bionic|ubuntu-bionic|amd64"
  #"arm64v8/ubuntu:bionic|ubuntu-bionic|arm64"
  #"ubuntu:focal|ubuntu-focal|amd64"
  #"arm64v8/ubuntu:focal|ubuntu-focal|arm64"
  #"ubuntu:groovy|ubuntu-groovy|amd64"
  #"arm64v8/ubuntu:groovy|ubuntu-groovy|arm64"
  #"debian:buster|debian-buster|amd64"
  #"arm64v8/debian:buster|debian-buster|arm64"
  "balenalib/raspberry-pi-debian:buster-20200405|raspbian-buster|armhf"
)

here=$(readlink -f $(dirname "$0"))

# Generate the source tarball
cd "$here/.."
git clean -Xdf
cd "$here"
./generate-tarball.sh

for package in ${packages[@]}; do
  echo "$package"
  image=$(echo "$package" | cut -d\| -f1)
  name=$(echo "$package" | cut -d\| -f2)
  arch=$(echo "$package" | cut -d\| -f3)

  echo
  echo "Building: $name ($arch)"

  docker pull "$image"
  docker create --name build -it "$image" /build/build.sh
  docker cp . build:/build
  docker start -a build
  docker cp -L build:/build/webthings-gateway.deb "./webthings-gateway-$name-$arch.deb"
  docker rm build
done
