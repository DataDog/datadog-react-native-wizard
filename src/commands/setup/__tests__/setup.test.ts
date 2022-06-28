import { Cli } from "clipanion";
import { SetupCommand } from "../setup";

const makeCli = () => {
  const cli = new Cli();
  cli.register(SetupCommand);

  return cli;
};

describe("Setup command", () => {
  describe("execute", () => {
    it("returns a 0 code", async () => {
      const cli = makeCli();
      const code = await cli.run([
        "./src/commands/setup/__tests__/fixtures/project",
      ]);

      expect(code).toBe(0);
    });
  });
});