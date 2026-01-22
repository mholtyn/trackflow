# Trackflow
Trackflow is a B2B platform for managing music demo submissions as structured, event-driven workflows, instead of email threads and links.

## The problem
### For producers
Submitting demos to labels is often a one-sided process. Tracks are sent via email or third-party platforms, with no visibility into whether they were reviewed, ignored, or rejected. Producers are left manually tracking submissions across inboxes, SoundCloud links, and spreadsheets.

### For labels
Labels receive demos in inconsistent formats, across multiple platforms, often missing essential metadata such as genre, tempo, or key. Managing reviews, decisions, and release planning becomes fragmented and difficult to scale.

## The core idea
Trackflow treats a demo submission as a stateful process with an immutable history, not as a mutable record.

Instead of overwriting data or relying on email replies:
- each submission moves through a strict state workflow
- every state transition produces an immutable submission event
- both producers and labels can observe the full lifecycle of a submission over time

This makes demo handling transparent, auditable, and predictable for all parties involved.


## What Trackflow is not (yet)
At the current MVP stage, Trackflow is intentionally minimal.

- it is not a social network or messaging platform,
- it does not attempt to replace audio hosting services,
- it focuses on submission flow, not promotion or discovery,
- it does not offer comments or real-time chatting,
- it does not have advanced filtering algorithms,
- there is no anti-ghosting mechanisms.


#### Last update: 22/01/2026
#### Document version: v1.0