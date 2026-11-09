import { Pool } from 'pg'

// Conexión de solo lectura a OPBD (Neon), usada solo al compilar. DATABASE_URL usa el rol `fokagames_lectura`.
const globalForPool = globalThis as unknown as { pool?: Pool }

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    allowExitOnIdle: true,
    ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? '') ? false : { rejectUnauthorized: true },
  })

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool
