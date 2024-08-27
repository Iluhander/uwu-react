import { useEffect, useRef, useState } from 'react';
import { ReqStatus } from '../../enums/index.js';
import useRerender from './utilities/useRerender.js';
import fakeSetState from './utilities/fakeSetState.js';
import race from './utilities/race.js';
;
function makeReq(fetchFunction, config = {}, StatusObj, internalData, setStatus, callTime) {
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
        new Promise((_, reject) => setTimeout(() => reject({ status: StatusObj.TIMEOUT }), config.timeout || 30000))
    ])
        .then((res) => {
        // In case the hook is called super frequently.
        if (callTime < internalData.lastCallTime) {
            return;
        }
        setTimeout(() => {
            let applied = false;
            setStatus((curStatus) => {
                if (curStatus === StatusObj.LOADING) {
                    if (!applied) {
                        internalData.resData = config.reducer ? config.reducer(internalData.resData, res.data) : res.data;
                        applied = true;
                    }
                    return getSuccessStatus ? getSuccessStatus(res.data, res) : StatusObj.LOADED;
                }
                return curStatus;
            });
        }, 0);
    })
        .catch((err) => {
        // In case the hook is called super frequently. 
        if (callTime < internalData.lastCallTime) {
            return;
        }
        if (internalData.attemptsLeft > 1) {
            internalData.attemptsLeft -= 1;
            makeReq(fetchFunction, config, StatusObj, internalData, setStatus, callTime);
        }
        else {
            internalData.attemptsLeft = 0;
            if (err?.status === StatusObj.TIMEOUT) {
                setStatus(StatusObj.TIMEOUT);
            }
            else {
                setStatus(getFailedStatus ?
                    getFailedStatus(err?.response?.status || 500, err?.response) : StatusObj.ERROR);
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
export default function useReq(fetchFunction, config = {}) {
    const rerender = useRerender();
    const StatusObj = config.StatusObj || ReqStatus;
    const [status, setStatus] = useState(config.initialStatus || (config.notInstantReq ? StatusObj.INITIALIZED : StatusObj.LOADING));
    /**
     * Req and response data.
     * Stored in one place for reducing external api calls.
     */
    const internalData = useRef({
        reqData: undefined,
        lastCallTime: 0,
        attemptsLeft: 0,
        resData: config.initialData !== undefined ? config.initialData : null,
        setData: (input) => {
            fakeSetState(input, internalData, 'resData');
            rerender();
        },
        setReqData: (newReqData) => {
            fakeSetState(newReqData, internalData, 'reqData');
        },
        exec: (newReqData) => {
            internalData.current.lastCallTime = Date.now();
            setTimeout(() => {
                if (config.debounce && (Date.now() - internalData.current.lastCallTime < config.debounce)) {
                    return;
                }
                internalData.current.reqData = newReqData;
                execReq();
            }, config.debounce || 0);
        }
    });
    const execReq = () => {
        internalData.current.lastCallTime = Date.now();
        internalData.current.attemptsLeft = config.attempts || 1;
        makeReq(fetchFunction, config, StatusObj, internalData.current, setStatus, internalData.current.lastCallTime);
        setStatus(StatusObj.LOADING);
    };
    useEffect(() => {
        if (!internalData.current.lastCallTime &&
            !config.notInstantReq &&
            (!config.initialStatus || config.initialStatus === StatusObj.LOADING)) {
            execReq();
        }
    }, [config.initialStatus]);
    return {
        /**
         * Request status.
         */
        status,
        /**
         * Function for changing the request status !directly!.
         * If the current status value is StatusObj.LOADING, cancels the execution.
         */
        setStatus,
        /**
         * Initially equal to config.initialData.
         */
        data: internalData.current.resData,
        /**
         * Function for changing the data stored.
         */
        setData: internalData.current.setData,
        /**
         * Function for changing the request body without executing it.
         */
        setReqData: internalData.current.setReqData,
        /**
         * Function for making the request.
         * Can be used for calling the request several times.
         * @param {TReqData=} data - request body.
         */
        exec: internalData.current.exec,
    };
}
