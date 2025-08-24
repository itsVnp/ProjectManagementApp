const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'claro_dev',
    user: 'claro_user',
    password: 'claro_password',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create tables one by one
    const tables = [
      {
        name: 'users',
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            "avatarUrl" TEXT,
            password TEXT,
            role TEXT DEFAULT 'USER',
            "subscriptionTier" TEXT DEFAULT 'FREE',
            "isEmailVerified" BOOLEAN DEFAULT false,
            "lastActiveAt" TIMESTAMP,
            preferences JSONB DEFAULT '{}',
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },
      {
        name: 'projects',
        sql: `
          CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'ACTIVE',
            color TEXT DEFAULT '#3B82F6',
            "isPublic" BOOLEAN DEFAULT false,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "ownerId" TEXT NOT NULL
          );
        `
      },
      {
        name: 'tasks',
        sql: `
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'TODO',
            priority TEXT DEFAULT 'MEDIUM',
            "dueDate" TIMESTAMP,
            "estimatedHours" INTEGER,
            "actualHours" INTEGER,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "projectId" TEXT NOT NULL,
            "assigneeId" TEXT,
            "creatorId" TEXT NOT NULL
          );
        `
      },
      {
        name: 'comments',
        sql: `
          CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "taskId" TEXT NOT NULL,
            "userId" TEXT NOT NULL
          );
        `
      },
      {
        name: 'notifications',
        sql: `
          CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            "isRead" BOOLEAN DEFAULT false,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "userId" TEXT NOT NULL
          );
        `
      }
    ];

    for (const table of tables) {
      try {
        await client.query(table.sql);
        console.log(`✅ Created table: ${table.name}`);
      } catch (error) {
        if (error.code === '42710') { // duplicate_object
          console.log(`ℹ️  Table ${table.name} already exists`);
        } else {
          console.error(`❌ Error creating table ${table.name}:`, error.message);
        }
      }
    }

    console.log('✅ Database setup completed');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase(); 