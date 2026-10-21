/**
 * Smart Quiz Engine
 * Manages question sequencing, filtering, instant diagnostic feedback, and explanation state.
 */

import { QUESTIONS, DOMAINS } from "../data/az900-data.js";

export class QuizEngine {
  constructor(readinessEngine) {
    this.readinessEngine = readinessEngine;
    this.currentFilter = "all"; // 'all', 1, 2, 3, or 'weak'
    this.activeQuestions = [];
    this.currentIndex = 0;
    this.currentQuestion = null;
    this.selectedOptionId = null;
    this.isAnswered = false;
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.loadQuestions();
  }

  loadQuestions() {
    let pool = [...QUESTIONS];

    if (this.currentFilter === "weak") {
      const weakIds = this.readinessEngine.state.weakQuestionIds || [];
      pool = pool.filter(q => weakIds.includes(q.id));
      if (pool.length === 0) {
        // If no weak questions, fallback to all questions
        pool = [...QUESTIONS];
      }
    } else if (["1", "2", "3", 1, 2, 3].includes(this.currentFilter)) {
      const domainNum = parseInt(this.currentFilter, 10);
      pool = pool.filter(q => q.domainId === domainNum);
    }

    // Shuffle pool for varied practice
    this.activeQuestions = this.shuffleArray(pool);
    this.currentIndex = 0;
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
    this.loadCurrentQuestion();
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  loadCurrentQuestion() {
    if (this.activeQuestions.length === 0) {
      this.currentQuestion = null;
      return;
    }

    this.currentQuestion = this.activeQuestions[this.currentIndex];
    this.selectedOptionId = null;
    this.isAnswered = false;
  }

  submitAnswer(optionId) {
    if (this.isAnswered || !this.currentQuestion) return null;

    this.isAnswered = true;
    this.selectedOptionId = optionId;
    this.sessionTotal += 1;

    const chosenOption = this.currentQuestion.options.find(opt => opt.id === optionId);
    const correctOption = this.currentQuestion.options.find(opt => opt.isCorrect);
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    if (isCorrect) {
      this.sessionCorrect += 1;
    }

    // Update global readiness metrics
    this.readinessEngine.recordQuizAnswer(
      this.currentQuestion.id,
      this.currentQuestion.domainId,
      isCorrect
    );

    return {
      isCorrect,
      chosenOption,
      correctOption,
      allOptions: this.currentQuestion.options,
      azureConceptTip: this.currentQuestion.azureConceptTip,
      learnReference: this.currentQuestion.learnReference,
      sessionCorrect: this.sessionCorrect,
      sessionTotal: this.sessionTotal
    };
  }

  nextQuestion() {
    if (this.currentIndex < this.activeQuestions.length - 1) {
      this.currentIndex += 1;
      this.loadCurrentQuestion();
      return true;
    }
    return false; // Reached end of questions in current filter
  }

  getCurrentProgress() {
    return {
      currentIndex: this.currentIndex,
      totalCount: this.activeQuestions.length,
      percentage: this.activeQuestions.length > 0 
        ? Math.round(((this.currentIndex + 1) / this.activeQuestions.length) * 100)
        : 0
    };
  }
}
