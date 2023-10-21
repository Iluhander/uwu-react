import { useState, useEffect, useRef, SetStateAction } from 'react';

import { ReqStatus } from '../../enums/index.js';

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
export default function useReq<TReq, TData>(fetchFunction: TFetchFunction, config: IReqConfig<TReq> = {}) {
  const { getSuccessStatus, getFailedStatus } = config;
  const StatusObj = config.StatusObj || ReqStatus;
  const initialData = config.initialData || null;

  const reqData = useRef<TData | {}>({});

  const [req, setReq] = useState({
    id: 0,
    status: config.notInstantReq ? StatusObj.INITIALIZED : StatusObj.LOADING
  });

  const execReq = () =>
    setReq((prevData) => ({
      status: StatusObj.LOADING,
      id: prevData.id + 1
    }));

  const [resData, setResData] = useState(initialData);

  // TODO?: remove this useEffect.
  useEffect(() => {
    if (!config.notInstantReq) {
      execReq();
    }
  }, [config.notInstantReq]);

  // Checking, should the data be (re)fetched.
  useEffect(() => {
    if (!req.id) {
      return;
    }

    fetchFunction(reqData.current)
      .then(({ data }) => {
        setResData(data);

        setReq((prevData) => ({
          ...prevData,
          status: getSuccessStatus ? getSuccessStatus(data) : StatusObj.LOADED
        }));
      })
      .catch((err) =>
        setReq((prevData) => ({
          ...prevData,
          status: getFailedStatus ? getFailedStatus(err.response?.status || 500) : StatusObj.ERROR
        }))
      );
  }, [req.id]);

  const setReqData = (input: SetStateAction<TData>) => {
    if (typeof input === 'function') {
      reqData.current = (input as (prevData: TData | {}) => TData)(reqData.current);
    } else {
      reqData.current = input;
    }
  }

  return {
    data: resData,
    /**
     * Request status.
     */
    status: req.status,
    /**
     * Function for changing the data stored.
     */
    setData: setResData,
    /**
     * Function for changing the request body without executing it.
     */
    setReqData,
    /**
     * Function for making the request.
     * Can be used for calling the request several times.
     * @param {*} data - request body.
     */
    exec: (data: TData) => {
      reqData.current = data;
      execReq();
    }
  };
}
