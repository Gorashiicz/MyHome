-- Vytvoření uživatele a databáze pro Stavba Pod Kontrolou
-- Spouštět jako superuser postgres (heslo výchozí instalace: postgres)

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'stavba') THEN
    CREATE ROLE stavba WITH LOGIN PASSWORD 'stavba';
  ELSE
    ALTER ROLE stavba WITH PASSWORD 'stavba';
  END IF;
END
$$;

SELECT 'CREATE DATABASE stavba_pod_kontrolou OWNER stavba'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'stavba_pod_kontrolou')\gexec

GRANT ALL PRIVILEGES ON DATABASE stavba_pod_kontrolou TO stavba;
