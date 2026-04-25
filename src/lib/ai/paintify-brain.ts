import { checkSafety } from "./safety-checker";
import { enhancePrompt, buildNegativePrompt } from "./prompt-enhancer";
import { getAgeModifiers } from "./age-difficulty";
import { evaluateImageQuality } from "./quality-checker";
import { understandChildPrompt, calculateComplexity, simplifyComplexPrompt } from "./prompt-understanding";

export interface BrainResponse {
  success: boolean;
  finalPrompt?: string;
  error?: string;
  debugData?: any;
}

export async function createSmartColoringRequest({ 
  userPrompt, 
  ageRange, 
  category 
}: { 
  userPrompt: string; 
  ageRange: string; 
  category: string; 
}): Promise<BrainResponse> {
  // 1. Safety Check
  const safetyStatus = checkSafety(userPrompt);
  if (!safetyStatus.isSafe) {
    return {
      success: false,
      error: safetyStatus.reason || "Prompt blocked for child safety."
    };
  }

  // 2. Prompt Understanding
  let cleanedPrompt = understandChildPrompt(userPrompt);

  // 3. Complexity Scoring & Auto-Simplification
  const complexityScore = calculateComplexity(cleanedPrompt);
  if (complexityScore > 6) {
    cleanedPrompt = simplifyComplexPrompt(cleanedPrompt);
  }

  // 4. Base Enhancements & Age Modifiers
  const enhancedPrompt = enhancePrompt(cleanedPrompt, category);
  const ageDifficulty = getAgeModifiers(ageRange);
  const negativePrompt = buildNegativePrompt();

  // 5. Final Assembly
  const finalPrompt = `${enhancedPrompt}. ${ageDifficulty}. MUST AVOID: ${negativePrompt}`;

  return {
    success: true,
    finalPrompt,
    debugData: {
      originalPrompt: userPrompt,
      cleanedPrompt,
      enhancedPrompt,
      negativePrompt,
      ageDifficulty,
      complexityScore,
      safetyScore: safetyStatus.isSafe ? 100 : 0
    }
  };
}
