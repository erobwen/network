const log = console.log; 

function swap(array, ia, ib) {
  if (ia === ib) return;
  const a = array[ia];
  array[ia] = array[ib];
  array[ib] = a; 
}

const defaultConfig = {
  doNotPartitionSize: 5,
  build: true
}

export class BSPTree {
  constructor(dots, startIndex, endIndex, horizontal=true, bounds=null, config=defaultConfig) {
    this.horizontal = horizontal;
    this.startIndex = startIndex;
    this.endIndex = endIndex; 
    this.dots = dots; 
    
    if (!bounds) bounds = {minX: null, maxX: null, minY: null, maxY: null}
    this.bounds = bounds; 
    this.pivotValue = null;
    this.pivotIndex = null;

    this.config = config; 

    if (config.build) this.build();
  }

  build() {
    const {dots, startIndex, endIndex, bounds, horizontal} = this; 
  
    const pivotResult = this.partition();
    if (pivotResult === null) return; 

    const [pivotIndex, pivotValue] = pivotResult;
    this.pivotIndex = pivotIndex;
    this.pivotValue = pivotValue; 

    const lowLimitation = horizontal ? {maxX: pivotValue} : {maxY: pivotValue};
    this.lowPartition = new BSPTree(dots, startIndex, pivotIndex, !horizontal, {...bounds, ...lowLimitation});
    
    const highLimitation = horizontal ? {minX: pivotValue + 1} : {minY: pivotValue + 1};
    this.highPartition = new BSPTree(dots, pivotIndex + 1, endIndex, !horizontal, {...bounds, ...highLimitation});
  }

  partition() {
    const {dots, startIndex, endIndex, horizontal} = this; 
    const axis = horizontal ? "x" : "y";
  
    const pivotIndex = this.findPartitioningPivot(axis); 
    if (pivotIndex === null) return null; 
    const pivotValue = dots[pivotIndex][axis];

    let low = startIndex;
    let high = endIndex;
    
    while(low < high) {
      while(dots[low][axis] <= pivotValue && low < endIndex) low++;
      while(dots[high][axis] > pivotValue) high--;
      if (low < high) {
        swap(dots, low, high);
        
        low++;
        high--;
      }
    }
    const partitionIndex = (low === high) ? (dots[low][axis] <= pivotValue ? low : low - 1) : low - 1 
    if (partitionIndex < startIndex || partitionIndex > endIndex) throw new Error("Partition index out of bounds!");
    return [partitionIndex, pivotValue];
  }


  /**
   * Note: find a pivot that is guaranteed to create two partitions, to avoid infinite loops. Otherwise, return null.  
   * For this pivot point, there exists another element that is strictly larger. 
   */
  findPartitioningPivot(axis) {
    if ((this.endIndex - this.startIndex) < this.config.doNotPartitionSize) return null;

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
        horizontalCollision = ((minX - radius) <= xPos) && (xPos <= (maxX + radius));
      } else {
        horizontalCollision = (minX - radius) <= xPos;
      }
    } else {
      if (maxX !== null) {
        horizontalCollision = xPos <= (maxX+radius);
      } else {
        horizontalCollision = true; 
      }
    }

    // Vertial collision
    let verticalCollision = false;
    let yPos = centerDot.y; 
    if (minY !== null) {
      if (maxY !== null) {
        verticalCollision = ((minY - radius) <= yPos) && (yPos <= (maxY + radius));
      } else {
        verticalCollision = (minY - radius) <= yPos;
      }
    } else {
      if (maxY !== null) {
        verticalCollision = yPos <= (maxY + radius);
      } else {
        verticalCollision = true; 
      }
    }
    
    if (verticalCollision && horizontalCollision) {
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
    while(index <= this.endIndex) {
      const otherDot = this.dots[index++];
      if (otherDot === centerDot) continue;
      if (centerDot.distanceTo(otherDot) <= radius && centerDot.id < otherDot.id) { // Note: Id check guarantees unique edges.
        result.push(otherDot); 
      }
    }
  }
}


