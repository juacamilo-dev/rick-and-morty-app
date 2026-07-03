import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const CACHE_TTL = Number(process.env.REDIS_CACHE_TTL) || 3600;

redisClient.on('connect', () => {
  console.log('[Redis] Conectado correctamente.');
});

redisClient.on('error', (error) => {
  console.error('[Redis] Error de conexion:', error);
});
