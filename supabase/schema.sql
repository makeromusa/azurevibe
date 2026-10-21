-- ============================================================================
-- AzureVibe: Production PostgreSQL Database Schema for Supabase
-- Aligned with Microsoft Certified: Azure Fundamentals (AZ-900) Curriculum
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLE: domains (The 3 official AZ-900 learning paths)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.domains (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    official_title VARCHAR(255) NOT NULL,
    weight NUMERIC(3, 2) NOT NULL CHECK (weight > 0 AND weight <= 1),
    color VARCHAR(20) NOT NULL,
    badge_class VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. TABLE: questions (Scenario-based practice questions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
    id VARCHAR(50) PRIMARY KEY,
    domain_id INT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    topic VARCHAR(150) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'scenario' CHECK (difficulty IN ('beginner', 'intermediate', 'scenario')),
    scenario TEXT NOT NULL,
    question TEXT NOT NULL,
    azure_concept_tip TEXT NOT NULL,
    learn_reference_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for domain lookups
CREATE INDEX IF NOT EXISTS idx_questions_domain ON public.questions(domain_id);

-- ----------------------------------------------------------------------------
-- 3. TABLE: question_options (A, B, C, D with distractor explanations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id VARCHAR(50) NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_letter VARCHAR(2) NOT NULL CHECK (option_letter IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT NOT NULL,
    UNIQUE (question_id, option_letter)
);

CREATE INDEX IF NOT EXISTS idx_question_options_qid ON public.question_options(question_id);

-- ----------------------------------------------------------------------------
-- 4. TABLE: flashcards (Active recall cards with analogies & traps)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcards (
    id VARCHAR(50) PRIMARY KEY,
    domain_id INT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    term VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quick_definition TEXT NOT NULL,
    real_world_analogy TEXT NOT NULL,
    exam_trap_warning TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. TABLE: concept_analogies (AI Study Buddy localized analogies)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.concept_analogies (
    id VARCHAR(50) PRIMARY KEY,
    domain_id INT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    tagline VARCHAR(200) NOT NULL,
    simple_explanation TEXT NOT NULL,
    african_analogy TEXT NOT NULL,
    exam_trap TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. TABLE: quiz_attempts (Learner performance telemetry)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    question_id VARCHAR(50) NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    domain_id INT NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    selected_option_letter VARCHAR(2) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_domain ON public.quiz_attempts(user_id, domain_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. TABLE: user_flashcard_progress (Leitner spaced repetition state)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_flashcard_progress (
    user_id UUID NOT NULL,
    flashcard_id VARCHAR(50) NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
    review_count INT NOT NULL DEFAULT 1,
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, flashcard_id)
);

-- ----------------------------------------------------------------------------
-- 8. TABLE: user_bookmarks (Saved tricky questions for blitz review)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    user_id UUID NOT NULL,
    question_id VARCHAR(50) NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, question_id)
);

-- ----------------------------------------------------------------------------
-- 9. TABLE: study_plans (Saved temporal cadence roadmaps)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    target_exam_date DATE NOT NULL,
    daily_minutes INT NOT NULL DEFAULT 30,
    plan_matrix JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STORED FUNCTION: compute_user_readiness(p_user_id)
-- Computes the exact composite weighted score in SQL:
-- Readiness = (0.28 * S1) + (0.37 * S2) + (0.35 * S3)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.compute_user_readiness(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_s1 NUMERIC := 0;
    v_s2 NUMERIC := 0;
    v_s3 NUMERIC := 0;
    v_tot1 INT := 0;
    v_tot2 INT := 0;
    v_tot3 INT := 0;
    v_cor1 INT := 0;
    v_cor2 INT := 0;
    v_cor3 INT := 0;
    v_readiness INT := 0;
    v_scaled INT := 0;
    v_status TEXT := 'Just Starting';
BEGIN
    -- Domain 1 stats
    SELECT COUNT(*), COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)
    INTO v_tot1, v_cor1
    FROM public.quiz_attempts WHERE user_id = p_user_id AND domain_id = 1;
    IF v_tot1 > 0 THEN v_s1 := (v_cor1::NUMERIC / v_tot1::NUMERIC) * 100; END IF;

    -- Domain 2 stats
    SELECT COUNT(*), COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)
    INTO v_tot2, v_cor2
    FROM public.quiz_attempts WHERE user_id = p_user_id AND domain_id = 2;
    IF v_tot2 > 0 THEN v_s2 := (v_cor2::NUMERIC / v_tot2::NUMERIC) * 100; END IF;

    -- Domain 3 stats
    SELECT COUNT(*), COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)
    INTO v_tot3, v_cor3
    FROM public.quiz_attempts WHERE user_id = p_user_id AND domain_id = 3;
    IF v_tot3 > 0 THEN v_s3 := (v_cor3::NUMERIC / v_tot3::NUMERIC) * 100; END IF;

    -- Weighted sum
    v_readiness := ROUND((v_s1 * 0.28) + (v_s2 * 0.37) + (v_s3 * 0.35));
    v_scaled := v_readiness * 10;

    IF (v_tot1 + v_tot2 + v_tot3) >= 4 THEN
        IF v_readiness >= 85 THEN v_status := 'Exam Ready 🎯';
        ELSIF v_readiness >= 70 THEN v_status := 'Passing Zone ⚡';
        ELSE v_status := 'Needs Reinforcement 📚';
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'readinessScore', v_readiness,
        'scaledScore', v_scaled,
        'passingThreshold', 700,
        'statusLabel', v_status,
        'totalAnswered', (v_tot1 + v_tot2 + v_tot3),
        'domain1', jsonb_build_object('score', ROUND(v_s1), 'correct', v_cor1, 'total', v_tot1),
        'domain2', jsonb_build_object('score', ROUND(v_s2), 'correct', v_cor2, 'total', v_tot2),
        'domain3', jsonb_build_object('score', ROUND(v_s3), 'correct', v_cor3, 'total', v_tot3)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_analogies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Public read-only for educational content
CREATE POLICY "Public domains view" ON public.domains FOR SELECT USING (true);
CREATE POLICY "Public questions view" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public options view" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Public flashcards view" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "Public analogies view" ON public.concept_analogies FOR SELECT USING (true);

-- User-scoped telemetry read & write (allows anonymous guest UUIDs or Supabase Auth)
CREATE POLICY "User attempts insert" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "User attempts select" ON public.quiz_attempts FOR SELECT USING (true);
CREATE POLICY "User cards progress all" ON public.user_flashcard_progress FOR ALL USING (true);
CREATE POLICY "User bookmarks all" ON public.user_bookmarks FOR ALL USING (true);
CREATE POLICY "User plans all" ON public.study_plans FOR ALL USING (true);

-- ============================================================================
-- SEED DATA: Inserting Official AZ-900 Domains
-- ============================================================================
INSERT INTO public.domains (id, name, official_title, weight, color, badge_class, description)
VALUES 
(1, 'Cloud Concepts', 'Describe cloud concepts', 0.28, '#8B5CF6', 'badge-concepts', 'Cloud models, shared responsibility, cloud benefits, and CapEx vs OpEx.'),
(2, 'Azure Architecture & Services', 'Describe Azure architecture and services', 0.37, '#10B981', 'badge-architecture', 'Regions, Availability Zones, Compute, Networking, Storage, and Databases.'),
(3, 'Management & Governance', 'Describe Azure management and governance', 0.35, '#F59E0B', 'badge-governance', 'Cost Management, Governance, Policy, RBAC, Locks, and Monitoring.')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    weight = EXCLUDED.weight, 
    description = EXCLUDED.description;
