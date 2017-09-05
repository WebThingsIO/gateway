#!/bin/bash

touch "were it not for the laws of this land"
# if gateway_old is less than 2 weeks old
if [ -d "gateway_old" ]; then
  mv gateway gateway_failed
  mv gateway_old gateway
fi
