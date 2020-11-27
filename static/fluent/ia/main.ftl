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

things-menu-item = Objectos
rules-menu-item = Regulas
logs-menu-item = Registros
floorplan-menu-item = Plano terren
settings-menu-item = Parametros
log-out-button = Disconnecter se

## Things

thing-details =
    .aria-label = Vider proprietates
add-things =
    .aria-label = Adder nove things

## Floorplan

upload-floorplan = Cargamento del plano terren…
upload-floorplan-hint = (.svg recommendate)

## Top-Level Settings

settings-domain = Dominio
settings-network = Rete
settings-users = Usatores
settings-add-ons = Additivos
settings-adapters = Adaptatores
settings-localization = Localisation
settings-updates = Actualisationes
settings-authorizations = Autorisationes
settings-experiments = Experimentos
settings-developer = Disveloppator

## Domain Settings

domain-settings-local-label = Accesso local
domain-settings-local-update = Actualisar nomine de servitor hospite
domain-settings-remote-access = Accesso remote
domain-settings-local-name =
    .placeholder = passarella

## Network Settings

network-settings-unsupported = Parametros de rete non es supportate pro iste platteforma.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Rete de casa
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configurar
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modo
network-settings-home-network-lan = Rete de casa (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Adresse IP
network-settings-dhcp = Automatic (DHCP)
network-settings-static = Manual (IP static)
network-settings-pppoe = Ponte (PPPoE)
network-settings-static-ip-address = Adresse IP static
network-settings-network-mask = Masca de rete
network-settings-gateway = Passarella
network-settings-done = Facite
network-settings-wifi-password =
    .placeholder = Contrasigno
network-settings-show-password = Monstrar contrasigno
network-settings-connect = Connecter
network-settings-username = Nomine de usator
network-settings-password = Contrasigno
network-settings-router-ip = Adresse IP del router
network-settings-dhcp-server = Servitor DHCP
network-settings-enable-wifi = Activar Wi-Fi
network-settings-network-name = Nomine de rete (SSID)
wireless-connected = Connexe
wireless-icon =
    .alt = Rete Wi-Fi
network-settings-changing = Cambio parametros de rete. Isto pote prender un minuta.
failed-ethernet-configure = Falta a configurar ethernet.
failed-wifi-configure = Falta a configurar Wi-Fi.
failed-wan-configure = Falta a configurar WAN.
failed-lan-configure = Falta a configurar LAN.
failed-wlan-configure = Falta a configurar WLAN.

## User Settings

create-user =
    .aria-label = Adder un nove usator
user-settings-input-name =
    .placeholder = Nomine
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = Contrasigno
user-settings-input-totp =
    .placeholder = Codice 2FA
user-settings-mfa-enable = Activar le authentification a duo factores
user-settings-mfa-scan-code = Scanna le codice sequente con un application de authentication a duo factores.
user-settings-mfa-secret = In caso le codice QR supra non functiona, isto es tu nove jeton TOTP secrete.
user-settings-mfa-error = Le codice de authentification non es correcte.
user-settings-mfa-enter-code = Insere le codice generate per tu app de authentification ci infra.
user-settings-mfa-verify = Verificar
user-settings-mfa-regenerate-codes = Regenerar le codices de salveguarda
user-settings-mfa-backup-codes = Ecce tu codices de salveguarda. Cata codice pote esser utilisate solo un vice. Salveguarda los in loco secur.
user-settings-input-new-password =
    .placeholder = Nove contrasigno (optional)
user-settings-input-confirm-new-password =
    .placeholder = Confirmar nove contrasigno
user-settings-input-confirm-password =
    .placeholder = Confirmar contrasigno
user-settings-password-mismatch = Le contrasignos non concorda
user-settings-save = Salvar

## Adapter Settings

adapter-settings-no-adapters = Nulle adaptatores presente.

## Authorization Settings

authorization-settings-no-authorizations = Nulle autorisationes.

## Experiment Settings

experiment-settings-no-experiments = Nulle experimentos actualmente disponibile.

## Localization Settings

localization-settings-language-region = Lingua e region
localization-settings-country = Pais
localization-settings-timezone = Fuso horari
localization-settings-language = Lingua
localization-settings-units = Unitates
localization-settings-units-temperature = Temperatura
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Actualisar ora
update-available = Nove version disponibile
update-up-to-date = Tu systema es actualisate.
updates-not-supported = Actualisationes non es supportate sur iste platteforma.
update-settings-enable-self-updates = Activar actualisationes automatic
last-update = Ultime actualisation
current-version = Version actual
failed = Fallite
never = Nunquam
in-progress = In curso
restarting = Reinitiante
checking-for-updates = Recerca actualisationes in curso…
failed-to-check-for-updates = Recerca actualisationes fallite.

## Developer Settings

developer-settings-enable-ssh = Activar SSH
developer-settings-view-internal-logs = Vider registros interne
developer-settings-create-local-authorization = Crear autorisation local

## Rules

add-rule =
    .aria-label = Crear nove regula
rules = Regulas
rules-create-rule-hint = Nulle regulas create. Cliccar + pro crear un regula.
rules-rule-name = Nomine de regula
rules-customize-rule-name-icon =
    .alt = Personalisar nomine de regula
rules-rule-description = Description del regula
rules-preview-button =
    .alt = Vista preliminar
rules-delete-icon =
    .alt = Deler
rules-drag-hint = Trahe tu apparatos hic pro initiar creation de un regula
rules-drag-input-hint = Adder dispositivo de entrata
rules-drag-output-hint = Adder dispositivo de exito
rules-scroll-left =
    .alt = Rolar verso sinistra
rules-scroll-right =
    .alt = Rolar verso dextra
rules-delete-prompt = Deponer hic le dispositivos a disconnecter
rules-delete-dialog = Desira tu vermente remover tal regula permanentemente?
rules-delete-cancel =
    .value = Cancellar
rules-delete-confirm =
    .value = Remover regula
rule-invalid = Non valide
rule-delete-prompt = Desira tu vermente remover tal regula permanentemente?
rule-delete-cancel-button =
    .value = Cancellar
rule-delete-confirm-button =
    .value = Remover regula
rule-select-property = Eliger Proprietate
rule-not = Non
rule-event = Evento
rule-action = Action
rule-configure = Configuration…
rule-time-title = Hora del die
rule-notification = Notification
notification-title = Titulo
notification-message = Message
notification-level = Nivello
notification-low = Basse
notification-normal = Normal
notification-high = Alte
rule-name = Nomine de regula

## Logs

add-log =
    .aria-label = Nove registro
logs = Registros
logs-create-log-hint = Nulle registros create. Clicca + pro crear nove registro.
logs-device = Dispositivo
logs-device-select =
    .aria-label = Registro del dispositivo
logs-property = Proprietate
logs-property-select =
    .aria-label = Registro del proprietate
logs-retention = Retention
logs-retention-length =
    .aria-label = Durata retention registro
logs-retention-unit =
    .aria-label = Unitate mensura retention registro
logs-hours = Horas
logs-days = Dies
logs-weeks = Septimanas
logs-save = Salvar
logs-remove-dialog-title = Remotion
logs-remove-dialog-warning = Le remotion del registro removera alsi tote su datos. Desira tu vermente remover lo?
logs-remove = Remover
logs-unable-to-create = Impossibile crear registro
logs-server-remove-error = Error de servitor: impossibile remover registro

## Add New Things

add-thing-scanning-icon =
    .alt = Recerca
add-thing-scanning = Recerca nove objectos…
add-thing-add-adapters-hint = Nulle nove objectos trovate. Provar <a data-l10n-name="add-thing-add-adapters-hint-anchor">adder alcun additivos</a>.
add-thing-add-by-url = Adder per URL…
add-thing-done = Facite
add-thing-cancel = Cancellar

## Context Menu

context-menu-choose-icon = Elige icone…
context-menu-save = Salvar
context-menu-remove = Remover

## Capabilities

OnOffSwitch = Commutator active/inactive
MultiLevelSwitch = Commutator multi-nivello
ColorControl = Controlo de color
ColorSensor = Sensor de color
EnergyMonitor = Sensor de energia
BinarySensor = Sensor binari
MultiLevelSensor = Sensor multi-nivello
SmartPlug = Prisa electric intelligente
Light = Luce
DoorSensor = Sensor porta
MotionSensor = Sensor movimento
LeakSensor = Sensor perditas
PushButton = Pulsante
VideoCamera = Videocamera
Camera = Photo-camera
TemperatureSensor = Sensor de temperatura
HumiditySensor = Sensor de humiditate
Alarm = Alarma
Thermostat = Thermostato
Lock = Serratura
BarometricPressureSensor = Sensor de pression barometric
Custom = Objecto personalisate
Thing = Objecto
AirQualitySensor = Sensor de qualitate del aria

## Properties

alarm = Alarma
pushed = Pulsate
not-pushed = Non pulsate
on-off = Active/inactive
on = Active
off = Inactive
power = Energia
voltage = Tension
temperature = Temperatura
current = Currente
frequency = Frequentia
color = Color
brightness = Brillantia
leak = Perdita
dry = Sic
color-temperature = Temperatura de color
video-unsupported = Video non supportate in tu navigator.
motion = Movimento
no-motion = Nulle movimento
open = Aperite
closed = Claudite
locked = Blocate
unlocked = Disblocate
jammed = Obstruite
unknown = Incognite
active = Active
inactive = Inactive
humidity = Humiditate
concentration = Concentration
density = Densitate

## Domain Setup

tunnel-setup-reclaim-domain = Il pare que tu ha jam registrate iste sub-dominio. Pro recuperar lo <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">clicca ci</a>.
check-email-for-token = Cerca tu emails pro un jeton de recuperation e colla lo supra.
reclaim-failed = Impossibile recuperar dominio.
subdomain-already-used = Tal sub-dominio es jam usate. Per favor elige un altere.
invalid-subdomain = Subdominio non valide.
invalid-email = Adresse email non valide.
invalid-reclamation-token = Jeton de recuperation non valide.
domain-success = Successo! Attende durante que nos re-adresse te…
issuing-error = Error al emission del certificato. Reproba
redirecting = Redirection…

## Booleans

true = Ver
false = False

## Time

utils-now = ora
utils-seconds-ago =
    { $value ->
        [one] { $value } secunda retro
       *[other] { $value } secundas retro
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minuta retro
       *[other] { $value } minutas retro
    }
utils-hours-ago =
    { $value ->
        [one] { $value } hora retro
       *[other] { $value } horas retro
    }
utils-days-ago =
    { $value ->
        [one] { $value } die retro
       *[other] { $value } dies retro
    }
utils-weeks-ago =
    { $value ->
        [one] { $valor } septimana retro
       *[other] { $valor } septimanas retro
    }
utils-months-ago =
    { $value ->
        [one] { $valor } mense retro
       *[other] { $valor } menses retro
    }
utils-years-ago =
    { $value ->
        [one] { $value } anno retro
       *[other] { $value } annos retro
    }
minute = Minuta
hour = Hora
day = Die
week = Septimana

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
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Unknown device type
new-thing-choose-icon = Elige icone…
new-thing-save = Salvar
new-thing-pin =
    .placeholder = Insere PIN
new-thing-pin-error = PIN incorrecte
new-thing-pin-invalid = PIN invalide
new-thing-cancel = Cancellar
new-thing-submit = Inviar
new-thing-username =
    .placeholder = Insere le nomine de usator
new-thing-password =
    .placeholder = Insere le contrasigno
new-thing-credentials-error = Credentiales incorrecte
new-thing-saved = Salvate
new-thing-done = Facite

## New Web Thing View

new-web-thing-url =
    .placeholder = Insere le URL de objecto del web
new-web-thing-label = Objecto del web
loading = Cargamento…
new-web-thing-multiple = Plure objectos web trovate
new-web-thing-from = de

## Empty div Messages

no-things = Nulle objectos ancora. Clicca + pro scannar objectos disponibile.
thing-not-found = Objecto non trovate.
action-not-found = Action non trovate.
events-not-found = Tal objecto ha nulle eventos.

## Add-on Settings

add-addons =
    .aria-label = Cercar nove additivos
author-unknown = Incognite
disable = Disactivar
enable = Activar
by = per
license = licentia
addon-configure = Configurar
addon-update = Actualisar
addon-remove = Remover
addon-updating = Actualisation...
addon-updated = Actualisate
addon-update-failed = Fallite
addon-config-applying = Applicante…
addon-config-apply = Applicar
addon-discovery-added = Addite
addon-discovery-add = Adder
addon-discovery-installing = Installation…
addon-discovery-failed = Fallite
addon-search =
    .placeholder = Cercar

## Page Titles

settings = Parametros
domain = Dominio
users = Usatores
edit-user = Rediger usator
add-user = Adder usator
adapters = Adaptatores
addons = Additivos
addon-config = Configurar additivo
addon-discovery = Cercar nove additivos
experiments = Experimentos
localization = Localisation
updates = Actualisationes
authorizations = Autorisationes
developer = Disveloppator
network = Rete
ethernet = Ethernet
wifi = Wi-Fi
icon = Icone

## Errors

unknown-state = Stato incognite.
error = Error
errors = Errores
gateway-unreachable = Passarella inattingibile
more-information = Plus de informationes
invalid-file = File non valide
failed-read-file = Falta a leger le file.
failed-save = Falta a salvar.

## Schema Form

unsupported-field = Schema de campo non supportate

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Accesso — { -webthings-gateway-brand }
login-log-in = Authenticar se
login-wrong-credentials = Nomine de usator o contrasigno incorrecte.
login-wrong-totp = Le codice de authentification non es correcte.
login-enter-totp = Insere le codice generate per tu app de authentification.

## Create First User Page

signup-title = Crear le usator — { -webthings-gateway-brand }
signup-welcome = Benvenite
signup-create-account = Crea tu prime conto de usator:
signup-password-mismatch = Le contrasignos non concorda
signup-next = Sequente

## Tunnel Setup Page

tunnel-setup-title = Elige adresse web — { -webthings-gateway-brand }
tunnel-setup-welcome = Benvenite
tunnel-setup-choose-address = Elige un secur adresse web pro tu passarella:
tunnel-setup-input-subdomain =
    .placeholder = subdominio
tunnel-setup-email-opt-in = Tene me actualisate del novas re WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Jeton de recuperation
tunnel-setup-error = Un error occurreva durante le configuration del sub-dominio.
tunnel-setup-create = Crear
tunnel-setup-skip = Saltar
tunnel-setup-time-sync = Attende pro horologio de systema esser configurate de internet. Le registration de dominio es probabile faller usque isto se completa.

## Authorize Page

authorize-title = Requesta de autorisation — { -webthings-gateway-brand }
authorize-authorization-request = Requesta de autorisation
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> desirarea acceder a tu passarella pro <<function>> apparatos.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = de <<domain>>
authorize-monitor-and-control = surveliar e controlar
authorize-monitor = surveliar
authorize-allow-all = Permitter a tote le objectos
authorize-allow =
    .value = Permitter
authorize-deny = Denegar

## Local Token Page

local-token-title = Servicio de jeton local — { -webthings-gateway-brand }
local-token-header = Servicio de jeton local
local-token-your-token = Tu jeton local es isto <a data-l10n-name="local-token-jwt">jeton web JSON</a>:
local-token-use-it = Usa lo pro communicar con le passarella con securitate, con le <a data-l10n-name="local-token-bearer-type">autorisation typo Bearer</a>.
local-token-copy-token = Copiar token

## Router Setup Page

router-setup-title = Configuration del router — { -webthings-gateway-brand }
router-setup-header = Crea un nove rete wifi
router-setup-input-ssid =
    .placeholder = Nomine del rete
router-setup-input-password =
    .placeholder = Contrasigno
router-setup-input-confirm-password =
    .placeholder = Confirmar le contrasigno
router-setup-create =
    .value = Crear
router-setup-password-mismatch = Le contrasignos debe concordar

## Wi-Fi Setup Page

wifi-setup-title = Configuration del rete — { -webthings-gateway-brand }
wifi-setup-header = Connecter a un rete wifi?
wifi-setup-input-password =
    .placeholder = Contrasigno
wifi-setup-show-password = Monstrar contrasigno
wifi-setup-connect =
    .value = Connecter
wifi-setup-network-icon =
    .alt = Rete Wi-Fi
wifi-setup-skip = Saltar

## Connecting to Wi-Fi Page

connecting-title = Connexion a wifi — { -webthings-gateway-brand }
connecting-header = Connexion a wifi…
connecting-connect = Presta attention a esser connectite al mesme rete e pois naviga a { $gateway-link } in tu navigator del Web pro continuar le installation.
connecting-warning = Nota: si tu non pote cargar { $domain }, recerca le adresse IP del passarella sur tu router.
connecting-header-skipped = Installation de rete wifi ignorate
connecting-skipped = Le passarella es ora in comenciamento. Aperi { $gateway-link } in tu navigator del Web per le connexion al mesme rete si que le passarella continua le installation.

## Creating Wi-Fi Network Page

creating-title = Creation del rete wifi — { -webthings-gateway-brand }
creating-header = Creation del rete wifi…
creating-content = Connecte te a { $ssid } con le contrasigno que tu ha justo create, pois aperi { $gateway-link } o { $ip-link } per tu navigator del Web.

## UI Updates

ui-update-available = Un interfacie usator actualisate es disponibile.
ui-update-reload = Recargar
ui-update-close = Clauder

## Transfer to webthings.io

action-required-image =
    .alt = Advertentia
action-required-more-info = Plus de informationes
action-required-dont-ask-again = Non plus demandar.
action-required-choose = Eliger
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-subdomain =
    .placeholder = Subdominio
transition-dialog-newsletter-label = Tene me actualisate del novas re WebThings
transition-dialog-email =
    .placeholder = Adresse de e-mail
transition-dialog-register =
    .value = Registra te

## General Terms

ok = Ok
ellipsis = …
event-log = Registro eventos
edit = Rediger
remove = Remover
disconnected = Disconnexe
processing = Processante…
submit = Inviar

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Retro
overflow-button =
    .aria-label = Actiones additional
submit-button =
    .aria-label = Inviar
edit-button =
    .aria-label = Rediger
save-button =
    .aria-label = Salvar
