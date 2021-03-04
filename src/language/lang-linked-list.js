class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor(head = null) {
    this.head = head;
  }

  insert(item) {
    if (!this.head) {
      this.head = new _Node(item, null);
    }
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  incorrect() {
    let currNode = this.head;
    let upNextNode = this.head.next;
    let tempNode = upNextNode.next;

    // reset the currNode memory_value to one
    currNode.value.memory_value = 1;
    currNode.value.incorrect_count++;

    // rearrange the node order to move the currNode one position back in the list
    this.head = upNextNode;
    this.head.next = currNode;
    currNode.next = tempNode;

    // properly reset the next values for the items in the list
    upNextNode.value.next = currNode.value.id;
    currNode.value.next = tempNode.value.id;
  }

  correct() {
    let currNode = this.head;
    let tempNode = this.head;
    let positionCount = 0;
    let position = 0;

    // make the changes to the word that was guessed correctly
    currNode.value.memory_value = (currNode.value.memory_value * 2);
    currNode.value.correct_count++;
    position = currNode.value.memory_value;

    while (currNode.next !== null && positionCount !== position) {
      currNode = currNode.next;
      positionCount++;
    }

    this.head = this.head.next;
    tempNode.next = currNode.next;
    currNode.next = tempNode;

    currNode.value.next = tempNode.value.id;
    tempNode.value.next = tempNode.next.value.id;
    this.head.value.next = this.head.next.value.id;
  }

  all() {
    if (!this.head) {
      return null;
    }

    let node = this.head;
    let all = [];
    while (node.next) {
      all.push(node.value);
      node = node.next;
    }

    all.push(node.value);
    return all;
  }

  display() {
    if (!this.head) {
      return null;
    }

    let node = this.head;
    let displayedList = 'Head: ';

    while (node) {
      displayedList += `{ id: ${node.value.id}, original: ${node.value.original}, next: ${node.value.next} }, `;
      node = node.next;
    }

    return displayedList;
  }
}

module.exports = LinkedList;