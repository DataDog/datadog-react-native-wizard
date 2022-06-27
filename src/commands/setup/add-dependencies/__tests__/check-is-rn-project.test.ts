import { checkIsRNProject } from "../check-is-rn-project";

describe("checkIsRNProject", () => {
  it("does not throw if the command is launched from a RN project", () => {
    expect(() =>
      checkIsRNProject("./__tests__/fixtures/RNProject")
    ).not.toThrow();
  });
  it("throws if the command is not launched from a RN project", () => {
    expect(() =>
      checkIsRNProject("./__tests__/fixtures/notRNProject")
    ).toThrow();
  });
});
