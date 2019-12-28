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

assistant-menu-item = Assistente
things-menu-item = Coisas
rules-menu-item = Regras
logs-menu-item = Registros
floorplan-menu-item = Planta baixa
settings-menu-item = Configurações
log-out-button = Sair

## Things

thing-details =
    .aria-label = Ver propriedades
add-things =
    .aria-label = Adicionar coisas novas

## Assistant

assistant-avatar-image =
    .alt = Avatar do assistente
assistant-controls-text-input =
    .placeholder = Como posso ajudar?

## Floorplan

upload-floorplan = Enviar planta baixa…
upload-floorplan-hint = (.svg recomendado)

## Top-Level Settings

settings-domain = Domínio
settings-network = Rede
settings-users = Usuários
settings-add-ons = Extensões
settings-adapters = Adaptadores
settings-localization = Localização
settings-updates = Atualizações
settings-authorizations = Autorizações
settings-experiments = Experimentos
settings-developer = Desenvolvedor

## Domain Settings

domain-settings-local-label = Acesso local
domain-settings-local-update = Atualizar nome do servidor
domain-settings-remote-access = Acesso remoto
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = As configurações de rede não são suportadas nesta plataforma.
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
network-settings-ip-address = Endereço IP
network-settings-dhcp = Automático (DHCP)
network-settings-static = Manual (IP estático)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Endereço IP estático
network-settings-network-mask = Máscara de rede
network-settings-gateway = Gateway
network-settings-done = Pronto
network-settings-wifi-password =
    .placeholder = Senha
network-settings-show-password = Mostrar senha
network-settings-connect = Conectar
network-settings-username = Nome de usuário
network-settings-password = Senha
network-settings-router-ip = Endereço IP do roteador
network-settings-dhcp-server = Servidor DHCP
network-settings-enable-wifi = Ativar Wi-Fi
network-settings-network-name = Nome da rede (SSID)
wireless-connected = Conectado
wireless-icon =
    .alt = Rede Wi-Fi
network-settings-changing = Alterando as configurações de rede. Isso pode demorar um pouco.
failed-ethernet-configure = Falha ao configurar ethernet.
failed-wifi-configure = Falha ao configurar Wi-Fi.
failed-wan-configure = Falha ao configurar WAN.
failed-lan-configure = Falha ao configurar LAN.
failed-wlan-configure = Falha ao configurar WLAN.

## User Settings

create-user =
    .aria-label = Adicionar novo usuário
user-settings-input-name =
    .placeholder = Nome
user-settings-input-email =
    .placeholder = E-mail
user-settings-input-password =
    .placeholder = Senha
user-settings-input-new-password =
    .placeholder = Nova senha (opcional)
user-settings-input-confirm-new-password =
    .placeholder = Confirmar nova senha
user-settings-input-confirm-password =
    .placeholder = Confirmar senha
user-settings-password-mismatch = As senhas não coincidem
user-settings-save = Salvar

## Adapter Settings

adapter-settings-no-adapters = Nenhum adaptador presente.

## Authorization Settings

authorization-settings-no-authorizations = Nenhuma autorização.

## Experiment Settings

experiment-settings-smart-assistant = Assistente inteligente
experiment-settings-logs = Registros

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
update-available = Nova versão disponível
update-up-to-date = O seu sistema está atualizado
updates-not-supported = As atualizações não são suportadas nesta plataforma.
update-settings-enable-self-updates = Ativar atualizações automáticas
last-update = Última atualização
current-version = Versão atual
failed = Falha
never = Nunca
in-progress = Em andamento
restarting = Reiniciando

## Developer Settings

developer-settings-enable-ssh = Ativar SSH
developer-settings-view-internal-logs = Exibir registros internos
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
    .alt = Ver prévia
rules-delete-icon =
    .alt = Excluir
rules-drag-hint = Arraste seus dispositivos aqui para começar a criar uma regra
rules-drag-input-hint = Adicionar dispositivo como entrada
rules-drag-output-hint = Adicionar dispositivo como saída
rules-scroll-left =
    .alt = Deslizar para a esquerda
rules-scroll-right =
    .alt = Deslizar para a direita
rules-delete-prompt = Solte dispositivos aqui para desconectar
rules-delete-dialog = Tem certeza que deseja remover esta regra permanentemente?
rules-delete-cancel =
    .value = Cancelar
rules-delete-confirm =
    .value = Remover regra
rule-invalid = Inválida
rule-delete-prompt = Tem certeza que deseja remover esta regra permanentemente?
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
rule-notification = Notificação
notification-title = Título
notification-message = Mensagem
notification-level = Nível
notification-low = Baixo
notification-normal = Normal
notification-high = Alto
rule-name = Nome da regra

## Logs

logs-device = Dispositivo
logs-property = Propriedade
logs-retention = Retenção
logs-hours = Horas
logs-days = Dias
logs-weeks = Semanas
logs-save = Salvar
logs-remove-dialog-title = Removendo
logs-remove = Remover

## Add New Things

add-thing-scanning-icon =
    .alt = Procurando
add-thing-scanning = Procurando novos dispositivos…
add-thing-add-adapters-hint = Nenhuma coisa nova foi encontrada. Experimente <a data-l10n-name="add-thing-add-adapters-hint-anchor">adicionar algumas extensões</a>.
add-thing-add-by-url = Adicionar por URL…
add-thing-done = Pronto
add-thing-cancel = Cancelar

## Context Menu

context-menu-choose-icon = Escolher ícone…
context-menu-save = Salvar
context-menu-remove = Remover

## Capabilities

OnOffSwitch = Interruptor Ligado/Desligado
MultiLevelSwitch = Interruptor de vários níveis
ColorControl = Controle de cores
ColorSensor = Sensor de cores
EnergyMonitor = Monitor de energia
BinarySensor = Sensor binário
MultiLevelSensor = Sensor de vários níveis
Light = Luz
DoorSensor = Sensor da porta
MotionSensor = Sensor de movimento
LeakSensor = Sensor de perda
PushButton = Botão de apertar
VideoCamera = Câmera de vídeo
Camera = Câmera
TemperatureSensor = Sensor de temperatura
Alarm = Alarme
Thermostat = Termostato
Lock = Fechadura
Custom = Coisa personalizada
Thing = Coisa

## Properties

alarm = Alarme
pushed = Pressionado
not-pushed = Não pressionado
on-off = Ligado/Desligado
on = Ligado
off = Desligado
power = Energia
voltage = Voltagem
temperature = Temperatura
current = Corrente
frequency = Frequência
color = Cor
brightness = Brilho
leak = Perda
dry = Seco
color-temperature = Temperatura de cor
video-unsupported = Desculpe, vídeo não é suportado no seu navegador.
motion = Movimento
no-motion = Nenhum movimento
open = Aberto
closed = Fechado
locked = Trancado
unlocked = Destrancado
jammed = Obstruído
unknown = Desconhecido
active = Ativado
inactive = Desativado

## Domain Setup

tunnel-setup-reclaim-domain = Parece que você já cadastrou este subdomínio. Para recuperar, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">clique aqui</a>.
reclaim-failed = Não foi possível recuperar o domínio.
subdomain-already-used = Este subdomínio já está sendo usado. Escolha um diferente.
invalid-reclamation-token = Token de recuperação inválido.
domain-success = Sucesso! Aguarde enquanto redirecionamos você…

## Booleans


## Time


## Unit Abbreviations


## New Thing View


## New Web Thing View


## Empty div Messages


## Add-on Settings


## Page Titles


## Speech


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


## General Terms


## Top-Level Buttons

