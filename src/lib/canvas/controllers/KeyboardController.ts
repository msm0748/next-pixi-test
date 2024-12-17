import { CanvasController } from '../CanvasController'

export class KeyboardController {
  private canvasController: CanvasController

  constructor(canvasController: CanvasController) {
    this.canvasController = canvasController
  }

  public onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        // Cancel current action
        break
      case 'Delete':
        // Delete selected item
        break
      case 'z':
        if (e.ctrlKey || e.metaKey) {
          if (e.shiftKey) {
            // Redo
          } else {
            // Undo
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
