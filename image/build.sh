#!/bin/bash -e

here=$(readlink -f $(dirname "$0"))
cd "${here}"

# clean up any remnants from the previous build
rm -rf pi-gen
docker rm -v pigen_work >/dev/null 2>&1 || true
compgen -G "gateway*" >/dev/null && rm -rf gateway* || true
compgen -G "node_modules*" >/dev/null && rm -rf node_modules* || true

# copy the gateway source
_temp=$(mktemp -d)
cp -a "${here}/.." "${_temp}"

# get a fresh copy of pi-gen
git clone https://github.com/RPi-Distro/pi-gen.git

# replace stage3 and add our config and the gateway source
rm -rf pi-gen/stage3
cp -r config stage3 pi-gen
mkdir pi-gen/stage3/03-add-gateway/files
mv "${_temp}" pi-gen/stage3/03-add-gateway/files/gateway
rm -rf pi-gen/stage3/03-add-gateway/files/gateway/{.git,image,node_modules}

cd pi-gen

# fix 32-/64-bit issue: https://github.com/RPi-Distro/pi-gen/issues/271
if sed --version 2>&1 | grep -q GNU; then
  sed -i 's_FROM debian:buster_FROM i386/debian:buster_' Dockerfile
else
  sed -i '' 's_FROM debian:buster_FROM i386/debian:buster_' Dockerfile
fi

# skip stage4 and stage5
touch ./stage4/SKIP ./stage5/SKIP
touch ./stage2/SKIP_IMAGES ./stage4/SKIP_IMAGES ./stage5/SKIP_IMAGES

# build it
PRESERVE_CONTAINER=1 ./build-docker.sh

cd "${here}"

# rename the image
_version="$(node -e "console.log(require('../package.json').version)")"
_image_name=$(basename $(ls -1 pi-gen/deploy/*.zip))
_image_name=${_image_name/image_/}
_image_name=${_image_name/.zip/}
mv pi-gen/deploy/*.zip "gateway-${_version}.img.zip"
shasum --algorithm 256 "gateway-${_version}.img.zip" > "gateway-${_version}.img.zip.sha256sum"

# copy the built gateway out of the docker image
docker cp "pigen_work:/pi-gen/work/${_image_name}/stage3/rootfs/home/pi/mozilla-iot/gateway" .

makeContentAddressedArchive() {
  base_name="$1"
  digest=$(openssl dgst -sha256 "${base_name}.tar.gz" | awk '{print $2}')
  mv "${base_name}.tar.gz" "${base_name}-${digest}.tar.gz"
}

# generate the OTA release files
mv gateway/node_modules node_modules
tar czf gateway.tar.gz gateway
tar czf node_modules.tar.gz node_modules
makeContentAddressedArchive node_modules
makeContentAddressedArchive gateway

# clean up
rm -rf gateway node_modules pi-gen
docker rm -v pigen_work
