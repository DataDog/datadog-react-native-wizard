const { diff } = require("jest-diff");
const { readFileSync } = require("fs");

expect.extend({
  toMatchFile(received, expected) {
    var expectedBuffer = readFileSync(expected);
    var receivedBuffer = readFileSync(received);

    if (this.equals(receivedBuffer, expectedBuffer)) {
      return {
        message: () => `File ${receivedBuffer} should NOT match`,
        pass: true,
      };
    } else {
      const diffString = diff(
        expectedBuffer.toString(),
        receivedBuffer.toString(),
        {
          expand: this.expand,
        }
      );

      return {
        message: () => `Received file does not match:\n${diffString}\n`,
        pass: false,
      };
    }
  },
});
