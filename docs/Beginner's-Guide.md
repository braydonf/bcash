## Introduction

Bcash is an _alternative_ implementation of the bitcoin protocol, written in node.js. It is a full node which can be used for full blockchain validation and is aware of all known consensus rules.

## Requirements

- Linux, OSX, or Windows (\*) (\*\*)
- node.js >=v8.14.0
- npm >=v6.4.1
- python2 (for node-gyp)
- gcc/g++ (for leveldb and secp256k1)
- git (optional, see below)

(\*): Note that bcash works best with unix-like OSes, and has not yet been thoroughly tested on windows.

(\*\*): The BSDs and Solaris have also not been tested yet, but should work in theory.

## Build & Install

Bcash is meant to be installed via git for security purposes, as there are security issues when installing via npm. All tagged commits for releases should be signed by @nodar-chkuaselidze's or @tuxcanfly's [PGP Key](#maintainer-public-keys). Signed copies of node.js are available from [nodejs.org][node], or from your respective OS's package repositories.

### Installing via Git

``` bash
$ git clone git://github.com/bcoin-org/bcash.git
$ cd bcash
```

For a specific release:
```
$ git tag
$ git tag -v <version> # verify signature
$ git checkout <version>
```

Install dependencies:
```
$ npm install
$ npm install -g # link globally
```

**Note:** Dependencies are checked for integrity using `package-lock.json`. However `npm` _will not_ make these checks with `npm install -g` and it will link your installation globally so that `bcash` is in your path _(e.g. $ bcash)_.


### Installing via Docker

Check [bcash-docker](https://github.com/bcoin-org/bcash-docker)

### Installing on Windows

Install OpenSSL v1.0.2L 64-Bit:

https://slproweb.com/download/Win64OpenSSL-1_0_2L.exe

As Administrator, open `cmd.exe` and run:

```console
C:\Users\bcash\bcash>npm install --global --production windows-build-tools
```

to install `VCBuild.exe` and `Python 2.7.x` both required by `node-gyp`
for building native modules.

Then continue [Installing via Git](#installing-via-git)

Note that you need a shell that supports bash scripts, like Git Bash to launch
bcash.

### Troubleshooting

If the build fails compilation for `bcash-native` or `secp256k1-node` __validation will be slow__ (a block verification which should take 1 second on consumer grade hardware may take up to 15 seconds). Bcash will throw a warning on boot if it detects a build failure. If you run into this issue, please post an issue on the repo.

## Starting up your first bcash node

If bcash is installed globally, `$ bcash` should be in your PATH. If not, the bcash bootstrap script resides in `/path/to/bcash/bin/bcash`.

``` bash
$ bcash
```

Will run a bcash node as the foreground process, displaying all debug logs.

To run as a daemon:

``` bash
$ bcash --daemon
```

This will start up a full node, complete with: a blockchain, mempool, miner, p2p server, wallet server, and an HTTP REST+RPC server.

All logs will be written to `~/.bcash/debug.log` by default.

By default, the http server will only listen on `127.0.0.1:8332`. No auth will be required if an API key was not passed in. If you listen on any other host, auth will be required and an API key will be auto-generated if one was not passed in.

## Listening Externally

To listen publicly on the HTTP server, `--http-host=0.0.0.0` (ipv4) or `--http-host=::` (ipv4 and ipv6) can be passed. Additionally this: `--http-port=1337` can set the port.

To advertise your node on the P2P network `--public-host=[your-public-ip]` and `--public-port=[your-public-port]` may be passed.

## Using an API Key

If listening publicly on the HTTP server, an API key is required. One will be generated and reported in the logs automatically if no key was chosen. An api key can be chosen with the `--api-key` option.

Example:

``` bash
$ bcash --http-host=0.0.0.0 --api-key hunter2 --daemon
```

API keys are used with HTTP Basic Auth:

``` bash
$ curl http://x:hunter2@localhost:8332/
```

Bcash CLI is the prepackaged tool for hitting both the REST and RPC api.

``` bash
$ bcash cli info --api-key hunter2
$ bcash rpc getblockchaininfo --api-key hunter2
```

## Using Tor/SOCKS

Bcash has native support for SOCKS proxies, and will accept a `--proxy` option in the format of `--proxy=[user]:[pass]@host:port`.

Passing the `--onion` option tells bcash that the SOCKS proxy is a Tor socks proxy, and will enable Tor resolution for DNS lookups, as well as try to connect to `.onion` addresses found on the P2P network.

``` bash
$ bcash --proxy joe:hunter2@127.0.0.1:9050 --onion
```

### Running bcash as a tor hidden service

Your hidden service must first be configured with `tor`. Once you have the `.onion` address, it can be passed into `--public-host` in the form of `--public-host foo.onion`.

## Target Nodes

It's often desirable to run behind several trusted bitcoin nodes. To select permanent nodes to connect to, the `--nodes` option is available:

``` bash
$ bcash --nodes foo.example.com:8333,1.2.3.4:8333,5.6.7.8:8333
```

If chosen, bcash will _always_ try to connect to these nodes as outbound peers. They are top priority and whitelisted (not susceptible to permanent bans, only disconnections).

To _only_ connect to these nodes. `--max-outbound` could be set to 3:

``` bash
$ bcash --nodes foo.example.com,1.2.3.4,5.6.7.8 --max-outbound 3
```

## Disabling Listening

To avoid accepting connections on the P2P network altogether, `--listen=false` can be passed to bcash.

### Selfish Mode

Bcash also supports a "selfish" mode. In this mode, bcash still has full blockchain and mempool validation, but network services are disabled: it will not relay transactions or serve blocks to anyone.

``` bash
$ bcash --selfish --listen=false
```

Note: Selfish mode is not recommended. We encourage you to _help_ the network by relaying transactions and blocks. At the same time, selfish mode does have its uses if you do not have the bandwidth to spare, or if you're absolutely worried about potential DoS attacks.

## Further Configuration

See [Configuration][configuration].


## Maintainer Public Keys

@nodar-chkuaselidze
- keybase: https://keybase.io/nodech
- github: https://github.com/nodar-chkuaselidze

```
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=kxhO
-----END PGP PUBLIC KEY BLOCK-----
```

@tuxcanfly
- github: https://github.com/tuxcanfly/

```
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBFEnqhwBCADPdVCVmbmUZdLp+qmgSdFU3ttrskOguIZgTp0uK+BlfjxraVgX
5erI+SLCTFPVYKbIL+kwvpFucr18+B6imxjzZ5v9VpHNO58bj1yPVYe+Yr0twkEK
I56leMjthqjwuau96fksg6y/Ys0MjNLvfgiU3e2dM+eJCjEZeBeR8j+afqBjvQPR
/pWTcPBswjuhtlLes+iEcjsnJED5nyFNA0nx4iEDuejNLAPplKS0R90sOh1PueP5
vah9qsqRw9R9hXacBObiuDBt7snlRmdkIaCW7nTiylfYRYGxsdseH9nUS2naor3R
/G99cBc/SlBYVVRXIjCJCrcv52LzZ7z01HbTABEBAAG0P0phdmVkIEtoYW4gKFBH
UCBrZXkgZm9yIG15IHByaXZhdGUgZmlsZXMpIDx0dXhjYW5mbHlAZ21haWwuY29t
PokBOAQTAQIAIgUCUSeqHAIbAwYLCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ
fjF0W5BFhOb+cggAtDv9jZkS09cq73gH9bMRUIat2D0ssHcZPQKPo+F1qEyO8ozS
yw7SWTYO4IauE61h8VNk/eVbzW+Hw+qMQHtCXV6B9ITkYN3WSWXVXb7XgUJ9HalH
Tk1SksnqpTI1yvCNgp6U3EWMT9G+qtEeTdOCZVHAi8NDz+3tMsm0/WK88EQeXY01
J/QN9y7AsDBlcJbQJGFJpQRJGDNDWAKPiroqDytifgJhGbHu4c6wQCGkXkwzrptF
vOMThsPNv9vGbwFN5OPWM4+f3Rc7HVASFjXsvPn3WrpW7l1Rs8lsKe7AJbo75gdZ
5roUL1syII/IdOmsl4G9FjXbW48kwLp38+ooSbkBDQRRJ6ocAQgA2l//Yh3HmbdU
HjHC6sqeV80jHG24LfZKPmos0SmYpdxiEX44MLp0dD+RtOH0b8vtPgscz3cArFwf
pdZBnym+kO0a/7BV3PsJQmpWDh9KEUOA8QgAtPpJKR5MYCSrQclcEHfkojKR4KYU
6bgtRRIo0QF66VZm6LMcTeF1LmhMM0GZ7t2dPFl8HflGmoKgd8s38D0Fqv94Jvz9
JwsGxD2waO8D0B+wdmIUQjLfjuA3z+LLwlSKmOoCawREJmz2JwbA/D3F+ZnF3sbu
4wTXJkFTRrrVKQxXx2/tVVh6M4Nh3AViUbv6M/+bAkcgKYsNeq2ADyRHh4cGmiMv
xMXlWRTXuwARAQABiQEfBBgBAgAJBQJRJ6ocAhsMAAoJEH4xdFuQRYTmOJYH/jwu
y5c/gjsoTm5H98Sk7NeIMLYYbIiqLf4ZdwhPBduV5otJozG9uoBN+e7GOPue/VP6
kfakbUE64lfb2WjIVdIkhOUcUyvmHpTmhKzUq2pi7gR58l/14ujclzi5RMIkpXrN
gcQbYWC1WNDwMn0SaMjiwV5YwMiVPF5HSu+KeJRM4znqZLcYfjODtg2ERYZJREnT
JeQeYKw/7fgEfqBGwNQDKkUDd6IXT5JJN51qFS2Ld3hVmq/hDgqO7GZXRVh8T3Ju
2sD1g8ku4C7ZNG3e+WoFPJVap7VldKoOPXlvyFyTt3buERBsABG2BoRRALYxF8g1
S2FVPXj8KIZQI+sj6Tw=
=uY1+
-----END PGP PUBLIC KEY BLOCK-----
```

[node]: https://nodejs.org/dist/v7.5.0/
[configuration]: Configuration.md
