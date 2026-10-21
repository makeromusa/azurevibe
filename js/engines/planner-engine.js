/**
 * Personal Study Planner Engine
 * Calculates dynamic study roadmaps based on target exam date and daily available hours.
 */

export class PlannerEngine {
  constructor(readinessEngine) {
    this.readinessEngine = readinessEngine;
  }

  generatePlan(targetDateStr, dailyMinutes = 30) {
    if (!targetDateStr) {
      // Default to 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      targetDateStr = d.toISOString().split("T")[0];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Save target date into readiness state
    this.readinessEngine.state.studyTargetDate = targetDateStr;
    this.readinessEngine.state.dailyStudyMinutes = dailyMinutes;
    this.readinessEngine.saveState();

    const plan = [];

    // Curriculum progression templates mapped across the 3 domains
    const missionTemplates = [
      {
        day: 1,
        domain: "Domain 1: Cloud Concepts (28%)",
        focus: "Shared Responsibility & Cloud Models",
        activity: "Read IaaS vs PaaS vs SaaS analogies + 10 Flashcards",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 2,
        domain: "Domain 1: Cloud Concepts (28%)",
        focus: "Cloud Benefits & CapEx vs OpEx",
        activity: "Master Elasticity vs Scalability + Complete Domain 1 Smart Quiz",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 3,
        domain: "Domain 2: Architecture & Services (37%)",
        focus: "Regions, Availability Zones & Region Pairs",
        activity: "Drill physical infrastructure cards + Review Datacenter Failover",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 4,
        domain: "Domain 2: Architecture & Services (37%)",
        focus: "Compute (VMs, Containers, Functions)",
        activity: "Compare VMs vs ACI vs AKS + Complete Compute Quiz Questions",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 5,
        domain: "Domain 2: Architecture & Services (37%)",
        focus: "Storage Tiers & Azure Networking",
        activity: "Study Blob Access Tiers (Hot/Cool/Archive) + ExpressRoute vs VPN",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 6,
        domain: "Domain 3: Management & Governance (35%)",
        focus: "Azure Policy, RBAC & Resource Locks",
        activity: "Distinguish Policy vs RBAC + Test CanNotDelete Lock Scenarios",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 7,
        domain: "Domain 3: Management & Governance (35%)",
        focus: "Pricing Calculator, TCO & Service Health",
        activity: "TCO vs Pricing Calculator review + Complete Governance Quiz",
        estimatedMinutes: dailyMinutes
      },
      {
        day: 8,
        domain: "Final Review & Certification Simulation",
        focus: "Weak Areas Blitz & Full Exam Readiness Check",
        activity: "Drill all flagged weak questions until Readiness Gauge reaches >= 85%",
        estimatedMinutes: dailyMinutes + 15
      }
    ];

    // Build timeline adapted to days left
    for (let i = 0; i < Math.min(diffDays, 14); i++) {
      const template = missionTemplates[i % missionTemplates.length];
      const planDayDate = new Date(today);
      planDayDate.setDate(planDayDate.getDate() + i);

      plan.push({
        dayNumber: i + 1,
        dateFormatted: planDayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        domain: template.domain,
        focus: template.focus,
        activity: template.activity,
        estimatedMinutes: template.estimatedMinutes,
        isToday: i === 0,
        isExamDay: i === diffDays - 1
      });
    }

    return {
      diffDays,
      targetDateFormatted: targetDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      dailyMinutes,
      plan
    };
  }
}
