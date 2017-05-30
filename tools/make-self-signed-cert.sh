#!/bin/sh

set -x

openssl genrsa -out privatekey.pem 2048
openssl req -new -sha256 -key privatekey.pem -out csr.pem -subj '/CN=www.toizom.com/O=MozIoT Gateway/C=US'
openssl x509 -req -in csr.pem -signkey privatekey.pem -out certificate.pem
