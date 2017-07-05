#!/bin/bash
if [ -f master.zip ]; then
  rm master.zip
fi

wget https://github.com/OpenZWave/open-zwave/archive/master.zip

function overwriteCache {
  if [ -d "open-zwave-master" ]; then
    sudo rm -r open-zwave-master
  fi
  unzip master.zip
  mv master.zip open-zwave-master/master-cache.zip
}

if [ -f "open-zwave-master/master-cache.zip" ]; then
  # test the hashes to see if the zip has been updated
  cache=$(shasum open-zwave-master/master-cache.zip | cut -d ' ' -f1)
  new=$(shasum master.zip | cut -d ' ' -f1)

  if [ "$cache" != "$new" ]; then
    overwriteCache
  fi
else
  overwriteCache
fi

pushd open-zwave-master
sudo make install
sudo ldconfig /usr/local/lib /usr/local/lib64
npm install -g node-gyp
popd
