import { create } from 'zustand'
import { Point, Tool } from '../types'
import { Polygon } from '../canvas/shapes/Polygon'

interface CanvasState {
  scale: number
  position: Point
  selectedTool: Tool
  isDrawing: boolean
  currentPoints: Point[]
  selectedPolygonId: string | null
  actions: {
    setScale: (scale: number) => void
    setPosition: (position: Point) => void
    setSelectedTool: (tool: Tool) => void
    setIsDrawing: (isDrawing: boolean) => void
    addPoint: (point: Point) => void
    clearPoints: () => void
    setSelectedPolygonId: (id: string | null) => void
  }
}

export const useCanvasStore = create<CanvasState>((set) => ({
  scale: 1,
  position: { x: 0, y: 0 },
  selectedTool: 'move',
  isDrawing: false,
  currentPoints: [],
  selectedPolygonId: null,
  actions: {
    setScale: (scale) => set({ scale }),
    setPosition: (position) => set({ position }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    addPoint: (point) => set((state) => ({
      currentPoints: [...state.currentPoints, point]
    })),
    clearPoints: () => set({ currentPoints: [] }),
    setSelectedPolygonId: (id) => set({ selectedPolygonId: id }),
  }
}))
