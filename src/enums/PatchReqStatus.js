import ReqStatus from './ReqStatus';

/**
 * Enum of PATCH-request state.
 */
export default {
  ...ReqStatus,
  PATCHED: 200,
  NOT_FOUND: 404
};
