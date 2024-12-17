import * as PIXI from 'pixi.js'

export class Polygon {
  public graphics: PIXI.Graphics
  private points: PIXI.Point[] = []
  private label: string
  private color: string
  private app: PIXI.Application
  private isComplete = false

  constructor(app: PIXI.Application, label: string, color: string) {
    this.app = app
    this.label = label
    this.color = color
    this.graphics = new PIXI.Graphics()
  }

  public addPoint(x: number, y: number) {
    if (this.isComplete) return

    this.points.push(new PIXI.Point(x, y))
    this.redraw()
  }

  public complete() {
    if (this.points.length < 3) return
    this.isComplete = true
    this.redraw()
  }

  public containsPoint(x: number, y: number): boolean {
    if (!this.isComplete || this.points.length < 3) return false

    const point = new PIXI.Point(x, y)
    return this.graphics.containsPoint(point)
  }

  private redraw() {
    this.graphics.clear()

    // Convert color string to number
    const colorNum = parseInt(this.color.replace('#', ''), 16)

    this.graphics.lineStyle(2, colorNum)
    this.graphics.beginFill(colorNum, 0.3)

    // Draw polygon
    if (this.points.length > 0) {
      this.graphics.moveTo(this.points[0].x, this.points[0].y)
      for (let i = 1; i < this.points.length; i++) {
        this.graphics.lineTo(this.points[i].x, this.points[i].y)
      }

      // Close the polygon if complete
      if (this.isComplete) {
        this.graphics.lineTo(this.points[0].x, this.points[0].y)
      }
    }

    this.graphics.endFill()

    // Draw points
    this.points.forEach(point => {
      this.graphics.beginFill(0xFFFFFF)
      this.graphics.drawCircle(point.x, point.y, 3)
      this.graphics.endFill()
    })
  }

  public destroy() {
    this.graphics.destroy()
  }
}
