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
rule-notification = Notificação
notification-title = Título
notification-message = Mensagem
notification-level = Nível
notification-low = Baixa
notification-normal = Normal
notification-high = Alta
rule-name = Nome da regra

## Logs

add-log =
    .aria-label = Criar novo registo
logs = Registos
logs-create-log-hint = Nenhum registo criado. Clique em + para criar um registo.
logs-device = Dispositivo
logs-device-select =
    .aria-label = Dispositivo do registo
logs-property = Propriedade
logs-property-select =
    .aria-label = Propriedade do registo
logs-retention = Retenção
logs-retention-length =
    .aria-label = Comprimento da retenção do registo
logs-retention-unit =
    .aria-label = Unidade da retenção do registo
logs-hours = Horas
logs-days = Dias
logs-weeks = Semanas
logs-save = Guardar
logs-remove-dialog-title = Remoção
logs-remove-dialog-warning = Se remover o registo também irá remover todos os seus dados. Tem a certeza que o deseja remover?
logs-remove = Remover
logs-unable-to-create = Não é possível criar o registo
logs-server-remove-error = Erro do servidor: não é possível remover o registo

## Add New Things

add-thing-scanning-icon =
    .alt = Procurar
add-thing-scanning = A procurar por novos dispositivos…
add-thing-add-adapters-hint = Não foram encontradas coisas novas. Tente <a data-l10n-name="add-thing-add-adapters-hint-anchor">adicionar alguns complementos</a>.
add-thing-add-by-url = Adicionar por endereço…
add-thing-done = Concluído
add-thing-cancel = Cancelar

## Context Menu

context-menu-choose-icon = Escolher ícone…
context-menu-save = Guardar
context-menu-remove = Remover

## Capabilities

OnOffSwitch = Interruptor ligar/desligar
MultiLevelSwitch = Interruptor de vários níveis
ColorControl = Controlo de cor
ColorSensor = Sensor de cor
EnergyMonitor = Monitor de energia
BinarySensor = Sensor binário
MultiLevelSensor = Sensor de vários níveis
SmartPlug = Tomada inteligente
Light = Luz
DoorSensor = Sensor de porta
MotionSensor = Sensor de movimento
LeakSensor = Sensor de fugas
PushButton = Botão
VideoCamera = Câmara de vídeo
Camera = Câmara
TemperatureSensor = Sensor de temperatura
HumiditySensor = Sensor de humidade
Alarm = Alarme
Thermostat = Termóstato
Lock = Fechadura
BarometricPressureSensor = Sensor de pressão barométrica
Custom = Coisa personalizada
Thing = Coisa
AirQualitySensor = Sensor de qualidade do ar

## Properties

alarm = Alarme
pushed = Pressionado
not-pushed = Não pressionado
on-off = Ligado/desligado
on = Ligado
off = Desligado
power = Potência
voltage = Voltagem
temperature = Temperatura
current = Corrente
frequency = Frequência
color = Cor
brightness = Brilho
leak = Fuga
dry = Seco
color-temperature = Temperatura de cor
video-unsupported = Desculpe, o vídeo não é suportado no seu navegador.
motion = Movimento
no-motion = Sem movimento
open = Aberta
closed = Fechada
locked = Trancada
unlocked = Destrancada
jammed = Encravada
unknown = Desconhecido
active = Ativo
inactive = Inativo
humidity = Humidade
concentration = Concentração
density = Densidade

## Domain Setup

tunnel-setup-reclaim-domain = Parece que já registou esse subdomínio. Para recuperá-lo <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">clique aqui</a>.
check-email-for-token = Por favor, verifique o seu e-mail para um código de recuperação e cole-o em cima.
reclaim-failed = Não foi possível recuperar o domínio.
subdomain-already-used = Este subdomínio já está a ser utilizado. Por favor, escolha um diferente.
invalid-subdomain = Subdomínio inválido.
invalid-email = Endereço de e-mail inválido.
invalid-reclamation-token = Código de recuperação inválido.
domain-success = Sucesso! Por favor, aguarde enquanto nós o redirecionamos...
issuing-error = Erro ao emitir o certificado. Por favor, tente novamente.
redirecting = A redirecionar...

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
abbrev-kilowatt-hour = kW/h
abbrev-percent = %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = K
abbrev-meter = m
abbrev-kilometer = km
abbrev-day = d
abbrev-hour = h
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Tipo de dispositivo desconhecido
new-thing-choose-icon = Escolher o ícone…
new-thing-save = Guardar
new-thing-pin =
    .placeholder = Inserir código
new-thing-pin-error = Código incorreto
new-thing-pin-invalid = Código inválido
new-thing-cancel = Cancelar
new-thing-submit = Submeter
new-thing-username =
    .placeholder = Inserir nome de utilizador
new-thing-password =
    .placeholder = Inserir palavra-passe
new-thing-credentials-error = Credenciais incorretas
new-thing-saved = Guardada
new-thing-done = Concluído

## New Web Thing View

new-web-thing-url =
    .placeholder = Inserir endereço da coisa na Internet
new-web-thing-label = Coisa da Internet
loading = A carregar…
new-web-thing-multiple = Foram encontradas várias coisas da Internet
new-web-thing-from = de

## Empty div Messages

no-things = Ainda sem dispositivos. Clique em + para procurar por dispositivos disponíveis.
thing-not-found = Coisa não encontrada.
action-not-found = Ação não encontrada.
events-not-found = Esta coisa não tem eventos.

## Add-on Settings

add-addons =
    .aria-label = Encontrar novos complementos
author-unknown = Desconhecido
disable = Desativar
enable = Ativar
by = por
license = licença
addon-configure = Configurar
addon-update = Atualizar
addon-remove = Remover
addon-updating = A atualizar…
addon-updated = Atualizado
addon-update-failed = Falhou
addon-config-applying = A aplicar…
addon-config-apply = Aplicar
addon-discovery-added = Adicionado
addon-discovery-add = Adicionar
addon-discovery-installing = A instalar...
addon-discovery-failed = Falhou
addon-search =
    .placeholder = Procurar

## Page Titles

settings = Definições
domain = Domínio
users = Utilizadores
edit-user = Editar utilizador
add-user = Adicionar utilizador
adapters = Adaptadores
addons = Complementos
addon-config = Configurar complemento
addon-discovery = Descobrir novos complementos
experiments = Experiências
localization = Localização
updates = Atualizações
authorizations = Autorizações
developer = Programador
network = Rede
ethernet = Ethernet
wifi = Wi-fi
icon = Ícone

## Errors

unknown-state = Estado desconhecido.
error = Erro
errors = Erros
gateway-unreachable = Gateway inacessível
more-information = Mais informação
invalid-file = Ficheiro inválido.
failed-read-file = Não foi possível ler o ficheiro.
failed-save = Não foi possível guardar.

## Schema Form

unsupported-field = Esquema de campo não suportado

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Iniciar sessão — { -webthings-gateway-brand }
login-log-in = Iniciar sessão
login-wrong-credentials = Nome de utilizador ou palavra-passe incorreto.
login-wrong-totp = O código de autenticação estava incorreto.
login-enter-totp = Insira o código da sua aplicação de autenticação.

## Create First User Page

signup-title = Criar utilizador — { -webthings-gateway-brand }
signup-welcome = Bem-vindo
signup-create-account = Crie a sua primeira conta de utilizador:
signup-password-mismatch = As palavras-passe não coincidem
signup-next = Seguinte

## Tunnel Setup Page

tunnel-setup-title = Escolher endereço da Internet — { -webthings-gateway-brand }
tunnel-setup-welcome = Bem-vindo
tunnel-setup-choose-address = Escolha um endereço da Internet seguro para o seu gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdomínio
tunnel-setup-input-reclamation-token =
    .placeholder = Código de recuperação
tunnel-setup-error = Ocorreu um erro enquanto configurava o subdomínio.
tunnel-setup-create = Criar
tunnel-setup-skip = Ignorar
tunnel-setup-time-sync = A aguardar que o relógio do sistema seja definido a partir da Internet. É provável que o registo do domínio falhe até que isto seja feito.

## Authorize Page

authorize-title = Pedido de autorização — { -webthings-gateway-brand }
authorize-authorization-request = Pedido de autorização
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> gostaria de aceder ao seu gateway para <<function>> os dispositivos.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = de <<domain>>
authorize-monitor-and-control = monitorizar e controlar
authorize-monitor = monitorizar
authorize-allow-all = Permitir para todas as Coisas
authorize-allow =
    .value = Permitir
authorize-deny = Negar

## Local Token Page

local-token-title = Serviço de código local — { -webthings-gateway-brand }
local-token-header = Serviço de código local
local-token-your-token = O seu código local é este <a data-l10n-name="local-token-jwt">código de Internet JSON</a>:
local-token-use-it = Utilize-o para conversar com o gateway em segurança, com <a data-l10n-name="local-token-bearer-type">autorização do tipo Bearer</a>.
local-token-copy-token = Copiar chave

## Router Setup Page

router-setup-title = Configurar roteador — { -webthings-gateway-brand }
router-setup-header = Criar uma nova rede Wi-Fi
router-setup-input-ssid =
    .placeholder = Nome da rede
router-setup-input-password =
    .placeholder = Palavra-passe
router-setup-input-confirm-password =
    .placeholder = Confirmar palavra-passe
router-setup-create =
    .value = Criar
router-setup-password-mismatch = As palavras-passe devem coincidem

## Wi-Fi Setup Page

wifi-setup-title = Configuração do Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Ligar a uma rede Wi-Fi?
wifi-setup-input-password =
    .placeholder = Palavra-passe
wifi-setup-show-password = Mostrar palavra-passe
wifi-setup-connect =
    .value = Ligar
wifi-setup-network-icon =
    .alt = Rede Wi-Fi
wifi-setup-skip = Ignorar

## Connecting to Wi-Fi Page

connecting-title = Ligação ao Wi-Fi — { -webthings-gateway-brand }
connecting-header = A ligar ao Wi-Fi…
connecting-connect = Por favor, verifique se está ligado à mesma rede e navegue até { $gateway-link } no seu navegador de Internet para continuar a configuração.
connecting-warning = Nota: se não conseguir carregar { $domain }, procure o endereço de IP do gateway no seu roteador.
connecting-header-skipped = Configuração do Wi-Fi ignorada
connecting-skipped = O gateway está a ser iniciado agora. Navegue até { $gateway-link } no seu navegador de Internet enquanto estiver ligado à mesma rede do gateway para continuar a instalação.

## Creating Wi-Fi Network Page

creating-title = Criação da rede Wi-Fi — { -webthings-gateway-brand }
creating-header = A criar a rede Wi-Fi…
creating-content = Por favor, ligue-se a { $ssid } com a palavra-passe que acabou de criar, depois navegue até { $gateway-link } ou { $ip-link } no seu navegador de Internet.

## UI Updates

ui-update-available = Está disponível uma interface de utilizador atualizada.
ui-update-reload = Recarregar
ui-update-close = Fechar

## General Terms

ok = Ok
ellipsis = …
event-log = Registo de eventos
edit = Editar
remove = Remover
disconnected = Desligado
processing = A processar…
submit = Submeter

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Anterior
overflow-button =
    .aria-label = Ações adicionais
submit-button =
    .aria-label = Submeter
edit-button =
    .aria-label = Editar
save-button =
    .aria-label = Guardar
