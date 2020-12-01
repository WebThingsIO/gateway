# WebThings Gateway

Docker image based on Debian Buster for running the
[WebThings Gateway](https://github.com/WebThingsIO/gateway). The image
is built for AMD64, ARMv7, and ARMv8 (AArch64).

## Compatibility

While the gateway doesn't necessarily require full local network access, some
add-ons may. Therefore, it is best to run with the `--network="host"` flag.
Currently, this flag will not work when using
[Docker for Mac](https://docs.docker.com/docker-for-mac/) or
[Docker for Windows](https://docs.docker.com/docker-for-windows/) due to
[this](https://github.com/docker/for-mac/issues/68) and
[this](https://github.com/docker/for-win/issues/543).

## Usage

* On Linux:

    ```shell
    docker run \
        -d \
        -e TZ=America/Los_Angeles \
        -v /path/to/shared/data:/home/node/.webthings \
        --network="host" \
        --log-opt max-size=1m \
        --log-opt max-file=10 \
        --name webthings-gateway \
        webthingsio/gateway:latest
    ```

* On Windows or macOS:

    ```shell
    docker run \
        -d \
        -p 8080:8080 \
        -p 4443:4443 \
        -e TZ=America/Los_Angeles \
        -v /path/to/shared/data:/home/node/.webthings \
        --log-opt max-size=1m \
        --log-opt max-file=10 \
        --name webthings-gateway \
        webthingsio/gateway:latest
    ```

### Parameters

* `-d` - Run in daemon mode (in the background)
* `-e TZ=America/Los_Angeles` - Set the time zone to `America/Los_Angeles`. The
  list of names can be found
  [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).
* `-v /path/to/shared/data:/home/node/.webthings` - Change
  `/path/to/shared/data` to some local path. We are mounting a directory on the
  host to the container in order to store the persistent "user profile" data,
  e.g. add-ons, logs, configuration data, etc.
* `--network="host"` - Shares host networking with container (**highly
  recommended**, needed by some addons, -p is ignored if this option is used).
* `-p 8080:8080` / `-p 4443:4443` - Forward necessary ports to the container
  (ignored if `--network="host"` is present).
* `--log-opt max-size=1m` - limit the log size to 1 MB
* `--log-opt max-file=10` - limit the number of saved log files to 10
* `--name webthings-gateway` - Name of the container.

## Changing ports in `--network="host"` mode

Create a file `local.json` and map it to
`/path/to/shared/data/config/local.json` (where `/path/to/shared/data` is the
volume mounted to `/home/node/.webthings`). Contents of the file:

```json
{
  "ports": {
    "https": 8081,
    "http": 8080
  }
}
```

Edit the ports as you like.

## Using docker-compose

```
docker-compose up -d
```

## Connecting

After running the container, you can connect to it at:
http://&lt;host-ip-address&gt;:8080

## Building

If you'd like to build an image yourself, run the following:

```shell
git clone https://github.com/WebThingsIO/gateway-docker
cd gateway-docker
docker build -t gateway .
docker run \
    -d \
    -e TZ=America/Los_Angeles \
    -v /path/to/shared/data:/home/node/.webthings \
    --network="host" \
    --log-opt max-size=1m \
    --log-opt max-file=10 \
    --name webthings-gateway \
    gateway
```

You can add the following build args:
* `--build-arg "gateway_url=https://github.com/<your-fork>/gateway"`
* `--build-arg "gateway_branch=<your-branch>"`
* `--build-arg "gateway_addon_version=<your-version>"`

## Notes

* If you need to use Zigbee, Z-Wave, or some other add-on which requires
  physically attached hardware, you will have to share your device into your
  container, e.g. `--device /dev/ttyACM0:/dev/ttyACM0`. They will also need to
  be owned by GID 20, which corresponds to the `dialout` group in the
  container. This can be done using udev rules or something else.
* If you need to use GPIO in the container (e.g. on a Raspberry Pi host), you
  will need to either run in privileged mode with `--privileged` or share in
  your sysfs filesystem with `-v /sys:/sys`. The sysfs nodes will also need to
  be owned by GID 997, which corresponds to the `gpio` group in the container.
* If you need to use Bluetooth in the container, you will need to disable BlueZ
  on the host (if running), e.g. `systemctl disable bluetooth`, and you will
  need to run the container in privileged mode, i.e. `--privileged`.
