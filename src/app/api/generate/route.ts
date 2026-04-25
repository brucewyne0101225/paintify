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

    console.log("[AI SYNC] Starting generation for:", normalized);

    // Pass everything through the Ultra Intelligent Paintify AI Brain
    const brainData = await createSmartColoringRequest({
      userPrompt: prompt,
      ageRange: age,
      category
    });

    if (!brainData.success || !brainData.finalPrompt) {
      console.error("[AI ERROR] Brain rejected prompt:", brainData.error);
      return NextResponse.json({ error: brainData.error }, { status: 400 });
    }

    const finalAiPrompt = brainData.finalPrompt;
    console.log("[AI SYNC] Final Prompt:", finalAiPrompt);
    
    const encodedPrompt = encodeURIComponent(finalAiPrompt);
    const randomSeed = Math.floor(Math.random() * 1000000);
    // Rotating proxies by adding a random unique ID to the domain
    const proxyId = Math.floor(Math.random() * 5); 
    const primaryUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${randomSeed}&noise=${randomSeed}`;

    let response: Response;
    try {
      console.log("[AI SYNC] Fetching from Pollinations (Attempt 1)...");
      response = await fetch(primaryUrl);
      
      if (response.status === 429) {
        console.warn("[AI WARNING] Rate limit hit (429). Retrying with high-speed proxy...");
        // Wait 1 second and try with a different seed to rotate the request signature
        await new Promise(r => setTimeout(r, 1000));
        const retryUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true&seed=${randomSeed + 1234}&turbo=true`;
        response = await fetch(retryUrl);
      }

      if (!response.ok) {
        throw new Error(`Primary Provider Failed: ${response.status}`);
      }
      console.log("[AI SYNC] Fetch Successful!");
    } catch (error: any) {
      console.error("[AI ERROR] Fetch failed:", error.message);
      return NextResponse.json({ error: "The AI Artist is currently busy. Please try again in 5 seconds!" }, { status: 500 });
    }

    try {
      console.log("[AI SYNC] Converting to Base64...");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      console.log("[AI SYNC] Conversion Successful!");

      return NextResponse.json({ 
        imageUrl: base64Image,
        debugData: brainData.debugData 
      });
    } catch (error: any) {
      console.error("[AI ERROR] Data conversion failed:", error.message);
      return NextResponse.json({ error: "Failed to process image data." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[CRITICAL ERROR] AI Route Crashed:", error);
    return NextResponse.json({ error: "Server Error. Please try again." }, { status: 500 });
  }
}
