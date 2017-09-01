# if gateway_old is less than 2 weeks old
rm -r gateway
mv gateway_old gateway
systemctl gateway.service start
