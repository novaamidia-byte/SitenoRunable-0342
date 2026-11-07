import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { admin } from "../middleware/admin";
import { db } from "../database";
import { projects } from "../database/schema";

const url = z.union([
  z.literal(""),
  z.url().refine((v) => v.startsWith("https://"), "Use uma URL HTTPS."),
]);
const projectInput = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(180),
  category: z.enum([
    "design-grafico",
    "social-media",
    "identidade-visual",
    "edicao-de-video",
    "marketing-digital",
    "outros-servicos",
  ]),
  description: z.string().min(10).max(12000),
  client: z.string().max(150),
  year: z.string().max(4),
  cover: url,
  media: z
    .array(
      z.object({
        url: z.url().refine((v) => v.startsWith("https://")),
        type: z.enum(["image", "video"]),
        alt: z.string().max(200),
        captions: url.optional(),
      }),
    )
    .max(40),
  active: z.boolean(),
  featured: z.boolean(),
});
export const portfolio = {
  list: base.handler(() =>
    db.select().from(projects).where(eq(projects.active, true)).orderBy(desc(projects.createdAt)),
  ),
  get: base.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [p] = await db.select().from(projects).where(eq(projects.id, input.id));
    if (!p || !p.active) throw new ORPCError("NOT_FOUND", { message: "Projeto não encontrado." });
    return p;
  }),
  all: admin.handler(() => db.select().from(projects).orderBy(desc(projects.createdAt))),
  save: admin.input(projectInput).handler(async ({ input }) => {
    const { id, ...values } = input;
    if (values.active && !values.cover)
      throw new ORPCError("BAD_REQUEST", {
        message: "Adicione uma imagem de capa antes de publicar.",
      });
    if (id) {
      const [p] = await db.update(projects).set(values).where(eq(projects.id, id)).returning();
      if (!p) throw new ORPCError("NOT_FOUND");
      return p;
    }
    const [p] = await db
      .insert(projects)
      .values({ ...values, id: crypto.randomUUID() })
      .returning();
    return p;
  }),
  toggle: admin
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .handler(async ({ input }) => {
      const [p] = await db.select().from(projects).where(eq(projects.id, input.id));
      if (!p) throw new ORPCError("NOT_FOUND");
      if (input.active && !p.cover)
        throw new ORPCError("BAD_REQUEST", {
          message: "O projeto precisa de uma capa para ser publicado.",
        });
      await db.update(projects).set({ active: input.active }).where(eq(projects.id, input.id));
      return { success: true };
    }),
  remove: admin
    .input(z.object({ id: z.string(), confirmation: z.literal(true) }))
    .handler(async ({ input }) => {
      await db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
};
