#!/bin/bash
#
# This script automates a bunch of steps of creating a base image
# for the gateway.
#
# You provide the name of a downloaded Raspbian image file (either the .img
# or the .zip) and it will create a new image file to write. You then
# boot that image on a Raspberry Pi 2, and run the prepare-base.sh script
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*

SCRIPT_NAME=$(basename $0)
VERBOSE=0
ENABLE_CONSOLE=1
ENABLE_WIFI=0
WIFI_SSID=
WIFI_PASSWORD=
ENABLE_SSH=0
HOSTNAME=gateway

###########################################################################
#
# Prints the program usage
#
usage() {
  cat <<END
${SCRIPT_NAME} [OPTION] img-file prep-file

where OPTION can be one of:

  --noconsole     Don't enable the serial console
  --ssh           Enable ssh
  --ssid          Specify the SSID for Wifi access
  --password      Specify the password for wifi access
  --hostname      Specify the hostname
  -h, --help      Print this help
  -v, --verbose   Turn on some verbose reporting
END
}

###########################################################################
#
# Copies the prepare-base.sh and prepare-base-root.sh files to the image
#
copy_prep_files() {
  echo "Copying prepare-base scripts"

  HOME_PI="${ROOT_MOUNTPOINT}/home/pi"

  sudo rm -f "${HOME_PI}"/prepare-base*.sh
  sudo wget --directory-prefix="${HOME_PI}" "https://raw.githubusercontent.com/mozilla-iot/gateway/master/image/prepare-base.sh"
  sudo wget --directory-prefix="${HOME_PI}" "https://raw.githubusercontent.com/mozilla-iot/gateway/master/image/prepare-base-root.sh"
  sudo chmod +x "${HOME_PI}"/prepare-base*.sh
}

###########################################################################
#
# Enables the serial console
#
enable_serial_console() {

  CONFIG=${BOOT_MOUNTPOINT}/config.txt
  if grep -q "enable_uart=1" ${CONFIG} ; then
    echo "Enabling serial console"
    sudo sh -c "cat >> '${CONFIG}'" <<END

enable_uart=1
force_turbo=1
core_freq=250
END
  else
    echo "Serial console appears to already be enabled"
  fi
}

###########################################################################
#
# Enables SSH
#
enable_ssh() {
  echo "Enabling SSH"
  sudo touch ${BOOT_MOUNTPOINT}/ssh
}

###########################################################################
#
# Enables Wifi
#
enable_wifi() {
  echo "Enabling Wifi"
  WPA_CONF=${ROOT_MOUNTPOINT}/wpa_supplicant/wpa_supplicant.conf
  sudo sh -c "cat >> '${CONFIG}'" <<END

network={
  ssid="${WIFI_SSID}"
  password="${WIFI_PASSWORD}"
}
END
}

###########################################################################
#
# Update hostname
#
update_hostname() {
  HOSTS_FILENAME="${ROOT_MOUNTPOINT}/etc/hosts"
  HOSTNAME_FILENAME="${ROOT_MOUNTPOINT}/etc/hostname"
  sudo sh -c "echo '${HOSTNAME}' > '${HOSTNAME_FILENAME}'"
  sudo sed -i "${HOSTS_FILENAME}" -e "s/raspberrypi/${HOSTNAME}/"
}

###########################################################################
#
# Parses command line arguments and run the program.
#
main() {
  while getopts ":vh-:" opt "$@"; do
    case $opt in
      -)
        case "${OPTARG}" in
          noconsole)
            ENABLE_CONSOLE=0
            ;;
          ssh)
            ENABLE_SSH=1
            ;;
          ssid)
            ENABLE_WIFI=1
            WIFI_SSID="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          password)
            ENABLE_WIFI=1
            WIFI_PASSWORD="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          hostname)
            HOSTNAME="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          help)
            usage
            exit 1
            ;;
          verbose)
            VERBOSE=1
            ;;
          *)
            if [ "$OPTERR" = 1 ] && [ "${optspec:0:1}" != ":" ]; then
              echo "Unknown option --${OPTARG}" >&2
              exit 1
            fi
        esac
        ;;
      h)
        usage
        exit 1
        ;;
      v)
        VERBOSE=1
        ;;
      ?)
        echo "Unrecognized option: ${opt}"
        usage
        exit 1
        ;;
      esac
  done
  shift $(( OPTIND - 1 ))

  IMG_FILENAME=$1
  if [ -z "${IMG_FILENAME}" ]; then
    echo "No IMG filename provided."
    exit 1
  fi
  PREP_FILENAME=$2
  if [ -z "${PREP_FILENAME}" ]; then
    echo "No prep filename provided."
    exit 1
  fi

  if [ "${VERBOSE}" == "1" ]; then
    echo "  IMG_FILENAME = ${IMG_FILENAME}"
    echo " PREP_FILENAME = ${PREP_FILENAME}"
    echo "ENABLE_CONSOLE = ${ENABLE_CONSOLE}"
    echo "   ENABLE_WIFI = ${ENABLE_WIFI}"
    echo "     WIFI_SSID = ${WIFI_SSID}"
    echo " WIFI_PASSWORD = ${WIFI_PASSWORD}"
    echo "    ENABLE_SSH = ${ENABLE_SSH}"
  fi

  if [ ! -f "${IMG_FILENAME}" ]; then
    echo "IMG file: '${IMG_FILENAME}' is not a file."
    exit 1
  fi

  if [[ "${IMG_FILENAME}" == *.zip ]]; then
    # Unzip the base image
    echo "Unzipping '${IMG_FILENAME}' to '${PREP_FILENAME}'"
    unzip -p "${IMG_FILENAME}" > "${PREP_FILENAME}"
  else
    # Make a copy of the base image
    echo "Copying '${IMG_FILENAME}' to '${PREP_FILENAME}'"
    cp "${IMG_FILENAME}" "${PREP_FILENAME}"
  fi

  # Figure out the device names that kpartx will create
  declare -a KPARTX_DEVS
  KPARTX_DEVS=($(while read dev rest; do
    echo "/dev/mapper/${dev}"
  done < <(sudo kpartx -v -l "${PREP_FILENAME}")))

  BOOT_DEV=${KPARTX_DEVS[0]}
  ROOT_DEV=${KPARTX_DEVS[1]}

  BOOT_MOUNTPOINT="img-boot"
  ROOT_MOUNTPOINT="img-rootfs"

  if [ "${VERBOSE}" == "1" ]; then
    echo "      BOOT_DEV = ${BOOT_DEV}"
    echo "      ROOT_DEV = ${ROOT_DEV}"
  fi

  # Create the loop mounts
  if sudo kpartx -v -a "${PREP_FILENAME}"; then
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

  echo ""

  if [ "${ENABLE_CONSOLE}" == 1 ]; then
    enable_serial_console
  fi

  if [ "${ENABLE_WIFI}" == 1 ]; then
    enable_wifi
  fi

  if [ "${ENABLE_SSH}" == 1 ]; then
    enable_ssh
  fi

  update_hostname
  copy_prep_files
  sync

  cleanup

  # Because I always forget, print out the commands to upload to aws
  echo ""
  echo "Use a command like the following to write the image:"
  echo "sudo dd status=progress bs=10M if=${PREP_FILENAME} of=/dev/xxx"
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
  if [ -d ${ROOT_MOUNTPOINT} ]; then
    sudo rmdir ${ROOT_MOUNTPOINT}
  fi
  if [ "${BOOT_MOUNTED}" == 1 ]; then
    echo "Unmounting ${BOOT_DEV}"
    sudo umount ${BOOT_MOUNTPOINT}
    BOOT_MOUNTED=0
  fi
  if [ -d ${BOOT_MOUNTPOINT} ]; then
    sudo rmdir ${BOOT_MOUNTPOINT}
  fi
  if [ "${LOOP_MOUNT_CREATED}" == 1 ]; then
    echo "Removing loop mounts"
    sudo kpartx -v -d "${PREP_FILENAME}"
    LOOP_MOUNT_CREATED=0
  fi
}

trap cleanup EXIT

main "$@"
