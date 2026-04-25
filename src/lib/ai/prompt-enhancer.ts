export function enhancePrompt(rawPrompt: string, category: string): string {
  // 1. Rewrite weak prompts into structurally strong prompts
  let subject = rawPrompt.trim();
  
  if (subject.length < 5 && !subject.includes(" ")) {
    subject = `A cute friendly ${subject} playing happily`;
  }

  // SMART SIMPLIFIER: Truncate overly complex sentences to keep AI fast and clean
  const words = subject.split(" ");
  if (words.length > 10) {
    subject = words.slice(0, 8).join(" ") + "... simplified scene";
  }

  // 2. Add Category Intelligence (Contextual glue)
  let categoryContext = "";
  if (category === "Space") categoryContext = "surrounded by cute stars and small planets";
  if (category === "Ocean") categoryContext = "underwater with cute bubbles and seaweed";
  if (category === "Robots") categoryContext = "made of simple metallic shapes and gears";

  return `black and white children coloring book page line art, centered composition, subject fills most of the page, no large empty margins, full body visible, professional printable coloring book layout, single centered scene, page-filling composition, absolutely no borders, no frames, ${subject}, ${categoryContext}`;
}

export function buildNegativePrompt(): string {
  return "no shading, no text, no watermark, no grey scale, no color, no background lines, no borders, no page edges, no box, no framing, no crop marks, no violence, no weapons, no scary horror, no adult content, no realistic faces, no complex chaotic shadows";
}
