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

things-menu-item = Справице
rules-menu-item = Правила
logs-menu-item = Записници
floorplan-menu-item = Тлоцрт
settings-menu-item = Подешавања
log-out-button = Одјава

## Things

thing-details =
    .aria-label = Погледај својства
add-things =
    .aria-label = Додај нове справице

## Floorplan

upload-floorplan = Отпреми тлоцрт…
upload-floorplan-hint = (препоручујемо .svg)

## Top-Level Settings

settings-domain = Домен
settings-network = Мрежа
settings-users = Корисници
settings-add-ons = Додаци
settings-adapters = Адаптери
settings-localization = Локализација
settings-updates = Ажурирања
settings-authorizations = Пуномоћја
settings-experiments = Експерименти
settings-developer = Програмер

## Domain Settings

domain-settings-local-label = Локални приступ
domain-settings-local-update = Ажурирај назив машине
domain-settings-remote-access = Удаљени приступ
domain-settings-local-name =
    .placeholder = prolaz

## Network Settings

network-settings-unsupported = Подешавања мреже нису подржана на овој платформи.
network-settings-ethernet-image =
    .alt = Жичана
network-settings-ethernet = Жичана (етернет)
network-settings-wifi-image =
    .alt = Бежична
network-settings-wifi = Бежична (вај-фај)
network-settings-home-network-image =
    .alt = Кућна мрежа
network-settings-internet-image =
    .alt = Интернет
network-settings-configure = Подеси
network-settings-internet-wan = Интернет (WAN)
network-settings-wan-mode = Режим
network-settings-home-network-lan = Кућна мрежа (LAN)
network-settings-wifi-wlan = Бежична (WLAN)
network-settings-ip-address = ИП адреса
network-settings-dhcp = Самостално (DHCP)
network-settings-static = Ручно (Статичка ИП)
network-settings-pppoe = Мост (PPPoE)
network-settings-static-ip-address = Статичка ИП адреса
network-settings-network-mask = Мрежна маска
network-settings-gateway = Мрежни пролаз
network-settings-done = Готово
network-settings-wifi-password =
    .placeholder = Лозинка
network-settings-show-password = Прикажи лозинку
network-settings-connect = Повежи се
network-settings-username = Корисничко
network-settings-password = Лозинка
network-settings-router-ip = ИП адреса рутера
network-settings-dhcp-server = DHCP сервер
network-settings-enable-wifi = Омогући бежичну
network-settings-network-name = Назив мреже (SSID)
wireless-connected = Повезан
wireless-icon =
    .alt = Бежична мрежа
network-settings-changing = Мењам подешавања мреже. Ово може потрајати који минут.
failed-ethernet-configure = Нисам успео да подесим жичану везу.
failed-wifi-configure = Нисам успео да подесим бежичну везу.
failed-wan-configure = Нисам успео да подесим WAN.
failed-lan-configure = Нисам успео да подесим LAN.
failed-wlan-configure = Нисам успео да подесим WLAN.

## User Settings

create-user =
    .aria-label = Додај новог корисника
user-settings-input-name =
    .placeholder = Име
user-settings-input-email =
    .placeholder = Е-адреса
user-settings-input-password =
    .placeholder = Лозинка
user-settings-input-totp =
    .placeholder = 2FA код
user-settings-mfa-enable = Омогућите двофакторску проверу идентитета
user-settings-mfa-scan-code = Скенирајте следећи код двофакторном апликацијом за аутентификацију.
user-settings-mfa-secret = Ово је ваш нови тајни TOTP токен, у случају да горњи QR код не ради:
user-settings-mfa-error = Код за проверу идентитета није исправан.
user-settings-mfa-enter-code = Унесите код апликације за аутентификацију доле.
user-settings-mfa-verify = Потврди
user-settings-mfa-regenerate-codes = Обновите резервне кодове
user-settings-mfa-backup-codes = Ово су ваши резервни кодови. Сваки код може се користити само једном. Држите их на сигурном месту.
user-settings-input-new-password =
    .placeholder = Нова лозинка (изборно)
user-settings-input-confirm-new-password =
    .placeholder = Потврди нову лозинку
user-settings-input-confirm-password =
    .placeholder = Потврди лозинку
user-settings-password-mismatch = Лозинке се не подударају
user-settings-save = Сачувај

## Adapter Settings

adapter-settings-no-adapters = Нема доступних адаптера.

## Authorization Settings

authorization-settings-no-authorizations = Нема пуномоћја.

## Experiment Settings

experiment-settings-no-experiments = Нема доступних експеримената, у овом тренутку.

## Localization Settings

localization-settings-language-region = Језик и област
localization-settings-country = Држава
localization-settings-timezone = Временска зона
localization-settings-language = Језик
localization-settings-units = Јединице
localization-settings-units-temperature = Температура
localization-settings-units-temperature-celsius = Целзијус (°C)
localization-settings-units-temperature-fahrenheit = Фаренхајт (°F)

## Update Settings

update-settings-update-now = Ажурирај сада
update-available = Ново издање је доступно
update-up-to-date = Ваш систем је ажуран
updates-not-supported = Ажурирања нису подржана на овој платформи.
update-settings-enable-self-updates = Омогући самостална ажурирања
last-update = Последње ажурирање
current-version = Тренутно издање
failed = Неуспешно
never = Никада
in-progress = У току
restarting = Поново покрећем
checking-for-updates = Провера надоградњи……
failed-to-check-for-updates = Тренутно није могуће проверити постојање надоградњи.

## Developer Settings

developer-settings-enable-ssh = Омогући SSH
developer-settings-view-internal-logs = Погледај интерне записнике
developer-settings-create-local-authorization = Направи локално пуномоћје

## Rules

add-rule =
    .aria-label = Направи ново правило
rules = Правила
rules-create-rule-hint = Нема направљених правила. Кликните на + за стварање новог.
rules-rule-name = Назив правила
rules-customize-rule-name-icon =
    .alt = Прилагоди назив правила
rules-rule-description = Опис правила
rules-preview-button =
    .alt = Претпреглед
rules-delete-icon =
    .alt = Обриши
rules-drag-hint = Превуците ваше уређаје овде да бисте започели стварање правила
rules-drag-input-hint = Додај уређај као улаз
rules-drag-output-hint = Додај уређај као излаз
rules-scroll-left =
    .alt = Превуци лево
rules-scroll-right =
    .alt = Превуци десно
rules-delete-prompt = Пустите уређаје овде да бисте их откачили
rules-delete-dialog = Да ли сте сигурни да желите трајно уклонити ово правило?
rules-delete-cancel =
    .value = Откажи
rules-delete-confirm =
    .value = Уклони правило
rule-invalid = Неисправно
rule-delete-prompt = Да ли сте сигурни да желите трајно уклонити ово правило?
rule-delete-cancel-button =
    .value = Откажи
rule-delete-confirm-button =
    .value = Уклони правило
rule-select-property = Изабери својство
rule-not = Негација
rule-event = Догађај
rule-action = Радња
rule-configure = Подеси…
rule-time-title = Време у току дана
rule-notification = Обавештење
notification-title = Наслов
notification-message = Порука
notification-level = Ниво
notification-low = Низак
notification-normal = Обичан
notification-high = Висок
rule-name = Назив правила

## Logs

add-log =
    .aria-label = Направи нови записник
logs = Записници
logs-create-log-hint = Нема направљених записника. Кликните на + да бисте направили записник.
logs-device = Уређај
logs-device-select =
    .aria-label = Записник уређаја
logs-property = Својство
logs-property-select =
    .aria-label = Својство записника
logs-retention = Чување
logs-retention-length =
    .aria-label = Дужина чувања записника
logs-retention-unit =
    .aria-label = Јединица чувања записника
logs-hours = Сати
logs-days = Дани
logs-weeks = Недеље
logs-save = Сачувај
logs-remove-dialog-title = Уклањам
logs-remove-dialog-warning = Уклањањем записника такође уклањате све његове податке. Да ли сте сигурно да га желите уклонити?
logs-remove = Уклони
logs-unable-to-create = Не могу да направим записник
logs-server-remove-error = Грешка на серверу: не могу да уклоним записник

## Add New Things

add-thing-scanning-icon =
    .alt = Претражујем
add-thing-scanning = Тражим нове уређаје…
add-thing-add-adapters-hint = Нема нових справица. Покушајте да <a data-l10n-name="add-thing-add-adapters-hint-anchor">додате неке додатке</a>.
add-thing-add-by-url = Додај преко URL-а…
add-thing-done = Готово
add-thing-cancel = Откажи

## Context Menu

context-menu-choose-icon = Изабери иконицу…
context-menu-save = Сачувај
context-menu-remove = Уклони

## Capabilities

OnOffSwitch = Прекидач
MultiLevelSwitch = Вишеположајни прекидач
ColorControl = Управљач температуре
ColorSensor = Сензор температуре
EnergyMonitor = Надгледач енергије
BinarySensor = Бинарни сензор
MultiLevelSensor = Вишеположајни сензор
SmartPlug = Паметна утичница
Light = Сијалица
DoorSensor = Сензор врата
MotionSensor = Сензор покрета
LeakSensor = Сензор цурења
PushButton = Потисно дугме
VideoCamera = Видео камера
Camera = Камера
TemperatureSensor = Сензор температуре
HumiditySensor = Сензор влажности
Alarm = Аларм
Thermostat = Термостат
Lock = Брава
BarometricPressureSensor = Сензор барометарског притиска
Custom = Прилагођена справица
Thing = Справица
AirQualitySensor = Сензор квалитета ваздуха

## Properties

alarm = Аларм
pushed = Притиснуто
not-pushed = Није притиснуто
on-off = Укљ./иск.
on = Укљ.
off = Иск.
power = Напајање
voltage = Волтажа
temperature = Температура
current = Струја
frequency = Фреквенција
color = Боја
brightness = Осветљење
leak = Цурење
dry = Сувост
color-temperature = Боја температуре
video-unsupported = Нажалост, видео није подржан у вашем прегледачу.
motion = Покрет
no-motion = Без покрета
open = Отворено
closed = Затворено
locked = Закључано
unlocked = Откључано
jammed = Заглављено
unknown = Непознато
active = Покренуто
inactive = У мировању
humidity = Влажност
concentration = Концентрација
density = Густина

## Domain Setup

tunnel-setup-reclaim-domain = Изгледа да сте већ регистровали овај поддомен. Да бисте га повратили <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">кликните овде</a>.
check-email-for-token = Проверите вашу е-пошту, потражите жетон за повраћај и унесите га изнад.
reclaim-failed = Нисам могао да повратим домен.
subdomain-already-used = Овај поддомен се већ користи. Изаберите други.
invalid-subdomain = Неисправан поддомен.
invalid-email = Неисправна адреса е-поште.
invalid-reclamation-token = Неисправан жетон за повраћај.
domain-success = Успех! Сачекајте док вас преусмеримо…
issuing-error = Грешка при издавањеу сертификата. Покушајте поново.
redirecting = Преусмеравам…

## Booleans

true = Тачно
false = Нетачно

## Time

utils-now = сада
utils-seconds-ago =
    { $value ->
        [one] { $value } секунд
        [few] { $value } секунде
       *[other] пре { $value } секунди
    }
utils-minutes-ago =
    { $value ->
        [one] пре { $value } минут
        [few] пре { $value } минута
       *[other] пре { $value } минута
    }
utils-hours-ago =
    { $value ->
        [one] пре { $value } сата
        [few] пре { $value } сата
       *[other] пре { $value } сати
    }
utils-days-ago =
    { $value ->
        [one] пре { $value } дан
        [few] пре { $value } дана
       *[other] пре { $value } дана
    }
utils-weeks-ago =
    { $value ->
        [one] пре { $value } недеље
        [few] пре { $value } недеље
       *[other] пре { $value } недеља
    }
utils-months-ago =
    { $value ->
        [one] пре { $value } месеца
        [few] пре { $value } месеца
       *[other] пре { $value } месеци
    }
utils-years-ago =
    { $value ->
        [one] пре { $value } године
        [few] пре { $value } године
       *[other] пре { $value } година
    }
minute = минут
hour = сат
day = дан
week = недеља

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
abbrev-day = д
abbrev-hour = ч
abbrev-minute = м
abbrev-second = с
abbrev-millisecond = мс
abbrev-foot = ст.
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Непозната врста уређаја
new-thing-choose-icon = Изабери иконицу…
new-thing-save = Сачувај
new-thing-pin =
    .placeholder = Унеси ПИН
new-thing-pin-error = Нетачан ПИН
new-thing-pin-invalid = Неисправан ПИН
new-thing-cancel = Откажи
new-thing-submit = Пошаљи
new-thing-username =
    .placeholder = Унеси корисничко
new-thing-password =
    .placeholder = Унеси лозинку
new-thing-credentials-error = Неисправни акредитиви
new-thing-saved = Сачувано
new-thing-done = Готово

## New Web Thing View

new-web-thing-url =
    .placeholder = Унесите адресу веб справице
new-web-thing-label = Веб справица
loading = Учитавам…
new-web-thing-multiple = Нађено је више веб справица
new-web-thing-from = из

## Empty div Messages

no-things = Још нема уређаја. Кликните на + да бисте потражили доступне уређаје.
thing-not-found = Справица није нађена.
action-not-found = Радња није нађена.
events-not-found = Ова справица нема догађаја.

## Add-on Settings

add-addons =
    .aria-label = Пронађи нове додатке
author-unknown = Непознато
disable = Онемогући
enable = Омогући
by = од стране
license = лиценца
addon-configure = Подеси
addon-update = Ажурирај
addon-remove = Уклони
addon-updating = Ажурирам…
addon-updated = Ажурно
addon-update-failed = Неуспело
addon-config-applying = Примењујем…
addon-config-apply = Примени
addon-discovery-added = Додато
addon-discovery-add = Додај
addon-discovery-installing = Инсталирам…
addon-discovery-failed = Неуспело
addon-search =
    .placeholder = Претражи

## Page Titles

settings = Подешавања
domain = Домен
users = Корисници
edit-user = Уреди корисника
add-user = Додај корисника
adapters = Адаптери
addons = Додаци
addon-config = Подеси додатак
addon-discovery = Откриј нове додатке
experiments = Експерименти
localization = Локализација
updates = Ажурирања
authorizations = Пумоноћја
developer = Програмер
network = Мрежа
ethernet = Жичана
wifi = Бежична
icon = Иконица

## Errors

unknown-state = Непознато стање.
error = Грешка
errors = Грешке
gateway-unreachable = Мрежни пролаз није доступан
more-information = Више података
invalid-file = Неисправна датотека.
failed-read-file = Нисам успео да прочитам датотеку.
failed-save = Нисам успео да сачувам.

## Schema Form

unsupported-field = Неподржана шема поља

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Пријава — { -webthings-gateway-brand }
login-log-in = Пријави ме
login-wrong-credentials = Корисничко име или лозинка нису исправни.
login-wrong-totp = Верификациони код није исправан.
login-enter-totp = Унесите код из апликације за аутентификацију.

## Create First User Page

signup-title = Направи корисника — { -webthings-gateway-brand }
signup-welcome = Добро дошли
signup-create-account = Направите ваш први кориснички налог:
signup-password-mismatch = Лозинке се не подударају
signup-next = Следеће

## Tunnel Setup Page

tunnel-setup-title = Изаберите веб адресу — { -webthings-gateway-brand }
tunnel-setup-welcome = Добро дошли
tunnel-setup-choose-address = Изаберите безбедну веб адресу за ваш мрежни пролаз:
tunnel-setup-input-subdomain =
    .placeholder = poddomen
tunnel-setup-email-opt-in = Обавештавајте ме о WebThings новостима.
tunnel-setup-agree-privacy-policy = Пристаните на WebThings<a data-l10n-name="tunnel-setup-privacy-policy-link">Политику приватности</a> и <a data-l10n-name="tunnel-setup-tos-link">Услове услуга</a>.
tunnel-setup-input-reclamation-token =
    .placeholder = Жетон за повраћај
tunnel-setup-error = Догодила се грешка приликом подешавања поддомена.
tunnel-setup-create = Направи
tunnel-setup-skip = Прескочи
tunnel-setup-time-sync = Чекам да се системско време подеси уз помоћ Интернета. Регистрација домена биће вероватно неуспешна док се ово прво не заврши.

## Authorize Page

authorize-title = Захтев за пуномоћје — { -webthings-gateway-brand }
authorize-authorization-request = Захтев за пуномоћје
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> жели да приступи вашем пролазу да би обављао радњу <<function>> над вашим уређајима.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = са домена <<domain>>
authorize-monitor-and-control = надгледао и управљао
authorize-monitor = управљао
authorize-allow-all = Дозволи за све справице
authorize-allow =
    .value = Дозволи
authorize-deny = Одбиј

## Local Token Page

local-token-title = Услуга локалног жетона — { -webthings-gateway-brand }
local-token-header = Услуга локалног жетона
local-token-your-token = Ово је ваш локални жетон <a data-l10n-name="local-token-jwt">JSON веб жетон</a>.
local-token-use-it = Користите га за безбедну комуникацију са овим мрежним пролазом, уз <a data-l10n-name="local-token-bearer-type">Bearer-type пуномоћје</a>.
local-token-copy-token = Копирај токен

## Router Setup Page

router-setup-title = Подешавање рутера — { -webthings-gateway-brand }
router-setup-header = Направите нову бежичну мрежу
router-setup-input-ssid =
    .placeholder = Назив мреже
router-setup-input-password =
    .placeholder = Лозинка
router-setup-input-confirm-password =
    .placeholder = Потврди лозинку
router-setup-create =
    .value = Направи
router-setup-password-mismatch = Лозинке се морају подударати

## Wi-Fi Setup Page

wifi-setup-title = Подешавање бежичне — { -webthings-gateway-brand }
wifi-setup-header = Повезати се на бежичну (вај-фај) мрежу?
wifi-setup-input-password =
    .placeholder = Лозинка
wifi-setup-show-password = Прикажи лозинку
wifi-setup-connect =
    .value = Повежи се
wifi-setup-network-icon =
    .alt = Бежична мрежа
wifi-setup-skip = Прескочи

## Connecting to Wi-Fi Page

connecting-title = Повезивање на бежичну — { -webthings-gateway-brand }
connecting-header = Повезујем се на бежичну мрежу…
connecting-connect = Постарајте се да сте повезани на исту мрежу и онда отворите { $gateway-link } у вашем веб прегледачу за наставак подешавања.
connecting-warning = Напомена: Уколико не можете да учитате страницу { $domain }, потражите ИП адресу вашег мрежног пролаза на вашем рутеру.
connecting-header-skipped = Подешавање бежичне мреже прескочено
connecting-skipped = Мрежни пролаз се управо покреће. Отворите { $gateway-link } у вашем веб прегледачу док сте повезани на исту мрежу на којој се налази ваш мрежни пролаз за наставак подешавања.

## Creating Wi-Fi Network Page

creating-title = Стварање бежичне мреже — { -webthings-gateway-brand }
creating-header = Правим бежичну мрежу…
creating-content = Повежите се на мрежу { $ssid } са лозинком коју сте управо направили, па онда отворите страницу { $gateway-link } или ИП адресу { $ip-link } у вашем веб прегледачу.

## UI Updates

ui-update-available = Новији кориснички интерфејс је доступан.
ui-update-reload = Поново учитај
ui-update-close = Затвори

## General Terms

ok = У реду
ellipsis = …
event-log = Записник догађаја
edit = Уреди
remove = Уклони
disconnected = Откачено
processing = Обрађујем…
submit = Пошаљи

## Top-Level Buttons

menu-button =
    .aria-label = Мени
back-button =
    .aria-label = Назад
overflow-button =
    .aria-label = Додатне радње
submit-button =
    .aria-label = Пошаљи
edit-button =
    .aria-label = Уреди
save-button =
    .aria-label = Сачувај
