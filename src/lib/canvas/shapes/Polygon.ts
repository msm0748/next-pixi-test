import * as PIXI from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';
import { Point } from '../../types';

export class Polygon {
  public id: string;
  public graphics: PIXI.Graphics;
  private points: Point[] = [];
  private app: PIXI.Application;
  private label: string;
  private color: string;
  private isSelected: boolean = false;
  private isComplete: boolean = false;
  private dragStartPoints: Point[] = [];
  private draggedPointIndex: number = -1;
  private readonly POINT_RADIUS = 4;
  private readonly POINT_HIT_RADIUS = 8;
  private readonly LINE_HIT_DISTANCE = 10; // 증가된 히트 거리

  constructor(app: PIXI.Application, label: string, color: string) {
    this.id = uuidv4();
    this.app = app;
    this.label = label;
    this.color = color;
    this.graphics = new PIXI.Graphics();
    this.redraw();
  }

  public addPoint(x: number, y: number) {
    this.points.push({ x, y });
    this.redraw();
  }

  public complete() {
    if (this.points.length >= 3) {
      this.isComplete = true;
      this.redraw();
    }
  }

  public setSelected(selected: boolean) {
    this.isSelected = selected;
    this.redraw();
  }

  public startDrag() {
    this.dragStartPoints = [...this.points];
  }

  public moveBy(dx: number, dy: number) {
    if (this.draggedPointIndex !== -1) {
      // Move single point
      const startPoint = this.dragStartPoints[this.draggedPointIndex];
      this.points[this.draggedPointIndex] = {
        x: startPoint.x + dx,
        y: startPoint.y + dy,
      };
    } else {
      // Move entire polygon
      this.points = this.dragStartPoints.map((point) => ({
        x: point.x + dx,
        y: point.y + dy,
      }));
    }
    this.redraw();
  }

  public startPointDrag(x: number, y: number): boolean {
    const pointIndex = this.getPointAtPosition(x, y);
    if (pointIndex !== -1) {
      this.draggedPointIndex = pointIndex;
      this.dragStartPoints = [...this.points];
      return true;
    }
    return false;
  }

  public endDrag() {
    this.draggedPointIndex = -1;
  }

  public insertPointOnLine(x: number, y: number): boolean {
    if (!this.isComplete) return false;

    for (let i = 0; i < this.points.length; i++) {
      const start = this.points[i];
      const end = this.points[(i + 1) % this.points.length];

      if (this.isPointNearLine(x, y, start, end)) {
        // 새로운 점을 삽입하기 전에 드래그를 시작하도록 설정
        this.points.splice(i + 1, 0, { x, y });
        this.draggedPointIndex = i + 1;
        this.dragStartPoints = [...this.points];
        this.redraw();
        return true;
      }
    }
    return false;
  }

  private isPointNearLine(
    px: number,
    py: number,
    start: Point,
    end: Point
  ): boolean {
    // 선분의 방향 벡터
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return false;

    // 점에서 시작점까지의 벡터
    const vx = px - start.x;
    const vy = py - start.y;

    // 점을 선분에 투영
    const t = Math.max(0, Math.min(1, (vx * dx + vy * dy) / (len * len)));

    // 투영된 점의 좌표
    const projX = start.x + t * dx;
    const projY = start.y + t * dy;

    // 점과 투영된 점 사이의 거리 계산
    const distance = Math.sqrt(
      (px - projX) * (px - projX) + (py - projY) * (py - projY)
    );

    return distance <= this.LINE_HIT_DISTANCE;
  }

  private getPointAtPosition(x: number, y: number): number {
    return this.points.findIndex((point) => {
      const dx = point.x - x;
      const dy = point.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= this.POINT_HIT_RADIUS;
    });
  }

  public containsPoint(x: number, y: number): boolean {
    // First check if we're clicking on a point
    if (this.getPointAtPosition(x, y) !== -1) return true;

    // Then check if we're clicking on a line
    if (this.isComplete) {
      for (let i = 0; i < this.points.length; i++) {
        const start = this.points[i];
        const end = this.points[(i + 1) % this.points.length];
        if (this.isPointNearLine(x, y, start, end)) return true;
      }
    }

    // Finally check if point is inside polygon
    if (this.points.length < 3) return false;

    let inside = false;
    for (
      let i = 0, j = this.points.length - 1;
      i < this.points.length;
      j = i++
    ) {
      const xi = this.points[i].x,
        yi = this.points[i].y;
      const xj = this.points[j].x,
        yj = this.points[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  private redraw() {
    this.graphics.clear();

    // Set line style
    const lineWidth = this.isSelected ? 3 : 2;
    const lineColor = this.isSelected ? 0xffffff : 0xff0000;
    this.graphics.lineStyle(lineWidth, lineColor);

    // Draw lines
    if (this.points.length > 0) {
      this.graphics.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length; i++) {
        this.graphics.lineTo(this.points[i].x, this.points[i].y);
      }

      // Close the polygon if complete
      if (this.isComplete && this.points.length >= 3) {
        this.graphics.lineTo(this.points[0].x, this.points[0].y);
      }

      // Draw points
      this.points.forEach((point, index) => {
        const isSelected = index === this.draggedPointIndex;
        this.graphics.beginFill(isSelected ? 0x00ff00 : 0xffffff);
        this.graphics.drawCircle(point.x, point.y, this.POINT_RADIUS);
        this.graphics.endFill();
      });
    }
  }

  public destroy() {
    this.graphics.destroy();
  }
}
