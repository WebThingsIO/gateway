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

rules-menu-item = Κανόνες
settings-menu-item = Ρυθμίσεις
log-out-button = Αποσύνδεση

## Things


## Floorplan

upload-floorplan-hint = (προτείνεται .svg)

## Top-Level Settings

settings-domain = Τομέας
settings-network = Δίκτυο
settings-users = Χρήστες
settings-add-ons = Πρόσθετα
settings-localization = Μετάφραση
settings-updates = Ενημερώσεις
settings-experiments = Πειράματα

## Domain Settings


## Network Settings

network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Οικιακό δίκτυο
network-settings-internet-image =
    .alt = Διαδίκτυο
network-settings-wan-mode = Λειτουργία
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Διεύθυνση IP
network-settings-done = Τέλος
network-settings-wifi-password =
    .placeholder = Κωδικός πρόσβασης
network-settings-connect = Σύνδεση
network-settings-username = Όνομα χρήστη
network-settings-password = Κωδικός πρόσβασης
network-settings-dhcp-server = Διακομιστής DHCP

## User Settings

user-settings-input-name =
    .placeholder = Όνομα
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = Κωδικός πρόσβασης
user-settings-save = Αποθήκευση

## Adapter Settings


## Authorization Settings


## Experiment Settings


## Localization Settings

localization-settings-language-region = Γλώσσα & περιοχή
localization-settings-country = Χώρα
localization-settings-timezone = Ζώνη ώρας
localization-settings-language = Γλώσσα
localization-settings-units = Μονάδες
localization-settings-units-temperature = Θερμοκρασία
localization-settings-units-temperature-celsius = Κελσίου (°C)
localization-settings-units-temperature-fahrenheit = Φαρενάιτ (°F)

## Update Settings

update-settings-update-now = Ενημέρωση τώρα
update-available = Νέα έκδοση διαθέσιμη.
update-up-to-date = Το σύστημά σας είναι ενημερωμένο.
last-update = Τελευταία ενημέρωση
current-version = Τρέχουσα έκδοση
never = Ποτέ
in-progress = Σε εξέλιξη…
restarting = Επανεκκίνηση…
checking-for-updates = Έλεγχος για ενημερώσεις…

## Developer Settings


## Rules

rules = Κανόνες
rules-preview-button =
    .alt = Προεπισκόπηση
rules-delete-icon =
    .alt = Διαγραφή
rules-delete-cancel =
    .value = Ακύρωση
rules-delete-confirm =
    .value = Αφαίρεση κανόνα
rule-delete-cancel-button =
    .value = Ακύρωση
rule-delete-confirm-button =
    .value = Αφαίρεση κανόνα
rule-notification = Ειδοποίηση
notification-title = Τίτλος
notification-message = Μήνυμα
notification-level = Επίπεδο
rule-name = Όνομα κανόνα

## Logs

logs-device = Συσκευή
logs-property = Ιδιότητα
logs-hours = Ώρες
logs-days = Ημέρες
logs-weeks = Εβδομάδες
logs-save = Αποθήκευση
logs-remove-dialog-title = Αφαίρεση
logs-remove = Αφαίρεση

## Add New Things

add-thing-scanning-icon =
    .alt = Σάρωση
add-thing-done = Τέλος
add-thing-cancel = Ακύρωση

## Context Menu

context-menu-choose-icon = Επιλογή εικονιδίου…
context-menu-save = Αποθήκευση
context-menu-remove = Αφαίρεση

## Capabilities

DoorSensor = Αισθητήρας πόρτας
MotionSensor = Αισθητήρας κίνησης
LeakSensor = Αισθητήρας διαρροής
Camera = Κάμερα
TemperatureSensor = Αισθητήρας θερμοκρασίας
Thermostat = Θερμοστάτης

## Properties

on = Ενεργό
off = Ανενεργό
voltage = Τάση
temperature = Θερμοκρασία
current = Ρεύμα
frequency = Συχνότητα
color = Χρώμα
brightness = Φωτεινότητα
leak = Διαρροή
color-temperature = Θερμοκρασία χρώματος
motion = Κίνηση
open = Άνοιγμα
unknown = Άγνωστο
active = Ενεργό
inactive = Ανενεργό

## Domain Setup

redirecting = Ανακατεύθυνση…

## Booleans


## Time

utils-now = τώρα
utils-seconds-ago =
    { $value ->
        [one] { $value } δευτερόλεπτο πριν
       *[other] { $value } δευτερόλεπτα πριν
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } λεπτό πριν
       *[other] { $value } λεπτά πριν
    }
utils-hours-ago =
    { $value ->
        [one] { $value } ώρα πριν
       *[other] { $value } ώρες πριν
    }
utils-days-ago =
    { $value ->
        [one] { $value } ημέρα πριν
       *[other] { $value } ημέρες πριν
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } εβδομάδα πριν
       *[other] { $value } εβδομάδες πριν
    }
utils-months-ago =
    { $value ->
        [one] { $value } μήνα πριν
       *[other] { $value } μήνες πριν
    }
utils-years-ago =
    { $value ->
        [one] { $value } έτος πριν
       *[other] { $value } έτη πριν
    }
minute = Λεπτό
hour = Ώρα
day = Ημέρα
week = Εβδομάδα

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
abbrev-day = η
abbrev-hour = ώ
abbrev-minute = λ
abbrev-second = δ
abbrev-millisecond = ms
abbrev-foot = ft

## New Thing View

unknown-device-type = Άγνωστος τύπος συσκευής
new-thing-choose-icon = Επιλογή εικονιδίου…
new-thing-save = Αποθήκευση
new-thing-pin =
    .placeholder = Εισαγωγή PIN
new-thing-pin-error = Λάθος PIN
new-thing-cancel = Ακύρωση
new-thing-submit = Υποβολή
new-thing-done = Τέλος

## New Web Thing View

loading = Φόρτωση…
new-web-thing-from = από

## Empty div Messages


## Add-on Settings

author-unknown = Άγνωστο
disable = Απενεργοποίηση
enable = Ενεργοποίηση
by = από
addon-update = Ενημέρωση
addon-remove = Αφαίρεση
addon-updating = Ενημέρωση…
addon-config-applying = Εφαρμογή...
addon-config-apply = Εφαρμογή
addon-discovery-add = Προσθήκη
addon-discovery-installing = Εγκατάσταση…

## Page Titles

settings = Ρυθμίσεις
domain = Τομέας
users = Χρήστες
edit-user = Επεξεργασία χρήστη
add-user = Προσθήκη χρήστη
addons = Πρόσθετα
experiments = Πειράματα
localization = Μετάφραση
updates = Ενημερώσεις
network = Δίκτυο
ethernet = Ethernet
wifi = Wi-Fi
icon = Εικονίδιο

## Errors

unknown-state = Άγνωστη κατάσταση.
error = Σφάλμα
errors = Σφάλματα
more-information = Περισσότερες πληροφορίες
invalid-file = Μη έγκυρο αρχείο.
failed-read-file = Αποτυχία ανάγνωσης αρχείου.
failed-save = Αποτυχία αποθήκευσης.

## Schema Form


## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Σύνδεση — { -webthings-gateway-brand }
login-log-in = Σύνδεση

## Create First User Page

signup-title = Δημιουργία χρήστη — { -webthings-gateway-brand }
signup-welcome = Καλώς ορίσατε!
signup-next = Επόμενο

## Tunnel Setup Page

tunnel-setup-welcome = Καλώς ορίσατε
tunnel-setup-privacy-policy = Πολιτική απορρήτου
tunnel-setup-create = Δημιουργία
tunnel-setup-skip = Παράλειψη

## Authorize Page

# Use <<domain>> to indicate where the domain should be placed
authorize-source = από <<domain>>

## Local Token Page


## Router Setup Page

router-setup-input-ssid =
    .placeholder = Όνομα δικτύου
router-setup-input-password =
    .placeholder = Κωδικός πρόσβασης
router-setup-input-confirm-password =
    .placeholder = Επιβεβαίωση κωδικού πρόσβασης
router-setup-create =
    .value = Δημιουργία

## Wi-Fi Setup Page

wifi-setup-title = Ρύθμιση Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Σύνδεση στο δίκτυο Wi-Fi;
wifi-setup-input-password =
    .placeholder = Κωδικός πρόσβασης
wifi-setup-show-password = Εμφάνιση κωδικού πρόσβασης
wifi-setup-connect =
    .value = Σύνδεση
wifi-setup-network-icon =
    .alt = Δίκτυο Wi-Fi
wifi-setup-skip = Παράλειψη

## Connecting to Wi-Fi Page

connecting-title = Σύνδεση στο Wi-Fi — { -webthings-gateway-brand }
connecting-header = Σύνδεση στο Wi-Fi…

## Creating Wi-Fi Network Page


## UI Updates


## General Terms


## Top-Level Buttons

