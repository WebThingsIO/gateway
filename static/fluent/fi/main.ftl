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

rules-menu-item = Säännöt
logs-menu-item = Lokit
floorplan-menu-item = Pohjapiirros
settings-menu-item = Asetukset
log-out-button = Kirjaudu ulos

## Things


## Floorplan

upload-floorplan = Lähetä pohjapiirros…
upload-floorplan-hint = (suositeltu tiedostomuoto on .svg)

## Top-Level Settings

settings-network = Verkko
settings-users = Käyttäjät
settings-add-ons = Lisäosat
settings-localization = Lokalisointi
settings-updates = Päivitykset
settings-authorizations = Valtuudet
settings-experiments = Kokeilut
settings-developer = Kehittäjä

## Domain Settings


## Network Settings

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
user-settings-input-new-password =
    .placeholder = Uusi salasana (valinnainen)
user-settings-input-confirm-new-password =
    .placeholder = Vahvista uusi salasana
user-settings-input-confirm-password =
    .placeholder = Vahvista salasana
user-settings-password-mismatch = Salasanat eivät täsmää
user-settings-save = Tallenna

## Adapter Settings


## Authorization Settings


## Experiment Settings


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

## Rules

add-rule =
    .aria-label = Luo uusi sääntö
rules = Säännöt
rules-rule-name = Säännön nimi
rules-customize-rule-name-icon =
    .alt = Muokkaa säännön nimeä
rules-rule-description = Säännön kuvaus
rules-delete-icon =
    .alt = Poista
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
rule-notification = Ilmoitus
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
logs-retention = Pysyvyys
logs-save = Tallenna
logs-remove = Poista
logs-unable-to-create = Lokia ei voi luoda

## Add New Things

add-thing-done = Valmis
add-thing-cancel = Peruuta

## Context Menu

context-menu-choose-icon = Valitse kuvake…
context-menu-save = Tallenna
context-menu-remove = Poista

## Capabilities


## Properties

on = Päällä
off = Pois päältä
temperature = Lämpötila
color = Väri
brightness = Kirkkaus
color-temperature = Värilämpötila
unknown = Tuntematon

## Domain Setup


## Booleans


## Time

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

## Unit Abbreviations

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

## New Thing View

unknown-device-type = Tuntematon laitetyyppi
new-thing-choose-icon = Valitse kuvake…
new-thing-save = Tallenna
new-thing-pin =
    .placeholder = Anna PIN-koodi
new-thing-pin-error = Väärä PIN-koodi
new-thing-pin-invalid = Väärä PIN-koodi
new-thing-saved = Tallennettu
new-thing-done = Valmis

## New Web Thing View


## Empty div Messages


## Add-on Settings

author-unknown = Tuntematon
disable = Poista käytöstä
enable = Ota käyttöön
addon-update = Päivitä
addon-remove = Poista
addon-updated = Päivitetty
addon-update-failed = Epäonnistui
addon-discovery-added = Lisätty
addon-discovery-add = Lisää
addon-discovery-installing = Asennetaan…
addon-discovery-failed = Epäonnistui

## Page Titles

settings = Asetukset
users = Käyttäjät
edit-user = Muokkaa käyttäjää
add-user = Lisää käyttäjä
addons = Lisäosat
network = Verkko
ethernet = Ethernet
wifi = Wi-Fi
icon = Kuvake

## Errors

unknown-state = Tuntematon tila.
error = Virhe
errors = Virheet
more-information = Lisätietoja
invalid-file = Virheellinen tiedosto.
failed-read-file = Tiedoston lukeminen epäonnistui.
failed-save = Tiedoston tallentaminen epäonnistui.

## Schema Form


## Icon Sources


## Login Page

login-log-in = Kirjaudu sisään
login-wrong-credentials = Virheellinen käyttäjätunnus tai salasana.

## Create First User Page

signup-title = Luo käyttäjä — { -webthings-gateway-brand }
signup-welcome = Tervetuloa
signup-create-account = Luo ensimmäinen käyttäjätilisi:
signup-password-mismatch = Salasanat eivät täsmää
signup-next = Seuraava

## Tunnel Setup Page

tunnel-setup-title = Valitse verkko-osoite — { -webthings-gateway-brand }
tunnel-setup-welcome = Tervetuloa
tunnel-setup-privacy-policy = Tietosuojakäytäntö
tunnel-setup-create = Luo
tunnel-setup-skip = Ohita

## Authorize Page


## Local Token Page


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

## Creating Wi-Fi Network Page


## UI Updates

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
submit-button =
    .aria-label = Lähetä
edit-button =
    .aria-label = Muokkaa
save-button =
    .aria-label = Tallenna
