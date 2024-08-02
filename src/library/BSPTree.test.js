import { expect, test, describe, it, vi } from 'vitest'
import { BSPTree } from "./BSPTree";
import { Dot } from "../model/Dot";


/**
 * Test finding partitioning pivot
 */
describe("test finding partitioning pivot", () => {
  
  const config = {
    doNotPartitionSize: 2,
    build: false
  }

  test("basic case", () => {
    const dots = [
      new Dot({x: 1, y: 0}),
      new Dot({x: 2, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 4, y: 0}),
      new Dot({x: 5, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(1);
  });

  test("basic reverse case", () => {
    const dots = [
      new Dot({x: 5, y: 0}),
      new Dot({x: 4, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 2, y: 0}),
      new Dot({x: 1, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(2);
  });

  test("too few dots to partition", () => {
    const dots = [
      new Dot({x: 5, y: 0})
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(null);
  });

  test("all the same, not possible to partition", () => {
    const dots = [
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(null);
  });

  test("find pivot in strange place 1", () => {
    const dots = [
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 4, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(4);
  });

  test("find pivot in strange place 2", () => {
    const dots = [
      new Dot({x: 4, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 5, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(0);
  });  
  
  test("reverse even", () => {
    const dots = [
      new Dot({x: 4, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 2, y: 0}),
      new Dot({x: 1, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const pivot = bspTree.findPivot("x");
    expect(pivot).toBe(2);
  });
})


/**
 * Test single step partitioning
 */
describe("test single step partitioning", () => {
    
  const config = {
    doNotPartitionSize: 2,
    build: false
  }

  test('partition odd', () => {
    const dots = [
      new Dot({x: 5, y: 0}),
      new Dot({x: 4, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 2, y: 0}),
      new Dot({x: 1, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const [partitionIndex, pivotValue] = bspTree.partition(bspTree)
    expect(dots[0].x).toBe(1);
    expect(dots[1].x).toBe(2);
    expect(dots[2].x).toBe(3);
    expect(dots[3].x).toBe(4);
    expect(dots[4].x).toBe(5);
    expect(partitionIndex).toBe(2);
    expect(pivotValue).toBe(3);
  })
  
  test('partition even', () => {
    const dots = [
      new Dot({x: 4, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 2, y: 0}),
      new Dot({x: 1, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const [partitionIndex, pivotValue] = bspTree.partition(bspTree)
    expect(dots[0].x).toBe(1);
    expect(dots[1].x).toBe(2);
    expect(dots[2].x).toBe(3);
    expect(dots[3].x).toBe(4);
    expect(partitionIndex).toBe(1);
    expect(pivotValue).toBe(2);
  })
  
  test('partition edge case', () => {
    const dots = [
      new Dot({x: 4, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 3, y: 0})
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const [partitionIndex, pivotValue] = bspTree.partition(bspTree);
    expect(dots[0].x).toBe(3);
    expect(dots[1].x).toBe(3);
    expect(dots[2].x).toBe(3);
    expect(dots[3].x).toBe(4);
    expect(partitionIndex).toBe(2);
    expect(pivotValue).toBe(3);
  })
  
  test('off center partition', () => {
    const dots = [
      new Dot({x: 1, y: 0}),
      new Dot({x: 2, y: 0}),
      new Dot({x: 5, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 4, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const result = bspTree.partition(bspTree);
    const [partitionIndex, pivotValue] = result;
    expect(dots[0].x).toBe(1);
    expect(dots[1].x).toBe(2);
    expect(dots[2].x).toBe(5);
    expect(dots[3].x).toBe(3);
    expect(dots[4].x).toBe(4);
    expect(partitionIndex).toBe(1);
    expect(pivotValue).toBe(2);
  })
  
  test('test no partition possible', () => {
    const dots = [
      new Dot({x: 3, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 3, y: 0}),
      new Dot({x: 3, y: 0}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
    const result = bspTree.partition(bspTree);
    expect(dots[0].x).toBe(3);
    expect(dots[1].x).toBe(3);
    expect(dots[2].x).toBe(3);
    expect(dots[3].x).toBe(3);
    expect(dots[4].x).toBe(3);
    expect(result).toBe(null);
  })  
})


/**
 * Test single step partitioning
 */
describe("test bounds generation", () => {
    
  const config = {
    doNotPartitionSize: 2,
    build: true
  }

  test('three leaf partitions', () => {
    const dots = [
      new Dot({x: 5, y: 5}),
      new Dot({x: 4, y: 4}),
      new Dot({x: 3, y: 3}),
      new Dot({x: 2, y: 2}),
      new Dot({x: 1, y: 1}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);

    expect(dots[0].x).toBe(1);
    expect(dots[1].x).toBe(2);
    expect(dots[2].x).toBe(3);
    expect(dots[3].x).toBe(4);
    expect(dots[4].x).toBe(5);
    expect(bspTree.partitionIndex).toBe(2);
    expect(bspTree.pivotValue).toBe(3);

    expect(bspTree.lowPartition.bounds.lowerLimitX).toBe(null);
    expect(bspTree.lowPartition.bounds.maxX).toBe(3);
    expect(bspTree.lowPartition.bounds.lowerLimitY).toBe(null);
    expect(bspTree.lowPartition.bounds.maxY).toBe(null);

    expect(bspTree.lowPartition.lowPartition.bounds.lowerLimitX).toBe(null);
    expect(bspTree.lowPartition.lowPartition.bounds.maxX).toBe(3);
    expect(bspTree.lowPartition.lowPartition.bounds.lowerLimitY).toBe(null);
    expect(bspTree.lowPartition.lowPartition.bounds.maxY).toBe(1);   
    
    expect(bspTree.lowPartition.highPartition.bounds.lowerLimitX).toBe(null);
    expect(bspTree.lowPartition.highPartition.bounds.maxX).toBe(3);
    expect(bspTree.lowPartition.highPartition.bounds.lowerLimitY).toBe(1);
    expect(bspTree.lowPartition.highPartition.bounds.maxY).toBe(null);

    expect(bspTree.highPartition.bounds.lowerLimitX).toBe(3);
    expect(bspTree.highPartition.bounds.maxX).toBe(null);
    expect(bspTree.highPartition.bounds.lowerLimitY).toBe(null);
    expect(bspTree.highPartition.bounds.maxY).toBe(null);
  })
});
  

/**
 * Test collision
 */
describe('test collision', () => {  
  const config = {
    doNotPartitionSize: 2,
    build: true
  }

  test('collide far to the right, should only hit one leaf partition', () => {
    const dots = [
      new Dot({x: 5, y: 5}),
      new Dot({x: 4, y: 4}),
      new Dot({x: 3, y: 3}),
      new Dot({x: 2, y: 2}),
      new Dot({x: 1, y: 1}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);

    const topLeftSpy = vi.spyOn(bspTree.lowPartition.lowPartition, "circleCollision");
    const bottomLeftSpy = vi.spyOn(bspTree.lowPartition.highPartition, "circleCollision");
    const rightSpy = vi.spyOn(bspTree.highPartition, "circleCollision");

    const result = bspTree.circleCollision(new Dot({x:9, y: 5}), 5);
    expect(result.length).toBe(1);
    expect(result[0].x).toBe(5);
    expect(result[0].y).toBe(5);
    expect(topLeftSpy).toHaveBeenCalledTimes(0);
    expect(bottomLeftSpy).toHaveBeenCalledTimes(0);
    expect(rightSpy).toHaveBeenCalledTimes(1);
  })

  test('collide top left', () => {
    const dots = [
      new Dot({x: 5, y: 5}),
      new Dot({x: 4, y: 4}),
      new Dot({x: 3, y: 3}),
      new Dot({x: 2, y: 2}),
      new Dot({x: 1, y: 1}),
    ] 
    const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);

    const topLeftSpy = vi.spyOn(bspTree.lowPartition.lowPartition, "circleCollision");
    const bottomLeftSpy = vi.spyOn(bspTree.lowPartition.highPartition, "circleCollision");
    const rightSpy = vi.spyOn(bspTree.highPartition, "circleCollision");
    const rightSpyContent = vi.spyOn(bspTree.highPartition, "collideCircleAgainstContent");
    
    const result = bspTree.circleCollision(new Dot({x:1.5, y: 1.5}), 1)

    expect(result.length).toBe(2);
    expect(result[0].x).toBe(1);
    expect(result[0].y).toBe(1);
    expect(result[1].x).toBe(2);
    expect(result[1].y).toBe(2);
    expect(topLeftSpy).toHaveBeenCalledTimes(1);
    expect(bottomLeftSpy).toHaveBeenCalledTimes(1);
    expect(rightSpy).toHaveBeenCalledTimes(1);
    expect(rightSpyContent).toHaveBeenCalledTimes(0);
  })
})
