import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { base } from "../__core/app";
import { auth } from "../auth";
import { db } from "../database";
import { adminUsers } from "../database/schema";

export const admin = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) throw new ORPCError("UNAUTHORIZED", { message: "Entre para continuar." });
  const [allowed] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, session.user.id));
  if (!allowed) throw new ORPCError("FORBIDDEN", { message: "Acesso restrito à administração." });
  return next({ context: { user: session.user } });
});
