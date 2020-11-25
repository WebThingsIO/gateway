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

## Floorplan

upload-floorplan = Carica planimetria…
upload-floorplan-hint = (raccomandato .svg)

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
settings-developer = Sviluppo

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
network-settings-home-network-image =
    .alt = Rete domestica
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configura
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modalità
network-settings-home-network-lan = Rete domestica (LAN)
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
network-settings-changing = Modifica delle impostazioni di rete in corso. L’operazione può richiedere fino a un minuto.
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
user-settings-input-totp =
    .placeholder = Codice 2FA
user-settings-mfa-enable = Attiva l‘autenticazione a due fattori
user-settings-mfa-scan-code = Scansiona il codice seguente con qualsiasi app di autenticazione a due fattori.
user-settings-mfa-secret = Nel caso in cui il codice QR non funzioni, questo è il tuo nuovo TOTP segreto:
user-settings-mfa-error = Il codice di autenticazione è errato.
user-settings-mfa-enter-code = Inserisci qui sotto il codice generato dalla tua app di autenticazione.
user-settings-mfa-verify = Verifica
user-settings-mfa-regenerate-codes = Rigenera i codici di backup
user-settings-mfa-backup-codes = Questi sono i tuoi codici di backup. Ogni codice può essere utilizzato solo una volta. Conservali in un luogo sicuro.
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

experiment-settings-no-experiments = Non ci sono esperimenti disponibili al momento.

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
current-version = Versione corrente
failed = Non riuscito
never = Mai
in-progress = In corso
restarting = Riavvio in corso…
checking-for-updates = Ricerca aggiornamenti in corso…
failed-to-check-for-updates = Ricerca aggiornamenti non riuscita.

## Developer Settings

developer-settings-enable-ssh = Attiva SSH
developer-settings-view-internal-logs = Visualizza registri interni
developer-settings-create-local-authorization = Crea autorizzazione locale

## Rules

add-rule =
    .aria-label = Crea nuova regola
rules = Regole
rules-create-rule-hint = Non sono ancora presenti regole. Fai clic sul + per creare una regola.
rules-rule-name = Nome regola
rules-customize-rule-name-icon =
    .alt = Personalizza il nome della regola
rules-rule-description = Descrizione della regola
rules-preview-button =
    .alt = Anteprima
rules-delete-icon =
    .alt = Elimina
rules-drag-hint = Trascina qui i dispositivi per iniziare la creazione di una regola
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
rule-configure = Configurazione in corso…
rule-time-title = Ora del giorno
rule-notification = Notifica
notification-title = Titolo
notification-message = Messaggio
notification-level = Livello
notification-low = Basso
notification-normal = Normale
notification-high = Alto
rule-name = Nome regola

## Logs

add-log =
    .aria-label = Crea nuovo registro
logs = Registri
logs-create-log-hint = Non sono ancora presenti registri. Fai clic sul + per creare un registro.
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
logs-remove-dialog-title = Rimozione in corso…
logs-remove-dialog-warning = La rimozione del registro cancellerà anche tutti i dati inclusi. Procedere con la rimozione?
logs-remove = Rimuovi
logs-unable-to-create = Impossibile creare il registro
logs-server-remove-error = Errore del server: impossibile rimuovere il registro

## Add New Things

add-thing-scanning-icon =
    .alt = Ricerca
add-thing-scanning = Ricerca di nuovi dispositivi…
add-thing-add-adapters-hint = Non sono stati trovati nuovi oggetti. Provare <a data-l10n-name="add-thing-add-adapters-hint-anchor">ad aggiungere componenti aggiuntivi</a>.
add-thing-add-by-url = Aggiungi per URL…
add-thing-done = Fatto
add-thing-cancel = Annulla

## Context Menu

context-menu-choose-icon = Scegli icona…
context-menu-save = Salva
context-menu-remove = Rimuovi

## Capabilities

OnOffSwitch = Interruttore acceso/spento
MultiLevelSwitch = Interruttore multilivello
ColorControl = Controllo del colore
ColorSensor = Sensore di colore
EnergyMonitor = Sensore energia
BinarySensor = Sensore binario
MultiLevelSensor = Sensore multilivello
SmartPlug = Presa intelligente
Light = Luce
DoorSensor = Sensore porta
MotionSensor = Sensore di movimento
LeakSensor = Sensore di perdite
PushButton = Pulsante
VideoCamera = Videocamera
Camera = Fotocamera
TemperatureSensor = Sensore di temperatura
HumiditySensor = Sensore di umidità
Alarm = Allarme
Thermostat = Termostato
Lock = Serratura
BarometricPressureSensor = Sensore di pressione barometrica
Custom = Oggetto personalizzato
Thing = Oggetto
AirQualitySensor = Sensore di qualità dell’aria

## Properties

alarm = Allarme
pushed = Premuto
not-pushed = Non premuto
on-off = Acceso/spento
on = Acceso
off = Spento
power = Alimentazione
voltage = Voltaggio
temperature = Temperatura
current = Corrente
frequency = Frequenza
color = Colore
brightness = Luminosità
leak = Perdita
dry = Umidità
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
humidity = Umidità
concentration = Concentrazione
density = Densità

## Domain Setup

tunnel-setup-reclaim-domain = Sembra che questo sottodominio sia già stato registrato. Per recuperarlo <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">fai clic qui</a>.
check-email-for-token = Copia e incolla qui sopra il token di recupero che hai ricevuto via email.
reclaim-failed = Impossibile recuperare il dominio.
subdomain-already-used = Questo sottodominio è già in uso. Scegline un altro.
invalid-subdomain = Sottodominio non valido.
invalid-email = Indirizzo email non valido.
invalid-reclamation-token = Token di recupero non valido.
domain-success = Operazione completata. Reindirizzamento in corso…
issuing-error = Si è verificato un errore durante l’emissione del certificato. Riprova.
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
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Tipo di dispositivo sconosciuto
new-thing-choose-icon = Scegli icona…
new-thing-save = Salva
new-thing-pin =
    .placeholder = Inserisci PIN
new-thing-pin-error = PIN errato
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

no-things = Nessun dispositivo presente. Fai clic sul + per rilevare i dispositivi disponibili.
thing-not-found = Oggetto web non trovato.
action-not-found = Azione non trovata.
events-not-found = Questo oggetto non ha eventi.

## Add-on Settings

add-addons =
    .aria-label = Trova nuovi componenti aggiuntivi
author-unknown = Sconosciuto
disable = Disattiva
enable = Attiva
by = di
license = licenza
addon-configure = Configura
addon-update = Aggiorna
addon-remove = Rimuovi
addon-updating = Aggiornamento in corso…
addon-updated = Aggiornato
addon-update-failed = Operazione non riuscita
addon-config-applying = Applicazione in corso…
addon-config-apply = Applica
addon-discovery-added = Aggiunto
addon-discovery-add = Inserisci
addon-discovery-installing = Installazione in corso…
addon-discovery-failed = Operazione non riuscita
addon-search =
    .placeholder = Cerca

## Page Titles

settings = Impostazioni
domain = Dominio
users = Utenti
edit-user = Modifica utente
add-user = Aggiungi utente
adapters = Adattatori
addons = Componenti aggiuntivi
addon-config = Configura componente aggiuntivo
addon-discovery = Scopri nuovi componenti aggiuntivi
experiments = Esperimenti
localization = Localizzazione
updates = Aggiornamenti
authorizations = Autorizzazioni
developer = Sviluppo
network = Rete
ethernet = Ethernet
wifi = Wi-Fi
icon = Icona

## Errors

unknown-state = Stato sconosciuto.
error = Errore
errors = Errori
gateway-unreachable = Gateway non raggiungibile
more-information = Ulteriori informazioni
invalid-file = File non valido
failed-read-file = Impossibile leggere il file.
failed-save = Impossibile salvare.

## Schema Form

unsupported-field = Schema non supportato

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Accesso — { -webthings-gateway-brand }
login-log-in = Accedi
login-wrong-credentials = Il nome utente o la password sono errati.
login-wrong-totp = Il codice di autenticazione è errato.
login-enter-totp = Inserisci il codice generato dalla tua app di autenticazione.

## Create First User Page

signup-title = Crea utente — { -webthings-gateway-brand }
signup-welcome = Benvenuto
signup-create-account = Crea il tuo primo account utente:
signup-password-mismatch = Le password non corrispondono
signup-next = Avanti

## Tunnel Setup Page

tunnel-setup-title = Scegli indirizzo web — { -webthings-gateway-brand }
tunnel-setup-welcome = Benvenuto
tunnel-setup-choose-address = Scegli un indirizzo web sicuro per il tuo gateway:
tunnel-setup-input-subdomain =
    .placeholder = sottodominio
tunnel-setup-email-opt-in = Desidero ricevere aggiornamenti con le ultime novità su WebThings.
tunnel-setup-agree-privacy-policy = Accetta l’<a data-l10n-name="tunnel-setup-privacy-policy-link">informativa sulla privacy</a> e i <a data-l10n-name="tunnel-setup-tos-link">termini di servizio</a> di WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Token di recupero
tunnel-setup-error = Si è verificato un errore durante l’impostazione del sottodominio.
tunnel-setup-create = Crea
tunnel-setup-skip = Ignora
tunnel-setup-time-sync = In attesa che l’orologio di sistema venga impostato da Internet. Finché questa operazione non verrà completata, è possibile che la registrazione del dominio non vada a buon fine.

## Authorize Page

authorize-title = Richiesta di autorizzazione — { -webthings-gateway-brand }
authorize-authorization-request = Richiesta di autorizzazione
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> vuole accedere al gateway per gli oggetti <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = da <<dominio>>
authorize-monitor-and-control = Monitorare e controllare
authorize-monitor = monitorare
authorize-allow-all = Consenti tutti gli oggetti
authorize-allow =
    .value = Consenti
authorize-deny = Nega

## Local Token Page

local-token-title = Servizio token locale — { -webthings-gateway-brand }
local-token-header = Servizio token locale
local-token-your-token = Il token locale è: <a data-l10n-name="local-token-jwt">JSON Web Token</a>.
local-token-use-it = Permette una comunicazione sicura con il gateway, con <a data-l10n-name="local-token-bearer-type">autorizzazione tipo Bearer</a>.
local-token-copy-token = Copia token

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
connecting-header = Connessione al Wi-Fi in corso…
connecting-connect = Assicurarsi di essere connessi alla stessa rete e aprire { $gateway-link } nel browser per proseguire l’installazione.
connecting-warning = Se non è possibile aprire { $domain }, cercare l’indirizzo IP del gateway sul router.
connecting-header-skipped = Configurazione Wi-Fi ignorata
connecting-skipped = Il gateway è in fase di avvio. Connettersi alla stessa rete del gateway e aprire { $gateway-link } nel browser per proseguire l’installazione.

## Creating Wi-Fi Network Page

creating-title = Creazione della rete Wi-Fi — { -webthings-gateway-brand }
creating-header = Creazione della rete Wi-Fi…
creating-content = Connettersi a { $ssid } con la password appena creata, quindi aprire { $gateway-link } o { $ip-link } nel browser.

## UI Updates

ui-update-available = È disponibile un aggiornamento dell’interfaccia utente.
ui-update-reload = Ricarica
ui-update-close = Chiudi

## Transfer to webthings.io

action-required-image =
    .alt = Avviso
action-required = Azione richiesta:
action-required-message = Il servizio di accesso remoto Mozilla IoT e gli aggiornamenti automatici del software verranno interrotti. Passa a webthings.io, gestito dalla community, per continuare a usufruire del servizio.
action-required-more-info = Ulteriori informazioni
action-required-dont-ask-again = Non chiederlo di nuovo
action-required-choose = Scegli
transition-dialog-wordmark =
    .alt = { -webthings-gateway-brand }
transition-dialog-text = Il servizio di accesso remoto IoT e gli aggiornamenti automatici del software verranno interrotti il 31 dicembre 2020 (<a data-l10n-name="transition-dialog-more-info">ulteriori informazioni</a>). Mozilla sta effettuando la transizione del progetto al nuovo <a data-l10n-name="transition-dialog-step-1-website">webthings.io</a>, gestito da una community (non affiliata a Mozilla).<br><br>Se non desideri più ricevere gli aggiornamenti del software dai server gestiti dalla community, puoi disattivare gli aggiornamenti automatici nelle Impostazioni.<br><br>Se desideri trasferire il tuo sottodominio da mozilla-iot.org a webthings.io o registrare un nuovo sottodominio, compila il modulo sottostante per registrarti al servizio di accesso remoto sostitutivo gestito dalla community.
transition-dialog-register-domain-label = Registrati al servizio di accesso remoto webthings.io
transition-dialog-subdomain =
    .placeholder = Sottodominio
transition-dialog-newsletter-label = Voglio ricevere aggiornamenti sulle novità di WebThings
transition-dialog-agree-tos-label = Accetta l’<a data-l10n-name="transition-dialog-privacy-policy-link">informativa sulla privacy</a> e i <a data-l10n-name="transition-dialog-tos-link">termini di servizio</a> di WebThings.
transition-dialog-email =
    .placeholder = Indirizzo email
transition-dialog-register =
    .value = Registrati
transition-dialog-register-status =
    .alt = Stato della registrazione
transition-dialog-register-label = Registrazione sottodominio
transition-dialog-subscribe-status =
    .alt = Stato di iscrizione alla newsletter
transition-dialog-subscribe-label = Iscrizione alla newsletter
transition-dialog-error-subdomain-taken = Il sottodominio scelto è già in uso. Torna indietro e scegline un altro.
transition-dialog-error-subdomain-failed = Impossibile registrare il sottodominio. Torna indietro e riprova.
transition-dialog-error-subscribe-failed = Iscrizione alla newsletter non riuscita. Riprova da <a data-l10n-name="transition-dialog-step-2-website">webthings.io</a>

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
back-button =
    .aria-label = Indietro
overflow-button =
    .aria-label = Altre azioni
submit-button =
    .aria-label = Invia
edit-button =
    .aria-label = Modifica
save-button =
    .aria-label = Salva
