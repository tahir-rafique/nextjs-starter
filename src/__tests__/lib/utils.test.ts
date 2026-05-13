import {
  capitalize,
  cn,
  formatCurrency,
  formatNumber,
  generateInitials,
  groupBy,
  omit,
  pick,
  slugify,
  truncate,
  uniqueBy,
} from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => expect(cn("a", "b")).toBe("a b"));
  it("resolves Tailwind conflicts", () =>
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4"));
  it("handles conditional classes", () =>
    expect(cn("base", false && "skip", "keep")).toBe("base keep"));
});

describe("capitalize()", () => {
  it("capitalises the first letter", () => expect(capitalize("hello")).toBe("Hello"));
  it("lowercases the rest", () => expect(capitalize("hELLO")).toBe("Hello"));
});

describe("truncate()", () => {
  it("truncates long strings", () => expect(truncate("hello world", 5)).toBe("hello…"));
  it("does not truncate short strings", () =>
    expect(truncate("hi", 5)).toBe("hi"));
});

describe("slugify()", () => {
  it("converts spaces to hyphens", () =>
    expect(slugify("Hello World")).toBe("hello-world"));
  it("removes special characters", () =>
    expect(slugify("Hello, World!")).toBe("hello-world"));
});

describe("generateInitials()", () => {
  it("returns two initials", () =>
    expect(generateInitials("John Doe")).toBe("JD"));
  it("handles single name", () =>
    expect(generateInitials("John")).toBe("J"));
});

describe("formatNumber()", () => {
  it("formats with commas", () =>
    expect(formatNumber(1_234_567)).toBe("1,234,567"));
});

describe("formatCurrency()", () => {
  it("formats USD", () =>
    expect(formatCurrency(1234.5)).toBe("$1,234.50"));
});

describe("omit()", () => {
  it("removes specified keys", () =>
    expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 }));
});

describe("pick()", () => {
  it("keeps only specified keys", () =>
    expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 }));
});

describe("uniqueBy()", () => {
  it("deduplicates by key", () => {
    const arr = [{ id: 1, v: "a" }, { id: 1, v: "b" }, { id: 2, v: "c" }];
    expect(uniqueBy(arr, "id")).toHaveLength(2);
  });
});

describe("groupBy()", () => {
  it("groups items by key", () => {
    const arr = [{ role: "admin" }, { role: "user" }, { role: "admin" }];
    const grouped = groupBy(arr, "role");
    expect(grouped.admin).toHaveLength(2);
    expect(grouped.user).toHaveLength(1);
  });
});
