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
user-settings-mfa-enable = Увімкнути дворівневу автентифікацію
user-settings-mfa-scan-code = Зчитайте цей код будь-якою програмою дворівневої автентифікації.
user-settings-mfa-secret = Це ваш новий таємний ключ TOTP, на випадок, якщо QR-код не працює:
user-settings-mfa-error = Код автентифікації був неправильним.
user-settings-mfa-enter-code = Введіть код із програми автентифікації далі.
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
Alarm = Сигналізація
Thermostat = Термостат
Lock = Замок
Custom = Власна річ
Thing = Річ

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

## Domain Setup


## Booleans


## Time


## Unit Abbreviations


## New Thing View


## New Web Thing View


## Empty div Messages


## Add-on Settings


## Page Titles


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


## UI Updates


## General Terms


## Top-Level Buttons

