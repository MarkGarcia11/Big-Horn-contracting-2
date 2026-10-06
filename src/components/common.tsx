import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type PropsWithChildren,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

export type Locale = "en" | "es";

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("bighorn-language") === "es" ? "es" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("bighorn-language", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}

export const uiText = {
  en: {
    home: "Home",
    services: "Services",
    projects: "Projects",
    process: "Process",
    about: "About",
    reviews: "Reviews",
    contact: "Contact",
    estimate: "Get a Free Estimate",
    freeEstimate: "Free estimate",
    call: "Call Now",
    share: "Share with your partner",
    shareShort: "Share this site",
    local: "Locally owned",
    licensed: "License & insurance details on request",
    area: "Albuquerque & nearby",
    estimates: "Free estimates",
    together: "Good projects are decided together. Bring the whole family to the conversation.",
    copied: "Link copied",
    copyLink: "Copy link",
    emailLink: "Email the link",
    textLink: "Text the link",
    close: "Close",
    sendRequest: "Send my estimate request",
    sending: "Sending your request...",
    name: "Your name",
    phone: "Phone number",
    email: "Email address (optional)",
    serviceType: "What can we help with?",
    details: "Tell us a little about your project",
    contactMethod: "Best way to reach you",
    decisionPartner: "Is someone helping you decide? Add their name (optional)",
    photo: "Add a project photo (optional)",
    selectService: "Choose a service",
    callUs: "Call",
    footerTagline: "Built strong. Built to last. Built for the Southwest.",
    privacy: "Privacy",
    terms: "Terms",
  },
  es: {
    home: "Inicio",
    services: "Servicios",
    projects: "Proyectos",
    process: "Proceso",
    about: "Nosotros",
    reviews: "Reseñas",
    contact: "Contacto",
    estimate: "Solicitar estimado gratis",
    freeEstimate: "Estimado gratis",
    call: "Llamar ahora",
    share: "Compártelo con tu pareja",
    shareShort: "Compartir sitio",
    local: "Negocio local",
    licensed: "Licencia y seguro disponibles al solicitar",
    area: "Albuquerque y alrededores",
    estimates: "Estimados gratis",
    together: "Los buenos proyectos se deciden en familia. Invita a todos a la conversación.",
    copied: "Enlace copiado",
    copyLink: "Copiar enlace",
    emailLink: "Enviar por correo",
    textLink: "Enviar por mensaje",
    close: "Cerrar",
    sendRequest: "Enviar mi solicitud de estimado",
    sending: "Enviando tu solicitud...",
    name: "Tu nombre",
    phone: "Número de teléfono",
    email: "Correo electrónico (opcional)",
    serviceType: "¿En qué te podemos ayudar?",
    details: "Cuéntanos un poco sobre tu proyecto",
    contactMethod: "La mejor forma de contactarte",
    decisionPartner: "¿Alguien te ayuda a decidir? Agrega su nombre (opcional)",
    photo: "Agrega una foto del proyecto (opcional)",
    selectService: "Elige un servicio",
    callUs: "Llamar",
    footerTagline: "Fuerte desde el inicio. Hecho para durar. Hecho para el suroeste.",
    privacy: "Privacidad",
    terms: "Términos",
  },
} as const;

export function text(locale: Locale, key: keyof typeof uiText.en) {
  return uiText[locale][key];
}

export function BrandMark({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M34.6 37.7c-10.1.5-19.2-6.2-19.2-16.4 0-7.7 5.1-13 11.3-13 6 0 9.1 4.1 8.3 8.4-.7 3.9-4.5 5.8-7.6 3.9"
        stroke={light ? "#F7E9D7" : "#C4553B"}
        strokeWidth="4.1"
        strokeLinecap="round"
      />
      <path
        d="M37.4 37.7c10.1.5 19.2-6.2 19.2-16.4 0-7.7-5.1-13-11.3-13-6 0-9.1 4.1-8.3 8.4.7 3.9 4.5 5.8 7.6 3.9"
        stroke={light ? "#F7E9D7" : "#C4553B"}
        strokeWidth="4.1"
        strokeLinecap="round"
      />
      <path
        d="M27 38.5c1.1 10.3 4.5 17.4 9 21.1 4.5-3.7 7.9-10.8 9-21.1M30.5 45.5c3.7 2 7.3 2 11 0"
        stroke={light ? "#F7E9D7" : "#2A2522"}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="36" r="31" stroke={light ? "#EBA63F" : "#E3CDB5"} strokeWidth="1.2" />
    </svg>
  );
}

export function BrandLogo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link className={`brand-lockup ${light ? "brand-lockup-light" : ""}`} to="/" aria-label="Big Horn Contracting home">
      <BrandMark className="brand-mark" light={light} />
      <span className="brand-type">
        <span className="brand-name">Big Horn</span>
        {!compact && <span className="brand-subtitle">Contracting · Albuquerque</span>}
      </span>
    </Link>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  once = true,
}: PropsWithChildren<{ className?: string; delay?: number; once?: boolean }>) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.16, margin: "0px 0px -56px 0px" }}
      transition={{ duration: reduceMotion ? 0.2 : 0.8, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  text: supporting,
  light = false,
  align = "left",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={`section-heading ${align === "center" ? "section-heading-center" : ""} ${light ? "section-heading-light" : ""}`}>
      <span className="eyebrow"><span className="eyebrow-mark" />{eyebrow}</span>
      <h2 id={id} className="display-heading">{title}</h2>
      {supporting && <p className="section-support">{supporting}</p>}
    </Reveal>
  );
}

export function PrimaryLink({
  to,
  children,
  className = "",
}: PropsWithChildren<{ to: string; className?: string }>) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 14, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 170, damping: 14, mass: 0.3 });

  return (
    <motion.div
      className="inline-flex"
      style={{ x: reduceMotion ? 0 : springX, y: reduceMotion ? 0 : springY }}
      onMouseMove={(event) => {
        if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.07);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.11);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <Link to={to} className={`button-primary ${className}`}>
        <span>{children}</span>
        <ArrowRight size={17} strokeWidth={1.8} className="button-arrow" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

export function SecondaryLink({ to, children, className = "" }: PropsWithChildren<{ to: string; className?: string }>) {
  return (
    <Link to={to} className={`button-secondary ${className}`}>
      <span>{children}</span>
      <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  );
}

export function ShareControl({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const title = "Big Horn Contracting | Albuquerque";
  const message = "A local contractor for concrete, block, stucco, and home remodeling.";
  const pageUrl = typeof window === "undefined" ? "" : window.location.href;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url: pageUrl });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    setOpen((current) => !current);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setOpen(true);
    }
  }

  return (
    <div className="share-wrap">
      <button type="button" className={`share-button ${compact ? "share-button-compact" : ""}`} onClick={share} aria-expanded={open} aria-label={text(locale, "share")}>
        <Share2 size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>{compact ? text(locale, "shareShort") : text(locale, "share")}</span>
      </button>
      {open && (
        <div className="share-menu" role="menu" aria-label="Share this website">
          <button type="button" role="menuitem" onClick={copyLink}><Copy size={15} />{copied ? text(locale, "copied") : text(locale, "copyLink")}{copied && <Check size={14} />}</button>
          <a role="menuitem" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${message} ${pageUrl}`)}`}><Mail size={15} />{text(locale, "emailLink")}</a>
          <a role="menuitem" href={`sms:?&body=${encodeURIComponent(`${message} ${pageUrl}`)}`}><MessageCircle size={15} />{text(locale, "textLink")}</a>
        </div>
      )}
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
}: {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [position, setPosition] = useState(52);
  return (
    <div className="before-after">
      <ResponsiveImage src={afterImage} alt={afterAlt} loading="lazy" />
      <div className="before-after-top" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <ResponsiveImage src={beforeImage} alt={beforeAlt} loading="lazy" />
      </div>
      <span className="before-label">Before · reference</span>
      <span className="after-label">After · reference</span>
      <div className="before-divider" style={{ left: `${position}%` }} aria-hidden="true"><span /></div>
      <input
        aria-label="Compare illustrative before and after reference images"
        type="range"
        min="5"
        max="95"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}

export function responsiveSourceSet(src: string) {
  if (!src.includes("images.pexels.com") || !/[?&]w=\d+/i.test(src)) return undefined;
  return [480, 800, 1280].map((width) => `${src.replace(/([?&]w=)\d+/i, `$1${width}`)} ${width}w`).join(", ");
}

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & { src: string };

export function ResponsiveImage({ src, sizes = "(max-width: 760px) 88vw, (max-width: 1280px) 46vw, 640px", ...props }: ResponsiveImageProps) {
  return <img src={src} srcSet={responsiveSourceSet(src)} sizes={sizes} {...props} />;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const offset = useTransform(scrollYProgress, [0, 1], [25, -25]);
  return (
    <div ref={frame} className={`parallax-frame ${className}`}>
      <motion.img
        src={src}
        srcSet={responsiveSourceSet(src)}
        sizes="(max-width: 760px) 90vw, (max-width: 1280px) 46vw, 620px"
        alt={alt}
        className={`parallax-image ${imageClassName}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        style={reduceMotion ? undefined : { y: offset }}
      />
    </div>
  );
}