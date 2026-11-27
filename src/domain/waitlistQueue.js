class QueueNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class WaitlistQueue {
  #front = null;
  #rear = null;
  #length = 0;

  enqueue(value) {
    const node = new QueueNode(value);

    if (this.#rear === null) {
      this.#front = node;
      this.#rear = node;
    } else {
      this.#rear.next = node;
      this.#rear = node;
    }

    this.#length += 1;
  }

  dequeue() {
    if (this.#front === null) {
      return null;
    }

    const node = this.#front;
    this.#front = node.next;
    this.#length -= 1;

    if (this.#front === null) {
      this.#rear = null;
    }

    return node.value;
  }

  peek() {
    return this.#front === null ? null : this.#front.value;
  }

  size() {
    return this.#length;
  }
}
