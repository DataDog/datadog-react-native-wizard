import {
  formatDependencyVersion,
  isPackageVersionOver,
} from "../get-rn-version";

describe("get package version", () => {
  describe("isPackageVersionOver", () => {
    it.each([
      [true, "major is higher", "2.0.0", "1.2.2"],
      [false, "major is lower", "0.3.3", "1.2.2"],
      [true, "major equal, minor is higher", "1.3.0", "1.2.2"],
      [false, "major equal, minor is lower", "1.1.3", "1.2.2"],
      [true, "major and minor equal, patch is higher", "1.2.3", "1.2.2"],
      [false, "major and minor equal, patch is lower", "1.2.1", "1.2.2"],
      [true, "major and minor equal, patch is equal", "1.2.2", "1.2.2"],
      [
        false,
        "major, minor and patch equal, version is RC",
        "1.2.2-rc6",
        "1.2.2",
      ],
      [true, "major, minor and patch equal, limit is RC", "1.2.2", "1.2.2-rc6"],
      [
        true,
        "major, minor and patch equal, RC is higher",
        "1.2.2-rc7",
        "1.2.2-rc6",
      ],
      [
        true,
        "major, minor and patch equal, RC is equal",
        "1.2.2-rc6",
        "1.2.2-rc6",
      ],
      [
        false,
        "major, minor and patch equal, RC is lower",
        "1.2.2-rc5",
        "1.2.2-rc6",
      ],
    ])(
      "returns %p when %s",
      (expected, description, packageVersion, limitVersion) => {
        const formattedPackageVersion = formatDependencyVersion(packageVersion);
        expect(
          isPackageVersionOver(formattedPackageVersion, limitVersion)
        ).toBe(expected);
      }
    );
  });
});
