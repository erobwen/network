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
}

