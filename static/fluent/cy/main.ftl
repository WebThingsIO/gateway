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

things-menu-item = Pethau
rules-menu-item = Rheolau
logs-menu-item = Cofnodion
floorplan-menu-item = Cynllun Llawr
settings-menu-item = Gosodiadau
log-out-button = Allgofnodi

## Things

thing-details =
    .aria-label = Gweld Priodweddau
add-things =
    .aria-label = Ychwanegu Pethau Newydd

## Floorplan

upload-floorplan = Llwytho'r cynllun llawr...
upload-floorplan-hint = (argymell .svg)

## Top-Level Settings

settings-domain = Parth
settings-network = Rhwydwaith
settings-users = Defnyddwyr
settings-add-ons = Ychwanegion
settings-adapters = Addasyddion
settings-localization = Lleoleiddio
settings-updates = Diweddariadau
settings-authorizations = Awdurdodi
settings-experiments = Arbrofion
settings-developer = Datblygwr

## Domain Settings

domain-settings-local-label = Mynediad Lleol
domain-settings-local-update = Diweddaru enw gwesteiwr
domain-settings-remote-access = Mynediad Pell
domain-settings-local-name =
    .placeholder = porth

## Network Settings

network-settings-unsupported = Nid yw gosodiadau rhwydwaith yn cael eu cynnal ar gyfer y platfform hwn.
network-settings-ethernet-image =
    .alt = Ether-rwyd
network-settings-ethernet = Ether-rwyd
network-settings-wifi-image =
    .alt = Diwifr
network-settings-wifi = Diwifr
network-settings-home-network-image =
    .alt = Rhwydwaith Cartref
network-settings-internet-image =
    .alt = Rhyngrwyd
network-settings-configure = Ffurfweddu
network-settings-internet-wan = Rhyngrwyd (WAN)
network-settings-wan-mode = Modd
network-settings-home-network-lan = Rhwydwaith Cartref (LAN)
network-settings-wifi-wlan = Diwifr (WLAN)
network-settings-ip-address = Cyfeiriad IP
network-settings-dhcp = Awtomatig (DHCP)
network-settings-static = Â Llaw (IP Statig)
network-settings-pppoe = Pont (PPPoE)
network-settings-static-ip-address = Cyfeiriad IP statig
network-settings-network-mask = Masg rhwydwaith
network-settings-gateway = Porth
network-settings-done = Gorffen
network-settings-wifi-password =
    .placeholder = Cyfrinair
network-settings-show-password = Dangos cyfrinair
network-settings-connect = Cysylltu
network-settings-username = Enw Defnyddiwr
network-settings-password = Cyfrinair
network-settings-router-ip = Cyfeiriad IP llwybrydd
network-settings-dhcp-server = Gweinydd DHCP
network-settings-enable-wifi = Galluogi'r Diwifr
network-settings-network-name = Enw'r rhwydwaith (SSID)
wireless-connected = Wedi cysylltu
wireless-icon =
    .alt = Rhwydwaith Diwifr
network-settings-changing = Newid gosodiadau'r rhwydwaith. Gall hyn gymryd peth amser.
failed-ethernet-configure = Wedi methu ffurfweddu'r ether-rwyd.
failed-wifi-configure = Wedi methu ffurfweddu'r diwifr.
failed-wan-configure = Wedi methu ffurfweddu'r WAN.
failed-lan-configure = Wedi methu ffurfweddu'r LAN.
failed-wlan-configure = Wedi methu ffurfweddu'r WLAN.

## User Settings

create-user =
    .aria-label = Ychwanegu Defnyddiwr Newydd
user-settings-input-name =
    .placeholder = Enw
user-settings-input-email =
    .placeholder = E-bost
user-settings-input-password =
    .placeholder = Cyfrinair
user-settings-input-totp =
    .placeholder = Cod 2FA
user-settings-mfa-enable = Galluogi dilysu dau ffactor
user-settings-mfa-scan-code = Sganiwch y cod canlynol gydag unrhyw ap dilysu dau ffactor.
user-settings-mfa-secret = Dyma'ch cyfrinach TOTP newydd, rhag ofn nad yw'r cod QR uchod yn gweithio:
user-settings-mfa-error = Roedd y cod dilysu yn anghywir.
user-settings-mfa-enter-code = Rhowch y cod o'ch ap dilysu isod.
user-settings-mfa-verify = Dilysu
user-settings-mfa-regenerate-codes = Ail gynhyrchu codau wrth gefn
user-settings-mfa-backup-codes = Dyma'ch codau wrth gefn. Dim ond unwaith y mae modd defnyddio pob un. Cadwch nhw mewn lle diogel.
user-settings-input-new-password =
    .placeholder = Cyfrinair Newydd (Dewisol)
user-settings-input-confirm-new-password =
    .placeholder = Cadarnhau Cyfrinair Newydd
user-settings-input-confirm-password =
    .placeholder = Cadarnhau Cyfrinair
user-settings-password-mismatch = Nid yw'r cyfrineiriau'n cydweddu
user-settings-save = Cadw

## Adapter Settings

adapter-settings-no-adapters = Dim addaswyr ar gael.

## Authorization Settings

authorization-settings-no-authorizations = Dim awdurdodi.

## Experiment Settings

experiment-settings-no-experiments = Nid oes unrhyw arbrofion ar gael ar hyn o bryd.

## Localization Settings

localization-settings-language-region = Iaith ac Ardal
localization-settings-country = Gwlad
localization-settings-timezone = Cylchfa Amser
localization-settings-language = Iaith
localization-settings-units = Unedau
localization-settings-units-temperature = Tymheredd
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Diweddaru Nawr
update-available = Mae fersiwn newydd ar gael
update-up-to-date = Mae eich system yn gyfredol
updates-not-supported = Nid yw diweddariadau'n cael eu cynnal ar y platfform hwn.
update-settings-enable-self-updates = Galluogi diweddariadau awtomatig
last-update = Diweddariad diwethaf
current-version = Fersiwn gyfredol
failed = Methiant
never = Byth
in-progress = Ar Waith
restarting = Ailgychwyn
checking-for-updates = Gwirio am ddiweddariadau…
failed-to-check-for-updates = Methu gwirio am ddiweddariadau ar hyn o bryd.

## Developer Settings

developer-settings-enable-ssh = Galluogi SSH
developer-settings-view-internal-logs = Gweld Cofnodion Mewnol
developer-settings-create-local-authorization = Creu awdurdodi lleol

## Rules

add-rule =
    .aria-label = Creu Rheol Newydd
rules = Rheolau
rules-create-rule-hint = Heb greu rheolau. Cliciwch + i greu rheol.
rules-rule-name = Enw Rheol
rules-customize-rule-name-icon =
    .alt = Cyfaddasu Enw Rheol
rules-rule-description = Disgrifiad o'r Rheol
rules-preview-button =
    .alt = Rhagolwg
rules-delete-icon =
    .alt = Dileu
rules-drag-hint = Llusgwch eich dyfeisiau yma i ddechrau creu rheol
rules-drag-input-hint = Ychwanegu dyfais fel mewnbwn
rules-drag-output-hint = Ychwanegu dyfais fel allbwn
rules-scroll-left =
    .alt = Sgrolio i'r Chwith
rules-scroll-right =
    .alt = Sgrolio i'r Dde
rules-delete-prompt = Gollwng dyfeisiau yma i ddatgysylltu
rules-delete-dialog = Ydych chi'n siŵr eich bod eisiau dileu'r rheol yn llwyr?
rules-delete-cancel =
    .value = Diddymu
rules-delete-confirm =
    .value = Tynnu Rheol
rule-invalid = Annilys
rule-delete-prompt = Ydych chi'n siŵr eich bod eisiau dileu'r rheol yn llwyr?
rule-delete-cancel-button =
    .value = Diddymu
rule-delete-confirm-button =
    .value = Tynnu Rheol
rule-select-property = Dewis Priodwedd
rule-not = Nid
rule-event = Digwyddiad
rule-action = Gweithred
rule-configure = Ffurfweddu…
rule-time-title = Amser o'r dydd
rule-notification = Hysbysiad
notification-title = Teitl
notification-message = Neges
notification-level = lefel
notification-low = Isel
notification-normal = Arferol
notification-high = Uchel
rule-name = Enw Rheol

## Logs

add-log =
    .aria-label = Creu Cofnod Newydd
logs = Cofnodion
logs-create-log-hint = Heb greu cofnodion. Cliciwch + i greu cofnod.
logs-device = Dyfais
logs-device-select =
    .aria-label = Cofnodi Dyfais
logs-property = Priodwedd
logs-property-select =
    .aria-label = Cofnod Priodwedd
logs-retention = Cadw
logs-retention-length =
    .aria-label = Hyd Cadw Cofnod
logs-retention-unit =
    .aria-label = Uned Cadw Cofnod
logs-hours = Awr
logs-days = Diwrnod
logs-weeks = Wythnos
logs-save = Cadw
logs-remove-dialog-title = Tynnu
logs-remove-dialog-warning = Bydd cael gwared ar y cofnod hefyd yn dileu ei holl ddata. Ydych chi'n siŵr eich bod chi am gael gwared arno?
logs-remove = Tynnu
logs-unable-to-create = Methu creu cofnod
logs-server-remove-error = Gwall gweinydd: methu tynnu cofnod

## Add New Things

add-thing-scanning-icon =
    .alt = Sganio
add-thing-scanning = Sganio am ddyfeisiau newydd…
add-thing-add-adapters-hint = Heb ddarganfod unrhyw bethau newydd. Rhowch gynnig ar <a data-l10n-name="add-thing-add-adapters-hint-anchor">ychwanegu rhai ychwanegion</a>.
add-thing-add-by-url = Ychwanegu drwy URL...
add-thing-done = Gorffen
add-thing-cancel = Diddymu

## Context Menu

context-menu-choose-icon = Dewis eicon...
context-menu-save = Cadw
context-menu-remove = Tynnu

## Capabilities

OnOffSwitch = Switsh Ymlaen/Diffodd
MultiLevelSwitch = Switsh Aml-Lefel
ColorControl = Rheoli Lliw
ColorSensor = Synhwyrydd Lliw
EnergyMonitor = Monitor Ynni
BinarySensor = Synhwyrydd Deuaidd
MultiLevelSensor = Synhwyrydd Aml-Lefel
SmartPlug = Plwg Clyfar
Light = Golau
DoorSensor = Synhwyrydd Drws
MotionSensor = Synhwyrydd Symud
LeakSensor = Synhwyrydd Gollwng
PushButton = Botwm Pwyso
VideoCamera = Camera Fideo
Camera = Camera
TemperatureSensor = Synhwyrydd Tymheredd
HumiditySensor = Synhwyrydd Lleithder
Alarm = Larwm
Thermostat = Thermostat
Lock = Clo
BarometricPressureSensor = Synhwyrydd Pwysedd Barometrig
Custom = Peth Cyfaddas
Thing = Peth
AirQualitySensor = Synhwyrydd ansawdd awyr
SmokeSensor = Synhwyrydd Mwg

## Properties

alarm = Larwm
pushed = Pwyswyd
not-pushed = Heb Bwyso
on-off = Ymlaen/Diffodd
on = Ymlaen
off = Diffodd
power = Pŵer
voltage = Foltedd
temperature = Tymheredd
current = Cerrynt
frequency = Amledd
color = Lliw
brightness = Disgleirdeb
leak = Gollwng
dry = Sych
color-temperature = Tymheredd Lliw
video-unsupported = Ymddiheuriadau, nid yw fideo yn cael ei gynnal yn eich porwr.
motion = Symud
no-motion = Dim Symud
open = Agored
closed = Ar Gau
locked = Wedi'i gloi
unlocked = Wedi'i ddatgloi
jammed = Yn sownd
unknown = Anhysbys
active = Gweithredol
inactive = Anweithredol
humidity = Lleithder
concentration = Crynodiad
density = Dwysedd
smoke = Mwg

## Domain Setup

tunnel-setup-reclaim-domain = Mae'n edrych fel eich bod eisoes wedi cofrestru'r is-barth hwnnw. I'w hawlio yn ôl <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">cliciwch yma</a>.
check-email-for-token = Gwiriwch eich e-bost am docyn adfer a'i ludo yn y blwch uchod.
reclaim-failed = Methu adennill parth.
subdomain-already-used = Mae'r is-barth hwn eisoes yn cael ei ddefnyddio. Dewiswch un gwahanol.
invalid-subdomain = Is-barth annilys
invalid-email = Cyfeiriad e-bost annilys
invalid-reclamation-token = Tocyn adfer annilys.
domain-success = Llwyddiant! Arhoswch wrth i ni eich ailgyfeirio...
issuing-error = Gwall wrth gyhoeddi tystysgrif. Ceisiwch eto, os gwelwch yn dda.
redirecting = Ailgyfeirio…

## Booleans

true = Gwir
false = Gau

## Time

utils-now = Nawr
utils-seconds-ago =
    { $value ->
        [zero] { $value } eiliad yn ôl
        [one] { $value } eiliad yn ôl
        [two] { $value } eiliad yn ôl
        [few] { $value } eiliad yn ôl
        [many] { $value } eiliad yn ôl
       *[other] { $value } eiliad yn ôl
    }
utils-minutes-ago =
    { $value ->
        [zero] { $value } munud yn ôl
        [one] { $value } munud yn ôl
        [two] { $value } munud yn ôl
        [few] { $value } munud yn ôl
        [many] { $value } munud yn ôl
       *[other] { $value } munud yn ôl
    }
utils-hours-ago =
    { $value ->
        [zero] { $value } awr yn ôl
        [one] { $value } awr yn ôl
        [two] { $value } awr yn ôl
        [few] { $value } awr yn ôl
        [many] { $value } awr yn ôl
       *[other] { $value } awr yn ôl
    }
utils-days-ago =
    { $value ->
        [zero] { $value } diwrnod yn ôl
        [one] { $value } diwrnod yn ôl
        [two] { $value } diwrnod yn ôl
        [few] { $value } diwrnod yn ôl
        [many] { $value } diwrnod yn ôl
       *[other] { $value } diwrnod yn ôl
    }
utils-weeks-ago =
    { $value ->
        [zero] { $value } wythnos yn ôl
        [one] { $value } wythnos yn ôl
        [two] { $value } wythnos yn ôl
        [few] { $value } wythnos yn ôl
        [many] { $value } wythnos yn ôl
       *[other] { $value } wythnos yn ôl
    }
utils-months-ago =
    { $value ->
        [zero] { $value } mis yn ôl
        [one] { $value } mis yn ôl
        [two] { $value } mis yn ôl
        [few] { $value } mis yn ôl
        [many] { $value } mis yn ôl
       *[other] { $value } mis yn ôl
    }
utils-years-ago =
    { $value ->
        [zero] { $value } blwyddyn yn ôl
        [one] { $value } blwyddyn yn ôl
        [two] { $value } blwyddyn yn ôl
        [few] { $value } blwyddyn yn ôl
        [many] { $value } blwyddyn yn ôl
       *[other] { $value } blwyddyn yn ôl
    }
minute = Munud
hour = Awr
day = Diwrnod
week = Wythnos

## Unit Abbreviations

abbrev-volt = F
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
abbrev-hour = a
abbrev-minute = m
abbrev-second = e
abbrev-millisecond = me
abbrev-foot = tr
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Math o ddyfais anhysbys
new-thing-choose-icon = Dewis eicon...
new-thing-save = Cadw
new-thing-pin =
    .placeholder = Rhowch PIN
new-thing-pin-error = PIN anghywir
new-thing-pin-invalid = PIN annilys
new-thing-cancel = Diddymu
new-thing-submit = Cyflwyno
new-thing-username =
    .placeholder = Rhowch enw defnyddiwr
new-thing-password =
    .placeholder = Rhowch gyfrinair
new-thing-credentials-error = Manylion anghywir
new-thing-saved = Wedi'u Cadw
new-thing-done = Gorffen

## New Web Thing View

new-web-thing-url =
    .placeholder = Rhowch URL peth gwe
new-web-thing-label = Peth Gwe
loading = Llwytho…
new-web-thing-multiple = Wedi darganfod amryw o bethau gwe
new-web-thing-from = o

## Empty div Messages

no-things = Dim dyfeisiau eto. Cliciwch + i sganio am y dyfeisiau sydd ar gael.
thing-not-found = Heb ganfod y peth
action-not-found = Heb ganfod y weithred.
events-not-found = Nid oes gan y peth hwn unrhyw ddigwyddiad.

## Add-on Settings

add-addons =
    .aria-label = Canfod Ychwanegion Newydd
author-unknown = Anhysbys
disable = Analluogi
enable = Galluogi
by = gan
license = trwydded
addon-configure = Ffurfweddu
addon-update = Diweddaru
addon-remove = Tynnu
addon-updating = Diweddaru…
addon-updated = Diweddarwyd
addon-update-failed = Methwyd
addon-config-applying = Gosod…
addon-config-apply = Gosod
addon-discovery-added = Ychwanegwyd
addon-discovery-add = Ychwanegu
addon-discovery-installing = Gosod…
addon-discovery-failed = Methiant
addon-search =
    .placeholder = Chwilio

## Page Titles

settings = Gosodiadau
domain = Parth
users = Defnyddwyr
edit-user = Golygu Defnyddiwr
add-user = Ychwanegu Defnyddiwr
adapters = Addasyddion
addons = Ychwanegion
addon-config = Ffurfweddu Ychwanegyn
addon-discovery = Canfod Ychwanegion Newydd
experiments = Arbrofion
localization = Lleoleiddio
updates = Diweddariadau
authorizations = Awdurdodi
developer = Datblygwr
network = Rhwydwaith
ethernet = Ether-rwyd
wifi = Diwifr
icon = Eicon

## Errors

unknown-state = Cyflwr anhysbys.
error = Gwall
errors = Gwallau
gateway-unreachable = Methu cyrraedd y porth
more-information = Rhagor o Wybodaeth
invalid-file = Ffeil annilys.
failed-read-file = Wedi methu darllen ffeil.
failed-save = Wedi methu cadw

## Schema Form

unsupported-field = Sgema maes heb ei gynnal

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Mewngofnod - { -webthings-gateway-brand }
login-log-in = Mewngofnodi
login-wrong-credentials = Roedd yr enw defnyddiwr neu'r cyfrinair yn anghywir.
login-wrong-totp = Roedd y cod dilysu yn anghywir.
login-enter-totp = Rhowch y cod o'ch ap dilysu.

## Create First User Page

signup-title = Creu Defnyddiwr - { -webthings-gateway-brand }
signup-welcome = Croeso
signup-create-account = Creu eich cyfrif defnyddiwr cyntaf:
signup-password-mismatch = Nid yw cyfrineiriau'n cyfateb
signup-next = Nesaf

## Tunnel Setup Page

tunnel-setup-title = Dewis Cyfeiriad Gwe - { -webthings-gateway-brand }
tunnel-setup-welcome = Croeso
tunnel-setup-choose-address = Dewis cyfeiriad gwe diogel ar gyfer eich porth:
tunnel-setup-input-subdomain =
    .placeholder = is-barth
tunnel-setup-email-opt-in = Gadewch i mi wybod am y newyddion am WebThings.
tunnel-setup-agree-privacy-policy = Cytuno i <a data-l10n-name="tunnel-setup-privacy-policy-link">Bolisi Preifatrwydd</a> a <a data-l10n-name="tunnel-setup-tos-link">Thelerau Gwasanaeth </a> WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Tocyn Adfer
tunnel-setup-error = Digwyddodd gwall wrth osod yr is-barth.
tunnel-setup-create = Creu
tunnel-setup-skip = Hepgor
tunnel-setup-time-sync = Aros i gloc y system o'r Rhyngrwyd gael ei osod. Mae cofrestru'r parth yn debygol o fethu nes bydd hyn wedi'i gwblhau.

## Authorize Page

authorize-title = Cais am Awdurdodi - { -webthings-gateway-brand }
authorize-authorization-request = Cais am Awdurdodi
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = Hoffai <<name>> gael mynediad i'ch porth i ddyfeisiau <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = o <<domain>>
authorize-monitor-and-control = monitro a rheoli
authorize-monitor = monitor
authorize-allow-all = Caniatáu am Bob Peth
authorize-allow =
    .value = Caniatáu
authorize-deny = Gwrthod

## Local Token Page

local-token-title = Gwasanaeth Tocyn Lleol - { -webthings-gateway-brand }
local-token-header = Gwasanaeth Tocyn Lleol
local-token-your-token = Eich tocyn lleol yw'r <a data-l10n-name="local-token-jwt">Tocyn Gwe JSON</a>:
local-token-use-it = Defnyddiwch ef i gyfathrebu â'r porth yn ddiogel, gyda <a data-l10n-name="local-token-bearer-type">Awdurdodi Math Cludwr</a>.
local-token-copy-token = Copïwch y Tocyn

## Router Setup Page

router-setup-title = Gosodiad y Llwybrydd - { -webthings-gateway-brand }
router-setup-header = Creu rhwydwaith diwifr newydd
router-setup-input-ssid =
    .placeholder = Enw'r rhwydwaith
router-setup-input-password =
    .placeholder = Cyfrinair
router-setup-input-confirm-password =
    .placeholder = Cadarnhau'r cyfrinair
router-setup-create =
    .value = Creu
router-setup-password-mismatch = Rhaid i'r cyfrineiriau gydweddu.

## Wi-Fi Setup Page

wifi-setup-title = Gosodiad Diwifr- { -webthings-gateway-brand }
wifi-setup-header = Cysylltu â rhwydwaith diwifr?
wifi-setup-input-password =
    .placeholder = Cyfrinair
wifi-setup-show-password = Dangos cyfrinair
wifi-setup-connect =
    .value = Cysylltu
wifi-setup-network-icon =
    .alt = Rhwydwaith Diwifr
wifi-setup-skip = Hepgor

## Connecting to Wi-Fi Page

connecting-title = Yn cysylltu â'r diwifr - { -webthings-gateway-brand }
connecting-header = Cysylltu â'r diwifr…
connecting-connect = Sicrhewch eich bod wedi'ch cysylltu â'r un rhwydwaith ac yna llywio i { $gateway-link } yn eich porwr gwe i barhau'r gosod.
connecting-warning = Sylw: Os nad ydych yn gallu llwytho { $domain }, chwiliwch am gyfeiriad IP y porth ar eich llwybrydd.
connecting-header-skipped = Hepgor cam gosod y diwifr
connecting-skipped = Mae'r porth nawr yn cael ei gychwyn. Yn eich porwr gwe, ewch i { $gateway-link } tra ar yr un  rhwydwaith â'r porth i barhau'r gosod.

## Creating Wi-Fi Network Page

creating-title = Yn Creu Rhwydwaith Diwifr - { -webthings-gateway-brand }
creating-header = Yn creu rhwydwaith diwifr…
creating-content = Cysylltwch â { $ssid } gyda'r cyfrinair rydych newydd ei greu, yna ewch i { $gateway-link } neu { $ip-link } yn eich porwr gwe.

## UI Updates

ui-update-available = Mae rhyngwyneb defnyddiwr wedi'i ddiweddaru ar gael.
ui-update-reload = Llwytho eto
ui-update-close = Cau

## Transfer to webthings.io

action-required-image =
    .alt = Rhybudd
action-required = Camau Angenrheidiol:
action-required-message = Mae gwasanaeth mynediad o bell Mozilla IoT a'r diweddariadau meddalwedd awtomatig yn dod i ben. Dewiswch p'un ai i drosglwyddo i webthings.io sy'n cael ei redeg gan y gymuned i gael gwasanaeth parhaus.
action-required-more-info = Rhagor o wybodaeth
action-required-dont-ask-again = Peidiwch a gofyn eto.
action-required-choose = Dewis
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Mae gwasanaeth mynediad o bell Mozilla IoT a'r diweddariadau meddalwedd awtomatig yn dod i ben ar 31ain Rhagfyr 2020 (<a data-l10n-name="transition-dialog-more-info">Rhagor</a>). Mae Mozilla yn trosglwyddo'r project i <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> (nad yw'n gysylltiedig â Mozilla). <br> <br > Os nad ydych am barhau i dderbyn diweddariadau meddalwedd gan weinyddion diweddaru sy'n cael eu rhedeg gan y gymuned, gallwch analluogi'r diweddariadau awtomatig yn y Gosodiadau. <br> <br> Os hoffech drosglwyddo'ch is-barth mozilla-iot.org i webthings.io, neu gofrestru is-barth newydd, gallwch lenwi'r ffurflen isod i gofrestru ar gyfer y gwasanaeth mynediad o bell sy'n cael ei redeg gan y gymuned.
transition-dialog-register-domain-label = Cofrestru ar gyfer y gwasanaeth mynediad o bell webthings.io
transition-dialog-subdomain =
    .placeholder = Is-barth
transition-dialog-newsletter-label = Gadewch i mi wybod am y newyddion diweddaraf am WebThings.
transition-dialog-agree-tos-label = Yn cytuno i <a data-l10n-name="tunnel-setup-privacy-policy-link">Bolisi Preifatrwydd</a> a <a data-l10n-name="tunnel-setup-tos-link">Thelerau Gwasanaeth </a> WebThings.
transition-dialog-email =
    .placeholder = Cyfeiriad e-bost
transition-dialog-register =
    .value = Cofrestru
transition-dialog-register-status =
    .alt = Statws cofrestru
transition-dialog-register-label = Cofrestru is-barth
transition-dialog-subscribe-status =
    .alt = Statws tanysgrifio i'r cylchlythyr
transition-dialog-subscribe-label = Tanysgrifio i'r cylchlythyr
transition-dialog-error-generic = Digwyddodd gwall. Ewch yn ôl a cheisiwch eto.
transition-dialog-error-subdomain-taken = Mae'r is-barth a ddewiswyd wedi'i gymryd eisoes. Ewch yn ôl a dewis un arall.
transition-dialog-error-subdomain-failed = Wedi methu cofrestru'r is-barth. Ewch yn ôl a rhoi cynnig arall arni.
transition-dialog-error-subscribe-failed = Wedi methu tanysgrifio i'r cylchlythyr. Rhowch gynnig arall arni yn <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Llywiwch i <<domain>> i barhau.

## General Terms

ok = Iawn
ellipsis = …
event-log = Cofnod Digwyddiad
edit = Golygu
remove = Tynnu
disconnected = Datgysylltwyd
processing = Prosesu…
submit = Cyflwyno

## Top-Level Buttons

menu-button =
    .aria-label = Dewislen
back-button =
    .aria-label = Nôl
overflow-button =
    .aria-label = Gweithrediadau Ychwanegol
submit-button =
    .aria-label = Cyflwyno
edit-button =
    .aria-label = Golygu
save-button =
    .aria-label = Cadw
