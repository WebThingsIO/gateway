#!/bin/bash

# TODO: requires gateway.tar.gz to already exist

tar czf node_modules.tar.gz node_modules
./tools/create-ca-archive.sh node_modules
./tools/create-ca-archive.sh gateway

