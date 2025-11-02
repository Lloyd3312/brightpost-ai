-- Add unique constraint for user_id and platform combination
ALTER TABLE connected_accounts DROP CONSTRAINT IF EXISTS connected_accounts_user_id_platform_key;
ALTER TABLE connected_accounts ADD CONSTRAINT connected_accounts_user_id_platform_key UNIQUE (user_id, platform);