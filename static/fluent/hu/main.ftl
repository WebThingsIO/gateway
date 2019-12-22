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

assistant-menu-item = Segéd
things-menu-item = Dolgok
rules-menu-item = Szabályok
logs-menu-item = Naplók
floorplan-menu-item = Alaprajz
settings-menu-item = Beállítások
log-out-button = Kijelentkezés

## Things

thing-details =
    .aria-label = Tulajdonságok megtekintése
add-things =
    .aria-label = Új dolgok hozzáadása

## Assistant

assistant-avatar-image =
    .alt = Segéd avatárja
assistant-controls-text-input =
    .placeholder = Hogyan segíthetek?

## Floorplan

upload-floorplan = Alaprajz feltöltése…
upload-floorplan-hint = (.svg ajánlott)

## Top-Level Settings

settings-domain = Tartomány
settings-network = Hálózat
settings-users = Felhasználók
settings-add-ons = Kiegészítők
settings-adapters = Átalakítók
settings-localization = Honosítás
settings-updates = Frissítések
settings-authorizations = Engedélyek
settings-experiments = Kísérletek
settings-developer = Fejlesztő

## Domain Settings

domain-settings-local-label = Helyi hozzáférés
domain-settings-local-update = Gazdagép nevének frissítése
domain-settings-remote-access = Távoli hozzáférés
domain-settings-local-name =
    .placeholder = átjáró

## Network Settings

network-settings-unsupported = A hálózati beállítások nem támogatottak ennél a platformnál.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Otthoni hálózat
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Beállítás
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Üzemmód
network-settings-home-network-lan = Otthoni hálózat (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-cím
network-settings-dhcp = Automatikus (DHCP)
network-settings-static = Kézi (statikus IP)
network-settings-pppoe = Híd (PPPoE)
network-settings-static-ip-address = Statikus IP-cím
network-settings-network-mask = Hálózati maszk
network-settings-gateway = Átjáró
network-settings-done = Kész
network-settings-wifi-password =
    .placeholder = Jelszó
network-settings-show-password = Jelszó megjelenítése
network-settings-connect = Kapcsolódás
network-settings-username = Felhasználónév
network-settings-password = Jelszó
network-settings-router-ip = Router IP-címe
network-settings-dhcp-server = DHCP-kiszolgáló
network-settings-enable-wifi = Wi-Fi engedélyezése
network-settings-network-name = Hálózat neve (SSID)
wireless-connected = Kapcsolódva
wireless-icon =
    .alt = Wi-Fi hálózat
network-settings-changing = Hálózati beállítások megváltoztatása. Ez eltarthat egy percig.
failed-ethernet-configure = Az ethernet beállítása sikertelen.
failed-wifi-configure = A Wi-Fi beállítása sikertelen.
failed-wan-configure = A WAN beállítása sikertelen.
failed-lan-configure = A LAN beállítása sikertelen.
failed-wlan-configure = A WLAN beállítása sikertelen.

## User Settings

create-user =
    .aria-label = Új felhasználó hozzáadása
user-settings-input-name =
    .placeholder = Név
user-settings-input-email =
    .placeholder = E-mail
user-settings-input-password =
    .placeholder = Jelszó
user-settings-input-new-password =
    .placeholder = Új jelszó (nem kötelező)
user-settings-input-confirm-new-password =
    .placeholder = Új jelszó megerősítése
user-settings-input-confirm-password =
    .placeholder = Jelszó megerősítése
user-settings-password-mismatch = A jelszavak nem egyeznek
user-settings-save = Mentés

## Adapter Settings

adapter-settings-no-adapters = Nincsenek átalakítók.

## Authorization Settings

authorization-settings-no-authorizations = Nincsenek engedélyek.

## Experiment Settings

experiment-settings-smart-assistant = Okos segéd
experiment-settings-logs = Naplók

## Localization Settings

localization-settings-language-region = Nyelv és régió
localization-settings-country = Ország
localization-settings-timezone = Időzóna
localization-settings-language = Nyelv
localization-settings-units = Egységek
localization-settings-units-temperature = Hőmérséklet
localization-settings-units-temperature-celsius = Celsius (° C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (° F)

## Update Settings

update-settings-update-now = Frissítés most
update-available = Új verzió érhető el
update-up-to-date = A rendszer naprakész
updates-not-supported = A frissítések nem támogatottak ezen a platformon.
update-settings-enable-self-updates = Automatikus frissítések engedélyezése
last-update = Legutóbbi frissítés
current-version = Jelenlegi verzió
failed = Sikertelen
never = Soha
in-progress = Folyamatban
restarting = Újraindítás

## Developer Settings

developer-settings-enable-ssh = SSH engedélyezése
developer-settings-view-internal-logs = Belső naplók megtekintése
developer-settings-create-local-authorization = Helyi engedély létrehozása

## Rules

add-rule =
    .aria-label = Új szabály létrehozása
rules = Szabályok
rules-create-rule-hint = Nincsenek szabályok létrehozva. Kattintson a + gombra egy szabály létrehozásához.
rules-rule-name = Szabály neve
rules-customize-rule-name-icon =
    .alt = Szabálynév testreszabása
rules-rule-description = Szabály leírása
rules-preview-button =
    .alt = Előnézet
rules-delete-icon =
    .alt = Törlés
rules-drag-hint = Húzza ide az eszközeit, hogy új szabályt hozzon létre
rules-drag-input-hint = Eszköz hozzáadása bemenetként
rules-drag-output-hint = Eszköz hozzáadása kimenetként
rules-scroll-left =
    .alt = Görgetés balra
rules-scroll-right =
    .alt = Görgetés jobbra
rules-delete-prompt = Ejtsen ide eszközöket a kapcsolat bontásához
rules-delete-dialog = Biztos, hogy véglegesen törli ezt a szabályt?
rules-delete-cancel =
    .value = Mégse
rules-delete-confirm =
    .value = Szabály eltávolítása
rule-invalid = Érvénytelen
rule-delete-prompt = Biztos, hogy véglegesen törli ezt a szabályt?
rule-delete-cancel-button =
    .value = Mégse
rule-delete-confirm-button =
    .value = Szabály eltávolítása
rule-select-property = Válasszon tulajdonságot
rule-not = Nem
rule-event = Esemény
rule-action = Művelet
rule-configure = Beállítás…
rule-time-title = Napszak
rule-notification = Értesítés
notification-title = Cím
notification-message = Üzenet
notification-level = Szint
notification-low = Alacsony
notification-normal = Normál
notification-high = Magas
rule-name = Szabály neve

## Logs

add-log =
    .aria-label = Új napló létrehozása
logs = Naplók
logs-create-log-hint = Nincsenek naplók létrehozva. Kattintson a + gombra egy napló létrehozásához.
logs-device = Eszköz
logs-device-select =
    .aria-label = Naplóeszköz
logs-property = Tulajdonság
logs-property-select =
    .aria-label = Naplótulajdonság
logs-retention = Megőrzés
logs-retention-length =
    .aria-label = Naplómegőrzés hossza
logs-retention-unit =
    .aria-label = Naplómegőrzős egysége
logs-hours = óra
logs-days = nap
logs-weeks = hét
logs-save = Mentés
logs-remove-dialog-title = Eltávolítás
logs-remove-dialog-warning = A napló eltávolítása az összes adatot is törli. Biztos, hogy el akarja távolítani?
logs-remove = Eltávolítás
logs-unable-to-create = A napló nem hozható létre
logs-server-remove-error = Kiszolgálóhiba: a napló nem távolítható el

## Add New Things

add-thing-scanning-icon =
    .alt = Keresés
add-thing-scanning = Új eszközök keresése…
add-thing-add-adapters-hint = Nem találhatók új dolgok. Próbáljon <a data-l10n-name="add-thing-add-adapters-hint-anchor">hozzáadni néhány kiegészítőt</a>.
add-thing-add-by-url = Hozzáadás URL alapján…
add-thing-done = Kész
add-thing-cancel = Mégse

## Context Menu

context-menu-choose-icon = Válasszon ikont…
context-menu-save = Mentés
context-menu-remove = Eltávolítás

## Capabilities

OnOffSwitch = Be/ki kapcsoló
MultiLevelSwitch = Többszintű kapcsoló
ColorControl = Színvezérlés
ColorSensor = Színérzékelő
EnergyMonitor = Energiafigyelő
BinarySensor = Bináris érzékelő
MultiLevelSensor = Többszintű érzékelő
SmartPlug = Okos csatlakozó
Light = Fény
DoorSensor = Ajtóérzékelő
MotionSensor = Mozgásérzékelő
LeakSensor = Szivárgásérzékelő
PushButton = Nyomógomb
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Hőmérséklet-érzékelő
Alarm = Riasztó
Thermostat = Hőszabályozó
Lock = Zár
Custom = Egyéni dolog
Thing = Dolog

## Properties

alarm = Riasztó
pushed = Megnyomott
not-pushed = Nincs megnyomva
on-off = Be/ki
on = Be
off = Ki
power = Teljesítmény
voltage = Feszültség
temperature = Hőmérséklet
current = Jelenlegi
frequency = Frekvencia
color = Szín
brightness = Fényerő
leak = Szivárgás
dry = Száraz
color-temperature = Színhőmérséklet
video-unsupported = Sajnáljuk, a böngésző nem támogatja a videót.
motion = Mozgás
no-motion = Nincs mozgás
open = Nyitott
closed = Zárt
locked = Zárt
unlocked = Nyitott
jammed = Elakadt
unknown = Ismeretlen
active = Aktív
inactive = Inaktív

## Domain Setup

tunnel-setup-reclaim-domain = Úgy látszik, hogy már regisztrálta ezt az altartományt. A visszavételhez <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">kattintson ide</a>.
check-email-for-token = Ellenőrizze a leveleit, hogy megérkezett a visszaszerzési token, és illessze be fent.
reclaim-failed = A tartomány nem szerezhető vissza.
subdomain-already-used = Ez az altartomány már használatban van. Válasszon egy másikat.
invalid-reclamation-token = Érvénytelen visszaszerzési token.
domain-success = Sikeres! Várjon amíg átirányítjuk…
issuing-error = Hiba a tanúsítvány kiállításakor. Próbálja újra.
redirecting = Átirányítás…

## Booleans

true = Igaz
false = Hamis

## Time

utils-now = most
utils-seconds-ago =
    { $value ->
        [one] { $value } másodperce
       *[other] { $value } másodperce
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } perce
       *[other] { $value } perce
    }
utils-hours-ago =
    { $value ->
        [one] { $value } órája
       *[other] { $value } órája
    }
utils-days-ago =
    { $value ->
        [one] { $value } napja
       *[other] { $value } napja
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } hete
       *[other] { $value } hete
    }
utils-months-ago =
    { $value ->
        [one] { $value } hónapja
       *[other] { $value } hónapja
    }
utils-years-ago =
    { $value ->
        [one] { $value } éve
       *[other] { $value } éve
    }
minute = Perc
hour = Óra
day = Nap
week = Hét

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
abbrev-day = n
abbrev-hour = ó
abbrev-minute = p
abbrev-second = mp
abbrev-millisecond = ms
abbrev-foot = láb

## New Thing View

unknown-device-type = Ismeretlen eszköztípus
new-thing-choose-icon = Válasszon ikont…
new-thing-save = Mentés
new-thing-pin =
    .placeholder = Adja meg PIN-kódját
new-thing-pin-error = Helytelen PIN-kód
new-thing-pin-invalid = Érvénytelen PIN-kód
new-thing-cancel = Mégse
new-thing-submit = Beküldés
new-thing-username =
    .placeholder = Adja meg a felhasználónevet
new-thing-password =
    .placeholder = Adja meg a jelszót
new-thing-credentials-error = Helytelen hitelesítő adatok
new-thing-saved = Mentve
new-thing-done = Kész

## New Web Thing View

new-web-thing-url =
    .placeholder = Adja meg a webes dolog URL-jét

## Empty div Messages


## Add-on Settings


## Page Titles


## Speech


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


## General Terms


## Top-Level Buttons

