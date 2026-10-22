/**
 * AI Study Buddy & Analogy Engine
 * De-mystifies complex cloud jargon using intuitive, real-world, localized analogies.
 */

import { AI_BUDDY_CONCEPTS } from "../data/az900-data.js";

export class BuddyEngine {
  constructor() {
    this.concepts = AI_BUDDY_CONCEPTS;
    this.selectedConceptId = this.concepts[0].id;
  }

  getAllConcepts() {
    return this.concepts.map(c => ({
      id: c.id,
      title: c.title,
      domain: c.domain,
      tagline: c.tagline
    }));
  }

  selectConcept(id) {
    const found = this.concepts.find(c => c.id === id);
    if (found) {
      this.selectedConceptId = id;
      return found;
    }
    return this.concepts[0];
  }

  getCurrentConcept() {
    return this.concepts.find(c => c.id === this.selectedConceptId) || this.concepts[0];
  }
}
