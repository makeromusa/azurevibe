/**
 * AzureVibe Application Orchestrator & View Controller
 * Coordinates domain engines, reactive view state, and DOM updates.
 */

import { DOMAINS, QUESTIONS, FLASHCARDS, AI_BUDDY_CONCEPTS } from "./data/az900-data.js";
import { ReadinessEngine } from "./engines/readiness-engine.js";
import { QuizEngine } from "./engines/quiz-engine.js";
import { FlashcardEngine } from "./engines/flashcard-engine.js";
import { BuddyEngine } from "./engines/buddy-engine.js";
import { PlannerEngine } from "./engines/planner-engine.js";

class AzureVibeApp {
  constructor() {
    this.readinessEngine = new ReadinessEngine();
    this.quizEngine = new QuizEngine(this.readinessEngine);
    this.flashcardEngine = new FlashcardEngine(this.readinessEngine);
    this.buddyEngine = new BuddyEngine();
    this.plannerEngine = new PlannerEngine(this.readinessEngine);

    this.currentView = "dashboard";
    this.theme = localStorage.getItem("azurevibe_theme") || "dark";
  }

  init() {
    this.applyTheme(this.theme);
    this.bindGlobalEvents();
    this.quizEngine.loadQuestions();
    this.flashcardEngine.loadCards();

    // Default view
    this.switchView("dashboard");
    this.renderAll();
  }

  // ==========================================
  // THEME & NAVIGATION
  // ==========================================
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("azurevibe_theme", theme);
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  toggleTheme() {
    const nextTheme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(nextTheme);
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav buttons
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    // Update view panels
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.toggle("active-view", sec.id === `view-${viewName}`);
    });

    // Specific view entry hooks
    if (viewName === "dashboard") {
      this.renderDashboard();
    } else if (viewName === "quiz") {
      this.renderQuizQuestion();
    } else if (viewName === "flashcards") {
      this.renderFlashcard();
    } else if (viewName === "buddy") {
      this.renderBuddy();
    } else if (viewName === "planner") {
      this.renderPlanner();
    }
  }

  bindGlobalEvents() {
    // Navigation buttons
    document.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", e => {
        const targetView = e.currentTarget.dataset.nav;
        if (targetView) this.switchView(targetView);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Reset Progress Button
    const resetBtn = document.getElementById("btn-reset-metrics");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all quiz and flashcard progress? This will reset your readiness score.")) {
          this.readinessEngine.resetProgress();
          this.quizEngine.loadQuestions();
          this.flashcardEngine.loadCards();
          this.renderAll();
        }
      });
    }

    // Quiz Filters
    document.querySelectorAll(".quiz-filter-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        document.querySelectorAll(".quiz-filter-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const filter = e.currentTarget.dataset.filter;
        this.quizEngine.setFilter(filter);
        this.renderQuizQuestion();
      });
    });

    // Quiz Next Button
    const nextQuizBtn = document.getElementById("btn-next-question");
    if (nextQuizBtn) {
      nextQuizBtn.addEventListener("click", () => {
        if (this.quizEngine.nextQuestion()) {
          this.renderQuizQuestion();
        } else {
          alert("You've completed all questions in this category! Switching to summary.");
          this.switchView("dashboard");
        }
      });
    }

    // Flashcard Flip & Controls
    const cardInner = document.getElementById("flashcard-inner");
    if (cardInner) {
      cardInner.addEventListener("click", () => {
        const isFlipped = this.flashcardEngine.flip();
        cardInner.classList.toggle("flipped", isFlipped);
      });
    }

    const markMasteredBtn = document.getElementById("btn-card-mastered");
    if (markMasteredBtn) {
      markMasteredBtn.addEventListener("click", () => {
        this.flashcardEngine.markCard(true);
        this.renderFlashcard();
      });
    }

    const markReviewBtn = document.getElementById("btn-card-review");
    if (markReviewBtn) {
      markReviewBtn.addEventListener("click", () => {
        this.flashcardEngine.markCard(false);
        this.renderFlashcard();
      });
    }

    const prevCardBtn = document.getElementById("btn-card-prev");
    if (prevCardBtn) {
      prevCardBtn.addEventListener("click", () => {
        this.flashcardEngine.prevCard();
        this.renderFlashcard();
      });
    }

    const nextCardBtn = document.getElementById("btn-card-next");
    if (nextCardBtn) {
      nextCardBtn.addEventListener("click", () => {
        this.flashcardEngine.nextCard();
        this.renderFlashcard();
      });
    }

    // Flashcard Filter buttons
    document.querySelectorAll(".fc-filter-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        document.querySelectorAll(".fc-filter-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.flashcardEngine.setFilter(e.currentTarget.dataset.filter);
        this.renderFlashcard();
      });
    });

    // Planner Generate Form
    const plannerForm = document.getElementById("planner-form");
    if (plannerForm) {
      plannerForm.addEventListener("submit", e => {
        e.preventDefault();
        const dateInput = document.getElementById("planner-date").value;
        const minutesInput = parseInt(document.getElementById("planner-minutes").value, 10);
        this.plannerEngine.generatePlan(dateInput, minutesInput);
        this.renderPlanner();
      });
    }
  }

  renderAll() {
    this.renderHeaderPill();
    this.renderDashboard();
    this.renderQuizQuestion();
    this.renderFlashcard();
    this.renderBuddy();
    this.renderPlanner();
  }

  // ==========================================
  // DASHBOARD & READINESS SPEEDOMETER
  // ==========================================
  renderHeaderPill() {
    const metrics = this.readinessEngine.getMetrics();
    const pill = document.getElementById("nav-readiness-pill");
    if (pill) {
      pill.textContent = `🎯 Readiness: ${metrics.overallScore}%`;
      if (metrics.overallScore >= 85) {
        pill.style.color = "var(--success-color)";
      } else if (metrics.overallScore >= 70) {
        pill.style.color = "var(--domain-3)";
      } else {
        pill.style.color = "var(--azure-blue)";
      }
    }
  }

  renderDashboard() {
    const metrics = this.readinessEngine.getMetrics();
    this.renderHeaderPill();

    // Speedometer Gauge SVG (arc stroke length is 251.2 for 180-deg arc)
    const arcLength = 251.2;
    const offset = arcLength - (metrics.overallScore / 100) * arcLength;
    const gaugeProgress = document.getElementById("gauge-progress-circle");
    if (gaugeProgress) {
      gaugeProgress.style.strokeDashoffset = offset;
      if (metrics.overallScore >= 85) {
        gaugeProgress.style.stroke = "var(--success-color)";
      } else if (metrics.overallScore >= 70) {
        gaugeProgress.style.stroke = "var(--domain-3)";
      } else {
        gaugeProgress.style.stroke = "var(--azure-blue)";
      }
    }

    const scoreEl = document.getElementById("dash-gauge-score");
    if (scoreEl) scoreEl.textContent = `${metrics.overallScore}%`;

    const scaledEl = document.getElementById("dash-gauge-scaled");
    if (scaledEl) scaledEl.textContent = `Scaled: ${metrics.scaledScore} / 1000 (Pass: 700)`;

    const statusEl = document.getElementById("dash-gauge-status");
    if (statusEl) {
      statusEl.textContent = metrics.statusLabel;
      statusEl.style.color = metrics.overallScore >= 70 ? "var(--success-color)" : "var(--azure-blue)";
    }

    const adviceEl = document.getElementById("dash-gauge-advice");
    if (adviceEl) adviceEl.textContent = metrics.message;

    // Domain Health Bars
    for (let id = 1; id <= 3; id++) {
      const d = metrics.domainDetails[id];
      const fillEl = document.getElementById(`dash-domain-fill-${id}`);
      const scoreTxt = document.getElementById(`dash-domain-score-${id}`);
      if (fillEl) fillEl.style.width = `${d.score}%`;
      if (scoreTxt) scoreTxt.textContent = `${d.score}% (${d.correct}/${d.total})`;
    }

    // Quick Stats
    const totalAnsweredEl = document.getElementById("dash-total-answered");
    if (totalAnsweredEl) totalAnsweredEl.textContent = metrics.totalQuestionsAttempted;

    const weakQuestionsEl = document.getElementById("dash-weak-count");
    if (weakQuestionsEl) weakQuestionsEl.textContent = metrics.weakQuestionCount;

    const cardsMasteredEl = document.getElementById("dash-cards-mastered");
    if (cardsMasteredEl) cardsMasteredEl.textContent = metrics.flashcardsMasteredCount;
  }

  // ==========================================
  // SMART QUIZ ARENA
  // ==========================================
  renderQuizQuestion() {
    const q = this.quizEngine.currentQuestion;
    const container = document.getElementById("quiz-interactive-area");
    const emptyState = document.getElementById("quiz-empty-state");

    if (!q) {
      if (container) container.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (container) container.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    // Header & Meta
    const progress = this.quizEngine.getCurrentProgress();
    const counterEl = document.getElementById("quiz-counter");
    if (counterEl) {
      counterEl.textContent = `Question ${progress.currentIndex + 1} of ${progress.totalCount}`;
    }

    const domainBadge = document.getElementById("quiz-domain-badge");
    if (domainBadge) {
      const d = DOMAINS[q.domainId];
      domainBadge.textContent = d.name;
      domainBadge.className = `badge ${d.badgeClass}`;
    }

    const topicEl = document.getElementById("quiz-topic-title");
    if (topicEl) topicEl.textContent = q.topic;

    // Scenario & Question
    const scenarioBox = document.getElementById("quiz-scenario");
    if (scenarioBox) scenarioBox.textContent = q.scenario;

    const questionBox = document.getElementById("quiz-question-text");
    if (questionBox) questionBox.textContent = q.question;

    // Options Rendering
    const optionsGrid = document.getElementById("quiz-options-container");
    if (optionsGrid) {
      optionsGrid.innerHTML = "";
      q.options.forEach(opt => {
        const card = document.createElement("div");
        card.className = "option-card";
        card.dataset.optionId = opt.id;

        const letter = document.createElement("div");
        letter.className = "option-letter";
        letter.textContent = opt.id;

        const text = document.createElement("div");
        text.className = "option-text";
        text.textContent = opt.text;

        card.appendChild(letter);
        card.appendChild(text);

        card.addEventListener("click", () => {
          if (!this.quizEngine.isAnswered) {
            this.handleQuizSubmission(opt.id);
          }
        });

        optionsGrid.appendChild(card);
      });
    }

    // Hide Explanation initially
    const explanationPanel = document.getElementById("quiz-explanation-panel");
    if (explanationPanel) explanationPanel.classList.remove("visible");

    // Hide Next Button until answered
    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) nextBtn.style.display = "none";
  }

  handleQuizSubmission(optionId) {
    const result = this.quizEngine.submitAnswer(optionId);
    if (!result) return;

    // Optional async sync to backend REST API (gracefully degrades offline)
    try {
      fetch("/api/v1/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: this.quizEngine.currentQuestion.id,
          selectedOptionId: optionId
        })
      }).catch(() => {});
    } catch (e) {
      // Offline fallback
    }

    // Highlight options
    document.querySelectorAll(".option-card").forEach(card => {
      card.classList.add("disabled");
      const optId = card.dataset.optionId;
      const opt = result.allOptions.find(o => o.id === optId);

      if (opt && opt.isCorrect) {
        card.classList.add("correct");
      } else if (optId === optionId && !result.isCorrect) {
        card.classList.add("wrong");
      }
    });

    // Populate and show explanation panel
    const explanationPanel = document.getElementById("quiz-explanation-panel");
    const expTitle = document.getElementById("explanation-result-title");
    const expContent = document.getElementById("explanation-body-text");
    const expTip = document.getElementById("explanation-concept-tip");
    const expRef = document.getElementById("explanation-learn-ref");

    if (expTitle) {
      expTitle.textContent = result.isCorrect 
        ? "✅ Correct! Great Architectural Choice" 
        : "❌ Incorrect — Review the Distractor Rationale";
      expTitle.style.color = result.isCorrect ? "var(--success-color)" : "var(--error-color)";
    }

    if (expContent) {
      expContent.innerHTML = "";
      result.allOptions.forEach(opt => {
        const p = document.createElement("p");
        p.style.marginBottom = "0.5rem";
        p.innerHTML = `<strong>Option ${opt.id}:</strong> ${opt.explanation}`;
        expContent.appendChild(p);
      });
    }

    if (expTip) expTip.textContent = result.azureConceptTip;
    if (expRef) expRef.textContent = result.learnReference || "Microsoft Learn: AZ-900";

    if (explanationPanel) explanationPanel.classList.add("visible");

    // Show Next Button
    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
      nextBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Refresh header metrics
    this.renderHeaderPill();
  }

  // ==========================================
  // FLASHCARD STUDIO
  // ==========================================
  renderFlashcard() {
    const cardData = this.flashcardEngine.getCurrentCard();
    const cardInner = document.getElementById("flashcard-inner");

    if (cardInner) {
      cardInner.classList.remove("flipped");
    }

    if (!cardData) {
      const frontTerm = document.getElementById("fc-front-term");
      if (frontTerm) frontTerm.textContent = "No flashcards in this filter.";
      return;
    }

    // Front Face
    const categoryBadge = document.getElementById("fc-front-category");
    if (categoryBadge) categoryBadge.textContent = cardData.category;

    const frontTerm = document.getElementById("fc-front-term");
    if (frontTerm) frontTerm.textContent = cardData.term;

    const counter = document.getElementById("fc-counter");
    if (counter) counter.textContent = `Card ${cardData.cardNumber} of ${cardData.totalCards}`;

    // Back Face
    const backTerm = document.getElementById("fc-back-term");
    if (backTerm) backTerm.textContent = cardData.term;

    const def = document.getElementById("fc-back-definition");
    if (def) def.textContent = cardData.quickDefinition;

    const analogy = document.getElementById("fc-back-analogy");
    if (analogy) analogy.textContent = cardData.realWorldAnalogy;

    const trap = document.getElementById("fc-back-trap");
    if (trap) trap.textContent = cardData.examTrapWarning;

    // Mastery Progress
    const stats = this.flashcardEngine.getMasteryStats();
    const masteryTxt = document.getElementById("fc-mastery-text");
    if (masteryTxt) {
      masteryTxt.textContent = `Mastered: ${stats.masteredCount} / ${stats.totalCards} (${stats.percentage}%)`;
    }
  }

  // ==========================================
  // AI STUDY BUDDY (ANALOGIES)
  // ==========================================
  renderBuddy() {
    const sidebar = document.getElementById("buddy-concept-list");
    const concepts = this.buddyEngine.getAllConcepts();
    const current = this.buddyEngine.getCurrentConcept();

    if (sidebar) {
      sidebar.innerHTML = "";
      concepts.forEach(c => {
        const btn = document.createElement("button");
        btn.className = `buddy-item-btn ${c.id === current.id ? "active" : ""}`;
        btn.innerHTML = `
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.2rem;">${c.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-dim);">${c.tagline}</div>
        `;
        btn.addEventListener("click", () => {
          this.buddyEngine.selectConcept(c.id);
          this.renderBuddy();
        });
        sidebar.appendChild(btn);
      });
    }

    // Detail Display
    const titleEl = document.getElementById("buddy-detail-title");
    if (titleEl) titleEl.textContent = current.title;

    const domainEl = document.getElementById("buddy-detail-domain");
    if (domainEl) domainEl.textContent = current.domain;

    const simpleEl = document.getElementById("buddy-detail-simple");
    if (simpleEl) simpleEl.textContent = current.simpleExplanation;

    const africanEl = document.getElementById("buddy-detail-african");
    if (africanEl) africanEl.textContent = current.africanAnalogy;

    const trapEl = document.getElementById("buddy-detail-trap");
    if (trapEl) trapEl.textContent = current.examTrap;
  }

  // ==========================================
  // PERSONAL STUDY PLANNER
  // ==========================================
  renderPlanner() {
    const storedDate = this.readinessEngine.state.studyTargetDate;
    const storedMinutes = this.readinessEngine.state.dailyStudyMinutes || 30;

    const dateInput = document.getElementById("planner-date");
    if (dateInput && !dateInput.value) {
      if (storedDate) {
        dateInput.value = storedDate;
      } else {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        dateInput.value = d.toISOString().split("T")[0];
      }
    }

    const minutesInput = document.getElementById("planner-minutes");
    if (minutesInput && !minutesInput.value) {
      minutesInput.value = storedMinutes;
    }

    const planData = this.plannerEngine.generatePlan(
      dateInput ? dateInput.value : storedDate,
      minutesInput ? parseInt(minutesInput.value, 10) : storedMinutes
    );

    const summaryEl = document.getElementById("planner-countdown-banner");
    if (summaryEl) {
      summaryEl.textContent = `🎯 Exam in ${planData.diffDays} day(s) on ${planData.targetDateFormatted} • Dedicated daily budget: ${planData.dailyMinutes} min/day`;
    }

    const timelineContainer = document.getElementById("planner-timeline-container");
    if (timelineContainer) {
      timelineContainer.innerHTML = "";
      planData.plan.forEach(item => {
        const card = document.createElement("div");
        card.className = "timeline-card";

        card.innerHTML = `
          <div class="timeline-day-badge">
            Day ${item.dayNumber}
            <span>${item.dateFormatted.split(",")[0]}</span>
          </div>
          <div class="timeline-content">
            <div class="badge badge-concepts" style="margin-bottom: 0.3rem;">${item.domain}</div>
            <div class="timeline-focus">${item.focus}</div>
            <div class="timeline-desc">⚡ Mission: ${item.activity} (${item.estimatedMinutes} mins)</div>
          </div>
          <div>
            ${item.isToday ? '<span class="badge" style="background: var(--azure-blue); color:white;">Today\'s Target</span>' : ""}
            ${item.isExamDay ? '<span class="badge" style="background: var(--success-color); color:white;">Exam Day 🚀</span>' : ""}
          </div>
        `;

        timelineContainer.appendChild(card);
      });
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new AzureVibeApp();
  app.init();
});
