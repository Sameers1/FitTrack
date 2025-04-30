# Supabase Migration History

## Current Schema (as of April 30, 2025)

### Tables
- users (public)
  - Added: username (text, unique)
  - Added: last_seen (timestamp with time zone)
  - Added: username search index (GiST with trigram)
  - Added: last_seen auto-update trigger
- friendships (public)
  - Added: unique_friendship constraint (user_id, friend_id)
  - Added: foreign key constraints to auth.users
- chat_messages (public)
- chat_groups (public)
- chat_group_members (public)
- chat_group_messages (public)
- social_posts (public)
- post_reactions (public)
- post_comments (public)
- user_fitness_profiles (public)
- hydration_logs (public)

### Extensions
- pg_trgm (for text search)

## Planned Changes
- [x] Add `username` column to users table
- [x] Add `last_seen` column to users table for online status
- [x] Add unique constraint to friendships table
- [x] Add text search capabilities for username search

## Migration History

### [Completed] add_username_and_last_seen_step1 (April 30, 2025)
```sql
-- Add username and last_seen columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS last_seen timestamp with time zone DEFAULT now();
```

### [Completed] fix_friendships_foreign_keys (April 30, 2025)
```sql
-- Drop existing foreign keys if any
ALTER TABLE IF EXISTS public.friendships
    DROP CONSTRAINT IF EXISTS friendships_user_id_fkey,
    DROP CONSTRAINT IF EXISTS friendships_friend_id_fkey;

-- Add proper foreign key constraints
ALTER TABLE public.friendships
    ADD CONSTRAINT friendships_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id),
    ADD CONSTRAINT friendships_friend_id_fkey 
    FOREIGN KEY (friend_id) 
    REFERENCES auth.users(id);
```

### [Completed] add_text_search (April 30, 2025)
```sql
-- Enable text search extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add text search index for username
CREATE INDEX IF NOT EXISTS idx_users_username_search 
ON public.users USING GiST (username gist_trgm_ops);
```

### [Completed] add_last_seen_trigger (April 30, 2025)
```sql
-- Create function to update last_seen
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_seen = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_last_seen_trigger ON public.users;
CREATE TRIGGER update_last_seen_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_seen();
```

## Notes
- Foreign keys now properly reference auth.users instead of public.users
- Need to update queries to use proper schema references
- Consider adding indexes for common queries
- Monitor query performance with new constraints
- The last_seen field will auto-update on any user record update 