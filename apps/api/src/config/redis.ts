import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function connectRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis ready');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      console.log('⚠️  Continuing without Redis in development mode');
    }
  }
}

export function getRedisClient() {
  if (!redisClient) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Redis client not initialized. Call connectRedis() first.');
    } else {
      console.log('⚠️  Redis client not available, returning null');
      return null;
    }
  }
  return redisClient;
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Redis disconnected successfully');
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await disconnectRedis();
}); 