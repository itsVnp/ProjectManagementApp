-- Initialize the database with proper permissions
-- claro_user is the superuser in this setup
GRANT ALL PRIVILEGES ON DATABASE claro_dev TO claro_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO claro_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO claro_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO claro_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO claro_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO claro_user; 