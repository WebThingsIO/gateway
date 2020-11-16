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

things-menu-item = Tiɣawsiwin
rules-menu-item = Ilugan
logs-menu-item = Aɣmis
floorplan-menu-item = Aɣawas n uswir
settings-menu-item = Iɣewwaṛen
log-out-button = Ffeɣ

## Things

thing-details =
    .aria-label = Timezliyin n tsekant
add-things =
    .aria-label = Rnu taɣawsa tamaynut

## Floorplan

upload-floorplan = Azen aɣawa n uswir…
upload-floorplan-hint = (.svg d awelleh)

## Top-Level Settings

settings-domain = Taɣult
settings-network = Aẓeṭṭa
settings-users = Iseqdacen
settings-add-ons = Izegrar
settings-adapters = Imserwasen
settings-localization = Asideg
settings-updates = Leqqem
settings-authorizations = Tisirag
settings-experiments = Tisermiyin
settings-developer = Aneflay

## Domain Settings

domain-settings-local-label = Anekcum adigan
domain-settings-local-update = Beddel isem n usenneftaɣ
domain-settings-remote-access = Anekcum anmeggag
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Iɣewwaṛen n uzeṭṭa ur ttwasefraken ara deg unagraw-a.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Azeṭṭa n uxxam
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Swel
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Askar
network-settings-home-network-lan = Azeṭṭa n uxxam (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Tansa IP
network-settings-dhcp = (DHCP) Awurman
network-settings-static = S ufus (IP usbiḍ)
network-settings-pppoe = Tiqenṭert (PPPoE)
network-settings-static-ip-address = Tansa IP tubiḍt
network-settings-network-mask = Tagelmust n uzeṭṭa
network-settings-gateway = Tiqenṭert
network-settings-done = Immed
network-settings-wifi-password =
    .placeholder = Awal uffir
network-settings-show-password = Sken awal uffir
network-settings-connect = Qqen
network-settings-username = Isem n useqdac
network-settings-password = Awal uffir
network-settings-router-ip = Tansi IP n tmeglayt
network-settings-dhcp-server = Aqeddac DHCP
network-settings-enable-wifi = Rmed Wi-Fi
network-settings-network-name = Isem n uzeṭṭa (SSID)
wireless-connected = Iqqen
wireless-icon =
    .alt = Azeṭṭa Wi-Fi
network-settings-changing = Abeddel n yiɣewwaṛen n uzeṭṭa iteddu. Rǧu ma ulac aɣilif.
failed-ethernet-configure = Tawila n uzeṭṭa Ethernet tecceḍ.
failed-wifi-configure = Tawila n uzeṭṭa Wi-Fi tecceḍ.
failed-wan-configure = Tawila n uzeṭṭa WAN tecceḍ.
failed-lan-configure = Tawila n uzeṭṭa LAN tecceḍ.
failed-wlan-configure = Tawila n uzeṭṭa WLAN tecceḍ.

## User Settings

create-user =
    .aria-label = Rnu aseqdac amaynut
user-settings-input-name =
    .placeholder = Isem
user-settings-input-email =
    .placeholder = Imayl
user-settings-input-password =
    .placeholder = Awal uffir
user-settings-input-totp =
    .placeholder = Tangalt 2FA
user-settings-mfa-enable = Rmed asesteb s snat n tarrayin
user-settings-mfa-scan-code = Dumm-d tangalt-a s yal asnas n usesteb s snat n tarrayin.
user-settings-mfa-secret = Wagi d ajiṭun-ik uffir amaynut, ma yella tangalit-ik QR ddaw-a ur teddi ara:
user-settings-mfa-error = Tangalt n usesteb mačči d tameɣtut.
user-settings-mfa-enter-code = Sekcem tangalt n usnas-ik n usesteb ddaw-a.
user-settings-mfa-verify = Senqed
user-settings-mfa-regenerate-codes = Ales asirew n tengalin n uḥraz
user-settings-mfa-backup-codes = Tigi d tingalin n uḥraz. Yal yiwet ad tettwaseqdac yiwet n tikkelt kan. Ḥrez-iten deg umḍiq yettwaḍemnen.
user-settings-input-new-password =
    .placeholder = Awal uffir amaynut (asefran)
user-settings-input-confirm-new-password =
    .placeholder = Sentem awal uffir amaynut
user-settings-input-confirm-password =
    .placeholder = Sentem awal uffir
user-settings-password-mismatch = Awalen uffiren ur mṣadan ara
user-settings-save = Sekles

## Adapter Settings

adapter-settings-no-adapters = Ulac imserwasen yellan.

## Authorization Settings

authorization-settings-no-authorizations = Ulac tisirag.

## Experiment Settings

experiment-settings-no-experiments = Ulac tirmitin akka tura.

## Localization Settings

localization-settings-language-region = Tutlayt & Temnaḍt
localization-settings-country = Tamurt
localization-settings-timezone = Izḍi usrig
localization-settings-language = Tutlayt
localization-settings-units = Tayunin
localization-settings-units-temperature = Azɣal
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Leqqem tura
update-available = Lqem amaynut yella
update-up-to-date = Anagraw-ik yettwalqem.
updates-not-supported = Ileqman ur ttwasefraken ara deg unagraw-a.
update-settings-enable-self-updates = Rmed ileqman iwurmanen
last-update = Aleqqem aneggaru
current-version = Lqem amiran
failed = Ur yeddi ara
never = Weṛǧin
in-progress = Iteddu
restarting = Allus n usenker
checking-for-updates = Asenqed n ileqman…
failed-to-check-for-updates = Ur izmir ara ad inadi ileqman akka tura

## Developer Settings

developer-settings-enable-ssh = Rmed SSH
developer-settings-view-internal-logs = Wali iɣmisen idiganen
developer-settings-create-local-authorization = Rnu asesteb adigan

## Rules

add-rule =
    .aria-label = Rnu alugen amaynut
rules = Ilugan
rules-create-rule-hint = Ulac ilugan yettwarnan. Tekki ɣef + akken ad ternuḍ alugen.
rules-rule-name = Isem n ulugan
rules-customize-rule-name-icon =
    .alt = Mudd isem udmawan i ulugen
rules-rule-description = Aglam n ulugen
rules-preview-button =
    .alt = Taskant
rules-delete-icon =
    .alt = Kkes
rules-drag-hint = Zuɣer ibenkan ɣer dagi akken ad ternuḍ alugen
rules-drag-input-hint = Rnu ibenk n unekcum
rules-drag-output-hint = Rnu ibenk n tuffɣa
rules-scroll-left =
    .alt = Sedrurem s azelmaḍ
rules-scroll-right =
    .alt = Sedrurem s ayeffus
rules-delete-prompt = Zuɣer-d ibenkan ɣer dagi akken ad tesḥebseḍ tuqqna
rules-delete-dialog = S tidet tebɣiḍ ad tekkseḍ alugen-a s wudem imezgi?
rules-delete-cancel =
    .value = Sefsex
rules-delete-confirm =
    .value = Kkes alugen
rule-invalid = Arameɣtu
rule-delete-prompt = S tidet tebɣiḍ ad tekkseḍ alugen-a s wudem imezgi?
rule-delete-cancel-button =
    .value = Sefsex
rule-delete-confirm-button =
    .value = Kkes alugen
rule-select-property = Fren timeẓlit
rule-not = Uhu
rule-event = Tadyant
rule-action = Tigawt
rule-configure = Swel…
rule-time-title = Akud n wass
rule-notification = Alɣu
notification-title = Azwel
notification-message = Izen
notification-level = Aswir
notification-low = Meẓẓi
notification-normal = Amagnu
notification-high = Meqqer
rule-name = Isem n ulugan

## Logs

add-log =
    .aria-label = Rnu aɣmis amaynut
logs = Aɣmis
logs-create-log-hint = Ulac aɣmis yettwarnan. Tekki ɣef + akken ad ternuḍ aɣmis.
logs-device = Ibenk
logs-device-select =
    .aria-label = Ibenk n yiqmisen
logs-property = Taɣaṛa
logs-property-select =
    .aria-label = Timeẓlit n uɣmis
logs-retention = Tuṭṭfa
logs-retention-length =
    .aria-label = Tanzagt n tuṭṭfa n yiɣmisen
logs-retention-unit =
    .aria-label = Tayunt n tuṭṭfa n yiɣmisen
logs-hours = Isragen
logs-days = Ussan
logs-weeks = Dduṛtat
logs-save = Sekles
logs-remove-dialog-title = Tuksa
logs-remove-dialog-warning = Tukksa n uɣmis ad yekkes meṛṛa isefka-is. Tebɣiḍ s tidet ad tekkseḍ-t?
logs-remove = Kkes
logs-unable-to-create = UR izmir ara ad yernu aɣmis
logs-server-remove-error = Tuccḍa n uqeddac: ur izmir ara ad ikkes aɣmis

## Add New Things

add-thing-scanning-icon =
    .alt = Anadi
add-thing-scanning = Anadi n yibenkan imaynuten…
add-thing-add-adapters-hint = Ulac amaynut. Ɛreḍ<a data-l10n-name="add-thing-add-adapters-hint-anchor">timerna n kra n yizegrar</a>.
add-thing-add-by-url = Rnu s tensa URL…
add-thing-done = Immed
add-thing-cancel = Sefsex

## Context Menu

context-menu-choose-icon = Fren tignit…
context-menu-save = Sekles
context-menu-remove = Kkes

## Capabilities

OnOffSwitch = Taqeffalt seddu/seḥbes
MultiLevelSwitch = Taqeffalt s ddeqs n yiswiren
ColorControl = Asefrek n yiniten
ColorSensor = Amaṭṭaf n yiniten
EnergyMonitor = Aqareɛ n ṣṣehd
BinarySensor = Amaṭṭaf imsin
MultiLevelSensor = Amaṭṭaf s ddeqs n yiswiren
SmartPlug = Taprizt
Light = Taftilt
DoorSensor = Amaṭṭaf n tewwurt
MotionSensor = Amaṭṭaf n uḥerrek
LeakSensor = Amaṭṭaf n trewla
PushButton = Taqeffalt n utteli awuran
VideoCamera = Takamirat n uvidyu
Camera = Takamiṛat
TemperatureSensor = Amaṭṭaf n lḥamu
HumiditySensor = Amaṭṭaf n tadawt
Alarm = Tangedwilt
Thermostat = Atirmusṭa
Lock = Leqfel
BarometricPressureSensor = Amaṭṭaf abyumitri n tussda
Custom = Taɣawsa tudmawant
Thing = Taɣawsa
AirQualitySensor = Amaṭṭaf n tɣara n uzwu

## Properties

alarm = Tangedwilt
pushed = Yettwasenned
not-pushed = UR yettwasenned ara
on-off = Irmed/Insa
on = Yermed
off = Yensa
power = Tazizmert
voltage = Tassist
temperature = Lḥamu
current = Aḍru
frequency = Asnagar
color = Ini
brightness = Asebrureq
leak = Tarewla
dry = Yekkaw
color-temperature = Lḥamu n yini
video-unsupported = Suref-aɣ, tavidyut ur tettwasefrak ara deg yiminig-ik.
motion = Aḥerrek
no-motion = Ulac aḥerrek
open = Yeldi
closed = Yemdel
locked = Isekkweṛ
unlocked = Iserreḥ
jammed = Yeččuṛ
unknown = Arussin
active = Urmid
inactive = Insa
humidity = Tadawt
concentration = Tasammest
density = Taneẓẓi

## Domain Setup

tunnel-setup-reclaim-domain = Yettban d akken teskelseḍ yakan taɣult-a tasnawant. Akken ad tsetred-t <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">tekki dagi</a>.
check-email-for-token = Ma ulac aɣilif wali tabwaḍt-ik n yiznan akken ad tawiḍ ajiṭun n usuter daɣen ad tsenteḍeḍ-t dagi.
reclaim-failed = Ur izmir ara ad isuter taɣult.
subdomain-already-used = Taɣult-a tasnawant tettwaseqdec yakan. Ma ulac aɣilif, fren tayeḍ.
invalid-subdomain = Yir taɣult tasnawant.
invalid-email = Yir tansa n yimayl.
invalid-reclamation-token = Yir ajiṭun n nusuter.
domain-success = Yedda! Ma ulac aɣilif, rǧu awelleh…
issuing-error = Ur izmir ara ad d-imudd aselkin. Ɛreḍ tikkelt-nniden.
redirecting = Awellhe iteddu…

## Booleans

true = Uzɣrin
false = Aruzɣin

## Time

utils-now = tura
utils-seconds-ago =
    { $value ->
        [one] { $value } n tasint aya
       *[other] { $value } n tasinin aya
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } n tesdat aya
       *[other] { $value } n tesdatin aya
    }
utils-hours-ago =
    { $value ->
        [one] { $value } n usrag aya
       *[other] { $value } n isragen aya
    }
utils-days-ago =
    { $value ->
        [one] { $value } n wass aya
       *[other] { $value } n wussan aya
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } n yimalas aya
       *[other] { $value } n yimalasen aya
    }
utils-months-ago =
    { $value ->
        [one] { $value } n waggur aaya
       *[other] { $value } n wagguren aaya
    }
utils-years-ago =
    { $value ->
        [one] { $value } n useggas aya
       *[other] { $value } n yiseggasen aya
    }
minute = Tasdat
hour = Asrag
day = Ass
week = Dduṛt

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
abbrev-day = s
abbrev-hour = r
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Anaw n yibenk d arussin
new-thing-choose-icon = Fren tignit…
new-thing-save = Sekles
new-thing-pin =
    .placeholder = Sekcem PIN
new-thing-pin-error = PIn arameɣtu
new-thing-pin-invalid = Yir PIN
new-thing-cancel = Sefsex
new-thing-submit = Azen
new-thing-username =
    .placeholder = Sekcem isem n useqdac
new-thing-password =
    .placeholder = Sekcem awal uffir
new-thing-credentials-error = Yir Inekcam
new-thing-saved = Yettwasekles
new-thing-done = Immed

## New Web Thing View

new-web-thing-url =
    .placeholder = Sekcem tansa URL n tɣawsa Web
new-web-thing-label = Taɣawsa Web
loading = Asali…
new-web-thing-multiple = Ddeqs n tɣawsiwin web i yettfwafen.
new-web-thing-from = seg

## Empty div Messages

no-things = Ulac ibenkan yakan. Tekki ɣef + akken ad tnadiḍ ibenkan yellan.
thing-not-found = Taɣawsa ur tettwaf ara.
action-not-found = Tigawt ur tettwaf ara.
events-not-found = Taɣawsa-a ur ɣur-s ara ineḍruyen.

## Add-on Settings

add-addons =
    .aria-label = Af-s izegrar imaynuten
author-unknown = Arussin
disable = Ssens
enable = Rmed
by = sγur
license = turagt
addon-configure = Swel
addon-update = Leqqem
addon-remove = Kkes
addon-updating = Aleqqem...
addon-updated = yettwalqem
addon-update-failed = Ur yeddi ara
addon-config-applying = Asnas…
addon-config-apply = Snes
addon-discovery-added = Yettwarna
addon-discovery-add = Rnu
addon-discovery-installing = Asebded…
addon-discovery-failed = Ur yeddi ara
addon-search =
    .placeholder = Nadi

## Page Titles

settings = Iɣewwaṛen
domain = Taɣult
users = Iseqdacen
edit-user = Ẓreg aseqdac
add-user = Rnu aseqdac
adapters = Imserwasen
addons = Izegrar
addon-config = Swel azegrir
addon-discovery = Issin izegrar imaynuten
experiments = Tisermiyin
localization = Asideg
updates = Leqqem
authorizations = Tisirag
developer = Aneflay
network = Aẓeṭṭa
ethernet = Ethernet
wifi = Wi-Fi
icon = Tignit

## Errors

unknown-state = Addad arussin.
error = Tuccḍa
errors = Tuccḍiwin
gateway-unreachable = Tiqenṭert ur tettwakcam ara
more-information = Ugar n telɣut
invalid-file = Yir afaylu.
failed-read-file = Ur yezmir ara ad iɣeṛ afaylu.
failed-save = Asekles ur yeddi ara.

## Schema Form

unsupported-field = Azenziɣ ur yettwasefrak ara

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Tuqqna — { -webthings-gateway-brand }
login-log-in = Qqen
login-wrong-credentials = Yir isem n useqdac neɣ wawal uffir.
login-wrong-totp = Tangalt n usesteb mačči d tameɣtut.
login-enter-totp = Sekcem tangalt seg usnas-ik n usesteb.

## Create First User Page

signup-title = Rnu aseqdac — { -webthings-gateway-brand }
signup-welcome = Ansuf
signup-create-account = Rnu amiḍan-ik amaynut:
signup-password-mismatch = Awalen uffiren ur mṣadan ara
signup-next = Ɣer zdat

## Tunnel Setup Page

tunnel-setup-title = Fren tansa web —{ -webthings-gateway-brand }
tunnel-setup-welcome = Ansuf
tunnel-setup-choose-address = Fren tansa web taɣelsant i tqenṭert-ik:
tunnel-setup-input-subdomain =
    .placeholder = taɣult tasnawant
tunnel-setup-input-reclamation-token =
    .placeholder = Ajiṭun n usuter
tunnel-setup-error = Teḍra-d tuccḍa deg tmerna n taɣult tasnawant.
tunnel-setup-create = Rnu
tunnel-setup-skip = Suref
tunnel-setup-time-sync = Araǧu n tuqqna i ubeddel n wakud n unagraw seg Internet. Asekles n taɣult izmer ur iteddu ara skud akud ur yettwalqem ara.

## Authorize Page

authorize-title = Asuter n tsiregt — { -webthings-gateway-brand }
authorize-authorization-request = Asuter n tsiregt
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> i bɣa ad yekcem ɣer tqenṭert-ik i <<function>> yibenkan.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = Seg <<domain>>
authorize-monitor-and-control = Qreɛ daɣen sefqed
authorize-monitor = qareɛ
authorize-allow-all = Sireg i yal taɣawsa
authorize-allow =
    .value = Sireg
authorize-deny = Gdel

## Local Token Page

local-token-title = Ameẓlu n ujiṭun adigan — { -webthings-gateway-brand }
local-token-header = Ameẓlu n ujitun adigan
local-token-your-token = Ajitun-ik adigan d wa <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Seqdec-it i teywalt akked tqenṭert-ik s wudem aɣelsan s <a data-l10n-name="local-token-bearer-type">Bearer-type Authorization</a>.
local-token-copy-token = Nɣel ajiṭun

## Router Setup Page

router-setup-title = Tawila n tmeglayt — { -webthings-gateway-brand }
router-setup-header = rnu azeṭṭa Wi-Fi amaynut
router-setup-input-ssid =
    .placeholder = Isem n uẓeṭṭa
router-setup-input-password =
    .placeholder = Awal uffir
router-setup-input-confirm-password =
    .placeholder = Sentem awal uffir
router-setup-create =
    .value = Rnu
router-setup-password-mismatch = Awalen uffiren yessefk ad mṣadan

## Wi-Fi Setup Page

wifi-setup-title = Tawila n Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Qqen ɣer uzeṭṭa Wi-Fi?
wifi-setup-input-password =
    .placeholder = Awal uffir
wifi-setup-show-password = Sken awal uffir
wifi-setup-connect =
    .value = Qqen
wifi-setup-network-icon =
    .alt = Aẓeṭṭa Wi-Fi
wifi-setup-skip = Suref

## Connecting to Wi-Fi Page

connecting-title = Tuqqna ɣer Wi-Fi — { -webthings-gateway-brand }
connecting-header = Tuqqna ɣer Wi-Fi…
connecting-connect = Ma ulac aɣilif ḍmen ma yella teqqneḍ ɣer yiwen-nni n uzeṭṭa, sakin inig ɣer { $gateway-link } s yiminig-ik web  akken ad tkemmleḍ tawila.
connecting-warning = Tamawt: Ma yella tremdeḍ asali n { $domain }, nadi tansa IP n tqeṭert n tmeglayt-ik.
connecting-header-skipped = Tawila n Wi-Fi tezgel
connecting-skipped = Tiqenṭert-a tekker akka tura. Qqim teqqneḍ ɣer yiwen-nni n uẓeṭṭa, sakin inig ɣer { $gateway-link } s yiminig-ik web akken ad tkemmleḍ tawila.

## Creating Wi-Fi Network Page

creating-title = Timerna n uzeṭṭa Wi-fi tetteddu — { -webthings-gateway-brand }
creating-header = Timerna n uzeṭṭa Wi-Fi tetteddu…
creating-content = Ma ulac aɣilif qqen ɣer uzeṭṭa { $ssid } s wawal uffir i terniḍ, sakin inig ɣer { $gateway-link } neɣ { $ip-link } deg yiminig-ik.

## UI Updates

ui-update-available = Agrudem n useqdac yettwaleqmen yella akka tura.
ui-update-reload = Smiren
ui-update-close = Mdel

## General Terms

ok = IH
ellipsis = …
event-log = Aɣmis n yineḍruyen
edit = Ẓreg
remove = Kkes
disconnected = Yeffeɣ
processing = Asesfer…
submit = Azen

## Top-Level Buttons

menu-button =
    .aria-label = Umuɣ
back-button =
    .aria-label = Ɣer deffir
overflow-button =
    .aria-label = Tiggawin nniḍen
submit-button =
    .aria-label = Azen
edit-button =
    .aria-label = Ẓreg
save-button =
    .aria-label = Sekles
