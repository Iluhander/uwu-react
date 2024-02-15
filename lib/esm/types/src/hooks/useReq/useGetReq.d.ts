/// <reference types="react" />
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
export default function useGetReq<TReqData, TResData>(fetchFunction: TFetchFunction<TReqData, TResData>, config?: IGetReqConfig<TResData>): {
    status: TSyncGuardResult;
    data: TResData | null;
    setData: (input: import("react").SetStateAction<TResData>) => void;
    setReqData: (newReqData: import("react").SetStateAction<TReqData>) => void;
    exec: (newReqData: TReqData) => void;
};
//# sourceMappingURL=useGetReq.d.ts.map