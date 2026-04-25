const HARD_BLOCK_TERMS = [
  "sexy", "hot", "attractive", "bikini", "shirtless", "body", "pose", "model",
  "dating", "kissing", "romance", "nsfw", "fetish", "loli", "lolicon",
  "hidden camera", "sleeping", "bath", "private parts", "nude", "naked", "blood",
  "gore", "kill", "murder", "weapon", "gun", "knife", "drug", "alcohol"
];

const AGE_HUMAN_TERMS = [
  "minor", "underage", "child girl", "child boy", "little girl", "little boy",
  "teen girl", "teen boy", "teenager", "young girl", "young boy", "schoolgirl",
  "schoolboy", "baby girl", "baby boy", "kid body", "child model", "young person",
  "preteen", "toddler person", "boy", "girl", "kid", "teen", "child"
];

export interface SafetyResult {
  isSafe: boolean;
  status: "allow" | "rewrite" | "block";
  safePrompt: string;
  reason: string;
  riskScore: number;
}

export function checkSafety(prompt: string): SafetyResult {
  const normalized = prompt.toLowerCase();
  let riskScore = 0;
  
  // 1. HARD BLOCK (Instant fail)
  for (const term of HARD_BLOCK_TERMS) {
    if (normalized.includes(term)) {
      return {
        isSafe: false,
        status: "block",
        safePrompt: "",
        reason: "That idea can't be created in Paintify.",
        riskScore: 100
      };
    }
  }

  // 2. DETECT AGE/HUMAN TERMS (Rewrite required)
  let needsRewrite = false;
  for (const term of AGE_HUMAN_TERMS) {
    // strict word boundary matching to avoid matching 'building' for 'boy' (not possible but safe)
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(normalized)) {
      riskScore += 30;
      needsRewrite = true;
    }
  }

  // 3. APPLY RULES
  if (riskScore >= 40) {
    return {
      isSafe: false,
      status: "block",
      safePrompt: "",
      reason: "That idea can't be created in Paintify.",
      riskScore
    };
  }

  if (needsRewrite) {
    return {
      isSafe: true, // We allow it to proceed, but FORCE a rewrite
      status: "rewrite",
      safePrompt: "cute cartoon puppy playing happily",
      reason: "Rewritten to safe animal alternative",
      riskScore
    };
  }

  return {
    isSafe: true,
    status: "allow",
    safePrompt: prompt,
    reason: "",
    riskScore: 0
  };
}
