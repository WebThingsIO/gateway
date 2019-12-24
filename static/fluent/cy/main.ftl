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

assistant-menu-item = Cynorthwyydd
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

## Assistant

assistant-avatar-image =
    .alt = Afatar Cynorthwyydd
assistant-controls-text-input =
    .placeholder = Sut fedra i helpu?

## Floorplan

upload-floorplan = Llwythwch y cynllun llawr...
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

network-settings-unsupported = Ni yw gosodiadau rhwydwaith yn cael eu cefnogi ar gyfer y platfform hwn.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
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
network-settings-enable-wifi = Galluogi Diwifr
network-settings-network-name = Enw'r rhwydwaith (SSID)
wireless-connected = Wedi cysylltu
wireless-icon =
    .alt = Rhwydwaith Diwfr
network-settings-changing = Newid gosodiadau rhwydwaith. Gall hyn gymryd munud.
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
user-settings-input-new-password =
    .placeholder = Cyfrinair Newydd (Dewisol)
user-settings-input-confirm-new-password =
    .placeholder = Cadarnhau Cyfrinair Newydd
user-settings-input-confirm-password =
    .placeholder = Cadarnhau Cyfrinair
user-settings-password-mismatch = Nid yw'r cyfrineiriau'n cydweddu
user-settings-save = Cadw

## Adapter Settings

adapter-settings-no-adapters = Dim addaswyr yn bresennol.

## Authorization Settings

authorization-settings-no-authorizations = Dim awdurdodi.

## Experiment Settings

experiment-settings-smart-assistant = Cynorthwyydd Clyfar
experiment-settings-logs = Cofnodion

## Localization Settings

localization-settings-language-region = Iaith a Rhanbarth
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
rules-delete-dialog = Ydych chi'n siŵr eich bod eisiau dileu'r rheol yn barhaol?
rules-delete-cancel =
    .value = Diddymu
rules-delete-confirm =
    .value = Tynnu Rheol
rule-invalid = Annilys
rule-delete-prompt = Ydych chi'n siŵr eich bod eisiau dileu'r rheol yn barhaol?
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

