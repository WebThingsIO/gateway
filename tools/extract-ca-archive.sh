#!/bin/bash

file=$1
target=$2
digest=${file#*-}
digest=${digest%.tar.gz}
base_name=${file%-*}

check_digest=$(openssl dgst -sha256 $base_name-$digest.tar.gz | awk '{print $2}')

if [ "$digest" != "$check_digest" ]; then
  echo "Digest mismatch: $digest != $check_digest"
  exit -1
fi

tar xzf "$base_name-$digest.tar.gz" -C $target

exit $?
