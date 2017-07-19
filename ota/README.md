# Gateway OTA updater.

This folder contains the package which deals with OTA updates for the gateway. The OTA process includes downloading, extracting and installing : node, build assets, native dependencies and `node_modules`. OTA does not update any of the underlying system libraries.

## Design

The OTA updater is based around a "write ahead log" which keeps track of the current running state of the system, updates, downloads, extraction and installation. The OTA updater is designed around a A/B system. When A is running A will download updates to B and if they apply successfully B is started. If B somehow fails or crashes prior to successfully launching the gateway B will fall back to A after a fixed number of retries (TBD). A/B is used for illustration the underlying design could easily have A/B/C/D/etc.. updates.

### Terms:

Update channel: An update "channel" is simply a base URL in which the `update.json` exists. A channel most likely (TBD) is simply a S3 bucket with a `update.json` in the root.

A/B update: A system with at least one viable version of the software and another which is updated.
Update Source: Initially the system will poll a `update.json` file from a fixed url. That file is periodically updated with information on the latest update for that update channel which the gateway is pointed.

Write ahead log (WAL): Must use "atomic" append only writes. TODO: find link describing how linux kernel does this.

### `update.json`.

This is used for high level illustration we may need additional fields.

`version`: A monotonically increasing number. We use a number rather than a UUID to allow for the underlying update channel to be "eventually consistent" where we may sometimes find a number lower than the current update.

`contentAddressabeURL`: The URL which points to the new update in the format of `<hash of tar>.tar.gz`. By using a hash to address the URL it makes it more difficult to pull off a man in the middle attack (which is still possible even over SSL).

```json
{
  "version": 1,
  "contentAddressableURL": "5dde896887f6754c9b15bfe3a441ae4806df2fde94001311e08bf110622e0bbe.tar.gz"
}
```

### High level operations

#### Downloading

`currentVersion`: The currently installed version running on the gateway. Note this version may or may not be the same as `package.json.version`.

`interval`: The time between fetching for updates. Time TBD but should also include a fuzz factor to avoid common "thundering herd" problems.

`location`: tmp/ like location where we can download and expand the updates. Ideally tmp/ is periodically purged by the OS.

`update.tar`: The specific tar downloaded from the `contentAddressableURL`.

1. Every `interval` fetch `update.json`.
2. If `update.json.version` is > `currentVersion` download `contentAddressableURL` to `location`.
3. Hash the content of the `update.tar.gz`
  a. If hash matches the url (minus the `.tar.gz`) goto Extracting.
  b. If the hash does not match the url log the "checksum" failure into the WAL. Goto 1.

#### Extracting / Booting

NOTE: This is the desired end result but we may take many incremental steps to get here.

`Update X`: A folder in which the complete include the gateway are extracted from the `.tar.gz`.

1. Extract `update.tar.gz` to `update X`.
2. Start the gateway code from `update X` (either in a self check mode or normally booting it on different ports. TBD).
3. Success/Failure
  a. If gateway is successfully launched: Mark `update X` as successful in the WAL and shutdown
  the currently running gateway.

  b. If the gateway fails to start retry N (TBD) times, if it has not started after N times mark `update X` as a failure in the WAL.

#### Other periodic operations and concerns.

- The WAL must not be allowed to grow to an unbounded length. We should recycle the last N entries periodically.

- Updates marked could be retried if we cannot find a newer update after X amount of time.