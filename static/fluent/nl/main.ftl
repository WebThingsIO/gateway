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

assistant-menu-item = Assistent
things-menu-item = Things
rules-menu-item = Regels
logs-menu-item = Logboeken
floorplan-menu-item = Plattegrond
settings-menu-item = Instellingen
log-out-button = Afmelden

## Assistant

assistant-avatar-image =
  .alt = Assistent Avatar
assistant-controls-text-input =
  .placeholder = Hoe kan ik helpen?

## Floorplan

upload-floorplan = Upload plattegrond…
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

network-settings-unsupported = Netwerkinstelligen worden op dit platform niet ondersteund.
network-settings-ethernet-image =
  .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
  .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
  .alt = Thuisnetwerk
network-settings-internet-image =
  .alt = Internet
network-settings-configure = Configureren
network-settings-internet-wan = Internet (WAN)
network-settings-home-network-lan = Thuisnetwerk (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
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
network-settings-enable-wifi = Wi-Fi inschakelen
network-settings-network-name = Netwerknaam (SSID)
wireless-connected = Verbonden
wireless-icon =
  .alt = Wi-Fi-netwerk
network-settings-changing = Netwerkinstellingen wijzigen. Dit kan even duren.
failed-ethernet-configure = Ethernet instellen mislukt.
failed-wifi-configure = Wi-Fi instellen mislukt.
failed-wan-configure = WAN instellen mislukt.
failed-lan-configure = LAN instellen mislukt.
failed-wlan-configure = WLAN instellen mislukt.

## User Settings

user-settings-input-name =
  .placeholder = Naam
user-settings-input-email =
  .placeholder = E-mailadres
user-settings-input-password =
  .placeholder = Wachtwoord
user-settings-input-new-password =
  .placeholder = Nieuw wachtwoord (Optioneel)
user-settings-input-confirm-new-password =
  .placeholder = Bevestig nieuw wachtwoord
user-settings-input-confirm-password =
  .placeholder = Bevestig wachtwoord
user-settings-password-mismatch = Wachtwoorden zijn niet gelijk
user-settings-save = Opslaan

## Adapter Settings

adapter-settings-no-adapters = Geen adapters gevonden.

## Authorization Settings

authorization-settings-no-authorizations = Geen autorisatie.

## Experiment Settings

experiment-settings-smart-assistant = Smart Assistant
experiment-settings-logs = Logboeken

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
last-update = Laatste update
current-version = Huidige versie
failed = Mislukt
never = Nooit
in-progress = Loopt
restarting = Herstarten

## Developer Settings

developer-settings-enable-ssh = SSH inschakelen
developer-settings-view-internal-logs = Interne logboeken tonen
developer-settings-create-local-authorization = Maak lokale autorisatie

## Rules

rules = Regels
rules-create-rule-hint = Geen regels. Klik op + om een regel te maken.
rules-rule-name = Regelnaam
rules-customize-rule-name-icon =
  .alt = Regelnaam aanpassen
rules-rule-description = Regelbeschrijving
rules-preview-button =
  .alt = Voorbeeld
rules-delete-icon =
  .alt = Verwijder
rules-drag-hint = Sleep hier een apparaat heen om een regel te maken
rules-drag-input-hint = Apparaat toevoegen als input
rules-drag-output-hint = Apparaat toevoegen als output
rules-scroll-left =
  .alt = Naar links scrollen
rules-scroll-right =
  .alt = Naar rechts scrollen
rules-delete-prompt = Sleep apparaten hierheen om te ontkoppelen
rules-delete-dialog = Weet u deze zeker dat u deze regel wilt verwijderen?
rules-delete-cancel =
  .value = Annuleren
rules-delete-confirm =
  .value = Verwijder regel
rule-invalid = Ongeldig
rule-delete-prompt = Weet u zeker dat u deze regel wilt verwijderen?
rule-delete-cancel-button =
  .value = Annuleren
rule-delete-confirm-button =
  .value = Verwijder regel
rule-select-property = Selecteer eigenschap
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
notification-normal = Gemiddeld
notification-high = Hoog
rule-name = Regelnaam

## Logs

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
  .aria-label = Log Bewaartermijn Eenheid
logs-hours = Uren
logs-days = Dagen
logs-weeks = Weken
logs-save = Opslaan
logs-remove-dialog-title = Verwijderen
logs-remove-dialog-warning = Als het logboek wordt verwijderd, worden ook de bijbehorende gegevens gewist.
  Wilt u deze echt verwijderen?
logs-remove = Verwijderen
logs-unable-to-create = Kan logboek niet aanmaken
logs-server-remove-error = Serverfout: kan logboek niet verwijderen

## Add New Things

add-thing-scanning-icon =
  .alt = Zoeken
add-thing-scanning = Nieuwe apparaten zoeken…
add-thing-add-adapters-hint = Geen apparaten gevonden. Probeer <a data-l10n-name="add-thing-add-adapters-hint-anchor">add-ons toe te voegen</a>.
add-thing-add-by-url = Toevoegen met URL…
add-thing-done = Gereed
add-thing-cancel = Annuleren

## Context Menu

context-menu-choose-icon = Kies icoon…
context-menu-save = Opslaan
context-menu-remove = Verwijderen

## Capabilities

OnOffSwitch = Aan-/Uit-schakelaar
MultiLevelSwitch = Schakelaar met niveaus
ColorControl = Kleurinstelling
ColorSensor = Kleur sensor
EnergyMonitor = Energiemonitor
BinarySensor = Binaire sensor
MultiLevelSensor = Sensor met niveaus
SmartPlug = Smart Plug
Light = Licht
DoorSensor = Deursensor
MotionSensor = Bewegingsmelder
LeakSensor = Lekkagesensor
PushButton = Drukknop
VideoCamera = Videocamera
Camera = Camera
TemperatureSensor = Temperatuursensor
Alarm = Alarm
Thermostat = Thermostaat
Lock = Vergrendeld
Custom = Aangepast Thing

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

## Domain Setup

tunnel-setup-reclaim-domain = Het lijkt erop dat u dat subdomein al hebt geregistreerd. Om het te op te eisen <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">klik hier</a>.
check-email-for-token = In uw e-mailbericht ontvangt u een token voor het opeisen. Plak dit hierboven.
reclaim-failed = Kan domein niet opeisen.
subdomain-already-used = Dit subodmein is al in gebruik. Kies een andere.
invalid-reclamation-token = Ongeldig opeis-token.
domain-success = Gelukt! We verwijzen uw browser door…
issuing-error = Fout met het certificaat ophalen. Probeer het opnieuw.
redirecting = Doorsturen…

## Booleans

true = Ja
false = Nee

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
abbrev-kilowatt-hour = kW⋅h
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

## New Thing View

unknown-device-type = Onbekend apparaattype
new-thing-choose-icon = Kies icoon…
new-thing-save = Opslaan
new-thing-pin =
  .placeholder = Voer pincode in
new-thing-pin-error = Foute pincode
new-thing-pin-invalid = Ongeldige pincode
new-thing-cancel = Annuleren
new-thing-submit = Verstuur
new-thing-username =
  .placeholder = Gebruikersnaam
new-thing-password =
  .placeholder = Wachtwoord
new-thing-credentials-error = Ongeldige combinatie gebruikersnaam/wachtwoord
new-thing-saved = Opgeslagen
new-thing-done = Klaar

## New Web Thing View

new-web-thing-url =
  .placeholder = Web thing-URL
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

author-unknown = Onbekend
disable = Uitgeschakeld
enable = Ingeschakeld
by = door
addon-configure = Instellen
addon-update = Update
addon-remove = Verwijderen
addon-updating = Updaten…
addon-updated = Geupdatet
addon-update-failed = Mislukt
addon-config-applying = Toepassen…
addon-config-apply = Toepassen
addon-discovery-added = Toegevoegd
addon-discovery-add = Toevoegen
addon-discovery-installing = Installeren…
addon-discovery-failed = Mislukt

## Page Titles

settings = Instellingen
domain = Domein
users = Gebruikers
edit-user = Gebruiker beheren
add-user = Gebruiker toevoegen
adapters = Adapters
addons = Add-ons
addon-config = Add-on instellen
addon-discovery = Nieuwe Add-ons zoeken
experiments = Experimenten
localization = Lokalisatie
updates = Updates
authorizations = Autorisaties
developer = Ontwikkelaar
network = Netwerk
ethernet = Ethernet
wifi = Wi-Fi
icon = Pictogram

## Speech

speech-unsupported = De browser ondersteunt geen spraak
speech-didnt-get = Sorry, ik heb u niet verstaan.

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

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Aanmelden — { -webthings-gateway-brand }
login-log-in = Aanmelden

## Create First User Page

signup-title = Gebruiker toevoegen — { -webthings-gateway-brand }
signup-welcome = Welkom
signup-create-account = Maak uw eerste gebruiker aan:
signup-password-mismatch = Wachtwoorden zijn niet gelijk
signup-next = Volgende

## Tunnel Setup Page

tunnel-setup-title = Kies webadres — { -webthings-gateway-brand }
tunnel-setup-welcome = Welkom
tunnel-setup-choose-address = Kies een beveiligd webadres voor uw gateway:
tunnel-setup-input-subdomain =
  .placeholder = subdomein
tunnel-setup-opt-in = Houd mij op de hoogte over nieuwe mogelijkheden en bijdragen.
tunnel-setup-privacy-policy = Privacybeleid
tunnel-setup-input-reclamation-token =
  .placeholder = Opeistoken
tunnel-setup-error = Er is een fout opgetreden bij het instellen van het subdomein.
tunnel-setup-create = Aanmaken
tunnel-setup-skip = Overslaan
tunnel-setup-time-sync = Wacht op het instellen van de klok via internet. Domeinregistratie zal anders waarschijnlijk mislukken.

## Authorize Page

authorize-title = Autorisatieaanvraag- { -webthings-gateway-brand }
authorize-authorization-request = Autorisatieaanvraag
authorize-monitor-and-control = bekijken en instellen
authorize-monitor = bekijken
authorize-allow-all = Toestaan voor alle Things
authorize-allow =
  .value = Toestaan
authorize-deny = Weigeren

## Local Token Page

local-token-title = Lokale tokendienst — { -webthings-gateway-brand }
local-token-header = Lokale tokendienst
local-token-your-token = Je lokale token is <a data-l10n-name="local-token-jwt">JSON Web-token</a>.
local-token-use-it = Gebruik deze om beveiligd met de gateway te praten, met <a data-l10n-name="local-token-bearer-type">Bearer-type-autorisatie</a>.

## Router Setup Page

router-setup-title = Routerinstellingen — { -webthings-gateway-brand }
router-setup-header = Maak een Wi-Fi-verbinding
router-setup-input-ssid =
  .placeholder = Netwerknaam
router-setup-input-password =
  .placeholder = Wachtwoord
router-setup-input-confirm-password =
  .placeholder = Bevestig wachtwoord
router-setup-create =
  .value = Maak
router-setup-password-mismatch = Wachtwoorden moeten overeenkomen

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi-instellingen — { -webthings-gateway-brand }
wifi-setup-header = Verbinden met Wi-Fi-netwerk?
wifi-setup-input-password =
  .placeholder = Wachtwoord
wifi-setup-show-password = Wachtwoord tonen
wifi-setup-connect =
  .value = Verbinden
wifi-setup-network-icon =
  .alt = Wi-Fi-Netwerk
wifi-setup-skip = Overslaan

## Connecting to Wi-Fi Page

connecting-title = Verbinden met Wi-Fi — { -webthings-gateway-brand }
connecting-header = Verbinden met Wi-Fi…
connecting-connect = Controleer of u verbonden bent met hetzelfde netwerk en
 navigeer dan naar { $gateway-link } in uw webbrowser om de installatie te voltooien.
connecting-warning = Let op: Als u { $domain } niet kunt laden, controleer
 het IP-adres van de gateway in uw router.
connecting-header-skipped = Installatie Wi-Fi overgeslagen
connecting-skipped = De gateway wordt opgestart. Navigeer naar
 { $gateway-link } in uw webbrowser, terwijl u verbonden bent met hetzelfde netwerk,
 om de installatie te voltooien.

## Creating Wi-Fi Network Page

creating-title = Wi-Fi-netwerk maken — { -webthings-gateway-brand }
creating-header = Wi-Fi-netwerk maken…
creating-content = Verbind met { $ssid } en het ingestelde wachtwoord,
 navigeer daarna naar { $gateway-link } of { $ip-link } in uw webbrowser.

## General Terms

ok = Ok
ellipsis = …
event-log = Gebeurtenissenlogboek
edit = Bewerken
remove = Verwijderen
disconnected = Ontkoppelen
processing = Verwerken…
submit = Verstuur
