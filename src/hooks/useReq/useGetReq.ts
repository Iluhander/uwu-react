import useReq from './useReq.js';

// Guard Error checking.
import checkGuardErr from '../../enums/checks/checkGuardErr.js';
import { IGetReqConfig, TFetchFunction, TSyncGuardResult } from '../types/types.js';

/**
 * Hook for making GET request.
 *
 * @param {TFetchFunction} fetchFunction - function, calling the request.
 * @param {IGetReqConfig} config - request config. If config has method "syncGuard",
 * then "syncGuard" method is called before making a request.
 * If "syncGuard" returns not nullable value, then the request is cancelled with
 * @see {@link checkGuardErr} error.
 */
export default function useGetReq<TReqData, TResData>(fetchFunction: TFetchFunction<TReqData, TResData>, config: IGetReqConfig<TResData> = {}) {
  let syncGuardPassed = true;
  let syncGuardResult: TSyncGuardResult;

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
