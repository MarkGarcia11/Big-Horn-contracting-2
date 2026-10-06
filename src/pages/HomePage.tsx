import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  HeartHandshake,
  MapPin,
  MessageSquareText,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { coreServices, processSteps, serviceNameForLocale, site, surroundingAreas } from "../data/site";
import { projects } from "../data/projects";
import { reviewSlots } from "../data/reviews";
import EstimateForm from "../components/EstimateForm";
import { trackEvent } from "../lib/analytics";
import {
  BeforeAfterSlider,
  BrandMark,
  ParallaxImage,
  PrimaryLink,
  ResponsiveImage,
  Reveal,
  SectionHeading,
  ShareControl,
  text,
  useLocale,
} from "../components/common";

const LazyWallScene = lazy(() => import("../components/HeroWallScene"));

const trustItems = [
  { en: "Free estimates", es: "Estimados gratis" },
  { en: "Locally owned", es: "Negocio local" },
  { en: "Albuquerque & nearby", es: "Albuquerque y alrededores" },
  { en: "License details to be confirmed", es: "Licencia por confirmar" },
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "Honest estimates",
    copy: "A straightforward scope and price, before the work begins.",
    titleEs: "Estimados honestos",
    copyEs: "Alcance y precio claros antes de empezar el trabajo.",
  },
  {
    icon: Sparkles,
    title: "Craftsmanship that lasts",
    copy: "Careful work and considered details, from first layout to final finish.",
    titleEs: "Trabajo bien hecho",
    copyEs: "Cuidado en cada detalle, desde el primer trazo hasta el acabado.",
  },
  {
    icon: HeartHandshake,
    title: "Respect for your home",
    copy: "We take care around your space, your time, and the people who live there.",
    titleEs: "Respeto por tu hogar",
    copyEs: "Cuidamos tu espacio, tu tiempo y a las personas que viven allí.",
  },
  {
    icon: MessageSquareText,
    title: "Clear communication",
    copy: "No guessing where things stand. We keep the next step easy to understand.",
    titleEs: "Comunicación clara",
    copyEs: "Siempre sabrás qué sigue y en qué etapa está tu proyecto.",
  },
];

function Hero() {
  const { locale } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const [showScene, setShowScene] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(min-width: 1024px)").matches) return;
    const element = heroRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.setTimeout(() => setShowScene(true), 900);
        observer.disconnect();
      }
    }, { rootMargin: "120px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section id="home-hero" className="hero-section" ref={heroRef} aria-labelledby="hero-title">
      <motion.div className="hero-image-plane" style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}>
        <img
          src="/images/desert-courtyard.jpg"
          alt="Illustrative Southwest courtyard with warm stucco walls, masonry, and a concrete patio"
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-sunwash" aria-hidden="true" />
      <div className="hero-content container">
        <motion.div
          className="hero-brand-lockup"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrandMark light className="hero-brand-mark" />
          <span>Big Horn Contracting<br /><small>Albuquerque · New Mexico</small></span>
        </motion.div>
        <h1 id="hero-title" className={`hero-title ${locale === "es" ? "hero-title-spanish" : ""}`}>
          <span className="hero-title-row" style={{ "--row": 0 } as CSSProperties}><span>{locale === "es" ? "Fuerte desde el inicio." : "Built strong."}</span></span>
          <span className="hero-title-row hero-title-accent" style={{ "--row": 1 } as CSSProperties}><span>{locale === "es" ? "Hecho para durar." : "Built to last."}</span></span>
        </h1>
        <motion.p
          className="hero-subtitle"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          {locale === "es"
            ? "Concreto, block, estuco y remodelación para hogares de Albuquerque, con cuidado, honestidad y orgullo."
            : "Concrete, block, stucco, and remodeling for Albuquerque homes, done with care, honesty, and pride."}
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <PrimaryLink to="/contact#estimate">{text(locale, "estimate")}</PrimaryLink>
          <a className="hero-call" href={`tel:${site.phoneHref}`} onClick={() => trackEvent("phone_click", { placement: "hero" })}><span className="call-icon"><ArrowUpRight size={16} /></span>{text(locale, "call")}</a>
        </motion.div>
        <motion.div
          className="hero-share"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.15 }}
        >
          <span>{locale === "es" ? "¿Deciden juntos?" : "Making the decision together?"}</span>
          <ShareControl />
        </motion.div>
        {showScene && (
          <div className="hero-wall-art" aria-hidden="true">
            <Suspense fallback={null}><LazyWallScene /></Suspense>
          </div>
        )}
        <div className="hero-scroll-note"><span />{locale === "es" ? "Sigue conociéndonos" : "Get to know us"}<ChevronDown size={14} /></div>
      </div>
      <div className="hero-bottom-curve" aria-hidden="true" />
    </section>
  );
}

function TrustStrip() {
  const { locale } = useLocale();
  return (
    <div className="trust-strip" aria-label={locale === "es" ? "Información rápida" : "At a glance"}>
      <div className="container trust-strip-inner">
        {trustItems.map((item, index) => (
          <div key={item.en} className="trust-strip-item"><span className="trust-dot" />{locale === "es" ? item.es : item.en}{index < trustItems.length - 1 && <span className="trust-divider" aria-hidden="true" />}</div>
        ))}
      </div>
    </div>
  );
}

function ServiceGrid() {
  const { locale } = useLocale();
  return (
    <section className="section-pad services-section" aria-labelledby="services-title">
      <div className="container">
        <div className="section-header-row">
          <SectionHeading
            id="services-title"
            eyebrow={locale === "es" ? "LO QUE CONSTRUIMOS" : "WHAT WE BUILD"}
            title={locale === "es" ? "Trabajo fuerte. Hogares más tuyos." : "Strong work. A home that feels more yours."}
            text={locale === "es" ? "Cuatro especialidades para cuidar, mejorar y dar forma a tu hogar." : "Four ways to care for, improve, and shape the place you call home."}
          />
          <Link className="text-link section-header-link" to="/services">{locale === "es" ? "Ver todos los servicios" : "Explore all services"}<ArrowUpRight size={16} /></Link>
        </div>
        <div className="service-grid">
          {coreServices.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.08}>
              <Link className={`service-tile service-tile-${service.slug}`} to={`/services/${service.slug}`}>
                <div className="service-tile-image"><ResponsiveImage src={service.image} alt={service.imageAlt} loading="lazy" sizes="(max-width: 760px) 92vw, (max-width: 1280px) 48vw, 650px" /></div>
                <div className="service-tile-shade" />
                <div className="service-tile-content">
                  <span className="service-number">0{index + 1} <span>·</span> {service.eyebrow}</span>
                  <h3>{serviceNameForLocale(service.slug, locale, service.shortName)}</h3>
                  <p>{locale === "es"
                    ? ["Una base sólida para tu vida diaria.", "Mampostería hecha para sostenerse.", "Un acabado que pertenece al suroeste.", "Espacios interiores que se sienten como tuyos."][index]
                    : service.benefit}</p>
                  <span className="service-tile-link">{locale === "es" ? "Conoce más" : "Explore the work"}<ArrowUpRight size={18} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="secondary-service-note">
          <span className="secondary-note-mark"><Check size={15} /></span>
          <p><strong>{locale === "es" ? "Un extra útil:" : "A helpful extra:"}</strong> {locale === "es" ? "Limpieza y retiro disponibles cuando tu proyecto lo necesita." : "Cleanup and hauling are available when your project needs it."}</p>
          <Link to="/services/cleanup-hauling">{locale === "es" ? "Detalles" : "A little more"}<ArrowRight size={14} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

function WhyUs() {
  const { locale } = useLocale();
  return (
    <section className="section-pad why-section" aria-labelledby="why-title">
      <div className="container why-layout">
        <div className="why-copy">
          <SectionHeading
            id="why-title"
            eyebrow={locale === "es" ? "HECHO CON CUIDADO" : "THE BIG HORN WAY"}
            title={locale === "es" ? "El buen trabajo también se siente." : "Good work should feel good, too."}
            text={locale === "es" ? "Tu casa merece un equipo que escuche, cuide y cumpla lo que promete." : "Your home deserves a crew that listens, takes care, and follows through."}
          />
          <div className="couples-note"><span className="couples-note-line" />{text(locale, "together")}</div>
          <ShareControl />
        </div>
        <div className="reason-grid">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={index * 0.08}>
                <article className="reason-card sky-glass">
                  <span className="reason-icon"><Icon size={21} strokeWidth={1.5} /></span>
                  <h3>{locale === "es" ? reason.titleEs : reason.title}</h3>
                  <p>{locale === "es" ? reason.copyEs : reason.copy}</p>
                  <span className="reason-corner" aria-hidden="true" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { locale } = useLocale();
  const track = useRef<HTMLDivElement>(null);
  const featured = projects.slice(0, 5);
  function moveTrack(direction: number) {
    track.current?.scrollBy({ left: direction * (track.current.clientWidth * 0.75), behavior: "smooth" });
  }

  return (
    <section className="section-pad projects-section" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-header-row">
          <SectionHeading
            id="projects-title"
            eyebrow={locale === "es" ? "IDEAS PARA TU HOGAR" : "A FEW GOOD IDEAS"}
            title={locale === "es" ? "Trabajo que habla por sí solo." : "Work that speaks for itself."}
            text={locale === "es" ? "Explora algunas ideas de acabado. Fotos de proyectos reales pronto." : "Explore a few finish ideas. Big Horn project photos are coming soon."}
          />
          <div className="carousel-controls">
            <button type="button" aria-label="Previous projects" onClick={() => moveTrack(-1)}><ArrowLeft size={17} /></button>
            <button type="button" aria-label="Next projects" onClick={() => moveTrack(1)}><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
      <div className="project-carousel" ref={track} tabIndex={0} aria-label="Featured project image references">
        {featured.map((project, index) => (
          <Reveal className="project-carousel-item" key={project.id} delay={index * 0.04}>
            <Link className="project-preview" to={`/projects#${project.id}`}>
              <ResponsiveImage src={project.image} alt={project.alt} loading="lazy" sizes="(max-width: 760px) 80vw, (max-width: 1280px) 35vw, 405px" />
              <span className="project-preview-overlay" />
              <span className="placeholder-ribbon">Photo reference</span>
              <span className="project-preview-info"><span>{locale === "es" ? projectCategoryEs(project.category) : project.category} · {project.area}</span><strong>{locale === "es" ? "Ideas para tu hogar" : project.title}</strong><span className="project-view-link">{locale === "es" ? "Ver referencia" : "View reference"}<ArrowUpRight size={16} /></span></span>
            </Link>
          </Reveal>
        ))}
        <div className="project-carousel-end"><Link to="/projects">{locale === "es" ? "Conoce nuestro enfoque" : "See our approach"}<MoveRight size={20} /></Link></div>
      </div>
      <div className="container projects-note">{locale === "es" ? "Estas imágenes son referencias visuales, no trabajos completados por Big Horn." : "These are visual references, not completed Big Horn projects. Replace with owner-approved photos."}</div>
      {projects.find((project) => project.id === "kitchen")?.beforeImage && (
        <div className="container before-after-feature">
          <Reveal className="before-after-feature-copy">
            <span className="eyebrow"><span className="eyebrow-mark" />{locale === "es" ? "CAMBIOS QUE SE NOTAN" : "ROOM TO REIMAGINE"}</span>
            <h3>{locale === "es" ? "Un espacio, dos posibilidades." : "One room. A new point of view."}</h3>
            <p>{locale === "es" ? "Mueve el control para explorar referencias visuales. No son fotos de un proyecto de Big Horn." : "Move the handle to explore visual references. These are not before-and-after photos from a Big Horn project."}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfterSlider
              beforeImage={projects.find((project) => project.id === "kitchen")!.beforeImage!}
              afterImage={projects.find((project) => project.id === "kitchen")!.image}
              beforeAlt={projects.find((project) => project.id === "kitchen")!.beforeAlt!}
              afterAlt={projects.find((project) => project.id === "kitchen")!.alt}
            />
          </Reveal>
        </div>
      )}
    </section>
  );
}

function ProcessPreview() {
  const { locale } = useLocale();
  return (
    <section className="section-pad process-preview-section" aria-labelledby="process-preview-title">
      <div className="container process-preview-layout">
        <div className="process-preview-intro">
          <SectionHeading
            id="process-preview-title"
            eyebrow={locale === "es" ? "UN PROCESO CLARO" : "A CLEAR PROCESS"}
            title={locale === "es" ? "Sin sorpresas. Paso a paso." : "No guesswork. Just one clear step at a time."}
            text={locale === "es" ? "Sabrás qué sigue desde el primer mensaje hasta el recorrido final." : "You will know what happens next, from the first call to the final walk-through."}
          />
          <PrimaryLink to="/process">{locale === "es" ? "Conoce el proceso" : "See how it works"}</PrimaryLink>
        </div>
        <div className="process-list">
          {processSteps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.07}>
              <div className="process-step">
                <span className="process-step-number">{step.number}</span>
                <div><h3>{locale === "es" ? ["Cuéntanos tu idea", "Recibe un estimado gratis", "Revisa el plan y precio", "Construimos con cuidado", "Recorrido final juntos"][index] : step.title}</h3><p>{locale === "es" ? ["Una llamada o un formulario corto es suficiente para empezar.", "Escuchamos y conocemos mejor tu espacio.", "Conocerás el alcance y los siguientes pasos antes de empezar.", "Cuidamos tu hogar y mantenemos el área ordenada.", "Revisamos el trabajo contigo y respondemos tus preguntas."][index] : step.text}</p></div>
                {index === 0 && <span className="process-step-start" aria-hidden="true" />}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="process-sun-shape" aria-hidden="true" />
    </section>
  );
}

function projectCategoryEs(category: string) {
  const labels: Record<string, string> = { Concrete: "Concreto", Block: "Block", Stucco: "Estuco", Remodeling: "Remodelación" };
  return labels[category] ?? category;
}

function MeetOwner() {
  const { locale } = useLocale();
  return (
    <section className="section-pad owner-section" aria-labelledby="owner-title">
      <div className="container owner-layout">
        <Reveal className="owner-photo-wrap">
          <ParallaxImage
            src="https://images.pexels.com/photos/4981778/pexels-photo-4981778.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100"
            alt="Placeholder photograph of a tradesperson checking a measurement at work; replace with Gerardo's owner portrait"
            className="owner-photo"
          />
          <span className="owner-photo-note">Owner photo placeholder</span>
          <span className="owner-photo-side">Local hands · honest work</span>
        </Reveal>
        <div className="owner-copy">
          <SectionHeading
            id="owner-title"
            eyebrow={locale === "es" ? "CONOCE A GERARDO" : "A NOTE FROM GERARDO"}
            title={locale === "es" ? "Tu hogar merece trato de familia." : "Your home deserves to be treated like home."}
          />
          <Reveal delay={0.15}>
            <p className="owner-story">
              {locale === "es"
                ? "Soy Gerardo. Para mí, el buen trabajo empieza por escuchar. Quiero que entiendas el plan, te sientas a gusto con quien entra a tu casa y estés orgulloso del resultado."
                : "I'm Gerardo. To me, good work starts with listening. I want you to understand the plan, feel comfortable with the people in your home, and feel proud of the result."}
            </p>
            <p className="owner-story owner-story-small">
              {locale === "es"
                ? "Estoy construyendo Big Horn para hacer las cosas con calma, respeto y orgullo aquí en Albuquerque."
                : "I'm building Big Horn around steady work, respect, and pride right here in Albuquerque."}
            </p>
            <div className="owner-signature">Gerardo<span>{locale === "es" ? " · Propietario" : " · Owner"}</span></div>
            <Link to="/about" className="text-link">{locale === "es" ? "Conoce nuestra historia" : "Get to know us"}<ArrowUpRight size={16} /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ReviewsPreview() {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % reviewSlots.length), 6200);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);
  const review = reviewSlots[index];

  return (
    <section className="section-pad reviews-section" aria-labelledby="reviews-title">
      <div className="container reviews-layout">
        <div className="reviews-copy">
          <SectionHeading
            id="reviews-title"
            eyebrow={locale === "es" ? "PALABRAS DE LA COMUNIDAD" : "WORDS FROM THE NEIGHBORHOOD"}
            title={locale === "es" ? "La confianza se gana." : "Trust is earned, one home at a time."}
            text={locale === "es" ? "Las reseñas verificadas de Google se mostrarán aquí cuando estén listas." : "Verified Google reviews will live here as they are collected."}
          />
          <Link to="/reviews" className="text-link">{locale === "es" ? "Visita reseñas" : "Explore reviews"}<ArrowUpRight size={16} /></Link>
        </div>
        <Reveal className="review-placeholder" key={review.id}>
          <div className="review-stars" aria-label="Star rating pending"><Star /><Star /><Star /><Star /><Star /></div>
          <div className="review-placeholder-rule" />
          <p className="review-quote">{locale === "es" ? "Aquí irá la voz auténtica de un cliente." : "A real homeowner's words belong here."}</p>
          <div className="review-placeholder-footer"><span>{locale === "es" ? "Reseña verificada pendiente" : "Verified review pending"}</span><span>{review.location}</span></div>
          <span className="review-placeholder-note">Review placeholder · no rating supplied</span>
          <div className="review-pips" aria-label={`Placeholder ${index + 1} of ${reviewSlots.length}`}>
            {reviewSlots.map((slot, i) => <button key={slot.id} type="button" className={index === i ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Show review placeholder ${i + 1}`} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceAreaPreview() {
  const { locale } = useLocale();
  return (
    <section className="section-pad area-section" aria-labelledby="area-title">
      <div className="container area-layout">
        <div className="area-copy">
          <SectionHeading
            id="area-title"
            eyebrow={locale === "es" ? "CERCA DE CASA" : "ROOTED IN ALBUQUERQUE"}
            title={locale === "es" ? "De Albuquerque y comunidades cercanas." : "Albuquerque, and the places just beyond."}
            text={locale === "es" ? "Revisa si trabajamos en tu zona. La lista de comunidades está pendiente de confirmación." : "See if your home is in our service area. Nearby communities are being confirmed with the owner."}
          />
          <div className="area-places"><span>Albuquerque</span><span>{surroundingAreas.slice(0, 4).join(" · ")}</span></div>
          <Link to="/service-areas" className="text-link">{locale === "es" ? "Ver todas las zonas" : "View all service areas"}<ArrowUpRight size={16} /></Link>
        </div>
        <Reveal className="area-map-art">
          <svg viewBox="0 0 640 460" role="img" aria-label="Illustrated Albuquerque service area map showing nearby communities">
            <defs>
              <linearGradient id="map-wash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F8E8D1" /><stop offset="1" stopColor="#E7D2B8" /></linearGradient>
              <linearGradient id="road-line" x1="0" x2="1"><stop offset="0" stopColor="#C4553B" /><stop offset="1" stopColor="#EBA63F" /></linearGradient>
            </defs>
            <path d="M320 30C452 49 553 142 565 255c12 111-92 168-219 174C222 434 92 398 65 295 39 198 100 81 213 45c35-11 73-20 107-15Z" fill="url(#map-wash)" />
            <path d="M41 291c70-27 128-29 200-5 86 29 155 37 222 15 46-15 82-16 132-3" fill="none" stroke="#84BEB0" strokeWidth="8" opacity=".62" strokeLinecap="round" />
            <path d="M117 94c49 45 83 106 99 168 18 70 58 107 108 140m180-321c-46 47-78 94-89 145-17 77-57 127-109 160" fill="none" stroke="#fffaf3" strokeWidth="13" strokeLinecap="round" />
            <path d="M122 95c49 45 83 106 99 168 18 70 58 107 108 140m180-321c-46 47-78 94-89 145-17 77-57 127-109 160" fill="none" stroke="#d5bea5" strokeWidth="1.3" strokeDasharray="4 7" strokeLinecap="round" />
            <path d="M119 316c80-58 139-90 210-95 72-5 130 31 198 37" fill="none" stroke="url(#road-line)" strokeWidth="2.5" strokeDasharray="4 8" />
            <g className="map-point map-point-center"><circle cx="321" cy="221" r="18" fill="#C4553B" /><circle cx="321" cy="221" r="31" fill="#C4553B" opacity=".15" /><circle cx="321" cy="221" r="5" fill="#FBF6EE" /></g>
            <g className="map-point"><circle cx="229" cy="125" r="5" fill="#2A9D8F" /><text x="184" y="111">Rio Rancho</text></g>
            <g className="map-point"><circle cx="449" cy="147" r="5" fill="#2A9D8F" /><text x="462" y="151">Bernalillo</text></g>
            <g className="map-point"><circle cx="389" cy="326" r="5" fill="#2A9D8F" /><text x="402" y="333">Los Lunas</text></g>
            <g className="map-point"><circle cx="182" cy="304" r="5" fill="#2A9D8F" /><text x="131" y="331">Corrales</text></g>
            <text x="346" y="216" className="map-city">Albuquerque</text>
          </svg>
          <span className="map-caption"><MapPin size={15} />{locale === "es" ? "Zona aproximada · confirma tu domicilio" : "Approximate service area · confirm your address"}</span>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  const { locale } = useLocale();
  return (
    <section className="final-cta-section" aria-labelledby="final-cta-title">
      <div className="final-cta-glow" aria-hidden="true" />
      <div className="container final-cta-layout">
        <div className="final-cta-copy">
          <Reveal>
            <span className="eyebrow eyebrow-light"><span className="eyebrow-mark" />{locale === "es" ? "EMPECEMOS JUNTOS" : "LET'S START WITH A CONVERSATION"}</span>
            <h2 id="final-cta-title" className="display-heading">{locale === "es" ? "Construyamos algo que te encante, juntos." : "Let's build something you'll love, together."}</h2>
            <p>{locale === "es" ? "Cuéntanos lo que imaginas. Te responderemos dentro de un día hábil." : "Tell us what you have in mind. We will get back to you within one business day."}</p>
            <a className="final-phone" href={`tel:${site.phoneHref}`}>{site.phone}<ArrowUpRight size={17} /></a>
            <ShareControl />
          </Reveal>
        </div>
        <Reveal className="final-form-glass" delay={0.12}>
          <div className="final-form-heading"><span>01 / 03</span><p>{locale === "es" ? "Unos detalles para comenzar." : "A few details to get us started."}</p></div>
          <EstimateForm compact />
          <p className="final-form-footnote">{text(locale, "together")}</p>
        </Reveal>
      </div>
      <div className="final-cta-horn" aria-hidden="true"><BrandMark light /></div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <ServiceGrid />
      <WhyUs />
      <FeaturedProjects />
      <ProcessPreview />
      <MeetOwner />
      <ReviewsPreview />
      <ServiceAreaPreview />
      <FinalCta />
    </main>
  );
}