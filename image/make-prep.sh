#!/bin/bash -e
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
SCRIPT_DIR=$(dirname $0)
VERBOSE=0
ENABLE_CONSOLE=1
ENABLE_I2C=1
ENABLE_WIFI=0
WIFI_SSID=
WIFI_PASSWORD=
ENABLE_SSH=0
HOSTNAME=gateway
PRINT_SUMMARY=0
DD_DEV=
WIFI_COUNTRY=GB

###########################################################################
#
# Prints the program usage
#
usage() {
  cat <<END
${SCRIPT_NAME} [OPTION] raspbian-img-file prep-file

where OPTION can be one of:

  --noconsole       Don't enable the serial console
  --ssh             Enable ssh
  --ssid SSID       Specify the SSID for Wifi access
  --password PWD    Specify the password for wifi access
  --wifi-country CC Specify the WiFi country code to use (default: GB)
  --no-i2c          Disable I2C bus
  --hostname NAME   Specify the hostname
  --dd DEV          Issue a dd command to copy the image to an sdcard
  --summary         Print summary of changed files
  -h, --help        Print this help
  -v, --verbose     Turn on some verbose reporting
  -x                Does a 'set -x'
END
}

###########################################################################
#
# Copies the prepare-base.sh and prepare-base-root.sh files to the image
#
copy_prep_files() {
  echo "Copying prepare-base scripts and config files"

  HOME_PI="${ROOT_MOUNTPOINT}/home/pi"

  sudo rm -f "${HOME_PI}"/prepare-base*.sh
  sudo cp "${SCRIPT_DIR}"/prepare-base.sh "${HOME_PI}"
  sudo cp -r "${SCRIPT_DIR}"/etc "${HOME_PI}"
  sudo chmod +x "${HOME_PI}"/prepare-base.sh
}

###########################################################################
#
# Enables the serial console
#
enable_serial_console() {
  CONFIG=${BOOT_MOUNTPOINT}/config.txt
  if grep -q "enable_uart=1" ${CONFIG} ; then
    echo "Serial console appears to already be enabled"
  else
    echo "Enabling serial console"
    sudo sh -c "cat >> '${CONFIG}'" <<END

enable_uart=1
force_turbo=1
core_freq=250
END
  fi
}

###########################################################################
#
# Enables the I2C bus
#
enable_i2c_bus() {
  CONFIG="${BOOT_MOUNTPOINT}/config.txt"
  local pattern="dtparam=i2c_arm=on"
  if grep -q "$pattern" ${CONFIG} ; then
    sudo sed -i "s/.*$pattern/$pattern/g" "${CONFIG}"
  else
    echo "Enabling I2C bus"
    sudo sh -c "cat >> '${CONFIG}'" <<END

$pattern
END
  fi

  CONF="${ROOT_MOUNTPOINT}/etc/modules"
  if sudo grep -q "i2c-dev" "${CONF}"; then
    sudo sed -i "s/.*i2c-dev/i2c-dev/g" "${CONF}"
  else
    sudo sh -c "cat >> '${CONF}'" <<END

i2c-dev
END
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
  WPA_CONF=${ROOT_MOUNTPOINT}/etc/wpa_supplicant/wpa_supplicant.conf
  if sudo grep -q 'ssid="'${WIFI_SSID}'"' "${WPA_CONF}"; then
    echo "Wifi appears to already be enabled for '${WIFI_SSID}'"
  else
    echo "Enabling Wifi for SSID '${WIFI_SSID}'"
    sudo sh -c "cat >> '${WPA_CONF}'" <<END

network={
  ssid="${WIFI_SSID}"
  psk="${WIFI_PASSWORD}"
}
END
  fi
}

###########################################################################
#
# Sets the Wifi Country
#
# With raspbian releases from 2018-03-13 onwards, wifi won't be enabled
# until the country code is set. This means that we can't even run our
# first time setup, so we go back to the behaviour of previous releases
# which default the country to GB.
#
set_wifi_country() {
  WPA_CONF=${ROOT_MOUNTPOINT}/etc/wpa_supplicant/wpa_supplicant.conf

  if sudo grep -q "^country=" "${WPA_CONF}"; then
    sudo sed -i "s/country=.*/country=${WIFI_COUNTRY}/g" ${WPA_CONF}
  else
    sudo sed -i "1i country=${WIFI_COUNTRY}" ${WPA_CONF}
  fi
}

###########################################################################
#
# Prints a summary of the files touched by this script
#
print_summary() {

  echo "#############################"
  echo "########## SUMMARY ##########"
  echo "#############################"
  echo "===== ls boot/ssh ====="
  ls -l "${BOOT_MOUNTPOINT}/ssh"

  echo "===== boot/config.txt ====="
  tail -6 "${BOOT_MOUNTPOINT}/config.txt"

  echo "===== rootfs/etc/hostname ====="
  cat "${ROOT_MOUNTPOINT}/etc/hostname"

  echo "===== rootfs/etc/hosts ====="
  cat "${ROOT_MOUNTPOINT}/etc/hosts"

  echo "===== rootfs/etc/wpa_supplicant/wpa_supplicant.conf ====="
  sudo cat "${ROOT_MOUNTPOINT}/etc/wpa_supplicant/wpa_supplicant.conf"

  echo "===== ls rootfs/home/pi"
  ls -l "${ROOT_MOUNTPOINT}/home/pi"
  echo "#############################"
}

###########################################################################
#
# Update hostname
#
update_hostname() {
  HOSTS_FILENAME="${ROOT_MOUNTPOINT}/etc/hosts"
  HOSTNAME_FILENAME="${ROOT_MOUNTPOINT}/etc/hostname"
  OLD_HOSTNAME="$(cat ${HOSTNAME_FILENAME})"

  echo "Updating hostname from '${OLD_HOSTNAME}' to '${HOSTNAME}'"

  sudo sh -c "echo '${HOSTNAME}' > '${HOSTNAME_FILENAME}'"
  sudo sed -i "${HOSTS_FILENAME}" -e "s/${OLD_HOSTNAME}/${HOSTNAME}/g"
}

###########################################################################
#
# Writes the image file to the sdcard
#
write_image() {
  # Unmount anything on the destination device
  mount | grep "${DD_DEV}" | while read dev rest; do
    echo "Unmounting '${dev}'"
    sudo umount "${dev}"
  done
  echo "Writing image '${PREP_FILENAME}' to '${DD_DEV}'"
  args="status=progress"
  dd if=/dev/zero of=/dev/null $args count=1 > /dev/null 2>&1 || args=""
  sudo dd bs=10M if="${PREP_FILENAME}" of="${DD_DEV}" $args
}

###########################################################################
#
# Parses command line arguments and run the program.
#
main() {
  while getopts ":vhx-:" opt "$@"; do
    case $opt in
      -)
        case "${OPTARG}" in
          dd)
            DD_DEV="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          help)
            usage
            exit 1
            ;;
          hostname)
            HOSTNAME="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          no-i2c)
            ENABLE_I2C=0
            ;;
          noconsole)
            ENABLE_CONSOLE=0
            ;;
          password)
            ENABLE_WIFI=1
            WIFI_PASSWORD="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          ssh)
            ENABLE_SSH=1
            ;;
          ssid)
            ENABLE_WIFI=1
            WIFI_SSID="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          summary)
            PRINT_SUMMARY=1
            ;;
          verbose)
            VERBOSE=1
            ;;
          wifi-country)
            WIFI_COUNTRY="${!OPTIND}"
            OPTIND=$(( OPTIND + 1 ))
            ;;
          *)
            if [ "$OPTERR" = 1 ] && [ "${optspec:0:1}" != ":" ]; then
              echo "Unknown option --${OPTARG}" >&2
              echo ""
              usage
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
      x)
        set -x
        ;;
      ?)
        echo "Unrecognized option: ${opt}"
        echo ""
        usage
        exit 1
        ;;
      esac
  done
  shift $(( OPTIND - 1 ))

  IMG_FILENAME=$1
  if [ -z "${IMG_FILENAME}" ]; then
    echo "No IMG filename provided."
    echo ""
    usage
    exit 1
  fi
  PREP_FILENAME=$2
  if [ -z "${PREP_FILENAME}" ]; then
    echo "No prep filename provided."
    echo ""
    usage
    exit 1
  fi

  if [ "${VERBOSE}" == "1" ]; then
    echo "  IMG_FILENAME = ${IMG_FILENAME}"
    echo " PREP_FILENAME = ${PREP_FILENAME}"
    echo "ENABLE_CONSOLE = ${ENABLE_CONSOLE}"
    echo "    ENABLE_I2C = ${ENABLE_I2C}"
    echo "   ENABLE_WIFI = ${ENABLE_WIFI}"
    echo "     WIFI_SSID = ${WIFI_SSID}"
    echo " WIFI_PASSWORD = ${WIFI_PASSWORD}"
    echo "  WIFI_COUNTRY = ${WIFI_COUNTRY}"
    echo "    ENABLE_SSH = ${ENABLE_SSH}"
    echo "        DD_DEV = ${DD_DEV}"
  fi

  if [ ! -z "${DD_DEV}" ]; then
    DD_NAME=$(basename ${DD_DEV})
    if [[ "${DD_DEV:0:1}" != '/' ]]; then
      DD_DEV="/dev/${DD_DEV}"
    fi
    REMOVABLE=$(cat /sys/block/${DD_NAME}/removable)
    if [ "${REMOVABLE}" != "1" ]; then
      echo "${DD_DEV} isn't a removable drive"
      exit 1
    fi
    MEDIA_SIZE=$(cat /sys/block/${DD_NAME}/size)
    if [ "${MEDIA_SIZE}" == "0" ]; then
      echo "No media present at ${DD_DEV}"
      exit 1
    fi
    if [ $(( ${MEDIA_SIZE} / 2048 / 1024 )) -gt 100 ]; then
      echo "${DD_DEV} media size is larger than 100 Gb - wrong device?"
      exit 1
    fi
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
  done < <(sudo kpartx -l "${PREP_FILENAME}")))

  BOOT_DEV=${KPARTX_DEVS[0]}
  ROOT_DEV=${KPARTX_DEVS[1]}

  BOOT_MOUNTPOINT="img-boot"
  ROOT_MOUNTPOINT="img-rootfs"

  if [ "${VERBOSE}" == "1" ]; then
    echo "      BOOT_DEV = ${BOOT_DEV}"
    echo "      ROOT_DEV = ${ROOT_DEV}"
  fi

  # Create the loop mounts
  if sudo kpartx -a "${PREP_FILENAME}"; then
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

  # Mount the boot partition of the image
  mkdir -p ${BOOT_MOUNTPOINT}
  if sudo mount ${BOOT_DEV} ${BOOT_MOUNTPOINT}; then
    echo "Boot partition mounted successfully"
  else
    echo "Failed to mount boot partition"
    exit 1
  fi
  BOOT_MOUNTED=1

  # Mount the root partition of the image
  mkdir -p ${ROOT_MOUNTPOINT}
  if sudo mount ${ROOT_DEV} ${ROOT_MOUNTPOINT}; then
    echo "Root partition mounted successfully"
  else
    echo "Failed to mount root partition"
    exit 1
  fi
  ROOT_MOUNTED=1

  echo ""

  set_wifi_country

  if [ "${ENABLE_CONSOLE}" == 1 ]; then
    enable_serial_console
  fi

  if [ "${ENABLE_I2C}" == 1 ]; then
    enable_i2c_bus
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

  if [ "${PRINT_SUMMARY}" == 1 ]; then
    print_summary
  fi

  # Adding a sleep here helps ensure that the mounted directories are
  # not actually still in use.
  sleep 3

  cleanup

  if [ ! -z "${DD_DEV}" ]; then
    write_image
  fi
}

###########################################################################
#
# Do required cleanup. We use a trap so that if the script dies for any
# reason then we'll still undo whatever is needed.
#
function cleanup() {

  # Note: If for some reason, the unmount or removal of the loop mounts
  #       fail, then you can use the following command to see what
  # loop mounts still exist:
  #
  #   sudo dmsetup ls
  #
  # and remove it manually using something like (after unmounting manually):
  #
  #   sudo dmsetup remove loop1p2

  if [ "${ROOT_MOUNTED}" == 1 ]; then
    echo "Unmounting ${ROOT_DEV}"
    sudo umount "${ROOT_MOUNTPOINT}"
    ROOT_MOUNTED=0
  fi
  if [ ! -z "${ROOT_MOUNTPOINT}" -a -d "${ROOT_MOUNTPOINT}" ]; then
    sudo rmdir "${ROOT_MOUNTPOINT}"
  fi
  if [ "${BOOT_MOUNTED}" == 1 ]; then
    echo "Unmounting ${BOOT_DEV}"
    sudo umount "${BOOT_MOUNTPOINT}"
    BOOT_MOUNTED=0
  fi
  if [ ! -z "${BOOT_MOUNTPOINT}" -a -d "${BOOT_MOUNTPOINT}" ]; then
    sudo rmdir "${BOOT_MOUNTPOINT}"
  fi
  if [ "${LOOP_MOUNT_CREATED}" == 1 ]; then
    echo "Removing loop mounts"
    sudo kpartx -d "${PREP_FILENAME}"
    LOOP_MOUNT_CREATED=0
  fi
}

trap cleanup EXIT

main "$@"
