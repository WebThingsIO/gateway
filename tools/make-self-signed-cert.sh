#!/bin/bash

set -x

WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.webthings}"
SSL_DIR="${WEBTHINGS_HOME}/ssl"
[ ! -d "${SSL_DIR}" ] && mkdir -p "${SSL_DIR}"
openssl genrsa -out "${SSL_DIR}/privatekey.pem" 2048
openssl req -new -sha256 -key "${SSL_DIR}/privatekey.pem" -out "${SSL_DIR}/csr.pem" -subj '/CN=www.sgnihtbew.com/O=WebThings Gateway/C=US'
openssl x509 -req -in "${SSL_DIR}/csr.pem" -signkey "${SSL_DIR}/privatekey.pem" -out "${SSL_DIR}/certificate.pem"
