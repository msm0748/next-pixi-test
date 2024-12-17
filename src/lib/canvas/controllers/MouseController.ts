import { CanvasController } from '../CanvasController';
import { useCanvasStore } from '../../store/canvasStore';

export class MouseController {
  private canvasController: CanvasController;
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;
  private readonly MIN_SCALE = 0.1;
  private readonly MAX_SCALE = 5;
  private readonly ZOOM_SPEED = 0.001;

  constructor(canvasController: CanvasController) {
    this.canvasController = canvasController;
  }

  public onMouseDown(e: MouseEvent) {
    const selectedTool = useCanvasStore.getState().selectedTool;

    if (selectedTool === 'move') {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  }

  public onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.lastX;
    const deltaY = e.clientY - this.lastY;

    const { position, scale } = useCanvasStore.getState();
    const { setPosition } = useCanvasStore.getState().actions;

    // Update position based on drag movement and current scale
    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY,
    });

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  public onMouseUp(e: MouseEvent) {
    this.isDragging = false;
  }

  public onWheel(e: WheelEvent) {
    e.preventDefault();

    const { scale, position } = useCanvasStore.getState();
    const { setScale, setPosition } = useCanvasStore.getState().actions;

    // Get mouse position relative to viewport
    const rect = this.canvasController.getApp().view.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom
    const delta = e.deltaY;
    const zoomFactor = 1 - delta * this.ZOOM_SPEED;
    const newScale = Math.max(
      this.MIN_SCALE,
      Math.min(this.MAX_SCALE, scale * zoomFactor)
    );

    // Calculate the world position of the mouse before zoom
    const worldX = (mouseX - position.x) / scale;
    const worldY = (mouseY - position.y) / scale;

    // Calculate new position
    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  }

  public destroy() {
    this.isDragging = false;
  }
}
