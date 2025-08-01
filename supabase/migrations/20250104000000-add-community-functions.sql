-- Create function to increment reply count
CREATE OR REPLACE FUNCTION increment_reply_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET replies_count = replies_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment participant count
CREATE OR REPLACE FUNCTION increment_participant_count(program_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE mentorship_programs 
  SET current_participants = current_participants + 1,
      updated_at = NOW()
  WHERE id = program_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(table_name TEXT, content_id UUID)
RETURNS void AS $$
BEGIN
  IF table_name = 'forum_posts' THEN
    UPDATE forum_posts 
    SET likes_count = likes_count + 1,
        updated_at = NOW()
    WHERE id = content_id;
  ELSIF table_name = 'forum_replies' THEN
    UPDATE forum_replies 
    SET likes_count = likes_count + 1,
        updated_at = NOW()
    WHERE id = content_id;
  END IF;
END;
$$ LANGUAGE plpgsql; 