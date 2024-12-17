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
    this.points = this.dragStartPoints.map((point) => ({
      x: point.x + dx,
      y: point.y + dy,
    }));
    this.redraw();
  }

  public containsPoint(x: number, y: number): boolean {
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

    // Draw points and lines
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
      this.points.forEach((point) => {
        this.graphics.beginFill(0xffffff);
        this.graphics.drawCircle(point.x, point.y, 4);
        this.graphics.endFill();
      });
    }
  }

  public destroy() {
    this.graphics.destroy();
  }
}
