/**
 * AzureVibe Production Backend Service
 * Serves the Single-Page Application and exposes RESTful API endpoints for the AZ-900 Prep Suite.
 */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { DOMAINS, QUESTIONS, FLASHCARDS, AI_BUDDY_CONCEPTS } from "./js/data/az900-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-Memory Database / Session Cache (extensible to Supabase/PostgreSQL)
const sessionStore = {
  domains: {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 }
  },
  flashcardsMastered: [],
  weakQuestionIds: [],
  attemptsHistory: []
};

// ==========================================
// REST API ROUTES (/api/v1)
// ==========================================

// 1. Health & System Info
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "AzureVibe Backend API",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. Official AZ-900 Domains & Exam Weights
app.get("/api/v1/domains", (req, res) => {
  res.json({
    success: true,
    domains: DOMAINS
  });
});

// 3. Quiz Questions (with optional domain and weak filter)
app.get("/api/v1/questions", (req, res) => {
  const { domain, filter } = req.query;
  let result = [...QUESTIONS];

  if (filter === "weak") {
    result = result.filter(q => sessionStore.weakQuestionIds.includes(q.id));
    if (result.length === 0) result = [...QUESTIONS];
  } else if (domain) {
    const dId = parseInt(domain, 10);
    result = result.filter(q => q.domainId === dId);
  }

  res.json({
    success: true,
    count: result.length,
    questions: result
  });
});

// 4. Submit Quiz Answer (Server-side evaluation & distractor explanation)
app.post("/api/v1/quiz/submit", (req, res) => {
  const { questionId, selectedOptionId } = req.body;

  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ success: false, error: "Question not found" });
  }

  const chosenOption = question.options.find(opt => opt.id === selectedOptionId);
  const correctOption = question.options.find(opt => opt.isCorrect);
  const isCorrect = chosenOption ? chosenOption.isCorrect : false;

  // Record session stats
  if (!sessionStore.domains[question.domainId]) {
    sessionStore.domains[question.domainId] = { correct: 0, total: 0 };
  }
  sessionStore.domains[question.domainId].total += 1;

  if (isCorrect) {
    sessionStore.domains[question.domainId].correct += 1;
    sessionStore.weakQuestionIds = sessionStore.weakQuestionIds.filter(id => id !== questionId);
  } else {
    if (!sessionStore.weakQuestionIds.includes(questionId)) {
      sessionStore.weakQuestionIds.push(questionId);
    }
  }

  sessionStore.attemptsHistory.push({
    questionId,
    domainId: question.domainId,
    selectedOptionId,
    isCorrect,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    evaluation: {
      isCorrect,
      selectedOption: chosenOption,
      correctOption,
      allOptions: question.options,
      azureConceptTip: question.azureConceptTip,
      learnReference: question.learnReference
    }
  });
});

// 5. Flashcards
app.get("/api/v1/flashcards", (req, res) => {
  const { domain, status } = req.query;
  let pool = [...FLASHCARDS];

  if (status === "review") {
    pool = pool.filter(c => !sessionStore.flashcardsMastered.includes(c.id));
    if (pool.length === 0) pool = [...FLASHCARDS];
  } else if (domain) {
    const dId = parseInt(domain, 10);
    pool = pool.filter(c => c.domainId === dId);
  }

  const enriched = pool.map(c => ({
    ...c,
    isMastered: sessionStore.flashcardsMastered.includes(c.id)
  }));

  res.json({
    success: true,
    count: enriched.length,
    masteredCount: sessionStore.flashcardsMastered.length,
    flashcards: enriched
  });
});

// 6. Update Flashcard Mastery
app.post("/api/v1/flashcards/:id/mastery", (req, res) => {
  const { id } = req.params;
  const { isMastered } = req.body;

  if (isMastered) {
    if (!sessionStore.flashcardsMastered.includes(id)) {
      sessionStore.flashcardsMastered.push(id);
    }
  } else {
    sessionStore.flashcardsMastered = sessionStore.flashcardsMastered.filter(cid => cid !== id);
  }

  res.json({
    success: true,
    cardId: id,
    isMastered: sessionStore.flashcardsMastered.includes(id),
    totalMastered: sessionStore.flashcardsMastered.length
  });
});

// 7. AI Study Buddy Concept Analogies
app.get("/api/v1/analogies", (req, res) => {
  res.json({
    success: true,
    count: AI_BUDDY_CONCEPTS.length,
    concepts: AI_BUDDY_CONCEPTS
  });
});

// 8. Personal Study Planner Generator
app.post("/api/v1/planner", (req, res) => {
  const { targetDate, dailyMinutes = 30 } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tDate = targetDate ? new Date(targetDate) : new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  tDate.setHours(0, 0, 0, 0);

  const diffDays = Math.max(1, Math.ceil((tDate - today) / (1000 * 60 * 60 * 24)));

  const missionTemplates = [
    { domain: "Domain 1: Cloud Concepts", focus: "Shared Responsibility & Cloud Models", activity: "IaaS vs PaaS vs SaaS analogies + 10 Flashcards" },
    { domain: "Domain 1: Cloud Concepts", focus: "Cloud Benefits & CapEx vs OpEx", activity: "Elasticity vs Scalability + Domain 1 Quiz" },
    { domain: "Domain 2: Architecture & Services", focus: "Regions, Availability Zones & Region Pairs", activity: "Infrastructure cards + Datacenter failover" },
    { domain: "Domain 2: Architecture & Services", focus: "Compute (VMs, Containers, Functions)", activity: "VMs vs ACI vs AKS + Compute Quiz" },
    { domain: "Domain 2: Architecture & Services", focus: "Storage Tiers & Azure Networking", activity: "Blob Tiers + ExpressRoute vs VPN" },
    { domain: "Domain 3: Management & Governance", focus: "Azure Policy, RBAC & Resource Locks", activity: "Policy vs RBAC + CanNotDelete locks" },
    { domain: "Domain 3: Management & Governance", focus: "Pricing Calculator, TCO & Service Health", activity: "TCO vs Pricing Calculator + Governance Quiz" },
    { domain: "Final Review", focus: "Weak Areas Blitz & Exam Simulation", activity: "Retest all weak questions until Readiness >= 85%" }
  ];

  const plan = [];
  for (let i = 0; i < Math.min(diffDays, 14); i++) {
    const item = missionTemplates[i % missionTemplates.length];
    const dayDate = new Date(today);
    dayDate.setDate(dayDate.getDate() + i);

    plan.push({
      dayNumber: i + 1,
      dateFormatted: dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      domain: item.domain,
      focus: item.focus,
      activity: item.activity,
      estimatedMinutes: dailyMinutes,
      isToday: i === 0,
      isExamDay: i === diffDays - 1
    });
  }

  res.json({
    success: true,
    diffDays,
    targetDateFormatted: tDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    dailyMinutes,
    plan
  });
});

// 9. Composite Weighted Readiness Calculator (28% C, 37% A, 35% G)
app.get("/api/v1/readiness", (req, res) => {
  let weightedSum = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;
  const domainBreakdown = {};

  for (let id = 1; id <= 3; id++) {
    const stats = sessionStore.domains[id] || { correct: 0, total: 0 };
    const score = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    const weight = DOMAINS[id].weight;

    weightedSum += (score * weight);
    totalAttempted += stats.total;
    totalCorrect += stats.correct;

    domainBreakdown[id] = {
      name: DOMAINS[id].name,
      weightPercentage: Math.round(weight * 100),
      score,
      correct: stats.correct,
      total: stats.total,
      color: DOMAINS[id].color
    };
  }

  const overallScore = Math.round(weightedSum);
  const scaledScore = Math.round((overallScore / 100) * 1000);

  let statusLabel = "Just Starting";
  if (totalAttempted >= 4) {
    if (overallScore >= 85) statusLabel = "Exam Ready 🎯";
    else if (overallScore >= 70) statusLabel = "Passing Zone ⚡";
    else statusLabel = "Needs Reinforcement 📚";
  }

  res.json({
    success: true,
    readinessScore: overallScore,
    scaledScore,
    passingThreshold: 700,
    statusLabel,
    totalAttempted,
    totalCorrect,
    weakQuestionsCount: sessionStore.weakQuestionIds.length,
    flashcardsMasteredCount: sessionStore.flashcardsMastered.length,
    domainBreakdown
  });
});

// 10. Reset Progress
app.post("/api/v1/reset", (req, res) => {
  sessionStore.domains = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 }
  };
  sessionStore.flashcardsMastered = [];
  sessionStore.weakQuestionIds = [];
  sessionStore.attemptsHistory = [];

  res.json({ success: true, message: "Progress reset successfully" });
});

// Serve frontend static assets (prefer public directory)
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));
app.use(express.static(__dirname));

// Fallback all other GET requests to index.html (SPA routing)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(publicDir, "index.html"));
});

// Start listening only when executed directly (not when imported in tests)
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  app.listen(PORT, () => {
    console.log(`🚀 AzureVibe Full-Stack Server running at: http://localhost:${PORT}`);
    console.log(`📡 REST API endpoints active under: http://localhost:${PORT}/api/v1/`);
  });
}

export default app;
