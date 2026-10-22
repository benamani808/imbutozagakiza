import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "site-images";

export const Route = createFileRoute("/api/public/image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = String((params as { _splat?: string })._splat ?? "").replace(/^\/+/, "");
        if (!/^[a-zA-Z0-9_/-]+\.[a-zA-Z0-9]+$/.test(path) || path.includes("..")) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from(BUCKET).download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "Content-Type": data.type && data.type !== "application/octet-stream" ? data.type : "image/jpeg",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
