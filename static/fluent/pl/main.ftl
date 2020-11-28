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

things-menu-item = Rzeczy
rules-menu-item = Reguły
logs-menu-item = Dzienniki
floorplan-menu-item = Plan pomieszczeń
settings-menu-item = Ustawienia
log-out-button = Wyloguj się

## Things

thing-details =
    .aria-label = Wyświetl właściwości
add-things =
    .aria-label = Dodaj nowe rzeczy

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
user-settings-input-totp =
    .placeholder = Kod 2FA
user-settings-mfa-enable = Włącz uwierzytelnianie dwuskładnikowe
user-settings-mfa-scan-code = Zeskanuj poniższy kod za pomocą dowolnej aplikacji do uwierzytelniania dwuskładnikowego.
user-settings-mfa-secret = To nowy sekret TOTP, na wypadek gdyby powyższy kod QR nie zadziałał:
user-settings-mfa-error = Kod uwierzytelniający jest niepoprawny.
user-settings-mfa-enter-code = Wpisz kod z aplikacji uwierzytelniającej poniżej.
user-settings-mfa-verify = Zweryfikuj
user-settings-mfa-regenerate-codes = Ponownie utwórz kody zapasowe
user-settings-mfa-backup-codes = To kody zapasowe. Każdego z nich można użyć tylko raz. Przechowuj je w bezpiecznym miejscu.
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

experiment-settings-no-experiments = W tej chwili nie ma żadnych dostępnych eksperymentów.

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
update-available = Dostępna jest nowa wersja.
update-up-to-date = System jest aktualny.
updates-not-supported = Aktualizacje nie są obsługiwane na tej platformie.
update-settings-enable-self-updates = Włącz automatyczne aktualizacje
last-update = Ostatnia aktualizacja
current-version = Obecna wersja
failed = Niepowodzenie
never = Nigdy
in-progress = W trakcie…
restarting = Ponowne uruchamianie…
checking-for-updates = Wyszukiwanie aktualizacji…
failed-to-check-for-updates = W tej chwili nie można wyszukać aktualizacji.

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
    .aria-label = Utwórz nowy dziennik
logs = Dzienniki
logs-create-log-hint = Nie utworzono dzienników. Kliknij +, aby utworzyć dziennik.
logs-device = Urządzenie
logs-device-select =
    .aria-label = Rejestrowane urządzenie
logs-property = Właściwość
logs-property-select =
    .aria-label = Rejestrowana właściwość
logs-retention = Przechowywanie
logs-retention-length =
    .aria-label = Czas przechowywania dziennika
logs-retention-unit =
    .aria-label = Jednostka przechowywania dziennika
logs-hours = Godziny
logs-days = Dni
logs-weeks = Tygodnie
logs-save = Zapisz
logs-remove-dialog-title = Usuwanie
logs-remove-dialog-warning = Usunięcie dziennika spowoduje również usunięcie wszystkich jego danych. Czy na pewno go usunąć?
logs-remove = Usuń
logs-unable-to-create = Nie można utworzyć dziennika
logs-server-remove-error = Błąd serwera: nie można usunąć dziennika

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
HumiditySensor = Czujnik wilgotności
Alarm = Alarm
Thermostat = Termostat
Lock = Zamek
BarometricPressureSensor = Czujnik ciśnienia atmosferycznego
Custom = Inna rzecz
Thing = Rzecz
AirQualitySensor = Czujnik jakości powietrza
SmokeSensor = Czujnik dymu

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
humidity = Wilgotność
concentration = Stężenie
density = Gęstość
smoke = Dym

## Domain Setup

tunnel-setup-reclaim-domain = Już zarejestrowano tę poddomenę. Aby ją odzyskać, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">kliknij tutaj</a>.
check-email-for-token = Sprawdź, czy w skrzynce e-mail jest token odzyskiwania i wklej go powyżej.
reclaim-failed = Nie można odzyskać poddomeny.
subdomain-already-used = Ta poddomena jest już używana. Proszę wybrać inną.
invalid-subdomain = Nieprawidłowa poddomena.
invalid-email = Nieprawidłowy adres e-mail.
invalid-reclamation-token = Nieprawidłowy token odzyskiwania.
domain-success = Udało się! Poczekaj na przekierowanie…
issuing-error = Błąd podczas wydawania certyfikatu. Proszę spróbować ponownie.
redirecting = Przekierowywanie…

## Booleans

true = Prawda
false = Fałsz

## Time

utils-now = teraz
utils-seconds-ago =
    { $value ->
        [one] { $value } sekunda temu
        [few] { $value } sekundy temu
       *[many] { $value } sekund temu
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minuta temu
        [few] { $value } minuty temu
       *[many] { $value } minut temu
    }
utils-hours-ago =
    { $value ->
        [one] { $value } godzina temu
        [few] { $value } godziny temu
       *[many] { $value } godzin temu
    }
utils-days-ago =
    { $value ->
        [one] { $value } dzień temu
        [few] { $value } dni temu
       *[many] { $value } dni temu
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } tydzień temu
        [few] { $value } tygodnie temu
       *[many] { $value } tygodni temu
    }
utils-months-ago =
    { $value ->
        [one] { $value } miesiąc temu
        [few] { $value } miesiące temu
       *[many] { $value } miesięcy temu
    }
utils-years-ago =
    { $value ->
        [one] { $value } rok temu
        [few] { $value } lata temu
       *[many] { $value } lat temu
    }
minute = Minuta
hour = Godzina
day = Dzień
week = Tydzień

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
abbrev-day = d.
abbrev-hour = godz.
abbrev-minute = min
abbrev-second = sek.
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Nieznany typ urządzenia
new-thing-choose-icon = Wybierz ikonę…
new-thing-save = Zapisz
new-thing-pin =
    .placeholder = Wpisz PIN
new-thing-pin-error = Niepoprawny PIN
new-thing-pin-invalid = Nieprawidłowy PIN
new-thing-cancel = Anuluj
new-thing-submit = Wyślij
new-thing-username =
    .placeholder = Wpisz nazwę użytkownika
new-thing-password =
    .placeholder = Wpisz hasło
new-thing-credentials-error = Niepoprawne dane uwierzytelniające
new-thing-saved = Zapisano
new-thing-done = Gotowe

## New Web Thing View

new-web-thing-url =
    .placeholder = Wpisz adres URL rzeczy
new-web-thing-label = Web Thing
loading = Wczytywanie…
new-web-thing-multiple = Znaleziono wiele rzeczy
new-web-thing-from = z

## Empty div Messages

no-things = Nie ma jeszcze urządzeń. Kliknij +, aby wyszukać dostępne urządzenia.
thing-not-found = Nie odnaleziono rzeczy.
action-not-found = Nie odnaleziono działania.
events-not-found = Ta rzecz nie ma zdarzeń.

## Add-on Settings

add-addons =
    .aria-label = Znajdź nowe dodatki
author-unknown = Nieznany
disable = Wyłącz
enable = Włącz
by = autor
license = licencja
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
addon-search =
    .placeholder = Szukaj

## Page Titles

settings = Ustawienia
domain = Domena
users = Użytkownicy
edit-user = Edytuj użytkownika
add-user = Dodaj użytkownika
adapters = Adaptery
addons = Dodatki
addon-config = Konfiguruj dodatek
addon-discovery = Odkrywaj nowe dodatki
experiments = Eksperymenty
localization = Lokalizacja
updates = Aktualizacje
authorizations = Upoważnienia
developer = Programista
network = Sieć
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikona

## Errors

unknown-state = Nieznany stan.
error = Błąd
errors = Błędy
gateway-unreachable = Brama jest niedostępna
more-information = Więcej informacji
invalid-file = Nieprawidłowy plik.
failed-read-file = Odczytanie pliku się nie powiodło.
failed-save = Zapisanie pliku się nie powiodło.

## Schema Form

unsupported-field = Nieobsługiwany schemat pola

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Logowanie — { -webthings-gateway-brand }
login-log-in = Zaloguj się
login-wrong-credentials = Nazwa użytkownika lub hasło jest niepoprawne.
login-wrong-totp = Kod uwierzytelniający jest niepoprawny.
login-enter-totp = Wpisz kod z aplikacji uwierzytelniającej.

## Create First User Page

signup-title = Tworzenie użytkownika — { -webthings-gateway-brand }
signup-welcome = Witamy
signup-create-account = Utwórz swoje pierwsze konto użytkownika:
signup-password-mismatch = Hasła są niezgodne
signup-next = Dalej

## Tunnel Setup Page

tunnel-setup-title = Wybór adresu internetowego — { -webthings-gateway-brand }
tunnel-setup-welcome = Witamy
tunnel-setup-choose-address = Wybierz bezpieczny adres internetowy swojej bramy:
tunnel-setup-input-subdomain =
    .placeholder = poddomena
tunnel-setup-email-opt-in = Informuj mnie na bieżąco o nowościach na temat WebThings.
tunnel-setup-agree-privacy-policy = Wyrażam zgodę na <a data-l10n-name="tunnel-setup-privacy-policy-link">zasady ochrony prywatności</a> i <a data-l10n-name="tunnel-setup-tos-link">warunki korzystania z usługi</a> WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Token odzyskiwania
tunnel-setup-error = Wystąpił błąd podczas konfigurowania poddomeny.
tunnel-setup-create = Utwórz
tunnel-setup-skip = Pomiń
tunnel-setup-time-sync = Oczekiwanie na ustawienie zegara systemowego z Internetu. Rejestracja domeny prawdopodobnie się nie powiedzie do czasu ukończenia tego procesu.

## Authorize Page

authorize-title = Prośba o upoważnienie — { -webthings-gateway-brand }
authorize-authorization-request = Prośba o upoważnienie
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> chce uzyskać dostęp do bramy w celu <<function>> urządzeń.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = z <<domain>>
authorize-monitor-and-control = monitorowania i kontroli
authorize-monitor = monitorowania
authorize-allow-all = Zezwól dla wszystkich rzeczy
authorize-allow =
    .value = Zezwól
authorize-deny = Odmów

## Local Token Page

local-token-title = Usługa lokalnych tokenów — { -webthings-gateway-brand }
local-token-header = Usługa lokalnych tokenów
local-token-your-token = Lokalny token to ten <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Użyj go, aby bezpiecznie komunikować się z bramą za pomocą <a data-l10n-name="local-token-bearer-type">upoważnienia na okaziciela</a>.
local-token-copy-token = Kopiuj token

## Router Setup Page

router-setup-title = Konfiguracja routera — { -webthings-gateway-brand }
router-setup-header = Utwórz nową sieć Wi-Fi
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
wifi-setup-header = Połączyć się z siecią Wi-Fi?
wifi-setup-input-password =
    .placeholder = Hasło
wifi-setup-show-password = Pokaż hasło
wifi-setup-connect =
    .value = Połącz
wifi-setup-network-icon =
    .alt = Sieć Wi-Fi
wifi-setup-skip = Pomiń

## Connecting to Wi-Fi Page

connecting-title = Łączenie z Wi-Fi — { -webthings-gateway-brand }
connecting-header = Łączenie z Wi-Fi…
connecting-connect = Upewnij się, że połączono z tą samą siecią, a następnie przejdź do { $gateway-link } w przeglądarce, aby kontynuować konfigurację.
connecting-warning = Uwaga: jeśli nie można wczytać { $domain }, sprawdź adres IP bramy na routerze.
connecting-header-skipped = Pominięto konfigurację Wi-Fi
connecting-skipped = Brama jest teraz uruchamiana. Po podłączeniu do tej samej sieci co brama przejdź do { $gateway-link } w przeglądarce, aby kontynuować konfigurację.

## Creating Wi-Fi Network Page

creating-title = Tworzenie sieci Wi-Fi — { -webthings-gateway-brand }
creating-header = Tworzenie sieci Wi-Fi…
creating-content = Połącz się z { $ssid } za pomocą właśnie utworzonego hasła, a następnie przejdź do { $gateway-link } lub { $ip-link } w przeglądarce.

## UI Updates

ui-update-available = Dostępny jest zaktualizowany interfejs użytkownika.
ui-update-reload = Odśwież
ui-update-close = Zamknij

## Transfer to webthings.io

action-required-image =
    .alt = Ostrzeżenie
action-required = Wymagane działanie:
action-required-message = Usługa zdalnego dostępu i automatyczne aktualizacje oprogramowania Mozilla IoT są zamykane. Wybierz, czy przenieść się do projektu webthings.io prowadzonego przez społeczność, aby dalej korzystać z usługi.
action-required-more-info = Więcej informacji
action-required-dont-ask-again = Nie pytaj ponownie
action-required-choose = Wybierz
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Usługa zdalnego dostępu i automatyczne aktualizacje oprogramowania Mozilla IoT zostaną zamknięte 31 grudnia 2020 r. (<a data-l10n-name="transition-dialog-more-info">więcej informacji</a>). Mozilla przenosi usługę do nowego projektu <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> prowadzonego przez społeczność (niepowiązanego z Mozillą). <br><br>Jeśli nie chcesz dalej otrzymywać aktualizacji oprogramowania z serwerów aktualizacji prowadzonych przez społeczność, możesz wyłączyć automatyczne aktualizacje w ustawieniach. <br><br>Jeśli chcesz przenieść swoją poddomenę mozilla-iot.org do webthings.io lub zarejestrować nową, możesz wypełnić poniższy formularz, aby zarejestrować się w zastępczej usłudze zdalnego dostępu prowadzonej przez społeczność.
transition-dialog-register-domain-label = Zarejestruj się w usłudze zdalnego dostępu webthings.io
transition-dialog-subdomain =
    .placeholder = Poddomena
transition-dialog-newsletter-label = Informuj mnie na bieżąco o nowościach na temat WebThings
transition-dialog-agree-tos-label = Wyrażam zgodę na <a data-l10n-name="transition-dialog-privacy-policy-link">zasady ochrony prywatności</a> i <a data-l10n-name="transition-dialog-tos-link">warunki korzystania z usługi</a> WebThings.
transition-dialog-email =
    .placeholder = Adres e-mail
transition-dialog-register =
    .value = Zarejestruj się
transition-dialog-register-status =
    .alt = Stan rejestracji
transition-dialog-register-label = Rejestrowanie poddomeny
transition-dialog-subscribe-status =
    .alt = Stan subskrypcji biuletynu
transition-dialog-subscribe-label = Subskrybowanie biuletynu
transition-dialog-error-generic = Wystąpił błąd. Proszę wrócić i spróbować ponownie.
transition-dialog-error-subdomain-taken = Wybrana poddomena jest już zajęta. Proszę wrócić i wybrać inną.
transition-dialog-error-subdomain-failed = Zarejestrowanie poddomeny się nie powiodło. Proszę wrócić i spróbować ponownie.
transition-dialog-error-subscribe-failed = Subskrypcja biuletynu się nie powiodła. Proszę spróbować ponownie w serwisie <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Przejdź do <<domain>>, aby kontynuować.

## General Terms

ok = OK
ellipsis = …
event-log = Dziennik zdarzeń
edit = Edytuj
remove = Usuń
disconnected = Rozłączono
processing = Przetwarzanie…
submit = Wyślij

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Wstecz
overflow-button =
    .aria-label = Dodatkowe działania
submit-button =
    .aria-label = Wyślij
edit-button =
    .aria-label = Edytuj
save-button =
    .aria-label = Zapisz
