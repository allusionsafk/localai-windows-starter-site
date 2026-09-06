# AFK AI website support

This repository owns the public AFK AI website and its pinned Friend Beta download route.

## Use this repository for

Open an issue here when the problem is specifically about:

- the website not loading or rendering correctly
- broken navigation or links
- accessibility or responsive-layout problems
- incorrect or unclear website copy
- metadata, sharing previews, robots, or indexing
- `/download` returning the wrong status or failing unexpectedly
- a mismatch between the documented and observed website security headers

Use the issue form that best matches the problem and include only the information needed to reproduce it.

## Product, installer, or runtime support

For AFK AI installation, Windows prerequisites, hardware compatibility, Docker, WSL, Ollama, models, Open WebUI, search, voice, Control Center, or other runtime behaviour, use the main project support surface:

https://github.com/allusionsafk/localai-windows-starter/blob/master/SUPPORT.md

That repository has dedicated installation, hardware, and general bug forms.

## Download problems

The website deliberately serves a pinned Friend Beta installer through `/download` and verifies its SHA-256 before returning the bytes.

If the route fails, report:

- the approximate time of the request
- whether you used `GET` or `HEAD`, if known
- the HTTP status code, if visible
- whether the homepage itself loaded
- whether the failure reproduces in another browser or a private window

Do not post cookies, authentication data, full browser profiles, unrelated diagnostics, or private machine information.

## Security reports

Do not open a public issue for a vulnerability or for material that could help exploit one.

Follow [SECURITY.md](SECURITY.md) for the private reporting path.

## Deployment status

A repository commit is not proof that the live Cloudflare deployment has changed. When reporting a live-site problem, state what you observed on the deployed site and, if relevant, the repository commit or branch you compared it with.
