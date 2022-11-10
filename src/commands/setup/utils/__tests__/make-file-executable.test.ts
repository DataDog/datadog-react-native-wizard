import { exec } from "child_process";
import { chmod } from "fs";
import { makeFileExecutable } from "../make-file-executable";

const execFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    exec(filePath, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

describe("makeFileExecutable", () => {
  beforeEach(async () => {
    // Making sure the fixture file is non executable
    await new Promise<void>((resolve, reject) =>
      chmod(
        "src/commands/setup/utils/__tests__/fixtures/non-executable-scripts/script.sh",
        0o644,
        (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        }
      )
    );
  });

  it("turns a non-executable file into an executable one", async () => {
    expect.assertions(2);

    await expect(
      execFile(
        "src/commands/setup/utils/__tests__/fixtures/non-executable-scripts/script.sh"
      )
    ).rejects.toThrowError("Permission denied");

    await makeFileExecutable(
      "src/commands/setup/utils/__tests__/fixtures/non-executable-scripts/script.sh"
    );

    await expect(
      execFile(
        "src/commands/setup/utils/__tests__/fixtures/non-executable-scripts/script.sh"
      )
    ).resolves.toBe("executed\n");
  });
});
