const log = console.log; 

function swap(array, ia, ib) {
  if (ia === ib) return;
  const a = array[ia];
  array[ia] = array[ib];
  array[ib] = a; 
}


export class BSPTree {
  constructor(dots, startIndex, endIndex, bounds, horizontal=true, build=true) {
    if (!bounds) bounds = {minX: null, maxX: null, minY: null, maxY: null}
    this.horizontal = horizontal;
    this.startIndex = startIndex;
    this.endIndex = endIndex; 
    this.dots = dots; 
    this.bounds = bounds; 
    this.doNotPartitionSize=5; 
    this.pivotValue = null;
    this.pivotIndex = null;
    // log("constructor...")
    if (build) this.build();
  }

  build() {
    // console.log("Build.")
    const {dots, startIndex, endIndex, bounds, horizontal} = this; 
  
    // console.log(`startIndex: ${startIndex} endIndex: ${endIndex} horizontal:${horizontal}`)
    // console.log(dots.slice(startIndex, endIndex + 1).map(dot => dot[horizontal?"x":"y"]));

    const pivotResult = this.partition();
    if (pivotResult === null) return; 

    const [pivotIndex, pivotValue] = pivotResult;
    // console.log(pivotResult)
    // console.log(bounds);

    this.pivotIndex = pivotIndex;
    this.pivotValue = pivotValue; 

    // console.log("first")
    const lowLimitation = horizontal ? {maxX: pivotValue} : {maxY: pivotValue};
    this.lowPartition = new BSPTree(dots, startIndex, pivotIndex, {...bounds, ...lowLimitation}, !horizontal);
    
    // console.log("second");
    const highLimitation = horizontal ? {minX: pivotValue + 1} : {minY: pivotValue + 1};
    this.highPartition = new BSPTree(dots, pivotIndex + 1, endIndex, {...bounds, ...highLimitation}, !horizontal);
  }

  partition() {
    const {dots, startIndex, endIndex, horizontal} = this; 
    const axis = horizontal ? "x" : "y";
  
    const pivotIndex = this.findPartitioningPivot(axis); 
    if (pivotIndex === null) return null; 
    const pivotValue = dots[pivotIndex][axis];
    // log("pivot value: " + pivotValue)

    let low = startIndex;
    let high = endIndex;
    
    while(low < high) {
      // log("loop")
      // log(`low: ${low}, high: ${high}`);
      // log("scanning...");
      while(dots[low][axis] <= pivotValue && low < endIndex) low++;
      while(dots[high][axis] > pivotValue) high--;
      // log(`low: ${low}, high: ${high}`)
      if (low < high) {
        // log("swap:")
        // log(dots.map(dot => dot[axis]));
        swap(dots, low, high);
        // log(dots.map(dot => dot[axis]));
        
        low++;
        high--;
      }
    }
    // log(`low: ${low}, high: ${high}`)
    const partitionIndex = (low === high) ? (dots[low][axis] <= pivotValue ? low : low - 1) : low - 1 
    if (partitionIndex < startIndex || partitionIndex > endIndex) throw new Error("Partition index out of bounds!");
    return [partitionIndex, pivotValue];
  }

  findPartitioningPivot(axis) {
    if (this.endIndex - this.startIndex < this.doNotPartitionSize) return null;

    // Note: find a pivot that is guaranteed to create two partitions, to avoid infinite loops. Otherwise, return null.  
    // For this pivot point, there exists another element that is strictly larger.
    const { dots } = this;
    const candidatePivotIndex = this.startIndex + Math.floor((this.endIndex - this.startIndex)/2); 
    const candiatePivotDot = dots[candidatePivotIndex];
    const candidateValue = candiatePivotDot[axis];

    let low = candidatePivotIndex - 1; 
    let high = candidatePivotIndex + 1;

    while (this.startIndex <= low || high <= this.endIndex) {
      if (this.startIndex <= low) {
        const value = dots[low][axis]; 
        if (candidateValue < value) {
          return candidatePivotIndex; 
        } else if (value < candidateValue) {
          return low;
        }
      } 

      if (high <= this.endIndex) {
        const value = dots[high][axis]; 
        if (candidateValue < value) {
          return candidatePivotIndex; 
        } else if (value < candidateValue) {
          return high;
        }
      }

      high++;
      low--;
    }
    return null; // Impossible to find partitioning pivot! All are equal! 
  }

  circleCollision(centerDot, radius, result=[]) {
    const bounds = this.bounds; 
    const {maxX, minX, maxY, minY} = bounds;

    // Horizontal collision
    let horizontalCollision = false;
    let xPos = centerDot.x; 
    if (minX !== null) {
      if (maxX !== null) {
        horizontalCollision = minX-radius <= xPos && xPos >= maxX+radius;
      } else {
        horizontalCollision = minX-radius <= xPos;
      }
    } else {
      if (maxX !== null) {
        horizontalCollision = xPos >= maxX+radius;
      } else {
        horizontalCollision = true; 
      }
    }

    // Vertial collision
    let verticalCollision = false;
    let yPos = centerDot.y; 
    if (minY !== null) {
      if (maxY !== null) {
        horizontalCollision = minY-radius <= yPos && yPos >= maxY+radius;
      } else {
        horizontalCollision = minY-radius <= yPos;
      }
    } else {
      if (maxY !== null) {
        horizontalCollision = yPos >= maxY+radius;
      } else {
        horizontalCollision = true; 
      }
    }
    
    if (verticalCollision && horizontalCollision) {
      log("Collision!")
      if (this.lowPartition) {
        if (!this.highPartition) throw Error("should always have two partitions!");
        this.lowPartition.circleCollision(centerDot, radius, result);
        this.highPartition.circleCollision(centerDot, radius, result);
      } else {
        this.collideCircleAgainstContent(centerDot, radius, result);
      }
    }

    return result; 
  }

  collideCircleAgainstContent(centerDot, radius, result) {
    let index = this.startIndex;
    const {x, y} = centerDot;
    while(index <= this.endIndex) {
      const otherDot = this.dots[index];
      const dx = Math.abs(x-otherDot.x);
      const dy = Math.abs(y-otherDot.y);
      const distance = Math.sqrt(dx*dx + dy*dy);
      otherDot.distance = distance; 

      if (distance <= radius && otherDot.id < centerDot.id) { // Note: Id check guarantees unique edges.
        result.push(otherDot);
      }
      index++;
    }
  }
}


