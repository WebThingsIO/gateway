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

things-menu-item = Objets
rules-menu-item = Règles
logs-menu-item = Journaux
floorplan-menu-item = Plan d’étage
settings-menu-item = Paramètres
log-out-button = Déconnexion

## Things

thing-details =
    .aria-label = Afficher les propriétés
add-things =
    .aria-label = Ajouter un objet

## Floorplan

upload-floorplan = Envoyer un plan d’étage…
upload-floorplan-hint = (.svg recommandé)

## Top-Level Settings

settings-domain = Domaine
settings-network = Réseau
settings-users = Utilisateurs
settings-add-ons = Composants additionnels
settings-adapters = Adaptateurs
settings-localization = Paramètres régionaux
settings-updates = Mises à jour
settings-authorizations = Autorisations
settings-experiments = Expériences
settings-developer = Développeur

## Domain Settings

domain-settings-local-label = Accès local
domain-settings-local-update = Modifiez nom d’hôte
domain-settings-remote-access = Accès à distance
domain-settings-local-name =
    .placeholder = Gateway

## Network Settings

network-settings-unsupported = Les paramètres de réseau ne sont pas pris en charge sur cette plateforme.
network-settings-ethernet-image =
    .alt = Ethernet
network-settings-ethernet = Ethernet
network-settings-wifi-image =
    .alt = Wi-Fi
network-settings-wifi = Wi-Fi
network-settings-home-network-image =
    .alt = Réseau domestique
network-settings-internet-image =
    .alt = Internet
network-settings-configure = Configurer
network-settings-internet-wan = Internet (WAN)
network-settings-wan-mode = Mode
network-settings-home-network-lan = Réseau domestique (LAN)
network-settings-wifi-wlan = Wi-Fi (WLAN)
network-settings-ip-address = Adresse IP
network-settings-dhcp = Automatique (DHCP)
network-settings-static = Manuel (IP statique)
network-settings-pppoe = Pont (PPPoE)
network-settings-static-ip-address = Adresse IP statique
network-settings-network-mask = Masque de réseau
network-settings-gateway = Passerelle
network-settings-done = Fini
network-settings-wifi-password =
    .placeholder = Mot de passe
network-settings-show-password = Montrer mot de passe
network-settings-connect = Se connecter
network-settings-username = Nom d’utilisateur
network-settings-password = Mot de passe
network-settings-router-ip = Adresse IP du routeur
network-settings-dhcp-server = Serveur DHCP
network-settings-enable-wifi = Activer le Wi-Fi
network-settings-network-name = Nom réseau (SSID)
wireless-connected = Connecté
wireless-icon =
    .alt = Réseau Wi-Fi
network-settings-changing = Modification des paramètres réseau en cours. Veuillez patienter.
failed-ethernet-configure = Échec de configuration du réseau Ethernet.
failed-wifi-configure = Échec de configuration du réseau Wi-Fi.
failed-wan-configure = Échec de configuration du réseau Internet.
failed-lan-configure = Échec de configuration du réseau domestique.
failed-wlan-configure = Échec de configuration du WLAN.

## User Settings

create-user =
    .aria-label = Ajouter un utilisateur
user-settings-input-name =
    .placeholder = Nom
user-settings-input-email =
    .placeholder = Adresse électronique
user-settings-input-password =
    .placeholder = Mot de passe
user-settings-input-totp =
    .placeholder = Code 2FA
user-settings-mfa-enable = Activer l’authentification à deux facteurs
user-settings-mfa-scan-code = Scannez le code suivant avec n’importe quelle application d’authentification à deux facteurs.
user-settings-mfa-secret = Ceci est votre nouveau jeton TOTP secret, au cas où le code QR ci-dessus ne fonctionne pas :
user-settings-mfa-error = Le code d’authentification est incorrect.
user-settings-mfa-enter-code = Saisissez le code de votre application d’authentification ci-dessous.
user-settings-mfa-verify = Vérifier
user-settings-mfa-regenerate-codes = Générer à nouveau les codes de sauvegarde
user-settings-mfa-backup-codes = Voici vos codes de sauvegarde. Chaque code ne peut-être utilisé qu’une seule fois. Conservez-les en lieu sûr.
user-settings-input-new-password =
    .placeholder = Nouveau mot de passe (facultatif)
user-settings-input-confirm-new-password =
    .placeholder = Confirmer le nouveau mot de passe
user-settings-input-confirm-password =
    .placeholder = Confirmer le mot de passe
user-settings-password-mismatch = Les mots de passe ne correspondent pas
user-settings-save = Enregistrer

## Adapter Settings

adapter-settings-no-adapters = Aucun adaptateur disponible.

## Authorization Settings

authorization-settings-no-authorizations = Aucune autorisation.

## Experiment Settings

experiment-settings-no-experiments = Aucune expérience n’est disponible pour le moment.

## Localization Settings

localization-settings-language-region = Langue et région
localization-settings-country = Pays
localization-settings-timezone = Fuseau horaire
localization-settings-language = Langue
localization-settings-units = Unités
localization-settings-units-temperature = Température
localization-settings-units-temperature-celsius = Celsius (°C)
localization-settings-units-temperature-fahrenheit = Fahrenheit (°F)

## Update Settings

update-settings-update-now = Mettre à jour maintenant
update-available = Mise à jour disponible
update-up-to-date = Le système est à jour
updates-not-supported = Les mises à jour ne sont pas prises en charge sur cette plateforme.
update-settings-enable-self-updates = Activer les mises à jour automatiques
last-update = Dernière mise à jour
current-version = Version actuelle
failed = Échec
never = Jamais
in-progress = En cours
restarting = Redémarrage en cours
checking-for-updates = Recherche de mises à jour…
failed-to-check-for-updates = Impossible de rechercher des mises à jour pour le moment.

## Developer Settings

developer-settings-enable-ssh = Activer SSH
developer-settings-view-internal-logs = Afficher les journaux internes
developer-settings-create-local-authorization = Créer une autorisation locale

## Rules

add-rule =
    .aria-label = Créer une règle
rules = Règles
rules-create-rule-hint = Aucune règle créée. Cliquer sur + pour la créer.
rules-rule-name = Nom de la règle
rules-customize-rule-name-icon =
    .alt = Personnaliser le nom de la règle
rules-rule-description = Description de la règle
rules-preview-button =
    .alt = Aperçu
rules-delete-icon =
    .alt = Supprimer
rules-drag-hint = Faire glisser les périphériques ici pour créer une règle
rules-drag-input-hint = Ajouter un périphérique d’entrée
rules-drag-output-hint = Ajouter un périphérique de sortie
rules-scroll-left =
    .alt = Défiler vers la gauche
rules-scroll-right =
    .alt = Défiler vers la droite
rules-delete-prompt = Déplacer les périphériques ici pour déconnecter
rules-delete-dialog = Voulez-vous vraiment supprimer la règle ?
rules-delete-cancel =
    .value = Annuler
rules-delete-confirm =
    .value = Supprimer la règle
rule-invalid = Non valide
rule-delete-prompt = Voulez-vous vraiment supprimer la règle ?
rule-delete-cancel-button =
    .value = Annuler
rule-delete-confirm-button =
    .value = Supprimer la règle
rule-select-property = Sélectionner la propriété
rule-not = Non
rule-event = Évènement
rule-action = Action
rule-configure = Configurer…
rule-time-title = Heure
rule-notification = Notification
notification-title = Titre
notification-message = Message
notification-level = Niveau
notification-low = Bas
notification-normal = Normal
notification-high = Élevé
rule-name = Nom de la règle

## Logs

add-log =
    .aria-label = Créer un journal
logs = Journaux
logs-create-log-hint = Aucun journal créé. Cliquer sur + pour le créer.
logs-device = Périphérique
logs-device-select =
    .aria-label = Périphérique des journaux
logs-property = Propriété
logs-property-select =
    .aria-label = Propriété du journal
logs-retention = Rétention
logs-retention-length =
    .aria-label = Durée de la rétention des journaux
logs-retention-unit =
    .aria-label = Unité de la rétention des journaux
logs-hours = Heures
logs-days = Jours
logs-weeks = Semaines
logs-save = Enregistrer
logs-remove-dialog-title = Suppression en cours
logs-remove-dialog-warning = La suppression du journal supprimera toutes ses données. Voulez-vous vraiment le supprimer ?
logs-remove = Supprimer
logs-unable-to-create = Impossible de créer le journal
logs-server-remove-error = Erreur du serveur : impossible de supprimer le journal

## Add New Things

add-thing-scanning-icon =
    .alt = Recherche
add-thing-scanning = Recherche de nouveaux périphériques…
add-thing-add-adapters-hint = Rien de nouveau trouvé. Essayez <a data-l10n-name="add-thing-add-adapters-hint-anchor">d’installer des composants additionnels</a>.
add-thing-add-by-url = Ajouter par URL…
add-thing-done = Terminé
add-thing-cancel = Annuler

## Context Menu

context-menu-choose-icon = Sélectionner l’icône…
context-menu-save = Enregistrer
context-menu-remove = Supprimer

## Capabilities

OnOffSwitch = Interrupteur marche/arrêt
MultiLevelSwitch = Interrupteur multi-niveaux
ColorControl = Contrôle de couleur
ColorSensor = Capteur de couleur
EnergyMonitor = Dispositif de surveillance d’énergie
BinarySensor = Capteur binaire
MultiLevelSensor = Capteur multi-niveaux
SmartPlug = Prise intelligente
Light = Lampe
DoorSensor = Capteur de la porte
MotionSensor = Capteur de mouvement
LeakSensor = Capteur de fuite
PushButton = Bouton poussoir
VideoCamera = Caméra vidéo
Camera = Caméra
TemperatureSensor = Capteur de température
HumiditySensor = Capteur d’humidité
Alarm = Alarme
Thermostat = Thermostat
Lock = Verrou
BarometricPressureSensor = Capteur de pression barométrique
Custom = Objet personnalisé
Thing = Objet
AirQualitySensor = Capteur de qualité de l’air

## Properties

alarm = Alarme
pushed = Enclenché
not-pushed = Non enclenché
on-off = Marche/Arrêt
on = Marche
off = Arrêt
power = Puissance
voltage = Tension
temperature = Température
current = Courant
frequency = Fréquence
color = Couleur
brightness = Luminosité
leak = Fuite
dry = Sec
color-temperature = Température de la couleur
video-unsupported = Désolé, votre navigateur ne prend pas en charge la vidéo.
motion = Mouvement
no-motion = Aucun mouvement
open = Ouvert
closed = Fermé
locked = Verrouillé
unlocked = Déverrouillé
jammed = Bourré
unknown = Inconnu
active = Actif
inactive = Inactif
humidity = Humidité
concentration = Concentration
density = Densité

## Domain Setup

tunnel-setup-reclaim-domain = Il semble que vous avez déjà enregistré ce sous-domaine. Pour le réclamer, <a data-l10n-name="tunnel-setup-reclaim-domain-click-here">cliquez ici</a>.
check-email-for-token = Veuillez consulter votre messagerie électronique pour obtenir le jeton de réclamation et le coller ci-dessus.
reclaim-failed = Impossible de réclamer le domaine.
subdomain-already-used = Ce sous-domaine est déjà utilisé. Veuillez en choisir un autre.
invalid-subdomain = Sous-domaine invalide.
invalid-email = Adresse électronique invalide.
invalid-reclamation-token = Jeton de réclamation non valide.
domain-success = Opération réussie. Veuillez patienter pendant la redirection…
issuing-error = Impossible de délivrer un certificat. Veuillez réessayer.
redirecting = Redirection en cours…

## Booleans

true = Vrai
false = Faux

## Time

utils-now = Maintenant
utils-seconds-ago =
    { $value ->
        [one] Il y a { $value } seconde
       *[other] Il y a { $value } secondes
    }
utils-minutes-ago =
    { $value ->
        [one] Il y a { $value } minute
       *[other] Il y a { $value } minutes
    }
utils-hours-ago =
    { $value ->
        [one] Il y a { $value } heure
       *[other] Il y a { $value } heures
    }
utils-days-ago =
    { $value ->
        [one] Il y a { $value } jour
       *[other] Il y a { $value } jours
    }
utils-weeks-ago =
    { $value ->
        [one] Il y a { $value } semaine
       *[other] Il y a { $value } semaines
    }
utils-months-ago =
    { $value ->
        [one] Il y a { $value } mois
       *[other] Il y a { $value } mois
    }
utils-years-ago =
    { $value ->
        [one] Il y a { $value } an
       *[other] Il y a { $value } ans
    }
minute = Minute
hour = Heure
day = Jour
week = Semaine

## Unit Abbreviations

abbrev-volt = V
abbrev-hertz = Hz
abbrev-amp = A
abbrev-watt = W
abbrev-kilowatt-hour = kW⋅h
abbrev-percent =  %
abbrev-fahrenheit = °F
abbrev-celsius = °C
abbrev-kelvin = K
abbrev-meter = m
abbrev-kilometer = km
abbrev-day = j
abbrev-hour = h
abbrev-minute = m
abbrev-second = s
abbrev-millisecond = ms
abbrev-foot = pi
abbrev-micrograms-per-cubic-meter = µg/m³
abbrev-hectopascal = hPa

## New Thing View

unknown-device-type = Type de périphérique inconnu
new-thing-choose-icon = Sélectionner l’icône…
new-thing-save = Enregistrer
new-thing-pin =
    .placeholder = Entrer le code PIN
new-thing-pin-error = Code PIN incorrect
new-thing-pin-invalid = Code PIN non valide
new-thing-cancel = Annuler
new-thing-submit = Envoyer
new-thing-username =
    .placeholder = Entrer le nom d’utilisateur
new-thing-password =
    .placeholder = Entrer le mot de passe
new-thing-credentials-error = Informations d’identification non valides
new-thing-saved = Enregistré
new-thing-done = Terminé

## New Web Thing View

new-web-thing-url =
    .placeholder = Saisir l’URL de l’objet web
new-web-thing-label = Objet web
loading = Chargement…
new-web-thing-multiple = Plusieurs objets web trouvés
new-web-thing-from = de

## Empty div Messages

no-things = Aucun périphérique. Cliquer sur + analyser les périphériques disponibles.
thing-not-found = Objet non trouvé.
action-not-found = Action non trouvée.
events-not-found = Cet objet n’a aucun évènement.

## Add-on Settings

add-addons =
    .aria-label = Découvrir de nouveaux composants additionnels
author-unknown = Inconnu
disable = Désactiver
enable = Activer
by = par
license = licence
addon-configure = Configurer
addon-update = Mettre à jour
addon-remove = Supprimer
addon-updating = Mise à jour en cours…
addon-updated = Mis à jour
addon-update-failed = Échec
addon-config-applying = Application en cours…
addon-config-apply = Appliquer
addon-discovery-added = Ajouté
addon-discovery-add = Ajouter
addon-discovery-installing = Installation en cours…
addon-discovery-failed = Échec
addon-search =
    .placeholder = Rechercher

## Page Titles

settings = Paramètres
domain = Domaine
users = Utilisateurs
edit-user = Modifier l’utilisateur
add-user = Ajouter un utilisateur
adapters = Adaptateurs
addons = Composants additionnels
addon-config = Configurer le composant additionnel
addon-discovery = Découvrir de nouveaux composants additionnels
experiments = Expériences
localization = Géolocalisation
updates = Mises à jour
authorizations = Autorisations
developer = Développeurs
network = Réseau
ethernet = Ethernet
wifi = Wi-Fi
icon = Icône

## Errors

unknown-state = État inconnu.
error = Erreur
errors = Erreurs
gateway-unreachable = Passerelle inaccessible
more-information = Plus d’informations
invalid-file = Fichier non valide.
failed-read-file = Échec de lecture du fichier.
failed-save = Échec d’enregistrement.

## Schema Form

unsupported-field = Schéma non pris en charge

## Icon Sources

thing-icons-thing-src = /images/thing-icons/thing.svg

## Login Page

login-title = Connexion — { -webthings-gateway-brand }
login-log-in = Connexion
login-wrong-credentials = L’identifiant ou le mot de passe est invalide.
login-wrong-totp = Le code d’authentification est incorrect.
login-enter-totp = Saisissez le code de votre application d’authentification.

## Create First User Page

signup-title = Créer un utilisateur — { -webthings-gateway-brand }
signup-welcome = Bienvenue
signup-create-account = Créer votre premier utilisateur :
signup-password-mismatch = Les mots de passe ne correspondent pas
signup-next = Suivant

## Tunnel Setup Page

tunnel-setup-title = Sélectionner une adresse web — { -webthings-gateway-brand }
tunnel-setup-welcome = Bienvenue
tunnel-setup-choose-address = Sélectionner une adresse web sécurisée pour votre passerelle :
tunnel-setup-input-subdomain =
    .placeholder = sous-domaine
tunnel-setup-input-reclamation-token =
    .placeholder = Jeton de récupération
tunnel-setup-error = Une erreur est survenue en créant le sous-domaine.
tunnel-setup-create = Créer
tunnel-setup-skip = Ignorer
tunnel-setup-time-sync = En attente de connexion pour mettre à jour l’horloge système depuis Internet. L’enregistrement du domaine risque de ne pas fonctionner tant que l’horloge n’est pas à jour.

## Authorize Page

authorize-title = Demande d’autorisation — { -webthings-gateway-brand }
authorize-authorization-request = Demande d’autorisation
# Use <<name>> to indicate where the name of the requester should be placed and <<function>> for the monitor/monitor-and-control selector
authorize-prompt = <<name>> souhaite accéder à votre passerelle pour <<function>> les périphériques.
# Use <<domain>> to indicate where the domain should be placed
authorize-source = de <<domain>>
authorize-monitor-and-control = surveiller et contrôler
authorize-monitor = surveiller
authorize-allow-all = Autoriser pour tout objet
authorize-allow =
    .value = Autoriser
authorize-deny = Refuser

## Local Token Page

local-token-title = Service de jeton local — { -webthings-gateway-brand }
local-token-header = Service de jeton local
local-token-your-token = Votre jeton local est le <a data-l10n-name="local-token-jwt">jeton Web JSON</a> suivant :
local-token-use-it = L’utiliser pour communiquer avec votre passerelle en toute sécurité avec <a data-l10n-name="local-token-bearer-type">« Bearer-type Authorization »</a>.
local-token-copy-token = Copier le jeton

## Router Setup Page

router-setup-title = Configuration du routeur — { -webthings-gateway-brand }
router-setup-header = Créer un réseau Wi-Fi
router-setup-input-ssid =
    .placeholder = Nom du réseau
router-setup-input-password =
    .placeholder = Mot de passe
router-setup-input-confirm-password =
    .placeholder = Confirmer le mot de passe
router-setup-create =
    .value = Créer
router-setup-password-mismatch = Les mots de passe doivent être identiques

## Wi-Fi Setup Page

wifi-setup-title = Configuration Wi-Fi — { -webthings-gateway-brand }
wifi-setup-header = Se connecter à un réseau Wi-Fi ?
wifi-setup-input-password =
    .placeholder = Mot de passe
wifi-setup-show-password = Afficher le mot de passe
wifi-setup-connect =
    .value = Se connecter
wifi-setup-network-icon =
    .alt = Réseau Wi-Fi
wifi-setup-skip = Ignorer

## Connecting to Wi-Fi Page

connecting-title = Connexion en cours — { -webthings-gateway-brand }
connecting-header = Connexion en cours…
connecting-connect = Assurez-vous que vous êtes connecté·e au même réseau puis naviguez vers { $gateway-link } pour continuer la configuration.
connecting-warning = Si vous ne pouvez pas charger { $domain }, recherchez l’adresse IP de la passerelle dans votre routeur.
connecting-header-skipped = Configuration Wi-Fi ignorée
connecting-skipped = La passerelle démarre. Restez connecté·e au même réseau, puis naviguez vers { $gateway-link } pour continuer la configuration.

## Creating Wi-Fi Network Page

creating-title = Création du réseau Wi-Fi en cours — { -webthings-gateway-brand }
creating-header = Création du réseau Wi-Fi en cours…
creating-content = Connectez-vous au réseau { $ssid } avec le mot de passe que vous avez créé, puis naviguez vers { $gateway-link } ou { $ip-link } dans votre navigateur.

## UI Updates

ui-update-available = Une interface utilisateur mise à jour est disponible.
ui-update-reload = Actualiser
ui-update-close = Fermer

## General Terms

ok = OK
ellipsis = …
event-log = Journal des évènements
edit = Modifier
remove = Supprimer
disconnected = Déconnecté
processing = Traitement en cours…
submit = Envoyer

## Top-Level Buttons

menu-button =
    .aria-label = Menu
back-button =
    .aria-label = Retour
overflow-button =
    .aria-label = Actions supplémentaires
submit-button =
    .aria-label = Envoyer
edit-button =
    .aria-label = Modifier
save-button =
    .aria-label = Enregistrer
