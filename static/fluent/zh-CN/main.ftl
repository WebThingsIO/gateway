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

things-menu-item = 设备
rules-menu-item = 规则
logs-menu-item = 日志
floorplan-menu-item = 平面图
settings-menu-item = 设置
log-out-button = 退出登录

## Things

thing-details =
    .aria-label = 查看属性
add-things =
    .aria-label = 添加新硬件

## Floorplan

upload-floorplan = 上传平面图…
upload-floorplan-hint = （推荐 .svg）

## Top-Level Settings

settings-domain = 域
settings-network = 网络
settings-users = 用户
settings-add-ons = 附加组件
settings-adapters = 适配器
settings-localization = 本地化
settings-updates = 更新
settings-authorizations = 授权
settings-experiments = 实验
settings-developer = 开发者

## Domain Settings

domain-settings-local-label = 本地访问
domain-settings-local-update = 更新主机名
domain-settings-remote-access = 远程访问
domain-settings-local-name =
    .placeholder = 网关

## Network Settings

network-settings-unsupported = 不支持此平台的网络设置。
network-settings-ethernet-image =
    .alt = 以太网
network-settings-ethernet = 以太网
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = 家庭网络
network-settings-internet-image =
    .alt = 互联网
network-settings-configure = 配置
network-settings-internet-wan = 互联网（WAN）
network-settings-wan-mode = 模式
network-settings-home-network-lan = 家庭网络（LAN）
network-settings-wifi-wlan = Wi-Fi（WLAN）
network-settings-ip-address = IP 地址
network-settings-dhcp = 自动（DHCP）
network-settings-static = 手动（静态 IP）
network-settings-pppoe = 网桥（PPPoE）
network-settings-static-ip-address = 静态 IP 地址
network-settings-network-mask = 网络掩码
network-settings-gateway = 网关
network-settings-done = 完成
network-settings-wifi-password =
    .placeholder = 密码
network-settings-show-password = 显示密码
network-settings-connect = 连接
network-settings-username = 用户名
network-settings-password = 密码
network-settings-router-ip = 路由器 IP 地址
network-settings-dhcp-server = DHCP 服务器
network-settings-enable-wifi = 启用 Wi-Fi
network-settings-network-name = 网络名称（SSID）
wireless-connected = 已连接
wireless-icon =
    .alt = Wi-Fi 网络
network-settings-changing = 正在变更网络设置。可能需要一分钟。
failed-ethernet-configure = 配置以太网失败。
failed-wifi-configure = 配置 Wi-Fi 失败。
failed-wan-configure = 配置 WAN 失败。
failed-lan-configure = 配置 LAN 失败。
failed-wlan-configure = 配置 WLAN 失败。

## User Settings

create-user =
    .aria-label = 添加新用户
user-settings-input-name =
    .placeholder = 名称
user-settings-input-email =
    .placeholder = 电子邮件地址
user-settings-input-password =
    .placeholder = 密码
user-settings-input-totp =
    .placeholder = 2FA 码
user-settings-mfa-enable = 启用双因子验证
user-settings-mfa-scan-code = 请使用双因子验证器 App 在下方扫码。
user-settings-mfa-secret = 若上面的二维码不可用，这是您的新 TOTP 密钥：
user-settings-mfa-error = 验证码不正确。
user-settings-mfa-enter-code = 请在下面输入来自验证器 App 的验证码。
user-settings-mfa-verify = 验证
user-settings-mfa-regenerate-codes = 重新生成备用码
user-settings-mfa-backup-codes = 以下是您的备用码。每一组只能使用一次，请将它们保存在安全之处。
user-settings-input-new-password =
    .placeholder = 新密码（可选）
user-settings-input-confirm-new-password =
    .placeholder = 确认新密码
user-settings-input-confirm-password =
    .placeholder = 确认密码
user-settings-password-mismatch = 密码不匹配
user-settings-save = 保存

## Adapter Settings

adapter-settings-no-adapters = 没有发现适配器。

## Authorization Settings

authorization-settings-no-authorizations = 尚无授权。

## Experiment Settings

experiment-settings-no-experiments = 现时无可进行的实验。

## Localization Settings

localization-settings-language-region = 语言和区域
localization-settings-country = 国家/地区
localization-settings-timezone = 时区
localization-settings-language = 语言
localization-settings-units = 单位
localization-settings-units-temperature = 温度
localization-settings-units-temperature-celsius = 摄氏度 (°C)
localization-settings-units-temperature-fahrenheit = 华氏度 (°F)

## Update Settings

update-settings-update-now = 立即更新
update-available = 有新版本可用
update-up-to-date = 您的系统已是最新版本
updates-not-supported = 此平台上不支持更新。
update-settings-enable-self-updates = 启用自动更新
last-update = 上次更新
current-version = 当前版本
failed = 失败
never = 从未
in-progress = 处理中
restarting = 正在重启
checking-for-updates = 正在检查更新…
failed-to-check-for-updates = 目前无法检查更新。

## Developer Settings

developer-settings-enable-ssh = 启用 SSH
developer-settings-view-internal-logs = 查看内部日志
developer-settings-create-local-authorization = 创建本地授权

## Rules

add-rule =
    .aria-label = 创建新规则
rules = 规则
rules-create-rule-hint = 尚未创建规则。点击 + 创建一个规则。
rules-rule-name = 规则名称
rules-customize-rule-name-icon =
    .alt = 自定义规则名称
rules-rule-description = 规则描述
rules-preview-button =
    .alt = 预览
rules-delete-icon =
    .alt = 删除
rules-drag-hint = 拖放您的设备到此处来开始创建一条规则
rules-drag-input-hint = 添加设备到输入
rules-drag-output-hint = 添加设备到输出
rules-scroll-left =
    .alt = 向左滚动
rules-scroll-right =
    .alt = 向右滚动
rules-delete-prompt = 拖放设备到此处来断开连接
rules-delete-dialog = 确定要永久移除此规则？
rules-delete-cancel =
    .value = 取消
rules-delete-confirm =
    .value = 移除规则
rule-invalid = 无效
rule-delete-prompt = 确定要永久移除此规则？
rule-delete-cancel-button =
    .value = 取消
rule-delete-confirm-button =
    .value = 移除规则
rule-select-property = 选择属性
rule-not = 非
rule-event = 事件
rule-action = 动作
rule-configure = 配置…
rule-time-title = 时间
rule-notification = 通知
notification-title = 标题
notification-message = 消息
notification-level = 级别
notification-low = 低
notification-normal = 中
notification-high = 高
rule-name = 规则名称

## Logs

add-log =
    .aria-label = 创建新日志
logs = 日志
logs-create-log-hint = 尚未创建日志。点击 + 创建一条日志。
logs-device = 设备
logs-device-select =
    .aria-label = 记录设备
logs-property = 属性
logs-property-select =
    .aria-label = 记录属性
logs-retention = 保留期
logs-retention-length =
    .aria-label = 日志保留长度
logs-retention-unit =
    .aria-label = 日志保留单位
logs-hours = 小时
logs-days = 天
logs-weeks = 周
logs-save = 保存
logs-remove-dialog-title = 移除
logs-remove-dialog-warning = 移除日志的同时也会移除其所有数据，确定吗？
logs-remove = 移除
logs-unable-to-create = 无法创建日志
logs-server-remove-error = 服务器错误：无法移除日志

## Add New Things

add-thing-scanning-icon =
    .alt = 正在扫描
add-thing-scanning = 正在扫描新设备…
add-thing-add-adapters-hint = 未找到新硬件。请尝试<a data-l10n-name="add-thing-add-adapters-hint-anchor">安装附加组件</a>。
add-thing-add-by-url = 通过 URL 添加...
add-thing-done = 完成
add-thing-cancel = 取消

## Context Menu

context-menu-choose-icon = 选择图标...
context-menu-save = 保存
context-menu-remove = 移除

## Capabilities

OnOffSwitch = 一个开关
MultiLevelSwitch = 多级开关
ColorControl = 色彩控制器
ColorSensor = 色彩传感器
EnergyMonitor = 能源监测器
BinarySensor = 二进制传感器
MultiLevelSensor = 多级别传感器
SmartPlug = 智能插座
Light = 灯
DoorSensor = 门窗传感器
MotionSensor = 运动传感器
LeakSensor = 泄漏传感器
PushButton = 按钮
VideoCamera = 摄像头
Camera = 相机
TemperatureSensor = 温度传感器
HumiditySensor = 湿度传感器
Alarm = 警报器
Thermostat = 温控器
Lock = 锁
BarometricPressureSensor = 气压传感器
Custom = 自定义硬件
Thing = 硬件
AirQualitySensor = 空气质量传感器
SmokeSensor = 烟雾传感器

## Properties

alarm = 警报器
pushed = 已按下
not-pushed = 未按下
on-off = 开/关
on = 开
off = 关
power = 功率
voltage = 电压
temperature = 温度
current = 当前
frequency = 频率
color = 颜色
brightness = 亮度
leak = 有泄漏
dry = 干燥
color-temperature = 色温
video-unsupported = 很抱歉，您的浏览器不支持视频。
motion = 有运动
no-motion = 无运动
open = 打开
closed = 关闭
locked = 已锁
unlocked = 未锁
jammed = 卡住
unknown = 未知
active = 活动
inactive = 不活动
humidity = 湿度
concentration = 浓度
density = 密度
smoke = 烟雾

## Domain Setup

tunnel-setup-reclaim-domain = 看来您已经注册了该子域。若要回收继续使用，请<a data-l10n-name="tunnel-setup-reclaim-domain-click-here">点击此处</a>。
check-email-for-token = 请检查您的电子邮件，将收到的域回收令牌（Token）粘贴在上方。
reclaim-failed = 无法回收域。
subdomain-already-used = 该子域已被使用，请另选一个。
invalid-subdomain = 无效的子域。
invalid-email = 无效的电子邮件地址。
invalid-reclamation-token = 无效的回收令牌（Token）。
domain-success = 成功！等待跳转中...
issuing-error = 签发证书出错，请重试。
redirecting = 正在重定向…

## Booleans

true = True
false = False

## Time

utils-now = 现在
utils-seconds-ago =
    { $value ->
        [one] { $value } 秒前
       *[other] { $value } 秒前
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } 分钟前
       *[other] { $value } 分钟前
    }
utils-hours-ago =
    { $value ->
        [one] { $value } 小时前
       *[other] { $value } 小时前
    }
utils-days-ago =
    { $value ->
        [one] { $value } 天前
       *[other] { $value } 天前
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } 周前
       *[other] { $value } 周前
    }
utils-months-ago =
    { $value ->
        [one] { $value } 个月前
       *[other] { $value } 个月前
    }
utils-years-ago =
    { $value ->
        [one] { $value } 年前
       *[other] { $value } 年前
    }
minute = 分钟
hour = 小时
day = 天
week = 周

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
abbrev-kilowatt-hour = 千瓦/时
abbrev-percent = %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = K
abbrev-meter = 米
abbrev-kilometer = 千米
abbrev-day = 天
abbrev-hour = 时
abbrev-minute = 分
abbrev-second = 秒
abbrev-millisecond = 毫秒
abbrev-foot = 英尺
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = 未知设备类型
new-thing-choose-icon = 选择图标…
new-thing-save = 保存
new-thing-pin =
    .placeholder = 输入 PIN
new-thing-pin-error = PIN 不正确
new-thing-pin-invalid = 无效 PIN
new-thing-cancel = 取消
new-thing-submit = 提交
new-thing-username =
    .placeholder = 输入用户名
new-thing-password =
    .placeholder = 输入密码
new-thing-credentials-error = 凭据不正确
new-thing-saved = 已保存
new-thing-done = 完成

## New Web Thing View

new-web-thing-url =
    .placeholder = 输入智能硬件 URL
new-web-thing-label = 智能硬件
loading = 正在载入...
new-web-thing-multiple = 发现多个智能硬件
new-web-thing-from = 来自

## Empty div Messages

no-things = 尚无设备。点击 + 扫描可用的设备。
thing-not-found = 找不到硬件。
action-not-found = 找不到可用的动作。
events-not-found = 此硬件没有事件。

## Add-on Settings

add-addons =
    .aria-label = 寻找新的附加组件
author-unknown = 未知
disable = 禁用
enable = 启用
by = 作者：
license = 许可协议
addon-configure = 配置
addon-update = 更新
addon-remove = 移除
addon-updating = 正在更新…
addon-updated = 已更新
addon-update-failed = 失败
addon-config-applying = 正在应用…
addon-config-apply = 应用
addon-discovery-added = 已添加
addon-discovery-add = 添加
addon-discovery-installing = 正在安装…
addon-discovery-failed = 失败
addon-search =
    .placeholder = 搜索

## Page Titles

settings = 设置
domain = 域
users = 用户
edit-user = 编辑用户
add-user = 添加用户
adapters = 适配器
addons = 附加组件
addon-config = 配置附加组件
addon-discovery = 探寻附加组件
experiments = 实验
localization = 本地化
updates = 更新
authorizations = 身份授权
developer = 开发者
network = 网络
ethernet = 以太网
wifi = Wi-Fi
icon = 图标

## Errors

unknown-state = 未知状态。
error = 错误
errors = 错误
gateway-unreachable = 网关不可达
more-information = 更多信息
invalid-file = 无效文件。
failed-read-file = 读取文件失败。
failed-save = 保存失败。

## Schema Form

unsupported-field = 不支持的字段规范。

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = 登录 — { -webthings-gateway-brand }
login-log-in = 登录
login-wrong-credentials = 用户名或密码不正确。
login-wrong-totp = 验证码不正确。
login-enter-totp = 输入来自验证器 App 的验证码。

## Create First User Page

signup-title = 创建用户 — { -webthings-gateway-brand }
signup-welcome = 欢迎使用
signup-create-account = 创建你的第一个账户：
signup-password-mismatch = 密码不匹配
signup-next = 下一步

## Tunnel Setup Page

tunnel-setup-title = 选择网址 — { -webthings-gateway-brand }
tunnel-setup-welcome = 欢迎使用
tunnel-setup-choose-address = 为您的网关选择一个安全网址：
tunnel-setup-input-subdomain =
    .placeholder = 子域
tunnel-setup-email-opt-in = 让我随时了解 WebThings 的相关新闻。
tunnel-setup-agree-privacy-policy = 同意 WebThings 的<a data-l10n-name="tunnel-setup-privacy-policy-link">隐私政策</a>和<a data-l10n-name="tunnel-setup-tos-link">使用条款</a>。
tunnel-setup-input-reclamation-token =
    .placeholder = 域回收令牌（Token）
tunnel-setup-error = 设置子域时出错。
tunnel-setup-create = 创建
tunnel-setup-skip = 跳过
tunnel-setup-time-sync = 等待根据互联网设定系统时间。此步骤完成之前，域注册的尝试可能会失败。

## Authorize Page

authorize-title = 授权请求 — { -webthings-gateway-brand }
authorize-authorization-request = 授权请求
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> 想要访问您网关中的 <<function>> 设备。
# Use <<domain>> to indicate where the domain should be placed
authorize-source = 来自 <<domain>>
authorize-monitor-and-control = 监测和控制
authorize-monitor = 监测
authorize-allow-all = 允许使用所有硬件
authorize-allow =
    .value = 允许
authorize-deny = 拒绝

## Local Token Page

local-token-title = 本地令牌服务 — { -webthings-gateway-brand }
local-token-header = 本地令牌服务
local-token-your-token = 如下 <a data-l10n-name="local-token-jwt">JSON Web 令牌（JWT）</a>是您的本地令牌（Token）：
local-token-use-it = 请使用此令牌（Token），通过 <a data-l10n-name="local-token-bearer-type">Bearer 式验证方案</a> 与网关安全通信。
local-token-copy-token = 复制令牌（Token）

## Router Setup Page

router-setup-title = 路由器设置 — { -webthings-gateway-brand }
router-setup-header = 新建 Wi-Fi 网络
router-setup-input-ssid =
    .placeholder = 网络名称
router-setup-input-password =
    .placeholder = 密码
router-setup-input-confirm-password =
    .placeholder = 确认密码
router-setup-create =
    .value = 创建
router-setup-password-mismatch = 密码必须相符。

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi 设置 — { -webthings-gateway-brand }
wifi-setup-header = 连接一个 Wi-Fi 网络？
wifi-setup-input-password =
    .placeholder = 密码
wifi-setup-show-password = 显示密码
wifi-setup-connect =
    .value = 连接
wifi-setup-network-icon =
    .alt = Wi-Fi 网络
wifi-setup-skip = 跳过

## Connecting to Wi-Fi Page

connecting-title = 正在连接 Wi-Fi — { -webthings-gateway-brand }
connecting-header = 正在连接 Wi-Fi…
connecting-connect = 请确保您已连接到同一个网络，然后在您的网页浏览器中访问 { $gateway-link } 以继续设置。
connecting-warning = 注意：如果您无法加载 { $domain }，在您的路由器上寻找网关的 IP 地址。
connecting-header-skipped = 已跳过 Wi-Fi 设置
connecting-skipped = 此刻正在启动网关。请保持与网关使用同一网络，在网页浏览器中打开 { $gateway-link } 页面继续进行设置。

## Creating Wi-Fi Network Page

creating-title = 正在建立 Wi-Fi 网络 — { -webthings-gateway-brand }
creating-header = 正在建立 Wi-Fi 网络…
creating-content = 请使用您方才创建的密码连接 { $ssid } 网络，并在网页浏览器中打开 { $gateway-link } 或 { $ip-link } 页面。

## UI Updates

ui-update-available = 用户界面已做更新。
ui-update-reload = 重新载入
ui-update-close = 关闭

## Transfer to webthings.io

action-required-image =
    .alt = 警告
action-required = 需要采取行动：
action-required-message = Mozilla IoT 的远程访问服务和自动软件更新已终止。请选择是否转移到社区运营的 webthings.io 以继续获得服务。
action-required-more-info = 更多信息
action-required-dont-ask-again = 不再询问
action-required-choose = 选择
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Mozilla IoT 远程访问服务和自动软件更新将于 2020 年 12 月 31 日终止（<a data-l10n-name="transition-dialog-more-info">了解更多</a>）。 Mozilla 正在将该项目迁移到新的社区运营的 <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a>（与 Mozilla 无关）。<br><br>若您不希望继续从社区运营的更新服务器接收软件更新，则请在“设置”中禁用自动更新。<br><br>若要将 mozilla-iot.org 子域转移到 webthings.io，或注册新的子域，您可以填写下表来注册社区运营的远程访问服务。
transition-dialog-register-domain-label = 注册 webthings.io 远程访问服务
transition-dialog-subdomain =
    .placeholder = 子域
transition-dialog-newsletter-label = 让我随时了解 WebThings 的相关新闻
transition-dialog-agree-tos-label = 同意 WebThings 的<a data-l10n-name="transition-dialog-privacy-policy-link">隐私政策</a>和<a data-l10n-name="transition-dialog-tos-link">使用条款</a>。
transition-dialog-email =
    .placeholder = 电子邮件地址
transition-dialog-register =
    .value = 注册
transition-dialog-register-status =
    .alt = 注册状态
transition-dialog-register-label = 正在注册子域
transition-dialog-subscribe-status =
    .alt = 新闻通讯订阅状态
transition-dialog-subscribe-label = 正在订阅新闻通讯
transition-dialog-error-generic = 发生错误，请返回重试。
transition-dialog-error-subdomain-taken = 所选子域已被占用，请返回重新选择。
transition-dialog-error-subdomain-failed = 无法注册子域，请返回重试。
transition-dialog-error-subscribe-failed = 无法订阅新闻通讯。请到 <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a> 重试。
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = 前往 <<domain>> 以继续。

## General Terms

ok = 确定
ellipsis = …
event-log = 事件日志
edit = 编辑
remove = 移除
disconnected = 已断开连接
processing = 正在处理...
submit = 提交

## Top-Level Buttons

menu-button =
    .aria-label = 菜单
back-button =
    .aria-label = 返回
overflow-button =
    .aria-label = 其他动作
submit-button =
    .aria-label = 提交
edit-button =
    .aria-label = 编辑
save-button =
    .aria-label = 保存
