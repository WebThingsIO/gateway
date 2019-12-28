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
logs-menu-item = Logs
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
experiment-settings-logs = Logs

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
developer-settings-view-internal-logs = Exibir logs internos
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

add-log =
    .aria-label = Criar novo log
logs = Logs
logs-create-log-hint = Nenhum log criado. Clique em + para criar um log.
logs-device = Dispositivo
logs-property = Propriedade
logs-retention = Retenção
logs-hours = Horas
logs-days = Dias
logs-weeks = Semanas
logs-save = Salvar
logs-remove-dialog-title = Removendo
logs-remove-dialog-warning = Remover o log remove também todos os seus dados. Tem certeza que deseja remover?
logs-remove = Remover
logs-unable-to-create = Não foi possível criar log
logs-server-remove-error = Erro no servidor: não foi possível remover log

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
issuing-error = Erro ao emitir certificado. Tente novamente.
redirecting = Redirecionando…

## Booleans

true = Verdadeiro
false = Falso

## Time

utils-now = agora
utils-seconds-ago =
    { $value ->
        [one] Há { $value } segundo
       *[other] Há { $value } segundos
    }
utils-minutes-ago =
    { $value ->
        [one] Há { $value } minuto
       *[other] Há { $value } minutos
    }
utils-hours-ago =
    { $value ->
        [one] Há { $value } hora
       *[other] Há { $value } horas
    }
utils-days-ago =
    { $value ->
        [one] Há { $value } dia
       *[other] Há { $value } dias
    }
utils-weeks-ago =
    { $value ->
        [one] Há { $value } semana
       *[other] Há { $value } semanas
    }
utils-months-ago =
    { $value ->
        [one] Há { $value } mês
       *[other] Há { $value } meses
    }
utils-years-ago =
    { $value ->
        [one] Há { $value } ano
       *[other] Há { $value } anos
    }
minute = Minuto
hour = Hora
day = Dia
week = Semana

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
abbrev-kilowatt-hour = kW⋅h
abbrev-percent = %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = K
abbrev-meter = m
abbrev-kilometer = km
abbrev-day = d
abbrev-hour = h
abbrev-minute = min
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = pés

## New Thing View

unknown-device-type = Tipo de dispositivo desconhecido
new-thing-choose-icon = Escolher ícone…
new-thing-save = Salvar
new-thing-pin =
    .placeholder = Inserir PIN
new-thing-pin-error = PIN incorreto
new-thing-pin-invalid = PIN inválido
new-thing-cancel = Cancelar
new-thing-submit = Enviar
new-thing-username =
    .placeholder = Digitar nome de usuário
new-thing-password =
    .placeholder = Digitar senha
new-thing-credentials-error = Credenciais incorretas
new-thing-saved = Salvo
new-thing-done = Pronto

## New Web Thing View

loading = Carregando…
new-web-thing-from = de

## Empty div Messages

no-things = Nenhum dispositivo ainda. Clique em + para procurar dispositivos disponíveis.
thing-not-found = Coisa não encontrada.
action-not-found = Ação não encontrada.
events-not-found = Esta coisa não tem eventos.

## Add-on Settings

add-addons =
    .aria-label = Encontrar mais extensões
author-unknown = Desconhecido
disable = Desativar
enable = Ativar
by = por
addon-configure = Configurar
addon-update = Atualizar
addon-remove = Remover
addon-updating = Atualizando…
addon-updated = Atualizada
addon-update-failed = Falha
addon-config-applying = Aplicando…
addon-config-apply = Aplicar
addon-discovery-added = Adicionada
addon-discovery-add = Adicionar
addon-discovery-installing = Instalando…
addon-discovery-failed = Falha

## Page Titles

settings = Configurações
domain = Domínio
users = Usuários
edit-user = Editar usuário
add-user = Adicionar usuário
adapters = Adaptadores
addons = Extensões
addon-config = Configurar extensão
addon-discovery = Descobrir mais extensões
experiments = Experimentos
localization = Localização
updates = Atualizações
authorizations = Autorizações
developer = Desenvolvedor
network = Rede
ethernet = Ethernet
wifi = Wi-Fi
icon = Ícone

## Speech

speech-unsupported = O navegador atual não suporta fala
speech-didnt-get = Desculpe, não entendi.

## Errors

unknown-state = Estado desconhecido.
error = Erro
errors = Erros
gateway-unreachable = Gateway inacessível
more-information = Mais informações
invalid-file = Arquivo inválido.
failed-read-file = Falha ao ler arquivo.
failed-save = Falha ao salvar.

## Schema Form

unsupported-field = Esquema de campo não suportado

## Icon Sources

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Accesso — { -webthings-gateway-brand }
login-log-in = Entrar

## Create First User Page

signup-title = Criar usuário — { -webthings-gateway-brand }
signup-welcome = Boas-vindas
signup-create-account = Crie sua primeira conta de usuário:
signup-password-mismatch = As senhas não coincidem
signup-next = Avançar

## Tunnel Setup Page

tunnel-setup-title = Escolha de endereço web — { -webthings-gateway-brand }
tunnel-setup-welcome = Boas-vindas
tunnel-setup-choose-address = Escolha um endereço web seguro para seu gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdomínio
tunnel-setup-opt-in = Mantenha-me atualizado sobre novos recursos e oportunidades de contribuição.
tunnel-setup-privacy-policy = Política de privacidade
tunnel-setup-input-reclamation-token =
    .placeholder = Token de recuperação
tunnel-setup-error = Ocorreu um erro ao configurar o subdomínio.
tunnel-setup-create = Criar
tunnel-setup-skip = Pular
tunnel-setup-time-sync = Aguardando o relógio do sistema ser configurado a partir da internet. É provável que o registro do domínio falhe até que isso seja concluído.

## Authorize Page

authorize-title = Solicitação de autorização — { -webthings-gateway-brand }
authorize-authorization-request = Solicitação de autorização
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> gostaria de acessar seu gateway para dispositivos de <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = do <<domain>>
authorize-monitor-and-control = monitorar e controlar
authorize-monitor = monitorar
authorize-allow-all = Permitir para todas as coisas
authorize-allow =
    .value = Permitir
authorize-deny = Negar

## Local Token Page

local-token-title = Serviço de token local — { -webthings-gateway-brand }
local-token-header = Serviço de token local
local-token-your-token = Seu token local é este <a data-l10n-name="local-token-jwt">JSON Web Token</a>:

## Router Setup Page

router-setup-title = Configuração do roteador — { -webthings-gateway-brand }
router-setup-header = Criar uma nova rede Wi-Fi
router-setup-input-ssid =
    .placeholder = Nome da rede
router-setup-input-password =
    .placeholder = Senha
router-setup-input-confirm-password =
    .placeholder = Confirmar senha
router-setup-create =
    .value = Criar
router-setup-password-mismatch = As senhas devem coincidir

## Wi-Fi Setup Page

wifi-setup-title = Configuração de Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Conectar a uma rede Wi-Fi?
wifi-setup-input-password =
    .placeholder = Senha
wifi-setup-show-password = Mostrar senha
wifi-setup-connect =
    .value = Conectar
wifi-setup-network-icon =
    .alt = Rede Wi-Fi
wifi-setup-skip = Pular

## Connecting to Wi-Fi Page

connecting-title = Conectando ao Wi-Fi — { -webthings-gateway-brand }
connecting-header = Conectando ao Wi-Fi…
connecting-connect = Verifique se está conectado à mesma rede e acesse { $gateway-link } no seu navegador web para continuar a configuração.
connecting-warning = Nota: Se você não conseguir carregar { $domain }, procure o endereço IP do gateway no seu roteador.
connecting-header-skipped = Wi-Fi não foi configurado
connecting-skipped = O gateway está sendo iniciado agora. Acesse { $gateway-link } no seu navegador web, conectado na mesma rede do gateway, para continuar a configuração.

## Creating Wi-Fi Network Page

creating-title = Criação de rede Wi-Fi — { -webthings-gateway-brand }
creating-header = Criando rede Wi-Fi…
creating-content = Conecte-se a { $ssid } com a senha que você acabou de criar, depois acesse { $gateway-link } ou { $ip-link } no seu navegador.

## General Terms

ok = Ok
ellipsis = …
event-log = Log de eventos
edit = Editar
remove = Remover
disconnected = Desconectado
processing = Processando…
submit = Enviar

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Voltar
overflow-button =
    .aria-label = Ações adicionais
speech-button =
    .aria-label = Escutar voz
submit-button =
    .aria-label = Enviar
edit-button =
    .aria-label = Editar
save-button =
    .aria-label = Salvar
