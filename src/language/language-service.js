const LinkedList = require("./lang-linked-list");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },
  updateUsersLanguageHead(db, user_id, head) {
    return db
      .from('language')
      .update({ head })
      .where('language.user_id', user_id);
  },
  updateUsersTotalScore(db, user_id, total_score) {
    return db
      .from('language')
      .update({ total_score })
      .where('language.user_id', user_id);
  },
  updateLanguageWords(db, id, data) {
    return db
      .from('word')
      .update({
        next: data.next,
        correct_count: data.correct_count,
        incorrect_count: data.incorrect_count,
        memory_value: data.memory_value
      })
      .where({ id });
  },
  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id });
  },
  async fillLinkedList(db, language) {
    // get all the words from the database
    const words = await this.getLanguageWords(
      db,
      language.id
    );
    let currNode;
    
    // instantiate a new linked list
    const wordsLinkedList = new LinkedList();
    // find the word whose id matches the head
    const head = words.find(word => word.id === language.head);
    // insert that value into the list
    wordsLinkedList.insert(head);
    // set the currNode to the head of the LL
    currNode = wordsLinkedList.head;
    // look at the next value from the head word and find the word whose id matches the next
    while (currNode.value.next !== null) {
      // insert that word into the list
      const nextWord = words.find(word => word.id === currNode.value.next);
      wordsLinkedList.insert(nextWord);
      currNode = currNode.next;
    }

    return wordsLinkedList;
  }
};

module.exports = LanguageService;
