# Review ledgers

`slice-review-gate` ledgers whose reviewed range no single `change.md` covered, so they had no
change folder to be archived inside. They were written to `.review-gate/<branch-slug>.md`, which is
gitignored — no git-based process ever saw them, which is how eleven accumulated before the first
sweep on 2026-09-22.

Named `<gate-date>-<slug>.md`, where the date is the gate's own, not the sweep's. Each is trimmed
the way `/10x-archive` trims a change's `review-gate.md`: every `fixed` finding removed, because its
durable record is the commit that fixed it. What survives is what was looked at and deliberately
*not* changed. These originals were untracked, so unlike an in-folder ledger the removed findings
are not recoverable from git — only the commits that made the fixes remain.

Read-only by convention.
