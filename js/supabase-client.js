/**
 * AzureVibe Supabase Cloud Service Adapter
 * Provides real-time synchronization with Supabase PostgreSQL tables.
 * Gracefully operates offline / in local-cache mode when credentials are not yet configured.
 */

class SupabaseService {
  constructor() {
    this.userId = this.getOrCreateUserId();
    this.supabase = null;
    this.isConfigured = false;
    this.initClient();
  }

  getOrCreateUserId() {
    let id = localStorage.getItem("azurevibe_user_id");
    if (!id) {
      id = (typeof crypto !== "undefined" && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : "user-" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("azurevibe_user_id", id);
    }
    return id;
  }

  async initClient() {
    // Check if Supabase keys are in global window config or environment
    const url = window.__SUPABASE_URL__ || localStorage.getItem("azurevibe_supabase_url") || "https://ctwazhgsnvneinuhjdbk.supabase.co";
    const key = window.__SUPABASE_ANON_KEY__ || localStorage.getItem("azurevibe_supabase_key") || "sb_publishable_uPN4KWM97TKv3GX0c340FQ_gYVv3bSM";

    if (url && key && window.supabase) {
      try {
        this.supabase = window.supabase.createClient(url, key);
        this.isConfigured = true;
        console.log("⚡ Supabase connected live to:", url);

        // Update UI pill if present
        const updatePill = () => {
          const pill = document.getElementById("btn-cloud-status");
          if (pill) {
            pill.innerHTML = "🟢 Supabase: Live (London)";
            pill.style.borderColor = "rgba(16, 185, 129, 0.6)";
            pill.style.color = "#34d399";
          }
        };

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", updatePill);
        } else {
          updatePill();
        }
      } catch (err) {
        console.warn("Supabase init error, operating in resilient offline mode:", err);
      }
    }
  }

  async recordQuizAttempt(questionId, domainId, selectedOption, isCorrect) {
    if (this.isConfigured && this.supabase) {
      try {
        await this.supabase.from("quiz_attempts").insert({
          user_id: this.userId,
          question_id: questionId,
          domain_id: domainId,
          selected_option_letter: selectedOption,
          is_correct: isCorrect
        });
      } catch (e) {
        console.warn("Supabase sync attempt failed:", e);
      }
    }
  }

  async setFlashcardMastery(cardId, isMastered) {
    if (this.isConfigured && this.supabase) {
      try {
        await this.supabase.from("user_flashcard_progress").upsert({
          user_id: this.userId,
          flashcard_id: cardId,
          is_mastered: isMastered,
          last_reviewed_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Supabase flashcard sync failed:", e);
      }
    }
  }

  async toggleBookmark(questionId, notes = "") {
    const key = "azurevibe_bookmarks";
    let list = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = list.includes(questionId);

    if (exists) {
      list = list.filter(id => id !== questionId);
    } else {
      list.push(questionId);
    }
    localStorage.setItem(key, JSON.stringify(list));

    if (this.isConfigured && this.supabase) {
      try {
        if (exists) {
          await this.supabase.from("user_bookmarks").delete().match({ user_id: this.userId, question_id: questionId });
        } else {
          await this.supabase.from("user_bookmarks").insert({ user_id: this.userId, question_id: questionId, notes });
        }
      } catch (e) {
        console.warn("Supabase bookmark sync failed:", e);
      }
    }

    return !exists;
  }

  getBookmarks() {
    return JSON.parse(localStorage.getItem("azurevibe_bookmarks") || "[]");
  }

  async saveStudyPlan(targetDate, dailyMinutes, planMatrix) {
    if (this.isConfigured && this.supabase) {
      try {
        await this.supabase.from("study_plans").insert({
          user_id: this.userId,
          target_exam_date: targetDate,
          daily_minutes: dailyMinutes,
          plan_matrix: planMatrix
        });
      } catch (e) {
        console.warn("Supabase study plan sync failed:", e);
      }
    }
  }
}

export const supabaseService = new SupabaseService();
