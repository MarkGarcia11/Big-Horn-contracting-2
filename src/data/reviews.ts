export type CustomerReview = {
  id: string;
  provider: "google";
  quote: string | null;
  author: string | null;
  location: string | null;
  rating: number | null;
  verified: boolean;
};

// Empty verified-review slots: never render a placeholder as a real testimonial.
export const reviewSlots: CustomerReview[] = [
  { id: "review-01", provider: "google", quote: null, author: null, location: "Albuquerque, NM", rating: null, verified: false },
  { id: "review-02", provider: "google", quote: null, author: null, location: "Rio Rancho, NM", rating: null, verified: false },
  { id: "review-03", provider: "google", quote: null, author: null, location: "Central New Mexico", rating: null, verified: false },
];