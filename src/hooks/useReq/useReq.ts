import { useEffect, useRef, SetStateAction, useState } from 'react';

import { ReqStatus } from '../../enums/index.js';

import { IReqConfig, IResponse, TFetchFunction } from '../types/types.js';
import { IStatusObj } from '../../enums/types/types.js';
import useRerender from './utilities/useRerender.js';
import fakeSetState from './utilities/fakeSetState.js';
import race from './utilities/race.js';

interface IInternalData<TReqData, TResData>{
  reqData?: TReqData,
  lastCallTime: number,
  attemptsLeft: number,
  resData: TResData | null
};

function makeReq<TReqData, TResData, IStatus extends IStatusObj>(
  fetchFunction: TFetchFunction<TReqData, TResData>,
  config: IReqConfig<TResData, IStatus> = {},
  StatusObj: IStatusObj,
  internalData: IInternalData<TReqData, TResData>,
  setStatus: React.Dispatch<SetStateAction<number>>,
  callTime: number
) {
  if (callTime < internalData.lastCallTime) {
    return;
  }

  if (!internalData.attemptsLeft) {
    setStatus(StatusObj.TIMEOUT);
    return;
  }

  const { getSuccessStatus, getFailedStatus } = config;
  
  return race([
    fetchFunction(internalData.reqData),
    new Promise<IResponse<TResData>>((_, reject) =>
      setTimeout(() => reject({ status: StatusObj.TIMEOUT }),
      config.timeout || 30000)
    )
  ])
    .then((res) => {
      // In case the hook is called super frequently.
      if (callTime < internalData.lastCallTime) {
        return;
      }

      internalData.resData = config.reducer ? config.reducer(internalData.resData, res.data) : res.data;

      setStatus(getSuccessStatus ? getSuccessStatus(res.data, res) : StatusObj.LOADED);
    })
    .catch((err) => {
      // In case the hook is called super frequently. 
      if (callTime < internalData.lastCallTime) {
        return;
      }

      if (internalData.attemptsLeft > 1) {
        internalData.attemptsLeft -= 1;

        makeReq(fetchFunction, config, StatusObj, internalData, setStatus, callTime);
      } else {
        internalData.attemptsLeft = 0;

        if (err?.status === StatusObj.TIMEOUT) {
          setStatus(StatusObj.TIMEOUT);
        } else {
          setStatus(getFailedStatus ?
            getFailedStatus(err?.response?.status || 500, err?.response) : StatusObj.ERROR
          );
        }
      }
    });
}

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
export default function useReq<TReqData, TResData, IStatus extends IStatusObj = IStatusObj>(fetchFunction: TFetchFunction<TReqData, TResData>, config: IReqConfig<TResData, IStatus> = {}) {
  const rerender = useRerender();

  const StatusObj = config.StatusObj || ReqStatus;
  const [status, setStatus] = useState(
    config.initialStatus || (config.notInstantReq ? StatusObj.INITIALIZED : StatusObj.LOADING)
  );
  
  /**
   * Req and response data.
   * Stored in one place for reducing external api calls.
   */
  const internalData = useRef<IInternalData<TReqData, TResData>>({
      reqData: undefined,
      lastCallTime: 0,
      attemptsLeft: 0,
      resData: config.initialData !== undefined ? config.initialData : null
    });

  const execReq = () => {
    internalData.current.lastCallTime = Date.now();
    internalData.current.attemptsLeft = config.attempts || 1;

    makeReq<TReqData, TResData, IStatus>(fetchFunction, config, StatusObj, internalData.current, setStatus, internalData.current.lastCallTime);
    setStatus(StatusObj.LOADING);
  };

  useEffect(() => {
    if (
      !internalData.current.lastCallTime &&
      !config.notInstantReq &&
      (!config.initialStatus || config.initialStatus === StatusObj.LOADING)
    ) {
      execReq();
    }
  }, [config.initialStatus]);

  return {
    /**
     * Request status.
     */
    status,
    /**
     * Initially equal to config.initialData.
     */
    data: internalData.current.resData,
    /**
     * Function for changing the data stored.
     */
    setData: (input: SetStateAction<TResData>) => {
      // Not using state for resData is intended.
      fakeSetState(input, internalData, 'resData');
  
      rerender();
    },
    /**
     * Function for changing the request body without executing it.
     */
    setReqData: (newReqData: SetStateAction<TReqData>) => {
      fakeSetState(newReqData, internalData, 'reqData');
    },
    /**
     * Function for making the request.
     * Can be used for calling the request several times.
     * @param {TReqData=} data - request body.
     */
    exec: (newReqData?: TReqData) => {
      internalData.current.reqData = newReqData;
      execReq();
    }
  };
}
