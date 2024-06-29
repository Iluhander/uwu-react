import { SetStateAction, Dispatch } from 'react';
import { IReqConfig, TFetchFunction } from '../types/types.js';
import { IStatusObj } from '../../enums/types/types.js';
/**
 * Hook for making a request.
 * Also can change the stored data between requests
 *
 * @param {TFetchFunction} fetchFunction - function making the request.
 * @param {IReqConfig} config - request configuration.
 *
 * If the config has field:
 * - "StatusObj", then "StatusObj" is used instead of ReqStatus
 * for request state enum.
 * - "initialData", then resData = "initialData"
 * (before next data fetching the request).
 * - "initialStatus", then initially status = initialStatus.
 * status = "StatusObj".LOADING by default.
 * - "notInstantReq" and it is set to true or "initialStatus" is set to
 * "StatusObj".INITIALIZED, then a request doesn't start without the "exec" call.
 */
export default function useReq<TReqData, TResData, IStatus extends IStatusObj = IStatusObj>(fetchFunction: TFetchFunction<TReqData, TResData>, config?: IReqConfig<TResData, IStatus>): {
    /**
     * Request status.
     */
    status: number;
    /**
     * Function for changin the request status !directly!.
     * If the current status value is StatusObj.LOADING, cancels the execution.
     */
    setStatus: Dispatch<SetStateAction<number>>;
    /**
     * Initially equal to config.initialData.
     */
    data: TResData | null;
    /**
     * Function for changing the data stored.
     */
    setData: Dispatch<SetStateAction<TResData>>;
    /**
     * Function for changing the request body without executing it.
     */
    setReqData: Dispatch<SetStateAction<TReqData>>;
    /**
     * Function for making the request.
     * Can be used for calling the request several times.
     * @param {TReqData=} data - request body.
     */
    exec: (newReqData?: TReqData | undefined) => void;
};
//# sourceMappingURL=useReq.d.ts.map