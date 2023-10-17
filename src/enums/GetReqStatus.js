import ReqStatus from './ReqStatus.js';

/**
 * Enum of GET-request state.
 */
export default {
  ...ReqStatus,
  GUARD_NOT_AUTHENTICATED: 451,
  GUARD_NOT_AUTHORIZED: 453
};
