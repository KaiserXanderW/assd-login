## 2026-05-07 — Reduce page strain & add CLAUDE.md

╭─────────────────────────────────────────────╮
│ Duration:       8m                          │
│ Tool calls:     28 (✓24 ✗4)                 │
│ Files modified: 7                           │
│ Tokens in:      0K fresh                    │
│                 170K cache write            │
│                 1.8M cache read             │
│ Tokens out:     14K                         │
╰─────────────────────────────────────────────╯

**Built / changed** `#userscript` `#perf`
- Bumped `assd-login.user.js` to 1.0.3.
- Added `sessionStorage` short-circuit (`assd-login-done` + `assd-nav-done`) so the script no-ops on subsequent navigations within an already-logged-in tab. New tabs start fresh because sessionStorage is per-tab.
- Capped Bitwarden-fill polling at 30 attempts (was unbounded — would poll forever on a stalled login).
- Added 15s timeout on the post-login `MutationObserver` so it disconnects if the nav links never both appear together.
- Replaced `tagesLink.clicked` DOM property pollution with a module-scoped `navClicked` boolean.
- Wrote initial CLAUDE.md following the `assd-autofill` template — captures the per-house `*-*.assd.com` match pattern, the load-bearing 800ms nav-click ordering, and the "version bump before commit" rule.

**Files** `#userscript`
- Created: `CLAUDE.md` — project guidance for future sessions
- Created: `sessions/2026-05-07-reduce-page-strain-and-add-claudemd.md` — this entry
- Created: `JOURNAL.md` — index
- Created: `todos.md` — empty open list
- Modified: `assd-login.user.js` — see above

**Commits pushed**
- `8bc2c2c` Add CLAUDE.md
- `129146c` Reduce page strain: cap polling, time out observer, skip on re-entry

**Known issues**
- Repo `KaiserXanderW/assd-login` is private (raw URL returns 404). User must flip to public via GitHub web UI before Violentmonkey can fetch the 1.0.3 update.
- `gh` CLI not installed on this host — couldn't flip visibility from here.
