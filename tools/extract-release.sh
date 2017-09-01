gateway_old=./gateway
$gateway_old/tools/extract-ca-archive gateway-*.tar.gz gateway_new
pushd gateway_new
$gateway_old/tools/extract-ca-archive ../node_modules-*.tar.gz node_modules
cp -r $gateway_old/db.sqlite3 $gateway_old/settings ./
popd
systemctl gateway.service stop
mv $gateway_old gateway_old
mv ./gateway_new gateway
systemctl gateway.service start
