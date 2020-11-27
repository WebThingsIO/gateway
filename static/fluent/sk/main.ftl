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

things-menu-item = Veci
rules-menu-item = Pravidlá
logs-menu-item = Záznamy
floorplan-menu-item = Pôdorys
settings-menu-item = Nastavenia
log-out-button = Odhlásiť sa

## Things

thing-details =
    .aria-label = Zobraziť vlastnosti
add-things =
    .aria-label = Pridať nové veci

## Floorplan

upload-floorplan = Nahrať pôdorys…
upload-floorplan-hint = (.svg odporúčané)

## Top-Level Settings

settings-domain = Doména
settings-network = Sieť
settings-users = Používatelia
settings-add-ons = Doplnky
settings-adapters = Adaptéry
settings-localization = Lokalizácia
settings-updates = Aktualizácie
settings-authorizations = Oprávnenia
settings-experiments = Experimenty
settings-developer = Vývojár

## Domain Settings

domain-settings-local-label = Lokálny prístup
domain-settings-local-update = Zmeniť názov hostiteľa
domain-settings-remote-access = Vzdialený prístup
domain-settings-local-name =
    .placeholder = brána

## Network Settings

network-settings-unsupported = Nastavenia siete nie sú podporované na tejto platforme.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Domáca sieť
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Nastaviť
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Režim
network-settings-home-network-lan = Domáca sieť (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP adresa
network-settings-dhcp = Automaticky (DHCP)
network-settings-static = Manuálne (Statická IP)
network-settings-pppoe = Most (PPPoE)
network-settings-static-ip-address = Statická IP adresa
network-settings-network-mask = Sieťová maska
network-settings-gateway = Gateway
network-settings-done = Hotovo
network-settings-wifi-password =
    .placeholder = Heslo
network-settings-show-password = Zobraziť heslo
network-settings-connect = Pripojiť
network-settings-username = Používateľské meno
network-settings-password = Heslo
network-settings-router-ip = IP adresa routeru
network-settings-dhcp-server = DHCP server
network-settings-enable-wifi = Povoliť Wi-Fi
network-settings-network-name = Názov siete (SSID)
wireless-connected = Pripojené
wireless-icon =
    .alt = Sieť Wi-Fi
network-settings-changing = Prebieha zmena sieťových nastavení. Môže to chvíľu trvať.
failed-ethernet-configure = Konfigurácia ethernetu zlyhala.
failed-wifi-configure = Konfigurácia Wi-Fi zlyhala.
failed-wan-configure = Konfigurácia WAN zlyhala.
failed-lan-configure = Konfigurácia LAN zlyhala.
failed-wlan-configure = Konfigurácia WLAN zlyhala.

## User Settings

create-user =
    .aria-label = Pridať nového používateľa
user-settings-input-name =
    .placeholder = Meno
user-settings-input-email =
    .placeholder = E-mail
user-settings-input-password =
    .placeholder = Heslo
user-settings-input-totp =
    .placeholder = Kód na dvojstupňové overenie
user-settings-mfa-enable = Aktivovať dvojstupňové overenie
user-settings-mfa-scan-code = Oskenujte nasledujúci kód pomocou akejkoľvek aplikácie na dvojstupňové overenie.
user-settings-mfa-secret = Ak QR kód vyššie nefunguje, použite TOTP:
user-settings-mfa-error = Overovací kód bol nesprávny.
user-settings-mfa-enter-code = Zadajte kód zo svojej aplikácie na overenie nižšie.
user-settings-mfa-verify = Overiť
user-settings-mfa-regenerate-codes = Opätovne vygenerovať zálohové kódy
user-settings-mfa-backup-codes = Toto sú vaše zálohové kódy. Každý z nich môžete použiť iba raz. Uložte si ich na bezpečné miesto.
user-settings-input-new-password =
    .placeholder = Nové heslo (voliteľné)
user-settings-input-confirm-new-password =
    .placeholder = Potvrdiť nové heslo
user-settings-input-confirm-password =
    .placeholder = Potvrdiť heslo
user-settings-password-mismatch = Heslá sa nezhodujú
user-settings-save = Uložiť

## Adapter Settings

adapter-settings-no-adapters = Nie sú k dispozícii žiadne adaptéry.

## Authorization Settings

authorization-settings-no-authorizations = Žiadne oprávnenia.

## Experiment Settings

experiment-settings-no-experiments = V tejto chvíli nie sú dostupné žiadne experimenty.

## Localization Settings

localization-settings-language-region = Jazyk a región
localization-settings-country = Krajina
localization-settings-timezone = Časové pásmo
localization-settings-language = Jazyk
localization-settings-units = Jednotky
localization-settings-units-temperature = Teplota
localization-settings-units-temperature-celsius = Celzia (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheita (°F)

## Update Settings

update-settings-update-now = Aktualizovať teraz
update-available = Je dostupná nová verzia.
update-up-to-date = Váš systém je aktuálny.
updates-not-supported = Aktualizácie nie sú na tejto platforme podporované.
update-settings-enable-self-updates = Povoliť automatické aktualizácie
last-update = Posledná aktualizácia
current-version = Aktuálna verzia
failed = Zlyhanie
never = Nikdy
in-progress = Prebieha…
restarting = Reštartuje sa…
checking-for-updates = Vyhľadávajú sa aktualizácie…
failed-to-check-for-updates = Momentálne nie je možné skontrolovať aktualizácie.

## Developer Settings

developer-settings-enable-ssh = Povoliť SSH
developer-settings-view-internal-logs = Zobraziť interné záznamy
developer-settings-create-local-authorization = Vytvoriť miestne oprávnenie

## Rules

add-rule =
    .aria-label = Vytvoriť nové pravidlo
rules = Pravidlá
rules-create-rule-hint = Neboli vytvorené žiadne pravidlá. Kliknutím na + vytvoríte pravidlo.
rules-rule-name = Názov pravidla
rules-customize-rule-name-icon =
    .alt = Premenovať pravidlo
rules-rule-description = Popis pravidla
rules-preview-button =
    .alt = Náhľad
rules-delete-icon =
    .alt = Odstrániť
rules-drag-hint = Pre vytvorenie pravidla presuňte zariadenie sem
rules-drag-input-hint = Pridať zariadenie ako vstup
rules-drag-output-hint = Pridať zariadenie ako výstup
rules-scroll-left =
    .alt = Posunúť doľava
rules-scroll-right =
    .alt = Posunúť doprava
rules-delete-prompt = Presunutím zariadenia sem ho odstránite
rules-delete-dialog = Ste si istý, že chcete odstrániť toto pravidlo?
rules-delete-cancel =
    .value = Zrušiť
rules-delete-confirm =
    .value = Odstrániť pravidlo
rule-invalid = Neplatné
rule-delete-prompt = Ste si istý, že chcete odstrániť toto pravidlo?
rule-delete-cancel-button =
    .value = Zrušiť
rule-delete-confirm-button =
    .value = Odstrániť pravidlo
rule-select-property = Vyberte vlastnosť
rule-not = Nie
rule-event = Udalosť
rule-action = Akcia
rule-configure = Nastavenie…
rule-time-title = Denná doba
rule-notification = Upozornenie
notification-title = Názov
notification-message = Správa
notification-level = Úroveň
notification-low = Nízka
notification-normal = Normálna
notification-high = Vysoká
rule-name = Názov pravidla

## Logs

add-log =
    .aria-label = Vytvoriť nový záznam
logs = Záznamy
logs-create-log-hint = Neboli vytvorené žiadne záznamy. Kliknutím na + vytvoríte záznam.
logs-device = Zariadenie
logs-device-select =
    .aria-label = Záznam zariadenia
logs-property = Vlastnosť
logs-property-select =
    .aria-label = Vlastnosť záznamu
logs-retention = Uchovávanie
logs-retention-length =
    .aria-label = Dĺžka uchovávania záznamu
logs-retention-unit =
    .aria-label = Jednotka uchovávania záznamu
logs-hours = Hodiny
logs-days = Dni
logs-weeks = Týždne
logs-save = Uložiť
logs-remove-dialog-title = Odstraňuje sa
logs-remove-dialog-warning = Odstránením záznamu odstránite aj jeho údaje. Naozaj ho chcete odstrániť?
logs-remove = Odstrániť
logs-unable-to-create = Vytvorenie záznamu zlyhalo
logs-server-remove-error = Chyba servera: Nepodarilo sa odstrániť záznam

## Add New Things

add-thing-scanning-icon =
    .alt = Skenuje sa
add-thing-scanning = Vyhľadávajú sa nové zariadenia…
add-thing-add-adapters-hint = Neboli nájdené žiadne nové veci. Skúste <a data-l10n-name="add-thing-add-adapters-hint-anchor">pridať nejaké doplnky</a>.
add-thing-add-by-url = Pridať cez adresu URL…
add-thing-done = Hotovo
add-thing-cancel = Zrušiť

## Context Menu

context-menu-choose-icon = Vyberte ikonu…
context-menu-save = Uložiť
context-menu-remove = Odstrániť

## Capabilities

OnOffSwitch = Vypínač
MultiLevelSwitch = Viacúrovňový prepínač
ColorControl = Ovládanie farby
ColorSensor = Senzor farieb
EnergyMonitor = Monitor energie
BinarySensor = Binárny senzor
MultiLevelSensor = Viacúrovňový senzor
SmartPlug = Inteligentná zásuvka
Light = Svetlo
DoorSensor = Senzor dvier
MotionSensor = Pohybový senzor
LeakSensor = Senzor úniku
PushButton = Tlačidlo
VideoCamera = Kamera
Camera = Fotoaparát
TemperatureSensor = Teplotný senzor
HumiditySensor = Senzor vlhkosti
Alarm = Budík
Thermostat = Termostat
Lock = Zámok
BarometricPressureSensor = Senzor atmosférického tlaku
Custom = Vlastná vec
Thing = Vec
AirQualitySensor = Senzor kvality ovzdušia

## Properties

alarm = Budík
pushed = Stlačené
not-pushed = Nestlačené
on-off = Zapnúť/Vypnúť
on = Zapnuté
off = Vypnuté
power = Napájanie
voltage = Napätie
temperature = Teplota
current = Prúd
frequency = Frekvencia
color = Farba
brightness = Jas
leak = Únik
dry = Suché
color-temperature = Teplota farby
video-unsupported = Ľutujeme, ale váš prehliadač nepodporuje video.
motion = Pohyb
no-motion = Žiadny pohyb
open = Otvorené
closed = Zavreté
locked = Zamknuté
unlocked = Odomknuté
jammed = Zaseknuté
unknown = Neznáme
active = Aktívne
inactive = Neaktívne
humidity = Vlhkosť
concentration = Koncentrácia
density = Hustota

## Domain Setup

tunnel-setup-reclaim-domain = Vyzerá to tak, že ste si už zaregistrovali subdoménu. Ak ju chcete získať naspäť <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">kliknite sem</a>.
check-email-for-token = Na vašu e-mailovú adresu sme vám poslali token, prilepte ho vyššie.
reclaim-failed = Nepodarilo sa získať nárok na doménu.
subdomain-already-used = Táto subdoména je už obsadená. Vyberte si, prosím, inú.
invalid-subdomain = Neplatná subdoména.
invalid-email = Neplatná e-mailová adresa.
invalid-reclamation-token = Neplatný token.
domain-success = Úspech! Prosím, počkajte, kým vás presmerujeme…
issuing-error = Chyba pri vydávaní certifikátu. Prosím, skúste to znova.
redirecting = Prebieha presmerovanie…

## Booleans

true = Pravda
false = Nepravda

## Time

utils-now = teraz
utils-seconds-ago =
    { $value ->
        [one] pred { $value } sekundou
        [few] pred { $value } sekundami
       *[other] pred { $value } sekundami
    }
utils-minutes-ago =
    { $value ->
        [one] pred { $value } minútou
        [few] pred { $value } minútami
       *[other] pred { $value } minútami
    }
utils-hours-ago =
    { $value ->
        [one] pred { $value } hodinou
        [few] pred { $value } hodinami
       *[other] pred { $value } hodinami
    }
utils-days-ago =
    { $value ->
        [one] pred { $value } dňom
        [few] pred { $value } dňami
       *[other] pred { $value } dňami
    }
utils-weeks-ago =
    { $value ->
        [one] pred { $value } týždňom
        [few] pred { $value } týždňami
       *[other] pred { $value } týždňami
    }
utils-months-ago =
    { $value ->
        [one] pred { $value } mesiacom
        [few] pred { $value } mesiacmi
       *[other] pred { $value } mesiacmi
    }
utils-years-ago =
    { $value ->
        [one] pred { $value } rokom
        [few] pred { $value } rokmi
       *[other] pred { $value } rokmi
    }
minute = Minúta
hour = Hodina
day = Deň
week = Týždeň

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
abbrev-hour = h
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Neznámy typ zariadenia
new-thing-choose-icon = Vyberte ikonu…
new-thing-save = Uložiť
new-thing-pin =
    .placeholder = Zadajte PIN
new-thing-pin-error = Nesprávny PIN
new-thing-pin-invalid = Neplatný PIN
new-thing-cancel = Zrušiť
new-thing-submit = Odoslať
new-thing-username =
    .placeholder = Zadajte používateľské meno
new-thing-password =
    .placeholder = Zadajte heslo
new-thing-credentials-error = Neplatné prihlasovacie údaje
new-thing-saved = Uložené
new-thing-done = Hotovo

## New Web Thing View

new-web-thing-url =
    .placeholder = Zadajte URL webovej veci
new-web-thing-label = Webová vec
loading = Načítavanie…
new-web-thing-multiple = Bolo nájdených viacero webových vecí
new-web-thing-from = od

## Empty div Messages

no-things = Zatiaľ žiadne zariadenie. Kliknutím na + vyhľadáte dostupné zariadenia.
thing-not-found = Vec nebola nájdená.
action-not-found = Akcia nebola nájdená.
events-not-found = Táto vec nemá žiadne udalosti.

## Add-on Settings

add-addons =
    .aria-label = Vyhľadať nové doplnky
author-unknown = Neznámy
disable = Zakázať
enable = Povoliť
by = od
license = licencia
addon-configure = Nastaviť
addon-update = Aktualizovať
addon-remove = Odstrániť
addon-updating = Prebieha aktualizácia…
addon-updated = Aktualizované
addon-update-failed = Zlyhalo
addon-config-applying = Nastavovanie…
addon-config-apply = Použiť
addon-discovery-added = Pridané
addon-discovery-add = Pridať
addon-discovery-installing = Inštaluje sa…
addon-discovery-failed = Zlyhalo
addon-search =
    .placeholder = Hľadať

## Page Titles

settings = Nastavenia
domain = Doména
users = Používatelia
edit-user = Upraviť používateľa
add-user = Pridať používateľa
adapters = Adaptéry
addons = Doplnky
addon-config = Konfigurácia doplnkov
addon-discovery = Objavte nové doplnky
experiments = Experimenty
localization = Lokalizácia
updates = Aktualizácie
authorizations = Oprávnenia
developer = Vývojár
network = Sieť
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikona

## Errors

unknown-state = Neznámy stav.
error = Chyba
errors = Chyby
gateway-unreachable = Gateway nie je dostupná
more-information = Ďalšie informácie
invalid-file = Neplatný súbor.
failed-read-file = Pri čítaní súboru nastala chyba.
failed-save = Pri ukladaní súboru nastala chyba.

## Schema Form

unsupported-field = Nepodporovaná schéma poľa

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Prihlásenie - { -webthings-gateway-brand }
login-log-in = Prihlásenie
login-wrong-credentials = Nesprávne používateľské meno alebo heslo.
login-wrong-totp = Overovací kód bol nesprávny.
login-enter-totp = Zadajte kód zo svojej aplikácie na overenie.

## Create First User Page

signup-title = Vytvorenie používateľa - { -webthings-gateway-brand }
signup-welcome = Vitajte
signup-create-account = Vytvorte svoj prvý používateľský účet:
signup-password-mismatch = Heslá sa nezhodujú
signup-next = Ďalej

## Tunnel Setup Page

tunnel-setup-title = Nastavenie webovej adresy - { -webthings-gateway-brand }
tunnel-setup-welcome = Vitajte
tunnel-setup-choose-address = Vyberte zabezpečenú webovú adresu vašej gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdoména
tunnel-setup-email-opt-in = Informujte ma o novinkách o WebThings.
tunnel-setup-agree-privacy-policy = Vyjadrite súhlas so <a data-l10n-name="tunnel-setup-privacy-policy-link">zásadami ochrany súkromia</a> a <a data-l10n-name="tunnel-setup-tos-link">podmienkami používania</a> WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Token pre opätovné získanie
tunnel-setup-error = Pri nastavovaní subdomény nastala chyba.
tunnel-setup-create = Vytvoriť
tunnel-setup-skip = Preskočiť
tunnel-setup-time-sync = Čakanie na nastavenie systémových hodín z internetu. Registrácia domény pravdepodobne zlyhá, kým sa to nedokončí.

## Authorize Page

authorize-title = Žiadosť o autorizáciu - { -webthings-gateway-brand }
authorize-authorization-request = Žiadosť o autorizáciu
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = Používateľ <<name>> žiada o prístup k vašej gateway a zariadeniam <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = z <<domain>>
authorize-monitor-and-control = sledovanie a ovládanie
authorize-monitor = sledovanie
authorize-allow-all = Povoliť pre všetky veci
authorize-allow =
    .value = Povoliť
authorize-deny = Zakázať

## Local Token Page

local-token-title = Local Token Service - { -webthings-gateway-brand }
local-token-header = Local Token Service
local-token-your-token = Váš miestny token je <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Môžete ho použiť k bezpečnej komunikácii s gateway pomocou overenia typu <a data-l10n-name="local-token-bearer-type">Bearer</a>.
local-token-copy-token = Skopírovať token

## Router Setup Page

router-setup-title = Konfigurácia routeru - { -webthings-gateway-brand }
router-setup-header = Vytvoriť novú Wi-Fi sieť
router-setup-input-ssid =
    .placeholder = Názov siete
router-setup-input-password =
    .placeholder = Heslo
router-setup-input-confirm-password =
    .placeholder = Overenie hesla
router-setup-create =
    .value = Vytvoriť
router-setup-password-mismatch = Heslá sa musia zhodovať

## Wi-Fi Setup Page

wifi-setup-title = Nastavenie Wi-Fi - { -webthings-gateway-brand }
wifi-setup-header = Chcete sa pripojiť k Wi-Fi sieti?
wifi-setup-input-password =
    .placeholder = Heslo
wifi-setup-show-password = Zobraziť heslo
wifi-setup-connect =
    .value = Pripojiť
wifi-setup-network-icon =
    .alt = Wi-Fi sieť
wifi-setup-skip = Preskočiť

## Connecting to Wi-Fi Page

connecting-title = Prebieha pripojenie k Wi-Fi - { -webthings-gateway-brand }
connecting-header = Prebieha pripojenie k Wi-Fi…
connecting-connect = Uistite sa, že ste pripojený k rovnakej sieti a prejdite na adresu { $gateway-link } vo vašom prehliadači a pokračujte v nastavovaní.
connecting-warning = Poznámka: Pokiaľ sa vám nedarí načítať { $domain }, vyhľadajte IP adresu gateway vo vašom routery.
connecting-header-skipped = Nastavenie Wi-Fi bolo preskočené
connecting-skipped = Gateway je teraz spustená. Pripojte sa k rovnakej sieti a prejdite na { $gateway-link } pre pokračovanie v nastavení.

## Creating Wi-Fi Network Page

creating-title = Prebieha vytváranie Wi-Fi siete - { -webthings-gateway-brand }
creating-header = Prebieha vytváranie Wi-Fi siete...
creating-content = Pripojte sa k { $ssid } s heslom, ktoré ste práve vytvorili, prejdite na { $gateway-link } alebo { $ip-link } vo vašom prehliadači.

## UI Updates

ui-update-available = K dispozícii je aktualizované používateľské rozhranie.
ui-update-reload = Obnoviť
ui-update-close = Zavrieť

## Transfer to webthings.io

action-required-image =
    .alt = Upozornenie
action-required = Vyžaduje sa akcia:
action-required-more-info = Ďalšie informácie
action-required-dont-ask-again = Nabudúce sa už nepýtať
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-subdomain =
    .placeholder = Subdoména
transition-dialog-newsletter-label = Informujte ma o novinkách o WebThings.
transition-dialog-email =
    .placeholder = E-mailová adresa
transition-dialog-register-status =
    .alt = Stav registrácie
transition-dialog-register-label = Registrácia subdomény
transition-dialog-subscribe-status =
    .alt = Stav odberu noviniek
transition-dialog-subscribe-label = Prihlasovanie na odber noviniek

## General Terms

ok = Ok
ellipsis = …
event-log = Záznam udalostí
edit = Upraviť
remove = Odstrániť
disconnected = Odpojené
processing = Spracováva sa…
submit = Odoslať

## Top-Level Buttons

menu-button =
    .aria-label = Ponuka
back-button =
    .aria-label = Späť
overflow-button =
    .aria-label = Ďalšie akcie
submit-button =
    .aria-label = Odoslať
edit-button =
    .aria-label = Upraviť
save-button =
    .aria-label = Uložiť
