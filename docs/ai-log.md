# AI log

Every time you give an AI tool a significant prompt, add an entry. Three lines each.
"Nothing was wrong" is allowed, but it is rarely true. Your instructor will read this.

## Build 1

- **Specifically used chatgpt for this section **

### Prompt 0: Understanding the project requirements and setup

- **What I asked:** Help me understand the Event Ticketing and Booking Platform capstone requirements, development milestones, user stories and project setup.
- **What came back:** An explanation of the project requirements, the three user roles, the nine development Builds and how to organize my own project folder.
- **What was wrong (or "nothing"):** Some earlier instructions were given without adequately explaining their purpose(in the sense that chat was giving me the code i am to input in my terminal without explaining it significance or what is does ). I requested that every command and code instruction be explained before I use it.

- **USE OF AI IN VSCODE **

### Prompt 1: Understanding Build 1 requirements

- **What I asked:** I asked Copilot to read the milestones, user stories and Build 1 instructions and explain the requirements without generating or modifying code.
- **What came back:** Copilot explained the domain core, required files, booking rules, technologies, Big O concepts and completion criteria.
- **What was wrong (or "nothing"):** Copilot provided a useful overview, but README.md hasn't yet been included in its reading task. This will be added before implementation.

### Prompt 2: Understanding the README

- **What I asked:** I asked Copilot to read README.md and explain its purpose, development instructions, relationship with Build 1 and overlooked requirements.
- **What came back:** Copilot explained the overall project workflow, Git branches, AI documentation requirements, technology requirements, security rules, money handling and project structure.
- **What was wrong:** The README had not been included in the first review of the project instructions.
- **What I changed:** I copied README.md from the original repository into the root of my new project and asked Copilot to review it.

### Prompt 3: Understanding Build 1 implementation requirements

- **What I asked:** I asked Copilot to explain the Domain Core, all Build 1 features, the purpose of each expected file, how the files work together and what I must demonstrate to my lecturer.
- **What came back:** Copilot explained the ticket booking rules, event capacity, cancellations, booking lookup using Map, FIFO waitlists, linked lists, domain errors, ID generation, terminal demonstrations and benchmarking.
- **What was wrong:** The explanation used cents and kobo as examples. Since this project uses Nigerian currency, I must consistently use kobo. I also need to ensure that the required rules have tests, not just a working demonstration.
- **What I changed:** I reviewed the explanation, identified the currency requirement and clarified that testing is part of Build 1 completion.

### Prompt 4: Creating the domain error class

- **What I asked:** I asked Copilot to create `src/domain/errors.js` containing a custom DomainError class.
- **What came back:** Copilot created a class that extends JavaScript's built-in Error class and accepts an error message and error code.
- **What was wrong (or "nothing"):** Nothing was identified during code review.
- **What I changed:** I reviewed the code and confirmed that it provides a reusable way to handle errors in the ticketing system.

### Prompt 5: Creating ID and booking reference generators

- **What I asked:** I asked Copilot to create `src/domain/ids.js` to generate unique IDs and booking references using Node.js built-in crypto.
- **What came back:** Copilot created `newId()` and `newReference()` using `randomUUID()` and `randomBytes()`.
- **What was wrong (or "nothing"):** No issues were identified during code review. Runtime testing is still pending.
- **What I changed:** I reviewed the implementation and confirmed that it avoids using Math.random().

### Prompt 6: Creating the FIFO waitlist queue

- **What I asked:** I asked Copilot to create `src/domain/waitlistQueue.js` using a linked-list structure.
- **What came back:** Copilot created a WaitlistQueue class with enqueue, dequeue, peek and size operations.
- **What was wrong (or "nothing"):** Nothing was identified during code review. Runtime testing is still pending.
What I changed: I reviewed the implementation and confirmed that it follows FIFO order and does not use Array.shift().

### Prompt 7: Creating and correcting the inventory system

What I asked: I asked Copilot to create src/domain/inventory.js to manage events, ticket tiers, bookings, cancellations and waitlists.

What came back: Copilot created functions for creating the store, creating events, adding ticket tiers, booking tickets, finding bookings, cancelling bookings and joining waitlists.

What was wrong: The first implementation used Number.isInteger() instead of Number.isSafeInteger() for integer validation. It also contained an unused waitlist.peek() call inside cancelBooking(). The first correction response did not actually make these changes.

What I changed: I requested the corrections again, checked the returned code and confirmed that both integer validation functions now use Number.isSafeInteger() and the unused waitlist.peek() call was removed from cancelBooking().

### Prompt 8: Creating package.json

What I asked: I asked Copilot to create a package.json file in the project root with the required project information and npm scripts.

What came back: Copilot created package.json with the project name, version, ES module configuration and demo, benchmark and test scripts.

What was wrong (or "nothing"): Nothing was identified during review. The scripts have not yet been tested.

What I changed: I reviewed the file and confirmed that no external dependencies were added and no other files were changed.
### Prompt 9: Creating and running the ticket booking demonstration

- **What I asked:** I asked Copilot to create `scripts/demo.js` to demonstrate event creation, ticket sales, overselling prevention, waitlist management and booking cancellation.
- **What came back:** Copilot created a demonstration script using the existing domain functions.
- **What was wrong (or "nothing"):** No issues were identified during the initial code review or demonstration run.
- **What I changed:** I reviewed the script, checked my Node.js version (v24.22.1) and ran `npm run demo`. The demonstration completed successfully and displayed the expected results.

### Prompt 10: Creating and running the lookup benchmark

- **What I asked:** I asked Copilot to create a benchmark comparing `Map.get()` and `Array.find()` using 100,000 sample bookings.
- **What came back:** Copilot created `scripts/benchmark-lookup.js`, which measures both lookup methods using Node.js performance tools.
- **What was wrong (or "nothing"):** The lookup count remained at 10,000 instead of the planned 500. However, the benchmark completed successfully.
- **What I changed:** I reviewed the benchmark and ran `npm run benchmark`. The results showed that `Map.get()` took 0.285 ms, while `Array.find()` took 9,327.421 ms. Both methods found the same booking reference.
### Prompt 11: Creating and running automated tests

- **What I asked:** I asked Copilot to create automated tests for the booking, cancellation, inventory and waitlist rules using Node.js's built-in test tools.
- **What came back:** Copilot created `test/inventory.test.js` containing 14 automated tests.
- **What was wrong (or "nothing"):** The initial failed-booking test caught any error instead of checking specifically for a `SOLD_OUT` error. I requested a correction.
- **What I changed:** I reviewed the tests, corrected the failed-booking test to check the expected error, and ran `npm test`. All 14 tests passed with zero failures.
### Prompt 12: Improving the demo and expanding automated tests

- **What I asked:** I asked Copilot to update the demo to demonstrate booking-reference lookup and add four edge-case tests.
- **What came back:** Copilot updated `scripts/demo.js` and added four tests to `test/inventory.test.js`.
- **What was wrong (or "nothing"):** The original demo did not explicitly demonstrate finding a booking by reference. Some booking quantity and waitlist edge cases were also missing from the tests.
- **What I changed:** I reviewed the changes, ran `npm run demo`, and ran `npm test`. The demo completed successfully and all 18 automated tests passed.
### Prompt 13: Correcting benchmark documentation

- **What I asked:** I asked Copilot to compare the benchmark instructions in `README.md` with the actual benchmark script.
- **What came back:** Copilot updated the README to reflect the script's 100,000 bookings and 10,000 repeated lookups.
- **What was wrong (or "nothing"):** The README previously described 500 lookups and referred to an outdated variable name.
- **What I changed:** I reviewed the update and confirmed that only `README.md` was modified.
## Build 2

### Prompt 1: Build 2 prompt (docs/build-2.md)

- **What I asked:**
- **What came back:**
- **What was wrong (or "nothing"):**

### Prompt 2:

- **What I asked:**
- **What came back:**
- **What was wrong (or "nothing"):**

## Build 3

### Prompt 1: Build 3 prompt (docs/build-3.md)

- **What I asked:** Add the architecture diagrams, booking state machine, Node HTTP router/server, configuration, startup script, and tests.
- **What came back:** A layered architecture document, explicit booking transitions, static-file HTTP server, `/health` route, startup configuration, and `node:test` coverage.
- **What was wrong (or "nothing"):** The first server draft relied on an implicit response/request property for HEAD handling and had redundant error-status logic; both were simplified. Added a regression test proving static requests cannot escape `public/`.

## Build 4

### Prompt 1: Build 4 prompt (docs/build-4.md)

- **What I asked:** The Build 4 prompt: an in-memory repository, event and booking services, a mock payment gateway, the API routes, `docs/api-examples.md` and API tests that start the real server.
- **What came back:** `src/repositories/memory.js`, `src/services/eventService.js`, `src/services/bookingService.js`, `src/lib/mockPaymentGateway.js`, `src/http/routes.js`, wiring in `src/server.js`, an error-code-to-status map in `src/http/app.js`, `docs/api-examples.md` and `test/api.test.js`.
- **What was wrong (or "nothing"):** In the Build 3 code, every DomainError came back as 400, so `SOLD_OUT` and `NOT_FOUND` would have had the wrong status; added one code-to-status map in `app.js`. The validation helpers lived privately inside `inventory.js`, so reusing them meant moving them to `src/domain/validation.js` rather than copying. Known gap left on purpose: two bookings at the same moment can both take the last seat (Build 5). _(My own review: add what you find when you read the code.)_
- **Rules I was unsure about:** whether `venue` is required (kept optional, as in Build 2); whether a stranger paying someone else's booking should get 403 or 404 (chose 403 `FORBIDDEN`); added `unpublish`, `GET /api/events/:id` and `GET /api/bookings/:reference`, which the prompt did not list but S04 and the curl examples need.

## Build 5

### Prompt 1: move to SQLite and reproduce the problem (docs/build-5.md)

- **What I asked:** `src/db/schema.sql` and `src/db/connection.js` on `node:sqlite`, a SQLite repository with the same methods as `memory.js`, `scripts/seed.js`, and `scripts/oversell-demo.js` firing 50 bookings at the last seat with `Promise.all`.
- **What came back:** The schema (users, events, ticket_tiers, bookings with PRIMARY KEY, FOREIGN KEY, UNIQUE and CHECK, including `CHECK (sold >= 0 AND sold <= capacity)`), `src/repositories/sqlite.js` with prepared `?` statements, the seed and oversell scripts, and `seed`/`oversell` in `package.json`.
- **What was wrong (or "nothing"):** The CHECK on `sold` did **not** catch the bug: every racing request saved `sold = 9 + 1 = 10`, so the column looked right while 50 bookings existed for 1 seat (a lost update). The demo had to count rows in `bookings`, not just read `sold`. SQLite also ignores FOREIGN KEY unless `PRAGMA foreign_keys = ON` is set on every connection. There is no signup yet, so bookings would fail their FOREIGN KEY on `users`; the repository inserts a bare user row the first time an id is seen (`INSERT OR IGNORE`).
- **Rules I was unsure about:** whether `users` should exist before Build 7 (kept it, with name, email and role empty for now).

### Prompt 2: fix it

- **What I asked:** Reserve seats with one atomic UPDATE and use the changed-row count; add `test/oversell.test.js`; show the demo before and after.
- **What came back:** `reserveSeats` and `releaseSeats` in both repositories, `bookingService.book` using `reserveSeats` instead of read-check-write, `cancel` using `releaseSeats`, and the oversell test. Demo before: 50 succeeded, 59 bookings for 10 seats. After: 1 succeeded, 49 `SOLD_OUT`, 10 bookings for 10 seats.
- **Why a lock variable or a second check does not work:** A second check reads the same stale number, because every request can read before any of them writes; checking twice only makes the gap smaller, not gone. A lock variable lives in one Node process, so a second server process (or a script writing to the same database) never sees it, and a forgotten unlock after an error blocks every later booking.
- **What was wrong (or "nothing"):** If saving the booking failed after the seat was taken, the seat stayed taken forever; added a `releaseSeats` in a `catch`. I checked that the test fails without the fix by putting the Build 4 lines back: all 4 oversell tests failed, then passed again with the fix. Known gap for Build 8: two cancel requests at the same moment could both pass the status check (refunds must release seats exactly once).
