import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { CanvasController } from '@/lib/canvas/CanvasController';
import ToolBar from './canvas/ToolBar';

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasController = useRef<CanvasController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize PIXI Application
    const app = new PIXI.Application({
      resizeTo: containerRef.current,
      backgroundColor: 0x374150,
      antialias: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    // Initialize Canvas Controller
    canvasController.current = new CanvasController(app);

    // Load test image
    canvasController.current.loadImage('/test-image.png');

    return () => {
      app.destroy(true);
      canvasController.current?.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <ToolBar />
    </div>
  );
}
