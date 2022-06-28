import { Command, Option } from "clipanion";
import { addDependencies } from "./add-dependencies/add-dependencies";

export class SetupCommand extends Command {
  static paths = [];
  projectPath = Option.String({ required: false });

  async execute() {
    if (!this.projectPath) {
      this.projectPath = process.cwd();
    }
    await addDependencies(this.projectPath);
  }
}
