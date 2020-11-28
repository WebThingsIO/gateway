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

things-menu-item = Enheter
rules-menu-item = Regler
logs-menu-item = Loggar
floorplan-menu-item = Planlösning
settings-menu-item = Inställningar
log-out-button = Logga ut

## Things

thing-details =
    .aria-label = Visa egenskaper
add-things =
    .aria-label = Lägg till nya enheter

## Floorplan

upload-floorplan = Ladda upp planlösning…
upload-floorplan-hint = (.svg rekommenderas)

## Top-Level Settings

settings-domain = Domän
settings-network = Nätverk
settings-users = Användare
settings-add-ons = Tillägg
settings-adapters = Adaptrar
settings-localization = Översättning
settings-updates = Uppdateringar
settings-authorizations = Auktoriseringar
settings-experiments = Experiment
settings-developer = Utvecklare

## Domain Settings

domain-settings-local-label = Lokal åtkomst
domain-settings-local-update = Uppdatera värdnamn
domain-settings-remote-access = Fjärråtkomst
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Nätverksinställningar stöds inte för den här plattformen.
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
network-settings-wan-mode = Läge
network-settings-home-network-lan = Hemnätverk (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-adress
network-settings-dhcp = Automatisk (DHCP)
network-settings-static = Manuell (statisk IP)
network-settings-pppoe = Brygga (PPPoE)
network-settings-static-ip-address = Statisk IP-adress
network-settings-network-mask = Nätverksmask
network-settings-gateway = Gateway
network-settings-done = Klar
network-settings-wifi-password =
    .placeholder = Lösenord
network-settings-show-password = Visa lösenord
network-settings-connect = Anslut
network-settings-username = Användarnamn
network-settings-password = Lösenord
network-settings-router-ip = Router IP-adress
network-settings-dhcp-server = DHCP-server
network-settings-enable-wifi = Aktivera Wi-Fi
network-settings-network-name = Nätverksnamn (SSID)
wireless-connected = Ansluten
wireless-icon =
    .alt = Wi-Fi nätverk
network-settings-changing = Ändrar nätverksinställningar. Detta kan ta någon minut.
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
user-settings-input-email =
    .placeholder = E-post
user-settings-input-password =
    .placeholder = Lösenord
user-settings-input-totp =
    .placeholder = 2FA-kod
user-settings-mfa-enable = Aktivera tvåfaktorautentisering
user-settings-mfa-scan-code = Skanna följande kod med valfri tvåfaktorsautentiseringsapp.
user-settings-mfa-secret = Det här är din nya TOTP-hemlighet, om QR-koden ovan inte fungerar:
user-settings-mfa-error = Autentiseringskoden var felaktig.
user-settings-mfa-enter-code = Ange koden från din autentiseringsapp nedan.
user-settings-mfa-verify = Verifiera
user-settings-mfa-regenerate-codes = Återskapa reservkoder
user-settings-mfa-backup-codes = Det här är dina reservkoder. Var och en kan bara användas en gång. Förvara dem på ett säkert ställe.
user-settings-input-new-password =
    .placeholder = Nytt lösenord (valfritt)
user-settings-input-confirm-new-password =
    .placeholder = Bekräfta nytt lösenord
user-settings-input-confirm-password =
    .placeholder = Bekräfta lösenord
user-settings-password-mismatch = Lösenorden överensstämmer inte
user-settings-save = Spara

## Adapter Settings

adapter-settings-no-adapters = Inga adaptrar hittades.

## Authorization Settings

authorization-settings-no-authorizations = Inga auktoriseringar.

## Experiment Settings

experiment-settings-no-experiments = Inga experiment tillgängliga för närvarande.

## Localization Settings

localization-settings-language-region = Språk & region
localization-settings-country = Land
localization-settings-timezone = Tidszon
localization-settings-language = Språk
localization-settings-units = Enheter
localization-settings-units-temperature = Temperatur
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Uppdatera nu
update-available = Ny version tillgänglig
update-up-to-date = Ditt system är uppdaterat
updates-not-supported = Uppdateringar stöds inte på denna plattform.
update-settings-enable-self-updates = Aktivera automatiska uppdateringar
last-update = Senast uppdaterad
current-version = Nuvarande version
failed = Misslyckades
never = Aldrig
in-progress = Pågående
restarting = Startar om
checking-for-updates = Söker efter uppdateringar…
failed-to-check-for-updates = Kunde inte söka efter uppdateringar för tillfället.

## Developer Settings

developer-settings-enable-ssh = Aktivera SSH
developer-settings-view-internal-logs = Visa interna loggar
developer-settings-create-local-authorization = Skapa lokal auktorisering

## Rules

add-rule =
    .aria-label = Skapa ny regel
rules = Regler
rules-create-rule-hint = Inga regler skapade. Klicka på + för att skapa en regel.
rules-rule-name = Regelnamn
rules-customize-rule-name-icon =
    .alt = Anpassa regelnamn
rules-rule-description = Regelbeskrivning
rules-preview-button =
    .alt = Förhandsgranska
rules-delete-icon =
    .alt = Ta bort
rules-drag-hint = Dra dina enheter hit för att börja skapa en regel
rules-drag-input-hint = Lägg till enhet som indata
rules-drag-output-hint = Lägg till enhet som utdata
rules-scroll-left =
    .alt = Bläddra till vänster
rules-scroll-right =
    .alt = Bläddra till höger
rules-delete-prompt = Släpp enheter här för att koppla ner
rules-delete-dialog = Är du säker på att du vill ta bort denna regel permanent?
rules-delete-cancel =
    .value = Avbryt
rules-delete-confirm =
    .value = Ta bort regel
rule-invalid = Ogiltig
rule-delete-prompt = Är du säker på att du vill ta bort denna regel permanent?
rule-delete-cancel-button =
    .value = Avbryt
rule-delete-confirm-button =
    .value = Ta bort regel
rule-select-property = Välj egenskap
rule-not = Inte
rule-event = Händelse
rule-action = Åtgärd
rule-configure = Konfigurera…
rule-time-title = Tid på dagen
rule-notification = Notifiering
notification-title = Titel
notification-message = Meddelande
notification-level = Nivå
notification-low = Låg
notification-normal = Normal
notification-high = Hög
rule-name = Regelnamn

## Logs

add-log =
    .aria-label = Skapa ny logg
logs = Loggar
logs-create-log-hint = Inga loggar har skapats. Klicka på + för att skapa en logg.
logs-device = Enhet
logs-device-select =
    .aria-label = Logga enhet
logs-property = Egenskap
logs-property-select =
    .aria-label = Logga egenskap
logs-retention = Kvarhållning
logs-retention-length =
    .aria-label = Kvarhållningslängd för logg
logs-retention-unit =
    .aria-label = Kvarhållningsenhet för logg
logs-hours = Timmar
logs-days = Dagar
logs-weeks = Veckor
logs-save = Spara
logs-remove-dialog-title = Tar bort
logs-remove-dialog-warning = Väljer du att ta bort loggen så tas även dess data bort. Är du säker på att du vill ta bort den?
logs-remove = Ta bort
logs-unable-to-create = Det går inte att skapa logg
logs-server-remove-error = Serverfel: kan inte ta bort loggen

## Add New Things

add-thing-scanning-icon =
    .alt = Söker
add-thing-scanning = Söker efter nya enheter…
add-thing-add-adapters-hint = Inga nya enheter hittades. Försök med att <a data-l10n-name="add-thing-add-adapters-hint-anchor"> lägga till några tillägg</a>.
add-thing-add-by-url = Lägg till via URL…
add-thing-done = Klar
add-thing-cancel = Avbryt

## Context Menu

context-menu-choose-icon = Välj ikon…
context-menu-save = Spara
context-menu-remove = Ta bort

## Capabilities

OnOffSwitch = På/Av knapp
MultiLevelSwitch = Flernivåomkopplare
ColorControl = Färgkontroll
ColorSensor = Färgsensor
EnergyMonitor = Energimätare
BinarySensor = Binär sensor
MultiLevelSensor = Flernivåsensor
SmartPlug = Trådlöst uttag
Light = Lampor
DoorSensor = Dörrsensor
MotionSensor = Rörelsesensor
LeakSensor = Läckagesensor
PushButton = Tryckknapp
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Temperatursensor
HumiditySensor = Luftfuktighetssensor
Alarm = Larm
Thermostat = Termostat
Lock = Lås
BarometricPressureSensor = Barometrisk trycksensor
Custom = Anpassad enhet
Thing = Enhet
AirQualitySensor = Luftkvalitetssensor
SmokeSensor = Röksensor

## Properties

alarm = Larm
pushed = Tryckt
not-pushed = Inte tryckt
on-off = På/Av
on = På
off = Av
power = Effekt
voltage = Spänning
temperature = Temperatur
current = Ström
frequency = Frekvens
color = Färg
brightness = Ljusstyrka
leak = Läcka
dry = Torr
color-temperature = Färgtemperatur
video-unsupported = Tyvärr stöds inte video i din webbläsare.
motion = Rörelse
no-motion = Ingen rörelse
open = Öppen
closed = Stängd
locked = Låst
unlocked = Upplåst
jammed = Fastnat
unknown = Okänd
active = Aktiv
inactive = Inaktiv
humidity = Luftfuktighet
concentration = Koncentration
density = Täthet
smoke = Rök

## Domain Setup

tunnel-setup-reclaim-domain = Det ser ut som att du redan har registrerat den här underdomänen. För att ta tillbaka den <a data-l10n-name="tunnel-setup-reclaim-domain-click-here"> klicka här</a>.
check-email-for-token = Kontrollera din e-post efter en återvinnings-token och klistra in den ovan.
reclaim-failed = Det gick inte att ta tillbaka domänen.
subdomain-already-used = Underdomänen används redan. Vänligen välj en annan.
invalid-subdomain = Ogiltig underdomän.
invalid-email = Ogiltig e-postadress.
invalid-reclamation-token = Ogiltig återvinningstoken.
domain-success = Lyckades! Vänta medan vi omdirigerar dig…
issuing-error = Fel vid utfärdande av certifikat. Var god försök igen.
redirecting = Omdirigerar…

## Booleans

true = Sant
false = Falskt

## Time

utils-now = nu
utils-seconds-ago =
    { $value ->
        [one] { $value } sekund sedan
       *[other] { $value } sekunder sedan
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minut sedan
       *[other] { $value } minuter sedan
    }
utils-hours-ago =
    { $value ->
        [one] { $value } timme sedan
       *[other] { $value } timmar sedan
    }
utils-days-ago =
    { $value ->
        [one] { $value } dag sedan
       *[other] { $value } dagar sedan
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } vecka sedan
       *[other] { $value } veckor sedan
    }
utils-months-ago =
    { $value ->
        [one] { $value } månad sedan
       *[other] { $value } månader sedan
    }
utils-years-ago =
    { $value ->
        [one] { $value } år sedan
       *[other] { $value } flera år sedan
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
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Okänd enhetstyp
new-thing-choose-icon = Välj ikon…
new-thing-save = Spara
new-thing-pin =
    .placeholder = Ange PIN
new-thing-pin-error = Felaktig PIN
new-thing-pin-invalid = Ogiltig PIN
new-thing-cancel = Avbryt
new-thing-submit = Skicka
new-thing-username =
    .placeholder = Ange användarnamn
new-thing-password =
    .placeholder = Ange lösenord
new-thing-credentials-error = Felaktiga inloggningsuppgifter
new-thing-saved = Sparad
new-thing-done = Klar

## New Web Thing View

new-web-thing-url =
    .placeholder = Ange URL till Web Thing
new-web-thing-label = Web Thing
loading = Laddar…
new-web-thing-multiple = Flera Web Things hittades
new-web-thing-from = från

## Empty div Messages

no-things = Inga enheter ännu. Klicka på + för att söka efter tillgängliga enheter.
thing-not-found = Enhet hittades inte.
action-not-found = Åtgärd hittades inte.
events-not-found = Denna enhet har inga händelser.

## Add-on Settings

add-addons =
    .aria-label = Hitta nya tillägg
author-unknown = Okänd
disable = Inaktivera
enable = Aktivera
by = av
license = licens
addon-configure = Konfigurera
addon-update = Uppdatera
addon-remove = Ta bort
addon-updating = Uppdaterar…
addon-updated = Uppdaterad
addon-update-failed = Misslyckades
addon-config-applying = Verkställer…
addon-config-apply = Verkställ
addon-discovery-added = Tillagd
addon-discovery-add = Lägg till
addon-discovery-installing = Installerar…
addon-discovery-failed = Misslyckades
addon-search =
    .placeholder = Sök

## Page Titles

settings = Inställningar
domain = Domän
users = Användare
edit-user = Redigera användare
add-user = Lägg till användare
adapters = Adaptrar
addons = Tillägg
addon-config = Konfigurera tillägg
addon-discovery = Upptäck nya tillägg
experiments = Experiment
localization = Översättning
updates = Uppdateringar
authorizations = Auktoriseringar
developer = Utvecklare
network = Nätverk
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikon

## Errors

unknown-state = Okänt tillstånd.
error = Fel
errors = Fel
gateway-unreachable = Gateway otillgänglig
more-information = Mer information
invalid-file = Ogiltigt fil.
failed-read-file = Misslyckades med att läsa fil.
failed-save = Misslyckades med att spara.

## Schema Form

unsupported-field = Fältschema som inte stöds

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Logga in — { -webthings-gateway-brand }
login-log-in = Logga in
login-wrong-credentials = Användarnamn eller lösenord är felaktigt.
login-wrong-totp = Autentiseringskoden var felaktig.
login-enter-totp = Ange kod från din autentiseringsapp.

## Create First User Page

signup-title = Skapa användare — { -webthings-gateway-brand }
signup-welcome = Välkommen
signup-create-account = Skapa ditt första användarkonto:
signup-password-mismatch = Lösenorden matchar inte
signup-next = Nästa

## Tunnel Setup Page

tunnel-setup-title = Välj webbadress — { -webthings-gateway-brand }
tunnel-setup-welcome = Välkommen
tunnel-setup-choose-address = Välj en säker webbadress för din gateway:
tunnel-setup-input-subdomain =
    .placeholder = underdomän
tunnel-setup-email-opt-in = Håll mig uppdaterad med nyheter om WebThings.
tunnel-setup-agree-privacy-policy = Godkänn WebThings <a data-l10n-name="tunnel-setup-privacy-policy-link">sekretesspolicy</a> och <a data-l10n-name="tunnel-setup-tos-link">användarvillkor</a>.
tunnel-setup-input-reclamation-token =
    .placeholder = Återvinningstoken
tunnel-setup-error = Ett fel inträffade under inställningen av underdomänen.
tunnel-setup-create = Skapa
tunnel-setup-skip = Hoppa över
tunnel-setup-time-sync = Väntar på att systemklockan ska ställas in från Internet. Domänregistrering kommer sannolikt att misslyckas förrän detta är slutfört.

## Authorize Page

authorize-title = Auktorisationsbegäran — { -webthings-gateway-brand }
authorize-authorization-request = Auktorisationsbegäran
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> vill komma åt din gateway för att <<function>> enheter.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = från <<domain>>
authorize-monitor-and-control = övervaka och kontrollera
authorize-monitor = övervaka
authorize-allow-all = Tillåt för alla enheter
authorize-allow =
    .value = Tillåt
authorize-deny = Neka

## Local Token Page

local-token-title = Lokal tokentjänst — { -webthings-gateway-brand }
local-token-header = Lokal tokentjänst
local-token-your-token = Dina lokala token är denna <a data-l10n-name="local-token-jwt">JSON webb-token</a>:
local-token-use-it = Använd den för att säkert kommunicera med gatewayen, med <a data-l10n-name="local-token-bearer-type"> Tokenbaserad autentisering</a>.
local-token-copy-token = Kopiera token

## Router Setup Page

router-setup-title = Routerkonfiguration — { -webthings-gateway-brand }
router-setup-header = Skapa ett nytt Wi-Fi-nätverk
router-setup-input-ssid =
    .placeholder = Nätverksnamn
router-setup-input-password =
    .placeholder = Lösenord
router-setup-input-confirm-password =
    .placeholder = Bekräfta lösenord
router-setup-create =
    .value = Skapa
router-setup-password-mismatch = Lösenorden måste överensstämma.

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi konfiguration — { -webthings-gateway-brand }
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

connecting-title = Ansluter till Wi-Fi — { -webthings-gateway-brand }
connecting-header = Ansluter till Wi-Fi…
connecting-connect = Se till att du är ansluten till samma nätverk och navigera sedan till { $gateway-link } i din webbläsare för att fortsätta installationen.
connecting-warning = Obs! Om du inte kan ladda { $domain }, kolla upp så att gatewayens IP-adress är korrekt på din router.
connecting-header-skipped = Wi-Fi inställningar hoppades över
connecting-skipped = Gateway startas nu. Navigera till { $gateway-link } i din webbläsare när du är ansluten till samma nätverk som gatewayen för att fortsätta installationen.

## Creating Wi-Fi Network Page

creating-title = Skapar Wi-Fi nätverk — { -webthings-gateway-brand }
creating-header = Skapar Wi-Fi nätverk…
creating-content = Anslut till { $ssid } med det lösenord som du just skapade och navigera sedan till { $gateway-link } eller { $ip-link } i din webbläsare.

## UI Updates

ui-update-available = Ett uppdaterat användargränssnitt är tillgängligt.
ui-update-reload = Ladda om
ui-update-close = Stäng

## Transfer to webthings.io

action-required-image =
    .alt = Varning
action-required = Åtgärd krävs:
action-required-message = Mozilla IoT fjärråtkomsttjänst och automatiska programuppdateringar kommer att avbrytas. Välj om du vill överföra webthings.io till det communitystyrda webthings.io för fortsatt service.
action-required-more-info = Mer info
action-required-dont-ask-again = Fråga inte igen
action-required-choose = Välj
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Den 31 december 2020 avbryts Mozilla IoT fjärråtkomsttjänst och de automatiska programuppdateringarna (<a data-l10n-name="transition-dialog-more-info">mer information</a>). Mozilla överför projektet till den nya, community-run <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> (inte ansluten till Mozilla).<br>< br>Om du inte vill få fler programuppdateringar från community-run uppdateringsservrar kan du inaktivera automatiska uppdateringar i inställningarna.<br><br>Om du vill överföra din underdomän från mozilla-iot.org till webthings.io eller om du vill registrera en ny underdomän kan du fylla i formuläret nedan för att registrera dig för den ersättande community-run externa åtkomsttjänst.
transition-dialog-register-domain-label = Registrera dig för webthings.io fjärråtkomsttjänst
transition-dialog-subdomain =
    .placeholder = Underdomän
transition-dialog-newsletter-label = Håll mig uppdaterad med nyheter om WebThings
transition-dialog-agree-tos-label = Godkänn WebThings <a data-l10n-name="transition-dialog-privacy-policy-link">sekretesspolicy</a> och <a data-l10n-name="transition-dialog-tos-link">användarvillkor</a>.
transition-dialog-email =
    .placeholder = E-postadress
transition-dialog-register =
    .value = Registrera
transition-dialog-register-status =
    .alt = Registreringsstatus
transition-dialog-register-label = Registrerar underdomän
transition-dialog-subscribe-status =
    .alt = Prenumerationsstatus för nyhetsbrev
transition-dialog-subscribe-label = Prenumerera på nyhetsbrev
transition-dialog-error-generic = Ett fel uppstod. Gå tillbaka och försök igen.
transition-dialog-error-subdomain-taken = Vald underdomän används redan. Gå tillbaka och välj en annan.
transition-dialog-error-subdomain-failed = Det gick inte att registrera underdomän. Gå tillbaka och försök igen.
transition-dialog-error-subscribe-failed = Det gick inte att prenumerera på nyhetsbrevet. Försök igen på<a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Navigera till <<domain>> för att fortsätta.

## General Terms

ok = Ok
ellipsis = …
event-log = Händelselogg
edit = Redigera
remove = Ta bort
disconnected = Ej ansluten
processing = Bearbetar…
submit = Spara

## Top-Level Buttons

menu-button =
    .aria-label = Meny
back-button =
    .aria-label = Bakåt
overflow-button =
    .aria-label = Ytterligare åtgärder
submit-button =
    .aria-label = Spara
edit-button =
    .aria-label = Redigera
save-button =
    .aria-label = Spara
