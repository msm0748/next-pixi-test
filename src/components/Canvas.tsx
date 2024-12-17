import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { CanvasController } from '@/lib/canvas/CanvasController';
import ToolBar from './canvas/ToolBar';

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasControllerRef = useRef<CanvasController | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize PIXI Application
    appRef.current = new PIXI.Application({
      resizeTo: containerRef.current,
      backgroundColor: 0x374150,
      antialias: true,
    });

    containerRef.current.appendChild(appRef.current.view as HTMLCanvasElement);

    // Initialize Canvas Controller
    canvasControllerRef.current = new CanvasController(appRef.current);

    // Load test image
    const loadTestImage = async () => {
      const img = new Image();
      const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
      img.src = '/test-image.png';

      try {
        const loadedImg = await loadPromise;
        if (canvasControllerRef.current) {
          await canvasControllerRef.current.loadImage(
            '/test-image.png',
            loadedImg.width,
            loadedImg.height
          );
        }
      } catch (error) {
        console.error('Failed to load test image:', error);
      }
    };

    loadTestImage();

    return () => {
      // Clean up in reverse order
      if (canvasControllerRef.current) {
        canvasControllerRef.current.destroy();
        canvasControllerRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <ToolBar />
    </div>
  );
}
