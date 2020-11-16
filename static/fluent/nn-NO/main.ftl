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

things-menu-item = Einingar
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
network-settings-pppoe = Bru (PPPoE)
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
network-settings-changing = Endrar nettverksinnstillingar. Dette kan ta nokre minutt.
failed-ethernet-configure = Klarte ikkje å konfigurere ethernet.
failed-wifi-configure = Klarte ikkje å konfigurere  Wi-Fi.
failed-wan-configure = Klarte ikkje å konfigurere  WAN.
failed-lan-configure = Klarte ikkje å konfigurere LAN.
failed-wlan-configure = Klarte ikkje å konfigurere WLAN.

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
user-settings-mfa-scan-code = Skann følgjande kode med valfri tofaktor-godkjenningsapp.
user-settings-mfa-secret = Dette er den nye TOTP-hemmelegheiten din, om QR-koden ovanfor ikkje fungerer:
user-settings-mfa-error = Autentiseringskoden er feil.
user-settings-mfa-enter-code = Skriv inn kode frå autentiseringsappen din, nedanfor.
user-settings-mfa-verify = Stadfest
user-settings-mfa-regenerate-codes = Regenerer reservekodar
user-settings-mfa-backup-codes = Dette er reservekodane dine. Kvar av dei kan berre brukast ein gong. Oppbevar dei på ein trygg plass.
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
rules-drag-hint = Drag einingane dine hit for å begynne å lage ein regel
rules-drag-input-hint = Legg til eining som inndata
rules-drag-output-hint = Legg til eining som utdata
rules-scroll-left =
    .alt = Rull til venstre
rules-scroll-right =
    .alt = Rull til høgre
rules-delete-prompt = Slepp einingar her for å kople frå
rules-delete-dialog = Er du sikker på at du vil fjerne denne regelen permanent?
rules-delete-cancel =
    .value = Avbryt
rules-delete-confirm =
    .value = Fjern regel
rule-invalid = Ugyldig
rule-delete-prompt = Er du sikker på at du vil fjerne denne regelen permanent?
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
rule-notification = Varsel
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
logs-create-log-hint = Ingen loggar er laga. Klikk på + for å lage ein logg.
logs-device = Eining
logs-device-select =
    .aria-label = LOgg eining
logs-property = Eigenskap
logs-property-select =
    .aria-label = Log eigenskap
logs-retention = Tilbakehalding
logs-retention-length =
    .aria-label = Tilbakehaldingslengde for logg
logs-retention-unit =
    .aria-label = Tilbakehaldingseining for logg
logs-hours = Timar
logs-days = Dagar
logs-weeks = Veker
logs-save = Lagre
logs-remove-dialog-title = Fjernar
logs-remove-dialog-warning = Når du fjernar ein logg vil òg alle dataa bli fjerna. Er du sikker på at du vil fjerne loggen?
logs-remove = Fjern
logs-unable-to-create = Klarte ikkje å lage logg
logs-server-remove-error = Server-feil: Klarte ikkje å fjerne loggen

## Add New Things

add-thing-scanning-icon =
    .alt = Skannar
add-thing-scanning = Søkjer etter nye einingar…
add-thing-add-adapters-hint = Fann ingen nye einingar. Prøv å <a data-l10n-name="add-thing-add-adapters-hint-anchor"> leggje til nokre tillegg</a>.
add-thing-add-by-url = Legg til via URL…
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
EnergyMonitor = Energimålar
BinarySensor = Binærsensor
MultiLevelSensor = Fleirnivå-sensor
SmartPlug = Trådlaust uttak
Light = Lys
DoorSensor = Dørsensor
MotionSensor = Rørslesensor
LeakSensor = Lekkasjesensor
PushButton = Trykk-knapp
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Temperatursensor
HumiditySensor = Fuktsensor
Alarm = Alarm
Thermostat = Termostat
Lock = Lås
BarometricPressureSensor = Barometrisk trykksensor
Custom = Tilpassa eining
Thing = Eining
AirQualitySensor = Luftkvalitetssensor

## Properties

alarm = Alarm
pushed = Trykt
not-pushed = Ikkje trykt
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
leak = Lekkasje
dry = Tørr
color-temperature = Fargetemperatur
video-unsupported = Video er ikkje støtt i nettlesaren din.
motion = Rørsle
no-motion = Inga rørsle
open = Opne
closed = Stengd
locked = Låst
unlocked = Opplåst
jammed = Fastna
unknown = Ukjend
active = Aktiv
inactive = Inaktiv
humidity = Luftfukt
concentration = Konsentrasjon
density = Densitet

## Domain Setup

tunnel-setup-reclaim-domain = Det ser ut til at du allereie har registrert dette underdomenet. For å ta det tilbake <a data-l10n-name="tunnel-setup-reclaim-domain-click-here"> klikk her</a>.
check-email-for-token = Sjekk e-posten din for eit  «reclamation token» og lim det inn ovanfor.
reclaim-failed = Det gjekk ikkje å ta tilbake domenet.
subdomain-already-used = Dette underdomenet er allereie i bruk. Vel eit anna.
invalid-subdomain = Ugyldig underdomene
invalid-email = Ugyldig e-postadresse.
invalid-reclamation-token = Ugyldig reclaim-token.
domain-success = Vellykka! Vent medan vi omdirigerer deg…
issuing-error = Feil ved utferding av sertifikatet. Prøv igjen.
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

new-web-thing-url =
    .placeholder = Skriv inn URL til Web Thing
new-web-thing-label = Web Thing
loading = Lastar…
new-web-thing-multiple = Fleire Web Thing funne
new-web-thing-from = frå

## Empty div Messages

no-things = Ingen einingar enno. Klikk på + for å søkje etter tilgjengelege einingar.
thing-not-found = Eining ikkje funnen.
action-not-found = Fann ikkje handling.
events-not-found = Denne eininga har ingen hendingar.

## Add-on Settings

add-addons =
    .aria-label = Finn nye tillegg
author-unknown = Ukend
disable = Slå av
enable = Slå på
by = av
license = lisens
addon-configure = Konfigurer
addon-update = Oppdater
addon-remove = Fjern
addon-updating = Oppdaterer…
addon-updated = Oppdatert
addon-update-failed = Mislykka
addon-config-applying = Legg til…
addon-config-apply = Legg til
addon-discovery-added = Lagt til
addon-discovery-add = Legg til
addon-discovery-installing = Installerer…
addon-discovery-failed = Feila
addon-search =
    .placeholder = Søk

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
authorizations = Autoriseringar
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

unsupported-field = Ustøtta feltskjema

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Pålogging — { -webthings-gateway-brand }
login-log-in = Logg inn
login-wrong-credentials = Brukarnamn eller passord er feil.
login-wrong-totp = Godkjenningskoden er feil.
login-enter-totp = Skriv inn kode frå godkjenningsappen din.

## Create First User Page

signup-title = Lag brukar — { -webthings-gateway-brand }
signup-welcome = Velkomen
signup-create-account = Lag den første brukarkontoen din:
signup-password-mismatch = Passorda samsvarar ikkje
signup-next = Neste

## Tunnel Setup Page

tunnel-setup-title = Vel nettadresse — { -webthings-gateway-brand }
tunnel-setup-welcome = Velkomen
tunnel-setup-choose-address = Vel ei sikker nettadresse for gateway-en din:
tunnel-setup-input-subdomain =
    .placeholder = underdomene
tunnel-setup-input-reclamation-token =
    .placeholder = Reclaim-token
tunnel-setup-error = Det oppstod ein feil under innstillinga av underdomenet.
tunnel-setup-create = Lag
tunnel-setup-skip = Hopp over
tunnel-setup-time-sync = Ventar på at systemkloka skal stillast inn frå Internett. Domeneregistrering kjem sannsynlegvis til å mislykkast før dette er fullført.

## Authorize Page

authorize-title = Godkjenningsførespurnad — { -webthings-gateway-brand }
authorize-authorization-request = Autorisasjonsførespurnad
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> ønskjer tilgang til gateway-en din for <<function>> einingar.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = frå <<domain>>
authorize-monitor-and-control = overvak og kontroller
authorize-monitor = overvak
authorize-allow-all = Tillat for alle einingar.
authorize-allow =
    .value = Tillat
authorize-deny = Avslå

## Local Token Page

local-token-title = Lokal token-teneste — { -webthings-gateway-brand }
local-token-header = Lokal tokenteneste
local-token-your-token = Ditt lokale token er dette: <a data-l10n-name="local-token-jwt">JSON webbtoken</a>:
local-token-use-it = Bruk det for å trygt kommunisere med gatewayen ved bruk av <a data-l10n-name="local-token-bearer-type"> Tokenbasert autentisering</a>.
local-token-copy-token = Kopier token

## Router Setup Page

router-setup-title = Router-konfigurasjon — { -webthings-gateway-brand }
router-setup-header = Lag eit nytt Wi-Fi-nettverk
router-setup-input-ssid =
    .placeholder = Nettverksnamn
router-setup-input-password =
    .placeholder = Passord
router-setup-input-confirm-password =
    .placeholder = Stadfest passord
router-setup-create =
    .value = Lag
router-setup-password-mismatch = Passorda må samsvare

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi-oppsett — { -webthings-gateway-brand }
wifi-setup-header = Kople til eit Wi-Fi-nätverk?
wifi-setup-input-password =
    .placeholder = Passord
wifi-setup-show-password = Vis passord
wifi-setup-connect =
    .value = Kople til
wifi-setup-network-icon =
    .alt = Wi-Fi-nettverk
wifi-setup-skip = Hopp over

## Connecting to Wi-Fi Page

connecting-title = Koplar til Wi-Fi — { -webthings-gateway-brand }
connecting-header = Koplar til Wi-Fi…
connecting-connect = Pass på at du er tilkopla til same nettverk og naviger så til { $gateway-link } i nettlesaren din for å fortsetje installasjonen.
connecting-warning = Merk! Om du ikkje kan laste { $domain }, slik at IP-adressa til gatewayen er rett på ruteren din.
connecting-header-skipped = Wi-Fi innstillingar hoppa over
connecting-skipped = Gatewayen startar no. Naviger til { $gateway-link } i nettlesaren din når du er kopla til same nettverk som gatewayen for å fortsetje installasjonen.

## Creating Wi-Fi Network Page

creating-title = Lagar Wi-Fi nettverk — { -webthings-gateway-brand }
creating-header = Lagar Wi-Fi nettverk…
creating-content = Kople til { $ssid } med passordet du nettopp laga, og naviger så til { $gateway-link } eller { $ip-link } i nettlesaren din.

## UI Updates

ui-update-available = Eit oppdatert brukargrensesnitt er tilgjengeleg.
ui-update-reload = Oppdater
ui-update-close = Lat att

## General Terms

ok = Ok
ellipsis = …
event-log = Hendingslogg
edit = Rediger
remove = Fjern
disconnected = Fråkopla
processing = Handsamar…
submit = Send inn

## Top-Level Buttons

menu-button =
    .aria-label = Meny
back-button =
    .aria-label = Tilbake
overflow-button =
    .aria-label = Ytterlegare handlingar
submit-button =
    .aria-label = Send inn
edit-button =
    .aria-label = Rediger
save-button =
    .aria-label = Lagre
