import Redis from 'ioredis'
import { Env } from './env'

export const redis = new Redis(Env.REDIS_URL ?? '')
