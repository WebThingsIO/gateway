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

things-menu-item = Things
rules-menu-item = 規則
logs-menu-item = 紀錄
floorplan-menu-item = 樓層規劃
settings-menu-item = 設定
log-out-button = 登出

## Things

thing-details =
    .aria-label = 檢視屬性
add-things =
    .aria-label = 新增 Things

## Floorplan

upload-floorplan = 上傳樓層規劃平面圖…
upload-floorplan-hint = （建議使用 .svg 格式）

## Top-Level Settings

settings-domain = 網域
settings-network = 網路
settings-users = 使用者
settings-add-ons = 附加元件
settings-adapters = 轉接器
settings-localization = 在地化
settings-updates = 更新
settings-authorizations = 授權
settings-experiments = 實驗
settings-developer = 開發者

## Domain Settings

domain-settings-local-label = 本地存取
domain-settings-local-update = 更新主機名稱
domain-settings-remote-access = 遠端存取
domain-settings-local-name =
    .placeholder = 閘道器

## Network Settings

network-settings-unsupported = 不支援於此平台設定網路。
network-settings-ethernet-image =
    .alt = 乙太網路
network-settings-ethernet = 乙太網路
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = 家庭網路
network-settings-internet-image =
    .alt = 網際網路
network-settings-configure = 設定
network-settings-internet-wan = 網際網路（WAN）
network-settings-wan-mode = 模式
network-settings-home-network-lan = 家庭網路（LAN）
network-settings-wifi-wlan = Wi-Fi（WLAN）
network-settings-ip-address = IP 地址
network-settings-dhcp = 自動取得（DHCP）
network-settings-static = 手動設定（靜態 IP）
network-settings-pppoe = 橋接連線（PPPoE）
network-settings-static-ip-address = 靜態 IP 地址
network-settings-network-mask = 網路遮罩
network-settings-gateway = 閘道器
network-settings-done = 完成
network-settings-wifi-password =
    .placeholder = 密碼
network-settings-show-password = 顯示密碼
network-settings-connect = 連線
network-settings-username = 使用者名稱
network-settings-password = 密碼
network-settings-router-ip = 路由器 IP 地址
network-settings-dhcp-server = DHCP 伺服器
network-settings-enable-wifi = 開啟 Wi-Fi
network-settings-network-name = 無線網路名稱（SSID）
wireless-connected = 已連線
wireless-icon =
    .alt = Wi-Fi 網路
network-settings-changing = 正在更改網路設定，可能要花一分鐘時間。
failed-ethernet-configure = 乙太網路設定失敗。
failed-wifi-configure = Wi-Fi 設定失敗。
failed-wan-configure = WAN 設定失敗。
failed-lan-configure = LAN 設定失敗。
failed-wlan-configure = WLAN 設定失敗。

## User Settings

create-user =
    .aria-label = 新增使用者
user-settings-input-name =
    .placeholder = 使用者名稱
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = 密碼
user-settings-input-totp =
    .placeholder = 2FA 代碼
user-settings-mfa-enable = 開啟兩階段驗證
user-settings-mfa-scan-code = 請使用任何兩階段驗證程式掃描下列條碼。
user-settings-mfa-secret = 若上面的 QR Code 無法使用，可使用下列 TOTP 密鑰:
user-settings-mfa-error = 驗證碼不正確。
user-settings-mfa-enter-code = 請在下面輸入來自驗證程式的驗證碼。
user-settings-mfa-verify = 驗證
user-settings-mfa-regenerate-codes = 重新產生備用代碼
user-settings-mfa-backup-codes = 以下是您的備用代碼。每一組只能使用一次，請將它們保存在安全之處。
user-settings-input-new-password =
    .placeholder = 新密碼（選填）
user-settings-input-confirm-new-password =
    .placeholder = 確認新密碼
user-settings-input-confirm-password =
    .placeholder = 確認密碼
user-settings-password-mismatch = 密碼不符合
user-settings-save = 儲存

## Adapter Settings

adapter-settings-no-adapters = 沒有存在的轉接器。

## Authorization Settings

authorization-settings-no-authorizations = 未授權。

## Experiment Settings

experiment-settings-no-experiments = 目前沒有可進行的實驗。

## Localization Settings

localization-settings-language-region = 語言與地區
localization-settings-country = 國家
localization-settings-timezone = 時區
localization-settings-language = 語言
localization-settings-units = 單位
localization-settings-units-temperature = 溫度
localization-settings-units-temperature-celsius = 攝氏（℃）
localization-settings-units-temperature-fahrenheit = 華氏（℉）

## Update Settings

update-settings-update-now = 立即更新
update-available = 有新版本可以使用
update-up-to-date = 您已更新到最新版本
updates-not-supported = 此平台不支援更新。
update-settings-enable-self-updates = 開啟自動更新
last-update = 最近更新
current-version = 目前版本
failed = 失敗
never = 永不
in-progress = 進行中
restarting = 正在重新啟動
checking-for-updates = 正在檢查更新…
failed-to-check-for-updates = 目前無法檢查更新。

## Developer Settings

developer-settings-enable-ssh = 開啟 SSH
developer-settings-view-internal-logs = 檢視內部紀錄
developer-settings-create-local-authorization = 建立本機授權

## Rules

add-rule =
    .aria-label = 建立新規則
rules = 規則
rules-create-rule-hint = 未建立規則，點擊 + 號建立新規則。
rules-rule-name = 規則名稱
rules-customize-rule-name-icon =
    .alt = 自訂規則名稱
rules-rule-description = 規則描述
rules-preview-button =
    .alt = 預覽
rules-delete-icon =
    .alt = 刪除
rules-drag-hint = 將裝置放於此處即可建立規則
rules-drag-input-hint = 新增裝置作為輸入端
rules-drag-output-hint = 新增裝置作為輸出端
rules-scroll-left =
    .alt = 向左捲動
rules-scroll-right =
    .alt = 向右捲動
rules-delete-prompt = 將裝置放於此處即可斷線
rules-delete-dialog = 您確定要永久刪除此規則嗎？
rules-delete-cancel =
    .value = 取消
rules-delete-confirm =
    .value = 刪除規則
rule-invalid = 無效
rule-delete-prompt = 您確定要永久刪除此規則嗎？
rule-delete-cancel-button =
    .value = 取消
rule-delete-confirm-button =
    .value = 刪除規則
rule-select-property = 選擇屬性
rule-not = 非
rule-event = 事件
rule-action = 動作
rule-configure = 設定…
rule-time-title = 一天中的時間
rule-notification = 通知
notification-title = 標題
notification-message = 訊息
notification-level = 等級
notification-low = 低
notification-normal = 標準
notification-high = 高
rule-name = 規則名稱

## Logs

add-log =
    .aria-label = 建立新紀錄
logs = 紀錄
logs-create-log-hint = 未建立紀錄，點擊 + 號建立新紀錄規則。
logs-device = 裝置
logs-device-select =
    .aria-label = 紀錄裝置
logs-property = 屬性
logs-property-select =
    .aria-label = 紀錄屬性
logs-retention = 保留
logs-retention-length =
    .aria-label = 紀錄保留長度
logs-retention-unit =
    .aria-label = 紀錄保留單位
logs-hours = 小時
logs-days = 天
logs-weeks = 週
logs-save = 儲存
logs-remove-dialog-title = 刪除中
logs-remove-dialog-warning = 刪除紀錄的同時也會清除所有紀錄資料，確定嗎？
logs-remove = 刪除
logs-unable-to-create = 無法建立紀錄檔
logs-server-remove-error = 伺服器錯誤: 無法刪除紀錄

## Add New Things

add-thing-scanning-icon =
    .alt = 掃描中
add-thing-scanning = 正在掃描新裝置…
add-thing-add-adapters-hint = 沒有找到新 things。請試試 <a data-l10n-name="add-thing-add-adapters-hint-anchor">安裝附加元件</a>。
add-thing-add-by-url = 透過網址新增…
add-thing-done = 完成
add-thing-cancel = 取消

## Context Menu

context-menu-choose-icon = 選擇圖示…
context-menu-save = 儲存
context-menu-remove = 刪除

## Capabilities

OnOffSwitch = 二元開關
MultiLevelSwitch = 多階開關
ColorControl = 色彩控制
ColorSensor = 色彩感應器
EnergyMonitor = 能源監控器
BinarySensor = 二元感應器
MultiLevelSensor = 多階感應器
SmartPlug = 智慧插座
Light = 燈光
DoorSensor = 門窗感應器
MotionSensor = 動態感應器
LeakSensor = 滲漏感應器
PushButton = 按鈕
VideoCamera = 視訊攝影機
Camera = 攝影機
TemperatureSensor = 溫度感應器
HumiditySensor = 濕度感應器
Alarm = 警報器
Thermostat = 溫度控制器
Lock = 鎖
BarometricPressureSensor = 氣壓感應器
Custom = 自訂 Thing
Thing = Thing
AirQualitySensor = 空氣品質感應器
SmokeSensor = 煙霧感應器

## Properties

alarm = 警報
pushed = 按下
not-pushed = 未按下
on-off = 開/關
on = 開
off = 關
power = 電源
voltage = 電壓
temperature = 溫度
current = 電流
frequency = 頻率
color = 色彩
brightness = 亮度
leak = 洩漏
dry = 乾燥
color-temperature = 色溫
video-unsupported = 很抱歉，您的瀏覽器不支援影片。
motion = 移動
no-motion = 未移動
open = 開啟
closed = 關閉
locked = 鎖定
unlocked = 未鎖定
jammed = 卡住
unknown = 未知
active = 啟用
inactive = 未啟用
humidity = 濕度
concentration = 濃度
density = 密度
smoke = 煙霧

## Domain Setup

tunnel-setup-reclaim-domain = 看來您已經註冊過該網域了。若要取回繼續使用，請<a data-l10n-name="tunnel-setup-reclaim-domain-click-here">點擊此處</a>。
check-email-for-token = 請到信箱尋找先前收到的網域取回代碼，並複製貼到上面的欄位。
reclaim-failed = 無法取回網域。
subdomain-already-used = 這個子網域已經有人使用，請改用其他名稱。
invalid-subdomain = 子網域無效。
invalid-email = 電子郵件信箱無效。
invalid-reclamation-token = 網域取回代碼無效。
domain-success = 成功！請稍候跳轉到新網頁…
issuing-error = 簽發憑證時發生錯誤，請再試一次。
redirecting = 重導中…

## Booleans

true = True
false = False

## Time

utils-now = 現在
utils-seconds-ago =
    { $value ->
       *[other] { $value } 秒前
    }
utils-minutes-ago =
    { $value ->
       *[other] { $value } 分鐘前
    }
utils-hours-ago =
    { $value ->
       *[other] { $value } 小時前
    }
utils-days-ago =
    { $value ->
       *[other] { $value } 天前
    }
utils-weeks-ago =
    { $value ->
       *[other] { $value } 週前
    }
utils-months-ago =
    { $value ->
       *[other] { $value } 個月前
    }
utils-years-ago =
    { $value ->
       *[other] { $value } 年前
    }
minute = 分鐘
hour = 小時
day = 天
week = 週

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
abbrev-kilowatt-hour = kW⋅h
abbrev-percent = %
abbrev-fahrenheit = ℉
abbrev-celsius = ℃
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

unknown-device-type = 未知裝置類型
new-thing-choose-icon = 選擇圖示…
new-thing-save = 儲存
new-thing-pin =
    .placeholder = 輸入 PIN
new-thing-pin-error = PIN 錯誤
new-thing-pin-invalid = PIN 無效
new-thing-cancel = 取消
new-thing-submit = 送出
new-thing-username =
    .placeholder = 輸入使用者名稱
new-thing-password =
    .placeholder = 輸入密碼
new-thing-credentials-error = 帳號密碼不正確
new-thing-saved = 已儲存
new-thing-done = 完成

## New Web Thing View

new-web-thing-url =
    .placeholder = 輸入 web thing 網址
new-web-thing-label = Web Thing
loading = 載入中…
new-web-thing-multiple = 找到多組 web things
new-web-thing-from = 來自

## Empty div Messages

no-things = 還沒有裝置，點擊 + 號掃描可用裝置。
thing-not-found = 找不到 Thing。
action-not-found = 找不到可用的動作。
events-not-found = 這個 thing 沒有事件。

## Add-on Settings

add-addons =
    .aria-label = 尋找新的附加元件
author-unknown = 未知
disable = 停用
enable = 啟用
by = 作者:
license = 授權條款
addon-configure = 設定
addon-update = 更新
addon-remove = 刪除
addon-updating = 更新中…
addon-updated = 已更新
addon-update-failed = 失敗
addon-config-applying = 套用中…
addon-config-apply = 套用
addon-discovery-added = 已新增
addon-discovery-add = 新增
addon-discovery-installing = 安裝中…
addon-discovery-failed = 失敗
addon-search =
    .placeholder = 搜尋

## Page Titles

settings = 設定
domain = 網域
users = 使用者
edit-user = 編輯使用者
add-user = 新增使用者
adapters = 轉接器
addons = 附加元件
addon-config = 設定附加元件
addon-discovery = 探索新附加元件
experiments = 實驗
localization = 在地化
updates = 更新
authorizations = 授權
developer = 開發者
network = 網路
ethernet = 乙太網路
wifi = Wi-Fi
icon = 圖示

## Errors

unknown-state = 未知狀態。
error = 錯誤
errors = 錯誤
gateway-unreachable = 無法連線至閘道器
more-information = 更多資訊
invalid-file = 檔案無效。
failed-read-file = 檔案讀取失敗。
failed-save = 儲存失敗。

## Schema Form

unsupported-field = 不支援的欄位格式

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = 登入 — { -webthings-gateway-brand }
login-log-in = 登入
login-wrong-credentials = 使用者名稱或密碼不正確。
login-wrong-totp = 驗證碼不正確。
login-enter-totp = 輸入來自驗證程式的驗證碼。

## Create First User Page

signup-title = 建立使用者 — { -webthings-gateway-brand }
signup-welcome = 歡迎
signup-create-account = 建立第一組使用者帳號:
signup-password-mismatch = 密碼不符合
signup-next = 下一步

## Tunnel Setup Page

tunnel-setup-title = 選擇網址 — { -webthings-gateway-brand }
tunnel-setup-welcome = 歡迎
tunnel-setup-choose-address = 為您的閘道器挑選一組安全網址:
tunnel-setup-input-subdomain =
    .placeholder = 子網域
tunnel-setup-email-opt-in = 隨時告訴我 WebThings 的新鮮事。
tunnel-setup-agree-privacy-policy = 同意 WebThings 的<a data-l10n-name="tunnel-setup-privacy-policy-link">隱私權保護政策</a>與<a data-l10n-name="tunnel-setup-tos-link">服務條款</a>。
tunnel-setup-input-reclamation-token =
    .placeholder = 網域取回代碼
tunnel-setup-error = 設定子網域時發生錯誤。
tunnel-setup-create = 建立
tunnel-setup-skip = 略過
tunnel-setup-time-sync = 正在進行網路對時。若未完成此步驟，網域名稱可能會註冊失敗。

## Authorize Page

authorize-title = 授權要求 — { -webthings-gateway-brand }
authorize-authorization-request = 授權要求
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> 想要存取您閘道器當中的 <<function>> 裝置。
# Use <<domain>> to indicate where the domain should be placed
authorize-source = 來自 <<domain>>
authorize-monitor-and-control = 監控並控制
authorize-monitor = 監控
authorize-allow-all = 允許使用所有 Things
authorize-allow =
    .value = 允許
authorize-deny = 拒絕

## Local Token Page

local-token-title = 本機授權服務 — { -webthings-gateway-brand }
local-token-header = 本機授權服務
local-token-your-token = 下列 <a data-l10n-name="local-token-jwt">JSON Web Token</a> 是您的本機授權碼:
local-token-use-it = 請使用此授權碼，透過 <a data-l10n-name="local-token-bearer-type">Bearer-type 驗證方式</a>來安全地與閘道器溝通。
local-token-copy-token = 複製 Token

## Router Setup Page

router-setup-title = 路由器設定 — { -webthings-gateway-brand }
router-setup-header = 建立新 Wi-Fi 網路
router-setup-input-ssid =
    .placeholder = 網路名稱
router-setup-input-password =
    .placeholder = 密碼
router-setup-input-confirm-password =
    .placeholder = 確認密碼
router-setup-create =
    .value = 建立
router-setup-password-mismatch = 密碼必須符合

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi 設定 — { -webthings-gateway-brand }
wifi-setup-header = 要連線到 Wi-Fi 網路嗎？
wifi-setup-input-password =
    .placeholder = 密碼
wifi-setup-show-password = 顯示密碼
wifi-setup-connect =
    .value = 連線
wifi-setup-network-icon =
    .alt = Wi-Fi 網路
wifi-setup-skip = 略過

## Connecting to Wi-Fi Page

connecting-title = 連線到 Wi-Fi 網路 — { -webthings-gateway-brand }
connecting-header = 連線到 Wi-Fi 網路…
connecting-connect = 請確認您連線到與閘道器相同的網路，並使用瀏覽器開啟 { $gateway-link } 繼續設定。
connecting-warning = 若您無法載入 { $domain }，請確認路由器當中的閘道器 IP 地址。
connecting-header-skipped = 略過 Wi-Fi 設定
connecting-skipped = 正在啟動閘道器。請確認您連線到與閘道器相同的網路，並使用瀏覽器開啟 { $gateway-link } 繼續設定。

## Creating Wi-Fi Network Page

creating-title = 建立 Wi-Fi 網路 — { -webthings-gateway-brand }
creating-header = 建立 Wi-Fi 網路…
creating-content = 請使用您剛剛建立的密碼連線到 { $ssid } 網路，然後使用瀏覽器開啟 { $gateway-link } 或 { $ip-link }。

## UI Updates

ui-update-available = 已提供使用者介面更新。
ui-update-reload = 重新載入
ui-update-close = 關閉

## Transfer to webthings.io

action-required-image =
    .alt = 警告
action-required = 需要採取行動:
action-required-message = 將不再提供 Mozilla IoT 遠端存取服務與軟體自動更新服務。請選擇是否要轉移到由社群維護的 webthings.io 服務。
action-required-more-info = 更多資訊
action-required-dont-ask-again = 不要再問我。
action-required-choose = 選擇
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Mozilla IoT 遠端存取服務與軟體自動更新服務將在 2020 年 12 月 31 日後結束營運（<a data-l10n-name="transition-dialog-more-info">了解更多</a>）。Mozilla 已將專案轉由社群維運的 <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> 服務繼續運作（與 Mozilla 無關）。<br><br>若您不想繼續收到由社群維護的軟體更新資訊，可以到設定中關閉軟體自動更新。<br><br>若您想將子網域從 mozilla-iot.org 轉移到 webthings.io，或註冊新的子網域，可填寫下方的表單來註冊由社群維護的遠端存取服務。
transition-dialog-register-domain-label = 註冊 webthings.io 遠端存取服務
transition-dialog-subdomain =
    .placeholder = 子網域
transition-dialog-newsletter-label = 隨時告訴我 WebThings 的新鮮事
transition-dialog-agree-tos-label = 同意 WebThings 的<a data-l10n-name="transition-dialog-privacy-policy-link">隱私權保護政策</a>與<a data-l10n-name="transition-dialog-tos-link">服務條款</a>。
transition-dialog-email =
    .placeholder = 電子郵件地址
transition-dialog-register =
    .value = 註冊
transition-dialog-register-status =
    .alt = 註冊狀態
transition-dialog-register-label = 正在註冊子網域
transition-dialog-subscribe-status =
    .alt = 電子報訂閱狀態
transition-dialog-subscribe-label = 正在訂閱電子報
transition-dialog-error-generic = 發生錯誤。請回到上一步再試一次。
transition-dialog-error-subdomain-taken = 選擇的子網域已被使用，請回到上一步重新輸入。
transition-dialog-error-subdomain-failed = 子網域註冊失敗，請回到上一步再試一次。
transition-dialog-error-subscribe-failed = 電子報訂閱失敗。請到 <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a> 再試一次。
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = 切換到 <<domain>> 繼續。

## General Terms

ok = 確定
ellipsis = …
event-log = 事件記錄
edit = 編輯
remove = 刪除
disconnected = 已中斷連線
processing = 處理中…
submit = 送出

## Top-Level Buttons

menu-button =
    .aria-label = 選單
back-button =
    .aria-label = 上一頁
overflow-button =
    .aria-label = 其他動作
submit-button =
    .aria-label = 送出
edit-button =
    .aria-label = 編輯
save-button =
    .aria-label = 儲存
