#!/bin/bash -e
#
# Takes the gateway archive (created by rpi-image-builder) and creates
# release archives.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

SCRIPT_NAME=$(basename $0)
SCRIPT_DIR=$(dirname $0)
VERBOSE=0
OUTPUT_DIRECTORY='ota'

###########################################################################
#
# Prints the program usage
#
usage() {
  echo "Usage: ${SCRIPT_NAME} [-v] [-g gateway-tarball] [-o output-directory]"
}

###########################################################################
#
# Parses command line arguments and runs the program.
#
main() {

  while getopts "g:ho:v" opt "$@"; do
    case $opt in
      g)
        GATEWAY_TARBALL=${OPTARG}
        ;;
      o)
        OUTPUT_DIRECTORY=${OPTARG}
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
  if [ "${VERBOSE}" == "1" ]; then
    echo " Gateway tarball: ${GATEWAY_TARBALL}"
    echo "Output Directory: ${OUTPUT_DIRECTORY}"
  fi

  # The create-release-archives wants a gateway.tar.gz tarball
  # (which has no node_modules in it) and a separate directory tree
  # with all of the node_modules in it.
  rm -rf "${OUTPUT_DIRECTORY}"
  mkdir -p "${OUTPUT_DIRECTORY}"
  tar -C "${OUTPUT_DIRECTORY}" -xf "${GATEWAY_TARBALL}"
  mv "${OUTPUT_DIRECTORY}/gateway/node_modules" "${OUTPUT_DIRECTORY}/node_modules"
  tar -C "${OUTPUT_DIRECTORY}" -czf "${OUTPUT_DIRECTORY}/gateway.tar.gz" gateway
  rm -rf "${OUTPUT_DIRECTORY}/gateway"
  (cd "${OUTPUT_DIRECTORY}"; ${SCRIPT_DIR}/create-release-archives.sh)
  rm -rf "${OUTPUT_DIRECTORY}/node_modules"
  ls -l "${OUTPUT_DIRECTORY}"
}

main "$@"
