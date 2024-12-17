import { create } from 'zustand';
import { Point } from '../types';
import { Polygon } from '../canvas/shapes/Polygon';

interface CanvasStore {
  scale: number;
  position: { x: number; y: number };
  selectedTool: 'move' | 'polygon' | 'bezier' | 'edit';
  isDrawing: boolean;
  currentPoints: Point[];
  selectedPolygonId: string | null;
  polygons: Polygon[];
  actions: {
    setScale: (scale: number) => void;
    setPosition: (position: { x: number; y: number }) => void;
    setSelectedTool: (tool: 'move' | 'polygon' | 'bezier' | 'edit') => void;
    setIsDrawing: (isDrawing: boolean) => void;
    addPoint: (point: Point) => void;
    clearPoints: () => void;
    setSelectedPolygonId: (id: string | null) => void;
    addPolygon: (polygon: Polygon) => void;
    removePolygon: (id: string) => void;
    clearPolygons: () => void;
  };
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  scale: 1,
  position: { x: 0, y: 0 },
  selectedTool: 'move',
  isDrawing: false,
  currentPoints: [],
  selectedPolygonId: null,
  polygons: [],
  actions: {
    setScale: (scale) => set({ scale }),
    setPosition: (position) => set({ position }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    addPoint: (point) =>
      set((state) => ({
        currentPoints: [...state.currentPoints, point],
      })),
    clearPoints: () => set({ currentPoints: [] }),
    setSelectedPolygonId: (id) => set({ selectedPolygonId: id }),
    addPolygon: (polygon) =>
      set((state) => ({
        polygons: [...state.polygons, polygon],
      })),
    removePolygon: (id) =>
      set((state) => ({
        polygons: state.polygons.filter((p) => p.id !== id),
      })),
    clearPolygons: () => set({ polygons: [] }),
  },
}));
