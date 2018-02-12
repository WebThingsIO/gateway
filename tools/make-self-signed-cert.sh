#!/bin/sh

set -x

mkdir -p ssl
openssl genrsa -out ssl/privatekey.pem 2048
openssl req -new -sha256 -key ssl/privatekey.pem -out ssl/csr.pem -subj '/CN=www.toizom.com/O=MozillaIoT Gateway/C=US'
openssl x509 -req -in ssl/csr.pem -signkey ssl/privatekey.pem -out ssl/certificate.pem
