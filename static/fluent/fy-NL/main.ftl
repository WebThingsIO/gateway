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

assistant-menu-item = Assistint
things-menu-item = Things
rules-menu-item = Rigels
logs-menu-item = Lochboeken
floorplan-menu-item = Plattegrûn
settings-menu-item = Ynstellingen
log-out-button = Ofmelde

## Assistant

assistant-avatar-image =
  .alt = Assistint Avatar
assistant-controls-text-input =
  .placeholder = Hoe kin ik helpe?

## Floorplan

upload-floorplan = Plattegrûn oplade…
upload-floorplan-hint = (.svg oanrekommandearre)

## Top-Level Settings

settings-domain = Domein
settings-network = Netwurk
settings-users = Brûkers
settings-add-ons = Add-ons
settings-adapters = Adapters
settings-localization = Lokalisaasje
settings-updates = Fernijingen
settings-authorizations = Autorisaasjes
settings-experiments = Eksperiminten
settings-developer = Untwikkeler

## Domain Settings

domain-settings-local-label = Lokale tagong
domain-settings-local-update = Hostnamme bywurkje
domain-settings-remote-access = Eksterne tagong
domain-settings-local-name =
  .placeholder = gateway

## Network Settings

network-settings-unsupported = Netwurkynstelligen wurde op dit platfoarm net stipe.
network-settings-ethernet-image =
  .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
  .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
  .alt = Thúsnetwurk
network-settings-internet-image =
  .alt = Ynternet
network-settings-configure = Konfigurearje
network-settings-internet-wan = Ynternet (WAN)
network-settings-home-network-lan = Thúsnetwurk (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-adres
network-settings-dhcp = Automatysk (DHCP)
network-settings-static = Hânmjittich (Statysk IP-adres)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Statysk IP-adres
network-settings-network-mask = Netwurkmask
network-settings-gateway = Gateway
network-settings-done = Dien
network-settings-wifi-password =
  .placeholder = Wachtwurd
network-settings-show-password = Wachtwurd toane
network-settings-connect = Ferbine
network-settings-username = Brûkersnamme
network-settings-password = Wachtwurd
network-settings-router-ip = IP-adres router
network-settings-dhcp-server = DHCP-server
network-settings-enable-wifi = Wi-Fi ynskeakelje
network-settings-network-name = Netwurknamme (SSID)
wireless-connected = Ferbûn
wireless-icon =
  .alt = Wi-Fi-netwurk
network-settings-changing = Netwurkynstellingen wizigje. Dit kan efkes duorje.
failed-ethernet-configure = Ethernet ynstelle mislearre.
failed-wifi-configure = Wi-Fi ynstelle mislearre.
failed-wan-configure = WAN ynstelle mislearre.
failed-lan-configure = LAN ynstelle mislearre.
failed-wlan-configure = WLAN ynstelle mislearre.

## User Settings

user-settings-input-name =
  .placeholder = Namme
user-settings-input-email =
  .placeholder = E-mailadres
user-settings-input-password =
  .placeholder = Wachtwurd
user-settings-input-new-password =
  .placeholder = Nij wachtwurd (opsjoneel)
user-settings-input-confirm-new-password =
  .placeholder = Befêstigje nij wachtwurd
user-settings-input-confirm-password =
  .placeholder = Befêstigje wachtwurd
user-settings-password-mismatch = Wachtwurden binne net lyk
user-settings-save = Bewarje

## Adapter Settings

adapter-settings-no-adapters = Gjin adapters fûn.

## Authorization Settings

authorization-settings-no-authorizations = Gjin autorisaasje.

## Experiment Settings

experiment-settings-smart-assistant = Smart Assistant
experiment-settings-logs = Lochboeken

## Localization Settings

localization-settings-language-region = Taal & regio
localization-settings-country = Lân
localization-settings-timezone = Tiidsône
localization-settings-language = Taal
localization-settings-units = Ienheden
localization-settings-units-temperature = Temperatuer
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = No bywurkje
update-available = Nije ferzje beskikber
update-up-to-date = Gjin fernijingen beskikber
last-update = Lêste fernijing
current-version = Aktuele ferzje
failed = Mislearre
never = Nea
in-progress = Dwaande
restarting = Opnij starte

## Developer Settings

developer-settings-enable-ssh = SSH ynskeakelje
developer-settings-view-internal-logs = Ynterne lochboeken toane
developer-settings-create-local-authorization = Meitsje lokale autorisaasje

## Rules

rules = Rigels
rules-create-rule-hint = Gjin rigels. Klik op + om in rigel te meitsjen.
rules-rule-name = Rigelnamme
rules-customize-rule-name-icon =
  .alt = Rigelnamme oanpasse
rules-rule-description = Rigelbeskriuwing
rules-preview-button =
  .alt = Foarbyld
rules-delete-icon =
  .alt = Fuortsmite
rules-drag-hint = Sleep hjir in apparaat hinne om in rigel te meitsjen
rules-drag-input-hint = Apparaat tafoegje as input
rules-drag-output-hint = Apparaat tafoegje as output
rules-scroll-left =
  .alt = Nei links skowe
rules-scroll-right =
  .alt = Nei rjochts skowe
rules-delete-prompt = Sleep apparaten hjirhinne om te ûntkeppeljen
rules-delete-dialog = Binne jo wis dat jo dizze rigel fuortsmite wolle?
rules-delete-cancel =
  .value = Annulearje
rules-delete-confirm =
  .value = Smyt rigel fuort
rule-invalid = Unjildich
rule-delete-prompt = Binne jo wis dat jo dizze rigel fuortsmite wolle?
rule-delete-cancel-button =
  .value = Annulearje
rule-delete-confirm-button =
  .value = Smyt rigel fuort
rule-select-property = Selektearje eigenskip
rule-not = Net
rule-event = Barren
rule-action = Aksje
rule-configure = Ynstelle…
rule-time-title = Tiid
rule-notification = Melding
notification-title = Titel
notification-message = Berjocht
notification-level = Nivo
notification-low = Leech
notification-normal = Gemiddeld
notification-high = Heech
rule-name = Rigelnamme

## Logs

logs = Lochboeken
logs-create-log-hint = Gjin lochboeken. Klik op + om in lochboek oan te meitsjen.
logs-device = Apparaat
logs-device-select =
  .aria-label = Apparaatlochboek
logs-property = Eigenskip
logs-property-select =
  .aria-label = Eigenskiplochboek
logs-retention = Bewartermyn
logs-retention-length =
  .aria-label = Bewartermyn lochboek
logs-retention-unit =
  .aria-label = Ienheid bewartermyn lochboek
logs-hours = Oeren
logs-days = Dagen
logs-weeks = Wiken
logs-save = Bewarje
logs-remove-dialog-title = Fuortsmite
logs-remove-dialog-warning = As it lochboek fuortsmiten wurdt, wurde ek de byhearrende gegevens wiske.
  Wolle jo dizze echt fuortsmite?
logs-remove = Fuortsmite
logs-unable-to-create = Kin lochboek net oanmeitsje
logs-server-remove-error = Serverflater: kin lochboek net fuortsmite

## Add New Things

add-thing-scanning-icon =
  .alt = Sykje
add-thing-scanning = Nije apparaten sykje…
add-thing-add-adapters-hint = Gjin apparaten fûn. Probearje <a data-l10n-name="add-thing-add-adapters-hint-anchor">add-ons ta te foegjen</a>.
add-thing-add-by-url = Tafoegje mei URL…
add-thing-done = Dien
add-thing-cancel = Annulearje

## Context Menu

context-menu-choose-icon = Kies piktogram…
context-menu-save = Bewarje
context-menu-remove = Fuortsmite

## Capabilities

OnOffSwitch = Oan-/Ut-skeakeler
MultiLevelSwitch = Skeakeler mei nivo’s
ColorControl = Kleurynstelling
ColorSensor = Kleursensor
EnergyMonitor = Enerzjymonitor
BinarySensor = Binêre sensor
MultiLevelSensor = Sensor mei nivo’s
SmartPlug = Tûke ynstekker
Light = Ljocht
DoorSensor = Doarsensor
MotionSensor = Bewegingsmelder
LeakSensor = Lekkaazjesensor
PushButton = Drukknop
VideoCamera = Fideokamera
Camera = Kamera
TemperatureSensor = Temperatuersensor
Alarm = Alarm
Thermostat = Termostaat
Lock = Slot
Custom = Oanpast Thing

## Properties

alarm = Alarm
pushed = Yndrukt
not-pushed = Net yndrukt
on-off = Oan/Ut
on = Oan
off = Ut
power = Fermogen
voltage = Spanning
temperature = Temperatuer
current = Aktueel
frequency = Frekwinsje
color = Kleur
brightness = Helderheid
leak = Lek
dry = Drûch
color-temperature = Kleurtemperatuer
video-unsupported = Sorry, fideo wurdt net stipe yn jo browser.
motion = Beweging
no-motion = Gjin beweging
open = Iepen
closed = Sluten
locked = Beskoattele
unlocked = Untskoattele
jammed = Klemd
unknown = Unbekend

## Domain Setup

tunnel-setup-reclaim-domain = It liket derop dat jo dat subdomein al registrearre hawwe. Om it op te easkjen <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">klik hjir</a>.
check-email-for-token = Yn jo e-mailberjocht ûntfange jo in token foar it opeaskjen. Plak dit hjirboppe.
reclaim-failed = Kin domein net opeaskje.
subdomain-already-used = Dit subodmein is al yn gebrûk. Kies in oar.
invalid-reclamation-token = Unjildich opeask-token.
domain-success = Slagge! Wy ferwize jo browser troch…
issuing-error = Flater mei it sertifikaat opheljen. Probearje it opnij.
redirecting = Trochstjoere…

## Booleans

true = Ja
false = Nee

## Time

utils-now = no
utils-seconds-ago =
  { $value ->
      [one] { $value } sekonde lyn
     *[other] { $value } sekonden lyn
  }
utils-minutes-ago =
  { $value ->
      [one] { $value } minút lyn
     *[other] { $value } minuten lyn
  }
utils-hours-ago =
  { $value ->
      [one] { $value } oer lyn
     *[other] { $value } oer lyn
  }
utils-days-ago =
  { $value ->
      [one] { $value } dei lyn
     *[other] { $value } dagen lyn
  }
utils-weeks-ago =
  { $value ->
      [one] { $value } wike lyn
     *[other] { $value } wiken lyn
  }
utils-months-ago =
  { $value ->
      [one] { $value } moanne lyn
     *[other] { $value } moannen lyn
  }
utils-years-ago =
  { $value ->
      [one] { $value } jier lyn
     *[other] { $value } jier lyn
  }
minute = Minút
hour = Oer
day = Dei
week = Wike

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
abbrev-hour = o
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft

## New Thing View

unknown-device-type = Unbekend apparaattype
new-thing-choose-icon = Kies piktogram…
new-thing-save = Bewarje
new-thing-pin =
  .placeholder = Fier pinkoade yn
new-thing-pin-error = Foute pinkoade
new-thing-pin-invalid = Unjildige pinkoade
new-thing-cancel = Annulearje
new-thing-submit = Ferstjoer
new-thing-username =
  .placeholder = Brûkersnamme
new-thing-password =
  .placeholder = Wachtwurd
new-thing-credentials-error = Unjildige kombinaasje brûkersnamme/wachtwurd
new-thing-saved = Bewarre
new-thing-done = Dien

## New Web Thing View

new-web-thing-url =
  .placeholder = Web Thing-URL
new-web-thing-label = Web Thing
loading = Lade…
new-web-thing-multiple = Mear Web Things fûn
new-web-thing-from = fan

## Empty div Messages

no-things = Gjin apparaten. Klik + om apparaten te sykjen.
thing-not-found = Thing net fûn.
action-not-found = Aksje net fûn.
events-not-found = Dit Thing hat gjin barrens.

## Add-on Settings

author-unknown = Unbekend
disable = Utskeakele
enable = Ynskeakele
by = troch
addon-configure = Ynstelle
addon-update = Fernije
addon-remove = Fuortsmite
addon-updating = Fernije…
addon-updated = Fernijt
addon-update-failed = Mislearre
addon-config-applying = Tapasse…
addon-config-apply = Tapasse
addon-discovery-added = Tafoege
addon-discovery-add = Tafoegje
addon-discovery-installing = Ynstallearje…
addon-discovery-failed = Mislearre

## Page Titles

settings = Ynstellingen
domain = Domein
users = Brûkers
edit-user = Brûker beheare
add-user = Brûker tafoegje
adapters = Adapters
addons = Add-ons
addon-config = Add-on ynstelle
addon-discovery = Nije add-ons sykje
experiments = Eksperiminten
localization = Lokalisaasje
updates = Fernijingen
authorizations = Autorisaasjes
developer = Untwikkeler
network = Netwurk
ethernet = Ethernet
wifi = Wi-Fi
icon = Piktogram

## Speech

speech-unsupported = De browser stipet gjin spraak
speech-didnt-get = Sorry, ik haw jo net begrepen.

## Errors

unknown-state = Unbekende steat.
error = Flater
errors = Flaters
gateway-unreachable = Gateway net berikber
more-information = Mear ynformaasje
invalid-file = Unjildich bestân.
failed-read-file = Bestân lêzen mislearre.
failed-save = Bestân bewarjen mislearre.

## Schema Form

unsupported-field = Fjildskema net stipe

## Icon Sources

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Oanmelde — { -webthings-gateway-brand }
login-log-in = Oanmelde

## Create First User Page

signup-title = Brûker tafoegje — { -webthings-gateway-brand }
signup-welcome = Wolkom
signup-create-account = Meitsje jo earste brûker oan:
signup-password-mismatch = Wachtwurden binne net lyk
signup-next = Folgjende

## Tunnel Setup Page

tunnel-setup-title = Kies webadres — { -webthings-gateway-brand }
tunnel-setup-welcome = Wolkom
tunnel-setup-choose-address = Kies in befeilige webadres foar jo gateway:
tunnel-setup-input-subdomain =
  .placeholder = subdomein
tunnel-setup-opt-in = Hâld my op de hichte oer nije mooglikheden en bydragen.
tunnel-setup-privacy-policy = Privacybelied
tunnel-setup-input-reclamation-token =
  .placeholder = Opeasktoken
tunnel-setup-error = Der is in flater bard by it ynstellen fan it subdomein.
tunnel-setup-create = Oanmeitsje
tunnel-setup-skip = Oerslaan
tunnel-setup-time-sync = Wacht op it ynstellen fan de klok fia ynternet. Domeinregistraasje sil oars wierskynlik mislearre.

## Authorize Page

authorize-title = Autorisaasje-oanfraach — { -webthings-gateway-brand }
authorize-authorization-request = Autorisaasje-oanfraach
authorize-monitor-and-control = besjen en ynstelle
authorize-monitor = besjen
authorize-allow-all = Tastean foar alle Things
authorize-allow =
  .value = Tastean
authorize-deny = Wegerje

## Local Token Page

local-token-title = Lokale tokentsjinst — { -webthings-gateway-brand }
local-token-header = Lokale tokentsjinst
local-token-your-token = Jo lokale token is <a data-l10n-name="local-token-jwt">JSON Web-token</a>.
local-token-use-it = Brûk dizze om befeilige mei de gateway te praten, mei <a data-l10n-name="local-token-bearer-type">Bearer-type-autorisaasje</a>.

## Router Setup Page

router-setup-title = Routerynstellingen — { -webthings-gateway-brand }
router-setup-header = Meitsje in Wi-Fi-ferbining
router-setup-input-ssid =
  .placeholder = Netwurknamme
router-setup-input-password =
  .placeholder = Wachtwurd
router-setup-input-confirm-password =
  .placeholder = Befêstigje wachtwurd
router-setup-create =
  .value = Oanmeitsje
router-setup-password-mismatch = Wachtwurden moatte oerienkomme

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi-ynstellingen — { -webthings-gateway-brand }
wifi-setup-header = Ferbine mei Wi-Fi-netwurk?
wifi-setup-input-password =
  .placeholder = Wachtwurd
wifi-setup-show-password = Wachtwurd toane
wifi-setup-connect =
  .value = Ferbine
wifi-setup-network-icon =
  .alt = Wi-Fi-netwurk
wifi-setup-skip = Oerslaan

## Connecting to Wi-Fi Page

connecting-title = Ferbine mei Wi-Fi — { -webthings-gateway-brand }
connecting-header = Ferbine mei Wi-Fi…
connecting-connect = Kontrolearje oft jo ferbûn binne mei itselde netwurk en
 navigearje dan nei { $gateway-link } yn jo webbrowser om de ynstallaasje te foltôgjen.
connecting-warning = Let op: As jo { $domain } net lade kinne, kontrolearje
 it IP-adres fan de gateway yn jo router.
connecting-header-skipped = Ynstallaasje Wi-Fi oersloegen
connecting-skipped = De gateway wurdt opstart. Navigearje nei
 { $gateway-link } yn jo webbrowser, wylst jo ferbûn binne mei itselde netwurk,
 om de ynstallaasje te foltôgjen.

## Creating Wi-Fi Network Page

creating-title = Wi-Fi-netwurk meitsje — { -webthings-gateway-brand }
creating-header = Wi-Fi-netwurk meitsje…
creating-content = Ferbyn mei { $ssid } en it ynstelde wachtwurd,
 navigearje dêrnei nei { $gateway-link } of { $ip-link } yn jo webbrowser.

## General Terms

ok = Ok
ellipsis = …
event-log = Barrenslochboek
edit = Bewurkje
remove = Fuortsmite
disconnected = Untkeppelje
processing = Ferwurkje…
submit = Ferstjoer
