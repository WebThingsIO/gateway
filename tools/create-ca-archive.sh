#!/bin/bash

base_name=$1
digest=$(openssl dgst -sha256 $base_name.tar.gz | awk '{print $2}')
mv $base_name.tar.gz $base_name-$digest.tar.gz
