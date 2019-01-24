#!/bin/bash
#
# This script copies an image from an sdcard, zips it up, creates the
# sha256sum file and copies the 2 files to AWS.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*

SCRIPT_NAME=$(basename $0)
VERBOSE=0
DD_DEV=
DO_ZIP=1

###########################################################################
#
# Prints the program usage
#
usage() {
  cat <<END
${SCRIPT_NAME} [OPTION] base-img-file

where OPTION can be one of:

  --dd DEV        Issue a dd command to copy the image from an sdcard
  --nozip         Skip creating the zip file
  -h, --help      Print this help
  -v, --verbose   Turn on some verbose reporting
  -x              Does a 'set -x'
END
}

###########################################################################
#
# Writes the image file to the sdcard
#
image_to_aws() {
  if [[ "${IMG_FILENAME}" = *base* ]]; then
    AWS_SUBDIR="base"
  else
    AWS_SUBDIR="images"
  fi
  AWS_DIR="s3://mozillagatewayimages/${AWS_SUBDIR}/"
  echo "Copying image files to '${AWS_DIR}'"
  aws s3 cp --acl=public-read "${IMG_FILENAME}.zip" "${AWS_DIR}"
  aws s3 cp --acl=public-read "${IMG_FILENAME}.zip.sha256sum" "${AWS_DIR}"

  echo "AWS URLs"
  echo "https://s3-us-west-1.amazonaws.com/mozillagatewayimages/${AWS_SUBDIR}/${IMG_FILENAME}.zip"
  echo "https://s3-us-west-1.amazonaws.com/mozillagatewayimages/${AWS_SUBDIR}/${IMG_FILENAME}.zip.sha256sum"
}

###########################################################################
#
# Writes the image file to the sdcard
#
read_image() {
  # Unmount anything on the source device
  mount | grep "${DD_DEV}" | while read dev rest; do
    echo "Unmounting '${dev}'"
    sudo umount "${dev}"
  done
  echo "Reading image from '${DD_DEV}' to '${IMG_FILENAME}'"
  sudo dd status=progress bs=10M if="${DD_DEV}" of="${IMG_FILENAME}"
}

###########################################################################
#
# Creates a zip file and the corresponding .sha256sum file.
#
zip_image() {
  echo "Creating ${IMG_FILENAME}.zip"
  rm -f "${IMG_FILENAME}.zip"
  zip "${IMG_FILENAME}.zip" "${IMG_FILENAME}"
  echo "Creating ${IMG_FILENAME}.zip.sha256sum"
  sha256sum "${IMG_FILENAME}.zip" > "${IMG_FILENAME}.zip.sha256sum"
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
          nozip)
            DO_ZIP=0
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
      x)
        set -x
        ;;
      ?)
        echo "Unrecognized option: ${opt}"
        usage
        exit 1
        ;;
      esac
  done
  shift $(( OPTIND - 1 ))

  # Strip trailing .zip from filename, if present
  IMG_FILENAME=${1/%.zip/}
  if [ -z "${IMG_FILENAME}" ]; then
    echo "No IMG filename provided."
    usage
    exit 1
  fi

  if [ "${VERBOSE}" == "1" ]; then
    echo "IMG_FILENAME = ${IMG_FILENAME}"
    echo "      DD_DEV = ${DD_DEV}"
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
    read_image
  fi

  if [ "${DO_ZIP}" == 1 ]; then
    if [ ! -f "${IMG_FILENAME}" ]; then
      echo "IMG file: '${IMG_FILENAME}' is not a file."
      exit 1
    fi
    zip_image
  fi
  image_to_aws
}

main "$@"
