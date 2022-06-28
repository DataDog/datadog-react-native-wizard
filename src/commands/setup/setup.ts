import { Command, Option } from "clipanion";
import { addDependencies } from "./add-dependencies/add-dependencies";

export class SetupCommand extends Command {
  static paths = [];
  absoluteProjectPath = Option.String({ required: false });

  async execute() {
    if (!this.absoluteProjectPath) {
      this.absoluteProjectPath = process.cwd();
    }
    await addDependencies(this.absoluteProjectPath);
  }
}
