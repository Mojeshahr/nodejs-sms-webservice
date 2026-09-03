# Agent guide

Runnable Node.js examples for the Payam Resan SMS web service. One file per API
method, and every file has to work on its own.

## Rule one: no dependencies

An example runs with a stock Node and nothing else. `fetch` has been global
since Node 18, so there is no `axios`, no `node-fetch`, and no `package.json`
to install. A reader copies the file into their project and it works.

The same rule rules out helpers from this repository. There is no shared client
module here and there should not be one: a function defined in `utils/` means
nothing to somebody reading the file on the documentation site.

Files are `.mjs` on purpose. That makes top-level `await` work without a
`package.json`, and it keeps a copied file safe to drop into a CommonJS project.

## Rule two: the examples are the documentation

Each file carries `// docs:start` and `// docs:end`. The region between them is
lifted verbatim into the method's page on docs.payam-resan.com, so it is read by
people who have never seen this repository.

Two consequences:

- **Full-line comments are stripped** when the region is lifted. Anything the
  reader must see has to be code. The `Success` check is an `if`, not a note.
- The file name matches the reference page slug exactly: `send-bulk.mjs`,
  `status-by-user-trace-id.mjs`. A path with two variants gets two files, the
  plain name for `POST` and a `-get` suffix for `GET`.

The full contract lives in the `handbook` repository, section `docs-site`, file
`code-samples.md`.

## Rule three: check Success, never the status code

The service answers `200` to everything, including a wrong key and an empty
account. An example that reads `answer.ok` teaches the wrong thing and gets
copied into somebody's production code.

```js
if (!response.Success) {
  console.error(`ناموفق. کد ${response.ErrorCode}: ${response.Error}`);
  process.exit(1);
}
```

The one place this does not hold is a URL that does not exist: the sandbox
answers `404` with a body carrying only `Message`. That is a wrong address, not
a failed call.

## Rule four: a version is a folder

A new service version means a new `examples/v<n>/`. No file inside an existing
version folder is moved or renamed; older versions still have users.

## Secrets

The key comes from `PAYAM_RESAN_API_KEY` in the environment. No key, no real
phone number and no customer name goes into a file here, not even a dead one.
Example numbers are `9121112222` upward and the example key is
`123456-XXXXXXXXXXXXXXX`.

## Layout

| Path | What it holds |
|---|---|
| `examples/v3/` | one self-contained file per service operation |
| `.env.example` | the environment variables the examples read |

## Before every commit

```bash
for f in examples/v3/*.mjs; do node --check "$f" || echo "FAILED $f"; done
```

## Git

Semantic messages, `type(scope): subject`, with no explanatory body and no
attribution trailer. Commits here are authored as Payam Resan.
