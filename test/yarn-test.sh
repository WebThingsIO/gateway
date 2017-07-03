#! /bin/bash -e

# This script will fail if yarn.lock has uncommited changes.

if ! git diff --exit-code ./yarn.lock ;
then
  echo "yarn.lock has uncommited changes!!"
  echo
  echo "Run yarn again and check in yarn.lock"
  exit 1
fi
