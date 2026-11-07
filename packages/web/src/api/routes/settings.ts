import { z } from "zod";
import { eq } from "drizzle-orm";
import { base } from "../__core/app";
import { admin } from "../middleware/admin";
import { db } from "../database";
import { siteContent } from "../database/schema";

export const defaults = {
  heroTitle: "Ideias que\nganham forma.",
  heroText:
    "Design, identidade e conteúdo. Um olhar criativo sobre a sua marca, do conceito à presença digital.",
  aboutTitle: "Criatividade com propósito.",
  aboutText:
    "A Nova Mídia é uma agência criativa e de publicidade que ajuda empresas e empreendedores a se comunicarem com clareza e personalidade. Unimos estratégia, design e conteúdo para construir marcas que se destacam.",
  identityText:
    "Uma linguagem visual que organiza a essência da sua marca. Do posicionamento às aplicações, construímos uma identidade coerente em cada ponto de contato.",
  designText:
    "Ideias traduzidas em peças claras e bem construídas. Materiais digitais e impressos pensados para comunicar sua mensagem com personalidade.",
  contentText:
    "Planejamento e criação para manter a comunicação da sua marca consistente. Conteúdo, gestão de redes e marketing digital conectados à sua estratégia.",
  email: "",
  whatsapp: "",
  instagram: "",
  logo: "",
};
const fields = z.object({
  heroTitle: z.string().min(5).max(100),
  heroText: z.string().min(10).max(400),
  aboutTitle: z.string().min(5).max(120),
  aboutText: z.string().min(20).max(3000),
  identityText: z.string().min(20).max(1200).default(defaults.identityText),
  designText: z.string().min(20).max(1200).default(defaults.designText),
  contentText: z.string().min(20).max(1200).default(defaults.contentText),
  email: z.union([z.literal(""), z.email()]),
  whatsapp: z.string().regex(/^$|^[1-9][0-9]{7,14}$/, "Use apenas números com código do país."),
  instagram: z.union([
    z.literal(""),
    z
      .url()
      .refine(
        (v) => v.startsWith("https://www.instagram.com/") || v.startsWith("https://instagram.com/"),
      ),
  ]),
  logo: z.union([z.literal(""), z.url().refine((v) => v.startsWith("https://"))]),
});
export const settings = {
  get: base.handler(async () => {
    const [row] = await db.select().from(siteContent).where(eq(siteContent.id, "main"));
    return { ...defaults, ...row?.data };
  }),
  save: admin.input(fields).handler(async ({ input }) => {
    await db
      .insert(siteContent)
      .values({ id: "main", data: input })
      .onConflictDoUpdate({ target: siteContent.id, set: { data: input } });
    return input;
  }),
};
