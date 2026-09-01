# Security policy

Security and privacy reports for the AFK AI website and installer distribution
path use the central AFK AI security policy.

## Report a vulnerability privately

**Private vulnerability reporting:**

https://github.com/allusionsafk/localai-windows-starter/security/advisories/new

**Full AFK AI policy:**

https://github.com/allusionsafk/localai-windows-starter/security/policy

> [!CAUTION]
> Do not publish credentials, private logs, exploit details, tokens, cookies,
> installer secrets, or other sensitive material in a normal GitHub issue.

## Non-security problems

Ordinary website, layout, accessibility, content, or `/download` failures that
contain no sensitive information belong in this repository's structured issue
forms:

https://github.com/allusionsafk/localai-windows-starter-site/issues/new/choose

Installer, hardware, model, Docker, WSL, Ollama, Open WebUI, search, voice, and
Control Center support belongs in the main AFK AI repository:

https://github.com/allusionsafk/localai-windows-starter/issues/new/choose

See [SUPPORT.md](SUPPORT.md) for the full routing boundary.

## Published security contact

The deployed site also publishes:

```text
/.well-known/security.txt
```

That file points to the same central private-reporting policy. Security reports
stay centralized even though ordinary website bugs are triaged here.
