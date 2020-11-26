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

things-menu-item = Ting
rules-menu-item = Regler
logs-menu-item = Logfiler
floorplan-menu-item = Plantegning
settings-menu-item = Indstillinger
log-out-button = Log ud

## Things

thing-details =
    .aria-label = Vis egenskaber
add-things =
    .aria-label = Tilføj nye ting

## Floorplan

upload-floorplan = Upload plantegning…
upload-floorplan-hint = (.svg anbefales)

## Top-Level Settings

settings-domain = Domæne
settings-network = Netværk
settings-users = Brugere
settings-add-ons = Tilføjelser
settings-adapters = Adaptere
settings-localization = Oversættelse
settings-updates = Opdateringer
settings-authorizations = Tilladelser
settings-experiments = Eksperimenter
settings-developer = Udvikler

## Domain Settings

domain-settings-local-label = Lokal adgang
domain-settings-local-update = Opdater værtsnavn
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
network-settings-wan-mode = Tilstand
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
network-settings-wifi-password =
    .placeholder = Adgangskode
network-settings-show-password = Vis adgangskode
network-settings-connect = Opret forbindelse
network-settings-username = Brugernavn
network-settings-password = Adgangskode
network-settings-router-ip = Routerens IP-adresse
network-settings-dhcp-server = DHCP-server
network-settings-enable-wifi = Aktiver Wi-Fi
network-settings-network-name = Netværksnavn (SSID)
wireless-connected = Tilsluttet
wireless-icon =
    .alt = Wi-Fi netværk
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
user-settings-input-email =
    .placeholder = Mailadresse
user-settings-input-password =
    .placeholder = Adgangskode
user-settings-input-totp =
    .placeholder = 2FA-kode
user-settings-mfa-enable = Aktivér totrinsgodkendelse
user-settings-mfa-scan-code = Scan den følgende kode med en totrins-godkendelsesapp.
user-settings-mfa-secret = I tilfælde af at QR-koden ovenfor ikke virker, er dette din nye TOTP-hemmelighed:
user-settings-mfa-error = Godkendelsesskoden var forkert.
user-settings-mfa-enter-code = Indtast koden fra din godkendelses-app nedenfor.
user-settings-mfa-verify = Bekræft
user-settings-mfa-regenerate-codes = Genopret backup-koder
user-settings-mfa-backup-codes = Dette er dine backup-koder. Hver af dem kan kun benyttes én gang. Gem dem et sikkert sted.
user-settings-input-new-password =
    .placeholder = Ny adgangskode (valgfrit)
user-settings-input-confirm-new-password =
    .placeholder = Bekræft den nye adgangskode
user-settings-input-confirm-password =
    .placeholder = Bekræft adgangskode
user-settings-password-mismatch = Adgangskoderne er ikke ens
user-settings-save = Gem

## Adapter Settings

adapter-settings-no-adapters = Der blev ikke fundet nogen adaptere.

## Authorization Settings

authorization-settings-no-authorizations = Ingen tilladelser.

## Experiment Settings

experiment-settings-no-experiments = Der er ingen eksperimenter tilgængelige i øjeblikket.

## Localization Settings

localization-settings-language-region = Sprog og region
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
in-progress = Arbejder…
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
rules-customize-rule-name-icon =
    .alt = Tilpas reglens navn
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
rule-time-title = Tidspunkt
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
logs-create-log-hint = Der er ikke oprettet nogen logs. Klik på + for at oprette en ny log.
logs-device = Enhed
logs-device-select =
    .aria-label = Logget enhed
logs-property = Egenskab
logs-property-select =
    .aria-label = Egenskab for logning
logs-retention = Opbevaring
logs-retention-length =
    .aria-label = Opbevaringslængde for log
logs-retention-unit =
    .aria-label = Logopbevaringsenhed
logs-hours = Timer
logs-days = Dage
logs-weeks = Uger
logs-save = Gem
logs-remove-dialog-title = Fjerner
logs-remove-dialog-warning = Ved at fjerne loggen fjerner du også alle dens data. Er du sikker på, at du vil fjerne den?
logs-remove = Fjern
logs-unable-to-create = Kunne ikke oprette logfil
logs-server-remove-error = Serverfejl: kunne ikke fjerne logfilen

## Add New Things

add-thing-scanning-icon =
    .alt = Scanner
add-thing-scanning = Leder efter nye enheder…
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
MultiLevelSwitch = Trinafbryder
ColorControl = Farvekontrol
ColorSensor = Farvesensor
EnergyMonitor = Energi-overvågning
BinarySensor = Binær sensor
MultiLevelSensor = Flertrins-sensor
SmartPlug = Smart stikkontakt
Light = Lys
DoorSensor = Dørsensor
MotionSensor = Bevægelses-sensor
LeakSensor = Lækage-sensor
PushButton = Trykkontakt
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Temperatur-sensor
HumiditySensor = Fugtigheds-sensor
Alarm = Alarm
Thermostat = Termostat
Lock = Lås
BarometricPressureSensor = Barometisk tryksensor
Custom = Tilpasset ting
Thing = Ting
AirQualitySensor = Luftkvalitets-sensor

## Properties

alarm = Alarm
pushed = Aktiveret
not-pushed = Ikke trykket
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
jammed = Blokeret
unknown = Ukendt
active = Aktiv
inactive = Inaktiv
humidity = Fugtighed
concentration = Koncentration
density = Massefylde

## Domain Setup

tunnel-setup-reclaim-domain = Du har allerede registreret subdomænet. <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">Klik her</a> for at gendanne det.
check-email-for-token = Tjek din indbakke og indsæt den tilsendte gendannelses-token ovenfor.
reclaim-failed = Domænet kunne ikke gendannes.
subdomain-already-used = Subdomænet bruges allerede. Vælg et andet.
invalid-subdomain = Ugyldigt subdomæne.
invalid-email = Ugyldig mailadresse.
invalid-reclamation-token = Ugyldig gendannelses-token.
domain-success = Succes! Du omdirigeres, vent venligst…
issuing-error = Fejl ved udstedelse af certifikat. Prøv igen.
redirecting = Omdirigerer…

## Booleans

true = Sand
false = Falsk

## Time

utils-now = nu
utils-seconds-ago =
    { $value ->
        [one] { $value } sekund siden
       *[other] { $value } sekunder siden
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minut siden
       *[other] { $value } minutter siden
    }
utils-hours-ago =
    { $value ->
        [one] { $value } time siden
       *[other] { $value } timer siden
    }
utils-days-ago =
    { $value ->
        [one] { $value } dag siden
       *[other] { $value } dage siden
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } uge siden
       *[other] { $value } uger siden
    }
utils-months-ago =
    { $value ->
        [one] { $value } måned siden
       *[other] { $value } måneder siden
    }
utils-years-ago =
    { $value ->
        [one] { $value } år siden
       *[other] { $value } år siden
    }
minute = Minut
hour = Time
day = Dag
week = Uge

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
abbrev-hour = t
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Ukendt enhedstype
new-thing-choose-icon = Vælg ikon…
new-thing-save = Gem
new-thing-pin =
    .placeholder = Indtast PIN
new-thing-pin-error = Forkert PIN
new-thing-pin-invalid = Ugyldig PIN
new-thing-cancel = Annuller
new-thing-submit = Indsend
new-thing-username =
    .placeholder = Indtast brugernavn
new-thing-password =
    .placeholder = Indtast adgangskode
new-thing-credentials-error = Ugyldige loginoplysninger
new-thing-saved = Gemt
new-thing-done = Færdig

## New Web Thing View

new-web-thing-url =
    .placeholder = Indtast URL til web thing
new-web-thing-label = Web Thing
loading = Indlæser…
new-web-thing-multiple = Der blev fundet flere web things
new-web-thing-from = Fra

## Empty div Messages

no-things = Ingen enheder. Klik på + for at søge efter tilgængelige enheder.
thing-not-found = Enhed blev ikke fundet.
action-not-found = Handling blev ikke fundet.
events-not-found = Denne enhed har ingen handlinger.

## Add-on Settings

add-addons =
    .aria-label = Find nye tilføjelser.
author-unknown = Ukendt
disable = Deaktiver
enable = Aktiver
by = af
license = licens
addon-configure = Konfigurér
addon-update = Opdater
addon-remove = Fjern
addon-updating = Opdaterer…
addon-updated = Opdateret
addon-update-failed = Mislykkedes
addon-config-applying = Anvender…
addon-config-apply = Anvend
addon-discovery-added = Tilføjet
addon-discovery-add = Tilføj
addon-discovery-installing = Installerer…
addon-discovery-failed = Mislykkedes
addon-search =
    .placeholder = Søg

## Page Titles

settings = Indstillinger
domain = Domæne
users = Brugere
edit-user = Rediger bruger
add-user = Tilføj bruger
adapters = Adaptere
addons = Tilføjelser
addon-config = Konfigurér udvidelse
addon-discovery = Opdag nye udvidelser
experiments = Eksperimenter
localization = Oversættelse
updates = Opdateringer
authorizations = Godkendelser
developer = Udvikler
network = Netværk
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikon

## Errors

unknown-state = Ukendt tilstand.
error = Fejl
errors = Fejl
gateway-unreachable = Gateway utilgængelig
more-information = Mere information
invalid-file = Ugyldig fil.
failed-read-file = Filen kunne ikke læses.
failed-save = Kunne ikke gemme.

## Schema Form

unsupported-field = Filtypen er ikke understøttet

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Login — { -webthings-gateway-brand }
login-log-in = Log ind
login-wrong-credentials = Brugernavn eller adgangskode er forkert.
login-wrong-totp = Godkendelseskoden er forkert.
login-enter-totp = Indtast koden fra godkendelses-app.

## Create First User Page

signup-title = Opret bruger — { -webthings-gateway-brand }
signup-welcome = Velkommen
signup-create-account = Opret din første brugerkonto:
signup-password-mismatch = Adgangskoderne er ikke ens
signup-next = Næste

## Tunnel Setup Page

tunnel-setup-title = Vælg webadresse — { -webthings-gateway-brand }
tunnel-setup-welcome = Velkommen
tunnel-setup-choose-address = Vælg en sikker webadresse til din gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdomæne
tunnel-setup-email-opt-in = Hold mig opdateret med nyheder om WebThings
tunnel-setup-agree-privacy-policy = Acceptér <a data-l10n-name="tunnel-setup-privacy-policy-link">privatlivspolitik</a> og <a data-l10n-name="tunnel-setup-tos-link"> tjenestevilkår</a> for WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Gendannelsestoken
tunnel-setup-error = Der opstod en fejl under opsætning af subdomænet.
tunnel-setup-create = Opret
tunnel-setup-skip = Spring over
tunnel-setup-time-sync = Venter på, at systemuret bliver indstillet fra nettet. Registrering af domænet vil sandsynligvis mislykkedes indtil uret er sat.

## Authorize Page

authorize-title = Anmodning om godkendelse — { -webthings-gateway-brand }
authorize-authorization-request = Anmodning om godkendelse
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> ønsker adgang til din gateway for at <<function>> enheder.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = fra <<domain>>
authorize-monitor-and-control = overvåge og styre
authorize-monitor = overvåge
authorize-allow-all = Tillad for alle enheder
authorize-allow =
    .value = Tillad
authorize-deny = Afvis

## Local Token Page

local-token-title = Lokal token-service — { -webthings-gateway-brand }
local-token-header = Lokal token-service
local-token-your-token = Din lokale token er denne <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Benyt den til at kommunikere sikkert med din gateway via <a data-l10n-name="local-token-bearer-type">token-baseret godkendelse</a>.
local-token-copy-token = Kopiér token

## Router Setup Page

router-setup-title = Opsætning af router — { -webthings-gateway-brand }
router-setup-header = Opret et nyt WiFi-netværk
router-setup-input-ssid =
    .placeholder = Netværksnavn
router-setup-input-password =
    .placeholder = Adgangskode
router-setup-input-confirm-password =
    .placeholder = Bekræft adgangskode
router-setup-create =
    .value = Opret
router-setup-password-mismatch = Adgangskoderne skal være ens

## Wi-Fi Setup Page

wifi-setup-title = Opsætning af Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Vil du oprette forbindelse til et WiFi-netværk?
wifi-setup-input-password =
    .placeholder = Adgangskode
wifi-setup-show-password = Vis adgangskode
wifi-setup-connect =
    .value = Opret forbindelse
wifi-setup-network-icon =
    .alt = WiFi-netværk
wifi-setup-skip = Spring over

## Connecting to Wi-Fi Page

connecting-title = Forbinder til Wi-Fi — { -webthings-gateway-brand }
connecting-header = Opretter forbindelse til Wi-Fi…
connecting-connect = Sørg for at du er forbundet til det samme netværk og naviger til { $gateway-link } i din browser for at fortsætte opsætningen.
connecting-warning = Bemærk: Hvis du ikke er i stand til at indlæse { $domain } skal du finde gatewayens IP adresse på din router.
connecting-header-skipped = Opsætning af Wi-Fi er sprunget over
connecting-skipped = Gatewayen startes. Fortsæt opsætningen ved at gå til { $gateway-link } i din browser mens du er forbundet til det samme netværk som din gateway.

## Creating Wi-Fi Network Page

creating-title = Opretter WiFi-netværk — { -webthings-gateway-brand }
creating-header = Opretter WiFi-netværk…
creating-content = Opret forbindelse til { $ssid } med den adgangskode, du lige har oprettet. Gå derefter til { $gateway-link } eller { $ip-link } i din browser.

## UI Updates

ui-update-available = En opdateret brugergrænseflade er tilgængelig.
ui-update-reload = Genindlæs
ui-update-close = Luk

## Transfer to webthings.io

action-required-image =
    .alt = Advarsel
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-agree-tos-label = Acceptér <a data-l10n-name="transition-dialog-privacy-policy-link">privatlivspolitik</a> og <a data-l10n-name="transition-dialog-tos-link">tjenestevilkår</a> for WebThings.

## General Terms

ok = Ok
ellipsis = …
event-log = Hændelseslog
edit = Redigér
remove = Fjern
disconnected = Afbrudt
processing = Behandler…
submit = Indsend

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Tilbage
overflow-button =
    .aria-label = Yderligere handlinger
submit-button =
    .aria-label = Indsend
edit-button =
    .aria-label = Redigér
save-button =
    .aria-label = Gem
