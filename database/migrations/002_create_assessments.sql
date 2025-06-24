-- Migration: Create assessment and paramita scoring tables
-- Version: 002
-- Description: Core assessment engine and Six Perfections scoring schema

BEGIN;

-- Assessment instruments/templates
CREATE TABLE assessments.assessment_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    version VARCHAR(20) NOT NULL,
    paramita paramita_type,
    total_questions INTEGER NOT NULL,
    estimated_duration INTEGER, -- in minutes
    is_active BOOLEAN DEFAULT TRUE,
    validation_study_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT assessment_instruments_duration_positive CHECK (estimated_duration > 0)
);

-- Individual assessment questions
CREATE TABLE assessments.assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instrument_id UUID NOT NULL REFERENCES assessments.assessment_instruments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_text_sanskrit TEXT,
    question_text_tibetan TEXT,
    question_order INTEGER NOT NULL,
    response_type VARCHAR(20) DEFAULT 'likert_5', -- likert_5, likert_7, yes_no, multiple_choice
    response_options JSONB DEFAULT '[]',
    reverse_scored BOOLEAN DEFAULT FALSE,
    paramita_aspect VARCHAR(50), -- specific aspect of the paramita being measured
    weight DECIMAL(3,2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT assessment_questions_order_positive CHECK (question_order > 0),
    CONSTRAINT assessment_questions_weight_valid CHECK (weight >= 0 AND weight <= 5.0)
);

-- User assessment sessions
CREATE TABLE assessments.user_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    instrument_id UUID NOT NULL REFERENCES assessments.assessment_instruments(id),
    assessment_type VARCHAR(20) DEFAULT 'comprehensive', -- comprehensive, paramita_specific, follow_up
    status assessment_status DEFAULT 'draft',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER,
    context JSONB DEFAULT '{}', -- meditation state, time of day, mood, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual question responses
CREATE TABLE assessments.assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments.user_assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES assessments.assessment_questions(id),
    response_value INTEGER,
    response_text TEXT,
    response_time_seconds INTEGER,
    confidence_level INTEGER, -- 1-5 scale of how confident user is in their response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT assessment_responses_response_value_valid CHECK (response_value >= 1 AND response_value <= 7),
    CONSTRAINT assessment_responses_confidence_valid CHECK (confidence_level >= 1 AND confidence_level <= 5)
);

-- Paramita scores (calculated results)
CREATE TABLE assessments.paramita_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments.user_assessments(id) ON DELETE CASCADE,
    paramita paramita_type NOT NULL,
    raw_score DECIMAL(6,2) NOT NULL,
    normalized_score DECIMAL(5,2) NOT NULL, -- 0-100 scale
    percentile_rank DECIMAL(5,2),
    confidence_interval_lower DECIMAL(5,2),
    confidence_interval_upper DECIMAL(5,2),
    calculation_method VARCHAR(50) DEFAULT 'weighted_sum',
    benchmark_group VARCHAR(50) DEFAULT 'general_population',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT paramita_scores_normalized_valid CHECK (normalized_score >= 0 AND normalized_score <= 100),
    CONSTRAINT paramita_scores_percentile_valid CHECK (percentile_rank >= 0 AND percentile_rank <= 100)
);

-- Overall spiritual development profile
CREATE TABLE assessments.spiritual_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID PRIMARY KEY REFERENCES users.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments.user_assessments(id),
    overall_score DECIMAL(5,2) NOT NULL,
    development_stage VARCHAR(50),
    strongest_paramita paramita_type,
    growth_area_paramita paramita_type,
    practice_recommendations JSONB DEFAULT '[]',
    next_assessment_recommended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT spiritual_profiles_overall_score_valid CHECK (overall_score >= 0 AND overall_score <= 100)
);

-- Progress tracking over time
CREATE TABLE assessments.progress_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    paramita paramita_type NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    score_change DECIMAL(5,2), -- change from previous assessment
    measurement_date DATE NOT NULL,
    assessment_id UUID REFERENCES assessments.user_assessments(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT progress_snapshots_score_valid CHECK (score >= 0 AND score <= 100)
);

-- Daily practice tracking
CREATE TABLE assessments.daily_practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    practice_date DATE NOT NULL,
    practice_type practice_type NOT NULL,
    duration_minutes INTEGER,
    intensity_level INTEGER, -- 1-5 scale
    paramita_focus paramita_type,
    quality_rating INTEGER, -- 1-5 scale
    notes TEXT,
    mood_before INTEGER, -- 1-5 scale
    mood_after INTEGER, -- 1-5 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT daily_practices_duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT daily_practices_intensity_valid CHECK (intensity_level >= 1 AND intensity_level <= 5),
    CONSTRAINT daily_practices_quality_valid CHECK (quality_rating >= 1 AND quality_rating <= 5),
    CONSTRAINT daily_practices_mood_valid CHECK (mood_before >= 1 AND mood_before <= 5 AND mood_after >= 1 AND mood_after <= 5)
);

-- Training goals and milestones
CREATE TABLE assessments.training_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    paramita paramita_type NOT NULL,
    target_score DECIMAL(5,2) NOT NULL,
    current_score DECIMAL(5,2),
    target_date DATE,
    goal_description TEXT,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT training_goals_target_score_valid CHECK (target_score >= 0 AND target_score <= 100),
    CONSTRAINT training_goals_current_score_valid CHECK (current_score >= 0 AND current_score <= 100)
);

-- Create indexes for performance
CREATE INDEX idx_assessment_instruments_paramita ON assessments.assessment_instruments(paramita);
CREATE INDEX idx_assessment_instruments_active ON assessments.assessment_instruments(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_assessment_questions_instrument ON assessments.assessment_questions(instrument_id);
CREATE INDEX idx_assessment_questions_order ON assessments.assessment_questions(question_order);

CREATE INDEX idx_user_assessments_user_id ON assessments.user_assessments(user_id);
CREATE INDEX idx_user_assessments_status ON assessments.user_assessments(status);
CREATE INDEX idx_user_assessments_started_at ON assessments.user_assessments(started_at);
CREATE INDEX idx_user_assessments_completed_at ON assessments.user_assessments(completed_at);

CREATE INDEX idx_assessment_responses_assessment_id ON assessments.assessment_responses(assessment_id);
CREATE INDEX idx_assessment_responses_question_id ON assessments.assessment_responses(question_id);

CREATE INDEX idx_paramita_scores_user_id ON assessments.paramita_scores(user_id);
CREATE INDEX idx_paramita_scores_paramita ON assessments.paramita_scores(paramita);
CREATE INDEX idx_paramita_scores_created_at ON assessments.paramita_scores(created_at);

CREATE INDEX idx_progress_snapshots_user_id ON assessments.progress_snapshots(user_id);
CREATE INDEX idx_progress_snapshots_paramita ON assessments.progress_snapshots(paramita);
CREATE INDEX idx_progress_snapshots_date ON assessments.progress_snapshots(measurement_date);

CREATE INDEX idx_daily_practices_user_id ON assessments.daily_practices(user_id);
CREATE INDEX idx_daily_practices_date ON assessments.daily_practices(practice_date);
CREATE INDEX idx_daily_practices_type ON assessments.daily_practices(practice_type);
CREATE INDEX idx_daily_practices_paramita ON assessments.daily_practices(paramita_focus);

CREATE INDEX idx_training_goals_user_id ON assessments.training_goals(user_id);
CREATE INDEX idx_training_goals_paramita ON assessments.training_goals(paramita);
CREATE INDEX idx_training_goals_target_date ON assessments.training_goals(target_date);

-- Create triggers for updated_at columns
CREATE TRIGGER update_assessment_instruments_updated_at
    BEFORE UPDATE ON assessments.assessment_instruments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_assessments_updated_at
    BEFORE UPDATE ON assessments.user_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spiritual_profiles_updated_at
    BEFORE UPDATE ON assessments.spiritual_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_goals_updated_at
    BEFORE UPDATE ON assessments.training_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT; 