import { WriteStream } from "tty";

export type Output = {
  stdout: WriteStream;
  stderr: WriteStream;
};
