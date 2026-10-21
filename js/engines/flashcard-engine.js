/**
 * Flashcard Coach Engine
 * Manages active recall, 3D card flip transitions, and spaced repetition tracking.
 */

import { FLASHCARDS } from "../data/az900-data.js";

export class FlashcardEngine {
  constructor(readinessEngine) {
    this.readinessEngine = readinessEngine;
    this.currentFilter = "all"; // 'all', 1, 2, 3, or 'review'
    this.cards = [];
    this.currentIndex = 0;
    this.isFlipped = false;
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.loadCards();
  }

  loadCards() {
    let pool = [...FLASHCARDS];
    const masteredList = this.readinessEngine.state.flashcardsMastered || [];

    if (this.currentFilter === "review") {
      // Cards not yet mastered
      pool = pool.filter(c => !masteredList.includes(c.id));
      if (pool.length === 0) pool = [...FLASHCARDS];
    } else if (["1", "2", "3", 1, 2, 3].includes(this.currentFilter)) {
      const d = parseInt(this.currentFilter, 10);
      pool = pool.filter(c => c.domainId === d);
    }

    this.cards = pool;
    this.currentIndex = 0;
    this.isFlipped = false;
  }

  getCurrentCard() {
    if (this.cards.length === 0) return null;
    const card = this.cards[this.currentIndex];
    const isMastered = (this.readinessEngine.state.flashcardsMastered || []).includes(card.id);

    return {
      ...card,
      isMastered,
      cardNumber: this.currentIndex + 1,
      totalCards: this.cards.length
    };
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    return this.isFlipped;
  }

  resetFlip() {
    this.isFlipped = false;
  }

  markCard(isMastered) {
    const card = this.cards[this.currentIndex];
    if (!card) return;

    this.readinessEngine.setFlashcardMastery(card.id, isMastered);
    this.nextCard();
  }

  nextCard() {
    this.isFlipped = false;
    if (this.cards.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  }

  prevCard() {
    this.isFlipped = false;
    if (this.cards.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
  }

  getMasteryStats() {
    const masteredList = this.readinessEngine.state.flashcardsMastered || [];
    return {
      masteredCount: masteredList.length,
      totalCards: FLASHCARDS.length,
      percentage: Math.round((masteredList.length / FLASHCARDS.length) * 100)
    };
  }
}
