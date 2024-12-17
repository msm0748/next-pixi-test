import { useCanvasStore } from '@/lib/store/canvasStore'
import { useEffect } from 'react'

export default function ToolBar() {
  const { selectedTool, actions } = useCanvasStore()
  const { setSelectedTool } = actions

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'v') setSelectedTool('move')
      else if (e.key === 'p') setSelectedTool('polygon')
      else if (e.key === 'b') setSelectedTool('bezier')
      else if (e.key === 'e') setSelectedTool('edit')
      else if (e.key === 'Escape') {
        const { currentPolygon, isDrawing } = useCanvasStore.getState()
        if (isDrawing && currentPolygon) {
          currentPolygon.destroy()
          useCanvasStore.getState().actions.setCurrentPolygon(null)
          useCanvasStore.getState().actions.setIsDrawing(false)
          useCanvasStore.getState().actions.clearPoints()
        }
      } else if (e.key === 'Enter') {
        const { currentPolygon, isDrawing } = useCanvasStore.getState()
        if (isDrawing && currentPolygon) {
          useCanvasStore.getState().actions.completePolygon()
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedPolygonId } = useCanvasStore.getState()
        if (selectedPolygonId) {
          useCanvasStore.getState().actions.removePolygon(selectedPolygonId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSelectedTool])

  return (
    <div className="absolute bottom-4 left-4 flex gap-2 p-3 bg-black rounded">
      <button
        className={`p-2 rounded ${
          selectedTool === 'move' ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
        onClick={() => setSelectedTool('move')}
        title="Move (V)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300"
        >
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      </button>
      <button
        className={`p-2 rounded ${
          selectedTool === 'polygon' ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
        onClick={() => setSelectedTool('polygon')}
        title="Polygon (P)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300"
        >
          <path d="M3 7V5c0-1.1.9-2 2-2h2" />
          <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
          <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
          <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
        </svg>
      </button>
      <button
        className={`p-2 rounded ${
          selectedTool === 'bezier' ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
        onClick={() => setSelectedTool('bezier')}
        title="Bezier (B)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300"
        >
          <path d="M3 3C7 7 17 7 21 3" />
          <path d="M3 21C7 17 17 17 21 21" />
        </svg>
      </button>
      <button
        className={`p-2 rounded ${
          selectedTool === 'edit' ? 'bg-gray-700' : 'hover:bg-gray-800'
        }`}
        onClick={() => setSelectedTool('edit')}
        title="Edit (E)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </button>
      <div className="w-px h-6 bg-gray-700 my-auto mx-2" />
      <div className="text-gray-300 flex items-center">
        {Math.round(useCanvasStore.getState().scale * 100)}%
      </div>
    </div>
  )
}
