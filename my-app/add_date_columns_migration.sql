-- Migration script to add start_date and end_date columns to existing tasks table
-- Run this script if you have an existing database

-- Add start_date column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'start_date') THEN
        ALTER TABLE tasks ADD COLUMN start_date DATE;
    END IF;
END $$;

-- Add end_date column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'end_date') THEN
        ALTER TABLE tasks ADD COLUMN end_date DATE;
    END IF;
END $$;