import { Command, Option } from "clipanion";

class HelloCommand extends Command {
  static paths = [["hello"]];
  name = Option.String();

  async execute() {
    this.context.stdout.write(`Hello ${this.name}!\n`);
  }
}

module.exports = [HelloCommand];
