#!/bin/sh

for filename in $(git ls-files '*.js'); do
  echo "jshint ${filename}"
  jshint ${filename}
done
