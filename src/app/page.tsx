'use client';

import { useCanvasStore } from '@/lib/store/canvasStore';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/Canvas'), { ssr: false });

export default function WorkingPage() {
  const { polygons } = useCanvasStore();

  console.log(polygons);
  return (
    <div className="w-full h-screen bg-[#374150] relative">
      <Canvas />
    </div>
  );
}
