#!/bin/bash

script_dir=$(readlink -f $(dirname "$0"))
moziot_dir="/home/pi/mozilla-iot"
moziot_email="certificate@mozilla-iot.org"
pagekite_pidfile="/tmp/_pagekite.pid"
temp_dir="$(mktemp -d)"
server_pid=""

abort() {
    [ -f "${pagekite_pidfile}" ] && \
        kill -15 $(<"${pagekite_pidfile}") >/dev/null 2>/dev/null
    rm -f "${pagekite_pidfile}"

    [ -n "${server_pid}" ] && \
        kill -15 "${server_pid}" >/dev/null 2>/dev/null
    rm -rf "${temp_dir}"

    echo -e "$1"
    exit 1
}

if [ $(id -u) -ne 0 ]; then
    abort "This script must be run as root!"
fi

domain="$1"
email="$2"

if [ -z "$domain" -o -z "$email" ]; then
    prog=$(basename $(readlink -f "$0"))
    abort "Usage:\n\t$prog DOMAIN EMAIL"
fi

if [ -z "$(which certbot)" ]; then
    echo "Installing certbot."
    apt-get update >/dev/null 2>&1 && \
        apt-get -y --force-yes install certbot >/dev/null 2>&1 || \
        abort "Failed to install."
fi

echo "Stopping IoT gateway service."
systemctl stop mozilla-iot-gateway.service || abort "Failed to stop service."

echo "Starting temporary web server."
cd "${temp_dir}"
cat >server.py <<EOF
import BaseHTTPServer
import SimpleHTTPServer
import ssl


httpd = BaseHTTPServer.HTTPServer(
    ('localhost', 4443),
    SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               keyfile='privkey.pem',
                               certfile='cert.pem')
httpd.serve_forever()
EOF
openssl req \
    -new \
    -x509 \
    -keyout privkey.pem \
    -out cert.pem \
    -days 365 \
    -subj "/C=US/ST=CA/L=Mountain View/O=Mozilla/CN=${domain}/emailAddress=${email}" \
    -nodes >/dev/null 2>&1

python2 server.py >/dev/null 2>&1 &
server_pid=$!
cd - >/dev/null 2>&1

echo "Starting PageKite."
"${moziot_dir}/gateway/pagekite.py" \
    --clean \
    --frontend="${domain}:443" \
    --service_on="https:${domain}:localhost:4443:moziot" \
    --daemonize \
    --pidfile="${pagekite_pidfile}" || abort "Failed to start PageKite."

echo "Verifying domain."
certbot certonly \
    --webroot \
    --webroot-path "${temp_dir}" \
    --preferred-challenges=http \
    -d "${domain}" \
    --config-dir "${moziot_dir}/etc" \
    --work-dir "${moziot_dir}/var/lib" \
    --logs-dir "${moziot_dir}/var/log" \
    --non-interactive \
    --agree-tos \
    --email "${email}" || abort "Failed to verify."

echo "Renewing certificate."
certbot renew \
    --config-dir "${moziot_dir}/etc" \
    --work-dir "${moziot_dir}/var/lib" \
    --logs-dir "${moziot_dir}/var/log" \
    --cert-path "${cert}" \
    --force-renewal \
    --non-interactive || abort "Failed to renew."

echo "Updating certificate's email address."
certbot register \
    --config-dir "${moziot_dir}/etc" \
    --work-dir "${moziot_dir}/var/lib" \
    --logs-dir "${moziot_dir}/var/log" \
    --update-registration \
    --email "${moziot_email}" \
    --non-interactive || abort "Failed to change email."

chown -R pi:pi "${moziot_dir}/etc" "${moziot_dir}/var"

echo "Stopping temporary web server."
kill -15 "${server_pid}" >/dev/null 2>&1
rm -rf "${temp_dir}"

echo "Stopping PageKite."
kill -15 $(<"${pagekite_pidfile}") >/dev/null 2>&1
rm -f "${pagekite_pidfile}"

echo "Copying in new certificates."
cp "${moziot_dir}/etc/live/${domain}/cert.pem" \
    "${moziot_dir}/gateway/certificate.pem"
cp "${moziot_dir}/etc/live/${domain}/privkey.pem" \
    "${moziot_dir}/gateway/privatekey.pem"
cp "${moziot_dir}/etc/live/${domain}/chain.pem" \
    "${moziot_dir}/gateway/chain.pem"

echo "Starting IoT gateway service."
systemctl start mozilla-iot-gateway.service || abort "Failed to start service."

echo "Done!"
