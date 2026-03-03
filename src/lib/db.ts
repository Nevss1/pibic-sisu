import { Pool } from "pg";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está definida no .env.local");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // necessário para Neon
  },
});

export async function query<T = any>(sql: string, params?: any[]) {
  const result = await pool.query<T>(sql, params);
  return result.rows;
}

