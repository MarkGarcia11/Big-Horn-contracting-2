import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic"]);
const maxPhotoBytes = 8 * 1024 * 1024;

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function clean(value: FormDataEntryValue | unknown, limit: number) {
  return String(value ?? "").trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, limit);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

async function hashIp(ip: string) {
  const bytes = new TextEncoder().encode(ip || "unknown");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return jsonResponse({ error: "Server configuration is incomplete" }, 500);

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  let values: Record<string, unknown> = {};
  let photo: File | null = null;

  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        if (key === "project_photo" && value instanceof File) photo = value;
        else values[key] = value;
      }
    } else {
      values = await request.json();
    }
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  // Quietly accept honeypot submissions without storing or emailing them.
  if (clean(values.website, 120)) return jsonResponse({ ok: true });

  const requestData = {
    name: clean(values.name, 100),
    phone: clean(values.phone, 35),
    email: clean(values.email, 254) || null,
    service: clean(values.service, 100),
    details: clean(values.details, 3000),
    contact_method: clean(values.contact_method, 25) || "Phone",
    decision_partner: clean(values.decision_partner, 100) || null,
    page_url: clean(values.page_url, 500) || null,
  };

  if (requestData.name.length < 2 || requestData.phone.length < 7 || !requestData.service) {
    return jsonResponse({ error: "Please provide a name, phone number, and service." }, 400);
  }
  if (requestData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestData.email)) {
    return jsonResponse({ error: "Please provide a valid email address." }, 400);
  }
  if (photo && (photo.size > maxPhotoBytes || !allowedTypes.has(photo.type))) {
    return jsonResponse({ error: "Photo must be an allowed image under 8 MB." }, 413);
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const ipHash = await hashIp(forwarded);
  const windowStart = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { count, error: countError } = await admin
    .from("estimate_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);
  if (countError) return jsonResponse({ error: "Could not validate the request" }, 500);
  if ((count ?? 0) >= 4) return jsonResponse({ error: "Please call us to continue this conversation." }, 429);

  const oldRequests = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await admin.from("estimate_rate_limits").delete().lt("created_at", oldRequests);

  const { error: rateError } = await admin.from("estimate_rate_limits").insert({ ip_hash: ipHash });
  if (rateError) return jsonResponse({ error: "Could not validate the request" }, 500);

  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const extension = photo.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "image";
    photoPath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await admin.storage
      .from("estimate-photos")
      .upload(photoPath, new Uint8Array(await photo.arrayBuffer()), { contentType: photo.type, upsert: false });
    if (uploadError) return jsonResponse({ error: "The photo could not be attached" }, 500);
  }

  const { data: savedRequest, error: insertError } = await admin
    .from("estimate_requests")
    .insert({ ...requestData, photo_path: photoPath })
    .select("id, created_at")
    .single();
  if (insertError) return jsonResponse({ error: "The request could not be saved" }, 500);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const ownerEmail = Deno.env.get("ESTIMATE_TO_EMAIL");
  const fromEmail = Deno.env.get("ESTIMATE_FROM_EMAIL");
  if (resendKey && ownerEmail && fromEmail) {
    let photoLine = "";
    if (photoPath) {
      const { data: signedPhoto } = await admin.storage.from("estimate-photos").createSignedUrl(photoPath, 7 * 24 * 60 * 60);
      photoLine = signedPhoto?.signedUrl
        ? `<p><strong>Project photo:</strong> <a href="${escapeHtml(signedPhoto.signedUrl)}">Open private photo (expires in 7 days)</a></p>`
        : `<p><strong>Project photo:</strong> ${escapeHtml(photoPath)} (private Supabase storage)</p>`;
    }
    const html = [
      `<h2>New Big Horn estimate request</h2>`,
      `<p><strong>Name:</strong> ${escapeHtml(requestData.name)}</p>`,
      `<p><strong>Phone:</strong> ${escapeHtml(requestData.phone)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(requestData.email ?? "Not provided")}</p>`,
      `<p><strong>Service:</strong> ${escapeHtml(requestData.service)}</p>`,
      `<p><strong>Best contact:</strong> ${escapeHtml(requestData.contact_method)}</p>`,
      `<p><strong>Project details:</strong><br>${escapeHtml(requestData.details).replace(/\n/g, "<br>")}</p>`,
      `<p><strong>Decision partner:</strong> ${escapeHtml(requestData.decision_partner ?? "Not provided")}</p>`,
      photoLine,
      `<p><strong>Page:</strong> ${escapeHtml(requestData.page_url ?? "Not provided")}</p>`,
    ].join("");

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [ownerEmail],
          reply_to: requestData.email ?? undefined,
          subject: `Estimate request: ${requestData.service} · ${requestData.name}`,
          html,
        }),
      });
      if (!emailResponse.ok) console.error("Estimate email notification failed", await emailResponse.text());
    } catch (error) {
      console.error("Estimate email notification failed", error);
    }
  }

  return jsonResponse({ ok: true, request_id: savedRequest.id });
});