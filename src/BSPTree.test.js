import { expect, test, describe, it } from 'vitest'
import { BSPTree } from "./BSPTree";
import { Dot } from "./Dot";
const log = console.log; 

const config = {
  doNotPartitionSize: 2,
  build: false
}

test('partition odd', () => {
  const dots = [
    new Dot({x: 5, y: 1}),
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 2, y: 1}),
    new Dot({x: 1, y: 1}),
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
  const [pivotIndex, pivotValue] = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(1);
  expect(dots[1].x).toBe(2);
  expect(dots[2].x).toBe(3);
  expect(dots[3].x).toBe(4);
  expect(dots[4].x).toBe(5);
  expect(pivotIndex).toBe(2);
  expect(pivotValue).toBe(3);
})

test('partition even', () => {
  const dots = [
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 2, y: 1}),
    new Dot({x: 1, y: 1}),
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
  const [pivotIndex, _] = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(1);
  expect(dots[1].x).toBe(3);
  expect(dots[2].x).toBe(2);
  expect(dots[3].x).toBe(4);
  expect(pivotIndex).toBe(2);
})

test('partition edge case', () => {
  const dots = [
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1})
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
  const [pivotIndex, _] = bspTree.partition(bspTree);
  expect(dots[0].x).toBe(3);
  expect(dots[1].x).toBe(3);
  expect(dots[2].x).toBe(3);
  expect(dots[3].x).toBe(4);
  expect(pivotIndex).toBe(2);
})

test('off center partition', () => {
  const dots = [
    new Dot({x: 1, y: 1}),
    new Dot({x: 2, y: 1}),
    new Dot({x: 5, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 4, y: 1}),
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
  const result = bspTree.partition(bspTree);
  const [pivotIndex, _] = result;
  expect(dots[0].x).toBe(1);
  expect(dots[1].x).toBe(2);
  expect(dots[2].x).toBe(5);
  expect(dots[3].x).toBe(3);
  expect(dots[4].x).toBe(4);
  expect(pivotIndex).toBe(1);
})

test('test no partition possible', () => {
  const dots = [
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1}),
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, true, null, config);
  const result = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(3);
  expect(dots[1].x).toBe(3);
  expect(dots[2].x).toBe(3);
  expect(dots[3].x).toBe(3);
  expect(dots[4].x).toBe(3);
  expect(result).toBe(null);
})


test('test collision', () => {
  const config = {
    doNotPartitionSize: 2,
    build: false
  }

  const dots = [
    new Dot({x: 5, y: 1}),
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 2, y: 1}),
    new Dot({x: 1, y: 1}),
  ] 
  const limits = {minX: null, maxX: 6, minY: null, maxY: null}; 
  const bspTree = new BSPTree(dots, 0, dots.length-1, true, limits, config);
  const [pivotIndex, pivotValue] = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(1);
  expect(dots[1].x).toBe(2);
  expect(dots[2].x).toBe(3);
  expect(dots[3].x).toBe(4);
  expect(dots[4].x).toBe(5);
  expect(pivotIndex).toBe(2);
  expect(pivotValue).toBe(3);
})
