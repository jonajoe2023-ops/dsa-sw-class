import { performance } from "node:perf_hooks";

const BOOKING_COUNT = 100_000;
const LOOKUP_COUNT = 10_000;

// Keep the same booking objects in both collections so the benchmark compares
// lookup methods without comparing different data.
const bookingMap = new Map();
const bookingArray = [];

for (let index = 0; index < BOOKING_COUNT; index += 1) {
  const booking = {
    id: `booking-${index}`,
    reference: `REF-${index.toString().padStart(6, "0")}`,
  };

  bookingArray.push(booking);
  bookingMap.set(booking.reference, booking);
}

// Choose a reference near the end of the dataset. Array.find() must search
// through almost every item before finding this booking.
const targetIndex = BOOKING_COUNT - 2;
const targetReference = `REF-${targetIndex.toString().padStart(6, "0")}`;

// Warm up both lookup methods before timing them.
bookingMap.get(targetReference);
bookingArray.find((booking) => booking.reference === targetReference);

let mapResult = null;

// Map.get() can find the key directly without checking every booking.
const mapStart = performance.now();
for (let index = 0; index < LOOKUP_COUNT; index += 1) {
  mapResult = bookingMap.get(targetReference);
}
const mapTime = performance.now() - mapStart;

let arrayResult = null;

// Array.find() checks entries from the beginning until it reaches a match.
const arrayStart = performance.now();
for (let index = 0; index < LOOKUP_COUNT; index += 1) {
  arrayResult = bookingArray.find(
    (booking) => booking.reference === targetReference,
  );
}
const arrayTime = performance.now() - arrayStart;

// Verify that both methods found the same booking object.
if (mapResult !== arrayResult) {
  throw new Error("Verification failed: Map and Array.find returned different bookings.");
}

console.log(`Number of bookings: ${BOOKING_COUNT}`);
console.log(`Number of repeated lookups: ${LOOKUP_COUNT}`);
console.log(`Map.get() time: ${mapTime.toFixed(3)} ms`);
console.log(`Array.find() time: ${arrayTime.toFixed(3)} ms`);

if (mapTime < arrayTime) {
  console.log("Faster method: Map.get()");
} else if (arrayTime < mapTime) {
  console.log("Faster method: Array.find()");
} else {
  console.log("Faster method: Equal timing");
}

console.log(`Verified booking reference: ${mapResult.reference}`);
