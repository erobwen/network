

export class Dot {
  constructor({id, x, y, dx, dy, size, connectionRadius}) {
    this.id = id;
    this.x = x; 
    this.y = y; 
    this.dx = dx; 
    this.dy = dy; 
    this.size = size; 
    this.connectionRadius = connectionRadius;
    this.connections=[];
  }
}