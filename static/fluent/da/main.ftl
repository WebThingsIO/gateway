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
logs-menu-item = Logfiler
settings-menu-item = Indstillinger
log-out-button = Log ud

## Things

thing-details =
    .aria-label = Vis egenskaber

## Floorplan

upload-floorplan-hint = (.svg anbefales)

## Top-Level Settings

settings-domain = Domæne
settings-network = Netværk
settings-users = Brugere
settings-adapters = Adaptere
settings-updates = Opdateringer
settings-authorizations = Tilladelser
settings-experiments = Eksperimenter
settings-developer = Udvikler

## Domain Settings

domain-settings-local-label = Lokal adgang
domain-settings-remote-access = Fjernadgang
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Denne platform understøtter ikke netværksindstillinger.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Hjemmenetværk
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Konfigurér
network-settings-internet-wan = Internet (WAN)
network-settings-home-network-lan = Hjemmenetværk (LAN)
network-settings-wifi-wlan = Wi-FI (WLAN)
network-settings-ip-address = IP-adresse
network-settings-dhcp = Automatisk (DHCP)
network-settings-static = Manuel (statisk IP)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Statisk IP-adresse
network-settings-network-mask = Netværksmaske
network-settings-gateway = Gateway
network-settings-done = Færdig
network-settings-username = Brugernavn
network-settings-router-ip = Routerens IP-adresse
network-settings-enable-wifi = Aktiver Wi-Fi
network-settings-network-name = Netværksnavn (SSID)
network-settings-changing = Ændrer netværksinstillinger. Dette kan tage et øjeblik.
failed-ethernet-configure = Konfigurering af ethernet mislykkedes.
failed-wifi-configure = Konfigurering af Wi-Fi mislykkedes.
failed-wan-configure = Konfigurering af WAN mislykkedes.
failed-lan-configure = Konfigurering af LAN mislykkedes.
failed-wlan-configure = Konfigurering af WLAN mislykkedes.

## User Settings

create-user =
    .aria-label = Tilføj en ny bruger
user-settings-input-name =
    .placeholder = Navn
user-settings-input-totp =
    .placeholder = 2FA-kode
user-settings-mfa-enable = Aktivér totrinsgodkendelse
user-settings-mfa-scan-code = Scan den følgende kode med en totrins-godkendelsesapp.
user-settings-mfa-secret = I tilfælde af at QR-koden ovenfor ikke virker, er dette din nye TOTP-hemmelighed:
user-settings-mfa-enter-code = Indtast koden fra din godkendelses-app nedenfor.
user-settings-mfa-verify = Bekræft
user-settings-mfa-backup-codes = Dette er dine backup-koder. Hver af dem kan kun benyttes én gang. Gem dem et sikkert sted.
user-settings-save = Gem

## Adapter Settings

adapter-settings-no-adapters = Der blev ikke fundet nogen adaptere.

## Authorization Settings

authorization-settings-no-authorizations = Ingen tilladelser.

## Experiment Settings

experiment-settings-no-experiments = Der er ingen eksperimenter tilgængelige i øjeblikket.

## Localization Settings

localization-settings-country = Land
localization-settings-timezone = Tidszone
localization-settings-language = Sprog
localization-settings-units = Enheder
localization-settings-units-temperature = Temperatur
localization-settings-units-temperature-celsius = Celcius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Opdater nu
update-available = Ny version tilgængelig.
update-up-to-date = Dit system har den seneste version.
updates-not-supported = Opdateringer er ikke understøttet på denne platform.
update-settings-enable-self-updates = Aktiver automatiske opdateringer
last-update = Seneste opdatering
current-version = Nuværende version
failed = Mislykkedes
never = Aldrig
restarting = Genstarter…
checking-for-updates = Søger efter opdateringer…
failed-to-check-for-updates = Ikke i stand til at søge efter opdateringer i øjeblikket.

## Developer Settings

developer-settings-enable-ssh = Aktiver SSH
developer-settings-view-internal-logs = Se interne logfiler
developer-settings-create-local-authorization = Opret lokal tilladelse

## Rules

add-rule =
    .aria-label = Opret ny regel
rules = Regler
rules-create-rule-hint = Der er ikke oprettet nogen regler. Tryk på + for at oprette en regel.
rules-rule-name = Navn på regel
rules-rule-description = Beskrivelse af regel
rules-preview-button =
    .alt = Forhåndsvisning
rules-delete-icon =
    .alt = Slet
rules-drag-hint = Træk dine enheder hertil for at oprette en regel
rules-drag-input-hint = Tilføj enhed som input
rules-drag-output-hint = Tilføj enhed som output
rules-scroll-left =
    .alt = Scroll til venstre
rules-scroll-right =
    .alt = Scroll til højre
rules-delete-prompt = Slip enheder her for at afbryde forbindelsen
rules-delete-dialog = Er du sikker på, at du vil slette reglen permanent?
rules-delete-cancel =
    .value = Annuller
rules-delete-confirm =
    .value = Fjern regel
rule-invalid = Ugyldig
rule-delete-prompt = Er du sikker på, at du vil fjerne reglen permanent?
rule-delete-cancel-button =
    .value = Annuller
rule-delete-confirm-button =
    .value = Fjern regel
rule-select-property = Vælg egenskab
rule-not = Ikke
rule-event = Begivenhed
rule-action = Handling
rule-configure = Konfigurér…
rule-notification = Notifikation
notification-title = Titel
notification-message = Besked
notification-level = Niveau
notification-low = Lav
notification-normal = Normal
notification-high = Høj
rule-name = Regelnavn

## Logs

add-log =
    .aria-label = Opret en ny log
logs = Logfiler
logs-create-log-hint = Der er ikke oprette nogen logs. Klik på + for at oprette en ny log.
logs-device = Enhed
logs-property = Egenskab
logs-property-select =
    .aria-label = Egenskab for logning
logs-retention = Opbevaring
logs-retention-unit =
    .aria-label = Logopbevaringsenhed
logs-hours = Timer
logs-days = Dage
logs-weeks = Uger
logs-save = Gem
logs-remove-dialog-title = Fjerner
logs-remove-dialog-warning = Ved at fjerne loggen fjerner du også alle dens data. Er du sikker på, at du vil fjerne den?
logs-remove = Fjern
logs-server-remove-error = Serverfejl: kunne ikke fjerne logfilen

## Add New Things

add-thing-scanning-icon =
    .alt = Scanner
add-thing-add-adapters-hint = Der blev ikke fundet nogen nye enheder. Prøv at <a data-l10n-name="add-thing-add-adapters-hint-anchor">tilføje nogle tilføjelser</a>.
add-thing-add-by-url = Tilføj via URL…
add-thing-done = Færdig
add-thing-cancel = Annuller

## Context Menu

context-menu-choose-icon = Vælg ikon…
context-menu-save = Gem
context-menu-remove = Fjern

## Capabilities

OnOffSwitch = Tænd/Sluk-kontakt
ColorControl = Farvekontrol
ColorSensor = Farvesensor
BinarySensor = Binær sensor
SmartPlug = Smart stikkontakt
Light = Lys
DoorSensor = Dørsensor
PushButton = Trykkontakt
VideoCamera = Videokamera
Camera = Kamera
Alarm = Alarm
Thermostat = Termostat
Lock = Lås

## Properties

alarm = Alarm
on-off = Tændt/Slukket
on = Tændt
off = Slukket
power = Effekt
voltage = Spænding
temperature = Temperatur
current = Strømstyrke
frequency = Frekvens
color = Farve
brightness = Lysstyrke
leak = Lækage
dry = Tør
color-temperature = Farvetemperatur
video-unsupported = Video er ikke understøttet i din browser.
motion = Bevægelse
no-motion = Ingen bevægelse
open = Åben
closed = Lukket
locked = Låst
unlocked = Ulåst
unknown = Ukendt
active = Aktiv
inactive = Inaktiv

## Domain Setup


## Booleans


## Time


## Unit Abbreviations


## New Thing View


## New Web Thing View


## Empty div Messages


## Add-on Settings


## Page Titles


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


## UI Updates


## General Terms


## Top-Level Buttons

