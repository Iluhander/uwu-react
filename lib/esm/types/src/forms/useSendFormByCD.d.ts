import { RefObject } from 'react';
import { TFetchFunction } from '../hooks/types/types.js';
import { ISendFormByCDConfig } from './types/types.js';
/**
 * Makes requests with form data by cool down.
 * @param fetchFunction - called by cool down.
 * @param formRef - reference to form.
 * @param config - config.
 */
export default function useSendFormByCD<TReqData, TResData>(fetchFunction: TFetchFunction<TReqData, TResData>, formRef: RefObject<HTMLFormElement>, config?: ISendFormByCDConfig<TReqData>): {
    status: number;
    stopUpdating: () => void;
    restartUpdating: () => void;
    forceUpdate: () => void;
};
//# sourceMappingURL=useSendFormByCD.d.ts.map