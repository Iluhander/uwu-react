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
export default function useGetReq<T>(fetchFunction: TFetchFunction, config?: IGetReqConfig<T>): {
    status: TSyncGuardResult;
    data: NonNullable<T> | null;
    setData: import("react").Dispatch<import("react").SetStateAction<NonNullable<T> | null>>;
    setReqData: (input: import("react").SetStateAction<T>) => void;
    exec: (data: T) => void;
};
//# sourceMappingURL=useGetReq.d.ts.map