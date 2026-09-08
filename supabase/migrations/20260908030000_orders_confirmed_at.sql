alter table orders add column if not exists confirmed_at timestamptz;

-- Backfill so orders already confirmed before this column existed don't
-- suddenly look "never confirmed" once expiration is computed from confirmed_at.
update orders set confirmed_at = created_at where status = 'confirmed' and confirmed_at is null;
