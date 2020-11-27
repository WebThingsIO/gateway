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
rules-menu-item = Rules
logs-menu-item = Logs
floorplan-menu-item = Floorplan
settings-menu-item = Settings
log-out-button = Log out

## Things

thing-details =
    .aria-label = View Properties
add-things =
    .aria-label = Add New Things

## Floorplan

upload-floorplan = Upload floorplan…
upload-floorplan-hint = (.svg recommended)

## Top-Level Settings

settings-domain = Domain
settings-network = Network
settings-users = Users
settings-add-ons = Add-ons
settings-adapters = Adapters
settings-localization = Localization
settings-updates = Updates
settings-authorizations = Authorizations
settings-experiments = Experiments
settings-developer = Developer

## Domain Settings

domain-settings-local-label = Local Access
domain-settings-local-update = Update host name
domain-settings-remote-access = Remote Access
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Network settings are not supported for this platform.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Home Network
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configure
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Mode
network-settings-home-network-lan = Home Network (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP address
network-settings-dhcp = Automatic (DHCP)
network-settings-static = Manual (Static IP)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Static IP address
network-settings-network-mask = Network mask
network-settings-gateway = Gateway
network-settings-done = Done
network-settings-wifi-password =
    .placeholder = Password
network-settings-show-password = Show password
network-settings-connect = Connect
network-settings-username = Username
network-settings-password = Password
network-settings-router-ip = Router IP address
network-settings-dhcp-server = DHCP server
network-settings-enable-wifi = Enable Wi-Fi
network-settings-network-name = Network name (SSID)
wireless-connected = Connected
wireless-icon =
    .alt = Wi-Fi Network
network-settings-changing = Changing network settings. This may take a minute.
failed-ethernet-configure = Failed to configure Ethernet.
failed-wifi-configure = Failed to configure Wi-Fi.
failed-wan-configure = Failed to configure WAN.
failed-lan-configure = Failed to configure LAN.
failed-wlan-configure = Failed to configure WLAN.

## User Settings

create-user =
    .aria-label = Add New User
user-settings-input-name =
    .placeholder = Name
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = Password
user-settings-input-totp =
    .placeholder = 2FA Code
user-settings-mfa-enable = Enable two-factor authentication
user-settings-mfa-scan-code = Scan the following code with any two-factor authenticator app.
user-settings-mfa-secret = This is your new TOTP secret, in case the QR code above does not work:
user-settings-mfa-error = Authentication code was incorrect.
user-settings-mfa-enter-code = Enter the code from your authenticator app below.
user-settings-mfa-verify = Verify
user-settings-mfa-regenerate-codes = Regenerate backup codes
user-settings-mfa-backup-codes = These are your backup codes. Each one can only be used once. Keep them in a safe place.
user-settings-input-new-password =
    .placeholder = New Password (Optional)
user-settings-input-confirm-new-password =
    .placeholder = Confirm New Password
user-settings-input-confirm-password =
    .placeholder = Confirm Password
user-settings-password-mismatch = Passwords do not match
user-settings-save = Save

## Adapter Settings

adapter-settings-no-adapters = No adapters present.

## Authorization Settings

authorization-settings-no-authorizations = No authorizations.

## Experiment Settings

experiment-settings-no-experiments = No experiments available at this time.

## Localization Settings

localization-settings-language-region = Language & Region
localization-settings-country = Country
localization-settings-timezone = Timezone
localization-settings-language = Language
localization-settings-units = Units
localization-settings-units-temperature = Temperature
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Update Now
update-available = New version available.
update-up-to-date = Your system is up to date.
updates-not-supported = Updates are not supported on this platform.
update-settings-enable-self-updates = Enable automatic updates
last-update = Last update
current-version = Current version
failed = Failed
never = Never
in-progress = In Progress…
restarting = Restarting…
checking-for-updates = Checking for updates…
failed-to-check-for-updates = Unable to check for updates at this time.

## Developer Settings

developer-settings-enable-ssh = Enable SSH
developer-settings-view-internal-logs = View Internal Logs
developer-settings-create-local-authorization = Create local authorization

## Rules

add-rule =
    .aria-label = Create New Rule
rules = Rules
rules-create-rule-hint = No rules created. Click + to create a rule.
rules-rule-name = Rule Name
rules-customize-rule-name-icon =
    .alt = Customize Rule Name
rules-rule-description = Rule Description
rules-preview-button =
    .alt = Preview
rules-delete-icon =
    .alt = Delete
rules-drag-hint = Drag your devices here to start creating a rule
rules-drag-input-hint = Add device as input
rules-drag-output-hint = Add device as output
rules-scroll-left =
    .alt = Scroll Left
rules-scroll-right =
    .alt = Scroll Right
rules-delete-prompt = Drop devices here to disconnect
rules-delete-dialog = Are you sure you want to remove this rule permanently?
rules-delete-cancel =
    .value = Cancel
rules-delete-confirm =
    .value = Remove Rule
rule-invalid = Invalid
rule-delete-prompt = Are you sure you want to remove this rule permanently?
rule-delete-cancel-button =
    .value = Cancel
rule-delete-confirm-button =
    .value = Remove Rule
rule-select-property = Select Property
rule-not = Not
rule-event = Event
rule-action = Action
rule-configure = Configure…
rule-time-title = Time of day
rule-notification = Notification
notification-title = Title
notification-message = Message
notification-level = Level
notification-low = Low
notification-normal = Normal
notification-high = High
rule-name = Rule Name

## Logs

add-log =
    .aria-label = Create New Log
logs = Logs
logs-create-log-hint = No logs created. Click + to create a log.
logs-device = Device
logs-device-select =
    .aria-label = Log Device
logs-property = Property
logs-property-select =
    .aria-label = Log Property
logs-retention = Retention
logs-retention-length =
    .aria-label = Log Retention Length
logs-retention-unit =
    .aria-label = Log Retention Unit
logs-hours = Hours
logs-days = Days
logs-weeks = Weeks
logs-save = Save
logs-remove-dialog-title = Removing
logs-remove-dialog-warning = Removing the log will also remove all of its data. Are you sure you want to remove it?
logs-remove = Remove
logs-unable-to-create = Unable to create log
logs-server-remove-error = Server error: unable to remove log

## Add New Things

add-thing-scanning-icon =
    .alt = Scanning
add-thing-scanning = Scanning for new devices…
add-thing-add-adapters-hint = No new things found. Try <a data-l10n-name="add-thing-add-adapters-hint-anchor">adding some add-ons</a>.
add-thing-add-by-url = Add by URL…
add-thing-done = Done
add-thing-cancel = Cancel

## Context Menu

context-menu-choose-icon = Choose icon…
context-menu-save = Save
context-menu-remove = Remove

## Capabilities

OnOffSwitch = On/Off Switch
MultiLevelSwitch = Multi Level Switch
ColorControl = Color Control
ColorSensor = Color Sensor
EnergyMonitor = Energy Monitor
BinarySensor = Binary Sensor
MultiLevelSensor = Multi Level Sensor
SmartPlug = Smart Plug
Light = Light
DoorSensor = Door Sensor
MotionSensor = Motion Sensor
LeakSensor = Leak Sensor
PushButton = Push Button
VideoCamera = Video Camera
Camera = Camera
TemperatureSensor = Temperature Sensor
HumiditySensor = Humidity Sensor
Alarm = Alarm
Thermostat = Thermostat
Lock = Lock
BarometricPressureSensor = Barometric Pressure Sensor
Custom = Custom Thing
Thing = Thing
AirQualitySensor = Air Quality Sensor
SmokeSensor = Smoke Sensor

## Properties

alarm = Alarm
pushed = Pushed
not-pushed = Not Pushed
on-off = On/Off
on = On
off = Off
power = Power
voltage = Voltage
temperature = Temperature
current = Current
frequency = Frequency
color = Color
brightness = Brightness
leak = Leak
dry = Dry
color-temperature = Color Temperature
video-unsupported = Sorry, video is not supported in your browser.
motion = Motion
no-motion = No Motion
open = Open
closed = Closed
locked = Locked
unlocked = Unlocked
jammed = Jammed
unknown = Unknown
active = Active
inactive = Inactive
humidity = Humidity
concentration = Concentration
density = Density
smoke = Smoke

## Domain Setup

tunnel-setup-reclaim-domain = It looks like you’ve already registered that subdomain. To reclaim it <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">click here</a>.
check-email-for-token = Please check your email for a reclamation token and paste it above.
reclaim-failed = Could not reclaim domain.
subdomain-already-used = This subdomain is already being used. Please choose a different one.
invalid-subdomain = Invalid subdomain.
invalid-email = Invalid email address.
invalid-reclamation-token = Invalid reclamation token.
domain-success = Success! Please wait while we redirect you…
issuing-error = Error issuing certificate. Please try again.
redirecting = Redirecting…

## Booleans

true = True
false = False

## Time

utils-now = now
utils-seconds-ago =
    { $value ->
        [one] { $value } second ago
       *[other] { $value } seconds ago
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minute ago
       *[other] { $value } minutes ago
    }
utils-hours-ago =
    { $value ->
        [one] { $value } hour ago
       *[other] { $value } hours ago
    }
utils-days-ago =
    { $value ->
        [one] { $value } day ago
       *[other] { $value } days ago
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } week ago
       *[other] { $value } weeks ago
    }
utils-months-ago =
    { $value ->
        [one] { $value } month ago
       *[other] { $value } months ago
    }
utils-years-ago =
    { $value ->
        [one] { $value } year ago
       *[other] { $value } years ago
    }
minute = Minute
hour = Hour
day = Day
week = Week

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
abbrev-day = d
abbrev-hour = h
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = ft
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Unknown device type
new-thing-choose-icon = Choose icon…
new-thing-save = Save
new-thing-pin =
    .placeholder = Enter PIN
new-thing-pin-error = Incorrect PIN
new-thing-pin-invalid = Invalid PIN
new-thing-cancel = Cancel
new-thing-submit = Submit
new-thing-username =
    .placeholder = Enter username
new-thing-password =
    .placeholder = Enter password
new-thing-credentials-error = Incorrect credentials
new-thing-saved = Saved
new-thing-done = Done

## New Web Thing View

new-web-thing-url =
    .placeholder = Enter web thing URL
new-web-thing-label = Web Thing
loading = Loading…
new-web-thing-multiple = Multiple web things found
new-web-thing-from = from

## Empty div Messages

no-things = No devices yet. Click + to scan for available devices.
thing-not-found = Thing not found.
action-not-found = Action not found.
events-not-found = This thing has no events.

## Add-on Settings

add-addons =
    .aria-label = Find New Add-ons
author-unknown = Unknown
disable = Disable
enable = Enable
by = by
license = license
addon-configure = Configure
addon-update = Update
addon-remove = Remove
addon-updating = Updating…
addon-updated = Updated
addon-update-failed = Failed
addon-config-applying = Applying…
addon-config-apply = Apply
addon-discovery-added = Added
addon-discovery-add = Add
addon-discovery-installing = Installing…
addon-discovery-failed = Failed
addon-search =
    .placeholder = Search

## Page Titles

settings = Settings
domain = Domain
users = Users
edit-user = Edit User
add-user = Add User
adapters = Adapters
addons = Add-ons
addon-config = Configure Add-on
addon-discovery = Discover New Add-ons
experiments = Experiments
localization = Localization
updates = Updates
authorizations = Authorizations
developer = Developer
network = Network
ethernet = Ethernet
wifi = Wi-Fi
icon = Icon

## Errors

unknown-state = Unknown state.
error = Error
errors = Errors
gateway-unreachable = Gateway Unreachable
more-information = More Information
invalid-file = Invalid file.
failed-read-file = Failed to read file.
failed-save = Failed to save.

## Schema Form

unsupported-field = Unsupported field schema

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Login — { -webthings-gateway-brand }
login-log-in = Log in
login-wrong-credentials = Username or password was incorrect.
login-wrong-totp = Authentication code was incorrect.
login-enter-totp = Enter code from your authenticator app.

## Create First User Page

signup-title = Create User — { -webthings-gateway-brand }
signup-welcome = Welcome
signup-create-account = Create your first user account:
signup-password-mismatch = Passwords do not match
signup-next = Next

## Tunnel Setup Page

tunnel-setup-title = Choose Web Address — { -webthings-gateway-brand }
tunnel-setup-welcome = Welcome
tunnel-setup-choose-address = Choose a secure web address for your gateway:
tunnel-setup-input-subdomain =
    .placeholder = subdomain
tunnel-setup-email-opt-in = Keep me updated with news about WebThings.
tunnel-setup-agree-privacy-policy = Agree to the WebThings <a data-l10n-name="tunnel-setup-privacy-policy-link">Privacy Policy</a> and <a data-l10n-name="tunnel-setup-tos-link">Terms of Service</a>.
tunnel-setup-input-reclamation-token =
    .placeholder = Reclamation Token
tunnel-setup-error = An error occurred while setting up the subdomain.
tunnel-setup-create = Create
tunnel-setup-skip = Skip
tunnel-setup-time-sync = Waiting for system clock to be set from the Internet. Domain registration is likely to fail until this completes.

## Authorize Page

authorize-title = Authorization Request — { -webthings-gateway-brand }
authorize-authorization-request = Authorization Request
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> would like to access your gateway to <<function>> devices.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = from <<domain>>
authorize-monitor-and-control = monitor and control
authorize-monitor = monitor
authorize-allow-all = Allow for all Things
authorize-allow =
    .value = Allow
authorize-deny = Deny

## Local Token Page

local-token-title = Local Token Service — { -webthings-gateway-brand }
local-token-header = Local Token Service
local-token-your-token = Your local token is this <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Use it to talk to the gateway securely, with <a data-l10n-name="local-token-bearer-type">Bearer-type Authorization</a>.
local-token-copy-token = Copy Token

## Router Setup Page

router-setup-title = Router Setup — { -webthings-gateway-brand }
router-setup-header = Create a new Wi-Fi network
router-setup-input-ssid =
    .placeholder = Network name
router-setup-input-password =
    .placeholder = Password
router-setup-input-confirm-password =
    .placeholder = Confirm password
router-setup-create =
    .value = Create
router-setup-password-mismatch = Passwords must match

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi Setup — { -webthings-gateway-brand }
wifi-setup-header = Connect to a Wi-Fi network?
wifi-setup-input-password =
    .placeholder = Password
wifi-setup-show-password = Show password
wifi-setup-connect =
    .value = Connect
wifi-setup-network-icon =
    .alt = Wi-Fi Network
wifi-setup-skip = Skip

## Connecting to Wi-Fi Page

connecting-title = Connecting to Wi-Fi — { -webthings-gateway-brand }
connecting-header = Connecting to Wi-Fi…
connecting-connect = Please ensure you are connected to the same network and then navigate to { $gateway-link } in your web browser to continue setup.
connecting-warning = Note: If you are unable to load { $domain }, look up the gateway’s IP address on your router.
connecting-header-skipped = Wi-Fi setup skipped
connecting-skipped = The gateway is now being started. Navigate to { $gateway-link } in your web browser while connected to the same network as the gateway to continue setup.

## Creating Wi-Fi Network Page

creating-title = Creating Wi-Fi Network — { -webthings-gateway-brand }
creating-header = Creating Wi-Fi network…
creating-content = Please connect to { $ssid } with the password you just created, then navigate to { $gateway-link } or { $ip-link } in your web browser.

## UI Updates

ui-update-available = An updated user interface is available.
ui-update-reload = Reload
ui-update-close = Close

## Transfer to webthings.io
action-required-image =
    .alt = Warning
action-required = Action Required:
action-required-message = The Mozilla IoT remote access service and automatic software updates are being discontinued. Choose whether to transfer to the community-run webthings.io for continued service.
action-required-more-info = More info
action-required-dont-ask-again = Don't ask again
action-required-choose = Choose
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = The Mozilla IoT remote access service and automatic software updates are being discontinued on 31st December 2020 (<a data-l10n-name="transition-dialog-more-info">find out more</a>). Mozilla is transitioning the project to the new community-run <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a> (not affiliated with Mozilla).<br><br>If you do not wish to continue receiving software updates from community-run update servers, you can disable automatic updates in Settings.<br><br>If you would like to transfer your mozilla-iot.org subdomain to webthings.io, or register a new subdomain, you can fill out the form below to register for the replacement community-run remote access service.
transition-dialog-register-domain-label = Register for the webthings.io remote access service
transition-dialog-subdomain =
    .placeholder = Subdomain
transition-dialog-newsletter-label = Keep me updated with news about WebThings
transition-dialog-agree-tos-label = Agree to the WebThings <a data-l10n-name="transition-dialog-privacy-policy-link">Privacy Policy</a> and <a data-l10n-name="transition-dialog-tos-link">Terms of Service</a>.
transition-dialog-email =
    .placeholder = Email address
transition-dialog-register =
    .value = Register
transition-dialog-register-status =
    .alt = Registration status
transition-dialog-register-label = Registering subdomain
transition-dialog-subscribe-status =
    .alt = Newsletter subscription status
transition-dialog-subscribe-label = Subscribing to newsletter
transition-dialog-error-generic = An error occurred. Please go back and try again.
transition-dialog-error-subdomain-taken = Chosen subdomain already taken. Please go back and choose another.
transition-dialog-error-subdomain-failed = Failed to register subdomain. Please go back and try again.
transition-dialog-error-subscribe-failed = Failed to subscribe to newsletter. Please try again at <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Navigate to <<domain>> to continue.

## General Terms

ok = OK
ellipsis = …
event-log = Event Log
edit = Edit
remove = Remove
disconnected = Disconnected
processing = Processing…
submit = Submit

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Back
overflow-button =
    .aria-label = Additional Actions
submit-button =
    .aria-label = Submit
edit-button =
    .aria-label = Edit
save-button =
    .aria-label = Save
