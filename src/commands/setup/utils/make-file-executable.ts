import { chmod } from "fs";

export const makeFileExecutable = (absoluteFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chmod(absoluteFilePath, 0o755, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};
