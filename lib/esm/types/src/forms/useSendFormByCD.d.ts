import { TFetchFunction } from '../hooks/types/types.js';
import { RefObject } from 'react';
import { ISendFormByCDConfig } from './types/types.js';
/**
 * Makes requests with form data by cool down.
 * @param fetchFunction - called by cool down.
 * @param formRef - reference to form.
 * @param config - config.
 */
export default function useSendFormByCD<T>(fetchFunction: TFetchFunction, formRef: RefObject<HTMLFormElement>, config?: ISendFormByCDConfig<T>): {
    status: number;
    forceSend: (data: T) => void;
};
//# sourceMappingURL=useSendFormByCD.d.ts.map