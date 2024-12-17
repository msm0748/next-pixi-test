import * as PIXI from 'pixi.js'
import { ImageLayer } from './layers/ImageLayer'
import { LabelLayer } from './layers/LabelLayer'
import { MouseController } from './controllers/MouseController'
import { KeyboardController } from './controllers/KeyboardController'
import { useCanvasStore } from '../store/canvasStore'

export class CanvasController {
  private app: PIXI.Application
  private imageLayer: ImageLayer
  private labelLayer: LabelLayer
  private mouseController: MouseController
  private keyboardController: KeyboardController
  private viewport: PIXI.Container

  constructor(app: PIXI.Application) {
    this.app = app
    
    // Initialize viewport container for zoom/pan
    this.viewport = new PIXI.Container()
    this.app.stage.addChild(this.viewport)
    
    // Initialize layers
    this.imageLayer = new ImageLayer(app)
    this.labelLayer = new LabelLayer(app)
    
    // Add layers to viewport instead of stage
    this.viewport.addChild(this.imageLayer.container)
    this.viewport.addChild(this.labelLayer.container)

    // Initialize controllers
    this.mouseController = new MouseController(this)
    this.keyboardController = new KeyboardController(this)

    // Setup event listeners
    this.setupEventListeners()

    // Start update loop
    this.app.ticker.add(this.update.bind(this))
  }

  private update() {
    const { scale, position } = useCanvasStore.getState()
    
    // Update viewport scale and position
    this.viewport.scale.set(scale)
    this.viewport.position.set(position.x, position.y)
  }

  public getApp() {
    return this.app
  }

  public getLabelLayer() {
    return this.labelLayer
  }

  public async loadImage(url: string) {
    try {
      // Create a temporary Image element to get dimensions
      const img = new Image()
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = reject
      })
      img.src = url
      await loadPromise

      // Now we have the image dimensions, load it into PIXI
      await this.imageLayer.loadImage(url, img.width, img.height)
    } catch (error) {
      console.error('Error loading image:', error)
    }
  }

  private setupEventListeners() {
    this.app.view.addEventListener('wheel', this.handleWheel.bind(this))
    this.app.view.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.app.view.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.app.view.addEventListener('mouseup', this.handleMouseUp.bind(this))
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  private handleWheel(e: WheelEvent) {
    this.mouseController.onWheel(e)
  }

  private handleMouseDown(e: MouseEvent) {
    this.mouseController.onMouseDown(e)
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouseController.onMouseMove(e)
  }

  private handleMouseUp(e: MouseEvent) {
    this.mouseController.onMouseUp(e)
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.keyboardController.onKeyDown(e)
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keyboardController.onKeyUp(e)
  }

  public destroy() {
    // Remove event listeners
    if (this.app?.view) {
      this.app.view.removeEventListener('wheel', this.handleWheel.bind(this))
      this.app.view.removeEventListener('mousedown', this.handleMouseDown.bind(this))
      this.app.view.removeEventListener('mousemove', this.handleMouseMove.bind(this))
      this.app.view.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    }
    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
    window.removeEventListener('keyup', this.handleKeyUp.bind(this))

    // Stop update loop
    if (this.app?.ticker) {
      this.app.ticker.remove(this.update.bind(this))
    }

    // Destroy controllers
    if (this.mouseController) {
      this.mouseController.destroy()
    }
    if (this.keyboardController) {
      this.keyboardController.destroy()
    }

    // Destroy layers
    if (this.imageLayer) {
      this.imageLayer.destroy()
    }
    if (this.labelLayer) {
      this.labelLayer.destroy()
    }

    // Destroy viewport
    if (this.viewport) {
      this.viewport.destroy()
    }
  }
}
