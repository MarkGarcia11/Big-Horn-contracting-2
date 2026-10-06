import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import { Footer, FloatingMobileActions, Header, CookieNotice, ScrollToTop } from "./components/layout";
import { BrandMark, LocaleProvider, ScrollProgress } from "./components/common";
import { services, site, surroundingAreas } from "./data/site";

const ServicesPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ServicesPage })));
const ServicePage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ServicePage })));
const ProjectsPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ProjectsPage })));
const AboutPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.AboutPage })));
const ProcessPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ProcessPage })));
const ServiceAreasPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ServiceAreasPage })));
const FaqPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.FaqPage })));
const ReviewsPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ReviewsPage })));
const LegalPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.LegalPage })));
const NotFoundPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.NotFoundPage })));

function ScreenLoader() {
  return (
    <div className="screen-loader" role="status" aria-label="Loading Big Horn Contracting">
      <div className="loader-mark"><BrandMark /></div>
      <span className="loader-wordmark">Big Horn <i>Contracting</i></span>
      <span className="loader-rule"><span /></span>
      <span className="loader-caption">ALBUQUERQUE · NEW MEXICO</span>
    </div>
  );
}

function InitialLoader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.sessionStorage.getItem("bighorn-intro-seen")) return;
    setVisible(true);
    window.sessionStorage.setItem("bighorn-intro-seen", "true");
    const timer = window.setTimeout(() => setVisible(false), 760);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      {visible && <motion.div className="loader-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}><ScreenLoader /></motion.div>}
    </AnimatePresence>
  );
}

function SeoManager() {
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, "") || "/";
    const publicUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || window.location.origin;
    const serviceSlug = pathname.startsWith("/services/") ? pathname.split("/")[2] : "";
    const service = services.find((item) => item.slug === serviceSlug);
    const pageCopy: Record<string, { title: string; description: string }> = {
      "/": {
        title: "Big Horn Contracting | Albuquerque Home Contractor",
        description: "Concrete, block, stucco, and interior remodeling for Albuquerque homes, built with care, honesty, and pride. Request a free estimate.",
      },
      "/services": { title: "Home Services | Big Horn Contracting Albuquerque", description: "Explore concrete, block and CMU, stucco, and interior remodeling services for Albuquerque homes. Free estimates." },
      "/projects": { title: "Project Gallery | Big Horn Contracting Albuquerque", description: "Browse Southwest home, concrete, masonry, stucco, and remodeling project references from Big Horn Contracting." },
      "/about": { title: "About Big Horn Contracting | Albuquerque, NM", description: "Meet the team and learn about the care, craftsmanship, and local values behind Big Horn Contracting in Albuquerque." },
      "/process": { title: "Our Process | Clear Home Remodeling Estimates in Albuquerque", description: "See what to expect when you request a free estimate from Big Horn Contracting in Albuquerque, New Mexico." },
      "/service-areas": { title: "Service Areas | Albuquerque & Nearby Communities", description: "Big Horn Contracting serves Albuquerque and nearby New Mexico communities. Confirm your project location with the team." },
      "/reviews": { title: "Customer Reviews | Big Horn Contracting", description: "Verified customer feedback for Big Horn Contracting in Albuquerque. Review placeholders will be replaced with approved customer reviews." },
      "/faq": { title: "Frequently Asked Questions | Big Horn Contracting", description: "Answers about estimates, permits, scheduling, payment, cleanup, and working with Big Horn Contracting in Albuquerque." },
      "/contact": { title: "Free Estimate | Contact Big Horn Contracting Albuquerque", description: "Tell Big Horn Contracting about your Albuquerque home project. Request a free estimate by form, phone, or text." },
      "/privacy": { title: "Privacy Policy | Big Horn Contracting", description: "Privacy information for Big Horn Contracting website visitors and estimate requests." },
      "/terms": { title: "Terms | Big Horn Contracting", description: "Website information and terms for Big Horn Contracting." },
    };
    const meta = service
      ? { title: `${service.name} in Albuquerque, NM | Big Horn Contracting`, description: `${service.description} Serving Albuquerque and nearby communities. Request a free estimate.` }
      : pageCopy[pathname] ?? { title: "Page Not Found | Big Horn Contracting", description: "Find your way back to Big Horn Contracting, your Albuquerque home contractor." };
    document.title = meta.title;
    setMeta('name', "description", meta.description);
    setMeta('property', "og:title", meta.title);
    setMeta('property', "og:description", meta.description);
    setMeta('property', "og:url", `${publicUrl}${pathname}`);
    setMeta('property', "og:image", `${publicUrl}/images/desert-courtyard.jpg`);
    setMeta('name', "twitter:card", "summary_large_image");
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = `${publicUrl}${pathname}`;
    if (!canonical.parentNode) document.head.append(canonical);

    const businessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: site.name,
      description: meta.description,
      url: publicUrl,
      image: `${publicUrl}/images/desert-courtyard.jpg`,
      address: { "@type": "PostalAddress", addressLocality: "Albuquerque", addressRegion: "NM", addressCountry: "US" },
      areaServed: ["Albuquerque", ...surroundingAreas].map((name) => ({ "@type": "City", name })),
    };
    const schema: Record<string, unknown> = service
      ? { "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.description, provider: { "@type": "LocalBusiness", name: site.name, address: businessSchema.address }, areaServed: businessSchema.areaServed }
      : businessSchema;
    if (pathname === "/faq") {
      schema.mainEntity = [
        { question: "How do I get a free estimate?", answer: "Call, text, or send the short estimate form to start a conversation." },
        { question: "Do you help with permits?", answer: "Permit needs depend on project scope and location and will be discussed before work begins." },
        { question: "Do you offer a warranty?", answer: "Any workmanship warranty will be confirmed in writing with the estimate." },
      ].map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }));
      schema["@type"] = "FAQPage";
    }
    let script = document.getElementById("big-horn-schema") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "big-horn-schema";
      script.type = "application/ld+json";
      document.head.append(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [location.pathname]);
  return null;
}

function setMeta(attribute: "name" | "property", key: string, value: string) {
  let node = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.append(node);
  }
  node.content = value;
}

function AppFrame() {
  return (
    <>
      <SeoManager />
      <ScrollToTop />
      <ScrollProgress />
      <Header />
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/service-areas" element={<ServiceAreasPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <FloatingMobileActions />
      <CookieNotice />
      <InitialLoader />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <AppFrame />
      </LocaleProvider>
    </BrowserRouter>
  );
}