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

things-menu-item = Things
rules-menu-item = Regels
logs-menu-item = Logboeken
floorplan-menu-item = Plattegrond
settings-menu-item = Instellingen
log-out-button = Afmelden

## Things

thing-details =
    .aria-label = Eigenschappen tonen
add-things =
    .aria-label = Nieuwe Things toevoegen

## Floorplan

upload-floorplan = Plattegrond uploaden…
upload-floorplan-hint = (.svg aanbevolen)

## Top-Level Settings

settings-domain = Domein
settings-network = Netwerk
settings-users = Gebruikers
settings-add-ons = Add-ons
settings-adapters = Adapters
settings-localization = Lokalisatie
settings-updates = Updates
settings-authorizations = Autorisaties
settings-experiments = Experimenten
settings-developer = Ontwikkelaar

## Domain Settings

domain-settings-local-label = Lokale toegang
domain-settings-local-update = Hostname bijwerken
domain-settings-remote-access = Externe toegang
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Netwerkinstellingen worden op dit platform niet ondersteund.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wifi
network-settings-wifi = Wifi
network-settings-home-network-image =
    .alt = Thuisnetwerk
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configureren
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modus
network-settings-home-network-lan = Thuisnetwerk (LAN)
network-settings-wifi-wlan = Wifi (WLAN)
network-settings-ip-address = IP-adres
network-settings-dhcp = Automatisch (DHCP)
network-settings-static = Handmatig (Statisch IP-adres)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Statisch IP-adres
network-settings-network-mask = Netwerkmask
network-settings-gateway = Gateway
network-settings-done = Gereed
network-settings-wifi-password =
    .placeholder = Wachtwoord
network-settings-show-password = Wachtwoord tonen
network-settings-connect = Verbinden
network-settings-username = Gebruikersnaam
network-settings-password = Wachtwoord
network-settings-router-ip = IP-adres router
network-settings-dhcp-server = DHCP-server
network-settings-enable-wifi = Wifi inschakelen
network-settings-network-name = Netwerknaam (SSID)
wireless-connected = Verbonden
wireless-icon =
    .alt = Wifi-netwerk
network-settings-changing = Netwerkinstellingen wijzigen. Dit kan even duren.
failed-ethernet-configure = Ethernet instellen mislukt.
failed-wifi-configure = Wifi instellen mislukt.
failed-wan-configure = WAN instellen mislukt.
failed-lan-configure = LAN instellen mislukt.
failed-wlan-configure = WLAN instellen mislukt.

## User Settings

create-user =
    .aria-label = Nieuwe gebruiker toevoegen
user-settings-input-name =
    .placeholder = Naam
user-settings-input-email =
    .placeholder = E-mailadres
user-settings-input-password =
    .placeholder = Wachtwoord
user-settings-input-totp =
    .placeholder = 2FA-code
user-settings-mfa-enable = Tweefactorauthenticatie inschakelen
user-settings-mfa-scan-code = Scan de volgende code met een tweefactorauthenticatie-app.
user-settings-mfa-secret = Dit is uw nieuwe TOTP-geheim, voor het geval de bovenstaande QR-code niet werkt:
user-settings-mfa-error = Authenticatiecode onjuist.
user-settings-mfa-enter-code = Voer hieronder de code van uw authenticator-app in.
user-settings-mfa-verify = Verifiëren
user-settings-mfa-regenerate-codes = Back-upcodes opnieuw aanmaken
user-settings-mfa-backup-codes = Dit zijn uw back-upcodes. Elke code kan slechts eenmaal worden gebruikt. Bewaar ze op een veilige plaats.
user-settings-input-new-password =
    .placeholder = Nieuw wachtwoord (Optioneel)
user-settings-input-confirm-new-password =
    .placeholder = Bevestig nieuw wachtwoord
user-settings-input-confirm-password =
    .placeholder = Bevestig wachtwoord
user-settings-password-mismatch = Wachtwoorden komen niet overeen
user-settings-save = Opslaan

## Adapter Settings

adapter-settings-no-adapters = Geen adapters gevonden.

## Authorization Settings

authorization-settings-no-authorizations = Geen autorisatie.

## Experiment Settings

experiment-settings-no-experiments = Er zijn momenteel geen experimenten beschikbaar.

## Localization Settings

localization-settings-language-region = Taal & Regio
localization-settings-country = Land
localization-settings-timezone = Tijdzone
localization-settings-language = Taal
localization-settings-units = Eenheden
localization-settings-units-temperature = Temperatuur
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Nu bijwerken
update-available = Nieuwe versie beschikbaar
update-up-to-date = Geen updates beschikbaar
updates-not-supported = Updates worden op dit platform niet ondersteund.
update-settings-enable-self-updates = Automatische updates inschakelen
last-update = Laatste update
current-version = Huidige versie
failed = Mislukt
never = Nooit
in-progress = Loopt
restarting = Herstarten
checking-for-updates = Controleren op updates…
failed-to-check-for-updates = Kan momenteel niet controleren op updates.

## Developer Settings

developer-settings-enable-ssh = SSH inschakelen
developer-settings-view-internal-logs = Interne logboeken tonen
developer-settings-create-local-authorization = Lokale autorisatie maken

## Rules

add-rule =
    .aria-label = Nieuwe regel maken
rules = Regels
rules-create-rule-hint = Geen regels. Klik op + om een regel te maken.
rules-rule-name = Regelnaam
rules-customize-rule-name-icon =
    .alt = Regelnaam aanpassen
rules-rule-description = Regelbeschrijving
rules-preview-button =
    .alt = Voorbeeld
rules-delete-icon =
    .alt = Verwijderen
rules-drag-hint = Sleep een apparaat hierheen om een regel te maken
rules-drag-input-hint = Apparaat toevoegen als input
rules-drag-output-hint = Apparaat toevoegen als output
rules-scroll-left =
    .alt = Naar links scrollen
rules-scroll-right =
    .alt = Naar rechts scrollen
rules-delete-prompt = Sleep apparaten hierheen om te ontkoppelen
rules-delete-dialog = Weet u zeker dat u deze regel permanent wilt verwijderen?
rules-delete-cancel =
    .value = Annuleren
rules-delete-confirm =
    .value = Regel verwijderen
rule-invalid = Ongeldig
rule-delete-prompt = Weet u zeker dat u deze regel permanent wilt verwijderen?
rule-delete-cancel-button =
    .value = Annuleren
rule-delete-confirm-button =
    .value = Regel verwijderen
rule-select-property = Eigenschap selecteren
rule-not = Niet
rule-event = Gebeurtenis
rule-action = Actie
rule-configure = Instellen…
rule-time-title = Tijd
rule-notification = Melding
notification-title = Titel
notification-message = Bericht
notification-level = Niveau
notification-low = Laag
notification-normal = Normaal
notification-high = Hoog
rule-name = Regelnaam

## Logs

add-log =
    .aria-label = Nieuw logboek maken
logs = Logboeken
logs-create-log-hint = Geen logboeken. Klik op + om een logboek aan te maken.
logs-device = Apparaat
logs-device-select =
    .aria-label = Apparaatlogboek
logs-property = Eigenschap
logs-property-select =
    .aria-label = Eigenschaplogboek
logs-retention = Bewaartermijn
logs-retention-length =
    .aria-label = Bewaartermijn logboek
logs-retention-unit =
    .aria-label = Eenheid bewaartermijn logboek
logs-hours = Uren
logs-days = Dagen
logs-weeks = Weken
logs-save = Opslaan
logs-remove-dialog-title = Verwijderen
logs-remove-dialog-warning = Als het logboek wordt verwijderd, worden ook de bijbehorende gegevens gewist. Weet u zeker dat u het wilt verwijderen?
logs-remove = Verwijderen
logs-unable-to-create = Kan logboek niet aanmaken
logs-server-remove-error = Serverfout: kan logboek niet verwijderen

## Add New Things

add-thing-scanning-icon =
    .alt = Zoeken
add-thing-scanning = Nieuwe apparaten zoeken…
add-thing-add-adapters-hint = Geen nieuwe apparaten gevonden. Probeer <a data-l10n-name="add-thing-add-adapters-hint-anchor">wat add-ons toe te voegen</a>.
add-thing-add-by-url = Toevoegen met URL…
add-thing-done = Gereed
add-thing-cancel = Annuleren

## Context Menu

context-menu-choose-icon = Pictogram kiezen…
context-menu-save = Opslaan
context-menu-remove = Verwijderen

## Capabilities

OnOffSwitch = Aan/Uit-schakelaar
MultiLevelSwitch = Schakelaar met niveaus
ColorControl = Kleurinstelling
ColorSensor = Kleursensor
EnergyMonitor = Energiemonitor
BinarySensor = Binaire sensor
MultiLevelSensor = Sensor met niveaus
SmartPlug = Slimme stekker
Light = Licht
DoorSensor = Deursensor
MotionSensor = Bewegingsmelder
LeakSensor = Lekkagesensor
PushButton = Drukknop
VideoCamera = Videocamera
Camera = Camera
TemperatureSensor = Temperatuursensor
HumiditySensor = Vochtsensor
Alarm = Alarm
Thermostat = Thermostaat
Lock = Slot
BarometricPressureSensor = Barometrische druksensor
Custom = Aangepast Thing
Thing = Thing
AirQualitySensor = Luchtkwaliteitssensor
SmokeSensor = Rookmelder

## Properties

alarm = Alarm
pushed = Ingedrukt
not-pushed = Niet ingedrukt
on-off = Aan/Uit
on = Aan
off = Uit
power = Vermogen
voltage = Spanning
temperature = Temperatuur
current = Stroom
frequency = Frequentie
color = Kleur
brightness = Helderheid
leak = Lek
dry = Droog
color-temperature = Kleurtemperatuur
video-unsupported = Sorry, video wordt niet ondersteund in uw browser.
motion = Beweging
no-motion = Geen beweging
open = Open
closed = Gesloten
locked = Vergrendeld
unlocked = Ontgrendeld
jammed = Geklemd
unknown = Onbekend
active = Actief
inactive = Inactief
humidity = Vochtigheid
concentration = Concentratie
density = Dichtheid
smoke = Rook

## Domain Setup

tunnel-setup-reclaim-domain = Het lijkt erop dat u dat subdomein al hebt geregistreerd. <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">Klik hier</a> om het op te eisen.
check-email-for-token = Controleer uw e-mail op een reclamatietoken en plak dit hierboven.
reclaim-failed = Kan domein niet opeisen.
subdomain-already-used = Dit subdomein is al in gebruik. Kies een ander.
invalid-subdomain = Ongeldig subdomein.
invalid-email = Ongeldig e-mailadres.
invalid-reclamation-token = Ongeldig reclamatietoken.
domain-success = Gelukt! We verwijzen u door…
issuing-error = Fout bij het uitgeven van het certificaat. Probeer het opnieuw.
redirecting = Doorsturen…

## Booleans

true = Juist
false = Onjuist

## Time

utils-now = nu
utils-seconds-ago =
    { $value ->
        [one] { $value } seconde geleden
       *[other] { $value } seconden geleden
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minuut geleden
       *[other] { $value } minuten geleden
    }
utils-hours-ago =
    { $value ->
        [one] { $value } uur geleden
       *[other] { $value } uur geleden
    }
utils-days-ago =
    { $value ->
        [one] { $value } dag geleden
       *[other] { $value } dagen geleden
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } week geleden
       *[other] { $value } weken geleden
    }
utils-months-ago =
    { $value ->
        [one] { $value } maand geleden
       *[other] { $value } maanden geleden
    }
utils-years-ago =
    { $value ->
        [one] { $value } jaar geleden
       *[other] { $value } jaar geleden
    }
minute = Minuut
hour = Uur
day = Dag
week = Week

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
abbrev-hour = u
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Onbekend apparaattype
new-thing-choose-icon = Pictogram kiezen…
new-thing-save = Opslaan
new-thing-pin =
    .placeholder = Voer pincode in
new-thing-pin-error = Onjuiste pincode
new-thing-pin-invalid = Ongeldige pincode
new-thing-cancel = Annuleren
new-thing-submit = Indienen
new-thing-username =
    .placeholder = Voer gebruikersnaam in
new-thing-password =
    .placeholder = Voer wachtwoord in
new-thing-credentials-error = Ongeldige aanmeldgegevens
new-thing-saved = Opgeslagen
new-thing-done = Klaar

## New Web Thing View

new-web-thing-url =
    .placeholder = Voer URL Web Thing in
new-web-thing-label = Web Thing
loading = Laden…
new-web-thing-multiple = Meerdere Web Things gevonden
new-web-thing-from = van

## Empty div Messages

no-things = Geen apparaten. Klik + om apparaten te zoeken.
thing-not-found = Thing niet gevonden.
action-not-found = Actie niet gevonden.
events-not-found = Dit Thing heeft geen gebeurtenissen.

## Add-on Settings

add-addons =
    .aria-label = Nieuwe add-ons zoeken
author-unknown = Onbekend
disable = Uitschakelen
enable = Inschakelen
by = door
license = licentie
addon-configure = Instellen
addon-update = Bijwerken
addon-remove = Verwijderen
addon-updating = Bijwerken…
addon-updated = Bijgewerkt
addon-update-failed = Mislukt
addon-config-applying = Toepassen…
addon-config-apply = Toepassen
addon-discovery-added = Toegevoegd
addon-discovery-add = Toevoegen
addon-discovery-installing = Installeren…
addon-discovery-failed = Mislukt
addon-search =
    .placeholder = Zoeken

## Page Titles

settings = Instellingen
domain = Domein
users = Gebruikers
edit-user = Gebruiker bewerken
add-user = Gebruiker toevoegen
adapters = Adapters
addons = Add-ons
addon-config = Add-on instellen
addon-discovery = Nieuwe add-ons ontdekken
experiments = Experimenten
localization = Lokalisatie
updates = Updates
authorizations = Autorisaties
developer = Ontwikkelaar
network = Netwerk
ethernet = Ethernet
wifi = Wifi
icon = Pictogram

## Errors

unknown-state = Onbekende staat.
error = Fout
errors = Fouten
gateway-unreachable = Gateway niet bereikbaar
more-information = Meer informatie
invalid-file = Ongeldig bestand.
failed-read-file = Bestand lezen mislukt.
failed-save = Bestand opslaan mislukt.

## Schema Form

unsupported-field = Veldschema niet ondersteund

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Aanmelden – { -webthings-gateway-brand }
login-log-in = Aanmelden
login-wrong-credentials = Gebruikersnaam of wachtwoord onjuist.
login-wrong-totp = Authenticatiecode onjuist.
login-enter-totp = Voer de code van uw authenticator-app in.

## Create First User Page

signup-title = Gebruiker aanmaken – { -webthings-gateway-brand }
signup-welcome = Welkom
signup-create-account = Maak uw eerste gebruikersaccount aan:
signup-password-mismatch = Wachtwoorden komen niet overeen
signup-next = Volgende

## Tunnel Setup Page

tunnel-setup-title = Webadres kiezen – { -webthings-gateway-brand }
tunnel-setup-welcome = Welkom
tunnel-setup-choose-address = Kies een veilig webadres voor uw gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdomein
tunnel-setup-email-opt-in = Houd mij op de hoogte met nieuws over WebThings.
tunnel-setup-agree-privacy-policy = Instemmen met het <a data-l10n-name="tunnel-setup-privacy-policy-link">Privacybeleid</a> en de <a data-l10n-name="tunnel-setup-tos-link">Servicevoorwaarden</a> van WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Reclamatietoken
tunnel-setup-error = Er is een fout opgetreden bij het instellen van het subdomein.
tunnel-setup-create = Aanmaken
tunnel-setup-skip = Overslaan
tunnel-setup-time-sync = Wachten op het instellen van de systeemklok via internet. Domeinregistratie zal anders waarschijnlijk mislukken.

## Authorize Page

authorize-title = Autorisatieaanvraag – { -webthings-gateway-brand }
authorize-authorization-request = Autorisatieaanvraag
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> wil toegang krijgen tot uw gateway voor <<function>>-apparaten.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = van <<domein>>
authorize-monitor-and-control = bekijken en instellen
authorize-monitor = bekijken
authorize-allow-all = Toestaan voor alle Things
authorize-allow =
    .value = Toestaan
authorize-deny = Weigeren

## Local Token Page

local-token-title = Lokale tokendienst – { -webthings-gateway-brand }
local-token-header = Lokale tokendienst
local-token-your-token = Uw lokale token is dit <a data-l10n-name="local-token-jwt">JSON Web-token</a>:
local-token-use-it = Gebruik dit om beveiligd met de gateway te praten, met <a data-l10n-name="local-token-bearer-type">Bearer-type-autorisatie</a>.
local-token-copy-token = Token kopiëren

## Router Setup Page

router-setup-title = Routerinstellingen – { -webthings-gateway-brand }
router-setup-header = Nieuw wifi-netwerk instellen
router-setup-input-ssid =
    .placeholder = Netwerknaam
router-setup-input-password =
    .placeholder = Wachtwoord
router-setup-input-confirm-password =
    .placeholder = Bevestig wachtwoord
router-setup-create =
    .value = Aanmaken
router-setup-password-mismatch = Wachtwoorden moeten overeenkomen

## Wi-Fi Setup Page

wifi-setup-title = Wifi-instellingen – { -webthings-gateway-brand }
wifi-setup-header = Verbinden met wifi-netwerk?
wifi-setup-input-password =
    .placeholder = Wachtwoord
wifi-setup-show-password = Wachtwoord tonen
wifi-setup-connect =
    .value = Verbinden
wifi-setup-network-icon =
    .alt = Wifi-netwerk
wifi-setup-skip = Overslaan

## Connecting to Wi-Fi Page

connecting-title = Verbinden met wifi – { -webthings-gateway-brand }
connecting-header = Verbinden met wifi…
connecting-connect = Controleer of u verbonden bent met hetzelfde netwerk en navigeer dan in uw webbrowser naar { $gateway-link } om verder te gaan met instellen.
connecting-warning = Opmerking: Als u { $domain } niet kunt laden, zoek dan het IP-adres van de gateway in uw router.
connecting-header-skipped = Instellen wifi overgeslagen
connecting-skipped = De gateway wordt opgestart. Navigeer in uw webbrowser naar { $gateway-link }, terwijl u verbonden bent met hetzelfde netwerk als de gateway, om verder te gaan met instellen.

## Creating Wi-Fi Network Page

creating-title = Wifi-netwerk maken – { -webthings-gateway-brand }
creating-header = Wifi-netwerk maken…
creating-content = Verbind met { $ssid } met het zojuist ingestelde wachtwoord, navigeer daarna in uw webbrowser naar { $gateway-link } of { $ip-link }.

## UI Updates

ui-update-available = Er is een bijgewerkte gebruikersinterface beschikbaar.
ui-update-reload = Vernieuwen
ui-update-close = Sluiten

## Transfer to webthings.io

action-required-image =
    .alt = Waarschuwing
action-required = Actie vereist:
action-required-message = De Mozilla IoT-service voor externe toegang en automatische software-updates worden stopgezet. Kies of u wilt overstappen naar het door de gemeenschap beheerde webthings.io voor verdere service.
action-required-more-info = Meer info
action-required-dont-ask-again = Dit niet meer vragen
action-required-choose = Kiezen
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = De Mozilla-service voor externe toegang en automatische updates wordt op 31 december 2020 beëindigd (<a data-l10n-name="transition-dialog-more-info">lees hier meer</a>). Mozilla stapt over naar het nieuwe <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a>, dat door de gemeenschap wordt uitgevoerd (er is geen connectie met Mozilla).<br><br>Als u geen software-updates van door de gemeenschap uitgevoerde updateservers meer wilt ontvangen, kunt u automatische updates in uw Instellingen uitschakelen.<br><br>Als u uw mozilla-iot.org-subdomein wilt overzetten naar webthings.io, of een nieuw subdomein wilt registreren, dan kunt u onderstaand formulier invullen om te registreren bij de vervangende service voor externe toegang die door de gemeenschap wordt uitgevoerd.
transition-dialog-register-domain-label = Registreren voor de service voor externe toegang op webthings.io
transition-dialog-subdomain =
    .placeholder = Subdomein
transition-dialog-newsletter-label = Houd mij op de hoogte met nieuws over WebThings.
transition-dialog-agree-tos-label = Instemmen met het <a data-l10n-name="transition-dialog-privacy-policy-link">Privacybeleid</a> en de <a data-l10n-name="transition-dialog-tos-link">Servicevoorwaarden</a> van WebThings.
transition-dialog-email =
    .placeholder = E-mailadres
transition-dialog-register =
    .value = Registreren
transition-dialog-register-status =
    .alt = Registratiestatus
transition-dialog-register-label = Subdomein registreren
transition-dialog-subscribe-status =
    .alt = Status nieuwsbriefabonnement
transition-dialog-subscribe-label = Abonneren op nieuwsbrief
transition-dialog-error-generic = Er is een fout opgetreden. Ga terug en probeer het opnieuw.
transition-dialog-error-subdomain-taken = Het gekozen subdomein is al in gebruik. Ga terug en kies een ander.
transition-dialog-error-subdomain-failed = Kan subdomein niet registreren. Ga terug en probeer het opnieuw.
transition-dialog-error-subscribe-failed = Abonneren op nieuwsbrief mislukt. Probeer het nogmaals op <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Navigeer naar <<domain>> om verder te gaan.

## General Terms

ok = OK
ellipsis = …
event-log = Gebeurtenissenlogboek
edit = Bewerken
remove = Verwijderen
disconnected = Niet verbonden
processing = Verwerken…
submit = Indienen

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Terug
overflow-button =
    .aria-label = Aanvullende acties
submit-button =
    .aria-label = Indienen
edit-button =
    .aria-label = Bewerken
save-button =
    .aria-label = Opslaan
