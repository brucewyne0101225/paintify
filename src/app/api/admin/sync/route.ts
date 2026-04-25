import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Heuristics Engine for Auto-Categorization
const categorizeFilename = (filename: string) => {
  const lower = filename.toLowerCase();
  
  if (lower.includes("dino") || lower.includes("t-rex")) return "Dinosaurs";
  if (lower.includes("space") || lower.includes("astronaut") || lower.includes("rocket") || lower.includes("planet")) return "Space";
  if (lower.includes("unicorn") || lower.includes("castle") || lower.includes("dragon") || lower.includes("magic")) return "Fantasy";
  if (lower.includes("robot") || lower.includes("mech") || lower.includes("bot")) return "Robots";
  if (lower.includes("car") || lower.includes("truck") || lower.includes("train") || lower.includes("plane")) return "Vehicles";
  if (lower.includes("kawaii") || lower.includes("cute")) return "Kawaii";
  if (lower.includes("food") || lower.includes("ice-cream") || lower.includes("pizza") || lower.includes("cake")) return "Food";
  if (lower.includes("dog") || lower.includes("cat") || lower.includes("horse") || lower.includes("turtle") || lower.includes("bee") || lower.includes("animal") || lower.includes("giraffe")) return "Animals";
  if (lower.includes("flower") || lower.includes("sun") || lower.includes("tree") || lower.includes("nature")) return "Nature";
  if (lower.includes("boy") || lower.includes("girl") || lower.includes("child") || lower.includes("people") || lower.includes("family")) return "People";
  
  return "Misc"; // Fallback category
};

// Title Generator from filename
const generateTitle = (filename: string) => {
  // Remove extensions
  let clean = filename.replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, "");
  // Remove random numbers and IDs (e.g. _23-2149842646)
  clean = clean.replace(/_[0-9-]+/g, "");
  // Replace hyphens and underscores with spaces
  clean = clean.replace(/[-_]/g, " ");
  // Remove common stock photo words
  clean = clean.replace(/(hand drawn|coloring book|illustration|sketch|outline|vector|doodle|set|miscellaneous)/gi, "").trim();
  
  // Title case
  return clean.split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || "Magic Drawing";
};

export async function POST() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const libraryPath = path.join(process.cwd(), "src/lib/data/library.ts");
    
    // 1. Scan all files in public directory
    const allFiles = fs.readdirSync(publicDir);
    
    // Filter to only actual image files (ignore Next.js svgs and system files)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const systemFiles = ['auroze-logo.png', 'next.svg', 'vercel.svg', 'globe.svg', 'file.svg', 'window.svg'];
    
    const imageFiles = allFiles.filter(file => {
      const lowerFile = file.toLowerCase();
      const ext = path.extname(file).toLowerCase();
      return validExtensions.includes(ext) && 
             !file.startsWith('.') && 
             !systemFiles.includes(lowerFile) &&
             !lowerFile.includes('logo'); // Aggressive logo filter
    });

    const fileHashes = new Map<string, string>(); // Hash -> Filename
    const seenTitles = new Set<string>(); // Title -> boolean
    let duplicatesDeleted = 0;
    const finalImages: string[] = [];

    // 2. Advanced Duplicate Removal AI
    for (const file of imageFiles) {
      const filePath = path.join(publicDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
      const title = generateTitle(file);

      // Check for Byte-Identity OR Filename-Identity OR Title-Identity
      if (fileHashes.has(hash) || seenTitles.has(title)) {
        console.log(`Duplicate detected: ${file}. Deleting...`);
        fs.unlinkSync(filePath);
        duplicatesDeleted++;
      } else {
        fileHashes.set(hash, file);
        seenTitles.add(title);
        finalImages.push(file);
      }
    }

    // 3. Auto-Categorization & Code Generation
    let newLibraryCode = `export const EXPLORE_LIBRARY = [\n`;
    
    finalImages.forEach((file, index) => {
      const title = generateTitle(file);
      const category = categorizeFilename(file);
      
      newLibraryCode += `  {\n`;
      newLibraryCode += `    id: "img-${index + 1}",\n`;
      newLibraryCode += `    title: "${title}",\n`;
      newLibraryCode += `    category: "${category}",\n`;
      newLibraryCode += `    image: "/${file}"\n`;
      newLibraryCode += `  }${index < finalImages.length - 1 ? ',' : ''}\n`;
    });
    
    newLibraryCode += `];\n`;

    // 4. Overwrite library.ts
    fs.writeFileSync(libraryPath, newLibraryCode, "utf-8");

    return NextResponse.json({
      success: true,
      stats: {
        totalScanned: imageFiles.length,
        duplicatesDeleted: duplicatesDeleted,
        finalLibrarySize: finalImages.length
      }
    });

  } catch (error: any) {
    console.error("Library Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
