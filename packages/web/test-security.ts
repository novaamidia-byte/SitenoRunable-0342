import { readFile, rm } from "node:fs/promises";
import { createClient } from "@libsql/client";
import assert from "node:assert/strict";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

// Isolated local database only. No production accounts, portfolio entries or media are changed.
const file = "/home/user/nova-midia-security-test.db";
await rm(file, { force: true });
process.env.DATABASE_URL = `file:${file}`;
process.env.DATABASE_AUTH_TOKEN = "";
process.env.WEBSITE_URL = "http://localhost:4200";
process.env.ADMIN_SETUP_KEY = crypto.randomUUID() + crypto.randomUUID();
process.env.BETTER_AUTH_SECRET = crypto.randomUUID() + crypto.randomUUID();
const db = createClient({ url: process.env.DATABASE_URL });
await db.executeMultiple(
  await readFile(new URL("./drizzle/0000_youthful_wiccan.sql", import.meta.url), "utf8"),
);
const { default: app } = await import("./src/api/index");
type Client = import("./src/api/index").AppRouterClient;
let token = "";
const client: Client = createORPCClient(
  new RPCLink({
    url: "http://localhost:4200/api/rpc",
    headers: () => (token ? { Authorization: `Bearer ${token}` } : {}),
    fetch: async (request) => app.fetch(request),
  }),
);
const results: string[] = [];
async function denied(action: () => Promise<unknown>, code: string) {
  try {
    await action();
    assert.fail("Expected denial");
  } catch (error) {
    assert.equal((error as { code: string }).code, code);
  }
}
try {
  assert.deepEqual(await client.administration.status(), { installed: false });
  await denied(() => client.portfolio.all(), "UNAUTHORIZED");
  await denied(
    () =>
      client.settings.save({
        heroTitle: "Título teste",
        heroText: "Texto de abertura para teste",
        aboutTitle: "Título teste",
        aboutText: "Uma apresentação de teste suficientemente longa.",
        email: "",
        whatsapp: "",
        instagram: "",
        logo: "",
      }),
    "UNAUTHORIZED",
  );
  await denied(
    () => client.upload.presign({ filename: "test.png", contentType: "image/png", size: 100 }),
    "UNAUTHORIZED",
  );
  results.push("Unauthenticated project/content/upload mutations denied");
  const signup = await app.request("http://localhost:4200/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "http://localhost:4200" },
    body: JSON.stringify({ name: "Test", email: "qa@example.com", password: "Temporary123!" }),
  });
  assert.equal(signup.status, 403);
  results.push("Public sign-up blocked");
  const input = {
    name: "QA isolated",
    email: "qa@example.com",
    password: crypto.randomUUID() + "Test!",
    key: process.env.ADMIN_SETUP_KEY,
  };
  await denied(() => client.administration.setup({ ...input, key: "wrong" }), "FORBIDDEN");
  const setupResults = await Promise.allSettled([
    client.administration.setup(input),
    client.administration.setup({ ...input, email: "qa2@example.com" }),
  ]);
  assert.equal(setupResults.filter((r) => r.status === "fulfilled").length, 1);
  assert.deepEqual(await client.administration.status(), { installed: true });
  await denied(() => client.administration.setup(input), "FORBIDDEN");
  results.push(
    "Secret validated, concurrent first-account race blocked, setup closed after first admin",
  );
  const rows = await db.execute("SELECT email FROM user");
  assert.equal(rows.rows.length, 1);
  const email = String(rows.rows[0]!.email);
  const login = await app.request("http://localhost:4200/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "http://localhost:4200" },
    body: JSON.stringify({ email, password: input.password }),
  });
  assert.equal(login.status, 200);
  token = login.headers.get("set-auth-token") ?? "";
  assert.ok(token);
  assert.equal((await client.administration.me()).email, email);
  results.push("Email/password login and bearer-backed admin authorization");
  const project = {
    title: "QA temporary project",
    category: "design-grafico" as const,
    description: "Temporary project in isolated database for automated testing.",
    client: "",
    year: "",
    cover: "https://example.com/test.jpg",
    media: [{ url: "https://example.com/test.mp4", type: "video" as const, alt: "Test video" }],
    active: false,
    featured: true,
  };
  const created = await client.portfolio.save(project);
  assert.equal((await client.portfolio.list()).length, 0);
  const edited = await client.portfolio.save({ ...project, id: created.id, title: "QA edited" });
  assert.equal(edited.title, "QA edited");
  await client.portfolio.toggle({ id: created.id, active: true });
  assert.equal((await client.portfolio.list()).length, 1);
  token = "";
  assert.equal((await client.portfolio.get({ id: created.id })).title, "QA edited");
  token = login.headers.get("set-auth-token")!;
  await client.portfolio.toggle({ id: created.id, active: false });
  token = "";
  await denied(() => client.portfolio.get({ id: created.id }), "NOT_FOUND");
  token = login.headers.get("set-auth-token")!;
  await client.portfolio.remove({ id: created.id, confirmation: true });
  assert.equal((await client.portfolio.all()).length, 0);
  results.push("Project creation, editing, media metadata, publication, draft privacy, deletion");
  const settings = await client.settings.get();
  await client.settings.save({ ...settings, email: "studio@example.com" });
  assert.equal((await client.settings.get()).email, "studio@example.com");
  const presign = await client.upload.presign({
    filename: "test.png",
    contentType: "image/png",
    size: 100,
  });
  assert.ok(presign.url.includes("X-Amz-Signature"));
  assert.ok(presign.publicUrl.startsWith("https://"));
  results.push("Content updates and authenticated signed-upload URL generation (no file uploaded)");
  const logout = await app.request("http://localhost:4200/api/auth/sign-out", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Origin: "http://localhost:4200" },
  });
  assert.equal(logout.status, 200);
  await denied(() => client.administration.me(), "UNAUTHORIZED");
  results.push("Logout invalidates session server-side");
  console.log(JSON.stringify({ passed: results }, null, 2));
} finally {
  db.close();
  await rm(file, { force: true });
}
