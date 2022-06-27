import { ReactNativeProjectError } from "../errors";
import { checkIsRNProject } from "./check-is-rn-project";

/**
 * This adds the following dependencies:
 * - @datadog/datadog-ci
 *
 * If the dependencies version is too old, they are upgraded
 *
 * @throws error if not in RN Project
 */
export const addDependencies = () => {
  checkIsRNProject();
};
