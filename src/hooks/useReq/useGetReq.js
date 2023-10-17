import useReq from './useReq';

// Guard Error checking.
import checkGuardErr from '../../enums/checks/checkGuardErr';

/**
 * Hook for making GET request.
 *
 * @param {Function} fetchFunction - function, calling the request.
 * @param {Object} config - request config. If config has method "syncGuard",
 * then "syncGuard" method is called before making a request.
 * If "syncGuard" returns not nullable value, then the request is cancelled with
 * @see {@link checkGuardErr} error.
 */
export default function useGetReq(fetchFunction, config = {}) {
  let syncGuardPassed = true;
  let syncGuardResult;

  if (config.syncGuard) {
    syncGuardResult = config.syncGuard();

    if (syncGuardResult || syncGuardResult === 0) {
      syncGuardPassed = false;
    }
  }

  const useReqResult = useReq(fetchFunction, { ...config, notInstantReq: !syncGuardPassed });

  return {
    ...useReqResult,
    status: !syncGuardPassed ? syncGuardResult : useReqResult.status
  };
}
