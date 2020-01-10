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

assistant-menu-item = Asistent
things-menu-item = Věci
rules-menu-item = Pravidla
logs-menu-item = Protokoly
floorplan-menu-item = Půdorys
settings-menu-item = Nastavení
log-out-button = Odhlásit se

## Things

thing-details =
    .aria-label = Zobrazit vlastnosti
add-things =
    .aria-label = Přidat nové věci

## Assistant

assistant-avatar-image =
    .alt = Obrázek asistenta
assistant-controls-text-input =
    .placeholder = Jak vám mohu pomoci?

## Floorplan

upload-floorplan = Nahrát půdorys…
upload-floorplan-hint = (.svg doporučeno)

## Top-Level Settings

settings-domain = Doména
settings-network = Síť
settings-users = Uživatelé
settings-add-ons = Doplňky
settings-adapters = Adaptéry
settings-localization = Lokalizace
settings-updates = Aktualizace
settings-authorizations = Oprávnění
settings-experiments = Experimenty
settings-developer = Vývojář

## Domain Settings

domain-settings-local-label = Místní přístup
domain-settings-local-update = Změnit název hostitele
domain-settings-remote-access = Vzdálený přístup
domain-settings-local-name =
    .placeholder = brána

## Network Settings

network-settings-unsupported = Nastavení sítě není na této platformě podporováno.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Domácí síť
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Nastavit
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Režim
network-settings-home-network-lan = Domácí síť (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP adresa
network-settings-dhcp = Automaticky (DHCP)
network-settings-static = Ručně (statická IP)
network-settings-pppoe = Most (PPPoE)
network-settings-static-ip-address = Statická IP adresa
network-settings-network-mask = Maska sítě
network-settings-gateway = Gateway
network-settings-done = Hotovo
network-settings-wifi-password =
    .placeholder = Heslo
network-settings-show-password = Zobrazit heslo
network-settings-connect = Připojit
network-settings-username = Uživatelské jméno
network-settings-password = Heslo
network-settings-router-ip = IP adresa routeru
network-settings-dhcp-server = DHCP server
network-settings-enable-wifi = Povolit Wi-Fi
network-settings-network-name = Název sítě (SSID)
wireless-connected = Připojeno
wireless-icon =
    .alt = Síť Wi-Fi
network-settings-changing = Probíhá změna nastavení sítě. Může to chvíli trvat.
failed-ethernet-configure = Konfigurace ethernetu se nezdařila.
failed-wifi-configure = Konfigurace Wi-Fi se nezdařila.
failed-wan-configure = Konfigurace WAN se nezdařila.
failed-lan-configure = Konfigurace LAN se nezdařila.
failed-wlan-configure = Konfigurace WLAN se nezdařila.

## User Settings

create-user =
    .aria-label = Přidat nového uživatele
user-settings-input-name =
    .placeholder = Jméno
user-settings-input-email =
    .placeholder = E-mail
user-settings-input-password =
    .placeholder = Heslo
user-settings-input-new-password =
    .placeholder = Nové heslo (volitelné)
user-settings-input-confirm-new-password =
    .placeholder = Potvrdit nové heslo
user-settings-input-confirm-password =
    .placeholder = Potvrdit heslo
user-settings-password-mismatch = Hesla se neshodují
user-settings-save = Uložit

## Adapter Settings

adapter-settings-no-adapters = Nejsou k dispozici žádné adaptéry.

## Authorization Settings

authorization-settings-no-authorizations = Žádná oprávnění.

## Experiment Settings

experiment-settings-smart-assistant = Chytrý asistent
experiment-settings-logs = Protokoly

## Localization Settings

localization-settings-language-region = Jazyk a region
localization-settings-country = Země
localization-settings-timezone = Časové pásmo
localization-settings-language = Jazyk
localization-settings-units = Jednotky
localization-settings-units-temperature = Teplota
localization-settings-units-temperature-celsius = stupně Celsia (°C)
localization-settings-units-temperature-fahrenheit = stupně Fahrenheita (°F)

## Update Settings

update-settings-update-now = Aktualizovat nyní
update-available = Je dostupná nová verze
update-up-to-date = Váš systém je aktuální
updates-not-supported = Instalace aktualizací není na této platformě podporována.
update-settings-enable-self-updates = Povolit automatické aktualizace
last-update = Poslední aktualizace
current-version = Současná verze
failed = Nezdařilo se
never = Nikdy
in-progress = Probíhá
restarting = Restartuje se

## Developer Settings

developer-settings-enable-ssh = Povolit SSH
developer-settings-view-internal-logs = Zobrazit interní protokoly
developer-settings-create-local-authorization = Vytvořit místní oprávnění

## Rules

add-rule =
    .aria-label = Vytvořit nové pravidlo
rules = Pravidla
rules-create-rule-hint = Nebyla vytvořena žádná pravidla. Klepnutím na + můžete nějaké vytvořit.
rules-rule-name = Název pravidla
rules-customize-rule-name-icon =
    .alt = Přejmenovat pravidlo
rules-rule-description = Popis pravidla
rules-preview-button =
    .alt = Náhled
rules-delete-icon =
    .alt = Odstranit
rules-drag-hint = Přetažením zařízení sem začněte vytvářet pravidlo
rules-drag-input-hint = Přidat zařízení jako vstup
rules-drag-output-hint = Přidat zařízení jako výstup
rules-scroll-left =
    .alt = Posunout doleva
rules-scroll-right =
    .alt = Posunout doprava
rules-delete-prompt = Přetažením zařízení sem jej odpojíte
rules-delete-dialog = Opravdu chcete toto pravidlo navždy odstranit?
rules-delete-cancel =
    .value = Zrušit
rules-delete-confirm =
    .value = Odstranit pravidlo
rule-invalid = Neplatné
rule-delete-prompt = Opravdu chcete toto pravidlo navždy odstranit?
rule-delete-cancel-button =
    .value = Zrušit
rule-delete-confirm-button =
    .value = Odstranit pravidlo
rule-select-property = Vyberte vlastnost
rule-not = Ne
rule-event = Událost
rule-action = Akce
rule-configure = Nastavení…
rule-time-title = Denní doba
rule-notification = Oznámení
notification-title = Název
notification-message = Zpráva
notification-level = Úroveň
notification-low = Nízká
notification-normal = Normální
notification-high = Vysoká
rule-name = Název pravidla

## Logs

add-log =
    .aria-label = Vytvořit nový protokol
logs = Protokoly
logs-create-log-hint = Nebyly vytvořeny žádné záznamy. Klepnutím na + můžete nějaké vytvořit.
logs-device = Zařízení
logs-device-select =
    .aria-label = Protokol zařízení
logs-property = Vlastnost
logs-property-select =
    .aria-label = Vlastnosti protokolu
logs-retention = Uchovávání informací
logs-retention-length =
    .aria-label = Doba uchovávání protokolu
logs-retention-unit =
    .aria-label = Jednotka uchovávání protokolu
logs-hours = Hodiny
logs-days = Dny
logs-weeks = Týdny
logs-save = Uložit
logs-remove-dialog-title = Mazání
logs-remove-dialog-warning = Smazáním protokolu se odstraní také všechna jeho data. Opravdu ho chcete smazat?
logs-remove = Smazat
logs-unable-to-create = Protokol nelze vytvořit
logs-server-remove-error = Chyba serveru: protokol nelze smazat

## Add New Things

add-thing-scanning-icon =
    .alt = Prohledávání
add-thing-scanning = Hledání nových zařízení…
add-thing-add-adapters-hint = Nebyly nalezeny žádné nové věci. Zkuste <a data-l10n-name="add-thing-add-adapters-hint-anchor">přidat nějaké doplňky</a>.
add-thing-add-by-url = Přidat zadáním URL…
add-thing-done = Hotovo
add-thing-cancel = Zrušit

## Context Menu

context-menu-choose-icon = Vyberte ikonu…
context-menu-save = Uložit
context-menu-remove = Odstranit

## Capabilities

OnOffSwitch = Vypínač
MultiLevelSwitch = Víceúrovňový přepínač
ColorSensor = Senzor barev
EnergyMonitor = Monitor energie
BinarySensor = Binární senzor
MultiLevelSensor = Víceúrovňový senzor
SmartPlug = Chytrá zástrčka
Light = Světlo
DoorSensor = Senzor dveří
MotionSensor = Pohybový senzor
LeakSensor = Senzor úniku
PushButton = Tlačítko
VideoCamera = Videokamera
Camera = Fotoaparát
TemperatureSensor = Teploměr
Alarm = Budík
Thermostat = Termostat
Lock = Zámek
Custom = Vlastní věc
Thing = Věc

## Properties

alarm = Budík
pushed = Zmáčknuto
not-pushed = Není zmáčknuto
on-off = Zapnuto/Vypnuto
on = Zapnuto
off = Vypnuto
power = Napájení
voltage = Napětí
temperature = Teplota
current = Proud
frequency = Frekvence
color = Barva
brightness = Jas
leak = Únik
dry = Suché
color-temperature = Teplota barvy
video-unsupported = Litujeme, video ve vašem prohlížeči není podporováno.
motion = Pohyb
no-motion = Žádný pohyb
open = Otevřené
closed = Zavřené
locked = Zamčené
unlocked = Odemčené
jammed = Zaseknuté
unknown = Neznámý
active = Aktivní
inactive = Neaktivní

## Domain Setup

tunnel-setup-reclaim-domain = Vypadá to, že jste tuto subdoménu již zaregistrovali. Chcete-li ji získat zpět, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here"> klepněte sem</a>.
check-email-for-token = Podívejte se do své schránky po zaslaném tokenu pro získání přístupu a vložte jej výše.
reclaim-failed = Doménu nelze získat zpět.
subdomain-already-used = Tato subdoména je již používána. Zvolte prosím jinou.
invalid-subdomain = Neplatná subdoména.
invalid-reclamation-token = Neplatný token pro získání přístupu.
domain-success = Podařilo se! Počkejte prosím, až vás přesměrujeme…
issuing-error = Chyba při vydávání certifikátu. Zkuste to znovu.
redirecting = Probíhá přesměrování…

## Booleans

true = Pravda
false = Nepravda

## Time

utils-now = teď
utils-seconds-ago =
    { $value ->
        [one] před jednou sekundou
        [few] před { $value } sekundami
       *[other] před { $value } sekundami
    }
utils-minutes-ago =
    { $value ->
        [one] před minutou
        [few] před { $value } minutami
       *[other] před { $value } minutami
    }
utils-hours-ago =
    { $value ->
        [one] před hodinou
        [few] před { $value } hodinami
       *[other] před { $value } hodinami
    }
utils-days-ago =
    { $value ->
        [one] před jedním dnem
        [few] před { $value } dny
       *[other] před { $value } dny
    }
utils-weeks-ago =
    { $value ->
        [one] před týdnem
        [few] před { $value } týdny
       *[other] před { $value } týdny
    }
utils-months-ago =
    { $value ->
        [one] před měsícem
        [few] před { $value } měsíci
       *[other] před { $value } měsíci
    }
utils-years-ago =
    { $value ->
        [one] před rokem
        [few] před { $value } lety
       *[other] před { $value } lety
    }
minute = Minuta
hour = Hodina
day = Den
week = Týden

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

unknown-device-type = Neznámý typ zařízení
new-thing-choose-icon = Vyberte ikonu…
new-thing-save = Uložit
new-thing-pin =
    .placeholder = Zadejte PIN
new-thing-pin-error = Nesprávný PIN
new-thing-pin-invalid = Neplatný PIN
new-thing-cancel = Zrušit
new-thing-submit = Odeslat
new-thing-username =
    .placeholder = Zadejte uživatelské jméno
new-thing-password =
    .placeholder = Zadejte heslo
new-thing-credentials-error = Nesprávné přihlašovací údaje
new-thing-saved = Uloženo
new-thing-done = Hotovo

## New Web Thing View

new-web-thing-url =
    .placeholder = Zadejte URL věci
new-web-thing-label = Webová věc
loading = Načítání…
new-web-thing-multiple = Bylo nalezeno více webových věcí
new-web-thing-from = od

## Empty div Messages

no-things = Zatím žádná zařízení. Kepnutím na + vyhledáte dostupná zařízení.
thing-not-found = Věc nebyla nalezena.
action-not-found = Akce nebyla nalezena.
events-not-found = Tato věc nemá žádné události.

## Add-on Settings

add-addons =
    .aria-label = Najít nové doplňky
disable = Zakázat
enable = Povolit
by = od
addon-update = Aktualizovat
addon-remove = Odebrat
addon-updating = Probíhá aktualizace…
addon-updated = Aktualizováno
addon-update-failed = Selhalo
addon-config-apply = Použít
addon-discovery-added = Přidáno
addon-discovery-add = Přidat
addon-discovery-failed = Selhalo

## Page Titles

settings = Nastavení
domain = Doména
users = Uživatelé
edit-user = Upravit uživatele
add-user = Přidat uživatele
adapters = Adaptéry
addons = Doplňky
addon-config = Konfigurovat doplněk
addon-discovery = Objevte nové doplňky
experiments = Experimenty
localization = Lokalizace
updates = Aktualizace
authorizations = Oprávnění
developer = Vývojář
network = Síť
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikona

## Speech

speech-didnt-get = Promiňte, nerozumím.

## Errors

unknown-state = Neznámý stav.
error = Chyba
errors = Chyby
more-information = Více informací
invalid-file = Neplatný soubor.
failed-read-file = Při čtení souboru nastala chyba.
failed-save = Při ukládání souboru nastala chyba.

## Schema Form

unsupported-field = Nepodporované schéma pole

## Icon Sources

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Přihlášení - { -webthings-gateway-brand }
login-log-in = Přihlášení

## Create First User Page

signup-welcome = Vítejte
signup-create-account = Vytvořte svůj první uživatelský účet:
signup-password-mismatch = Hesla se neshodují
signup-next = Další

## Tunnel Setup Page

tunnel-setup-welcome = Vítejte
tunnel-setup-choose-address = Vyberte zabezpečenou webovou adresu vaší gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdoména
tunnel-setup-error = Při nastavování subdomény došlo k chybě.
tunnel-setup-create = Vytvořit
tunnel-setup-skip = Přeskočit
tunnel-setup-time-sync = Čekání na nastavení systémových hodin z internetu. Registrace domény pravděpodobně selže, dokud se toto nedokončí.

## Authorize Page

# Use <<domain>> to indicate where the domain should be placed
authorize-source = z <<domain>>
authorize-monitor-and-control = monitor a ovládání
authorize-monitor = monitor
authorize-allow-all = Povolit pro všechny věci
authorize-allow =
    .value = Povolit

## Local Token Page

local-token-title = Local Token Service - { -webthings-gateway-brand }

## Router Setup Page

router-setup-title = Nastavení routeru - { -webthings-gateway-brand }
router-setup-input-ssid =
    .placeholder = Název sítě
router-setup-input-password =
    .placeholder = Heslo
router-setup-create =
    .value = Vytvořit
router-setup-password-mismatch = Heslo se musí shodovat

## Wi-Fi Setup Page

wifi-setup-title = Nastavení Wi-Fi - { -webthings-gateway-brand }
wifi-setup-header = Chcete se připojit k síti Wi-Fi?
wifi-setup-input-password =
    .placeholder = Heslo
wifi-setup-show-password = Ukázat heslo
wifi-setup-connect =
    .value = Připojit
wifi-setup-network-icon =
    .alt = Síť Wi-Fi
wifi-setup-skip = Přeskočit

## Connecting to Wi-Fi Page

connecting-title = Připojení k Wi-Fi - { -webthings-gateway-brand }
connecting-connect = Ujistěte se, že jste připojeni ke stejné síti, a poté ve webovém prohlížeči přejděte na adresu { $gateway-link } a pokračujte v nastavování.
connecting-warning = Poznámka: Pokud se vám nedaří načíst doménu { $domain }, vyhledejte na routeru IP adresu gateway.
connecting-header-skipped = Nastavení Wi-Fi přeskočeno

## Creating Wi-Fi Network Page

creating-title = Vytváření sítě Wi-Fi - { -webthings-gateway-brand }
creating-header = Vytváření sítě Wi-Fi…
creating-content = Připojte se k { $ssid } pomocí hesla, které jste právě vytvořili, a potom ve webovém prohlížeči přejděte na { $gateway-link } nebo { $ip-link }.

## General Terms

ok = Ok
ellipsis = …
edit = Upravit
remove = Odebrat
disconnected = Odpojeno
submit = Odeslat

## Top-Level Buttons

menu-button =
    .aria-label = Nabídka
back-button =
    .aria-label = Zpět
overflow-button =
    .aria-label = Další akce
speech-button =
    .aria-label = Poslouchat řeč
submit-button =
    .aria-label = Odeslat
save-button =
    .aria-label = Uložit
