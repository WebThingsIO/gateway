#!/bin/sh

SCRIPTDIR="$(dirname ""$0"")"

#set
#exit 0

for filename in $(git ls-files "${SCRIPTDIR}/../*.js"); do
  echo "jshint ${filename}"
  jshint ${filename}
done
