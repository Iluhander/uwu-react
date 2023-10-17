/**
 * Checks, if request handling has finished with success.
 */
const checkSuccessStatus = (val) => val >= 200 && val < 300;

export default checkSuccessStatus;
