import "../capitalize";

describe("String.prototype.capitalize", () => {
  it("uppercases the first character and keeps the rest", () => {
    expect("hello".capitalize()).toBe("Hello");
  });

  it("returns an empty string when the receiver is empty", () => {
    expect("".capitalize()).toBe("");
  });

  it("is a no-op when the first character is already uppercase", () => {
    expect("Hello".capitalize()).toBe("Hello");
  });
});
