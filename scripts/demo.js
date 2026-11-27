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

const store = createStore();
console.log("Created an empty ticketing store.");

const event = createEvent(store, {
  title: "Lagos Tech Conference",
  city: "Lagos",
  venue: "Convention Centre",
  date: "2026-12-10",
});
console.log(`Created event: ${event.title}`);

const tier = addTier(store, event.id, {
  name: "General Admission",
  priceKobo: 500000,
  capacity: 3,
});
console.log(
  `Added tier: ${tier.name} (${tier.capacity} tickets at ${tier.priceKobo} kobo each)`,
);

const adaBooking = bookTickets(store, event.id, tier.id, 2);
console.log(
  `Ada booked ${adaBooking.ticketCount} tickets. Reference: ${adaBooking.reference}`,
);

const foundAdaBooking = findBookingByReference(store, adaBooking.reference);
console.log(
  `Found Ada's booking by reference: ${foundAdaBooking.reference}, tickets: ${foundAdaBooking.ticketCount}`,
);

try {
  bookTickets(store, event.id, tier.id, 2);
} catch (error) {
  if (error instanceof DomainError && error.code === "SOLD_OUT") {
    console.log(`Bayo's booking was refused: ${error.code} - ${error.message}`);
  } else {
    throw error;
  }
}

const remainingBooking = bookTickets(store, event.id, tier.id, 1);
console.log(
  `Sold the remaining ticket. Reference: ${remainingBooking.reference}`,
);

const bayoWaitlistEntry = joinWaitlist(store, event.id, tier.id, {
  name: "Bayo",
  requestedTicketCount: 1,
});
console.log(
  `Bayo joined the waitlist for ${bayoWaitlistEntry.requestedTicketCount} ticket.`,
);

const ciciWaitlistEntry = joinWaitlist(store, event.id, tier.id, {
  name: "Cici",
  requestedTicketCount: 2,
});
console.log(
  `Cici joined the waitlist for ${ciciWaitlistEntry.requestedTicketCount} tickets.`,
);

const cancelledBooking = cancelBooking(store, adaBooking.reference);
console.log(
  `Cancelled Ada's booking (${cancelledBooking.reference}). Seats released: ${cancelledBooking.ticketCount}`,
);
console.log(`Tickets sold after cancellation: ${tier.sold}`);

const nextWaitingCustomer = tier.waitlist.peek();
if (nextWaitingCustomer === null) {
  console.log("There is no customer in the waitlist.");
} else {
  console.log(
    `Next waiting customer: ${nextWaitingCustomer.name} (${nextWaitingCustomer.requestedTicketCount} ticket(s) requested)`,
  );
}

console.log(`Waitlist size after peeking: ${tier.waitlist.size()}`);
