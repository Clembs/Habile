import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations/*',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
