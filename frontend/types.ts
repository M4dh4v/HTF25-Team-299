export const CaptionStyle = {
  Meme: "Meme-style",
  Formal: "Formal",
  Casual: "Casual",
  Aesthetic: "Aesthetic",
} as const;

export type CaptionStyle = (typeof CaptionStyle)[keyof typeof CaptionStyle];
