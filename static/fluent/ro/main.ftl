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

things-menu-item = Lucruri
rules-menu-item = Reguli
logs-menu-item = Jurnale
floorplan-menu-item = Plan etaj
settings-menu-item = Setări
log-out-button = Deconectare

## Things

thing-details =
    .aria-label = Afișează proprietățile
add-things =
    .aria-label = Adaugă lucruri noi

## Floorplan

upload-floorplan = Încarcă planul de etaj...
upload-floorplan-hint = (.svg recomandat)

## Top-Level Settings

settings-domain = Domeniu
settings-network = Rețea
settings-users = Utilizatori
settings-add-ons = Suplimente
settings-adapters = Adaptoare
settings-localization = Localizare
settings-updates = Actualizări
settings-authorizations = Autorizații
settings-experiments = Experimente
settings-developer = Dezvoltator

## Domain Settings

domain-settings-local-label = Acces local
domain-settings-local-update = Actualizare denumire gazdă
domain-settings-remote-access = Acces la distanță
domain-settings-local-name =
    .placeholder = poartă de acces

## Network Settings

network-settings-unsupported = Setările rețelei nu au suport pentru această platformă.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Rețea domestică
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configurează
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Mod
network-settings-home-network-lan = Rețea domestică (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Adresă IP
network-settings-dhcp = Automată (DHCP)
network-settings-static = Manuală (IP static)
network-settings-pppoe = Punte (PPPoE)
network-settings-static-ip-address = Adresă IP statică
network-settings-network-mask = Mască de rețea
network-settings-gateway = Poartă de acces
network-settings-done = Terminat
network-settings-wifi-password =
    .placeholder = Parolă
network-settings-show-password = Afișează parola
network-settings-connect = Conectare
network-settings-username = Nume de utilizator
network-settings-password = Parolă
network-settings-router-ip = Adresa IP a routerului
network-settings-dhcp-server = Server DHCP
network-settings-enable-wifi = Activează Wi-Fi
network-settings-network-name = Denumire rețea (SSID)
wireless-connected = Conectat
wireless-icon =
    .alt = Rețea Wi-Fi
network-settings-changing = Se modifică setările rețelei. Poate dura un minut.
failed-ethernet-configure = Eroare la configurarea Ethernet-ului.
failed-wifi-configure = Configurarea Wi-Fi a eșuat.
failed-wan-configure = Configurarea WAN a eșuat.
failed-lan-configure = Configurarea LAN a eșuat.
failed-wlan-configure = Configurarea WLAN a eșuat.

## User Settings

create-user =
    .aria-label = Adaugă un utilizator nou
user-settings-input-name =
    .placeholder = Nume
user-settings-input-email =
    .placeholder = E-mail
user-settings-input-password =
    .placeholder = Parolă
user-settings-input-new-password =
    .placeholder = Parola nouă (opțional)
user-settings-input-confirm-new-password =
    .placeholder = Confirmă parola nouă
user-settings-input-confirm-password =
    .placeholder = Confirmă parola
user-settings-password-mismatch = Parolele nu se potrivesc
user-settings-save = Salvează

## Adapter Settings

adapter-settings-no-adapters = Nu există adaptoare.

## Authorization Settings

authorization-settings-no-authorizations = Nu există autorizații.

## Experiment Settings

experiment-settings-no-experiments = Niciun experiment disponibil momentan.

## Localization Settings

localization-settings-language-region = Limbă și regiune
localization-settings-country = Țară
localization-settings-timezone = Fus orar
localization-settings-language = Limbă
localization-settings-units = Unități
localization-settings-units-temperature = Temperatură
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Actualizează acum
update-available = Versiune nouă disponibilă.
update-up-to-date = Sistemul tău este la zi.
updates-not-supported = Actualizările nu au suport pe această platformă.
update-settings-enable-self-updates = Activează actualizările automate
last-update = Ultima actualizare
current-version = Versiune curentă
failed = Eșuat
never = Niciodată
in-progress = În curs…
restarting = Repornire în curs…
checking-for-updates = Se caută actualizări…
failed-to-check-for-updates = Momentan nu se pot căuta actualizări.

## Developer Settings

developer-settings-enable-ssh = Activează SSH
developer-settings-view-internal-logs = Vizualizează jurnalele interne
developer-settings-create-local-authorization = Creează o autorizație locală

## Rules

add-rule =
    .aria-label = Creează o nouă regulă
rules = Reguli
rules-create-rule-hint = Nu au fost create reguli. Dă clic pe + pentru a crea o regulă.
rules-rule-name = Denumire regulă
rules-customize-rule-name-icon =
    .alt = Personalizează denumirea regulii
rules-rule-description = Descriere regulă
rules-preview-button =
    .alt = Previzualizare
rules-delete-icon =
    .alt = Șterge
rules-drag-hint = Trage dispozitivele aici pentru a începe crearea unei reguli
rules-drag-input-hint = Adaugă un dispozitiv ca intrare
rules-drag-output-hint = Adaugă un dispozitiv ca ieșire
rules-scroll-left =
    .alt = Derulează la stânga
rules-scroll-right =
    .alt = Derulează la dreapta
rules-delete-prompt = Trage și lasă dispozitivele aici pentru deconectare
rules-delete-dialog = Sigur vrei să elimini definitiv această regulă?
rules-delete-cancel =
    .value = Renunță
rules-delete-confirm =
    .value = Elimină regula
rule-invalid = Invalidă
rule-delete-prompt = Sigur vrei să elimini definitiv această regulă?
rule-delete-cancel-button =
    .value = Renunță
rule-delete-confirm-button =
    .value = Elimină regula
rule-select-property = Selectează proprietatea
rule-not = Nu
rule-event = Eveniment
rule-action = Acțiune
rule-configure = Se configurează…
rule-time-title = Oră
rule-notification = Notificare
notification-title = Titlu
notification-message = Mesaj
notification-level = Nivel
notification-low = Scăzut
notification-normal = Normal
notification-high = Ridicat
rule-name = Denumire regulă

## Logs

add-log =
    .aria-label = Creează un jurnal nou
logs = Jurnale
logs-create-log-hint = Nu au fost create jurnale. Dă clic pe + pentru a crea un jurnal.
logs-device = Dispozitiv
logs-device-select =
    .aria-label = Dispozitiv de jurnale
logs-property = Proprietate
logs-property-select =
    .aria-label = Proprietate jurnal
logs-retention = Păstrare
logs-retention-length =
    .aria-label = Durată de păstrare a jurnalului
logs-retention-unit =
    .aria-label = Unitate de păstrare a jurnalului
logs-hours = Ore
logs-days = Zile
logs-weeks = Săptămâni
logs-save = Salvează
logs-remove-dialog-title = Se elimină
logs-remove-dialog-warning = Eliminarea jurnalului va elimina și toate datele incluse. Sigur vrei să îl elimini?
logs-remove = Elimină
logs-unable-to-create = Jurnalul nu a putut fi creat
logs-server-remove-error = Eroare de server: imposibil de eliminat jurnalul

## Add New Things

add-thing-scanning-icon =
    .alt = Se scanează...
add-thing-scanning = Se scanează pentru dispozitive noi…
add-thing-add-adapters-hint = Nu s-au găsit lucruri noi. Încearcă <a data-l10n-name="add-thing-add-adapters-hint-anchor">adăugând unele suplimente</a>.
add-thing-add-by-url = Adăugare după URL ...
add-thing-done = Terminat
add-thing-cancel = Renunță

## Context Menu

context-menu-choose-icon = Alege pictograma…
context-menu-save = Salvează
context-menu-remove = Elimină

## Capabilities

OnOffSwitch = Comutator pornit/oprit
MultiLevelSwitch = Comutator multinivel
ColorControl = Control culori
ColorSensor = Senzor de culoare
EnergyMonitor = Monitor de energie
BinarySensor = Senzor binar
MultiLevelSensor = Senzor multinivel
SmartPlug = Priză inteligentă
Light = Lumină
DoorSensor = Senzor de ușă
MotionSensor = Senzor de mișcare
LeakSensor = Senzor de scurgere
PushButton = Buton de apăsat
VideoCamera = Cameră video
Camera = Cameră
TemperatureSensor = Senzor de temperatură
Alarm = Alarmă
Thermostat = Termostat
Lock = Yală
Custom = Lucru personalizat
Thing = Lucru

## Properties

alarm = Alarmă
pushed = Apăsat
not-pushed = Neapăsat
on-off = Pornit/oprit
on = Pornit
off = Oprit
power = Putere
voltage = Voltaj
temperature = Temperatură
current = Curent
frequency = Frecvență
color = Culoare
brightness = Luminozitate
leak = Scurgere
dry = Uscat
color-temperature = Temperatură culoare
video-unsupported = Ne pare rău, videoclipul nu are suport în browserul tău.
motion = Mișcare
no-motion = Fără mișcare
open = Deschis
closed = Închis
locked = Blocat
unlocked = Deblocat
jammed = Obstrucționat
unknown = Necunoscut
active = Activ
inactive = Inactiv

## Domain Setup

tunnel-setup-reclaim-domain = Se pare că ai înregistrat deja subdomeniul respectiv. Pentru a-l revendica<a data-l10n-name="tunnel-setup-reclaim-domain-click-here">dă clic aici</a>.
check-email-for-token = Te rugăm să îți verifici adresa de e-mail tău pentru un jeton de revendicare și lipește-l mai sus.
reclaim-failed = Domeniul nu a putut fi revendicat.
subdomain-already-used = Acest subdomeniu este deja folosit. Te rugăm să alegi altul.
invalid-subdomain = Subdomeniu nevalid.
invalid-email = Adresă de e-mail nevalidă.
invalid-reclamation-token = Jeton de revendicare nevalid.
domain-success = Succes! Te rugăm să aștepți în timp ce te redirecționăm ...
issuing-error = Eroare la eliberarea certificatului. Te rugăm să încerci din nou.
redirecting = Se redirecționează…

## Booleans

true = Adevărat
false = Fals

## Time

utils-now = acum
utils-seconds-ago =
    { $value ->
        [one] acum { $value } secundă
        [few] acum { $value } secunde
       *[other] acum { $value } de secunde
    }
utils-minutes-ago =
    { $value ->
        [one] acum { $value } minut
        [few] acum { $minutes } minute
       *[other] acum { $minutes } de minute
    }
utils-hours-ago =
    { $value ->
        [one] acum { $value } oră
        [few] acum { $value } ore
       *[other] acum { $value } de ore
    }
utils-days-ago =
    { $value ->
        [one] acum { $value } zi
        [few] acum { $value } zile
       *[other] acum { $value } de zile
    }
utils-weeks-ago =
    { $value ->
        [one] acum { $value } săptămână
        [few] acum { $value } săptămâni
       *[other] acum { $value } de săptămâni
    }
utils-months-ago =
    { $value ->
        [one] acum { $value } lună
        [few] acum { $value } luni
       *[other] acum { $value } de luni
    }
utils-years-ago =
    { $value ->
        [one] acum { $value } an
        [few] acum { $value } ani
       *[other] acum { $value } de ani
    }
minute = Minut
hour = Oră
day = Zi
week = Săptămână

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
abbrev-day = z
abbrev-hour = o
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft

## New Thing View

unknown-device-type = Tip de dispozitiv necunoscut
new-thing-choose-icon = Alege pictograma…
new-thing-save = Salvează
new-thing-pin =
    .placeholder = Introdu PIN-ul
new-thing-pin-error = PIN incorect
new-thing-pin-invalid = PIN nevalid
new-thing-cancel = Renunță
new-thing-submit = Trimite
new-thing-username =
    .placeholder = Introdu numele de utilizator
new-thing-password =
    .placeholder = Introdu parola
new-thing-credentials-error = Credențiale incorecte
new-thing-saved = Salvat
new-thing-done = Terminat

## New Web Thing View

new-web-thing-url =
    .placeholder = Introdu adresa URL a obiectului web

## Empty div Messages


## Add-on Settings


## Page Titles


## Errors

gateway-unreachable = Poartă de acces inaccesibilă

## Schema Form


## Icon Sources


## Login Page

login-title = Autentificare — { -webthings-gateway-brand }

## Create First User Page

signup-title = Creează utilizator — { -webthings-gateway-brand }

## Tunnel Setup Page

tunnel-setup-title = Alege adresa web — { -webthings-gateway-brand }
tunnel-setup-choose-address = Alege o adresă web securizată pentru poarta de acces:

## Authorize Page

authorize-title = Cerere de autorizare — { -webthings-gateway-brand }
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> vrea să acceseze poarta de acces la <<function>> dispozitive.

## Local Token Page

local-token-title = Serviciu local de jetoane — { -webthings-gateway-brand }
local-token-use-it = De folosit pentru comunicații securizate cu poarta de acces, cu <a data-l10n-name="local-token-bearer-type">Autorizație tip la purtător</a>.

## Router Setup Page

router-setup-title = Configurare router — { -webthings-gateway-brand }

## Wi-Fi Setup Page

wifi-setup-title = Configurare Wi-Fi — { -webthings-gateway-brand }

## Connecting to Wi-Fi Page

connecting-title = Conectare la Wi-Fi — { -webthings-gateway-brand }
connecting-connect = Asigură-te că ești conectat la aceeași rețea și apoi navighează la { $gateway-link } în browserul web pentru a continua configurarea.

## Creating Wi-Fi Network Page

creating-title = Crearea unei rețele Wi-Fi — { -webthings-gateway-brand }
creating-content = Conectează-te la { $ssid } cu parola pe care tocmai ai creat-o și apoi navighează la { $gateway-link } sau { $ip-link } în browserul web.

## UI Updates


## General Terms


## Top-Level Buttons

