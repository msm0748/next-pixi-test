export interface Point {
  x: number
  y: number
}

export type Tool = 'move' | 'polygon' | 'bezier' | 'edit' | null
