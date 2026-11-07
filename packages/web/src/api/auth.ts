import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./database";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  trustedOrigins: [process.env.WEBSITE_URL!, process.env.RUNABLE_URL!].filter(Boolean),
  rateLimit: { enabled: true, window: 60, max: 20 },
  plugins: [bearer()],
});
