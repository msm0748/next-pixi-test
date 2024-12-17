import * as PIXI from 'pixi.js';
import { Polygon } from '../shapes/Polygon';
import { useCanvasStore } from '../../store/canvasStore';

export class LabelLayer {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private currentPolygon: Polygon | null = null;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
  }

  public startNewPolygon(label: string, color: string) {
    this.currentPolygon = new Polygon(this.app, label, color);
    this.container.addChild(this.currentPolygon.graphics);
  }

  public completePolygon() {
    if (this.currentPolygon) {
      this.currentPolygon.complete();
      useCanvasStore.getState().actions.addPolygon(this.currentPolygon);
      this.currentPolygon = null;
    }
  }

  public getCurrentPolygon(): Polygon | null {
    return this.currentPolygon;
  }

  public getPolygonAt(x: number, y: number): Polygon | null {
    const { polygons } = useCanvasStore.getState();
    // 선택된 폴리곤이 있다면 먼저 확인
    const selectedId = useCanvasStore.getState().selectedPolygonId;
    if (selectedId) {
      const selectedPolygon = polygons.find((p) => p.id === selectedId);
      if (selectedPolygon && selectedPolygon.containsPoint(x, y)) {
        return selectedPolygon;
      }
    }
    // 나머지 폴리곤들 확인 (역순으로 확인하여 나중에 그려진 것을 먼저 선택)
    for (let i = polygons.length - 1; i >= 0; i--) {
      if (polygons[i].id !== selectedId && polygons[i].containsPoint(x, y)) {
        return polygons[i];
      }
    }
    return null;
  }

  public selectPolygon(polygon: Polygon | null) {
    const { polygons } = useCanvasStore.getState();
    // 모든 폴리곤의 선택 상태 해제
    polygons.forEach((p) => p.setSelected(false));
    // 선택된 폴리곤만 선택 상태로 설정
    if (polygon) {
      polygon.setSelected(true);
    }
  }

  public clearSelection() {
    const { polygons } = useCanvasStore.getState();
    polygons.forEach((p) => p.setSelected(false));
  }

  public destroy() {
    if (this.currentPolygon) {
      this.currentPolygon.destroy();
    }
    const { polygons } = useCanvasStore.getState();
    polygons.forEach((p) => p.destroy());
    this.container.destroy();
  }
}
