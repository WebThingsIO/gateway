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

things-menu-item = Συσκευές
rules-menu-item = Κανόνες
logs-menu-item = Αρχεία καταγραφής
floorplan-menu-item = Κάτοψη
settings-menu-item = Ρυθμίσεις
log-out-button = Αποσύνδεση

## Things

thing-details =
    .aria-label = Προβολή ιδιοτήτων
add-things =
    .aria-label = Προσθήκη νέων συσκευών

## Floorplan

upload-floorplan = Μεταφόρτωση κάτοψης…
upload-floorplan-hint = (προτείνεται .svg)

## Top-Level Settings

settings-domain = Τομέας
settings-network = Δίκτυο
settings-users = Χρήστες
settings-add-ons = Πρόσθετα
settings-adapters = Προσαρμογείς
settings-localization = Μετάφραση
settings-updates = Ενημερώσεις
settings-authorizations = Εξουσιοδοτήσεις
settings-experiments = Πειράματα
settings-developer = Προγραμματιστής

## Domain Settings

domain-settings-local-label = Τοπική πρόσβαση
domain-settings-local-update = Ενημέρωση ονόματος υπολογιστή
domain-settings-remote-access = Απομακρυσμένη πρόσβαση
domain-settings-local-name =
    .placeholder = πύλη

## Network Settings

network-settings-unsupported = Οι ρυθμίσεις δικτύου δεν υποστηρίζονται σε αυτή την πλατφόρμα.
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
network-settings-configure = Διαμόρφωση
network-settings-internet-wan = Διαδίκτυο (WAN)
network-settings-wan-mode = Λειτουργία
network-settings-home-network-lan = Οικιακό δίκτυο (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Διεύθυνση IP
network-settings-dhcp = Αυτόματη (DHCP)
network-settings-static = Μη αυτόματη (Στατική IP)
network-settings-pppoe = Γέφυρα (PPPoE)
network-settings-static-ip-address = Στατική διεύθυνση IP
network-settings-network-mask = Μάσκα δικτύου
network-settings-gateway = Πύλη
network-settings-done = Τέλος
network-settings-wifi-password =
    .placeholder = Κωδικός πρόσβασης
network-settings-show-password = Εμφάνιση κωδικού πρόσβασης
network-settings-connect = Σύνδεση
network-settings-username = Όνομα χρήστη
network-settings-password = Κωδικός πρόσβασης
network-settings-router-ip = IP διεύθυνση router
network-settings-dhcp-server = Διακομιστής DHCP
network-settings-enable-wifi = Ενεργοποίηση Wi-Fi
network-settings-network-name = Όνομα δικτύου (SSID)
wireless-connected = Συνδέθηκε
wireless-icon =
    .alt = Δίκτυο Wi-Fi
network-settings-changing = Αλλαγή ρυθμίσεων δικτύου. Ίσως χρειαστεί λίγη ώρα.
failed-ethernet-configure = Αποτυχία διαμόρφωσης Ethernet.
failed-wifi-configure = Αποτυχία διαμόρφωσης Wi-Fi.
failed-wan-configure = Αποτυχία διαμόρφωσης WAN.
failed-lan-configure = Αποτυχία διαμόρφωσης LAN.
failed-wlan-configure = Αποτυχία διαμόρφωσης WLAN.

## User Settings

create-user =
    .aria-label = Προσθήκη νέου χρήστη
user-settings-input-name =
    .placeholder = Όνομα
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = Κωδικός πρόσβασης
user-settings-input-totp =
    .placeholder = Κωδικός 2FA
user-settings-mfa-enable = Ενεργοποίηση ελέγχου ταυτότητας δύο παραγόντων
user-settings-mfa-scan-code = Σαρώστε τον ακόλουθο κώδικα με οποιαδήποτε εφαρμογή ελέγχου ταυτότητας δύο παραγόντων.
user-settings-mfa-secret = Αυτό είναι το νέο σας μυστικό TOTP, σε περίπτωση που ο παραπάνω κώδικας QR δεν λειτουργεί:
user-settings-mfa-error = Ο κωδικός ελέγχου ταυτότητας ήταν εσφαλμένος.
user-settings-mfa-enter-code = Εισάγετε τον κωδικό από την εφαρμογή ελέγχου ταυτότητάς σας παρακάτω.
user-settings-mfa-verify = Επαλήθευση
user-settings-mfa-regenerate-codes = Εκ νέου δημιουργία εφεδρικών κωδικών
user-settings-mfa-backup-codes = Αυτοί είναι οι εφεδρικοί κωδικοί σας. Ο κάθε κωδικός μπορεί να χρησιμοποιηθεί μόνο μία φορά. Φυλάξτε τους σε ασφαλές μέρος.
user-settings-input-new-password =
    .placeholder = Νέος κωδικός πρόσβασης (προαιρετικό)
user-settings-input-confirm-new-password =
    .placeholder = Επιβεβαίωση νέου κωδικού πρόσβασης
user-settings-input-confirm-password =
    .placeholder = Επιβεβαίωση κωδικού πρόσβασης
user-settings-password-mismatch = Οι κωδικοί πρόσβασης δεν ταιριάζουν
user-settings-save = Αποθήκευση

## Adapter Settings

adapter-settings-no-adapters = Δεν υπάρχουν προσαρμογείς.

## Authorization Settings

authorization-settings-no-authorizations = Καμία εξουσιοδότηση.

## Experiment Settings

experiment-settings-no-experiments = Κανένα διαθέσιμο πείραμα αυτή τη στιγμή.

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
updates-not-supported = Δεν υποστηρίζονται ενημερώσεις σε αυτή την πλατφόρμα.
update-settings-enable-self-updates = Ενεργοποίηση αυτόματων ενημερώσεων
last-update = Τελευταία ενημέρωση
current-version = Τρέχουσα έκδοση
failed = Αποτυχία
never = Ποτέ
in-progress = Σε εξέλιξη…
restarting = Επανεκκίνηση…
checking-for-updates = Έλεγχος για ενημερώσεις…
failed-to-check-for-updates = Δεν είναι δυνατός ο έλεγχος για ενημερώσεις αυτή τη στιγμή.

## Developer Settings

developer-settings-enable-ssh = Ενεργοποίηση SSH
developer-settings-view-internal-logs = Προβολή εσωτερικών αρχείων καταγραφής
developer-settings-create-local-authorization = Δημιουργία τοπικής εξουσιοδότησης

## Rules

add-rule =
    .aria-label = Δημιουργία νέου κανόνα
rules = Κανόνες
rules-create-rule-hint = Δεν έχετε δημιουργήσει κανόνες. Κάντε κλικ στο + για να δημιουργήσετε έναν κανόνα.
rules-rule-name = Όνομα κανόνα
rules-customize-rule-name-icon =
    .alt = Προσαρμογή ονόματος κανόνα
rules-rule-description = Περιγραφή κανόνα
rules-preview-button =
    .alt = Προεπισκόπηση
rules-delete-icon =
    .alt = Διαγραφή
rules-drag-hint = Σύρετε τις συσκευές σας εδώ για να ξεκινήσετε τη δημιουργία ενός κανόνα
rules-drag-input-hint = Προσθήκη συσκευής ως εισόδου
rules-drag-output-hint = Προσθήκη συσκευής ως εξόδου
rules-scroll-left =
    .alt = Κύλιση προς τα αριστερά
rules-scroll-right =
    .alt = Κύλιση προς τα δεξιά
rules-delete-prompt = Εναποθέστε εδώ συσκευές για αποσύνδεση
rules-delete-dialog = Θέλετε σίγουρα να διαγράψετε οριστικά αυτό τον κανόνα;
rules-delete-cancel =
    .value = Ακύρωση
rules-delete-confirm =
    .value = Αφαίρεση κανόνα
rule-invalid = Μη έγκυρο
rule-delete-prompt = Θέλετε σίγουρα να διαγράψετε οριστικά αυτό τον κανόνα;
rule-delete-cancel-button =
    .value = Ακύρωση
rule-delete-confirm-button =
    .value = Αφαίρεση κανόνα
rule-select-property = Επιλογή ιδιότητας
rule-not = Όχι
rule-event = Συμβάν
rule-action = Ενέργεια
rule-configure = Διαμόρφωση…
rule-time-title = Ώρα ημέρας
rule-notification = Ειδοποίηση
notification-title = Τίτλος
notification-message = Μήνυμα
notification-level = Επίπεδο
notification-low = Χαμηλό
notification-normal = Κανονικό
notification-high = Υψηλό
rule-name = Όνομα κανόνα

## Logs

add-log =
    .aria-label = Δημιουργία νέου αρχείου καταγραφής
logs = Αρχεία καταγραφής
logs-create-log-hint = Δεν έχετε δημιουργήσει αρχεία καταγραφής. Κάντε κλικ στο + για να δημιουργήσετε ένα αρχείο καταγραφής.
logs-device = Συσκευή
logs-device-select =
    .aria-label = Συσκευή καταγραφής
logs-property = Ιδιότητα
logs-property-select =
    .aria-label = Ιδιότητα αρχείου καταγραφής
logs-retention = Διατήρηση
logs-retention-length =
    .aria-label = Μέγεθος μνήμης αρχείου καταγραφής
logs-retention-unit =
    .aria-label = Μονάδα μνήμης αρχείου καταγραφής
logs-hours = Ώρες
logs-days = Ημέρες
logs-weeks = Εβδομάδες
logs-save = Αποθήκευση
logs-remove-dialog-title = Αφαίρεση
logs-remove-dialog-warning = Η αφαίρεση του αρχείο καταγραφής θα αφαιρέσει και όλα τα δεδομένα του. Θέλετε σίγουρα να το διαγράψετε;
logs-remove = Αφαίρεση
logs-unable-to-create = Δεν ήταν δυνατή η δημιουργία αρχείου καταγραφής
logs-server-remove-error = Σφάλμα διακομιστή: δεν ήταν δυνατή η διαγραφή του αρχείου καταγραφής

## Add New Things

add-thing-scanning-icon =
    .alt = Σάρωση
add-thing-scanning = Σάρωση για νέες συσκευές…
add-thing-add-adapters-hint = Δεν βρέθηκαν νέες συσκευές. Δοκιμάστε <a data-l10n-name="add-thing-add-adapters-hint-anchor">να προσθέσετε μερικά πρόσθετα</a>.
add-thing-add-by-url = Προσθήκη με URL…
add-thing-done = Τέλος
add-thing-cancel = Ακύρωση

## Context Menu

context-menu-choose-icon = Επιλογή εικονιδίου…
context-menu-save = Αποθήκευση
context-menu-remove = Αφαίρεση

## Capabilities

OnOffSwitch = Διακόπτης λειτουργίας
MultiLevelSwitch = Διακόπτης πολλαπλών επιπέδων
ColorControl = Έλεγχος χρώματος
ColorSensor = Αισθητήρας χρώματος
EnergyMonitor = Εργαλείο εποπτείας ενέργειας
BinarySensor = Δυαδικός αισθητήρας
MultiLevelSensor = Αισθητήρας πολλαπλών επιπέδων
SmartPlug = Έξυπνη πρίζα
Light = Φως
DoorSensor = Αισθητήρας πόρτας
MotionSensor = Αισθητήρας κίνησης
LeakSensor = Αισθητήρας διαρροής
PushButton = Κουμπί
VideoCamera = Βιντεοκάμερα
Camera = Κάμερα
TemperatureSensor = Αισθητήρας θερμοκρασίας
HumiditySensor = Αισθητήρας υγρασίας
Alarm = Συναγερμός
Thermostat = Θερμοστάτης
Lock = Κλειδαριά
BarometricPressureSensor = Αισθητήρας βαρομετρικής πίεσης
Custom = Προσαρμοσμένη συσκευή
Thing = Συσκευή
AirQualitySensor = Αισθητήρας ποιότητας αέρα
SmokeSensor = Αισθητήρας καπνού

## Properties

alarm = Συναγερμός
pushed = Πατημένο
not-pushed = Μη πατημένο
on-off = Ενεργό/Ανενεργό
on = Ενεργό
off = Ανενεργό
power = Ισχύς
voltage = Τάση
temperature = Θερμοκρασία
current = Ρεύμα
frequency = Συχνότητα
color = Χρώμα
brightness = Φωτεινότητα
leak = Διαρροή
dry = Ξηρασία
color-temperature = Θερμοκρασία χρώματος
video-unsupported = Λυπούμαστε, το βίντεο δεν υποστηρίζεται στο πρόγραμμα περιήγησής σας.
motion = Κίνηση
no-motion = Χωρίς κίνηση
open = Ανοικτό
closed = Κλειστό
locked = Κλειδωμένο
unlocked = Ξεκλειδωμένο
jammed = Μπλοκαρισμένο
unknown = Άγνωστο
active = Ενεργό
inactive = Ανενεργό
humidity = Υγρασία
concentration = Συγκέντρωση
density = Πυκνότητα
smoke = Καπνός

## Domain Setup

tunnel-setup-reclaim-domain = Φαίνεται ότι έχετε ήδη καταχωρίσει αυτό τον υποτομέα. Για να τον ανακτήσετε, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">κάντε κλικ εδώ</a>.
check-email-for-token = Παρακαλούμε ελέγξτε το email σας για το token ανάκτησης και επικολλήστε το παραπάνω.
reclaim-failed = Δεν ήταν δυνατή η ανάκτηση του τομέα.
subdomain-already-used = Αυτό ο υποτομέας χρησιμοποιείται ήδη. Παρακαλούμε επιλέξτε έναν διαφορετικό.
invalid-subdomain = Μη έγκυρος υποτομέας.
invalid-email = Μη έγκυρη διεύθυνση email.
invalid-reclamation-token = Μη έγκυρο token ανάκτησης.
domain-success = Επιτυχία! Παρακαλούμε περιμένετε όσο σας ανακατευθύνουμε…
issuing-error = Σφάλμα κατά την έκδοση πιστοποιητικού. Παρακαλούμε προσπαθήστε ξανά.
redirecting = Ανακατεύθυνση…

## Booleans

true = Αληθές
false = Ψευδές

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
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Άγνωστος τύπος συσκευής
new-thing-choose-icon = Επιλογή εικονιδίου…
new-thing-save = Αποθήκευση
new-thing-pin =
    .placeholder = Εισαγωγή PIN
new-thing-pin-error = Λάθος PIN
new-thing-pin-invalid = Μη έγκυρο PIN
new-thing-cancel = Ακύρωση
new-thing-submit = Υποβολή
new-thing-username =
    .placeholder = Εισαγωγή ονόματος χρήστη
new-thing-password =
    .placeholder = Εισαγωγή κωδικού πρόσβασης
new-thing-credentials-error = Λανθασμένα διαπιστευτήρια
new-thing-saved = Αποθηκεύτηκε
new-thing-done = Τέλος

## New Web Thing View

new-web-thing-url =
    .placeholder = Εισαγάγετε το URL του αντικειμένου ιστού
new-web-thing-label = Αντικείμενο ιστού
loading = Φόρτωση…
new-web-thing-multiple = Βρέθηκαν πολλαπλά αντικείμενα ιστού
new-web-thing-from = από

## Empty div Messages

no-things = Καμία συσκευή ακόμα. Κάντε κλικ στο + για εύρεση διαθέσιμων συσκευών.
thing-not-found = Δεν βρέθηκε συσκευή.
action-not-found = Δεν βρέθηκε ενέργεια.
events-not-found = Αυτή η συσκευή δεν έχει συμβάντα.

## Add-on Settings

add-addons =
    .aria-label = Εύρεση νέων προσθέτων
author-unknown = Άγνωστο
disable = Απενεργοποίηση
enable = Ενεργοποίηση
by = από
license = άδεια
addon-configure = Διαμόρφωση
addon-update = Ενημέρωση
addon-remove = Αφαίρεση
addon-updating = Ενημέρωση…
addon-updated = Ενημερώθηκε
addon-update-failed = Αποτυχία
addon-config-applying = Εφαρμογή...
addon-config-apply = Εφαρμογή
addon-discovery-added = Προστέθηκε
addon-discovery-add = Προσθήκη
addon-discovery-installing = Εγκατάσταση…
addon-discovery-failed = Αποτυχία
addon-search =
    .placeholder = Αναζήτηση

## Page Titles

settings = Ρυθμίσεις
domain = Τομέας
users = Χρήστες
edit-user = Επεξεργασία χρήστη
add-user = Προσθήκη χρήστη
adapters = Προσαρμογείς
addons = Πρόσθετα
addon-config = Διαμόρφωση προσθέτου
addon-discovery = Ανακάλυψη νέων πρόσθετων
experiments = Πειράματα
localization = Μετάφραση
updates = Ενημερώσεις
authorizations = Εξουσιοδοτήσεις
developer = Προγραμματιστής
network = Δίκτυο
ethernet = Ethernet
wifi = Wi-Fi
icon = Εικονίδιο

## Errors

unknown-state = Άγνωστη κατάσταση.
error = Σφάλμα
errors = Σφάλματα
gateway-unreachable = Απρόσιτη πύλη
more-information = Περισσότερες πληροφορίες
invalid-file = Μη έγκυρο αρχείο.
failed-read-file = Αποτυχία ανάγνωσης αρχείου.
failed-save = Αποτυχία αποθήκευσης.

## Schema Form

unsupported-field = Μη υποστηριζόμενο σχήμα πεδίου

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Σύνδεση — { -webthings-gateway-brand }
login-log-in = Σύνδεση
login-wrong-credentials = Το όνομα χρήστη ή ο κωδικός πρόσβασης ήταν λάθος.
login-wrong-totp = Ο κωδικός ελέγχου ταυτότητας ήταν εσφαλμένος.
login-enter-totp = Εισάγετε τον κωδικό από την εφαρμογή ελέγχου ταυτότητάς σας.

## Create First User Page

signup-title = Δημιουργία χρήστη — { -webthings-gateway-brand }
signup-welcome = Καλώς ορίσατε!
signup-create-account = Δημιουργήστε τον πρώτο σας λογαριασμό χρήστη:
signup-password-mismatch = Οι κωδικοί πρόσβασης δεν ταιριάζουν
signup-next = Επόμενο

## Tunnel Setup Page

tunnel-setup-title = Επιλογή διεύθυνσης ιστού — { -webthings-gateway-brand }
tunnel-setup-welcome = Καλώς ορίσατε
tunnel-setup-choose-address = Επιλέξτε μια ασφαλή διεύθυνση ιστού για την πύλη σας:
tunnel-setup-input-subdomain =
    .placeholder = υποτομέας
tunnel-setup-email-opt-in = Να ενημερώνομαι για ειδήσεις σχετικά με το WebThings.
tunnel-setup-agree-privacy-policy = Συμφωνώ με την <a data-l10n-name="tunnel-setup-privacy-policy-link">Πολιτική απορρήτου</a> και τους <a data-l10n-name="tunnel-setup-tos-link">Όρους υπηρεσίας</a> του WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Token ανάκτησης
tunnel-setup-error = Προέκυψε σφάλμα κατά τη ρύθμιση του υποτομέα.
tunnel-setup-create = Δημιουργία
tunnel-setup-skip = Παράλειψη
tunnel-setup-time-sync = Αναμονή για ρύθμιση του ρολογιού συστήματος από το Διαδίκτυο. Η εγγραφή τομέα ενδέχεται να αποτύχει έως ότου η παραπάνω ρύθμιση ολοκληρωθεί.

## Authorize Page

authorize-title = Αίτημα εξουσιοδότησης — { -webthings-gateway-brand }
authorize-authorization-request = Αίτημα εξουσιοδότησης
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = Το <<name>> επιθυμεί πρόσβαση στην πύλη σας για <<function>> συσκευών.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = από <<domain>>
authorize-monitor-and-control = εποπτεία και έλεγχο
authorize-monitor = εποπτεία
authorize-allow-all = Αποδοχή για όλες τις συσκευές
authorize-allow =
    .value = Αποδοχή
authorize-deny = Άρνηση

## Local Token Page

local-token-title = Τοπική υπηρεσία token — { -webthings-gateway-brand }
local-token-header = Τοπική υπηρεσία token
local-token-your-token = Το τοπικό σας token είναι αυτό <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Χρησιμοποιήστε το για ασφαλή επικοινωνία με την πύλη, με <a data-l10n-name="local-token-bearer-type">Εξουσιοδότηση τύπου Bearer</a>.
local-token-copy-token = Αντιγραφή token

## Router Setup Page

router-setup-title = Ρύθμιση router — { -webthings-gateway-brand }
router-setup-header = Δημιουργία νέου δικτύου Wi-Fi
router-setup-input-ssid =
    .placeholder = Όνομα δικτύου
router-setup-input-password =
    .placeholder = Κωδικός πρόσβασης
router-setup-input-confirm-password =
    .placeholder = Επιβεβαίωση κωδικού πρόσβασης
router-setup-create =
    .value = Δημιουργία
router-setup-password-mismatch = Οι κωδικοί πρόσβασης πρέπει να ταιριάζουν.

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
connecting-connect = Παρακαλούμε βεβαιωθείτε ότι έχετε συνδεθεί στο ίδιο δίκτυο και μεταβείτε στο { $gateway-link } στο πρόγραμμα περιήγησης σας για να συνεχίσετε την εγκατάσταση.
connecting-warning = Σημείωση: Αν δεν μπορείτε να φορτώσετε το { $domain }, αναζητήστε τη διεύθυνση IP της πύλης σας στο router σας.
connecting-header-skipped = Η ρύθμιση Wi-Fi παραλήφθηκε
connecting-skipped = Η πύλη εκκινείται τώρα. Μεταβείτε στο { $gateway-link } από το πρόγραμμα περιήγησής σας, ενώ έχετε συνδεθεί στο ίδιο δίκτυο με την πύλη για να συνεχίσετε τη ρύθμιση.

## Creating Wi-Fi Network Page

creating-title = Δημιουργία δικτύου Wi-Fi — { -webthings-gateway-brand }
creating-header = Δημιουργία δικτύου Wi-Fi…
creating-content = Παρακαλούμε συνδεθείτε στο { $ssid } με τον κωδικό πρόσβασης που μόλις δημιουργήσατε και έπειτα, μεταβείτε στο { $gateway-link } ή στο { $ip-link } από το πρόγραμμα περιήγησής σας.

## UI Updates

ui-update-available = Ένα ενημερωμένο περιβάλλον χρήσης είναι διαθέσιμο.
ui-update-reload = Ανανέωση
ui-update-close = Κλείσιμο

## Transfer to webthings.io

action-required-image =
    .alt = Προειδοποίηση
action-required = Απαιτείται ενέργεια:
action-required-message = Η υπηρεσία απομακρυσμένης πρόσβασης Mozilla IoT και οι αυτόματες ενημερώσεις λογισμικού θα διακοπούν. Επιλέξτε αν θέλετε να μεταφερθείτε στο webthings.io, που διαχειρίζεται η κοινότητα, για συνέχεια της υπηρεσίας.
action-required-more-info = Περισσότερες πληροφορίες
action-required-dont-ask-again = Να μη γίνει ερώτηση ξανά
action-required-choose = Επιλογή
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Η υπηρεσία απομακρυσμένης πρόσβασης Mozilla IoT και οι αυτόματες ενημερώσεις λογισμικού θα διακοπούν στις 31 Δεκεμβρίου 2020 (<a data-l10n-name="transition-dialog-more-info">μάθετε περισσότερα</a>). Η Mozilla μεταφέρει το έργο στο νέο <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a>, που διαχειρίζεται η κοινότητα (δεν σχετίζεται με τη Mozilla).<br><br>Αν δεν επιθυμείτε να λαμβάνετε ενημερώσεις λογισμικού από τους διακομιστές της κοινότητας, μπορείτε να απενεργοποιήσετε τις αυτόματες ενημερώσεις στις Ρυθμίσεις.<br><br>Αν θέλετε να μεταφέρετε τον υποτομέα mozilla-iot.org σας στο webthings.io, ή να καταχωρήσετε ένα νέο υποτομέα, μπορείτε να συμπληρώσετε την παρακάτω φόρμα για να κάνετε εγγραφή στην υπηρεσία απομακρυσμένης πρόσβασης της κοινότητας.
transition-dialog-register-domain-label = Εγγραφή στην υπηρεσία απομακρυσμένης πρόσβασης webthings.io
transition-dialog-subdomain =
    .placeholder = Υποτομέας
transition-dialog-newsletter-label = Να ενημερώνομαι για ειδήσεις σχετικά με το WebThings
transition-dialog-agree-tos-label = Συμφωνώ με την <a data-l10n-name="transition-dialog-privacy-policy-link">Πολιτική απορρήτου</a> και τους <a data-l10n-name="transition-dialog-tos-link">Όρους υπηρεσίας</a> του WebThings.
transition-dialog-email =
    .placeholder = Διεύθυνση email
transition-dialog-register =
    .value = Εγγραφή
transition-dialog-register-status =
    .alt = Κατάσταση εγγραφής
transition-dialog-register-label = Καταχώρηση υποτομέα
transition-dialog-subscribe-status =
    .alt = Κατάσταση εγγραφής ενημερωτικού δελτίου
transition-dialog-subscribe-label = Εγγραφή στο ενημερωτικό δελτίο
transition-dialog-error-generic = Προέκυψε σφάλμα. Παρακαλώ πηγαίνετε πίσω και δοκιμάστε ξανά.
transition-dialog-error-subdomain-taken = Ο επιλεγμένος υποτομέας χρησιμοποιείται ήδη. Παρακαλούμε πηγαίνετε πίσω και επιλέξτε άλλον.
transition-dialog-error-subdomain-failed = Αποτυχία καταχώρησης υποτομέα. Παρακαλούμε πηγαίνετε πίσω και δοκιμάστε ξανά.
transition-dialog-error-subscribe-failed = Αποτυχία εγγραφής στο ενημερωτικό δελτίο. Παρακαλούμε δοκιμάστε ξανά στο <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>
# Use <<domain>> to indicate where the domain should be placed
transition-dialog-success = Πλοηγηθείτε στο <<domain>> για να συνεχίσετε.

## General Terms

ok = OK
ellipsis = …
event-log = Αρχείο καταγραφής συμβάντων
edit = Επεξεργασία
remove = Αφαίρεση
disconnected = Αποσυνδέθηκε
processing = Επεξεργασία…
submit = Υποβολή

## Top-Level Buttons

menu-button =
    .aria-label = Μενού
back-button =
    .aria-label = Πίσω
overflow-button =
    .aria-label = Πρόσθετες ενέργειες
submit-button =
    .aria-label = Υποβολή
edit-button =
    .aria-label = Επεξεργασία
save-button =
    .aria-label = Αποθήκευση
