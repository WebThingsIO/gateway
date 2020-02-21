#!/bin/bash -e

# This script copies an image and its sha256sum to AWS.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

SCRIPT_NAME=$(basename $0)

###########################################################################
#
# Prints the program usage
#
usage() {
  echo ${SCRIPT_NAME} img-file.zip
}

###########################################################################
#
# Writes the image file to the the AWS storage container
#
image_to_aws() {
  FILENAME="$1"
  AWS_DIR="s3://mozillagatewayimages/images/"
  FILENAME_SHA256SUM="${FILENAME}.sha256sum"

  echo "Copying image files to '${AWS_DIR}'"
  aws s3 cp --acl=public-read "${FILENAME}" "${AWS_DIR}"
  aws s3 cp --acl=public-read "${FILENAME_SHA256SUM}" "${AWS_DIR}"

  echo
  echo "AWS URLs"
  echo "https://s3-us-west-1.amazonaws.com/mozillagatewayimages/images/${FILENAME}"
  echo "https://s3-us-west-1.amazonaws.com/mozillagatewayimages/images/${FILENAME_SHA256SUM}"

}

###########################################################################
#
# Parses command line arguments and runs the program.
#
main() {
  IMG_FILENAME="$1"
  if [ -z "${IMG_FILENAME}" ]; then
    usage
    exit 1
  fi

  image_to_aws "${IMG_FILENAME}"
}

main "$@"
