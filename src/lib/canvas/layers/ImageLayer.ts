import * as PIXI from 'pixi.js'
import { adjustImageToCanvas } from '../utils/adjustImageToCanvas'

export class ImageLayer {
  public container: PIXI.Container
  private sprite: PIXI.Sprite | null = null
  private app: PIXI.Application

  constructor(app: PIXI.Application) {
    this.app = app
    this.container = new PIXI.Container()
  }

  public async loadImage(url: string, width: number, height: number) {
    try {
      // Remove existing sprite if any
      if (this.sprite) {
        this.container.removeChild(this.sprite)
        this.sprite.destroy()
      }

      // Load the texture
      const texture = await PIXI.Texture.fromURL(url)
      this.sprite = new PIXI.Sprite(texture)

      // Adjust image size to canvas using the provided dimensions
      const { width: adjustedWidth, height: adjustedHeight, x, y } = adjustImageToCanvas(
        width,
        height,
        this.app.screen.width,
        this.app.screen.height
      )

      this.sprite.width = adjustedWidth
      this.sprite.height = adjustedHeight
      this.sprite.position.set(x, y)

      // Add to container
      this.container.addChild(this.sprite)
    } catch (error) {
      console.error('Error loading image:', error)
    }
  }

  public destroy() {
    if (this.sprite) {
      this.sprite.destroy()
    }
    this.container.destroy()
  }
}
