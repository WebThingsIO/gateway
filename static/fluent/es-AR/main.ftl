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

assistant-menu-item = Asistente
things-menu-item = Dispositivos
rules-menu-item = Reglas
logs-menu-item = Registros
floorplan-menu-item = Plano
settings-menu-item = Ajustes
log-out-button = Cerrar sesión

## Things

thing-details =
    .aria-label = Ver propiedades
add-things =
    .aria-label = Agregar nuevos dispositivos

## Assistant

assistant-avatar-image =
    .alt = Avatar asistente
assistant-controls-text-input =
    .placeholder = ¿Cómo puedo ayudar?

## Floorplan

upload-floorplan = Subir plano…
upload-floorplan-hint = (.svg recomendado)

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
    .placeholder = gateway

## Network Settings

network-settings-unsupported = La configuración de la red no es compatible con esta plataforma.
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
network-settings-wifi-wlan = Wi-Fi（WLAN）
network-settings-ip-address = Dirección IP
network-settings-dhcp = (DHCP) Automático
network-settings-static = Manual (IP estática)
network-settings-pppoe = Puente (PPPoE)
network-settings-static-ip-address = Dirección IP estática
network-settings-network-mask = Máscara de red
network-settings-gateway = Gateway
network-settings-done = Listo
network-settings-wifi-password =
    .placeholder = Contraseña
network-settings-show-password = Mostrar contraseña
network-settings-connect = Conectar
network-settings-username = Nombre de usuario
network-settings-password = Contraseña
network-settings-router-ip = Dirección IP del enrutador
network-settings-dhcp-server = Servidor DHCP
network-settings-enable-wifi = Habilitar Wi-Fi
network-settings-network-name = Nombre de la red (SSID)
wireless-connected = Conectado
wireless-icon =
    .alt = Red Wi-Fi
network-settings-changing = Cambiar la configuración la de red. Esto puede tardar un minuto.
failed-ethernet-configure = Falló la configuración de ethernet.
failed-wifi-configure = Falló la configuración de Wi-Fi
failed-wan-configure = Falló la configuración de WAN
failed-lan-configure = Falló la configuración de LAN
failed-wlan-configure = Falló la configuración de WLAN

## User Settings

create-user =
    .aria-label = Agregar nuevo usuario
user-settings-input-name =
    .placeholder = Nombre
user-settings-input-email =
    .placeholder = Correo electrónico
user-settings-input-password =
    .placeholder = Contraseña
user-settings-input-new-password =
    .placeholder = Nueva contraseña (opcional)
user-settings-input-confirm-new-password =
    .placeholder = Confirmar nueva contraseña
user-settings-input-confirm-password =
    .placeholder = Confirmar contraseña
user-settings-password-mismatch = Las contraseñas no coinciden
user-settings-save = Guardar

## Adapter Settings

adapter-settings-no-adapters = Sin adaptadores presentes.

## Authorization Settings

authorization-settings-no-authorizations = Sin autorizaciones

## Experiment Settings

experiment-settings-smart-assistant = Asistente inteligente
experiment-settings-logs = Registros

## Localization Settings

localization-settings-language-region = Idioma y región
localization-settings-country = País
localization-settings-timezone = Huso horario
localization-settings-language = Idioma
localization-settings-units = Unidades
localization-settings-units-temperature = Temperatura
localization-settings-units-temperature-celsius = Celsius (° C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (° F)

## Update Settings

update-settings-update-now = Actualizar ahora
update-available = Nueva versión disponible
update-up-to-date = Tu sistema esta actualizado
updates-not-supported = Las actualizaciones no son compatibles con esta plataforma.
update-settings-enable-self-updates = Permitir actualizaciones automáticas
last-update = Última actualización
current-version = Versión actual
failed = Falló
never = Nunca
in-progress = En progreso
restarting = Reiniciando

## Developer Settings

developer-settings-enable-ssh = Habilitar SSH
developer-settings-view-internal-logs = Ver registros internos
developer-settings-create-local-authorization = Crear autorización local

## Rules

add-rule =
    .aria-label = Crear nueva regla
rules = Reglas
rules-create-rule-hint = No hay reglas creadas. Hacé clic en + para crear una regla.
rules-rule-name = Nombre de la regla
rules-customize-rule-name-icon =
    .alt = Personalizar nombre de la regla
rules-rule-description = Descripción de la regla
rules-preview-button =
    .alt = Vista previa
rules-delete-icon =
    .alt = Eliminar
rules-drag-hint = Arrastrá tus dispositivos aquí para comenzar a crear una regla
rules-drag-input-hint = Agregar un dispositivo como entrada
rules-drag-output-hint = Agregar un dispositivo como salida
rules-scroll-left =
    .alt = Desplazarse a la izquierda
rules-scroll-right =
    .alt = Desplazarse a la derecha
rules-delete-prompt = Dejá los dispositivos aquí para desconectarte
rules-delete-dialog = ¿Estás seguro de querés eliminar esta regla de manera permanente?
rules-delete-cancel =
    .value = Cancelar
rules-delete-confirm =
    .value = Eliminar regla
rule-invalid = Inválido
rule-delete-prompt = ¿Estás seguro de querés eliminar esta regla de manera permanente?
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
logs-create-log-hint = No se crearon registros. Hacé clic en + para crear un registro.
logs-device = Dispositivo
logs-device-select =
    .aria-label = Registro del dispositivo
logs-property = Propiedad
logs-property-select =
    .aria-label = Propiedad del registro
logs-retention = Retención
logs-retention-length =
    .aria-label = Longitud de retención del registro
logs-retention-unit =
    .aria-label = Unidad de retención del registro
logs-hours = Horas
logs-days = Días
logs-weeks = Semanas
logs-save = Guardar
logs-remove-dialog-title = Eliminar
logs-remove-dialog-warning = Al eliminar el registro también se van a eliminar todos sus datos. ¿Seguro de que querés eliminarlo?
logs-remove = Eliminar
logs-unable-to-create = No se pudo crear el registro
logs-server-remove-error = Error del servidor: no se puede eliminar el registro

## Add New Things

add-thing-scanning-icon =
    .alt = Exploración
add-thing-scanning = Buscando nuevos dispositivos...
add-thing-add-adapters-hint = No se encontraron dispositivos nuevos. Probá <a data-l10n-name="add-thing-add-adapters-hint-anchor">agregando algunos complementos</a>.
add-thing-add-by-url = Añadir por URL…
add-thing-done = Listo
add-thing-cancel = Cancelar

## Context Menu

context-menu-choose-icon = Elegir icono…
context-menu-save = Guardar
context-menu-remove = Eliminar

## Capabilities

OnOffSwitch = Interruptor encendido/apagado
MultiLevelSwitch = Interruptor multinivel
ColorControl = Control del color
ColorSensor = Sensor del color
EnergyMonitor = Monitor de energía
BinarySensor = Sensor binario
MultiLevelSensor = Sensor multinivel
SmartPlug = Enchufe inteligente
Light = Claro
DoorSensor = Sensor de puerta
MotionSensor = Sensor de movimiento
LeakSensor = Sensor de fugas
PushButton = Presionar botón
VideoCamera = Cámara de video
Camera = Cámara
TemperatureSensor = Sensor de temperatura
Alarm = Alarma
Thermostat = Termostato
Lock = Cerrar
Custom = Dispositivo personalizado
Thing = Dispositivo

## Properties

alarm = Alarma
on-off = Habilitado/Desactivado
on = Activado
off = Desactivado
voltage = voltaje
temperature = Temperatura
current = Actual
frequency = Frecuencia
color = Color
brightness = Brillo
color-temperature = Temperatura del color
video-unsupported = Lo sentimos, el video no es soportado por el navegador.
motion = Movimiento
no-motion = Sin movimiento
open = Abierto
closed = Cerrado
locked = Bloqueado
unlocked = Desbloqueado
unknown = Desconocido
active = Activo
inactive = Inactivo

## Domain Setup

tunnel-setup-reclaim-domain = Parece que ya has registrado ese subdominio. Para recuperarlo <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">hacé clic aquí </a>.
check-email-for-token = Revisá tu correo electrónico para encontrar el token de recuperación y pegalo acá arriba.
reclaim-failed = No se pudo recuperar el dominio.
subdomain-already-used = Este subdominio ya se está utilizando. Elegí uno diferente.
invalid-reclamation-token = Token de recuperación inválido.
domain-success = ¡Éxito! Esperá mientras te redirigimos…
issuing-error = Error al emitir el certificado. Intentá de nuevo.
redirecting = Redirigiendo…

## Booleans

true = Verdadero
false = Falso

## Time

utils-now = ahora
utils-seconds-ago =
    { $value ->
        [one] hace { $value } segundo
       *[other] hace { $value } segundos
    }
utils-minutes-ago =
    { $value ->
        [one] hace { $value } minuto
       *[other] hace { $value } minutos
    }
utils-hours-ago =
    { $value ->
        [one] hace { $value } hora
       *[other] hace { $value } horas
    }
utils-days-ago =
    { $value ->
        [one] hace { $value } día
       *[other] hace { $value } días
    }
utils-weeks-ago =
    { $value ->
        [one] hace { $value } semana
       *[other] hace { $value } semanas
    }
utils-months-ago =
    { $value ->
        [one] hace { $value } mes
       *[other] hace { $value } meses
    }
utils-years-ago =
    { $value ->
        [one] hace { $value } año
       *[other] hace { $value } años
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

## New Thing View

unknown-device-type = Tipo de dispositivo desconocido
new-thing-choose-icon = Seleccionar ícono…
new-thing-save = Guardar
new-thing-pin =
    .placeholder = Ingresar PIN
new-thing-pin-error = PIN incorrecto
new-thing-pin-invalid = PIN inválido
new-thing-cancel = Cancelar
new-thing-submit = Enviar
new-thing-username =
    .placeholder = Ingresar nombre de usuario
new-thing-password =
    .placeholder = Ingresar contraseña
new-thing-credentials-error = Credenciales incorrectas
new-thing-saved = Guardado

## New Web Thing View

loading = Cargando…

## Empty div Messages

action-not-found = Acción no encontrada.

## Add-on Settings

add-addons =
    .aria-label = Buscar nuevos complementos
author-unknown = Desconocido
disable = Deshabilitar
enable = Habilitar
by = por
addon-configure = Configurar
addon-update = Actualizar
addon-remove = Eliminar
addon-updating = Actualizando…
addon-updated = Actualizado
addon-update-failed = Falló
addon-config-applying = Aplicando…
addon-config-apply = Aplicar
addon-discovery-added = Agregado
addon-discovery-add = Agregar
addon-discovery-installing = Instalando…
addon-discovery-failed = Falló

## Page Titles

settings = Ajustes
domain = Dominio
users = Usuarios
edit-user = Editar usuario
add-user = Agregar usuario
adapters = Adaptadores
addons = Complementos
addon-config = Configurar complemento
addon-discovery = Descubrir nuevos complementos
experiments = Experimentos
updates = Actualizaciones
authorizations = Autorizaciones
developer = Desarrollador
network = Red
ethernet = Ethernet
wifi = Wi-Fi
icon = Ícono

## Speech


## Errors

unknown-state = Estado desconocido.
error = Error
errors = Errores
more-information = Más información
invalid-file = Archivo inválido.
failed-read-file = Error al leer el archivo.
failed-save = Error al guardar.

## Schema Form


## Icon Sources


## Login Page


## Create First User Page

signup-title = Crear usuario — { -webthings-gateway-brand }
signup-welcome = Bienvenido
signup-create-account = Crear tu primera cuenta de usuario:
signup-password-mismatch = Las contraseñas no coinciden
signup-next = Siguiente

## Tunnel Setup Page

tunnel-setup-title = Elegir dirección web — { -webthings-gateway-brand }
tunnel-setup-welcome = Bienvenido
tunnel-setup-input-subdomain =
    .placeholder = subdominio
tunnel-setup-privacy-policy = Política de privacidad
tunnel-setup-input-reclamation-token =
    .placeholder = Token de recuperación
tunnel-setup-error = Ocurrió un error al configurar el subdominio.
tunnel-setup-create = Crear
tunnel-setup-skip = Omitir

## Authorize Page

authorize-title = Pedido de autorización — { -webthings-gateway-brand }
authorize-authorization-request = Pedido de autorización
authorize-allow =
    .value = Permitir
authorize-deny = Denegar

## Local Token Page


## Router Setup Page

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

connecting-title = Conectando a Wi-Fi — { -webthings-gateway-brand }
connecting-header = Conectando a Wi-Fi…
connecting-header-skipped = Configuración de Wi-Fi omitida

## Creating Wi-Fi Network Page

creating-title = Creando red Wi-Fi — { -webthings-gateway-brand }
creating-header = Creando red Wi-Fi…

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
