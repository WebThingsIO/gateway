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

assistant-menu-item = Asystent
things-menu-item = Rzeczy
rules-menu-item = Reguły
logs-menu-item = Wykresy
floorplan-menu-item = Plan pomieszczeń
settings-menu-item = Ustawienia
log-out-button = Wyloguj się

## Things

thing-details =
    .aria-label = Wyświetl właściwości
add-things =
    .aria-label = Dodaj nowe rzeczy

## Assistant

assistant-avatar-image =
    .alt = Awatar asystenta
assistant-controls-text-input =
    .placeholder = Jak mogę pomóc?

## Floorplan

upload-floorplan = Prześlij plan pomieszczeń…
upload-floorplan-hint = (.svg jest zalecane)

## Top-Level Settings

settings-domain = Domena
settings-network = Sieć
settings-users = Użytkownicy
settings-add-ons = Dodatki
settings-adapters = Adaptery
settings-localization = Lokalizacja
settings-updates = Aktualizacje
settings-authorizations = Upoważnienia
settings-experiments = Eksperymenty
settings-developer = Programista

## Domain Settings

domain-settings-local-label = Dostęp lokalny
domain-settings-local-update = Zaktualizuj nazwę hosta
domain-settings-remote-access = Zdalny dostęp
domain-settings-local-name =
    .placeholder = brama

## Network Settings

network-settings-unsupported = Ustawienia sieciowe nie są obsługiwane dla tej platformy.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Sieć domowa
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Konfiguruj
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Tryb
network-settings-home-network-lan = Sieć domowa (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Adres IP
network-settings-dhcp = Automatyczny (DHCP)
network-settings-static = Ręczny (stałe IP)
network-settings-pppoe = Most (PPPoE)
network-settings-static-ip-address = Statyczny adres IP
network-settings-network-mask = Maska sieciowa
network-settings-gateway = Brama sieciowa
network-settings-done = Gotowe
network-settings-wifi-password =
    .placeholder = Hasło
network-settings-show-password = Pokaż hasło
network-settings-connect = Połącz
network-settings-username = Nazwa użytkownika
network-settings-password = Hasło
network-settings-router-ip = Adres IP routera
network-settings-dhcp-server = Serwer DHCP
network-settings-enable-wifi = Włącz Wi-Fi
network-settings-network-name = Nazwa sieci (SSID)
wireless-connected = Połączono
wireless-icon =
    .alt = Sieć Wi-Fi
network-settings-changing = Zmienianie ustawień sieci. Może to chwilę potrwać.
failed-ethernet-configure = Konfiguracja Ethernetu się nie powiodła.
failed-wifi-configure = Konfiguracja Wi-Fi się nie powiodła.
failed-wan-configure = Konfiguracja WAN się nie powiodła.
failed-lan-configure = Konfiguracja LAN się nie powiodła.
failed-wlan-configure = Konfiguracja WLAN się nie powiodła.

## User Settings

create-user =
    .aria-label = Dodaj nowego użytkownika
user-settings-input-name =
    .placeholder = Imię i nazwisko
user-settings-input-email =
    .placeholder = Adres e-mail
user-settings-input-password =
    .placeholder = Hasło
user-settings-input-new-password =
    .placeholder = Nowe hasło (opcjonalne)
user-settings-input-confirm-new-password =
    .placeholder = Potwierdź nowe hasło
user-settings-input-confirm-password =
    .placeholder = Potwierdź hasło
user-settings-password-mismatch = Hasła są niezgodne
user-settings-save = Zapisz

## Adapter Settings

adapter-settings-no-adapters = Brak dostępnych adapterów.

## Authorization Settings

authorization-settings-no-authorizations = Brak upoważnień.

## Experiment Settings

experiment-settings-smart-assistant = Inteligentny asystent
experiment-settings-logs = Wykresy

## Localization Settings

localization-settings-language-region = Język i region
localization-settings-country = Kraj
localization-settings-timezone = Strefa czasowa
localization-settings-language = Język
localization-settings-units = Jednostki
localization-settings-units-temperature = Temperatura
localization-settings-units-temperature-celsius = Stopnie Celsjusza (°C)
localization-settings-units-temperature-fahrenheit = Stopnie Fahrenheita (°F)

## Update Settings

update-settings-update-now = Aktualizuj teraz
update-available = Dostępna jest nowa wersja
update-up-to-date = System jest aktualny
updates-not-supported = Aktualizacje nie są obsługiwane na tej platformie.
update-settings-enable-self-updates = Włącz automatyczne aktualizacje
last-update = Ostatnia aktualizacja
current-version = Obecna wersja
failed = Niepowodzenie
never = Nigdy
in-progress = W trakcie
restarting = Ponowne uruchamianie

## Developer Settings

developer-settings-enable-ssh = Włącz SSH
developer-settings-view-internal-logs = Wyświetl dzienniki wewnętrzne
developer-settings-create-local-authorization = Utwórz lokalne upoważnienie

## Rules

add-rule =
    .aria-label = Utwórz nową regułę
rules = Reguły
rules-create-rule-hint = Nie utworzono reguł. Kliknij +, aby utworzyć regułę.
rules-rule-name = Nazwa reguły
rules-customize-rule-name-icon =
    .alt = Dostosuj nazwę reguły
rules-rule-description = Opis reguły
rules-preview-button =
    .alt = Podgląd
rules-delete-icon =
    .alt = Usuń
rules-drag-hint = Przeciągnij tutaj urządzenia, aby rozpocząć tworzenie reguły
rules-drag-input-hint = Dodaj urządzenie jako wejściowe
rules-drag-output-hint = Dodaj urządzenie jako wyjściowe
rules-scroll-left =
    .alt = Przewiń w lewo
rules-scroll-right =
    .alt = Przewiń w prawo
rules-delete-prompt = Przeciągnij urządzenie tutaj, aby rozłączyć
rules-delete-dialog = Czy na pewno trwale usunąć tę regułę?
rules-delete-cancel =
    .value = Anuluj
rules-delete-confirm =
    .value = Usuń regułę
rule-invalid = Nieprawidłowa
rule-delete-prompt = Czy na pewno trwale usunąć tę regułę?
rule-delete-cancel-button =
    .value = Anuluj
rule-delete-confirm-button =
    .value = Usuń regułę
rule-select-property = Wybierz właściwość
rule-not = Nie
rule-event = Zdarzenie
rule-action = Działanie
rule-configure = Konfiguruj…
rule-time-title = Czas
rule-notification = Powiadomienie
notification-title = Tytuł
notification-message = Wiadomość
notification-level = Poziom
notification-low = Niski
notification-normal = Zwykły
notification-high = Wysoki
rule-name = Nazwa reguły

## Logs

add-log =
    .aria-label = Utwórz nowy wykres
logs = Wykresy
logs-create-log-hint = Nie utworzono wykresów. Kliknij +, aby utworzyć wykres.
logs-device = Urządzenie
logs-device-select =
    .aria-label = Rejestrowane urządzenie
logs-property = Właściwość
logs-property-select =
    .aria-label = Rejestrowana właściwość
logs-retention = Przechowywanie
logs-retention-length =
    .aria-label = Czas przechowywania wykresu
logs-retention-unit =
    .aria-label = Jednostka przechowywania wykresu
logs-hours = Godziny
logs-days = Dni
logs-weeks = Tygodnie
logs-save = Zapisz
logs-remove-dialog-title = Usuwanie
logs-remove-dialog-warning = Usunięcie wykresu spowoduje również usunięcie wszystkich jego danych. Czy na pewno go usunąć?
logs-remove = Usuń
logs-unable-to-create = Nie można utworzyć wykresu
logs-server-remove-error = Błąd serwera: nie można usunąć wykresu

## Add New Things

add-thing-scanning-icon =
    .alt = Wyszukiwanie
add-thing-scanning = Wyszukiwanie nowych urządzeń…
add-thing-add-adapters-hint = Nie odnaleziono żadnych nowych rzeczy. Spróbuj <a data-l10n-name="add-thing-add-adapters-hint-anchor">dodać rozszerzenia</a>.
add-thing-add-by-url = Dodaj za pomocą adresu URL…
add-thing-done = Gotowe
add-thing-cancel = Anuluj

## Context Menu

context-menu-choose-icon = Wybierz ikonę…
context-menu-save = Zapisz
context-menu-remove = Usuń

## Capabilities

OnOffSwitch = Przełącznik włączania/wyłączania
MultiLevelSwitch = Przełącznik wielopoziomowy
ColorControl = Sterowanie kolorem
ColorSensor = Czujnik koloru
EnergyMonitor = Monitor energii
BinarySensor = Czujnik binarny
MultiLevelSensor = Czujnik wielopoziomowy
SmartPlug = Inteligentna wtyczka
Light = Światło
DoorSensor = Czujnik otwarcia drzwi
MotionSensor = Czujnik ruchu
LeakSensor = Czujnik przecieku
PushButton = Przycisk
VideoCamera = Kamera wideo
Camera = Aparat
TemperatureSensor = Czujnik temperatury
Alarm = Alarm
Thermostat = Termostat
Lock = Zamek
Custom = Inna rzecz
Thing = Rzecz

## Properties

alarm = Alarm
pushed = Wciśnięty
not-pushed = Niewciśnięty
on-off = Włączony/wyłączony
on = Włączony
off = Wyłączony
power = Moc
voltage = Napięcie
temperature = Temperatura
current = Natężenie
frequency = Częstotliwość
color = Kolor
brightness = Jasność
leak = Przeciek
dry = Sucho
color-temperature = Temperatura kolorów
video-unsupported = Używana przeglądarka nie obsługuje wideo.
motion = Ruch
no-motion = Brak ruchu
open = Otwarty
closed = Zamknięty
locked = Zablokowany
unlocked = Odblokowany
jammed = Zaklinowany
unknown = Nieznany
active = Aktywny
inactive = Nieaktywny

## Domain Setup

tunnel-setup-reclaim-domain = Już zarejestrowano tę poddomenę. Aby ją odzyskać, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">kliknij tutaj</a>.
check-email-for-token = Sprawdź swój e-mail w poszukiwaniu tokenu odzyskiwania i wklej go powyżej.
invalid-reclamation-token = Nieprawidłowy token.
domain-success = Udało się! Poczekaj na przekierowanie…
issuing-error = Błąd podczas wydawania certyfikatu. Proszę spróbuj ponownie.
redirecting = Przekierowywanie…

## Booleans

true = Prawda
false = Fałsz

## Time

utils-now = teraz
minute = Minuta
hour = Godzina
day = Dzień
week = Tydzień

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
abbrev-day = d.
abbrev-hour = godz.
abbrev-minute = min
abbrev-second = sek.
abbrev-millisecond = ms
abbrev-foot = ft

## New Thing View

unknown-device-type = Nieznany typ urządzenia
new-thing-choose-icon = Wybierz ikonę…
new-thing-save = Zapisz
new-thing-pin =
    .placeholder = Wpisz PIN
new-thing-pin-error = Niepoprawny PIN
new-thing-pin-invalid = Nieprawidłowy PIN
new-thing-cancel = Anuluj
new-thing-submit = Zatwierdź
new-thing-username =
    .placeholder = Wpisz nazwę użytkownika
new-thing-password =
    .placeholder = Wpisz hasło
new-thing-credentials-error = Niepoprawne dane uwierzytelniające
new-thing-saved = Zapisano
new-thing-done = Gotowe

## New Web Thing View

new-web-thing-url =
    .placeholder = Wprowadź adres URL rzeczy
new-web-thing-label = Web Thing
loading = Ładowanie…
new-web-thing-multiple = Znaleziono wiele rzeczy
new-web-thing-from = z

## Empty div Messages

no-things = Brak urządzeń. Kliknij +, aby wyszukać dostępne urządzenia.
thing-not-found = Rzecz nie znaleziona.
action-not-found = Akcja nie znaleziona.
events-not-found = Ta rzecz nie ma zdarzeń.

## Add-on Settings

author-unknown = Nieznany
disable = Wyłącz
enable = Włącz
by = przez
addon-configure = Konfiguruj
addon-update = Aktualizuj
addon-remove = Usuń
addon-updating = Aktualizowanie…
addon-updated = Zaktualizowano
addon-update-failed = Niepowodzenie
addon-config-applying = Stosowanie…
addon-config-apply = Zastosuj
addon-discovery-added = Dodano
addon-discovery-add = Dodaj
addon-discovery-installing = Instalowanie…
addon-discovery-failed = Niepowodzenie

## Page Titles

settings = Ustawienia
domain = Domena
users = Użytkownicy
adapters = Adaptery
experiments = Eksperymenty
localization = Lokalizacja
updates = Aktualizacje
developer = Programista
network = Sieć
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikona

## Speech

speech-unsupported = Aktualna przeglądarka nie obsługuje mowy

## Errors

unknown-state = Nieznany stan.
error = Błąd
errors = Błędy
invalid-file = Niepoprawny plik.
failed-read-file = Nie można odczytać pliku.
failed-save = Nie udało się zapisać pliku.

## Schema Form

unsupported-field = Nieobsługiwane pole schematu

## Icon Sources

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Logowanie — { -webthings-gateway-brand }
login-log-in = Zaloguj się

## Create First User Page

signup-welcome = Witamy
signup-create-account = Utwórz swoje pierwsze konto użytkownika:
signup-password-mismatch = Hasła są niezgodne
signup-next = Następny

## Tunnel Setup Page

tunnel-setup-welcome = Witamy
tunnel-setup-choose-address = Wybierz bezpieczny adres internetowy swojej bramy:
tunnel-setup-opt-in = Chcę otrzymywać najnowsze informacje o nowych funkcjach i możliwościach zaangażowania.
tunnel-setup-create = Utwórz
tunnel-setup-skip = Pomiń
tunnel-setup-time-sync = Oczekiwanie na ustawienie zegara systemowego z Internetu. Rejestracja domeny prawdopodobnie się nie powiedzie, dopóki synchronizacja czasu nie nastąpi.

## Authorize Page

# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> chce uzyskać dostęp do twojej bramy w celu <<function>> urządzeń.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = z <<domain>>
authorize-monitor-and-control = monitorowania i kontroli
authorize-monitor = monitorowania
authorize-allow =
    .value = Pozwól
authorize-deny = Zabroń

## Local Token Page

local-token-your-token = Twój lokalny token jest następujący <a data-l10n-name="local-token-jwt">JSON Web Token</a>.

## Router Setup Page

router-setup-input-ssid =
    .placeholder = Nazwa sieci
router-setup-input-password =
    .placeholder = Hasło
router-setup-input-confirm-password =
    .placeholder = Potwierdź hasło
router-setup-create =
    .value = Utwórz
router-setup-password-mismatch = Hasła są niezgodne

## Wi-Fi Setup Page

wifi-setup-title = Konfiguracja Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Połączyć się z siecią Wi-Fi?
wifi-setup-input-password =
    .placeholder = Hasło
wifi-setup-show-password = Pokaż hasło
wifi-setup-connect =
    .value = Połącz
wifi-setup-network-icon =
    .alt = Sieć Wi-Fi
wifi-setup-skip = Pomiń

## Connecting to Wi-Fi Page

connecting-title = Łączenie z Wi-Fi — { -webthings-gateway-brand }
connecting-header = Łączenie z Wi-Fi…
connecting-warning = Uwaga: jeśli nie można załadować { $domain }, sprawdź adres IP bramy rzeczy na routerze.
connecting-header-skipped = Konfiguracja Wi-Fi została pominięta

## Creating Wi-Fi Network Page


## General Terms

ellipsis = …
edit = Edytuj
remove = Usuń
disconnected = Rozłączony
processing = Przetwarzanie…
submit = Zatwierdź

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Wstecz
submit-button =
    .aria-label = Zatwierdź
edit-button =
    .aria-label = Edytuj
save-button =
    .aria-label = Zapisz
