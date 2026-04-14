-- Grant complimentary Pro for 1 year (run against Neon / Postgres after migration).
-- Replace the email with the invited user's address (or use id / clerk_user_id).

UPDATE users
SET
  plan_tier = 'pro',
  plan_expires_at = now() + interval '1 year',
  updated_at = now()
WHERE email = 'invited@example.com';

-- Verify:
-- SELECT id, email, plan_tier, plan_expires_at FROM users WHERE email = 'invited@example.com';
