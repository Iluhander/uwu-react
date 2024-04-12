import { SetStateAction } from 'react';
import { IReqConfig, TFetchFunction } from '../types/types.js';
import { IStatusObj } from '../../enums/types/types.js';
/**
 * Hook for making a request.
 * Also can change the stored data between requests
 *
 * @param {TFetchFunction} fetchFunction - function making the request.
 * @param {IReqConfig} config - request configuration.
 *
 * - If the config has field "StatusObj", then "StatusObj" is used instead of ReqStatus
 * for request state enum.
 * - If the config has field "initialData", then resData = "initialData"
 * (before next data fetching the request).
 * - If the config has field "initialStatus", then initially status = initialStatus.
 * status = "StatusObj".LOADING by default. If the status value initially differs from
 * "StatusObj".LOADING, then the request doesn't start automatically.
 */
export default function useReq<TReqData, TResData, IStatus extends IStatusObj = IStatusObj>(fetchFunction: TFetchFunction<TReqData, TResData>, config?: IReqConfig<TResData, IStatus>): {
    /**
     * Request status.
     */
    status: number;
    /**
     * Initially equal to config.initialData.
     */
    data: TResData | null;
    /**
     * Function for changing the data stored.
     */
    setData: (input: SetStateAction<TResData>) => void;
    /**
     * Function for changing the request body without executing it.
     */
    setReqData: (newReqData: SetStateAction<TReqData>) => void;
    /**
     * Function for making the request.
     * Can be used for calling the request several times.
     * @param {TReqData=} data - request body.
     */
    exec: (newReqData?: TReqData) => void;
};
//# sourceMappingURL=useReq.d.ts.map