/**
 * Translates messy or fragmented child prompts into coherent sentences.
 * Example: "dragon pizza school moon" -> "A cute baby dragon eating pizza at school on the moon"
 */
export function understandChildPrompt(rawPrompt: string): string {
  const prompt = rawPrompt.toLowerCase().trim();

  // Basic cleanup
  let cleaned = prompt.replace(/[^\w\s]/g, "");
  const words = cleaned.split(" ").filter(w => w.length > 0);

  // If already a long sentence, return as is (but simplified if needed)
  if (words.length > 6) {
    return cleaned;
  }

  // Very basic word combinations
  if (cleaned.includes("trex") || cleaned.includes("t-rex") || cleaned.includes("dinosaur")) {
    if (cleaned.includes("birthday") || cleaned.includes("balloon")) {
      return "A friendly T-Rex having a birthday party with balloons.";
    }
  }

  if (cleaned.includes("cat") && cleaned.includes("rocket") && cleaned.includes("rainbow")) {
    return "A cute cat riding a rocket near a rainbow.";
  }

  // Generic fallback for fragmented words
  if (words.length > 0 && words.length <= 4) {
    return `A cute friendly ${words.join(" and ")} playing happily.`;
  }

  return rawPrompt;
}

export function calculateComplexity(prompt: string): number {
  const words = prompt.split(" ").length;
  if (words < 4) return 2;
  if (words < 8) return 5;
  return 8;
}

export function simplifyComplexPrompt(prompt: string): string {
  const words = prompt.split(" ");
  if (words.length > 8) {
    // Keep the first chunk as the main subject and slice off the complex background
    return words.slice(0, 6).join(" ") + " in a simple cartoon scene.";
  }
  return prompt;
}
