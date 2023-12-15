import { useState, useEffect, useRef } from 'react';
import { ReqStatus } from '../../enums/index.js';
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
export default function useReq(fetchFunction, config = {}) {
    const { getSuccessStatus, getFailedStatus } = config;
    const StatusObj = config.StatusObj || ReqStatus;
    const reqData = useRef({});
    const [req, setReq] = useState({
        id: 0,
        attemptsLeft: 0,
        status: config.notInstantReq ? StatusObj.INITIALIZED : StatusObj.LOADING
    });
    const execReq = () => setReq((prevData) => ({
        status: StatusObj.LOADING,
        attemptsLeft: config.attempts || 1,
        id: prevData.id + 1
    }));
    const [resData, setResData] = useState(config.initialData !== undefined ? config.initialData : null);
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
        if (!req.attemptsLeft) {
            return;
        }
        Promise.race([
            fetchFunction(reqData.current),
            new Promise((_, reject) => setTimeout(() => reject({ status: StatusObj.TIMEOUT }), config.timeout || 30000))
        ])
            .then(({ data }) => {
            if (!config.reducer) {
                setResData(data);
            }
            else {
                // config.reducer !== undefined here
                // @ts-ignore
                setResData((prevData) => config.reducer(prevData, data));
            }
            setReq((prevData) => ({
                ...prevData,
                status: getSuccessStatus ? getSuccessStatus(data) : StatusObj.LOADED
            }));
        })
            .catch((err) => {
            setReq((prevData) => {
                if (prevData.attemptsLeft > 1) {
                    return {
                        ...prevData,
                        attemptsLeft: prevData.attemptsLeft - 1,
                        id: prevData.id + 1
                    };
                }
                if (err.status === StatusObj.TIMEOUT) {
                    return {
                        ...prevData,
                        attemptsLeft: 0,
                        status: StatusObj.TIMEOUT
                    };
                }
                return {
                    ...prevData,
                    attemptsLeft: 0,
                    status: getFailedStatus ? getFailedStatus(err.response?.status || 500) : StatusObj.ERROR
                };
            });
        });
    }, [req.id]);
    const setReqData = (input) => {
        if (typeof input === 'function') {
            reqData.current = input(reqData.current);
        }
        else {
            reqData.current = input;
        }
    };
    return {
        /**
         * Initially equal to config.initialData.
         */
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
        exec: (data) => {
            reqData.current = data;
            execReq();
        }
    };
}
