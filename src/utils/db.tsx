import { neon } from '@neondatabase/serverless';
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(import.meta.env.VITE_PUBLIC_DRIZZLE_DB_URL!);
export const db = drizzle({ client: sql });