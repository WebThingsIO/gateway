#!/bin/bash

# first we install nvm
cd $HOME
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install v7.10.1
nvm use v7.10.1

# baixa o tarball do codigo
wget https://github.com/mozilla-iot/gateway-wifi-setup/archive/master.zip

# descompacta e instala
unzip master.zip -d .
mv gateway-wifi-setup-master/ gateway-wifi-setup/
cd gateway-wifi-setup/
npm install

# transforma o run.sh em executavel
chmod +x run.sh

# copia o servico para o folder de instalacao com o boot de start e type=oneshot
cp config/mozilla-gateway-wifi-setup.service /etc/systemd/system/mozilla-gateway-wifi-setup.service
