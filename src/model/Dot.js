
let nextId = 0;

export class Dot {
  constructor({id, x, y, dx, dy, size}) {
    this.id = nextId++;
    this.x = x; 
    this.y = y; 
    this.dx = dx; 
    this.dy = dy; 
    this.size = size;
    this.connections=[];
  }

  distanceTo(otherDot) {
    const dx = Math.abs(this.x - otherDot.x);
    const dy = Math.abs(this.y - otherDot.y);
    return Math.sqrt(dx*dx + dy*dy);
  }

  render(context, radius) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = 'black';
    context.stroke();
    context.moveTo(0,0);

    this.connections.forEach((otherDot) => {
      const distance = this.distanceTo(otherDot);
      let strength = Math.max(0, radius - distance)/radius;
      strength = Math.round(strength * 100) / 100
      const color = `rgba(0, 0, 0, ${strength})`
      context.beginPath();
      context.lineWidth = Math.ceil(10 * strength);
      context.strokeStyle = color;
      context.moveTo(this.x, this.y);
      context.lineTo(otherDot.x, otherDot.y);
      context.stroke();
    })    
  }
}