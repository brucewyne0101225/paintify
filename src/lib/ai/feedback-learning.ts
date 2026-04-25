export type FeedbackType = "too_hard" | "too_easy" | "not_safe" | "bad_drawing" | "perfect";

export interface FeedbackLog {
  promptId: string;
  originalPrompt: string;
  feedback: FeedbackType;
  timestamp: string;
}

// Temporary in-memory log for local development
const feedbackLogs: FeedbackLog[] = [];

export async function saveParentFeedback(promptId: string, originalPrompt: string, feedback: FeedbackType) {
  // In Phase 2: Save to Supabase 'safety_logs' or 'feedback_logs' table.
  const log: FeedbackLog = {
    promptId,
    originalPrompt,
    feedback,
    timestamp: new Date().toISOString()
  };
  
  feedbackLogs.push(log);
  console.log(`[AI LEARNING] Logged parent feedback: ${feedback} for prompt: "${originalPrompt}"`);
  
  return { success: true, logged: log };
}

export function getFeedbackLearningContext(category: string): string {
  // Mock logic to extract lessons from previous feedback
  // E.g. "Previous feedback for Dinosaurs requested thicker lines"
  return ""; 
}
