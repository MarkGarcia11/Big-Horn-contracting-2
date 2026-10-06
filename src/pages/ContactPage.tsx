import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { site, surroundingAreas } from "../data/site";
import EstimateForm from "../components/EstimateForm";
import { trackEvent } from "../lib/analytics";
import { Reveal, SectionHeading, ShareControl, text, useLocale, type Locale } from "../components/common";

function ContactMap({ locale }: { locale: Locale }) {
  return (
    <div className="contact-map-wrap">
      <svg viewBox="0 0 640 380" role="img" aria-label="Stylized map showing Albuquerque and nearby service communities">
        <defs><linearGradient id="contact-map-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F1E4D2" /><stop offset="1" stopColor="#EAD3B7" /></linearGradient></defs>
        <rect width="640" height="380" rx="22" fill="url(#contact-map-bg)" />
        <path d="M-40 251c96-63 176-50 255-9 77 40 155 56 250 12 73-35 127-49 215-20" fill="none" stroke="#fffaf3" strokeWidth="24" strokeLinecap="round" />
        <path d="M-40 251c96-63 176-50 255-9 77 40 155 56 250 12 73-35 127-49 215-20" fill="none" stroke="#cdb89e" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" />
        <path d="M81 39c71 43 111 106 124 173 17 83 73 107 121 159m234-323c-75 48-120 100-136 165-12 48-43 92-95 137" fill="none" stroke="#fffaf3" strokeWidth="15" strokeLinecap="round" />
        <path d="M81 39c71 43 111 106 124 173 17 83 73 107 121 159m234-323c-75 48-120 100-136 165-12 48-43 92-95 137" fill="none" stroke="#cdb89e" strokeWidth="1.2" strokeDasharray="4 7" strokeLinecap="round" />
        <path d="M121 107c77 55 114 89 174 102 73 16 132 8 219-38" fill="none" stroke="#C4553B" strokeWidth="2.5" strokeDasharray="3 8" />
        <circle cx="302" cy="209" r="22" fill="#C4553B" opacity=".15" /><circle cx="302" cy="209" r="9" fill="#C4553B" /><circle cx="302" cy="209" r="3.2" fill="#FBF6EE" />
        <circle cx="206" cy="114" r="5" fill="#2A9D8F" /><circle cx="451" cy="147" r="5" fill="#2A9D8F" /><circle cx="414" cy="290" r="5" fill="#2A9D8F" /><circle cx="150" cy="264" r="5" fill="#2A9D8F" />
        <text x="322" y="203" className="contact-map-label-main">Albuquerque</text><text x="137" y="99">Rio Rancho</text><text x="466" y="151">Bernalillo</text><text x="427" y="305">Los Lunas</text><text x="99" y="286">Corrales</text>
      </svg>
      <span className="map-caption"><MapPin size={15} />{locale === "es" ? "Zona aproximada · confirma tu domicilio" : "Approximate service area · address confirmation required"}</span>
    </div>
  );
}

export default function ContactPage() {
  const { locale } = useLocale();
  const phoneDigits = site.phoneHref.replace(/\D/g, "");
  const whatsappText = locale === "es"
    ? "Hola, quisiera hablar sobre un proyecto para mi hogar."
    : "Hello, I'd like to ask about a home project.";
  return (
    <main className="inner-page contact-page">
      <section className="contact-heading">
        <div className="container contact-heading-grid">
          <Reveal>
            <span className="eyebrow"><span className="eyebrow-mark" />{locale === "es" ? "UN BUEN LUGAR PARA EMPEZAR" : "A GOOD PLACE TO START"}</span>
            <h1>{locale === "es" ? "Cuéntanos qué imaginas." : "Tell us what you have in mind."}</h1>
            <p>{locale === "es" ? "Comparte unas líneas y Gerardo se comunicará contigo dentro de un día hábil." : "Share a few details and Gerardo will be in touch within one business day."}</p>
            <p className="contact-together-note">{text(locale, "together")}</p>
            <div className="contact-heading-share"><ShareControl /></div>
          </Reveal>
          <div className="contact-estimate-card" id="estimate">
            <div className="contact-form-top"><span>01 / 02</span><span>{locale === "es" ? "Estimado gratis" : "Free estimate"}</span></div>
            <EstimateForm />
          </div>
        </div>
      </section>
      <section className="contact-details-section">
        <div className="container contact-details-layout">
          <div className="contact-info">
            <SectionHeading eyebrow={locale === "es" ? "ESTAMOS CERCA" : "HERE WHEN YOU NEED US"} title={locale === "es" ? "Elige cómo hablar." : "Reach out your way."} text={locale === "es" ? "Llama, envía un mensaje de texto o comparte algunos detalles en el formulario." : "Call, text, or share a few project details through the form."} />
            <div className="contact-methods">
              <a href={`tel:${site.phoneHref}`} onClick={() => trackEvent("phone_click", { placement: "contact" })}><span><Phone size={17} /></span><div><small>{locale === "es" ? "Llamar" : "Call"}</small><strong>{site.phone}</strong></div><ArrowUpRight size={15} /></a>
              <a href={`sms:${site.phoneHref}?body=${encodeURIComponent(whatsappText)}`} onClick={() => trackEvent("text_click", { placement: "contact" })}><span><MessageCircle size={17} /></span><div><small>{locale === "es" ? "Enviar mensaje" : "Send a text"}</small><strong>{locale === "es" ? "Mensaje directo" : "A quick text"}</strong></div><ArrowUpRight size={15} /></a>
              <a href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><span><MessageCircle size={17} /></span><div><small>WhatsApp-ready</small><strong>{locale === "es" ? "Abrir WhatsApp" : "Open WhatsApp"}</strong></div><ArrowUpRight size={15} /></a>
              <a href={`mailto:${site.emailHref}`}><span><Mail size={17} /></span><div><small>{locale === "es" ? "Correo electrónico" : "Email"}</small><strong>{site.email}</strong></div><ArrowUpRight size={15} /></a>
            </div>
            <div className="contact-hours"><Clock3 size={18} /><div><strong>{locale === "es" ? "Horario" : "Hours"}</strong><p>{site.hours}</p></div></div>
            <div className="contact-license"><ShieldCheck size={19} /><p>{site.license}. {locale === "es" ? "Se confirmará antes de publicar." : "To be verified by the owner before launch."}</p></div>
          </div>
          <Reveal className="contact-area-card">
            <div className="contact-area-card-heading"><span className="eyebrow"><span className="eyebrow-mark" />{locale === "es" ? "NUESTRA ZONA" : "OUR NEIGHBORHOOD"}</span><h2>{locale === "es" ? "Albuquerque y alrededores." : "Albuquerque and nearby."}</h2></div>
            <ContactMap locale={locale} />
            <p className="contact-areas-line">{["Albuquerque", ...surroundingAreas].join(" · ")}</p>
            <Link to="/service-areas" className="text-link">{locale === "es" ? "Ver cobertura completa" : "See all service areas"}<ArrowUpRight size={15} /></Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}