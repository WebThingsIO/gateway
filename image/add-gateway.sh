#!/bin/bash -e
#
# This script takes a base image and adds the gateway code to make
# the final gateway image.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*

SCRIPT_NAME=$(basename $0)
VERBOSE=0
REMOVE_BASE_AFTER_UNZIP=0

GATEWAY_VERSION='0.8.0'
V8_VERSION='57'
ARCHITECTURE='linux-arm'
PYTHON_VERSIONS='2.7,3.5'
ADDON_API='2'
ADDON_LIST_URL='https://api.mozilla-iot.org:8443/addons'

###########################################################################
#
# Prints the program usage
#

usage() {
  echo "Usage: ${SCRIPT_NAME} [-v] [-g gateway-tarball] BASE_IMAGE"
}

###########################################################################
#
# Retrieves the addon URL from the addon list
#
get_addon_url() {
  addon_list=$1
  addon_name=$2
  url=$(echo "${addon_list}" | python3 -c \
    "import json, sys; \
    l = json.loads(sys.stdin.read()); \
    print([p['url'] for p in l if p['name'] == '${addon_name}'][0]);")
  echo "${url}"
}


###########################################################################
#
# Parses command line arguments and run the program.
#
main() {

  while getopts "g:ho:rv" opt "$@"; do
    case $opt in
      g)
        GATEWAY_TARBALL=${OPTARG}
        ;;
      r)
        REMOVE_BASE_AFTER_UNZIP=1
        ;;
      v)
        VERBOSE=1
        ;;
      h)
        usage
        exit 1
        ;;
      ?)
        echo "Unrecognized option: ${opt}"
        usage
        exit 1
        ;;
      esac
  done
  shift $((${OPTIND} - 1))
  BASE_IMAGE=$1
  if [ -z "${BASE_IMAGE}" ]; then
    echo "No base image provided."
    usage
    exit 1
  fi

  if [ "${VERBOSE}" == "1" ]; then
    echo "             Base Image: ${BASE_IMAGE}"
    echo "        Gateway tarball: ${GATEWAY_TARBALL}"
    echo "Remove base after unzip: ${REMOVE_BASE_AFTER_UNZIP}"
  fi

  if [ ! -f "${BASE_IMAGE}" ]; then
    echo "Base Image: '${BASE_IMAGE}' not a file."
    exit 1
  fi

  if [ ! -z "${GATEWAY_TARBALL}" -a ! -f "${GATEWAY_TARBALL}" ]; then
    echo "Gateway tarball '${GATEWAY_TARBALL}' not found".
    exit 1
  fi

  GATEWAY_IMAGE="${BASE_IMAGE/-base/}"
  if [ "${GATEWAY_IMAGE}" == "${BASE_IMAGE}" ]; then
    echo "BASE image name doesn't have '-base' in it"
    exit 1
  fi

  if [[ "${BASE_IMAGE}" == *.zip ]]; then
    # Unzip the base image
    GATEWAY_IMAGE="${GATEWAY_IMAGE/.img.zip/.img}"
    echo "Unzipping '${BASE_IMAGE}' to '${GATEWAY_IMAGE}'"
    unzip -p "${BASE_IMAGE}" > "${GATEWAY_IMAGE}"
  else
    # Make a copy of the base image
    echo "Copying '${BASE_IMAGE}' to '${GATEWAY_IMAGE}'"
    cp "${BASE_IMAGE}" "${GATEWAY_IMAGE}"
  fi
  if [ "${REMOVE_BASE_AFTER_UNZIP}" = "1" ]; then
    echo "Removing base image: ${BASE_IMAGE}"
    rm -f "${BASE_IMAGE}"
  fi

  # Figure out the device names that kpartx will create
  declare -a KPARTX_DEVS
  KPARTX_DEVS=($(while read dev rest; do
    echo "/dev/mapper/${dev}"
  done < <(sudo kpartx -v -l "${GATEWAY_IMAGE}")))

  BOOT_DEV=${KPARTX_DEVS[0]}
  ROOT_DEV=${KPARTX_DEVS[1]}

  ROOT_MOUNTPOINT=rpi-root
  BOOT_MOUNTPOINT=rpi-boot
  MOZILLA_IOT_DIR=${ROOT_MOUNTPOINT}/home/pi/mozilla-iot
  MOZILLA_IOT_PROFILE_DIR=${ROOT_MOUNTPOINT}/home/pi/.mozilla-iot
  ADDONS_DIR=${MOZILLA_IOT_PROFILE_DIR}/addons
  ETC_DIR=${ROOT_MOUNTPOINT}/etc
  CMDLINE=${BOOT_MOUNTPOINT}/cmdline.txt

  if [ "${VERBOSE}" == "1" ]; then
    echo "          BOOT_DEV: ${BOOT_DEV}"
    echo "          ROOT_DEV: ${ROOT_DEV}"
  fi

  # Create the loop mounts
  if sudo kpartx -v -a "${GATEWAY_IMAGE}"; then
    # It seems that there is sometimes a race and that the loop files don't
    # always exist by the time kpartx exits, so we wait until we actually
    # see the loop file before continuing.
    iter=0
    while [ ! -e ${ROOT_DEV} ]; do
      echo "Waiting for loop mount to be created"
      sleep 1
      iter=$(( ${iter} + 1 ))
      if [ ${iter} -gt 5 ]; then
        echo "Timeout waiting for loop mount"
        exit 1
      fi
    done
    echo "Loop mounts created successfully"
  else
    echo "Failed to create loop mounts"
    exit 1
  fi
  LOOP_MOUNT_CREATED=1

  # Mount the boot parition of the image
  mkdir -p ${BOOT_MOUNTPOINT}
  if sudo mount ${BOOT_DEV} ${BOOT_MOUNTPOINT}; then
    echo "Boot partition mounted successfully"
  else
    echo "Failed to mount boot partition"
    exit 1
  fi
  BOOT_MOUNTED=1

  # Mount the root parition of the image
  mkdir -p ${ROOT_MOUNTPOINT}
  if sudo mount ${ROOT_DEV} ${ROOT_MOUNTPOINT}; then
    echo "Root partition mounted successfully"
  else
    echo "Failed to mount root partition"
    exit 1
  fi
  ROOT_MOUNTED=1

  if [ ! -z "${GATEWAY_TARBALL}" ]; then
    # Copy in the gateway files
    echo "Adding gateway files from ${GATEWAY_TARBALL} to image"
    sudo mkdir -p ${MOZILLA_IOT_DIR}
    sudo mkdir -p ${MOZILLA_IOT_PROFILE_DIR}
    sudo tar xf ${GATEWAY_TARBALL} -C ${MOZILLA_IOT_DIR}

    # Install default add-ons
    sudo mkdir -p "${ADDONS_DIR}"
    params="?api=${ADDON_API}&arch=${ARCHITECTURE}&node=${V8_VERSION}&python=${PYTHON_VERSIONS}&version=${GATEWAY_VERSION}"
    addon_list=$(curl "${ADDON_LIST_URL}${params}")
    tempdir=$(mktemp -d)
    zigbee_url=$(get_addon_url "${addon_list}" 'zigbee-adapter')
    curl -L -o "${tempdir}/zigbee-adapter.tgz" "${zigbee_url}"
    sudo tar xzf "${tempdir}/zigbee-adapter.tgz" -C "${ADDONS_DIR}"
    sudo mv "${ADDONS_DIR}/package" "${ADDONS_DIR}/zigbee-adapter"
    zwave_url=$(get_addon_url "${addon_list}" 'zwave-adapter')
    curl -L -o "${tempdir}/zwave-adapter.tgz" "${zwave_url}"
    sudo tar xzf "${tempdir}/zwave-adapter.tgz" -C "${ADDONS_DIR}"
    sudo mv "${ADDONS_DIR}/package" "${ADDONS_DIR}/zwave-adapter"
    thing_url=$(get_addon_url "${addon_list}" 'thing-url-adapter')
    curl -L -o "${tempdir}/thing-url-adapter.tgz" "${thing_url}"
    sudo tar xzf "${tempdir}/thing-url-adapter.tgz" -C "${ADDONS_DIR}"
    sudo mv "${ADDONS_DIR}/package" "${ADDONS_DIR}/thing-url-adapter"
    rm -rf "${tempdir}"

    # Create the .post_upgrade_complete file so that it doesn't try
    # to upgrade on the first boot.

    sudo touch ${MOZILLA_IOT_DIR}/gateway/.post_upgrade_complete

    # Setup things so that the filesystem gets resized on the next boot.
    sudo ln -s "../init.d/resize2fs_once" "${ETC_DIR}/rc3.d/S01resize2fs_once"

    if ! grep -q 'init_resize.sh' ${CMDLINE} ; then
      sudo sed -i ${CMDLINE} -e 's@$@ quiet init=/usr/lib/raspi-config/init_resize.sh@'
    fi

    # The pi user has a user id of 1000 and a group id of 1000
    echo "Fixing permissions on ${MOZILLA_IOT_DIR}"
    sudo chown -R 1000.1000 ${MOZILLA_IOT_DIR}
    echo "Fixing permissions on ${MOZILLA_IOT_PROFILE_DIR}"
    sudo chown -R 1000.1000 ${MOZILLA_IOT_PROFILE_DIR}
  fi

  if false; then
    echo "Contents of ${MOZILLA_IOT_DIR}"
    ls -l ${MOZILLA_IOT_DIR}
    echo "Contents of ${MOZILLA_IOT_DIR}/gateway"
    ls -l ${MOZILLA_IOT_DIR}/gateway
    echo "Contents of ${ROOT_MOUNTPOINT}/usr/local/lib"
    ls -l ${ROOT_MOUNTPOINT}/usr/local/lib
  fi

  df -h "${BOOT_MOUNTPOINT}"
  df -h "${ROOT_MOUNTPOINT}"

  cleanup

  echo "Created gateway image:     ${GATEWAY_IMAGE}"
}

###########################################################################
#
# Do required cleanup. We use a trap so that if the script dies for any
# reason then we'll still undo whatever is needed.
#
function cleanup() {
  if [ "${ROOT_MOUNTED}" == 1 ]; then
    echo "Unmounting ${ROOT_DEV}"
    sudo umount ${ROOT_MOUNTPOINT}
    ROOT_MOUNTED=0
  fi
  if [ -n "${ROOT_MOUNTPOINT}" -a -d "${ROOT_MOUNTPOINT}" ]; then
    echo "Removing root mountpoint ${ROOT_MOUNTPOINT}"
    sudo rmdir "${ROOT_MOUNTPOINT}"
  fi
  if [ "${BOOT_MOUNTED}" == 1 ]; then
    echo "Unmounting ${BOOT_DEV}"
    sudo umount ${BOOT_MOUNTPOINT}
    BOOT_MOUNTED=0
  fi
  if [ -n "${BOOT_MOUNTPOINT}" -a -d "${BOOT_MOUNTPOINT}" ]; then
    echo "Removing boot mountpoint ${BOOT_MOUNTPOINT}"
    sudo rmdir "${BOOT_MOUNTPOINT}"
  fi
  if [ "${LOOP_MOUNT_CREATED}" == 1 ]; then
    echo "Removing loop mounts"
    sudo kpartx -v -d "${GATEWAY_IMAGE}"
    LOOP_MOUNT_CREATED=0
  fi
}

trap cleanup EXIT

main "$@"
