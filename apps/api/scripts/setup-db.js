const { Client } = require('pg');

async function setupDatabase() {
  // First connect as postgres to create the user
  const postgresClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'claro_password',
  });

  try {
    await postgresClient.connect();
    console.log('✅ Connected to postgres database');

    // Create the claro_user if it doesn't exist
    await postgresClient.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'claro_user') THEN
          CREATE ROLE claro_user WITH LOGIN PASSWORD 'claro_password';
        END IF;
      END
      $$;
    `);

    // Grant privileges
    await postgresClient.query(`
      GRANT ALL PRIVILEGES ON DATABASE claro_dev TO claro_user;
    `);

    console.log('✅ User claro_user created/updated');

  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await postgresClient.end();
  }

  // Now connect as claro_user to create tables
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'claro_dev',
    user: 'claro_user',
    password: 'claro_password',
  });

  try {
    await client.connect();
    console.log('✅ Connected to claro_dev database');

    // Create tables manually based on Prisma schema
    const createTablesSQL = `
      -- Create enums if they don't exist
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'COMPLETED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "avatarUrl" TEXT,
        "password" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
        "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
        "lastActiveAt" TIMESTAMP(3),
        "preferences" JSONB NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );

      -- Create projects table
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
        "color" TEXT DEFAULT '#3B82F6',
        "isPublic" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "ownerId" TEXT NOT NULL,
        CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
      );

      -- Create project_members table
      CREATE TABLE IF NOT EXISTS "project_members" (
        "id" TEXT NOT NULL,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        "projectId" TEXT NOT NULL,
        CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
      );

      -- Create tasks table
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
        "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
        "dueDate" TIMESTAMP(3),
        "estimatedHours" INTEGER,
        "actualHours" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "projectId" TEXT NOT NULL,
        "assigneeId" TEXT,
        "creatorId" TEXT NOT NULL,
        CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
      );

      -- Create comments table
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "taskId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
      );

      -- Create files table
      CREATE TABLE IF NOT EXISTS "files" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "size" INTEGER NOT NULL,
        "mimeType" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "projectId" TEXT NOT NULL,
        "uploaderId" TEXT NOT NULL,
        CONSTRAINT "files_pkey" PRIMARY KEY ("id")
      );

      -- Create activities table
      CREATE TABLE IF NOT EXISTS "activities" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "metadata" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        "projectId" TEXT NOT NULL,
        CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
      );

      -- Create notifications table
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
      );
    `;

    await client.query(createTablesSQL);
    console.log('✅ Database tables created successfully');

    // Create unique constraints and indexes
    const createIndexesSQL = `
      -- Create unique constraints
      DO $$ BEGIN
        CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await client.query(createIndexesSQL);
    console.log('✅ Database indexes created successfully');

    // Create foreign key constraints
    const createForeignKeysSQL = `
      -- Create foreign key constraints (only if they don't exist)
      DO $$ BEGIN
        ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "project_members" ADD CONSTRAINT "project_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "comments" ADD CONSTRAINT "comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "files" ADD CONSTRAINT "files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "files" ADD CONSTRAINT "files_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "activities" ADD CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await client.query(createForeignKeysSQL);
    console.log('✅ Database foreign keys created successfully');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase(); 