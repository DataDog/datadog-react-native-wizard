import { exec } from "child_process";

export const getBin = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`which ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stdout) {
        resolve(stdout);
      }
      if (stderr) {
        reject(stderr);
      }
    });
  });
};
