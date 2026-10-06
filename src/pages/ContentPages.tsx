import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { coreServices, processSteps, serviceBenefitForLocale, serviceNameForLocale, services, site, surroundingAreas, type Service } from "../data/site";
import { projectFilters, projects, type Project } from "../data/projects";
import EstimateForm from "../components/EstimateForm";
import {
  BeforeAfterSlider,
  BrandMark,
  ParallaxImage,
  PrimaryLink,
  ResponsiveImage,
  Reveal,
  SectionHeading,
  text,
  useLocale,
  responsiveSourceSet,
} from "../components/common";

function PageHero({
  eyebrow,
  title,
  description,
  image,
  alt,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  return (
    <section ref={heroRef} className={`page-hero ${compact ? "page-hero-compact" : ""}`}>
      <motion.img className="page-hero-image" src={image} srcSet={responsiveSourceSet(image)} sizes="100vw" alt={alt} loading="eager" style={reduceMotion ? undefined : { y }} />
      <div className="page-hero-shade" />
      <div className="container page-hero-content">
        <Reveal>
          <span className="eyebrow eyebrow-light"><span className="eyebrow-mark" />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <PrimaryLink to="/contact#estimate">{text(locale, "estimate")}</PrimaryLink>
        </Reveal>
      </div>
      <span className="page-hero-note"><span />{site.city}, {site.region}</span>
    </section>
  );
}

function ServiceLinks({ servicesToShow }: { servicesToShow: Service[] }) {
  const { locale } = useLocale();
  return (
    <div className="service-grid secondary-grid">
      {servicesToShow.map((service, index) => (
        <Reveal key={service.slug} delay={index * 0.06}>
          <Link to={`/services/${service.slug}`} className="service-tile secondary-tile">
            <div className="service-tile-image"><ResponsiveImage src={service.image} alt={service.imageAlt} loading="lazy" sizes="(max-width: 760px) 92vw, (max-width: 1280px) 48vw, 650px" /></div>
            <span className="service-tile-shade" />
            <span className="service-tile-content">
              <span className="service-number">0{index + 1} · {service.eyebrow}</span>
              <strong>{serviceNameForLocale(service.slug, locale, service.shortName)}</strong>
              <span className="service-tile-summary">{serviceBenefitForLocale(service.slug, locale, service.benefit)}</span>
              <span className="service-tile-link">{locale === "es" ? "Explorar" : "Explore service"}<ArrowUpRight size={17} /></span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function ServicesPage() {
  const { locale } = useLocale();
  const image = "https://images.pexels.com/photos/34960819/pexels-photo-34960819.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000";
  return (
    <main className="inner-page">
      <PageHero
        eyebrow={locale === "es" ? "NUESTROS SERVICIOS" : "OUR SERVICES"}
        title={locale === "es" ? "El oficio adecuado para tu hogar." : "The right kind of work for your home."}
        description={locale === "es" ? "Concreto, block, estuco y remodelación interior, con cuidado desde la primera conversación." : "Concrete, block, stucco, and interior remodeling, with care from the first conversation."}
        image={image}
        alt="Warm Southwest stucco home glowing in the late afternoon sun"
      />
      <section className="section-pad">
        <div className="container">
          <SectionHeading eyebrow={locale === "es" ? "TRABAJO PARA TODAS LAS ETAPAS" : "GOOD WORK, CLOSE TO HOME"} title={locale === "es" ? "Espacios más sólidos. Una vida más sencilla." : "Stronger spaces. An easier everyday."} text={locale === "es" ? "Cada proyecto empieza con escuchar lo que necesitas y termina con un recorrido juntos." : "Every project starts with listening to what you need, and ends with a walk-through together."} />
          <ServiceLinks servicesToShow={coreServices} />
          <Reveal className="secondary-service-note service-secondary-note">
            <span className="secondary-note-mark"><Check size={15} /></span>
            <p><strong>{locale === "es" ? "También podemos ayudar con:" : "Also available when you need it:"}</strong> {locale === "es" ? "limpieza y retiro vinculados a tu proyecto." : "cleanup and hauling as a small add-on to your project."}</p>
            <Link to="/services/cleanup-hauling">{locale === "es" ? "Más información" : "Learn a little more"}<ArrowRight size={14} /></Link>
          </Reveal>
        </div>
      </section>
      <div className="simple-cta-band"><div className="container"><p>{locale === "es" ? "¿Tienes preguntas sobre el alcance?" : "Not sure what your project needs yet?"}</p><PrimaryLink to="/contact#estimate">{text(locale, "estimate")}</PrimaryLink></div></div>
    </main>
  );
}

export function ServicePage() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const service = services.find((item) => item.slug === slug);
  if (!service) return <NotFoundPage />;

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const serviceProjects = projects.filter((project) => project.category === (service.slug === "block" ? "Block" : service.shortName));

  return (
    <main className="inner-page">
      <PageHero
        eyebrow={service.eyebrow}
        title={locale === "es" ? serviceTitleEs(service) : service.name}
        description={locale === "es" ? serviceDescriptionEs(service) : service.description}
        image={service.image}
        alt={service.imageAlt}
      />
      <section className="section-pad service-detail-intro">
        <div className="container detail-intro-grid">
          <SectionHeading
            eyebrow={locale === "es" ? "LO QUE PODEMOS HACER" : "WHAT WE CAN HELP WITH"}
            title={locale === "es" ? "Alcance claro. Acabado cuidado." : "A clear scope. A careful finish."}
            text={locale === "es" ? "Hablemos del espacio, los materiales y el resultado que quieres." : "Let's talk about the space, the materials, and the result you have in mind."}
          />
          <Reveal className="included-list">
            {service.included.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{locale === "es" ? includedEs(service.slug, index, item) : item}</p><Check size={16} /></div>)}
          </Reveal>
        </div>
      </section>
      <section className="service-process-section">
        <div className="container service-process-grid">
          <div><SectionHeading eyebrow={locale === "es" ? "CÓMO EMPEZAMOS" : "HOW WE GET THERE"} title={locale === "es" ? "Una conversación, luego un plan." : "A conversation, then a plan."} text={locale === "es" ? "Primero definimos el objetivo. Después dejamos claros el alcance y los siguientes pasos." : "First, we understand the goal. Then we make the scope and next steps easy to follow."} /></div>
          <div className="service-mini-steps">
            {["Listen to your priorities", "Visit and measure the space", "Share a free, clear estimate"].map((step, index) => <Reveal key={step} delay={index * 0.07}><div><span>0{index + 1}</span><p>{locale === "es" ? ["Escuchamos tus prioridades", "Visitamos y medimos el espacio", "Compartimos un estimado claro y gratis"][index] : step}</p></div></Reveal>)}
          </div>
        </div>
      </section>
      {serviceProjects.length > 0 && (
        <section className="section-pad service-gallery-section">
          <div className="container"><SectionHeading eyebrow={locale === "es" ? "REFERENCIAS VISUALES" : "A LOOK AT THE DETAILS"} title={locale === "es" ? "Materiales, luz y posibilidades." : "Materials, light, and possibilities."} text={locale === "es" ? "Imágenes de referencia que el propietario reemplazará con proyectos Big Horn aprobados." : "Reference imagery to be replaced with approved Big Horn project photos."} />
            <div className="service-gallery-row">{serviceProjects.slice(0, 3).map((project) => <figure key={project.id}><ResponsiveImage src={project.image} alt={project.alt} loading="lazy" sizes="(max-width: 760px) 46vw, 32vw" /><figcaption>{project.caption} <span>· {locale === "es" ? "imagen de referencia" : "photo reference"}</span></figcaption></figure>)}</div>
          </div>
        </section>
      )}
      <section className="service-estimate-section" id="estimate">
        <div className="container service-estimate-grid">
          <div className="service-estimate-copy"><span className="eyebrow"><span className="eyebrow-mark" />{locale === "es" ? "HABLEMOS DE TU PROYECTO" : "LET'S TALK ABOUT YOUR PROJECT"}</span><h2>{locale === "es" ? `¿Pensando en ${serviceTitleEs(service).toLowerCase()}?` : `Thinking about ${service.name.toLowerCase()}?`}</h2><p>{locale === "es" ? "Cuéntanos un poco y te llamaremos dentro de un día hábil." : "Tell us a little about it. We will call you within one business day."}</p><a href={`tel:${site.phoneHref}`}>{site.phone}<ArrowUpRight size={15} /></a></div>
          <div className="service-mini-form"><EstimateForm compact defaultService={service.name} /></div>
        </div>
      </section>
      <section className="section-pad service-faq-section">
        <div className="container"><SectionHeading eyebrow={locale === "es" ? "PREGUNTAS COMUNES" : "GOOD TO KNOW"} title={locale === "es" ? "Algunas respuestas para empezar." : "A few answers to get you started."} /><FaqList items={service.faqs.map((faq) => ({ question: locale === "es" ? faqEs(faq.question) : faq.question, answer: locale === "es" ? faqAnswerEs(faq.answer) : faq.answer }))} /></div>
      </section>
      <section className="section-pad related-services-section"><div className="container"><SectionHeading eyebrow={locale === "es" ? "TAMBIÉN PODEMOS AYUDAR" : "MORE FOR YOUR HOME"} title={locale === "es" ? "Trabajo que combina." : "Work that works together."} /><ServiceLinks servicesToShow={related} /></div></section>
    </main>
  );
}

function serviceTitleEs(service: Service) {
  const titles: Record<string, string> = {
    concrete: "Concreto",
    block: "Block y CMU",
    stucco: "Estuco",
    remodeling: "Remodelación interior",
    "cleanup-hauling": "Limpieza y retiro",
  };
  return titles[service.slug] ?? service.name;
}

function serviceDescriptionEs(service: Service) {
  const descriptions: Record<string, string> = {
    concrete: "Desde la primera preparación hasta el acabado final, hacemos que el trabajo de concreto sea claro, cuidadoso y pensado para tu hogar.",
    block: "El trabajo de block puede brindar privacidad, estructura y un acabado más completo a tus espacios exteriores.",
    stucco: "Estuco nuevo y reparaciones cuidadosas, con color, textura y carácter propios de una casa de Nuevo México.",
    remodeling: "Renovamos los espacios que usas todos los días, con un plan claro y cuidado por el resto de tu hogar.",
    "cleanup-hauling": "Limpieza y retiro disponibles como servicio secundario cuando ayudan a completar tu proyecto.",
  };
  return descriptions[service.slug] ?? service.description;
}

function includedEs(slug: string, index: number, fallback: string) {
  const localized: Record<string, string[]> = {
    concrete: ["Entradas, patios y senderos", "Losas y ampliaciones", "Acabados estampados y decorativos", "Preparación y acabado limpio"],
    block: ["Muros de privacidad y jardín", "Muros de contención y reparaciones", "Estructuras exteriores", "Detalles para acabado y estuco"],
    stucco: ["Estuco nuevo para ampliaciones y muros", "Reparaciones de grietas y superficies", "Colores y texturas", "Actualizaciones que combinan con el estuco existente"],
    remodeling: ["Actualizaciones de cocina y baño", "Pisos, drywall y acabados", "Renovación de habitaciones", "Protección del hogar y limpieza diaria"],
  };
  return localized[slug]?.[index] ?? fallback;
}

function ProjectsLightbox({ active, onClose, onChange }: { active: Project; onClose: () => void; onChange: (direction: number) => void }) {
  const touchStartX = useRef<number | null>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange(1);
      if (event.key === "ArrowLeft") onChange(-1);
    };
    window.addEventListener("keydown", handleKey);
    document.body.classList.add("lightbox-open");
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.classList.remove("lightbox-open");
    };
  }, [onChange, onClose]);

  return (
    <motion.div className="lightbox-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        className="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${active.title} image reference`}
        onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const difference = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(difference) > 55) onChange(difference < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close gallery"><X size={21} /></button>
        <button type="button" className="lightbox-nav lightbox-prev" onClick={() => onChange(-1)} aria-label="Previous project"><ArrowRight size={20} /></button>
        <figure>
          <ResponsiveImage src={active.image} alt={active.alt} sizes="(max-width: 760px) 94vw, 78vw" />
          <figcaption><span>{active.category} · {active.area}</span><strong>{active.title}</strong><small>Placeholder reference image · not a completed Big Horn project</small></figcaption>
        </figure>
        <button type="button" className="lightbox-nav lightbox-next" onClick={() => onChange(1)} aria-label="Next project"><ArrowRight size={20} /></button>
      </div>
    </motion.div>
  );
}

export function ProjectsPage() {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const displayed = projects.filter((project) => filter === "All" || project.category === filter);
  const active = activeIndex === null ? null : displayed[activeIndex];
  const changeActive = (direction: number) => setActiveIndex((index) => index === null ? null : (index + direction + displayed.length) % displayed.length);

  return (
    <main className="inner-page">
      <PageHero
        eyebrow={locale === "es" ? "GALERÍA DE PROYECTOS" : "PROJECTS & DETAILS"}
        title={locale === "es" ? "Acabados que hablan por sí solos." : "Details worth taking a closer look at."}
        description={locale === "es" ? "Explora materiales y estilos. Muy pronto, fotos de proyectos reales de Big Horn." : "Explore materials and finish ideas. Big Horn project photos are coming soon."}
        image="/images/desert-courtyard.jpg"
        alt="A quiet New Mexico courtyard with stucco, masonry, and concrete finishes"
      />
      <section className="section-pad projects-gallery-section" id="gallery">
        <div className="container">
          <div className="section-header-row"><SectionHeading eyebrow={locale === "es" ? "IDEAS VISUALES" : "REFERENCE GALLERY"} title={locale === "es" ? "Encuentra lo que te gusta." : "Find a finish that feels like you."} text={locale === "es" ? "Filtra por tipo de trabajo. Estas imágenes son referencias y se reemplazarán por proyectos aprobados." : "Filter by the kind of work. These are visual references and will be replaced with owner-approved projects."} /></div>
          <div className="filter-row" role="group" aria-label="Filter gallery by service">
            {projectFilters.map((category) => <button key={category} type="button" className={filter === category ? "filter-chip active" : "filter-chip"} aria-pressed={filter === category} onClick={() => { setFilter(category); setActiveIndex(null); }}>{locale === "es" ? categoryEs(category) : category}</button>)}
          </div>
          <div className="gallery-grid">
            {displayed.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 0.06} className={`gallery-item gallery-item-${index % 3}`}>
                <button type="button" className="gallery-button" onClick={() => setActiveIndex(index)} aria-label={`Open ${project.category} project reference in gallery`}>
                  <ResponsiveImage src={project.image} alt={project.alt} loading="lazy" sizes="(max-width: 760px) 46vw, (max-width: 1280px) 32vw, 420px" />
                  <span className="placeholder-ribbon">Photo reference</span>
                  <span className="gallery-card-overlay"><span>{project.category} · {project.area}</span><strong>{project.title}</strong><span className="project-view-link">{locale === "es" ? "Ver imagen" : "View image"}<ArrowUpRight size={16} /></span></span>
                </button>
                <p>{project.caption}</p>
              </Reveal>
            ))}
          </div>
          {displayed.some((project) => project.beforeImage) && (
            <div className="gallery-before-after">
              <div><span className="eyebrow"><span className="eyebrow-mark" />{locale === "es" ? "CONTROL INTERACTIVO" : "INTERACTIVE DETAIL"}</span><h2>{locale === "es" ? "Compara dos ideas." : "Compare two visual ideas."}</h2><p>Illustrative stock photos only. Replace with an approved before-and-after pair.</p></div>
              {displayed.filter((project) => project.beforeImage).map((project) => <BeforeAfterSlider key={project.id} beforeImage={project.beforeImage!} afterImage={project.image} beforeAlt={project.beforeAlt!} afterAlt={project.alt} />)}
            </div>
          )}
          <p className="project-placeholder-disclaimer">{locale === "es" ? "Las referencias no son trabajos completados por Big Horn. La galería se actualizará con fotos autorizadas." : "Reference images are not completed Big Horn projects. The gallery will be updated with approved project photography."}</p>
        </div>
      </section>
      <AnimatePresence>{active && <ProjectsLightbox active={active} onClose={() => setActiveIndex(null)} onChange={changeActive} />}</AnimatePresence>
    </main>
  );
}

function categoryEs(category: string) {
  const labels: Record<string, string> = { All: "Todo", Concrete: "Concreto", Block: "Block", Stucco: "Estuco", Remodeling: "Remodelación" };
  return labels[category] ?? category;
}

export function AboutPage() {
  const { locale } = useLocale();
  return (
    <main className="inner-page">
      <PageHero
        eyebrow={locale === "es" ? "CONOCE BIG HORN" : "A LITTLE ABOUT US"}
        title={locale === "es" ? "Orgullo local. Trabajo que perdura." : "Local pride. Work that holds up."}
        description={locale === "es" ? "Construimos para las casas y las familias que hacen especial al suroeste." : "We build for the homes and families that make the Southwest feel like home."}
        image="/images/desert-courtyard.jpg"
        alt="Southwest home and courtyard in warm Albuquerque light"
      />
      <section className="section-pad about-story-section">
        <div className="container about-story-grid">
          <div><SectionHeading eyebrow={locale === "es" ? "NUESTRA HISTORIA" : "THE IDEA BEHIND THE NAME"} title={locale === "es" ? "Firme cuando importa." : "Stand firm when it matters."} /></div>
          <Reveal><p className="about-story-large">{locale === "es" ? "El borrego cimarrón sabe adaptarse. Es fuerte, constante y conoce su hogar." : "The bighorn knows how to adapt. It is strong, steady, and at home in this landscape."}</p><p>{locale === "es" ? "Esa es la idea detrás de Big Horn Contracting: trabajo firme, trato honesto y un respeto profundo por el lugar que compartimos. Somos un contratista local que quiere ganarse tu confianza proyecto por proyecto." : "That is the thought behind Big Horn Contracting: steady work, honest conversation, and respect for the place we share. We are a local contractor working to earn your trust one project at a time."}</p><p>{locale === "es" ? "No importa si estás planeando un patio nuevo, reparando estuco o renovando una habitación: queremos que te sientas escuchado y cómodo con cada paso." : "Whether you are planning a new patio, repairing stucco, or refreshing a room, we want you to feel heard and comfortable at every step."}</p></Reveal>
        </div>
      </section>
      <section className="about-owner-section">
        <div className="container about-owner-grid">
          <Reveal className="about-owner-photo"><ParallaxImage src="https://images.pexels.com/photos/4981778/pexels-photo-4981778.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100" alt="Placeholder worksite photo; replace with Gerardo's approved owner portrait" className="about-photo" /><span className="owner-photo-note">Owner portrait placeholder</span></Reveal>
          <div><SectionHeading eyebrow={locale === "es" ? "CONOCE A GERARDO" : "THE PERSON BEHIND THE WORK"} title={locale === "es" ? "Una cara conocida en tu hogar." : "A familiar face at your home."} /><Reveal><p>{locale === "es" ? "Gerardo está formando Big Horn con una idea sencilla: cuando alguien te abre la puerta de su casa, merece atención, respeto y trabajo bien hecho." : "Gerardo is building Big Horn around one simple idea: when someone opens their home to you, they deserve attention, respect, and careful work."}</p><p>{locale === "es" ? "El retrato se reemplazará con una foto real del propietario antes de publicar." : "This image is a placeholder and should be replaced with Gerardo's approved portrait before launch."}</p><div className="owner-signature">Gerardo<span> · Owner</span></div></Reveal></div>
        </div>
      </section>
      <section className="section-pad values-section"><div className="container"><SectionHeading eyebrow={locale === "es" ? "LO QUE NOS GUÍA" : "WHAT WE STAND FOR"} title={locale === "es" ? "El trato importa tanto como el acabado." : "How we work matters as much as the finish."} /><div className="values-grid">{[{ title: "Keep it honest", text: "Say what is included. Ask when something is unclear." }, { title: "Leave it considered", text: "Treat the materials, the space, and the people with care." }, { title: "Stay accountable", text: "Keep communication open and return for the final walk-through." }].map((value, index) => <Reveal key={value.title} delay={index * 0.08}><article><span>0{index + 1}</span><h3>{locale === "es" ? ["Hablar con honestidad", "Cuidar cada detalle", "Hacernos responsables"][index] : value.title}</h3><p>{locale === "es" ? ["Dejar claro lo que incluye el trabajo y resolver dudas.", "Cuidar los materiales, el espacio y a las personas.", "Mantener comunicación y hacer un recorrido final juntos."][index] : value.text}</p></article></Reveal>)}</div></div></section>
      <section className="credential-band"><div className="container credential-layout"><ShieldCheck size={24} /><div><strong>{locale === "es" ? "Licencia y seguro" : "License & insurance"}</strong><p>{locale === "es" ? "Los datos de licencia y seguro se confirmarán antes de publicar." : "License and insurance details are placeholders until verified by the owner."}</p></div><span>{site.license}</span></div></section>
    </main>
  );
}

export function ProcessPage() {
  const { locale } = useLocale();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 0.68", "end 0.48"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <main className="inner-page">
      <PageHero
        eyebrow={locale === "es" ? "CÓMO TRABAJAMOS" : "WHAT TO EXPECT"}
        title={locale === "es" ? "Un plan claro. Un hogar cuidado." : "A clear plan. A home well cared for."}
        description={locale === "es" ? "Con calma y buena comunicación, desde tu primera llamada hasta el último detalle." : "A steady process and clear communication, from your first call to the final detail."}
        image="/images/desert-courtyard.jpg"
        alt="Quiet courtyard with clean stucco, block, and concrete details"
      />
      <section className="section-pad process-page-section">
        <div className="container process-page-intro"><SectionHeading eyebrow={locale === "es" ? "CINCO PASOS SENCILLOS" : "FIVE SIMPLE STEPS"} title={locale === "es" ? "Siempre sabrás qué sigue." : "You will always know what comes next."} text={locale === "es" ? "Un proyecto bien llevado se siente más sencillo para todos." : "A well-run project should feel easier for everyone involved."} /></div>
        <div className="container timeline-layout" ref={timelineRef}>
          <div className="timeline-track"><div className="timeline-track-base" /><motion.div className="timeline-track-fill" style={{ scaleY: lineScale }} /></div>
          <div className="timeline-steps">
            {processSteps.map((step, index) => <Reveal key={step.number} delay={index * 0.06}><article className="timeline-step"><span className="timeline-number">{step.number}</span><div><h2>{locale === "es" ? ["Cuéntanos tu idea", "Recibe un estimado gratis", "Revisa un plan y precio claros", "Construimos con cuidado", "Hacemos el recorrido juntos"][index] : step.title}</h2><p>{locale === "es" ? ["Una llamada o un formulario corto es suficiente para empezar.", "Escuchamos, visitamos el espacio y entendemos qué es importante para ustedes.", "Conocerás el alcance, el precio y los siguientes pasos antes de empezar.", "Cuidamos tu hogar y lo mantenemos ordenado mientras el trabajo lo permita.", "Revisamos el trabajo terminado y respondemos tus preguntas."][index] : step.text}</p></div><span className="timeline-dot" /></article></Reveal>)}
          </div>
        </div>
      </section>
      <section className="what-to-expect-section"><div className="container what-expect-grid"><Reveal><span className="eyebrow eyebrow-light"><span className="eyebrow-mark" />{locale === "es" ? "UN COMPROMISO CLARO" : "A CLEAR COMMITMENT"}</span><h2>{locale === "es" ? "Lo que acordemos, lo dejamos por escrito." : "What we agree to, we put in writing."}</h2><p>{locale === "es" ? "Antes de empezar, repasamos el alcance, el precio y las expectativas. La garantía de mano de obra se confirmará en el estimado para cada proyecto." : "Before work begins, we review the scope, price, and expectations. Any workmanship warranty will be confirmed in writing with your estimate."}</p></Reveal><Reveal delay={0.12} className="expect-list"><p><Check size={16} />{locale === "es" ? "Alcance por escrito" : "A written project scope"}</p><p><Check size={16} />{locale === "es" ? "Una persona de contacto" : "A clear point of contact"}</p><p><Check size={16} />{locale === "es" ? "Recorrido final juntos" : "A final walk-through together"}</p><span>{locale === "es" ? "La garantía debe ser confirmada por el propietario." : "Warranty terms require owner confirmation."}</span></Reveal></div></section>
      <section className="section-pad"><div className="container process-end-cta"><SectionHeading eyebrow={locale === "es" ? "¿LISTO PARA EMPEZAR?" : "A GOOD PLACE TO START"} title={locale === "es" ? "Cuéntanos qué tienes en mente." : "Tell us what you have in mind."} text={locale === "es" ? "Los estimados son gratis y sin presión." : "Estimates are free and there is no pressure to move forward."} /><PrimaryLink to="/contact#estimate">{text(locale, "estimate")}</PrimaryLink></div></section>
    </main>
  );
}

export function ServiceAreasPage() {
  const { locale } = useLocale();
  const areas = ["Albuquerque", ...surroundingAreas];
  return (
    <main className="inner-page">
      <PageHero eyebrow={locale === "es" ? "ZONAS DE SERVICIO" : "WHERE WE WORK"} title={locale === "es" ? "Aquí en casa, en Albuquerque." : "Right here at home in Albuquerque."} description={locale === "es" ? "Una mirada a las comunidades donde nos gustaría trabajar. Confirma tu zona antes de planear." : "A look at the communities we hope to serve. Please confirm your location before planning."} image="/images/desert-courtyard.jpg" alt="New Mexico courtyard and home in late afternoon sunlight" />
      <section className="section-pad area-page-section"><div className="container"><SectionHeading eyebrow={locale === "es" ? "ZONAS POR CONFIRMAR" : "AREAS TO CONFIRM"} title={locale === "es" ? "El centro de nuestra comunidad." : "The heart of our community."} text={locale === "es" ? "La disponibilidad fuera de Albuquerque se confirmará directamente con el propietario." : "Availability outside Albuquerque will be confirmed directly with the owner."} /><div className="area-list">{areas.map((area, index) => <Reveal key={area} delay={(index % 4) * 0.04}><article><span>0{index + 1}</span><div><h2>{area}, NM</h2><p>{locale === "es" ? `Trabajo residencial en ${area} y zonas cercanas, sujeto a disponibilidad.` : `Residential contracting in ${area} and nearby neighborhoods, subject to availability.`}</p></div><MapPin size={17} /></article></Reveal>)}</div><p className="areas-confirmation">{locale === "es" ? "Las localidades cercanas son una lista provisional. Confirma con el propietario antes de publicar." : "Nearby locations are a working list. Confirm coverage with the owner before launch."}</p></div></section>
      <section className="service-area-cta"><div className="container"><div><span className="eyebrow eyebrow-light"><span className="eyebrow-mark" />CHECK YOUR ADDRESS</span><h2>{locale === "es" ? "¿No ves tu comunidad?" : "Don't see your community?"}</h2><p>{locale === "es" ? "Llámanos y veremos si podemos ayudarte." : "Call and we will see if we can help."}</p></div><a className="button-primary" href={`tel:${site.phoneHref}`}>{site.phone}<ArrowUpRight size={16} /></a></div></section>
    </main>
  );
}

type FaqItem = { question: string; answer: string };

function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div className={`faq-item ${open ? "faq-item-open" : ""}`} key={item.question}>
            <button type="button" onClick={() => setOpenIndex(open ? null : index)} aria-expanded={open}>
              <span className="faq-item-number">0{index + 1}</span><span>{item.question}</span><ChevronDown size={18} />
            </button>
            <AnimatePresence initial={false}>
              {open && <motion.div className="faq-answer-wrap" initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}><p>{item.answer}</p></motion.div>}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

const faqItems: FaqItem[] = [
  { question: "How do I get a free estimate?", answer: "Call, text, or send the short form. We will learn a little about your project and arrange a time to look at the space if it is a fit." },
  { question: "Do you help with permits?", answer: "Permit requirements depend on the project and location. We will flag questions during the estimate and clarify what needs to be confirmed before work begins." },
  { question: "When can work start?", answer: "Timing depends on the scope, materials, weather, and current schedule. We will talk through the next available steps after seeing the project." },
  { question: "What payment options do you accept?", answer: "Payment timing and methods are discussed with your written estimate. No specific deposit or payment schedule is promised until it is agreed in writing." },
  { question: "Do you offer a warranty?", answer: "Any workmanship warranty will be provided in writing with the estimate. Please ask us to confirm the terms for your specific project before work begins." },
  { question: "Will you clean up after the work?", answer: "We take care of the work area and agree on cleanup expectations as part of the scope. Additional cleanup and hauling may be available as a secondary service." },
  { question: "Can my partner or family join the estimate conversation?", answer: "Of course. Good projects are decided together. Add their name to the estimate form, or invite them to the call or site visit." },
];

export function FaqPage() {
  const { locale } = useLocale();
  const spanishItems: FaqItem[] = [
    { question: "¿Cómo puedo solicitar un estimado gratis?", answer: "Llama, envía un mensaje o completa el formulario corto. Nos cuentas un poco y coordinamos una visita si el proyecto es adecuado." },
    { question: "¿Me ayudan con los permisos?", answer: "Los permisos dependen del proyecto y la ubicación. Hablaremos de lo que se debe confirmar antes de empezar." },
    { question: "¿Cuándo puede comenzar el trabajo?", answer: "El tiempo depende del alcance, los materiales, el clima y la agenda. Hablaremos de los siguientes pasos después de revisar el proyecto." },
    { question: "¿Qué opciones de pago aceptan?", answer: "Los tiempos y métodos de pago se incluyen en el estimado por escrito y se acuerdan antes de comenzar." },
    { question: "¿Ofrecen garantía?", answer: "Cualquier garantía de mano de obra se confirmará por escrito en el estimado para cada proyecto." },
    { question: "¿Limpian después del trabajo?", answer: "Acordamos las expectativas de limpieza como parte del alcance. También puede haber limpieza y retiro como servicio secundario." },
    { question: "¿Puede participar mi pareja o familia?", answer: "Claro que sí. Los buenos proyectos se deciden en familia. Agrega su nombre al formulario o invítalos a la conversación." },
  ];
  return (
    <main className="inner-page">
      <PageHero eyebrow={locale === "es" ? "PREGUNTAS FRECUENTES" : "THE HELPFUL DETAILS"} title={locale === "es" ? "Respuestas claras para empezar." : "Clear answers for a good start."} description={locale === "es" ? "Si algo no está aquí, con gusto lo hablamos directamente." : "If your question is not here, we are happy to talk it through."} image="https://images.pexels.com/photos/13137118/pexels-photo-13137118.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000" alt="Close-up texture of masonry blocks and mortar" />
      <section className="section-pad faq-page-section"><div className="container faq-page-layout"><div><SectionHeading eyebrow={locale === "es" ? "TODO SIN COMPLICACIONES" : "NO QUESTION TOO SMALL"} title={locale === "es" ? "Hagámoslo sencillo." : "Let's make this simple."} text={locale === "es" ? "Una conversación clara nos ayuda a encontrar la mejor manera de avanzar." : "A clear conversation helps us find the right way forward."} /></div><FaqList items={locale === "es" ? spanishItems : faqItems} /></div></section>
      <section className="faq-cta"><div className="container"><p>{locale === "es" ? "¿Todavía tienes dudas?" : "Still have a question?"}</p><Link to="/contact">{locale === "es" ? "Hablemos" : "Let's talk"}<ArrowRight size={17} /></Link></div></section>
    </main>
  );
}

export function ReviewsPage() {
  const { locale } = useLocale();
  return (
    <main className="inner-page">
      <PageHero eyebrow={locale === "es" ? "RESEÑAS" : "REVIEWS"} title={locale === "es" ? "La confianza se gana con hechos." : "Trust is earned, not claimed."} description={locale === "es" ? "Las opiniones verificadas de nuestros clientes estarán aquí cuando estén disponibles." : "Verified customer voices will live here when they are available."} image="/images/desert-courtyard.jpg" alt="A calm, sunlit Southwest home exterior" />
      <section className="section-pad reviews-page-section"><div className="container reviews-page-grid"><div><SectionHeading eyebrow={locale === "es" ? "OPINIONES VERIFICADAS" : "VERIFIED WORDS"} title={locale === "es" ? "Cada proyecto cuenta." : "Every project tells a story."} text={locale === "es" ? "No publicamos testimonios de muestra. Esta sección está lista para reseñas verificadas." : "We do not publish sample testimonials. This section is ready for verified customer reviews."} /><a className="text-link" href={site.googleBusinessUrl}>Google Business Profile placeholder<ArrowUpRight size={16} /></a></div><Reveal className="review-empty-state"><div className="review-stars" aria-label="Rating not available"><Star /><Star /><Star /><Star /><Star /></div><h2>{locale === "es" ? "Tu experiencia tendrá un lugar aquí." : "Your experience will have a place here."}</h2><p>{locale === "es" ? "Cuando los clientes compartan sus reseñas, agregaremos sus palabras y calificación con permiso." : "As customers share their reviews, we will add their words and rating with permission."}</p><span>Customer review slots · ready for Google integration</span></Reveal></div></section>
      <section className="review-request-band"><div className="container"><div><span className="eyebrow eyebrow-light"><span className="eyebrow-mark" />SHARE YOUR EXPERIENCE</span><h2>{locale === "es" ? "¿Trabajamos juntos? Nos encantaría escucharte." : "Worked with us? We would love to hear from you."}</h2></div><a className="button-secondary button-secondary-light" href={site.googleBusinessUrl}>{locale === "es" ? "Escribe una reseña" : "Share a review"}<ArrowUpRight size={16} /></a></div></section>
    </main>
  );
}

export function LegalPage() {
  const { pathname } = window.location;
  const isPrivacy = pathname === "/privacy";
  const { locale } = useLocale();
  return (
    <main className="inner-page legal-page">
      <section className="legal-heading"><div className="container"><span className="eyebrow"><span className="eyebrow-mark" />BIG HORN CONTRACTING</span><h1>{isPrivacy ? text(locale, "privacy") : text(locale, "terms")}</h1><p>Last updated: owner review required before publishing.</p></div></section>
      <section className="container legal-copy">
        {isPrivacy ? <>
          <h2>Information you share</h2><p>When the estimate form is connected, information you choose to provide (such as your name, phone number, email, project details, and optional photos) is used to respond to your inquiry and prepare an estimate.</p>
          <h2>How information is handled</h2><p>Estimate requests are intended to be stored using the configured Supabase project. Do not submit sensitive personal or financial information through the form. Photo retention and deletion practices must be confirmed by the owner before launch.</p>
          <h2>Cookies and analytics</h2><p>This site uses local storage to remember your language preference and form-rate protection. Analytics are not active by default; any future GA4 or advertising measurement must be disclosed before it is enabled.</p>
          <h2>Contact</h2><p>For a privacy question, contact {site.email}. The email shown is a placeholder and must be replaced before launch.</p>
        </> : <>
          <h2>Website information</h2><p>Website copy, project photographs, service areas, license information, and customer reviews should be confirmed by Big Horn Contracting. Photographs marked as references are not examples of completed company projects.</p>
          <h2>Estimates and project scope</h2><p>Online estimate requests are a request to start a conversation, not an offer or signed contract. Project pricing, timing, scope, payment details, and warranty terms are confirmed in writing for each project.</p>
          <h2>Availability and service areas</h2><p>Service areas listed on this website are provisional and must be confirmed with the owner. No particular start date or availability is guaranteed by this site.</p>
          <h2>Contact</h2><p>Questions can be directed to {site.email}. Replace this placeholder email and confirm these terms with qualified counsel before publication.</p>
        </>}
      </section>
    </main>
  );
}

export function NotFoundPage() {
  const { locale } = useLocale();
  return (
    <main className="not-found-page">
      <div className="not-found-art"><span>404</span><BrandMark /></div>
      <h1>{locale === "es" ? "Este sendero no lleva a casa." : "This trail doesn't lead home."}</h1>
      <p>{locale === "es" ? "Parece que esa página se movió." : "Looks like this page moved on."}</p>
      <Link to="/" className="button-primary">{locale === "es" ? "Volver al inicio" : "Back to home"}<ArrowRight size={17} /></Link>
    </main>
  );
}

function faqEs(question: string) {
  const dictionary: Record<string, string> = {
    "Can you help plan the size and layout?": "¿Pueden ayudar a planear el tamaño y diseño?",
    "Do you offer decorative concrete?": "¿Ofrecen concreto decorativo?",
    "Can block walls be finished to match my home?": "¿Pueden dar al muro un acabado que combine con mi casa?",
    "Will I need a permit for a wall?": "¿Necesito un permiso para construir un muro?",
    "Can you match the color and texture I already have?": "¿Pueden igualar el color y textura que ya tengo?",
    "Do you work on small stucco repairs?": "¿Hacen reparaciones pequeñas de estuco?",
    "Will we know what is happening while work is underway?": "¿Sabremos qué pasa mientras se realiza el trabajo?",
    "Can we discuss one room at a time?": "¿Podemos hablar de una habitación a la vez?",
    "Do you offer standalone junk removal?": "¿Ofrecen retiro de cosas como servicio independiente?",
  };
  return dictionary[question] ?? question;
}

function faqAnswerEs(answer: string) {
  if (answer.startsWith("Yes. We can walk")) return "Sí. Podemos recorrer el espacio contigo, conversar sobre cómo lo usas e incluir un alcance claro en el estimado gratis.";
  if (answer.startsWith("Stamped and decorative")) return "Podemos conversar sobre acabados estampados y decorativos durante tu estimado. La mejor opción depende del aspecto y uso que tienes en mente.";
  if (answer.startsWith("In many cases")) return "En muchos casos, sí. Podemos conversar sobre un acabado de estuco, una cubierta u otros detalles que combinen con el exterior existente.";
  if (answer.startsWith("Permit needs")) return "Los permisos dependen del muro, su altura y la propiedad. Hablaremos de lo que debe confirmarse durante el estimado.";
  if (answer.startsWith("We will look")) return "Revisaremos el acabado existente contigo y conversaremos sobre la mejor combinación posible. La luz y el paso del tiempo afectan los colores.";
  if (answer.startsWith("Tell us what")) return "Cuéntanos qué observas y dónde está. Durante un estimado gratis te diremos si podemos ayudarte.";
  if (answer.startsWith("Clear communication")) return "La comunicación es parte de un buen proyecto. Acordamos el alcance y una persona de contacto antes de empezar, y te mantenemos al tanto.";
  if (answer.startsWith("Absolutely")) return "Claro. Cuéntanos qué es más importante para ti y podemos conversar sobre un plan por etapas durante el estimado.";
  if (answer.startsWith("Cleanup and hauling")) return "La limpieza y el retiro son un servicio secundario. Cuéntanos qué necesitas y te diremos si podemos ayudarte.";
  return answer;
}