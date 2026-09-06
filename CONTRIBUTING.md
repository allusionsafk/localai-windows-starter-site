# Contributing to the AFK AI website

This repository is the public website and pinned-download surface for AFK AI for Windows.

Contributions are welcome when they make that surface clearer, safer, more accessible, or easier to verify.

## Keep product and website work separate

Use this repository for:

- landing-page content and presentation
- accessibility and responsive behaviour
- static assets
- the `/download` Worker route
- download-integrity tests
- security headers and Content Security Policy
- website documentation

Use the [AFK AI for Windows repository](https://github.com/allusionsafk/localai-windows-starter) for installer, runtime, model, Docker, Ollama, SearXNG, Open WebUI, hardware, and application-support work.

Do not mix product-runtime changes into a website pull request.

## Before changing the site

1. Establish the current behaviour.
2. Make the smallest coherent change.
3. Preserve the pinned Friend Beta download contract unless the pull request is specifically a reviewed release update.
4. Run the checks that cover the changed surface.
5. Describe only verification that actually ran.

## Local checks

Install dependencies from the lockfile:

```bash
npm ci
```

Run the repository test contract:

```bash
npm test
```

For JavaScript changes, also check syntax:

```bash
node --check worker.js
node --check public/assets/app.js
```

Use `git diff --check` before opening a pull request.

## Public-copy rules

Public copy should be precise and easy to scan.

- Use **AFK AI** as the product name.
- Do not claim that the product is offline-only.
- Distinguish local model inference from setup, downloads, updates, and optional web-search traffic.
- Do not claim deployment until the live deployment has been observed.
- Do not use em dashes in public copy.
- Do not add analytics, trackers, remote fonts, or other third-party page dependencies without explicit review.

## Security and privacy

Do not post credentials, tokens, private documents, chats, prompts, cookies, environment values, or unrelated machine information in issues or pull requests.

Security vulnerabilities should follow [SECURITY.md](SECURITY.md) rather than a public issue.

## Pull requests

A useful pull request explains:

1. the concrete problem
2. what changed
3. what deliberately did not change
4. the checks that actually ran and their results
5. privacy, security, CSP, download, release, or deployment impact
6. known limitations or follow-up work

Keep unrelated cleanup in separate pull requests so each change remains easy to review and roll back.
