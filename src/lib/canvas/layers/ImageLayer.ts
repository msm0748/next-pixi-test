import * as PIXI from 'pixi.js';
import { adjustImageToCanvas } from '../utils/adjustImageToCanvas';

export class ImageLayer {
  public container: PIXI.Container;
  private sprite: PIXI.Sprite | null = null;
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
  }

  public async loadImage(url: string) {
    try {
      // Remove existing sprite if any
      if (this.sprite) {
        this.container.removeChild(this.sprite);
        this.sprite.destroy();
      }

      // Create a base texture from the URL
      const baseTexture = await PIXI.BaseTexture.from(url);

      // Wait for the base texture to load
      await new Promise((resolve) => {
        if (baseTexture.valid) {
          resolve(true);
        } else {
          baseTexture.once('loaded', () => resolve(true));
        }
      });

      // Create texture and sprite
      const texture = new PIXI.Texture(baseTexture);
      this.sprite = new PIXI.Sprite(texture);

      // Adjust image size to canvas
      const { width, height, x, y } = adjustImageToCanvas(
        baseTexture.width,
        baseTexture.height,
        this.app.screen.width,
        this.app.screen.height
      );

      this.sprite.width = width;
      this.sprite.height = height;
      this.sprite.position.set(x, y);

      // Add to container
      this.container.addChild(this.sprite);
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }

  public destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
    this.container.destroy();
  }
}
