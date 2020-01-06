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

assistant-menu-item = Ayudante
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

## Assistant

assistant-avatar-image =
    .alt = Avatar asistente
assistant-controls-text-input =
    .placeholder = ¿Cómo puedo ayudar?

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

experiment-settings-smart-assistant = Asistente inteligente
experiment-settings-logs = Registros

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
Alarm = Alarma
Thermostat = Termostato
Lock = Cerrojo
Custom = Dispositivo personalizado
Thing = Dispositivo

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

