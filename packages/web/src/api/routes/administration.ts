import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { base } from "../__core/app";
import { auth } from "../auth";
import { db } from "../database";
import { adminUsers, user, installationLock } from "../database/schema";
import { admin } from "../middleware/admin";

let installing = false;
const attempts = new Map<string, { count: number; reset: number }>();
export const administration = {
  status: base.handler(async () => ({
    installed: (await db.select().from(adminUsers).limit(1)).length > 0,
  })),
  me: admin.handler(({ context }) => ({ name: context.user.name, email: context.user.email })),
  setup: base
    .input(
      z.object({
        key: z.string().max(512),
        name: z.string().min(2).max(100),
        email: z.email(),
        password: z.string().min(12).max(128),
      }),
    )
    .handler(async ({ input }) => {
      const expected = process.env.ADMIN_SETUP_KEY;
      if (!expected || expected.length < 24)
        throw new ORPCError("FORBIDDEN", {
          message:
            "A chave de instalação precisa ter pelo menos 24 caracteres. Atualize a configuração segura do servidor.",
        });
      const now = Date.now();
      const bucket = attempts.get("setup") ?? { count: 0, reset: now + 60_000 };
      if (now > bucket.reset) {
        bucket.count = 0;
        bucket.reset = now + 60_000;
      }
      bucket.count++;
      attempts.set("setup", bucket);
      if (bucket.count > 8)
        throw new ORPCError("TOO_MANY_REQUESTS", {
          message: "Muitas tentativas. Aguarde um minuto.",
        });
      const a = Buffer.from(input.key),
        b = Buffer.from(expected);
      if (a.length !== b.length || !timingSafeEqual(a, b))
        throw new ORPCError("FORBIDDEN", { message: "Chave de instalação inválida." });
      if (installing || (await db.select().from(adminUsers).limit(1)).length)
        throw new ORPCError("FORBIDDEN", { message: "A instalação já foi concluída." });
      installing = true;
      const [claim] = await db
        .insert(installationLock)
        .values({ id: "first-admin" })
        .onConflictDoNothing()
        .returning();
      if (!claim) {
        installing = false;
        throw new ORPCError("FORBIDDEN", { message: "A instalação já foi iniciada ou concluída." });
      }
      let created = false;
      try {
        if ((await db.select().from(user).limit(1)).length)
          throw new ORPCError("FORBIDDEN", {
            message:
              "Já existe uma conta. A recuperação deve ser feita pela equipe responsável no servidor.",
          });
        const result = await auth.api.signUpEmail({
          body: { email: input.email, password: input.password, name: input.name },
        });
        created = true;
        await db.insert(adminUsers).values({ userId: result.user.id });
        return { success: true };
      } catch (error) {
        if (!created)
          await db.delete(installationLock).where(eq(installationLock.id, "first-admin"));
        throw error;
      } finally {
        installing = false;
      }
    }),
};
