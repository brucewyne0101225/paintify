"use client";

import { useEffect, useState } from "react";
import ColoringCanvas from "./ColoringCanvas";

// This wrapper component ensures that the actual canvas is strictly rendered gracefully on the client.
export default function CanvasWrapper({ canvasRef, ...props }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ColoringCanvas ref={canvasRef} {...props} />;
}
