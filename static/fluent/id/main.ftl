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

things-menu-item = Semua Thing
rules-menu-item = Aturan
logs-menu-item = Log
floorplan-menu-item = Denah Lantai
settings-menu-item = Setelan
log-out-button = Keluar

## Things

thing-details =
    .aria-label = Lihat Properti
add-things =
    .aria-label = Tambahkan Thing Baru

## Floorplan

upload-floorplan = Unggah denah lantai…
upload-floorplan-hint = (disarankan dalam format .svg)

## Top-Level Settings

settings-domain = Domain
settings-network = Jaringan
settings-users = Pengguna
settings-add-ons = Pengaya
settings-adapters = Adapter
settings-localization = Pelokalan
settings-updates = Pembaruan
settings-authorizations = Otorisasi
settings-experiments = Eksperimen
settings-developer = Pengembang

## Domain Settings

domain-settings-local-label = Akses Lokal
domain-settings-local-update = Perbarui nama host
domain-settings-remote-access = Akses Daring
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Setelan jaringan tidak didukung untuk platform ini.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Jaringan Rumah
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Konfigurasikan
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Mode
network-settings-home-network-lan = Jaringan Rumah (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Alamat IP
network-settings-dhcp = Otomatis (DHCP)
network-settings-static = Manual (IP Statis)
network-settings-pppoe = Bridge (PPPoE)
network-settings-static-ip-address = Alamat IP Statik
network-settings-network-mask = Mask jaringan
network-settings-gateway = Gateway
network-settings-done = Selesai
network-settings-wifi-password =
    .placeholder = Kata sandi
network-settings-show-password = Tampilkan kata sandi
network-settings-connect = Sambungkan
network-settings-username = Nama pengguna
network-settings-password = Kata sandi
network-settings-router-ip = Alamat IP router
network-settings-dhcp-server = Server DHCP
network-settings-enable-wifi = Aktifkan Wi-Fi
network-settings-network-name = Nama jaringan (SSID)
wireless-connected = Tersambung
wireless-icon =
    .alt = Jaringan Wi-Fi
network-settings-changing = Mengubah pengaturan jaringan. Proses ini membutuhkan waktu beberapa saat.
failed-ethernet-configure = Gagal mengonfigurasi ethernet.
failed-wifi-configure = Gagal mengonfigurasi Wi.Fi.
failed-wan-configure = Gagal mengonfigurasi WAN.
failed-lan-configure = Gagal mengonfigurasi LAN.
failed-wlan-configure = Gagal mengonfigurasi WLAN.

## User Settings

create-user =
    .aria-label = Tambahkan Pengguna Baru
user-settings-input-name =
    .placeholder = Nama
user-settings-input-email =
    .placeholder = Surel
user-settings-input-password =
    .placeholder = Kata sandi
user-settings-input-totp =
    .placeholder = Kode 2FA
user-settings-mfa-enable = Aktifkan otentikasi 2-faktor
user-settings-mfa-scan-code = Pindai kode berikut dengan aplikasi otentikator 2-faktor.
user-settings-mfa-secret = Ini adalah TOTP rahasia baru Anda, jika kode QR di atas tidak berfungsi:
user-settings-mfa-error = Kode otentikasi salah.
user-settings-mfa-enter-code = Masukkan kode dari aplikasi otentikator Anda di bawah ini.
user-settings-mfa-verify = Verifikasi
user-settings-mfa-regenerate-codes = Regenerasi kode cadangan
user-settings-mfa-backup-codes = Ini adalah kode cadangan Anda. Masing-masing hanya dapat digunakan satu kali. Simpan mereka di tempat yang aman.
user-settings-input-new-password =
    .placeholder = Kata Sandi Baru (Opsional)
user-settings-input-confirm-new-password =
    .placeholder = Konfirmasi Sandi Baru
user-settings-input-confirm-password =
    .placeholder = Konfirmasi Sandi
user-settings-password-mismatch = Sandi tidak sama
user-settings-save = Simpan

## Adapter Settings

adapter-settings-no-adapters = Tidak ada adapter tersedia.

## Authorization Settings

authorization-settings-no-authorizations = Tidak ada otorisasi.

## Experiment Settings

experiment-settings-no-experiments = Tidak ada eksperimen tersedia saat ini.

## Localization Settings

localization-settings-language-region = Bahasa & Wilayah
localization-settings-country = Negara
localization-settings-timezone = Zona waktu
localization-settings-language = Bahasa
localization-settings-units = Satuan
localization-settings-units-temperature = Suhu
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Perbarui Sekarang
update-available = Versi baru tersedia
update-up-to-date = Sistem Anda mutakhir!
updates-not-supported = Pembaruan tidak didukung pada platform ini.
update-settings-enable-self-updates = Aktifkan pembaruan otomatis
last-update = Pembaruan terakhir
current-version = Versi terkini
failed = Gagal
never = Jangan pernah
in-progress = Sedang Diproses
restarting = Memulai ulang
checking-for-updates = Memeriksa versi baru…
failed-to-check-for-updates = Tidak dapat memeriksa pembaruan saat ini.

## Developer Settings

developer-settings-enable-ssh = Aktifkan SSH
developer-settings-view-internal-logs = Lihat Log Internal
developer-settings-create-local-authorization = Buat otorisasi lokal

## Rules

add-rule =
    .aria-label = Buat Aturan Baru
rules = Aturan
rules-create-rule-hint = Tidak ada aturan dibuat. Klik + untuk membuat aturan.
rules-rule-name = Nama Aturan
rules-customize-rule-name-icon =
    .alt = Sesuaikan Nama Aturan
rules-rule-description = Deskripsi Aturan
rules-preview-button =
    .alt = Pratinjau
rules-delete-icon =
    .alt = Hapus
rules-drag-hint = Seret perangkat Anda ke sini untuk memulai membuat aturan
rules-drag-input-hint = Tambahkan perangkat sebagai input
rules-drag-output-hint = Tambahkan perangkat sebagai output
rules-scroll-left =
    .alt = Gulir ke Kiri
rules-scroll-right =
    .alt = Gulir ke Kanan
rules-delete-prompt = Jatuhkan perangkat di sini untuk memutuskan sambungan
rules-delete-dialog = Yakin ingin menghapus permanen aturan ini?
rules-delete-cancel =
    .value = Batalkan
rules-delete-confirm =
    .value = Hapus Aturan
rule-invalid = Tidak Valid
rule-delete-prompt = Yakin ingin menghapus permanen aturan ini?
rule-delete-cancel-button =
    .value = Batalkan
rule-delete-confirm-button =
    .value = Hapus Aturan
rule-select-property = Pilih Properti
rule-not = Bukan
rule-event = Peristiwa
rule-action = Tindakan
rule-configure = Konfigurasikan…
rule-time-title = Waktu hari
rule-notification = Pemberitahuan
notification-title = Judul
notification-message = Pesan
notification-level = Tingkat
notification-low = Rendah
notification-normal = Normal
notification-high = Tinggi
rule-name = Nama Aturan

## Logs

add-log =
    .aria-label = Buat Log Baru
logs = Log
logs-create-log-hint = Tidak ada log dibuat. Klik + untuk membuat log.
logs-device = Perangkat
logs-device-select =
    .aria-label = Log Perangkat
logs-property = Properti
logs-property-select =
    .aria-label = Properti Log
logs-retention = Penyimpanan
logs-retention-length =
    .aria-label = Lama Penyimpanan Log
logs-retention-unit =
    .aria-label = Unit Penyimpanan Log
logs-hours = Jam
logs-days = Hari
logs-weeks = Minggu
logs-save = Simpan
logs-remove-dialog-title = Menghapus
logs-remove-dialog-warning = Menghapus log juga akan menghapus semua datanya. Yakin ingin menghapusnya?
logs-remove = Hapus
logs-unable-to-create = Tidak dapat membuat log
logs-server-remove-error = Kesalahan server: tidak dapat menghapus log

## Add New Things

add-thing-scanning-icon =
    .alt = Memindai
add-thing-scanning = Memindai perangkat baru…
add-thing-add-adapters-hint = Tidak ada thing yang ditemukan. Coba <a data-l10n-name="add-thing-add-adapters-hint-anchor">tambahkan pengaya</a>.
add-thing-add-by-url = Tambahkan berdasarkan URL…
add-thing-done = Selesai
add-thing-cancel = Batalkan

## Context Menu

context-menu-choose-icon = Pilih ikon…
context-menu-save = Simpan
context-menu-remove = Hapus

## Capabilities

OnOffSwitch = Sakelar Nyala/Mati
MultiLevelSwitch = Sakelar Multi Level
ColorControl = Kendali Warna
ColorSensor = Sensor Warna
EnergyMonitor = Monitor Energi
BinarySensor = Sensor Biner
MultiLevelSensor = Sensor Multi Level
SmartPlug = Colokan Cerdas
Light = Lampu
DoorSensor = Sensor Pintu
MotionSensor = Sensor Gerak
LeakSensor = Sensor Kebocoran
PushButton = Tombol Tekan
VideoCamera = Kamera Video
Camera = Kamera
TemperatureSensor = Sensor Temperatur
HumiditySensor = Sensor Kelembapan
Alarm = Alarm
Thermostat = Termostat
Lock = Kunci
Custom = Thing Khusus
Thing = Thing

## Properties

alarm = Alarm
pushed = Ditekan
not-pushed = Tidak Ditekan
on-off = Nyala/Mati
on = Nyala
off = Mati
power = Daya
voltage = Tegangan
temperature = Temperatur
current = Arus
frequency = Frekuensi
color = Warna
brightness = Kecerahan
leak = Kebocoran
dry = Kering
color-temperature = Temperatur Warna
video-unsupported = Maaf, video tidak didukung di browser Anda.
motion = Gerakan
no-motion = Tidak Ada Gerakan
open = Buka
closed = Tutup
locked = Dikunci
unlocked = Tidak Terkunci
jammed = Macet
unknown = Tidak Diketahui
active = Aktif
inactive = Tidak Aktif

## Domain Setup

tunnel-setup-reclaim-domain = Sepertinya Anda telah mendaftarkan subdomain tersebut. Untuk mengambil alih silakan <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">klik di sini</a>.
check-email-for-token = Silakan periksa surel Anda untuk mendapatkan token pengambilalihan dan tempel di atas.
reclaim-failed = Tidak dapat mengambil alih domain.
subdomain-already-used = Subdomain ini telah digunakan sebelumnya. Silakan gunakan subdomain berbeda.
invalid-subdomain = Subdomain tidak valid.
invalid-email = Alamat surel tidak valid.
invalid-reclamation-token = Token pengambilalihan tidak valid.
domain-success = Berhasil! Mohon tunggu, kami sedang mengalihkan…
issuing-error = Gagal menerbitkan sertifikat. Silakan coba kembali.
redirecting = Mengalihkan…

## Booleans

true = Benar
false = Salah

## Time

utils-now = sekarang
utils-seconds-ago =
    { $value ->
       *[other] { $value } detik yang lalu
    }
utils-minutes-ago =
    { $value ->
       *[other] { $value } menit yang lalu
    }
utils-hours-ago =
    { $value ->
       *[other] { $value } jam yang lalu
    }
utils-days-ago =
    { $value ->
       *[other] { $value } hari yang lalu
    }
utils-weeks-ago =
    { $value ->
       *[other] { $value } pekan yang lalu
    }
utils-months-ago =
    { $value ->
       *[other] { $value } bulan yang lalu
    }
utils-years-ago =
    { $value ->
       *[other] { $value } tahun yang lalu
    }
minute = Menit
hour = Jam
day = Hari
week = Pekan

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
abbrev-kilowatt-hour = kW⋅jam
abbrev-percent = %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = K
abbrev-meter = m
abbrev-kilometer = km
abbrev-day = h
abbrev-hour = j
abbrev-minute = m
abbrev-second = d
abbrev-millisecond = md
abbrev-foot = kaki

## New Thing View

unknown-device-type = Jenis perangkat tidak dikenal
new-thing-choose-icon = Pilih ikon…
new-thing-save = Simpan
new-thing-pin =
    .placeholder = Masukkan PIN
new-thing-pin-error = PIN Salah
new-thing-pin-invalid = PIN Tidak Valid
new-thing-cancel = Batalkan
new-thing-submit = Kirim
new-thing-username =
    .placeholder = Masukkan nama pengguna
new-thing-password =
    .placeholder = Masukkan sandi
new-thing-credentials-error = Kredensial salah
new-thing-saved = Disimpan
new-thing-done = Selesai

## New Web Thing View

new-web-thing-url =
    .placeholder = Masukkan URL thing web
new-web-thing-label = Web Thing
loading = Memuat…
new-web-thing-multiple = Banyak web thing ditemukan
new-web-thing-from = dari

## Empty div Messages

no-things = Belum ada perangkat. Klik + untuk memindai perangkat yang tersedia.
thing-not-found = Thing tidak ditemukan.
action-not-found = Aksi tidak ditemukan.
events-not-found = Benda ini tidak memiliki kegiatan.

## Add-on Settings

add-addons =
    .aria-label = Cari Pengaya Baru
author-unknown = Tidak dikenal
disable = Nonaktifkan
enable = Aktifkan
by = oleh
license = lisensi
addon-configure = Konfigurasikan
addon-update = Perbarui
addon-remove = Hapus
addon-updating = Memutakhirkan…
addon-updated = Diperbarui
addon-update-failed = Gagal
addon-config-applying = Menerapkan...
addon-config-apply = Terapkan
addon-discovery-added = Ditambahkan
addon-discovery-add = Tambah
addon-discovery-installing = Memasang…
addon-discovery-failed = Gagal
addon-search =
    .placeholder = Cari

## Page Titles

settings = Pengaturan
domain = Domain
users = Pengguna
edit-user = Ubah Pengguna
add-user = Tambah Pengguna
adapters = Adapter
addons = Pengaya
addon-config = Konfigurasikan Pengaya
addon-discovery = Temukan Pengaya Baru
experiments = Eksperimen
localization = Pelokalan
updates = Pemutakhiran
authorizations = Otorisasi
developer = Pengembang
network = Jaringan
ethernet = Ethernet
wifi = Wi-Fi
icon = Ikon

## Errors

unknown-state = Status tak diketahui.
error = Galat
errors = Galat
gateway-unreachable = Gateway Tidak Dapat Dijangkau
more-information = Informasi Lebih Lanjut
invalid-file = Berkas tidak valid.
failed-read-file = Gagal membaca berkas.
failed-save = Gagal menyimpan.

## Schema Form

unsupported-field = Skema isian tidak didukung

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Masuk — { -webthings-gateway-brand }
login-log-in = Masuk
login-wrong-credentials = Nama pengguna atau sandi salah
login-wrong-totp = Kode otentikasi salah.
login-enter-totp = Masukkan kode dari aplikasi otentikator Anda.

## Create First User Page

signup-title = Buat Pengguna — { -webthings-gateway-brand }
signup-welcome = Selamat Datang
signup-create-account = Buat akun pengguna pertama Anda:
signup-password-mismatch = Sandi tidak sama
signup-next = Lanjut

## Tunnel Setup Page

tunnel-setup-title = Pilih Alamat Web — { -webthings-gateway-brand }
tunnel-setup-welcome = Selamat Datang
tunnel-setup-choose-address = Pilih alamat web aman untuk gerbang Anda:
tunnel-setup-input-subdomain =
    .placeholder = subdomain
tunnel-setup-input-reclamation-token =
    .placeholder = Token Reklamasi
tunnel-setup-error = Galat terjadi ketika mengatur subdomain.
tunnel-setup-create = Buat
tunnel-setup-skip = Lewati
tunnel-setup-time-sync = Menunggu jam sistem diatur dari Internet. Registrasi domain kemungkinan akan gagal sampai ini selesai.

## Authorize Page

authorize-title = Permintaan Otorisasi — { -webthings-gateway-brand }
authorize-authorization-request = Permintaan Otorisasi
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> ingin mengakses gerbang Anda ke perangkat <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = dari <<domain>>
authorize-monitor-and-control = pantau dan kendali
authorize-monitor = pantau
authorize-allow-all = Izinkan untuk semua Things
authorize-allow =
    .value = Izinkan
authorize-deny = Tolak

## Local Token Page

local-token-title = Layanan Token Lokal — { -webthings-gateway-brand }
local-token-header = Layanan Token Lokal
local-token-your-token = Token lokal Anda adalah <a data-l10n-name="local-token-jwt">JSON Web Token</a> ini:
local-token-use-it = Gunakan ini untuk berkomunikasi dengan gerbang secara aman, dengan<a data-l10n-name="local-token-bearer-type">Otorisasi Tipe Bearer</a>.
local-token-copy-token = Salin Token

## Router Setup Page

router-setup-title = Pengaturan Router — { -webthings-gateway-brand }
router-setup-header = Buat jaringan Wi-Fi baru
router-setup-input-ssid =
    .placeholder = Nama jaringan
router-setup-input-password =
    .placeholder = Sandi
router-setup-input-confirm-password =
    .placeholder = Konfirmasi sandi
router-setup-create =
    .value = Buat
router-setup-password-mismatch = Sandi harus sama

## Wi-Fi Setup Page

wifi-setup-title = Pengaturan Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Terhubung ke jaringan Wi-Fi?
wifi-setup-input-password =
    .placeholder = Sandi
wifi-setup-show-password = Tampilkan sandi
wifi-setup-connect =
    .value = Sambungkan
wifi-setup-network-icon =
    .alt = Jaringan Wi-Fi
wifi-setup-skip = Lewati

## Connecting to Wi-Fi Page

connecting-title = Menhubungkan ke Wi-Fi — { -webthings-gateway-brand }
connecting-header = Menghubungkan ke Wi-Fi...
connecting-connect = Harap pastikan Anda terhubung ke jaringan yang sama dan kemudian navigasikan ke { $gateway-link } di peramban web Anda untuk melanjutkan pengaturan.
connecting-warning = Catatan: Jika Anda tidak dapat memuat { $domain }, cari alamat IP gerbang pada router Anda.
connecting-header-skipped = Pengaturan Wi-Fi dilewati
connecting-skipped = Gerbang sekarang sedang dimulai. Arahkan ke { $gateway-link } di peramban web Anda saat terhubung ke jaringan yang sama dengan gerbang untuk melanjutkan pengaturan.

## Creating Wi-Fi Network Page

creating-title = Membuat jaringan Wi-Fi — { -webthings-gateway-brand }
creating-header = Membuat jaringan Wi-Fi...
creating-content = Harap sambungkan ke { $ssid } denga sandi yang Anda telah buat, lalu navigasikan ke { $gateway-link } atau { $ip-link } di peramban Web anda.

## UI Updates

ui-update-available = Antarmuka pengguna yang diperbarui tersedia.
ui-update-reload = Muat Ulang
ui-update-close = Tutup

## General Terms

ok = Ok
ellipsis = …
event-log = Log Event
edit = Ubah
remove = Hapus
disconnected = Terputus
processing = Memroses…
submit = Kirim

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Kembali
overflow-button =
    .aria-label = Aksi Lainnya
submit-button =
    .aria-label = Kirim
edit-button =
    .aria-label = Ubah
save-button =
    .aria-label = Simpan
