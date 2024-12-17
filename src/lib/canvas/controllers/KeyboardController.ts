import { CanvasController } from '../CanvasController'
import { useCanvasStore } from '../../store/canvasStore'
import { Tool } from '../../types'

export class KeyboardController {
  private canvasController: CanvasController

  constructor(canvasController: CanvasController) {
    this.canvasController = canvasController
  }

  public onKeyDown(e: KeyboardEvent) {
    const { selectedTool, isDrawing, selectedPolygonId } = useCanvasStore.getState()
    const { setSelectedTool, setIsDrawing, clearPoints } = useCanvasStore.getState().actions

    // Don't handle shortcuts if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key.toLowerCase()) {
      case 'v':
        setSelectedTool('move')
        break
      case 'p':
        setSelectedTool('polygon')
        break
      case 'b':
        setSelectedTool('bezier')
        break
      case 'e':
        setSelectedTool('edit')
        break
      case 'escape':
        if (isDrawing) {
          this.canvasController.getLabelLayer().cancelCurrentPolygon()
          setIsDrawing(false)
          clearPoints()
        }
        break
      case 'enter':
        if (isDrawing) {
          this.canvasController.getLabelLayer().completePolygon()
          setIsDrawing(false)
          clearPoints()
        }
        break
      case 'backspace':
      case 'delete':
        if (selectedPolygonId) {
          this.canvasController.getLabelLayer().removePolygon(selectedPolygonId)
        }
        break
      case 'z':
        if (e.ctrlKey || e.metaKey) {
          if (e.shiftKey) {
            // Redo (to be implemented)
          } else {
            // Undo (to be implemented)
          }
        }
        break
    }
  }

  public onKeyUp(e: KeyboardEvent) {
    // Handle key up events if needed
  }

  public destroy() {
    // Cleanup if needed
  }
}
