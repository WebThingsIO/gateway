A self-hosted web application for monitoring and controlling a building over the web.

**Installation**

On Ubuntu Server/Ubuntu Desktop:

`$ sudo snap install --edge webthings-gateway`
`$ sudo snap connect webthings-gateway:system-observe`
`$ sudo snap connect webthings-gateway:hardware-observe`
`$ sudo snap connect webthings-gateway:network-manager`
`$ sudo snap set system experimental.hotplug=true`
`$ sudo snap restart webthings-gateway`

On Ubuntu Core:

`$ snap install --edge webthings-gateway`
`$ snap install network-manager`
`$ snap connect webthings-gateway:system-observe`
`$ snap connect webthings-gateway:hardware-observe`
`$ snap connect webthings-gateway:network-manager network-manager:service`
`$ sudo snap set system experimental.hotplug=true`
`$ snap restart webthings-gateway`

Currently untested on other host operating systems.

To connect a USB dongle:

`$ snap interface serial-port`

(to find the name of the slot automatically created by hotplug, then...)

`$ snap connect webthings-gateway:serial-port snapd:foo`

(where "foo" is the name of the slot)

Note: This snap package is currently experimental and may not yet be fully functional. For manual installation instructions of a stable version please see https://webthings.io/docs/gateway/installation/