# Phase 0 Research: Task List API

All Technical Context fields were already fully determined by the project constitution, so
this research documents *why* each choice was made rather than resolving open unknowns.

## Decision: Express.js for routing

**Rationale**: The constitution (Principle V) mandates vanilla JavaScript with Express as
the only runtime dependency. Express is widely recognized, so a reader unfamiliar with this
specific demo can still follow the routing code at a glance.

**Alternatives considered**:
- Raw Node.js `http` module — too low-level; routing/parsing boilerplate would obscure the
  API design decisions the demo is meant to highlight.
- Fastify or Koa — comparable simplicity, but less universally recognized than Express,
  adding friction for a "walk through it cold" audience.

## Decision: In-memory store isolated in its own module

**Rationale**: The Demo Scope Constraints rule out persistence. Isolating state behind a
small `store.js` module (rather than mutating a variable inline in route handlers) gives
the plan a genuine, if small, "where does state live" decision to document — directly
serving the goal of showing spec-kit reasoning about architecture, not just endpoints.

**Alternatives considered**:
- A JSON file written to disk — adds a persistence concern the spec explicitly excludes.
- A real database (SQLite/Postgres) — violates Principle II (Illustrative, Not Production)
  and Principle V (Minimal Dependencies) for a four-operation demo.

## Decision: Incrementing integer counter for task ids

**Rationale**: Simplest possible unique-id strategy; needs no extra dependency and is easy
for a reader to reason about ("the next task gets the next number").

**Alternatives considered**:
- `uuid` package — an extra dependency with no teaching value for this scope.
- Timestamp-based ids — could collide under rapid successive requests and are harder to
  read in example output than small integers.

## Decision: No automated test framework

**Rationale**: Principle V explicitly excludes adding a test framework as a dependency for
this illustrative demo. Correctness is instead demonstrated through `quickstart.md`, which
gives a reader runnable `curl` commands and expected output for each of the four
operations.

**Alternatives considered**:
- Jest/Mocha + supertest — standard practice for a real API, but disproportionate ceremony
  for four endpoints in a teaching repo, and against the constitution's explicit scope.

**Output**: No NEEDS CLARIFICATION markers remain; all Technical Context fields are resolved.
