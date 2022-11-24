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

# clone the buster branch from our fork of the pi-gen repo
# Temporarily forked to enable setting capabilities inside chroot
# See https://github.com/WebThingsIO/gateway/issues/2985
git clone --branch buster https://github.com/WebThingsIO/pi-gen.git

# replace stage3 and add our config and the gateway source
rm -rf pi-gen/stage3
cp -r config stage3 pi-gen
mkdir pi-gen/stage3/03-add-gateway/files
mv "${_temp}" pi-gen/stage3/03-add-gateway/files/gateway
rm -rf pi-gen/stage3/03-add-gateway/files/gateway/{.git,node_modules}

cd pi-gen

# fix 32-/64-bit issue: https://github.com/RPi-Distro/pi-gen/issues/271
if sed --version 2>&1 | grep -q GNU; then
  sed -i 's_FROM debian:buster_FROM i386/debian:buster_' Dockerfile
else
  sed -i '' 's_FROM debian:buster_FROM i386/debian:buster_' Dockerfile
fi

# skip stage4
touch ./stage4/SKIP
touch ./stage2/SKIP_IMAGES ./stage4/SKIP_IMAGES
 
# skip stage5
# Commented out because there is no stage5 on the 2022-09-22-raspios-buster branch
#touch ./stage5/SKIP
#touch ./stage5/SKIP_IMAGES

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

# Unzip the gateway image to extract gateway directory for OTA update
unzip gateway-${_version}.img.zip
# Map partitions from image and read name of last partition which should be the Linux one
_partition=$(sudo kpartx -av *-Raspbian.img | awk '{print $3}' | tail -n 1)
# Mount the partition
sudo mkdir -p /mnt/gateway-${_version}
sudo mount /dev/mapper/${_partition} /mnt/gateway-${_version}
# Copy the gateway folder out of the partition to the current directory
cp -r /mnt/gateway-${_version}/home/pi/webthings/gateway .

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
sudo umount /mnt/gateway-${_version}
sudo rm -rf /mnt/gateway-${_version}
rm -rf gateway node_modules pi-gen *-Raspbian.img
docker rm -v pigen_work
