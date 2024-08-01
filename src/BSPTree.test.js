import { expect, test, describe, it } from 'vitest'
import { BSPTree } from "./BSPTree";
import { Dot } from "./Dot";
const log = console.log; 

test('partition odd', () => {
  const dots = [
    new Dot({x: 5, y: 1}),
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 2, y: 1}),
    new Dot({x: 1, y: 1}),
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, null, true, false);
  bspTree.doNotPartitionSize = 3;
  const [pivotIndex, _] = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(1);
  expect(dots[1].x).toBe(2);
  expect(dots[2].x).toBe(3);
  expect(dots[3].x).toBe(4);
  expect(dots[4].x).toBe(5);
  console.log("result: " + pivotIndex)
  expect(pivotIndex).toBe(2);
})

test('partition even', () => {
  const dots = [
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 2, y: 1}),
    new Dot({x: 1, y: 1}),
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, null, true, false);
  bspTree.doNotPartitionSize = 3;
  const [pivotIndex, _] = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(1);
  expect(dots[1].x).toBe(3);
  expect(dots[2].x).toBe(2);
  expect(dots[3].x).toBe(4);
  console.log("result: " + pivotIndex)
  expect(pivotIndex).toBe(2);
})

test('partition edge case', () => {
  const dots = [
    new Dot({x: 4, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1}),
    new Dot({x: 3, y: 1})
  ] 
  const bspTree = new BSPTree(dots, 0, dots.length-1, null, true, false);
  bspTree.doNotPartitionSize = 3;
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
  const bspTree = new BSPTree(dots, 0, dots.length-1, null, true, false);
  bspTree.doNotPartitionSize = 3;
  const result = bspTree.partition(bspTree)
  log(result);
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
  const bspTree = new BSPTree(dots, 0, dots.length-1, null, true, false);
  bspTree.doNotPartitionSize = 3;
  const pivotIndex = bspTree.partition(bspTree)
  expect(dots[0].x).toBe(3);
  expect(dots[1].x).toBe(3);
  expect(dots[2].x).toBe(3);
  expect(dots[3].x).toBe(3);
  expect(dots[4].x).toBe(3);
  expect(pivotIndex).toBe(null);
})

