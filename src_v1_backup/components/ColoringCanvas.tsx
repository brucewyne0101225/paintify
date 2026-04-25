"use client";

import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Rect } from "react-konva";

interface CanvasProps {
  imageUrl: string;
  tool: "brush" | "eraser" | "fill" | "crayon" | "marker";
  color: string;
  brushSize: number;
}

export interface CanvasRef {
  undo: () => void;
  redo: () => void;
  download: () => void;
}

const ColoringCanvas = forwardRef<CanvasRef, CanvasProps>(({ imageUrl, tool, color, brushSize }, ref) => {
  const [processedImg, setProcessedImg] = useState<HTMLImageElement | null>(null);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [croppedDim, setCroppedDim] = useState({ width: 0, height: 0 });
  const [canvasDim, setCanvasDim] = useState({ width: 1000, height: 1000 });
  
  const [lines, setLines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Retina Canvas Sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasDim({
          width: containerRef.current.offsetWidth * 2,
          height: containerRef.current.offsetHeight * 2
        });
      }
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // MAGIC BOUNDING BOX TRIMMING (Runs only when imageUrl changes)
  useEffect(() => {
    if (!imageUrl) return;
    
    setProcessedImg(null);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const ctx = tempCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;
      let minX = tempCanvas.width, minY = tempCanvas.height, maxX = 0, maxY = 0;

      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const i = (y * tempCanvas.width + x) * 4;
          const r = data[i], g = data[i+1], b = data[i+2];
          
          if (r < 245 || g < 245 || b < 245) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          } else {
            data[i] = 255; data[i+1] = 255; data[i+2] = 255; data[i+3] = 255;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      if (minX > maxX || minY > maxY) { 
         minX = 0; minY = 0; maxX = img.width; maxY = img.height; 
      }

      const paddingX = Math.floor((maxX - minX) * 0.05);
      const paddingY = Math.floor((maxY - minY) * 0.05);
      
      minX = Math.max(0, minX - paddingX);
      minY = Math.max(0, minY - paddingY);
      maxX = Math.min(img.width, maxX + paddingX);
      maxY = Math.min(img.height, maxY + paddingY);

      const croppedWidth = maxX - minX;
      const croppedHeight = maxY - minY;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = croppedWidth;
      cropCanvas.height = croppedHeight;
      const cropCtx = cropCanvas.getContext("2d");
      
      if (!cropCtx) return;
      
      cropCtx.imageSmoothingEnabled = true;
      cropCtx.imageSmoothingQuality = "high";
      cropCtx.drawImage(tempCanvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

      const finalImg = new window.Image();
      finalImg.src = cropCanvas.toDataURL("image/png");
      
      finalImg.onload = () => {
        setProcessedImg(finalImg);
        setCroppedDim({ width: croppedWidth, height: croppedHeight });
      };
    };
  }, [imageUrl]);

  // DYNAMIC CENTERING: Repositions drawing beautifully whenever window resizes
  useEffect(() => {
    if (croppedDim.width > 0 && canvasDim.width > 0) {
      const targetCoverage = 0.85; 
      const maxDrawSize = Math.min(canvasDim.width, canvasDim.height) * targetCoverage;
      
      const aspect = croppedDim.width / croppedDim.height;
      let drawWidth, drawHeight;
      
      if (aspect > 1) {
        drawWidth = maxDrawSize;
        drawHeight = drawWidth / aspect;
      } else {
        drawHeight = maxDrawSize;
        drawWidth = drawHeight * aspect;
      }

      setImgPos({
        x: (canvasDim.width - drawWidth) / 2,
        y: (canvasDim.height - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight
      });
    }
  }, [croppedDim, canvasDim]);

  useImperativeHandle(ref, () => ({
    undo: () => {
      if (lines.length === 0) return;
      const newLines = lines.slice(0, lines.length - 1);
      setHistory([lines, ...history]);
      setLines(newLines);
    },
    redo: () => {
      if (history.length === 0) return;
      const nextLines = history[0];
      setHistory(history.slice(1));
      setLines(nextLines);
    },
    download: () => {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({ pixelRatio: 1 }); // Already 2x scale
        const link = document.createElement("a");
        link.download = "paintify-artwork.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }));

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // Scale pointer coordinate by 2x to match retina stage
    setLines([...lines, { tool, color, size: brushSize * 2, points: [pos.x * 2, pos.y * 2] }]);
    setHistory([]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    let lastLine = lines[lines.length - 1];
    // Scale pointer coordinate by 2x to match retina stage
    lastLine.points = lastLine.points.concat([point.x * 2, point.y * 2]);
    
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-white touch-none select-none overflow-hidden relative">
      {/* 50% scale via CSS perfectly displays the 2x Retina Stage */}
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(0.5)' }}>
        <Stage 
          width={canvasDim.width} 
          height={canvasDim.height}
          ref={stageRef}
          onPointerDown={handleMouseDown}
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
        >
          {/* All elements must exist on a SINGLE Layer for globalCompositeOperation to work properly! */}
          <Layer>
            {/* 1. Background White Solid (for proper exporting and no border lines) */}
            <Rect
              x={0}
              y={0}
              width={1536}
              height={1536}
              fill="white"
            />
          
            {/* 2. The Drawing layer, drawn over the white background */}
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === 'eraser' ? 'white' : line.color}
                strokeWidth={line.size}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                opacity={line.tool === 'marker' ? 0.7 : 1}
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}

            {/* 3. The Line Art Image, trimmed and mathematically centered */}
            {processedImg && (
              <KonvaImage
                image={processedImg}
                x={imgPos.x}
                y={imgPos.y}
                width={imgPos.width}
                height={imgPos.height}
                listening={false}
                globalCompositeOperation="multiply"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

export default ColoringCanvas;
