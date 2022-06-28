import { Command, Option } from "clipanion";
import { addDependencies } from "./add-dependencies/add-dependencies";
import { changeXCodeBuildPhase } from "./change-xcode-build-phase/change-xcode-build-phase";

export class SetupCommand extends Command {
  static paths = [];
  absoluteProjectPath = Option.String({ required: false });

  async execute() {
    if (!this.absoluteProjectPath) {
      this.absoluteProjectPath = process.cwd();
    }
    await addDependencies(this.absoluteProjectPath);
    await changeXCodeBuildPhase(this.absoluteProjectPath);
  }
}
