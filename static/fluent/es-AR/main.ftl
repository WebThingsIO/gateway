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

upload-floorplan = Subir plano...
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
add-thing-add-by-url = Añadir por URL...
add-thing-done = Listo
add-thing-cancel = Cancelar

## Context Menu

context-menu-choose-icon = Elegir icono...
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

## Domain Setup


## Booleans


## Time


## Unit Abbreviations


## New Thing View


## New Web Thing View


## Empty div Messages


## Add-on Settings


## Page Titles


## Speech


## Errors


## Schema Form


## Icon Sources


## Login Page


## Create First User Page


## Tunnel Setup Page


## Authorize Page


## Local Token Page


## Router Setup Page


## Wi-Fi Setup Page


## Connecting to Wi-Fi Page


## Creating Wi-Fi Network Page


## General Terms


## Top-Level Buttons

