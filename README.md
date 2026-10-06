# Big Horn Contracting

Responsive lead-generation website for Big Horn Contracting in Albuquerque, New Mexico. Built with Vite, React, TypeScript, Tailwind CSS v4, React Router, Framer Motion, React Three Fiber, and Supabase.

## Local setup

1. Copy `.env.example` to `.env.local` and add a Supabase URL and anon key when the Supabase project is ready.
2. Run `npm install` and `npm run dev`.
3. Run `npm run build` before deployment.

The estimate form stays in preview mode until the Supabase environment variables and Edge Function are configured. In preview mode, the form clearly asks visitors to call or text instead of claiming that a request was sent.

## Supabase estimate flow

1. Apply `supabase/migrations/202603200001_estimate_requests.sql` to the Supabase project.
2. Set `RESEND_API_KEY`, `ESTIMATE_TO_EMAIL`, and `ESTIMATE_FROM_EMAIL` as Supabase Edge Function secrets. The sender must be verified in Resend.
3. Deploy the `submit-estimate` Edge Function from `supabase/functions/submit-estimate`.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel. Only the public anon key belongs in the client; never expose the service-role key or Resend key through a `VITE_` variable.

The Edge Function checks the hidden honeypot, validates request fields and image type/size, applies a server-side per-IP rate limit, stores requests privately, and sends an owner notification through Resend when those secrets are set. A browser-side rate limit is also applied as a first line of defense.

## Vercel and GitHub

Import the GitHub repository into Vercel and keep the default Vite build settings (`npm run build`, output directory `dist`). `vercel.json` rewrites client-side routes to `index.html`, so service and content pages work on direct visits. Set `VITE_SITE_URL` to the production origin, then replace the example domain in `public/robots.txt` and `public/sitemap.xml`.

## Owner launch checklist

- Replace the reserved placeholder phone number and `.example` email in `src/data/site.ts`.
- Replace the illustrative hero, service, project, and owner imagery. The project source list is in `src/data/projects.ts`; image and alt text references for services are in `src/data/site.ts`.
- Add approved project captions and before/after pairs. Current gallery images are references and are explicitly labeled as placeholders.
- Replace the owner portrait placeholder with Gerardo's approved photo and confirm all owner biography copy.
- Confirm license/insurance details, address wording, hours, service areas, and the one-business-day response promise.
- Add real customer reviews and the verified Google Business Profile URL. No sample testimonials or ratings are presented as genuine.
- Replace placeholder Facebook, Instagram, and Google Business Profile links.
- Review privacy/terms copy, especially image retention, with the owner and qualified counsel.
- Replace the example production domain in sitemap/robots and supply a real Open Graph/share image if needed.
- Add GA4/Meta credentials only after consent and privacy requirements are reviewed. The UI dispatches `bighorn:analytics` events and sends `gtag` events when a GA4 implementation is present.

## Placeholders in the site

- Phone: `+1 (505) 555-0148` (reserved example number)
- Email: `hello@bighorncontracting.example`
- Domain: `www.bighorncontracting.example`
- Gerardo's portrait and final biography
- License and insurance details
- Street address, hours, and confirmed service boundary
- Project photography and before/after pairs
- Verified review content and Google Business Profile URL
- Social profile links
- Warranty terms and any written workmanship guarantee
- Estimate response-time promise and project availability