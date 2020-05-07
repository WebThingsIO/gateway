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

rules-menu-item = Reglar
logs-menu-item = Loggar
floorplan-menu-item = Planløysing
settings-menu-item = Innstillingar
log-out-button = Logg ut

## Things

thing-details =
    .aria-label = Vis eigenskapar
add-things =
    .aria-label = Legg til nye ting

## Floorplan

upload-floorplan = …Last opp planløysing
upload-floorplan-hint = (.svg tilrådd)

## Top-Level Settings

settings-domain = Domene
settings-network = Nettverk
settings-users = Brukarar
settings-add-ons = Tillegg
settings-adapters = Adapterar
settings-localization = Omsetting
settings-updates = Oppdateringar
settings-authorizations = Autoriseringar
settings-experiments = Eksperiment
settings-developer = Utviklarar

## Domain Settings

domain-settings-local-label = Lokal tilgang
domain-settings-local-update = Oppdater vertsnamn
domain-settings-remote-access = Fjerntilgang
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Nettverks-innstillingar er ikkje støtta på denne plattforma.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Heimenettverk
network-settings-internet-image =
    .alt = Internett
network-settings-configure = Konfigurer
network-settings-internet-wan = Internett (WAN)
network-settings-wan-mode = Modus
network-settings-home-network-lan = Heimenettverk (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-adresse
network-settings-dhcp = Automatisk (DHCP)
network-settings-static = Manuell (statisk IP)
network-settings-static-ip-address = Statisk IP-adresse
network-settings-network-mask = Nettverksmaske
network-settings-gateway = Gateway
network-settings-done = Ferdig
network-settings-wifi-password =
    .placeholder = Passord
network-settings-show-password = Vis passord
network-settings-connect = Kople til
network-settings-username = Brukarnamn
network-settings-password = Passord
network-settings-router-ip = Router IP-adresse
network-settings-dhcp-server = DHCP-server
network-settings-enable-wifi = Aktiver Wi-Fi
network-settings-network-name = Nettverksnamn (SSID)
wireless-connected = Tilkopla
wireless-icon =
    .alt = Wi-Fi nettverk

## User Settings

create-user =
    .aria-label = Legg til ny brukar
user-settings-input-name =
    .placeholder = Namn
user-settings-input-email =
    .placeholder = E-post
user-settings-input-password =
    .placeholder = Passord
user-settings-input-totp =
    .placeholder = 2FA-kode
user-settings-mfa-enable = Aktiver tofaktorautentisering
user-settings-mfa-verify = Stadfest
user-settings-input-new-password =
    .placeholder = Nytt passord (valfritt)
user-settings-input-confirm-new-password =
    .placeholder = Stadfest nytt passord
user-settings-input-confirm-password =
    .placeholder = Stadfest passord
user-settings-password-mismatch = Passorda samsvarar ikkje
user-settings-save = Lagre

## Adapter Settings

adapter-settings-no-adapters = Fann ingen adapterar.

## Authorization Settings

authorization-settings-no-authorizations = Ingen autoriseringar.

## Experiment Settings

experiment-settings-no-experiments = Ingen eksperiment tilgjengelege akkurat no.

## Localization Settings

localization-settings-language-region = Språk og region
localization-settings-country = Land
localization-settings-timezone = Tidssone
localization-settings-language = Språk
localization-settings-units = Einingar
localization-settings-units-temperature = Temperatur
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Oppdater no
update-available = Ny versjon tilgjengeleg
update-up-to-date = Systemet ditt er oppdatert.
updates-not-supported = Oppdateringar er ikkje støtta på denne plattforma.
update-settings-enable-self-updates = Slå på automatiske oppdateringar
last-update = Siste oppdatering
current-version = Gjeldande versjon
failed = Mislykka
never = Aldri
in-progress = I framdrift…
restarting = Startar om…
checking-for-updates = Ser etter oppdateringar…
failed-to-check-for-updates = Klarte ikkje å sjå etter oppdateringar akkurat no.

## Developer Settings

developer-settings-enable-ssh = Aktiver SSH
developer-settings-view-internal-logs = Vis interne loggar
developer-settings-create-local-authorization = Lag lokal autorisering

## Rules

add-rule =
    .aria-label = Lag ny regel
rules = reglar
rules-create-rule-hint = Ingen reglar laga. Klikk på + for å lage ein regel.
rules-rule-name = Regelnamn
rules-customize-rule-name-icon =
    .alt = Tilpass regelnamn
rules-rule-description = Regelbeskriving
rules-preview-button =
    .alt = Førehandsvising
rules-delete-icon =
    .alt = Slett
rules-scroll-left =
    .alt = Rull til venstre
rules-scroll-right =
    .alt = Rull til høgre
rules-delete-cancel =
    .value = Avbryt
rules-delete-confirm =
    .value = Fjern regel
rule-invalid = Ugyldig
rule-delete-cancel-button =
    .value = Avbryt
rule-delete-confirm-button =
    .value = Fjern regel
rule-select-property = Vel eigenskap
rule-not = Ikkje
rule-event = Hending
rule-action = Handling
rule-configure = Konfigurer…
rule-time-title = Tid på dagen
notification-title = Tittel
notification-message = Melding
notification-level = Nivå
notification-low = Låg
notification-normal = Normal
notification-high = Høg
rule-name = Regelnamn

## Logs

add-log =
    .aria-label = Lag ny logg
logs = Loggar
logs-device = Eining
logs-property = Eigenskap
logs-hours = Timar
logs-days = Dagar
logs-weeks = Veker
logs-save = Lagre
logs-remove-dialog-title = Fjernar
logs-remove = Fjern

## Add New Things

add-thing-scanning-icon =
    .alt = Skannar
add-thing-done = Ferdig
add-thing-cancel = Avbryt

## Context Menu

context-menu-choose-icon = Vel ikon…
context-menu-save = Lagre
context-menu-remove = Fjern

## Capabilities

OnOffSwitch = På/Av-knapp
MultiLevelSwitch = Fleirnivåbrytar
ColorControl = Fargekontroll
ColorSensor = Fargesensor
Light = Lys
DoorSensor = Dørsensor
MotionSensor = Rørslesensor
PushButton = Trykk-knapp
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Temperatursensor
Alarm = Alarm
Thermostat = Termostat
Lock = Lås

## Properties

alarm = Alarm
on-off = På/Av
on = På
off = Av
power = Effekt
voltage = Spenning
temperature = Temperatur
current = Straum
frequency = Frekvens
color = Farge
brightness = Lysstyrke
dry = Tørr
color-temperature = Fargetemperatur
motion = Rørsle
no-motion = Inga rørsle
open = Opne
closed = Stengd
locked = Låst
unlocked = Opplåst
unknown = Ukjend
active = Aktiv
inactive = Inaktiv

## Domain Setup

invalid-subdomain = Ugyldig underdomene
invalid-email = Ugyldig e-postadresse.
redirecting = Omdirigerer…

## Booleans

true = Sann
false = Falsk

## Time

utils-now = no
utils-seconds-ago =
    { $value ->
        [one] { $value } sekund sidan
       *[other] { $value } sekund sidan
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minutt sidan
       *[other] { $value } minutt sidan
    }
utils-hours-ago =
    { $value ->
        [one] { $value } time sidan
       *[other] { $value } timar sidan
    }
utils-days-ago =
    { $value ->
        [one] { $value } dag sidan
       *[other] { $value } dagar sidan
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } veke sidan
       *[other] { $value } veker sidan
    }
utils-months-ago =
    { $value ->
        [one] { $value } månad sidan
       *[other] { $value } månadar sidan
    }
utils-years-ago =
    { $value ->
        [one] { $value } år sidan
       *[other] { $value } fleire år sidan
    }
minute = Minutt
hour = Time
day = Dag
week = Veke

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

unknown-device-type = Ukjend einingstype
new-thing-choose-icon = Vel ikon…
new-thing-save = Lagre
new-thing-pin =
    .placeholder = Skriv inn PIN
new-thing-pin-error = Feil PIN
new-thing-pin-invalid = Ugyldig PIN
new-thing-cancel = Avbryt
new-thing-submit = Send inn
new-thing-username =
    .placeholder = Skriv inn brukarnamn
new-thing-password =
    .placeholder = Skriv inn passord
new-thing-credentials-error = Feil innloggingsopplysningar
new-thing-saved = Lagra
new-thing-done = Ferdig

## New Web Thing View

new-web-thing-from = frå

## Empty div Messages


## Add-on Settings

author-unknown = Ukend
disable = Slå av
enable = Slå på
by = av
addon-configure = Konfigurer
addon-update = Oppdater
addon-remove = Fjern
addon-updating = Oppdaterer…
addon-updated = Oppdatert
addon-update-failed = Mislykka
addon-discovery-added = Lagt til
addon-discovery-add = Legg til
addon-discovery-installing = Installerer…
addon-discovery-failed = Feila

## Page Titles

settings = Innstillingar
domain = Domene
users = Brukarar
edit-user = Rediger brukar
add-user = Legg til brukar
adapters = Adapterar
addons = Tillegg
addon-config = Konfigurer tillegg
addon-discovery = Oppdag nye tillegg
experiments = Eksperiment
localization = Omsetting
updates = Oppdateringar
developer = Utviklar
network = Nettverk
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikon

## Errors

unknown-state = Ukjend tilstand.
error = Feil
errors = Feil
gateway-unreachable = Gateway utilgjengeleg
more-information = Meir informasjon
invalid-file = Ugyldig fil.
failed-read-file = Klarte ikkje å lese fila.
failed-save = Klarte ikkje å lagre.

## Schema Form


## Icon Sources


## Login Page

login-log-in = Logg inn
login-wrong-credentials = Brukarnamn eller passord er feil.

## Create First User Page

signup-welcome = Velkomen
signup-password-mismatch = Passorda samsvarar ikkje
signup-next = Neste

## Tunnel Setup Page

tunnel-setup-skip = Hopp over

## Authorize Page

# Use <<domain>> to indicate where the domain should be placed
authorize-source = frå <<domain>>

## Local Token Page


## Router Setup Page


## Wi-Fi Setup Page


## Connecting to Wi-Fi Page


## Creating Wi-Fi Network Page


## UI Updates


## General Terms


## Top-Level Buttons

