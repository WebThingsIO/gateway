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

things-menu-item = Речі
rules-menu-item = Правила
logs-menu-item = Журнали
floorplan-menu-item = План приміщення
settings-menu-item = Налаштування
log-out-button = Вийти

## Things

thing-details =
    .aria-label = Переглянути властивості
add-things =
    .aria-label = Додати нові речі

## Floorplan

upload-floorplan = Завантажити план приміщення…
upload-floorplan-hint = (рекомендовано, у форматі .svg)

## Top-Level Settings

settings-domain = Домен
settings-network = Мережа
settings-users = Користувачі
settings-add-ons = Додатки
settings-adapters = Перехідники
settings-localization = Локалізація
settings-updates = Оновлення
settings-authorizations = Дозволені зʼєднання
settings-experiments = Експерименти
settings-developer = Розробник

## Domain Settings

domain-settings-local-label = Локальний доступ
domain-settings-local-update = Оновіть назву хоста
domain-settings-remote-access = Віддалений доступ
domain-settings-local-name =
    .placeholder = шлюз

## Network Settings

network-settings-unsupported = Налаштування мережі не підтримують цю платформу.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Домашня мережа
network-settings-internet-image =
    .alt = Інтернет
network-settings-configure = Налаштувати
network-settings-internet-wan = Інтернет (WAN)
network-settings-wan-mode = Режим
network-settings-home-network-lan = Домашня мережа (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-адреса
network-settings-dhcp = Автоматичний (DHCP)
network-settings-static = Ручний (статичний IP)
network-settings-pppoe = Міст (PPPoE)
network-settings-static-ip-address = Статична IP-адреса
network-settings-network-mask = Маска мережі
network-settings-gateway = Шлюз
network-settings-done = Готово
network-settings-wifi-password =
    .placeholder = Пароль
network-settings-show-password = Показати пароль
network-settings-connect = З'єднатися
network-settings-username = Ім'я користувача
network-settings-password = Пароль
network-settings-router-ip = IP-адреса маршрутизатора
network-settings-dhcp-server = DHCP-сервер
network-settings-enable-wifi = Увімкнути Wi-Fi
network-settings-network-name = Назва мережі (SSID)
wireless-connected = З'єднано
wireless-icon =
    .alt = Мережа Wi-Fi
network-settings-changing = Зміна налаштувань мережі. Це може тривати хвильку.
failed-ethernet-configure = Не вдалося налаштувати Ethernet.
failed-wifi-configure = Не вдалося налаштувати Wi-Fi.
failed-wan-configure = Не вдалося налаштувати WAN.
failed-lan-configure = Не вдалося налаштувати локальну мережу (LAN).
failed-wlan-configure = Не вдалося налаштувати WLAN.

## User Settings

create-user =
    .aria-label = Додати нового користувача
user-settings-input-name =
    .placeholder = Ім'я
user-settings-input-email =
    .placeholder = Електронна пошта
user-settings-input-password =
    .placeholder = Пароль
user-settings-input-totp =
    .placeholder = Код дворівневої автентифікації
user-settings-mfa-enable = Увімкнути двоетапну перевірку
user-settings-mfa-scan-code = Скануйте цей код будь-якою програмою двоетапної перевірки.
user-settings-mfa-secret = Це ваш новий таємний ключ TOTP, на випадок, якщо QR-код не працює:
user-settings-mfa-error = Код автентифікації був неправильним.
user-settings-mfa-enter-code = Введіть внизу код із програми автентифікації.
user-settings-mfa-verify = Перевірити
user-settings-mfa-regenerate-codes = Створити нові коди відновлення
user-settings-mfa-backup-codes = Це ваші коди відновлення. Кожним з них, можна скористатися лише один раз. Зберігайте їх у безпечному місці.
user-settings-input-new-password =
    .placeholder = Новий пароль (необов’язково)
user-settings-input-confirm-new-password =
    .placeholder = Підтвердити новий пароль
user-settings-input-confirm-password =
    .placeholder = Підтвердити пароль
user-settings-password-mismatch = Паролі не збігаються
user-settings-save = Зберегти

## Adapter Settings

adapter-settings-no-adapters = Перехідників немає.

## Authorization Settings

authorization-settings-no-authorizations = Немає дозволених зʼєднань.

## Experiment Settings

experiment-settings-no-experiments = Наразі, немає доступних експериментів.

## Localization Settings

localization-settings-language-region = Мова та регіон
localization-settings-country = Країна
localization-settings-timezone = Часовий пояс
localization-settings-language = Мова
localization-settings-units = Одиниці виміру
localization-settings-units-temperature = Температура
localization-settings-units-temperature-celsius = Градуси Цельсія (°C)
localization-settings-units-temperature-fahrenheit = Градуси Фаренгейта (°F)

## Update Settings

update-settings-update-now = Оновити зараз
update-available = Доступна нова версія.
update-up-to-date = Ваша система оновлена.
updates-not-supported = Оновлення не підтримуються на цій платформі.
update-settings-enable-self-updates = Увімкнути автоматичне оновлення
last-update = Останнє оновлення
current-version = Поточна версія
failed = Стався збій
never = Ніколи
in-progress = Поступ…
restarting = Перезапуск…
checking-for-updates = Перевірка оновлень…
failed-to-check-for-updates = Наразі неможливо перевірити наявність оновлень.

## Developer Settings

developer-settings-enable-ssh = Увімкнути SSH
developer-settings-view-internal-logs = Переглянути внутрішні журнали
developer-settings-create-local-authorization = Створити локальну авторизацію

## Rules

add-rule =
    .aria-label = Створити нове правило
rules = Правила
rules-create-rule-hint = Правил не створено. Натисніть +, щоби створити правило.
rules-rule-name = Назва правила
rules-customize-rule-name-icon =
    .alt = Налаштувати назву правила
rules-rule-description = Опис правила
rules-preview-button =
    .alt = Попередній перегляд
rules-delete-icon =
    .alt = Видалити
rules-drag-hint = Перетягніть сюди свої пристрої, щоби почати створювати правило
rules-drag-input-hint = Додати пристрій як входовий
rules-drag-output-hint = Додати пристрій як виходовий
rules-scroll-left =
    .alt = Прокрутити ліворуч
rules-scroll-right =
    .alt = Прокрутити праворуч
rules-delete-prompt = Перетягніть пристрій сюди, щоби відʼєднати
rules-delete-dialog = Ви дійсно хочете вилучити це правило назавжди?
rules-delete-cancel =
    .value = Скасувати
rules-delete-confirm =
    .value = Вилучити правило
rule-invalid = Недійсне
rule-delete-prompt = Ви дійсно хочете вилучити це правило назавжди?
rule-delete-cancel-button =
    .value = Скасувати
rule-delete-confirm-button =
    .value = Вилучити правило
rule-select-property = Виберіть властивість
rule-not = Немає
rule-event = Подія
rule-action = Дія
rule-configure = Налаштувати…
rule-time-title = Час доби
rule-notification = Сповіщення
notification-title = Заголовок
notification-message = Повідомлення
notification-level = Рівень
notification-low = Низький
notification-normal = Звичайний
notification-high = Високий
rule-name = Назва правила

## Logs

add-log =
    .aria-label = Створити новий журнал
logs = Журнали
logs-create-log-hint = Журнали не створено. Натисніть +, щоби створити журнал.
logs-device = Пристрій
logs-device-select =
    .aria-label = Пристрій журналу
logs-property = Властивість
logs-property-select =
    .aria-label = Властивість журналу
logs-retention = Зберігання
logs-retention-length =
    .aria-label = Тривалість зберігання журналу
logs-retention-unit =
    .aria-label = Одиниці тривалості зберігання журналу
logs-hours = Годин
logs-days = Днів
logs-weeks = Тижнів
logs-save = Зберегти
logs-remove-dialog-title = Вилучення
logs-remove-dialog-warning = Вилучення журналу також очистить усі його дані. Ви впевнені, що хочете вилучити його?
logs-remove = Вилучити
logs-unable-to-create = Не вдається створити журнал
logs-server-remove-error = Помилка сервера: не вдається вилучити журнал

## Add New Things

add-thing-scanning-icon =
    .alt = Пошук
add-thing-scanning = Пошук нових пристроїв…
add-thing-add-adapters-hint = Нових речей не знайдено. Спробуйте <a data-l10n-name="add-thing-add-adapters-hint-anchor">додати кілька додатків</a>.
add-thing-add-by-url = Додати за допомогою URL-адреси…
add-thing-done = Готово
add-thing-cancel = Скасувати

## Context Menu

context-menu-choose-icon = Вибрати піктограму…
context-menu-save = Зберегти
context-menu-remove = Вилучити

## Capabilities

OnOffSwitch = Вимикач
MultiLevelSwitch = Багаторівневий перемикач
ColorControl = Керування кольором
ColorSensor = Датчик кольору
EnergyMonitor = Монітор енергоспоживання
BinarySensor = Двійковий датчик
MultiLevelSensor = Багаторівневий датчик
SmartPlug = Інтелектуальний роз'єм
Light = Світло
DoorSensor = Датчик дверей
MotionSensor = Датчик руху
LeakSensor = Датчик витоку
PushButton = Кнопка
VideoCamera = Відеокамера
Camera = Камера
TemperatureSensor = Датчик температури
HumiditySensor = Датчик вологості
Alarm = Сигналізація
Thermostat = Термостат
Lock = Замок
BarometricPressureSensor = Барометричний датчик тиску
Custom = Власна річ
Thing = Річ
AirQualitySensor = Датчик якості повітря
SmokeSensor = Датчик диму

## Properties

alarm = Сигналізація
pushed = Натиснуто
not-pushed = Не натиснуто
on-off = Увімк./вимк.
on = Увімкнено
off = Вимкнено
power = Потужність
voltage = Напруга
temperature = Температура
current = Струм
frequency = Частота
color = Колір
brightness = Яскравість
leak = Витік
dry = Сухий
color-temperature = Температура кольору
video-unsupported = На жаль, відео не підтримується вашим браузером.
motion = Рух
no-motion = Немає руху
open = Відкрито
closed = Закрито
locked = Замкнено
unlocked = Відімкнуто
jammed = Заклинило
unknown = Невідомо
active = Активний
inactive = Неактивний
humidity = Вологість
concentration = Насиченість
density = Щільність
smoke = Дим

## Domain Setup

tunnel-setup-reclaim-domain = Схоже, ви вже зареєстрували цей піддомен. Щоби відновити доступ до нього, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">натисніть сюди</a>.
check-email-for-token = Будь ласка, перевірте вашу електронну пошту на наявність токена відновлення та вставте його вище.
reclaim-failed = Не вдалося відновити доступ до домену.
subdomain-already-used = Цей піддомен вже використовується. Будь ласка, виберіть інший.
invalid-subdomain = Недійсний піддомен.
invalid-email = Неправильна адреса електронної пошти.
invalid-reclamation-token = Недійсний токен відновлення.
domain-success = Вдалося! Зачекайте, поки ми перенаправимо вас…
issuing-error = Помилка видачі сертифіката. Будь ласка, спробуйте ще раз.
redirecting = Перенаправлення…

## Booleans

true = Істинно
false = Не істинно

## Time

utils-now = зараз
utils-seconds-ago =
    { $value ->
        [one] { $value } секунду тому
        [few] { $value } секунди тому
       *[many] { $value } секунд тому
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } хвилину тому
        [few] { $value } хвилини тому
       *[many] { $value } хвилин тому
    }
utils-hours-ago =
    { $value ->
        [one] { $value } годину тому
        [few] { $value } години тому
       *[many] { $value } годин тому
    }
utils-days-ago =
    { $value ->
        [one] { $value } день тому
        [few] { $value } дні тому
       *[many] { $value } днів тому
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } тиждень тому
        [few] { $value } тижні тому
       *[many] { $value } тижнів тому
    }
utils-months-ago =
    { $value ->
        [one] { $value } місяць тому
        [few] { $value } місяці тому
       *[many] { $value } місяців тому
    }
utils-years-ago =
    { $value ->
        [one] { $value } рік тому
        [few] { $value } роки тому
       *[many] { $value } років тому
    }
minute = хвилина
hour = година
day = день
week = тиждень

## Unit Abbreviations

abbrev-volt = В
abbrev-hertz = Гц
abbrev-amp = А
abbrev-watt = Вт
abbrev-kilowatt-hour = кВт⋅год
abbrev-percent = %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = К
abbrev-meter = м
abbrev-kilometer = км
abbrev-day = д
abbrev-hour = год.
abbrev-minute = хв.
abbrev-second = с
abbrev-millisecond = мс
abbrev-foot = фут
abbrev-micrograms-per-cubic-meter = мкг/м³
abbrev-hectopascal = ГПа

## New Thing View

unknown-device-type = Невідомий тип пристрою
new-thing-choose-icon = Вибрати піктограму…
new-thing-save = Зберегти
new-thing-pin =
    .placeholder = Введіть PIN
new-thing-pin-error = Неправильний PIN-код
new-thing-pin-invalid = Недійсний PIN-код
new-thing-cancel = Скасувати
new-thing-submit = Надіслати
new-thing-username =
    .placeholder = Введіть ім’я користувача
new-thing-password =
    .placeholder = Введіть пароль
new-thing-credentials-error = Неправильні дані
new-thing-saved = Збережено
new-thing-done = Готово

## New Web Thing View

new-web-thing-url =
    .placeholder = Введіть URL-адресу інтернет-речі
new-web-thing-label = Інтернет-річ
loading = Завантаження…
new-web-thing-multiple = Знайдено кілька інтернет-речей
new-web-thing-from = з

## Empty div Messages

no-things = Ще немає пристроїв. Натисніть +, щоби знайти наявні пристрої.
thing-not-found = Річ не знайдено.
action-not-found = Дію не знайдено.
events-not-found = Ця річ не має подій.

## Add-on Settings

add-addons =
    .aria-label = Знайти нові додатки
author-unknown = Невідомо
disable = Вимкнути
enable = Увімкнути
by = від
license = ліцензія
addon-configure = Налаштувати
addon-update = Оновити
addon-remove = Вилучити
addon-updating = Оновлення…
addon-updated = Оновлено
addon-update-failed = Стався збій
addon-config-applying = Застосовується…
addon-config-apply = Застосувати
addon-discovery-added = Додано
addon-discovery-add = Додати
addon-discovery-installing = Встановлення…
addon-discovery-failed = Стався збій
addon-search =
    .placeholder = Шукати

## Page Titles

settings = Параметри
domain = Домен
users = Користувачі
edit-user = Керувати користувачем
add-user = Додати користувача
adapters = Перехідники
addons = Додатки
addon-config = Налаштувати додаток
addon-discovery = Відкрийте для себе нові додатки
experiments = Експерименти
localization = Локалізація
updates = Оновлення
authorizations = Дозволені зʼєднання
developer = Розробник
network = Мережа
ethernet = Ethernet
wifi = Wi-Fi
icon = Піктограма

## Errors

unknown-state = Невідомий стан.
error = Помилка
errors = Помилки
gateway-unreachable = Шлюз недоступний
more-information = Докладніше
invalid-file = Недійсний файл.
failed-read-file = Не вдалося прочитати файл.
failed-save = Не вдалося зберегти.

## Schema Form

unsupported-field = Непідтримувана схема поля

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Вхід — { -webthings-gateway-brand }
login-log-in = Увійти
login-wrong-credentials = Ім'я користувача або пароль були неправильними.
login-wrong-totp = Код автентифікації був неправильним.
login-enter-totp = Введіть код із програми автентифікації.

## Create First User Page

signup-title = Створити користувача — { -webthings-gateway-brand }
signup-welcome = Вітаємо
signup-create-account = Створіть свій перший обліковий запис користувача:
signup-password-mismatch = Паролі не збігаються
signup-next = Далі

## Tunnel Setup Page

tunnel-setup-title = Виберіть адресу в мережі — { -webthings-gateway-brand }
tunnel-setup-welcome = Вітаємо
tunnel-setup-choose-address = Виберіть безпечну мережну адресу для вашого шлюзу:
tunnel-setup-input-subdomain =
    .placeholder = піддомен
tunnel-setup-email-opt-in = Тримати мене в курсі новин про WebThings.
tunnel-setup-agree-privacy-policy = Погодьтеся з <a data-l10n-name="tunnel-setup-privacy-policy-link">Політикою приватности</a> та <a data-l10n-name="tunnel-setup-tos-link">Умовами обслуговування</a> WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Токен відновлення
tunnel-setup-error = Під час налаштування піддомену сталася помилка.
tunnel-setup-create = Створити
tunnel-setup-skip = Пропустити
tunnel-setup-time-sync = Чекаємо встановлення системного годинника з Інтернету. Реєстрація домену, ймовірно, не вдасться, до завершення цієї дії.

## Authorize Page

authorize-title = Запит дозволу на зʼєднання — { -webthings-gateway-brand }
authorize-authorization-request = Запит дозволу на зʼєднання
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> хоче отримати доступ до вашого шлюзу на <<function>> пристроях.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = з <<domain>>
authorize-monitor-and-control = спостерігати та керувати
authorize-monitor = спостерігати
authorize-allow-all = Дозволити для всіх речей
authorize-allow =
    .value = Дозволити
authorize-deny = Заборонити

## Local Token Page

local-token-title = Локальна служба токенів — { -webthings-gateway-brand }
local-token-header = Локальна служба токенів
local-token-your-token = Вашим локальним токеном є цей <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Застосовуйте його для безпечного звʼязку зі шлюзом, <a data-l10n-name="local-token-bearer-type">надавши дозвіл на зʼєднання цьому типу носія</a>.
local-token-copy-token = Копіювати маркер

## Router Setup Page

router-setup-title = Налаштування маршрутизатора — { -webthings-gateway-brand }
router-setup-header = Створити нову мережу Wi-Fi
router-setup-input-ssid =
    .placeholder = Назва мережі
router-setup-input-password =
    .placeholder = Пароль
router-setup-input-confirm-password =
    .placeholder = Підтвердити пароль
router-setup-create =
    .value = Створити
router-setup-password-mismatch = Паролі повинні збігатися

## Wi-Fi Setup Page

wifi-setup-title = Налаштування Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Зʼєднатися з мережею Wi-Fi?
wifi-setup-input-password =
    .placeholder = Пароль
wifi-setup-show-password = Показати пароль
wifi-setup-connect =
    .value = З'єднатися
wifi-setup-network-icon =
    .alt = Мережа Wi-Fi
wifi-setup-skip = Пропустити

## Connecting to Wi-Fi Page

connecting-title = Зʼєднання з Wi-Fi — { -webthings-gateway-brand }
connecting-header = Зʼєднання з Wi-Fi…
connecting-connect = Переконайтеся, що ви зʼєднані з однаковою мережею та перейдіть до { $gateway-link } у своєму браузері, щоби продовжити налаштування.
connecting-warning = Примітка. Якщо ви не можете завантажити { $domain }, знайдіть IP-адресу шлюзу на вашому маршрутизаторі.
connecting-header-skipped = Налаштування Wi-Fi пропущено
connecting-skipped = Зараз шлюз запускається. Перейдіть до { $gateway-link } у вашому браузері, зʼєднавшись з тією ж мережею, що і шлюз, щоби продовжити налаштування.

## Creating Wi-Fi Network Page

creating-title = Створення Wi-Fi мережі — { -webthings-gateway-brand }
creating-header = Створення Wi-Fi мережі…
creating-content = З'єднайтеся з { $ssid } за допомогою паролю, який ви щойно створили, а потім перейдіть до { $gateway-link } або { $ip-link } у вашому браузері.

## UI Updates

ui-update-available = Доступний оновлений інтерфейс користувача.
ui-update-reload = Перезавантажити
ui-update-close = Закрити

## Transfer to webthings.io

action-required-image =
    .alt = Попередження
action-required = Вимагається дія:
action-required-message = Служба зовнішнього доступу Mozilla IoT та автоматичне оновлення програмного забезпечення припиняються. Виберіть, чи переходити до вебспільноти webthings.io для подальшого обслуговування.
action-required-more-info = Докладніше
action-required-dont-ask-again = Більше не питати
action-required-choose = Вибрати
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Служба зовнішнього доступу Mozilla IoT та автоматичне оновлення програмного забезпечення припиняються 31 грудня 2020 року <a data-l10n-name="transition-dialog-more-info">докладніше</a>). Mozilla переводить проєкт до нової спільноти <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> (не пов'язана з Mozilla).<br><br>Якщо ви не бажаєте надалі отримувати оновлення програмного забезпечення із серверів оновлень спільноти, ви можете вимкнути автоматичне оновлення в налаштуваннях.<br><br> Якщо ви хочете перенести свій піддомен mozilla-iot.org на webthings.io, зареєструйте новий піддомен, ви можете заповнити форму внизу, щоб зареєструватися до замісної служби зовнішнього доступу, яку запускає спільнота.
transition-dialog-register-domain-label = Зареєструватися до служби зовнішнього доступу webthings.io
transition-dialog-subdomain =
    .placeholder = Піддомен
transition-dialog-newsletter-label = Повідомляти мені новини про WebThings.
transition-dialog-agree-tos-label = Погодитеся з <a data-l10n-name="transition-dialog-privacy-policy-link">Політикою приватности</a> та <a data-l10n-name="transition-dialog-tos-link">Умовами обслуговування</a> WebThings.
transition-dialog-email =
    .placeholder = Адреса електронної пошти
transition-dialog-register =
    .value = Зареєструватися
transition-dialog-register-status =
    .alt = Стан реєстрації
transition-dialog-register-label = Реєстрація піддомену
transition-dialog-subscribe-status =
    .alt = Стан підписки на розсилку
transition-dialog-subscribe-label = Підписка на розсилку
transition-dialog-error-generic = Сталася помилка. Поверніться і спробуйте ще раз.
transition-dialog-error-subdomain-taken = Вибраний піддомен уже зайнятий. Поверніться назад і виберіть інший.
transition-dialog-error-subdomain-failed = Не вдалося зареєструвати піддомен. Поверніться і спробуйте ще раз.
transition-dialog-error-subscribe-failed = Не вдалося підписатися на розсилку. Повторіть спробу на <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Перейдіть до <<domain>>, щоб продовжити.

## General Terms

ok = Гаразд
ellipsis = …
event-log = Журнал подій
edit = Змінити
remove = Вилучити
disconnected = Від'єднано
processing = Обробка…
submit = Надіслати

## Top-Level Buttons

menu-button =
    .aria-label = Меню
back-button =
    .aria-label = Назад
overflow-button =
    .aria-label = Додаткові дії
submit-button =
    .aria-label = Надіслати
edit-button =
    .aria-label = Змінити
save-button =
    .aria-label = Зберегти
