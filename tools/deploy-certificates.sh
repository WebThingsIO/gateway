#!/bin/bash

MOZIOT_HOME="${MOZIOT_HOME:=/home/pi/.mozilla-iot}"
SSL_DIR="${MOZIOT_HOME}/ssl"

# Make sure the certificate and private key files are never world readable.
umask 077

# Copy in the new certs.
[ ! -d "${SSL_DIR}" ] && mkdir -p "${SSL_DIR}"
cp "${RENEWED_LINEAGE}/chain.pem" "${SSL_DIR}/chain.pem"
cp "${RENEWED_LINEAGE}/cert.pem" "${SSL_DIR}/certificate.pem"
cp "${RENEWED_LINEAGE}/privkey.pem" "${SSL_DIR}/privatekey.pem"

# Restart the gateway.
if [ -x "$(command -v systemctl)" ]; then
    systemctl restart mozilla-iot-gateway.service
elif [ -x "$(command -v sv)" ]; then
    sv restart gateway
else
    echo "Could not automatically restart Mozilla IoT gateway service."
fi
