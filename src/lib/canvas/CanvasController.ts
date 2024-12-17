import * as PIXI from 'pixi.js';
import { ImageLayer } from './layers/ImageLayer';
import { LabelLayer } from './layers/LabelLayer';
import { MouseController } from './controllers/MouseController';
import { KeyboardController } from './controllers/KeyboardController';
import { useCanvasStore } from '../store/canvasStore';

export class CanvasController {
  private app: PIXI.Application;
  private imageLayer: ImageLayer;
  private labelLayer: LabelLayer;
  private mouseController: MouseController;
  private keyboardController: KeyboardController;
  private viewport: PIXI.Container;

  constructor(app: PIXI.Application) {
    this.app = app;

    // Initialize viewport container for zoom/pan
    this.viewport = new PIXI.Container();
    this.app.stage.addChild(this.viewport);

    // Initialize layers
    this.imageLayer = new ImageLayer(app);
    this.labelLayer = new LabelLayer(app);

    // Add layers to viewport instead of stage
    this.viewport.addChild(this.imageLayer.container);
    this.viewport.addChild(this.labelLayer.container);

    // Initialize controllers
    this.mouseController = new MouseController(this);
    this.keyboardController = new KeyboardController(this);

    // Setup event listeners
    this.setupEventListeners();

    // Start update loop
    this.app.ticker.add(this.update.bind(this));
  }

  private update() {
    const { scale, position } = useCanvasStore.getState();

    // Update viewport scale and position
    this.viewport.scale.set(scale);
    this.viewport.position.set(position.x, position.y);
  }

  public getApp() {
    return this.app;
  }

  private setupEventListeners() {
    this.app.view.addEventListener('wheel', this.handleWheel.bind(this));
    this.app.view.addEventListener(
      'mousedown',
      this.handleMouseDown.bind(this)
    );
    this.app.view.addEventListener(
      'mousemove',
      this.handleMouseMove.bind(this)
    );
    this.app.view.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleWheel(e: WheelEvent) {
    this.mouseController.onWheel(e);
  }

  private handleMouseDown(e: MouseEvent) {
    this.mouseController.onMouseDown(e);
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouseController.onMouseMove(e);
  }

  private handleMouseUp(e: MouseEvent) {
    this.mouseController.onMouseUp(e);
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.keyboardController.onKeyDown(e);
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keyboardController.onKeyUp(e);
  }

  public loadImage(url: string) {
    this.imageLayer.loadImage(url);
  }

  public destroy() {
    // Remove event listeners
    // this.app.view.removeEventListener('wheel', this.handleWheel)
    // this.app.view.removeEventListener('mousedown', this.handleMouseDown)
    // this.app.view.removeEventListener('mousemove', this.handleMouseMove)
    // this.app.view.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    // Stop update loop
    // this.app.ticker.remove(this.update.bind(this));

    // Destroy controllers
    this.mouseController.destroy();
    this.keyboardController.destroy();

    // Destroy layers
    this.imageLayer.destroy();
    this.labelLayer.destroy();

    // Destroy viewport
    this.viewport.destroy();
  }
}
