import { create } from 'zustand'

interface CanvasState {
  scale: number
  position: { x: number; y: number }
  selectedTool: 'move' | 'polygon' | 'edit' | null
  selectedPolygonId: string | null
  actions: {
    setScale: (scale: number) => void
    setPosition: (position: { x: number; y: number }) => void
    setSelectedTool: (tool: 'move' | 'polygon' | 'edit' | null) => void
    setSelectedPolygonId: (id: string | null) => void
  }
}

export const useCanvasStore = create<CanvasState>((set) => ({
  scale: 1,
  position: { x: 0, y: 0 },
  selectedTool: null,
  selectedPolygonId: null,
  actions: {
    setScale: (scale) => set({ scale }),
    setPosition: (position) => set({ position }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    setSelectedPolygonId: (id) => set({ selectedPolygonId: id }),
  },
}))
