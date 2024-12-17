import * as PIXI from 'pixi.js'
import { Polygon } from '../shapes/Polygon'

export class LabelLayer {
  public container: PIXI.Container
  private polygons: Polygon[] = []
  private app: PIXI.Application
  private currentPolygon: Polygon | null = null

  constructor(app: PIXI.Application) {
    this.app = app
    this.container = new PIXI.Container()
  }

  public startNewPolygon(label: string, color: string) {
    this.currentPolygon = new Polygon(this.app, label, color)
    this.container.addChild(this.currentPolygon.graphics)
  }

  public addPoint(x: number, y: number) {
    if (!this.currentPolygon) return
    this.currentPolygon.addPoint(x, y)
  }

  public completePolygon() {
    if (!this.currentPolygon) return
    this.currentPolygon.complete()
    this.polygons.push(this.currentPolygon)
    this.currentPolygon = null
  }

  public cancelCurrentPolygon() {
    if (!this.currentPolygon) return
    this.currentPolygon.destroy()
    this.currentPolygon = null
  }

  public getPolygonAt(x: number, y: number): Polygon | null {
    return this.polygons.find(polygon => polygon.containsPoint(x, y)) || null
  }

  public destroy() {
    this.polygons.forEach(polygon => polygon.destroy())
    this.container.destroy()
  }
}
