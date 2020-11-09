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

things-menu-item = Dispositivos
rules-menu-item = Reglas
logs-menu-item = Registros
floorplan-menu-item = Plano de planta
settings-menu-item = Ajustes
log-out-button = Cerrar sesión

## Things

thing-details =
    .aria-label = Ver propiedades
add-things =
    .aria-label = Añadir nuevo dispositivo

## Floorplan

upload-floorplan = Subir plano…
upload-floorplan-hint = (recomendado .svg)

## Top-Level Settings

settings-domain = Dominio
settings-network = Red
settings-users = Usuarios
settings-add-ons = Complementos
settings-adapters = Adaptadores
settings-localization = Ubicación
settings-updates = Actualizaciones
settings-authorizations = Autorizaciones
settings-experiments = Experimentos
settings-developer = Desarrollador

## Domain Settings

domain-settings-local-label = Acceso local
domain-settings-local-update = Actualizar nombre de host
domain-settings-remote-access = Acceso remoto
domain-settings-local-name =
    .placeholder = pasarela

## Network Settings

network-settings-unsupported = La configuración de red no es compatible con esta plataforma.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Red domestica
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configurar
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Modo
network-settings-home-network-lan = Red doméstica (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Dirección IP
network-settings-dhcp = Automático (DHCP)
network-settings-static = Manual (IP estática)
network-settings-pppoe = Puente (PPPoE)
network-settings-static-ip-address = Dirección IP estática
network-settings-network-mask = Máscara de red
network-settings-gateway = Pasarela
network-settings-done = Hecho
network-settings-wifi-password =
    .placeholder = Contraseña
network-settings-show-password = Mostrar contraseña
network-settings-connect = Conectar
network-settings-username = Nombre de usuario
network-settings-password = Contraseña
network-settings-router-ip = Dirección IP del enrutador
network-settings-dhcp-server = Servidor DHCP
network-settings-enable-wifi = Habilitar Wi-Fi
network-settings-network-name = Nombre de red (SSID)
wireless-connected = Conectado
wireless-icon =
    .alt = Red Wi-Fi
network-settings-changing = Cambiando la configuración de red. Esto puede tardar un minuto.
failed-ethernet-configure = Error al configurar ethernet.
failed-wifi-configure = No se pudo configurar el Wi-Fi.
failed-wan-configure = Error al configurar WAN.
failed-lan-configure = Error al configurar LAN.
failed-wlan-configure = Error al configurar la WLAN.

## User Settings

create-user =
    .aria-label = Añadir nuevo usuario
user-settings-input-name =
    .placeholder = Nombre
user-settings-input-email =
    .placeholder = Correo electrónico
user-settings-input-password =
    .placeholder = Contraseña
user-settings-input-totp =
    .placeholder = Código 2FA
user-settings-mfa-enable = Activar autenticación de doble factor
user-settings-mfa-scan-code = Escanea el siguiente código con cualquier aplicación de autenticación de doble factor.
user-settings-mfa-secret = Éste es tu nuevo secreto TOTP, en caso de que el código QR anterior no funcione:
user-settings-mfa-error = El código de autenticación es incorrecto.
user-settings-mfa-enter-code = Escribe debajo el código de tu aplicación de autenticación.
user-settings-mfa-verify = Verificar
user-settings-mfa-regenerate-codes = Regenerar códigos de respaldo
user-settings-mfa-backup-codes = Estos son tus códigos de respaldo. Cada uno sólo se puede usar una vez. Guárdalos en un lugar seguro.
user-settings-input-new-password =
    .placeholder = Nueva contraseña (opcional)
user-settings-input-confirm-new-password =
    .placeholder = Confirmar nueva contraseña
user-settings-input-confirm-password =
    .placeholder = Confirmar contraseña
user-settings-password-mismatch = Las contraseñas no coinciden
user-settings-save = Guardar

## Adapter Settings

adapter-settings-no-adapters = No hay adaptadores presentes.

## Authorization Settings

authorization-settings-no-authorizations = Sin autorizaciones.

## Experiment Settings

experiment-settings-no-experiments = En este momento no hay experimentos disponibles.

## Localization Settings

localization-settings-language-region = Idioma y región
localization-settings-country = País
localization-settings-timezone = Zona horaria
localization-settings-language = Idioma
localization-settings-units = Unidades
localization-settings-units-temperature = Temperatura
localization-settings-units-temperature-celsius = Celsius (° C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Actualizar ahora
update-available = Nueva versión disponible
update-up-to-date = Tu sistema esta actualizado
updates-not-supported = Las actualizaciones no son compatibles con esta plataforma.
update-settings-enable-self-updates = Activar actualizaciones automáticas
last-update = Última actualización
current-version = Versión actual
failed = Ha fallado
never = Nunca
in-progress = En curso
restarting = Reiniciando
checking-for-updates = Comprobando actualizaciones…
failed-to-check-for-updates = No se pueden buscar actualizaciones en este momento.

## Developer Settings

developer-settings-enable-ssh = Activar SSH
developer-settings-view-internal-logs = Ver registros internos
developer-settings-create-local-authorization = Crear autorización local

## Rules

add-rule =
    .aria-label = Crear nueva regla
rules = Reglas
rules-create-rule-hint = No hay reglas creadas. Haz clic en + para crear una regla.
rules-rule-name = Nombre de la regla
rules-customize-rule-name-icon =
    .alt = Personalizar nombre de regla
rules-rule-description = Descripción de la regla
rules-preview-button =
    .alt = Vista previa
rules-delete-icon =
    .alt = Eliminar
rules-drag-hint = Arrastra tus dispositivos aquí para comenzar a crear una regla
rules-drag-input-hint = Añadir dispositivo como entrada
rules-drag-output-hint = Añadir dispositivo como salida
rules-scroll-left =
    .alt = Desplazarse a la izquierda
rules-scroll-right =
    .alt = Desplazarse a la derecha
rules-delete-prompt = Coloca aquí los dispositivos para desconectar
rules-delete-dialog = ¿Seguro que quieres eliminar esta regla de forma permanente?
rules-delete-cancel =
    .value = Cancelar
rules-delete-confirm =
    .value = Eliminar regla
rule-invalid = Inválido
rule-delete-prompt = ¿Seguro que quieres eliminar esta regla de forma permanente?
rule-delete-cancel-button =
    .value = Cancelar
rule-delete-confirm-button =
    .value = Eliminar regla
rule-select-property = Seleccionar propiedad
rule-not = No
rule-event = Evento
rule-action = Acción
rule-configure = Configurar…
rule-time-title = Hora del día
rule-notification = Notificación
notification-title = Título
notification-message = Mensaje
notification-level = Nivel
notification-low = Bajo
notification-normal = Normal
notification-high = Alto
rule-name = Nombre de la regla

## Logs

add-log =
    .aria-label = Crear nuevo registro
logs = Registros
logs-create-log-hint = No se crearon registros. Haz clic en + para crear un registro.
logs-device = Dispositivo
logs-device-select =
    .aria-label = Registro del dispositivo
logs-property = Propiedad
logs-property-select =
    .aria-label = Propiedad del registro
logs-retention = Retención
logs-retention-length =
    .aria-label = Tamaño de la retención del registro
logs-retention-unit =
    .aria-label = Unidad de retención de registro
logs-hours = Horas
logs-days = Días
logs-weeks = Semanas
logs-save = Guardar
logs-remove-dialog-title = Eliminando
logs-remove-dialog-warning = Eliminar el registro también eliminará todos sus datos. ¿Seguro que quieres eliminarlo?
logs-remove = Eliminar
logs-unable-to-create = No se puede crear el registro
logs-server-remove-error = Error del servidor: no se puede eliminar el registro

## Add New Things

add-thing-scanning-icon =
    .alt = Explorando
add-thing-scanning = Buscando nuevos dispositivos…
add-thing-add-adapters-hint = No se encontraron dispositivos nuevos. Prueba a <a data-l10n-name="add-thing-add-adapters-hint-anchor">añadir algunos complementos</a>.
add-thing-add-by-url = Añadir por URL…
add-thing-done = Hecho
add-thing-cancel = Cancelar

## Context Menu

context-menu-choose-icon = Elegir icono…
context-menu-save = Guardar
context-menu-remove = Eliminar

## Capabilities

OnOffSwitch = Interruptor encendido/apagado
MultiLevelSwitch = Interruptor multinivel
ColorControl = Control de color
ColorSensor = Sensor de color
EnergyMonitor = Monitor de energía
BinarySensor = Sensor binario
MultiLevelSensor = Sensor multinivel
SmartPlug = Enchufe inteligente
Light = Luz
DoorSensor = Sensor de puerta
MotionSensor = Sensor de movimiento
LeakSensor = Sensor de fugas
PushButton = Pulsador
VideoCamera = Cámara de vídeo
Camera = Cámara
TemperatureSensor = Sensor de temperatura
HumiditySensor = Sensor de humedad
Alarm = Alarma
Thermostat = Termostato
Lock = Cerrojo
BarometricPressureSensor = Sensor de presión barométrica
Custom = Dispositivo personalizado
Thing = Dispositivo
AirQualitySensor = Sensor de calidad del aire

## Properties

alarm = Alarma
pushed = Pulsado
not-pushed = Sin pulsar
on-off = Encendido/Apagado
on = Encendido
off = Apagado
power = Energía
voltage = Voltaje
temperature = Temperatura
current = Actual
frequency = Frecuencia
color = Color
brightness = Brillo
leak = Fuga
dry = Seco
color-temperature = Temperatura del color
video-unsupported = Lo sentimos, el vídeo no es compatible con tu navegador.
motion = Movimiento
no-motion = Sin movimiento
open = Abierto
closed = Cerrado
locked = Bloqueado
unlocked = Desbloqueado
jammed = Atascado
unknown = Desconocido
active = Activo
inactive = Inactivo
humidity = Humedad
concentration = Concentración
density = Densidad

## Domain Setup

tunnel-setup-reclaim-domain = Parece que ya has registrado ese subdominio. Para recuperarlo <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">haz clic aquí</a>.
check-email-for-token = Revisa el correo electrónico para obtener un token de recuperación y pégalo arriba.
reclaim-failed = No se pudo recuperar el dominio.
subdomain-already-used = Este subdominio ya se está utilizando. Por favor, elije uno diferente.
invalid-subdomain = Subdominio no válido.
invalid-email = Correo electrónico no válido
invalid-reclamation-token = Token de recuperación inválido.
domain-success = ¡Correcto! Por favor espera mientras te redirigimos…
issuing-error = Error al emitir el certificado. Inténtalo de nuevo.
redirecting = Redirigiendo…

## Booleans

true = Verdadero
false = Falso

## Time

utils-now = ahora
utils-seconds-ago =
    { $value ->
        [one] Hace { $value } segundo
       *[other] Hace { $value } segundos
    }
utils-minutes-ago =
    { $value ->
        [one] Hace { $value } minuto
       *[other] Hace { $value } minutos
    }
utils-hours-ago =
    { $value ->
        [one] Hace { $value } hora
       *[other] Hace { $value } horas
    }
utils-days-ago =
    { $value ->
        [one] Hace { $value } día
       *[other] Hace { $value } días
    }
utils-weeks-ago =
    { $value ->
        [one] Hace { $value } semana
       *[other] Hace { $value } semanas
    }
utils-months-ago =
    { $value ->
        [one] Hace { $value } mes
       *[other] Hace { $value } meses
    }
utils-years-ago =
    { $value ->
        [one] Hace { $value } año
       *[other] Hace { $value } años
    }
minute = Minuto
hour = Hora
day = Día
week = Semana

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

unknown-device-type = Tipo de dispositivo desconocido
new-thing-choose-icon = Elegir icono…
new-thing-save = Guardar
new-thing-pin =
    .placeholder = Introducir PIN
new-thing-pin-error = PIN incorrecto
new-thing-pin-invalid = PIN inválido
new-thing-cancel = Cancelar
new-thing-submit = Enviar
new-thing-username =
    .placeholder = Introducir nombre de usuario
new-thing-password =
    .placeholder = Introducir contraseña
new-thing-credentials-error = Credenciales incorrectas
new-thing-saved = Guardado
new-thing-done = Hecho

## New Web Thing View

new-web-thing-url =
    .placeholder = Introduce la URL del dispositivo web
new-web-thing-label = Dispositivo web
loading = Cargando…
new-web-thing-multiple = Encontrados múltiples dispositivos web
new-web-thing-from = desde

## Empty div Messages

no-things = Aún no hay dispositivos. Haz clic en + para buscar dispositivos disponibles.
thing-not-found = No se encontró dispositivo.
action-not-found = No se encontró acción.
events-not-found = Este dispositivo no tiene eventos.

## Add-on Settings

add-addons =
    .aria-label = Buscar nuevos complementos
author-unknown = Desconocido
disable = Desactivar
enable = Activar
by = por
license = licencia
addon-configure = Configurar
addon-update = Actualizar
addon-remove = Eliminar
addon-updating = Actualizando…
addon-updated = Actualizado
addon-update-failed = Fallido
addon-config-applying = Aplicando…
addon-config-apply = Aplicar
addon-discovery-added = Añadido
addon-discovery-add = Añadir
addon-discovery-installing = Instalando…
addon-discovery-failed = Fallido
addon-search =
    .placeholder = Buscar

## Page Titles

settings = Ajustes
domain = Dominio
users = Usuarios
edit-user = Editar usuario
add-user = Añadir usuario
adapters = Adaptadores
addons = Complementos
addon-config = Configurar complemento
addon-discovery = Descubrir nuevos complementos
experiments = Experimentos
localization = Localización
updates = Actualizaciones
authorizations = Autorizaciones
developer = Desarrollador
network = Red
ethernet = Ethernet
wifi = Wi-Fi
icon = Icono

## Errors

unknown-state = Estado desconocido.
error = Error
errors = Errores
gateway-unreachable = Pasarela inalcanzable
more-information = Más información
invalid-file = Archivo inválido.
failed-read-file = Error al leer el archivo.
failed-save = Error al guardar.

## Schema Form

unsupported-field = Esquema de campo no compatible

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Iniciar sesión — { -webthings-gateway-brand }
login-log-in = Iniciar sesión
login-wrong-credentials = El nombre de usuario o la contraseña es incorrecto.
login-wrong-totp = El código de autenticación es incorrecto.
login-enter-totp = Escribe el código de tu aplicación de autenticación.

## Create First User Page

signup-title = Crear usuario — { -webthings-gateway-brand }
signup-welcome = Bienvenido
signup-create-account = Crea tu primera cuenta de usuario:
signup-password-mismatch = Las contraseñas no coinciden
signup-next = Siguiente

## Tunnel Setup Page

tunnel-setup-title = Elije la dirección web — { -webthings-gateway-brand }
tunnel-setup-welcome = Bienvenido
tunnel-setup-choose-address = Elije una dirección web segura para tu puerta de enlace:
tunnel-setup-input-subdomain =
    .placeholder = subdominio
tunnel-setup-email-opt-in = Quiero recibir noticias sobre WebThings.
tunnel-setup-input-reclamation-token =
    .placeholder = Token de recuperación
tunnel-setup-error = Se produjo un error al configurar el subdominio.
tunnel-setup-create = Crear
tunnel-setup-skip = Omitir
tunnel-setup-time-sync = Esperando a que el reloj del sistema se configure desde Internet. Es probable que el registro de dominio falle hasta que esto se complete.

## Authorize Page

authorize-title = Solicitud de autorización — { -webthings-gateway-brand }
authorize-authorization-request = Solicitud de autorización
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> deseas acceder a tu puerta de enlace a dispositivos de <<function>>.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = desde <<domain>>
authorize-monitor-and-control = monitor y control
authorize-monitor = monitor
authorize-allow-all = Permitir para todos los dispositivos
authorize-allow =
    .value = Permitir
authorize-deny = Denegar

## Local Token Page

local-token-title = Servicio de token local — { -webthings-gateway-brand }
local-token-header = Servicio de token local
local-token-your-token = Tu token local es este <a data-l10n-name="local-token-jwt">JSON Web Token</a>:
local-token-use-it = Úsalo para comunicar con la puerta de enlace de manera segura, con <a data-l10n-name="local-token-bearer-type">autorización de tipo Bearer</a>.
local-token-copy-token = Copiar token

## Router Setup Page

router-setup-title = Configuración del enrutador — { -webthings-gateway-brand }
router-setup-header = Crear una nueva red Wi-Fi
router-setup-input-ssid =
    .placeholder = Nombre de red
router-setup-input-password =
    .placeholder = Contraseña
router-setup-input-confirm-password =
    .placeholder = Confirmar contraseña
router-setup-create =
    .value = Crear
router-setup-password-mismatch = Las contraseñas deben coincidir

## Wi-Fi Setup Page

wifi-setup-title = Configuración de Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = ¿Conectarse a una red Wi-Fi?
wifi-setup-input-password =
    .placeholder = Contraseña
wifi-setup-show-password = Mostrar contraseña
wifi-setup-connect =
    .value = Conectar
wifi-setup-network-icon =
    .alt = Red Wi-Fi
wifi-setup-skip = Omitir

## Connecting to Wi-Fi Page

connecting-title = Conectándose a Wi-Fi — { -webthings-gateway-brand }
connecting-header = Conectándose a Wi-Fi…
connecting-connect = Asegúrate de estar conectado a la misma red y luego navega a { $gateway-link } en tu navegador web para continuar con la configuración.
connecting-warning = Nota: Si no puedes cargar { $domain }, busca la dirección IP de la puerta de enlace en tu enrutador.
connecting-header-skipped = Configuración de Wi-Fi omitida
connecting-skipped = La puerta de enlace se está iniciando ahora. Navega a { $gateway-link } en tu navegador web mientras estás conectado a la misma red que la puerta de enlace para continuar con la configuración.

## Creating Wi-Fi Network Page

creating-title = Creando una red Wi-Fi — { -webthings-gateway-brand }
creating-header = Creando una red Wi-Fi…
creating-content = Conéctate a { $ssid } con la contraseña que acabas de crear, luego navega a { $gateway-link } o { $ip-link } en tu navegador web.

## UI Updates

ui-update-available = Está disponible una interfaz de usuario actualizada.
ui-update-reload = Recargar
ui-update-close = Cerrar

## General Terms

ok = Aceptar
ellipsis = …
event-log = Registro de eventos
edit = Editar
remove = Eliminar
disconnected = Desconectado
processing = Procesando…
submit = Enviar

## Top-Level Buttons

menu-button =
    .aria-label = Menú
back-button =
    .aria-label = Atrás
overflow-button =
    .aria-label = Acciones adicionales
submit-button =
    .aria-label = Enviar
edit-button =
    .aria-label = Editar
save-button =
    .aria-label = Guardar
