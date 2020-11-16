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

things-menu-item = சாதனங்கள்
rules-menu-item = விதிமுறைகள்
logs-menu-item = பதிவுகள்
floorplan-menu-item = நிலத்தள திட்டம்
settings-menu-item = அமைப்புகள்
log-out-button = வெளியேறு

## Things

thing-details =
    .aria-label = தன்மைகளை பார்க்கவும்
add-things =
    .aria-label = புதிய சாதனங்களைச் சேர்க்கவும்

## Floorplan

upload-floorplan = நிலத்தளத்தை பதிவேற்றுக…
upload-floorplan-hint = (.svg பரிந்துரைக்கப்படுகிறது)

## Top-Level Settings

settings-domain = டொமைன்
settings-network = பிணையம்
settings-users = பயன்படுத்துபவர்கள்
settings-add-ons = கூடுதல் இணைப்புகள்
settings-adapters = இணைப்புச்சாதனங்கள்
settings-localization = இடத்துக்கேற்றதாக்குதல்
settings-updates = புதுப்பித்தல்
settings-authorizations = அங்கீகாரங்கள்
settings-experiments = சோதனைகள்
settings-developer = உருவாக்குபவர்

## Domain Settings

domain-settings-local-label = அக அணுகல்
domain-settings-local-update = சேவையக பெயரை புதுப்பி
domain-settings-remote-access = தொலைநிலை அணுகல்
domain-settings-local-name =
    .placeholder = நுழைவாயில்

## Network Settings

network-settings-unsupported = இந்த தளத்திற்கு பிணைய அமைப்புகள் ஆதரிக்கப்படவில்லை.
network-settings-ethernet-image =
    .alt = ஈத்தர்நெட்
network-settings-ethernet = ஈத்தர்நெட்
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = முகப்பு பிணையம்
network-settings-internet-image =
    .alt = இணையதளம்
network-settings-configure = கட்டமை
network-settings-internet-wan = இணையதளம் (WAN)
network-settings-wan-mode = முறை
network-settings-home-network-lan = முகப்பு பிணையம் (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = IP முகவரி
network-settings-dhcp = தானியங்கி (DHCP)
network-settings-static = கைமுறை (நிலையான IP)
network-settings-pppoe = பிணைய பாலம் (PPPoE)
network-settings-static-ip-address = நிலையான IP முகவரி
network-settings-network-mask = பிணைய முகமூடி
network-settings-gateway = நுழைவாயில்
network-settings-done = முடிந்தது
network-settings-wifi-password =
    .placeholder = கடவுச்சொல்
network-settings-show-password = கடவுச்சொல்லை காட்டு
network-settings-connect = இணை
network-settings-username = பயனர் பெயர்
network-settings-password = கடவுச்சொல்
network-settings-router-ip = திசைவி IP முகவரி
network-settings-dhcp-server = DHCP சேவையகம்
network-settings-enable-wifi = Wi-Fi யை செயல்படுத்து
network-settings-network-name = பிணைய பெயர் (SSID)
wireless-connected = இணைக்கப்பட்டது
wireless-icon =
    .alt = Wi-Fi பிணையம்
network-settings-changing = பிணைய அமைப்புகள் மாற்றப்படுகிறது . இதற்கு ஒரு நிமிடம் ஆகலாம்.
failed-ethernet-configure = ஈத்தர்நெட்டை உள்ளமைப்பதில் தோல்வி.
failed-wifi-configure = Wi-Fi ஐ உள்ளமைப்பதில் தோல்வி.
failed-wan-configure = WAN ஐ உள்ளமைப்பதில் தோல்வி.
failed-lan-configure = LAN ஐ உள்ளமைப்பதில் தோல்வி.
failed-wlan-configure = WLAN ஐ உள்ளமைப்பதில் தோல்வி.

## User Settings

create-user =
    .aria-label = புதிய பயனரைச் சேர்க்கவும்
user-settings-input-name =
    .placeholder = பெயர்
user-settings-input-email =
    .placeholder = மின்னஞ்சல் முகவரி
user-settings-input-password =
    .placeholder = கடவுச்சொல்
user-settings-input-totp =
    .placeholder = 2FA குறியீடு
user-settings-mfa-enable = இரண்டு காரணி அங்கீகாரத்தை செயல்படுத்து
user-settings-mfa-scan-code = உங்கள் இரண்டு-காரணி அங்கீகார செயலியில் பின்வரும் குறியீட்டை ஸ்கேன் செய்யுங்கள்.
user-settings-mfa-secret = மேலே உள்ள QR குறியீடு செயல்படவில்லை என்றால் இந்த புதிய ரகசிய TOTPஐ பயன்படுத்துங்கள்
user-settings-mfa-error = தவறான அங்கீகார குறியீடு.
user-settings-mfa-enter-code = கீழே உங்கள் அங்கீகார செயலியில் உள்ள குறியீட்டை உள்ளிடவும்.
user-settings-mfa-verify = சரிபார்க்கவும்
user-settings-mfa-regenerate-codes = காப்பு குறியீடுகளை மீண்டும் உருவாக்கவும்
user-settings-mfa-backup-codes = இவை தான் உங்கள் காப்பு குறியீடுகள். ஒவ்வொன்றையும் ஒரு முறை மட்டுமே பயன்படுத்த முடியும். இவற்றை பாதுகாப்பான இடத்தில் வைக்கவும்.
user-settings-input-new-password =
    .placeholder = புதிய கடவுச்சொல் (விரும்பினால்)
user-settings-input-confirm-new-password =
    .placeholder = புதிய கடவுச்சொல்லை உறுதிசெய்யவும்
user-settings-input-confirm-password =
    .placeholder = கடவுச்சொல்லை உறுதிசெய்யவும்
user-settings-password-mismatch = கடவுச்சொற்கள் பொருந்தவில்லை
user-settings-save = சேமி

## Adapter Settings

adapter-settings-no-adapters = இணைப்புச்சாதனங்கள் எதுவும் இல்லை.

## Authorization Settings

authorization-settings-no-authorizations = அங்கீகாரங்கள் எதுவும்  இல்லை.

## Experiment Settings

experiment-settings-no-experiments = இந்நேரத்தில் சோதனைகள் எதுவும் இல்லை.

## Localization Settings

localization-settings-language-region = மொழி & இடம்
localization-settings-country = நாடு
localization-settings-timezone = நேரமண்டலம்
localization-settings-language = மொழி
localization-settings-units = அலகுகள்
localization-settings-units-temperature = வெப்பநிலை
localization-settings-units-temperature-celsius = செல்சியஸ் (° C)
localization-settings-units-temperature-fahrenheit = பாரன்ஹீட் (° F)

## Update Settings

update-settings-update-now = இப்போது புதுப்பி
update-available = புதிய பதிப்பு உள்ளது
update-up-to-date = உங்கள் மென்பொருள் புதுப்பித்த நிலையில் உள்ளது
updates-not-supported = இந்த தளத்தில் புதுப்பிப்புகள் ஆதரிக்கப்படவில்லை.
update-settings-enable-self-updates = தானியங்கி புதுப்பித்தல்களை செயல்படுத்து
last-update = கடைசியாக புதுப்பிக்கப்பட்டது
current-version = தற்போதைய பதிப்பு
failed = தோல்வியுற்றது
never = ஒருபோதும் இல்லை
in-progress = செயல்பாட்டில் உள்ளது
restarting = மறுதுவக்கம்…
checking-for-updates = புதிய பதிப்புகளுக்காக பார்க்கிறது…
failed-to-check-for-updates = தற்போது புதுப்பிப்புகளைச் பார்க்க முடியவில்லை.

## Developer Settings

developer-settings-enable-ssh = SSH ஐ செயல்படுத்து
developer-settings-view-internal-logs = உள் பதிவுகளை பார்க்கவும்
developer-settings-create-local-authorization = உள் அங்கீகாரத்தை உருவாக்கவும்

## Rules

add-rule =
    .aria-label = புதிய விதிமுறையை உருவாக்கவும்
rules = விதிமுறைகள்
rules-create-rule-hint = எந்த விதிகளும் உருவாக்கப்படவில்லை. விதியை உருவாக்க +ஐ கிளிக் செய்யவும்.
rules-rule-name = விதிமுறையின் பெயர்
rules-customize-rule-name-icon =
    .alt = விதியின் பெயரை தனிப்பயனாக்குங்கள்
rules-rule-description = விதியின் விளக்கம்
rules-preview-button =
    .alt = முன்தோற்றம்
rules-delete-icon =
    .alt = அழி
rules-drag-hint = விதியை உருவாக்கத் தொடங்க உங்கள் சாதனங்களை இங்கே இழுக்கவும்
rules-drag-input-hint = சாதனத்தை உள்ளீடாகச் சேர்க்கவும்
rules-drag-output-hint = சாதனத்தை வெளியீடாகச் சேர்க்கவும்
rules-scroll-left =
    .alt = இடதுபுறம் உருட்டவும்
rules-scroll-right =
    .alt = வலதுபுறம் உருட்டவும்
rules-delete-prompt = சாதனங்களை துண்டிக்க இங்கே விடவும்
rules-delete-dialog = இந்த விதிமுறையை நிரந்தரமாக அகற்ற விரும்புகிறீர்களா?
rules-delete-cancel =
    .value = ரத்து செய்
rules-delete-confirm =
    .value = விதியை நீக்கு
rule-invalid = மதிப்பில்லாத
rule-delete-prompt = இந்த விதிமுறைகளை நிரந்தரமாக அகற்ற விரும்புகிறீர்களா?
rule-delete-cancel-button =
    .value = ரத்து செய்
rule-delete-confirm-button =
    .value = விதியை நீக்கு
rule-select-property = தன்மைகளைத் தேர்ந்தெடுக்கவும்
rule-not = இல்லை
rule-event = நிகழ்வு
rule-action = செயல்
rule-configure = கட்டமைக்க
rule-time-title = நாளின் நேரம்
rule-notification = அறிவிப்பு
notification-title = தலைப்பு
notification-message = செய்தி
notification-level = நிலை
notification-low = குறைவு
notification-normal = சாதாரணம்
notification-high = அதிகம்
rule-name = விதியின் பெயர்

## Logs

add-log =
    .aria-label = புதிய பதிவை உருவாக்கவும்
logs = பதிவுகள்
logs-create-log-hint = பதிவுகள் எதுவும் உருவாக்கப்படவில்லை. ஒரு பதிவை உருவாக்க +ஐ கிளிக் செய்யவும்.
logs-device = சாதனம்
logs-device-select =
    .aria-label = சாதனப் பதிவு
logs-property = தன்மைகள்
logs-property-select =
    .aria-label = தன்மைப் பதிவு
logs-retention = தக்கவைத்தல்
logs-retention-length =
    .aria-label = பதிவு வைத்திருத்தல் நீளம்
logs-retention-unit =
    .aria-label = பதிவு வைத்திருத்தல் பிரிவு
logs-hours = மணிநேரங்கள்
logs-days = நாட்கள்
logs-weeks = வாரங்கள்
logs-save = சேமி
logs-remove-dialog-title = நீக்குதல்
logs-remove-dialog-warning = பதிவை நீக்குவது அதன் எல்லா தரவையும் நீக்கிவிடும் . நீங்கள் நிச்சயமாக அதை நீக்க விரும்புகிறீர்களா?
logs-remove = நீக்கு
logs-unable-to-create = பதிவை உருவாக்க முடியவில்லை
logs-server-remove-error = சேவையக பிழை: பதிவை அகற்ற முடியவில்லை

## Add New Things

add-thing-scanning-icon =
    .alt = ஸ்கேன் செய்கிறது
add-thing-scanning = புதிய சாதனங்களுக்கு ஸ்கேன் செய்கிறது…
add-thing-add-adapters-hint = புதிய சாதனங்கள் எதுவும் கிடைக்கவில்லை. <a data-l10n-name="add-thing-add-adapters-hint-anchor"> சில கூடுதல் இணைப்புகளைச் சேர்க்க </a> முயற்சிக்கவும்.
add-thing-add-by-url = URL மூலம் சேர்…
add-thing-done = முடிந்தது
add-thing-cancel = ரத்து செய்

## Context Menu

context-menu-choose-icon = உருவத்தை தேர்ந்தெடு…
context-menu-save = சேமி
context-menu-remove = நீக்கு

## Capabilities

OnOffSwitch = இருநிலை ஸ்விட்ச்
MultiLevelSwitch = பலநிலை ஸ்விட்ச்
ColorControl = வண்ண கட்டுப்பாடு
ColorSensor = வண்ண உணர்வி
EnergyMonitor = மின் ஆற்றல் கண்காணிப்பு
BinarySensor = இரும உணர்வி
MultiLevelSensor = பலநிலை உணர்வி
SmartPlug = ஸ்மார்ட் பிளக்
Light = ஒளி விளக்கு
DoorSensor = கதவு உணர்வி
MotionSensor = அசைவு உணர்வி
LeakSensor = கசிவு உணர்வி
PushButton = தள்ளு பொத்தான்
VideoCamera = நிகழ்பதிவி
Camera = புகைப்படக்கருவி
TemperatureSensor = வெப்பநிலை உணர்வி
Alarm = அலறி
Thermostat = வெப்பநிலைக்காப்பி
Lock = பூட்டு
Custom = தனிப்பயன் சாதனம்
Thing = சாதனம்

## Properties

alarm = அலறி
pushed = அமுக்கப்பட்டுள்ளது
not-pushed = அமுக்கப்படவில்லை
on-off = ஆன் / ஆஃப்
on = ஆன்
off = ஆஃப்
power = மின்சக்தி
voltage = மின்னழுத்தம்
temperature = வெப்பநிலை
current = மின்னோட்டம்
frequency = அதிர்வெண்
color = வண்ணம்
brightness = பிரகாசம்
leak = கசிவு
dry = உலர்
color-temperature = வண்ண/நிற வெப்பநிலை
video-unsupported = மன்னிக்கவும், உங்கள் உலாவியில் வீடியோ ஆதரிக்கப்படவில்லை.
motion = அசைவு
no-motion = அசைவு இல்லை
open = திறந்துள்ளது
closed = மூடியுள்ளது
locked = பூட்டப்பட்டுள்ளது
unlocked = திறக்கப்பட்டுள்ளது
jammed = நெரிசலாக உள்ளது
unknown = தெரியாத
active = செயலில் உள்ளது
inactive = செயலில் இல்லை

## Domain Setup

tunnel-setup-reclaim-domain = நீங்கள் ஏற்கனவே அந்த துணை டொமைனை பதிவு செய்துள்ளதாக தெரிகிறது. அதை மீண்டும் பெற <a data-l10n-name="tunnel-setup-reclaim-domain-click-here"> இங்கே கிளிக் செய்க </a>.
check-email-for-token = மீட்டெடுப்பு டோக்கனுக்காக உங்கள் மின்னஞ்சலை சரிபார்த்து மேலே ஒட்டவும்.
reclaim-failed = டொமைனை மீட்டெடுக்க முடியவில்லை.
subdomain-already-used = இந்த துணை டொமைன் ஏற்கனவே பயன்படுத்தப்படுகிறது. தயவுசெய்து வேறு ஒன்றைத் தேர்ந்தெடுக்கவும்.
invalid-subdomain = தவறான துணை டொமைன்.
invalid-email = தவறான மின்னஞ்சல் முகவரி.
invalid-reclamation-token = தவறான மீட்டெடுப்பு டோக்கன்.
domain-success = வெற்றி! நாங்கள் உங்களை திருப்பி விடும்வரை காத்திருங்கள்…
issuing-error = சான்றிதழ் வழங்குவதில் பிழை. தயவு செய்து மீண்டும் முயற்சிக்கவும்.
redirecting = திசைதிருப்புகிறது ...

## Booleans

true = சரி
false = தவறு

## Time

utils-now = இப்பொழுது
utils-seconds-ago =
    { $value ->
        [one] விநாடிகளுக்கு முன்பு
       *[other] விநாடிகளுக்கு முன்பு
    }
utils-minutes-ago =
    { $value ->
        [one] நிமிடங்களுக்கு முன்பு
       *[other] நிமிடங்களுக்கு முன்பு
    }
utils-hours-ago =
    { $value ->
        [one] மணிநேரங்களுக்கு முன்பு
       *[other] மணிநேரங்களுக்கு முன்பு
    }
utils-days-ago =
    { $value ->
        [one] நாட்களுக்கு முன்பு
       *[other] நாட்களுக்கு முன்பு
    }
utils-weeks-ago =
    { $value ->
        [one] வாரங்களுக்கு முன்பு
       *[other] வாரங்களுக்கு முன்பு
    }
utils-months-ago =
    { $value ->
        [one] மாதங்களுக்கு முன்பு
       *[other] மாதங்களுக்கு முன்பு
    }
utils-years-ago =
    { $value ->
        [one] ஆண்டுகளுக்கு முன்பு
       *[other] ஆண்டுகளுக்கு முன்பு
    }
minute = நிமிடம்
hour = மணிநேரம்
day = நாள்
week = வாரம்

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

## New Thing View

unknown-device-type = அறியப்படாத சாதன வகை
new-thing-choose-icon = உருவத்தை தேர்ந்தெடு…
new-thing-save = சேமி
new-thing-pin =
    .placeholder = PINஐ உள்ளிடவும்
new-thing-pin-error = தவறான PIN
new-thing-pin-invalid = மதிப்பில்லாத PIN
new-thing-cancel = ரத்து செய்
new-thing-submit = சமர்ப்பி
new-thing-username =
    .placeholder = பயனர்பெயரை உள்ளிடவும்
new-thing-password =
    .placeholder = கடவுச்சொல்லை உள்ளிடவும்
new-thing-credentials-error = தவறான அறிமுகசான்றுகள்
new-thing-saved = சேமிக்கப்பட்டது
new-thing-done = முடிந்தது

## New Web Thing View

new-web-thing-url =
    .placeholder = வலை சாதனத்தின் URL ஐ உள்ளிடவும்
new-web-thing-label = வலை சாதனம்
loading = ஏற்றுகிறது…
new-web-thing-multiple = பல வலை சாதனங்கள் கண்டுபிடிக்கப்பட்டுள்ளது
new-web-thing-from = இருந்து

## Empty div Messages

no-things = இதுவரை சாதனங்கள் எதுவும் இல்லை. கிடைக்கக்கூடிய சாதனங்களை ஸ்கேன் செய்ய +ஐ  கிளிக் செய்யவும்.
thing-not-found = சாதனம் கிடைக்கவில்லை.
action-not-found = செயல் கிடைக்கவில்லை.
events-not-found = இந்த சாதனத்தில் எந்த நிகழ்வுகளும் இல்லை.

## Add-on Settings

add-addons =
    .aria-label = கூடுதல் இணைப்புகளை கண்டறியவும்
author-unknown = தெரியாதது
disable = செயல்நீக்கு
enable = செயல்படுத்து
by = மூலம்
license = உரிமம்
addon-configure = கட்டமை
addon-update = புதுப்பி
addon-remove = நீக்கு
addon-updating = புதுப்பிக்கிறது ...
addon-updated = புதுப்பிக்கப்பட்டது
addon-update-failed = தோல்வியடைந்தது
addon-config-applying = பயன்படுத்துகிறது ...
addon-config-apply = பயன்படுத்து
addon-discovery-added = சேர்க்கப்பட்டது
addon-discovery-add = சேர்
addon-discovery-installing = நிறுவுகிறது ...
addon-discovery-failed = தோல்வியடைந்தது
addon-search =
    .placeholder = தேடு:

## Page Titles

settings = அமைப்புகள்
domain = டொமைன்
users = பயன்படுத்துபவர்கள்
edit-user = பயனரைத் திருத்து
add-user = பயனரைச் சேர்க்கவும்
adapters = இணைப்புச்சாதனங்கள்
addons = கூடுதல் இணைப்புகள்
addon-config = கூடுதல் இணைப்புகளை கட்டமை
addon-discovery = கூடுதல் இணைப்புகளை கண்டறியவும்
experiments = சோதனைகள்
localization = இடத்துக்கேற்றதாக்குதல்
updates = புதுப்பிப்புகள்
authorizations = அங்கீகாரங்கள்
developer = உருவாக்குபவர்
network = பிணையம்
ethernet = ஈத்தர்நெட்
wifi = Wi-Fi
icon = உருவம்

## Errors

unknown-state = அறியாத நிலை
error = பிழை
errors = பிழைகள்
gateway-unreachable = நுழைவாயிலை அணுக முடியவில்லை
more-information = கூடுதல் தகவல்
invalid-file = தவறான கோப்பு.
failed-read-file = கோப்பை வாசிப்பதில் தோல்வி.
failed-save = சேமிப்பதில் தோல்வி.

## Schema Form

unsupported-field = ஆதரிக்கப்படாத புலத் திட்டம்

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = உள் நுழை — { -webthings-gateway-brand }
login-log-in = உள் நுழை
login-wrong-credentials = பயனர்பெயர் அல்லது கடவுச்சொல் தவறானது.
login-wrong-totp = தவறான அங்கீகார குறியீடு.
login-enter-totp = உங்கள் அங்கீகார செயலியில் உள்ள குறியீட்டை உள்ளிடவும்.

## Create First User Page

signup-title = பயனரை உருவாக்கு — { -webthings-gateway-brand }
signup-welcome = நல்வரவு!
signup-create-account = உங்கள் முதல் பயனர் கணக்கை உருவாக்கவும்:
signup-password-mismatch = கடவுச்சொற்கள் பொருந்தவில்லை
signup-next = அடுத்து

## Tunnel Setup Page

tunnel-setup-title = வலை முகவரியைத் தேர்வுசெய்க — { -webthings-gateway-brand }
tunnel-setup-welcome = நல்வரவு!
tunnel-setup-choose-address = உங்கள் நுழைவாயிலுக்கு பாதுகாப்பான வலை முகவரியைத் தேர்வுசெய்க:
tunnel-setup-input-subdomain =
    .placeholder = துணை டொமைன்
tunnel-setup-input-reclamation-token =
    .placeholder = மீட்பு டோக்கன்
tunnel-setup-error = துணை டொமைனை அமைக்கும் போது பிழை ஏற்பட்டுள்ளது .
tunnel-setup-create = உருவாக்கு
tunnel-setup-skip = தவிர்
tunnel-setup-time-sync = கணினி நேரத்தை இணையத்திலிருந்து அமைக்கக் காத்திருக்கிறது. இது முடியும் வரை டொமைன் பதிவு தோல்வியடைய வாய்ப்புள்ளது .

## Authorize Page

authorize-title = அங்கீகார கோரிக்கை — { -webthings-gateway-brand }
authorize-authorization-request = அங்கீகார கோரிக்கை
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> சாதனங்களை <<function>> உங்கள் நுழைவாயிலை அணுக விரும்புகிறது.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = <<domain>> இலிருந்து
authorize-monitor-and-control = கண்காணிக்கவும் மற்றும் கட்டுப்படுத்தவும்
authorize-monitor = கண்காணிக்க
authorize-allow-all = எல்லா சாதனங்களுக்கும் அனுமதி
authorize-allow =
    .value = அனுமதி
authorize-deny = மறு

## Local Token Page

local-token-title = உள் அடையாள சேவை — { -webthings-gateway-brand }
local-token-header = உள் அடையாள சேவை
local-token-your-token = உங்கள் உள் அடையாளம் இந்த <a data-l10n-name="local-token-jwt"> JSON Web Token</a> தான் :
local-token-use-it = நுழைவாயிலுடன் பாதுகாப்பாக பேச இந்த <a data-l10n-name="local-token-bearer-type"> Bearer-type அங்கீகாரத்தை</a> பயன்படுத்தவும்.

## Router Setup Page

router-setup-title = திசைவி அமைப்பு — { -webthings-gateway-brand }
router-setup-header = புதிய Wi-Fi நெட்வொர்க்கை உருவாக்கவும்
router-setup-input-ssid =
    .placeholder = பிணைய பெயர்
router-setup-input-password =
    .placeholder = கடவுச்சொல்
router-setup-input-confirm-password =
    .placeholder = கடவுச்சொல்லை உறுதிசெய்
router-setup-create =
    .value = உருவாக்கு
router-setup-password-mismatch = கடவுச்சொற்கள் பொருந்த வேண்டும்

## Wi-Fi Setup Page

wifi-setup-title = Wi-Fi அமைப்பு — { -webthings-gateway-brand }
wifi-setup-header = Wi-Fi நெட்வொர்க்குடன் இணைக்கவா?
wifi-setup-input-password =
    .placeholder = கடவுச்சொல்
wifi-setup-show-password = கடவுச்சொல்லை காட்டு
wifi-setup-connect =
    .value = இணை
wifi-setup-network-icon =
    .alt = Wi-Fi பிணையம்
wifi-setup-skip = தவிர்

## Connecting to Wi-Fi Page

connecting-title = Wi-Fi உடன் இணைக்கிறது — { -webthings-gateway-brand }
connecting-header = Wi-Fi உடன் இணைக்கிறது…
connecting-connect = நீங்கள் அதே நெட்வொர்க்குடன் இணைக்கப்பட்டுள்ளீர்கள் என்பதை உறுதிசெய்து, அமைப்பைத் தொடர உங்கள் வலை உலாவியில் { $gateway-link } க்கு செல்லவும்.
connecting-warning = குறிப்பு: உங்களால் { $domain } ஐ அனுக  முடியவில்லை என்றால், உங்கள்  நுழைவாயிலின் ஐபி முகவரியைப் பாருங்கள்.
connecting-header-skipped = Wi-Fi அமைப்பு தவிர்க்கப்பட்டது
connecting-skipped = நுழைவாயில் இப்போது தொடங்கப்படுகிறது. அமைப்பைத் தொடர நுழைவாயில் எந்த பிணையத்தில் இணைக்கப்பட்டிருக்கிறதோ அதே பிணையத்திலிருந்து உங்கள் வலை உலாவியில் { $gateway-link } க்கு செல்லவும்.

## Creating Wi-Fi Network Page

creating-title = Wi-Fi நெட்வொர்க்கை உருவாக்குகிறது — { -webthings-gateway-brand }
creating-header = Wi-Fi வைஃபை நெட்வொர்க்கை உருவாக்குகிறது…
creating-content = நீங்கள் உருவாக்கிய கடவுச்சொல்லை வைத்து, இந்த  { $ssid } உடன்  இணையுங்கள் ,பின்னர் உங்கள் வலை உலாவியில்  { $gateway-link } or { $ip-link } க்கு செல்லவும்.

## UI Updates

ui-update-available = புதுப்பிக்கப்பட்ட பயனர் இடைமுகம் கிடைக்கிறது.
ui-update-reload = மீளேற்று
ui-update-close = மூடு

## General Terms

ok = சரி
ellipsis = ...
event-log = நிகழ்வு பதிவு
edit = திருத்து
remove = நீக்கு
disconnected = துண்டிக்கப்பட்டது
processing = செயலாக்குகிறது…
submit = சமர்ப்பி

## Top-Level Buttons

menu-button =
    .aria-label = பட்டியல்
back-button =
    .aria-label = பின் செல்
overflow-button =
    .aria-label = கூடுதல் செயல்கள்
submit-button =
    .aria-label = சமர்ப்பி
edit-button =
    .aria-label = திருத்து
save-button =
    .aria-label = சேமி
