import events from "events";
import {
  createReadStream,
  createWriteStream,
  PathLike,
  rename as renameWithCallback,
  unlinkSync,
  WriteStream,
} from "fs";
import readline from "readline";
import { EOL } from "os";

export const editFile = async (
  inputFileAbsolutePath: string,
  outputFileAbsolutePath: string,
  editLine: (line: string) => string
) => {
  const tempFileAbsolutePath = `${outputFileAbsolutePath}.tmp`;

  const lineReader = readline.createInterface({
    input: createReadStream(inputFileAbsolutePath),
  });

  try {
    const writer = createWriteStream(tempFileAbsolutePath, { flags: "a" });

    lineReader.on("line", (line) => {
      const newLine = editLine(line);
      writer.write(`${newLine}${EOL}`);
    });

    await events.once(lineReader, "close");
    await asyncCloseWriteStream(writer);

    await rename(tempFileAbsolutePath, outputFileAbsolutePath);
  } catch (error) {
    unlinkSync(tempFileAbsolutePath);
    throw error;
  }
};

export const asyncCloseWriteStream = (stream: WriteStream) => {
  return new Promise<void>((resolve, reject) => {
    stream.close((error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

const rename = (oldPath: PathLike, newPath: PathLike): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    renameWithCallback(oldPath, newPath, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};
