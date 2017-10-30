#!/bin/bash

gateway_dir="/home/pi/mozilla-iot/gateway"

# Make sure the certificate and private key files are never world readable.
umask 077

# Copy in the new certs.
cp "$RENEWED_LINEAGE/chain.pem" "$gateway_dir/chain.pem"
cp "$RENEWED_LINEAGE/cert.pem" "$gateway_dir/certificate.pem"
cp "$RENEWED_LINEAGE/privkey.pem" "$gateway_dir/privatekey.pem"

# Restart the gateway.
systemctl restart mozilla-iot-gateway.service
