import { checkIsRNProject } from "../check-is-rn-project";

describe("checkIsRNProject", () => {
  it("does not throw if the command is launched from a RN project", () => {
    expect(() =>
      checkIsRNProject(
        "./src/commands/setup/add-dependencies/__tests__/fixtures/RNProject"
      )
    ).not.toThrow();
  });
  it("throws if the command is not launched from a RN project", () => {
    expect(() =>
      checkIsRNProject(
        "./src/commands/setup/add-dependencies/__tests__/fixtures/notRNProject"
      )
    ).toThrow();
  });
});
