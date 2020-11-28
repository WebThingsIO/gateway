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

things-menu-item = Вещи
rules-menu-item = Правила
logs-menu-item = Журналы
floorplan-menu-item = План помещения
settings-menu-item = Настройки
log-out-button = Выйти

## Things

thing-details =
    .aria-label = Смотреть свойства
add-things =
    .aria-label = Добавить новые вещи

## Floorplan

upload-floorplan = Загрузить план помещения
upload-floorplan-hint = (рекомендуем использовать формат .svg)

## Top-Level Settings

settings-domain = Домен
settings-network = Сеть
settings-users = Пользователи
settings-add-ons = Дополнения
settings-adapters = Адаптеры
settings-localization = Локализация
settings-updates = Обновления
settings-authorizations = Авторизации
settings-experiments = Эксперименты
settings-developer = Разработчик

## Domain Settings

domain-settings-local-label = Локальный доступ
domain-settings-local-update = Обновить имя хоста
domain-settings-remote-access = Удаленный доступ
domain-settings-local-name =
    .placeholder = шлюз

## Network Settings

network-settings-unsupported = Сетевые настройки не поддерживаются для этой платформы.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Домашняя сеть
network-settings-internet-image =
    .alt = Интернет
network-settings-configure = Настройка
network-settings-internet-wan = Интернет (WAN)
network-settings-wan-mode = Режим
network-settings-home-network-lan = Домашняя сеть (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP-адрес
network-settings-dhcp = Автоматический (DHCP)
network-settings-static = Ручной (статический IP)
network-settings-pppoe = Мост (PPPoE)
network-settings-static-ip-address = Статический IP-адрес
network-settings-network-mask = Маска сети
network-settings-gateway = Шлюз
network-settings-done = Готово
network-settings-wifi-password =
    .placeholder = Пароль
network-settings-show-password = Показать пароль
network-settings-connect = Подключить
network-settings-username = Имя пользователя
network-settings-password = Пароль
network-settings-router-ip = IP-адрес маршрутизатора
network-settings-dhcp-server = DHCP-сервер
network-settings-enable-wifi = Включить Wi-Fi
network-settings-network-name = Имя сети (SSID)
wireless-connected = Подключено
wireless-icon =
    .alt = Сеть Wi-Fi
network-settings-changing = Изменение настроек сети. Это может занять некоторое время.
failed-ethernet-configure = Не удалось настроить Ethernet.
failed-wifi-configure = Не удалось настроить Wi-Fi.
failed-wan-configure = Не удалось настроить WAN.
failed-lan-configure = Не удалось настроить локальную сеть.
failed-wlan-configure = Не удалось настроить WLAN.

## User Settings

create-user =
    .aria-label = Добавить пользователя
user-settings-input-name =
    .placeholder = Имя
user-settings-input-email =
    .placeholder = Электронная почта
user-settings-input-password =
    .placeholder = Пароль
user-settings-input-totp =
    .placeholder = Код 2FA
user-settings-mfa-enable = Включить двухфакторную аутентификацию
user-settings-mfa-scan-code = Отсканируйте следующий код с помощью любого приложения двухфакторной аутентификации.
user-settings-mfa-secret = Это ваш новый ключ TOTP, в случае если вышеуказанный QR-код не сработает:
user-settings-mfa-error = Код аутентификации был неверным.
user-settings-mfa-enter-code = Введите ниже код из вашего приложения для аутентификации.
user-settings-mfa-verify = Подтвердить
user-settings-mfa-regenerate-codes = Перегенерировать резервные коды
user-settings-mfa-backup-codes = Это ваши резервные коды. Каждый из них может быть использован только один раз. Храните их в безопасном месте.
user-settings-input-new-password =
    .placeholder = Новый пароль (необязательно)
user-settings-input-confirm-new-password =
    .placeholder = Подтвердите новый пароль
user-settings-input-confirm-password =
    .placeholder = Подтвердите пароль
user-settings-password-mismatch = Пароли не совпадают
user-settings-save = Сохранить

## Adapter Settings

adapter-settings-no-adapters = Адаптеров нет.

## Authorization Settings

authorization-settings-no-authorizations = Авторизаций нет.

## Experiment Settings

experiment-settings-no-experiments = В настоящее время нет доступных экспериментов.

## Localization Settings

localization-settings-language-region = Язык и регион
localization-settings-country = Страна
localization-settings-timezone = Часовой пояс
localization-settings-language = Язык
localization-settings-units = Ед. измерения
localization-settings-units-temperature = Температура
localization-settings-units-temperature-celsius = По Цельсию (° C)
localization-settings-units-temperature-fahrenheit = По Фаренгейту (° F)

## Update Settings

update-settings-update-now = Обновить сейчас
update-available = Доступна новая версия
update-up-to-date = Установлено последнее обновление
updates-not-supported = Эта платформа не поддерживает обновления.
update-settings-enable-self-updates = Включить автоматические обновления
last-update = Последнее обновление
current-version = Текущая версия
failed = Не удалось
never = Никогда
in-progress = Выполняется
restarting = Перезапуск
checking-for-updates = Проверка наличия обновлений…
failed-to-check-for-updates = В данный момент невозможно проверить наличие обновлений.

## Developer Settings

developer-settings-enable-ssh = Включить SSH
developer-settings-view-internal-logs = Просмотр внутренних журналов
developer-settings-create-local-authorization = Создать локальную авторизацию

## Rules

add-rule =
    .aria-label = Создать правило
rules = Правила
rules-create-rule-hint = Нет созданных правил. Нажмите +, чтобы создать правило.
rules-rule-name = Название правила
rules-customize-rule-name-icon =
    .alt = Настройте имя правила
rules-rule-description = Описание правила
rules-preview-button =
    .alt = Предпросмотр
rules-delete-icon =
    .alt = Удалить
rules-drag-hint = Перетащите свои устройства сюда, чтобы создать правило
rules-drag-input-hint = Добавить устройство в качестве ввода
rules-drag-output-hint = Добавить устройство в качестве вывода
rules-scroll-left =
    .alt = Прокрутить влево
rules-scroll-right =
    .alt = Прокрутить вправо
rules-delete-prompt = Перетащите устройство сюда, чтобы отключить его
rules-delete-dialog = Удалить это правило навсегда?
rules-delete-cancel =
    .value = Отмена
rules-delete-confirm =
    .value = Удалить правило
rule-invalid = Недействителен
rule-delete-prompt = Удалить это правило навсегда?
rule-delete-cancel-button =
    .value = Отмена
rule-delete-confirm-button =
    .value = Удалить правило
rule-select-property = Выберите свойство
rule-not = Не
rule-event = Событие
rule-action = Действие
rule-configure = Настройка…
rule-time-title = Время суток
rule-notification = Уведомление
notification-title = Заголовок
notification-message = Сообщение
notification-level = Уровень
notification-low = Низкий
notification-normal = Средний
notification-high = Высокий
rule-name = Название правила

## Logs

add-log =
    .aria-label = Создать журнал
logs = Журналы
logs-create-log-hint = Журналы не созданы. Нажмите +, чтобы создать журнал.
logs-device = Устройство
logs-device-select =
    .aria-label = Журналировать устройство
logs-property = Свойство
logs-property-select =
    .aria-label = Журналировать свойство
logs-retention = Удержание
logs-retention-length =
    .aria-label = Журналировать продолжительность удержания
logs-retention-unit =
    .aria-label = Журналировать единицы удержания
logs-hours = Часы
logs-days = Дни
logs-weeks = Недели
logs-save = Сохранить
logs-remove-dialog-title = Удаление
logs-remove-dialog-warning = Удаление журнала также очистит его содержимое. Вы действительно хотите удалить его?
logs-remove = Удалить
logs-unable-to-create = Не удалось создать журнал
logs-server-remove-error = Ошибка сервера: не удалось удалить журнал

## Add New Things

add-thing-scanning-icon =
    .alt = Сканирование
add-thing-scanning = Поиск новых устройств…
add-thing-add-adapters-hint = Ничего не найдено. Попробуйте <a data-l10n-name="add-thing-add-adapters-hint-anchor">добавить дополнения</a>.
add-thing-add-by-url = Добавить по URL…
add-thing-done = Готово
add-thing-cancel = Отмена

## Context Menu

context-menu-choose-icon = Выберите значок…
context-menu-save = Сохранить
context-menu-remove = Удалить

## Capabilities

OnOffSwitch = Выключатель (вкл/выкл)
MultiLevelSwitch = Многоуровневый переключатель
ColorControl = Контроль цвета
ColorSensor = Датчик цвета
EnergyMonitor = Монитор энергопотребления
BinarySensor = Бинарный датчик
MultiLevelSensor = Многоуровневый датчик
SmartPlug = Умная розетка
Light = Свет
DoorSensor = Датчик двери
MotionSensor = Датчик движения
LeakSensor = Датчик утечки
PushButton = Кнопка
VideoCamera = Видеокамера
Camera = Камера
TemperatureSensor = Датчик температуры
HumiditySensor = Датчик влажности
Alarm = Сигнализация
Thermostat = Термостат
Lock = Замок
BarometricPressureSensor = Датчик барометрического давления
Custom = Кастомное устройство
Thing = Вещь
AirQualitySensor = Датчик качества воздуха
SmokeSensor = Датчик дыма

## Properties

alarm = Сигнализация
pushed = Нажато
not-pushed = Не нажато
on-off = Вкл/выкл
on = Вкл
off = Выкл
power = Питание
voltage = Напряжение
temperature = Температура
current = Ток
frequency = Частота
color = Цвет
brightness = Яркость
leak = Утечка
dry = Сухой
color-temperature = Цветовая температура
video-unsupported = Извините, ваш браузер не поддерживает видео.
motion = Движение
no-motion = Нет движения
open = Открыто
closed = Закрыто
locked = Заперто
unlocked = Незаперто
jammed = Застревание
unknown = Неизвестно
active = Активно
inactive = Неактивно
humidity = Влажность
concentration = Концентрация
density = Плотность
smoke = Дым

## Domain Setup

tunnel-setup-reclaim-domain = Похоже, вы уже зарегистрировали этот субдомен. Чтобы получить к нему доступ, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">нажмите здесь</a>.
check-email-for-token = Вставьте токен, который мы отправили вам по электронной почте.
reclaim-failed = Не удалось вернуть домен.
subdomain-already-used = Этот субдомен уже используется. Выберите другой.
invalid-subdomain = Неверный поддомен.
invalid-email = Некорректный адрес электронной почты.
invalid-reclamation-token = Неверный токен возврата.
domain-success = Получилось! Подождите, пока мы вас перенаправим…
issuing-error = Ошибка при выдаче сертификата. Попробуйте ещё раз.
redirecting = Перенаправление…

## Booleans

true = Истина
false = Ложь

## Time

utils-now = сейчас
utils-seconds-ago =
    { $value ->
        [one] { $value } секунду назад
        [few] { $value } секунды назад
       *[many] { $value } секунд назад
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } минуту назад
        [few] { $value } минуты назад
       *[many] { $value } минут назад
    }
utils-hours-ago =
    { $value ->
        [one] { $value } час назад
        [few] { $value } часа назад
       *[many] { $value } часов назад
    }
utils-days-ago =
    { $value ->
        [one] { $value } день назад
        [few] { $value } дня назад
       *[many] { $value } дней назад
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } неделю назад
        [few] { $value } недели назад
       *[many] { $value } недель назад
    }
utils-months-ago =
    { $value ->
        [one] { $value } месяц назад
        [few] { $value } месяца назад
       *[many] { $value } месяцев назад
    }
utils-years-ago =
    { $value ->
        [one] { $value } год назад
        [few] { $value } года назад
       *[many] { $value } лет назад
    }
minute = минут
hour = часов
day = дней
week = недель

## Unit Abbreviations

abbrev-volt = В
abbrev-hertz = Гц
abbrev-amp = А
abbrev-watt = Вт
abbrev-kilowatt-hour = кВт⋅ч
abbrev-percent = %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = К
abbrev-meter = м
abbrev-kilometer = км
abbrev-day = д
abbrev-hour = ч
abbrev-minute = м
abbrev-second = с
abbrev-millisecond = мс
abbrev-foot = фут
abbrev-micrograms-per-cubic-meter = мкг/м³
abbrev-hectopascal = гПа

## New Thing View

unknown-device-type = Неизвестный тип устройства
new-thing-choose-icon = Выберите значок…
new-thing-save = Сохранить
new-thing-pin =
    .placeholder = Введите PIN-код
new-thing-pin-error = Неверный PIN-код
new-thing-pin-invalid = Некорректный PIN-код
new-thing-cancel = Отмена
new-thing-submit = Отправить
new-thing-username =
    .placeholder = Введите имя пользователя
new-thing-password =
    .placeholder = Введите пароль
new-thing-credentials-error = Неверные учётные данные
new-thing-saved = Сохранено
new-thing-done = Готово

## New Web Thing View

new-web-thing-url =
    .placeholder = Введите URL устройства
new-web-thing-label = Веб-вещь
loading = Загрузка…
new-web-thing-multiple = Найдено несколько веб-вещей
new-web-thing-from = от

## Empty div Messages

no-things = Пока нет устройств. Нажмите «+» для поиска доступных устройств.
thing-not-found = Вещь не найдена.
action-not-found = Действие не найдено.
events-not-found = У этой вещи нет событий.

## Add-on Settings

add-addons =
    .aria-label = Найти новые дополнения
author-unknown = Неизвестно
disable = Отключить
enable = Включить
by = от
license = лицензия
addon-configure = Настройка
addon-update = Обновить
addon-remove = Удалить
addon-updating = Обновление…
addon-updated = Обновлено
addon-update-failed = Не удалось
addon-config-applying = Применение…
addon-config-apply = Применить
addon-discovery-added = Добавлено
addon-discovery-add = Добавить
addon-discovery-installing = Установка…
addon-discovery-failed = Не удалось
addon-search =
    .placeholder = Поиск

## Page Titles

settings = Настройки
domain = Домен
users = Пользователи
edit-user = Редактирование пользователя
add-user = Добавить пользователя
adapters = Адаптеры
addons = Дополнения
addon-config = Настройка дополнения
addon-discovery = Найдены новые дополнения
experiments = Эксперименты
localization = Локализация
updates = Обновления
authorizations = Авторизации
developer = Разработчик
network = Сеть
ethernet = Ethernet
wifi = Wi-Fi
icon = Значок

## Errors

unknown-state = Неизвестное состояние.
error = Ошибка
errors = Ошибки
gateway-unreachable = Шлюз недоступен
more-information = Подробнее
invalid-file = Неверный файл.
failed-read-file = Не удалось прочитать файл.
failed-save = Не удалось сохранить.

## Schema Form

unsupported-field = Неподдерживаемая схема поля

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Войти — { -webthings-gateway-brand }
login-log-in = Авторизоваться
login-wrong-credentials = Неверное имя пользователя или пароль.
login-wrong-totp = Код аутентификации был неверным.
login-enter-totp = Введите код из вашего приложения для аутентификации.

## Create First User Page

signup-title = Создать пользователя — { -webthings-gateway-brand }
signup-welcome = Добро пожаловать
signup-create-account = Создайте свой первый аккаунт:
signup-password-mismatch = Пароли не совпадают
signup-next = Далее

## Tunnel Setup Page

tunnel-setup-title = Выберите веб-адрес — { -webthings-gateway-brand }
tunnel-setup-welcome = Добро пожаловать
tunnel-setup-choose-address = Выберите безопасный адрес для вашего шлюза:
tunnel-setup-input-subdomain =
    .placeholder = субдомен
tunnel-setup-email-opt-in = Держать меня в курсе новостей о WebThings.
tunnel-setup-agree-privacy-policy = Примите <a data-l10n-name="tunnel-setup-privacy-policy-link">Политику конфиденциальности</a> и <a data-l10n-name="tunnel-setup-tos-link">Правила использования сервиса</a> WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Токен возврата
tunnel-setup-error = Произошла ошибка при настройке субдомена.
tunnel-setup-create = Создать
tunnel-setup-skip = Пропустить
tunnel-setup-time-sync = Ожидание установки системных часов из интернета. Без этого регистрация домена не удастся.

## Authorize Page

authorize-title = Запрос на авторизацию — { -webthings-gateway-brand }
authorize-authorization-request = Запрос на авторизацию
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> хочет получить доступ к вашему шлюзу на устройства <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = из <<domain>>
authorize-monitor-and-control = мониторинг и управление
authorize-monitor = мониторинг
authorize-allow-all = Разрешить для всех вещей
authorize-allow =
    .value = Разрешить
authorize-deny = Запретить

## Local Token Page

local-token-title = Локальная служба токенов — { -webthings-gateway-brand }
local-token-header = Локальная служба токенов
local-token-your-token = Ваш локальный токен <a data-l10n-name="local-token-jwt">Веб-токен JSON</a>.
local-token-use-it = Используйте его для общения со шлюзом, с <a data-l10n-name="local-token-bearer-type">Авторизация типа носителя</a>.
local-token-copy-token = Копировать токен

## Router Setup Page

router-setup-title = Настройка маршрутизатора — { -webthings-gateway-brand }
router-setup-header = Создать новую сеть Wi-Fi
router-setup-input-ssid =
    .placeholder = Имя сети
router-setup-input-password =
    .placeholder = Пароль
router-setup-input-confirm-password =
    .placeholder = Подтвердите пароль
router-setup-create =
    .value = Создать
router-setup-password-mismatch = Пароли должны совпадать

## Wi-Fi Setup Page

wifi-setup-title = Настройка Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Подключиться к сети Wi-Fi?
wifi-setup-input-password =
    .placeholder = Пароль
wifi-setup-show-password = Показать пароль
wifi-setup-connect =
    .value = Подключить
wifi-setup-network-icon =
    .alt = Сеть Wi-Fi
wifi-setup-skip = Пропустить

## Connecting to Wi-Fi Page

connecting-title = Подключение к Wi-Fi — { -webthings-gateway-brand }
connecting-header = Подключение к Wi-Fi…
connecting-connect =
    Пожалуйста, убедитесь, что вы подключены к той же сети, и
    перейдите по ссылке { $gateway-link } в браузере, чтобы продолжить установку.
connecting-warning = Примечание: если не удаётся загрузить { $domain }, попробуйте узнать IP-адрес шлюза на вашем роутере.
connecting-header-skipped = Настройка Wi-Fi пропущена
connecting-skipped =
    Шлюз сейчас запускается. Перейдите по ссылке
    { $gateway-link } в браузере, убедившись что вы подключены к той же сети,
    чтобы продолжить установку.

## Creating Wi-Fi Network Page

creating-title = Создание сети Wi-Fi — { -webthings-gateway-brand }
creating-header = Создание сети Wi-Fi…
creating-content = Подключитесь к { $ssid } с паролем, который вы только что создали, и перейдите по ссылке { $gateway-link } или { $ip-link } в браузере.

## UI Updates

ui-update-available = Доступен обновлённый пользовательский интерфейс.
ui-update-reload = Обновить
ui-update-close = Закрыть

## Transfer to webthings.io

action-required-image =
    .alt = Предупреждение
action-required = Требуются действия:
action-required-message = Служба удаленного доступа Mozilla IoT и автоматические обновления программного обеспечения прекратят свою работу. Выберите, хотите ли вы переходить на управляемый сообществом webthings.io для продолжения обслуживания.
action-required-more-info = Подробнее
action-required-dont-ask-again = Больше не спрашивать
action-required-choose = Выбрать
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Служба удаленного доступа Mozilla IoT и автоматические обновления программного обеспечения прекратят свою работу 31 декабря 2020 г. (<a data-l10n-name="transition-dialog-more-info">узнать больше</a>). Mozilla переводит проект на новый управляемый сообществом веб-сайт <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> (не связанный с Mozilla).<br><br>Если вы не хотите продолжать получать обновления программного обеспечения с серверов обновлений управляемых сообществом, вы можете отключить автоматические обновления в Настройках.<br><br>Если вы хотите перенести свой поддомен mozilla-iot.org на webthings.io, или зарегистрировать новый поддомен, вы можете заполнить форму ниже для регистрации замены службы удаленного доступа, запускаемой сообществом.
transition-dialog-register-domain-label = Зарегистрировать службу удаленного доступа webthings.io
transition-dialog-subdomain =
    .placeholder = Поддомен
transition-dialog-newsletter-label = Держать меня в курсе новостей о WebThings
transition-dialog-agree-tos-label = Примите <a data-l10n-name="transition-dialog-privacy-policy-link">Политику конфиденциальности</a> и <a data-l10n-name="transition-dialog-tos-link">Правила использования сервиса</a> WebThings.
transition-dialog-email =
    .placeholder = Адрес электронной почты
transition-dialog-register =
    .value = Зарегистрировать
transition-dialog-register-status =
    .alt = Статус регистрации
transition-dialog-register-label = Регистрация поддомена
transition-dialog-subscribe-status =
    .alt = Статус подписки на новостную рассылку
transition-dialog-subscribe-label = Подписка на новостную рассылку
transition-dialog-error-generic = Произошла ошибка. Пожалуйста вернитесь и попробуйте снова.
transition-dialog-error-subdomain-taken = Выбранный поддомен уже занят. Пожалуйста, вернитесь и выберите другой.
transition-dialog-error-subdomain-failed = Не удалось зарегистрировать поддомен. Пожалуйста вернитесь и попробуйте снова.
transition-dialog-error-subscribe-failed = Не удалось подписаться на новостную рассылку. Повторите попытку на <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Перейдите на <domain>, чтобы продолжить.

## General Terms

ok = ОК
ellipsis = …
event-log = Журнал событий
edit = Редактировать
remove = Удалить
disconnected = Отключено
processing = Обработка…
submit = Отправить

## Top-Level Buttons

menu-button =
    .aria-label = Меню
back-button =
    .aria-label = Назад
overflow-button =
    .aria-label = Дополнительные действия
submit-button =
    .aria-label = Отправить
edit-button =
    .aria-label = Редактировать
save-button =
    .aria-label = Сохранить
