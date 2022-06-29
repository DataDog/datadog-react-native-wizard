import events from "events";
import { createReadStream, createWriteStream, rename, unlinkSync } from "fs";
import readline from "readline";
import { EOL } from "os";

export const editFile = async (
  inputFileAbsolutePath: string,
  outputFileAbsolutePath: string,
  editLine: (line: string) => string
) => {
  // TODO: if same, create temp and copy

  const lineReader = readline.createInterface({
    input: createReadStream(inputFileAbsolutePath),
  });

  try {
    const writer = createWriteStream(outputFileAbsolutePath, { flags: "a" });

    lineReader.on("line", (line) => {
      const newLine = editLine(line);
      writer.write(`${newLine}${EOL}`);
    });

    await events.once(lineReader, "close");
  } catch (error) {
    unlinkSync(outputFileAbsolutePath);
    throw error;
  }
};
