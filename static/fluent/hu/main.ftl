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

## Floorplan

upload-floorplan = Alaprajz feltöltése…
upload-floorplan-hint = (.svg ajánlott)

## Top-Level Settings

settings-domain = Domain
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
user-settings-input-totp =
    .placeholder = 2FA kód
user-settings-mfa-enable = Kétfaktoros hitelesítés engedélyezése
user-settings-mfa-scan-code = Olvassa le a következő kódot egy tetszőleges kétfaktoros hitelesítő alkalmazással
user-settings-mfa-secret = Ez az új TOTP titka, arra az esetre, ha a fenti QR-kód nem működne:
user-settings-mfa-error = A hitelesítési kód helytelen.
user-settings-mfa-enter-code = Írja be alább a hitelesítő alkalmazásból származó kódját.
user-settings-mfa-verify = Ellenőrzés
user-settings-mfa-regenerate-codes = Biztonsági kódok újra előállítása
user-settings-mfa-backup-codes = Ezek a biztonsági kódok. Mindegyiket csak egyszer lehet használni. Tartsa biztonságos helyen.
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

experiment-settings-no-experiments = Jelenleg nem érhető el kísérlet.

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
checking-for-updates = Frissítések keresése…
failed-to-check-for-updates = Jelenleg nem lehet ellenőrizni a frissítéseket.

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
HumiditySensor = Nedvességérzékelő
Alarm = Riasztó
Thermostat = Hőszabályozó
Lock = Zár
BarometricPressureSensor = Barometrikus nyomásérzékelő
Custom = Egyéni dolog
Thing = Dolog
AirQualitySensor = Levegőminőség érzékelő
SmokeSensor = Füstérzékelő

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
humidity = Páratartalom
concentration = Koncentráció
density = Sűrűség
smoke = Füst

## Domain Setup

tunnel-setup-reclaim-domain = Úgy látszik, hogy már regisztrálta ezt az aldomaint. A visszavételhez <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">kattintson ide</a>.
check-email-for-token = Ellenőrizze a leveleit, hogy megérkezett a visszaszerzési token, és illessze be fent.
reclaim-failed = A domain nem szerezhető vissza.
subdomain-already-used = Ez az aldomain már használatban van. Válasszon egy másikat.
invalid-subdomain = Érvénytelen aldomain.
invalid-email = Érvénytelen e-mail cím.
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
abbrev-micrograms-per-cubic-meter = µg / m³
abbrev-hectopascal = hPa

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
new-web-thing-label = Webes dolog
loading = Betöltés…
new-web-thing-multiple = Több webes dolog található
new-web-thing-from = ettől:

## Empty div Messages

no-things = Még nincsenek eszközök. Kattintson a + gombra az elérhető eszközök kereséséhez.
thing-not-found = A dolog nem található.
action-not-found = A művelet nem található.
events-not-found = Ennek a dolognak nincsenek eseményei.

## Add-on Settings

add-addons =
    .aria-label = Új kiegészítők keresése
author-unknown = Ismeretlen
disable = Letiltás
enable = Engedélyezés
by = szerző:
license = licenc
addon-configure = Beállítás
addon-update = Frissítés
addon-remove = Eltávolítás
addon-updating = Frissítés…
addon-updated = Frissítve
addon-update-failed = Sikertelen
addon-config-applying = Alkalmazás…
addon-config-apply = Alkalmaz
addon-discovery-added = Hozzáadva
addon-discovery-add = Hozzáadás
addon-discovery-installing = Telepítés…
addon-discovery-failed = Sikertelen
addon-search =
    .placeholder = Keresés

## Page Titles

settings = Beállítások
domain = Domain
users = Felhasználók
edit-user = Felhasználó szerkesztése
add-user = Felhasználó hozzáadása
adapters = Átalakítók
addons = Kiegészítők
addon-config = Kiegészítő beállítása
addon-discovery = Új kiegészítők felfedezése
experiments = Kísérletek
localization = Honosítás
updates = Frissítések
authorizations = Engedélyek
developer = Fejlesztő
network = Hálózat
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikon

## Errors

unknown-state = Ismeretlen állapot.
error = Hiba
errors = Hibák
gateway-unreachable = Az átjáró nem érhető el
more-information = További információ
invalid-file = Érvénytelen fájl.
failed-read-file = A fájl beolvasása sikertelen.
failed-save = A mentés sikertelen.

## Schema Form

unsupported-field = Nem támogatott mezőséma

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Bejelentkezés – { -webthings-gateway-brand }
login-log-in = Bejelentkezés
login-wrong-credentials = A felhasználónév vagy jelszó helytelen.
login-wrong-totp = A hitelesítési kód helytelen.
login-enter-totp = Írja be a hitelesítő alkalmazásból származó kódját.

## Create First User Page

signup-title = Felhasználó létrehozása – { -webthings-gateway-brand }
signup-welcome = Üdvözöljük
signup-create-account = Hozza létre első felhasználói fiókját:
signup-password-mismatch = A jelszavak nem egyeznek
signup-next = Tovább

## Tunnel Setup Page

tunnel-setup-title = Válasszon webcímet – { -webthings-gateway-brand }
tunnel-setup-welcome = Üdvözöljük
tunnel-setup-choose-address = Válasszon egy biztonságos webcímet az átjáróhoz:
tunnel-setup-input-subdomain =
    .placeholder = aldomain
tunnel-setup-email-opt-in = Tartson naprakészen a WebThingsről szóló hírekkel.
tunnel-setup-agree-privacy-policy = Fogadja el a WebThings <a data-l10n-name="tunnel-setup-privacy-policy-link">adatvédelmi irányelveit</a> és <a data-l10n-name="tunnel-setup-tos-link">szolgáltatási feltételeit</a>.
tunnel-setup-input-reclamation-token =
    .placeholder = Visszaszerzési token
tunnel-setup-error = Hiba történt az aldomain beállításakor.
tunnel-setup-create = Létrehozás
tunnel-setup-skip = Kihagyás
tunnel-setup-time-sync = Várakozás a rendszeróra internetről történő beállítására. A domain regisztráció valószínűleg sikertelen lesz addig, amíg ez nem fejeződik be.

## Authorize Page

authorize-title = Engedélyezési kérés – { -webthings-gateway-brand }
authorize-authorization-request = Engedélyezési kérés
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> hozzá akar férni az Ön átjárójához, hogy elérje a <<function>> eszközeit.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = innen: <<domain>>
authorize-monitor-and-control = monitorozó és vezérlő
authorize-monitor = monitorozó
authorize-allow-all = Engedélyezés az összes dolognál
authorize-allow =
    .value = Engedélyezés
authorize-deny = Tiltás

## Local Token Page

local-token-title = Helyi tokenszolgáltatás – { -webthings-gateway-brand }
local-token-header = Helyi tokenszolgáltatás
local-token-your-token = A helyi tokenje ez a <a data-l10n-name="local-token-jwt">JSON webtoken</a>:
local-token-use-it = Használja ezt az átjáróval való biztonságos beszélgetéshez, <a data-l10n-name="local-token-bearer-type">birtokos típusú felhatalmazással</a>.
local-token-copy-token = Token másolása

## Router Setup Page

router-setup-title = Router beállítás – { -webthings-gateway-brand }
router-setup-header = Új Wi-Fi hálózat létrehozása
router-setup-input-ssid =
    .placeholder = Hálózatnév
router-setup-input-password =
    .placeholder = Jelszó
router-setup-input-confirm-password =
    .placeholder = Jelszó megerősítése
router-setup-create =
    .value = Létrehozás
router-setup-password-mismatch = A jelszavaknak egyezniük kell

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi beállítás – { -webthings-gateway-brand }
wifi-setup-header = Kapcsolódik egy Wi-Fi hálózathoz?
wifi-setup-input-password =
    .placeholder = Jelszó
wifi-setup-show-password = Jelszó megjelenítése
wifi-setup-connect =
    .value = Kapcsolódás
wifi-setup-network-icon =
    .alt = Wi-Fi hálózat
wifi-setup-skip = Kihagyás

## Connecting to Wi-Fi Page

connecting-title = Kapcsolódás a Wi-Fi-hez – { -webthings-gateway-brand }
connecting-header = Kapcsolódás a Wi-Fi-hez…
connecting-connect = Győződjön meg róla, hogy ugyanahhoz a hálózathoz kapcsolódik, majd a beállítás folytatásához navigáljon ide a böngészőjében: { $gateway-link }.
connecting-warning = Megjegyzés: Ha nem tudja betölteni ezt: { $domain }, akkor keresse ki az átjáró IP-címét a routerén.
connecting-header-skipped = Wi-Fi beállítás kihagyva
connecting-skipped = Az átjáró most elindul. A beállítás folytatásához navigáljon ide a böngészőjében: { $gateway-link }, miközben az átjáróval azonos hálózathoz csatlakozik.

## Creating Wi-Fi Network Page

creating-title = Wi-Fi hálózat létrehozása – { -webthings-gateway-brand }
creating-header = Wi-Fi hálózat létrehozása…
creating-content = Kapcsolódjon a(z) { $ssid } hálózathoz a most létrehozott jelszóval, majd navigáljon a webböngészőjében ezek egyikére: { $gateway-link } vagy { $ip-link }.

## UI Updates

ui-update-available = Egy frissített felhasználói felület érhető el.
ui-update-reload = Újratöltés
ui-update-close = Bezárás

## Transfer to webthings.io

action-required-image =
    .alt = Figyelmeztetés
action-required = Művelet szükséges:
action-required-message = Megszűnik a Mozilla IoT távoli hozzáférési szolgáltatás és az automatikus szoftverfrissítés. Válasszon, hogy átköltözik-e a közösség által üzemeltetett webthings.io webhelyre a szolgáltatás folytatásához.
action-required-more-info = További információk
action-required-dont-ask-again = Ne kérdezze meg újra
action-required-choose = Válasszon
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = A Mozilla IoT távoli hozzáférési szolgáltatása és az automatikus szoftverfrissítései 2020. december 31.-ével megszűnik (<a data-l10n-name="transition-dialog-more-info">további információk</a>). A Mozilla átvezeti a szolgáltatást az új, közösség által üzemeltetett <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> weboldalra (nem áll kapcsolatban a Mozillával).<br><br>Ha többé nem akar szoftverfrissítéseket kapni a közösségi frissítési kiszolgálóktól, akkor letilthatja az automatikus frissítéseket a Beállításokban.<br><br>Ha át akarja állítani a mozilla-iot.org aldomainjét webthings.io-ra, akkor vagy új aldomaint regisztrálna, akkor töltse ki a lenti űrlapot, hogy regisztráljon a közösség által üzemeltetett távoli hozzáférési szolgáltatásra.
transition-dialog-register-domain-label = Regisztráljon a webthings.io távoli hozzáférési szolgáltatására
transition-dialog-subdomain =
    .placeholder = Aldomain
transition-dialog-newsletter-label = Tartson naprakészen a WebThingsről szóló hírekkel
transition-dialog-agree-tos-label = Fogadja el a WebThings <a data-l10n-name="transition-dialog-privacy-policy-link">adatvédelmi irányelveit</a> és <a data-l10n-name="transition-dialog-tos-link">szolgáltatási feltételeit</a>.
transition-dialog-email =
    .placeholder = E-mail-cím
transition-dialog-register =
    .value = Regisztráció
transition-dialog-register-status =
    .alt = Regisztráció állapota
transition-dialog-register-label = Aldomain regisztrációja
transition-dialog-subscribe-status =
    .alt = Hírlevél-feliratkozás állapota
transition-dialog-subscribe-label = Feliratkozás a hírlevélre
transition-dialog-error-generic = Hiba történt. Lépjen vissza, és próbálkozzon újra.
transition-dialog-error-subdomain-taken = A kiválasztott aldomain már foglalt. Ugorjon vissza, és válasszon másikat.
transition-dialog-error-subdomain-failed = Az aldomain regisztrációja sikertelen. Ugorjon vissza, és próbálkozzon újra.
transition-dialog-error-subscribe-failed = A hírlevélre feliratkozás sikertelen. Próbálja újra a <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a> címen.
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Navigálás ide a folytatáshoz: <<domain>>.

## General Terms

ok = Ok
ellipsis = …
event-log = Eseménynapló
edit = Szerkesztés
remove = Eltávolítás
disconnected = Kapcsolat bontva
processing = Feldolgozás…
submit = Elküldés

## Top-Level Buttons

menu-button =
    .aria-label = Menü
back-button =
    .aria-label = Vissza
overflow-button =
    .aria-label = További műveletek
submit-button =
    .aria-label = Elküldés
edit-button =
    .aria-label = Szerkesztés
save-button =
    .aria-label = Mentés
