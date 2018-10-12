#!/bin/bash

# This is intended for use with 0.4.X gateway releases.

script_dir=$(readlink -f $(dirname "$0"))
moziot_dir="/home/pi/mozilla-iot"
moziot_profile_dir="/home/pi/.mozilla-iot"
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

    systemctl start mozilla-iot-gateway.service

    echo -e "$1"
    exit 1
}

if [ $(id -u) -ne 0 ]; then
    abort "This script must be run as root!"
fi

if [ -z "$(which sqlite3)" ]; then
    echo "Installing sqlite3."
    apt update >/dev/null 2>&1 && apt install -y sqlite3 || \
        abort "Failed to install."
fi

email="$1"
if [ -z "$email" ]; then
    prog=$(basename $(readlink -f "$0"))
    abort "Usage:\n\t$prog EMAIL"
fi

if [ ! -f "${moziot_profile_dir}/config/db.sqlite3" ]; then
    abort "Could not read ${moziot_profile_dir}/config/db.sqlite3"
fi

domain="$(sqlite3 "${moziot_profile_dir}/config/db.sqlite3" \
              "SELECT value FROM settings WHERE key='tunneltoken'" | \
          grep -oP '"name":".*?"' | \
          cut -d: -f2 | \
          cut -d\" -f2).mozilla-iot.org"
token=$(sqlite3 "${moziot_profile_dir}/config/db.sqlite3" \
            "SELECT value FROM settings WHERE key='tunneltoken'" | \
        grep -oP '"token":".*?"' | \
        cut -d: -f2 | \
        cut -d\" -f2)

if [ "${domain}" = ".mozilla-iot.org" -o -z "${token}" ]; then
    abort "Could not determine domain or token."
fi

if [ -z "$(which certbot)" ]; then
    echo "Installing certbot."
    apt -y install certbot >/dev/null 2>&1 || \
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
    -subj "/C=US/ST=CA/L=Mountain View/O=Mozilla/CN=${domain}/emailAddress=${moziot_email}" \
    -nodes >/dev/null 2>&1

python2 server.py >/dev/null 2>&1 &
server_pid=$!
cd - >/dev/null 2>&1

echo "Starting PageKite."
"${moziot_dir}/gateway/pagekite.py" \
    --clean \
    --frontend="${domain}:443" \
    --service_on="https:${domain}:localhost:4443:${token}" \
    --daemonize \
    --pidfile="${pagekite_pidfile}" || abort "Failed to start PageKite."

echo "Verifying domain and renewing certificate for: ${domain}"
certbot certonly \
    --webroot \
    --webroot-path "${temp_dir}" \
    --preferred-challenges=http \
    -d "${domain}" \
    --force-renewal \
    --config-dir "${moziot_profile_dir}/etc" \
    --work-dir "${moziot_profile_dir}/var/lib" \
    --logs-dir "${moziot_profile_dir}/var/log" \
    --non-interactive \
    --agree-tos \
    --email "${moziot_email}" || abort "Failed to verify and renew."

chown -R pi:pi "${moziot_profile_dir}/etc" "${moziot_profile_dir}/var"

echo "Stopping temporary web server."
kill -15 "${server_pid}" >/dev/null 2>&1
rm -rf "${temp_dir}"

echo "Stopping PageKite."
kill -15 $(<"${pagekite_pidfile}") >/dev/null 2>&1
rm -f "${pagekite_pidfile}"

echo "Copying in new certificates."
cp "${moziot_profile_dir}/etc/live/${domain}/cert.pem" \
    "${moziot_profile_dir}/ssl/certificate.pem"
cp "${moziot_profile_dir}/etc/live/${domain}/privkey.pem" \
    "${moziot_profile_dir}/ssl/privatekey.pem"
cp "${moziot_profile_dir}/etc/live/${domain}/chain.pem" \
    "${moziot_profile_dir}/ssl/chain.pem"

echo "Registering domain with server."
curl "https://api.mozilla-iot.org:8443/setemail" \
    -s -G \
    --data-urlencode "token=${token}" \
    --data-urlencode "email=${email}" || abort "Failed to register."

echo "Starting IoT gateway service."
systemctl start mozilla-iot-gateway.service || abort "Failed to start service."

echo "Done!"
