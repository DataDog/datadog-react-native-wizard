import { getBin } from "../get-bin";

describe("getBin", () => {
  it("returns the path for an installed command", async () => {
    expect(getBin("node")).resolves.toEqual(expect.any(String));
  });

  it("throws for a not installed command", async () => {
    expect(() =>
      getBin("this_command_does_not_exist_efjkwehjfk")
    ).rejects.toThrow();
  });
});
