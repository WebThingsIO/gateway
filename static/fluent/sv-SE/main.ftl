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

rules-menu-item = Regler
logs-menu-item = Loggar
settings-menu-item = Inställningar
log-out-button = Logga ut

## Things


## Assistant


## Floorplan


## Top-Level Settings

settings-domain = Domän
settings-network = Nätverk
settings-users = Användare
settings-add-ons = Tillägg
settings-updates = Uppdateringar
settings-developer = Utvecklare

## Domain Settings

domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Hemnätverk
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Konfigurera
network-settings-internet-wan = Internet (WAN)
network-settings-home-network-lan = Hemnätverk (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-adress
network-settings-dhcp = Automatisk (DHCP)
network-settings-pppoe = Brygga (PPPoE)
network-settings-static-ip-address = Statisk IP adress
network-settings-network-mask = Nätverksmask
network-settings-gateway = Gateway
network-settings-wifi-password =
    .placeholder = Lösenord
network-settings-show-password = Visa lösenord
network-settings-connect = Anslut
network-settings-username = Användarnamn
network-settings-password = Lösenord
network-settings-router-ip = Router IP adress
network-settings-dhcp-server = DHCP server
network-settings-enable-wifi = Aktivera Wi-Fi
network-settings-network-name = Nätverksnamn (SSID)
wireless-connected = Ansluten
wireless-icon =
    .alt = Wi-Fi nätverk
failed-ethernet-configure = Misslyckades med att konfigurera ethernet.
failed-wifi-configure = Misslyckades med att konfigurera Wi-Fi.
failed-wan-configure = Misslyckades med att konfigurera WAN.
failed-lan-configure = Misslyckades med att konfigurera LAN.
failed-wlan-configure = Misslyckades med att konfigurera WLAN.

## User Settings

create-user =
    .aria-label = Lägg till ny användare
user-settings-input-name =
    .placeholder = Namn
user-settings-input-password =
    .placeholder = Lösenord
user-settings-input-new-password =
    .placeholder = Nytt lösenord (valfritt)
user-settings-input-confirm-new-password =
    .placeholder = Bekräfta nytt lösenord
user-settings-input-confirm-password =
    .placeholder = Bekräfta lösenord
user-settings-password-mismatch = Lösenorden överensstämmer inte
user-settings-save = Spara

## Adapter Settings


## Authorization Settings


## Experiment Settings

experiment-settings-logs = Loggar

## Localization Settings

localization-settings-country = Land
localization-settings-timezone = Tidszon
localization-settings-language = Språk
localization-settings-units-temperature = Temperatur
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Uppdatera nu
failed = Misslyckades
never = Aldrig
restarting = Startar om

## Developer Settings

developer-settings-enable-ssh = Aktivera SSH
developer-settings-view-internal-logs = Visa interna loggar

## Rules

rules = Regler
rules-delete-icon =
    .alt = Ta bort
rules-delete-cancel =
    .value = Avbryt
rule-invalid = Ogiltig
rule-delete-cancel-button =
    .value = Avbryt
rule-configure = Konfigurera…
notification-title = Titel
notification-message = Meddelande

## Logs

logs = Loggar
logs-device = Enhet
logs-hours = Timmar
logs-days = Dagar
logs-weeks = Veckor
logs-save = Spara
logs-remove-dialog-title = Tar bort
logs-remove = Ta bort

## Add New Things

add-thing-cancel = Avbryt

## Context Menu

context-menu-choose-icon = Välj ikon…
context-menu-save = Spara
context-menu-remove = Ta bort

## Capabilities

ColorControl = Färgkontroll
ColorSensor = Färgsensor
EnergyMonitor = Energimätare
BinarySensor = Binär sensor
SmartPlug = Trådlöst uttag
Light = Lampor
DoorSensor = Dörrsensor
MotionSensor = Rörelsesensor
PushButton = Tryckknapp
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Temperatursensor
Thermostat = Termostat
Lock = Lås

## Properties

on-off = På/Av
on = På
off = Av
power = Ström
temperature = Temperatur
frequency = Frekvens
color = Färg
brightness = Ljusstyrka
color-temperature = Färgtemperatur
open = Öppen
closed = Stängd
locked = Låst
unlocked = Upplåst
unknown = Okänd
active = Aktiv
inactive = Inaktiv

## Domain Setup

redirecting = Omdirigerar…

## Booleans

true = Sant
false = Falskt

## Time

utils-now = nu
utils-seconds-ago =
    { $value ->
        [one] { $value } sekund sen
       *[other] { $value } sekunder sen
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minut sen
       *[other] { $value } minuter sen
    }
utils-hours-ago =
    { $value ->
        [one] { $value } timme sen
       *[other] { $value } timmar sen
    }
utils-days-ago =
    { $value ->
        [one] { $value } dag sen
       *[other] { $value } dagar sen
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } vecka sen
       *[other] { $value } veckor sen
    }
utils-months-ago =
    { $value ->
        [one] { $value } månad sen
       *[other] { $value } månader sen
    }
minute = Minut
hour = Timme
day = Dag
week = Vecka

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
abbrev-kilowatt-hour = kWh
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

## New Thing View

unknown-device-type = Okänd enhetstyp
new-thing-choose-icon = Välj ikon…
new-thing-save = Spara
new-thing-pin =
    .placeholder = Ange PIN
new-thing-pin-error = Felaktig PIN
new-thing-pin-invalid = Ogiltig PIN
new-thing-cancel = Avbryt
new-thing-username =
    .placeholder = Skriv in ditt användarnamn
new-thing-password =
    .placeholder = Skriv in ditt lösenord
new-thing-saved = Sparat

## New Web Thing View

loading = Laddar…
new-web-thing-from = från

## Empty div Messages


## Add-on Settings

add-addons =
    .aria-label = Hitta nya tillägg
author-unknown = Okänd
disable = Inaktivera
enable = Aktivera
by = av
addon-configure = Konfigurera
addon-update = Uppdatera
addon-remove = Ta bort
addon-updating = Uppdaterar…
addon-updated = Uppdaterad
addon-update-failed = Misslyckades
addon-discovery-added = Tillagd
addon-discovery-add = Lägg till
addon-discovery-installing = Installerar…
addon-discovery-failed = Misslyckades

## Page Titles

settings = Inställningar
domain = Domän
users = Användare
edit-user = Redigera användare
add-user = Lägg till användare
addons = Tillägg
addon-config = Konfigurera tillägg
addon-discovery = Upptäck nya tillägg
updates = Uppdateringar
developer = Utvecklare
network = Nätverk
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikon

## Speech


## Errors

error = Fel
more-information = Mer information
failed-read-file = Misslyckades med att läsa fil.
failed-save = Misslyckades med att spara.

## Schema Form


## Icon Sources

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Logga in — { -webthings-gateway-brand }
login-log-in = Logga in

## Create First User Page

signup-title = Skapa användare — { -webthings-gateway-brand }
signup-welcome = Välkommen
signup-create-account = Skapa ditt första användarkonto:
signup-next = Nästa

## Tunnel Setup Page

tunnel-setup-welcome = Välkommen
tunnel-setup-input-subdomain =
    .placeholder = underdomän
tunnel-setup-create = Skapa
tunnel-setup-skip = Hoppa över

## Authorize Page

# Use <<domain>> to indicate where the domain should be placed
authorize-source = från <<domain>>
authorize-allow =
    .value = Tillåt
authorize-deny = Neka

## Local Token Page


## Router Setup Page

router-setup-header = Skapa ett nytt Wi-Fi-nätverk
router-setup-input-ssid =
    .placeholder = Nätverksnamn
router-setup-input-password =
    .placeholder = Lösenord
router-setup-input-confirm-password =
    .placeholder = Bekräfta lösenord
router-setup-create =
    .value = Skapa

## Wi-Fi Setup Page

wifi-setup-header = Anslut till ett Wi-Fi-nätverk?
wifi-setup-input-password =
    .placeholder = Lösenord
wifi-setup-show-password = Visa lösenord
wifi-setup-connect =
    .value = Anslut
wifi-setup-network-icon =
    .alt = Wi-Fi nätverk
wifi-setup-skip = Hoppa över

## Connecting to Wi-Fi Page

connecting-header = Ansluter till Wi-Fi…

## Creating Wi-Fi Network Page

creating-title = Skapar Wi-Fi nätverk — { -webthings-gateway-brand }
creating-header = Skapar Wi-Fi nätverk…

## General Terms

ok = Ok
ellipsis = …
edit = Redigera
remove = Ta bort
disconnected = Ej ansluten

## Top-Level Buttons

menu-button =
    .aria-label = Meny
edit-button =
    .aria-label = Redigera
save-button =
    .aria-label = Spara
