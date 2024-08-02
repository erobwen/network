import { expect, test, describe, it, vi } from 'vitest'
import { Dot } from "./Dot";


/**
 * Test finding partitioning pivot
 */
describe("test dot", () => {
  
  test("distance", () => {
    const a = new Dot({x: 1, y: 1});
    const b = new Dot({x: 11, y: 1});
    expect(a.distanceTo(b)).toBe(10);
  });
});