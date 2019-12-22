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

assistant-menu-item = 助手
rules-menu-item = 规则
logs-menu-item = 日志
floorplan-menu-item = 平面图
settings-menu-item = 设置
log-out-button = 退出登录

## Things

thing-details =
    .aria-label = 查看属性

## Assistant

assistant-controls-text-input =
    .placeholder = 我能帮你什么？

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

experiment-settings-logs = 日志

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
logs-remove = 移除
logs-unable-to-create = 无法创建日志
logs-server-remove-error = 服务器错误：无法移除日志

## Add New Things

add-thing-done = 完成
add-thing-cancel = 取消

## Context Menu

context-menu-save = 保存
context-menu-remove = 移除

## Capabilities

OnOffSwitch = 一个开关
MultiLevelSwitch = 多级开关
ColorControl = 色彩控制器
ColorSensor = 色彩传感器
EnergyMonitor = 能源监控器
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
Alarm = 警报器
Thermostat = 温控器
Lock = 锁

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
frequency = 频率
color = 颜色
brightness = 亮度
leak = 有泄漏
dry = 干燥
color-temperature = 色温
video-unsupported = 很抱歉，您的浏览器不支持视频。
motion = 有运动
no-motion = 无运动

## Domain Setup


## Booleans


## Time

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

loading = 正在载入...

## Empty div Messages

no-things = 尚无设备。点击 + 扫描可用的设备。

## Add-on Settings


## Page Titles

authorizations = 身份授权

## Speech


## Errors


## Schema Form


## Icon Sources


## Login Page


## Create First User Page


## Tunnel Setup Page


## Authorize Page

authorize-title = 授权请求 — { -webthings-gateway-brand }
authorize-authorization-request = 授权请求

## Local Token Page


## Router Setup Page


## Wi-Fi Setup Page


## Connecting to Wi-Fi Page


## Creating Wi-Fi Network Page


## General Terms


## Top-Level Buttons

