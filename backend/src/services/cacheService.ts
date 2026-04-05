import Redis from 'ioredis';

// Attempt to connect to Redis, fallback to memory cache if unavailable for easier local dev without docker
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export let redis: Redis | null = null;

try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop retrying after 3 times
      }
      return Math.min(times * 50, 2000);
    }
  });
  
  redis.on('error', (err) => {
    console.warn('Redis connection error. Will fallback to in-memory caching:', err.message);
    redis?.disconnect();
    redis = null;
  });
} catch (e) {
  console.warn('Failed to initialize Redis. Will fallback to in-memory caching.');
}

const memoryCache = new Map<string, { data: string; expiry: number }>();

export async function setCache(key: string, value: any, ttlSeconds: number = 86400) {
  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
      return;
    } catch (e) {
      // Ignore
    }
  }
  
  // Fallback
  memoryCache.set(key, {
    data: JSON.stringify(value),
    expiry: Date.now() + ttlSeconds * 1000
  });
}

export async function getCache(key: string): Promise<any | null> {
  if (redis) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      // Ignore
    }
  }
  
  // Fallback
  const item = memoryCache.get(key);
  if (item) {
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return JSON.parse(item.data);
  }
  return null;
}
