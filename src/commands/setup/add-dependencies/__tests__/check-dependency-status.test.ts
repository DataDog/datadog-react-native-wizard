import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { checkDependencyStatus } from "../check-dependency-status";

describe("checkDependencyStatus", () => {
  it("returns NOT_INSTALLED if dependency is not installed", () => {
    expect(
      checkDependencyStatus("@datadog/datadog-ci", "1.7.3", {
        absoluteProjectPath: getAbsolutePath(
          "/src/commands/setup/add-dependencies/__tests__/fixtures/notRNProject"
        ),
      })
    ).toBe("NOT_INSTALLED");
  });

  it("returns OUTDATED if dependency is outdated", () => {
    expect(
      checkDependencyStatus("@datadog/datadog-ci", "1.7.3", {
        absoluteProjectPath: getAbsolutePath(
          "./src/commands/setup/add-dependencies/__tests__/fixtures/RNProject"
        ),
      })
    ).toBe("OUTDATED");
  });

  it("returns OK if dependency is minVersion", () => {
    expect(
      checkDependencyStatus("@datadog/datadog-ci", "1.7.2", {
        absoluteProjectPath: getAbsolutePath(
          "./src/commands/setup/add-dependencies/__tests__/fixtures/RNProject"
        ),
      })
    ).toBe("OK");
  });

  it("returns OK if dependency is higher than minVersion", () => {
    expect(
      checkDependencyStatus("@datadog/datadog-ci", "1.7.0", {
        absoluteProjectPath: getAbsolutePath(
          "./src/commands/setup/add-dependencies/__tests__/fixtures/RNProject"
        ),
      })
    ).toBe("OK");
  });
});
