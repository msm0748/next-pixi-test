import { CanvasController } from '../CanvasController';
import { useCanvasStore } from '../../store/canvasStore';
import { Polygon } from '../shapes/Polygon';

export class MouseController {
  private canvasController: CanvasController;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private draggedPolygon: Polygon | null = null;
  private readonly MIN_SCALE = 0.1;
  private readonly MAX_SCALE = 5;
  private readonly ZOOM_SPEED = 0.001;

  constructor(canvasController: CanvasController) {
    this.canvasController = canvasController;
  }

  private getWorldPosition(e: MouseEvent) {
    const rect = this.canvasController.getApp().view.getBoundingClientRect();
    const { scale, position } = useCanvasStore.getState();

    return {
      x: (e.clientX - rect.left - position.x) / scale,
      y: (e.clientY - rect.top - position.y) / scale,
    };
  }

  public onMouseDown(e: MouseEvent) {
    const { selectedTool, isDrawing } = useCanvasStore.getState();
    const { setIsDrawing, addPoint, clearPoints, setSelectedPolygonId } =
      useCanvasStore.getState().actions;

    const worldPos = this.getWorldPosition(e);
    this.dragStartX = worldPos.x;
    this.dragStartY = worldPos.y;

    let clickedPolygon = this.canvasController
      .getLabelLayer()
      .getPolygonAt(worldPos.x, worldPos.y);

    switch (selectedTool) {
      case 'move':
        if (clickedPolygon) {
          this.isDragging = true;
          this.draggedPolygon = clickedPolygon;
          clickedPolygon.startDrag();
        } else {
          // Start canvas panning
          this.isDragging = true;
          this.draggedPolygon = null;
        }
        break;

      case 'polygon':
      case 'bezier':
        if (!isDrawing) {
          // Start new polygon
          setIsDrawing(true);
          this.canvasController
            .getLabelLayer()
            .startNewPolygon('Label', '#FF0000');
        } else {
          const currentPolygon = this.canvasController
            .getLabelLayer()
            .getCurrentPolygon();
          if (currentPolygon) {
            const points = useCanvasStore.getState().currentPoints;
            // Check if clicking near the start point to complete polygon
            if (points.length >= 2) {
              const startPoint = points[0];
              const distance = Math.sqrt(
                Math.pow(worldPos.x - startPoint.x, 2) +
                  Math.pow(worldPos.y - startPoint.y, 2)
              );
              if (distance < 10) {
                // 10 pixels threshold
                this.canvasController.getLabelLayer().completePolygon();
                setIsDrawing(false);
                clearPoints();
                return;
              }
            }
            // Add new point
            addPoint(worldPos);
            currentPolygon.addPoint(worldPos.x, worldPos.y);
          }
        }
        break;

      case 'edit':
        // Handle polygon selection
        if (clickedPolygon) {
          setSelectedPolygonId(clickedPolygon.id);
          this.canvasController.getLabelLayer().selectPolygon(clickedPolygon);
        } else {
          setSelectedPolygonId(null);
          this.canvasController.getLabelLayer().clearSelection();
        }
        break;
    }
  }

  public onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;

    const worldPos = this.getWorldPosition(e);
    const dx = worldPos.x - this.dragStartX;
    const dy = worldPos.y - this.dragStartY;

    if (this.draggedPolygon) {
      // Move the polygon
      this.draggedPolygon.moveBy(dx, dy);
    } else {
      // Pan the canvas
      const { position } = useCanvasStore.getState();
      const { setPosition } = useCanvasStore.getState().actions;

      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY,
      });
    }
  }

  public onMouseUp(e: MouseEvent) {
    this.isDragging = false;
    this.draggedPolygon = null;
  }

  public onWheel(e: WheelEvent) {
    e.preventDefault();

    const { scale, position } = useCanvasStore.getState();
    const { setScale, setPosition } = useCanvasStore.getState().actions;

    // Calculate world position before zoom
    const rect = this.canvasController.getApp().view.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate new scale
    const delta = -e.deltaY * this.ZOOM_SPEED;
    const newScale = Math.max(
      this.MIN_SCALE,
      Math.min(this.MAX_SCALE, scale * (1 + delta))
    );
    const scaleFactor = newScale / scale;

    // Update position to zoom toward cursor
    setPosition({
      x: x - (x - position.x) * scaleFactor,
      y: y - (y - position.y) * scaleFactor,
    });
    setScale(newScale);
  }

  public destroy() {
    // Cleanup if needed
  }
}
