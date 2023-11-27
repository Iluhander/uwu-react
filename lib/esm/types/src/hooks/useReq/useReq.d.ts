import { SetStateAction } from 'react';
import { IReqConfig, TFetchFunction } from '../types/types.js';
/**
 * Hook for making a request.
 * Also can change the stored data between requests
 *
 * @param {TFetchFunction} fetchFunction - function making the request.
 * @param {IReqConfig} config - request configuration.
 *
 * - If the config has field "StatusObj", then "StatusObj" is used instead of ReqStatus
 * for request state enum.
 * - If the config has field initialData, then resData = initialData
 * (before next data fetching the request).
 */
export default function useReq<TData>(fetchFunction: TFetchFunction, config?: IReqConfig<TData>): {
    data: NonNullable<TData> | null;
    /**
     * Request status.
     */
    status: number;
    /**
     * Function for changing the data stored.
     */
    setData: import("react").Dispatch<SetStateAction<NonNullable<TData> | null>>;
    /**
     * Function for changing the request body without executing it.
     */
    setReqData: (input: SetStateAction<TData>) => void;
    /**
     * Function for making the request.
     * Can be used for calling the request several times.
     * @param {*} data - request body.
     */
    exec: (data: TData) => void;
};
//# sourceMappingURL=useReq.d.ts.map