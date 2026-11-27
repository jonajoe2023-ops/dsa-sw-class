import { DomainError } from "./errors.js";
import { newId, newReference } from "./ids.js";
import { WaitlistQueue } from "./waitlistQueue.js";

function requireObject(value, fieldName) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new DomainError(`${fieldName} must be an object`, "VALIDATION");
  }
}

function requireNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new DomainError(`${fieldName} must be a non-empty string`, "VALIDATION");
  }
}

function requirePositiveInteger(value, fieldName) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new DomainError(`${fieldName} must be a positive integer`, "VALIDATION");
  }
}

function requireTicketQuantity(ticketCount) {
  if (!Number.isSafeInteger(ticketCount) || ticketCount < 1 || ticketCount > 10) {
    throw new DomainError(
      "ticketCount must be an integer between 1 and 10",
      "VALIDATION",
    );
  }
}

function findEvent(store, eventId) {
  requireNonEmptyString(eventId, "eventId");

  const event = store.events.get(eventId);
  if (!event) {
    throw new DomainError("Event not found", "NOT_FOUND");
  }

  return event;
}

function findTier(store, eventId, tierId) {
  requireNonEmptyString(tierId, "tierId");

  const event = findEvent(store, eventId);
  const tier = event.tiers.get(tierId);
  if (!tier) {
    throw new DomainError("Ticket tier not found", "NOT_FOUND");
  }

  return { event, tier };
}

export function createStore() {
  return {
    events: new Map(),
    bookingsByReference: new Map(),
  };
}

export function createEvent(store, eventDetails) {
  requireObject(store, "store");
  requireObject(eventDetails, "eventDetails");
  requireNonEmptyString(eventDetails.title, "title");
  requireNonEmptyString(eventDetails.city, "city");
  requireNonEmptyString(eventDetails.venue, "venue");
  requireNonEmptyString(eventDetails.date, "date");

  const event = {
    id: newId(),
    title: eventDetails.title,
    city: eventDetails.city,
    venue: eventDetails.venue,
    date: eventDetails.date,
    tiers: new Map(),
  };

  store.events.set(event.id, event);
  return event;
}

export function addTier(store, eventId, tierDetails) {
  requireObject(store, "store");
  requireObject(tierDetails, "tierDetails");

  const event = findEvent(store, eventId);
  requireNonEmptyString(tierDetails.name, "name");
  requirePositiveInteger(tierDetails.priceKobo, "priceKobo");
  requirePositiveInteger(tierDetails.capacity, "capacity");

  const tier = {
    id: newId(),
    name: tierDetails.name,
    priceKobo: tierDetails.priceKobo,
    capacity: tierDetails.capacity,
    sold: 0,
    waitlist: new WaitlistQueue(),
  };

  event.tiers.set(tier.id, tier);
  return tier;
}

export function bookTickets(store, eventId, tierId, ticketCount) {
  requireObject(store, "store");
  requireTicketQuantity(ticketCount);

  const { tier } = findTier(store, eventId, tierId);
  const availableTickets = tier.capacity - tier.sold;

  if (ticketCount > availableTickets) {
    throw new DomainError("Not enough tickets available", "SOLD_OUT");
  }

  let reference = newReference();
  while (store.bookingsByReference.has(reference)) {
    reference = newReference();
  }

  const booking = {
    id: newId(),
    reference,
    eventId,
    tierId,
    ticketCount,
    totalPriceKobo: tier.priceKobo * ticketCount,
    cancelled: false,
  };

  store.bookingsByReference.set(reference, booking);
  tier.sold += ticketCount;
  return booking;
}

export function findBookingByReference(store, bookingReference) {
  requireObject(store, "store");
  requireNonEmptyString(bookingReference, "bookingReference");

  const booking = store.bookingsByReference.get(bookingReference);
  if (!booking) {
    throw new DomainError("Booking not found", "NOT_FOUND");
  }

  return booking;
}

export function cancelBooking(store, bookingReference) {
  requireObject(store, "store");
  requireNonEmptyString(bookingReference, "bookingReference");

  const booking = store.bookingsByReference.get(bookingReference);
  if (!booking) {
    throw new DomainError("Booking not found", "NOT_FOUND");
  }

  if (booking.cancelled) {
    throw new DomainError("Booking has already been cancelled", "VALIDATION");
  }

  const { tier } = findTier(store, booking.eventId, booking.tierId);

  tier.sold -= booking.ticketCount;
  booking.cancelled = true;

  return booking;
}

export function joinWaitlist(store, eventId, tierId, customer) {
  requireObject(store, "store");
  requireObject(customer, "customer");

  const { tier } = findTier(store, eventId, tierId);
  requireNonEmptyString(customer.name, "customer.name");

  const requestedTicketCount =
    customer.requestedTicketCount ??
    customer.ticketCount ??
    customer.quantity;

  requireTicketQuantity(requestedTicketCount);

  if (tier.sold !== tier.capacity) {
    throw new DomainError("The ticket tier is not sold out", "VALIDATION");
  }

  const waitlistEntry = {
    name: customer.name,
    requestedTicketCount,
  };

  tier.waitlist.enqueue(waitlistEntry);
  return waitlistEntry;
}
