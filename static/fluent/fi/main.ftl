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

things-menu-item = Esineet
rules-menu-item = Säännöt
logs-menu-item = Lokit
floorplan-menu-item = Pohjapiirros
settings-menu-item = Asetukset
log-out-button = Kirjaudu ulos

## Things

thing-details =
    .aria-label = Näytä ominaisuudet
add-things =
    .aria-label = Lisää uusia esineitä

## Floorplan

upload-floorplan = Lähetä pohjapiirros…
upload-floorplan-hint = (suositeltu tiedostomuoto on .svg)

## Top-Level Settings

settings-domain = Verkkotunnus
settings-network = Verkko
settings-users = Käyttäjät
settings-add-ons = Lisäosat
settings-adapters = Sovittimet
settings-localization = Lokalisointi
settings-updates = Päivitykset
settings-authorizations = Valtuudet
settings-experiments = Kokeilut
settings-developer = Kehittäjä

## Domain Settings

domain-settings-local-label = Paikallinen pääsy
domain-settings-local-update = Päivitä isäntänimi
domain-settings-remote-access = Etäyhteys
domain-settings-local-name =
    .placeholder = yhdyskäytävä

## Network Settings

network-settings-unsupported = Verkkoasetuksia ei tueta tässä ympäristössä.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Kotiverkko
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Määritä
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Tila
network-settings-home-network-lan = Kotiverkko (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-osoite
network-settings-dhcp = Automaattinen (DHCP)
network-settings-static = Manuaalinen (staattinen IP)
network-settings-pppoe = Siltaava (PPPoE)
network-settings-static-ip-address = Staattinen IP-osoite
network-settings-network-mask = Verkon peite
network-settings-gateway = Yhdyskäytävä
network-settings-done = Valmis
network-settings-wifi-password =
    .placeholder = Salasana
network-settings-show-password = Näytä salasana
network-settings-connect = Yhdistä
network-settings-username = Käyttäjänimi
network-settings-password = Salasana
network-settings-router-ip = Reitittimen IP-osoite
network-settings-dhcp-server = DHCP-palvelin
network-settings-enable-wifi = Ota Wi-Fi käyttöön
network-settings-network-name = Verkon nimi (SSID)
wireless-connected = Yhdistetty
wireless-icon =
    .alt = Wi-Fi-verkko
network-settings-changing = Muutetaan verkkoasetuksia. Tässä saattaa kestää hetki.
failed-ethernet-configure = Ethernetin määrittäminen epäonnistui.
failed-wifi-configure = Wi-Fin määrittäminen epäonnistui.
failed-wan-configure = WAN:in määrittäminen epäonnistui.
failed-lan-configure = LAN:in määrittäminen epäonnistui.
failed-wlan-configure = WLAN:in määrittäminen epäonnistui.

## User Settings

create-user =
    .aria-label = Lisää uusi käyttäjä
user-settings-input-name =
    .placeholder = Nimi
user-settings-input-email =
    .placeholder = Sähköposti
user-settings-input-password =
    .placeholder = Salasana
user-settings-input-totp =
    .placeholder = 2FA-koodi
user-settings-mfa-enable = Ota kaksivaiheinen vahvistus käyttöön
user-settings-mfa-scan-code = Skannaa seuraava koodi millä tahansa kaksivaiheisella todennussovelluksella.
user-settings-mfa-secret = Tämä on sinun uusi TOTP-salaisuutesi, mikäli yllä oleva QR-koodi ei toimi:
user-settings-mfa-error = Todennuskoodi oli väärä.
user-settings-mfa-enter-code = Kirjoita koodi todennussovelluksesta alle.
user-settings-mfa-verify = Vahvista
user-settings-mfa-regenerate-codes = Luo koodien varmuuskopiot uudelleen
user-settings-mfa-backup-codes = Nämä ovat varakoodisi. Jokaista voidaan käyttää vain kerran. Pidä ne turvallisessa paikassa.
user-settings-input-new-password =
    .placeholder = Uusi salasana (valinnainen)
user-settings-input-confirm-new-password =
    .placeholder = Vahvista uusi salasana
user-settings-input-confirm-password =
    .placeholder = Vahvista salasana
user-settings-password-mismatch = Salasanat eivät täsmää
user-settings-save = Tallenna

## Adapter Settings

adapter-settings-no-adapters = Sovittimia ei ole läsnä.

## Authorization Settings

authorization-settings-no-authorizations = Ei valtuutuksia.

## Experiment Settings

experiment-settings-no-experiments = Kokeiluja ei ole saatavilla tällä hetkellä.

## Localization Settings

localization-settings-language-region = Kieli ja alue
localization-settings-country = Maa
localization-settings-timezone = Aikavyöhyke
localization-settings-language = Kieli
localization-settings-units = Yksiköt
localization-settings-units-temperature = Lämpötila
localization-settings-units-temperature-celsius = Celsius (° C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (° F)

## Update Settings

update-settings-update-now = Päivitä nyt
update-available = Uusi versio saatavilla
update-up-to-date = Järjestelmäsi on ajan tasalla.
updates-not-supported = Päivityksiä ei tueta tällä alustalla.
update-settings-enable-self-updates = Ota automaattiset päivitykset käyttöön
last-update = Viimeisin päivitys
current-version = Nykyinen versio
failed = Epäonnistui
never = Ei koskaan
in-progress = Meneillään…
restarting = Käynnistetään uudelleen…
checking-for-updates = Tarkistetaan päivityksiä…
failed-to-check-for-updates = Päivityksiä ei voi tarkistaa tällä hetkellä.

## Developer Settings

developer-settings-enable-ssh = Ota SSH käyttöön
developer-settings-view-internal-logs = Näytä sisäiset lokit
developer-settings-create-local-authorization = Luo paikallinen valtuus

## Rules

add-rule =
    .aria-label = Luo uusi sääntö
rules = Säännöt
rules-create-rule-hint = Sääntöjä ei ole luotu. Napsauta + luodaksesi säännön.
rules-rule-name = Säännön nimi
rules-customize-rule-name-icon =
    .alt = Muokkaa säännön nimeä
rules-rule-description = Säännön kuvaus
rules-preview-button =
    .alt = Esikatsele
rules-delete-icon =
    .alt = Poista
rules-drag-hint = Aloita säännön luominen vetämällä laitteita tänne
rules-drag-input-hint = Lisää laite sisääntuloksi
rules-drag-output-hint = Lisää laite lähtönä
rules-scroll-left =
    .alt = Vieritä vasemmalle
rules-scroll-right =
    .alt = Vieritä oikealle
rules-delete-prompt = Pudota laitteita tähän katkaistaksesi yhteyden
rules-delete-dialog = Haluatko varmasti poistaa tämän säännön pysyvästi?
rules-delete-cancel =
    .value = Peruuta
rules-delete-confirm =
    .value = Poista sääntö
rule-invalid = Virheellinen
rule-delete-prompt = Haluatko varmasti poistaa tämän säännön pysyvästi?
rule-delete-cancel-button =
    .value = Peruuta
rule-delete-confirm-button =
    .value = Poista sääntö
rule-select-property = Valitse ominaisuus
rule-not = Ei
rule-event = Tapahtuma
rule-action = Toiminto
rule-configure = Määritä…
rule-time-title = Vuorokaudenaika
rule-notification = Ilmoitus
notification-title = Otsikko
notification-message = Viesti
notification-level = Taso
notification-low = Matala
notification-normal = Normaali
notification-high = Korkea
rule-name = Säännön nimi

## Logs

add-log =
    .aria-label = Luo uusi loki
logs = Lokit
logs-create-log-hint = Lokeja ei ole luotu. Napsauta + luodaksesi lokin.
logs-device = Laite
logs-device-select =
    .aria-label = Lokilaite
logs-property = Ominaisuus
logs-property-select =
    .aria-label = Lokiominaisuus
logs-retention = Pysyvyys
logs-retention-length =
    .aria-label = Lokin säilytysaika
logs-retention-unit =
    .aria-label = Lokin säilytysyksikkö
logs-hours = tuntia
logs-days = päivää
logs-weeks = viikkoa
logs-save = Tallenna
logs-remove-dialog-title = Poistetaan
logs-remove-dialog-warning = Lokin poistaminen poistaa myös kaiken sen datan. Oletko varma, että haluat poistaa sen?
logs-remove = Poista
logs-unable-to-create = Lokia ei voi luoda
logs-server-remove-error = Palvelinvirhe: lokia ei voi poistaa

## Add New Things

add-thing-scanning-icon =
    .alt = Etsitään
add-thing-scanning = Etsitään uusia laitteita…
add-thing-add-adapters-hint = Uusia esineitä ei löytynyt. Kokeile <a data-l10n-name="add-thing-add-adapters-hint-anchor">lisätä joitain lisäosia</a>.
add-thing-add-by-url = Lisää URL-osoitteella…
add-thing-done = Valmis
add-thing-cancel = Peruuta

## Context Menu

context-menu-choose-icon = Valitse kuvake…
context-menu-save = Tallenna
context-menu-remove = Poista

## Capabilities

OnOffSwitch = Päällä/pois -kytkin
MultiLevelSwitch = Moniasentokytkin
ColorControl = Värinhallinta
ColorSensor = Värianturi
EnergyMonitor = Virtamittari
BinarySensor = Binäärianturi
MultiLevelSensor = Moniasentoanturi
SmartPlug = Älypistorasia
Light = Valo
DoorSensor = Ovianturi
MotionSensor = Liiketunnistin
LeakSensor = Vuotoanturi
PushButton = Painike
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Lämpötila-anturi
HumiditySensor = Kosteusanturi
Alarm = Hälytin
Thermostat = Termostaatti
Lock = Lukko
BarometricPressureSensor = Ilmanpaineanturi
Custom = Mukautettu esine
Thing = Esine
AirQualitySensor = Ilmanlaatuanturi

## Properties

alarm = Hälytys
pushed = Painettu
not-pushed = Ei painettu
on-off = Päällä/pois
on = Päällä
off = Pois päältä
power = Virta kytketty
voltage = Jännite
temperature = Lämpötila
current = Virta
frequency = Taajuus
color = Väri
brightness = Kirkkaus
leak = Vuoto
dry = Kuiva
color-temperature = Värilämpötila
video-unsupported = Valitettavasti selaimesi ei tue videota.
motion = Liikettä
no-motion = Ei liikettä
open = Auki
closed = Suljettu
locked = Lukittu
unlocked = Lukitsematon
jammed = Jumittunut
unknown = Tuntematon
active = Aktiivinen
inactive = Epäaktiivinen
humidity = Kosteus
concentration = Sakeus
density = Tiheys

## Domain Setup

tunnel-setup-reclaim-domain = Näyttää siltä, että olet jo rekisteröinyt kyseisen aliverkkotunnuksen. Palauttaaksesi sen <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">napsauta tätä</a>.
check-email-for-token = Tarkista sähköpostistasi palautuspoletti ja liitä se ylle.
reclaim-failed = Verkkotunnusta ei voitu palauttaa.
subdomain-already-used = Tämä aliverkkotunnus on jo käytössä. Valitse toinen aliverkkotunnus.
invalid-subdomain = Virheellinen aliverkkotunnus.
invalid-email = Virheellinen sähköpostiosoite.
invalid-reclamation-token = Virheellinen palautuspoletti.
domain-success = Onnistui! Odota kunnes sinut uudelleenohjataan…
issuing-error = Varmenteen myöntäminen epäonnistui. Yritä uudelleen.
redirecting = Uudelleenohjataan…

## Booleans

true = Tosi
false = Epätosi

## Time

utils-now = nyt
utils-seconds-ago =
    { $value ->
        [one] { $value } sekunti sitten
       *[other] { $value } sekuntia sitten
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minuutti sitten
       *[other] { $value } minuuttia sitten
    }
utils-hours-ago =
    { $value ->
        [one] { $value } tunti sitten
       *[other] { $value } tuntia sitten
    }
utils-days-ago =
    { $value ->
        [one] { $value } päivä sitten
       *[other] { $value } päivää sitten
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } viikko sitten
       *[other] { $value } viikkoa sitten
    }
utils-months-ago =
    { $value ->
        [one] { $value } kuukausi sitten
       *[other] { $value } kuukautta sitten
    }
utils-years-ago =
    { $value ->
        [one] { $value } vuosi sitten
       *[other] { $value } vuotta sitten
    }
minute = Minuutti
hour = Tunti
day = Päivä
week = Viikko

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

unknown-device-type = Tuntematon laitetyyppi
new-thing-choose-icon = Valitse kuvake…
new-thing-save = Tallenna
new-thing-pin =
    .placeholder = Anna PIN-koodi
new-thing-pin-error = Väärä PIN-koodi
new-thing-pin-invalid = Väärä PIN-koodi
new-thing-cancel = Peruuta
new-thing-submit = Lähetä
new-thing-username =
    .placeholder = Syötä käyttäjätunnus
new-thing-password =
    .placeholder = Syötä salasana
new-thing-credentials-error = Virheelliset kirjautumistiedot
new-thing-saved = Tallennettu
new-thing-done = Valmis

## New Web Thing View

new-web-thing-url =
    .placeholder = Anna web-esineen URL-osoite
new-web-thing-label = Web-esine
loading = Ladataan…
new-web-thing-multiple = Useita web-esineitä löydetty
new-web-thing-from = kohteesta

## Empty div Messages

no-things = Ei vielä laitteita. Napsauta + ja etsi käytettävissä olevia laitteita.
thing-not-found = Esinettä ei löytynyt.
action-not-found = Toimintoa ei löydy.
events-not-found = Tällä esineellä ei ole tapahtumia.

## Add-on Settings

add-addons =
    .aria-label = Löydä uusia lisäosia
author-unknown = Tuntematon
disable = Poista käytöstä
enable = Ota käyttöön
by = tekijä
license = lisenssi
addon-configure = Asetukset
addon-update = Päivitä
addon-remove = Poista
addon-updating = Päivitetään…
addon-updated = Päivitetty
addon-update-failed = Epäonnistui
addon-config-applying = Toteutetaan…
addon-config-apply = Toteuta
addon-discovery-added = Lisätty
addon-discovery-add = Lisää
addon-discovery-installing = Asennetaan…
addon-discovery-failed = Epäonnistui
addon-search =
    .placeholder = Hae

## Page Titles

settings = Asetukset
domain = Verkkotunnus
users = Käyttäjät
edit-user = Muokkaa käyttäjää
add-user = Lisää käyttäjä
adapters = Sovittimet
addons = Lisäosat
addon-config = Määritä lisäosa
addon-discovery = Löydä uusia lisäosia
experiments = Kokeilut
localization = Lokalisointi
updates = Päivitykset
authorizations = Valtuudet
developer = Kehittäjä
network = Verkko
ethernet = Ethernet
wifi = Wi-Fi
icon = Kuvake

## Errors

unknown-state = Tuntematon tila.
error = Virhe
errors = Virheet
gateway-unreachable = Yhdyskäytävä ei ole tavoitettavissa
more-information = Lisätietoja
invalid-file = Virheellinen tiedosto.
failed-read-file = Tiedoston lukeminen epäonnistui.
failed-save = Tiedoston tallentaminen epäonnistui.

## Schema Form

unsupported-field = Kenttäkaavaa ei tueta

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Kirjaudu sisään — { -webthings-gateway-brand }
login-log-in = Kirjaudu sisään
login-wrong-credentials = Virheellinen käyttäjätunnus tai salasana.
login-wrong-totp = Todennuskoodi oli väärin.
login-enter-totp = Kirjoita koodi todennussovelluksesta.

## Create First User Page

signup-title = Luo käyttäjä — { -webthings-gateway-brand }
signup-welcome = Tervetuloa
signup-create-account = Luo ensimmäinen käyttäjätilisi:
signup-password-mismatch = Salasanat eivät täsmää
signup-next = Seuraava

## Tunnel Setup Page

tunnel-setup-title = Valitse verkko-osoite — { -webthings-gateway-brand }
tunnel-setup-welcome = Tervetuloa
tunnel-setup-choose-address = Valitse turvallinen verkko-osoite yhdyskäytävällesi:
tunnel-setup-input-subdomain =
    .placeholder = aliverkkotunnus
tunnel-setup-input-reclamation-token =
    .placeholder = Palautuspoletti
tunnel-setup-error = Aliverkkotunnuksen asennuksessa tapahtui virhe.
tunnel-setup-create = Luo
tunnel-setup-skip = Ohita
tunnel-setup-time-sync = Kellonaikaa synkronoidaan internetistä. Verkkotunnuksen rekisteröinti epäonnistuu todennäköisesti, kunnes tämä on valmis.

## Authorize Page

authorize-title = Valtuuspyyntö — { -webthings-gateway-brand }
authorize-authorization-request = Valtuuspyyntö
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> haluaa käyttää yhdyskäytävääsi laitteiden <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = lähteestä <<domain>>
authorize-monitor-and-control = tarkasteluun ja hallintaan
authorize-monitor = tarkasteluun
authorize-allow-all = Salli kaikille esineille
authorize-allow =
    .value = Salli
authorize-deny = Estä

## Local Token Page

local-token-title = Paikallinen polettipalvelu — { -webthings-gateway-brand }
local-token-header = Paikallinen polettipalvelu
local-token-your-token = Paikallinen polettisi on tämä <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Käytä sitä keskustellaksesi yhdyskäytävän kanssa turvallisesti hyödyntämällä <a data-l10n-name="local-token-bearer-type">Bearer-tyyppistä valtuutta</a>.
local-token-copy-token = Kopioi poletti

## Router Setup Page

router-setup-title = Reitittimen asetukset — { -webthings-gateway-brand }
router-setup-header = Luo uusi Wi-Fi-verkko
router-setup-input-ssid =
    .placeholder = Verkon nimi
router-setup-input-password =
    .placeholder = Salasana
router-setup-input-confirm-password =
    .placeholder = Vahvista salasana
router-setup-create =
    .value = Luo
router-setup-password-mismatch = Salasanojen täytyy täsmätä

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fin asetukset — { -webthings-gateway-brand }
wifi-setup-header = Yhdistetäänkö Wi-Fi-verkkoon?
wifi-setup-input-password =
    .placeholder = Salasana
wifi-setup-show-password = Näytä salasana
wifi-setup-connect =
    .value = Yhdistä
wifi-setup-network-icon =
    .alt = Wi-Fi-verkko
wifi-setup-skip = Ohita

## Connecting to Wi-Fi Page

connecting-title = Yhdistetään Wi-Fiin — { -webthings-gateway-brand }
connecting-header = Yhdistetään Wi-Fiin…
connecting-connect = Varmista että olet yhteydessä samaan verkkoon ja mene sitten selaimellasi { $gateway-link } jatkaaksesi määritysten tekoa.
connecting-warning = Huomio: Jos et voi ladata { $domain }, tarkista yhdyskäytävän IP-osoite reitittimestäsi.
connecting-header-skipped = Wi-Fi-asetukset ohitettiin
connecting-skipped = Yhdyskäytävää käynnistetään nyt. Siirry selaimellasi { $gateway-link } samalla kun olet yhteydessä samaan verkkoon kuin yhdyskäytävä jatkaaksesi määritysten tekoa.

## Creating Wi-Fi Network Page

creating-title = Luodaan Wi-Fi-verkko — { -webthings-gateway-brand }
creating-header = Luodaan Wi-Fi-verkkoa…
creating-content = Yhdistä verkkoon { $ssid } juuri luomallasi salasanalla, sen jälkeen mene selaimellasi { $gateway-link } tai { $ip-link }.

## UI Updates

ui-update-available = Päivitetty käyttöliittymä on saatavana.
ui-update-reload = Lataa uudelleen
ui-update-close = Sulje

## General Terms

ok = OK
ellipsis = …
event-log = Tapahtumaloki
edit = Muokkaa
remove = Poista
disconnected = Yhteys katkaistu
processing = Käsitellään…
submit = Lähetä

## Top-Level Buttons

menu-button =
    .aria-label = Valikko
back-button =
    .aria-label = Takaisin
overflow-button =
    .aria-label = Lisätoiminnot
submit-button =
    .aria-label = Lähetä
edit-button =
    .aria-label = Muokkaa
save-button =
    .aria-label = Tallenna
