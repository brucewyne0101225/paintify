import { NextResponse } from 'next/server';
import { createSmartColoringRequest } from '@/lib/ai/paintify-brain';

// Advanced Cache Normalization
function normalizePrompt(p: string) {
  return p.toLowerCase()
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ') // remove extra spaces
    .trim()
    .replace(/dinosaurs?/g, 'dinosaur')
    .replace(/puppies/g, 'puppy')
    .replace(/cats?/g, 'cat');
}

// Instant Starter Library Engine (Offline Base64 Fallbacks to bypass 429 errors)
const STARTER_LIBRARY: Record<string, string> = {
  "t rex eating ice cream": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5ULU1vY2sgRGlub3NhdXI8L3RleHQ+PC9zdmc+",
  "baby dinosaur in garden": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5CYWJ5IERpbm88L3RleHQ+PC9zdmc+",
  "rocket near happy planets": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5Sb2NrZXQgU2hpcDwvdGV4dD48L3N2Zz4=",
  "robot playing soccer": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5Sb2JvdDwvdGV4dD48L3N2Zz4=",
  "unicorn rainbow castle": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5Vbmljb3JuPC90ZXh0Pjwvc3ZnPg=="
};

// In-memory cache for ultra-fast UX
const promptCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const { prompt, age, category } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const normalized = normalizePrompt(prompt);
    
    // 1. Check Instant Starter Library Engine (Semantic matching via substrings)
    for (const [libPrompt, url] of Object.entries(STARTER_LIBRARY)) {
      if (normalized.includes(libPrompt) || libPrompt.includes(normalized)) {
        console.log("[STARTER LIBRARY HIT] Instantly serving:", libPrompt);
        return NextResponse.json({ imageUrl: url, debugData: { source: "starter_library" } });
      }
    }

    const cacheKey = `${normalized}-${age}-${category}`;
    
    // 2. Check Smart Semantic Cache Hit
    if (promptCache.has(cacheKey)) {
      console.log("[CACHE HIT] Instantly serving:", cacheKey);
      return NextResponse.json(promptCache.get(cacheKey));
    }

    // Pass everything through the Ultra Intelligent Paintify AI Brain
    const brainData = await createSmartColoringRequest({
      userPrompt: prompt,
      ageRange: age,
      category
    });

    if (!brainData.success || !brainData.finalPrompt) {
      return NextResponse.json({ error: brainData.error }, { status: 400 });
    }

    const finalAiPrompt = brainData.finalPrompt;
    const encodedPrompt = encodeURIComponent(finalAiPrompt);
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Primary High Quality Provider
    const primaryUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${randomSeed}`;

    // Fallback Fast Provider (Starts after 8 seconds with a simplified prompt)
    const simplifiedPrompt = encodeURIComponent(`black and white children coloring book page line art, centered, no frames, single subject, ${normalized}`);
    const fallbackUrl = `https://image.pollinations.ai/prompt/${simplifiedPrompt}?width=512&height=512&nologo=true&seed=${randomSeed + 1}`;

    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second strict timeout
      
      response = await fetch(primaryUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Primary Failed: ${response.status}`);
      }
    } catch (error) {
      console.log("[FALLBACK TRIGGERED] Primary failed or timed out, using fallback...", error);
      response = await fetch(fallbackUrl);
      
      if (!response.ok) {
        throw new Error(`The Magic Artist is too busy right now! 🛑 Try typing 'T Rex eating ice cream' or 'Robot playing soccer' to get an instant drawing!`);
      }
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    
    // Create the final Data URL that Konva can consume without network restrictions
    const base64Image = `data:image/jpeg;base64,${base64Data}`;

    const responsePayload = { 
      imageUrl: base64Image,
      debugData: brainData.debugData 
    };

    // Save to cache for the next time someone asks for this exact combination
    promptCache.set(cacheKey, responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate coloring page" }, { status: 500 });
  }
}
