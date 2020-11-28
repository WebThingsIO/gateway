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

things-menu-item = Dinge
rules-menu-item = Regeln
logs-menu-item = Protokolle
floorplan-menu-item = Raumplan
settings-menu-item = Einstellungen
log-out-button = Abmelden

## Things

thing-details =
    .aria-label = Eigenschaften anzeigen
add-things =
    .aria-label = Neue Dinge hinzufügen

## Floorplan

upload-floorplan = Raumplan hochladen…
upload-floorplan-hint = (.svg empfohlen)

## Top-Level Settings

settings-domain = Domäne
settings-network = Netzwerk
settings-users = Benutzer
settings-add-ons = Erweiterungen
settings-adapters = Adapter
settings-localization = Lokalisierung
settings-updates = Aktualisierungen
settings-authorizations = Authorisierungen
settings-experiments = Experimente
settings-developer = Entwickler

## Domain Settings

domain-settings-local-label = Lokaler Zugriff
domain-settings-local-update = Hostnamen aktualisieren
domain-settings-remote-access = Fernzugriff
domain-settings-local-name =
    .placeholder = Gateway

## Network Settings

network-settings-unsupported = Netzwerkeinstellungen werden auf dieser Plattform nicht unterstützt.
network-settings-ethernet-image =
    .alt = Kabelverbindung
network-settings-ethernet = Kabelverbindung
network-settings-wifi-image =
    .alt = Kabellose Verbindung
network-settings-wifi = Drahtlosverbindung
network-settings-home-network-image =
    .alt = Heimnetzwerk
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Konfigurieren
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modus
network-settings-home-network-lan = Heimnetzwerk (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-Adresse
network-settings-dhcp = Automatisch (DHCP)
network-settings-static = Manuell (Statische IP)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Statische IP-Adresse
network-settings-network-mask = Netzwerkmaske
network-settings-gateway = Gateway
network-settings-done = Erledigt
network-settings-wifi-password =
    .placeholder = Passwort
network-settings-show-password = Passwort anzeigen
network-settings-connect = Verbinden
network-settings-username = Benutzername
network-settings-password = Passwort
network-settings-router-ip = Router-IP-Adresse
network-settings-dhcp-server = DHCP-Server
network-settings-enable-wifi = Wi-Fi aktivieren
network-settings-network-name = Netzwerkname (SSID)
wireless-connected = Verbunden
wireless-icon =
    .alt = Wi-Fi-Netzwerk
network-settings-changing = Netzwerkeinstellungen werden geändert. Dies kann eine Minute dauern.
failed-ethernet-configure = Konfiguration der Ethernet-Verbindung fehlgeschlagen.
failed-wifi-configure = Konfiguration der Wi-Fi-Verbindung fehlgeschlagen.
failed-wan-configure = Konfiguration der WAN-Verbindung fehlgeschlagen.
failed-lan-configure = Konfiguration der LAN-Verbindung fehlgeschlagen.
failed-wlan-configure = Konfiguration der WLAN-Verbindung fehlgeschlagen.

## User Settings

create-user =
    .aria-label = Neuen Benutzer hinzufügen
user-settings-input-name =
    .placeholder = Name
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = Passwort
user-settings-input-totp =
    .placeholder = 2FA-Code
user-settings-mfa-enable = 2-Faktor-Authentifizierung aktivieren
user-settings-mfa-scan-code = Scannen Sie den folgenden Code mit einer beliebigen Zwei-Faktor-Authentifizierungs-App.
user-settings-mfa-secret = Dies ist das neue Geheimwort für TOTP, falls obiger Code nicht funktioniert:
user-settings-mfa-error = Der Authentifizierungscode war falsch.
user-settings-mfa-enter-code = Geben Sie hier unten den Code aus Ihrer Authentifizierungs-App ein.
user-settings-mfa-verify = Verifizieren
user-settings-mfa-regenerate-codes = Wiederherstellungscodes neu generieren
user-settings-mfa-backup-codes = Dies sind Ihre Wiederherstellungscodes. Jeder kann nur einmal verwendet werden. Bewahren Sie sie an einem sicheren Ort auf.
user-settings-input-new-password =
    .placeholder = Neues Passwort (optional)
user-settings-input-confirm-new-password =
    .placeholder = Neues Passwort bestätigen
user-settings-input-confirm-password =
    .placeholder = Passwort bestätigen
user-settings-password-mismatch = Passwörter stimmen nicht überein
user-settings-save = Speichern

## Adapter Settings

adapter-settings-no-adapters = Keine Adapter vorhanden.

## Authorization Settings

authorization-settings-no-authorizations = Keine Authorisierungen.

## Experiment Settings

experiment-settings-no-experiments = Im Moment sind keine Experimente verfügbar.

## Localization Settings

localization-settings-language-region = Sprache & Region
localization-settings-country = Land
localization-settings-timezone = Zeitzone
localization-settings-language = Sprache
localization-settings-units = Einheiten
localization-settings-units-temperature = Temperatur
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Jetzt aktualisieren
update-available = Neue Version verfügbar
update-up-to-date = Das System ist aktuell
updates-not-supported = Updates werden auf dieser Plattform nicht unterstützt.
update-settings-enable-self-updates = Automatische Updates aktivieren
last-update = Letzte Aktualisierung
current-version = Aktuelle Version
failed = Fehlgeschlagen
never = Niemals
in-progress = Laufend
restarting = Wird neu gestartet
checking-for-updates = Nach Updates suchen…
failed-to-check-for-updates = Derzeit kann nicht nach Updates gesucht werden.

## Developer Settings

developer-settings-enable-ssh = SSH aktivieren
developer-settings-view-internal-logs = Interne Protokolle ansehen
developer-settings-create-local-authorization = Lokalen Zugang erstellen

## Rules

add-rule =
    .aria-label = Neue Regel erstellen
rules = Regeln
rules-create-rule-hint = Keine Regeln vorhanden. Für eine neue Regel + drücken.
rules-rule-name = Regelname
rules-customize-rule-name-icon =
    .alt = Regelnamen anpassen
rules-rule-description = Regelbeschreibung
rules-preview-button =
    .alt = Vorschau
rules-delete-icon =
    .alt = Löschen
rules-drag-hint = Gerät hierher ziehen, um eine Regel zu erzeugen
rules-drag-input-hint = Gerät als Eingang hinzufügen
rules-drag-output-hint = Gerät als Ausgang hinzufügen
rules-scroll-left =
    .alt = Links scrollen
rules-scroll-right =
    .alt = Rechts scrollen
rules-delete-prompt = Gerät hier ablegen, um es zu löschen
rules-delete-dialog = Soll die Regel dauerhaft gelöscht werden?
rules-delete-cancel =
    .value = Abbrechen
rules-delete-confirm =
    .value = Regel löschen
rule-invalid = Ungültig
rule-delete-prompt = Soll die Regel dauerhaft gelöscht werden?
rule-delete-cancel-button =
    .value = Abbrechen
rule-delete-confirm-button =
    .value = Regel löschen
rule-select-property = Eigenschaft auswählen
rule-not = Nicht
rule-event = Ereignis
rule-action = Aktion
rule-configure = Konfigurieren…
rule-time-title = Tageszeit
rule-notification = Benachrichtigung
notification-title = Titel
notification-message = Nachricht
notification-level = Level
notification-low = Niedrig
notification-normal = Normal
notification-high = Hoch
rule-name = Regelname

## Logs

add-log =
    .aria-label = Neues Protokoll erstellen
logs = Protokolle
logs-create-log-hint = Keine Protokolle vorhanden. Für ein neues Protokoll + drücken.
logs-device = Gerät
logs-device-select =
    .aria-label = Gerät protokollieren
logs-property = Eigenschaft
logs-property-select =
    .aria-label = Eigenschaften protokollieren
logs-retention = Aufbewahrung
logs-retention-length =
    .aria-label = Protokollgröße
logs-retention-unit =
    .aria-label = Einheit der Protokollaufbewahrung
logs-hours = Stunden
logs-days = Tage
logs-weeks = Wochen
logs-save = Speichern
logs-remove-dialog-title = Wird gelöscht
logs-remove-dialog-warning = Beim Löschen eines Protokolls gehen alle bislang gesammelten Daten verloren. Soll das Protokoll wirklich gelöscht werden?
logs-remove = Löschen
logs-unable-to-create = Das Protokoll konnte nicht erstellt werden
logs-server-remove-error = Serverfehler: Das Protokoll konnte nicht entfernt werden

## Add New Things

add-thing-scanning-icon =
    .alt = Suche
add-thing-scanning = Suche nach neuen Geräten…
add-thing-add-adapters-hint = Keine neuen Geräte gefunden. <a data-l10n-name="add-thing-add-adapters-hint-anchor">Neue Erweiterungen hinzufügen.</a>
add-thing-add-by-url = Via URL hinzufügen…
add-thing-done = Erledigt
add-thing-cancel = Abbrechen

## Context Menu

context-menu-choose-icon = Symbol auswählen…
context-menu-save = Speichern
context-menu-remove = Löschen

## Capabilities

OnOffSwitch = Ein/Aus-Schalter
MultiLevelSwitch = Mehrfachschalter
ColorControl = Farbsteuerung
ColorSensor = Farmsensor
EnergyMonitor = Energie-Monitor
BinarySensor = Binärer Sensor
MultiLevelSensor = Mehrfachsensor
SmartPlug = Zwischenstecker
Light = Licht
DoorSensor = Türsensor
MotionSensor = Bewegungssensor
LeakSensor = Wassersensor
PushButton = Taster
VideoCamera = Videokamera
Camera = Kamera
TemperatureSensor = Temperatursensor
HumiditySensor = Feuchtigkeitssensor
Alarm = Alarmanlage
Thermostat = Thermostat
Lock = Schloss
BarometricPressureSensor = Barometer
Custom = Benutzerdefiniertes Gerät
Thing = Ding
AirQualitySensor = Luftqualitätssensor
SmokeSensor = Rauchmelder

## Properties

alarm = Alarm
pushed = Gedrückt
not-pushed = Nicht gedrückt
on-off = Ein/Aus
on = Ein
off = Aus
power = Leistung
voltage = Spannung
temperature = Temperatur
current = Stromstärke
frequency = Frequenz
color = Farbe
brightness = Helligkeit
leak = Leck
dry = Trocken
color-temperature = Farbtemperatur
video-unsupported = Videowiedergabe wird von Ihrem Browser nicht unterstützt.
motion = Bewegung
no-motion = Keine Bewegung
open = Offen
closed = Geschlossen
locked = Abgeschlossen
unlocked = Nicht abgeschlossen
jammed = Verklemmt
unknown = Unbekannt
active = Aktiv
inactive = Inaktiv
humidity = Luftfeuchtigkeit
concentration = Konzentration
density = Dichte
smoke = Rauch

## Domain Setup

tunnel-setup-reclaim-domain = Es scheint, dass du die Subdomain bereits registriert hast. <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">Klicke hier</a>. zum Wiederherstellen.
check-email-for-token = Bitte das Wiederherstellungs-Token aus der verschickten E-Mail oben einfügen.
reclaim-failed = Subdomain konnte nicht wiederhergestellt werden.
subdomain-already-used = Diese Subdomain ist bereits in Gebrauch. Bitte einen anderen Namen wählen.
invalid-subdomain = Ungültige Subdomain.
invalid-email = Ungültige E-Mail-Adresse.
invalid-reclamation-token = Ungültiges Reclaim-Token.
domain-success = Erfolgreich! Sie werden weitergeleitet…
issuing-error = Fehler beim Ausstellen des Zertifikates. Bitte erneut versuchen.
redirecting = Leite weiter…

## Booleans

true = Wahr
false = Falsch

## Time

utils-now = jetzt
utils-seconds-ago =
    { $value ->
        [one] vor einer Sekunde
       *[other] vor { $value } Sekunden
    }
utils-minutes-ago =
    { $value ->
        [one] vor einer Minute
       *[other] vor { $value } Minuten
    }
utils-hours-ago =
    { $value ->
        [one] vor einer Stunde
       *[other] vor { $value } Stunden
    }
utils-days-ago =
    { $value ->
        [one] vor einem Tag
       *[other] vor { $value } Tagen
    }
utils-weeks-ago =
    { $value ->
        [one] vor einer Woche
       *[other] vor { $value } Wochen
    }
utils-months-ago =
    { $value ->
        [one] vor einem Monat
       *[other] vor { $value } Monaten
    }
utils-years-ago =
    { $value ->
        [one] vor einem Jahr
       *[other] vor { $value } Jahr
    }
minute = Minute
hour = Stunde
day = Tag
week = Woche

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
abbrev-foot = Fuß
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Unbekannter Gerätetyp
new-thing-choose-icon = Symbol auswählen…
new-thing-save = Speichern
new-thing-pin =
    .placeholder = PIN eingeben
new-thing-pin-error = Falsche PIN
new-thing-pin-invalid = Ungültige PIN
new-thing-cancel = Abbrechen
new-thing-submit = Absenden
new-thing-username =
    .placeholder = Benutzername eingeben
new-thing-password =
    .placeholder = Passwort eingeben
new-thing-credentials-error = Eingaben sind fehlerhaft
new-thing-saved = Gespeichert
new-thing-done = Erledigt

## New Web Thing View

new-web-thing-url =
    .placeholder = URL des Web Things eingeben
new-web-thing-label = Web Thing
loading = Wird geladen…
new-web-thing-multiple = Mehrere Web Things gefunden
new-web-thing-from = von

## Empty div Messages

no-things = Keine Geräte vorhanden. Zum Suchen nach verfügbaren Geräten „+“ klicken.
thing-not-found = Gerät nicht gefunden.
action-not-found = Aktion nicht gefunden.
events-not-found = Dieses Gerät hat keine Ereignisse.

## Add-on Settings

add-addons =
    .aria-label = Neue Add-ons finden
author-unknown = Unbekannt
disable = Deaktivieren
enable = Aktivieren
by = von
license = Lizenz
addon-configure = Konfigurieren
addon-update = Aktualisieren
addon-remove = Entfernen
addon-updating = Wird aktualisiert…
addon-updated = Aktualisiert
addon-update-failed = Fehlgeschlagen
addon-config-applying = Anwenden…
addon-config-apply = Anwenden
addon-discovery-added = Hinzugefügt
addon-discovery-add = Hinzufügen
addon-discovery-installing = Installieren…
addon-discovery-failed = Fehlgeschlagen
addon-search =
    .placeholder = Suchen

## Page Titles

settings = Einstellungen
domain = Domäne
users = Benutzer
edit-user = Benutzer bearbeiten
add-user = Benutzer hinzufügen
adapters = Adapter
addons = Erweiterungen
addon-config = Add-on konfigurieren
addon-discovery = Neue Add-ons suchen
experiments = Experimente
localization = Lokalisierung
updates = Aktualisierungen
authorizations = Authorisierungen
developer = Entwickler
network = Netzwerk
ethernet = Ethernet
wifi = Wi-Fi
icon = Symbol

## Errors

unknown-state = Unbekannter Zustand.
error = Fehler
errors = Fehler
gateway-unreachable = Gateway nicht erreichbar
more-information = Mehr Informationen
invalid-file = Ungültige Datei.
failed-read-file = Datei nicht lesbar.
failed-save = Fehler beim Speichern.

## Schema Form

unsupported-field = Feldschema nicht untertützt

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Login — { -webthings-gateway-brand }
login-log-in = Anmelden
login-wrong-credentials = Der Benutzername oder das Passwort war falsch.
login-wrong-totp = Der Authentifizierungscode war falsch.
login-enter-totp = Geben Sie den Code aus Ihrer Authentifizierungs-App ein.

## Create First User Page

signup-title = Benutzer anlegen – { -webthings-gateway-brand }
signup-welcome = Willkommen
signup-create-account = Ersten Benutzer anlegen:
signup-password-mismatch = Die Passwörter stimmen nicht überein
signup-next = Weiter

## Tunnel Setup Page

tunnel-setup-title = Webadresse wählen – { -webthings-gateway-brand }
tunnel-setup-welcome = Willkommen
tunnel-setup-choose-address = Wählen Sie eine sichere Webadresse für Ihr Gateway:
tunnel-setup-input-subdomain =
    .placeholder = Subdomain
tunnel-setup-email-opt-in = Halten Sie mich mit Neuigkeiten über WebThings auf dem Laufenden.
tunnel-setup-agree-privacy-policy = Stimmen Sie der <a data-l10n-name="tunnel-setup-privacy-policy-link">Datenschutzerklärung</a> und den <a data-l10n-name="tunnel-setup-tos-link">Nutzungsbedingungen</a> von WebThings zu.
tunnel-setup-input-reclamation-token =
    .placeholder = Reclaim-Token
tunnel-setup-error = Ein Fehler ist beim Erstellen der Subdomain aufgetreten.
tunnel-setup-create = Erstellen
tunnel-setup-skip = Überspringen
tunnel-setup-time-sync = Warte auf die Synchonisierung der Systemuhr mit dem Internet. Das Registrieren der Domain schlägt wahrscheinlich fehl, bis dies abgeschlossen ist.

## Authorize Page

authorize-title = Authorisierungsanfrage — { -webthings-gateway-brand }
authorize-authorization-request = Authorisierungsanfrage
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<<name>>> möchte auf Ihr Gateway zum <<function>> von Geräten zugreifen.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = von <<domain>>
authorize-monitor-and-control = Überwachen und steuern
authorize-monitor = Überwachen
authorize-allow-all = Für alle Geräte erlauben
authorize-allow =
    .value = Erlauben
authorize-deny = Verweigern

## Local Token Page

local-token-title = Dienst für lokale Token — { -webthings-gateway-brand }
local-token-header = Dienst für lokale Token
local-token-your-token = Ihr lokales Zugriffstoken ist <a data-l10n-name="local-token-jwt">JSON Web Token</a>.
local-token-use-it = Nutzen Sie es zur sicheren Kommunikation mit dem Gateway, mittles <a data-l10n-name="local-token-bearer-type">Bearer-type-Authorisierung</a>
local-token-copy-token = Token kopieren

## Router Setup Page

router-setup-title = Router-Setup — { -webthings-gateway-brand }
router-setup-header = Neues Wi-Fi-Netzwerk einrichten
router-setup-input-ssid =
    .placeholder = Netzwerkname
router-setup-input-password =
    .placeholder = Passwort
router-setup-input-confirm-password =
    .placeholder = Passwort bestätigen
router-setup-create =
    .value = Erstellen
router-setup-password-mismatch = Die Passwörter müssen übereinstimmen

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi-Setup — { -webthings-gateway-brand }
wifi-setup-header = Mit einem Wi-Fi-Netzwerk verbinden?
wifi-setup-input-password =
    .placeholder = Passwort
wifi-setup-show-password = Passwort anzeigen
wifi-setup-connect =
    .value = Verbinden
wifi-setup-network-icon =
    .alt = Wi-Fi-Netzwerk
wifi-setup-skip = Überspringen

## Connecting to Wi-Fi Page

connecting-title = WLAN-Verbindung herstellen – { -webthings-gateway-brand }
connecting-header = Verbindung zum WLAN wird hergestellt…
connecting-connect = Bitte stellen Sie sicher, dass Sie mit demselben Netzwerk verbunden sind und navigieren Sie im Webbrowser zu { $gateway-link }, um die Einrichtung fortzusetzen.
connecting-warning =
    Hinweis: Wenn { $domain } nicht erreichbar ist, kann die IP-Adresse
    des Gateways in den Routereinstellungen nachgeschlagen werden.
connecting-header-skipped = WLAN-Einrichtung übersprungen
connecting-skipped = Das Gateway wird jetzt neu gestartet. Navigieren Sie zu { $gateway-link } in Ihren Webbrowser, während Sie mit dem selben Netzwerk verbunden sind, um die Einrichtung fortzusetzen.

## Creating Wi-Fi Network Page

creating-title = Neues Wi-Fi-Netzwerk anlegen — { -webthings-gateway-brand }
creating-header = Neues Wi-Fi-Netzwerk wird angelegt…
creating-content =
    Bitte Verbindung mit dem WLAN { $ssid } mit dem gerade vergebenen Passwort
    aufbauen und im Webbrowser entweder { $gateway-link } oder { $ip-link } aufrufen.

## UI Updates

ui-update-available = Für die Benutzeroberfläche ist ein Update verfügbar.
ui-update-reload = Neu laden
ui-update-close = Schließen

## Transfer to webthings.io

action-required-image =
    .alt = Warnung
action-required = Maßnahme erforderlich:
action-required-message = Der Mozilla IoT-Remote-Access-Dienst und automatische Software-Updates werden eingestellt. Wählen Sie aus, ob Sie webthings.io für fortgesetzten Service auf die von der Gemeinschaft betriebene webthings.io übertragen möchten.
action-required-more-info = Weitere Informationen
action-required-dont-ask-again = Nicht mehr nachfragen
action-required-choose = Auswählen
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Am 31. Dezember 2020 werden der Mozilla IoT-Remote-Access-Service und die automatischen Software-Updates eingestellt (<a data-l10n-name="change-dialog-more-info">Weitere Informationen</a>). Mozilla überträgt das Projekt auf das neue, von der Gemeinschaft betriebene <a data-l10n-name="change-dialog-step-1-website">webthings.io</a> (nicht mit Mozilla verbunden).<br><br>Wenn Sie keine weiteren Software-Updates von Update-Servern der Gemeinschaft erhalten möchten, können Sie automatische Updates in den Einstellungen deaktivieren.<br><br>Wenn möchten Ihre Subdomain von mozilla-iot.org auf webthings.io zu übertragen oder eine neue Subdomain registrieren möchten, können Sie das folgende Formular ausfüllen, um sich für den von der Gemeinschaft betriebenen externen Zugangsdienst registrieren zu lassen.
transition-dialog-register-domain-label = Registrieren Sie sich für den Remote-Access-Dienst webthings.io
transition-dialog-subdomain =
    .placeholder = Subdomain
transition-dialog-newsletter-label = Halten Sie mich mit Neuigkeiten über WebThings auf dem Laufenden.
transition-dialog-agree-tos-label = Stimmen Sie der <a data-l10n-name="transition-dialog-privacy-policy-link">Datenschutzerklärung</a> und den <a data-l10n-name="transition-dialog-tos-link">Nutzungsbedingungen</a> von WebThings zu.
transition-dialog-email =
    .placeholder = E-Mail-Adresse
transition-dialog-register =
    .value = Registrieren
transition-dialog-register-status =
    .alt = Registrierungsstatus
transition-dialog-register-label = Subdomain registrieren
transition-dialog-subscribe-status =
    .alt = Newsletter-Abonnement-Status
transition-dialog-subscribe-label = Newsletter abonnieren
transition-dialog-error-generic = Ein Fehler ist aufgetreten. Bitte gehen Sie zurück und versuchen Sie es erneut.
transition-dialog-error-subdomain-taken = Ausgewählte Subdomain bereits vergeben. Bitte gehen Sie zurück und wählen Sie eine andere.
transition-dialog-error-subdomain-failed = Subdomain konnte nicht registriert werden. Bitte gehen Sie zurück und versuchen Sie es erneut.
transition-dialog-error-subscribe-failed = Newsletter konnte nicht abonniert werden. Bitte versuchen Sie es erneut unter <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Navigieren Sie zu <<domain>>, um fortzufahren.

## General Terms

ok = OK
ellipsis = …
event-log = Ereignisprotokoll
edit = Bearbeiten
remove = Löschen
disconnected = Nicht verbunden
processing = Bitte warten…
submit = Absenden

## Top-Level Buttons

menu-button =
    .aria-label = Menü
back-button =
    .aria-label = Zurück
overflow-button =
    .aria-label = Weitere Aktionen
submit-button =
    .aria-label = Absenden
edit-button =
    .aria-label = Bearbeiten
save-button =
    .aria-label = Speichern
