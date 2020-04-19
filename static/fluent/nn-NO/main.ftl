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

