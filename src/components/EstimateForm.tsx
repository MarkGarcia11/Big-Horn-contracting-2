import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Upload } from "lucide-react";
import { serviceNameForLocale, services, site } from "../data/site";
import { trackEvent } from "../lib/analytics";
import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from "../lib/supabase";
import { text, useLocale } from "./common";

type FormState = "idle" | "sending" | "success" | "preview" | "error";

type EstimateFormProps = {
  compact?: boolean;
  defaultService?: string;
  className?: string;
};

function passedLocalRateLimit() {
  const storageKey = "bighorn-estimate-attempts";
  const now = Date.now();
  const windowMs = 30 * 60 * 1000;
  const existing = window.localStorage.getItem(storageKey);
  let recent: number[] = [];
  try {
    const saved = existing ? JSON.parse(existing) : [];
    if (Array.isArray(saved)) recent = saved.filter((time: unknown): time is number => typeof time === "number" && now - time < windowMs);
  } catch {
    recent = [];
  }
  if (recent.length >= 4) return false;
  recent.push(now);
  window.localStorage.setItem(storageKey, JSON.stringify(recent));
  return true;
}

export default function EstimateForm({ compact = false, defaultService = "", className = "" }: EstimateFormProps) {
  const { locale } = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [selectedFile, setSelectedFile] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get("company_website") ?? "");
    if (honeypot) {
      setFormState("success");
      form.reset();
      return;
    }
    if (!passedLocalRateLimit()) {
      setFormState("error");
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const service = String(formData.get("service") ?? "");
    const details = String(formData.get("details") ?? "").trim();
    const contactMethod = String(formData.get("contact_method") ?? "Phone");
    const decisionPartner = String(formData.get("decision_partner") ?? "").trim();
    const file = formData.get("project_photo");

    if (file instanceof File && file.size > 8 * 1024 * 1024) {
      setFormState("error");
      return;
    }
    if (file instanceof File && file.size > 0 && !["image/jpeg", "image/png", "image/webp", "image/heic"].includes(file.type)) {
      setFormState("error");
      return;
    }

    setFormState("sending");
    if (!isSupabaseConfigured || !supabase) {
      setFormState("preview");
      trackEvent("estimate_request_preview", { service });
      return;
    }

    try {
      const payload = {
        name,
        phone,
        email: email || null,
        service,
        details,
        contact_method: contactMethod,
        decision_partner: decisionPartner || null,
        website: "",
        page_url: window.location.href,
      };

      if (file instanceof File && file.size > 0) {
        const multipart = new FormData();
        Object.entries(payload).forEach(([key, value]) => multipart.append(key, String(value ?? "")));
        multipart.append("project_photo", file, file.name);
        const response = await fetch(`${supabaseUrl}/functions/v1/submit-estimate`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey!, Authorization: `Bearer ${supabaseAnonKey}` },
          body: multipart,
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error ?? "Estimate request could not be sent");
        }
      } else {
        const { error } = await supabase.functions.invoke("submit-estimate", { body: payload });
        if (error) throw error;
      }

      setFormState("success");
      form.reset();
      setSelectedFile("");
      trackEvent("estimate_request_submitted", { service });
    } catch (error) {
      console.error("Estimate submission failed", error);
      setFormState("error");
    }
  }

  const success = formState === "success" || formState === "preview";
  const successTitle = locale === "es" ? "Gracias por escribirnos." : "Thanks for reaching out.";
  const successCopy = locale === "es"
    ? "Te llamaremos dentro de un día hábil."
    : "Thank you! We'll call you within one business day.";

  return (
    <div className={`estimate-form-wrap ${compact ? "estimate-form-compact" : ""} ${className}`}>
      {success ? (
        <div className="estimate-success" role="status" aria-live="polite">
          <span className="success-icon"><Check size={19} /></span>
          <h3>{successTitle}</h3>
          <p>{formState === "preview"
            ? (locale === "es"
                ? `Este formulario todavía no está conectado. Llama o envía un mensaje al ${site.phone}.`
                : `This preview form is not connected yet. Please call or text ${site.phone} to reach the team.`)
            : successCopy}</p>
          {formState === "preview" && <a href={`tel:${site.phoneHref}`}>{site.phone}</a>}
        </div>
      ) : (
        <form ref={formRef} className="estimate-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>{text(locale, "name")} <b>*</b></span>
              <input name="name" autoComplete="name" placeholder={locale === "es" ? "Tu nombre" : "First and last name"} required maxLength={100} />
            </label>
            <label className="form-field">
              <span>{text(locale, "phone")} <b>*</b></span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="(505) 555-0000" required maxLength={35} />
            </label>
            {!compact && (
              <label className="form-field">
                <span>{text(locale, "email")}</span>
                <input name="email" type="email" autoComplete="email" placeholder={locale === "es" ? "tu@correo.com" : "you@email.com"} maxLength={254} />
              </label>
            )}
            <label className="form-field">
              <span>{text(locale, "serviceType")} <b>*</b></span>
              <select name="service" defaultValue={defaultService} required>
                <option value="" disabled>{text(locale, "selectService")}</option>
                {services.map((service) => <option key={service.slug} value={service.name}>{serviceNameForLocale(service.slug, locale, service.name)}</option>)}
              </select>
            </label>
            {!compact && (
              <label className="form-field">
                <span>{text(locale, "contactMethod")}</span>
                <select name="contact_method" defaultValue="Phone">
                  <option value="Phone">{locale === "es" ? "Teléfono" : "Phone"}</option>
                  <option value="Text">{locale === "es" ? "Mensaje de texto" : "Text message"}</option>
                  <option value="Email">{locale === "es" ? "Correo electrónico" : "Email"}</option>
                </select>
              </label>
            )}
            <label className="form-field form-field-full">
              <span>{text(locale, "details")} {!compact && <b>*</b>}</span>
              <textarea name="details" rows={compact ? 3 : 4} placeholder={locale === "es" ? "¿Qué tienes en mente?" : "What are you hoping to build or change?"} required={!compact} maxLength={3000} />
            </label>
            <label className="form-field form-field-full">
              <span>{text(locale, "decisionPartner")}</span>
              <input name="decision_partner" placeholder={locale === "es" ? "Nombre (opcional)" : "Their name, if they'd like to join the conversation"} maxLength={100} />
            </label>
            {!compact && (
              <div className="form-field form-field-full file-field">
                <span>{text(locale, "photo")}</span>
                <label className="file-input-control">
                  <Upload size={16} />
                  <span>{selectedFile || (locale === "es" ? "Elegir una imagen" : "Choose an image")}</span>
                  <input
                    name="project_photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    onChange={(event) => setSelectedFile(event.target.files?.[0]?.name ?? "")}
                  />
                </label>
                <small>{locale === "es" ? "JPG, PNG, WebP o HEIC · máximo 8 MB" : "JPG, PNG, WebP, or HEIC · up to 8 MB"}</small>
              </div>
            )}
          </div>

          <label className="honeypot" aria-hidden="true">
            Website
            <input name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
          {formState === "error" && (
            <p className="form-error" role="alert">
              {locale === "es"
                ? `No pudimos enviar el formulario. Revisa tu foto e intenta de nuevo, o llámanos al ${site.phone}.`
                : `We couldn't send your request. Check the photo size and try again, or call us at ${site.phone}.`}
            </p>
          )}
          <div className="form-submit-row">
            <button className="button-primary form-submit" type="submit" disabled={formState === "sending"}>
              <span>{formState === "sending" ? text(locale, "sending") : text(locale, "sendRequest")}</span>
              {formState === "sending" ? <span className="submit-spinner" /> : <ArrowRight size={17} />}
            </button>
            {!compact && <p>{locale === "es" ? "Sin presión. Solo una conversación clara." : "No pressure. Just a clear conversation."}</p>}
          </div>
        </form>
      )}
    </div>
  );
}