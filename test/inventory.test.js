import test from "node:test";
import assert from "node:assert/strict";

import { DomainError } from "../src/domain/errors.js";
import {
  addTier,
  bookTickets,
  cancelBooking,
  createEvent,
  createStore,
  findBookingByReference,
  joinWaitlist,
} from "../src/domain/inventory.js";

function createTestStore() {
  const store = createStore();
  const event = createEvent(store, {
    title: "Lagos Tech Conference",
    city: "Lagos",
    venue: "Convention Centre",
    date: "2026-12-10",
  });
  const tier = addTier(store, event.id, {
    name: "General Admission",
    priceKobo: 500000,
    capacity: 3,
  });

  return { store, event, tier };
}

test("creates an empty store and a new event", () => {
  const store = createStore();

  assert.equal(store.events.size, 0);
  assert.equal(store.bookingsByReference.size, 0);

  const event = createEvent(store, {
    title: "Lagos Tech Conference",
    city: "Lagos",
    venue: "Convention Centre",
    date: "2026-12-10",
  });

  assert.equal(event.title, "Lagos Tech Conference");
  assert.equal(event.city, "Lagos");
  assert.equal(event.venue, "Convention Centre");
  assert.equal(event.date, "2026-12-10");
  assert.equal(event.tiers instanceof Map, true);
  assert.equal(store.events.get(event.id), event);
});

test("adds a ticket tier to an event", () => {
  const { store, event, tier } = createTestStore();

  assert.equal(tier.name, "General Admission");
  assert.equal(tier.priceKobo, 500000);
  assert.equal(tier.capacity, 3);
  assert.equal(tier.sold, 0);
  assert.equal(tier.waitlist.size(), 0);
  assert.equal(event.tiers.get(tier.id), tier);
  assert.equal(store.events.get(event.id), event);
});

test("successfully books 2 tickets", () => {
  const { store, event, tier } = createTestStore();

  const booking = bookTickets(store, event.id, tier.id, 2);

  assert.equal(booking.ticketCount, 2);
  assert.equal(booking.totalPriceKobo, 1000000);
  assert.equal(booking.cancelled, false);
  assert.equal(booking.eventId, event.id);
  assert.equal(booking.tierId, tier.id);
  assert.equal(tier.sold, 2);
  assert.equal(
    store.bookingsByReference.get(booking.reference),
    booking,
  );
});

test("rejects ticket quantities below 1", () => {
  const { store, event, tier } = createTestStore();

  assert.throws(
    () => bookTickets(store, event.id, tier.id, 0),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "VALIDATION");
      return true;
    },
  );
});

test("rejects ticket quantities above 10", () => {
  const { store, event, tier } = createTestStore();

  assert.throws(
    () => bookTickets(store, event.id, tier.id, 11),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "VALIDATION");
      return true;
    },
  );
});

test("rejects a booking when insufficient tickets remain", () => {
  const { store, event, tier } = createTestStore();
  bookTickets(store, event.id, tier.id, 2);

  assert.throws(
    () => bookTickets(store, event.id, tier.id, 2),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "SOLD_OUT");
      return true;
    },
  );
});

test("failed bookings do not change tickets sold", () => {
  const { store, event, tier } = createTestStore();
  bookTickets(store, event.id, tier.id, 2);

  const soldBeforeFailure = tier.sold;
  const bookingCountBeforeFailure =
    store.bookingsByReference.size;

  assert.throws(
    () => bookTickets(store, event.id, tier.id, 2),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "SOLD_OUT");
      return true;
    },
  );

  assert.equal(tier.sold, soldBeforeFailure);
  assert.equal(
    store.bookingsByReference.size,
    bookingCountBeforeFailure,
  );
});

test("finds a booking using its reference", () => {
  const { store, event, tier } = createTestStore();
  const booking = bookTickets(store, event.id, tier.id, 2);

  const foundBooking = findBookingByReference(
    store,
    booking.reference,
  );

  assert.equal(foundBooking, booking);
});

test("cancelling a booking returns its tickets to inventory", () => {
  const { store, event, tier } = createTestStore();
  const booking = bookTickets(store, event.id, tier.id, 2);

  const cancelledBooking = cancelBooking(store, booking.reference);

  assert.equal(cancelledBooking, booking);
  assert.equal(cancelledBooking.cancelled, true);
  assert.equal(tier.sold, 0);
});

test("rejects a second cancellation of the same booking", () => {
  const { store, event, tier } = createTestStore();
  const booking = bookTickets(store, event.id, tier.id, 1);

  cancelBooking(store, booking.reference);

  assert.throws(
    () => cancelBooking(store, booking.reference),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "VALIDATION");
      return true;
    },
  );

  assert.equal(tier.sold, 0);
});

test("rejects attempts to find a nonexistent booking", () => {
  const { store } = createTestStore();

  assert.throws(
    () => findBookingByReference(store, "NOT-A-REAL-REFERENCE"),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "NOT_FOUND");
      return true;
    },
  );
});

test("adds customers to a sold-out tier's waitlist", () => {
  const { store, event, tier } = createTestStore();
  bookTickets(store, event.id, tier.id, 3);

  const bayoEntry = joinWaitlist(store, event.id, tier.id, {
    name: "Bayo",
    requestedTicketCount: 1,
  });
  const ciciEntry = joinWaitlist(store, event.id, tier.id, {
    name: "Cici",
    requestedTicketCount: 2,
  });

  assert.deepEqual(bayoEntry, {
    name: "Bayo",
    requestedTicketCount: 1,
  });
  assert.deepEqual(ciciEntry, {
    name: "Cici",
    requestedTicketCount: 2,
  });
  assert.equal(tier.waitlist.size(), 2);
});

test("waitlist follows FIFO order", () => {
  const { store, event, tier } = createTestStore();
  bookTickets(store, event.id, tier.id, 3);

  joinWaitlist(store, event.id, tier.id, {
    name: "Bayo",
    requestedTicketCount: 1,
  });
  joinWaitlist(store, event.id, tier.id, {
    name: "Cici",
    requestedTicketCount: 2,
  });

  assert.equal(tier.waitlist.dequeue().name, "Bayo");
  assert.equal(tier.waitlist.dequeue().name, "Cici");
  assert.equal(tier.waitlist.size(), 0);
});

test("peeking at the next customer does not remove them", () => {
  const { store, event, tier } = createTestStore();
  bookTickets(store, event.id, tier.id, 3);

  joinWaitlist(store, event.id, tier.id, {
    name: "Bayo",
    requestedTicketCount: 1,
  });
  joinWaitlist(store, event.id, tier.id, {
    name: "Cici",
    requestedTicketCount: 2,
  });

  const nextCustomer = tier.waitlist.peek();

  assert.equal(nextCustomer.name, "Bayo");
  assert.equal(tier.waitlist.size(), 2);
  assert.equal(tier.waitlist.peek(), nextCustomer);
});

test("successfully books exactly 1 ticket", () => {
  const { store, event, tier } = createTestStore();

  const booking = bookTickets(store, event.id, tier.id, 1);

  assert.equal(booking.ticketCount, 1);
  assert.equal(booking.totalPriceKobo, 500000);
  assert.equal(tier.sold, 1);
});

test("successfully books exactly 10 tickets when capacity allows it", () => {
  const store = createStore();
  const event = createEvent(store, {
    title: "Lagos Tech Conference",
    city: "Lagos",
    venue: "Convention Centre",
    date: "2026-12-10",
  });
  const tier = addTier(store, event.id, {
    name: "General Admission",
    priceKobo: 500000,
    capacity: 10,
  });

  const booking = bookTickets(store, event.id, tier.id, 10);

  assert.equal(booking.ticketCount, 10);
  assert.equal(booking.totalPriceKobo, 5000000);
  assert.equal(tier.sold, 10);
});

test("cannot join a waitlist when the tier is not sold out", () => {
  const { store, event, tier } = createTestStore();

  assert.throws(
    () => joinWaitlist(store, event.id, tier.id, {
      name: "Bayo",
      requestedTicketCount: 1,
    }),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "VALIDATION");
      return true;
    },
  );

  assert.equal(tier.waitlist.size(), 0);
});

test("cannot join a waitlist with requestedTicketCount of 0", () => {
  const { store, event, tier } = createTestStore();
  bookTickets(store, event.id, tier.id, 3);

  assert.throws(
    () => joinWaitlist(store, event.id, tier.id, {
      name: "Bayo",
      requestedTicketCount: 0,
    }),
    (error) => {
      assert.equal(error instanceof DomainError, true);
      assert.equal(error.code, "VALIDATION");
      return true;
    },
  );

  assert.equal(tier.waitlist.size(), 0);
});
