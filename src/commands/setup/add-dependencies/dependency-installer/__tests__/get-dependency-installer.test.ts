import { getDependencyInstaller } from "../get-dependency-installer";
import { npmDependencyInstaller } from "../npm";
import { yarnDependencyInstaller } from "../yarn";

describe("dependencyInstaller", () => {
  describe("getDependencyInstaller", () => {
    it("returns an npm installer when a package-lock.json is present", () => {
      expect(
        getDependencyInstaller(
          "@datadog/datadog-ci",
          {},
          "./src/commands/setup/add-dependencies/dependency-installer/__tests__/fixtures/npmProject"
        )
      ).toBeInstanceOf(npmDependencyInstaller);
    });

    it("returns an npm installer when a package-lock.json is present", () => {
      expect(
        getDependencyInstaller(
          "@datadog/datadog-ci",
          {},
          "./src/commands/setup/add-dependencies/dependency-installer/__tests__/fixtures/yarnProject"
        )
      ).toBeInstanceOf(yarnDependencyInstaller);
    });
  });
});
