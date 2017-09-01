#!/bin/bash

file=$1
target=$2
digest=${file#*-}
digest=${digest%.tar.gz}
base_name=${file%-*}
echo $base_name
echo $digest
exit 0

check_digest=$(openssl dgst -sha256 $base_name-$digest.tar.gz | awk '{print $2}')

if [ "$digest" != "$check_digest" ]; then
  echo "Digest mismatch: $digest != $check_digest"
  exit -1
fi

if [ -d $base_name ]; then
  rm -r $base_name
fi

tar xzf "$base_name-$digest.tar.gz" ./$target

exit $?
