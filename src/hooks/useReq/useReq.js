import { useState, useEffect, useRef } from 'react';

import ReqStatus from '../../enums/ReqStatus.js';

/**
 * Hook for making a request.
 * Also can change the stored data between requests
 *
 * @param {Function} fetchFunction - function making the request.
 * @param {Object} config - request configuration.
 *
 * - If the config has field "StatusObj", then "StatusObj" is used instead of ReqStatus
 * for request state enum.
 * - If the config has field initialData, then resData = initialData
 * (before next data fetching the request).
 */
export default function useReq(fetchFunction, config = {}) {
  const { getSuccessStatus, getFailedStatus } = config;
  const StatusObj = config.StatusObj || ReqStatus;
  const initialData = config.initialData || null;

  const reqData = useRef({});

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
          status: getFailedStatus ? getFailedStatus(err.response.status) : StatusObj.ERROR
        }))
      );
  }, [req.id]);

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
    setReqData: (input) => {
      if (typeof input === 'function') {
        reqData.current = input(reqData.current);
      } else {
        reqData.current = input;
      }
    },
    /**
     * Function for making the request.
     * Can be used for calling the request several times.
     * @param {*} data - request body.
     */
    exec: (data) => {
      reqData.current = data;
      execReq();
    }
  };
}
