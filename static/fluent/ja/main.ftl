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

things-menu-item = Thing
rules-menu-item = ルール
logs-menu-item = ログ
floorplan-menu-item = 間取り図
settings-menu-item = 環境設定
log-out-button = ログアウト

## Things

thing-details =
    .aria-label = プロパティを表示
add-things =
    .aria-label = 新しい Thing を追加

## Floorplan

upload-floorplan = 間取り図をアップロード…
upload-floorplan-hint = (.svg 推奨)

## Top-Level Settings

settings-domain = ドメイン
settings-network = ネットワーク
settings-users = ユーザー
settings-add-ons = アドオン
settings-adapters = アダプター
settings-localization = ローカライズ
settings-updates = 更新
settings-authorizations = 認証
settings-experiments = 実験
settings-developer = 開発者向け

## Domain Settings

domain-settings-local-label = ローカルアクセス
domain-settings-local-update = ホスト名を更新
domain-settings-remote-access = リモートアクセス
domain-settings-local-name =
    .placeholder = ゲートウェイ

## Network Settings

network-settings-unsupported = このプラットフォームはネットワーク設定をサポートしていません。
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = ホームネットワーク
network-settings-internet-image =
    .alt = インターネット
network-settings-configure = 設定変更
network-settings-internet-wan = インターネット (WAN)
network-settings-wan-mode = モード
network-settings-home-network-lan = ホームネットワーク (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP アドレス
network-settings-dhcp = 自動 (DHCP)
network-settings-static = 手動 (固定 IP)
network-settings-pppoe = ブリッジ (PPPoE)
network-settings-static-ip-address = 固定 IP アドレス
network-settings-network-mask = ネットワークマスク
network-settings-gateway = ゲートウェイ
network-settings-done = 完了
network-settings-wifi-password =
    .placeholder = パスワード
network-settings-show-password = パスワードを開示
network-settings-connect = 接続
network-settings-username = ユーザー名
network-settings-password = パスワード
network-settings-router-ip = ルーターの IP アドレス
network-settings-dhcp-server = DHCP サーバー
network-settings-enable-wifi = Wi-Fi を有効化
network-settings-network-name = ネットワーク名 (SSID)
wireless-connected = 接続しました
wireless-icon =
    .alt = Wi-Fi ネットワーク
network-settings-changing = ネットワーク設定を変更しています。しばらくお待ちください。
failed-ethernet-configure = Ethernet の設定変更に失敗しました。
failed-wifi-configure = Wi-Fi の設定変更に失敗しました。
failed-wan-configure = WAN の設定変更に失敗しました。
failed-lan-configure = LAN の設定変更に失敗しました。
failed-wlan-configure = WLAN の設定変更に失敗しました。

## User Settings

create-user =
    .aria-label = 新しいユーザーを追加
user-settings-input-name =
    .placeholder = お名前
user-settings-input-email =
    .placeholder = メールアドレス
user-settings-input-password =
    .placeholder = パスワード
user-settings-input-totp =
    .placeholder = 二要素認証コード
user-settings-mfa-enable = 二要素認証を有効化
user-settings-mfa-scan-code = 任意の二要素認証アプリで次のコードをスキャンしてください。
user-settings-mfa-secret = これが新しい TOTP 秘密鍵です。上記の QR コードが機能しない場合に使用します:
user-settings-mfa-error = 認証コードが正しくありません。
user-settings-mfa-enter-code = 認証アプリに表示されたコードを入力してください。
user-settings-mfa-verify = 確認
user-settings-mfa-regenerate-codes = バックアップコードを再生成
user-settings-mfa-backup-codes = これらはバックアップコードです。それぞれ 1 回だけしか使用できません。安全な場所に保管してください。
user-settings-input-new-password =
    .placeholder = 新しいパスワード (任意)
user-settings-input-confirm-new-password =
    .placeholder = 新しいパスワードの確認
user-settings-input-confirm-password =
    .placeholder = パスワードの確認
user-settings-password-mismatch = パスワードが一致しません
user-settings-save = 保存

## Adapter Settings

adapter-settings-no-adapters = アダプターがありません。

## Authorization Settings

authorization-settings-no-authorizations = 認証情報がありません。

## Experiment Settings

experiment-settings-no-experiments = 現在利用できる実験はありません。

## Localization Settings

localization-settings-language-region = 言語と地域
localization-settings-country = 国
localization-settings-timezone = タイムゾーン
localization-settings-language = 言語
localization-settings-units = 単位
localization-settings-units-temperature = 温度
localization-settings-units-temperature-celsius = 摂氏 (℃)
localization-settings-units-temperature-fahrenheit = 華氏 (℉)

## Update Settings

update-settings-update-now = 今すぐ更新
update-available = 新しいバージョンに更新できます
update-up-to-date = ご使用のシステムは最新です
updates-not-supported = このプラットフォームでの更新はサポートされていません。
update-settings-enable-self-updates = 自動更新を有効化
last-update = 最終更新日
current-version = 現在のバージョン
failed = 失敗
never = 更新しない
in-progress = 更新中
restarting = 再起動中
checking-for-updates = 更新を確認しています…
failed-to-check-for-updates = 現在、更新を確認できません。

## Developer Settings

developer-settings-enable-ssh = SSH を有効化
developer-settings-view-internal-logs = 内部ログを表示
developer-settings-create-local-authorization = ローカルの認証情報を作成

## Rules

add-rule =
    .aria-label = 新しいルールを作成
rules = Rules
rules-create-rule-hint = ルールがありません。+ 記号をクリックしてルールを作成してください。
rules-rule-name = ルール名
rules-customize-rule-name-icon =
    .alt = ルール名を変更
rules-rule-description = ルールの説明
rules-preview-button =
    .alt = プレビュー
rules-delete-icon =
    .alt = 削除
rules-drag-hint = デバイスをここにドラッグしてルールを作成してください
rules-drag-input-hint = 入力デバイスを追加
rules-drag-output-hint = 出力デバイスを追加
rules-scroll-left =
    .alt = 左へスクロール
rules-scroll-right =
    .alt = 右へスクロール
rules-delete-prompt = デバイスをここにドロップして切断
rules-delete-dialog = このルールを完全に削除してもよろしいですか？
rules-delete-cancel =
    .value = キャンセル
rules-delete-confirm =
    .value = ルールを削除
rule-invalid = 無効
rule-delete-prompt = このルールを完全に削除してもよろしいですか？
rule-delete-cancel-button =
    .value = キャンセル
rule-delete-confirm-button =
    .value = ルールを削除
rule-select-property = プロパティを選択してください
rule-not = Not
rule-event = イベント
rule-action = アクション
rule-configure = 設定変更…
rule-time-title = 日時
rule-notification = 通知
notification-title = タイトル
notification-message = メッセージ
notification-level = レベル
notification-low = 低
notification-normal = 通常
notification-high = 高
rule-name = ルール名

## Logs

add-log =
    .aria-label = 新しいログを作成
logs = ログ
logs-create-log-hint = ログがありません。+ 記号をクリックしてログを作成してください。
logs-device = デバイス
logs-device-select =
    .aria-label = ログ記録するデバイス
logs-property = プロパティ
logs-property-select =
    .aria-label = ログのプロパティ
logs-retention = ログの保持
logs-retention-length =
    .aria-label = ログを保持する期間
logs-retention-unit =
    .aria-label = ログの保持単位
logs-hours = 時間
logs-days = 日
logs-weeks = 週間
logs-save = 保存
logs-remove-dialog-title = ログの削除
logs-remove-dialog-warning = ログを削除すると、そのデータもすべて削除されます。本当に削除してもよろしいですか？
logs-remove = 削除
logs-unable-to-create = ログを作成できません
logs-server-remove-error = サーバーエラー: ログを削除できません

## Add New Things

add-thing-scanning-icon =
    .alt = スキャン中
add-thing-scanning = 新しいデバイスをスキャン中…
add-thing-add-adapters-hint = 新しい Thing は見つかりませんでした。<a data-l10n-name="add-thing-add-adapters-hint-anchor">アドオンを追加してみてください</a>。
add-thing-add-by-url = URL を指定して追加…
add-thing-done = 完了
add-thing-cancel = キャンセル

## Context Menu

context-menu-choose-icon = アイコンを選択…
context-menu-save = 保存
context-menu-remove = 削除

## Capabilities

OnOffSwitch = On/Off スイッチ
MultiLevelSwitch = マルチレベルスイッチ
ColorControl = カラーコントロール
ColorSensor = カラーセンサー
EnergyMonitor = 電力モニター
BinarySensor = バイナリーセンサー
MultiLevelSensor = マルチレベルセンサー
SmartPlug = スマートプラグ
Light = 照明
DoorSensor = ドアセンサー
MotionSensor = モーションセンサー
LeakSensor = リークセンサー
PushButton = プッシュボタン
VideoCamera = ビデオカメラ
Camera = カメラ
TemperatureSensor = 温度センサー
HumiditySensor = 湿度センサー
Alarm = アラーム
Thermostat = 温度計
Lock = 施錠
BarometricPressureSensor = 気圧センサー
Custom = カスタム Thing
Thing = Thing
AirQualitySensor = 大気質センサー
SmokeSensor = 煙センサー

## Properties

alarm = アラーム
pushed = 押されました
not-pushed = 押されていません
on-off = On/Off
on = On
off = Off
power = 電力
voltage = 電圧
temperature = 温度
current = 電流
frequency = 周波数
color = カラー
brightness = 明るさ
leak = リーク
dry = ドライ
color-temperature = 色温度
video-unsupported = 申し訳ありませんが、ご使用のブラウザーではビデオがサポートされていません。
motion = モーション
no-motion = モーションなし
open = 開いています
closed = 閉じています
locked = ロックされています
unlocked = ロックされていません
jammed = 引っかかりがあります
unknown = 状態不明
active = 動作しています
inactive = 停止しています
humidity = 湿度
concentration = 濃度
density = 密度
smoke = 煙

## Domain Setup

tunnel-setup-reclaim-domain = サブドメインをすでに登録済みのようです。これを再利用するには <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">ここをクリックしてください</a>。
check-email-for-token = メールアドレスに送信された再利用トークンを確認し、上記に貼り付けてください。
reclaim-failed = ドメインを再利用できませんでした。
subdomain-already-used = このサブドメインはすでに使用されています。別のサブドメインを指定してください。
invalid-subdomain = 無効なサブドメインです。
invalid-email = 無効なメールアドレスです。
invalid-reclamation-token = 無効な再利用トークンです。
domain-success = 完了しました。リダイレクトする間しばらくお待ちください…
issuing-error = 証明書の発行でエラーが発生しました。もう一度試してください。
redirecting = リダイレクト中…

## Booleans

true = 真
false = 偽

## Time

utils-now = 直前
utils-seconds-ago =
    { $value ->
        [one] { $value } 秒前
       *[other] { $value } 秒前
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } 分前
       *[other] { $value } 分前
    }
utils-hours-ago =
    { $value ->
        [one] { $value } 時間前
       *[other] { $value } 時間前
    }
utils-days-ago =
    { $value ->
        [one] { $value } 日前
       *[other] { $value } 日前
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } 週間前
       *[other] { $value } 週間前
    }
utils-months-ago =
    { $value ->
        [one] { $value } か月前
       *[other] { $value } か月前
    }
utils-years-ago =
    { $value ->
        [one] { $value } 年前
       *[other] { $value } 年前
    }
minute = 分
hour = 時間
day = 日
week = 週間

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

unknown-device-type = デバイスの種類が不明です
new-thing-choose-icon = アイコンを選択…
new-thing-save = 保存
new-thing-pin =
    .placeholder = PIN を入力
new-thing-pin-error = PIN が正しくありません
new-thing-pin-invalid = PIN が無効です
new-thing-cancel = キャンセル
new-thing-submit = 送信
new-thing-username =
    .placeholder = ユーザー名を入力
new-thing-password =
    .placeholder = パスワードを入力
new-thing-credentials-error = 認証情報が正しくありません
new-thing-saved = 保存しました
new-thing-done = 完了

## New Web Thing View

new-web-thing-url =
    .placeholder = Web Thing の URL を入力
new-web-thing-label = Web Thing
loading = 読み込み中…
new-web-thing-multiple = 複数の Web Thing が見つかりました
new-web-thing-from = 場所

## Empty div Messages

no-things = まだデバイスがありません。+ 記号をクリックして利用可能なデバイスをスキャンしてください。
thing-not-found = Thing が見つかりませんでした。
action-not-found = アクションが見つかりませんでした。
events-not-found = この Thing にはイベントがありません。

## Add-on Settings

add-addons =
    .aria-label = 新しいアドオンを検索
author-unknown = 不明
disable = 無効化
enable = 有効化
by = 作者:
license = ライセンス
addon-configure = 設定変更
addon-update = 更新
addon-remove = 削除
addon-updating = 更新中…
addon-updated = 更新しました
addon-update-failed = 失敗しました
addon-config-applying = 適用中…
addon-config-apply = 適用
addon-discovery-added = 追加しました
addon-discovery-add = 追加
addon-discovery-installing = インストール中…
addon-discovery-failed = 失敗しました
addon-search =
    .placeholder = 検索

## Page Titles

settings = 環境設定
domain = ドメイン
users = ユーザー
edit-user = ユーザーを編集
add-user = ユーザーを追加
adapters = アダプター
addons = アドオン
addon-config = アドオンの設定変更
addon-discovery = 新しいアドオンを探す
experiments = 実験
localization = ローカライズ
updates = 更新
authorizations = 認証
developer = 開発者向け
network = ネットワーク
ethernet = Ethernet
wifi = Wi-Fi
icon = アイコン

## Errors

unknown-state = 状態不明
error = エラー
errors = エラー
gateway-unreachable = ゲートウェイに到達できません
more-information = 詳細情報
invalid-file = 無効なファイル
failed-read-file = ファイルの読み込みに失敗しました。
failed-save = 保存に失敗しました。

## Schema Form

unsupported-field = 未サポートのフィールドスキーマ

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = ログイン — { -webthings-gateway-brand }
login-log-in = ログイン
login-wrong-credentials = ユーザー名またはパスワードが正しくありません。
login-wrong-totp = 認証コードが正しくありません。
login-enter-totp = 認証アプリに表示されたコードを入力してください。

## Create First User Page

signup-title = ユーザー作成 — { -webthings-gateway-brand }
signup-welcome = ようこそ
signup-create-account = 最初のユーザーアカウントを作成:
signup-password-mismatch = パスワードが一致しません
signup-next = 次へ

## Tunnel Setup Page

tunnel-setup-title = ウェブアドレスの指定 — { -webthings-gateway-brand }
tunnel-setup-welcome = ようこそ
tunnel-setup-choose-address = ゲートウェイの安全なウェブアドレスを指定してください:
tunnel-setup-input-subdomain =
    .placeholder = サブドメイン
tunnel-setup-email-opt-in = WebThings についてのニュースを受け取る。
tunnel-setup-agree-privacy-policy = WebThings の <a data-l10n-name="tunnel-setup-privacy-policy-link">プライバシーポリシー</a> および <a data-l10n-name="tunnel-setup-tos-link">サービス利用規約</a> に同意する。
tunnel-setup-input-reclamation-token =
    .placeholder = 再利用トークン
tunnel-setup-error = サブドメインのセットアップ中にエラーが発生しました。
tunnel-setup-create = 作成
tunnel-setup-skip = スキップ
tunnel-setup-time-sync = システムの時計をインターネット時刻から設定しています。この設定が完了するまでドメイン登録はできません。

## Authorize Page

authorize-title = 認証要求 — { -webthings-gateway-brand }
authorize-authorization-request = 認証要求
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> が <<function>> デバイスへのゲートウェイにアクセスしようとしています。
# Use <<domain>> to indicate where the domain should be placed
authorize-source = <<domain>> から
authorize-monitor-and-control = モニターおよびコントロール
authorize-monitor = モニター
authorize-allow-all = すべての Thing を許可
authorize-allow =
    .value = 許可
authorize-deny = 拒否

## Local Token Page

local-token-title = ローカルトークンサービス — { -webthings-gateway-brand }
local-token-header = ローカルトークンサービス
local-token-your-token = あなたのローカルトークンは、この <a data-l10n-name="local-token-jwt">JSON Web Token</a> です:
local-token-use-it = このトークンを使用して <a data-l10n-name="local-token-bearer-type">持参人認証</a> (Bearer-type Authorization) でゲートウェイと安全に通信します。
local-token-copy-token = トークンをコピー

## Router Setup Page

router-setup-title = ルーターのセットアップ — { -webthings-gateway-brand }
router-setup-header = 新しい Wi-Fi ネットワークの作成
router-setup-input-ssid =
    .placeholder = ネットワーク名
router-setup-input-password =
    .placeholder = パスワード
router-setup-input-confirm-password =
    .placeholder = パスワード確認
router-setup-create =
    .value = 作成
router-setup-password-mismatch = パスワードが一致しません

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi セットアップ — { -webthings-gateway-brand }
wifi-setup-header = Wi-Fi ネットワークに接続しますか？
wifi-setup-input-password =
    .placeholder = パスワード
wifi-setup-show-password = パスワードを開示
wifi-setup-connect =
    .value = 接続
wifi-setup-network-icon =
    .alt = Wi-Fi ネットワーク
wifi-setup-skip = スキップ

## Connecting to Wi-Fi Page

connecting-title = Wi-Fi への接続 — { -webthings-gateway-brand }
connecting-header = Wi-Fi に接続中…
connecting-connect = 同じネットワークに接続し、ウェブブラウザーで { $gateway-link } を開いてゲートウェイのセットアップを続けてください。
connecting-warning = 注記: { $domain } を読み込めない場合は、ご使用のルーターのゲートウェイの IP アドレスを調べてください。
connecting-header-skipped = Wi-Fi セットアップをスキップしました
connecting-skipped = ゲートウェイの動作を開始しました。同じネットワークへの接続中にウェブブラウザーで { $gateway-link } を開いてゲートウェイのセットアップを続けてください。

## Creating Wi-Fi Network Page

creating-title = Wi-Fi ネットワークの作成 — { -webthings-gateway-brand }
creating-header = Wi-Fi ネットワークを作成中…
creating-content = 作成したパスワードを入力して { $ssid } に接続し、ウェブブラウザーで { $gateway-link } または { $ip-link } を開いてください。

## UI Updates

ui-update-available = 更新されたユーザーインターフェイスが利用できます。
ui-update-reload = 再読み込み
ui-update-close = 閉じる

## Transfer to webthings.io

action-required-image =
    .alt = 警告
action-required = 行動が必要:
action-required-message = Mozilla IoT リモートアクセスサービスとソフトウェアの自動更新は終了しています。サービス継続のため、コミュニティが運営する webthings.io に転送するかどうかを選んでください。
action-required-more-info = 詳細情報
action-required-dont-ask-again = 次回からは確認しない
action-required-choose = 選択
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Mozilla IoT リモートアクセスサービスとソフトウェアの自動更新は 2020 年 12 月 31 日に終了します (<a data-l10n-name="transition-dialog-more-info">詳細情報</a>)。Mozilla は、新たなコミュニティが運営する <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> にプロジェクトを移行しています (ただし、Mozilla と提携していません)。<br><br>ソフトウェアの更新をコミュニティが運営するサーバーから受け取りたくない場合は、設定で自動更新を無効にできます。<br><br>あなたの mozilla-iot.org サブドメインを webthings.io に転送するか、新しいサブドメインを登録したい場合は、以下のフォームに記入して、コミュニティが運営するリモートアクセスサービスに登録してください。
transition-dialog-register-domain-label = webthings.io リモートアクセスサービスに登録する
transition-dialog-subdomain =
    .placeholder = サブドメイン
transition-dialog-newsletter-label = WebThings についてのニュースを受け取る。
transition-dialog-agree-tos-label = WebThings の <a data-l10n-name="transition-dialog-privacy-policy-link">プライバシーポリシー</a> および <a data-l10n-name="transition-dialog-tos-link">サービス利用規約</a> に同意する。
transition-dialog-email =
    .placeholder = メールアドレス
transition-dialog-register =
    .value = 登録
transition-dialog-register-status =
    .alt = 登録状況
transition-dialog-register-label = サブドメインの登録
transition-dialog-subscribe-status =
    .alt = ニュースレターの購読状況
transition-dialog-subscribe-label = ニュースレターを購読
transition-dialog-error-generic = エラーが発生しました。前に戻ってもう一度試してください。
transition-dialog-error-subdomain-taken = 指定されたサブドメインはすでに使用されています。前に戻って別のサブドメインを選択してください。
transition-dialog-error-subdomain-failed = サブドメインの登録に失敗しました。前に戻ってもう一度やり直してください。
transition-dialog-error-subscribe-failed = ニュースレターの購読に失敗しました。<a data-l10n-name="transition-dialog-step-2-website">webthings.io</a> でもう一度お試しください
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = <<domain>> へ移動して続行します。

## General Terms

ok = OK
ellipsis = …
event-log = イベントログ
edit = 編集
remove = 削除
disconnected = 切断しました
processing = 処理中…
submit = 送信

## Top-Level Buttons

menu-button =
    .aria-label = メニュー
back-button =
    .aria-label = 戻る
overflow-button =
    .aria-label = 追加の操作
submit-button =
    .aria-label = 送信
edit-button =
    .aria-label = 編集
save-button =
    .aria-label = 保存
