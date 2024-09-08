import { isExcluded } from "@sub/group/filter/infer";
import { describe, expect, it } from "vitest";

describe("Infer Country", () => {
  it("", () => {
    const name = "剩余流量：100.00 GB";
    const exclude = isExcluded(name);
    expect(exclude).toBe(true);
  });
});
