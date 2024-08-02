
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
    
    if (!bounds) bounds = {lowerLimitX: null, maxX: null, lowerLimitY: null, maxY: null}
    this.bounds = bounds; 
    this.pivotValue = null;
    this.partitionIndex = null;

    this.config = config; 

    if (config.build) this.build();
  }

  build() {
    const {dots, startIndex, endIndex, bounds, horizontal} = this;
    const partitionResult = this.partition();
    if (partitionResult === null) return;

    const [partitionIndex, pivotValue] = partitionResult;
    this.partitionIndex = partitionIndex;
    this.pivotValue = pivotValue; 

    const lowLimitation = horizontal ? {maxX: pivotValue} : {maxY: pivotValue};
    this.lowPartition = new BSPTree(dots, startIndex, partitionIndex, !horizontal, {...bounds, ...lowLimitation}, this.config);
    
    const highLimitation = horizontal ? {lowerLimitX: pivotValue} : {lowerLimitY: pivotValue};
    this.highPartition = new BSPTree(dots, partitionIndex + 1, endIndex, !horizontal, {...bounds, ...highLimitation}, this.config);
  }

  /**
   * Partition
   * 
   * @returns [partitionIndex, pivotValue]
   * 
   * partitionIndex is the last index of the first partition. 
   * all elements in the first partition are <= pivot value. 
   * all elements in teh second partition are > pivot value. 
   */
  partition() {
    // Note: this is a modified version of the Quicksort algorithm. A difference is that strict inequality is guaranteed between the different partitions. 
    const {dots, startIndex, endIndex, horizontal} = this; 
    const axis = horizontal ? "x" : "y";
  
    const pivotIndex = this.findPivot(axis); 
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
  findPivot(axis) {
    if ((this.endIndex - this.startIndex) < this.config.doNotPartitionSize) return null;
    const { dots } = this;
    const candidatePivotIndex = this.startIndex + Math.ceil((this.endIndex - this.startIndex)/2); 
    const candiatePivotDot = dots[candidatePivotIndex];
    const candidateValue = candiatePivotDot[axis];

    let low = candidatePivotIndex - 1; 
    let high = candidatePivotIndex + 1;

    // Note: Search from the candidate index outwards in both directions to find an element smaller or bigger.
    // Note: We can only partition, if we find two dots with different value. 
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
    const {maxX, lowerLimitX, maxY, lowerLimitY} = bounds;

    // Horizontal collision
    let horizontalCollision = false;
    let xPos = centerDot.x; 
    if (lowerLimitX !== null) {
      if (maxX !== null) {
        horizontalCollision = ((lowerLimitX - radius) <= xPos) && (xPos <= (maxX + radius));
      } else {
        horizontalCollision = (lowerLimitX - radius) <= xPos;
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
    if (lowerLimitY !== null) {
      if (maxY !== null) {
        verticalCollision = ((lowerLimitY - radius) <= yPos) && (yPos <= (maxY + radius));
      } else {
        verticalCollision = (lowerLimitY - radius) <= yPos;
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
      if (centerDot.distanceTo(otherDot) <= radius) {
        result.push(otherDot); 
      }
    }
  }

  render(context, strength) {
    context.lineWidth = Math.max(strength, 1);
    context.strokeStyle = 'blue';
    if (this.pivotValue === null) return;

    if (this.horizontal) {
      const topBound = Math.max(0, (this.bounds.lowerLimitY !== null) ? this.bounds.lowerLimitY : 0);
      const bottomBound = Math.min(canvas.height, (this.bounds.maxY !== null) ? this.bounds.maxY : canvas.height);
      context.beginPath();
      context.moveTo(this.pivotValue, topBound);
      context.lineTo(this.pivotValue, bottomBound);
      context.stroke();
    } else {
      const leftBound = Math.max(0, (this.bounds.lowerLimitX !== null) ? this.bounds.lowerLimitX : 0);
      const rightBound = Math.min(canvas.width, (this.bounds.maxX !== null) ? this.bounds.maxX : canvas.width);
      context.beginPath();
      context.moveTo(leftBound, this.pivotValue);
      context.lineTo(rightBound, this.pivotValue);
      context.stroke();
    }

    if (this.lowPartition) {
      this.lowPartition.render(context, strength-1);
    }

    if (this.highPartition) {
      this.highPartition.render(context, strength-1);
    }
  }
}


