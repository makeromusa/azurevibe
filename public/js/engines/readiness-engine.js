/**
 * Readiness & Scoring Engine
 * Computes composite exam readiness weighted against the 3 official AZ-900 domains:
 * - Domain 1 (Cloud Concepts): 28%
 * - Domain 2 (Azure Architecture & Services): 37%
 * - Domain 3 (Azure Management & Governance): 35%
 */

import { DOMAINS } from "../data/az900-data.js";

export class ReadinessEngine {
  constructor(storageKey = "azurevibe_readiness_state") {
    this.storageKey = storageKey;
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }

    // Default clean state
    return {
      domains: {
        1: { correct: 0, total: 0 },
        2: { correct: 0, total: 0 },
        3: { correct: 0, total: 0 }
      },
      flashcardsMastered: [],
      weakQuestionIds: [],
      studyTargetDate: null,
      dailyStudyMinutes: 30
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }

  recordQuizAnswer(questionId, domainId, isCorrect) {
    if (!this.state.domains[domainId]) {
      this.state.domains[domainId] = { correct: 0, total: 0 };
    }

    this.state.domains[domainId].total += 1;
    if (isCorrect) {
      this.state.domains[domainId].correct += 1;
      // Remove from weak questions if resolved
      this.state.weakQuestionIds = this.state.weakQuestionIds.filter(id => id !== questionId);
    } else {
      // Add to weak questions list if not already present
      if (!this.state.weakQuestionIds.includes(questionId)) {
        this.state.weakQuestionIds.push(questionId);
      }
    }

    this.saveState();
  }

  setFlashcardMastery(cardId, isMastered) {
    if (isMastered) {
      if (!this.state.flashcardsMastered.includes(cardId)) {
        this.state.flashcardsMastered.push(cardId);
      }
    } else {
      this.state.flashcardsMastered = this.state.flashcardsMastered.filter(id => id !== cardId);
    }
    this.saveState();
  }

  getDomainScore(domainId) {
    const stats = this.state.domains[domainId];
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  }

  getMetrics() {
    let weightedSum = 0;
    let totalQuestionsAttempted = 0;
    let totalQuestionsCorrect = 0;

    const domainDetails = {};

    for (let id = 1; id <= 3; id++) {
      const stats = this.state.domains[id] || { correct: 0, total: 0 };
      const score = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      const weight = DOMAINS[id].weight;

      weightedSum += (score * weight);
      totalQuestionsAttempted += stats.total;
      totalQuestionsCorrect += stats.correct;

      domainDetails[id] = {
        name: DOMAINS[id].name,
        officialTitle: DOMAINS[id].officialTitle,
        weightPercentage: Math.round(weight * 100),
        score,
        correct: stats.correct,
        total: stats.total,
        color: DOMAINS[id].color,
        badgeClass: DOMAINS[id].badgeClass
      };
    }

    const overallScore = Math.round(weightedSum);
    // Scaled equivalent out of 1000 (Microsoft standard passing score is 700)
    const scaledScore = Math.round((overallScore / 100) * 1000);

    let statusLabel = "Just Starting";
    let statusTone = "neutral";
    let message = "Start answering domain quizzes and flashcards to assess your exam readiness.";

    if (totalQuestionsAttempted >= 4) {
      if (overallScore >= 85) {
        statusLabel = "Exam Ready 🎯";
        statusTone = "ready";
        message = "Outstanding! You are comfortably passing all 3 AZ-900 domains. You're ready to sit the exam!";
      } else if (overallScore >= 70) {
        statusLabel = "Passing Zone ⚡";
        statusTone = "passing";
        message = "You're above the 700 passing cutoff! Drill your remaining weak areas to guarantee a high score.";
      } else {
        statusLabel = "Needs Reinforcement 📚";
        statusTone = "weak";
        message = "Below the 700-point passing threshold. Review the AI Study Buddy analogies and re-drill weak questions.";
      }
    }

    // Find weakest domain with at least 1 attempt
    let weakestDomainId = null;
    let minScore = 101;
    for (let id = 1; id <= 3; id++) {
      const s = domainDetails[id].score;
      if (domainDetails[id].total > 0 && s < minScore) {
        minScore = s;
        weakestDomainId = id;
      }
    }

    return {
      overallScore,
      scaledScore,
      statusLabel,
      statusTone,
      message,
      totalQuestionsAttempted,
      totalQuestionsCorrect,
      weakQuestionCount: this.state.weakQuestionIds.length,
      weakQuestionIds: this.state.weakQuestionIds,
      flashcardsMasteredCount: this.state.flashcardsMastered.length,
      domainDetails,
      weakestDomainId
    };
  }

  resetProgress() {
    this.state = {
      domains: {
        1: { correct: 0, total: 0 },
        2: { correct: 0, total: 0 },
        3: { correct: 0, total: 0 }
      },
      flashcardsMastered: [],
      weakQuestionIds: [],
      studyTargetDate: null,
      dailyStudyMinutes: 30
    };
    this.saveState();
  }
}
