import { exec } from "child_process";
import { EOL } from "os";

export const getBin = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`which -a ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stdout) {
        // Because yarn adds a temp path in the user path, we have to remove it
        // e.g. /var/folders/34/_7q54_lx4nl1cvkjwr3_k4lw0000gq/T/yarn--1656510083555-0.9818920348655578/yarn
        const paths = stdout.split(EOL);
        const goodPath = paths.find((path) => !path.match("yarn--"));
        if (goodPath === undefined) {
          reject(`Command ${command} is not in path`);
          return;
        }
        resolve(goodPath);
      }
      if (stderr) {
        reject(stderr);
      }
    });
  });
};
