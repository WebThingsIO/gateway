#!/bin/bash -e

###############################################################################
# GitHub Actions time out after 6 hours. That tends to not be long enough to  #
# build certain packages.                                                     #
#                                                                             #
# To build and push them manually, uncomment the desired packages below and   #
# run the script.                                                             #
###############################################################################

packages=(
  #"fedora:31|fedora-31|x86_64"
  #"arm64v8/fedora:31|fedora-31|aarch64"
  #"fedora:32|fedora-32|x86_64"
  #"arm64v8/fedora:32|fedora-32|aarch64"
  #"fedora:33|fedora-33|x86_64"
  "arm64v8/fedora:33|fedora-33|aarch64"
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
  docker cp -L build:/build/webthings-gateway.rpm "./webthings-gateway-$name-$arch.rpm"
  docker rm build
done
