/**
 * Automated Backend API Test Suite
 * Validates all REST endpoints using Node.js native test runner.
 */

import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import app from "../server.js";

let server;
const TEST_PORT = 8099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Helper: Make HTTP request to test server
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(TEST_PORT, resolve);
  });
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test("API: GET /api/v1/health returns healthy status", async () => {
  const res = await request("/api/v1/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "healthy");
  assert.equal(res.body.service, "AzureVibe Backend API");
});

test("API: GET /api/v1/domains returns 3 official AZ-900 domains with correct weights", async () => {
  const res = await request("/api/v1/domains");
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const d = res.body.domains;
  assert.equal(d[1].weight, 0.28);
  assert.equal(d[2].weight, 0.37);
  assert.equal(d[3].weight, 0.35);
});

test("API: GET /api/v1/questions returns all questions and filters by domain", async () => {
  const allRes = await request("/api/v1/questions");
  assert.equal(allRes.status, 200);
  assert.ok(allRes.body.count >= 10);

  const d1Res = await request("/api/v1/questions?domain=1");
  assert.equal(d1Res.status, 200);
  d1Res.body.questions.forEach(q => assert.equal(q.domainId, 1));
});

test("API: POST /api/v1/quiz/submit evaluates answer correctly", async () => {
  const payload = {
    questionId: "q-c-01",
    selectedOptionId: "B" // Correct answer for IaaS responsibility
  };

  const res = await request("/api/v1/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.evaluation.isCorrect, true);
  assert.equal(res.body.evaluation.selectedOption.id, "B");
  assert.ok(res.body.evaluation.azureConceptTip.length > 0);
});

test("API: GET /api/v1/flashcards returns cards and mastery state", async () => {
  const res = await request("/api/v1/flashcards");
  assert.equal(res.status, 200);
  assert.ok(res.body.flashcards.length >= 10);
});

test("API: POST /api/v1/planner generates dynamic day-by-day roadmap", async () => {
  const res = await request("/api/v1/planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { targetDate: "2026-10-31", dailyMinutes: 45 }
  });

  assert.equal(res.status, 200);
  assert.ok(res.body.plan.length > 0);
  assert.equal(res.body.dailyMinutes, 45);
});

test("API: GET /api/v1/readiness returns composite score calculation", async () => {
  const res = await request("/api/v1/readiness");
  assert.equal(res.status, 200);
  assert.equal(res.body.passingThreshold, 700);
  assert.ok("readinessScore" in res.body);
  assert.ok("domainBreakdown" in res.body);
});
