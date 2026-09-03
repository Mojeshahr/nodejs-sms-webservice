<div align="center">

<a href="https://payam-resan.com">
  <img src=".github/assets/logo.svg" width="64" height="64" alt="Payam Resan">
</a>

<h1>Node.js examples for the Payam Resan SMS web service</h1>

Talk to the <a href="https://payam-resan.com"><b>Payam Resan SMS panel</b></a> from Node.js<br>
One runnable file per API method, with no dependencies

[![API](https://img.shields.io/badge/API-V3-0a7cbd)](https://payam-resan.com)
[![Node](https://img.shields.io/badge/Node-18%2B-339933)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-none-2ea44f)](#quick-start)
[![License](https://img.shields.io/badge/license-MIT-6e7781)](LICENSE)

<a href="README.md">فارسی</a> · <b>English</b>

</div>

<sub>Looking for another language? The same examples exist for the others at
[github.com/Mojeshahr](https://github.com/Mojeshahr).</sub>

---

## Quick start

```bash
git clone https://github.com/Mojeshahr/nodejs-sms-webservice.git
cd nodejs-sms-webservice

export PAYAM_RESAN_API_KEY='123456-XXXXXXXXXXXXXXX'
export PAYAM_RESAN_SENDER='30004040'

node examples/v3/account-info.mjs
```

No `npm install` and no `package.json`. `fetch` has been part of Node since
version 18, and the examples rely on that alone.

Start with `account-info.mjs`. It sends nothing, spends no credit, and if it
answers then both the key and the connection are fine.

## Before sending anything real

There is a sandbox server that answers exactly like production but sends no
message and spends no credit. Swap `V3` for `V3SandBox` in the URL. The one
exception is `TokenList`, which the sandbox does not implement.

## The methods

| Example | Method | What it does |
|---|---|---|
| [account-info.mjs](examples/v3/account-info.mjs) | `AccountInfo` | Credit and active lines |
| [send.mjs](examples/v3/send.mjs) | `Send` | Simple send over `GET` |
| [send-bulk.mjs](examples/v3/send-bulk.mjs) | `SendBulk` | One text to many recipients, with tracking ids |
| [send-multiple.mjs](examples/v3/send-multiple.mjs) | `SendMultiple` | A separate text per recipient |
| [token-list.mjs](examples/v3/token-list.mjs) | `TokenList` | The account's templates |
| [send-token-single.mjs](examples/v3/send-token-single.mjs) | `SendTokenSingle` | Send a template to one number |
| [send-token-single-get.mjs](examples/v3/send-token-single-get.mjs) | `SendTokenSingle` | The same, over `GET` |
| [send-token-multi.mjs](examples/v3/send-token-multi.mjs) | `SendTokenMulti` | One template, many recipients |
| [status-by-id.mjs](examples/v3/status-by-id.mjs) | `StatusById` | Status by the service's id |
| [status-by-user-trace-id.mjs](examples/v3/status-by-user-trace-id.mjs) | `StatusByUserTraceId` | Status by your own id |
| [get-inbox.mjs](examples/v3/get-inbox.mjs) | `GetInbox` | Messages people sent to your lines |

## Why the mjs extension

`.mjs` makes top-level `await` work without a `package.json`, so every file runs
with nothing but `node <file>`.

If your project is CommonJS, wrap the same code in an async function:

```js
async function main() {
  // the example body, unchanged
}

main();
```

## Using this in your own project

Every example is deliberately free of any dependency on this repository, so
copying the file into your project is enough. If you already have an HTTP
client, take only the request body and the response check:

```js
const response = await got.post('https://api.sms-webservice.com/api/V3/SendBulk', {
  json: {
    ApiKey: process.env.PAYAM_RESAN_API_KEY,
    Sender: 30004040,
    Text: 'Your verification code is 123456',
    Recipients: [{ Destination: 9121112222, UserTraceId: 1001 }],
  },
}).json();

if (!response.Success) {
  throw new Error(`SMS not sent: ${response.Error} (code ${response.ErrorCode})`);
}
```

An installable npm package is planned and will be published in its own
repository.

## Four things that will save you time

**Do not read the HTTP status code.** The service answers `200` to everything,
including a wrong key, so `answer.ok` says nothing about success. Decide on the
`Success` field. Every example here does.

**Recipient numbers carry no leading zero.** Use `9121112222`, or
`989121112222` with the country code. A number that does not start with `9` or
`989` returns error code `13`.

**Do not encode the text twice.** In `send.mjs`, `URLSearchParams` already does
it once. Call `encodeURIComponent` beforehand and the message arrives full of
`%D8`.

**Send a unique `UserTraceId` per recipient.** After a timeout it is the only
way to learn whether the message was registered.

## Key safety

The key is a secret. It does not belong in a code repository, in browser
JavaScript, or in a mobile app bundle. It belongs in an environment variable,
which is where every example here reads it from.

If a key leaks, issue a new one from the panel. A deleted key never comes back.

## Layout

| Path | What it holds |
|---|---|
| `examples/v3/` | One self-contained example per service operation |
| `.env.example` | The environment variables the examples read |

The `v3` in the path is deliberate. A new service version means a new
`examples/v<n>/`, with the existing folder left alone.

## Documentation and support

The full guide is at [docs.payam-resan.com](https://docs.payam-resan.com). The
machine-readable OpenAPI description is in
[sms-webservice-spec](https://github.com/Mojeshahr/sms-webservice-spec).

## License

MIT. Full text in [`LICENSE`](LICENSE).
