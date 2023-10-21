/**
 * Checks, if the status is related to guard's error.
 */
const checkGuardErr = (val: number) => val >= 450 && val < 500;

export default checkGuardErr;
