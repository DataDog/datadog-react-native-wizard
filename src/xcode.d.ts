declare module "xcode" {
  export function project(path: string): {
    parse(callback: (error?: unknown) => void): void;

    addBuildPhase(
      filePathsArray: string[],
      buildPhaseType: "PBXCopyFilesBuildPhase" | "PBXShellScriptBuildPhase",
      comment: string,
      target: unknown,
      optionsOrFolderType: {
        shellScript: string;
      },
      subfolderPath?: unknown
    ): { uuid: string; buildPhase: unknown };

    writeSync(): string;

    filepath: string;
  };
}
