#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

NODE_VERSION="--lts"
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}
# always use most recent version (lts)
nvm alias default node
