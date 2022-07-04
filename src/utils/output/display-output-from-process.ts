import { ChildProcess } from "child_process";
import { Output } from "./interface";

export const displayOutputFromProcess = (
  process: ChildProcess,
  output: Output
) => {
  process.stdout?.on("data", (data) => output.stdout.write(data));
  process.stderr?.on("data", (data) => output.stderr.write(data));
};
