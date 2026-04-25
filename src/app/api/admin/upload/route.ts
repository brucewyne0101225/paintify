import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as unknown as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files received.' });
    }

    let uploadedCount = 0;
    
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save directly to the public directory
      const filepath = path.join(process.cwd(), 'public', file.name);
      await writeFile(filepath, buffer);
      uploadedCount++;
    }

    return NextResponse.json({ success: true, uploadedCount });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
