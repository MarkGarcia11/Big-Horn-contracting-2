import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { services, serviceNameForLocale, site, surroundingAreas } from "../data/site";
import { trackEvent } from "../lib/analytics";
import {
  BrandLogo,
  ShareControl,
  text,
  useLocale,
} from "./common";

const navKeys = ["projects", "process", "about", "reviews", "contact"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  projects: "/projects",
  process: "/process",
  about: "/about",
  reviews: "/reviews",
  contact: "/contact",
};

function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="language-toggle" aria-label="Choose language">
      <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" aria-pressed={locale === "es"} onClick={() => setLocale("es")}>ES</button>
    </div>
  );
}

export function Header() {
  const { locale } = useLocale();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isHome = location.pathname === "/";
  const isTransparent = isHome && scrollY < 72 && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`site-header ${isTransparent ? "site-header-clear" : "site-header-solid"}`}>
        <div className="nav-shell">
          <BrandLogo light={isTransparent} />

          <nav className="desktop-nav" aria-label="Main navigation">
            <div className="nav-services-wrap">
              <div className="nav-service-line">
                <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
                  {text(locale, "services")}
                </NavLink>
                <button
                  className="nav-chevron"
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  aria-expanded={servicesOpen}
                  aria-label="Open service menu"
                >
                  <ChevronDown size={13} />
                </button>
              </div>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    className="services-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
                  >
                    {services.filter((service) => !service.secondary).map((service) => (
                      <Link key={service.slug} to={`/services/${service.slug}`} onClick={() => setServicesOpen(false)}>
                        <span>{serviceNameForLocale(service.slug, locale, service.shortName)}</span><ArrowRight size={14} />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navKeys.map((key) => (
              <NavLink key={key} to={navPaths[key]} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
                {text(locale, key)}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <ShareControl compact />
            <LanguageToggle />
            <a href={`tel:${site.phoneHref}`} className="nav-phone" aria-label={`${text(locale, "call")}: ${site.phone}`} onClick={() => trackEvent("phone_click", { placement: "desktop_nav" })}>
              <Phone size={16} aria-hidden="true" /><span>{site.phone}</span>
            </a>
            <Link className="nav-estimate" to="/contact#estimate">{text(locale, "estimate")}<ArrowRight size={15} /></Link>
          </div>

          <div className="mobile-nav-actions">
            <a href={`tel:${site.phoneHref}`} aria-label={`Call ${site.phone}`} onClick={() => trackEvent("phone_click", { placement: "mobile_nav" })}><Phone size={19} /></a>
            <button type="button" className="menu-trigger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-top"><BrandLogo /><LanguageToggle /></div>
            <nav className="mobile-menu-links" aria-label="Mobile navigation">
              <Link to="/" onClick={closeMenu}>{text(locale, "home")}</Link>
              <Link to="/services" onClick={closeMenu}>{text(locale, "services")}<ArrowRight size={18} /></Link>
              {services.filter((service) => !service.secondary).map((service) => (
                <Link className="mobile-service-link" key={service.slug} to={`/services/${service.slug}`} onClick={closeMenu}>{serviceNameForLocale(service.slug, locale, service.shortName)}</Link>
              ))}
              {navKeys.map((key) => <Link key={key} to={navPaths[key]} onClick={closeMenu}>{text(locale, key)}</Link>)}
            </nav>
            <div className="mobile-menu-bottom">
              <ShareControl />
              <a className="mobile-call" href={`tel:${site.phoneHref}`} onClick={() => trackEvent("phone_click", { placement: "mobile_menu" })}><Phone size={17} />{text(locale, "call")} · {site.phone}</a>
              <Link className="button-primary" to="/contact#estimate" onClick={closeMenu}>{text(locale, "estimate")}<ArrowRight size={17} /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const { locale } = useLocale();
  return (
    <footer className="site-footer">
      <div className="footer-sunset-line" />
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <BrandLogo light />
          <p>{text(locale, "footerTagline")}</p>
          <div className="footer-socials" aria-label="Social links">
            <a href={site.socials.facebook} aria-label="Facebook" className="facebook-letter">f</a>
            <a href={site.socials.instagram} aria-label="Instagram"><Camera size={16} /></a>
            <a href={site.socials.google} aria-label="Google Business Profile" className="google-letter">G</a>
          </div>
          <span className="placeholder-label">Social profiles to be connected</span>
        </div>
        <div>
          <h2>{text(locale, "services")}</h2>
          <ul>{services.map((service) => <li key={service.slug}><Link to={`/services/${service.slug}`}>{serviceNameForLocale(service.slug, locale, service.shortName)}</Link></li>)}</ul>
        </div>
        <div>
          <h2>{locale === "es" ? "Empresa" : "Company"}</h2>
          <ul>
            <li><Link to="/about">{text(locale, "about")}</Link></li>
            <li><Link to="/projects">{text(locale, "projects")}</Link></li>
            <li><Link to="/process">{text(locale, "process")}</Link></li>
            <li><Link to="/reviews">{text(locale, "reviews")}</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h2>{locale === "es" ? "Zonas" : "Service areas"}</h2>
          <ul>
            <li><Link to="/service-areas">Albuquerque</Link></li>
            {surroundingAreas.slice(0, 4).map((area) => <li key={area}><Link to="/service-areas">{area}</Link></li>)}
            <li><Link to="/service-areas">{locale === "es" ? "Ver todas las zonas" : "See all areas"}</Link></li>
          </ul>
        </div>
        <div className="footer-contact-col">
          <h2>{text(locale, "contact")}</h2>
          <a href={`tel:${site.phoneHref}`} className="footer-contact-link">{site.phone}</a>
          <a href={`mailto:${site.emailHref}`} className="footer-contact-link">{site.email}</a>
          <p>{site.hours}</p>
          <p>{site.address}</p>
          <span className="license-note">{site.license}</span>
          <Link className="footer-estimate" to="/contact#estimate">{locale === "es" ? "Hablemos de tu proyecto" : "Tell us about your project"}<ArrowRight size={15} /></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Big Horn Contracting · Albuquerque, NM</span>
        <div><Link to="/privacy">{text(locale, "privacy")}</Link><Link to="/terms">{text(locale, "terms")}</Link></div>
        <span className="footer-badge"><Check size={13} />{locale === "es" ? "Detalles de licencia por confirmar" : "License details to be confirmed"}</span>
      </div>
      <div className="footer-legal-note">{locale === "es" ? "Los datos de licencia, seguro, domicilio y redes sociales son provisionales y deben confirmarse con el propietario." : "License, insurance, address, and social profile details are placeholders until confirmed by the owner."}</div>
    </footer>
  );
}

export function FloatingMobileActions() {
  const { locale } = useLocale();
  return (
    <div className="mobile-action-bar">
      <a className="mobile-action-call" href={`tel:${site.phoneHref}`} onClick={() => trackEvent("phone_click", { placement: "mobile_sticky_bar" })}><Phone size={17} />{text(locale, "callUs")}</a>
      <Link className="mobile-action-estimate" to="/contact#estimate">{text(locale, "freeEstimate")}<ArrowRight size={16} /></Link>
    </div>
  );
}

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const { locale } = useLocale();
  useEffect(() => {
    setVisible(window.localStorage.getItem("bighorn-cookie-notice") !== "dismissed");
  }, []);
  if (!visible) return null;
  return (
    <div className="cookie-notice" role="status">
      <p>{locale === "es" ? "Usamos solo almacenamiento esencial para recordar tu idioma." : "We use essential storage only to remember your language preference."}</p>
      <button type="button" onClick={() => { window.localStorage.setItem("bighorn-cookie-notice", "dismissed"); setVisible(false); }} aria-label={text(locale, "close")}><X size={16} /></button>
    </div>
  );
}

export function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);
  return null;
}