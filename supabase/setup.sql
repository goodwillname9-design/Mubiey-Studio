-- Run this once in your Supabase project's SQL Editor.
-- Dedicated namespace: does not touch Zion / MubiCare tables.
CREATE SCHEMA IF NOT EXISTS mubiey;
CREATE TABLE IF NOT EXISTS mubiey.users (
 id text PRIMARY KEY, username text UNIQUE NOT NULL, hash text, salt text,
 role text NOT NULL DEFAULT 'user', disabled integer NOT NULL DEFAULT 0,
 used bigint NOT NULL DEFAULT 0 CHECK(used>=0), created text NOT NULL
);
CREATE TABLE IF NOT EXISTS mubiey.sessions(token text PRIMARY KEY,user_id text NOT NULL,expires bigint NOT NULL);
CREATE INDEX IF NOT EXISTS mubiey_session_expiry ON mubiey.sessions(expires);
CREATE TABLE IF NOT EXISTS mubiey.invitations(id text PRIMARY KEY,owner text NOT NULL,doc text NOT NULL,version integer NOT NULL DEFAULT 0,updated text NOT NULL);
CREATE INDEX IF NOT EXISTS mubiey_inv_owner ON mubiey.invitations(owner);
CREATE TABLE IF NOT EXISTS mubiey.files(id text PRIMARY KEY,owner text NOT NULL,invite text,name text NOT NULL,type text NOT NULL,size bigint NOT NULL,created text NOT NULL,status text NOT NULL DEFAULT 'pending',expected bigint NOT NULL DEFAULT 0,expires bigint NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS mubiey_files_owner ON mubiey.files(owner);
CREATE INDEX IF NOT EXISTS mubiey_files_invite ON mubiey.files(invite);
CREATE TABLE IF NOT EXISTS mubiey.rates(key text PRIMARY KEY,count integer NOT NULL,expires bigint NOT NULL);
ALTER TABLE mubiey.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mubiey.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mubiey.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mubiey.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE mubiey.rates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON SCHEMA mubiey FROM anon,authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA mubiey FROM anon,authenticated;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('mubiey-private','mubiey-private',false,26214400,
ARRAY['image/png','image/jpeg','image/webp','application/pdf','application/json','audio/mpeg','audio/mp4','audio/ogg','audio/wav','audio/x-wav'])
ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=26214400,allowed_mime_types=excluded.allowed_mime_types;
-- No public upload/read policies: the backend issues short-lived signed URLs.
