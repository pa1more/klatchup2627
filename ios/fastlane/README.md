fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios archive

```sh
[bundle exec] fastlane ios archive
```

Clean archive and export App Store IPA (bumps build number by default)

### ios upload

```sh
[bundle exec] fastlane ios upload
```

Upload the exported IPA to TestFlight (uses App Store credentials from keychain)

### ios release

```sh
[bundle exec] fastlane ios release
```

Archive, export, and upload to TestFlight in one shot

### ios upload_skip_dsym_validation

```sh
[bundle exec] fastlane ios upload_skip_dsym_validation
```

Upload to TestFlight with dSYM validation disabled (Hermes workaround)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
