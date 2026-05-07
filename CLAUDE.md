# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Violentmonkey userscript for ASSD (AO Hostels booking system). Auto-submits the login form once Bitwarden has filled the credentials, then clicks the post-login navigation links to land in the reservierungen workflow.

## Environment

- Browser userscript (Violentmonkey)
- No build step — edit `assd-login.user.js` directly
- Matches `https://*-*.assd.com/*` (per-house subdomains like `house-xx.assd.com`)
- `@updateURL` / `@downloadURL` point at the GitHub raw URL — Violentmonkey polls these for updates

## Development

No build, test, or lint commands. Load the script in Violentmonkey for manual testing on the live ASSD login flow.

Always bump `@version` in the userscript header before committing. Violentmonkey uses this to offer update prompts via `@updateURL`.

## Conventions

- Consult `../assd-codex/CLAUDE.md` for ASSD DOM patterns and shared selector conventions before making changes.
- All console messages are prefixed `[assd-login]`.
- The script branches on which fields exist in the DOM: if login inputs are present, it polls until Bitwarden fills them then clicks submit; otherwise it assumes post-login and wires up the nav-link clicker.
- Post-login nav order matters: `Tagesübersicht` (`/a_dayview/index`) must be clicked first, then `Reservierung` (`/s_reser/list`) after an 800 ms delay. Earlier attempts with shorter delays or reversed order were unreliable (see commits `0aa8d35`, `19d2844`).
- Click-based navigation is intentional — do not switch to `location.href` assignment without re-testing tab ordering.
- The `MutationObserver` for post-login links sets a `.clicked` flag on the link element to prevent re-clicking, then disconnects itself.
