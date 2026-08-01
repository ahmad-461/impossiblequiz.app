-- Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname TEXT NOT NULL,
    category TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    questions_answered INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: daily_challenge
CREATE TABLE IF NOT EXISTS daily_challenge (
    date TEXT PRIMARY KEY, -- e.g. "2025-05-12"
    category TEXT NOT NULL, -- e.g. "programming"
    questions JSONB NOT NULL, -- list of 5 question objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: daily_leaderboard
CREATE TABLE IF NOT EXISTS daily_leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL, -- e.g. "2025-05-12"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS daily_leaderboard_date_score_idx ON daily_leaderboard(date, score DESC);
