# Working with this repository

You are looking at runnable Node.js examples for the **Payam Resan** SMS web
service (`www.payam-resan.com`, API V3), an Iranian SMS provider. Someone is
probably asking you to add SMS to their project.

Copy the example that matches the method, adapt it, and keep the rules below.
They are not style preferences — each one is a bug that this service produces if
you ignore it.

## Start here

```bash
export PAYAM_RESAN_API_KEY='123456-XXXXXXXXXXXXXXX'
node examples/v3/account-info.mjs
```

`account-info.mjs` sends nothing, spends no credit, and answers even on a zero
balance, so run it first to prove the key and the connection work.

Node 18 or newer, where `fetch` became global. No `npm install`, no
`package.json`, no dependency of any kind — a copied file works on its own.

On Node 20 and up, `node --env-file=.env examples/v3/account-info.mjs` loads the
environment for you.

## Rule 1: inspect the HTTP status and `Success`

Normal V3 operations return `200`; the GET and POST `SendTokenSingleConcatParam`
operations also document `429` and `default` responses. A non-2xx response may not
have the normal envelope. `answer.ok` alone does not establish API success;
inspect `Success` when an envelope is present.

```js
const response = await answer.json();

if (!response.Success) {
  console.error(`ناموفق. کد ${response.ErrorCode}: ${response.Error}`);
  process.exit(1);
}
```

`ErrorCode` is only meaningful when `Success` is false.

For example, a URL that does not exist answers
`404` with a body carrying only `Message`. That is a wrong address, not a failed
call — so if `Success` is missing entirely rather than false, check the URL
before checking the account.

## Rule 2: the key never leaves the server

`process.env.PAYAM_RESAN_API_KEY`. Never write it into source, and never let it
reach the browser — including through a bundler prefix like `NEXT_PUBLIC_`,
`VITE_` or `REACT_APP_`, which inlines the value into the client bundle where
`View Source` will find it.

If the user's code runs in a browser or an Electron renderer, this repository is
the right half of the design and the client must call **their** Node endpoint,
which calls this. The service sends no CORS headers, so a direct call from a
page is blocked by the browser anyway.

Avoid `send.mjs` and `send-token-single-get.mjs` in production. Those are the
`GET` methods, where the key sits in the URL and lands in the web server log and
the `Referer` header.

## Rule 3: every request gets a timeout

All thirteen examples pass one, and a request without it can hang forever:

```js
const answer = await fetch(url, { signal: AbortSignal.timeout(30_000) });
```

A timeout is an *unclear* outcome, not a failure — see Rule 6 before you retry.

## Rule 4: pick the right method

| The user wants | Use | File |
|---|---|---|
| one text to many people | `SendBulk` | `send-bulk.mjs` |
| a different text per person | `SendMultiple` | `send-multiple.mjs` |
| a template with semicolon parameters | `SendTokenSingleConcatParam` | `send-token-single-concat-param.mjs` |
| a one-time password or code | `SendTokenSingle` | `send-token-single.mjs` |
| a template to many people | `SendTokenMulti` | `send-token-multi.mjs` |
| delivery status | `StatusByUserTraceId` | `status-by-user-trace-id.mjs` |
| balance and sender lines | `AccountInfo` | `account-info.mjs` |

**A one-time password goes through a template**, not free text — that is the
usual route for OTP, and the template fixes the sender line, which is why
`SendTokenSingle` takes no `Sender`. `token-list.mjs` lists the account's
templates; `Status === 2` means approved and sendable, `1` awaiting review, `3`
rejected.

## Rule 5: phone numbers have no leading zero

The service wants `9121112222` or `989121112222`. Users type `09121112222` or
`+989121112222`. Normalise before sending, or you get error `13`.

Ninety-nine recipients per request is the ceiling for `SendBulk`,
`SendMultiple` and `SendTokenMulti`.

Let `URLSearchParams` encode the query exactly once. Call `encodeURIComponent`
on the text beforehand as well and the message arrives full of `%D8`.

## Rule 6: always send a `UserTraceId`

Use the user's own database id. After a timeout or error `100`, resending blind
may send twice — `StatusByUserTraceId` is the only safe way to learn whether the
message was registered. `StatusCode === 8` there means the id is not in the
account, so it is safe to send again.

`SendTokenSingle` is the exception: it has no such input, so its `UserTraceId`
comes back null. If a trace id is needed for an OTP, use `SendTokenMulti` with a
single recipient.

## Rule 7: know which errors are worth retrying

These never succeed on retry — fix the cause; retrying only burns the rate limit
until the account hits error `20`:

`1`, `2`, `3`, `6`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `19`

`19` is an empty balance; `10` means the caller's IP is not on the account's
allowlist. Treat any unknown code the way you treat `100`: unclear outcome,
check with `StatusByUserTraceId` before resending.

## Rule 8: delivery status is a poll, not a callback

Status codes `0`, `1`, `2`, `3` and `10` mean still in flight — query again
later, and not more often than every few minutes or you will hit error `20`.
Everything else is final. Branch on `StatusCode`, never on the `Status` text,
which is Persian prose meant for humans and can change.

## Rule 9: `GetInbox` consumes what it returns

Each `GetInbox` call retrieves the entire current inbox and permanently removes
the returned messages. A later call cannot retrieve them again. Never wire it to a route
handler: every request consumes unread messages permanently. It belongs in a
scheduled job that writes straight to storage.

The sender field is called `Form`, not `From`. That is the service's spelling,
not a typo in the example.

## A note on message ids

They are plain numbers here, and that is correct: the ids this service issues
are around fifteen digits, well inside `Number.MAX_SAFE_INTEGER`
(`9007199254740991`). No `BigInt` and no string parsing is needed. Do not do
arithmetic on them and do not store them in a column that rounds — pass them
through unchanged.

## Why `.mjs`, and CommonJS

The extension makes top-level `await` work without a `package.json`, so each
file runs with nothing but `node <file>`, and a copied file is safe to drop into
a CommonJS project.

If the user's project is CommonJS, wrap the body unchanged:

```js
async function main() {
  // the example body, untouched
}

main();
```

## Testing without spending credit

Replace `V3` with `V3SandBox` in the URL. No message is sent and no credit is
spent. `TokenList` returns mock templates there; use production for the account's
real templates.

The sandbox is a simulator, not a mirror of the account: credit is always
`1234567`, sender lines are invented, and **it accepts any key**. Success there
proves nothing about the user's real key.

## Related repositories

- TypeScript, with the response envelope typed as a discriminated union:
  [typescript-sms-webservice](https://github.com/Mojeshahr/typescript-sms-webservice)
- An installable npm package is planned and will live in its own repository.

## Where the authoritative answers are

- Method reference and error tables: <https://docs.payam-resan.com>
- Machine-readable OpenAPI: <https://github.com/Mojeshahr/sms-webservice-spec>

If the spec and these examples ever disagree, the spec wins — report it as a bug
rather than guessing.
