import { createServerFn } from "@tanstack/react-start";

const CONTENT_ID = "main";
const ADMIN_ID = "main";
const KINDS = ["members", "messages", "prayers", "newsletter", "donations"] as const;

type Kind = (typeof KINDS)[number];

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function assertPassword(password: string) {
  const db = await admin();
  const { data, error } = await db
    .from("admin_config")
    .select("password")
    .eq("id", ADMIN_ID)
    .maybeSingle();
  if (error) throw new Error("Unable to verify admin access.");
  if (!data || data.password !== password) throw new Error("Invalid admin password.");
  return db;
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => input)
  .handler(async ({ data }) => {
    try {
      await assertPassword(data.password);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; content: Json }) => input)
  .handler(async ({ data }) => {
    const db = await assertPassword(data.password);

    const content = (data.content ?? {}) as { [key: string]: Json };
    const settings: { [key: string]: Json } = { ...((content["settings"] as { [key: string]: Json }) ?? {}) };
    const newPassword = String(settings["adminPassword"] ?? "").trim();
    delete settings["adminPassword"];

    const payload: Json = { ...content, settings };

    const { error } = await db
      .from("site_content")
      .upsert({ id: CONTENT_ID, data: payload, updated_at: new Date().toISOString() });
    if (error) throw new Error("Could not save website content.");

    if (newPassword && newPassword !== data.password) {
      await db
        .from("admin_config")
        .update({ password: newPassword, updated_at: new Date().toISOString() })
        .eq("id", ADMIN_ID);
      return { ok: true, password: newPassword };
    }

    return { ok: true, password: data.password };
  });

export const listSubmissions = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => input)
  .handler(async ({ data }) => {
    const db = await assertPassword(data.password);
    const { data: rows, error } = await db
      .from("submissions")
      .select("id, kind, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error("Could not load submissions.");
    return (rows ?? []).map((r) => ({
      id: r.id as string,
      kind: r.kind as Kind,
      payload: (r.payload ?? {}) as { [key: string]: Json },
      created_at: r.created_at as string,
    }));
  });

export const addSubmissionAsAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; kind: string; payload: { [key: string]: Json } }) => input)
  .handler(async ({ data }) => {
    const db = await assertPassword(data.password);
    if (!KINDS.includes(data.kind as Kind)) throw new Error("Unknown record type.");
    const { error } = await db.from("submissions").insert({ kind: data.kind, payload: data.payload });
    if (error) throw new Error("Could not add record.");
    return { ok: true };
  });

export const deleteSubmission = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; id: string }) => input)
  .handler(async ({ data }) => {
    const db = await assertPassword(data.password);
    const { error } = await db.from("submissions").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete record.");
    return { ok: true };
  });

export const clearSubmissions = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; kind: string }) => input)
  .handler(async ({ data }) => {
    const db = await assertPassword(data.password);
    const { error } = await db.from("submissions").delete().eq("kind", data.kind);
    if (error) throw new Error("Could not clear records.");
    return { ok: true };
  });
