import { sum } from "./sum";

describe("sum", () => {
  test("should return the sum of two numbers", () => {
    const result = sum(2, 3);
    expect(result).toBe(5);
  });
});
