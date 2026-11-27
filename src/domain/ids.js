import { randomBytes, randomUUID } from "node:crypto";

const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const REFERENCE_LENGTH = 8;

export function newId() {
  return randomUUID();
}

export function newReference() {
  let reference = "";

  while (reference.length < REFERENCE_LENGTH) {
    const bytes = randomBytes(REFERENCE_LENGTH);

    for (const byte of bytes) {
      if (reference.length === REFERENCE_LENGTH) {
        break;
      }

      if (byte < 256 - (256 % REFERENCE_ALPHABET.length)) {
        reference += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
      }
    }
  }

  return reference;
}
