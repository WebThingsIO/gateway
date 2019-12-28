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

assistant-menu-item = Assistente
things-menu-item = Oggetti
rules-menu-item = Regole
logs-menu-item = Registri
floorplan-menu-item = Planimetria
settings-menu-item = Impostazioni
log-out-button = Disconnettersi

## Things

thing-details =
    .aria-label = Visualizza proprietà
add-things =
    .aria-label = Aggiungi nuovi oggetti

## Assistant

assistant-avatar-image =
    .alt = Avatar assistente

## Floorplan

upload-floorplan = Carica planimetria…

## Top-Level Settings

settings-domain = Dominio
settings-network = Rete
settings-users = Utenti
settings-add-ons = Componenti aggiuntivi
settings-adapters = Adattatori
settings-localization = Localizzazione
settings-updates = Aggiornamenti
settings-authorizations = Autorizzazioni
settings-experiments = Esperimenti
settings-developer = Sviluppatore

## Domain Settings

domain-settings-local-label = Accesso locale
domain-settings-local-update = Aggiorna nome host
domain-settings-remote-access = Accesso remoto
domain-settings-local-name =
    .placeholder = gateway

## Network Settings

network-settings-unsupported = Le impostazioni di rete non sono supportate per questa piattaforma
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configura
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modalità
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Indirizzo IP
network-settings-dhcp = Automatico (DHCP)
network-settings-static = Manuale (IP statico)
network-settings-pppoe = Ponte (PPPoE)
network-settings-static-ip-address = Indirizzo IP statico
network-settings-network-mask = Maschera di rete
network-settings-gateway = Gateway
network-settings-done = Fatto
network-settings-wifi-password =
    .placeholder = Password
network-settings-show-password = Mostra password
network-settings-connect = Connetti
network-settings-username = Nome utente
network-settings-password = Password
network-settings-router-ip = Indirizzo IP del router
network-settings-dhcp-server = Server DHCP
network-settings-enable-wifi = Attiva Wi-Fi
network-settings-network-name = Nome di rete (SSID)
wireless-connected = Connesso
wireless-icon =
    .alt = Rete Wi-Fi
failed-ethernet-configure = Impossibile configurare ethernet.
failed-wifi-configure = Impossibile configurare Wi-Fi.
failed-wan-configure = Impossibile configurare WAN.
failed-lan-configure = Impossibile configurare LAN.
failed-wlan-configure = Impossibile configurare WLAN.

## User Settings

create-user =
    .aria-label = Aggiungi nuovo utente
user-settings-input-name =
    .placeholder = Nome
user-settings-input-email =
    .placeholder = Email
user-settings-input-password =
    .placeholder = Password
user-settings-input-new-password =
    .placeholder = Nuova password (opzionale)
user-settings-input-confirm-new-password =
    .placeholder = Conferma nuova password
user-settings-input-confirm-password =
    .placeholder = Conferma password
user-settings-password-mismatch = Le password non corrispondono
user-settings-save = Salva

## Adapter Settings

adapter-settings-no-adapters = Nessun adattatore presente

## Authorization Settings

authorization-settings-no-authorizations = Nessuna autorizzazione

## Experiment Settings

experiment-settings-smart-assistant = Assistente intelligente
experiment-settings-logs = Registri

## Localization Settings

localization-settings-language-region = Lingua e regione
localization-settings-country = Nazione
localization-settings-timezone = Fuso orario
localization-settings-language = Lingua
localization-settings-units = Unità
localization-settings-units-temperature = Temperatura
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Aggiorna ora
update-available = Aggiornamento disponibile
update-up-to-date = Il sistema è aggiornato
updates-not-supported = Aggiornamenti non disponibili per la piattaforma in uso.
update-settings-enable-self-updates = Attiva aggiornamenti automatici
last-update = Ultimo aggiornamento
failed = Non riuscito
never = Mai
in-progress = In corso

## Developer Settings

developer-settings-enable-ssh = Attiva SSH
developer-settings-view-internal-logs = Visualizza registri interni
developer-settings-create-local-authorization = Crea autorizzazione locale

## Rules

add-rule =
    .aria-label = Crea nuova regola
rules = Regole
rules-rule-name = Nome regola
rules-customize-rule-name-icon =
    .alt = Personalizza il nome della regola
rules-rule-description = Descrizione della regola
rules-preview-button =
    .alt = Anteprima
rules-delete-icon =
    .alt = Elimina
rules-drag-input-hint = Aggiungi dispositivo di ingresso (input)
rules-drag-output-hint = Aggiungi dispositivo di uscita (output)
rules-scroll-left =
    .alt = Scorri verso sinistra
rules-scroll-right =
    .alt = Scorri verso destra
rules-delete-prompt = Rilascia qui i dispositivi per disconnetterli
rules-delete-dialog = Rimuovere questa regola in modo permanente?
rules-delete-cancel =
    .value = Annulla
rules-delete-confirm =
    .value = Rimuovi regola
rule-invalid = Non valido
rule-delete-prompt = Rimuovere questa regola in modo permanente?
rule-delete-cancel-button =
    .value = Annulla
rule-delete-confirm-button =
    .value = Rimuovi regola
rule-select-property = Seleziona proprietà
rule-not = Non
rule-event = Evento
rule-action = Azione
rule-time-title = Ora del giorno
rule-notification = Notifica
notification-title = Titolo
notification-level = Livello
notification-low = Basso
notification-normal = Normale
notification-high = Alto
rule-name = Nome

## Logs

logs = Registri
logs-device = Dispositivo
logs-device-select =
    .aria-label = Registro del dispositivo
logs-property = Proprietà
logs-property-select =
    .aria-label = Proprietà registro
logs-retention = Conservazione
logs-retention-length =
    .aria-label = Durata periodo conservazione
logs-retention-unit =
    .aria-label = Unità di misura periodo di conservazione
logs-hours = Ore
logs-days = Giorni
logs-weeks = Settimane
logs-save = Salva
logs-remove = Rimuovi

## Add New Things

add-thing-scanning-icon =
    .alt = Ricerca
add-thing-add-by-url = Aggiungi per URL…
add-thing-done = Fatto
add-thing-cancel = Annulla

## Context Menu

context-menu-choose-icon = Scegli icona…
context-menu-save = Salva
context-menu-remove = Rimuovi

## Capabilities

OnOffSwitch = Interruttore acceso/spento
ColorControl = Controllo del colore
ColorSensor = Sensore di colore
EnergyMonitor = Sensore energia
BinarySensor = Sensore binario
MultiLevelSensor = Sensore multilivello
Light = Luce
DoorSensor = Sensore porta
PushButton = Pulsante
VideoCamera = Videocamera
Camera = Fotocamera
TemperatureSensor = Sensore di temperatura
Alarm = Allarme
Thermostat = Termostato
Lock = Serratura
Custom = Oggetto personalizzato
Thing = Oggetto

## Properties

alarm = Allarme
on-off = Acceso/spento
on = Acceso
off = Spento
temperature = Temperatura
current = Corrente
frequency = Frequenza
color = Colore
leak = Perdita
color-temperature = Temperatura di colore
video-unsupported = Video non supportato nel browser.
motion = Movimento
no-motion = Nessun movimento
open = Aperto
closed = Chiuso
locked = Bloccato
unlocked = Sbloccato
jammed = Inceppato
unknown = Sconosciuto
active = Attivo
inactive = Inattivo

## Domain Setup

tunnel-setup-reclaim-domain = Sembra che questo sottodominio sia già stato registrato. Per recuperarlo <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">fai clic qui</a>.
reclaim-failed = Impossibile recuperare il dominio.
subdomain-already-used = Questo sottodominio è già in uso. Scegline un altro.
invalid-reclamation-token = Token di recupero non valido.
redirecting = Reindirizzamento…

## Booleans

true = Vero
false = Falso

## Time

utils-now = adesso
utils-seconds-ago =
    { $value ->
        [one] { $value } secondo fa
       *[other] { $value } secondi fa
    }
utils-minutes-ago =
    { $value ->
        [one] { $value } minuto fa
       *[other] { $value } minuti fa
    }
utils-hours-ago =
    { $value ->
        [one] { $value } ora fa
       *[other] { $value } ore fa
    }
utils-days-ago =
    { $value ->
        [one] { $value } giorno fa
       *[other] { $value } giorni fa
    }
utils-weeks-ago =
    { $value ->
        [one] { $value } settimana fa
       *[other] { $value } settimane fa
    }
utils-months-ago =
    { $value ->
        [one] { $value } mese fa
       *[other] { $value } mesi fa
    }
utils-years-ago =
    { $value ->
        [one] { $value } anno fa
       *[other] { $value } anni fa
    }
minute = Minuto
hour = Ora
day = Giorno
week = Settimana

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

unknown-device-type = Tipo di dispositivo sconosciuto
new-thing-choose-icon = Scegli icona…
new-thing-save = Salva
new-thing-pin =
    .placeholder = Inserisci PIN
new-thing-pin-invalid = PIN non valido
new-thing-cancel = Annulla
new-thing-submit = Invia
new-thing-username =
    .placeholder = Inserisci il nome utente
new-thing-password =
    .placeholder = Inserisci la password
new-thing-credentials-error = Credenziali errate
new-thing-saved = Salvato
new-thing-done = Fatto

## New Web Thing View

new-web-thing-url =
    .placeholder = Inserisci l’URL dell’oggetto web
new-web-thing-label = Oggetto web
loading = Caricamento in corso…
new-web-thing-multiple = Diversi oggetti web rilevati
new-web-thing-from = da

## Empty div Messages

thing-not-found = Oggetto web non trovato.
action-not-found = Azione non trovata.
events-not-found = Questo oggetto non ha eventi.

## Add-on Settings

author-unknown = Sconosciuto
disable = Disattiva
by = di
addon-configure = Configura
addon-update = Aggiorna
addon-remove = Rimuovi
addon-updating = Aggiornamento in corso…
addon-updated = Aggiornato
addon-update-failed = Non riuscito
addon-config-applying = Applicazione in corso…
addon-config-apply = Applica
addon-discovery-added = Aggiunto
addon-discovery-add = Inserisci
addon-discovery-installing = Installazione in corso…

## Page Titles

settings = Impostazioni
domain = Dominio
users = Utenti
edit-user = Modifica utente
add-user = Aggiungi utente
addons = Componenti aggiuntivi
addon-config = Configura componente aggiuntivo
experiments = Esperimenti
localization = Localizzazione
updates = Aggiornamenti
authorizations = Autorizzazioni
developer = Sviluppo
network = Rete
ethernet = Ethernet
wifi = Wi-Fi
icon = Icona

## Speech

speech-didnt-get = Mi dispiace, non ho capito.

## Errors

unknown-state = Stato sconosciuto.
error = Errore
errors = Errori
gateway-unreachable = Gateway non raggiungibile
more-information = Ulteriori informazioni
invalid-file = File non valido
failed-read-file = Impossibile leggere il file.
failed-save = Impossibile salvare il file.

## Schema Form

unsupported-field = Schema non supportato

## Icon Sources

thing-icons-thing-src = /optimized-images/thing-icons/thing.svg

## Login Page

login-title = Accesso — { -webthings-gateway-brand }
login-log-in = Accesso

## Create First User Page

signup-title = Crea utente — { -webthings-gateway-brand }
signup-welcome = Benvenuto
signup-create-account = Crea il tuo primo account utente:
signup-password-mismatch = Le password non corrispondono
signup-next = Successivo

## Tunnel Setup Page

tunnel-setup-title = Scegli indirizzo web — { -webthings-gateway-brand }
tunnel-setup-welcome = Benvenuto
tunnel-setup-input-subdomain =
    .placeholder = sottodominio
tunnel-setup-privacy-policy = Informativa sulla privacy
tunnel-setup-input-reclamation-token =
    .placeholder = Token di recupero
tunnel-setup-error = Si è verificato un errore durante l’impostazione del sottodominio.
tunnel-setup-create = Crea
tunnel-setup-skip = Ignora

## Authorize Page

authorize-title = Richiesta di autorizzazione — { -webthings-gateway-brand }
authorize-authorization-request = Richiesta di autorizzazione
authorize-monitor-and-control = Monitorare e controllare
authorize-monitor = monitorare
authorize-allow-all = Consenti tutti gli oggetti
authorize-deny = Nega

## Local Token Page

local-token-title = Servizio token locale — { -webthings-gateway-brand }
local-token-header = Servizio token locale
local-token-use-it = Usalo per comunicare in modo sicuro con il gateway, con <a data-l10n-name="local-token-bearer-type">autorizzazione Bearer-type</a>.

## Router Setup Page

router-setup-title = Configurazione del router — { -webthings-gateway-brand }
router-setup-header = Crea una nuova rete Wi-Fi
router-setup-input-ssid =
    .placeholder = Nome della rete
router-setup-input-password =
    .placeholder = Password
router-setup-input-confirm-password =
    .placeholder = Conferma password
router-setup-create =
    .value = Crea
router-setup-password-mismatch = Le password devono essere identiche

## Wi-Fi Setup Page

wifi-setup-title = Configurazione Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Connettersi a una rete Wi-Fi?
wifi-setup-input-password =
    .placeholder = Password
wifi-setup-show-password = Mostra password
wifi-setup-connect =
    .value = Connetti
wifi-setup-network-icon =
    .alt = Rete Wi-Fi
wifi-setup-skip = Ignora

## Connecting to Wi-Fi Page

connecting-title = Connessione al Wi-Fi — { -webthings-gateway-brand }
connecting-header = Connessione al Wi-Fi…
connecting-connect = Assicursi di essere connessi alla stessa rete e aprire { $gateway-link } nel browser per proseguire l’installazione.
connecting-warning = Se non è possibile aprire { $domain }, inserire l’indirizzo IP del gateway.
connecting-header-skipped = Configurazione Wi-Fi ignorata
connecting-skipped = Il gateway è in fase di avvio. Connettersi alla stessa rete del gateway e aprire { $gateway-link } nel browser per proseguire l’installazione.

## Creating Wi-Fi Network Page

creating-title = Creazione della rete Wi-Fi — { -webthings-gateway-brand }
creating-header = Creazione della rete Wi-Fi…
creating-content = Connettersi a { $ssid } con la password appena creata, quindi aprire { $gateway-link } o { $ip-link } nel browser.

## General Terms

ok = OK
ellipsis = …
event-log = Registro eventi
edit = Modifica
remove = Rimuovi
disconnected = Disconnesso
processing = In elaborazione…
submit = Invia

## Top-Level Buttons

menu-button =
    .aria-label = Menu
