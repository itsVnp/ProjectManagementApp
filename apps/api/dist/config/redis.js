"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = connectRedis;
exports.getRedisClient = getRedisClient;
exports.disconnectRedis = disconnectRedis;
const redis_1 = require("redis");
let redisClient = null;
async function connectRedis() {
    try {
        redisClient = (0, redis_1.createClient)({
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
    }
    catch (error) {
        console.error('❌ Redis connection failed:', error);
        throw error;
    }
}
function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call connectRedis() first.');
    }
    return redisClient;
}
async function disconnectRedis() {
    if (redisClient) {
        await redisClient.quit();
        console.log('✅ Redis disconnected successfully');
    }
}
process.on('beforeExit', async () => {
    await disconnectRedis();
});
//# sourceMappingURL=redis.js.map