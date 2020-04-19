## The following terms must be treated as brand, and kept in English.
##
## They cannot be:
## - Transliterated.
## - Translated.
##
## Declension should be avoided where possible.
##
## Reference: https://mozilla-l10n.github.io/styleguides/mozilla_general/index.html#brands-copyright-and-trademark

-webthings-gateway-brand = WebThings Gateway
# Main Title
webthings-gateway = { -webthings-gateway-brand }
# Wordmark
wordmark =
    .alt = { -webthings-gateway-brand }

## Menu Items

things-menu-item = Coisas
rules-menu-item = Regras
logs-menu-item = Registos
floorplan-menu-item = Planta
settings-menu-item = Definições
log-out-button = Terminar sessão

## Things

thing-details =
    .aria-label = Ver propriedades
add-things =
    .aria-label = Adicionar novas coisas

## Floorplan

upload-floorplan = Enviar planta…
upload-floorplan-hint = (recomenda-se .svg)

## Top-Level Settings

settings-domain = Domínio
settings-network = Rede
settings-users = Utilizadores
settings-add-ons = Complementos
settings-adapters = Adaptadores
settings-localization = Localização
settings-updates = Atualizações
settings-authorizations = Autorizações
settings-experiments = Experiências
settings-developer = Programador

## Domain Settings

domain-settings-local-label = Acesso local
domain-settings-local-update = Atualizar nome do hospedeiro
domain-settings-remote-access = Acesso remoto
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = As definições da rede não são suportadas para esta plataforma.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Rede doméstica
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configurar
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modo
network-settings-home-network-lan = Rede doméstica (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Endereço de IP
network-settings-dhcp = Automático (DHCP)
network-settings-static = Manual (IP estático)
network-settings-pppoe = Ponte (PPPoE)
network-settings-static-ip-address = Endereço de IP estático
network-settings-network-mask = Máscara de rede
network-settings-gateway = Gateway
network-settings-done = Concluído
network-settings-wifi-password =
    .placeholder = Palavra-passe
network-settings-show-password = Mostrar palavra-passe
network-settings-connect = Ligar
network-settings-username = Nome de utilizador
network-settings-password = Palavra-passe
network-settings-router-ip = Endereço de IP do roteador
network-settings-dhcp-server = Servidor de DHCP
network-settings-enable-wifi = Ativar Wi-Fi
network-settings-network-name = Nome da rede (SSID)
wireless-connected = Ligado
wireless-icon =
    .alt = Rede Wi-Fi
network-settings-changing = A alterar as definições de rede. Isto poderá demorar algum tempo.
failed-ethernet-configure = Não foi possível configurar a ethernet.
failed-wifi-configure = Não foi possível configurar o Wi-Fi.
failed-wan-configure = Não foi possível configurar a WAN.
failed-lan-configure = Não foi possível configurar a LAN.
failed-wlan-configure = Não foi possível configurar a WLAN.

## User Settings

create-user =
    .aria-label = Adicionar novo utilizador
user-settings-input-name =
    .placeholder = Nome
user-settings-input-email =
    .placeholder = E-mail
user-settings-input-password =
    .placeholder = Palavra-passe
user-settings-input-totp =
    .placeholder = Código 2FA
user-settings-mfa-enable = Ativar a autenticação de dois fatores
user-settings-mfa-scan-code = Digitalize o código seguinte com qualquer aplicação de autenticação de dois fatores.
user-settings-mfa-secret = Este é o seu novo segredo TOTP, se o código QR acima não funcionar:
user-settings-mfa-error = O código de autenticação estava incorreto.
user-settings-mfa-enter-code = Insira em baixo o código da sua aplicação de autenticação.
user-settings-mfa-verify = Verificar
user-settings-mfa-regenerate-codes = Regenerar códigos de segurança
user-settings-mfa-backup-codes = Estes são os seus códigos de segurança. Cada código é de utilização única. Mantenha-os num local seguro.
user-settings-input-new-password =
    .placeholder = Nova palavra-passe (opcional)
user-settings-input-confirm-new-password =
    .placeholder = Confirmar nova palavra-passe
user-settings-input-confirm-password =
    .placeholder = Confirmar palavra-passe
user-settings-password-mismatch = As palavras-passe não coincidem
user-settings-save = Guardar

## Adapter Settings

adapter-settings-no-adapters = Sem adaptadores disponíveis.

## Authorization Settings

authorization-settings-no-authorizations = Sem autorizações.

## Experiment Settings

experiment-settings-no-experiments = Sem experiências disponíveis neste momento.

## Localization Settings

localization-settings-language-region = Idioma e região
localization-settings-country = País
localization-settings-timezone = Fuso horário
localization-settings-language = Idioma
localization-settings-units = Unidades
localization-settings-units-temperature = Temperatura
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Atualizar agora
update-available = Nova versão disponível.
update-up-to-date = O seu sistema está atualizado.
updates-not-supported = Não são suportadas atualizações nesta plataforma.
update-settings-enable-self-updates = Ativar atualizações automáticas
last-update = Última atualização
current-version = Versão atual
failed = Falhou
never = Nunca
in-progress = Em progresso…
restarting = A reiniciar…
checking-for-updates = A procurar por atualizações…
failed-to-check-for-updates = De momento, não é possível procurar por atualizações.

## Developer Settings

developer-settings-enable-ssh = Ativar SSH
developer-settings-view-internal-logs = Ver registos internos
developer-settings-create-local-authorization = Criar autorização local

## Rules

add-rule =
    .aria-label = Criar nova regra
rules = Regras
rules-create-rule-hint = Nenhuma regra criada. Clique em + para criar uma regra.
rules-rule-name = Nome da regra
rules-customize-rule-name-icon =
    .alt = Personalizar nome da regra
rules-rule-description = Descrição da regra
rules-preview-button =
    .alt = Pré-visualizar
rules-delete-icon =
    .alt = Eliminar
rules-drag-hint = Arraste os seus dispositivos para aqui para começar a criar uma regra
rules-drag-input-hint = Adicionar dispositivo como entrada
rules-drag-output-hint = Adicionar dispositivo como saída
rules-scroll-left =
    .alt = Deslocar para a esquerda
rules-scroll-right =
    .alt = Deslocar para a direita
rules-delete-prompt = Largue aqui os dispositivos a desligar
rules-delete-dialog = Tem a certeza que deseja remover permanentemente esta regra?
rules-delete-cancel =
    .value = Cancelar
rules-delete-confirm =
    .value = Remover regra
rule-invalid = Inválida
rule-delete-prompt = Tem a certeza que deseja remover permanentemente esta regra?
rule-delete-cancel-button =
    .value = Cancelar
rule-delete-confirm-button =
    .value = Remover regra
rule-select-property = Selecionar propriedade
rule-not = Não
rule-event = Evento
rule-action = Ação
rule-configure = Configurar…
rule-time-title = Hora do dia

## Logs


## Add New Things


## Context Menu


## Capabilities


## Properties


## Domain Setup


## Booleans


## Time


## Unit Abbreviations


## New Thing View


## New Web Thing View


## Empty div Messages


## Add-on Settings


## Page Titles


## Errors


## Schema Form


## Icon Sources


## Login Page


## Create First User Page


## Tunnel Setup Page


## Authorize Page


## Local Token Page


## Router Setup Page


## Wi-Fi Setup Page


## Connecting to Wi-Fi Page


## Creating Wi-Fi Network Page


## UI Updates


## General Terms


## Top-Level Buttons

