## The following terms must be treated as brand, and kept in English.
##
## They cannot be:
## - Transliterated.
## - Translated.
##
## Declension should be avoided where possible.
##
## Reference: https://mozilla-l10n.github.io/styleguides/mozilla_general/index.html#brands-copyright-and-trademark

-webthings-gateway-brand = WebThings গেটওয়ে
# Main Title
webthings-gateway = { -webthings-gateway-brand }
# Wordmark
wordmark =
    .alt = { -webthings-gateway-brand }

## Menu Items

things-menu-item = জিনিসসমূহ
rules-menu-item = নিয়মাবলী
logs-menu-item = লগ
settings-menu-item = সেটিং
log-out-button = লগ আউট

## Things

thing-details =
    .aria-label = বৈশিষ্ট্য দেখুন
add-things =
    .aria-label = নতুন জিনিস যুক্ত করুন

## Floorplan

upload-floorplan = ফ্লোরপ্ল্যান আপলোড করুন…
upload-floorplan-hint = (.svg প্রস্তাবিত করা হয়েছে)

## Top-Level Settings

settings-domain = ডোমেইন
settings-network = নেটওয়ার্ক
settings-users = ব্যবহারকারীগণ
settings-add-ons = অ্যাড-অন
settings-adapters = অ্যাডাপ্টার
settings-localization = স্থানীয়করণ
settings-updates = আপডেট
settings-authorizations = অনুমোদন
settings-experiments = এক্সপেরিমেন্ট
settings-developer = ডেভেলপার

## Domain Settings

domain-settings-local-label = লোকাল অ্যাক্সেস
domain-settings-local-update = হোস্টের নাম আপডেট করুন
domain-settings-local-name =
    .placeholder = গেটওয়ে

## Network Settings

network-settings-unsupported = এই প্ল্যাটফর্মের জন্য নেটওয়ার্ক সেটিংস কর্মক্ষম নয়।
network-settings-ethernet-image =
    .alt = ইথারনেট
network-settings-ethernet = ইথারনেট
network-settings-wifi-image =
    .alt = ওয়াই-ফাই
network-settings-wifi = ওয়াই-ফাই
network-settings-home-network-image =
    .alt = হোম নেটওয়ার্ক
network-settings-internet-image =
    .alt = ইন্টারনেট
network-settings-configure = কনফিগার করুন
network-settings-internet-wan = ইন্টারনেট (WAN)
network-settings-wan-mode = মোড
network-settings-home-network-lan = হোম নেটওয়ার্ক (LAN)
network-settings-wifi-wlan = ওয়াই-ফাই (WLAN)
network-settings-ip-address = আইপি ঠিকানা
network-settings-dhcp = স্বয়ংক্রিয় (DHCP)
network-settings-static = ম্যানুয়াল (স্ট্যাটিক আইপি)
network-settings-pppoe = ব্রিজ (PPPoE)
network-settings-static-ip-address = স্ট্যাটিক আইপি ঠিকানা
network-settings-network-mask = নেটওয়ার্ক মাস্ক
network-settings-gateway = গেটওয়ে
network-settings-done = সম্পন্ন হয়েছে
network-settings-wifi-password =
    .placeholder = পাসওয়ার্ড
network-settings-show-password = পাসওয়ার্ড দেখুন
network-settings-connect = সংযুক্ত করুন
network-settings-username = ব্যবহারকারীর নাম
network-settings-password = পাসওয়ার্ড
network-settings-router-ip = রাউটারের আইপি ঠিকানা
network-settings-dhcp-server = DHCP সার্ভার
network-settings-enable-wifi = ওয়াই-ফাই সক্ষম করুন
network-settings-network-name = নেটওয়ার্কের নাম (SSID)
wireless-connected = সংযুক্ত হয়েছে
wireless-icon =
    .alt = ওয়াই-ফাই নেটওয়ার্ক
network-settings-changing = নেটওয়ার্ক সেটিংস পরিবর্তন করা হচ্ছে। এটি এক মিনিট সময় নিতে পারে।
failed-ethernet-configure = ইথারনেট কনফিগার করতে ব্যর্থ হয়েছে।
failed-wifi-configure = ওয়াই-ফাই কনফিগার করতে ব্যর্থ হয়েছে।
failed-wan-configure = WAN কনফিগার করতে ব্যর্থ হয়েছে।
failed-lan-configure = LAN কনফিগার করতে ব্যর্থ হয়েছে।
failed-wlan-configure = WLANকনফিগার করতে ব্যর্থ হয়েছে।

## User Settings

create-user =
    .aria-label = নতুন ব্যবহারকারী যুক্ত করুন
user-settings-input-name =
    .placeholder = নাম
user-settings-input-email =
    .placeholder = ইমেইল
user-settings-input-password =
    .placeholder = পাসওয়ার্ড
user-settings-input-new-password =
    .placeholder = নতুন পাসওয়ার্ড (ঐচ্ছিক):
user-settings-input-confirm-new-password =
    .placeholder = নতুন পাসওয়ার্ড নিশ্চিত করুন
user-settings-input-confirm-password =
    .placeholder = পাসওয়ার্ড নিশ্চিত করুন
user-settings-password-mismatch = পাসওয়ার্ড মিলছে না
user-settings-save = সংরক্ষণ করুন

## Adapter Settings

adapter-settings-no-adapters = কোনও অ্যাডাপ্টার উপস্থিত নেই।

## Authorization Settings

authorization-settings-no-authorizations = কোনও অনুমোদন নেই।

## Experiment Settings


## Localization Settings

localization-settings-language-region = ভাষা ও অঞ্চল
localization-settings-country = দেশ
localization-settings-timezone = সময় অঞ্চল
localization-settings-language = ভাষা
localization-settings-units = এককসমূহ
localization-settings-units-temperature = তাপমাত্রা
localization-settings-units-temperature-celsius = সেলসিয়াস (°C)
localization-settings-units-temperature-fahrenheit = ফারেনহাইট (°F)

## Update Settings

update-settings-update-now = এখনই আপডেট করুন
update-available = নতুন সংস্করণ বিদ্যমান আছে।
update-up-to-date = আপনার সিস্টেমটির মেয়াদ শেষ হয়েছে।
updates-not-supported = আপডেটগুলি এই প্ল্যাটফর্মটিতে কর্মক্ষম নয়।
update-settings-enable-self-updates = স্বয়ংক্রিয় আপডেটগুলি সক্ষম করুন
last-update = সর্বশেষ আপডেট
current-version = বর্তমান সংস্করণ
failed = ব্যর্থ হয়েছে
never = কখনো নয়
in-progress = চলমান…
restarting = পুনরায় চালু হচ্ছে ...
checking-for-updates = আপডেটগুলি অনুসন্ধান করা হচ্ছে ...
failed-to-check-for-updates = এই মুহুর্তে আপডেটগুলি পরীক্ষা করতে অক্ষম।

## Developer Settings

developer-settings-enable-ssh = SSH সক্রিয় করুন
developer-settings-view-internal-logs = অভ্যন্তরীণ লগগুলি দেখুন
developer-settings-create-local-authorization = স্থানীয় অনুমোদন তৈরি করুন

## Rules

add-rule =
    .aria-label = নতুন নিয়ম তৈরি করুন
rules = নিয়মাবলী
rules-create-rule-hint = কোনও নিয়ম তৈরি করা হয়নি। একটি নিয়ম তৈরি করতে + ক্লিক করুন।
rules-rule-name = নিয়মের নাম
rules-customize-rule-name-icon =
    .alt = নিয়মের নাম কাস্টমাইজ করুন
rules-rule-description = নিয়মের বিবরণ
rules-preview-button =
    .alt = প্রাকদর্শন
rules-delete-icon =
    .alt = মুছে ফেলুন
rules-drag-input-hint = ইনপুট হিসাবে ডিভাইস যুক্ত করুন
rules-drag-output-hint = আউটপুট হিসাবে ডিভাইস যুক্ত করুন
rules-scroll-left =
    .alt = বামদিকে স্ক্রোল করুন
rules-scroll-right =
    .alt = ডানদিকে স্ক্রোল করুন
rules-delete-dialog = আপনি কি এই নিয়ম স্থায়ীভাবে মুছে ফেলার বিষয়ে নিশ্চিত?
rules-delete-cancel =
    .value = বাতিল করুন
rules-delete-confirm =
    .value = নিয়ম মুছে ফেলুন
rule-invalid = অকার্যকর
rule-delete-prompt = আপনি কি এই নিয়ম স্থায়ীভাবে মুছে ফেলার বিষয়ে নিশ্চিত?
rule-delete-cancel-button =
    .value = বাতিল করুন
rule-not = না
rule-event = ইভেন্ট
notification-title = শিরোনাম
notification-message = বার্তা
notification-low = কম
notification-normal = স্বাভাবিক
notification-high = বেশি
rule-name = নিয়মের নাম

## Logs

logs = লগ
logs-device = ডিভাইস
logs-save = সংরক্ষণ করুন
logs-remove = মুছে ফেলুন

## Add New Things

add-thing-done = সম্পন্ন হয়েছে
add-thing-cancel = বাতিল করুন

## Context Menu

context-menu-save = সংরক্ষণ করুন
context-menu-remove = মুছে ফেলুন

## Capabilities

VideoCamera = ভিডিও ক্যামেরা
Camera = ক্যামেরা

## Properties

on = চালু
off = বন্ধ
voltage = ভোল্টেজ
temperature = তাপমাত্রা
current = বর্তমান
color = রঙ
brightness = উজ্জ্বলতা
dry = শুষ্ক
video-unsupported = দুঃখিত, ভিডিওটি আপনার ব্রাউজারে সমর্থিত নয়।
motion = গতি
open = খুলুন
closed = বন্ধ
unknown = অপরিচিত
active = সক্রিয়
inactive = নিষ্ক্রিয়

## Domain Setup

invalid-subdomain = অকার্যকর সাবডোমেন।

## Booleans

true = সত্য
false = মিথ্যা

## Time

utils-now = এখন
minute = মিনিট
hour = ঘন্টা
day = দিন
week = সপ্তাহ

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
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

new-thing-save = সংরক্ষণ করুন
new-thing-pin =
    .placeholder = PIN দিন
new-thing-pin-error = ভুল PIN
new-thing-pin-invalid = অকার্যকর PIN
new-thing-cancel = বাতিল করুন
new-thing-submit = জমা দিন
new-thing-saved = সংরক্ষণ করা হয়েছে
new-thing-done = সম্পন্ন হয়েছে

## New Web Thing View


## Empty div Messages


## Add-on Settings

author-unknown = অপরিচিত
disable = নিষ্ক্রিয় করুন
enable = সক্রিয় করুন
addon-remove = মুছে ফেলুন
addon-discovery-add = যোগ করুন

## Page Titles

domain = ডোমেইন
localization = স্থানীয়করণ
wifi = Wi-Fi

## Errors


## Schema Form


## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-log-in = লগ ইন

## Create First User Page

signup-welcome = স্বাগতম
signup-next = পরবর্তী

## Tunnel Setup Page

tunnel-setup-welcome = স্বাগতম
tunnel-setup-input-subdomain =
    .placeholder = সাবডোমেন
tunnel-setup-create = তৈরি করুন
tunnel-setup-skip = এড়িয়ে যান

## Authorize Page

authorize-allow =
    .value = অনুমতি দিন

## Local Token Page


## Router Setup Page

router-setup-header = একটি নতুন Wi-Fi নেটওয়ার্ক তৈরি করুন
router-setup-input-password =
    .placeholder = পাসওয়ার্ড
router-setup-input-confirm-password =
    .placeholder = পাসওয়ার্ড নিশ্চিত করুন
router-setup-create =
    .value = তৈরি করুন

## Wi-Fi Setup Page

wifi-setup-input-password =
    .placeholder = পাসওয়ার্ড
wifi-setup-show-password = পাসওয়ার্ড দেখান
wifi-setup-network-icon =
    .alt = Wi-Fi নেটওয়ার্ক
wifi-setup-skip = এড়িয়ে যান

## Connecting to Wi-Fi Page


## Creating Wi-Fi Network Page


## UI Updates


## General Terms

ok = ঠিক আছে
submit = জমা দিন

## Top-Level Buttons

back-button =
    .aria-label = ফিরে যান
submit-button =
    .aria-label = জমা দিন
save-button =
    .aria-label = সংরক্ষণ করুন
