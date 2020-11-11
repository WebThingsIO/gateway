#!/bin/bash -e

set -x

cd "$(readlink -f $(dirname "$0"))"

if compgen -G "*.rpm"; then
    rm -f *.rpm
fi

# Install build dependencies
_build_deps=$(grep ^BuildRequires webthings-gateway.spec | cut -d: -f2-)
_extra_deps="rpm-build rpm-devel rpmlint patch rpmdevtools patch"

if [[ $EUID -eq 0 ]]; then
    yum install -y ${_extra_deps} ${_build_deps}
    # this should be `npm config -g set unsafe-perm true`, but that sometimes
    # causes crashes with ancient npm versions
    echo 'unsafe-perm = true' >> /etc/npmrc
    npm install -g npm@latest
else
    sudo -p 'Enter sudo password to install build dependencies: ' \
        su -c "yum install -y ${_extra_deps} ${_build_deps} && echo 'unsafe-perm = true' >> /etc/npmrc && npm install -g npm@latest"
fi

rpmdev-setuptree

# Copy in the build scripts
cp *.spec ~/rpmbuild/SPECS/
cp src/* ~/rpmbuild/SOURCES/

# Pin the node major version, since dependencies will be built against it
_node_version=$(yum info nodejs | grep -m1 ^Version | awk '/Version/ {print $3}' | cut -d. -f1)
sed -i "s/{{nodejs}}/nodejs >= 1:${_node_version}.0.0 nodejs < 1:$(expr ${_node_version} + 1).0.0/" ~/rpmbuild/SPECS/webthings-gateway.spec

# Pin the python3 major version, since dependencies will be built against it
_python3_version=$(yum info python3 | grep -m1 ^Version | awk '/Version/ {print $3}' | cut -d. -f 1-2)
sed -i "s/{{python3}}/python3 >= ${_python3_version}.0 python3 < 3.$(expr $(echo ${_python3_version} | cut -d. -f2) + 1).0/" ~/rpmbuild/SPECS/webthings-gateway.spec

# Build it
rpmbuild -bb ~/rpmbuild/SPECS/webthings-gateway.spec

# Done building, let's just rename things
_rpm=$(find ~/rpmbuild/RPMS/ -type f)
ln -s "${_rpm}" "webthings-gateway.rpm"

echo ""
echo "Done building: ${_rpm}"
