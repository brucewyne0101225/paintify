"use client";

import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Rect, Transformer, Group } from "react-konva";

interface CanvasProps {
  imageUrl: string;
  tool: "brush" | "eraser" | "fill" | "crayon" | "marker" | "transform";
  color: string;
  brushSize: number;
}

export interface CanvasRef {
  undo: () => void;
  redo: () => void;
  download: () => void;
  fitImage: () => void;
  resetImage: () => void;
}

const ColoringCanvas = forwardRef<CanvasRef, CanvasProps>(({ imageUrl, tool, color, brushSize }, ref) => {
  const [processedImg, setProcessedImg] = useState<HTMLImageElement | null>(null);
  const [groupPos, setGroupPos] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
  const [croppedDim, setCroppedDim] = useState({ width: 0, height: 0 });
  const [canvasDim, setCanvasDim] = useState({ width: 1000, height: 1000 });
  
  const [lines, setLines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([]);
  const isDrawing = useRef(false);
  
  const stageRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);
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

  // Transformer logic
  useEffect(() => {
    if (tool === "transform" && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [tool, processedImg]);

  // MAGIC BOUNDING BOX TRIMMING & STENCIL CREATION
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
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          
          if (a < 10) continue;

          if (r < 240 || g < 240 || b < 240) {
            // Dark pixel: keep it for bounding box
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          } else {
            // White pixel: Make it transparent so we can color underneath it!
            data[i+3] = 0; 
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

  const calculateDefaultPos = () => {
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

      const scale = drawWidth / croppedDim.width;

      setGroupPos({
        x: (canvasDim.width - drawWidth) / 2,
        y: (canvasDim.height - drawHeight) / 2,
        scaleX: scale,
        scaleY: scale,
        rotation: 0
      });
    }
  };

  useEffect(() => {
    calculateDefaultPos();
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
        // Temporarily deselect to hide transform handles
        if (trRef.current) trRef.current.nodes([]);
        
        // Timeout to ensure react renders the hidden transformer before export
        setTimeout(() => {
           const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
           const link = document.createElement("a");
           link.download = "paintify-artwork.png";
           link.href = uri;
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
           
           // Re-attach if we were in transform mode
           if (tool === "transform" && trRef.current && groupRef.current) {
              trRef.current.nodes([groupRef.current]);
           }
        }, 50);
      }
    },
    fitImage: () => {
      if (!processedImg) return;
      const stageW = canvasDim.width;
      const stageH = canvasDim.height;
      const aspect = croppedDim.width / croppedDim.height;
      const stageAspect = stageW / stageH;

      let newW, newH;
      if (aspect > stageAspect) {
        newW = stageW;
        newH = newW / aspect;
      } else {
        newH = stageH;
        newW = newH * aspect;
      }

      const scale = newW / croppedDim.width;

      setGroupPos({
        x: (stageW - newW) / 2,
        y: (stageH - newH) / 2,
        scaleX: scale,
        scaleY: scale,
        rotation: 0
      });
    },
    resetImage: () => {
      calculateDefaultPos();
    }
  }));

  const handleMouseDown = (e: any) => {
    if (tool === "transform") return;
    
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage || !groupRef.current) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return; 
    
    // ADVANCED MATH: Convert screen click into Group-relative coordinates!
    const transform = groupRef.current.getAbsoluteTransform().copy();
    transform.invert();
    const relativePos = transform.point(pos);
    
    // Scale the brush size dynamically so it stays consistent relative to zoom
    const currentScale = groupRef.current.scaleX();
    const dynamicSize = (brushSize * 2) / currentScale;

    setLines([...lines, { tool, color, size: dynamicSize, points: [relativePos.x, relativePos.y] }]);
    setHistory([]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || tool === "transform") return;
    
    const stage = e.target.getStage();
    if (!stage || !groupRef.current) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    // ADVANCED MATH: Convert screen movement into Group-relative coordinates
    const transform = groupRef.current.getAbsoluteTransform().copy();
    transform.invert();
    const relativePos = transform.point(pos);
    
    const newLines = [...lines];
    let lastLine = { ...newLines[newLines.length - 1] };
    
    lastLine.points = lastLine.points.concat([relativePos.x, relativePos.y]);
    newLines.splice(newLines.length - 1, 1, lastLine);
    setLines(newLines);
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
          onPointerLeave={handleMouseUp}
        >
          <Layer>
            {/* The Main Group containing the Paper, Strokes, and Stencil */}
            {processedImg && (
              <Group
                ref={groupRef}
                {...groupPos}
                draggable={tool === "transform"}
                onDragEnd={(e) => {
                  setGroupPos({
                    ...groupPos,
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onTransformEnd={(e) => {
                  const node = groupRef.current;
                  setGroupPos({
                    x: node.x(),
                    y: node.y(),
                    scaleX: node.scaleX(),
                    scaleY: node.scaleY(),
                    rotation: node.rotation()
                  });
                }}
              >
                {/* 1. The Canvas Paper */}
                <Rect
                  x={0}
                  y={0}
                  width={croppedDim.width}
                  height={croppedDim.height}
                  fill="white"
                />
              
                {/* 2. The Drawing Strokes (Under the Stencil) */}
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    // Eraser simply paints pure white over the colors
                    stroke={line.tool === 'eraser' ? 'white' : line.color}
                    strokeWidth={line.size}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    opacity={line.tool === 'marker' ? 0.7 : 1}
                  />
                ))}

                {/* 3. The Line Art Stencil (On Top) */}
                <KonvaImage
                  image={processedImg}
                  x={0}
                  y={0}
                  width={croppedDim.width}
                  height={croppedDim.height}
                  listening={false} // Lets clicks pass through to the paper for drawing
                />
              </Group>
            )}

            {/* Transform Handles */}
            {tool === "transform" && (
              <Transformer
                ref={trRef}
                keepRatio={true}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 50 || newBox.height < 50) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

export default ColoringCanvas;
