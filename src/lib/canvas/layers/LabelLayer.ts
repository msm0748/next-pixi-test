import * as PIXI from 'pixi.js'
import { Polygon } from '../shapes/Polygon'
import { useCanvasStore } from '@/lib/store/canvasStore'

export class LabelLayer {
  public container: PIXI.Container
  private app: PIXI.Application
  private polygons: Map<string, Polygon> = new Map()
  private selectedPolygon: Polygon | null = null
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
    this.addPolygon(this.currentPolygon)
    this.currentPolygon = null
  }

  public cancelCurrentPolygon() {
    if (!this.currentPolygon) return
    this.container.removeChild(this.currentPolygon.graphics)
    this.currentPolygon.destroy()
    this.currentPolygon = null
  }

  public addPolygon(polygon: Polygon) {
    this.polygons.set(polygon.id, polygon)
    if (!this.container.children.includes(polygon.graphics)) {
      this.container.addChild(polygon.graphics)
    }
  }

  public removePolygon(id: string) {
    const polygon = this.polygons.get(id)
    if (polygon) {
      this.container.removeChild(polygon.graphics)
      polygon.destroy()
      this.polygons.delete(id)
      if (this.selectedPolygon === polygon) {
        this.selectedPolygon = null
      }
    }
  }

  public getPolygon(id: string): Polygon | undefined {
    return this.polygons.get(id)
  }

  public getPolygonAt(x: number, y: number): Polygon | null {
    for (const polygon of this.polygons.values()) {
      if (polygon.containsPoint(x, y)) {
        return polygon
      }
    }
    return null
  }

  public selectPolygon(polygon: Polygon | null) {
    if (this.selectedPolygon) {
      this.selectedPolygon.setSelected(false)
    }
    this.selectedPolygon = polygon
    if (polygon) {
      polygon.setSelected(true)
    }
  }

  public clearSelection() {
    if (this.selectedPolygon) {
      this.selectedPolygon.setSelected(false)
      this.selectedPolygon = null
    }
  }

  public getSelectedPolygon(): Polygon | null {
    return this.selectedPolygon
  }

  public getCurrentPolygon(): Polygon | null {
    return this.currentPolygon
  }

  public getAllPolygons(): Polygon[] {
    return Array.from(this.polygons.values())
  }

  public destroy() {
    // Clean up current polygon if exists
    if (this.currentPolygon) {
      this.currentPolygon.destroy()
      this.currentPolygon = null
    }

    // Clean up all polygons
    this.polygons.forEach(polygon => {
      polygon.destroy()
    })
    this.polygons.clear()
    this.selectedPolygon = null
    
    // Destroy container
    this.container.destroy()
  }
}
