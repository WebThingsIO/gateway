#!/bin/bash

SCRIPT_NAME=$(basename $0)
NUM_PROCESS=2

###########################################################################
#
# Prints the program usage
#
usage() {
  cat <<END
./image/${SCRIPT_NAME} <cmd>

where cmd can be one of:
  cross             build node_modules which can be cross builded.
  native            Build node_modules which need to be native builded.
END
}


###########################################################################
#
# Mark node_module to need native build.
#
markNativeBuild() {
  local name=$1
  NativeModules+=(${name})
}

###########################################################################
#
# Correct node_modules installed.
#
readInstalled() {
  InstalledModules=(`find node_modules/ -name package.json | sed 's/.*\/\([^\/]*\)\/package\.json/\1/g' | awk '!colname[$1]++{print $1}'`)
}

###########################################################################
#
# Build node_modules which need to be native builded.
#
nativeBuild() {
  echo ${NativeModules[@]} | xargs -P ${NUM_PROCESS} -n 1 npm rebuild
}

###########################################################################
#
# Build node_modules which can be cross builded.
#
crossBuild() {
  readInstalled
  local crossModules=();
  for name in ${InstalledModules[@]}; do
    local isCross="true"
    for filter in ${NativeModules[@]}; do
      if [ "${name}" = "${filter}" ]; then
        isCross="false"
        break
      fi
    done
    if [ "${isCross}" = "true" ]; then
        crossModules+=(${name})
    fi
  done
  npm rebuild ${crossModules[@]} "$@"
}

# node_modules which need to be native builded.
NativeModules=();
markNativeBuild gifsicle
markNativeBuild mozjpeg
markNativeBuild optipng-bin
markNativeBuild pngquant-bin
markNativeBuild cwebp-bin

main () {
  local cmd="$1"
  shift
  case $cmd in
    cross)
      crossBuild "$@"
      ;;
    native)
      nativeBuild
      ;;
    * )
      usage
      ;;
  esac
}

main "$@"
